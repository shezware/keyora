# KEYORA — E-ticaret eğitim projesi

KEYORA, teknoloji çevre birimleri satan kurgusal bir marka için hazırlanmış responsive frontend e-ticaret demosudur.

## Özellikler
- 18 ürün modeli, 5 ürün kategorisi ve SKU başına farklı, yerel SVG ürün illüstrasyonu
- Ürün detay penceresi; renk, switch ve bağlantı varyasyonları
- Kategori bazlı listeleme, arama, fiyat/puan sıralaması ve indirim filtresi
- Varyasyonları ayrı satırlar olarak tutan sepet, adet güncelleme/silme ve localStorage kalıcılığı
- Boş sepetten checkout'a geçişi engelleme, demo checkout ve özel 404 sayfası
- Mobil/tablet/masaüstü uyumlu CSS, klavye odak stilleri ve Escape ile modal kapatma
- Statik veri/arayüz varsayımlarını kontrol eden bağımlılıksız QA komutu

## Çalıştırma
Node.js kurulu olmalı. Proje klasöründe: 

```bash
npm install
npm run dev
```

Terminalde gösterilen yerel adresi tarayıcıda aç. Üretim derlemesi için `npm run build`, derlemeyi önizlemek için `npm run preview` kullan.

Bağımlılık kurulumundan bağımsız statik kontroller: 

```bash
node qa-static.mjs
# veya npm bağımlılıkları kurulduktan sonra:
npm run qa:static
```

## Ürün görselleri ve içerik
Ürün görselleri, her ürün modeline göre farklılaştırılmış SVG illüstrasyonlarıdır; gerçek ürün fotoğrafı oldukları iddia edilmez. Ürün adları, fiyatlar, stok, puanlar, yorumlar ve teknik özellikler eğitim demosu için hazırlanmıştır. Katalogdaki fiyatlar, sepet ve checkout özeti arasında aynı ürün fiyatını kullanacak şekilde eşitlenir.

## Önemli sınırlamalar
Bu proje frontend demosudur. Gerçek backend, yönetim paneli, kullanıcı hesabı, canlı stok yönetimi, e-posta gönderimi, ödeme sağlayıcısı veya sunucu tarafı sipariş kaydı yoktur. Checkout ekranı gerçek sipariş oluşturmaz ve ödeme almaz. Sepet yalnızca bu tarayıcıdaki `localStorage` alanında saklanır; gerçek müşteri/sipariş verisi altyapısı değildir.

## Güvenlik ve kalite notu
`SECURITY-REPORT.md` mevcut mimari sınırlarını, `QUALITY-REPORT.md` bu revizyonda yapılan düzeltmeleri ve gerçekten çalıştırılabilen kontrolleri açıklar. Otomatik statik kontroller, gerçek tarayıcı uçtan uca testinin veya canlı sistem güvenlik testinin yerine geçmez.


### Loading and motion
The site includes a KEYORA-branded loading overlay on initial load and route changes, plus scroll-reveal transitions for major sections and product cards. The motion respects the browser's `prefers-reduced-motion` setting.
