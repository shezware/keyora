import './style.css';

const shopierProductLinks = { k5: 'https://www.shopier.com/key0racom/52146611' };

const products = [
  {id:'k1', name:'K87 Pro', category:'Klavyeler', type:'Mekanik klavye', price:3499, oldPrice:3999, badge:'Çok satan', rating:4.9, reviews:128, colors:['Obsidyen','Kırık Beyaz','Grafit'], switches:['Red','Brown','Blue'], connection:['Üç modlu kablosuz'], layout:'TKL · 87 tuş', desc:'Kompakt form, tam kontrol. Alüminyum hissiyatlı gövdesi ve üç modlu bağlantısıyla çalışma alanına uyum sağlar.', specs:[['Düzen','TKL · 87 tuş'],['Bağlantı','2.4 GHz / Bluetooth / USB-C'],['Switch','Hot-swap mekanik'],['Tuş başlığı','PBT'],['Aydınlatma','RGB'],['Uyumluluk','Windows / macOS']], art:'keyboard', accent:'#c9fb55'},
  {id:'k2', name:'K65 Air', category:'Klavyeler', type:'Kompakt mekanik klavye', price:2799, badge:'Kompakt', rating:4.8, reviews:76, colors:['Gece Siyahı','Buz'], switches:['Red','Brown'], connection:['USB-C kablolu'], layout:'%65 · 68 tuş', desc:'Masanızda daha fazla alan, parmaklarınızın altında net ve dengeli bir his.', specs:[['Düzen','%65 · 68 tuş'],['Bağlantı','USB-C'],['Switch','Mekanik'],['Tuş başlığı','PBT'],['Aydınlatma','RGB'],['Uyumluluk','Windows / macOS']], art:'keyboard', accent:'#a8b6ff'},
  {id:'k3', name:'K75 Studio', category:'Klavyeler', type:'Premium mekanik klavye', price:4299, badge:'Yeni', rating:4.9, reviews:42, colors:['Titanyum','Krem'], switches:['Linear Silent','Brown'], connection:['Üç modlu kablosuz'], layout:'%75 · 82 tuş', desc:'Sessiz çalışma, rafine dokunuş ve üretkenlik için tasarlanmış premium deneyim.', specs:[['Düzen','%75 · 82 tuş'],['Bağlantı','2.4 GHz / Bluetooth / USB-C'],['Switch','Hot-swap'],['Gövde','Alüminyum alaşım'],['Aydınlatma','RGB'],['Uyumluluk','Windows / macOS']], art:'keyboard', accent:'#e7c6a5'},
  {id:'k4', name:'K104 Core', category:'Klavyeler', type:'Tam boy mekanik klavye', price:2499, rating:4.7, reviews:61, colors:['Siyah','Beyaz'], switches:['Red','Brown','Blue'], connection:['USB-C kablolu'], layout:'Tam boy · 104 tuş', desc:'Sayısal tuş takımından vazgeçmeyenler için sağlam ve sade bir günlük sürücü.', specs:[['Düzen','Tam boy · 104 tuş'],['Bağlantı','USB-C'],['Switch','Mekanik'],['Tuş başlığı','ABS'],['Aydınlatma','Beyaz LED'],['Uyumluluk','Windows']], art:'keyboard', accent:'#f0a46a'},
  {id:'k5', name:'K60 Mini', category:'Klavyeler', type:'Ultra kompakt klavye', price:2199, rating:4.6, reviews:38, colors:['Siyah','Lavanta'], switches:['Red','Brown'], connection:['USB-C kablolu'], layout:'%60 · 61 tuş', desc:'Minimal kurulumlar ve hareket alanını önemseyen oyuncular için küçük form.', specs:[['Düzen','%60 · 61 tuş'],['Bağlantı','USB-C'],['Switch','Mekanik'],['Tuş başlığı','PBT'],['Aydınlatma','RGB'],['Uyumluluk','Windows / macOS']], art:'keyboard', accent:'#d3a5ff'},
  {id:'m1', name:'M1 Feather', category:'Mouse', type:'Ultra hafif gaming mouse', price:1899, badge:'Hafif tasarım', rating:4.9, reviews:204, colors:['Siyah','Beyaz'], connection:['2.4 GHz / USB-C'], dpi:'26.000 DPI', desc:'Hızlı flick hareketleri ve uzun oyun seansları için hafif, dengeli ve hassas.', specs:[['Ağırlık','58 g'],['Sensör','26.000 DPI'],['Bağlantı','2.4 GHz / USB-C'],['Tuş','6 programlanabilir'],['Pil','70 saate kadar'],['Uyumluluk','Windows / macOS']], art:'mouse', accent:'#c9fb55'},
  {id:'m2', name:'M2 Ergo', category:'Mouse', type:'Ergonomik kablosuz mouse', price:2299, rating:4.8, reviews:93, colors:['Grafit','Kum'], connection:['Bluetooth / 2.4 GHz'], dpi:'16.000 DPI', desc:'Avuç içini doğal biçimde destekleyen formuyla iş ve oyun arasında rahatça geçiş yapar.', specs:[['Ağırlık','82 g'],['Sensör','16.000 DPI'],['Bağlantı','Bluetooth / 2.4 GHz'],['Tuş','7 programlanabilir'],['Pil','100 saate kadar'],['Uyumluluk','Windows / macOS']], art:'mouse', accent:'#d7bda2'},
  {id:'m3', name:'M3 Vector', category:'Mouse', type:'Çok tuşlu gaming mouse', price:2599, badge:'Makro kontrolü', rating:4.7, reviews:58, colors:['Siyah'], connection:['USB-C kablolu'], dpi:'25.600 DPI', desc:'Kısayolları elinizin altına taşıyan çok tuşlu kontrol merkezi.', specs:[['Ağırlık','96 g'],['Sensör','25.600 DPI'],['Bağlantı','USB-C'],['Tuş','12 programlanabilir'],['Kablo','Esnek örgülü'],['Uyumluluk','Windows']], art:'mouse', accent:'#a8b6ff'},
  {id:'m4', name:'M4 Flow', category:'Mouse', type:'Minimalist üretkenlik mouse’u', price:1599, rating:4.6, reviews:44, colors:['Krem','Siyah','Adaçayı'], connection:['Bluetooth / USB-C'], dpi:'8.000 DPI', desc:'Sessiz tıklamalar ve temiz çizgilerle odaklanmış bir çalışma masası için.', specs:[['Ağırlık','74 g'],['Sensör','8.000 DPI'],['Bağlantı','Bluetooth / USB-C'],['Tuş','5'],['Pil','120 saate kadar'],['Uyumluluk','Windows / macOS']], art:'mouse', accent:'#b5d2bd'},
  {id:'p1', name:'Surface XL', category:'Mousepad', type:'Geniş masaüstü yüzeyi', price:899, rating:4.8, reviews:117, colors:['Onyx','Toprak','Lime'], size:'900 × 400 mm', desc:'Klavye ve mouse için geniş, dengeli ve dikişli bir yüzey.', specs:[['Boyut','900 × 400 mm'],['Kalınlık','4 mm'],['Yüzey','Kontrollü dokuma'],['Taban','Kaymaz kauçuk'],['Kenar','Dikişli'],['Temizlik','Nemli bezle silinebilir']], art:'pad', accent:'#c9fb55'},
  {id:'p2', name:'Surface Desk', category:'Mousepad', type:'XXL masaüstü yüzeyi', price:1199, badge:'Geniş alan', rating:4.8, reviews:82, colors:['Gece','Sis'], size:'1200 × 500 mm', desc:'Masanın tamamını bir araya getiren geniş ve sade yüzey.', specs:[['Boyut','1200 × 500 mm'],['Kalınlık','4 mm'],['Yüzey','Mikro dokuma'],['Taban','Kaymaz kauçuk'],['Kenar','Dikişli'],['Temizlik','Nemli bezle silinebilir']], art:'pad', accent:'#a8b6ff'},
  {id:'p3', name:'Surface Control', category:'Mousepad', type:'Hassas kontrol yüzeyi', price:749, rating:4.7, reviews:49, colors:['Siyah','Gri'], size:'450 × 400 mm', desc:'Düşük hassasiyetli hareketlerde kontrollü duruş için dokulu yüzey.', specs:[['Boyut','450 × 400 mm'],['Kalınlık','3 mm'],['Yüzey','Kontrol odaklı'],['Taban','Kaymaz kauçuk'],['Kenar','Düz dikiş'],['Temizlik','Nemli bezle silinebilir']], art:'pad', accent:'#e7c6a5'},
  {id:'h1', name:'H1 Pulse', category:'Kulaklık', type:'Kablosuz gaming kulaklık', price:3299, badge:'Yeni', rating:4.8, reviews:68, colors:['Siyah','Beyaz'], connection:['2.4 GHz / Bluetooth'], desc:'Oyunda odak, sohbetlerde netlik ve uzun oturumlarda konfor için tasarlandı.', specs:[['Sürücü','50 mm'],['Bağlantı','2.4 GHz / Bluetooth / USB-C'],['Mikrofon','Çıkarılabilir'],['Pil','45 saate kadar'],['Ağırlık','285 g'],['Uyumluluk','PC / Mac / konsol uyumluluğu cihaza bağlı']], art:'headset', accent:'#c9fb55'},
  {id:'h2', name:'H2 Wire', category:'Kulaklık', type:'Kablolu oyun kulaklığı', price:1799, rating:4.7, reviews:51, colors:['Kömür','Krem'], connection:['3.5 mm / USB-C'], desc:'Tak ve kullan kolaylığı, hafif gövde ve günlük kullanım için dengeli ses.', specs:[['Sürücü','40 mm'],['Bağlantı','3.5 mm / USB-C'],['Mikrofon','Esnek, dahili'],['Ağırlık','240 g'],['Kablo','1,8 m'],['Uyumluluk','3.5 mm veya USB-C destekli cihazlar']], art:'headset', accent:'#d7bda2'},
  {id:'h3', name:'H3 Studio', category:'Kulaklık', type:'Üretkenlik kulaklığı', price:2899, rating:4.8, reviews:34, colors:['Grafit','Krem'], connection:['Bluetooth / USB-C'], desc:'Görüşmeler, odaklanma ve müzik için yalın bir kulak üstü tasarım.', specs:[['Sürücü','40 mm'],['Bağlantı','Bluetooth / USB-C'],['Mikrofon','Çift mikrofon'],['Pil','50 saate kadar'],['Ağırlık','260 g'],['Uyumluluk','Windows / macOS / mobil']], art:'headset', accent:'#a8b6ff'},
  {id:'w1', name:'Wrist Rest', category:'Aksesuarlar', type:'Klavye bilek desteği', price:599, rating:4.7, reviews:31, colors:['Siyah','Kum'], size:'TKL uyumlu', desc:'Uzun yazı ve oyun seanslarında bilek hizasını destekleyen sade aksesuar.', specs:[['Boyut','TKL uyumlu'],['Üst yüzey','Yumuşak dokulu'],['Taban','Kaymaz'],['Temizlik','Nemli bezle silinebilir']], art:'accessory', accent:'#d7bda2'},
  {id:'w2', name:'Keyset Mono', category:'Aksesuarlar', type:'PBT tuş takımı', price:699, rating:4.8, reviews:27, colors:['Krem / Siyah','Lime / Siyah'], size:'ANSI uyumlu set', desc:'Kurulumunu küçük bir dokunuşla kişiselleştir. Uyum kontrolünü satın almadan önce yap.', specs:[['Malzeme','PBT'],['Profil','Cherry benzeri profil'],['Düzen','ANSI'],['Uyumluluk','Switch ve klavye düzenine bağlı']], art:'accessory', accent:'#c9fb55'},
  {id:'w3', name:'Dock 7', category:'Aksesuarlar', type:'USB-C bağlantı istasyonu', price:1499, badge:'Masaüstü çözümü', rating:4.6, reviews:22, colors:['Grafit'], size:'7 bağlantı noktası', desc:'Çevre birimlerini tek noktada bir araya getiren kompakt bağlantı istasyonu.', specs:[['Bağlantı','USB-C ana bağlantı'],['Portlar','USB-A / USB-C / HDMI / kart okuyucu'],['Gövde','Alüminyum görünümlü kasa'],['Uyumluluk','Cihazın port ve görüntü desteğine bağlı']], art:'accessory', accent:'#a8b6ff'}
];

