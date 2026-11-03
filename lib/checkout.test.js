import test from 'node:test';
import assert from 'node:assert/strict';
import { products } from './catalog.js';
import { calculateCart, signQuote, verifyQuote, paymentResult } from './checkout.js';
import handler from '../api/shopier/checkout.js';

test('all 18 products use server prices, quantities and validated variants', () => {
  for (const p of products) {
    const cart = calculateCart([{ id: p.id, qty: 2, price: 0.01, total: 1, sw: '', connection: '' }]);
    assert.equal(cart.subtotal, p.price * 200);
    assert.equal(cart.lines[0].name, p.name);
  }
  const cart = calculateCart([{ id: 'k2', qty: 1 }, { id: 'w1', qty: 2 }]);
  assert.equal(cart.total, 399700);
  assert.equal(calculateCart([{ id: 'w1', qty: 1 }]).total, 69800);
  for (const items of [[], [{ id: 'unknown', qty: 1 }], [{ id: 'k2', qty: 0 }], [{ id: 'k2', qty: -1 }], [{ id: 'k2', qty: 1.2 }], [{ id: 'k2', qty: 100 }], [{ id: 'k2', qty: 1, sw: '<script>' }], [{ id: 'k2', qty: 99 }, { id: 'k2', qty: 1 }]]) assert.throws(() => calculateCart(items));
});

test('signed quotes cannot be modified or used with a different secret; expired quotes only allow recovery', () => {
  const cart = calculateCart([{ id: 'k2', qty: 1 }]);
  const signed = signQuote(cart, 'private-secret');
  assert.equal(verifyQuote(signed.token, 'private-secret').total, 279900);
  assert.throws(() => verifyQuote(signed.token, 'different-secret'));
  const [body, sig] = signed.token.split('.');
  const value = JSON.parse(Buffer.from(body, 'base64url').toString()); value.total = 1;
  assert.throws(() => verifyQuote(Buffer.from(JSON.stringify(value)).toString('base64url') + '.' + sig, 'private-secret'));
  const now = Date.now;
  try {
    Date.now = () => now() + 3600000;
    assert.throws(() => verifyQuote(signed.token, 'private-secret'), /quote_expired/);
    assert.equal(verifyQuote(signed.token, 'private-secret', true).total, 279900);
  } finally { Date.now = now; }
  assert.throws(() => paymentResult({ url: 'https://evil.example', priceData: { currency: 'TRY', price: '2799.00' } }, signed.quote));
  assert.throws(() => paymentResult({ url: 'https://www.shopier.com/123', priceData: { currency: 'TRY', price: '0.01' } }, signed.quote));
});

test('route creates one combined physical order, reuses existing order and never leaks secrets or confirms payment', async () => {
  const originalFetch = globalThis.fetch, originalPat = process.env.SHOPIER_PAT;
  process.env.SHOPIER_PAT = 'private-pat-do-not-return';
  let requests = 0, writes = 0, existing = [], sent;
  let ip = 0;
  const call = async (body, origin = 'https://keyora-eight.vercel.app') => {
    const res = { setHeader() {}, end(value) { this.body = JSON.parse(value); assert(!value.includes(process.env.SHOPIER_PAT)); } };
    await handler({ method: 'POST', headers: { origin, 'content-type': 'application/json', 'x-forwarded-for': 'test-' + ip++ }, body }, res);
    return res;
  };
  try {
    globalThis.fetch = async (url, opts) => {
      requests++;
      assert.equal(opts.headers.Authorization, 'Bearer private-pat-do-not-return');
      if (opts.method !== 'POST') return { ok: true, json: async () => existing };
      writes++; sent = JSON.parse(opts.body);
      const product = { ...sent, id: '123', url: 'https://www.shopier.com/123' };
      existing.push(product);
      return { ok: true, json: async () => product };
    };
    assert.equal((await call({ action: 'quote', items: [{ id: 'k2', qty: 1 }] }, 'https://evil.example')).statusCode, 403);
    assert.equal(requests, 0);
    const signed = (await call({ action: 'quote', items: [{ id: 'k2', qty: 1 }, { id: 'w1', qty: 2 }] })).body;
    assert.equal(requests, 0);
    const [a,b] = await Promise.all([call({ action: 'create', token: signed.token }), call({ action: 'create', token: signed.token })]);
    assert.equal(writes, 1); assert.equal(a.body.paymentUrl, b.body.paymentUrl);
    assert.equal(a.body.status, 'payment_pending');
    assert.equal(sent.priceData.price, '3997.00'); assert.equal(sent.priceData.shippingPrice, '0.00');
    assert.equal(sent.shippingPayer, 'sellerPays'); assert.equal(sent.type, 'physical'); assert.equal(sent.stockQuantity, 1);
    assert.match(sent.description, /K65 Air × 1/); assert.match(sent.description, /Wrist Rest × 2/);
    await call({ action: 'create', token: signed.token });
    assert.equal(writes, 1);
    assert.equal((await call({ action: 'recover', token: signed.token })).body.productId, '123');
    existing = [];
    assert.equal((await call({ action: 'recover', token: signed.token })).body.error, 'order_not_found');
    assert.equal(writes, 1);
    globalThis.fetch = async (url, opts) => {
      if (opts.method !== 'POST') return { ok: true, json: async () => [] };
      writes++; throw new Error('private-pat-do-not-return');
    };
    assert.equal((await call({ action: 'create', token: signed.token })).body.error, 'creation_outcome_unknown');
    assert.equal(writes, 2);
    await call({ action: 'recover', token: signed.token });
    assert.equal(writes, 2);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalPat === undefined) delete process.env.SHOPIER_PAT; else process.env.SHOPIER_PAT = originalPat;
  }
});
