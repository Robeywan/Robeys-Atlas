/* Offline support for the public Atlas. Saved entries stay in the site's existing localStorage. */
'use strict';

const scope = new URL(self.registration.scope);
const cachePrefix = 'robeys-atlas-pwa:' + scope.href + ':';
const shellCache = cachePrefix + 'shell-v3';
const pageCache = cachePrefix + 'pages-v1';
const assetCache = cachePrefix + 'assets-v1';
const activeCaches = new Set([shellCache, pageCache, assetCache]);
const coreFiles = [
  'offline.html', 'offline.js', 'install/', 'pwa-install.js', 'pwa-install.css',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png',
  'manifest.webmanifest', 'favicon.svg', 'styles.css', 'app.js', 'map.js',
  'directory-cards.css', 'profile-visuals.css', 'assets/header-navigation.css',
  'assets/site-color-theme.css', 'assets/generated-background.css',
  'assets/language-map-feature.css', 'assets/source-accessibility.css',
  'assets/robeys-atlas-header-emblem.jpg'
];
const corePaths = new Set(coreFiles.map(path => new URL(path, scope).pathname));
const MiB = 1024 * 1024;
const limits = {
  [pageCache]: {count: 14, perFile: 6 * MiB, total: 18 * MiB},
  [assetCache]: {count: 64, perFile: 2 * MiB, total: 16 * MiB}
};

self.addEventListener('install', event => {
  // Let the browser activate an update when readers leave the old version.
  event.waitUntil(caches.open(shellCache).then(cache =>
    cache.addAll(coreFiles.map(path => new Request(new URL(path, scope), {cache: 'reload'})))
  ));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith(cachePrefix) && !activeCaches.has(name))
      .map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

function relativePath(url) {
  if (url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return null;
  return url.pathname.slice(scope.pathname.length);
}

function researchPage(url) {
  const path = relativePath(url);
  return path !== null && (path === '' || path === 'index.html' ||
    /^(?:nations|regions|sources|about|historical-maps|language-map|reading-leads|studies|study-guides)\/(?:[\w%.-]+\/)*(?:index\.html)?$/u.test(path));
}

function localAsset(url) {
  const path = relativePath(url);
  if (!path || url.username || url.password) return false;
  if (corePaths.has(url.pathname)) return !['offline.html','install/'].includes(path);
  return path === 'historical-maps.js' ||
    /^(?:assets|icons)\/[\w%./-]+\.(?:css|js|svg|png|jpe?g|webp|avif|woff2?)$/i.test(path);
}

function exactURL(value) {
  const url = new URL(value, scope);
  url.hash = '';
  return url;
}

function publicResponse(response, url) {
  return response.status === 200 && response.type === 'basic' && !response.redirected &&
    response.url === url.href &&
    !/(?:^|,)\s*(?:no-store|private)\b/i.test(response.headers.get('Cache-Control') || '') &&
    !(response.headers.get('Vary') || '').split(',').some(header =>
      header.trim() && header.trim().toLowerCase() !== 'accept-encoding'
    );
}

// Cap decoded bytes even when the host omits Content-Length or uses compression.
async function readWithinLimit(response, max) {
  if (!response.body || Number(response.headers.get('Content-Length')) > max) return null;
  const reader = response.body.getReader();
  const chunks = [];
  let size = 0;
  while (true) {
    const {value, done} = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > max) {
      reader.cancel().catch(() => {});
      return null;
    }
    chunks.push(value);
  }
  return new Blob(chunks);
}

function titleFromMarkup(text) {
  const title = /<title\b[^>]*>([\s\S]*?)<\/title>/i.exec(text)?.[1] || '';
  const entities = {amp:'&', lt:'<', gt:'>', quot:'"', apos:"'", '#39':"'"};
  return title.split(' · ')[0].replace(/&(amp|lt|gt|quot|apos|#39);/g, (_, key) => entities[key])
    .replace(/\s+/g, ' ').trim().slice(0, 200);
}

let writeQueue = Promise.resolve();
function serializeWrite(task) {
  const result = writeQueue.then(task);
  writeQueue = result.catch(() => {});
  return result;
}

const indexes = new Map();
async function indexFor(name, cache) {
  if (indexes.has(name)) return indexes.get(name);
  const entries = new Map();
  for (const request of await cache.keys()) {
    const response = await cache.match(request);
    if (response) entries.set(request.url, Number(response.headers.get('X-Atlas-Stored-Bytes')) || 0);
  }
  indexes.set(name, entries);
  return entries;
}

async function storeBounded(name, url, body, headers) {
  const cache = await caches.open(name);
  const index = await indexFor(name, cache);
  const previous = index.get(url.href) || 0;
  let total = [...index.values()].reduce((sum, size) => sum + size, 0) - previous + body.size;
  const budget = limits[name];
  // Make room before put: storage pressure must never prevent an online page loading.
  for (const [key, size] of index) {
    const predictedCount = index.size + (index.has(url.href) ? 0 : 1);
    if (predictedCount <= budget.count && total <= budget.total) break;
    if (key !== url.href) {
      await cache.delete(key);
      index.delete(key);
      total -= size;
    }
  }
  await cache.put(url.href, new Response(body, {headers}));
  index.delete(url.href);
  index.set(url.href, body.size);
}

async function remember(response, url, isPage) {
  if (!publicResponse(response, url)) return;
  const type = response.headers.get('Content-Type') || '';
  if (isPage ? !/^text\/html\b/i.test(type) : /^text\/html\b/i.test(type)) return;
  const name = isPage ? pageCache : assetCache;
  const body = await readWithinLimit(response, limits[name].perFile);
  if (!body || !body.size) return;
  const headers = new Headers(response.headers);
  headers.delete('Content-Encoding');
  headers.delete('Content-Length');
  headers.delete('Vary');
  headers.set('X-Atlas-Stored-Bytes', String(body.size));
  if (isPage) {
    const title = titleFromMarkup(await body.slice(0, 16384).text());
    if (title) headers.set('X-Atlas-Page-Title', encodeURIComponent(title));
  }
  const coreAsset = !isPage && corePaths.has(url.pathname) &&
    [...url.searchParams.keys()].every(key => key === 'v');
  if (coreAsset) {
    // A stylesheet/script query is a version token on this static site.
    const shell = await caches.open(shellCache);
    await shell.put(new URL(url.pathname, scope).href, new Response(body, {headers}));
  } else {
    await serializeWrite(() => storeBounded(name, url, body, headers));
  }
}

async function lookup(url, isPage) {
  const name = isPage ? pageCache : assetCache;
  let response = await (await caches.open(name)).match(url.href);
  if (!response && corePaths.has(url.pathname) && [...url.searchParams.keys()].every(key => key === 'v')) {
    response = await (await caches.open(shellCache)).match(new URL(url.pathname, scope).href);
  }
  return response;
}

function networkRequest(request) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  const promise = fetch(request, {cache: 'no-cache', signal: controller.signal});
  return promise.finally(() => clearTimeout(timer));
}

async function offlineResponse(url, isPage, navigating) {
  const matching = await lookup(url, isPage);
  if (matching) return matching;
  if (navigating) {
    const shell = await caches.open(shellCache);
    const fallback = await shell.match(new URL('offline.html', scope).href);
    if (fallback) return fallback;
  }
  return Response.error();
}

const savingPages = new Map();
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || request.headers.has('Range') || request.headers.has('Authorization')) return;
  const url = exactURL(request.url);
  if (relativePath(url) === null) return;
  const navigating = request.mode === 'navigate';
  const isPage = navigating && researchPage(url);
  const shellPage = navigating && corePaths.has(url.pathname) && !localAsset(url);
  const htmlNavigation = navigating && /(?:\/|\.html|\/[^/.]+)$/.test(url.pathname);
  if (!isPage && !shellPage && !htmlNavigation && !localAsset(url)) return;

  const network = networkRequest(request);
  const saving = network.then(response => {
    if (response.status === 404 || response.status === 410) {
      return serializeWrite(async () => {
        const name = isPage ? pageCache : assetCache;
        await (await caches.open(name)).delete(url.href);
        indexes.get(name)?.delete(url.href);
      });
    }
    if (isPage || (!navigating && localAsset(url))) return remember(response.clone(), url, isPage);
  }).catch(() => {});
  if (isPage) {
    savingPages.set(url.href, saving);
    saving.finally(() => { if (savingPages.get(url.href) === saving) savingPages.delete(url.href); });
  }
  event.waitUntil(saving);
  event.respondWith((async () => {
    let slowTimer;
    const preferred = network.then(response => {
      // A real not-found stays not-found; only outages may use a stored copy.
      if (response.status >= 500) throw new Error('Host unavailable');
      return response;
    });
    try {
      const slow = new Promise(resolve => {slowTimer = setTimeout(() => resolve(null), 3500);});
      const early = await Promise.race([preferred, slow]);
      if (early) return early;
      const saved = await lookup(url, isPage);
      return saved || await preferred;
    } catch {
      return offlineResponse(url, isPage, navigating);
    } finally {
      clearTimeout(slowTimer);
    }
  })());
});

