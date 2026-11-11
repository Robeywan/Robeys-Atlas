const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

export function studyGuidesPageHead(base = '../') {
  return '<link rel="stylesheet" href="'+base+'assets/study-guides-browse.css?v=1"><script defer src="'+base+'assets/study-guides-browse.js?v=1"></script>';
}

export function renderStudyGuidesPage(items) {
  const seen = new Set();
  for (const item of items) {
    if (!item || !item.key || !item.title || typeof item.html !== 'string' || seen.has(item.key)) throw new Error('Invalid or duplicate study guide entry');
    seen.add(item.key);
  }
  const ordered = [...items].sort((a,b) => a.title.localeCompare(b.title,'en',{sensitivity:'base',numeric:true}));
  const entries = ordered.map(item => '<div class="study-guide-entry" data-study-entry data-study-key="'+escapeHTML(item.key)+'" data-study-title="'+escapeHTML(item.title)+'">'+item.html+'</div>').join('');
  return '<main id="main" class="wrap study-guides-page">'+
    '<section class="page-hero"><h1>Study guides</h1></section>'+
    '<article class="prose" data-study-browser><h2 id="study-guide-reference-lists">Reference lists</h2>'+
    '<div class="study-guide-controls" data-study-controls hidden>'+
      '<label for="study-guide-search">Find a study<input id="study-guide-search" type="search" placeholder="Search studies or states" autocomplete="off" data-study-search></label>'+
      '<label for="study-guide-sort">Sort<select id="study-guide-sort" data-study-sort><option value="az">A–Z</option><option value="za">Z–A</option></select></label>'+
      '<label for="study-guide-page-size">Show<select id="study-guide-page-size" data-study-page-size><option value="10" selected>10 at a time</option><option value="20">20 at a time</option><option value="50">50 at a time</option><option value="all">All studies</option></select></label>'+
      '<nav class="study-guide-pagination" data-study-pagination aria-label="Reference list pages"><button type="button" data-study-prev>Previous</button><button type="button" data-study-next>Next</button></nav>'+
      '<p class="study-guide-status" data-study-status role="status" aria-live="polite" aria-atomic="true"></p>'+
    '</div><p data-study-empty hidden>No studies match your search.</p>'+
    '<div class="study-guide-entries">'+entries+'</div>'+
    '<p><a href="../data/owner-reading-leads.json" download>Download the supplied URL catalog</a></p>'+
    '<p class="study-guides-disclaimer">Their claims and citations have not all been independently checked.</p>'+
    '</article></main>';
}
