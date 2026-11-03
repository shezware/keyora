import { createClient } from '@supabase/supabase-js';

export function validateRegistration({ name, email, password, confirm }) {
  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 120) return 'Ad soyadın 2–120 karakter olmalı.';
  if (typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Geçerli bir e-posta adresi yaz.';
  if (typeof password !== 'string' || password.length < 12 || password.length > 128) return 'Şifren 12–128 karakter olmalı.';
  if (password !== confirm) return 'Şifreler birbiriyle eşleşmiyor.';
  return '';
}

export function authError(error) {
  const code = error?.code;
  if (code === 'invalid_credentials') return 'E-posta veya şifre hatalı.';
  if (code === 'email_not_confirmed') return 'Giriş yapmadan önce e-postandaki doğrulama bağlantısını aç.';
  if (code === 'weak_password') return 'Daha güçlü bir şifre seç. En az 12 karakter kullan.';
  if (['over_email_send_rate_limit', 'over_request_rate_limit'].includes(code) || error?.status === 429) return 'Çok fazla deneme yapıldı. Biraz bekleyip tekrar dene.';
  if (code === 'same_password') return 'Öncekinden farklı bir şifre seç.';
  if (code === 'signup_disabled') return 'Yeni üyelikler şu anda kapalı.';
  return 'İşlem tamamlanamadı. Bağlantını kontrol edip tekrar dene.';
}

export async function createAuthClient() {
  const response = await fetch('/api/auth/config', { cache: 'no-store', signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error('auth_not_configured');
  const config = await response.json();
  return createClient(config.url, config.key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce', storageKey: 'keyora-auth-v1' },
  });
}
