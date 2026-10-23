const fs = require('fs');
const path = 'work/nations-atlas/data/profiles.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const p = data.find(x => x.name === 'Atakapa');
if (!p) throw new Error('Atakapa profile missing');
if (p.sources.some(s => s.url === 'https://www.texasobserver.org/mapping-indigenous-communities-of-texas-atakapa-ishak/')) throw new Error('Source already present');
const sid = 'p21-s18';
p.sources.push({
  id: sid,
  title: 'Mapping Indigenous Communities of Texas: Atakapa Ishak',
  author: 'Pauly Denetclaw; interview with Mary LeBlanc',
  publisher: 'The Texas Observer',
  url: 'https://www.texasobserver.org/mapping-indigenous-communities-of-texas-atakapa-ishak/',
  type: 'Reported community interview / oral-history source',
  topics: ['Akokisa self-identification', 'Community perspectives', 'Southeast Texas geography', 'Public history'],
  publicationDate: 'September 3, 2021',
  annotation: 'A Texas Observer Indigenous Affairs reporter interviews Mary LeBlanc, identified in the article as Akokisa and a retired Atakapa-Ishak Nation council member. The publication says its Unceded project worked with tribal representatives to map homelands and significant places on their own terms. LeBlanc discusses distinctions among clan names, local geography, community life and her recollections of place and change. These are a named community member’s reported perspectives, not independently verified archaeological conclusions or a statement for every Atakapa/Ishak community. The article includes sensitive cultural-site discussion and an accompanying map; the Atlas does not reproduce the map or disclose nonpublic ceremonial locations.',
  accessed: '2026-10-23',
  contentReviewedAt: '2026-10-23',
  contentReviewScope: 'Read the complete visible article, including author/interviewee identification, project context and interview through the final learning-resources question. The interviewee’s statements about ancient continuity, mound dimensions and functions, and historical movement are retained only as her attributed account, not independently checked. Potentially sensitive ceremonial-location details are not repeated. The accompanying map image and its underlying geographic evidence were not separately inspected or reused.',
  countsTowardMinimum: true
});
const sec = title => p.sections.find(s => s.title === title);
let s = sec('Names and community scope');
s.text += ' A 2021 Texas Observer interview with Mary LeBlanc, identified by the reporter as Akokisa and a retired Nation council member, offers her account of clan names and local geography. The newspaper says its Unceded project worked with tribal representatives on mapping homelands on their own terms. These are LeBlanc’s reported perspectives; the article’s map is not treated here as boundary evidence, and sensitive ceremonial locations are not reproduced.';
if (!s.sourceIds.includes(sid)) s.sourceIds.push(sid);
s = sec('Gulf Coast history and colonial records');
s.text += ' LeBlanc also gives a first-person account of mound use, continuity and change in the region. Those statements are attributed to her and are not independently verified archaeological findings in this guide.';
if (!s.sourceIds.includes(sid)) s.sourceIds.push(sid);
s = sec('Contemporary communities and coastal life');
s.text += ' The Observer interview adds one named Akokisa elder’s perspective on community continuity, visibility and safety in southeast Texas. It should be read alongside the Nation’s own pages and Grand Bayou’s separately scoped accounts, not generalized to all present groups.';
if (!s.sourceIds.includes(sid)) s.sourceIds.push(sid);
s = sec('Identity, art and cultural memory');
// Avoid adding ceremony or sensitive-site detail in this section.
s = sec('Reading path');
if (s) { s.text += ' The Texas Observer interview is a useful first-person supplement on Akokisa naming and southeast Texas community history; compare it with the Nation’s own public account and distinguish LeBlanc’s recollections from independently corroborated archaeological evidence. Its accompanying map has not been independently reviewed or reused.'; if (!s.sourceIds.includes(sid)) s.sourceIds.push(sid); }
p.reviewedAt = '2026-10-23';
const adequacy = p.initialAdequacy;
adequacy.reviewedAt = '2026-10-23';
adequacy.rationale = 'Twelve substantive resources have now been inspected, including two distinct first-party Nation pages, a collaborative language resource, historical linguistic material and a bounded specialist-grammar excerpt, the Handbook of Texas synthesis, a detailed public-history essay, first-person work by a Nation member, a community-informed reported interview with an Akokisa elder, and a reported Grand Bayou account. Six short or unread supporting records remain excluded. The new Texas Observer interview adds a perspective from one named Akokisa community member and supports careful discussion of names and local history, but its archaeological and ancient-continuity statements remain attributed recollections; it does not settle relationships among historical groups or represent all contemporary communities. Direct colonial archival, archaeological and broader community-source gaps remain. This is a useful multi-perspective educational starting guide, not a complete history or community review.';
if (!adequacy.remainingLimits.some(x => x.includes('Texas Observer'))) adequacy.remainingLimits.push('The 2021 Texas Observer interview is one elder’s reported perspective; its accompanying map and underlying archaeological evidence were not independently reviewed, and sensitive cultural-site details are deliberately omitted.');
if (!p.gaps.some(x => x.includes('Texas Observer interview'))) p.gaps.push('The Texas Observer interview adds one Akokisa elder’s account, but claims about ancient continuity and mound form/function were not independently checked against archaeological publications; the accompanying map was not reviewed for reuse or connection evidence.');
if (!p.researchGaps.some(x => x.includes('Texas Observer'))) p.researchGaps.push('The 2021 Texas Observer interview supplies an important but individually scoped Akokisa perspective. Independent archaeological and archival corroboration is still needed for historical-site and deep-time statements; sensitive places should not be republished.');
fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log('Updated Atakapa with p21-s18; substantive count', p.sources.filter(x=>x.countsTowardMinimum!==false).length, 'sections', p.sections.length);
