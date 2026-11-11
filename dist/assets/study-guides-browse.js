/* Study guide browser: existing entry content stays in the DOM. */
(function (global) {
  "use strict";

  const collator = new Intl.Collator("en", { sensitivity: "base", numeric: true });
  const initialized = new WeakSet();

  function foldTitle(value) {
    return String(value == null ? "" : value).normalize("NFKC").toLocaleLowerCase("en-US");
  }

  function pageSize(value) {
    if (value === "all") return "all";
    const number = Number(value);
    return [10, 20, 50].includes(number) ? number : 10;
  }

  function initialState() {
    return { query: "", sort: "az", pageSize: 10, page: 1 };
  }

  function changeControls(state, patch) {
    return Object.assign({}, state, patch, { page: 1 });
  }

  function computePage(entries, state) {
    state = Object.assign(initialState(), state || {});
    const query = foldTitle(state.query).trim();
    const sort = state.sort === "za" ? "za" : "az";
    const size = pageSize(state.pageSize);
    const ordered = entries.map((entry, index) => ({ entry: entry, index: index }))
      .sort((a, b) => {
        const compared = collator.compare(String(a.entry.title), String(b.entry.title));
        return (sort === "za" ? -compared : compared) || a.index - b.index;
      }).map((row) => row.entry);
    const matches = ordered.filter((entry) => foldTitle(entry.title).includes(query));
    const totalPages = size === "all" ? 1 : Math.max(1, Math.ceil(matches.length / size));
    const requestedPage = Number.isFinite(Number(state.page)) ? Math.floor(Number(state.page)) : 1;
    const page = Math.max(1, Math.min(totalPages, requestedPage));
    const offset = size === "all" ? 0 : (page - 1) * size;
    const visible = size === "all" ? matches.slice() : matches.slice(offset, offset + size);
    return {
      ordered: ordered,
      matches: matches,
      visible: visible,
      totalEntries: entries.length,
      totalMatches: matches.length,
      page: page,
      totalPages: totalPages,
      rangeStart: visible.length ? offset + 1 : 0,
      rangeEnd: offset + visible.length,
      previousDisabled: page <= 1,
      nextDisabled: page >= totalPages,
      pageSize: size
    };
  }

  function pageContaining(entries, key, state) {
    const cleared = changeControls(state || initialState(), { query: "" });
    const view = computePage(entries, cleared);
    const index = view.matches.findIndex((entry) => entry.key === key);
    if (index < 0) return null;
    cleared.page = view.pageSize === "all" ? 1 : Math.floor(index / view.pageSize) + 1;
    return cleared;
  }

  function statusText(view) {
    if (!view.totalMatches) return "No study guides match your search. 0 of " + view.totalEntries + ".";
    const count = view.totalMatches === view.totalEntries
      ? String(view.totalMatches)
      : view.totalMatches + " of " + view.totalEntries;
    return count + " study guide" + (view.totalMatches === 1 ? "" : "s") +
      ". Showing " + view.rangeStart + "–" + view.rangeEnd +
      ". Page " + view.page + " of " + view.totalPages + ".";
  }

  function initStudyBrowser(root) {
    if (initialized.has(root)) return false;
    const search = root.querySelector("[data-study-search]");
    const sort = root.querySelector("[data-study-sort]");
    const size = root.querySelector("[data-study-page-size]");
    const previous = root.querySelector("[data-study-prev]");
    const next = root.querySelector("[data-study-next]");
    const status = root.querySelector("[data-study-status]");
    const empty = root.querySelector("[data-study-empty]");
    const elements = Array.from(root.querySelectorAll("[data-study-entry]"));
    if (!search || !sort || !size || !previous || !next || !status || !empty) return false;
    if (elements.some((element) => !element.getAttribute("data-study-title"))) return false;
    // A common parent lets us sort only wrappers, preserving other content and IDs.
    if (elements.some((element) => element.parentNode !== elements[0].parentNode)) return false;
    const entries = elements.map((element, index) => ({
      key: index,
      title: element.getAttribute("data-study-title"),
      element: element
    }));
    const entryElements = new Set(elements);
    const parent = elements.length ? elements[0].parentNode : null;
    const document = root.ownerDocument;
    const window = document.defaultView;
    let state = initialState();

    function render() {
      const view = computePage(entries, state);
      state.page = view.page;
      const visible = new Set(view.visible.map((entry) => entry.element));
      // Temporary comment slots preserve non-entry siblings and every section subtree.
      const currentElements = parent ? Array.from(parent.childNodes).filter((element) => entryElements.has(element)) : [];
      const slots = currentElements.map((element) => {
        const slot = document.createComment("study-entry-slot");
        element.parentNode.insertBefore(slot, element);
        return slot;
      });
      view.ordered.forEach((entry, index) => slots[index].parentNode.replaceChild(entry.element, slots[index]));
      entries.forEach((entry) => { entry.element.hidden = !visible.has(entry.element); });
      previous.disabled = view.previousDisabled;
      next.disabled = view.nextDisabled;
      empty.hidden = view.totalMatches !== 0;
      status.textContent = statusText(view);
    }

    function revealHash() {
      const hash = window.location.hash;
      if (!hash || hash.length < 2) return;
      let id;
      try { id = decodeURIComponent(hash.slice(1)); } catch (_) { return; }
      const target = document.getElementById(id);
      if (!target || !root.contains(target)) return;
      const entry = entries.find((row) => row.element === target || row.element.contains(target));
      if (!entry) return;
      state = pageContaining(entries, entry.key, state);
      search.value = "";
      render();
      let ancestor = target;
      while (ancestor && ancestor !== root) {
        if (ancestor.tagName === "DETAILS") ancestor.open = true;
        ancestor = ancestor.parentElement;
      }
      // Hash navigation alone scrolls; typing, sorting and pagination never move focus.
      const scroll = function () { target.scrollIntoView({ block: "start" }); };
      if (window.requestAnimationFrame) window.requestAnimationFrame(scroll);
      else scroll();
    }

    search.value = "";
    sort.value = "az";
    size.value = "10";
    search.addEventListener("input", function () {
      state = changeControls(state, { query: search.value });
      render();
    });
    sort.addEventListener("change", function () {
      state = changeControls(state, { sort: sort.value });
      render();
    });
    size.addEventListener("change", function () {
      state = changeControls(state, { pageSize: pageSize(size.value) });
      render();
    });
    previous.addEventListener("click", function () {
      state.page -= 1;
      render();
    });
    next.addEventListener("click", function () {
      state.page += 1;
      render();
    });
    window.addEventListener("hashchange", revealHash);
    initialized.add(root);
    render();
    const controls = root.querySelectorAll("[data-study-controls]");
    controls.forEach((element) => { element.hidden = false; });
    [search, sort, size, previous, next, status].forEach((element) => { element.hidden = false; });
    revealHash();
    return true;
  }

  const api = Object.freeze({
    foldTitle: foldTitle,
    pageSize: pageSize,
    initialState: initialState,
    changeControls: changeControls,
    computePage: computePage,
    pageContaining: pageContaining,
    statusText: statusText,
    initStudyBrowser: initStudyBrowser
  });
  if (typeof module === "object" && module.exports) module.exports = api;
  if (global.document) {
    const start = function () {
      global.document.querySelectorAll("[data-study-browser]").forEach(initStudyBrowser);
    };
    if (global.document.readyState === "loading") global.document.addEventListener("DOMContentLoaded", start, { once: true });
    else start();
  }
})(typeof globalThis === "object" ? globalThis : this);
