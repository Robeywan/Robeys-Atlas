(()=>{'use strict';
const section=document.querySelector('.atlas-map');if(!section)return;
const svg=section.querySelector('svg'),select=section.querySelector('select'),results=section.querySelector('#map-results'),hover=section.querySelector('.map-hover'),canvas=section.querySelector('.map-canvas');
const original=svg.getAttribute('viewBox').split(' ').map(Number);let view=[...original],drag=null,moved=false;
const links=[...svg.querySelectorAll('[data-map-region]')];
function choose(id,{focus=false}={}){
 const template=document.getElementById('map-template-'+id);if(!template)return;
 results.replaceChildren(template.content.cloneNode(true));select.value=id;
 links.forEach(a=>{const chosen=a.dataset.mapRegion===id;a.classList.toggle('selected',chosen);if(chosen)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});
 const url=new URL(location.href);url.searchParams.set('place',id);url.hash='map';history.replaceState(null,'',url);
 document.getElementById('map-selection-status').textContent=results.querySelector('h3')?.textContent+' selected. '+(results.querySelector('.map-result-heading p')?.textContent||'');hover.hidden=true;if(focus)results.focus({preventScroll:true});
}
select.addEventListener('change',()=>{if(select.value)choose(select.value,{focus:false});});
section.addEventListener('click',event=>{const a=event.target.closest('[data-map-region],[data-select-region]');if(!a||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();if(moved&&a.hasAttribute('data-map-region')&&event.detail>0){moved=false;return;}moved=false;choose(a.dataset.mapRegion||a.dataset.selectRegion,{focus:true});if(matchMedia('(max-width: 780px)').matches)results.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest'});});
function tooltip(a){const title=a.querySelector('title')?.textContent||a.getAttribute('aria-label');hover.textContent=title;hover.hidden=false;}
links.forEach(a=>{a.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch'&&!drag)tooltip(a);});a.addEventListener('pointerleave',()=>hover.hidden=true);a.addEventListener('focus',()=>tooltip(a));a.addEventListener('blur',()=>hover.hidden=true);a.addEventListener('keydown',event=>{if(event.key===' '){event.preventDefault();choose(a.dataset.mapRegion,{focus:true});}});});
function render(){svg.setAttribute('viewBox',view.join(' '));}
function zoom(factor){const width=Math.max(original[2]/6,Math.min(original[2],view[2]*factor)),height=width*original[3]/original[2];view=[view[0]+(view[2]-width)/2,view[1]+(view[3]-height)/2,width,height];if(width===original[2])view=[...original];render();}
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
