// This endpoint exposes only the public project URL/key, never an admin key.
export function publicAuthConfig(env = process.env) {
  const url = env.SUPABASE_URL;
  const key = env.SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' || !parsed.hostname.endsWith('.supabase.co') || parsed.username || parsed.password || parsed.pathname !== '/' || parsed.search || parsed.hash) return null;
    if (!key.startsWith('sb_publishable_')) {
      const claims = JSON.parse(Buffer.from(key.split('.')[1] || '', 'base64url').toString());
      if (claims.role !== 'anon') return null;
    }
    return { url: parsed.origin, key };
  } catch { return null; }
}

export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET'); res.statusCode = 405;
    return res.end(JSON.stringify({ error: 'method_not_allowed' }));
  }
  const config = publicAuthConfig();
  res.statusCode = config ? 200 : 503;
  res.end(JSON.stringify(config || { error: 'auth_not_configured' }));
}
