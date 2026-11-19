import fs from 'node:fs';
import assert from 'node:assert/strict';
import {resolveMapConnections, latestConnectionReviewAt} from './map-connections.mjs';

const clone = value => JSON.parse(JSON.stringify(value));
const profile = (name, slug, originalId = null) => ({name, slug, originalId});
const connection = (name, originalId = null, reviewDate = '2026-10-21') => ({regionId:'US-OH', name, originalId, associationType:'Source-described regional connection', period:'Scope of the recorded source', sourceUrl:'https://example.org/reviewed-context', evidenceNote:'Explicit context recorded for this fixture.', reviewDate});
const old = profile('Existing entry', 'existing-entry', 1), fresh = profile('New Ohio outline', 'new-ohio-outline');
const oldConnection = connection(old.name, 1);
const fixture = () => ({profiles:[clone(old), {...clone(fresh), region:'Ohio', researchLinks:[{url:'https://example.org/name-only', navigationOnly:true}]}], regions:[{id:'US-OH', name:'Ohio'}], index:{reviewedAt:'2026-10-22', associations:[clone(oldConnection)]}, gaps:{schemaVersion:'1.0', gaps:[{name:fresh.name, slug:fresh.slug, reason:'A reviewed modern-region connection has not been assigned.'}]}});
let fixtureChecks = 0;
function rejects(change, pattern) { const input = fixture(); change(input); assert.throws(() => resolveMapConnections(input), pattern); fixtureChecks++; }
const input = fixture(), before = clone(input), resolved = resolveMapConnections(input);
assert.deepEqual(input, before, 'Pure resolution never mutates profile/source records');
assert.equal(resolved.associations.length, 1); assert.equal(resolved.gapBySlug.size, 1);
assert.equal(resolved.gapBySlug.get(fresh.slug).reason,input.gaps.gaps[0].reason,'An explicit unresolved reason remains exact and available for public coverage');
assert.equal(resolved.associations.some(row => row.profile.slug === fresh.slug), false, 'Ohio words and a name-only source link do not invent a map connection'); fixtureChecks++;
rejects(input => input.gaps.gaps = [], /neither.*connection.*gap/);
rejects(input => input.index.associations[0].name = 'Wrong canonical name', /name\/original ID mismatch/);
rejects(input => input.index.associations[0].regionId = 'US-UNKNOWN', /unknown region/);
rejects(input => input.index.associations.push(clone(input.index.associations[0])), /duplicate association/);
rejects(input => delete input.index.associations[0].reviewDate, /own valid reviewDate/);
rejects(input => input.index.associations[0].reviewDate = '2026-02-30', /own valid reviewDate/);
rejects(input => input.index.associations[0].sourceUrl = 'javascript:alert(1)', /exact HTTPS/);
rejects(input => input.gaps.gaps[0].name = 'Wrong name', /gap canonical name\/slug mismatch/);
rejects(input => input.gaps.gaps[0].slug = 'missing-route', /gap canonical name\/slug mismatch/);
rejects(input => input.gaps.gaps.push(clone(input.gaps.gaps[0])), /duplicate geographic gap/);
rejects(input => input.index.associations.push(connection(fresh.name)), /stale geographic gap/);
rejects(input => input.profiles.push(clone(input.profiles[0])), /names and slugs.*unique/);
rejects(input => input.regions.push(clone(input.regions[0])), /region IDs.*unique/);
const dated = fixture(); dated.index.associations.push(connection(fresh.name, null, '2026-11-18')); dated.gaps.gaps = [];
const datedRows = resolveMapConnections(dated).associations;
assert.equal(latestConnectionReviewAt(datedRows.filter(row => row.profile.slug === old.slug)), '2026-10-21', 'A new connection does not renew an unrelated old profile');
assert.equal(latestConnectionReviewAt(datedRows.filter(row => row.profile.slug === fresh.slug)), '2026-11-18');
assert.equal(latestConnectionReviewAt([]), null); fixtureChecks++;

