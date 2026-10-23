import fs from 'node:fs';

const path = new URL('../data/profiles.json', import.meta.url);
const profiles = JSON.parse(fs.readFileSync(path, 'utf8'));
const p = profiles.find(x => x.originalId === 95);
if (!p) throw new Error('Dakota profile 95 not found');
for (const id of ['p95-s4', 'p95-s5', 'p95-s6', 'p95-s7', 'p95-s8', 'p95-s9']) {
  if (p.sources.some(s => s.id === id)) throw new Error(`Source already exists: ${id}`);
}

p.overview = 'Dakota peoples include distinct communities and governments across a wide region. This Minnesota-focused reading path centers community accounts, Dakota public testimony and education, historical displacement, and a dated treaty record. It distinguishes Minnesota governments and specific historical evidence from broader Dakota identities and histories elsewhere.';

p.sources.push(
  {
    id: 'p95-s4',
    url: 'https://www.sos.mn.gov/media/abkjz44n/tribes-2025.pdf',
    title: 'Minnesota Tribal Government 2025 — Upper Sioux Community / Pezihutazizi Oyate profile',
    publisher: 'Minnesota Secretary of State; the profile presents the Upper Sioux Community’s account',
    author: 'Upper Sioux Community profile; no individual author displayed',
    type: 'Government / community historical account',
    topics: ['Upper Sioux Community', 'Pezihutazizi Oyate', 'Minnesota Dakota history', 'land return', 'governance'],
    publicationDate: '2025 edition',
    annotation: 'This two-page community profile describes the Minnesota River homeland, the community’s establishment in 1938, its 1995 constitution, tribal enterprises and services, and the 2024 return of former Upper Sioux Agency State Park lands. The state publication carries the community’s narrative; it is not an independent verification of every historical statement. Its 577 membership figure and 3,725-acre land-base statement are dated to the report and are not current 2026 measurements or an Indigenous homeland boundary.',
    accessed: '2026-10-23',
    contentReviewedAt: '2026-10-23',
    contentReviewScope: 'Read the complete Upper Sioux Community profile, pp. 9–10 (PDF lines 347–381), including the paragraphs on homeland, 1938 community formation, governance, economic development and services, and the 2024 transfer. The remaining tribal profiles and state agency listings were not counted as Dakota-community evidence.',
    countsTowardMinimum: true
  },
  {
    id: 'p95-s5',
    url: 'https://dakotawicohan.org/courses/mni-sota-koce/',
    title: 'Mni Sóta Maḳoce Curriculum — public overview and ten-lesson outline',
    publisher: 'Dakota Wicohan',
    author: 'Dakota scholars and educators led by Iyekiyapiwiƞ Darlene St. Clair, as identified by the publisher',
    type: 'Indigenous-led / educational program',
    topics: ['Dakota education', 'Mni Sóta Maḳoce', 'place and homeland', 'treaty education', 'language and cultural continuity'],
    publicationDate: '2016-12-19 page; curriculum piloted in 2016–17, 2017–18, and 2018–19',
    annotation: 'Dakota Wicohan’s public overview describes a ten-lesson sixth-grade curriculum created by Dakota educators. The outline treats Minnesota as Dakota homeland and includes land relationships, Dakota place names, sovereignty, treaty language, colonization, cultural and language revitalization, and living together. Teachers must attend training to access the complete lessons. The publisher says student-outcome research was forthcoming; this record does not claim measured educational effectiveness.',
    accessed: '2026-10-23',
    contentReviewedAt: '2026-10-23',
    contentReviewScope: 'Read the public instructor overview, stated goals, authorship and training/access notes, and the complete visible list of ten lesson titles and selected subtopics (page lines 55–189). The full lesson PDFs, media, worksheets, and training-only materials were not accessed or counted as read.',
    countsTowardMinimum: true
  },
  {
    id: 'p95-s6',
    url: 'https://www.mnhs.org/historycenter/activities/museum/our-home/dakota-transcript',
    title: 'Dakota Homeland — Our Home: Native Minnesota exhibition transcript',
    publisher: 'Minnesota Historical Society',
    author: 'Named speakers Dallas Ross, Grace Goldtooth-Campos, Dr. Clifford Canku, Walter LaBatte, and Raymond Owen',
    type: 'Public primary testimony by community representatives',
    topics: ['Dakota homeland', 'Seven Council Fires', 'land relationships', 'public testimony'],
    publicationDate: 'Undated transcript for the Our Home: Native Minnesota exhibition',
    annotation: 'Five named Dakota speakers give public statements on Dakota homeland, the Oceti Ṡakowiƞ, relationships to land and relatives, and Dakota identity. The transcript includes differing formulations: one speaker distinguishes Dakota as a way of life from a nation of people, while another refers to Dakota Oyate as a nation. Their attributed statements are valuable perspectives but do not stand for every Dakota community or settle questions of political identity. The Minnesota Historical Society selected and hosts the transcript.',
    accessed: '2026-10-23',
    contentReviewedAt: '2026-10-23',
    contentReviewScope: 'Read the complete public transcript (page lines 232–247) and checked its link to the associated exhibition page. The embedded Vimeo video was not played; only the text transcript is counted.',
    countsTowardMinimum: true
  },
  {
    id: 'p95-s7',
    url: 'https://www.dnr.state.mn.us/parkfinder/upper-sioux-agency-state-park-land-transfer.html',
    title: 'Upper Sioux Agency State Park is permanently closed — land-transfer explanation',
    publisher: 'Minnesota Department of Natural Resources',
    author: 'Minnesota Department of Natural Resources',
    type: 'Government / park history',
    topics: ['Upper Sioux Agency', '1862', 'state land transfer', 'Minnesota Dakota history'],
    publicationDate: 'Current DNR information page; no publication date displayed',
    annotation: 'The DNR explains that the Upper Sioux Community had long requested return of the park because of its significance and describes Dakota starvation and deaths at the agency in 1862 in connection with treaty food that the United States failed to provide. It records the park’s 2024 closure and the 2023 law directing a state-land transfer. This is the state agency’s explanation and is retained as focused corroboration, not a community-authored history.',
    accessed: '2026-10-23',
    contentReviewedAt: '2026-10-23',
    contentReviewScope: 'Read the page’s land-return rationale, cited 2023 legislation, closure date, and transfer-related public information (lines 5–15 and 31–35). Linked recreational listings were not reviewed.',
    countsTowardMinimum: false
  },
  {
    id: 'p95-s8',
    url: 'https://www.revisor.mn.gov/laws/2023/0/Session+Law/Chapter/60/',
    title: 'Minnesota Laws 2023, Chapter 60, section 97 — Upper Sioux Agency State Park land transfer',
    publisher: 'Minnesota Office of the Revisor of Statutes',
    author: 'Minnesota Legislature',
    type: 'Primary legal record',
    topics: ['Upper Sioux Community', 'land transfer', 'Minnesota statute', 'Upper Sioux Agency State Park'],
    publicationDate: '2023',
    annotation: 'Section 97 directs the commissioner of natural resources to convey state-owned land within Upper Sioux Agency State Park to the Upper Sioux Community without consideration; it separately authorizes a possible Minnesota Historical Society conveyance subject to Executive Council approval and legal barriers. The statute records the state’s authorization and requirements, not an independent account of Dakota history or proof of every step of conveyance.',
    accessed: '2026-10-23',
    contentReviewedAt: '2026-10-23',
    contentReviewScope: 'Read section 97 and its effective-date clause (lines 4363–4372), plus the associated appropriation’s stated transfer purpose. The remainder of the omnibus act was not reviewed for this profile.',
    countsTowardMinimum: false
  },
  {
    id: 'p95-s9',
    url: 'https://mn.gov/indian-affairs/tribal-nations-in-minnesota/pezihutazizi-oyate-upper-sioux-community.jsp',
    title: 'Pezihutazizi / Oyate — Upper Sioux Community historical page',
    publisher: 'Minnesota Indian Affairs Council; page uses first-person community language and links to the Upper Sioux Community',
    author: 'Community history reproduced through the Minnesota Indian Affairs Council; individual author and publication date not displayed',
    type: 'Government / contextual reference',
    topics: ['Upper Sioux Community', 'Pezihutazizi Oyate', 'historic community account'],
    publicationDate: 'Undated; accessed 2026',
    annotation: 'The page preserves a first-person historical account of homeland, forced removal, return, government formation, enterprises and services. Its undated population and acreage statements (453 people and over 900 acres) differ from the 2025 state guide’s account of a 2024 land return and 3,725-acre total land base. These figures should be read as dated versions of a community narrative rather than treated as current or as evidence of a boundary. The linked Upper Sioux government site returned HTTP 403 to the research request; no access control was bypassed.',
    accessed: '2026-10-23',
    contentReviewedAt: '2026-10-23',
    contentReviewScope: 'Read the full historical body and its links to elected leaders and the Upper Sioux Community website (page lines 16–36). The linked community site itself was not accessible from this request; its 403 response is not classified as a reader paywall.',
    countsTowardMinimum: false
  }
);

