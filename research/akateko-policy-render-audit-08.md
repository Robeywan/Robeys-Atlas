# Akateko publication policy audit — October 20, 2026

Read-only review of the generated Akateko, Ahtna, home and About HTML after root's build, plus generated profile/progress JSON, source profile data, coverage counts and the retained browser filter code. Extracted the generated visible HTML text; this was not a screenshot/layout or live-browser test. Did not run build or the repository verifier, edit Site source, package or publish.

## Result

The flexible-target policy and independent adequacy schema behave as intended in the reviewed generated output. No mandatory twelve-source gate or automatic adequacy promotion was found. Two small publication follow-ups were sent to root and are now resolved in the final generated output: one remaining word choice in a suggested-reading annotation and a source-versus-build annotation difference introduced during the audit. Akateko has fifteen cited sections, fourteen source cards and exactly four suggested-reading leads.

## Visible policy

- The home explanation states that twelve is a target and five or six excellent sources can support an adequate initial introduction when careful searching and a documented coverage review justify it. Counts alone do not establish adequacy or completion.
- About explains the same exception, rejects automatic approval from either count, and identifies the twelve-source filter as a quantity measure. It preserves A-first research, evidence review and open gaps.
- Akateko's facts show **12 substantive works · target about 12** and the separately recorded **Adequate initial introduction** status. Its dated rationale names the kinds of inspected evidence and limits the judgment to introductory educational coverage. Remaining limits and research gaps remain visible; research completion and community review are explicitly separate.
- Ahtna's facts show **16 substantive works · target about 12** and **Not assessed**. No adequacy rationale/date block is generated for this default. Its expanded-profile label, sources, remaining gaps and independent evidence history are preserved. The old “Source minimum” and “minimum reached” fact labels are absent on both pages.

## Progress and compatibility checks

Read-only assertions passed across all 469 generated records:

- Exactly 454 original entries and 15 additions remain; progress slugs are unique.
- Only Akateko has an explicit source `initialAdequacy` object and a nondefault generated assessment. The other **468 records default to Not assessed**, including older expanded profiles and twelve-plus collections.
- Every generated adequacy object equals the independent defaults plus explicit profile fields. It is not inferred from source count, reading-depth label or review date.
- All `recordedContentChecks` equal actual source cards with `contentReviewedAt`, excluding `countsTowardMinimum:false`. Every `minimumSources` and `sourceTarget` remains 12, and every legacy `sourceMinimumReached` matches the unchanged twelve-plus calculation.
- Section prose, adequacy, depth labels, research gaps, evidence notes and research/community-completion fields in the generated profiles match source data. The generator's added slug/region/added metadata is expected, rather than a raw-file equality requirement.
- The retained `reviewed-minimum` filter still tests `Number(r.dataset.reviewed)>=12`. Its compatibility key/query routes and quantity semantics remain intact.

| Collection | Listed cards | Substantive checks | Supporting checks |
|---|---:|---:|---:|
| Abenaki | 13 | 13 | 0 |
| Abihka | 12 | 12 | 0 |
| Absentee Shawnee | 14 | 14 | 0 |
| Acoma Pueblo | 14 | 14 | 0 |
| Achumawi | 15 | 15 | 0 |
| Adai | 19 | 15 | 4 |
| Ahtna | 21 | 16 | 5 |
| Akateko | 14 | 12 | 2 |

Coverage reports 12 twelve-plus collections overall and 8 of 27 A collections. Akateko adds one to each quantity measure; the earlier counts are preserved. Those counts are not presented as numbers of adequate or completed histories. No research-completion field changed through the policy work.

## Follow-ups communicated to root

1. A scan of generated nation-page text for source-policy minimum phrases found one residue in Akateko's suggested-reading `linkNote`: “kept outside the directly focused minimum.” Root corrected this to “kept outside the directly focused substantive count” and deduplicated repeated reading leads, with later verified metadata winning. Final read: zero occurrences of the old phrase, one occurrence of the new phrase, and exactly four unique suggested-reading leads. Resolved.
2. During review, source `ak-migration-3.annotation` was clarified to distinguish photographs supplied for an event from a proposed museum/archive donation. The first generated snapshot still used “Proposed museum/photo transfers are not confirmed complete.” Final read confirmed “Photographs were supplied for the event” appears in the generated page, and the complete generated Akateko source-card and section arrays match main data. Resolved.

Root confirmed that both README-only historical-tense replacements in the preparation script were applied successfully. No new transform-anchor changes were made in this audit.

The final repository verifier, rendered-layout checks, package/staging equality and publication checks remain with root. This audit does not claim to re-inspect Akateko's research sources or verify the complete article's source fit.
