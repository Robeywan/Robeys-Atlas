import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve('dist');
const profiles=JSON.parse(fs.readFileSync(path.join(root,'data/profiles.json'),'utf8'));
const original=profiles.filter(p=>p.originalId);
assert.equal(original.length,454);
assert.equal(new Set(original.map(p=>p.originalId)).size,454);
assert.equal(new Set(profiles.map(p=>p.slug)).size,profiles.length);
let linkCount=0;let anchors=0;const errors=[];
const anchorCache=new Map();
function fileIds(file){if(!anchorCache.has(file))anchorCache.set(file,new Set([...fs.readFileSync(file,'utf8').matchAll(/\bid="([^"]+)"/g)].map(m=>m[1])));return anchorCache.get(file);}
function walk(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,item.name);if(item.isDirectory())walk(file);else if(file.endsWith('.html'))check(file);}}
function check(file){const html=fs.readFileSync(file,'utf8');assert(html.includes('<h1'),file+' has no h1');const ids=fileIds(file);for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){const ref=m[1].replace(/&amp;/g,'&');if(/^(https?:|mailto:|data:)/.test(ref))continue;const [loc,hash]=ref.split('#');const noQuery=loc.split('?')[0];let dest=noQuery?path.resolve(path.dirname(file),noQuery):file;if(noQuery.startsWith('/'))dest=path.join(root,noQuery);if(fs.existsSync(dest)&&fs.statSync(dest).isDirectory())dest=path.join(dest,'index.html');linkCount++;if(!fs.existsSync(dest)){errors.push(path.relative(root,file)+' -> '+ref);continue;}if(hash){anchors++;const target=dest===file?ids:fileIds(dest);if(!target.has(hash))errors.push(path.relative(root,file)+' -> missing #'+hash);}}}
walk(root);
assert.equal(errors.length,0,errors.slice(0,20).join('\n'));
for(const p of profiles){if(p.entryStage==='name-only-outline'){assert(p.added&&!p.originalId&&p.researchStatus==='queued'&&p.researchComplete===false,p.name+' invalid outline status');assert.equal(p.sources.length,0);assert.equal(p.sections.length,0);assert(p.identityVerifiedAt&&p.identificationEvidence?.length,p.name+' lacks identification provenance');continue;}assert(p.sources.length>0,p.name+' lacks sources');assert(p.sections.length>0,p.name+' lacks sections');for(const id of p.overviewSourceIds||[])assert(p.sources.some(s=>s.id===id),p.name+' bad overview reference');for(const section of p.sections){assert(section.sourceIds.length>0);for(const id of section.sourceIds)assert(p.sources.some(s=>s.id===id),p.name+' bad source reference');}}
// Flexible-source policy: quantity compatibility fields never assign initial adequacy.
const progress=JSON.parse(fs.readFileSync(path.join(root,'data/research-progress.json'),'utf8'));
assert.equal(progress.length,profiles.length);
assert.equal(new Set(progress.map(p=>p.slug)).size,profiles.length);
for(const p of profiles){
 const record=progress.find(r=>r.slug===p.slug);
 assert(record,p.name+' missing progress record');
 const checks=p.sources.filter(s=>s.contentReviewedAt&&s.countsTowardMinimum!==false).length;
 assert.equal(record.recordedContentChecks,checks,p.name+' content-check count changed');
 assert.equal(record.minimumSources,12);
 assert.equal(record.sourceMinimumReached,checks>=12,p.name+' legacy quantity flag changed');
 assert.equal(record.sourceTarget,12);
 assert(p.initialAdequacy===undefined||(p.initialAdequacy&&typeof p.initialAdequacy==='object'&&!Array.isArray(p.initialAdequacy)),p.name+' malformed initialAdequacy');
 const expected={status:'Not assessed',reviewedAt:null,rationale:'',remainingLimits:[],...(p.initialAdequacy||{})};
 assert.deepEqual(record.initialAdequacy,expected,p.name+' adequacy must only come from explicit profile fields');
 assert.equal(typeof expected.status,'string');assert(expected.status.trim());
 assert(expected.reviewedAt===null||/^\d{4}-\d{2}-\d{2}$/.test(expected.reviewedAt));
 assert.equal(typeof expected.rationale,'string');
 assert(Array.isArray(expected.remainingLimits)&&expected.remainingLimits.every(x=>typeof x==='string'));
 if(expected.status==='Adequate initial introduction')assert(expected.reviewedAt&&expected.rationale.trim(),p.name+' adequate status needs dated rationale');
}
console.log(JSON.stringify({profiles:profiles.length,original:original.length,additions:profiles.length-original.length,internalLinksChecked:linkCount,citationAnchorsChecked:anchors,errors:0}));
