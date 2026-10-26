(()=>{
 const form=document.querySelector('#historic-filters');if(!form)return;
 const grid=document.querySelector('#historic-grid');if(!grid)return;
 const cards=[...grid.querySelectorAll('[data-historic-card]')];
 // Keep each record in the list where the static page originally placed it.
 const records=cards.map((card,index)=>({
  card,index,
  list:card.closest('[data-historic-list]')||grid,
  group:card.closest('[data-historic-group]'),
  year:Number(card.dataset.year),
  regions:JSON.parse(card.dataset.regions),
  peoples:JSON.parse(card.dataset.peoples)
 }));
 const lists=[...new Set(records.map(record=>record.list))];
 const groups=[...grid.querySelectorAll('[data-historic-group]')];
 const search=document.querySelector('#historic-search'),region=document.querySelector('#historic-region'),period=document.querySelector('#historic-period'),sort=document.querySelector('#historic-sort'),people=document.querySelector('#historic-people');
 const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 function update(){
  const terms=normalize(search.value.trim()).split(/\s+/).filter(Boolean);
  let count=0;
  for(const record of records){
   const {card,year,regions,peoples}=record;
   const matchesDate=!period.value||period.value==='early'&&year<1800||period.value==='nineteenth'&&year>=1800&&year<1900||period.value==='twentieth'&&year>=1900;
   card.hidden=!(terms.every(term=>normalize(card.dataset.search).includes(term))&&(!region.value||regions.includes(region.value))&&(!people.value||peoples.includes(people.value))&&matchesDate);
   if(!card.hidden)count++;
  }
  for(const list of lists){
   const sorted=records.filter(record=>record.list===list).sort((a,b)=>{
    const dated=sort.value==='oldest'?a.year-b.year:sort.value==='newest'?b.year-a.year:0;
    return dated||a.index-b.index;
   });
   for(const record of sorted)list.append(record.card);
  }
  for(const group of groups)group.hidden=!records.some(record=>record.group===group&&!record.card.hidden);
  document.querySelector('#historic-count').textContent=`${count} of ${cards.length} maps`;
  document.querySelector('#historic-empty').hidden=count!==0;
 }
 form.hidden=false;form.addEventListener('submit',e=>e.preventDefault());form.addEventListener('input',update);form.addEventListener('change',update);form.addEventListener('reset',()=>setTimeout(update,0));
 update();
})();
