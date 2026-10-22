# KEYORA — Mobil Uyumluluk ve Güvenlik Denetim Raporu

**Kapsam:** Kaynak kodu ve uygulama mimarisi üzerinden ilk değerlendirme. Bu rapor, tarayıcıda otomatik test çalıştırıldığı veya canlı bir sisteme penetrasyon testi uygulandığı anlamına gelmez.

## Mimari sınır
- Bu sürüm statik frontend demosudur.
- Sunucu tarafı API, veritabanı, oturum, kullanıcı hesabı, yönetim paneli ve ödeme sağlayıcısı bulunmaz.
- Gerçek sipariş veya ödeme alınmaz.
- Sepet verisi tarayıcı `localStorage` alanında tutulur; kullanıcı tarafından değiştirilebilir ve güvenilir sipariş kaydı değildir.

## Kontrol özeti

| Kontrol | Durum | Not |
|---|---|---|
| Responsive CSS breakpoint'leri | Implemented, cihaz testi gerekli | 360px altı, mobil, tablet ve masaüstü için kurallar var; gerçek cihaz doğrulaması yapılmalı. |
| XSS için metin kaçışlama | Kısmen uygulandı | Dinamik metinlerin çoğu `escapeHtml` ile yerleştirilir; HTML güvenliği kapsamlı test edilmelidir. |
| Fiyat güvenliği | Demo sınırı | Frontend fiyatları güvenilir kaynak değildir. Canlı sistemde fiyat ve toplam sunucuda hesaplanmalı. |
| Kimlik doğrulama / yetkilendirme | Not applicable / not implemented | Hesap ve yönetim API'si yok. |
| CSRF | Not applicable for current static demo | Sunucuya yazma yapan oturumlu endpoint yok. Backend eklenirse yeniden değerlendirilmelidir. |
| Gizli anahtarlar | No application secrets expected | Gizli anahtar içeren entegrasyon yok. |
| Bağımlılık denetimi | Not tested | `npm audit` komutu geliştirici ortamında çalıştırılmalıdır. |
| Güvenlik başlıkları / CSP | Deployment-dependent | HTTP başlıkları statik host yapılandırmasında eklenmeli; CSP font politikasıyla uyumlu kurulmalı. |
| Gerçek ödeme güvenliği | Not implemented | Kart bilgisi alınmaz; gerçek ödeme entegrasyonu yok. |
| Klavye erişilebilirliği | Partially implemented | Odak stilleri ve form etiketleri mevcut; tam WCAG denetimi yapılmadı. |
| Lighthouse / performans | Not tested | Tarayıcıda Lighthouse çalıştırılmalıdır. |
| Otomatik mobil emülasyon | Not tested | Playwright veya benzeri bir araçla test yapılmalıdır. |

## Önerilen doğrulama komutları
```bash
npm install
npm run build
npm audit
```

Mümkünse Playwright ile 320, 375, 390, 768, 1024 ve 1440 px ekran genişliklerinde ana sayfa, katalog, ürün detay penceresi, sepet, checkout ve 404 ekranlarını test edin. Gerçek sonuçlar elde edilmeden PASS olarak raporlamayın.

## Canlı yayına çıkmadan önce
1. Backend ve sunucu tarafı ürün/fiyat/stok doğrulaması kurun.
2. Güvenilir ödeme sağlayıcısı kullanın; kart verisini kendiniz saklamayın.
3. Üretim sunucusunda HTTPS ve güvenlik başlıklarını yapılandırın.
4. Bağımlılık taraması, otomatik testler ve bağımsız güvenlik incelemesi yapın.
5. Gizlilik, çerez, tüketici hukuku, mesafeli satış ve iade süreçlerini gerçek işletme koşullarına göre değerlendirin.
6. İletişim/bülten formlarını yalnızca gerekli güvenlik ve veri koruma tedbirleriyle backend'e bağlayın.
