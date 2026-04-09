# Dore Adem - Teknik Dokümantasyon

Bu doküman, "Dore Adem" e-ticaret platformunun teknik mimarisini, kullanılan teknolojileri ve proje yapısını detaylandırmaktadır. Bu bilgiler, projenin mevcut durumunu anlamak ve gelecekteki revizyonları kolaylaştırmak amacıyla hazırlanmıştır.

## 1. Genel Bakış
"Dore Adem", yüksek kaliteli çiçek ve bitki satışı için tasarlanmış modern bir e-ticaret platformudur. Proje üç ana bileşenden oluşmaktadır:
- **Backend**: RESTful API hizmeti sağlayan sunucu tarafı.
- **Frontend**: Müşterilerin alışveriş yaptığı kullanıcı arayüzü.
- **Admin**: Mağaza yönetimi, ürün girişi ve sipariş takibi için kullanılan yönetim paneli.

---

## 2. Teknoloji Yığını (Tech Stack)

### Backend
- **Çalışma Ortamı**: Node.js
- **Framework**: Express.js
- **Veritabanı**: MongoDB (Mongoose ODM)
- **Kimlik Doğrulama**: JSON Web Token (JWT), Bcrypt
- **Dosya Yükleme**: Multer
- **Araçlar**: Axios, Dotenv, Slugify

### Frontend (Müşteri Paneli)
- **Kütüphane**: React (Vite ile yapılandırılmış)
- **Durum Yönetimi**: Redux Toolkit (Store ve Thunk)
- **Tasarım**: Tailwind CSS
- **Navigasyon**: React Router DOM (v7)
- **İletişim**: Axios

### Admin (Yönetim Paneli)
- **Kütüphane**: React
- **Tasarım**: Tailwind CSS
- **Sürükle-Bırak**: @dnd-kit, react-beautiful-dnd
- **Navigasyon**: React Router DOM

---

## 3. Proje Yapısı

```text
doreAdem/
├── backend/            # API Sunucusu
│   ├── config/         # Veritabanı ve genel yapılandırmalar
│   ├── controllers/    # İş mantığı (Business Logic)
│   ├── middleware/     # Auth ve Error handling katmanları
│   ├── models/         # MongoDB Şemaları (Mongoose)
│   ├── routes/         # API uç noktaları (Endpoints)
│   └── uploads/        # Yüklenen görsellerin saklandığı yer
├── frontend/           # Müşteri Arayüzü
│   ├── src/
│   │   ├── components/ # Yeniden kullanılabilir UI bileşenleri
│   │   ├── context/    # React Context API (Cart, Settings vb.)
│   │   ├── pages/      # Sayfa bileşenleri (Home, ProductDetail vb.)
│   │   └── store/      # Redux Store yapılandırması
├── admin/              # Yönetim Paneli
│   ├── src/
│   │   ├── components/ # Admin özel bileşenleri (Sidebar, Toast vb.)
│   │   ├── pages/      # Yönetim sayfaları (Ürünler, Siparişler vb.)
│   │   └── contexts/   # AuthContext vb.
└── docker-compose.yml  # Dockerize edilmiş ortam yapılandırması
```

---

## 4. Backend Detayları

### Veri Modelleri (Mongoose)
- **User**: Müşteri bilgileri, favoriler ve adresler.
- **Admin**: Yönetici hesapları.
- **Product**: Ürün adı, açıklama, fiyat, stok, görseller, kategoriler ve markalar.
- **Category**: Ürün kategorileri.
- **Brand**: Marka bilgileri.
- **Order**: Sipariş detayları, ödeme durumu, kargo bilgileri.
- **Settings**: Site genel ayarları (iletişim, SEO vb.).

### Temel API Rotaları
- `/api/users`: Kayıt, giriş, profil yönetimi.
- `/api/products`: Ürün listeleme ve detay.
- `/api/orders`: Sipariş oluşturma ve takip.
- `/api/admin`: Yönetici işlemleri (dashboard verileri, kullanıcı yönetimi).
- `/api/categories` & `/api/brands`: Kategori ve marka işlemleri.

---

## 5. Önemli Özellikler ve Akışlar

### Alışveriş ve Ödeme Akışı
1. Müşteri ürünleri keşfeder ve sepete ekler (Redux + LocalStorage).
2. Ödeme (`/odeme`) sayfasında adres ve kargo bilgileri girilir.
3. Sipariş oluşturulur ve backend tarafında `Order` modeliyle saklanır.

### Kimlik Doğrulama (Auth)
- Backend, giriş yapan kullanıcılara bir JWT (JSON Web Token) döner.
- Bu token, frontend tarafında `header` üzerinden API isteklerine eklenir.
- `ProtectedRoute` bileşeni ile yetkisiz erişimler engellenir.

### Admin Paneli Yetenekleri
- **Ürün Yönetimi**: Ürün ekleme, düzenleme ve silme.
- **Kategori & Marka**: Sürükle-bırak destekli sıralama ve yönetim.
- **Sipariş Takibi**: Gelen siparişlerin durumunu güncelleme.
- **İstatistikler**: Dashboard üzerinde temel satış verileri.

---

## 6. Kurulum ve Çalıştırma

### Yerel Geliştirme (Local Development)

1. **Backend**:
   ```bash
   cd backend
   npm install
   # .env dosyasını oluşturun (PORT, MONGO_URI, JWT_SECRET vb.)
   npm run dev
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Admin**:
   ```bash
   cd admin
   npm install
   npm start
   ```

---

## 7. Gelecek Geliştirmeler İçin Notlar
- **SEO Geliştirmeleri**: Ürün sayfaları için dinamik meta etiketleri ve SSR (Server-Side Rendering) düşünülebilir.
- **Ödeme Entegrasyonu**: Şu anki yapı sipariş kaydı üzerine kuruludur; Iyzico veya Stripe gibi ödeme sistemleri entegre edilmelidir.
- **Medya Yönetimi**: Görseller şu an yerel sunucuda (`uploads/`) tutulmaktadır; AWS S3 veya Cloudinary geçişi ölçeklenebilirlik için önerilir.

---

*Hazırlayan: Antigravity AI*
