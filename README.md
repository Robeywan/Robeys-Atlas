# Nations Atlas

Static research directory for Indigenous North America. Every entry in the original list is preserved as a separate access point. Additional supported entries are labeled. Entry counts are not a count of distinct nations.

The October 23, 2026 release contains 31 expanded profiles, 37 brief cited overviews, five reviewed source guides, and 403 source guides. Twenty-two collections contain at least 12 substantive inspected works, including twelve of the 27 A entries. This does **not** mean those collections are complete or community-reviewed. Current regional research prioritizes Texas, Minnesota, and Idaho. Ojibwe (original entry 265) now has a Minnesota-focused guide with 13 substantive works, eight supporting references, seven cited sections, and an explicit **Still unfinished** adequacy assessment. Research and community review remain ongoing work.

## Files

- `data/profiles.json`: editable research records, annotations, relationships and citations.
- `original-names.txt`: the original 454 access points.
- `build.mjs`: generates static pages for every entry, the directory, source library and approach page.
- `dist/`: the website, suitable for any static web host.
- `coverage.json`: generated coverage counts.
- `dist/data/research-progress.json`: per-entry progress, inspected-source counts, remaining gaps, and review/completion fields.
- `research/`: evidence notes and source-availability checks for the expanded batch.

## Build and check

Run `node build.mjs`, then `node verify.mjs`. `node serve.mjs` serves the site at http://127.0.0.1:4173.

Search, A–Z, filters, sorting and saved entries run in the browser. All profiles and source links are static HTML and remain accessible without JavaScript. Saved entries use browser-local storage. No user account, database or API key is needed for the directory itself.

## Continue the research

Develop each source guide into a fuller article with an evidence trail: names and identity; homeland and historical change; language and publicly shared cultural life; governance and contemporary priorities; annotated bibliography; and explicit uncertainties. Prioritize sources authored by the community concerned. Do not infer disappearance from language loss, a gap in the collection, or an old administrative label.

Check the scope of every source and keep distinct communities visible within umbrella names. Verify current legal or governmental details against current nation-published material. Keep section citations tied to the source that actually supports the text. Links and source perspectives need continuing review.

The owner accepts limited-access resources. Keep excellent relevant publications requiring subscriptions, accounts or library access; note verified requirements and the scope actually inspected. An excerpt review does not imply that the full work was read. Unread bibliographic leads can be preserved for later, separate from completed content checks.

The owner's current priority is source-first research across Texas, then Minnesota, then Idaho. Significant historical-map expansion and map QA are paused; keep the published interactive map and Historical maps room intact, and add map connections only when ordinary research directly supports a specific association. Jumano (original 151) has twelve substantive inspected works, eight supporting references excluded, six cited sections, and a dated **Still unfinished** assessment; seven of its eighteen study URLs remain unread. Dakota (original 95) now has a Minnesota-focused review with nine substantive inspected works, seven supporting references excluded, ten cited sections, and initial adequacy **Still unfinished**. New Dakota sources include a 2025 Upper Sioux Community profile, Dakota Wicohan's public curriculum overview, and an exhibition transcript with named Dakota speakers. Dated land and membership figures remain source snapshots. Next: review Minnesota's distinct Ojibwe governments through community-specific sources, then proceed to Idaho. See `research/Research-Plan.md`, `research/Regional-Research-Queue.md`, `research/dakota-95-minnesota-review-20261023.md`, and `research/jumano-151-review.md`.

Across entries, aim for twelve excellent inspected works, while recognizing that five or six can support an adequate initial introduction after careful searching and a dated rationale. Keep quantity separate from adequacy, completion, and community review. Do not pad collections with bare homepages, duplicate mirrors, passing mentions, or unread references. Write accessible cited synthesis, record actual inspection scope, and leave unresolved gaps visible. Earlier A/B work and published profiles remain preserved for later.

The source metadata records access dates; `contentReviewedAt` identifies an actual content check, whose scope is explained in the annotation. Available excerpts can count as the identified resource, while the unread full work cannot. `coverageLevel: developed-profile` controls the Expanded profile label; `reviewed-source-guide` records review without overstating depth. Older `researchStatus: researched` records remain brief cited overviews unless explicitly expanded. A depth-filter link uses `?depth=developed-profile#directory`. The filter `?depth=reviewed-minimum#directory` finds collections with at least 12 recorded content checks. That quantity measure is separate from initial adequacy, research completion and community review. The progress record defaults initialAdequacy to Not assessed and preserves explicit profile assessments; no page becomes adequate from its count or depth label.
