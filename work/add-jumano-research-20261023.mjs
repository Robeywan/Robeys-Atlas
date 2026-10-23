import fs from "node:fs";

const root = new URL("../", import.meta.url);
const profilesPath = new URL("data/profiles.json", root);
const leadsPath = new URL("data/owner-reading-leads.json", root);
const profiles = JSON.parse(fs.readFileSync(profilesPath, "utf8"));
const profile = profiles.find(item => item.originalId === 151);
if (!profile) throw new Error("Jumano profile 151 is missing");
const reviewedAt = "2026-10-23";

const newSources = [
  {
    id: "p151-s13",
    url: "https://www.tshaonline.org/handbook/entries/dominguez-de-mendoza-juan",
    title: "Domínguez de Mendoza, Juan",
    publisher: "Texas State Historical Association, Handbook of Texas Online",
    author: "Robert S. Weddle",
    type: "Academic / reference",
    topics: ["Expeditions", "Juan Sabeata", "Colonial records"],
    publicationDate: "Article date not stated on the accessed page",
    annotation: "A scholarly biographical entry on Domínguez de Mendoza and the 1683–84 expedition. It describes Jumano leader Juan Sabeata’s appeal and the expedition toward La Junta, while noting disagreement over routes and the proposed San Clemente location. This is a secondary synthesis of colonial records, not the expedition diary itself.",
    accessed: reviewedAt,
    contentReviewedAt: reviewedAt,
    contentReviewScope: "The complete visible article and its bibliography were read. The cited expedition diary, archival manuscripts, and competing archaeological route studies were not independently inspected.",
    countsTowardMinimum: true
  },
  {
    id: "p151-s14",
    url: "https://open.uapress.arizona.edu/read/indian-assimilation-in-the-franciscan-area-of-nueva-vizcaya/section/4ed964b7-a798-4941-9e7d-88ab51aef992",
    title: "Indian Assimilation in the Franciscan Area of Nueva Vizcaya — “Historical Sketch of the Conchería”",
    publisher: "University of Arizona Press",
    author: "William B. Griffen",
    type: "Scholarly book chapter",
    topics: ["Conchería", "Colonial records", "Regional context"],
    publicationDate: "1979; open-access digital edition published 2022",
    annotation: "A regional historical study drawing on Spanish documentary material for Chihuahua and the southern borderlands. Its section on the Conchería gives useful context for named groups and La Junta, but is not a Jumano-specific account. Its period language about assimilation or disappearance is an author’s interpretation of colonial records, not evidence that descendants ceased to exist.",
    accessed: reviewedAt,
    contentReviewedAt: reviewedAt,
    contentReviewScope: "The full online section “Historical Sketch of the Conchería,” online pages 4–24, was read, including its discussion of named groups and cited archival passages. The rest of the book and the archival records cited within it were not independently inspected.",
    countsTowardMinimum: true
  },
  {
    id: "p151-s15",
    url: "https://www.texasbeyondhistory.net/junta/encounters.html",
    title: "Early Encounters, 1535–1714 (La Junta de los Ríos exhibit)",
    publisher: "Texas Beyond History / Texas Archeological Research Laboratory",
    author: "William A. (Andy) Cloud, Steve Black, and Jennifer Piehl; additional writing by Carly Whelan and David Hill",
    type: "Academic / public-history exhibit",
    topics: ["La Junta", "Spanish accounts", "Trade and diplomacy"],
    publicationDate: "December 17, 2007",
    annotation: "A detailed exhibit chapter that distinguishes settled La Junta communities from Jumano visitors and traders, and discusses translation problems, Spanish slave raids, diplomacy, and Juan Sabeata. Its statements are an educational synthesis of secondary literature and translated colonial accounts; the underlying manuscripts and archaeology are not independently verified here. The page itself cautions that historic group names and localities can be difficult to match.",
    accessed: reviewedAt,
    contentReviewedAt: reviewedAt,
    contentReviewScope: "The complete visible chapter, map and illustration captions, and author/credit material were read. Cited translations and archaeological studies were not independently inspected. Historic maps embedded in the exhibit were not inspected as map objects or reviewed for reuse; no map was added to the Atlas.",
    countsTowardMinimum: true
  },
  {
    id: "p151-s16",
    url: "https://www.tshaonline.org/handbook/entries/la-junta-de-los-rios",
    title: "La Junta de los Ríos",
    publisher: "Texas State Historical Association, Handbook of Texas Online",
    author: "Bradley Folsom",
    type: "Academic / reference",
    topics: ["La Junta", "Patarabueye", "Regional history"],
    publicationDate: "Original entry 1952; revision dated August 25, 2023",
    annotation: "A regional history of the Río Conchos–Río Grande confluence. It summarizes scholarship that treats Jumano and Patarabueye communities as either related or distinct partners, and presents a mutualistic relationship as a later interpretation. The page is useful for orientation but compresses a complex debate; its claims should be read alongside the specialist work it cites.",
    accessed: reviewedAt,
    contentReviewedAt: reviewedAt,
    contentReviewScope: "The full visible entry and bibliography were read, including discussion of Cabeza de Vaca, later Spanish expeditions, missions, and debated Jumano–Patarabueye relations. The cited dissertations, books, and Spanish records were not independently inspected.",
    countsTowardMinimum: true
  },
  {
    id: "p151-s17",
    url: "https://plainshumanities.unl.edu/encyclopedia/doc/egp.na.053.html",
    title: "Jumanos",
    publisher: "University of Nebraska–Lincoln, Encyclopedia of the Great Plains",
    author: "Nancy Parrott Hickerson",
    type: "Scholarly encyclopedia",
    topics: ["Historical identity", "Language hypotheses", "Trade"],
    publicationDate: "2011",
    annotation: "A concise scholarly overview presenting competing proposals about Jumano identity, language, and regional history. It offers a useful synthesis of an earlier scholarly debate but uses dated language about the people having vanished from the record. That wording describes the author’s reading of colonial documentation and cannot establish disappearance of descendants or present communities.",
    accessed: reviewedAt,
    contentReviewedAt: reviewedAt,
    contentReviewScope: "The complete visible encyclopedia entry and its bibliography were read. The cited monograph, articles, archival records, and linguistic evidence were not independently inspected.",
    countsTowardMinimum: true
  },
  {
    id: "p151-s18",
    url: "https://www.nps.gov/sapu/learn/historyculture/maria-de-agreda.htm",
    title: "María de Ágreda",
    publisher: "National Park Service, Salinas Pueblo Missions National Monument",
    type: "Government / park history",
    topics: ["Gran Quivira", "Mission history", "Colonial-era narratives"],
    publicationDate: "Updated April 24, 2025",
    annotation: "A park-history page recounting reports that María de Ágreda visited Jumano communities and encouraged mission requests. The page presents the “Lady in Blue” story as a historical narrative, while its own wording includes “is said” and “was reported”; it is useful as an example of how the story is explained at a mission site, not independent proof of the reported visits or a general Jumano history.",
    accessed: reviewedAt,
    contentReviewedAt: reviewedAt,
    contentReviewScope: "The full visible article and image captions/credits were read. The underlying Franciscan reports, mission records, and community perspectives on this narrative were not independently examined.",
    countsTowardMinimum: false
  },
  {
    id: "p151-s19",
    url: "https://uamr.lib.arizona.edu/item/224814",
    title: "Diary of Juan Domínguez de Mendoza of an expedition into eastern New Spain and Texas",
    publisher: "University of Arizona, Arizona Historical Indexes",
    author: "Juan Domínguez de Mendoza (manuscript author; catalogue record) ",
    type: "Archival finding aid / supporting reference",
    topics: ["Primary-source locator", "Juan Sabeata", "Spanish expedition"],
    publicationDate: "December 15, 1683–June 14, 1684 (catalogue dates for manuscript)",
    annotation: "A catalogue record describing a 28-page Spanish expedition diary and summarizing mentions of Jumano leader Juan Labeata, other named communities, and Apache conflict. This is a locator and catalogue abstract, not the diary itself; the manuscript was not read and the record’s summary is not counted as independent primary-source evidence.",
    accessed: reviewedAt,
    contentReviewedAt: reviewedAt,
    contentReviewScope: "The full visible catalogue record, summary, listed people and places, language, and archival location were read. The original 28-page Spanish manuscript held at the Dolph Briscoe Center for American History was not accessed.",
    countsTowardMinimum: false
  },
  {
    id: "p151-s20",
    url: "https://digitalcommons.unl.edu/greatplainsresearch/315/",
    title: "Review of The Jumanos: Hunters and Traders of the South Plains",
    publisher: "Great Plains Research / University of Nebraska–Lincoln Digital Commons",
    author: "Yasuhide Kawashima",
    type: "Book-review record / supporting reference",
    topics: ["Further reading", "Scholarly debate"],
    publicationDate: "May 1997",
    annotation: "The repository record identifies a published review of Nancy Parrott Hickerson’s book and its abstract summarizes the reviewer’s account of Hickerson’s distinct-people thesis. Only the record and abstract were inspected; the review text was not read, so this is a further-reading lead rather than a substantive content check.",
    accessed: reviewedAt,
    contentReviewedAt: reviewedAt,
    contentReviewScope: "Repository metadata and the complete visible abstract were read. The linked review document was not opened or inspected.",
    countsTowardMinimum: false
  }
];

