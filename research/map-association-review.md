# US state-association checkpoint

Initial checkpoint saved October 21, 2026 after ordinary usage became unavailable. Subsequently resumed for a bounded expansion after explicit owner authorization to use existing credits; see the continuation below. No Site edits, build, render QA or publication were performed by this agent.

## Saved data

`work/map-associations-us.json` is a top-level JSON **array**. Each record has `regionId` (ISO-style US state code), `originalId`, canonical `name`, `associationType`, `period`, `sourceUrl`, `evidenceNote` and `reviewDate`. It contains **149 preliminary associations across 48 states**. It is a starter index, not an exhaustive population, political-recognition or homeland layer. No coordinates or polygons are supplied. No source-count or canonical profile changes are implied.

Louisiana, Texas and Kansas have direct records. Current government/service locations are distinguished from ancestral geography and historical migrations. A specific government maps to an existing broader people entry only with an explanatory scope note. Review the notes when rendering names and avoid turning a state association into ownership of the whole state.

## Already inspected evidence used

- Kansas Native American Affairs `https://www.knaa.ks.gov/tribes-in-ks`: search tool returned the explicit four government records and Kansas addresses; direct page request returned 403. The records disclose that access scope. No current leaders or contact details were imported. Reopening the original directly remains useful at next review.
- Delaware Tribe's actual Lenape History page, footer and Kansas office links: `https://delawaretribe.org/cultural-education/culture-and-language/lenape-history/`. Specific Bartlesville government and Caney service-office settings, not universal homelands.
- Delaware Nation's actual History page: `https://www.delawarenation-nsn.gov/history/`. Read Overview and removal/movement passages. Only explicit state names are indexed; partial-state qualifications remain visible. No restricted content or extended prose is reproduced.
- Osage Nation's actual 2021 class announcement: `https://www.osagenation-nsn.gov/news-events/news/osage-nation-language-department-announces-2021-2022-community-class-schedule`. Its short historical-geography passage explicitly names Missouri, Arkansas and Kansas; it is used solely for those broad earlier associations.
- Already inspected Alabama community and Adai/Ahtna evidence, with exact scope preserved. Adai facility geography was inspected October 20; Ahtna report reading was selected-page inspection documented in its existing notes, not an entire new report review.

## Initial leads and their status

1. **BIA national directory:** actual service/disclaimer pages read. The linked CSV endpoint `https://www.bia.gov/tribal-leaders-csv` returned HTTP 200 with **zero bytes twice**, including one ordinary retry. No rows were inspected, so none were fabricated or imported. The officially linked map redirects to `https://experience.arcgis.com/experience/20ad1b9c9f4a40a586f3a4c72abe30bf`; its underlying records were not inspected. A future directory-based pass could efficiently expand present government-location coverage. Preserve BIA's warning that contact/headquarters records are not territorial boundaries or legal determinations.
2. **Miami:** canonical source `https://miamioh.edu/miami-tribe-relations/miami-community/history.html` was opened. Its institutional timeline does not by itself establish every historical state association. No additional state records were inferred.
3. **More Louisiana/Texas and other states:** this lead was partly resolved during the authorized continuation below, with actual Chitimacha/Coushatta/Jena Choctaw/Tunica-Biloxi directory rows and the Texas Kickapoo introduction inspected. Many additional communities remain to index. Do not silently treat profile region strings as inspected geographical evidence.
4. **No public completeness claim:** empty state results must mean coverage remains to research. The source checks here do not establish complete historical or contemporary coverage of any state.

Root owns subsequent evidence review, integration, accessible map/list behavior, build, render checks and publication when ordinary usage permits. This checkpoint should remain separate from the canonical research profiles.


## Authorized bounded continuation — October 21, 2026

The original first 27 records were retained. This pass added 122 records, bringing the JSON array to **149 associations, 48 US states, and 93 existing canonical profile access points**. Local checks validate required fields, state-code form, canonical IDs/names, review dates, HTTPS URLs and unique state/profile/association-type keys. These checks establish data integrity, not geographical completeness or community approval. Root owns integration and publication.

Hawaii and West Virginia remain blank. No absence of Indigenous people is implied. Hawaii has no verified relevant existing access point in this pass; an attempted NPS West Virginia page was inaccessible and supplied no record. Counts reflect association rows, including distinct historical/current relationships for a profile, not the number of distinct peoples. Region lists should deduplicate destinations while preserving distinct explanatory evidence.

### Additional source content inspected and exact use

