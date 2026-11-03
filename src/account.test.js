import test from 'node:test';
import assert from 'node:assert/strict';
import { authError, validateRegistration } from './auth-service.js';

test('registration requires a name, valid email, long matching password', () => {
  const valid = { name: 'Örnek Üye', email: 'member@example.test', password: 'test-only-strong-password', confirm: 'test-only-strong-password' };
  assert.equal(validateRegistration(valid), '');
  for (const changed of [{ name: ' ' }, { name: 'x'.repeat(121) }, { email: 'bad' }, { password: 'short' }, { confirm: 'different' }]) assert(validateRegistration({ ...valid, ...changed }));
  assert.equal(authError({ code: 'invalid_credentials', message: 'internal secret' }), 'E-posta veya şifre hatalı.');
  assert(!authError({ message: 'internal secret' }).includes('internal secret'));
});

test('account handles confirmation, session, safe profile output, recovery and signout', async () => {
  const status = { textContent: '' };
  globalThis.document = { querySelector: selector => selector === '#member-status' ? status : null };
  globalThis.location = { origin: 'https://keyora-eight.vercel.app', pathname: '/account', search: '', hash: '' };
  globalThis.history = { replaceState() {} };
  const RealFormData = globalThis.FormData;
  globalThis.FormData = class { constructor(form) { return new Map(Object.entries(form.values)); } };
  let authEvent, sent, user = null;
  let renderCount = 0;
  const success = { data: {}, error: null };
  const auth = {
    onAuthStateChange: callback => { authEvent = callback; return { data: { subscription: { unsubscribe() {} } } }; },
    getSession: async () => ({ data: { session: null }, error: null }),
    signUp: async values => { sent = values; return { data: { session: null }, error: null }; },
    signInWithPassword: async () => { user = { id: 'user-1', email: 'member@example.test', user_metadata: { full_name: '<script>alert(1)</script>' } }; authEvent('SIGNED_IN', { user }); return success; },
    updateUser: async values => { sent = values; authEvent('USER_UPDATED', { user }); return success; },
    signOut: async () => { authEvent('SIGNED_OUT', null); return success; },
    resetPasswordForEmail: async (email, options) => { sent = { email, options }; return success; },
  };
  const { initAccount, accountMarkup, submitMember, memberAction, accountLabel } = await import('./account.js');
  const form = (mode, values) => ({ dataset: { mode }, values, reset() {}, querySelector: () => ({ disabled: false }) });
  try {
    await initAccount(() => renderCount++, async () => ({ auth }));
    assert.match(accountMarkup(), /Giriş yap/);
    await memberAction('register');
    await submitMember(form('register', { name: 'Örnek Üye', email: 'member@example.test', password: 'test-only-strong-password', confirm: 'test-only-strong-password' }));
    assert.equal(sent.options.data.full_name, 'Örnek Üye');
    assert.equal(sent.options.emailRedirectTo, 'https://keyora-eight.vercel.app/account');
    assert.match(status.textContent, /doğrulama bağlantısı/);
    assert.equal(accountLabel(), 'Giriş yap');
    await submitMember(form('login', { email: 'member@example.test', password: 'test-only-strong-password' }));
    assert.equal(accountLabel(), 'Hesabım');
    assert(!accountMarkup().includes('<script>'));
    assert.match(accountMarkup(), /&lt;script&gt;/);
    authEvent('PASSWORD_RECOVERY', { user });
    assert.match(accountMarkup(), /Yeni şifreni belirle/);
    await submitMember(form('password', { password: 'another-test-only-password', confirm: 'another-test-only-password' }));
    assert.equal(sent.password, 'another-test-only-password');
    assert.match(accountMarkup(), /Hoş geldin/);
    await memberAction('forgot');
    assert.equal(sent.options.redirectTo, 'https://keyora-eight.vercel.app/account?recovery=1');
    await memberAction('logout');
    assert.equal(accountLabel(), 'Giriş yap');
    assert(renderCount > 1);
    await initAccount(() => {}, async () => { throw Error('unconfigured'); });
    assert.match(accountMarkup(), /Üyelik şu anda kullanılamıyor/);
    assert(!accountMarkup().includes('id="member-form"'));
  } finally { globalThis.FormData = RealFormData; }
});
