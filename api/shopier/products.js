/**
 * Public, read-only Shopier catalog proxy for Vercel Functions.
 * Requires SHOPIER_PAT in Vercel Environment Variables.
 * Never expose the PAT to browser code.
 */
const API_BASE = (process.env.SHOPIER_API_BASE || 'https://api.shopier.com/v1').replace(/\/+$/, '');

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  res.end(JSON.stringify(body));
}

function findItems(payload) {
  if (Array.isArray(payload)) return payload;
  for (const key of ['items', 'data', 'products', 'results']) {
    if (Array.isArray(payload?.[key])) return payload[key];
  }
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  return null;
}

function safeProduct(p) {
  return {
    id: p?.id ?? p?.productId ?? null,
    title: p?.title ?? p?.name ?? null,
    price: p?.price ?? p?.salePrice ?? null,
    currency: p?.currency ?? 'TRY',
    stockQuantity: p?.stockQuantity ?? p?.stock ?? null,
    status: p?.status ?? null,
    url: p?.url ?? p?.productUrl ?? null,
    imageUrl: p?.imageUrl ?? p?.image ?? null,
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return send(res, 405, { error: 'method_not_allowed' });
  }
  const pat = process.env.SHOPIER_PAT;
  if (!pat) return send(res, 503, { error: 'shopier_not_configured', message: 'Shopier API yapılandırılmamış.' });

  try {
    const upstream = await fetch(`${API_BASE}/products`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${pat}`, Accept: 'application/json' },
      signal: AbortSignal.timeout(12000),
    });
    if (!upstream.ok) {
      // Do not pass through upstream body or headers: they can contain sensitive details.
      return send(res, upstream.status === 401 || upstream.status === 403 ? 502 : 502, {
        error: 'shopier_api_error',
        message: 'Shopier ürün listesi alınamadı. PAT ve API erişimini kontrol edin.',
        upstreamStatus: upstream.status,
      });
    }
    const payload = await upstream.json();
    const items = findItems(payload);
    if (!items) return send(res, 502, { error: 'unexpected_shopier_response', message: 'Shopier yanıt biçimi beklenenden farklı.' });
    return send(res, 200, { source: 'shopier', count: items.length, products: items.map(safeProduct) });
  } catch {
    return send(res, 502, { error: 'shopier_unreachable', message: 'Shopier API bağlantısı kurulamadı.' });
  }
}
