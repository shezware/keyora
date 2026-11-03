# Shopier sepet bağlantısı

Sepetteki tüm katalog ürünleri tek bir özel Shopier ilanına dönüştürülür. İlan adı `KEYORA Sipariş #KR-UUID`, açıklaması ürünler, adetler, seçenekler ve kargo dökümüdür. Shopier stok adedi bu sipariş bağlantısı için 1'dir; asıl ürün stok adedi değildir.

- Fiyat kaynağı: `lib/catalog.js` (arayüz ve sunucu ortak). Mevcut 18 ürün/fiyat kullanılır; Shopier kataloğunda eşleşme gerekmez.
- Kargo: mevcut site kuralı; 2.500 TL ve üzerinde ücretsiz, altında 99 TL. Kargo sipariş tutarına dahildir; Shopier'de ayrıca ücret eklenmez.
- Teslimat ve ödeme bilgileri Shopier'de alınır. Kişisel bilgiler ürün açıklamasına yazılmaz.
- Gereken ortam değişkeni: mevcut sunucu tarafı `SHOPIER_PAT`. PAT'in ürün listeleme ve oluşturma izni olmalıdır. PAT tarayıcıya veya loglara aktarılmaz.
- Canlı köken: `https://keyora-eight.vercel.app`. Başka alan adı için `KEYORA_SITE_URL` ayarlanmalıdır; Vercel'in kendi preview URL'si de kabul edilir.

## İstekler

`POST /api/shopier/checkout`, `Content-Type: application/json` ve izinli Origin gerektirir.

1. `{"action":"quote","items":[{"id":"k2","qty":1,"sw":"Red"}]}`: sunucu tutarı hesaplar, 30 dakika geçerli imzalı teklif döndürür. Ürün oluşturmaz.
2. `{"action":"create","token":"..."}`: imzayı doğrular, mevcut aynı sipariş ilanını arar, yoksa oluşturur. Teklifte istemcinin gönderdiği fiyat dikkate alınmaz.
3. `{"action":"recover","token":"..."}`: sadece var olan ilanı arar, asla oluşturmaz. İmzalı teklif en çok 7 gün kurtarılabilir.

Tarayıcı, oluşturma isteğinden önce siparişi localStorage'a kaydeder. Yanıt kesilirse otomatik POST tekrarı yapılmaz; düğme yalnızca `recover` çağırır. Sonuç bilinmiyorsa destek için sipariş numarası gösterilir. Sepet, yönlendirmede silinmez. Başarılı yanıtın durumu her zaman `payment_pending` olur.

## Sınırlar

Bu sürüm ödeme bağlantısı oluşturur; ödeme webhook'u, otomatik ödendi onayı, kalıcı site sipariş veritabanı ve gerçek ürün stok rezervasyonu içermez. Sipariş/ödeme takibi Shopier panelinden yapılmalıdır. Mevcut katalogdaki örnek özellik ve stok bilgileri, satışa açılacak gerçek bilgilerle ayrıca güncellenmelidir.

Tek süreç içindeki eşzamanlı aynı sipariş istekleri birleştirilir ve tekrar isteğinde Shopier ilanı aranır. Ayrı Vercel süreçlerinin aynı anda ilk oluşturmayı yapmasına karşı kalıcı dağıtık kilit yoktur; bu, küresel tam bir kez oluşturma garantisi değildir. Tarayıcı aynı anda iki istek yollamaz ve belirsiz isteği tekrar oluşturmaz. Kalıcı sipariş veritabanı eklendiğinde benzersiz orderId ve dağıtık kilit kullanılmalıdır.

İşlem başına kötüye kullanım sınırı tamamlayıcıdır; genel IP sınırı Vercel Firewall üzerinden ayrıca ayarlanmalıdır. Shopier POST isteklerinde otomatik retry yapılmaz. Ödenmemiş bağlantılar otomatik silinmez; ürün silme işlemi açık ödeme bağlantısını bozabileceği için ayrı bir yaşam döngüsü gerektirir.

## Kontrol

`node --test lib/checkout.test.js src/shopier-checkout.test.js api/shopier/products.test.js`

`npm run qa:static` ve `npm run build`
