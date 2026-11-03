import { createHash, timingSafeEqual } from 'node:crypto';

// Temporary, authenticated, fixed-payload probe. Remove after the single authorized test.
const TOKEN_HASH = '8c3bd679e51b66637d76fdbd018cc3e3e0b126c0de558556a15d7a00d8e9fc8d';
const EXPIRES_AT = 1793720264309;
const TITLE = 'KEYORA Sipariş #KR-TEST-8C3BD679 — K65 Air';
let busy = false;
export default async function handler(req, res) {
  const send = (status, body) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(JSON.stringify(body));
  };
  if (req.method !== 'POST') return send(405, { error: 'method_not_allowed' });
  const auth = req.headers.authorization;
  if (typeof auth !== 'string' || !auth.startsWith('Bearer ')) return send(401, { error: 'unauthorized' });
  const digest = createHash('sha256').update(auth.slice(7)).digest();
  if (!timingSafeEqual(digest, Buffer.from(TOKEN_HASH, 'hex'))) return send(401, { error: 'unauthorized' });
  if (Date.now() > EXPIRES_AT) return send(410, { error: 'test_expired' });
  if (!process.env.SHOPIER_PAT) return send(503, { error: 'shopier_not_configured' });
  if (busy) return send(409, { error: 'test_in_progress' });
  busy = true;
  const headers = { Authorization: `Bearer ${process.env.SHOPIER_PAT}`, Accept: 'application/json', 'Content-Type': 'application/json' };
  const publicProduct = p => ({ id: p.id, title: p.title, url: p.url, price: p.priceData?.price, currency: p.priceData?.currency });
  try {
    const previous = await fetch('https://api.shopier.com/v1/products?limit=50&sort=dateDesc', { headers, signal: AbortSignal.timeout(12000) });
    if (!previous.ok) return send(502, { error: 'preflight_failed', upstreamStatus: previous.status });
    const list = await previous.json();
    if (!Array.isArray(list)) return send(502, { error: 'unexpected_list' });
    const existing = list.find(p => p.title === TITLE);
    if (existing) return send(200, { existing: true, product: publicProduct(existing) });
    const response = await fetch('https://api.shopier.com/v1/products', {
      method: 'POST', headers, signal: AbortSignal.timeout(12000),
      body: JSON.stringify({
        title: TITLE,
        description: 'KEYORA otomatik sipariş bağlantısı denemesi. K65 Air × 1. Test kaydıdır; bu denemede ödeme yapmayınız.',
        type: 'physical',
        media: [{ type: 'image', url: 'https://cdn.shopier.app/pictures_large/key0racom_e8b4cb51294735445d1d1e2deea8c0df.jpeg', placement: 1 }],
        priceData: { currency: 'TRY', price: '2799.00' },
        stockQuantity: 1, shippingPayer: 'sellerPays', customListing: true
      })
    });
    if (!response.ok) return send(502, { error: 'creation_failed', upstreamStatus: response.status });
    const product = await response.json();
    return send(201, { existing: false, product: publicProduct(product) });
  } catch {
    return send(502, { error: 'test_outcome_unknown_do_not_retry' });
  } finally { busy = false; }
}