const existingUrls = new Set(profile.sources.map(source => source.url));
const existingIds = new Set(profile.sources.map(source => source.id));
for (const source of newSources) {
  if (existingIds.has(source.id) || existingUrls.has(source.url)) {
    throw new Error(`Duplicate Jumano source: ${source.id} / ${source.url}`);
  }
}
profile.sources.push(...newSources);

const section = title => profile.sections.find(item => item.title === title);
const historicalNames = section("A historical name with contested scope");
historicalNames.text = "Historical materials used “Jumano” across more than one region and context. Nancy P. Hickerson’s distinct-trading-people interpretation appears in both her Handbook of Texas article and later scholarship, while older and other scholarly models proposed a broad Spanish label or linguistic connections to different peoples. Studies also disagree about whether particular Jumano groups were distinct from, related to, or interdependent with settled Patarabueye communities at La Junta. The Texas Beyond History exhibit and Bradley Folsom’s regional summary describe trade and mutual dependence while retaining cultural distinctions; these interpretations draw on inconsistent colonial names and should not be collapsed into one settled identity for every group.";
historicalNames.sourceIds = ["p151-s3", "p151-s4", "p151-s6", "p151-s9", "p151-s15", "p151-s16", "p151-s17"];

const trade = section("Trade, diplomacy, and a changing borderlands");
trade.text = "Historical syntheses describe Jumano travel and trade linking the South Plains, lower Pecos, Rio Grande, New Mexico, and communities farther east. They report exchanges with Pueblo, La Junta, and Caddo communities and diplomacy associated with Juan Sabeata. Robert Weddle’s biography of Juan Domínguez de Mendoza describes Sabeata’s appeal and the 1683–84 expedition; route reconstructions and the proposed location of San Clemente remain disputed. The accounts were produced in colonial settings, and their place names, population figures, and ethnic labels require attribution rather than treatment as settled facts.";
trade.sourceIds = ["p151-s3", "p151-s4", "p151-s5", "p151-s6", "p151-s13", "p151-s15", "p151-s16", "p151-s17"];

