(()=>{'use strict';
const MAP_PAGE_SIZE=20;
function mountMapPagination({container,list,items,label,cloneItems,announce,focusTarget}){
 const state={page:1,previous:null,next:null,summary:null};
 function render(requested,{focus=false}={}){
  const pages=Math.max(1,Math.ceil(items.length/MAP_PAGE_SIZE));
  const candidate=Number.isFinite(Number(requested))?Math.floor(Number(requested)):1;
  state.page=Math.max(1,Math.min(pages,candidate));
  const start=(state.page-1)*MAP_PAGE_SIZE,visible=items.slice(start,start+MAP_PAGE_SIZE);
  if(list){const fragment=document.createDocumentFragment();visible.forEach(item=>fragment.append(cloneItems?item.cloneNode(true):item));list.replaceChildren(fragment);}
  const text=items.length?'Showing '+(start+1)+'–'+(start+visible.length)+' of '+items.length+'. Page '+state.page+' of '+pages+'.':'No directory entries are listed for this region yet.';
  if(state.summary)state.summary.textContent=text;
  if(state.previous)state.previous.disabled=state.page===1;
  if(state.next)state.next.disabled=state.page===pages;
  if(announce)announce(text);
  if(focus)focusTarget.focus({preventScroll:true});
 }
 if(items.length>MAP_PAGE_SIZE){
  const pager=document.createElement('nav');pager.className='map-pagination';pager.setAttribute('aria-label',label+' directory pages');
  const previous=document.createElement('button');previous.type='button';previous.textContent='Previous';previous.setAttribute('aria-controls',list.id);
  const summary=document.createElement('span');summary.className='map-page-summary';
  const next=document.createElement('button');next.type='button';next.textContent='Next';next.setAttribute('aria-controls',list.id);
  pager.append(previous,summary,next);list.after(pager);Object.assign(state,{previous,next,summary});
  previous.addEventListener('click',()=>render(state.page-1,{focus:true}));
  next.addEventListener('click',()=>render(state.page+1,{focus:true}));
 }
 render(1);return {render};
}
document.querySelectorAll('.region-page').forEach((page,index)=>{
 const list=Array.from(page.children).find(node=>node.matches('.map-nations'));if(!list||list.children.length<=MAP_PAGE_SIZE)return;
 const items=Array.from(list.children),label=page.querySelector('h3')?.textContent||document.querySelector('h1')?.textContent||'Region';
 list.id='region-results-list-'+index;page.tabIndex=-1;
 const status=document.createElement('p');status.className='map-page-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');list.before(status);
 list.replaceChildren();
 mountMapPagination({container:page,list,items,label,cloneItems:false,announce:text=>status.textContent=label+'. '+text,focusTarget:page});
});
const section=document.querySelector('.atlas-map');if(!section)return;
const svg=section.querySelector('svg'),select=section.querySelector('select'),results=section.querySelector('#map-results'),hover=section.querySelector('.map-hover'),canvas=section.querySelector('.map-canvas');
const original=svg.getAttribute('viewBox').split(' ').map(Number);let view=[...original],drag=null,moved=false;
const links=[...svg.querySelectorAll('[data-map-region]')];
function choose(id,{focus=false}={}){
 const template=document.getElementById('map-template-'+id);if(!template)return;
 const sourceList=template.content.querySelector('.map-nations');if(sourceList&&sourceList.parentNode!==template.content)return;
 const items=sourceList?Array.from(sourceList.children):[],shell=document.createDocumentFragment();let list=null;
 for(const node of template.content.childNodes){if(node===sourceList){list=node.cloneNode(false);list.id='map-results-list';shell.append(list);}else shell.append(node.cloneNode(true));}
 results.replaceChildren(shell);select.value=id;
 const label=results.querySelector('h3')?.textContent||select.selectedOptions[0]?.textContent||'Region';
 mountMapPagination({container:results,list,items,label,cloneItems:true,announce:text=>document.getElementById('map-selection-status').textContent=label+' selected. '+text,focusTarget:results});
 links.forEach(a=>{const chosen=a.dataset.mapRegion===id;a.classList.toggle('selected',chosen);if(chosen)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});
 const url=new URL(location.href);url.searchParams.set('place',id);url.hash='map';history.replaceState(null,'',url);
 hover.hidden=true;if(focus)results.focus({preventScroll:true});
}
select.addEventListener('change',()=>{if(select.value)choose(select.value,{focus:false});});
section.addEventListener('click',event=>{const a=event.target.closest('[data-map-region],[data-select-region]');if(!a||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();if(moved&&a.hasAttribute('data-map-region')&&event.detail>0){moved=false;return;}moved=false;choose(a.dataset.mapRegion||a.dataset.selectRegion,{focus:true});if(matchMedia('(max-width: 780px)').matches)results.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest'});});
function tooltip(a){const title=a.querySelector('title')?.textContent||a.getAttribute('aria-label');hover.textContent=title;hover.hidden=false;}
links.forEach(a=>{a.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch'&&!drag)tooltip(a);});a.addEventListener('pointerleave',()=>hover.hidden=true);a.addEventListener('focus',()=>tooltip(a));a.addEventListener('blur',()=>hover.hidden=true);a.addEventListener('keydown',event=>{if(event.key===' '){event.preventDefault();choose(a.dataset.mapRegion,{focus:true});}});});
function render(){svg.setAttribute('viewBox',view.join(' '));}
function zoom(factor){const width=Math.max(original[2]/6,Math.min(original[2],view[2]*factor)),height=width*original[3]/original[2];let cx=view[0]+view[2]/2,cy=view[1]+view[3]/2;const chosen=svg.querySelector('a.selected path');if(factor<1&&view[2]===original[2]&&chosen){const box=chosen.getBBox();cx=box.x+box.width/2;cy=box.y+box.height/2;}view=[cx-width/2,cy-height/2,width,height];if(width===original[2])view=[...original];render();}
section.querySelectorAll('[data-map-zoom]').forEach(b=>b.addEventListener('click',()=>zoom(b.dataset.mapZoom==='in'?.7:1/.7)));
section.querySelector('[data-map-reset]').addEventListener('click',()=>{view=[...original];render();});
svg.addEventListener('pointerdown',event=>{if(event.button!==0)return;moved=false;drag={x:event.clientX,y:event.clientY,view:[...view],id:event.pointerId};hover.hidden=true;});
svg.addEventListener('pointermove',event=>{if(!drag)return;const dx=event.clientX-drag.x,dy=event.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)<6&&!moved)return;moved=true;const rect=svg.getBoundingClientRect();view=[drag.view[0]-dx/rect.width*drag.view[2],drag.view[1]-dy/rect.height*drag.view[3],view[2],view[3]];render();});
window.addEventListener('pointerup',()=>{drag=null;});
svg.addEventListener('keydown',event=>{const delta=view[2]*.1;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)){event.preventDefault();view[0]+=event.key==='ArrowLeft'?-delta:event.key==='ArrowRight'?delta:0;view[1]+=event.key==='ArrowUp'?-delta:event.key==='ArrowDown'?delta:0;render();}});
svg.addEventListener('pointercancel',()=>{drag=null;moved=false;});
const initial=new URLSearchParams(location.search).get('place');if(initial)choose(initial);
document.addEventListener('keydown',event=>{if(event.key==='Escape')hover.hidden=true;});
})();
