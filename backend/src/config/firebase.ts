import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

if (!admin.apps.length) {
  try {
    // Service Account Key'i environment variable'dan al veya dosyadan oku
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    if (serviceAccountKey) {
      // JSON string olarak environment variable'da saklanıyorsa
      const serviceAccount = JSON.parse(serviceAccountKey);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      // Veya dosyadan oku (firebase-service-account.json)
      const serviceAccount = require('../../firebase-service-account.json');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
    
    console.log('✅ Firebase Admin SDK başarıyla yapılandırıldı');
  } catch (error) {
    console.error('❌ Firebase Admin SDK yapılandırma hatası:', error);
    throw error;
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();

// Firestore ayarları
db.settings({
  ignoreUndefinedProperties: true,
});

