import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const read=p=>fs.readFileSync(p,'utf8');
const profiles=JSON.parse(read('dist/data/profiles.json'));
const catalogue=JSON.parse(read('dist/data/directory-card-designs.json'));
const entries=catalogue.designs;
assert(profiles.length>=471);assert.equal(entries.length,profiles.length);assert.equal(new Set(entries.map(x=>x.slug)).size,profiles.length);assert.equal(new Set(entries.map(x=>x.signature)).size,profiles.length);
assert.deepEqual(new Set(entries.map(x=>x.slug)),new Set(profiles.map(x=>x.slug)));
const luminance=hex=>{const c=hex.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722;};
const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
let lowest=21;
for(const d of entries){assert(/^#[0-9a-f]{6}$/.test(d.paper));assert(/^#[0-9a-f]{6}$/.test(d.accent));for(const text of ['#293d32','#3e5145',d.accent]){const c=contrast(text,d.paper);assert(c>=4.5,`${d.slug}: insufficient contrast ${c}`);lowest=Math.min(lowest,c);}if(d.image){assert(fs.existsSync('dist/'+d.image));assert(d.credit&&d.source&&d.rights&&d.rightsUrl&&d.scope);}else assert.equal(d.kind,'abstract-decoration');}
const html=read('dist/index.html');const rows=[...html.matchAll(/<li class="nation-row[^]*?data-nation[^]*?<\/li>/g)].map(m=>m[0]);assert.equal(rows.length,profiles.length);
for(const p of profiles){const matches=rows.filter(r=>r.includes(`data-slug="${p.slug}"`));assert.equal(matches.length,1,p.slug);const r=matches[0],d=entries.find(x=>x.slug===p.slug);assert(r.includes(`data-card-design="${d.signature}"`));for(const hook of ['data-search=','data-sort=','data-letter=','data-region=','data-status=','data-sources=','data-reviewed=','data-added='])assert(r.includes(hook),`${p.slug} missing ${hook}`);assert(r.includes(`href="nations/${p.slug}/"`),`${p.slug} missing profile route`);assert(r.includes(`data-bookmark="${p.slug}"`));assert.equal(r.includes('apache-directory-card'),p.originalId===16);assert.equal(r.includes('directory-visual-card'),p.originalId!==16);}
if(process.argv.includes('--check-research-preservation')){const previous=JSON.parse(execFileSync('git',['show','HEAD:data/profiles.json'],{encoding:'utf8',maxBuffer:15e6}));assert.deepEqual(JSON.parse(read('data/profiles.json')),previous,'Research profile source data changed');}
assert(entries.filter(x=>x.kind==='photograph').length>=2);
assert.equal((read('dist/nations/apache/index.html').match(/apache-collage-intro/g)||[]).length,1);
for(const p of profiles.filter(p=>p.originalId!==16))assert(!read(`dist/nations/${p.slug}/index.html`).includes('<body class="apache-collage-page">'));
console.log(JSON.stringify({styledEntries:entries.length,uniqueSignatures:new Set(entries.map(x=>x.signature)).size,abstractBackdrops:entries.filter(x=>x.kind==='abstract-decoration').length,creditedPhotographs:entries.filter(x=>x.kind==='photograph').length,minimumTextContrast:Number(lowest.toFixed(2)),routesAndSaveHooks:'passed',researchSourceData:process.argv.includes('--check-research-preservation')?'unchanged':'not compared to previous commit',apacheDesign:'preserved'}));
