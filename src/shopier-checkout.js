const STORAGE = 'keyora-shopier-checkout-v1';
let busy = false;
const messages = {
  invalid_cart: 'Sepetteki ürünleri ve adetleri kontrol et.',
  invalid_variant: 'Ürün seçenekleri değişmiş. Ürünü sepetten çıkarıp tekrar ekle.',
  invalid_quote: 'Ödeme bilgisi doğrulanamadı. Sayfayı yenileyip tekrar dene.',
  quote_expired: 'Ödeme teklifi zaman aşımına uğradı. Sayfayı yenileyip tekrar dene.',
  try_later: 'Çok sayıda istek gönderildi. Bir dakika sonra tekrar dene.',
  shopier_not_configured: 'Shopier bağlantısı henüz yapılandırılmamış.',
  shopier_permission_denied: 'Shopier ürün oluşturma izni vermedi. Mağazayla iletişime geç.',
  shopier_lookup_failed: 'Shopier sipariş bağlantısı kontrol edilemedi. Biraz sonra tekrar dene.',
  order_not_found: 'Ödeme bağlantısı henüz doğrulanamadı. Yeni bağlantı oluşturmadan önce sipariş numarasıyla mağazaya ulaş.',
  creation_outcome_unknown: 'Shopier yanıtı kesinleşmedi. Tekrar bastığında yalnızca mevcut bağlantı aranacak; yeni ürün oluşturulmayacak.',
};

function readPending() {
  try { return JSON.parse(localStorage.getItem(STORAGE) || 'null'); } catch { return null; }
}
function savePending(value) {
  localStorage.setItem(STORAGE, JSON.stringify(value));
}
function safeUrl(value) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || !['shopier.com', 'www.shopier.com'].includes(url.hostname) || url.username || url.password) throw new Error('invalid_payment_url');
  return url.href;
}
async function request(body) {
  const response = await fetch('/api/shopier/checkout', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body), signal: AbortSignal.timeout(55000),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'checkout_failed');
  return data;
}

export function checkoutMarkup(cart, products, money, escapeHtml) {
  const subtotal = cart.reduce((sum, item) => sum + products.find(p => p.id === item.id).price * item.qty, 0);
  const shipping = subtotal >= 2500 || !subtotal ? 0 : 99;
  const pending = readPending();
  return `<main class="checkout-page"><div class="eyebrow">KEYORA / GÜVENLİ ÖDEME</div><h1>Son bir <em>kontrol.</em></h1><p class="content-lead">Sepetini kontrol et. Ödeme ve teslimat bilgilerini Shopier üzerinde tamamlayacaksın.</p><div class="checkout-layout"><form id="checkout-form" class="checkout-form"><h2>Shopier ile ödeme</h2><div class="demo-payment"><span>◎</span><div><b>Kart bilgilerin Shopier’de kalır.</b><p>Sepetin için özel bir sipariş bağlantısı hazırlanır. Ürünler, adetler ve seçeneklerin Shopier açıklamasında yer alır.</p></div></div><p>Kargo tutarı aşağıdaki toplama dahildir; bu bağlantıda ayrıca kargo ücreti eklenmez.</p><button class="btn btn-primary checkout-submit" type="submit">${pending?.stage === 'creating' ? 'Ödeme bağlantısını kontrol et' : 'Shopier ile öde'} <span>↗</span></button><p id="checkout-status" role="status" aria-live="polite">${pending ? 'Önceki bağlantın bu tarayıcıda saklanıyor. Ödeme durumu burada otomatik doğrulanmaz.' : ''}</p>${pending?.paymentUrl ? '<button class="btn btn-outline" type="button" id="new-shopier-order">Yeni sipariş başlat</button>' : ''}<p class="shopier-note">Ödeme tamamlandığında Shopier’in sipariş onayını esas al. Sadece bağlantının açılması, ödeme yapıldığı anlamına gelmez.</p></form><aside class="checkout-summary"><h2>Sipariş özeti</h2>${cart.map(item => { const p = products.find(p => p.id === item.id); return `<div class="checkout-item"><span>${escapeHtml(p.name)} <small>× ${item.qty}</small><small class="checkout-variant">${escapeHtml([item.color,item.connection,item.sw].filter(Boolean).join(' · '))}</small></span><b>${money(p.price * item.qty)}</b></div>`; }).join('')}<div class="summary-row"><span>Ara toplam</span><b>${money(subtotal)}</b></div><div class="summary-row"><span>Kargo</span><b>${shipping ? money(shipping) : 'Ücretsiz'}</b></div><div class="summary-row summary-total"><span>Toplam</span><b>${money(subtotal + shipping)}</b></div><p class="cart-disclaimer">Tutar, ödeme bağlantısı oluşturulmadan önce sunucuda yeniden hesaplanır.</p></aside></div></main>`;
}

