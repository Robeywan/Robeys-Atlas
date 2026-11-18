// A connection is a reviewed navigation record, never an inferred territory.
const nonempty = value => typeof value === 'string' && value.trim().length > 0;
const fail = message => { throw new Error('Map connections: ' + message); };

function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
  const date = new Date(value + 'T12:00:00Z');
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function validSourceURL(value) {
  if (!nonempty(value) || value !== value.trim() || /[\s\\\u0000-\u001f\u007f]/u.test(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !!url.hostname && !url.username && !url.password;
  } catch { return false; }
}

export function latestConnectionReviewAt(connections) {
  if (!Array.isArray(connections)) fail('connection records must be an array');
  for (const connection of connections) if (!validDate(connection.reviewDate)) fail('each connection needs its own valid reviewDate');
  return connections.map(connection => connection.reviewDate).sort().at(-1) || null;
}

export function resolveMapConnections({profiles, regions, index, gaps}) {
  if (!Array.isArray(profiles) || !Array.isArray(regions) || !Array.isArray(index?.associations)) fail('profiles, regions and association index must be arrays');
  if (gaps?.schemaVersion !== '1.0' || !Array.isArray(gaps.gaps)) fail('map-connection-gaps.json schemaVersion 1.0 and gaps array are required');
  const byName = new Map(), bySlug = new Map(), byOriginalId = new Map(), regionIds = new Set();
  for (const profile of profiles) {
    if (!nonempty(profile.name) || !nonempty(profile.slug) || byName.has(profile.name) || bySlug.has(profile.slug)) fail('canonical profile names and slugs must be nonempty and unique');
    byName.set(profile.name, profile); bySlug.set(profile.slug, profile);
    if (profile.originalId != null) {
      if (!Number.isInteger(profile.originalId) || profile.originalId <= 0 || byOriginalId.has(profile.originalId)) fail('canonical original IDs must be positive unique integers');
      byOriginalId.set(profile.originalId, profile);
    }
  }
  for (const region of regions) {
    if (!nonempty(region.id) || regionIds.has(region.id)) fail('region IDs must be nonempty and unique');
    regionIds.add(region.id);
  }
  const seen = new Set(), connected = new Set();
  const associations = index.associations.map(association => {
    if (!association || typeof association !== 'object') fail('association must be a record');
    const profile = association.originalId != null ? byOriginalId.get(association.originalId) : byName.get(association.name);
    if (!profile || profile.name !== association.name) fail('association canonical name/original ID mismatch: ' + String(association.name));
    if (!regionIds.has(association.regionId)) fail('unknown region: ' + String(association.regionId));
    if (!nonempty(association.associationType) || !nonempty(association.evidenceNote) || !nonempty(association.period) || !validDate(association.reviewDate)) fail('connection requires type, evidence, period and its own valid reviewDate: ' + profile.name);
    if (!validSourceURL(association.sourceUrl)) fail('connection requires an exact HTTPS supporting source: ' + profile.name);
    if (association.supportingSourceUrls != null && (!Array.isArray(association.supportingSourceUrls) || association.supportingSourceUrls.some(url => !validSourceURL(url)))) fail('invalid supporting source URL: ' + profile.name);
    const key = JSON.stringify([association.regionId, profile.slug, association.associationType, association.sourceUrl]);
    if (seen.has(key)) fail('duplicate association: ' + profile.name + ' / ' + association.regionId);
    seen.add(key); connected.add(profile.slug);
    return {...association, profile};
  });
  const gapBySlug = new Map();
  for (const gap of gaps.gaps) {
    if (!gap || typeof gap !== 'object' || Array.isArray(gap) || Object.keys(gap).sort().join('|') !== 'name|reason|slug' || !nonempty(gap.reason)) fail('each geographic gap requires only exact name, slug and a nonempty reason');
    const profile = bySlug.get(gap.slug);
    if (!profile || profile.name !== gap.name) fail('geographic gap canonical name/slug mismatch: ' + String(gap.name));
    if (gapBySlug.has(gap.slug)) fail('duplicate geographic gap: ' + gap.name);
    if (connected.has(gap.slug)) fail('stale geographic gap for an already connected profile: ' + gap.name);
    gapBySlug.set(gap.slug, gap);
  }
  const missing = profiles.filter(profile => !connected.has(profile.slug) && !gapBySlug.has(profile.slug));
  if (missing.length) fail('profile has neither a reviewed region connection nor an explicit geographic gap: ' + missing.map(profile => profile.name + ' [' + profile.slug + ']').join('; '));
  return {associations, gapBySlug};
}
