// Derived display/discovery metadata. Original source annotations and profile records remain the evidence.
export function perspectiveGroups(s){
 const raw=String(s.type||'').toLowerCase(),groups=[];
 if(s.indigenousLed===true||raw.startsWith('indigenous-led'))groups.push('Indigenous-led');
 if(/government|federal|tribal code|primary legal|primary treaty|congressional/.test(raw))groups.push('Government');
 if(/museum|archiv|library/.test(raw))groups.push('Museum / archive');
 if(/academic|scholar|peer-reviewed|university|thesis|encyclopedia/.test(raw))groups.push('Academic / reference');
 if(/reporting|reported|journalism|interview/.test(raw))groups.push('Reporting / interview');
 return groups.length?groups:['Other / see annotation'];
}
export function sourceReviewFacts(s,e,dateLabel){
 const rows=[];
 let status=s.identificationOnly?'Identity check only':s.inspectionStatus||
  (s.contentReviewedAt?(s.countsTowardMinimum===false?'Supporting or limited review; see scope':'Content reviewed for the stated scope'):'Content review not recorded');
 rows.push(`<p><strong>Inspection:</strong> ${e(status)}</p>`);
 if(s.contentReviewScope||s.reviewScope)rows.push(`<p><strong>Scope:</strong> ${e(s.contentReviewScope||s.reviewScope)}</p>`);
 if(s.contentReviewedAt)rows.push(`<p><strong>Review recorded:</strong> ${e(dateLabel(s.contentReviewedAt))}</p>`);
 else if(s.accessed)rows.push(`<p><strong>Access recorded:</strong> ${e(dateLabel(s.accessed))}</p>`);
 if(s.accessStatus)rows.push(`<p><strong>Access status:</strong> ${e(s.accessStatus)}</p>`);
 const notes=[s.accessNote,s.accessNotes].flat().filter(v=>typeof v==='string'&&v.trim());
 for(const note of [...new Set(notes)])rows.push(`<p><strong>Access note:</strong> ${e(note)}</p>`);
 if(s.countsTowardMinimum===false&&s.countReason)rows.push(`<p><strong>Counting note:</strong> ${e(s.countReason)}</p>`);
 return `<div class="source-review-block">${rows.join('')}</div>`;
}
export function sourceContextDetails(s,{e,dateLabel,base,inspectedLinks}){
 const contexts=s.profileContexts||[];
 if(contexts.length<2)return '';
 return `<details class="source-contexts"><summary>Profile-specific review notes (${contexts.length})</summary><p>One linked work can have different uses and inspection limits in different profiles. A supporting or identity check is not a substantive history review.</p>${contexts.map(c=>`<section class="source-context"><h4><a href="${base}nations/${e(c.profileSlug)}/#${e(c.profileAnchor)}">${e(c.profileName)}</a></h4>${c.type?`<p><strong>Recorded perspective/type:</strong> ${e(c.type)}</p>`:''}${c.annotation?`<p>${e(c.annotation)}</p>`:''}${sourceReviewFacts(c,e,dateLabel)}${inspectedLinks(c)}</section>`).join('')}</details>`;
}
