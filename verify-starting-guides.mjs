import fs from 'node:fs';
import assert from 'node:assert/strict';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const profiles=read('dist/data/profiles.json');
const manifest=read('dist/data/catalogue-manifest.json');
const batches=manifest.startingCohorts||['twenty-profile-batch-01.json'];
const images=read('data/profile-visual-assets.json').images;
const policy=read('dist/data/starter-guide-policy.json');
assert.equal(policy.fixedSourceMinimum,null);
assert.equal(manifest.currentStartingCohort,batches.at(-1));
let selections=0,startingProfiles=0;
for(const file of batches){
const batch=read('dist/data/'+file);
assert.equal(batch.profiles.length,20);
for(const row of batch.profiles){
  const p=profiles.find(p=>p.slug===row.slug);assert(p,row.slug);
  const guide=p.startingGuide;assert(guide&&guide.fixedSourceMinimum===null,row.slug);
  assert(guide.sources.length>=1&&guide.sources.length<=4,row.slug);
  const image=images.find(image=>image.id===guide.imageRecordId);
  assert(image&&image.profileSlugs.includes(row.slug),row.slug+' lacks reviewed image association');
  assert(fs.existsSync('dist/'+image.asset),row.slug+' missing image asset');
  assert.equal(new Set(guide.sources.map(x=>x.sourceId)).size,guide.sources.length);
  const html=fs.readFileSync(`dist/nations/${p.slug}/index.html`,'utf8');
  assert(html.includes('id="start-reading"')&&html.includes('profile-image-credits'),row.slug);
  for(const selected of guide.sources){
    const i=p.sources.findIndex(s=>s.id===selected.sourceId);assert(i>=0,row.slug);
    const s=p.sources[i];assert(s.contentReviewedAt&&s.countsTowardMinimum!==false,row.slug);
    assert(html.includes(`href="#source-${i+1}"`),row.slug);selections++;
  }
  assert.notEqual(p.researchComplete,true,row.slug);
  startingProfiles++;
}
}
const links=read('dist/data/owner-map-links.json');
assert(links.links.length>=180);
assert.equal(new Set(links.links.map(l=>l.url)).size,links.links.length);
const room=fs.readFileSync('dist/historical-maps/index.html','utf8');
for(const l of links.links){assert.equal(new URL(l.url).protocol,'https:');assert.equal(l.imageReproduced,false);assert(l.inspectionScope&&l.reviewStatus);assert(room.includes(l.url.replaceAll('&','&amp;')),l.url);}
assert(room.includes('id="supplied-map-links"')&&room.includes('separate from the inspected map count'));
const maps=read('dist/data/historical-maps.json').maps;
for(const id of ['historical-kiowa-range-mooney-1899','historical-us-reservations-1895-ou']){
  const m=maps.find(x=>x.id===id);assert(m&&!m.preview&&m.profileLinks.length===0&&m.inspection.imageViewed===false,id);
}
console.log(JSON.stringify({startingProfiles,cohorts:batches.length,selectedReadingRoutes:selections,ownerArchiveLinks:links.links.length,minimumRequired:false,sourceAnchors:'passed',imageAssociations:'passed',mapImagesNotAdded:true}));