async function fillFirstVisit(url, assetURLs) {
  // The very first navigation and its resources may predate service-worker control.
  const inFlight = savingPages.get(url.href);
  if (inFlight) await inFlight;
  if (!await lookup(url, true)) {
    const response = await networkRequest(new Request(url.href));
    await remember(response, url, true);
  }
  const eligible = [];
  let images = 0;
  for (const value of new Set(assetURLs.slice(0, 32))) {
    if (typeof value !== 'string') continue;
    const asset = exactURL(value);
    if (!localAsset(asset)) continue;
    if (/\.(?:jpe?g|png|webp|avif|svg)$/i.test(asset.pathname) && ++images > 5) continue;
    eligible.push(asset);
  }
  // Limit concurrent warmup on the first visit, including newly introduced page-specific CSS.
  for (let i = 0; i < eligible.length; i += 4) {
    await Promise.allSettled(eligible.slice(i, i + 4).map(async asset => {
      if (await lookup(asset, false)) return;
      await remember(await networkRequest(new Request(asset.href)), asset, false);
    }));
  }
}

async function availablePages() {
  const cache = await caches.open(pageCache);
  const rows = [];
  for (const request of (await cache.keys()).reverse()) {
    const response = await cache.match(request);
    if (!response) continue;
    const title = response.headers.get('X-Atlas-Page-Title');
    rows.push({url: request.url, title: title ? decodeURIComponent(title) : new URL(request.url).pathname});
  }
  return rows;
}

self.addEventListener('message', event => {
  const client = event.source;
  if (!client || client.type !== 'window' || relativePath(new URL(client.url)) === null) return;
  const message = event.data;
  const port = event.ports[0];
  if (message?.type === 'ATLAS_OFFLINE_PAGES') {
    event.waitUntil(availablePages().then(pages => port?.postMessage({pages})).catch(() => port?.postMessage({pages: []})));
  } else if (message?.type === 'ATLAS_VISIT') {
    const url = exactURL(client.url);
    if (!researchPage(url) || typeof message.url !== 'string' || exactURL(message.url).href !== url.href) return;
    const assets = Array.isArray(message.assets) ? message.assets : [];
    event.waitUntil(fillFirstVisit(url, assets).then(() => port?.postMessage({ready: true})).catch(() => port?.postMessage({ready: false})));
  }
});
