export function startingReading(p,e){
  const guide=p.startingGuide;
  if(!guide?.sources?.length)return '';
  const seen=new Set();
  const items=guide.sources.map(item=>{
    const i=p.sources.findIndex(s=>s.id===item.sourceId);
    if(i<0||seen.has(item.sourceId))throw Error('Invalid starting-source reference: '+p.name);
    seen.add(item.sourceId);
    const s=p.sources[i];
    if(!s.contentReviewedAt||s.countsTowardMinimum===false)throw Error('Starting source lacks substantive inspection: '+p.name);
    return `<li style="margin:1rem 0"><a href="#source-${i+1}">${e(s.title)}</a><p>${e(item.reason)}</p></li>`;
  }).join('');
  return `<section class="profile-section starting-reading" id="start-reading" aria-labelledby="starting-reading-title"><h2 id="starting-reading-title">Start reading here</h2><p>${e(guide.scopeNote)}</p><ol>${items}</ol><p class="filter-help">These are selected starting points. The full annotated collection, source perspectives, inspection limits and remaining research questions follow below. A starting guide is not an exhaustive history or community endorsement.</p></section>`;
}
