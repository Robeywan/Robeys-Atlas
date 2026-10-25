// Profile decoration is tracked separately from research adequacy and evidence.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';

const readJSON = (filename, fallback) => fs.existsSync(filename)
  ? JSON.parse(fs.readFileSync(filename, 'utf8').replace(/^\uFEFF/, ''))
  : fallback;
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g,
  c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const isHTTP = value => /^https?:\/\//.test(String(value || ''));
const inspected = p => (p.sources || []).filter(s => s.contentReviewedAt);
const researchDigest = p => createHash('sha256').update(JSON.stringify({
  overview:p.overview, sections:p.sections, sources:inspected(p)
})).digest('hex');
const webAsset = value => {
  const asset = String(value || '').replace(/\\/g, '/').replace(/^\/+/, '');
  if (!asset.startsWith('assets/') || asset.split('/').includes('..') || /[\r\n]/.test(asset)) {
    throw Error('Profile visual image must be a local assets/ path: ' + value);
  }
  return asset;
};
const assetURL = (base, asset) => base + asset.split('/').map(encodeURIComponent).join('/');
const localDate = () => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone:'America/Denver', year:'numeric', month:'2-digit', day:'2-digit'
  }).formatToParts(new Date());
  const part = type => parts.find(p => p.type === type).value;
  return `${part('year')}-${part('month')}-${part('day')}`;
};