- **Minnesota Commerce, Tribal Nations in Minnesota:** actual introduction and all named community lists read. Two records index Ojibwe and Dakota access points; each specific sovereign community remains distinct. URL: https://mn.gov/commerce/about/tribal-affairs/tribal-nations-in-mn.jsp
- **Wisconsin DCF, Tribal Information:** actual introduction and eleven-government list read. Six broad profile matches use the explicitly named governments, without treating separate Chippewa governments as one polity. URL: https://dcf.wisconsin.gov/tribalaffairs/tribalinformation
- **Maine State Archives, Wabanaki Nations:** actual introduction read, identifying Maine communities. The Maliseet wording maps to broader Wolastoqiyik, not an inferred particular band. No individual archived document was newly counted as read. URL: https://digitalarchives.maine.gov/wabanaki_nations
- **New Mexico Secretary of State, counties directory:** actual table lines 114–148 inspected. Twenty selected existing profile access points are indexed; the source's full list is not claimed as imported. County labels support state-level community associations only; no boundary geometry, language claim, recognition total or voting guidance is imported. URL: https://www.sos.nm.gov/voting-and-elections/native-american-election-information-program/23-nm-federally-recognized-tribes-in-nm-counties/
- **Washington GOIA directory:** actual name/address rows read through Spokane plus relevant earlier rows. Use each address's explicit state: Umatilla and Warm Springs are Oregon addresses; Nez Perce is Idaho. The directory title alone does not establish Washington residence for those rows. No officers, contacts or boundary claims imported. URL: https://goia.wa.gov/tribal-directory/federally-recognized-tribes-washington-state
- **North Dakota Indian Affairs, MHA Nation:** actual location paragraph and government address read. Mandan, Hidatsa and Arikara remain separate peoples associated with one joint government. Older migration theories and population data were not used. URL: https://www.indianaffairs.nd.gov/three-affiliated-tribes-mha-nation
- **Arizona State Museum Yaqui information, page 1:** actual text says Yaqui communities exist in Arizona, California and Texas. Only those three contemporary community associations are used. Page 2 map was not successfully visually inspected and contributes no records. URL: https://statemuseum.arizona.edu/sites/default/files/Yaqui_Background_Info.pdf
- **Louisiana Governor's directory:** actual federal-government rows, lines 82–110, read. Chitimacha, Coushatta, Jena Choctaw and Tunica-Biloxi locations map to existing people-level access points. Tunica and Biloxi share a named joint government; this does not make the peoples interchangeable. Other state-recognized claims were not imported from the longer list. URL: https://gov.louisiana.gov/federal-and-state-recognized-tribes
- **Utah Indian Affairs directory:** actual eight-group entries and White Mesa entry read. Only explicit address/White Mesa locations used. Navajo and San Juan Southern Paiute listed addresses are Arizona; Ute Mountain Ute's is Colorado. No inference that every address is in Utah. URL: https://indian.utah.gov/tribalnations/
- **Michigan government:** relevant actual entries around lines 1234–1278 read. Specific Ottawa/Odawa, Ojibwe/Chippewa and Potawatomi governments map to broader access points. Pokagon entry explicitly names Michigan/Indiana homelands. Other sections not treated as independent sources. URL: https://www.michigan.gov/government/branches-of-government/tribal-government
- **Chickasaw Nation History:** actual opening and removal/government paragraphs read. Four earlier regional homeland states distinguished from Oklahoma's later homeland/government connection. No whole-state outlines. URL: https://www.chickasaw.net/our-nation/history
- **Cherokee Nation History FAQ:** actual original-homelands answer read, updated August 13, 2026. Partial-state homeland connections in GA/AL/TN/NC remain separate from Kentucky/Virginia hunting areas. De Soto's itinerary was NOT used as a list of Cherokee states. URL: https://cherokee.gov/about-the-nation/frequently-asked-questions/history/
- **Mississippi Band of Choctaw history:** actual remaining-community and later-government passages read; Mississippi connection only. No current enrollment or citizenship rules inferred. URL: https://www.choctaw.org/about-us/tribal-history/
- **Nebraska Commission on Indian Affairs:** actual four-government list read. Three literal existing access-point matches imported (Omaha, Ponca, Santee Dakota); Winnebago/Ho-Chunk correspondence left for further explicit source checking. URL: https://indianaffairs.state.ne.us/resources/tribes-of-nebraska/
- **Wyoming state history:** actual Wind River paragraph read. Only continuing Shoshone/Arapaho reservation connection used. Outdated headcounts and stereotypes elsewhere on the page excluded. URL: https://www.wyo.gov/about-wyoming/wyoming-history
- **Nevada Native American Affairs directory:** actual Goshute and Duck Valley location paragraphs read. Nevada/Utah and Nevada/Idaho cross-border relationships are explicit; government mailing addresses alone are not used to establish the opposite side of a border. Later unrelated government/history entries not relied on. URL: https://dnaa.nv.gov/tribal-nations/tribal-directory/
- **Catawba Nation About:** actual ancestral-lands and present-lands paragraphs read. Piedmont NC/SC and southern VA distinguished from present York County/Rock Hill government. Inconsistent/dated population and termination-year statements not imported. URL: https://catawba.com/about-the-nation
- **Kickapoo Traditional Tribe of Texas:** actual public introduction read, locating the specific reservation south of Eagle Pass. Homepage is used solely for this explicit geographical statement, not as a deep-research source count. URL: https://kickapootexas.org/
- **Narragansett early history:** actual opening, South Kingstown and continuing reservation passages read. Rhode Island connection only; no archaeological dating, population or tribute claims imported. URL: https://narragansettindiannation.org/history/early/
- **Meskwaki History:** actual Iowa Settlement/current location and removal/return passages read. Iowa settlement distinct from historical Kansas removal; no merger of Meskwaki and Sauk identities. First open timed out, ordinary retry succeeded. URL: https://www.meskwaki.org/history/
- **Seminole Tribe of Florida Introduction:** actual opening and subsequent paragraphs read. Florida homeland relationship only; separate tribal governments are not conflated. Other Southeast-wide ancestry language not used to manufacture more state associations. URL: https://www.semtribe.com/history/introduction
- **Aquinnah Wampanoag public introduction:** actual welcome and About Our Tribe paragraphs read. Present community and historical southeastern Massachusetts/eastern Rhode Island associations are differentiated. No tribal recognition counts or extended historical claims imported. URL: https://wampanoagtribe-nsn.gov/
- **Montana Historical Society Indigenous Partnerships:** actual named partnership paragraph read. Eight selected broad people-level destinations map to named specific governments; counts on the page are not imported. Broader land acknowledgment is not converted into extra states, boundaries or universal identities. The separate tribalnations.mt.gov site timed out and was not used. URL: https://prod-mhs.mt.gov/Museum/Indigenous-Partnerships
- **NPS Badlands South Unit:** actual history paragraphs read. Oglala Lakota and Pine Ridge connection plus explicit South Dakota tag support one state association. No restricted sites or precise coordinates; detailed historic land totals not imported. URL: https://www.nps.gov/articles/000/south-unit-badl.htm
- **Illinois State Museum Territory:** actual short geographical passage read. Specific initial-contact regions in IL/IA/MO/AR; Peoria separately names eastern Iowa. This is an older museum synthesis, not current government geography. Main exhibit landing returned incomplete frame text, so no Miami/Kickapoo/Sauk claims were taken from that landing. URL: https://www.museum.state.il.us/muslink/nat_amer/post/htmls/id_terr.html
- **W8banaki Nation History:** actual French introduction/territory paragraphs read, especially lines 63–77. VT/NH/ME and partial MA ancestral connections retained; no current Vermont/New Hampshire group's identity claim is authenticated by this geographical association. The separate Bureau du Ndakina page's mandate was read but adds no second geographical work/count. URL: https://gcnwa.com/histoire-de-la-nation/

