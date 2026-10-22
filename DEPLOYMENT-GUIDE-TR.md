# KEYORA demo yayına alma rehberi

Bu rehber, mevcut KEYORA Vite/JavaScript projesini gerçek ödeme almayan herkese açık bir demo olarak yayınlamak içindir.

## Yayına çıkmadan önce

- [ ] Node.js'in güncel LTS sürümünü kur.
- [ ] Proje klasöründe `npm install` çalıştır.
- [ ] `npm run qa:static` komutunu çalıştır; `STATIC QA PASS` görmelisin.
- [ ] `npm run build` çalıştır; `dist` klasörü oluşmalı.
- [ ] `npm run dev` ile siteyi yerelde açıp ana sayfa, katalog, ürün detayları, arama/filtreleme, sepet, checkout demo, geri/ileri gezinme ve mobil görünümü kontrol et.
- [ ] Checkout ekranının demo olduğu ve gerçek sipariş/ödeme oluşturmadığı açıkça belirtilmeli.

## Yöntem A — GitHub + Vercel (önerilen)

### 1. GitHub'a yükle

1. GitHub hesabına giriş yap ve yeni, tercihen `keyora-demo` adlı bir repository oluştur.
2. Bu proje klasörünün içeriğini repository'ye yükle. `node_modules` ve `dist` klasörlerini yükleme.
3. Repository'nin doğru klasörde `package.json`, `index.html`, `src/` ve `public/` içerdiğini doğrula.

### 2. Vercel ile yayınla

1. Vercel hesabı aç ve GitHub hesabını bağla.
2. **Add New → Project** bölümünden `keyora-demo` repository'sini seç.
3. Framework preset olarak **Vite** seç (otomatik algılanırsa değiştirme).
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Install Command: `npm install`
7. Deploy düğmesine bas.

`vercel.json`, uygulamanın `/catalog`, `/cart`, `/checkout` gibi istemci tarafı rotalarının doğrudan açılmasına veya sayfa yenilemeye karşı `index.html`'e yönlendirilmesini sağlar. Vercel dağıtımının başarılı olması yine de canlı test yapılması gerektiği anlamına gelir.

### 3. Canlı kontrol

Vercel'in verdiği `https://...vercel.app` adresini aç ve şunları kontrol et:

- Ana sayfa yükleniyor, KEYORA yükleme animasyonu kayboluyor.
- Katalog, kategori, arama ve sıralama çalışıyor.
- Ürün detayları açılıyor; ürün sepete ekleniyor ve sepet yenilemeden sonra korunuyor.
- Checkout ekranı yalnızca demo akışını gösteriyor; gerçek ödeme iddiası yok.
- `/catalog` veya `/checkout` gibi bir adresi doğrudan açınca ve yenileyince 404 oluşmuyor.
- Telefonda yatay taşma ve kesilen buton yok.

## Yöntem B — Vercel CLI

Node.js kurulduktan sonra terminalde proje klasörüne gir:

```bash
npm install
npm run qa:static
npm run build
npx vercel
```

CLI yönergelerini takip et. Üretim yayını için `npx vercel --prod` kullanabilirsin. Bu komutlar Vercel hesabında oturum açmanı ve yayınlama onayı vermeni gerektirir.

## Ücretsiz demo ve sınırlar

- Vercel'in ücretsiz/Hobby planı kişisel demo ve kullanım koşulları için uygun olabilir; güncel plan limitlerini ve kullanım şartlarını kayıt sırasında kontrol et.
- Alan adı zorunlu değil; önce Vercel'in sağladığı alt alan adıyla yayınla.
- Bu sürümde gerçek backend, sunucu tarafı sipariş kaydı, yönetim paneli, canlı stok, müşteri hesabı, e-posta bildirimi ve ödeme entegrasyonu yoktur.
- Ürün fiyatları, stok ve değerlendirmeler örnek/demo verisidir. Gerçek satış yapılıyormuş izlenimi verme.
- `vercel.json` SPA rotaları içindir; backend veya ödeme altyapısı eklemez.
- Gizli anahtarları veya parolaları frontend kaynak koduna koyma. İleride sunucu/ödeme entegrasyonu eklenirse anahtarlar sunucu tarafındaki ortam değişkenlerinde tutulmalıdır.

## Sorun giderme

- `vite: not found`: proje klasöründe `npm install` çalıştır ve tekrar dene.
- Build hatası: terminaldeki ilk gerçek hata mesajını kontrol et; yalnızca `dist` klasörünün varlığına bakma.
- Sayfa yenilenince 404: `vercel.json` dosyasının repository'nin kökünde olduğundan emin ol ve yeniden deploy et.
- Fontlar yüklenmiyorsa Google Fonts bağlantısı engelleniyor olabilir; sayfa yine de yerel CSS ile açılmalıdır.
