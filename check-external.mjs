import fs from 'node:fs';
const profiles=JSON.parse(fs.readFileSync('data/profiles.json','utf8'));
const urls=[...new Set(profiles.flatMap(p=>p.sources.map(s=>s.url)))];
const records=[];let index=0;
async function worker(){while(index<urls.length){const url=urls[index++];try{const r=await fetch(url,{method:'GET',redirect:'follow',signal:AbortSignal.timeout(12000),headers:{'User-Agent':'Mozilla/5.0 (compatible; NationsAtlas/1.0; educational link check)'}});records.push({url,status:r.status,finalUrl:r.url});await r.body?.cancel();}catch(e){records.push({url,status:'unavailable',reason:e.name});}if(records.length%100===0)console.log('Checked '+records.length+'/'+urls.length);}}
await Promise.all(Array.from({length:16},worker));
fs.writeFileSync('../external-link-audit.json',JSON.stringify(records,null,2));
console.log(JSON.stringify({checked:records.length,ok:records.filter(r=>r.status>=200&&r.status<400).length,notFound:records.filter(r=>r.status===404||r.status===410).map(r=>r.url),restrictedOrUnavailable:records.filter(r=>!(r.status>=200&&r.status<400)&&r.status!==404&&r.status!==410).length}));