if (process.argv.includes('--fixtures-only')) {
  console.log(JSON.stringify({status:'passed', fixtureChecks, scope:'pure map connection contract and negative fixtures only'}));
} else {
  const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
  const boundaries = read('data/map-regions.geojson'), index = read('data/region-associations.json'), gaps = read('data/map-connection-gaps.json'), profiles = read('dist/data/profiles.json');
  const progress = read('dist/data/map-profile-progress.json'), coverage = read('dist/data/map-coverage.json'), home = fs.readFileSync('dist/index.html','utf8');
  const coveragePage = fs.readFileSync('dist/regions/coverage/index.html','utf8');
  const encode = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const regions = boundaries.features.map(feature => ({id:feature.id || feature.properties.code, name:(feature.id || feature.properties.code)==='US-DC'?'District of Columbia':feature.properties.name}));
  resolveMapConnections({profiles, regions, index, gaps});
  const byName = new Map(profiles.map(profile => [profile.name,profile])), byId = new Map(profiles.filter(profile => profile.originalId).map(profile => [profile.originalId,profile]));
  const expected = new Map(regions.map(region => [region.id,new Map()])), dates = new Map(profiles.map(profile => [profile.slug,[]]));
  const nameUseOnly = new Map();
  for (const association of index.associations) {
    const p = association.originalId != null ? byId.get(association.originalId) : byName.get(association.name);
    expected.get(association.regionId).set(p.slug,p); dates.get(p.slug).push(association.reviewDate);
    const key = association.regionId + '/' + p.slug;
    const historicalNameUse = association.associationType === 'historical-name-use';
    nameUseOnly.set(key, historicalNameUse && nameUseOnly.get(key) !== false);
  }
  const escRE = value => value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const decode = value => value.replace(/&(?:amp|lt|gt|quot|#39);/g, entity => ({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'"}[entity]));
  const listSlugs = (html, base) => {
    const list = html.match(/<ul class="map-nations">([\s\S]*?)<\/ul>/)?.[1] || '';
    return [...list.matchAll(new RegExp('<li><a href="'+escRE(base)+'nations/([^/]+)/"','g'))].map(match => match[1]).sort();
  };
  for (const region of regions) {
    const rows = [...expected.get(region.id).values()].sort((a,b) => a.name.localeCompare(b.name));
    const slugs = rows.map(profile => profile.slug).sort(), key = region.id.toLowerCase().replace(/[^a-z0-9]+/g,'-');
    const page = fs.readFileSync('dist/regions/'+key+'/index.html','utf8');
    const template = home.match(new RegExp('<template id="map-template-'+escRE(region.id)+'">([\\s\\S]*?)</template>'))?.[1];
    assert.notEqual(template, undefined, 'Template exists for '+region.id);
    assert.deepEqual(listSlugs(template,''),slugs,'Selection-template destinations match canonical connections for '+region.id);
    assert.deepEqual(listSlugs(page,'../../'),slugs,'Static-region destinations match canonical connections for '+region.id);
    const svg = home.match(new RegExp('<a\\b[^>]*data-map-region="'+escRE(region.id)+'"[^>]*>([\\s\\S]*?)</a>'))?.[1];
    assert.notEqual(svg,undefined,'SVG navigation target exists for '+region.id);
    const actualTitle = decode(svg.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '');
    assert.equal(actualTitle,region.name+': '+(rows.length?rows.map(profile => nameUseOnly.get(region.id + '/' + profile.slug) ? profile.name + ' (historical name use)' : profile.name).join(', '):'Regional connections awaiting review'),'Hover names match the same index for '+region.id);
  }
  for (const p of profiles) {
    const ids = regions.filter(region => expected.get(region.id).has(p.slug)).map(region=>region.id).sort();
    assert.deepEqual((p.mapRegions || []).map(region=>region.id).sort(),ids,'Compiled mapRegions matches the index for '+p.slug);
    const item = progress.find(item=>item.slug===p.slug); assert(item,'Progress row exists for '+p.slug);
    assert.equal(item.reviewedAt,dates.get(p.slug).slice().sort().at(-1)||null,'Per-profile date is derived from its own connection records');
    if (!ids.length) {
      const gap = gaps.gaps.find(gap => gap.slug === p.slug && gap.name === p.name);
      assert.equal(item.regionalConnectionGap,gap.reason,'Unmapped progress row exposes its exact human-readable reason');
      const row = coveragePage.match(new RegExp('<li><a href="../../nations/'+escRE(p.slug)+'/">[\\s\\S]*?</li>'))?.[0];
      assert(row && row.includes(encode(gap.reason)),'Coverage page exposes the escaped reason beside its own profile');
    } else assert.equal(Object.hasOwn(item,'regionalConnectionGap'),false,'Mapped profiles do not acquire a geographic-gap field');
    const page = fs.readFileSync('dist/nations/'+p.slug+'/index.html','utf8');
    const actual = [...new Set([...page.matchAll(/href="\.\.\/\.\.\/index\.html\?place=([^"&]+)#map"/g)].map(match=>match[1]))].sort();
    assert.deepEqual(actual,ids,'Every profile has the exact reciprocal modern-region links for '+p.slug);
  }
  assert.equal(coverage.entriesAwaitingMap,gaps.gaps.length,'Every unresolved profile has one explicit disposition');
  assert.equal(coverage.latestConnectionReviewAt,index.associations.map(row=>row.reviewDate).sort().at(-1)||null);
  const expectationAt = process.argv.indexOf('--expectations'); let expectedPairs = 0;
  if (expectationAt !== -1) {
    const selected = read(process.argv[expectationAt+1]); assert(Array.isArray(selected),'Explicit reviewed expected-pair array');
    for (const pair of selected) { const p=expected.get(pair.regionId)?.get(pair.slug); assert(p && p.name===pair.name,'Selected source-supported connection exists: '+JSON.stringify(pair)); expectedPairs++; }
  }
  console.log(JSON.stringify({status:'passed',fixtureChecks,regions:regions.length,profiles:profiles.length,explicitGeographicGaps:gaps.gaps.length,expectedPairs,hoverTemplateStaticAndReciprocalParity:'passed',perConnectionDates:'passed'}));
}
