/**
 * Private, read-only Shopier orders endpoint.
 * Requires SHOPIER_PAT and KEYORA_ADMIN_TOKEN in Vercel Environment Variables.
 * Never call this from public frontend code.
 */
const API_BASE = (process.env.SHOPIER_API_BASE || 'https://api.shopier.com/v1').replace(/\/+$/, '');

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function isIsoDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z?)?$/.test(value);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return send(res, 405, { error: 'method_not_allowed' });
  }
  const expected = process.env.KEYORA_ADMIN_TOKEN;
  const supplied = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : '';
  if (!expected || !supplied || supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    return send(res, 401, { error: 'unauthorized' });
  }
  const pat = process.env.SHOPIER_PAT;
  if (!pat) return send(res, 503, { error: 'shopier_not_configured' });

  const url = new URL(req.url, 'https://keyora.invalid');
  const dateStart = url.searchParams.get('dateStart');
  const dateEnd = url.searchParams.get('dateEnd');
  if (!dateStart && !dateEnd) {
    return send(res, 400, { error: 'date_range_required', message: 'dateStart veya dateEnd parametresi gereklidir.' });
  }
  if ((dateStart && !isIsoDate(dateStart)) || (dateEnd && !isIsoDate(dateEnd))) {
    return send(res, 400, { error: 'invalid_date', message: 'Tarih ISO biçiminde olmalıdır.' });
  }

  const upstreamUrl = new URL(`${API_BASE}/orders`);
  if (dateStart) upstreamUrl.searchParams.set('dateStart', dateStart);
  if (dateEnd) upstreamUrl.searchParams.set('dateEnd', dateEnd);
  const limit = Number(url.searchParams.get('limit') || 25);
  upstreamUrl.searchParams.set('limit', String(Number.isInteger(limit) ? Math.max(1, Math.min(limit, 100)) : 25));

  try {
    const upstream = await fetch(upstreamUrl, {
      headers: { Authorization: `Bearer ${pat}`, Accept: 'application/json' },
      signal: AbortSignal.timeout(12000),
    });
    if (!upstream.ok) return send(res, 502, { error: 'shopier_api_error', upstreamStatus: upstream.status });
    const payload = await upstream.json();
    // Orders include personal/customer information; this route is intentionally private.
    return send(res, 200, payload);
  } catch {
    return send(res, 502, { error: 'shopier_unreachable' });
  }
}

function timingSafeEqual(a, b) {
  // Constant-work comparison without requiring a third-party package.
  let mismatch = 0;
  for (let i = 0; i < b.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}