const language = p.sections.find(s => s.title === 'Language activism across community boundaries');
language.text = 'Dakota Wicohan traces its origins to a 2001 language team involving Upper Sioux, Lower Sioux and Twin Cities Dakota, followed by nonprofit incorporation in 2002. Its account connects intergenerational language learning, teacher preparation and outreach with community relationships. This educational organization works across political boundaries; it is not another tribal government. Its undated speaker and program totals are not current measurements. A separate Dakota Wicohan curriculum was developed by Dakota scholars and educators led by Iyekiyapiwiƞ Darlene St. Clair. Its ten-lesson outline treats Minnesota as Dakota homeland and covers place, language, sovereignty, treaties, colonization, cultural continuity and living together. The public overview says teachers need training to access the lessons and that outcome research was still forthcoming; the materials have not been presented here as an evaluated program.';
language.sourceIds = 'd95-l1 p95-s5';

p.sections.push(
  {
    title: 'Homeland through named Dakota voices',
    text: 'In the Minnesota Historical Society’s Our Home exhibition transcript, five named Dakota speakers describe Minnesota as Dakota homeland, discuss the Seven Council Fires, and speak about relationships to land and relatives. The speakers use different formulations: Dallas Ross distinguishes Dakota as a way of life from a nation of people, while Grace Goldtooth-Campos refers to Dakota Oyate as a nation and describes its council-fire groups. Keeping each statement attributed makes the variation visible without treating one exhibition transcript as a universal definition for all Dakota people or governments.',
    sourceIds: 'p95-s6'
  },
  {
    title: 'Upper Sioux Community: Pezihutazizi Oyate and returned agency lands',
    text: 'The 2025 Minnesota Tribal Government guide presents Upper Sioux Community’s account of Pejuhutazizi Kapi as Dakota homeland, the community’s formation in 1938 on 746 returned acres, and its 1995 constitution. The guide reports that the state returned the former Upper Sioux Agency State Park in 2024 and gives a resulting total land base of 3,725 acres; its membership count is a dated 2025 report figure, not a current 2026 measure. The Minnesota DNR describes the Community’s long-standing request and explains the 1862 history of starvation and death at the agency, while Minnesota law records the state’s direction to transfer park land. The DNR page and statute are state records, not substitutes for the Community’s own historical account. A separate undated state-hosted version repeats the community history with older acreage and population figures; neither version defines all Dakota homelands or a present boundary.',
    sourceIds: 'p95-s4 p95-s7 p95-s8 p95-s9'
  }
);

