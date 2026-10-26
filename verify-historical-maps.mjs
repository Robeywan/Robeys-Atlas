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
assert.deepEqual(queued.profiles.slice(0,earlierQueued.profiles.length),earlierQueued.profiles,'Earlier queued entries preserved');
assert(queued.profiles.length>=earlierQueued.profiles.length);
for(const item of queued.profiles){
 const p=profiles.find(p=>p.slug===item.slug);
 assert(p&&p.name===item.name&&p.researchStatus==='queued');
 assert(p.sources.every(s=>s.countsTowardMinimum===false&&s.identificationOnly));
}
for(const file of ['data/owner-reading-leads.json','data/region-associations.json','data/map-regions.geojson','data/map-lakes.geojson','data/historical-maps.json']){
 const priorData=JSON.parse(execFileSync('git',['show',preservationBase+':'+file],{maxBuffer:50e6})),currentData=read(file);
 if(file==='data/region-associations.json'){
  assert.deepEqual(currentData.associations.slice(0,priorData.associations.length),priorData.associations,'All earlier regional routes preserved');
  const added=currentData.associations.slice(priorData.associations.length);
  assert.deepEqual(added,queued.regionAssociations,'Only the approved identity-level queued routes added');
  for(const a of added)assert(a.identityOnly&&queued.profiles.some(p=>p.name===a.name)&&a.evidenceNote&&a.sourceUrl);
 }else assert.deepEqual(currentData,priorData,file+' preserved');
}
console.log(JSON.stringify({historicalMaps:c.maps.length,reusablePreviews:c.maps.filter(m=>m.preview).length,linkOnlyRecords:c.maps.filter(m=>!m.preview).length,reviewedProfileConnections:connections,profilesWithMaps:new Set(c.maps.flatMap(m=>(m.profileLinks||[]).map(l=>l.profileSlug))).size,originalDataAndGeometry:'preserved',reciprocalLinks:'passed',noJSSourceLinks:'passed'}));