const junta = section("La Junta was a crossroads, not a single people");
junta.text = "La Junta de los Ríos, near the Río Conchos–Río Grande confluence, was a region of settled villages and movement among different communities. The Texas Beyond History exhibit distinguishes villagers described by Spanish sources as Conchos, Patarabueyes, or Amotomancos from Jumano traders and visitors, and explains how translation and later illustrations have sometimes blurred those categories. Bradley Folsom’s regional article presents a later interpretation of Jumano and Patarabueye communities as mutually dependent while culturally distinct. These are interpretations of incomplete written records and archaeological evidence; the confluence should not be assigned to a single people.";
junta.sourceIds = ["p151-s6", "p151-s9", "p151-s13", "p151-s15", "p151-s16"];

const records = section("What the colonial record can—and cannot—show");
records.text = "Most historical works in this collection rely on Spanish colonial documents, translated accounts, or later scholarly syntheses. Such sources describe encounters, trade, missions, and conflict, but they were written by outsiders and use names inconsistently. The 1683–84 Mendoza diary is represented here by scholarly summaries and a catalogue record; the manuscript itself has not been read. Griffen’s regional chapter and the Texas Beyond History exhibit add useful documentary context, but their cited archives and translations were not independently checked. A National Archives guide and repository records help locate materials; they are not substitutes for reading them.";
records.sourceIds = ["p151-s2", "p151-s5", "p151-s6", "p151-s13", "p151-s14", "p151-s15", "p151-s19"];

const disappearance = section("Reading claims about disappearance and recognition");
disappearance.text = "Some scholarly summaries say the colonial record stopped identifying Jumano as a distinct people or that their trade networks and political position changed by the eighteenth century. That describes an interpretation of surviving documents, not proof that descendants or living communities disappeared. Contemporary accounts from Jumano Nation of Texas and the separate Indigenous-led People of La Junta for Preservation have their own stated scope and are not interchangeable. Texas House Resolution 1565 is a state expression honoring the Jumano Indian Nation of Texas; its historical assertions and population claim are not independently verified here and it is not a federal recognition decision.";
disappearance.sourceIds = ["p151-s1", "p151-s3", "p151-s4", "p151-s7", "p151-s8", "p151-s17"];

