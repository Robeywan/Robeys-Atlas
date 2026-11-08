import assert from 'node:assert/strict';

// Countable selected contexts keep the original validator's filtering,
// citation rules and counters. Zero-credit contexts use a separate strict path.
export function validateSourceContextSelectedSources(raw,item){
  const inspected=raw.sources.filter(source=>source.contentReviewedAt&&source.contentReviewScope&&source.countsTowardMinimum!==false);
 if(inspected.length){
  assert(inspected.length>=1,'At least one inspected countable selected context required');
  for(const section of raw.sections){
   assert(section.title&&section.text&&section.sourceIds?.length);
   for(const id of section.sourceIds)assert(inspected.some(source=>source.id===id),'Selected section cites inspected content');
  }
 }else{
  assert(Array.isArray(raw.sources)&&raw.sources.length>=1,'Supporting context requires selected sources');
  assert(Array.isArray(raw.sections)&&raw.sections.length>=1,'Supporting context requires selected sections');
  const ids=new Set(),urls=new Set();
  for(const source of raw.sources){
   assert(source.countsTowardMinimum===false,'Supporting sources require explicit false count flag');
   assert(typeof source.contentReviewedAt==='string'&&source.contentReviewedAt.trim(),'Supporting source requires recorded content review');
   assert(typeof source.contentReviewScope==='string'&&source.contentReviewScope.trim(),'Supporting source requires selected content scope');
   for(const flag of ['identificationOnly','identityOnly'])assert(!Object.hasOwn(source,flag)||source[flag]===false,'Supporting reading cannot be identification-only');
   assert(typeof source.id==='string'&&source.id.length&&source.id.trim()===source.id&&!/\s/.test(source.id),'Supporting source requires valid ID');
   assert(!ids.has(source.id),'Supporting source IDs are unique');ids.add(source.id);
   assert(typeof source.url==='string'&&source.url.length&&source.url.trim()===source.url&&!/\s/.test(source.url),'Supporting source requires valid URL');
   let parsed;try{parsed=new URL(source.url);}catch{assert.fail('Supporting source requires valid URL');}
   assert(['http:','https:'].includes(parsed.protocol)&&parsed.hostname,'Supporting source requires HTTP URL');
   assert(!urls.has(source.url),'Supporting source URLs are unique');urls.add(source.url);
  }
  for(const section of raw.sections){
   assert(typeof section.title==='string'&&section.title.trim()&&typeof section.text==='string'&&section.text.trim(),'Supporting section requires selected text');
   assert(Array.isArray(section.sourceIds)&&section.sourceIds.length>=1,'Supporting section requires citations');
   for(const id of section.sourceIds)assert(ids.has(id),'Supporting section cites inspected supporting content');
  }
 }
  assert.equal(item.listedReadingSources,raw.sources.length);
  assert.equal(item.substantiveWorks,new Set(inspected.map(source=>source.url)).size);
 return {countableInspected:inspected,supportingOnly:inspected.length===0};
}

// This field may change only when it already existed. An absent historical
// field stays absent, including on the existing Sappony source-context route.
export function validateSourceContextReadingSourceCards(raw,item,oldQueue){
 if(Object.hasOwn(oldQueue,'readingSourceCards')){
  assert(Object.hasOwn(item,'readingSourceCards'),'Existing reading-source card counter remains present');
  assert.equal(item.readingSourceCards,raw.sources.length,'Reading-source card counter matches selected sources');
  return true;
 }
 assert(!Object.hasOwn(item,'readingSourceCards'),'Absent reading-source card counter remains absent');
 return false;
}

// The earlier latestQueue boundary must use the same narrowly permitted card
// change. Its global promotion fields and every other identity field stay exact.
export function validateSourceContextQueueIdentity(raw,item,expected,queuePromotionFields){
 const promotionFields=new Set(queuePromotionFields);
 if(item.entryStage==='source-context'){
  assert(raw&&raw.name===item.name,'Source-context queue comparison requires matching current raw profile');
  if(validateSourceContextReadingSourceCards(raw,item,expected))promotionFields.add('readingSourceCards');
 }
 const identity=o=>Object.fromEntries(Object.entries(o).filter(([key])=>!promotionFields.has(key)));
 assert.deepEqual(identity(item),identity(expected),'Reviewed-guide promotion preserves identity and repaired pointer');
}
