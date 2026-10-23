const fs = require('fs');
const path = require('path');
const f = path.join('data', 'profiles.json');
const rows = JSON.parse(fs.readFileSync(f, 'utf8'));
const p = rows.find(x => x.originalId === 89);
if (!p) throw new Error('Coushatta profile 89 missing');
const existing = new Set(p.sources.map(s => s.id));
const added = [
  {
    id: 'co89-constitution2023',
    title: 'Constitution and By-Laws of the Alabama-Coushatta Tribe of Texas (amended through 2023)',
    author: 'Alabama-Coushatta Tribe of Texas',
    publisher: 'Alabama-Coushatta Tribe of Texas',
    url: 'https://www.alabama-coushatta.com/uploads/cms/nav-18-64d3bc7777f8c.pdf',
    type: 'Indigenous-led',
    topics: ['Texas', 'Constitution', 'Government', 'Community self-government'],
    annotation: 'The Tribe’s own governing document describes the current legal name and says the Alabama and Coushatta were formerly distinct peoples but constitute one federally recognized tribe for legal and governmental purposes. Its preamble identifies self-government, language, arts, crafts and cultural preservation among its stated purposes. This is an authoritative text of the Texas Tribe’s own law, not a complete account of all Coushatta communities.',
    contentReviewScope: 'Actual 25-page PDF, title/publication and amendment history, preamble and Articles I–V (printed pp. 3–8), and selected later amendment material through printed p. 23 read. The profile uses only the public name, organizational structure and stated purposes; detailed enrollment provisions and personal data are omitted. No independent legal opinion is offered.',
    publicationDate: 'Revised and annotated; amendments through July 2023',
    accessed: '2026-10-23',
    contentReviewedAt: '2026-10-23',
    countsTowardMinimum: true,
    sourceKind: 'Tribal constitution / primary community government document'
  },
  {
    id: 'co89-pl6271954',
    title: 'Public Law 83-627: An Act to provide for the termination of Federal supervision over the property of the Alabama and Coushatta Tribes of Indians of Texas',
    publisher: 'United States Congress; Statutes at Large, vol. 68, pp. 768–769',
    url: 'https://www.govinfo.gov/content/pkg/STATUTE-68/pdf/STATUTE-68-Pg768.pdf',
    type: 'Government / primary source',
    topics: ['Texas', 'Federal law', 'Trust land', 'Legal history'],
    annotation: 'The enacted 1954 law describes conveyance of federally held trust lands to Texas to be held in trust for the Alabama and Coushatta Tribes, and provides for termination of the federal relationship and services following the proclamation specified in the act. The page header/OCR is inconsistent about the public-law number; the Statutes at Large front matter identifies the Alabama-Coushatta act at 68 Stat. 768 as Public Law 83-627, while Public Law 83-628 begins at p. 769. Citation follows the official index and page range. The law is not evidence that the people or Tribe ceased to exist.',
    contentReviewScope: 'Both scanned pages, all operative sections 1–8 (68 Stat. 768–769), read from GovInfo. Effective language is tied to the proclamation named in the statute; the proclamation itself and state implementation were not inspected in this review.',
    publicationDate: 'Approved August 23, 1954',
    accessed: '2026-10-23',
    contentReviewedAt: '2026-10-23',
    countsTowardMinimum: true,
    sourceKind: 'Federal statute / primary legal text'
  },
  {
    id: 'co89-pl10089-1987',
    title: 'Public Law 100-89, Title II: Alabama and Coushatta Indian Tribes of Texas',
    publisher: 'United States Congress; Statutes at Large, vol. 101, pp. 666–673',
    url: 'https://www.govinfo.gov/content/pkg/STATUTE-101/pdf/STATUTE-101-Pg666.pdf',
    type: 'Government / primary source',
    topics: ['Texas', 'Federal restoration', 'Government', 'Legal history'],
    annotation: 'Title II of the 1987 restoration law treats the Alabama and Coushatta Tribes of Texas as one tribal unit for federal-law purposes, restores federal recognition and the trust relationship, and makes federal services available under the act. The joint legal status is not a claim that Alabama and Coushatta are one people or that other Coushatta communities share the Texas government.',
    contentReviewScope: 'Actual 7-page Statutes at Large PDF; complete Title II, §§201–206, on printed pp. 669–673 read. Title I concerns Ysleta del Sur Pueblo and is not attributed to Coushatta. No later case law or current legal advice is claimed.',
    publicationDate: 'Approved August 18, 1987',
    accessed: '2026-10-23',
    contentReviewedAt: '2026-10-23',
    countsTowardMinimum: true,
    sourceKind: 'Federal statute / primary legal text'
  },
  {
    id: 'co89-treaty1836',
    title: 'Treaty between Texas and the Cherokee Indians, February 23, 1836 (transcribed in Indian Papers of Texas and the Southwest, vol. I)',
    author: 'Republic of Texas commissioners and Cherokee representatives; edited by Dorman H. Winfrey and James M. Day',
    publisher: 'Texas History Trust, Indian Papers of Texas and the Southwest',
    url: 'https://archive.texashistorytrust.org/view/49896224/20/',
    type: 'Archive / primary-source transcription',
    topics: ['Texas', '1836 treaty text', 'Diplomacy', 'Historical geography'],
    annotation: 'The printed treaty text lists Alabama and Coushatta among groups it calls Cherokee “associate Bands” and proposes that the named bands form one community within specified bounds. This is a Republic of Texas diplomatic document in colonial/state language, mediated through a later edited transcription. Its text does not establish that the proposed agreement was ratified, implemented, or accepted as a lasting boundary by the named peoples. It is not a present homeland map.',
    contentReviewScope: 'Transcript of the February 23, 1836 document on printed pages 14–15 of volume I reviewed through the Texas History Trust/University of North Texas text. The treaty’s opening and land-boundary article were inspected; the full volume, manuscript original, signatures and implementation record were not reviewed.',
    publicationDate: 'Document dated February 23, 1836; edited volume issued 1995',
    accessed: '2026-10-23',
    contentReviewedAt: '2026-10-23',
    countsTowardMinimum: true,
    sourceKind: 'Edited primary-source document'
  },
  {
    id: 'co89-smither1932',
    title: 'The Alabama Indians of Texas',
    author: 'Harriet Smither',
    publisher: 'Southwestern Historical Quarterly, 36(2), October 1932, pp. 83–108; Texas State Historical Association',
    url: 'https://www.alabama-coushatta-tribalarchives.org/_files/ugd/9c5ec8_047d4d3a17a647509ca7876535bfdc19.pdf',
    type: 'Academic / historical scholarship',
    topics: ['Texas', 'Historical migration', 'Land history', 'Alabama community'],
    annotation: 'A substantial 1932 state-history article drawing on earlier colonial, Texas and federal records. Selected passages describe westward movement, Texas land petitions and reservation developments. The article uses period terminology, a dated outside scholarly frame and language that can be paternalistic; it is a source for what its author and cited records report, not a neutral or current community account. Historical population statements and characterizations are not reproduced as present facts.',
    contentReviewScope: 'Selected actual pages of the 27-page PDF / printed pp. 83–108 inspected, including early migration, the 1850s land/reservation narrative and federal reports through the 1928 land purchase (PDF pp. 1–5, 13–16, 19, 25). The entire article and cited archival records were not independently checked. JSTOR terms appear in the scan; no reuse of its text or images is made.',
    publicationDate: 'October 1932',
    accessed: '2026-10-23',
    contentReviewedAt: '2026-10-23',
    countsTowardMinimum: true,
    sourceKind: 'Older scholarly secondary source'
  },
  {
    id: 'co89-thc2026',
    title: 'The History of the Alabama-Coushatta and Their Role in the Texas Revolution',
    publisher: 'Texas Historical Commission',
    url: 'https://thc.texas.gov/blog/history-alabama-coushatta-and-their-role-texas-revolution',
    type: 'Government educational history',
    topics: ['Texas', 'Texas Revolution', '1836 treaty', 'Public commemoration'],
    annotation: 'A state historical agency’s 2026 educational article recounts Alabama-Coushatta histories and their role in the Texas Revolution, drawing on named secondary books, a state resolution, the 1836 treaty record and an attributed statement by Chief Colita. It represents a modern state-commemoration frame. Claims are attributed to the article and its cited works; its interpretive summary is not treated as community-authored history or independent corroboration.',
    contentReviewScope: 'Complete article body, dated February 24, 2026, read, including its named sources and displayed image captions. The underlying cited books, resolution, original manuscript and image rights were not separately reviewed. Only the article’s cautious historical context is used.',
    publicationDate: 'February 24, 2026',
    accessed: '2026-10-23',
    contentReviewedAt: '2026-10-23',
    countsTowardMinimum: true,
    sourceKind: 'State historical agency educational article'
  }
];
for (const s of added) if (!existing.has(s.id)) p.sources.push(s);
p.sections = [
  p.sections[0],
  p.sections[1],
  {
    title: 'The treaty text records a proposal, not a settled outcome',
    text: 'An edited transcript of the February 23, 1836 treaty names Alabama and Coushatta among groups styled “associate Bands” of the Cherokee, then proposes that those groups form one community within a described area. The document records a Republic of Texas negotiating position in that moment. Later historical accounts report that the agreement was not ratified; its text alone does not establish implementation, Indigenous acceptance of the proposed terms, or a continuing boundary.',
    sourceIds: ['co89-treaty1836', 'co89-thc2026']
  },
  {
    title: 'Federal law changed the Texas government’s legal relationship',
    text: 'The 1954 federal statute provided for transfer of trust lands to Texas and termination of federal supervision and services following a proclamation. In 1987, Congress restored federal recognition, the trust relationship and services for the Alabama and Coushatta Tribes of Texas, treating them as one tribal unit for federal-law purposes. The Tribe’s constitution, amended through 2023, says the Alabama and Coushatta were formerly distinct tribes and describes their shared legal government, territory and governing institutions. These legal texts concern the Texas government; they do not erase separate peoplehood or describe other Coushatta governments.',
    sourceIds: ['co89-pl6271954', 'co89-pl10089-1987', 'co89-constitution2023']
  },
  {
    title: 'A 1932 history is useful only with its period and viewpoint visible',
    text: 'Harriet Smither’s long article follows Alabama history in Texas through colonial records, nineteenth-century land negotiations and federal reports. It provides a route into dated records, including petitions and land actions, but its terminology and descriptions reflect an early twentieth-century outside historian. This page uses it selectively as a historical source and does not carry its old population statements or character judgments forward as current fact.',
    sourceIds: ['co89-smither1932']
  },
  {
    title: 'A state history article revisits the Texas Revolution story',
    text: 'The Texas Historical Commission’s 2026 article summarizes the Alabama-Coushatta role in events around the Texas Revolution, quoting historical sources and an attributed statement by Chief Colita. It also reports that the Texas Senate declined to ratify the 1836 treaty. Because this is a modern state-agency retrospective, its quotations and historical interpretations remain attributed to that article and its named sources.',
    sourceIds: ['co89-thc2026', 'co89-treaty1836']
  },
  ...p.sections.slice(2)
];
p.reviewedAt = '2026-10-23';
p.researchComplete = false;
p.communityReview = 'Not recorded';
p.initialAdequacy = {
  status: 'Adequate initial introduction',
  reviewedAt: '2026-10-23',
  rationale: 'Twelve substantive inspected works now include Texas and Louisiana community histories, an Oklahoma community perspective, a community-coauthored language-project chapter, a community constitution, federal statutes, an edited treaty transcription and older scholarship. Together they support a bounded educational introduction on distinct communities, language work and Texas legal history. The count is a quantity measure, not a claim that the collection is complete, exhaustive, endorsed by all communities, or suitable for current legal advice.',
  remainingLimits: [
    'The Texas statute’s contemplated proclamation and its implementation record were not inspected; later legal interpretation remains outside scope.',
    'The treaty is an edited transcription; manuscript, ratification record and Indigenous responses were not examined here.',
    'The 1932 secondary article is dated and draws on older terminology and sources; further Coushatta-authored history and direct archival research would improve the account.',
    'Substantive Koasati teaching materials, grammar, dictionary and present-day language context need direct review.',
    'Current community conditions and each Texas, Louisiana and Oklahoma government’s own contemporary publications require further review; no present census or language-use estimate is claimed.',
    'No community review or endorsement has been recorded.'
  ]
};
p.researchGaps = [
  'Read actual public learner-facing Koasati grammar/dictionary introductions and community-directed teaching materials; avoid claims about current teaching or language vitality without direct evidence.',
  'Expand current Coushatta-authored historical and institutional accounts without treating Texas, Louisiana and Oklahoma communities as interchangeable.',
  'Inspect the 1954 proclamation, relevant state records and original treaty/ratification documents where accessible; keep statutory text distinct from later implementation.',
  'Resolve contradictions in chief dates and organizational chronology through further evidence; do not silently choose whichever source sounds convenient.',
  'Restore legitimate archive access if available later, with collection-level cultural permissions respected; no contact or restricted-material access attempted.',
  'No present population, language vitality census, private genealogy or program outcome has been established.'
];
p.evidenceNotes = [
  'Twelve sources have countsTowardMinimum:true after actual substantive content inspection; two short or unavailable supporting references remain excluded. Every new source card records its exact inspection scope and review date.',
  'The 1836 treaty is an edited Republic of Texas diplomatic text and a proposal; it is not used as proof of ratification, implementation, Indigenous acceptance or present homeland boundary.',
  'The 1954 statute is cited as Public Law 83-627, 68 Stat. 768 (verified against the official Statutes at Large index); the 1987 restoration act is discussed only for Title II concerning the Texas Alabama-Coushatta Tribe.',
  'Smither (1932) is explicitly treated as older outside scholarship with period language; claims are attributed and present-day generalizations are avoided.',
  'This remains an initial, open educational profile, not a complete history, legal opinion or community endorsement.'
];
p.coverageLevel = 'developed-profile';
if (!p.relationshipNote.includes('one joint legal status')) {
  p.relationshipNote += ' The 1987 federal act and the Texas Tribe’s constitution describe one joint legal/governmental status for the Alabama-Coushatta Tribe of Texas while also recognizing that Alabama and Coushatta were formerly distinct peoples; this legal arrangement does not make the three present governments in Texas, Louisiana and Oklahoma interchangeable.';
}
fs.writeFileSync(f, JSON.stringify(rows, null, 2) + '\n', 'utf8');
console.log('updated', p.sources.filter(s => s.countsTowardMinimum !== false).length, 'substantive works;', p.sections.length, 'cited sections');
