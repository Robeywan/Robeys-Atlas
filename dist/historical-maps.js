(()=>{
 const form=document.querySelector('#historic-filters');if(!form)return;
 const grid=document.querySelector('#historic-grid'), cards=[...grid.querySelectorAll('[data-historic-card]')];
 const search=document.querySelector('#historic-search'),region=document.querySelector('#historic-region'),period=document.querySelector('#historic-period'),sort=document.querySelector('#historic-sort'),people=document.querySelector('#historic-people');
 const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 function update(){
  const terms=normalize(search.value.trim()).split(/\s+/).filter(Boolean);
  const sorted=[...cards].sort((a,b)=>sort.value==='oldest'?Number(a.dataset.year)-Number(b.dataset.year):sort.value==='newest'?Number(b.dataset.year)-Number(a.dataset.year):cards.indexOf(a)-cards.indexOf(b));
  let count=0;
  for(const card of sorted){const year=Number(card.dataset.year), area=JSON.parse(card.dataset.regions);card.hidden=!(terms.every(t=>normalize(card.dataset.search).includes(t))&&(!region.value||area.includes(region.value))&&(!people.value||JSON.parse(card.dataset.peoples).includes(people.value))&&(!period.value||period.value==='early'&&year<1800||period.value==='nineteenth'&&year>=1800&&year<1900||period.value==='twentieth'&&year>=1900));if(!card.hidden)count++;grid.append(card);}
  document.querySelector('#historic-count').textContent=`${count} of ${cards.length} maps`;
  document.querySelector('#historic-empty').hidden=count!==0;
 }
 form.hidden=false;form.addEventListener('submit',e=>e.preventDefault());form.addEventListener('input',update);form.addEventListener('change',update);form.addEventListener('reset',()=>setTimeout(update,0));
})();
