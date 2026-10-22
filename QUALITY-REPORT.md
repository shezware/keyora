# KEYORA — Bağımsız kalite kontrol notları

## Bu revizyonda yapılan düzeltmeler
- Ürün illüstrasyonları beş ürün ailesine göre yeniden çizildi ve 18 SKU için farklılaştırıldı. Görseller yerel SVG; dışarıdan alakasız/stock fotoğraf yüklenmiyor ve fotoğraf gerçekliği iddia edilmiyor.
- SVG içindeki gradient kimlikleri her çizimde benzersiz hale getirildi.
- Ürün penceresinin kapatma düğmesi masaüstü ve mobilde sabit, görünür ve tıklanabilir konuma alındı. Kapatma düğmesi, arka plana tıklama ve Escape davranışı destekleniyor.
- Sepet içindeki inline `stopPropagation` kaldırıldı; bu kod sepetin içindeki miktar/sil/checkout butonlarına giden olayları engelleyebiliyordu. İçerik tıklaması artık arka plan tıklaması gibi değerlendirilmez.
- Sepetten fiyatlar mevcut katalog verisiyle eşitleniyor, bozuk localStorage verileri ayıklanıyor ve miktar 99 ile sınırlandırılıyor.
- Sepet boşken checkout rotasına gidilmesi engellendi. Checkout özetine varyasyon bilgileri eklendi.
- Ana sayfadaki kategori sayısı ve garanti/ödeme metrikleri düzeltildi; gerçek ödeme alınmadığı açıkça belirtiliyor.

## Çalıştırılan kontroller
| Kontrol | Sonuç |
|---|---|
| `node --check src/main.js` | PASS |
| `node qa-static.mjs` | PASS — 21 statik doğrulama |
| Ürün sayısı ve benzersiz kimlikler | PASS — 18 ürün, 18 kimlik |
| Kategori adetleri | PASS — Klavyeler 5, Mouse 4, Mousepad 3, Kulaklık 3, Aksesuarlar 3 |
| Pozitif fiyatlar, teknik özelliklerin varlığı, indirimli fiyatların tutarlılığı | PASS |
| SVG işaretlemesi, erişilebilir etiketler ve 18 farklı illüstrasyon | PASS |
| Modal kapatma CSS'i, overlay event mantığı, Escape desteği, boş checkout kontrolü | PASS |
| Geçici yerel QA sunucusundan HTTP yanıtı | PASS — HTTP 200 |

## Tamamlanamayan doğrulamalar
- `npm install` bu çalışma ortamında paket kayıt sunucusuna erişim/yanıt alamadığı için tamamlanamadı (`vite` bağımlılığı önbellekte de yok). Bu nedenle Vite `npm run build` komutu çalıştırılamadı.
- Tarayıcıda Playwright uçtan uca tıklama testleri denenirken tarayıcı ortamı hem localhost hem file URL navigasyonunu `ERR_BLOCKED_BY_ADMINISTRATOR` ile engelledi. Bu nedenle modal/sepet/checkout akışlarının gerçek tarayıcı etkileşim testi bu ortamda doğrulanamadı. Bunları PASS olarak raporlamıyorum.
- Gerçek ödeme, backend siparişi, kullanıcı hesabı, canlı stok ve e-posta gönderimi kapsam dışıdır; bu sürüm demo olarak kalır.

## Kullanıcı ortamında son doğrulama
Proje klasöründe `npm install`, `npm run dev` ve ayrı terminalde `npm run build` çalıştırılmalı. Tarayıcıda ürün penceresi (kapatma düğmesi/arka plan/Escape), her kategori, varyasyon seçimi, sepet miktar/silme, boş sepet, checkout ve `/404-demo` yolu elle denenmelidir. `node qa-static.mjs` ise bağımlılık kurulmadan çalışır.


## Motion update (2026-10-22)
- Added a full-screen KEYORA-branded loading transition on initial page load, route navigation, and browser back/forward navigation. It reuses the existing `K` brand mark and wordmark.
- Added IntersectionObserver-based scroll reveal transitions for hero sections, categories, product cards, and key content blocks.
- Preserved smooth top-of-page scrolling during route navigation and honored `prefers-reduced-motion`.
- Extended static QA checks for loader presence, navigation wiring, reveal behavior, and reduced-motion styles.
- Browser-based visual and interaction testing remains incomplete because Vite dependencies are not installed in this environment; `npm run build` could not run (`vite: not found`).
