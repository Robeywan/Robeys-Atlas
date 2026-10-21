import fs from 'node:fs';
import assert from 'node:assert/strict';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const boundaries=read('data/map-regions.geojson'),index=read('data/region-associations.json'),profiles=read('dist/data/profiles.json'),coverage=read('dist/data/map-coverage.json');
const ids=boundaries.features.map(f=>f.id),idSet=new Set(ids),home=fs.readFileSync('dist/index.html','utf8');
assert.equal(idSet.size,ids.length,'Unique administrative region IDs');
assert.equal(ids.filter(id=>id.startsWith('US-')).length,51,'50 U.S. states plus DC');
assert.equal(ids.filter(id=>id.startsWith('CA-')).length,13,'13 Canadian provinces/territories');
const pairs=new Set(),seen=new Set();
for(const a of index.associations){
 const p=profiles.find(p=>a.originalId?p.originalId===a.originalId:p.name===a.name);
 assert(p&&p.name===a.name,'Exact canonical destination for '+a.name);
 assert(idSet.has(a.regionId),'Known region '+a.regionId);
 assert(a.evidenceNote&&a.period&&a.associationType&&/^\d{4}-\d{2}-\d{2}$/.test(a.reviewDate),'Evidence scope and date');
 for(const url of [a.sourceUrl,...(a.supportingSourceUrls||[])])assert(new URL(url).protocol==='https:');
 const key=[a.regionId,p.slug,a.associationType,a.sourceUrl].join('|');assert(!seen.has(key),'Duplicate connection');seen.add(key);
 pairs.add(a.regionId+'|'+p.slug);
}
for(const id of ids){
 const key=id.toLowerCase(),page=fs.readFileSync('dist/regions/'+key+'/index.html','utf8');
 assert(home.includes('data-map-region="'+id+'"')&&home.includes('id="map-template-'+id+'"'),'Working SVG link and selection template');
 assert(page.includes('../../index.html#map'),'Real static route back to map');
 const expected=[...pairs].filter(p=>p.startsWith(id+'|')).length;
 const list=(page.match(/<ul class="map-nations">([\s\S]*?)<\/ul>/)||[])[1]||'';
 assert.equal((list.match(/<li>/g)||[]).length,expected,'One name per profile in '+id);
 if(!expected)assert(page.includes('does not mean Indigenous peoples are absent'),'No absence inference');
}
assert(home.includes('id="map-selection-status"')&&home.includes('role="status"'),'Selection announcement');
assert(!/<path[^>]+(?:NaN|Infinity)/.test(home),'Finite projected map geometry');
assert(fs.readFileSync('dist/regions/ca-mb/index.html','utf8').includes('https://fourarrowsrha.org/about-farha/'),'Identity evidence retained beside location evidence');
assert.equal(coverage.regions,ids.length);assert.equal(coverage.associations,index.associations.length);
assert.equal(coverage.regionsWithResults,new Set(index.associations.map(a=>a.regionId)).size);
assert(home.includes('Natural Earth')&&home.includes('Modern borders'),'Provenance and geographic scope visible');
console.log(JSON.stringify({regions:ids.length,associations:index.associations.length,uniqueRegionProfilePairs:pairs.size,regionsWithResults:coverage.regionsWithResults,staticRoutes:'passed',evidenceLinks:'passed',emptyRegionMessaging:'passed'}));

const progress=read('dist/data/map-profile-progress.json');assert.equal(progress.length,profiles.length);assert.equal(new Set(progress.map(p=>p.slug)).size,profiles.length);assert.equal(progress.filter(p=>p.regions.length).length,coverage.linkedProfiles);assert.equal(progress.filter(p=>!p.regions.length).length,coverage.entriesAwaitingMap);
for(const name of ['Lake Superior','Lake Michigan','Lake Huron','Lake Erie','Lake Ontario'])assert(home.includes('data-lake-name="'+name+'"'),'Great Lake rendered: '+name);
assert(home.indexOf('data-map-lakes')>home.indexOf('data-map-region="US-MI"'),'Lake overlay above Michigan administrative waters');
assert(fs.readFileSync('dist/nations/achumawi/index.html','utf8').includes('../../index.html?place=US-CA#map'),'Profile links back to sourced region');
assert(fs.readFileSync('dist/regions/coverage/index.html','utf8').includes('Awaiting regional evidence'),'Visible all-entry coverage ledger');
