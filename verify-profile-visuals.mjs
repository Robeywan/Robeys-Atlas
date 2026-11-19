import fs from 'node:fs';import assert from 'node:assert/strict';
const read=p=>fs.readFileSync(p,'utf8');const data=JSON.parse(read('data/profile-visual-progress.json'));const all=JSON.parse(read('dist/data/profiles.json'));const assets=JSON.parse(read('data/profile-visual-assets.json')).images;
const escapeHref=value=>value.replaceAll('&','&amp;').replaceAll("'",'&#39;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
assert(data.summary.selectedProfiles>=33);assert.equal(data.summary.newProfileTreatments,data.summary.selectedProfiles-1);assert(data.summary.newTreatmentsWithPhotographs>=10);assert.equal(data.summary.newTreatmentsWithPhotographs+data.summary.decorativeTreatmentsAwaitingPhotographs,data.summary.newProfileTreatments);
for(const p of all){const t=data.treatments.find(t=>t.slug===p.slug);const html=read(`dist/nations/${p.slug}/index.html`);assert.equal(html.includes('class="custom-profile-page"'),!!t&&p.originalId!==16,p.slug);if(t&&p.originalId!==16){assert(html.includes('profile-image-credits'));assert(html.includes('profile-visual-banner'));for(const image of t.images){assert(fs.existsSync('dist/'+image.asset));assert(html.includes(escapeHref(image.sourceUrl)),p.slug+' image source link');assert(image.rightsLabel&&image.rightsUrl&&image.credit&&image.scope);}}}
assert(assets.length>=10);const deferred=JSON.parse(read('data/profile-visual-assets.json')).deferred||[];assert(!assets.some(a=>deferred.some(d=>d.sourceUrl===a.sourceUrl)));assert(read('dist/nations/apache/index.html').includes('apache-collage-intro'));

const updatedPhotoOption = process.argv.indexOf('--updated-photos');
if (updatedPhotoOption !== -1) {
  const slugs = process.argv.slice(updatedPhotoOption + 1);
  assert(slugs.length > 0, 'Supply at least one updated profile slug');
  const designs = JSON.parse(read('data/directory-card-designs.json')).designs;
  for (const slug of new Set(slugs)) {
    const profile = all.find(row => row.slug === slug);
    assert(profile, 'Unknown profile: ' + slug);
    const design = designs.find(row => row.slug === slug);
    assert(design?.kind === 'photograph' && design.source && design.rightsUrl && design.credit, slug + ' needs a credited card photograph');
    assert(fs.existsSync('dist/' + design.image), slug + ' needs a published card image');
    const guide = read('dist/nations/' + slug + '/index.html');
    if (profile.originalId === 16) {
      assert(guide.includes('apache-collage-intro'), slug + ' needs its credited photo gallery');
    } else {
      const treatment = data.treatments.find(row => row.slug === slug);
      assert(treatment?.images?.length && guide.includes('profile-visual-photographs'), slug + ' needs a guide photograph');
      assert(treatment.images.some(image => {
        return guide.includes(image.asset) && guide.includes(escapeHref(image.sourceUrl)) &&
          guide.includes(escapeHref(image.rightsUrl)) && image.alt && image.credit && image.scope;
      }), slug + ' needs a published, described and attributed photograph');
    }
  }
}

console.log(JSON.stringify({...data.summary,profileRoutesAndCredits:'passed',apachePrototype:'preserved',deferredImages:'not published'}));
