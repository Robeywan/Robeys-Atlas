import fs from 'node:fs';
const file='data/profiles.json';
const profiles=JSON.parse(fs.readFileSync(file,'utf8'));
for(const p of profiles){
  const before=p.sources;
  const remove=s=>p.originalId===215&&s.url.includes('okhistory.org')&&!/mingo/i.test(s.title+' '+s.url)||p.originalId===321&&s.url.includes('ramaytush')||p.originalId===241&&/\/Contact/i.test(s.url);
  p.sources=p.sources.filter(s=>!remove(s));if(!p.sources.length)p.sources=before;
  for(const s of p.sources){const host=new URL(s.url).hostname; if((/\.gov(?:\.|$)|\.gob\./.test(host))&&!/nsn|tribe|tribal|nation|pueblo|chumash|pitriver/.test(host)&&s.type!=='Museum / archive')s.type='Government';}
  const ids=new Set(p.sources.map(s=>s.id));for(const section of p.sections)section.sourceIds=section.sourceIds.filter(id=>ids.has(id));for(const section of p.sections)if(!section.sourceIds.length)section.sourceIds=[p.sources[0].id];
}
fs.writeFileSync(file,JSON.stringify(profiles,null,2));
console.log('Refined source labels and removed identified mismatches.');
