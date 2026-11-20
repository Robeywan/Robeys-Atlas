// Shared by all generated Atlas documents, including profiles reached directly.
export function atlasAppHead(base) {
  return [
    `<link rel="manifest" href="${base}manifest.webmanifest">`,
    `<link rel="apple-touch-icon" sizes="180x180" href="${base}icons/apple-touch-icon.png?v=atlas-geronimo-1">`,
    '<meta name="mobile-web-app-capable" content="yes">',
    '<meta name="apple-mobile-web-app-capable" content="yes">',
    '<meta name="apple-mobile-web-app-title" content="Indigenous North America">',
    '<meta name="apple-mobile-web-app-status-bar-style" content="default">',
    `<link rel="stylesheet" href="${base}pwa-install.css">`,
    `<script defer src="${base}pwa-install.js"></script>`,
  ].join('');
}

export function atlasAppLink(base) {
  return `<div class="atlas-app-bar" data-atlas-app-promotion><div class="wrap"><a href="${base}install/" data-atlas-install>Get the app!</a></div></div>`;
}
