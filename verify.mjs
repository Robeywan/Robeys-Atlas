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
function walk(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,item.name);if(item.isDirectory())walk(file);else if(file.endsWith('.html'))check(file);}}
function check(file){const html=fs.readFileSync(file,'utf8');assert(html.includes('<h1'),file+' has no h1');const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){const ref=m[1].replace(/&amp;/g,'&');if(/^(https?:|mailto:|data:)/.test(ref))continue;const [loc,hash]=ref.split('#');const noQuery=loc.split('?')[0];let dest=noQuery?path.resolve(path.dirname(file),noQuery):file;if(noQuery.startsWith('/'))dest=path.join(root,noQuery);if(fs.existsSync(dest)&&fs.statSync(dest).isDirectory())dest=path.join(dest,'index.html');linkCount++;if(!fs.existsSync(dest)){errors.push(path.relative(root,file)+' -> '+ref);continue;}if(hash){anchors++;const target=dest===file?ids:new Set([...fs.readFileSync(dest,'utf8').matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]));if(!target.has(hash))errors.push(path.relative(root,file)+' -> missing #'+hash);}}}
walk(root);
assert.equal(errors.length,0,errors.slice(0,20).join('\n'));
for(const p of profiles){assert(p.sources.length>0,p.name+' lacks sources');assert(p.sections.length>0,p.name+' lacks sections');for(const section of p.sections){assert(section.sourceIds.length>0);for(const id of section.sourceIds)assert(p.sources.some(s=>s.id===id),p.name+' bad source reference');}}
console.log(JSON.stringify({profiles:profiles.length,original:original.length,additions:profiles.length-original.length,internalLinksChecked:linkCount,citationAnchorsChecked:anchors,errors:0}));
