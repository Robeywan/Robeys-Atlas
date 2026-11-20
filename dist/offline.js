'use strict';
const retry = document.getElementById('retry');
retry.hidden = false;
retry.addEventListener('click', () => {
  if (location.href.split(/[?#]/)[0] === new URL('offline.html', document.baseURI).href) {
    location.assign(document.baseURI);
  } else {
    location.reload();
  }
});

async function showRecentPages() {
  const status = document.getElementById('cache-status');
  const worker = navigator.serviceWorker?.controller;
  if (!worker) {
    status.textContent = 'The offline list will be available after the Atlas finishes setting up on this device.';
    return;
  }
  const channel = new MessageChannel();
  const timer = setTimeout(() => {
    channel.port1.close();
    status.textContent = 'The offline list could not be loaded. Try again when connected.';
  }, 4000);
  channel.port1.onmessage = event => {
    clearTimeout(timer);
    channel.port1.close();
    const rows = Array.isArray(event.data?.pages) ? event.data.pages : [];
    const list = document.getElementById('available-pages');
    for (const row of rows) {
      const link = document.createElement('a');
      try { link.href = new URL(row.url).href; } catch { continue; }
      if (link.origin !== location.origin) continue;
      link.textContent = row.title || link.pathname;
      const item = document.createElement('li');
      item.append(link);
      list.append(item);
    }
    status.hidden = list.children.length > 0;
    if (!status.hidden) status.textContent = 'There are no recent pages stored yet. Open a guide while connected to make it available here.';
  };
  worker.postMessage({type: 'ATLAS_OFFLINE_PAGES'}, [channel.port2]);
}
showRecentPages();
