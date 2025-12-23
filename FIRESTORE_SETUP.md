# Firestore Güvenlik Kuralları Kurulumu

"Missing or insufficient permissions" hatası alıyorsanız, Firebase Console'da Firestore güvenlik kurallarını ayarlamanız gerekiyor.

## Adımlar:

### 1. Firebase Console'a Gidin
- [Firebase Console](https://console.firebase.google.com/)'a gidin
- Projenizi seçin

### 2. Firestore Database'e Gidin
- Sol menüden **Firestore Database**'e tıklayın
- **Rules** sekmesine tıklayın

### 3. Güvenlik Kurallarını Yapıştırın

Aşağıdaki kuralları yapıştırın ve **Publish** butonuna tıklayın:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users koleksiyonu - kullanıcılar kendi dokümanlarını okuyup yazabilir
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
    
    // Institutions koleksiyonu
    match /institutions/{institutionId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
      
      // Teachers alt koleksiyonu
      match /teachers/{teacherId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null;
      }
      
      // Students alt koleksiyonu
      match /students/{studentId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null;
      }
      
      // ExamResults alt koleksiyonu
      match /examResults/{examResultId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null;
      }
      
      // ExamTemplates alt koleksiyonu
      match /examTemplates/{templateId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null;
      }
    }
  }
}
```

### 4. Test Modu (Geliştirme için - Dikkatli Kullanın!)

Eğer hızlı test etmek istiyorsanız, geçici olarak test modunu kullanabilirsiniz:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**⚠️ UYARI:** Bu kurallar sadece geliştirme için kullanılmalıdır. Production'da daha sıkı kurallar kullanın!

### 5. Kuralları Yayınlayın
- **Publish** butonuna tıklayın
- Kuralların aktif olması birkaç saniye sürebilir

## Sorun Giderme

### Hala "permission denied" hatası alıyorsanız:

1. **Authentication durumunu kontrol edin:**
   - Firebase Console > Authentication
   - Kullanıcının kayıtlı olduğundan emin olun

2. **Kuralların yayınlandığından emin olun:**
   - Rules sekmesinde "Published" yazısını görüyor olmalısınız

3. **Tarayıcı cache'ini temizleyin:**
   - Hard refresh yapın (Ctrl+Shift+R veya Cmd+Shift+R)

4. **Konsol hatalarını kontrol edin:**
   - Browser console'da tam hata mesajını kontrol edin

## Production Güvenlik Kuralları

Production ortamında daha sıkı kurallar kullanmanız önerilir:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function: kullanıcı bilgilerini al
    function getUserData() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }
    
    // Users - sadece kendi dokümanını okuyup yazabilir
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
      allow delete: if false; // Kullanıcılar kendi hesaplarını silemez
    }
    
    // Institutions - role bazlı erişim
    match /institutions/{institutionId} {
      allow read: if request.auth != null;
      
      // Sadece admin yazabilir
      allow write: if request.auth != null && 
        getUserData().role == 'admin' && 
        getUserData().institutionId == institutionId;
      
      // Alt koleksiyonlar için benzer kurallar...
    }
  }
}
```

