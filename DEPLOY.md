# BaşarıYORUM - Deploy Rehberi

Bu rehber, BaşarıYORUM projesini production ortamına deploy etmek için adım adım talimatlar içerir.

## 📋 Deploy Öncesi Hazırlık

### 1. Environment Variables Hazırlama

#### Backend için (.env)
```env
PORT=3001
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}
NODE_ENV=production
```

#### Web için (.env.local veya .env.production)
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

---

## 🚀 Seçenek 1: Vercel (Web) + Railway/Render (Backend) - ÖNERİLEN

### Web (Next.js) - Vercel'e Deploy

#### Adım 1: Vercel Hesabı Oluştur
1. [Vercel.com](https://vercel.com) adresine git
2. GitHub hesabınla giriş yap

#### Adım 2: Projeyi Vercel'e Bağla
1. Vercel Dashboard > "Add New Project"
2. GitHub repository'ni seç
3. **Root Directory:** `web` olarak ayarla
4. Framework Preset: **Next.js** seç

#### Adım 3: Environment Variables Ekle
Vercel Dashboard > Project Settings > Environment Variables:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

#### Adım 4: Build Ayarları
- Build Command: `npm run build` (otomatik algılanır)
- Output Directory: `.next` (otomatik algılanır)
- Install Command: `npm install`

#### Adım 5: Deploy
- "Deploy" butonuna tıkla
- Deploy tamamlandığında URL alacaksın (örn: `basariyorum.vercel.app`)

---

### Backend (Node.js) - Railway'e Deploy

#### Adım 1: Railway Hesabı Oluştur
1. [Railway.app](https://railway.app) adresine git
2. GitHub hesabınla giriş yap

#### Adım 2: Yeni Proje Oluştur
1. "New Project" > "Deploy from GitHub repo"
2. Repository'ni seç

#### Adım 3: Root Directory Ayarla
1. Settings > Root Directory: `backend` olarak ayarla

#### Adım 4: Environment Variables Ekle
Railway Dashboard > Variables:
```
PORT=3001
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
NODE_ENV=production
```

#### Adım 5: Build & Start Commands
Settings > Deploy:
- Build Command: `npm install && npm run build`
- Start Command: `npm start`

#### Adım 6: Deploy
- Otomatik deploy başlar
- Deploy tamamlandığında URL alacaksın (örn: `basariyorum-production.up.railway.app`)

#### Adım 7: Web'deki API URL'ini Güncelle
Vercel'deki environment variable'ı güncelle:
```
NEXT_PUBLIC_API_URL=https://basariyorum-production.up.railway.app
```

---

## 🔥 Seçenek 2: Firebase Hosting (Web) + Cloud Run (Backend)

### Web - Firebase Hosting'e Deploy

#### Adım 1: Firebase CLI Kurulumu
```bash
npm install -g firebase-tools
firebase login
```

#### Adım 2: Firebase Projesini Başlat
```bash
cd web
firebase init hosting
```

Seçenekler:
- Use an existing project: Projeni seç
- Public directory: `out` (Next.js static export için)
- Configure as single-page app: **No**
- Set up automatic builds: **No**

#### Adım 3: Next.js Static Export Ayarla
`web/next.config.js` dosyasına ekle:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@denemesonucum/shared'],
  output: 'export', // Static export için
  images: {
    unoptimized: true, // Static export için
  },
}
```

#### Adım 4: Build ve Deploy
```bash
cd web
npm run build
firebase deploy --only hosting
```

---

### Backend - Google Cloud Run'a Deploy

#### Adım 1: Dockerfile Oluştur
`backend/Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

#### Adım 2: .dockerignore Oluştur
`backend/.dockerignore`:
```
node_modules
dist
.env
.git
```

#### Adım 3: Cloud Run'a Deploy
```bash
# Google Cloud CLI kurulumu gerekli
gcloud builds submit --tag gcr.io/PROJECT-ID/backend
gcloud run deploy backend --image gcr.io/PROJECT-ID/backend --platform managed
```

---

## 📱 Seçenek 3: Render (Hem Web Hem Backend)

### Backend - Render'e Deploy

#### Adım 1: Render Hesabı Oluştur
1. [Render.com](https://render.com) adresine git
2. GitHub hesabınla giriş yap

#### Adım 2: Yeni Web Service Oluştur
1. "New" > "Web Service"
2. GitHub repository'ni bağla
3. Ayarlar:
   - **Name:** `basariyorum-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

#### Adım 3: Environment Variables
```
PORT=3001
FIREBASE_SERVICE_ACCOUNT_KEY=...
NODE_ENV=production
```

#### Adım 4: Deploy
- "Create Web Service" butonuna tıkla
- Deploy otomatik başlar

### Web - Render'e Deploy

#### Adım 1: Yeni Static Site Oluştur
1. "New" > "Static Site"
2. GitHub repository'ni bağla
3. Ayarlar:
   - **Name:** `basariyorum-web`
   - **Root Directory:** `web`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `out` (veya `.next`)

#### Adım 2: Environment Variables
```
NEXT_PUBLIC_API_URL=https://basariyorum-backend.onrender.com
NEXT_PUBLIC_FIREBASE_API_KEY=...
# ... diğer Firebase değişkenleri
```

---

## 🔐 Güvenlik Kontrol Listesi

### Deploy Öncesi:
- [ ] `.env` dosyaları `.gitignore`'da
- [ ] Firebase güvenlik kuralları ayarlandı
- [ ] CORS ayarları production URL'lerine göre güncellendi
- [ ] API rate limiting aktif
- [ ] HTTPS zorunlu
- [ ] Environment variables doğru ayarlandı

### Backend için:
- [ ] `NODE_ENV=production` ayarlandı
- [ ] Error logging aktif
- [ ] Health check endpoint çalışıyor (`/health`)

### Web için:
- [ ] `NEXT_PUBLIC_API_URL` doğru backend URL'ini gösteriyor
- [ ] Firebase config doğru
- [ ] Build hatasız tamamlanıyor

---

## 🧪 Deploy Sonrası Test

### 1. Backend Test
```bash
curl https://your-backend-url.com/health
```

### 2. Web Test
- Ana sayfa yükleniyor mu?
- Login sayfası çalışıyor mu?
- API çağrıları çalışıyor mu? (Browser Console'da kontrol et)

### 3. Firebase Test
- Authentication çalışıyor mu?
- Firestore yazma/okuma çalışıyor mu?
- Storage çalışıyor mu?

---

## 📊 Monitoring ve Logging

### Vercel Analytics
- Vercel Dashboard > Analytics
- Otomatik olarak aktif

### Railway Logs
- Railway Dashboard > Deployments > View Logs

### Firebase Console
- [Firebase Console](https://console.firebase.google.com)
- Authentication, Firestore, Storage kullanımını takip et

---

## 🔄 Güncelleme Süreci

### Web Güncelleme
1. GitHub'a push yap
2. Vercel/Render otomatik deploy eder
3. Deploy tamamlanınca yeni versiyon canlıda

### Backend Güncelleme
1. GitHub'a push yap
2. Railway/Render otomatik deploy eder
3. Deploy tamamlanınca yeni versiyon canlıda

---

## 🆘 Sorun Giderme

### Build Hatası
- Environment variables kontrol et
- `npm install` hatasız çalışıyor mu?
- TypeScript hataları var mı? (`npm run build`)

### API Bağlantı Hatası
- `NEXT_PUBLIC_API_URL` doğru mu?
- CORS ayarları kontrol et
- Backend logları kontrol et

### Firebase Hatası
- Firebase config doğru mu?
- Firestore güvenlik kuralları ayarlandı mı?
- Service account key doğru mu?

---

## 📝 Örnek Deploy Komutları

### Vercel (CLI ile)
```bash
cd web
npm install -g vercel
vercel login
vercel --prod
```

### Railway (CLI ile)
```bash
npm install -g @railway/cli
railway login
cd backend
railway link
railway up
```

### Firebase Hosting
```bash
cd web
firebase deploy --only hosting
```

---

## 🎯 Hızlı Başlangıç (Vercel + Railway)

1. **Web için:**
   - Vercel.com > New Project > GitHub repo seç
   - Root Directory: `web`
   - Environment variables ekle
   - Deploy

2. **Backend için:**
   - Railway.app > New Project > GitHub repo seç
   - Root Directory: `backend`
   - Environment variables ekle
   - Deploy

3. **API URL'ini güncelle:**
   - Vercel'de `NEXT_PUBLIC_API_URL`'i Railway URL'i ile güncelle
   - Redeploy

**Toplam süre: ~15-20 dakika** ⚡

---

## 📞 Destek

Sorun yaşarsan:
1. Build loglarını kontrol et
2. Environment variables'ı kontrol et
3. Firebase Console'da hataları kontrol et
4. Browser Console'da hataları kontrol et