export function buildProfileVisuals(profiles, directoryDesigns, cwd) {
  const updatedAt = localDate();
  const targetsPath = path.join(cwd, 'data/profile-visual-targets.json');
  const targets = readJSON(targetsPath, {slugs:[], researchBaseline:{}});
  const manifest = readJSON(path.join(cwd, 'data/profile-visual-assets.json'), {images:[]});
  const selected = new Set(targets.slugs || []);
  const baseline = {...(targets.researchBaseline || {})};
  const enrolled = [];
  const currentSlugs = new Set(profiles.map(p => p.slug));
  if (currentSlugs.has(undefined)) throw Error('Profile visual preparation requires normalized profile slugs.');

  // A new evidence-backed research update also schedules the matching visuals.
  // The root baseline records the existing state, so old guides are not promoted.
  for (const p of profiles) {
    const digest = researchDigest(p);
    if (inspected(p).length && baseline[p.slug] !== digest) {
      if (!selected.has(p.slug)) enrolled.push(p.slug);
      selected.add(p.slug);
    }
    baseline[p.slug] = digest;
  }
  for (const slug of selected) {
    if (!currentSlugs.has(slug)) throw Error('Unknown profile visual target: ' + slug);
  }

  const images = (manifest.images || []).map(image => {
    if (!image.id || !Array.isArray(image.profileSlugs) || !image.profileSlugs.length) {
      throw Error('Profile visual image needs an id and reviewed profileSlugs.');
    }
    const asset = webAsset(image.asset);
    for (const field of ['title','credit','scope','reviewedAt','alt','rightsLabel']) {
      if (!String(image[field] || '').trim()) throw Error(`Missing ${field} for profile visual ${image.id}.`);
    }
    if (!isHTTP(image.sourceUrl) || !isHTTP(image.rightsUrl)) {
      throw Error('Profile visual image needs source and rights URLs: ' + image.id);
    }
    if (!fs.existsSync(path.join(cwd, 'dist', asset))) {
      throw Error('Missing profile visual image asset: ' + asset);
    }
    for (const slug of image.profileSlugs) {
      if (!currentSlugs.has(slug)) throw Error(`Unknown image association ${slug}: ${image.id}.`);
    }
    const contextSources=(image.contextSources||[]).map(source=>{
      if(!isHTTP(source.url)||!source.title)throw Error('Invalid profile image context source: '+image.id);
      return source;
    });
    return {...image, asset, contextSources};
  });
  const imageIds = images.map(image => image.id);
  if (new Set(imageIds).size !== imageIds.length) throw Error('Duplicate profile visual image ids.');

  const treatments = profiles.filter(p => selected.has(p.slug)).map(p => {
    const directory = directoryDesigns.bySlug.get(p.slug);
    if (!directory) throw Error('Missing directory palette for profile: ' + p.slug);
    const available = images.filter(image => image.profileSlugs.includes(p.slug));
    const selectedImages = available.slice(0, 3);
    const apache = p.originalId === 16 || p.slug === 'apache';
    const checks = inspected(p).filter(s => s.countsTowardMinimum !== false).length;
    const adequate = /^Adequate/.test(p.initialAdequacy?.status || '');
    const eligibilityBasis = adequate ? 'Explicit initial-adequacy assessment'
      : p.coverageLevel === 'developed-profile'
        ? (checks ? 'Published developed profile' : 'Legacy developed profile; inspected-source assessment pending')
        : 'Evidence-backed research update since the recorded baseline';
    const style = [
      `--profile-paper:${directory.paper}`,
      `--profile-accent:${directory.accent}`,
      `--profile-hue:${directory.hue}`,
      `--profile-angle:${directory.angle}deg`,
      `--profile-photo:${selectedImages.length ? `url("${assetURL('../../', selectedImages[0].asset)}")` : 'none'}`
    ].join(';');
    return {
      slug:p.slug, name:p.name, originalId:p.originalId || null,
      paper:directory.paper, accent:directory.accent, hue:directory.hue,
      angle:directory.angle, composition:directory.composition,
      images:selectedImages, eligibilityBasis,
      imageCoverage:{
        status:apache ? 'Existing Apache collage retained'
          : selectedImages.length ? 'Verified photographs with scoped credits' : 'Decorative treatment; authentic imagery pending',
        available:available.length, used:selectedImages.length
      },
      style, preserveExistingApache:apache,
      treatmentStatus:apache ? 'Existing custom treatment retained' : 'Card-coordinated profile backdrop prepared',
      researchComplete:p.researchComplete === true,
      initialAdequacy:p.initialAdequacy?.status || 'Not assessed',
      substantiveInspectedSources:checks
    };
  });
  const catalogue = {
    updatedAt,
    scope:'Visual treatments for published developed profiles, explicitly adequate initial introductions, and later evidence-backed updates. Visual completion does not establish research completion or community endorsement. Apache retains its existing independent collage.',
    decoration:'Neutral abstract interface forms are not attributed Indigenous artwork, traditional motifs, territorial maps, or historical reconstructions. Authentic photographs require reviewed identity, relevance, scope, and reuse records.',
    summary:{
      selectedProfiles:treatments.length,
      existingApache:treatments.filter(t => t.preserveExistingApache).length,
      newProfileTreatments:treatments.filter(t => !t.preserveExistingApache).length,
      newTreatmentsWithPhotographs:treatments.filter(t => !t.preserveExistingApache && t.images.length).length,
      decorativeTreatmentsAwaitingPhotographs:treatments.filter(t => !t.preserveExistingApache && !t.images.length).length,
      autoEnrolledThisBuild:enrolled
    },
    treatments
  };
  fs.writeFileSync(targetsPath, JSON.stringify({...targets, slugs:[...selected].sort(), researchBaseline:baseline}, null, 2) + '\n');
  fs.writeFileSync(path.join(cwd, 'data/profile-visual-progress.json'), JSON.stringify(catalogue, null, 2) + '\n');
  const bySlug = new Map(treatments.map(record => [record.slug, record]));
  const byName = new Map(treatments.map(record => [record.name, record]));

  function banner(p, base='../../', e=escapeHTML) {
    const record = bySlug.get(p.slug);
    if (!record || record.preserveExistingApache) return '';
    const composition = /^[a-z-]+$/.test(record.composition) ? record.composition : 'arc';
    if (record.images.length) {
      return `<div class="profile-visual-banner has-photographs composition-${composition}" aria-label="${e(p.name)} photographs"><div class="profile-visual-photographs photo-count-${record.images.length}">${record.images.map(image => `<figure><img src="${e(assetURL(base, image.asset))}" alt="${e(image.alt)}" loading="lazy" decoding="async"><figcaption>${e(image.title)}<span>${e(image.credit)}</span></figcaption></figure>`).join('')}</div><a class="profile-visual-credit-link" href="#profile-image-credits">Photographs &amp; credits ↓</a></div>`;
    }
    const initial = [...p.name][0] || '';
    return `<div class="profile-visual-banner is-decorative composition-${composition}"><div class="profile-visual-intro"><span class="eyebrow">A space for discovery</span><p>${e(p.name)}</p><a class="profile-visual-credit-link" href="#profile-image-credits">About this backdrop ↓</a></div><div class="profile-visual-composition" aria-hidden="true"><span>${e(initial)}</span><i></i><b></b></div></div>`;
  }

  function credits(p, base='../../', e=escapeHTML) {
    const record = bySlug.get(p.slug);
    if (!record || record.preserveExistingApache) return '';
    const content = record.images.length
      ? `<p>These photographs have individual, documented connections to this entry. Their captions and source records define the people, place, object, and period shown; no one photograph represents every community within a broader label.</p>${record.images.map(image => `<div class="profile-visual-credit-record"><p><strong>${e(image.title)}</strong><br>${e(image.credit)}</p><p><a href="${e(image.sourceUrl)}" target="_blank" rel="noopener noreferrer">Source &amp; image record ↗</a> · <a href="${e(image.rightsUrl)}" target="_blank" rel="noopener noreferrer">${e(image.rightsLabel)}</a></p><p>${e(image.scope)}</p>${image.contextSources.length?`<p class="profile-visual-context"><strong>Context and identification sources</strong></p><ul>${image.contextSources.map(source=>`<li><a href="${e(source.url)}" target="_blank" rel="noopener noreferrer">${e(source.title)} ↗</a></li>`).join('')}</ul>`:''}<p class="profile-visual-review">Image, association, and reuse record reviewed ${e(image.reviewedAt)}.</p></div>`).join('')}<p>Full photographs are displayed proportionally above. A translucent background copy may be cropped by the viewport; it does not replace the complete image or its record.</p>`
      : '<p>This page uses a neutral abstract backdrop coordinated with its directory card. It is interface decoration, not an attributed traditional design or historical reconstruction. Nation-specific photographs are not yet included; they will be added when their identity, relevance, and reuse terms are verified.</p>';
    return `<details class="profile-image-credits" id="profile-image-credits"><summary>${record.images.length ? 'Backdrop photographs &amp; credits' : 'Backdrop design &amp; future photographs'}</summary>${content}<p>The visual treatment does not change the research status, evidence, or remaining gaps recorded in this profile.</p></details>`;
  }
  return {catalogue, bySlug, byName, banner, credits};
}
