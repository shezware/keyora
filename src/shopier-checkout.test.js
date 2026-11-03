import test from 'node:test';
import assert from 'node:assert/strict';

test('checkout opens one combined link, preserves cart, reuses links and recovers uncertain creation without retrying POST', async () => {
  const values = new Map();
  globalThis.localStorage = { getItem: k => values.get(k) ?? null, setItem: (k,v) => values.set(k,v), removeItem: k => values.delete(k) };
  globalThis.document = { addEventListener() {} };
  const redirects = [];
  globalThis.window = { location: { assign: url => redirects.push(url) }, confirm: () => true };
  const { beginCheckout, checkoutMarkup } = await import('./shopier-checkout.js');
  const status = { textContent: '' }, button = { disabled: false };
  const form = { querySelector: selector => selector === '[type="submit"]' ? button : status };
  const cart = [{ id: 'k2', qty: 1, price: 2799, sw: 'Red' }];
  const actions = [];
  globalThis.fetch = async (url, opts) => {
    const body = JSON.parse(opts.body); actions.push(body.action);
    if (body.action === 'quote') {
      assert.deepEqual(body.items, [{ id: 'k2', qty: 1, sw: 'Red' }]);
      return { ok: true, json: async () => ({ quote: { orderId: 'KR-test', total: 279900 }, token: 'signed' }) };
    }
    return { ok: true, json: async () => ({ orderId: 'KR-test', paymentUrl: 'https://www.shopier.com/123', status: 'payment_pending' }) };
  };
  await beginCheckout(form, cart, () => {});
  assert.deepEqual(actions, ['quote', 'create']); assert.equal(redirects.length, 1); assert.equal(cart.length, 1);
  await beginCheckout(form, cart, () => {});
  assert.equal(actions.length, 2); assert.equal(redirects.length, 2);
  values.clear(); actions.length = 0;
  globalThis.fetch = async (url, opts) => {
    const body = JSON.parse(opts.body); actions.push(body.action);
    if (body.action === 'quote') return { ok: true, json: async () => ({ quote: { orderId: 'KR-unknown', total: 279900 }, token: 'signed' }) };
    if (body.action === 'create') throw new Error('network failure');
    return { ok: false, json: async () => ({ error: 'order_not_found' }) };
  };
  await beginCheckout(form, cart, () => {});
  await beginCheckout(form, cart, () => {});
  assert.deepEqual(actions, ['quote', 'create', 'recover']);
  assert.match(status.textContent, /KR-unknown/);
  const html = checkoutMarkup(cart, [{ id: 'k2', price: 2799, name: 'K65 Air' }], n => String(n), s => String(s));
  assert(html.includes('Shopier ile ödeme'));
  assert(!html.includes('autocomplete="street-address"'));
  assert(!html.includes('Ödeme alındı'));
});
