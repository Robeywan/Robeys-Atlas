const fs = require('fs');
const file='work/nations-atlas/data/profiles.json';
const all=JSON.parse(fs.readFileSync(file,'utf8'));
const p=all.find(x=>x.originalId===209);
if(!p)throw new Error('Mescalero profile missing');
const url='https://pmc.ncbi.nlm.nih.gov/articles/PMC5785102/';
if(p.sources.some(s=>s.url===url))throw new Error('Source already present');
const id='p209-s6';
p.sources.push({
 id,
 title:'The piloting of a culturally centered American Indian family prevention program: a CBPR partnership between Mescalero Apache and the University of New Mexico',
 author:'Lorenda Belone, Ardena Orosco, Eloise Damon, Willymae Smith-McNeal, Rebecca Rae, Mingma L. Sherpa, Orrin B. Myers, Anslem O. Omeh, and Nina Wallerstein; coauthors include Mescalero Apache Prevention Program and System of Care staff',
 publisher:'Public Health Reviews 38 (2017), article 30; University of New Mexico and Mescalero Apache community partnership; PubMed Central open-access copy',
 url,
 type:'Peer-reviewed community-based participatory research',
 topics:['Mescalero Apache community research','Family Listening Program','Language and cultural education','Texas homeland context'],
 publicationDate:'December 22, 2017',
 annotation:'A peer-reviewed article coauthored by University of New Mexico researchers and staff affiliated with the Mescalero Apache Prevention Program and System of Care. It reports that the Tribe requested the partnership, that a Tribal Council resolution supported co-writing and co-submission, and that a Mescalero Apache Tribal Research Team adapted and piloted a family program. The authors state the manuscript received Tribal Council and Southwest Tribal IRB approval. The study concerns a specific 2013–2014 pilot, not current program availability, all Mescalero families, or long-term outcomes. Its brief historical statements—including a broad homeland context spanning parts of Texas, Arizona and Mexico—remain attributed to the article; the underlying historical records were not checked here. The Atlas does not reproduce curriculum materials, participant data, images, or private content.',
 accessed:'2026-10-23',
 contentReviewedAt:'2026-10-23',
 contentReviewScope:'Read the open-access article body: publication metadata, abstract, research-partnership and historical-background sections, team formation and curriculum adaptation, pilot design and sample, selected results, discussion/conclusion, acknowledgments, approval statement and data-availability note (visible sections around lines 33–160, 176–215, 224–300 and 373). The pilot is discussed only as a dated collaborative research project; small sample, incomplete follow-up, short duration, and the authors’ statement that no difference in substance use was observed are kept in view. No participant-level data, session materials, images or follow-up study results were accessed. Cited historical works were not independently reviewed.',
 countsTowardMinimum:true,
 sourceKind:'Peer-reviewed community-based participatory research'
});
function sec(name){const s=p.sections.find(x=>x.title===name);if(!s)throw new Error('Section missing: '+name);return s;}
let s=sec('A present-day Tribe and its own public history');
s.text += ' A 2017 peer-reviewed article by University of New Mexico and Mescalero Apache program staff describes a Tribe-requested research partnership, a Tribal Council resolution to co-write and co-submit the project, and a Mescalero Apache Tribal Research Team that adapted and piloted a family program. The article says the publication was approved by the Tribal Council and Southwest Tribal IRB. This documents a dated community-based research process, not current program delivery or a universal description of Mescalero family life.';
if(!s.sourceIds.includes(id))s.sourceIds.push(id);
s=sec('Texas connections across a wide homeland');
s.text += ' The collaborative study also describes Mescalero homelands across the current reservation and broader Southwest regions of Texas, Arizona and Mexico. This is the article’s broad historical framing, not a boundary survey; its underlying historical sources were not independently checked here.';
if(!s.sourceIds.includes(id))s.sourceIds.push(id);
s=sec('Historical names and changing political conditions');
s.text += ' The study provides a dated background on the three bands brought together at the reservation and on family connections to ancestral bands, while noting that the present institutional community formed through reorganization. These statements are attributed to the authors and are read alongside the Tribe’s own public account and dated constitution.';
if(!s.sourceIds.includes(id))s.sourceIds.push(id);
s=sec('Reading path and open questions');
s.text += ' Read the 2017 Mescalero Apache–University of New Mexico study as a specific example of Tribal-directed, co-produced research and a family curriculum pilot, not as a current program directory. The pilot ran in 2013–2014 with a small participant group and short follow-up; the article itself says its long-term impact required further evaluation. Its broader homeland statements should be checked against the Tribe’s own sources and the underlying historical evidence.';
if(!s.sourceIds.includes(id))s.sourceIds.push(id);
p.reviewedAt='2026-10-23';
p.initialAdequacy.reviewedAt='2026-10-23';
p.initialAdequacy.rationale='Six substantive works now provide a useful initial path across the Tribe’s own public identity and reservation account, a dated posted constitution, a Texas-focused government synthesis whose source pool and draft received THPO input, an NPS regional interpretation, and a peer-reviewed Mescalero Apache–University of New Mexico participatory-research article coauthored with Mescalero program staff. The new article documents a Tribe-requested, Tribal Council/IRB-approved 2013–2014 family-program pilot and contributes a dated, attributed homeland framing. It does not establish current service availability or long-term outcomes. This is an adequate initial introduction, not a deep dive, complete history, community endorsement, or claim that the source target is met.';
if(!p.initialAdequacy.remainingLimits.some(x=>x.includes('2013–2014 family-program pilot')))p.initialAdequacy.remainingLimits.push('The 2017 participatory-research article concerns a small 2013–2014 pilot with incomplete follow-up; it does not establish current services, community-wide outcomes, or long-term effects. Its broader homeland description is not a boundary survey.');
if(!p.researchGaps.some(x=>x.includes('2017 participatory-research article')))p.researchGaps.push('The 2017 participatory-research article documents a Tribe-requested pilot and includes a broad historical homeland summary, but its cited historical sources were not independently reviewed and it does not establish current family-program availability or outcomes.');
fs.writeFileSync(file,JSON.stringify(all,null,2)+'\n','utf8');
console.log('Updated Mescalero Apache with p209-s6; substantive count '+p.sources.filter(x=>x.countsTowardMinimum!==false).length);
