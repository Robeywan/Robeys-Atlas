# Tonto Apache supplied-study integration audit

Read-only audit, October 20, 2026. Compared the DOCX's fifteen external hyperlink targets and earlier XML extraction against main catalogue/profile data, `research/owner-study-latest-update.json`, generated profile pages, the reading-leads index and generated progress records. Baseline for unchanged data: committed Site HEAD `6c8869513feeaf5a4786b751ef786595e12e5bdb`, before this reading-lead integration. No Site files edited, no build/verifier run, and no new linked-source body or availability inspection performed.

## Result

**No material correction required.** All fifteen exact supplied URLs are retained and appropriately scoped. The old catalogue and existing source evidence remain intact. The addition is visibly suggested reading, with zero new substantive content checks. Alabama, original entry 9, remains the next research entry.

## URL preservation and placement

- The new catalogue document has fifteen distinct links, exactly matching the fifteen DOCX hyperlink relationships and printed bibliography URLs.
- All **226 earlier distinct owner-supplied URLs** remain. Their twelve complete catalogue document objects are unchanged from the baseline and agree with the first twelve extracted URL lists. Total: **13 studies and 241 distinct catalogue URLs**.
- Tonto Apache, original **395**, receives all fifteen URLs. Each is present on its generated page.
- Apache, original **16**, receives three selected broader-context leads: the Western Apache fire paper, NPS Sonoran Desert Apache article and Basso's historical Cibecue ethnography. Each appears on its generated page.
- Yavapai Apache, original **443**, receives six relevant leads: the Nation introduction, NPS Yavapai/Tonto historical article, Nation land/history PDF, language class, Exodus Day and dated public family notice. Each appears on its generated page.
- The placements contain no duplicate URLs within this study's collection. All previously existing profile reading leads remain. The generated reading index correctly states “13 supplied studies contribute 241 distinct URLs” and distinguishes inclusion from content review, accuracy and research completion.

## Evidence and status invariants

Compared all 469 main profiles with the baseline. **Every field except `researchLeads` is identical.** Only Apache, Tonto Apache and Yavapai Apache gained those leads. Therefore source-card arrays and URLs, annotations, all `contentReviewedAt` values, section prose and citations, depth labels, review dates, adequacy assessments and completion/community-review fields remain unchanged.

| Entry | Existing listed source cards | Substantive content checks | New reading leads | Depth retained | Initial adequacy |
|---|---:|---:|---:|---|---|
| Apache | 7 | 0 | 3 | Expanded profile | Not assessed |
| Tonto Apache | 3 | 0 | 15 | Source guide | Not assessed |
| Yavapai Apache | 3 | 0 | 6 | Source guide | Not assessed |

All new lead records retain “Awaiting original-source review” and have no `contentReviewedAt` field. Supplied bibliography labels are identified as provisional. Added availability dates/statuses do not become content checks; automated restrictions/failures are not labeled reader paywalls. The latest-update record correctly states `newContentChecks: 0` and the 15/3/6 placements.

## Scope review

The catalogue and profile context notes distinguish Payson tribal material, broader historical Tonto/Western Apache context, and the related Yavapai-Apache Nation. The San Carlos musician is not relabeled as a Payson interview; Cibecue ethnography is not presented as universal current Tonto practice. Catalogue object notes distinguish provenance from contemporary practice or image-reuse permission.

The 1972 statute's note explicitly warns against matching its older Payson community name automatically to today's Yavapai-Apache Nation. It is included on 395 and **is not placed on 443**, verified in that generated page. The constitution is retained as a document needing adoption/amendment and status checks, rather than proof of current governing rules.

The ceremonial item has a general dated-public-family-notice label, pending-review status and a warning about cultural context and reuse. No ceremony narrative, participant biography, images or event logistics from the attachment are republished. Its public source URL is retained as requested. The Exodus Day lead separates a schedule from verified occurrence; the language-class lead separates this Nation's program from Payson school institutions and measured outcomes.

## Attachment and local-path check

There are no `.docx` files anywhere in the Site tree. A scan of Site JSON, HTML, Markdown, JavaScript and text files found no uploaded attachment's Desktop/OneDrive path, `file://` reference to that location, or `originalDocx` metadata field. Main profile prose is unchanged, so the supplied study body has not been adopted as verified factual synthesis. The attachment remains private local owner research material; source links and document provenance are the integrated content.

This audit concerns reading-lead preservation, scope and status integrity. It does not establish the linked publications' factual accuracy, current availability, legal interpretation, image permissions or cultural reuse rights. Final package and publication verification remain with root.
