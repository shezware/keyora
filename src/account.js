import { authError, createAuthClient, validateRegistration } from './auth-service.js';

const escape = (value = '') => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let client, user = null, phase = 'loading', mode = 'login', recovery = false, notice = '', notify = () => {};
let busy = false;
const recoveryReturn = () => location.origin + '/account?recovery=1';
const accountReturn = () => location.origin + '/account';

export function accountLabel() { return user ? 'Hesabım' : 'Giriş yap'; }
export async function initAccount(onChange, makeClient = createAuthClient) {
  notify = onChange;
  try {
    client = await makeClient();
    client.auth.onAuthStateChange((event, session) => {
      // Supabase callbacks must remain synchronous; render after its auth lock releases.
      const oldId = user?.id;
      user = session?.user || null;
      if (event === 'PASSWORD_RECOVERY') recovery = true;
      if (event === 'SIGNED_OUT') { recovery = false; mode = 'login'; }
      if (phase === 'ready' && (oldId !== user?.id || event === 'PASSWORD_RECOVERY' || event === 'USER_UPDATED')) queueMicrotask(() => notify());
    });
    const result = await client.auth.getSession();
    if (result.error) throw result.error;
    user = result.data.session?.user || null;
    if (user && new URLSearchParams(location.search).get('recovery') === '1') recovery = true;
    if (new URLSearchParams(location.search).has('error') || new URLSearchParams(location.hash.slice(1)).has('error')) {
      notice = 'E-posta bağlantısı geçersiz veya süresi dolmuş. Yeni bir bağlantı iste.';
    }
    // Remove callback codes/errors after the SDK has consumed them.
    if (location.pathname === '/account' && (location.search || location.hash)) history.replaceState({ page: 'account' }, '', '/account');
    phase = 'ready';
  } catch { phase = 'unavailable'; }
  notify();
}

function input(label, name, type, autocomplete, extra = '') {
  return `<label class="member-field"><span>${label}</span><input name="${name}" type="${type}" autocomplete="${autocomplete}" required ${extra}></label>`;
}

export function accountMarkup() {
  const intro = `<section class="member-intro"><div class="eyebrow">KEYORA / SENİN ALANIN</div><h1>Kendi ritminde.<br><em>Kendi hesabında.</em></h1><p>Bilgilerini tek bir yerde tut. KEYORA’ya kaldığın yerden devam et.</p><div class="member-symbol" aria-hidden="true">K<span>→</span></div><div class="member-intro-note">01 / HESABIN SANA AİT</div></section>`;
  let content;
  if (phase === 'loading') content = '<h2>Hesabın hazırlanıyor.</h2><p role="status">Üyelik bağlantısı kontrol ediliyor…</p>';
  else if (phase === 'unavailable') content = '<div class="eyebrow">KISA BİR ARA</div><h2>Üyelik şu anda kullanılamıyor.</h2><p>Biraz sonra tekrar deneyebilirsin.</p><button type="button" class="btn btn-outline" data-member="retry">Tekrar dene ↗</button>';
  else if (user && !recovery) {
    content = `<div class="eyebrow">KEYORA / HESABIM</div><h2>Hoş geldin.</h2><p class="member-email">${escape(user.email)}</p><form id="member-form" data-mode="profile">${input('Ad soyad', 'name', 'text', 'name', `minlength="2" maxlength="120" value="${escape(user.user_metadata?.full_name || '')}"`)}<p class="member-note">E-posta adresin giriş için kullanılır. Üyelik bilgilerin hesabında saklanır.</p><button class="btn btn-primary" type="submit">Bilgilerimi kaydet ↗</button></form><div class="member-account-actions"><button type="button" data-member="forgot" class="text-link">Şifremi sıfırla →</button><button type="button" data-member="logout" class="text-link">Çıkış yap ↗</button></div>`;
  } else if (user && recovery) {
    content = `<div class="eyebrow">YENİ BİR BAŞLANGIÇ</div><h2>Yeni şifreni belirle.</h2><form id="member-form" data-mode="password">${input('Yeni şifre', 'password', 'password', 'new-password', 'minlength="12" maxlength="128"')}${input('Yeni şifre tekrar', 'confirm', 'password', 'new-password', 'minlength="12" maxlength="128"')}<button type="submit" class="btn btn-primary">Şifremi güncelle ↗</button></form>`;
  } else if (mode === 'forgot') {
    content = `<div class="eyebrow">HESABINA GERİ DÖN</div><h2>Şifreni mi unuttun?</h2><p>E-posta adresine şifre yenileme bağlantısı gönderelim.</p><form id="member-form" data-mode="forgot">${input('E-posta adresi', 'email', 'email', 'email', 'maxlength="254"')}<button type="submit" class="btn btn-primary">Bağlantı gönder ↗</button></form><button type="button" class="text-link" data-member="login">Girişe dön →</button>`;
  } else {
    const register = mode === 'register';
    content = `<div class="member-tabs" aria-label="Üyelik işlemi"><button type="button" data-member="login" ${!register ? 'aria-current="page"' : ''}>Giriş yap</button><button type="button" data-member="register" ${register ? 'aria-current="page"' : ''}>Üye ol</button></div><h2>${register ? 'Tanıştığımıza memnunuz.' : 'Tekrar hoş geldin.'}</h2><p>${register ? 'Hesabını oluştur, kendi alanını aç.' : 'E-posta adresin ve şifrenle devam et.'}</p><form id="member-form" data-mode="${mode}">${register ? input('Ad soyad', 'name', 'text', 'name', 'minlength="2" maxlength="120"') : ''}${input('E-posta adresi', 'email', 'email', 'email', 'maxlength="254"')}${input('Şifre', 'password', 'password', register ? 'new-password' : 'current-password', register ? 'minlength="12" maxlength="128"' : 'maxlength="128"')}${register ? input('Şifre tekrar', 'confirm', 'password', 'new-password', 'minlength="12" maxlength="128"') : ''}${register ? '<p class="member-note">En az 12 karakter kullan. Kaydını tamamlamak için e-posta adresini doğrulaman istenebilir.</p>' : ''}<button class="btn btn-primary" type="submit">${register ? 'Hesabımı oluştur' : 'Giriş yap'} ↗</button></form>${register ? '<p class="member-note">Bilgilerin hesabını oluşturmak ve yönetmek için kullanılır. <button type="button" class="text-link" data-page="privacy">Gizlilik bilgisi →</button></p>' : '<div class="member-help"><button type="button" class="text-link" data-member="forgot">Şifremi unuttum →</button><button type="button" class="text-link" data-member="resend">Doğrulama e-postasını yeniden gönder →</button></div>'}`;
  }
  return `<main class="member-page">${intro}<section class="member-card" aria-label="Üyelik"><div class="member-card-content">${content}<p id="member-status" role="status" aria-live="polite">${escape(notice)}</p></div><span class="member-card-footer">KEYORA / KENDİ ALANIN</span></section></main>`;
}

