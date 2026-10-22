from pathlib import Path
p=Path('/mnt/data/keyora-next/src/main.js')
s=p.read_text()
s=s.replace("function render(){\n let pageHtml='';", "function render(){\n let pageHtml='';")
# Add reveal setup at end of render after focus
old=""" document.body.classList.toggle('modal-open',!!state.selected||state.page==='cart');
 if(state.selected) app.querySelector('.product-modal .modal-close')?.focus();
}
function navigate(page){"""
new=""" document.body.classList.toggle('modal-open',!!state.selected||state.page==='cart');
 if(state.selected) app.querySelector('.product-modal .modal-close')?.focus();
 setupScrollReveal();
}

let loaderTimer = 0;
function showBrandLoader(duration=520){
 clearTimeout(loaderTimer);
 document.querySelector('.keyora-loader')?.remove();
 const loader=document.createElement('div');
 loader.className='keyora-loader';
 loader.setAttribute('role','status');
 loader.setAttribute('aria-live','polite');
 loader.setAttribute('aria-label','KEYORA yükleniyor');
 loader.innerHTML=`<div class="loader-brand"><span class="brand-mark">K</span><span>KEYORA<span class="brand-period">.</span></span></div><div class="loader-orbit"><span></span><span></span><span></span></div><p>İyi tasarım, doğru zamanda.</p><div class="loader-progress"><span></span></div>`;
 document.body.appendChild(loader);
 requestAnimationFrame(()=>loader.classList.add('is-visible'));
 loaderTimer=setTimeout(()=>{
   loader.classList.add('is-leaving');
   setTimeout(()=>loader.remove(),360);
 },duration);
}

let revealObserver;
function setupScrollReveal(){
 if(!('IntersectionObserver' in window)) return;
 revealObserver?.disconnect();
 const targets=app.querySelectorAll('.hero-copy,.hero-visual,.trust-strip,.section-heading,.category-card,.product-card,.manifesto-art,.manifesto-copy,.newsletter-band,.catalog-hero,.catalog-toolbar,.filters,.catalog-results,.content-page>.eyebrow,.content-page>h1,.content-page>.content-lead,.checkout-form,.checkout-summary,.not-found-art,.not-found h1,.not-found>p,.faq-list,.contact-form');
 targets.forEach(el=>el.classList.add('scroll-reveal'));
 document.body.classList.add('motion-ready');
 revealObserver=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{
     if(entry.isIntersecting){entry.target.classList.add('is-revealed');revealObserver.unobserve(entry.target);}
   });
 },{threshold:0.08,rootMargin:'0px 0px -24px 0px'});
 targets.forEach(el=>revealObserver.observe(el));
}

function navigate(page){"""
if old not in s: raise SystemExit('render marker not found')
s=s.replace(old,new)
s=s.replace("render(); window.scrollTo({top:0,behavior:'smooth'});\n}
function showCatalog", "render(); showBrandLoader(520); window.scrollTo({top:0,behavior:'smooth'});\n}
function showCatalog")
s=s.replace(" state.selected=null;render();\n});\nconst initialPath", " state.selected=null;render();showBrandLoader(420);\n});\nconst initialPath")
s=s.replace("render();\n", "render();\n", 1)
# final startup render only
if not s.endswith('render();\n'):
    print('Unexpected tail',repr(s[-50:]))
else:
    s=s[:-len('render();\n')]+'render();\nshowBrandLoader(900);\n'
p.write_text(s)

css=Path('/mnt/data/keyora-next/src/style.css')
t=css.read_text()
t += r'''

/* KEYORA branded loading transition */
.keyora-loader{position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;background:#171c18;color:#f4f5ee;opacity:0;visibility:hidden;transition:opacity .32s ease,visibility .32s ease;pointer-events:none}
.keyora-loader.is-visible{opacity:1;visibility:visible;pointer-events:auto}
.keyora-loader.is-leaving{opacity:0;visibility:hidden;pointer-events:none}
.loader-brand{display:flex;align-items:center;gap:11px;font:700 clamp(25px,4vw,34px) var(--display);letter-spacing:-.085em}
.loader-brand .brand-mark{width:43px;height:43px;border-radius:12px;font-size:29px;box-shadow:0 0 35px #c9fb5520;animation:loaderMark 1.7s ease-in-out infinite}
.loader-brand .brand-period{color:var(--lime)}
.loader-orbit{position:relative;width:88px;height:88px;border:1px solid #414a3e;border-radius:50%;animation:loaderRotate 2.8s linear infinite}
.loader-orbit:before,.loader-orbit:after{content:"";position:absolute;inset:11px;border:1px dashed #69775a;border-radius:50%}
.loader-orbit:after{inset:25px;border-style:solid;border-color:#c9fb5560}
.loader-orbit span{position:absolute;top:7px;left:40px;width:7px;height:7px;border-radius:50%;background:var(--lime);box-shadow:0 0 15px #c9fb55}
.loader-orbit span:nth-child(2){top:auto;left:9px;bottom:19px;width:5px;height:5px;background:#a8b6ff;box-shadow:0 0 12px #a8b6ff}
.loader-orbit span:nth-child(3){top:42px;left:auto;right:2px;width:4px;height:4px;background:#e7c6a5;box-shadow:0 0 10px #e7c6a5}
.keyora-loader p{margin:0;color:#aab3a6;font-size:10px;letter-spacing:.12em;text-transform:uppercase}
.loader-progress{width:120px;height:2px;overflow:hidden;background:#3b4339;border-radius:2px}
.loader-progress span{display:block;width:40%;height:100%;background:var(--lime);animation:loaderProgress 1.1s ease-in-out infinite}
@keyframes loaderRotate{to{transform:rotate(360deg)}}
@keyframes loaderMark{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-3px) rotate(-4deg)}}
@keyframes loaderProgress{0%{transform:translateX(-110%)}100%{transform:translateX(360%)}}
html{scroll-behavior:smooth;scroll-padding-top:88px}
.scroll-reveal{transition:opacity .65s ease,transform .65s cubic-bezier(.2,.7,.2,1);transition-delay:var(--reveal-delay,0ms)}
.motion-ready .scroll-reveal:not(.is-revealed){opacity:0;transform:translateY(22px)}
.motion-ready .scroll-reveal.is-revealed{opacity:1;transform:translateY(0)}
.product-card:nth-child(4n+2),.category-card:nth-child(3){--reveal-delay:70ms}
.product-card:nth-child(4n+3),.category-card:nth-child(4){--reveal-delay:120ms}
.product-card:nth-child(4n+4),.category-card:nth-child(5){--reveal-delay:170ms}
@media(prefers-reduced-motion:reduce){.keyora-loader,.loader-brand .brand-mark,.loader-orbit,.loader-progress span,.scroll-reveal{animation:none!important;transition:none!important}.motion-ready .scroll-reveal:not(.is-revealed){opacity:1;transform:none}}
'''
css.write_text(t)
