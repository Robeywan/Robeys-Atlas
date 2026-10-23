import fs from "node:fs";
const project = new URL("../../../", import.meta.url);
const receipt = JSON.parse(fs.readFileSync(new URL("outputs/Jumano-Publication-Record.json", project), "utf8"));
const statusPath = new URL("outputs/Publication-Status.md", project);
const status = [
  "## Latest research publication — Jumano (October 23, 2026)", "",
  `Published public version 46 at ${receipt.publishedAt}. [Open Jumano](${receipt.url}) · [Open the Atlas](https://indigenous-nations-reading-atlas.calmlamp34.chatgpt.site/).`, "",
  "The profile now has 12 substantive inspected works, eight supporting references excluded from the count, six cited sections, and initial adequacy **Still unfinished**. Six additional owner-study leads were inspected in this batch, four substantive and two supporting; seven of the study’s eighteen links remain unread. The profile now compares historical naming and La Junta interpretations, adds context on Sabeata and the 1683–84 expedition, and records source limits. No map was added. Full review: outputs/Jumano-Texas-Research-Review-2026-10-23.md; receipt: outputs/Jumano-Publication-Record.json.", "",
  "Validation passed for 471 profiles, 21,098 internal links, 9,636 citation anchors, 103 regional routes, all 17 historical maps, and reciprocal map/profile links. The live page and reviewed/unread lead states were inspected. Research progress and website ZIP were refreshed.", "",
  `Source commit ${receipt.sourceCommit}; saved version ${receipt.savedVersion}; successful deployment ${receipt.deploymentId}. No retry pending. Next: Minnesota source research, beginning with Dakota (original 95), followed by coverage review of Minnesota’s separate Ojibwe governments, then Idaho.`, "",
  "Usage after publication: ordinary usage available; five-hour window 47% consumed, weekly 23% consumed, shared credit balance 53.8894195. No credits spent.", "", "---", ""
].join("\n");
fs.writeFileSync(statusPath, status + fs.readFileSync(statusPath, "utf8"), "utf8");
const checkpointPath = new URL("outputs/Research-Continuation-Checkpoint.md", project);
const checkpoint = [
  "# Current continuation checkpoint — October 23, 2026", "",
  "Latest source-focused publication: Jumano (original 151), with 12 substantive inspected works, eight supporting references excluded, six cited sections, and initial adequacy **Still unfinished**. The owner-supplied study contributes eighteen public URLs: five matched earlier inspected works, six more leads were reviewed during this pass, and seven remain unread. The synthesis distinguishes historical labels and community organizations, explains La Junta evidence and Sabeata’s expedition context, and retains disagreements and limits. No map was added. Review: outputs/Jumano-Texas-Research-Review-2026-10-23.md. Publication record: outputs/Jumano-Publication-Record.json.", "",
  `Source commit ${receipt.sourceCommit}; public version 46; successful deployment ${receipt.deploymentId}. No retry pending.`, "",
  "Next target: Dakota (original 95), focusing on Minnesota-specific community sources; then review the distinct Minnesota Ojibwe governments and continue the state priority in Idaho. Keep significant historical-map hunting paused; add a map only when profile research directly supports a specific association.", "",
  "Usage checkpoint: ordinary use available; five-hour window 47% consumed, weekly window 23% consumed, shared balance 53.8894195 credits. No credits used. Use ordinary usage while available, preserve the weekly 85% ceiling, and save a checkpoint before the five-hour window is exhausted.", "",
  "The Atlas contains 471 directory access points (454 original plus 17 supported additions), the published regional map and 17-record historical map library. Preserve all supplied-study provenance and existing photo/map credits.", "", "---", ""
].join("\n");
fs.writeFileSync(checkpointPath, checkpoint + fs.readFileSync(checkpointPath, "utf8"), "utf8");
console.log(JSON.stringify({publicationStatus: statusPath.pathname, checkpoint: checkpointPath.pathname, version: receipt.versionNumber, next: "Dakota (95)"}));