function say(text) {
  notice = text;
  const status = document.querySelector('#member-status');
  if (status) status.textContent = text;
}

export async function submitMember(form) {
  if (busy || !client || phase !== 'ready') return;
  const values = Object.fromEntries(new FormData(form));
  const action = form.dataset.mode;
  let invalid = '';
  if (action === 'register') invalid = validateRegistration(values);
  if (action === 'password' && (values.password.length < 12 || values.password.length > 128 || values.password !== values.confirm)) invalid = 'Şifreler eşleşmeli ve 12–128 karakter olmalı.';
  if (action === 'profile' && (values.name.trim().length < 2 || values.name.trim().length > 120)) invalid = 'Ad soyadın 2–120 karakter olmalı.';
  if (invalid) { say(invalid); return; }
  busy = true;
  const button = form.querySelector('[type="submit"]');
  button.disabled = true;
  say('İşlemin yapılıyor…');
  try {
    let result;
    if (action === 'register') {
      result = await client.auth.signUp({ email: values.email.trim(), password: values.password, options: { data: { full_name: values.name.trim() }, emailRedirectTo: accountReturn() } });
      if (!result.error) {
        form.reset();
        say(result.data.session ? 'Hesabın oluşturuldu.' : 'Adresin kayıt için uygunsa doğrulama bağlantısı gönderildi. E-posta kutunu kontrol et.');
      }
    } else if (action === 'login') {
      result = await client.auth.signInWithPassword({ email: values.email.trim(), password: values.password });
      if (!result.error) { notice = ''; form.reset(); }
    } else if (action === 'forgot') {
      result = await client.auth.resetPasswordForEmail(values.email.trim(), { redirectTo: recoveryReturn() });
      if (!result.error) say('Bu adresle bir hesap varsa şifre yenileme bağlantısı gönderildi. E-posta kutunu kontrol et.');
    } else if (action === 'profile') {
      result = await client.auth.updateUser({ data: { full_name: values.name.trim() } });
      if (!result.error) say('Bilgilerin kaydedildi.');
    } else if (action === 'password') {
      result = await client.auth.updateUser({ password: values.password });
      if (!result.error) { recovery = false; notice = 'Şifren güncellendi.'; form.reset(); notify(); }
    }
    if (result?.error) say(authError(result.error));
  } catch { say('Bağlantı kurulamadı. Biraz sonra tekrar dene.'); }
  finally { busy = false; button.disabled = false; if (user) notify(); }
}

export async function memberAction(action) {
  if (busy) return;
  if (['login', 'register', 'forgot'].includes(action)) { mode = action; notice = ''; if (action !== 'forgot' || !user) { notify(); return; } }
  if (action === 'retry') { phase = 'loading'; notify(); await initAccount(notify); return; }
  if (!client) return;
  busy = true;
  try {
    if (action === 'logout') {
      const { error } = await client.auth.signOut();
      if (error) throw error;
      user = null; recovery = false; mode = 'login'; notice = 'Güvenle çıkış yaptın.'; notify();
    } else if (action === 'forgot' && user) {
      const { error } = await client.auth.resetPasswordForEmail(user.email, { redirectTo: recoveryReturn() });
      if (error) throw error;
      say('Şifre yenileme bağlantısı e-posta adresine gönderildi.');
    } else if (action === 'resend') {
      const email = document.querySelector('#member-form [name="email"]')?.value.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { say('Önce giriş formuna e-posta adresini yaz.'); return; }
      const { error } = await client.auth.resend({ type: 'signup', email, options: { emailRedirectTo: accountReturn() } });
      if (error) throw error;
      say('Adresin uygunsa yeni doğrulama bağlantısı gönderildi.');
    }
  } catch (error) { say(authError(error)); }
  finally { busy = false; }
}
