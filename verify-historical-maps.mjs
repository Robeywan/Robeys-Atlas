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
for(const file of ['data/owner-reading-leads.json','data/region-associations.json','data/map-regions.geojson','data/map-lakes.geojson']){
 const baseline=execFileSync('git',['show','630330214d9a85c2b9802c971f335d2cf9cb21ac:'+file],{maxBuffer:50e6});
 const priorData=JSON.parse(baseline),currentData=read(file);
 if(file==='data/region-associations.json'){
  // A reviewed research batch may add a directly sourced modern community
  // location route. Preserve every prior route exactly and permit only the
  // documented Ysleta del Sur Pueblo addition in this batch; geometry and
  // historical-map associations remain independently checked above/below.
  for(const oldAssociation of priorData.associations)
   assert(currentData.associations.some(a=>JSON.stringify(a)===JSON.stringify(oldAssociation)), 'Prior regional association preserved');
  const added=currentData.associations.filter(a=>!priorData.associations.some(old=>JSON.stringify(old)===JSON.stringify(a)));
  assert.deepEqual(added,[{
   regionId:'US-TX',name:'Ysleta del Sur Pueblo',associationType:'Present community/government location',
   period:'Current community connection, documented in Pueblo publications reviewed 2026-10-22',
   sourceUrl:'https://www.ysletadelsurpueblo.org/about-us',
   evidenceNote:'The Pueblo identifies Ysleta, Texas, in the El Paso area as home to its Tigua community and publishes its own current tribal-government and community information. This is a present-day community/government location route only, not a homeland boundary or a complete account of Tigua historical geography.',
   reviewDate:'2026-10-22'
  }], 'Only the evidence-reviewed Ysleta present-location route was added');
 }else if(file==='data/owner-reading-leads.json'){
  // Preserve the full existing catalogue and allow only a newly documented
  // owner-supplied study whose original URLs remain leads pending inspection.
  assert.equal(currentData.addedAt,priorData.addedAt);
  assert.equal(currentData.status,priorData.status);
  assert.equal(currentData.documents.length,priorData.documents.length+1);
  for(let i=0;i<priorData.documents.length;i++)
   assert.deepEqual(currentData.documents[i],priorData.documents[i],'Prior owner-study document preserved: '+priorData.documents[i].key);
  const added=currentData.documents.at(-1);
  assert.equal(added.key,'Jumano_History_Culture_and_Timeline');
  assert.deepEqual(added.originalIds,[151]);
  assert.equal(added.links.length,18);
  assert.equal(new Set(added.links.map(x=>x.url)).size,18);
  assert(added.links.every(x=>x.documentKey===added.key&&x.reviewStatus),'New owner study provenance retained');
 }else assert.deepEqual(priorData,currentData,file+' preserved');
}
console.log(JSON.stringify({historicalMaps:c.maps.length,reusablePreviews:c.maps.filter(m=>m.preview).length,linkOnlyRecords:c.maps.filter(m=>!m.preview).length,reviewedProfileConnections:connections,profilesWithMaps:new Set(c.maps.flatMap(m=>(m.profileLinks||[]).map(l=>l.profileSlug))).size,originalDataAndGeometry:'preserved',reciprocalLinks:'passed',noJSSourceLinks:'passed'}));