profile.overviewSourceIds = ["p151-s3", "p151-s4", "p151-s7", "p151-s8", "p151-s17"];
profile.initialAdequacy = {
  status: "Still unfinished",
  reviewedAt,
  rationale: "This review brings the collection to twelve distinct substantive works with actual content inspected. The source target is reached for now, but the evidence remains weighted toward historical and archaeological interpretation derived from colonial records. Current community-authored historical and cultural material, broader community perspectives, and direct inspection of key archival records are still insufficient for an adequate initial introduction.",
  remainingLimits: [
    "No community review or endorsement is recorded. Jumano Nation of Texas and People of La Junta for Preservation are distinct organizations and are not treated as interchangeable or representative of every person connected to historic Jumano labels.",
    "The collection has twelve substantive works, but many analyze the same uneven Spanish documentary record; source quantity does not resolve the historical identity debate.",
    "The 1986 Kelley monograph and 1988 Hickerson linguistic article remain partially inspected or abstract-only; the full texts were not reviewed.",
    "Spanish and Mexican archival manuscripts discussed in the secondary literature, including the 1683–84 Domínguez de Mendoza diary, were not independently read.",
    "The range of contemporary Jumano community publications, family histories, language evidence, and cultural transmission remains limited and needs further review.",
    "The relationships among historical Jumano labels, Taovayas/Wichita, Tompiro Pueblo communities, and La Junta peoples remain contested; no exhaustive descent, identity, population, or federal recognition claim is made.",
    "Historical maps described or reproduced in secondary pages were not independently inspected for this batch; no map-to-profile connection was added."
  ]
};
profile.researchGaps = profile.initialAdequacy.remainingLimits;

for (const lead of profile.researchLeads ?? []) {
  const updates = {
    "https://www.tshaonline.org/handbook/entries/dominguez-de-mendoza-juan": {
      title: "Domínguez de Mendoza, Juan",
      reviewStatus: "Original-source article inspected; linked expedition records remain unread",
      matchedSourceId: "p151-s13",
      contentReviewScope: "The full visible TSHA article and bibliography were read; the diary, archival manuscripts, and route studies were not independently inspected."
    },
    "https://open.uapress.arizona.edu/read/indian-assimilation-in-the-franciscan-area-of-nueva-vizcaya/section/4ed964b7-a798-4941-9e7d-88ab51aef992": {
      title: "Indian Assimilation in the Franciscan Area of Nueva Vizcaya — section 2",
      reviewStatus: "Substantive online chapter section inspected; rest of book unread",
      matchedSourceId: "p151-s14",
      contentReviewScope: "The complete online section “Historical Sketch of the Conchería,” pp. 4–24, was read; the rest of the book and cited archival records were not."
    },
    "https://www.texasbeyondhistory.net/junta/encounters.html": {
      title: "Early Encounters, 1535–1714 (La Junta de los Ríos exhibit)",
      reviewStatus: "Full visible exhibit chapter inspected; cited primary works remain unread",
      matchedSourceId: "p151-s15",
      contentReviewScope: "The complete visible exhibit chapter and its map/illustration captions were read. The maps were not inspected as map objects or reviewed for reuse; no map link was added."
    },
    "https://www.tshaonline.org/handbook/entries/la-junta-de-los-rios": {
      title: "La Junta de los Ríos",
      reviewStatus: "Full visible TSHA article inspected; cited works remain unread",
      matchedSourceId: "p151-s16",
      contentReviewScope: "The complete visible article and bibliography were read; cited dissertations, books, and archival records were not independently inspected."
    },
    "https://plainshumanities.unl.edu/encyclopedia/doc/egp.na.053.html": {
      title: "Jumanos",
      reviewStatus: "Full visible encyclopedia article inspected; cited works remain unread",
      matchedSourceId: "p151-s17",
      contentReviewScope: "The complete visible entry and bibliography were read; cited monographs, articles, and archival records were not independently inspected."
    },
    "https://www.nps.gov/sapu/learn/historyculture/maria-de-agreda.htm": {
      title: "María de Ágreda",
      reviewStatus: "Full visible park-history article inspected; supporting reference only",
      matchedSourceId: "p151-s18",
      contentReviewScope: "The complete visible article and image captions/credits were read; underlying Franciscan reports and mission records were not examined.",
      supportingReview: true
    },
    "https://digitalcommons.unl.edu/greatplainsresearch/315/": {
      title: "Review of The Jumanos: Hunters and Traders of the South Plains",
      reviewStatus: "Repository metadata and abstract inspected; review text unread",
      matchedSourceId: "p151-s20",
      contentReviewScope: "Repository metadata and full visible abstract read; linked review document not inspected.",
      supportingReview: true
    }
  };
  const update = updates[lead.url];
  if (update) Object.assign(lead, update);
}

