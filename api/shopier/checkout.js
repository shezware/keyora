import { calculateCart, signQuote, verifyQuote, paymentResult, CheckoutError } from '../../lib/checkout.js';

const inFlight = new Map();
const rate = new Map();
const BASE = 'https://api.shopier.com/v1';
const SITE = 'https://keyora-eight.vercel.app';
const amount = cents => (cents / 100).toFixed(2);

async function findOrder(quote, headers) {
  const title = 'KEYORA Sipariş #' + quote.orderId;
  for (let page = 1; page <= 20; page++) {
    const query = new URLSearchParams({ limit: '50', page: String(page), sort: 'dateDesc', customListing: 'true', dateStart: new Date(quote.createdAt - 60000).toISOString() });
    const response = await fetch(BASE + '/products?' + query, { headers, signal: AbortSignal.timeout(12000) });
    if (!response.ok) throw new CheckoutError('shopier_lookup_failed', 502);
    const products = await response.json();
    if (!Array.isArray(products)) throw new CheckoutError('unexpected_shopier_response', 502);
    const existing = products.find(p => p.title === title);
    if (existing) return existing;
    if (products.length < 50) return null;
  }
  // Fail closed when we cannot rule out an existing order.
  throw new CheckoutError('lookup_limit_reached', 503);
}

async function createOrder(quote, headers) {
  const existing = await findOrder(quote, headers);
  if (existing) return paymentResult(existing, quote);
  const description = quote.lines.map(line => {
    const variant = [line.color, line.sw, line.connection].filter(Boolean).join(' / ');
    return line.name + ' × ' + line.qty + (variant ? ' (' + variant + ')' : '') + ' — ' + amount(line.unitPrice * line.qty) + ' TL';
  }).join('\n') + '\nKargo: ' + amount(quote.shipping) + ' TL\nToplam: ' + amount(quote.total) + ' TL\nSipariş: ' + quote.orderId;
  let response;
  try {
    // Never automatically retry POST: Shopier does not promise idempotent creation.
    response = await fetch(BASE + '/products', {
      method: 'POST', headers, signal: AbortSignal.timeout(12000),
      body: JSON.stringify({
        title: 'KEYORA Sipariş #' + quote.orderId, description, type: 'physical',
        media: [{ type: 'image', url: SITE + '/order-cover.png', placement: 1 }],
        priceData: { currency: 'TRY', price: amount(quote.total), shippingPrice: '0.00' },
        stockQuantity: 1, shippingPayer: 'sellerPays', customListing: true,
      }),
    });
  } catch { throw new CheckoutError('creation_outcome_unknown', 502); }
  if (!response.ok) throw new CheckoutError(response.status === 401 || response.status === 403 ? 'shopier_permission_denied' : 'creation_outcome_unknown', 502);
  try { return paymentResult(await response.json(), quote); }
  catch { throw new CheckoutError('creation_outcome_unknown', 502); }
}

export default async function handler(req, res) {
  const send = (status, body) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    return res.end(JSON.stringify(body));
  };
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return send(405, { error: 'method_not_allowed' }); }
  const allowedOrigins = [SITE, process.env.KEYORA_SITE_URL, process.env.VERCEL_URL && 'https://' + process.env.VERCEL_URL].filter(Boolean);
  if (!allowedOrigins.includes(req.headers.origin)) return send(403, { error: 'invalid_origin' });
  if (!req.headers['content-type']?.startsWith('application/json')) return send(415, { error: 'json_required' });
  const secret = process.env.SHOPIER_PAT;
  if (!secret) return send(503, { error: 'shopier_not_configured' });
  try {
    if (Number(req.headers['content-length']) > 32768 || JSON.stringify(req.body ?? {}).length > 32768) throw new CheckoutError('body_too_large', 413);
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!body || !['quote', 'create', 'recover'].includes(body.action)) throw new CheckoutError('invalid_request');
    // Supplemental per-instance abuse protection; configure Vercel Firewall for a global limit.
    const ip = String(req.headers['x-forwarded-for'] || 'unknown').split(',')[0].trim();
    const now = Date.now();
    for (const [key, entry] of rate) if (entry.until < now) rate.delete(key);
    if (rate.size > 10000) throw new CheckoutError('try_later', 429);
    const entry = rate.get(ip) || { count: 0, until: now + 60000 };
    if (++entry.count > 20) throw new CheckoutError('try_later', 429);
    rate.set(ip, entry);
    if (body.action === 'quote') {
      const cart = calculateCart(body.items);
      return send(200, signQuote(cart, secret));
    }
    const quote = verifyQuote(body.token, secret, body.action === 'recover');
    const headers = { Authorization: 'Bearer ' + secret, Accept: 'application/json', 'Content-Type': 'application/json' };
    if (body.action === 'recover') {
      const existing = await findOrder(quote, headers);
      return existing ? send(200, paymentResult(existing, quote)) : send(409, { error: 'order_not_found', orderId: quote.orderId });
    }
    if (!inFlight.has(quote.orderId)) {
      const task = createOrder(quote, headers).finally(() => inFlight.delete(quote.orderId));
      inFlight.set(quote.orderId, task);
    }
    return send(200, await inFlight.get(quote.orderId));
  } catch (error) {
    return send(error instanceof CheckoutError ? error.status : 400, { error: error instanceof CheckoutError ? error.message : 'invalid_request' });
  }
}
