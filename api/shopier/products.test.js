import test from 'node:test';
import assert from 'node:assert/strict';
import handler from './products.js';

test('Shopier catalog mapping and safe error responses', async () => {
  const originalFetch = globalThis.fetch;
  const originalPat = process.env.SHOPIER_PAT;
  const sentinel = 'test-only-secret-never-return';
  const call = async (method = 'GET') => {
    const headers = {};
    const res = { setHeader: (key, value) => { headers[key] = value; }, end: body => { res.body = JSON.parse(body); } };
    await handler({ method }, res);
    assert(!JSON.stringify(res.body).includes(sentinel));
    return { ...res, headers };
  };
  try {
    process.env.SHOPIER_PAT = sentinel;
    const product = {
      id: 'example', title: 'Example', stockQuantity: 0, stockStatus: 'outOfStock',
      priceData: { price: '100.00', currency: 'EUR', discount: false, discountedPrice: '80.00' },
      media: [
        { type: 'image', url: 'https://example.com/second.jpg', placement: 2 },
        { type: 'image', url: 'https://example.com/main.jpg', placement: 1 },
      ],
      privateField: sentinel,
    };
    let payload = [product];
    globalThis.fetch = async (url, options) => {
      assert(url.endsWith('/products'));
      assert.equal(options.method, 'GET');
      assert.equal(options.headers.Authorization, `Bearer ${sentinel}`);
      return { ok: true, json: async () => payload };
    };
    let result = await call();
    assert.equal(result.statusCode, 200);
    assert.equal(result.body.count, 1);
    assert.deepEqual(result.body.products[0], {
      id: 'example', title: 'Example', price: '100.00', currency: 'EUR',
      stockQuantity: 0, status: 'outOfStock', url: null, imageUrl: 'https://example.com/main.jpg',
    });
    product.priceData.discount = true;
    assert.equal((await call()).body.products[0].price, '80.00');
    product.priceData.discountedPrice = '0.00';
    assert.equal((await call()).body.products[0].price, '0.00');
    delete product.priceData.discountedPrice;
    assert.equal((await call()).body.products[0].price, '100.00');
    product.media = [null, { type: 'video', url: 'https://example.com/video' }, { type: 'image', url: '' }];
    assert.equal((await call()).body.products[0].imageUrl, null);
    product.media = [{ type: 'image', url: 'https://example.com/fallback.jpg' }];
    assert.equal((await call()).body.products[0].imageUrl, 'https://example.com/fallback.jpg');
    payload = [{}];
    assert.equal((await call()).body.products[0].price, null);
    payload = [];
    assert.equal((await call()).body.count, 0);
    payload = { unexpected: sentinel };
    assert.equal((await call()).statusCode, 502);
    globalThis.fetch = async () => ({ ok: false, status: 401, json: async () => ({ secret: sentinel }) });
    assert.equal((await call()).body.error, 'shopier_api_error');
    globalThis.fetch = async () => { throw new Error(sentinel); };
    assert.equal((await call()).body.error, 'shopier_unreachable');
    assert.equal((await call('POST')).headers.Allow, 'GET');
    delete process.env.SHOPIER_PAT;
    assert.equal((await call()).statusCode, 503);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalPat === undefined) delete process.env.SHOPIER_PAT;
    else process.env.SHOPIER_PAT = originalPat;
  }
});