fs.writeFileSync(profilesPath, JSON.stringify(profiles, null, 2) + "\n", "utf8");
fs.writeFileSync(leadsPath, JSON.stringify(JSON.parse(fs.readFileSync(leadsPath, "utf8")), null, 2) + "\n", "utf8");

const substantive = profile.sources.filter(source => source.contentReviewedAt && source.countsTowardMinimum !== false);
const supporting = profile.sources.filter(source => source.contentReviewedAt && source.countsTowardMinimum === false);
const lines = [
  "# Jumano (original entry 151) — Texas research review, October 23, 2026",
  "",
  "## Initial status",
  "",
  `The profile now has **${substantive.length} substantive works with actual-content inspection records** and **${supporting.length} supporting references excluded from that count**. The flexible twelve-work target has been reached, but the initial adequacy judgment remains **Still unfinished**. Source count does not settle the identity debate, substitute for direct archival review, or establish community review or endorsement. No new map association was added.`,
  "",
  "The new readings strengthen coverage of historical naming, trade, Juan Sabeata’s diplomacy, and relations at La Junta. Hickerson’s distinct-people model, other proposed language and identity connections, and interpretations of Jumano–Patarabueye relations remain competing scholarly readings of incomplete colonial documentation. The sources agree that Spanish accounts provide important information, but they record outsiders’ categories and priorities. They do not support treating every historical use of “Jumano” as one settled identity.",
  "",
  "The Texas Beyond History chapter and TSHA regional history distinguish mobile Jumano travelers from communities resident at La Junta, while also describing mutual exchange. The exhibit cautions against assigning some historical illustrations to the wrong group and discusses ambiguity in translation. These are valuable interpretive corrections, but the cited archival documents, archaeological datasets, and translations were not independently inspected. The historical maps described on the exhibit page were not reviewed as map objects, and no map was added.",
  "",
  "Current community material remains limited. The 2021 Big Bend Sentinel article attributes contemporary statements to Jumano Nation of Texas historian Felix Bonilla Salmeron. People of La Junta for Preservation separately describes its own Indigenous-led organization and identifies Jumano among several communities connected with La Junta. Neither organization is made to speak for the other or for all people linked to the historic name. No community review or endorsement is recorded.",
  "",
  "## Substantive works inspected",
  "",
  ...substantive.map((source, index) => `${index + 1}. [${source.author ? `${source.author}, ` : ""}${source.title}](${source.url}) — ${source.contentReviewScope}`),
  "",
  "## Supporting references excluded from the substantive count",
  "",
  ...supporting.map(source => `- [${source.title}](${source.url}) — ${source.contentReviewScope}`),
  "",
  "## Remaining gaps",
  "",
  ...profile.initialAdequacy.remainingLimits.map(item => `- ${item}`),
  "",
  "The owner-supplied Jumano study remains a bibliography of suggested leads, not authority by itself. Original public pages were reviewed before any claim or source-count decision. Unread full texts and archival records remain leads. Limited-access passages are described at their inspected scope; blocked automated requests are not presented as proof of a paywall."
];
const review = lines.join("\n") + "\n";
for (const path of [new URL("research/jumano-151-review.md", root), new URL("../../../outputs/Jumano-Texas-Research-Review-2026-10-23.md", import.meta.url)]) {
  fs.writeFileSync(path, review, "utf8");
}
const batch = {
  reviewedAt,
  priority: "Texas, Minnesota and Idaho source research; add maps only when supported by source review",
  originalIds: [151],
  names: [profile.name],
  sourceLinks: profile.sources.length,
  profiles: [{
    originalId: 151,
    name: profile.name,
    substantiveWorksInspected: substantive.length,
    supportingReferencesExcluded: supporting.length,
    sections: profile.sections.length,
    initialAdequacy: profile.initialAdequacy
  }],
  nextOriginalId: 95,
  nextName: "Dakota (Minnesota coverage)",
  contributedStudies: 18,
  contributedURLs: 346
};
fs.writeFileSync(new URL("research/latest-batch.json", root), JSON.stringify(batch, null, 2) + "\n", "utf8");
console.log(JSON.stringify({name: profile.name, substantive: substantive.length, supporting: supporting.length, sections: profile.sections.length, adequacy: profile.initialAdequacy.status}));
