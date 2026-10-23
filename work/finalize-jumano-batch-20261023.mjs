import fs from "node:fs";

const root = new URL("../", import.meta.url);
const project = new URL("../../../", import.meta.url);
const profiles = JSON.parse(fs.readFileSync(new URL("data/profiles.json", root), "utf8"));
const jumano = profiles.find(item => item.originalId === 151);
const ownerLeadsPath = new URL("data/owner-reading-leads.json", root);
const ownerLeads = JSON.parse(fs.readFileSync(ownerLeadsPath, "utf8"));
const document = ownerLeads.documents.find(item => item.key === "Jumano_History_Culture_and_Timeline");
if (!document || !jumano) throw new Error("Jumano owner study or profile missing");
const reviewedLeads = new Map((jumano.researchLeads ?? []).map(lead => [lead.url, lead]));
for (const lead of document.links) {
  const current = reviewedLeads.get(lead.url);
  if (!current) continue;
  for (const field of ["title", "reviewStatus", "matchedSourceId", "contentReviewScope", "supportingReview"]) {
    if (Object.hasOwn(current, field)) lead[field] = current[field];
  }
}
fs.writeFileSync(ownerLeadsPath, JSON.stringify(ownerLeads, null, 2) + "\n", "utf8");

const planPath = new URL("outputs/Research-Plan.md", project);
let plan = fs.readFileSync(planPath, "utf8");
const updatedJumano = "The Jumano profile (original 151) now has 12 substantive inspected works, eight supporting references excluded from that count, six cited sections, and a dated **Still unfinished** adequacy judgment. The source target is met for now, but the evidence remains weighted toward colonial records and secondary interpretation; direct archival review, broader community-authored work, and community review remain gaps. Six of the owner study’s 13 previously unread leads have now been inspected and scoped; seven remain unread. No map was added because the exhibit’s historical maps were not reviewed as objects or for reuse. Next begin Minnesota coverage with Dakota (original 95), then continue the state-level coverage review before Idaho. Preserve source-first priorities and keep map research incidental to supported profile research.";
plan = plan.replace(/^The Kickapoo \(original entry 165\)[^\r\n]*/m, updatedJumano);
fs.writeFileSync(planPath, plan, "utf8");

const queuePath = new URL("outputs/Regional-Research-Queue.md", project);
const queueHeading = "# Jumano profile review — October 23, 2026\n\nJumano (original 151) now has twelve substantive inspected works, eight supporting references excluded, six cited sections, and initial adequacy **Still unfinished**. The owner-supplied study contributed eighteen public URLs: five were previously matched to inspected source cards, six additional leads were reviewed in this batch (four substantive works and two supporting records), and seven remain unread. Important gaps remain in direct archival review and community-authored coverage. No map was added.\n\nNext: focus Minnesota source research on Dakota (original 95), then check coverage of Minnesota’s separate Ojibwe governments and proceed to Idaho. This follows the owner’s Texas, Minnesota, Idaho priority; add maps only when regular source research documents a specific association.\n\n";
fs.writeFileSync(queuePath, queueHeading + fs.readFileSync(queuePath, "utf8"), "utf8");

const queueForOwner = new URL("outputs/Owner-Study-Research-Queue.md", project);
let ownerQueue = fs.readFileSync(queueForOwner, "utf8");
ownerQueue = ownerQueue.replace(
  /The 18 Jumano URLs were added as suggested reading: five match previously inspected source cards and thirteen remain unread leads\./,
  "The 18 Jumano URLs remain preserved as suggested reading: five match earlier inspected source cards, six additional original pages have now been inspected (four substantive works and two supporting references), and seven remain unread. The study is a bibliography lead, not authority by itself."
);
fs.writeFileSync(queueForOwner, ownerQueue, "utf8");

const siteResearch = new URL("research/", root);
for (const name of [
  "Research-Plan.md", "Atlas-Vision.md", "Interactive-Map-Plan.md",
  "Regional-Research-Queue.md", "Regional-Community-Coverage-Review.md",
  "Regional-Community-Coverage-Review.json"
]) {
  const source = new URL(`outputs/${name}`, project);
  fs.copyFileSync(source, new URL(name, siteResearch));
}

const substantive = jumano.sources.filter(source => source.contentReviewedAt && source.countsTowardMinimum !== false).length;
const supporting = jumano.sources.filter(source => source.contentReviewedAt && source.countsTowardMinimum === false).length;
console.log(JSON.stringify({ownerStudyLinks: document.links.length, inspectedOwnerStudyLinks: document.links.filter(link => link.matchedSourceId).length, remainingUnread: document.links.filter(link => !link.matchedSourceId && link.reviewStatus === "Awaiting original-source review").length, substantive, supporting}));