const categories = ['Tümü','Klavyeler','Mouse','Mousepad','Kulaklık','Aksesuarlar'];
const state = { category:'Tümü', query:'', sort:'featured', filter:'', cart:loadCart(), page:'home', selected:null, mobileMenu:false, toast:'' };
const app = document.querySelector('#app');
const money = n => new Intl.NumberFormat('tr-TR',{style:'currency',currency:'TRY',maximumFractionDigits:0}).format(n);
function loadCart(){ try { const raw=JSON.parse(localStorage.getItem('keyora-cart') || '[]'); return Array.isArray(raw) ? raw.filter(x=>x && products.some(p=>p.id===x.id) && Number.isInteger(x.qty) && x.qty>0 && Number.isFinite(x.price)).map(x=>({...x,qty:Math.min(99,x.qty),price:products.find(p=>p.id===x.id).price})) : []; } catch { return []; } }
function saveCart(){ try { localStorage.setItem('keyora-cart', JSON.stringify(state.cart)); } catch { state.toast='Sepet bu tarayıcıda kalıcı kaydedilemedi'; } }
function slug(s){return s.toLocaleLowerCase('tr-TR').replaceAll(' ','-').replaceAll('’','');}
function escapeHtml(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
let artInstance = 0;
function artSvg(p, small=false){
  const svgId = `${p.id}-${++artInstance}`;
  const accent = p.accent || '#c9fb55';
  const id = p.id;
  const label = escapeHtml(p.name);
  let item = '';
  if (p.art === 'keyboard') {
    const columns = id === 'k4' ? 15 : id === 'k5' ? 10 : id === 'k2' ? 12 : id === 'k3' ? 13 : 14;
    const rows = id === 'k5' ? 4 : 5;
    const keyW = id === 'k4' ? 13 : id === 'k5' ? 18 : 17;
    const keyH = id === 'k3' ? 12 : 13;
    const keys = Array.from({length: rows}, (_, r) => Array.from({length: columns - (r === rows-1 ? 2 : 0)}, (_, c) => {
      const special = (r === 0 && c === 0) || (r === 1 && c === Math.floor(columns*.55)) || (r === rows-1 && c === 2);
      const x = 13 + c * (keyW + 3) + (r === rows-1 ? 8 : 0);
      const y = 13 + r * (keyH + 5);
      return `<rect x="${x}" y="${y}" width="${keyW}" height="${keyH}" rx="2.5" fill="${special ? accent : ((r+c)%4===0 ? '#454d48' : '#303632')}" stroke="#59625b" stroke-width=".5"/>`;
    }).join('')).join('');
    const numpad = id === 'k4' ? '<rect x="251" y="13" width="43" height="80" rx="4" fill="#111513" stroke="#59625b"/><path d="M265 23h6m-6 15h6m-6 15h6m-6 15h6m8-45h6m-6 15h6m-6 15h6m-6 15h6" stroke="#515a53" stroke-width="4" stroke-linecap="round"/>' : '';
    item = `<g transform="translate(42 82) rotate(-7 150 55)"><rect width="310" height="112" rx="12" fill="${id==='k3'?'#aab0ad':'#272d29'}" stroke="#67716a" stroke-width="2"/><rect x="7" y="7" width="296" height="98" rx="8" fill="#151916"/>${keys}${numpad}<rect x="116" y="96" width="77" height="4" rx="2" fill="#78827a"/></g>${id==='k3'?'<path d="M74 75l225-28" stroke="#f0e5d4" stroke-width="1" opacity=".7"/>':''}`;
  } else if (p.art === 'mouse') {
    const body = id === 'm2' ? 'M74 8 C34 5 14 34 14 76 L14 139 C14 176 43 197 76 191 C104 185 125 160 125 128 L125 77 C125 36 109 8 74 8Z' : id === 'm3' ? 'M68 4 C28 4 10 35 10 78 L10 136 C10 173 33 196 68 196 C103 196 126 173 126 136 L126 78 C126 35 108 4 68 4Z' : 'M68 4 C27 4 10 36 10 78 L10 136 C10 173 33 196 68 196 C103 196 126 173 126 136 L126 78 C126 36 109 4 68 4Z';
    const holes = id === 'm1' ? Array.from({length:9},(_,i)=>`<circle cx="${42+(i%3)*25}" cy="${100+Math.floor(i/3)*20}" r="5" fill="#121614" stroke="#515b53" stroke-width="1"/>`).join('') : '';
    const sideButtons = id === 'm3' ? '<rect x="13" y="88" width="10" height="13" rx="3" fill="'+accent+'"/><rect x="13" y="106" width="10" height="13" rx="3" fill="#8b948c"/><rect x="13" y="124" width="10" height="13" rx="3" fill="#8b948c"/>' : '';
    item = `<g transform="translate(126 28) rotate(12 70 105)"><ellipse cx="70" cy="104" rx="73" ry="105" fill="#0e110f" opacity=".45"/><path d="${body}" fill="${id==='m4'?'#ddd9cf':'#252b27'}" stroke="#68736a" stroke-width="2"/><path d="M68 8 V69" stroke="#737d74" stroke-width="2"/><rect x="61" y="22" width="14" height="28" rx="6" fill="${accent}"/><path d="M12 81 Q68 96 124 81" fill="none" stroke="#465047" stroke-width="2"/>${holes}${sideButtons}${id==='m2'?'<path d="M23 59Q48 42 72 56" fill="none" stroke="#747e73" stroke-width="2"/>':''}</g>`;
  } else if (p.art === 'pad') {
    const pattern = id === 'p2'
      ? '<path d="M20 20L280 120M-10 60L180 130M150 0L310 80" stroke="#a8b6ff" stroke-width="1" opacity=".6"/><circle cx="255" cy="43" r="31" fill="none" stroke="#a8b6ff" stroke-width="1.5"/><circle cx="255" cy="43" r="20" fill="none" stroke="#a8b6ff" opacity=".7"/>'
      : id === 'p3' ? '<path d="M20 30H290M20 42H290M20 54H290M20 66H290M20 78H290M20 90H290" stroke="#e7c6a5" stroke-width="1" opacity=".45"/><path d="M35 20V105M48 20V105M61 20V105M74 20V105" stroke="#e7c6a5" stroke-width="1" opacity=".25"/>'
      : '<path d="M20 100C75 12 140 128 210 28S285 28 300 20" fill="none" stroke="#c9fb55" stroke-width="2" opacity=".9"/><circle cx="267" cy="44" r="18" fill="#c9fb55" opacity=".42"/><path d="M28 112C96 46 166 136 292 50" fill="none" stroke="#c9fb55" stroke-width="1" opacity=".5"/>';
    item = `<g transform="translate(32 70) rotate(-6 160 60)"><rect x="0" y="0" width="330" height="136" rx="13" fill="#111512" stroke="#606a61" stroke-width="2"/><rect x="8" y="8" width="314" height="120" rx="8" fill="${id==='p3'?'#343a36':'#222925'}"/>${pattern}<path d="M18 118H312" stroke="#6e786d" stroke-width="1" opacity=".45"/><text x="24" y="25" fill="#e2e8dd" font-size="8" letter-spacing="2">KEYORA / SURFACE</text></g>`;
  } else if (p.art === 'headset') {
    const mic = id === 'h2' ? '<path d="M190 146Q211 171 192 186L151 191" stroke="#8b958c" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="149" cy="191" r="5" fill="#c9fb55"/>' : id === 'h1' ? '<path d="M190 146Q209 164 199 178" stroke="#c9fb55" stroke-width="4" fill="none" stroke-linecap="round"/>' : '<path d="M190 146Q202 164 190 174" stroke="#a8b6ff" stroke-width="3" fill="none" stroke-linecap="round"/>';
    item = `<g transform="translate(78 28)"><ellipse cx="120" cy="112" rx="118" ry="106" fill="#0b0e0c" opacity=".35"/><path d="M42 116V87C42 24 80 4 120 4S198 24 198 87V116" fill="none" stroke="#4c5550" stroke-width="20" stroke-linecap="round"/><path d="M43 85C29 85 23 96 23 113V146C23 162 31 169 47 169H61V91Z" fill="${id==='h3'?'#c7c7bd':'#272e29'}" stroke="#778278" stroke-width="2"/><path d="M197 85C211 85 217 96 217 113V146C217 162 209 169 193 169H179V91Z" fill="${id==='h3'?'#c7c7bd':'#272e29'}" stroke="#778278" stroke-width="2"/><rect x="30" y="106" width="24" height="42" rx="9" fill="#141916" opacity=".7"/><rect x="186" y="106" width="24" height="42" rx="9" fill="#141916" opacity=".7"/>${mic}<path d="M78 15Q120 -1 162 15" stroke="${accent}" stroke-width="2" fill="none" opacity=".8"/></g>`;
  } else if (id === 'w1') {
    item = `<g transform="translate(55 117) rotate(-5 145 30)"><rect x="0" y="0" width="290" height="55" rx="16" fill="#272d29" stroke="#657066" stroke-width="2"/><rect x="8" y="7" width="274" height="41" rx="12" fill="#343c35"/><path d="M22 14Q145 4 268 14" stroke="#7e887e" stroke-width="1" opacity=".5"/><text x="145" y="32" text-anchor="middle" fill="#cfd7cd" font-size="9" letter-spacing="3">WRIST REST</text></g><path d="M65 184H335" stroke="${accent}" stroke-width="2" opacity=".6"/>`;
  } else if (id === 'w2') {
    item = `<g transform="translate(75 55) rotate(-8 125 65)"><rect width="250" height="137" rx="10" fill="#242a26" stroke="#667168" stroke-width="2"/>${Array.from({length:4},(_,r)=>Array.from({length:10},(_,c)=>`<path d="M${13+c*23} ${14+r*28}l4 -3h13l4 3v17l-4 3h-13l-4 -3z" fill="${(r+c)%6===0?accent:(id==='w2'&&c%2===0?'#e5dfd1':'#4a534b')}" stroke="#111512" stroke-width=".7"/>`).join('')).join('')}<text x="125" y="124" text-anchor="middle" fill="#dbe2d8" font-size="8" letter-spacing="2">KEYSET / PBT</text></g>`;
  } else {
    item = `<g transform="translate(82 57)"><rect x="0" y="0" width="226" height="124" rx="13" fill="#a9b0ab" stroke="#68736a" stroke-width="2"/><rect x="8" y="8" width="210" height="108" rx="8" fill="#252c27"/><rect x="21" y="22" width="45" height="12" rx="2" fill="${accent}"/><rect x="21" y="47" width="184" height="8" rx="2" fill="#505a51"/><rect x="21" y="64" width="140" height="8" rx="2" fill="#505a51"/><circle cx="187" cy="91" r="10" fill="${accent}"/><path d="M32 116v14m160-14v14" stroke="#8d978e" stroke-width="3"/></g>`;
  }
  return `<svg viewBox="0 0 400 260" role="img" aria-label="${label} ürün illüstrasyonu" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg-${svgId}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${accent}" stop-opacity=".26"/><stop offset="1" stop-color="#121615" stop-opacity="0"/></linearGradient><linearGradient id="metal-${svgId}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#68736a"/><stop offset="1" stop-color="#242a26"/></linearGradient></defs><rect width="400" height="260" rx="18" fill="#1b201e"/><circle cx="310" cy="48" r="110" fill="url(#bg-${svgId})"/><path d="M0 218Q120 184 240 235T400 210V260H0Z" fill="#141817" opacity=".8"/><ellipse cx="200" cy="211" rx="130" ry="13" fill="#080a09" opacity=".55"/>${item}<text x="22" y="28" font-family="DM Sans,sans-serif" font-size="10" letter-spacing="2" fill="#8e9891">KEYORA / ${id.toUpperCase()}</text><text x="22" y="242" font-family="Space Grotesk,sans-serif" font-size="12" fill="#d9dfda">${label.toUpperCase()}</text><path d="M356 24h18m-9-9v18" stroke="${accent}" stroke-width="1.5" opacity=".7"/></svg>`;
}
function productCard(p){
  return `<article class="product-card">
    <button class="product-art" data-open="${p.id}" aria-label="${escapeHtml(p.name)} detaylarını görüntüle">${artSvg(p)}${p.badge?`<span class="badge">${escapeHtml(p.badge)}</span>`:''}<span class="quick-view">Hızlı incele <span>↗</span></span></button>
    <div class="product-meta"><span>${escapeHtml(p.category)}</span><span class="rating">★ ${p.rating} <i>(${p.reviews})</i></span></div>
    <button class="product-title" data-open="${p.id}">${escapeHtml(p.name)}</button>
    <p class="product-subtitle">${escapeHtml(p.type)}</p>
    <div class="product-bottom"><div class="price">${money(p.price)} ${p.oldPrice?`<del>${money(p.oldPrice)}</del>`:''}</div><button class="add-mini" data-add="${p.id}" aria-label="${escapeHtml(p.name)} sepete ekle">+</button></div>
  </article>`;
}
function header(){
  return `<div class="announcement"><span class="announcement-dot"></span> 2.500 TL üzeri siparişlerde kargo bizden <span class="announce-right">Düşünülmüş tasarım. Net performans.</span></div>
  <header class="header"><a class="brand" href="/" data-page="home" aria-label="KEYORA ana sayfa"><span class="brand-mark">K</span><span>KEYORA<span class="brand-period">.</span></span></a>
    <nav class="${state.mobileMenu?'nav open':'nav'}" aria-label="Ana navigasyon">
      ${categories.slice(1).map(c=>`<button data-category="${c}" class="${state.category===c?'active':''}">${c}</button>`).join('')}
      <button data-page="about">Marka</button>
    </nav>
    <div class="header-actions"><button class="icon-btn search-toggle" aria-label="Arama" data-action="focus-search">⌕</button><button class="cart-button" data-action="cart"><span class="cart-icon">▱</span><span>Sepet</span><b>${state.cart.reduce((n,x)=>n+x.qty,0)}</b></button><button class="menu-toggle" data-action="menu" aria-label="Menüyü aç/kapat">☰</button></div>
  </header>`;
}
function footer(){
 return `<footer class="footer"><div class="footer-main"><div><a class="brand footer-brand" href="/" data-page="home"><span class="brand-mark">K</span><span>KEYORA<span class="brand-period">.</span></span></a><p class="footer-p">Teknoloji, kendi ritminde.<br>Her ayrıntı bir amaca hizmet eder.</p><div class="socials"><span>ig</span><span>𝕏</span><span>▶</span></div></div><div><h4>Keşfet</h4>${categories.slice(1).map(c=>`<button data-category="${c}">${c}</button>`).join('')}</div><div><h4>Destek</h4><button data-page="faq">Sıkça sorulanlar</button><button data-page="shipping">Teslimat & iade</button><button data-page="contact">İletişim</button></div><div><h4>KEYORA notları</h4><p class="footer-p">Yeni ürünler ve masaüstü fikirleri. Gürültüsüz, arada bir.</p><form id="newsletter" class="newsletter"><label class="sr-only" for="news-email">E-posta adresin</label><input id="news-email" type="email" placeholder="E-posta adresin" required><button aria-label="Bültene kaydol">↗</button></form><small class="muted">Demo bülten formudur; veri gönderilmez.</small></div></div><div class="footer-bottom"><span>© 2026 KEYORA Studio. Eğitim projesi.</span><div><button data-page="privacy">Gizlilik</button><button data-page="terms">Koşullar</button></div><span class="footer-status"><i></i> Arayüz hazır</span></div></footer>`;
}
function home(){
 const featured = products.filter(p=>['k1','m1','h1','p1'].includes(p.id));
 return `<main><section class="hero"><div class="hero-copy"><div class="eyebrow"><span class="eyebrow-line"></span> MASAÜSTÜNÜ YENİDEN DÜŞÜN</div><h1>İyi tasarım<br>eline <em>yakışır.</em></h1><p class="hero-desc">Her dokunuşta daha iyi his. Her ayrıntıda bir amaç. Çalışma ve oyun alanını sana göre kur.</p><div class="hero-actions"><button class="btn btn-primary" data-action="shop">Koleksiyonu keşfet <span>↗</span></button><button class="text-link" data-open="k1">Öne çıkan: K87 Pro <span>→</span></button></div><div class="hero-stats"><div><strong>18<span>+</span></strong><small>ürün modeli</small></div><div><strong>05</strong><small>ürün ailesi</small></div><div><strong>00<span> TL</span></strong><small>gerçek ödeme</small></div></div></div><div class="hero-visual"><div class="hero-glow"></div><div class="hero-orbit orbit-one"></div><div class="hero-orbit orbit-two"></div><div class="hero-product">${artSvg(products[0])}<div class="hero-product-label"><span class="live-dot"></span> K87 PRO / SIGNATURE SERIES</div></div><div class="floating-chip chip-top"><span class="chip-icon">✳</span><div><b>Hassasiyet</b><small>Her ayrıntıda</small></div></div><div class="floating-chip chip-bottom"><span class="chip-icon">↗</span><div><b>3 modlu bağlantı</b><small>Özgürce bağlan</small></div></div><div class="hero-index">01 <span>/</span> 04</div></div><div class="hero-side-note">DESIGNED FOR YOUR FLOW — 2026</div></section>
 <section class="trust-strip"><div><span class="trust-icon">↗</span><span><b>Özenli tasarım</b><small>İşlev önce gelir</small></span></div><div><span class="trust-icon">◇</span><span><b>Şeffaf ürün bilgisi</b><small>Teknik detaylar açık</small></span></div><div><span class="trust-icon">⌁</span><span><b>Kolay keşif</b><small>Aradığın burada</small></span></div><div><span class="trust-icon">◎</span><span><b>Demo mağaza</b><small>Eğitim projesi</small></span></div></section>
 <section class="section categories-section" id="categories"><div class="section-heading"><div><div class="eyebrow">KATEGORİLER</div><h2>Kurulumun,<br><em>senin kuralların.</em></h2></div><p>Tek bir parçadan bütün masaya kadar. İhtiyacına uyanı bul.</p></div><div class="category-grid">${[{n:'Klavyeler',en:'KEYS / 05 MODELS',art:'keyboard',id:'k1'},{n:'Mouse',en:'PRECISION / 04 MODELS',art:'mouse',id:'m1'},{n:'Mousepad',en:'SURFACE / 03 MODELS',art:'pad',id:'p1'},{n:'Kulaklık',en:'AUDIO / 03 MODELS',art:'headset',id:'h1'},{n:'Aksesuarlar',en:'EXTRAS / 03 MODELS',art:'accessory',id:'w1'}].map(c=>`<button class="category-card cat-${c.art}" data-category="${c.n}"><div class="cat-art">${artSvg(products.find(p=>p.id===c.id))}</div><div class="cat-info"><span>${c.en}</span><strong>${c.n}</strong></div><span class="cat-arrow">↗</span></button>`).join('')}</div></section>
 <section class="section featured-section" id="featured"><div class="section-heading"><div><div class="eyebrow">SEÇİLMİŞ PARÇALAR</div><h2>İlk bakışta <em>favoriler.</em></h2></div><button class="text-link" data-action="shop">Tüm ürünler <span>→</span></button></div><div class="product-grid">${featured.map(productCard).join('')}</div></section>
 <section class="manifesto"><div class="manifesto-art">${artSvg(products[5])}<span class="manifesto-stamp">MOVE<br>WITH<br>INTENT</span></div><div class="manifesto-copy"><div class="eyebrow"><span class="eyebrow-line"></span> KEYORA YAKLAŞIMI</div><h2>Fazlası değil.<br><em>Doğrusu.</em></h2><p>İyi bir masaüstü, en çok özelliğe sahip olan değil; her parçası senin çalışma biçimine uyan düzendir. KEYORA, dikkati dağıtanı azaltıp deneyimi öne çıkaran ürünler fikri üzerine kuruldu.</p><button class="btn btn-dark" data-page="about">Marka hikâyesi <span>↗</span></button><div class="manifesto-number">K / 001</div></div></section>
 <section class="section all-products-preview"><div class="section-heading"><div><div class="eyebrow">TAM KOLEKSİYON</div><h2>İşine yarayan <em>teknoloji.</em></h2></div><p>Farklı alışkanlıklar için farklı çözümler.</p></div><div class="mini-category-row">${categories.slice(1).map(c=>`<button class="pill ${state.category===c?'selected':''}" data-category="${c}">${c}<span>↗</span></button>`).join('')}</div><div class="product-grid">${products.slice(4,8).map(productCard).join('')}</div><div class="center-action"><button class="btn btn-outline" data-action="shop">Tüm 18 ürünü keşfet <span>→</span></button></div></section>
 <section class="newsletter-band"><div><div class="eyebrow">KEYORA NOTLARI</div><h2>Masanın başından<br><em>iyi haberler.</em></h2></div><p>Yeni ürünler, masaüstü fikirleri ve tasarım notları. Sadece gerektiğinde.</p><form id="newsletter-band" class="newsletter newsletter-large"><label class="sr-only" for="news-email-2">E-posta adresin</label><input id="news-email-2" type="email" placeholder="E-posta adresin" required><button aria-label="Bültene kaydol">↗</button></form><small>Bu eğitim demosunda e-posta adresin gönderilmez veya kaydedilmez.</small></section></main>`;
}
function catalog(){
 let list=products.filter(p=>(state.category==='Tümü'||p.category===state.category)&&(`${p.name} ${p.type} ${p.desc} ${p.category}`).toLocaleLowerCase('tr-TR').includes(state.query.toLocaleLowerCase('tr-TR')));
 if(state.filter==='discount') list=list.filter(p=>p.oldPrice);
 if(state.sort==='price-up') list.sort((a,b)=>a.price-b.price);
 if(state.sort==='price-down') list.sort((a,b)=>b.price-a.price);
 if(state.sort==='rating') list.sort((a,b)=>b.rating-a.rating);
 return `<main class="catalog-page"><div class="catalog-hero"><div class="eyebrow">KEYORA / KOLEKSİYON</div><h1>${state.category==='Tümü'?'Bütün parçalar.':escapeHtml(state.category)+'.'}<br><em>Doğru seçimler.</em></h1><p>İhtiyacına göre tasarlanmış çevre birimleri. Sade seçim, net bilgi.</p></div><div class="catalog-toolbar"><div class="breadcrumbs"><button data-page="home">Ana sayfa</button><span>/</span><b>${escapeHtml(state.category==='Tümü'?'Tüm ürünler':state.category)}</b></div><div class="catalog-controls"><span>${list.length} ürün</span><label class="select-wrap"><span class="sr-only">Ürünleri sırala</span><select id="sort"><option value="featured" ${state.sort==='featured'?'selected':''}>Öne çıkanlar</option><option value="price-up" ${state.sort==='price-up'?'selected':''}>Fiyat: artan</option><option value="price-down" ${state.sort==='price-down'?'selected':''}>Fiyat: azalan</option><option value="rating" ${state.sort==='rating'?'selected':''}>En yüksek puan</option></select></label></div></div><div class="catalog-layout"><aside class="filters"><h3>Filtrele <span>＋</span></h3><div class="filter-group"><b>Kategoriler</b>${categories.map(c=>`<button class="filter-option ${state.category===c?'is-active':''}" data-category="${c}"><span>${c}</span><span>${c==='Tümü'?products.length:products.filter(p=>p.category===c).length}</span></button>`).join('')}</div><div class="filter-group"><b>Fırsatlar</b><label class="check-option"><input type="checkbox" id="discount-filter" ${state.filter==='discount'?'checked':''}><span>İndirimli ürünler</span></label></div><div class="filter-note"><span>KEYORA / NOTE</span><p>Ürün fiyatları ve stok bilgileri eğitim demosu için hazırlanmıştır.</p></div></aside><section class="catalog-results"><div class="search-bar"><span>⌕</span><input id="catalog-search" value="${escapeHtml(state.query)}" placeholder="Ürün veya kategori ara..." aria-label="Ürün ara"><button data-action="clear-search" aria-label="Aramayı temizle">×</button></div>${list.length?`<div class="product-grid">${list.map(productCard).join('')}</div>`:`<div class="empty-results"><span>⌕</span><h2>Burada henüz bir şey yok.</h2><p>Aramanı veya filtrelerini değiştirmeyi dene.</p><button class="btn btn-primary" data-action="reset-catalog">Filtreleri temizle</button></div>`}</section></div></main>`;
}
function contentPage(page){
 const pages={
 about:['Markanın fikri.','Teknoloji, kendi ritminde.','KEYORA; daha fazla özellikten çok, doğru düşünülmüş ayrıntılara inanan kurgusal bir teknoloji markasıdır. Bu eğitim projesi; klavye, mouse, ses ve masaüstü aksesuarlarını ortak bir tasarım dili altında bir araya getirir. Ürünler, fiyatlar ve marka bilgileri demo amaçlıdır.'],
 faq:['YARDIM MERKEZİ','Aklındaki sorular.','Bu mağaza bir e-ticaret dersi kapsamında hazırlanmış demo projedir. Gerçek sipariş veya ödeme alınmaz.'],
 shipping:['BİLGİLENDİRME','Teslimat & iade.','Bu proje demo amaçlıdır. Gerçek kargo gönderimi, iade işlemi veya sipariş takibi yapılmaz. Canlı mağaza kurulurken teslimat süreleri, iade şartları ve tüketici mevzuatı işletmenin gerçek süreçlerine göre düzenlenmelidir.'],
 contact:['BİZE ULAŞ','Bir fikrin mi var?','Bu demo sitesinde gerçek bir iletişim kanalı bulunmamaktadır. İletişim formu gönderim yapmaz ve kişisel verileri saklamaz.'],
 privacy:['YASAL BİLGİ','Gizlilik yaklaşımı.','Bu demo uygulama gerçek ödeme bilgisi toplamaz. Sepet içeriği yalnızca bu tarayıcıdaki localStorage alanında tutulur. Gerçek bir mağaza için gizlilik metni, çerez yönetimi ve veri işleme süreçleri ayrıca tasarlanmalıdır.'],
 terms:['YASAL BİLGİ','Kullanım koşulları.','KEYORA bu proje kapsamında kurgusal bir markadır. Ürünler, stoklar, fiyatlar, değerlendirmeler ve kampanyalar demo verileridir; gerçek satış teklifi oluşturmaz.']
 };
 const [eyebrow,title,desc]=pages[page]||pages.about;
 if(page==='faq') return `<main class="content-page"><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p class="content-lead">${desc}</p><div class="faq-list">${[['Ürünler gerçek mi?','Ürün adları, teknik özellikler ve fiyatlar proje demosu için kurgulanmıştır.'],['Gerçek ödeme yapabilir miyim?','Hayır. Bu sürümde gerçek ödeme sağlayıcısı veya sunucu tarafı sipariş altyapısı bulunmaz.'],['Sepetim nerede saklanıyor?','Sepet, bu tarayıcıda localStorage içinde saklanır. Tarayıcı verilerini temizlerseniz silinebilir.'],['Fiyatlar nasıl belirleniyor?','Fiyatlar, katalog ve arayüz işlevlerini göstermek amacıyla örnek olarak belirlenmiştir.'],['Ürün varyasyonları çalışıyor mu?','Demo uygulamada ürün detayından renk, bağlantı ve ilgili seçenekler seçilebilir.'],['Kişisel bilgilerim gönderiliyor mu?','Bu statik demo iletişim veya bülten formu verilerini sunucuya göndermez.']].map(([q,a])=>`<details><summary>${q}<span>＋</span></summary><p>${a}</p></details>`).join('')}</div></main>`;
 if(page==='contact') return `<main class="content-page"><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p class="content-lead">${desc}</p><form class="contact-form" id="contact-form"><label>Adın<input required maxlength="80" placeholder="Ad soyad"></label><label>E-posta<input type="email" required maxlength="120" placeholder="ornek@eposta.com"></label><label>Mesajın<textarea required maxlength="1000" rows="5" placeholder="Bize ne anlatmak istersin?"></textarea></label><button class="btn btn-primary">Demo formu dene <span>↗</span></button><small>Form sadece arayüz demosudur; bilgiler hiçbir yere gönderilmez.</small></form></main>`;
 return `<main class="content-page"><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p class="content-lead">${desc}</p><div class="content-rule"></div><button class="btn btn-primary" data-action="shop">Ürünleri keşfet <span>↗</span></button></main>`;
}
function detailModal(p){
 if(!p) return '';
 return `<div class="modal-backdrop" data-action="close-modal"><section class="product-modal" role="dialog" aria-modal="true" aria-label="${escapeHtml(p.name)} ürün detayları"><button class="modal-close" data-action="close-modal" aria-label="Kapat">×</button><div class="modal-art">${artSvg(p)}</div><div class="modal-info"><div class="eyebrow">${escapeHtml(p.category)} / ${escapeHtml(p.id.toUpperCase())}</div><h2>${escapeHtml(p.name)}</h2><p class="modal-type">${escapeHtml(p.type)}</p><div class="modal-rating">★ ${p.rating} <span>(${p.reviews} demo değerlendirme)</span></div><div class="modal-price">${money(p.price)} ${p.oldPrice?`<del>${money(p.oldPrice)}</del>`:''}</div><p class="modal-desc">${escapeHtml(p.desc)}</p>${p.colors?`<div class="variant-group"><label>Renk <b id="color-value">${escapeHtml(p.colors[0])}</b></label><div class="swatches">${p.colors.map((c,i)=>`<button class="swatch ${i===0?'chosen':''}" data-color="${escapeHtml(c)}" aria-label="${escapeHtml(c)}" title="${escapeHtml(c)}"><span style="background:${({'Obsidyen':'#252929','Kırık Beyaz':'#e8e4da','Grafit':'#666d69','Gece Siyahı':'#1a1c1b','Buz':'#dfe8e6','Titanyum':'#aaaeb0','Krem':'#d8cbb4','Siyah':'#202321','Beyaz':'#f2f0e9','Lavanta':'#b8a4d5','Kum':'#cbb79c','Adaçayı':'#9caf9d','Onyx':'#252827','Toprak':'#a77b61','Lime':'#c9fb55','Gece':'#222524','Sis':'#aeb7b3','Kömür':'#303431','Grafit':'#656b67','Krem / Siyah':'#d8cbb4','Lime / Siyah':'#c9fb55'}[c]||'#a0aaa3')}"></span></button>`).join('')}</div></div>`:''}${p.switches?`<div class="variant-group"><label>Switch <b id="switch-value">${p.switches[0]}</b></label><div class="option-row">${p.switches.map((s,i)=>`<button class="option-chip ${i===0?'chosen':''}" data-switch="${escapeHtml(s)}">${escapeHtml(s)}</button>`).join('')}</div></div>`:''}${p.connection?`<div class="variant-group"><label>Bağlantı <b id="connection-value">${escapeHtml(p.connection[0])}</b></label><div class="option-row">${p.connection.map((s,i)=>`<button class="option-chip ${i===0?'chosen':''}" data-connection="${escapeHtml(s)}">${escapeHtml(s)}</button>`).join('')}</div></div>`:''}<div class="modal-actions"><div class="qty-control"><button data-qty="-1" aria-label="Adedi azalt">−</button><span id="detail-qty">1</span><button data-qty="1" aria-label="Adedi artır">＋</button></div><button class="btn btn-primary add-detail" data-add="${p.id}">Sepete ekle <span>↗</span></button></div>${shopierProductLinks[p.id]?`<a class="btn btn-outline shopier-buy" href="${shopierProductLinks[p.id]}" target="_blank" rel="noopener noreferrer">Shopier'de satın al · ${money(p.price)} <span>↗</span></a><p class="shopier-note">Ödeme ve sipariş işlemleri Shopier üzerinden yapılır. Kargo ve son tutarı ödeme öncesinde kontrol et.</p>`:''}<div class="modal-assurance"><span>◇ Demo ürün bilgisi</span><span>⌁ Demo varyasyonları</span></div><div class="spec-list"><h3>Teknik özellikler</h3>${p.specs.map(([k,v])=>`<div><span>${escapeHtml(k)}</span><b>${escapeHtml(v)}</b></div>`).join('')}</div><p class="demo-disclaimer">Ürün özellikleri, değerlendirmeler ve stok bilgileri eğitim projesi için hazırlanmış demo içerikleridir.</p></div></section></div>`;
}
function cartDrawer(){
 const total=state.cart.reduce((sum,item)=>sum+item.price*item.qty,0);
 const count=state.cart.reduce((n,x)=>n+x.qty,0);
 return `<div class="drawer-backdrop" data-action="close-cart"><aside class="cart-drawer" role="dialog" aria-modal="true" aria-label="Alışveriş sepeti"><div class="drawer-head"><div><div class="eyebrow">KEYORA / SEPET</div><h2>Seçtiklerin <span>(${count})</span></h2></div><button class="modal-close" data-action="close-cart" aria-label="Sepeti kapat">×</button></div>${!state.cart.length?`<div class="cart-empty"><div class="empty-icon">▱</div><h3>Sepet biraz sessiz.</h3><p>İlgini çeken parçaları eklediğinde burada göreceksin.</p><button class="btn btn-primary" data-action="shop">Ürünleri keşfet <span>↗</span></button></div>`:`<div class="cart-items">${state.cart.map((item,i)=>{const p=products.find(x=>x.id===item.id);return `<div class="cart-item"><div class="cart-item-art">${artSvg(p)}</div><div class="cart-item-info"><b>${escapeHtml(p.name)}</b><small>${escapeHtml(item.color||p.colors?.[0]||'Standart')} · ${escapeHtml(item.connection||p.connection?.[0]||'')}</small><strong>${money(item.price)}</strong><div class="cart-qty"><button data-cartqty="${i}" data-delta="-1" aria-label="Adedi azalt">−</button><span>${item.qty}</span><button data-cartqty="${i}" data-delta="1" aria-label="Adedi artır">＋</button><button class="remove-item" data-remove="${i}">Kaldır</button></div></div><button class="remove-x" data-remove="${i}" aria-label="Ürünü kaldır">×</button></div>`}).join('')}</div><div class="cart-summary"><div class="shipping-progress"><span>◇</span><p>${total>=2500?'Ücretsiz kargo eşiğine ulaştın.':`${money(2500-total)} daha ekle, örnek ücretsiz kargo eşiğine ulaş.`}</p></div><div class="summary-row"><span>Ara toplam</span><b>${money(total)}</b></div><div class="summary-row"><span>Kargo</span><b>${total>=2500?'Ücretsiz':money(total===0?0:99)}</b></div><div class="summary-row summary-total"><span>Toplam</span><b>${money(total+(total>=2500||total===0?0:99))}</b></div><button class="btn btn-primary checkout-btn" data-action="checkout">Demo siparişe devam et <span>↗</span></button><p class="cart-disclaimer">Bu mağaza bir eğitim demosudur. Gerçek ödeme alınmaz.</p></div>`}</aside></div>`;
}
function checkoutPage(){
 const total=state.cart.reduce((sum,item)=>sum+item.price*item.qty,0);
 return `<main class="checkout-page"><div class="eyebrow">KEYORA / CHECKOUT DEMO</div><h1>Son bir <em>kontrol.</em></h1><p class="content-lead">Bu ekran alışveriş akışını göstermek için hazırlanmış bir demodur. Gerçek sipariş oluşturulmaz.</p><div class="checkout-layout"><form id="checkout-form" class="checkout-form"><h2>Teslimat bilgileri</h2><div class="form-grid"><label>Ad soyad<input required maxlength="100" autocomplete="name" placeholder="Ad soyad"></label><label>E-posta<input required type="email" maxlength="120" autocomplete="email" placeholder="ornek@eposta.com"></label><label class="full">Adres<textarea required maxlength="500" autocomplete="street-address" rows="3" placeholder="Adres bilgisi"></textarea></label><label>İl<input required maxlength="60" autocomplete="address-level1" placeholder="İl"></label><label>Telefon<input required type="tel" maxlength="20" autocomplete="tel" placeholder="05xx xxx xx xx"></label></div><div class="demo-payment"><span>◎</span><div><b>Demo ödeme</b><p>Kart bilgisi istenmez ve tahsilat yapılmaz.</p></div></div><button class="btn btn-primary checkout-submit">Demo siparişi tamamla <span>↗</span></button></form><aside class="checkout-summary"><h2>Sipariş özeti</h2>${state.cart.map(item=>{const p=products.find(x=>x.id===item.id);return `<div class="checkout-item"><span>${escapeHtml(p.name)} <small>× ${item.qty}</small><small class="checkout-variant">${escapeHtml([item.color,item.connection,item.sw].filter(Boolean).join(' · '))}</small></span><b>${money(item.price*item.qty)}</b></div>`}).join('')}<div class="summary-row"><span>Ara toplam</span><b>${money(total)}</b></div><div class="summary-row"><span>Kargo</span><b>${total>=2500?'Ücretsiz':money(total?99:0)}</b></div><div class="summary-row summary-total"><span>Toplam</span><b>${money(total+(total>=2500||!total?0:99))}</b></div><p class="cart-disclaimer">Demo sipariş bilgileri sunucuya gönderilmez.</p></aside></div></main>`;
}
function notFound(){
 return `<main class="not-found"><div class="not-found-art"><span class="nf-orbit"></span><div class="nf-key">K</div><span class="nf-small">SIGNAL LOST / 404</span></div><div class="eyebrow">404 / BAĞLANTI KOPTU</div><h1>Aradığın tuş<br><em>burada değil.</em></h1><p>Bu sayfa başka bir düzene taşınmış olabilir ya da hiç var olmamıştır. İstersen yeniden başlayalım.</p><div class="hero-actions"><button class="btn btn-primary" data-page="home">Ana sayfaya dön <span>↗</span></button><button class="text-link" data-action="shop">Ürünleri keşfet <span>→</span></button></div></main>`;
}
function render(){
 let pageHtml='';
 if(state.page==='home') pageHtml=home();
 else if(state.page==='catalog') pageHtml=catalog();
 else if(state.page==='checkout') pageHtml=checkoutPage();
 else if(state.page==='404') pageHtml=notFound();
 else pageHtml=contentPage(state.page);
 app.innerHTML=header()+pageHtml+footer()+(state.selected?detailModal(products.find(p=>p.id===state.selected)): '')+(state.page==='cart'?cartDrawer():'')+(state.toast?`<div class="toast" role="status"><span>✓</span>${escapeHtml(state.toast)}</div>`:'');
 document.body.classList.toggle('modal-open',!!state.selected||state.page==='cart');
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

function navigate(page){
 if(page==='checkout' && !state.cart.length){ state.selected=null; state.page='catalog'; state.mobileMenu=false; render(); showBrandLoader(520); window.scrollTo({top:0,behavior:'smooth'}); return; }
 state.selected=null; state.mobileMenu=false;
 state.page=page;
 if(page==='catalog' && !categories.includes(state.category)) state.category='Tümü';
 history.pushState({page},'',page==='home'?'/':page==='404'?'/404-demo':`/${page}`);
 render(); showBrandLoader(520); window.scrollTo({top:0,behavior:'smooth'});
}
function showCatalog(category='Tümü'){
 state.category=category;state.query='';state.filter='';state.sort='featured';navigate('catalog');
}
function showToast(msg){
 state.toast=msg;render();setTimeout(()=>{state.toast='';render()},2200);
}
function addToCart(id){
 const p=products.find(x=>x.id===id); if(!p)return;
 const color=document.querySelector('.swatch.chosen')?.dataset.color||p.colors?.[0]||'Standart';
 const connection=document.querySelector('.option-chip[data-connection].chosen')?.dataset.connection||p.connection?.[0]||'';
 const sw=document.querySelector('.option-chip[data-switch].chosen')?.dataset.switch||p.switches?.[0]||'';
 const qty=Number(document.querySelector('#detail-qty')?.textContent||1);
 const key=`${id}|${color}|${connection}|${sw}`;
 const existing=state.cart.find(x=>x.key===key);
 if(existing) existing.qty+=qty;
 else state.cart.push({key,id,color,connection,sw,price:p.price,qty});
 saveCart();state.selected=null;state.toast=`${p.name} sepete eklendi`;render();setTimeout(()=>{state.toast='';render()},2200);
}
app.addEventListener('click',e=>{
 const el=e.target.closest('button,a,[data-action],[data-open],[data-add],[data-category],[data-page],[data-qty],[data-cartqty],[data-remove],[data-color],[data-switch],[data-connection]');
 if(!el)return;
 // Close overlays only when the backdrop itself is clicked; clicks inside the dialog remain interactive.
 if((el.classList.contains('modal-backdrop') || el.classList.contains('drawer-backdrop')) && e.target !== el)return;
 if(el.dataset.open){state.selected=el.dataset.open;render();return;}
 if(el.dataset.add){addToCart(el.dataset.add);return;}
 if(el.dataset.category){showCatalog(el.dataset.category);return;}
 if(el.dataset.page){e.preventDefault();navigate(el.dataset.page);return;}
 if(el.dataset.color){document.querySelectorAll('[data-color]').forEach(x=>x.classList.toggle('chosen',x===el));const label=document.querySelector('#color-value');if(label)label.textContent=el.dataset.color;return;}
 if(el.dataset.switch){document.querySelectorAll('[data-switch]').forEach(x=>x.classList.toggle('chosen',x===el));const label=document.querySelector('#switch-value');if(label)label.textContent=el.dataset.switch;return;}
 if(el.dataset.connection){document.querySelectorAll('[data-connection]').forEach(x=>x.classList.toggle('chosen',x===el));const label=document.querySelector('#connection-value');if(label)label.textContent=el.dataset.connection;return;}
 if(el.dataset.qty){const q=document.querySelector('#detail-qty');if(q)q.textContent=Math.max(1,Math.min(10,Number(q.textContent)+Number(el.dataset.qty)));return;}
 if(el.dataset.cartqty!==undefined){const item=state.cart[Number(el.dataset.cartqty)];if(item){item.qty=Math.min(99,item.qty+Number(el.dataset.delta));if(item.qty<=0)state.cart.splice(Number(el.dataset.cartqty),1);saveCart();render();}return;}
 if(el.dataset.remove!==undefined){state.cart.splice(Number(el.dataset.remove),1);saveCart();render();return;}
 const action=el.dataset.action;
 if(action==='shop'){showCatalog('Tümü');}
 else if(action==='cart'){state.page='cart';render();}
 else if(action==='close-cart'){navigate('home');}
 else if(action==='close-modal'){state.selected=null;render();}
 else if(action==='menu'){state.mobileMenu=!state.mobileMenu;render();}
 else if(action==='focus-search'){if(state.page!=='catalog')showCatalog('Tümü');setTimeout(()=>document.querySelector('#catalog-search')?.focus(),50);}
 else if(action==='clear-search'){state.query='';render();}
 else if(action==='reset-catalog'){state.query='';state.category='Tümü';state.filter='';state.sort='featured';render();}
 else if(action==='checkout'){if(!state.cart.length){showCatalog('Tümü');return;}navigate('checkout');}
});
app.addEventListener('change',e=>{
 if(e.target.id==='sort'){state.sort=e.target.value;render();}
 if(e.target.id==='discount-filter'){state.filter=e.target.checked?'discount':'';render();}
});
app.addEventListener('input',e=>{
 if(e.target.id==='catalog-search'){
   const pos=e.target.selectionStart;state.query=e.target.value;
   const cursor=e.target.value;render();const next=document.querySelector('#catalog-search');if(next){next.focus();next.setSelectionRange(pos,pos);}
 }
});
app.addEventListener('submit',e=>{
 e.preventDefault();
 if(e.target.id==='checkout-form'){
   if(!e.target.reportValidity())return;
   state.cart=[];saveCart();navigate('success');
   app.querySelector('main').innerHTML=`<div class="success-screen"><div class="success-icon">✓</div><div class="eyebrow">DEMO / TAMAMLANDI</div><h1>Akış tamam.<br><em>Ödeme alınmadı.</em></h1><p>Demo sipariş akışını başarıyla tamamladın. Hiçbir ödeme yapılmadı ve bilgiler bir sunucuya gönderilmedi.</p><button class="btn btn-primary" data-page="home">Ana sayfaya dön <span>↗</span></button></div>`;
 }
 else if(e.target.id==='contact-form'){showToast('Demo formu doğrulandı; veri gönderilmedi.');e.target.reset();}
 else if(e.target.id==='newsletter'||e.target.id==='newsletter-band'){showToast('Bu demo bülteni veri kaydetmez.');e.target.reset();}
});

window.addEventListener('keydown',e=>{
 if(e.key==='Escape'){
   if(state.selected){state.selected=null;render();}
   else if(state.page==='cart'){navigate('home');}
   else if(state.mobileMenu){state.mobileMenu=false;render();}
 }
});

window.addEventListener('popstate',()=>{
 const path=location.pathname.replace(/^\/|\/$/g,'');
 if(!path)state.page='home';
 else if(path==='catalog'||path==='checkout'||path==='about'||path==='faq'||path==='contact'||path==='shipping'||path==='privacy'||path==='terms'||path==='success')state.page=path;
 else state.page='404';
 state.selected=null;render();showBrandLoader(420);
});
const initialPath=location.pathname.replace(/^\/|\/$/g,'');
if(initialPath==='')state.page='home';
else if(['catalog','checkout','about','faq','contact','shipping','privacy','terms','success'].includes(initialPath))state.page=initialPath;
else state.page='404';
render();
showBrandLoader(900);
