# KEYORA üyelik kurulumu

Bu değişiklik mevcut Vite/Vercel uygulamasına Supabase Auth ekler. Shopier ödeme akışı bağımsız çalışmaya devam eder; üyelik ödeme için zorunlu değildir. Shopier siparişleri henüz kullanıcı hesabına bağlanmaz.

## Bir defalık canlı kurulum

1. Sahibinin yönettiği Supabase hesabında proje seç/oluştur. PostgreSQL veritabanı ve Auth kayıtları bu hesaba ait olur. Bir sağlayıcı hesabı bağlanmadan bu adımlar uygulanmış sayılmaz.
2. SQL Editor veya migration aracıyla `supabase/migrations/20261103_members.sql` dosyasını bir kez çalıştır. Tablo, tetikleyiciler ve kullanıcıya özel okuma politikası aynı işlemde oluşturulur. Migration var olan üyeleri de aktarır. Tekrar çalıştırmak için hazırlanmış değildir.
3. Authentication → URL Configuration: Site URL `https://keyora-eight.vercel.app`; izinli redirect URL'leri `https://keyora-eight.vercel.app/account` ve `https://keyora-eight.vercel.app/account?recovery=1`. Preview ortamı gerekiyorsa yalnızca güvenilen preview adreslerini ayrıca ekle.
4. E-posta/şifre sağlayıcısını ve e-posta doğrulamayı aç. Minimum şifre uzunluğunu sunucuda da 12 yap. Canlı ziyaretçilere doğrulama ve sıfırlama e-postaları için kendi SMTP hizmetini bağla; Supabase'in varsayılan e-posta hizmetini genel kullanıcı trafiği için kullanma.
5. Vercel Production ortamına `SUPABASE_URL` ve `SUPABASE_PUBLISHABLE_KEY` ekle. Eski projelerde publishable yerine `SUPABASE_ANON_KEY` kullanılabilir. `service_role`, `sb_secret_` ve veritabanı şifresini bu alanlara **koyma**. İstemcide yönetici anahtarı gerekmez.
6. Bu dalı birleştirip Vercel'de yeniden deploy et. `/api/auth/config` sadece proje URL'sini ve public anahtarı döndürür. Eksik/yanlış ayarda 503 verir ve hesap ekranı üyelik kabul etmez.
7. Gerçek bir test e-postasıyla kayıt → doğrulama → giriş → sayfa yenileme → ad soyad güncelleme → çıkış → şifre yenileme akışlarını doğrula. İkinci bir kullanıcıyla ilk kullanıcının `member_profiles` satırını okuyamadığını doğrula. E-posta servisinin kotasını ve oran sınırlarını projeden kontrol et.

## Kayıtların bulunduğu yer

- E-posta, kullanıcı kimliği ve doğrulama bilgisi: Supabase Authentication → Users.
- Ad soyad, kullanıcı kimliği, oluşturulma ve güncellenme tarihleri: Table Editor → `member_profiles`.
- Şifre: yalnızca Auth tarafından hash olarak yönetilir; sitede ve yönetim ekranında düz metin olarak görüntülenmez.
- Kullanıcı kendi profilini okuyabilir. Diğer üyelerin kayıtlarına erişemez. Tarayıcıya toplu üye listesi veya admin anahtarı gönderilmez.
- Profil adı Auth metadata üzerinden güncellenir ve tetikleyiciyle tabloya yansır; tabloya istemciden doğrudan yazma izni verilmez. Metadata hiçbir yerde yönetici yetkisi olarak kullanılmaz.
- Kullanıcı Auth üzerinden silinirse bağlı profil de silinir. SQL veya parola bilgilerini GitHub'a kaydetme.

## Kontrol kapsamı

`npm test`, `npm run qa:static`, `npm run build`.

Yerel testler anahtarların güvenli seçimini, kayıt doğrulamasını, doğrulama beklemeyi, giriş/çıkışı, şifre yenilemeyi, güvenli metin çıktısını ve yapılandırılmamış durumu kapsar. Gerçek e-posta teslimi, SQL/RLS ve kalıcı oturum canlı Supabase projesiyle ayrıca doğrulanmalıdır. Üyelik kodu hazır olması, bu altyapının kurulmuş olduğu anlamına gelmez.

Kaynaklar: https://supabase.com/docs/guides/auth/managing-user-data ve https://supabase.com/docs/guides/auth/passwords
