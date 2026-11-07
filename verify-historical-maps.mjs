import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const source=read('data/historical-maps.json'),c=read('dist/data/historical-maps.json'),ids=new Set(),records=new Set();
assert.equal(source.maps.length,c.maps.length);
assert(c.maps.length>=12);
const prior=JSON.parse(execFileSync('git',['show','630330214d9a85c2b9802c971f335d2cf9cb21ac:data/historical-maps.json'],{maxBuffer:20e6}));
for(const m of prior.maps)assert(c.maps.some(n=>n.id===m.id),'Prior map preserved: '+m.id);
const profiles=read('dist/data/profiles.json');
let connections=0;
for(const m of c.maps){
 assert(!ids.has(m.id));ids.add(m.id);assert(!records.has(m.recordUrl));records.add(m.recordUrl);
 for(const k of ['title','creator','dateLabel','archive','annotation','credit'])assert(m[k]?.length,m.id+' '+k);
 assert(m.year>=1600&&m.year<=new Date().getUTCFullYear());assert(m.inspection.scope&&m.inspection.reviewedAt);
 for(const url of [m.recordUrl,m.viewerUrl,m.rights.url])assert(/^https?:\/\//.test(url));
 if(m.preview){assert(fs.existsSync('dist/'+m.preview.path));assert(m.preview.sourceImageUrl&&m.preview.licenseUrl&&m.preview.changes);assert(m.preview.visualInspection?.reviewedAt&&m.preview.visualInspection?.scope);}
 const linked=new Set();
 for(const l of m.profileLinks||[]){
  assert(!linked.has(l.profileSlug),'Duplicate profile link');linked.add(l.profileSlug);
  const p=profiles.find(p=>p.slug===l.profileSlug);assert(p&&p.name===l.profileName);
  assert(l.relevance&&l.period&&l.relationship&&l.reviewedAt&&l.evidence?.length);
  for(const e of l.evidence)assert(/^https:\/\//.test(e.url)&&e.label);
  const profile=fs.readFileSync('dist/nations/'+p.slug+'/index.html','utf8');
  assert(profile.includes('id="historical-maps"')&&profile.includes('historical-maps/#'+m.id),'Reciprocal profile map link');
  connections++;
 }
}
const html=fs.readFileSync('dist/historical-maps/index.html','utf8');
assert.equal((html.match(/data-historic-card/g)||[]).length,c.maps.length);
for(const m of c.maps)assert(html.includes('id="'+m.id+'"'));
assert(html.includes('<noscript>')&&html.includes('aria-live="polite"'));
assert(fs.readFileSync('dist/index.html','utf8').includes('Explore '+c.maps.length+' historical maps'));
assert(html.includes('id="historic-people"'));
for(const m of c.maps)for(const l of m.profileLinks||[])assert(html.includes('../nations/'+l.profileSlug+'/#historical-maps'));
// Profiles are expected to change during source research. The general verifier
// checks their IDs, citations and routes; this regression guard protects the
// independent map/reading-lead/geometry datasets from accidental replacement.
const preservationBase='b892024566cbf35e51d76c73688ad7ff1aff8bb6';
const queued=read('data/queued-directory-entries.json');
const earlierQueued=JSON.parse(execFileSync('git',['show','735b0fc72f9a221b7d913478680fcbf2ed970141:data/queued-directory-entries.json'],{maxBuffer:20e6}));
assert(queued.profiles.length>=earlierQueued.profiles.length);
// Research may promote an earlier identity-only route into a reviewed guide.
// Preserve its original identity fields and position; the cohort, source,
// image and content-count contracts below validate each such promotion.
const queuePromotionFields=new Set(['researchStatus','substantiveWorks','entryStage','imageStatus','listedReadingSources','reviewedAt','startingGuideBatch']);
for(const [i,old] of earlierQueued.profiles.entries()){
 const item=queued.profiles[i];
 if(item.researchStatus==='queued')assert.deepEqual(item,old,'Earlier queued identity row preserved');
 else {
  const identity=o=>Object.fromEntries(Object.entries(o).filter(([key])=>!queuePromotionFields.has(key)));
  assert.deepEqual(identity(item),identity(old),'Promoted route retains every original identity field');
 }
}
// Correct two explicitly reviewed queue pointers introduced before cohort10;
// existing profile names and public routes are unchanged. No general slug waiver.
const routeRepairs=read('data/queue-route-corrections-20261028.json').repairs;
assert.equal(routeRepairs.length,2);
const latestQueue=JSON.parse(execFileSync('git',['show','HEAD:data/queued-directory-entries.json'],{maxBuffer:30e6}));
for(const [i,old] of latestQueue.profiles.entries()){
 const expected=structuredClone(old),item=queued.profiles[i];
 const repair=routeRepairs.find(r=>r.name===old.name);
 if(repair){
  assert([repair.beforeSlug,repair.afterSlug].includes(old.slug));
  expected.slug=repair.afterSlug;
  assert(profiles.some(p=>p.slug===repair.afterSlug&&p.name===repair.name));
 }
 if(item.researchStatus==='queued')assert.deepEqual(item,expected,'Latest queued identity fields and repaired pointer preserved');
 else {
  if(!Object.hasOwn(expected,'identificationEvidence')&&Object.hasOwn(item,'identificationEvidence')){
   const priorIdentity=JSON.parse(execFileSync('git',['show','HEAD:data/profiles.json'],{maxBuffer:50e6})).find(p=>p.name===item.name);assert(priorIdentity);
   assert.deepEqual(item.identificationEvidence,priorIdentity.identificationEvidence,'New queue reference display must copy the earlier raw identity evidence exactly');
   expected.identificationEvidence=structuredClone(item.identificationEvidence);
  }
  const identity=o=>Object.fromEntries(Object.entries(o).filter(([key])=>!queuePromotionFields.has(key)));
  assert.deepEqual(identity(item),identity(expected),'Reviewed-guide promotion preserves identity and repaired pointer');
 }
}
for(const repair of routeRepairs)assert.equal(queued.profiles.filter(p=>p.name===repair.name&&p.slug===repair.afterSlug).length,1);
const earlierProfiles=JSON.parse(execFileSync('git',['show','HEAD:data/profiles.json'],{maxBuffer:50e6}));
const currentRawProfiles=read('data/profiles.json');
const startingRows=fs.readdirSync('data').filter(name=>/^twenty-profile-batch-\d+\.json$/.test(name)).flatMap(name=>read('data/'+name).profiles);
const visualImages=read('data/profile-visual-assets.json').images;
const supplementaryGuides=[read('research/caribbean-source-expansion-20261029.json'),read('research/caribbean-media-completion-20261029.json'),read('research/caribbean-community-expansion-20261029.json'),read('research/pit-river-175-20261030.json'),read('research/atsugewi-document-176-20261031.json'),read('research/virginia-research-20261102.json'),read('research/virginia-followup-guides-20261102.json'),read('research/virginia-guide-180-20261102.json'),read('research/virginia-guide-181-20261102.json'),read('research/virginia-guide-182-20261102.json'),read('research/virginia-guide-183-20261102.json'),read('research/virginia-resume-187-20261103.json'),read('research/virginia-state-deep-188-20261103.json'),read('research/virginia-state-depth-190-20261103.json'),read('research/shawnee-depth-191-20261103.json'),read('research/virginia-queued-depth-198-20261104.json')].flatMap(record=>record.publicGuideUpdates);
for(const item of queued.profiles){
 const p=profiles.find(p=>p.slug===item.slug);
 assert(p&&p.name===item.name);
 if(p.researchStatus==='queued')assert(p.sources.every(s=>s.countsTowardMinimum===false&&s.identificationOnly));
 else if(p.entryStage==='source-context'){
  // A limited selected reading context retains the earlier identity-only shell.
  // It is not a reviewed starting guide, image enrollment or adequacy assessment.
  const raw=currentRawProfiles.find(row=>row.name===p.name);
  const old=earlierProfiles.find(row=>row.name===p.name);
  const oldQueue=latestQueue.profiles.find(row=>row.name===item.name&&row.slug===item.slug);
  assert(raw&&old&&oldQueue,'Source context has a retained identity baseline');
  assert(raw.entryStage===item.entryStage&&item.entryStage===p.entryStage&&p.entryStage==='source-context');
  assert(raw.researchStatus===item.researchStatus&&item.researchStatus===p.researchStatus&&p.researchStatus==='source-guide');
  assert(raw.coverageLevel==='limited-source-context'&&p.coverageLevel===raw.coverageLevel);
  assert(raw.researchComplete===false&&p.researchComplete===false);
  assert(Array.isArray(raw.overviewSourceIds)&&raw.overviewSourceIds.length===0);
  assert(raw.sources.length>=1&&raw.sections.length>=1);
  assert.equal(new Set(raw.sources.map(source=>source.id)).size,raw.sources.length);
  const inspected=raw.sources.filter(source=>source.contentReviewedAt&&source.contentReviewScope&&source.countsTowardMinimum!==false);
  assert(inspected.length>=1,'At least one inspected countable selected context required');
  for(const section of raw.sections){
   assert(section.title&&section.text&&section.sourceIds?.length);
   for(const id of section.sourceIds)assert(inspected.some(source=>source.id===id),'Selected section cites inspected content');
  }
  assert.equal(item.listedReadingSources,raw.sources.length);
  assert.equal(item.substantiveWorks,new Set(inspected.map(source=>source.url)).size);
  const changedRaw=new Set(['entryStage','researchStatus','coverageLevel','overviewSourceIds','sources','sections','researchGaps']);
  const unchangedRaw=o=>Object.fromEntries(Object.entries(o).filter(([key])=>!changedRaw.has(key)));
  assert.deepEqual(unchangedRaw(raw),unchangedRaw(old),'Every old identity/overview/date/relationship/absence retained');
  assert(old.initialAdequacy?.status==='Not assessed'&&old.initialAdequacy.reviewedAt===null);
  assert.deepEqual(raw.initialAdequacy,old.initialAdequacy,'Whole initial assessment remains unassessed and undated');
  for(const key of ['sources','sections','researchGaps'])assert.deepEqual(raw[key].slice(0,old[key].length),old[key],'Every earlier source/section/gap remains exact');
  for(const [key,value] of Object.entries(raw))assert.deepEqual(p[key],value,'Compiled source-context field matches raw: '+key);
  const changedQueue=new Set(['entryStage','researchStatus','listedReadingSources','substantiveWorks']);
  const unchangedQueue=o=>Object.fromEntries(Object.entries(o).filter(([key])=>!changedQueue.has(key)));
  assert.deepEqual(unchangedQueue(item),unchangedQueue(oldQueue),'Every old queued identity/evidence/date/image/absence retained');
  assert.deepEqual(item.identificationEvidence,raw.identificationEvidence);
  assert(!Object.hasOwn(raw,'startingGuide')&&!Object.hasOwn(p,'startingGuide')&&!Object.hasOwn(item,'startingGuideBatch'));
  assert(!startingRows.some(row=>row.slug===p.slug)&&!supplementaryGuides.some(row=>row.slug===p.slug),'Source context is not a starting-guide/cohort promotion');
  assert(!visualImages.some(image=>image.profileSlugs.includes(p.slug)),'No pictured/visual enrollment from selected text');
 }
 else {
  // A queued identity route can gain an owner-requested, reviewed starting guide.
  // Its identity evidence and earlier sources remain protected independently.
  assert(item.researchStatus==='source-guide'&&item.entryStage==='reviewed-starting-guide');
  assert(p.researchStatus==='source-guide'&&p.entryStage==='reviewed-starting-guide'&&p.researchComplete===false);
  const supplemental=supplementaryGuides.find(row=>row.slug===p.slug&&row.name===p.name);
  if(supplemental&&(!p.startingGuide||['pit-river-175-20261030','atsugewi-document-176-20261031','virginia-research-20261102','virginia-followup-guides-20261102','virginia-guide-180-20261102','virginia-guide-181-20261102','virginia-guide-182-20261102','virginia-guide-183-20261102','virginia-resume-187-20261103','virginia-state-deep-188-20261103','virginia-state-depth-190-20261103','shawnee-depth-191-20261103','virginia-queued-depth-198-20261104'].includes(supplemental.batchId))){
   // A reviewed supplementary guide is not a fictitious completed twenty-guide cohort.
   assert(['hopkins-belize','dangriga-belize','punta-gorda-belize','barranco-belize','seine-bight-belize','santa-rosa-first-peoples-community-trinidad','moruga-first-peoples','lucayan','guaiqueri','atsuge','pit-river-tribe','hewisedawi-band-pit-river-tribe','atsugewi-band-pit-river-tribe','mattaponi-indian-tribe','chickahominy-indian-tribe','chickahominy-indian-tribe-eastern-division','upper-mattaponi-indian-tribe','nansemond-indian-nation','cheroenhaka-nottoway-indian-tribe','nottoway-indian-tribe-of-virginia','patawomeck-indian-tribe-of-virginia','saponi','occaneechi','manahoac','tutelo','paspahegh','kecoughtan','warraskoyack','appamattuck','chiskiack','eastern-shawnee-tribe-of-oklahoma','shawnee-tribe','quiyoughcohannock'].includes(p.slug));
   assert(supplemental.selectedReadingPath.length);
   for(const pick of supplemental.selectedReadingPath){
    const source=p.sources.find(s=>s.id===(pick.sourceId||pick.id));
    assert(source?.contentReviewedAt&&source.contentReviewScope&&source.countsTowardMinimum!==false);
   }
   assert(visualImages.some(image=>image.id===supplemental.imageRecordId&&image.profileSlugs.includes(p.slug)&&fs.existsSync('dist/'+image.asset)));
   assert.equal(item.substantiveWorks,new Set(p.sources.filter(s=>s.contentReviewedAt&&s.countsTowardMinimum!==false).map(s=>s.url)).size);
   const raw=currentRawProfiles.find(current=>current.name===p.name);assert(raw);
   assert.deepEqual(raw.identificationEvidence,item.identificationEvidence);
   const old=earlierProfiles.find(old=>old.name===p.name);
   if(old){
    assert.deepEqual(raw.identificationEvidence,old.identificationEvidence);
    for(const source of old.sources){
     const expected=p.slug==='dangriga-belize'&&source.id==='c14-dangriga-palacio2024'?{...source,indigenousLed:true}:source;
     assert.deepEqual(raw.sources.find(s=>s.id===source.id),expected,'Earlier source exact except the verified Garifuna-author filter flag');
    }
   }
   continue;
  }
  assert(startingRows.some(row=>row.slug===p.slug&&row.name===p.name&&row.pictureReviewed&&row.readingPathReviewed));
  assert(p.startingGuide?.batchId===item.startingGuideBatch&&p.startingGuide.sources.length);
  assert(visualImages.some(image=>image.id===p.startingGuide.imageRecordId&&image.profileSlugs.includes(p.slug)));
  assert.equal(item.substantiveWorks,new Set(p.sources.filter(s=>s.contentReviewedAt&&s.countsTowardMinimum!==false).map(s=>s.url)).size);
  const old=earlierProfiles.find(old=>old.name===p.name);assert(old);
  assert.deepEqual(p.identificationEvidence||[],old.identificationEvidence||[]);
  const raw=currentRawProfiles.find(current=>current.name===p.name);assert(raw);
  for(const source of old.sources){
   // Compare the canonical objects exactly. Built source cards may add default
   // presentation fields (for example topics:[]) without changing evidence.
   assert.deepEqual(raw.sources.find(current=>current.id===source.id),source,'Earlier raw identity/source object preserved: '+p.name);
   const rendered=p.sources.find(current=>current.id===source.id);assert(rendered);
   for(const [key,value] of Object.entries(source))assert.deepEqual(rendered[key],value,'Earlier source field rendered: '+p.name+' '+key);
  }
 }
}
for(const file of ['data/owner-reading-leads.json','data/region-associations.json','data/map-regions.geojson','data/map-lakes.geojson','data/historical-maps.json']){
 const priorData=JSON.parse(execFileSync('git',['show',preservationBase+':'+file],{maxBuffer:50e6})),currentData=read(file);
 if(file==='data/region-associations.json'){
  assert.deepEqual(currentData.associations.slice(0,priorData.associations.length),priorData.associations,'All earlier regional routes preserved');
  const latestPublished=JSON.parse(execFileSync('git',['show','HEAD:'+file],{maxBuffer:50e6}));
  assert.deepEqual(currentData.associations.slice(0,latestPublished.associations.length),latestPublished.associations,'Latest published regional routes preserved');
  const added=currentData.associations.slice(latestPublished.associations.length);
  const existing=new Set(latestPublished.associations.map(a=>JSON.stringify(a)));
  const approved=(queued.regionAssociations||[]).filter(a=>!existing.has(JSON.stringify(a)));
  assert.deepEqual(added.filter(a=>a.identityOnly),approved,'New identity routes exactly match approved queued additions');
  for(const a of added){
   assert(a.evidenceNote&&a.sourceUrl&&a.period&&a.reviewDate,'Every new route retains scoped dated evidence');
   if(a.identityOnly)assert(queued.profiles.some(p=>p.name===a.name));
   else {
    const p=profiles.find(p=>p.name===a.name);
    assert(p&&p.sources.some(s=>s.url===a.sourceUrl&&s.contentReviewedAt&&s.contentReviewScope&&s.countsTowardMinimum!==false),'New research route cites actual inspected profile content');
    assert(a.associationType&&a.reviewedScope,'New research route states association and inspection scope');
   }
  }
 }else if(file==='data/owner-reading-leads.json'){
  // Owner-approved appended studies preserve every earlier bibliography verbatim.
  assert.deepEqual(currentData.documents.slice(0,priorData.documents.length),priorData.documents,'Earlier owner-study records and exact URLs preserved');
  const latestPublished=JSON.parse(execFileSync('git',['show','HEAD:'+file],{maxBuffer:20e6}));
  assert.deepEqual(currentData.documents.slice(0,latestPublished.documents.length),latestPublished.documents,'Latest published owner studies preserved');
  const added=currentData.documents.slice(latestPublished.documents.length);
  const seen=new Set(latestPublished.documents.map(d=>d.key));
  for(const d of added){
   assert(!seen.has(d.key),'No duplicate owner-study key');seen.add(d.key);
   // Statewide finding aids have no reviewed community route or source credit.
   if(d.collectionType==='unreviewed-statewide-finding-aid'){
    assert(d.links.length&&Array.isArray(d.originalIds)&&Array.isArray(d.profileSlugs)&&!d.originalIds.length&&!d.profileSlugs.length,'Statewide finding aids retain empty community associations');
    assert(d.fullAttachmentPublished===false&&!d.contentReviewedAt&&d.countsTowardMinimum!==true,'A finding aid does not publish its attachment or claim inspected work');
    assert(!profiles.some(p=>p.researchLeads?.some(s=>s.documentKey===d.key)),'Statewide finding aids are not routed as community-specific sources');
    assert(d.links.every((s,i)=>s.documentKey===d.key&&s.reviewStatus==='Awaiting original-source review'&&!s.contentReviewedAt&&s.countsTowardMinimum!==true&&s.sourceNumber===i+1),'Finding-aid links retain pending review, no substantive credit and sequential list positions');
    continue;
   }
   const targets=[...(d.originalIds||[]).map(id=>profiles.find(p=>p.originalId===id)),...(d.profileSlugs||[]).map(slug=>profiles.find(p=>p.slug===slug))];
   assert(d.links.length&&targets.length,'Appended study has a bibliography and reviewed directory route');
   assert(targets.every(Boolean),'Every declared study directory target exists');
   for(const p of new Map(targets.map(p=>[p.slug,p])).values()){
    assert(d.links.every(s=>p.researchLeads?.some(t=>t.documentKey===d.key&&t.url===s.url)),'Every new study URL is routed to its directory entry');
   }
   assert(d.links.every(s=>s.documentKey===d.key&&s.reviewStatus==='Awaiting original-source review'&&!s.contentReviewedAt),'Extraction does not imply content review');
  }
 }else if(file==='data/historical-maps.json'){
  // Reviewed additions may extend the catalogue; every earlier source record
  // must remain unchanged, including rights and copying/inspection limits.
  assert.deepEqual(currentData.maps.slice(0,priorData.maps.length),priorData.maps,'Earlier historical map records preserved');
  const latestPublished=JSON.parse(execFileSync('git',['show','HEAD:'+file],{maxBuffer:50e6}));
  assert.deepEqual(currentData.maps.slice(0,latestPublished.maps.length),latestPublished.maps,'Latest published historical maps preserved');
  for(const [key,value] of Object.entries(priorData))if(!['maps','updatedAt'].includes(key))assert.deepEqual(currentData[key],value,'Historical catalogue context preserved: '+key);
 }else assert.deepEqual(currentData,priorData,file+' preserved');
}
console.log(JSON.stringify({historicalMaps:c.maps.length,reusablePreviews:c.maps.filter(m=>m.preview).length,linkOnlyRecords:c.maps.filter(m=>!m.preview).length,reviewedProfileConnections:connections,profilesWithMaps:new Set(c.maps.flatMap(m=>(m.profileLinks||[]).map(l=>l.profileSlug))).size,originalDataAndGeometry:'preserved',reciprocalLinks:'passed',noJSSourceLinks:'passed'}));
