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
    '<p class="study-guides-disclaimer">Their claims and citations have not all been independently checked.</p>'+
    '</article></main>';
}

export function researchStudyListing(study) {
  const title = escapeHTML(study.title);
  return {
    key: study.key,
    title: study.title,
    html: '<section id="'+escapeHTML(study.key)+'"><h2>'+title+'</h2><p>'+
      escapeHTML(study.summary)+'</p><p class="study-actions"><a href="../studies/'+
      escapeHTML(study.key)+'/">Read the full study →</a></p></section>',
  };
}

export function renderResearchStudy(study) {
  const sources = new Map(study.sources.map(source => [source.id, source]));
  if (sources.size !== study.sources.length) throw Error('Duplicate study source ID');
  const sourceNumber = new Map(study.sources.map((source, i) => [source.id, i+1]));
  const anchorId = id => 'study-source-'+escapeHTML(id);
  const citation = id => {
    const source = sources.get(id);
    if (!source) throw Error('Unknown study source '+id);
    return '<a href="#'+anchorId(id)+'" aria-label="Source '+sourceNumber.get(id)+
      ', '+escapeHTML(source.title)+'">['+sourceNumber.get(id)+']</a>';
  };
  const figure = image => '<figure><img src="../../'+escapeHTML(image.asset)+'" alt="'+escapeHTML(image.alt)+
    '" width="'+image.width+'" height="'+image.height+'" loading="lazy" decoding="async" style="max-width:100%;height:auto">'+
    '<figcaption><strong>'+escapeHTML(image.title)+'</strong>. '+escapeHTML(image.caption)+
    ' <a href="'+escapeHTML(image.source)+'">'+escapeHTML(image.creator)+'</a> · '+
    '<a href="'+escapeHTML(image.rights)+'">'+escapeHTML(image.rightsLabel)+'</a>. Resized for the web.</figcaption></figure>';
  const sections = study.sections.map(section =>
    '<section id="'+escapeHTML(section.id)+'"><h2>'+escapeHTML(section.heading)+'</h2>'+
    section.paragraphs.map(paragraph => '<p>'+escapeHTML(paragraph.text)+' '+
      paragraph.sources.map(citation).join(' ')+'</p>').join('')+
    (section.image?figure(study.artwork[section.image]):'')+'</section>').join('');
  const reading = study.sources.map(source =>
    '<li id="'+anchorId(source.id)+'"><a href="'+escapeHTML(source.url)+'">'+escapeHTML(source.title)+
    '</a> · '+escapeHTML(source.author)+'. '+escapeHTML(source.note)+'</li>').join('');
  return '<main id="main" class="wrap"><article class="prose"><p><a href="../../study-guides/#'+
    escapeHTML(study.key)+'">← Study guides</a></p><h1>'+escapeHTML(study.title)+'</h1><p>'+escapeHTML(study.intro)+'</p>'+
    sections+'<section id="reading-questions"><h2>Questions for readers</h2><ol>'+
    study.questions.map(question => '<li>'+escapeHTML(question)+'</li>').join('')+
    '</ol></section><section id="sources"><h2>Sources and further reading</h2><ol>'+reading+'</ol></section>'+
    '</article></main>';
}