p.reviewedAt = '2026-10-23';
p.researchComplete = false;
p.researchStatus = 'source-guide';
p.coverageLevel = 'reviewed-source-guide';
p.initialAdequacy = {
  status: 'Still unfinished',
  reviewedAt: '2026-10-23',
  rationale: 'Nine substantive inspected works now support a Minnesota-focused introduction, including separate histories from three Minnesota Dakota governments, a dated Upper Sioux Community account carried in the 2025 Minnesota Tribal Government guide, a Dakota-created curriculum overview, named Dakota public testimony, a specific 1851 treaty text, and focused state historical records. Seven additional references are explicitly excluded from the substantive count. The source set remains weighted toward Minnesota and institutional materials; it is not a deep history of every Dakota community, a comprehensive language study, a current demographic account, or a community-reviewed collection.',
  remainingLimits: [
    'The Upper Sioux Community government website returned HTTP 403 to this research request. The accessible state-hosted histories and 2025 government guide provide useful community-attributed material, but the current Community constitution, official land-conveyance instrument, and a direct government publication about the 2024 return remain unreviewed; the access failure is not treated as a paywall and was not bypassed.',
    'Dakota communities outside Minnesota, including particular governments in the Dakotas, Nebraska, and Canada, need their own community voices and scoped sources. This collection is not an exhaustive homeland or present-community map.',
    'Specialist Dakota language scholarship is needed for precise language variation and classification; undated public speaker totals should not be used as current demographic findings.',
    'Original treaty scans, oral understandings, 1863 statutes, community constitutions, and additional Dakota-authored historical scholarship would deepen the collection. Treaty text, state summaries, and public exhibition testimony answer different questions.',
    'The complete Mni Sóta Maḳoce lesson materials require teacher training; the public page gives the curriculum overview but not the lessons themselves. Outcome research was described by the publisher as forthcoming, so no effectiveness claim is made.',
    'Dated education reports and community evaluations would be needed before describing current operations, participation, or outcomes. No clinical, legal, membership, or service-eligibility conclusion is proposed.',
    'No Dakota community review or endorsement is recorded.'
  ]
};
p.researchGaps = p.initialAdequacy.remainingLimits;
p.overviewSourceIds = ['d95-c1', 'p95-s4', 'p95-s6'];
p.evidenceNotes = [
  'Substantive works and supporting access routes are counted separately. Actual selected inspection scope and dates appear on the cards; unread references and source media are not counted.',
  'This is a Minnesota-focused initial source guide, not a complete history of Dakota peoples or a community endorsement. Governance, historical, educational, and language claims retain their particular community, speaker, source, and period.',
  'The Minnesota Indian Affairs Council’s undated Upper Sioux page reports 453 people and more than 900 acres, while the 2025 Minnesota Tribal Government guide reports a 2024 return and a 3,725-acre total land base and prints a 577 membership figure. The records are dated differently; no number is treated as a current 2026 figure, and none defines a homeland boundary.',
  'No historical map association was added. The Minnesota regional route is a navigation aid and does not describe the extent of Dakota homelands.'
];

fs.writeFileSync(path, JSON.stringify(profiles, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({
  originalId: p.originalId,
  sources: p.sources.length,
  substantive: p.sources.filter(s => s.countsTowardMinimum !== false).length,
  supporting: p.sources.filter(s => s.countsTowardMinimum === false).length,
  sections: p.sections.length,
  reviewedAt: p.reviewedAt,
  adequacy: p.initialAdequacy.status
}, null, 2));
