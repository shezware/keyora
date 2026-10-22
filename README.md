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

## Shopier API hazırlığı (Vercel)
Projeye Vercel serverless API uç noktaları eklendi:
- `GET /api/shopier/products`: Shopier ürün kataloğunu sunucu üzerinden okur ve güvenli alanlarla sınırlar.
- `GET /api/shopier/orders?dateStart=2026-10-01T00:00:00Z&limit=25`: siparişleri okur; `Authorization: Bearer <KEYORA_ADMIN_TOKEN>` gerektirir. Bunu herkese açık frontend kodundan çağırmayın.

Vercel → Settings → Environment Variables bölümüne `SHOPIER_PAT` değişkenini ekleyin. `SHOPIER_API_BASE` isteğe bağlıdır; varsayılanı `https://api.shopier.com/v1` değeridir. Sipariş endpoint'i için ayrıca uzun ve rastgele bir `KEYORA_ADMIN_TOKEN` oluşturup yalnızca güvenli bir yönetim ortamında saklayın. Gerçek token'ları GitHub'a, frontend koduna veya sohbetlere koymayın. Değişkenler eklendikten sonra yeni deployment gerekir.

Bu ilk aşama yalnızca sunucu tarafı API bağlantı iskeletidir; canlı Shopier hesabıyla doğrulanmış değildir. Önce `/api/shopier/products` endpoint'ini test edin. Ürün alanları veya API yanıt biçimi farklıysa endpoint uyarlanmalıdır. Mevcut K60 Mini satın alma bağlantısı doğrudan Shopier ürün sayfasına gider. Otomatik fiyat/stok eşitlemesi, webhook ile ödeme doğrulaması ve sipariş durumunun KEYORA içinde kaydı henüz etkin değildir.

## Önemli sınırlamalar
Bu proje hâlâ frontend demo + API hazırlık aşamasındadır. Sepet yalnızca bu tarayıcıdaki `localStorage` alanında saklanır. Shopier ödeme sayfası üzerinden satın alma yapılabilse de KEYORA tarafında gerçek sipariş veritabanı, müşteri hesabı, kargo otomasyonu veya webhook ile doğrulanmış ödeme kaydı henüz yoktur.

## Güvenlik ve kalite notu
`SECURITY-REPORT.md` mevcut mimari sınırlarını, `QUALITY-REPORT.md` bu revizyonda yapılan düzeltmeleri ve gerçekten çalıştırılabilen kontrolleri açıklar. Otomatik statik kontroller, gerçek tarayıcı uçtan uca testinin veya canlı sistem güvenlik testinin yerine geçmez.


### Loading and motion
The site includes a KEYORA-branded loading overlay on initial load and route changes, plus scroll-reveal transitions for major sections and product cards. The motion respects the browser's `prefers-reduced-motion` setting.
