const arrival = document.getElementById('arrival');
const nav = document.querySelector('.site-header nav');
const menuToggle = document.querySelector('.menu-toggle');
const backTop = document.querySelector('.back-top');
const dismissArrival = () => { if (window.scrollY > 35 || location.hash) arrival.classList.add('is-gone'); };
window.addEventListener('scroll', () => { dismissArrival(); backTop.classList.toggle('show', window.scrollY > 480); }, { passive: true });
window.addEventListener('wheel', e => { if (!arrival.classList.contains('is-gone')) { e.preventDefault(); arrival.classList.add('is-gone'); } }, { once: true, passive: false });
window.addEventListener('touchmove', e => { if (!arrival.classList.contains('is-gone')) { e.preventDefault(); arrival.classList.add('is-gone'); } }, { once: true, passive: false });
window.addEventListener('keydown', e => { if (['ArrowDown','PageDown','Space'].includes(e.code)) arrival.classList.add('is-gone'); });
dismissArrival();
window.addEventListener('pageshow', dismissArrival);
setTimeout(dismissArrival, 300);
setTimeout(() => arrival.classList.add('ready'), 50);
menuToggle.addEventListener('click', () => { const open = nav.classList.toggle('open'); menuToggle.setAttribute('aria-expanded', String(open)); menuToggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню'); });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); menuToggle.setAttribute('aria-expanded','false'); menuToggle.setAttribute('aria-label','Открыть меню'); arrival.classList.add('is-gone'); }));
backTop.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

const tabs = [...document.querySelectorAll('[role="tab"]')];
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(index));
  tab.addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); const next = (index + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length; activateTab(next); tabs[next].focus(); } });
});
function activateTab(index) { tabs.forEach((tab, i) => { const selected = i === index; tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1; document.getElementById(tab.getAttribute('aria-controls')).hidden = !selected; }); }

const gallery = Array.from({length:16}, (_,i) => ({src:`assets/gallery-${String(i+1).padStart(2,'0')}.jpg`,alt:`Фотография бистро Meteorite, кадр ${String(i+1).padStart(2,'0')}`}));
const track = document.getElementById('gallery-track');
for(let copy=0;copy<2;copy++) gallery.forEach((item,index) => { const button=document.createElement('button'); button.type='button'; button.className='gallery-tile'; button.setAttribute('aria-label',`Открыть фотографию ${index+1} из ${gallery.length}`); const img=document.createElement('img'); img.src=item.src; img.alt=item.alt; img.loading='lazy'; button.append(img); button.addEventListener('click',()=>openLightbox(index)); track.append(button); });
const box=document.getElementById('lightbox');
const currentImg=box.querySelector('.lightbox-current img');
const caption=box.querySelector('figcaption');
const neighbors=[...box.querySelectorAll('.lightbox-neighbor')];
let active=0, lastFocus=null, touchX=0;
function updateLightbox(){ currentImg.src=gallery[active].src; currentImg.alt=gallery[active].alt; caption.textContent=`METEORITE / ${String(active+1).padStart(2,'0')} — ${String(gallery.length).padStart(2,'0')}`; neighbors.forEach((b,i)=>{ const index=(active+(i===0?-1:1)+gallery.length)%gallery.length; const img=b.querySelector('img'); img.src=gallery[index].src; img.alt=gallery[index].alt; }); }
function openLightbox(index){ lastFocus=document.activeElement; active=index; updateLightbox(); box.hidden=false; document.body.classList.add('lightbox-open'); box.querySelector('.lightbox-close').focus(); }
function closeLightbox(){ box.hidden=true; document.body.classList.remove('lightbox-open'); lastFocus?.focus(); }
function step(delta){ active=(active+delta+gallery.length)%gallery.length; updateLightbox(); }
box.querySelector('.lightbox-close').addEventListener('click',closeLightbox);
box.querySelector('.lightbox-prev').addEventListener('click',()=>step(-1));
box.querySelector('.lightbox-next').addEventListener('click',()=>step(1));
neighbors.forEach(b=>b.addEventListener('click',()=>step(Number(b.dataset.offset))));
box.addEventListener('click',e=>{ if(e.target===box) closeLightbox(); });
box.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX;},{passive:true});
box.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>50) step(dx<0?1:-1);},{passive:true});
document.addEventListener('keydown',e=>{if(box.hidden)return; if(e.key==='Escape')closeLightbox(); if(e.key==='ArrowLeft')step(-1); if(e.key==='ArrowRight')step(1); if(e.key==='Tab'){ const buttons=[...box.querySelectorAll('button')]; const first=buttons[0],last=buttons[buttons.length-1]; if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