export async function beginCheckout(form, cart, showToast) {
  if (busy) return;
  busy = true;
  const button = form.querySelector('[type="submit"]');
  const status = form.querySelector('#checkout-status');
  const tell = message => { status.textContent = message; };
  button.disabled = true;
  let pending = readPending();
  try {
    const items = cart.map(({ id, qty, color, connection, sw }) => ({ id, qty, color, connection, sw }));
    const fingerprint = JSON.stringify(items);
    if (pending?.stage === 'creating') {
      tell('Önceki sipariş bağlantısı kontrol ediliyor… ' + pending.orderId);
      const result = await request({ action: 'recover', token: pending.token });
      pending = { ...pending, ...result, stage: 'ready' };
      savePending(pending);
    }
    if (pending?.paymentUrl) {
      if (pending.fingerprint !== fingerprint) {
        tell('Sepetin değişmiş. Önceki bağlantı farklı bir sepete ait. Önceki ödemeyi Shopier’den kontrol edip “Yeni sipariş başlat” düğmesini kullan.');
        // The button is also available when a recover request just found the old order.
        addNewOrderButton(form);
        return;
      }
      tell('Sipariş: ' + pending.orderId + ' — Shopier’e yönlendiriliyorsun…');
      window.location.assign(safeUrl(pending.paymentUrl));
      return;
    }
    tell('Sepet tutarı doğrulanıyor…');
    const { quote, token } = await request({ action: 'quote', items });
    const displayedSubtotal = cart.reduce((sum, item) => sum + Math.round(item.price * 100) * item.qty, 0);
    const displayedTotal = displayedSubtotal + (displayedSubtotal >= 250000 ? 0 : 9900);
    if (displayedTotal !== quote.total && !window.confirm('Güncel sepet toplamı ' + (quote.total / 100).toFixed(2) + ' TL. Bu tutarla devam edilsin mi?')) {
      tell('Güncel fiyatı kontrol etmek için sayfayı yenileyebilirsin. Ödeme bağlantısı oluşturulmadı.');
      return;
    }
    pending = { token, orderId: quote.orderId, fingerprint, stage: 'creating' };
    // Persist before POST so a reload never silently retries an uncertain creation.
    try { savePending(pending); } catch { throw new Error('storage_unavailable'); }
    tell('Sipariş bağlantısı hazırlanıyor… ' + quote.orderId);
    let result;
    try { result = await request({ action: 'create', token }); }
    catch (error) {
      if (['shopier_permission_denied', 'invalid_quote', 'quote_expired', 'shopier_not_configured'].includes(error.message)) localStorage.removeItem(STORAGE);
      throw error;
    }
    savePending({ ...pending, ...result, stage: 'ready' });
    tell('Sipariş: ' + result.orderId + ' — Shopier’e yönlendiriliyorsun…');
    window.location.assign(safeUrl(result.paymentUrl));
  } catch (error) {
    const message = error.message === 'storage_unavailable' ? 'Tarayıcıda site depolamasına izin ver. Henüz ödeme bağlantısı oluşturulmadı.'
      : messages[error.message] || (readPending()?.stage === 'creating' ? messages.creation_outcome_unknown : 'Shopier’e bağlanılamadı. Biraz sonra tekrar dene.');
    tell(message + (pending?.orderId ? ' Sipariş: ' + pending.orderId : ''));
  } finally { busy = false; button.disabled = false; }
}

function addNewOrderButton(form) {
  if (form.querySelector('#new-shopier-order')) return;
  const button = document.createElement('button');
  button.type = 'button'; button.id = 'new-shopier-order'; button.className = 'btn btn-outline'; button.textContent = 'Yeni sipariş başlat';
  form.append(button);
}
document.addEventListener('click', event => {
  if (!event.target.closest('#new-shopier-order') || busy) return;
  if (!window.confirm('Önceki bağlantıda ödeme yaptıysan yeni sipariş açmak ikinci bir sipariş oluşturabilir. Yeni sipariş başlatılsın mı?')) return;
  localStorage.removeItem(STORAGE);
  event.target.closest('#new-shopier-order').remove();
  const status = document.querySelector('#checkout-status');
  if (status) status.textContent = 'Yeni sipariş hazır. Shopier ile öde düğmesine basabilirsin.';
});
