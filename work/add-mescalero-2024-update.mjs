import fs from 'node:fs';

const file = 'data/profiles.json';
const profiles = JSON.parse(fs.readFileSync(file, 'utf8'));
const p = profiles.find(x => x.originalId === 209);
if (!p) throw new Error('Mescalero profile not found');
if (p.sources.some(s => s.id === 'p209-s8')) throw new Error('p209-s8 already exists');

p.sources.push({
  id: 'p209-s8',
  title: 'Update on the Mescalero Apache Tribe Language & Cultural Program',
  publisher: 'Mescalero Apache Tribe Language & Culture Program',
  url: 'https://mescaleroapachetribe.com/wp-content/uploads/MATLC-Update-for-website.pdf',
  type: 'Tribal language-program update',
  publicationDate: '2024-09-09',
  topics: ['Mescalero Apache', 'Language', 'Immersion education', 'Apprenticeship'],
  annotation: 'A two-page program update linked from the Tribe’s September 9, 2024 news post. It reports that two immersion teachers had been hired for early-childhood settings, describes intended start dates for classes, and reports recruitment and peer-learning activity for a mentor–apprentice program. These are statements in a dated program snapshot; its plans are not confirmation that classes began as scheduled or remain active, and the report provides no later outcome data. Ceremony-specific material is not summarized.',
  accessed: '2026-10-23',
  contentReviewedAt: '2026-10-23',
  contentReviewScope: 'Visually inspected both pages of the complete two-page scanned PDF after rendering; the PDF has no searchable text. Read the program update, including reported immersion-teacher hiring, planned early-childhood classes, mentor–apprentice recruitment and program visits. Used only language-education details. Ceremony-specific content was deliberately excluded. No linked curricula, lesson materials, current program schedule, or subsequent outcome reports were reviewed.',
  accessNotes: 'Public PDF linked from the Mescalero Apache Tribe website. The page was an image scan and required visual rendering to inspect; the atlas links to the original PDF and does not reproduce it.',
  countsTowardMinimum: true
});

const section = p.sections.find(s => s.title === 'Language-program goals and education');
section.text = 'The Tribe’s Ndé Bizaa’ Language Program says its mission is to support Apache language and culture and describes language as important to identity and community well-being. Its stated goals include increasing the number of fluent speakers, Apache use across age groups and settings, literacy, knowledge of history, and participation in cultural activities. The undated page lists documentation, curriculum updates at the Language Program, immersion school and K–12 schools, language materials, and development of future language teachers; later items are possible approaches, not confirmed policy. A September 2024 program update reports that two immersion teachers had been hired for early-childhood settings, with classes planned to begin at specified sites, and describes efforts to recruit mentor–apprentices and learn from other language programs. Those are dated reports and plans, not confirmation that classes began as scheduled or remain active. Neither page supplies present fluency figures or measured outcomes. Ceremony-specific material is not repeated.';
section.sourceIds = ['p209-s7', 'p209-s8'];

p.overview = 'The Mescalero Apache Tribe’s public sources describe a contemporary community that includes Mescalero, Lipan, and Chiricahua people. This reading path brings together the Tribe’s public history, language-program goals and a dated 2024 education update, its posted constitution, Texas-focused historical research, and a peer-reviewed account of a Tribe-requested family-program pilot. It is an initial introduction, not a complete history or a substitute for distinct community accounts from Mescalero, Lipan, and Chiricahua people.';
p.overviewSourceIds = [...new Set([...(p.overviewSourceIds || []), 'p209-s8'])];
p.reviewedAt = '2026-10-23';
p.initialAdequacy.reviewedAt = '2026-10-23';
p.initialAdequacy.rationale = 'Eight substantive works provide an initial path across the Tribe’s public identity and reservation history, a dated posted constitution, the Tribe’s language-program goals and a September 2024 program snapshot, a Texas-focused government synthesis whose source pool and draft received Historic Preservation Officer input, an NPS regional interpretation, and a peer-reviewed Mescalero Apache–University of New Mexico participatory-research article coauthored with Mescalero program staff. The 2024 update reports hiring and plans at that time but does not confirm subsequent delivery or outcomes. The research article concerns a specific 2013–2014 pilot rather than current service delivery. This remains an initial introduction—not a complete history, community endorsement, or claim that the broader research target has been met.';
const limit = 'The September 2024 language-program update is a dated snapshot: planned class start dates and recruitment are not verified as later implementation, and no follow-up outcomes were reviewed.';
if (!p.initialAdequacy.remainingLimits.includes(limit)) p.initialAdequacy.remainingLimits.push(limit);
if (!p.researchGaps.includes(limit)) p.researchGaps.push(limit);

fs.writeFileSync(file, JSON.stringify(profiles, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({substantive: p.sources.filter(s => s.countsTowardMinimum).length, supporting: p.sources.filter(s => !s.countsTowardMinimum).length, sections: p.sections.length}, null, 2));
