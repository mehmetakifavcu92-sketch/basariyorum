# Deneme Sonucum - Kurum Bazlı Sınav Takip Sistemi

Kurumların deneme sınavı sonuçlarını Excel dosyalarından toplu olarak yükleyip, öğretmenlerin öğrenci sonuçlarını görüntüleyebildiği web ve mobil uygulama.

## Proje Yapısı

```
denemesonucum/
├── backend/          # API servisi (Node.js/Express)
├── web/              # Web uygulaması (Next.js)
├── mobile/           # Mobil uygulama (React Native)
└── shared/           # Ortak TypeScript tipleri ve utilities
```

## Özellikler

### Kurum Sahibi
- Excel dosyası yükleme (optik okuyucu sonuçları)
- Excel şablon tanımlama
- Öğretmen yönetimi (ekleme, düzenleme, silme)
- Tüm öğrencileri ve sonuçları görüntüleme
- Analiz ve raporlama

### Öğretmen
- Tüm öğrencileri görüntüleme
- Varsayılan olarak kendi derslerinin sonuçlarını görme
- İsteğe bağlı diğer dersleri de görüntüleme
- Analiz ve grafikler

### Rehber Öğretmeni
- Tüm öğrencileri görüntüleme
- Tüm derslerin sonuçlarını görüntüleme (kısıtlama yok)

## Teknolojiler

- **Backend**: Node.js, Express, TypeScript
- **Web**: Next.js, React, TypeScript, Recharts
- **Mobile**: React Native, TypeScript
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **Storage**: Firebase Storage
- **Excel**: xlsx library

## Firebase Kurulumu

### 1. Firebase Console'da Proje Oluşturma

1. [Firebase Console](https://console.firebase.google.com/)'a gidin
2. Yeni proje oluşturun
3. **Firestore Database**'i etkinleştirin (Test mode veya Production mode)
4. **Storage**'ı etkinleştirin
5. **Authentication**'ı etkinleştirin (Email/Password veya istediğiniz yöntem)

### 2. Web App Yapılandırması

1. Firebase Console > Project Settings > General > Your apps
2. Web uygulaması ekleyin (</> ikonu)
3. App nickname verin ve kaydedin
4. Config değerlerini kopyalayın

### 3. Service Account Key (Backend için)

1. Firebase Console > Project Settings > Service Accounts
2. "Generate New Private Key" butonuna tıklayın
3. JSON dosyasını indirin

### 4. Environment Değişkenlerini Ayarlama

**Backend için (`backend/.env`):**
```env
PORT=3001
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}
```

**Alternatif:** `firebase-service-account.json` dosyasını `backend/` klasörüne koyabilirsiniz.

**Web için (`web/.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Kurulum

```bash
# Tüm bağımlılıkları yükle
npm run install:all

# Backend bağımlılıklarını yükle
cd backend && npm install

# Web bağımlılıklarını yükle
cd ../web && npm install

# Backend'i başlat
cd ../backend && npm run dev

# Web'i başlat (yeni terminal)
cd web && npm run dev
```

## Firestore Veritabanı Yapısı

```
institutions/
  {institutionId}/
    teachers/
      {teacherId}
    students/
      {studentId}
    examResults/
      {examResultId}
    examTemplates/
      {templateId}
```

## API Yapısı

```
v1/institutions/{institutionId}
  ├── /teachers
  ├── /students
  ├── /exams/bulk-upload
  ├── /exams/templates
  └── /exams/results
```

## Geliştirme

Proje monorepo yapısında çalışmaktadır. Her modül kendi package.json'ına sahiptir.

