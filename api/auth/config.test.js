import test from 'node:test';
import assert from 'node:assert/strict';
import handler, { publicAuthConfig } from './config.js';

test('public config accepts only public keys and never returns admin credentials', () => {
  const jwt = role => 'header.' + Buffer.from(JSON.stringify({ role })).toString('base64url') + '.signature';
  const base = { SUPABASE_URL: 'https://project.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'never-expose-this' };
  assert.equal(publicAuthConfig(base), null);
  assert.equal(publicAuthConfig({ ...base, SUPABASE_ANON_KEY: jwt('service_role') }), null);
  assert.equal(publicAuthConfig({ ...base, SUPABASE_PUBLISHABLE_KEY: 'sb_secret_private' }), null);
  for (const url of ['https://attacker.example', 'https://project.supabase.co.attacker.example', 'http://project.supabase.co', 'https://user:pass@project.supabase.co', 'https://project.supabase.co/?secret=1']) {
    assert.equal(publicAuthConfig({ ...base, SUPABASE_URL: url, SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_public' }), null);
  }
  const config = publicAuthConfig({ ...base, SUPABASE_ANON_KEY: jwt('anon') });
  assert.equal(config.url, base.SUPABASE_URL);
  assert(!JSON.stringify(config).includes('never-expose-this'));
  const headers = {};
  const res = { setHeader: (k, v) => headers[k] = v, end: value => res.body = JSON.parse(value) };
  handler({ method: 'POST' }, res);
  assert.equal(res.statusCode, 405);
  assert.equal(headers['Cache-Control'], 'no-store');
});