### Exclusions and rendering limits

Oregon Secretary of State's old /tribes route redirected to a 404 page; no records were taken from that destination. Oregon Agriculture's generic page did not identify specific communities and supplied no records. Massachusetts pages returned 403 and supplied no records. Two Montana homepage timeouts are not counted as content review. Search results were leads unless the actual relevant page text was subsequently opened; the original Kansas access limitation remains explicitly documented.

These are limited state-association reviews, **not profile deep dives**. They do not add canonical profile source counts, adequacy, completion or community-review status. No shapes, photographs, site coordinates, sacred-place markers or bulk third-party map data were copied. State fills must mean “select a region to explore documented connections,” not exclusive ownership, reservation boundary, or a complete list of every Indigenous nation with connections there. Show historical/removal/government distinctions and preserve missing-coverage messaging.


# Canada and southward scope

Broad Canadian provinces/territories and countries southward; navigation associations only, not exhaustive territory, ownership, jurisdiction or geometry.

- A missing association means not yet curated, never absence.
- Preserve historical/current and language/community qualifiers in UI.
- Names/original IDs route to existing profiles; aliases and nested peoples/governments are not deduplicated by geography.
- ISO 3166-2 for Prince Edward Island is CA-PE (not CA-PEI).
- Some entries use language-community evidence, explicitly labelled, rather than treaty or government-jurisdiction evidence.
- The renewed bounded pass moved all five indexed-only Garifuna records into deferredAssociations because actual UNESCO opens still displayed a challenge. Do not render those as verified associations.
- Costa Rica additions use an actually opened Ministry of Education country list, supported by an actually opened CONAGEBIO country list. Infographic PDFs were not reviewed.
- Boruca/Brunca appears in the official Costa Rica list but no corresponding canonical profile was found in the inspected dataset; no new profile or unsupported route was created.
- Cabécar is an existing added profile without originalId. It must resolve by exact canonical name/generated route.
- Eight Costa Rica profile links are not eight distinct peoples: Brörán and Teribe are overlapping existing entry labels. The official list's Boruca/Brunca entry is not yet represented by a corresponding canonical profile.

Five indexed-only Garifuna records are preserved in deferred research notes and excluded from the live verified index.
