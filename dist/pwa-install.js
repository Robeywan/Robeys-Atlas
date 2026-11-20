(() => {
  'use strict';
  const root = new URL('./', document.currentScript.src);
  const guideURL = new URL('install/', root);
  const installedMode = window.matchMedia('(display-mode: standalone), (display-mode: minimal-ui), (display-mode: window-controls-overlay)');
  let installEvent;
  let installedDuringVisit = false;
  let guidePromise;

  function isInstalled() {
    return installedDuringVisit || installedMode.matches || navigator.standalone === true;
  }

  function syncControls() {
    const installed = isInstalled();
    document.querySelectorAll('[data-atlas-app-promotion]').forEach(bar => { bar.hidden = installed; });
    document.querySelectorAll('[data-native-install]').forEach(button => { button.hidden = installed || !installEvent; });
    if (installed) document.querySelector('dialog.atlas-install-dialog[open]')?.close();
  }
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    installEvent = event;
    syncControls();
  });
  window.addEventListener('appinstalled', () => {
    installEvent = undefined;
    installedDuringVisit = true;
    syncControls();
  });
  if (installedMode.addEventListener) installedMode.addEventListener('change', syncControls);
  else if (installedMode.addListener) installedMode.addListener(syncControls);
  syncControls();

  function platform() {
    if (/iPad|iPhone|iPod/i.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'iphone';
    if (/Android/i.test(navigator.userAgent)) return 'android';
    return 'desktop';
  }

  function loadGuide() {
    if (!guidePromise) {
      guidePromise = fetch(guideURL).then(async response => {
        if (!response.ok || new URL(response.url).origin !== location.origin) throw Error('Installation guide unavailable');
        const html = new DOMParser().parseFromString(await response.text(), 'text/html');
        const section = html.querySelector('[data-install-guide="' + platform() + '"]');
        const steps = section?.querySelector('ol, p');
        if (!steps) throw Error('Installation instructions unavailable');
        return steps;
      }).catch(error => {
        guidePromise = undefined;
        throw error;
      });
    }
    return guidePromise;
  }

  function showInstructions(opener) {
    const dialog = document.createElement('dialog');
    if (typeof dialog.showModal !== 'function') {
      location.assign(guideURL.href);
      return;
    }
    dialog.className = 'atlas-install-dialog';
    dialog.setAttribute('aria-labelledby', 'atlas-install-title');
    const title = document.createElement('h2');
    title.id = 'atlas-install-title';
    title.textContent = 'Install Indigenous North America';
    title.tabIndex = -1;
    const content = document.createElement('div');
    content.setAttribute('aria-live', 'polite');
    // Give usable directions immediately, even on an interrupted connection.
    content.textContent = {
      iphone: 'Open the Atlas in Safari. Tap Share, then Add to Home Screen. Turn on Open as Web App if shown, then tap Add.',
      android: 'In Chrome, open the ⋮ menu. Look for Install app or Add to Home screen, then confirm.',
      desktop: 'Look for an install option in your browser menu, or use Safari’s File menu to add the Atlas to your Dock.'
    }[platform()];
    const actions = document.createElement('div');
    actions.className = 'atlas-install-actions';
    const allSteps = document.createElement('a');
    allSteps.href = guideURL.href;
    allSteps.textContent = 'Instructions for all devices';
    const close = document.createElement('button');
    close.type = 'button';
    close.dataset.closeInstall = '';
    close.textContent = 'Close';
    close.addEventListener('click', () => dialog.close());
    const nativeInstall = document.createElement('button');
    nativeInstall.type = 'button';
    nativeInstall.dataset.nativeInstall = '';
    nativeInstall.textContent = 'Install Atlas';
    nativeInstall.hidden = !installEvent;
    nativeInstall.addEventListener('click', () => {
      dialog.close();
      install(opener);
    });
    actions.append(allSteps, nativeInstall, close);
    dialog.append(title, content, actions);
    document.body.append(dialog);
    dialog.addEventListener('close', () => {
      dialog.remove();
      if (opener.isConnected && !isInstalled()) opener.focus({preventScroll: true});
    }, {once: true});
    dialog.showModal();
    title.focus({preventScroll: true});
    loadGuide().then(steps => {
      if (dialog.open) content.replaceChildren(document.importNode(steps, true));
    }).catch(() => { /* The inline platform directions are already available. */ });
  }

  function install(opener) {
    if (isInstalled()) return;
    if (!installEvent) {
      showInstructions(opener);
      return;
    }
    const event = installEvent;
    installEvent = undefined;
    // The browser requires prompt() in the original user activation.
    try {
      Promise.resolve(event.prompt()).then(() => event.userChoice).then(choice => {
        if (choice?.outcome === 'dismissed' && opener.isConnected && !opener.hidden) opener.focus({preventScroll: true});
      }).catch(() => { if (!isInstalled()) showInstructions(opener); });
    } catch {
      showInstructions(opener);
    }
    syncControls();
  }
  document.querySelectorAll('[data-atlas-install]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      install(link);
    });
  });
  document.querySelectorAll('[data-native-install]').forEach(button => {
    button.addEventListener('click', () => install(button));
  });

  // A direct profile visit can precede worker control. Send the actual page resources
  // to the active worker as soon as it is ready, including on a restored history visit.
  if ('serviceWorker' in navigator && window.isSecureContext) {
    function rememberPage(registration) {
      const dependencies = [
        ...Array.from(document.querySelectorAll('link[rel~="stylesheet"][href]'), link => link.href),
        ...Array.from(document.querySelectorAll('script[src]'), script => script.src),
        ...Array.from(document.images).slice(0, 12).map(img => img.currentSrc || img.src)
      ].filter(src => src && new URL(src, location.href).origin === root.origin);
      registration.active?.postMessage({
        type: 'ATLAS_VISIT', url: location.href, title: document.title, assets: [...new Set(dependencies)]
      });
    }
    navigator.serviceWorker.register(new URL('sw.js', root), {scope: root.pathname}).then(() => navigator.serviceWorker.ready).then(registration => {
      rememberPage(registration);
      window.addEventListener('pageshow', event => { if (event.persisted) rememberPage(registration); });
    }).catch(() => { /* Installation controls and normal online navigation still work. */ });
  }
})();
