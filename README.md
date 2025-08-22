# Randevu Sistemi - Özel Ders Platformu

Bu proje, öğrenciler ve öğretmenler arasında özel ders randevularının yönetimini sağlayan modern bir web uygulamasıdır.

## Özellikler

### Öğrenci Özellikleri
- Öğretmen profillerini görüntüleme
- Müsait zaman dilimlerini görme
- Randevu alma ve yönetme
- Tamamlanan seanslar için geri bildirim bırakma
- Randevu geçmişini görüntüleme

### Öğretmen Özellikleri
- Müsaitlik zamanlarını yönetme
- Profil bilgilerini düzenleme
- Randevuları görüntüleme
- Öğrenci geri bildirimlerini alma

### Yönetici Özellikleri
- Kullanıcı yönetimi
- Platform istatistiklerini görüntüleme
- Tüm randevuları izleme
- Geri bildirim ve puanları takip etme

## Teknolojiler

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **State Management**: React Context API

## Kurulum

1. Projeyi klonlayın:
```bash
git clone <repository-url>
cd randevu-sistem
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

4. Tarayıcınızda `http://localhost:5173` adresini açın

## Demo Hesapları

Uygulamayı test etmek için aşağıdaki demo hesaplarını kullanabilirsiniz:

- **Yönetici**: admin@school.edu (şifre: herhangi bir metin)
- **Öğretmen**: sarah@school.edu (şifre: herhangi bir metin)
- **Öğrenci**: john@student.edu (şifre: herhangi bir metin)

## Proje Yapısı

```
src/
├── components/          # React bileşenleri
│   ├── auth/           # Kimlik doğrulama bileşenleri
│   ├── dashboards/     # Dashboard bileşenleri
│   ├── booking/        # Randevu alma bileşenleri
│   ├── appointments/   # Randevu yönetimi
│   ├── availability/   # Müsaitlik yönetimi
│   └── profile/        # Profil yönetimi
├── contexts/           # React Context'leri
├── data/              # Mock veri
├── types/             # TypeScript tip tanımları
└── main.tsx           # Ana giriş noktası
```

## Katkıda Bulunma

1. Bu repository'yi fork edin
2. Yeni bir feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Bir Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
