# Nations Atlas

Static research directory for Indigenous North America. Every entry in the original list is preserved as a separate access point. Additional supported entries are labeled. Entry counts are not a count of distinct nations.

The current release contains 30 expanded profiles, 35 brief cited overviews, and 404 source guides. Eight collections contain at least 12 inspected resources, including four of the 27 A entries. It does **not** contain completed comprehensive deep dives for every entry. Expanded profiles record a source-review date, section citations, and explicit research gaps. Source-guide research and community review remain ongoing work.

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

The owner's latest priority is **all A entries first**, before further B research. The first renewal batch develops Abenaki (13 inspected resources), Abihka (12), Absentee Shawnee (14), and Acoma Pueblo (14). Abihka now has specific community and specialist evidence supporting a developed profile, with town-history uncertainties retained. Continue at original ID 5, Achumawi, through the remaining original A entries and the addition Algonquin. Revisit the stated gaps as well as the minimum of 12 excellent, directly relevant sources each. Do not pad collections with bare homepages, duplicate mirrors, passing mentions, or unread references. A long-term project requires recorded evidence and recoverable progress, not an assumption that any profile is final.

The published Babine, Bannock, Beothuk, and Biloxi collections remain available. Unfinished B research is preserved for later and must not displace the A priority. See `research/Research-Plan.md`, `research/A-Research-Queue.md`, and `research/latest-batch.json` for the current sequence.

The source metadata records access dates; `contentReviewedAt` identifies an actual content check, whose scope is explained in the annotation. Available excerpts can count as the identified resource, while the unread full work cannot. `coverageLevel: developed-profile` controls the Expanded profile label; `reviewed-source-guide` records review without overstating depth. Older `researchStatus: researched` records remain brief cited overviews unless explicitly expanded. A depth-filter link uses `?depth=developed-profile#directory`. The filter `?depth=reviewed-minimum#directory` finds collections with at least 12 recorded content checks. That milestone is separate from research completion and community review.
