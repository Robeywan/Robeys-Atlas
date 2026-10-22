import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const c=read('data/historical-maps.json'),ids=new Set(),records=new Set();
assert.equal(c.maps.length,12);
for(const m of c.maps){
 assert(!ids.has(m.id));ids.add(m.id);assert(!records.has(m.recordUrl));records.add(m.recordUrl);
 for(const k of ['title','creator','dateLabel','archive','annotation','credit'])assert(m[k]?.length,m.id+' '+k);
 assert(m.year>=1600&&m.year<=1930);assert(m.inspection.scope&&m.inspection.reviewedAt);
 for(const url of [m.recordUrl,m.viewerUrl,m.rights.url])assert(/^https?:\/\//.test(url));
 if(m.preview){assert(fs.existsSync('dist/'+m.preview.path));assert(m.preview.sourceImageUrl&&m.preview.licenseUrl&&m.preview.changes);assert(m.inspection.scope.includes('actual small map image'));}
}
const html=fs.readFileSync('dist/historical-maps/index.html','utf8');
assert.equal((html.match(/data-historic-card/g)||[]).length,12);
for(const m of c.maps)assert(html.includes('id="'+m.id+'"'));
assert(html.includes('<noscript>')&&html.includes('aria-live="polite"'));
assert(fs.readFileSync('dist/index.html','utf8').includes('Explore 12 historical maps'));
for(const file of ['data/profiles.json','data/owner-reading-leads.json','data/region-associations.json','data/map-regions.geojson','data/map-lakes.geojson']){
 const baseline=execFileSync('git',['show','983c24d9edc11105ab850be87fb445f8797bfabe:'+file],{maxBuffer:50e6});
 assert.deepEqual(JSON.parse(baseline),read(file),file+' preserved');
}
console.log(JSON.stringify({historicalMaps:12,reusablePreviews:c.maps.filter(m=>m.preview).length,linkOnlyRecords:c.maps.filter(m=>!m.preview).length,originalDataAndGeometry:'preserved',noJSSourceLinks:'passed'}));
