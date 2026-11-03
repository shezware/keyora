import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { products } from './catalog.js';

export class CheckoutError extends Error {
  constructor(code, status = 400) { super(code); this.status = status; }
}

export function calculateCart(items) {
  if (!Array.isArray(items) || !items.length || items.length > 50) throw new CheckoutError('invalid_cart');
  const quantities = new Map();
  const lines = items.map(item => {
    const product = products.find(p => p.id === item?.id);
    if (!product || !Number.isInteger(item.qty) || item.qty < 1 || item.qty > 99) throw new CheckoutError('invalid_cart');
    quantities.set(product.id, (quantities.get(product.id) || 0) + item.qty);
    if (quantities.get(product.id) > 99) throw new CheckoutError('invalid_cart');
    const line = { id: product.id, name: product.name, qty: item.qty, unitPrice: Math.round(product.price * 100) };
    for (const [field, choices] of [['color', product.colors], ['connection', product.connection], ['sw', product.switches]]) {
      const value = item[field] || choices?.[0];
      if (value !== undefined) {
        if (!Array.isArray(choices) || !choices.includes(value)) throw new CheckoutError('invalid_variant');
        line[field] = value;
      }
    }
    return line;
  });
  const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.qty, 0);
  const shipping = subtotal >= 250000 ? 0 : 9900;
  return { lines, subtotal, shipping, total: subtotal + shipping, currency: 'TRY' };
}

function signature(text, secret) { return createHmac('sha256', secret).update('keyora-checkout-v1:' + text).digest(); }
export function signQuote(cart, secret) {
  const quote = { ...cart, orderId: 'KR-' + randomUUID(), createdAt: Date.now(), expiresAt: Date.now() + 30 * 60 * 1000 };
  const encoded = Buffer.from(JSON.stringify(quote)).toString('base64url');
  return { quote, token: encoded + '.' + signature(encoded, secret).toString('base64url') };
}
export function verifyQuote(token, secret, recover = false) {
  if (typeof token !== 'string' || token.length > 24000) throw new CheckoutError('invalid_quote');
  const [encoded, digest, extra] = token.split('.');
  if (!encoded || !digest || extra) throw new CheckoutError('invalid_quote');
  const expected = signature(encoded, secret);
  const actual = Buffer.from(digest, 'base64url');
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) throw new CheckoutError('invalid_quote');
  let quote;
  try { quote = JSON.parse(Buffer.from(encoded, 'base64url').toString()); } catch { throw new CheckoutError('invalid_quote'); }
  if (!quote.orderId?.startsWith('KR-') || !Number.isFinite(quote.expiresAt)) throw new CheckoutError('invalid_quote');
  if ((!recover && quote.expiresAt < Date.now()) || quote.createdAt < Date.now() - 7 * 86400000) throw new CheckoutError('quote_expired', 409);
  return quote;
}

export function paymentResult(product, quote) {
  let url;
  try { url = new URL(product.url); } catch { throw new CheckoutError('unexpected_shopier_response', 502); }
  if (url.protocol !== 'https:' || !['shopier.com', 'www.shopier.com'].includes(url.hostname) || url.username || url.password) throw new CheckoutError('unexpected_shopier_response', 502);
  if (product.priceData?.currency !== 'TRY' || Math.round(Number(product.priceData?.price) * 100) !== quote.total) throw new CheckoutError('order_amount_mismatch', 502);
  return { orderId: quote.orderId, productId: product.id, paymentUrl: url.href, total: quote.total, currency: 'TRY', status: 'payment_pending' };
}
