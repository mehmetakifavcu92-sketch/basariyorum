'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';
import styles from './page.module.css';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'admin' | 'teacher' | 'student'>('student');
  const [institutionId, setInstitutionId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validasyon
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      return;
    }

    if (!name.trim()) {
      setError('Ad Soyad gereklidir');
      return;
    }

    if (role === 'admin' && !institutionId.trim()) {
      setError('Kurum sahibi için kurum ID gereklidir');
      return;
    }

    setLoading(true);

    try {
      await register(
        email, 
        password, 
        name, 
        role,
        institutionId || undefined
      );
      router.push('/');
    } catch (err: any) {
      let errorMessage = 'Kayıt yapılamadı. Lütfen tekrar deneyin.';
      
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Bu email adresi zaten kullanılıyor.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Geçersiz email adresi.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Şifre çok zayıf. En az 6 karakter olmalıdır.';
      } else if (err.code === 'permission-denied' || err.message?.includes('permission') || err.message?.includes('insufficient')) {
        errorMessage = 'Firestore yazma izni yok. Lütfen Firebase Console\'da güvenlik kurallarını kontrol edin. Detaylar için FIRESTORE_SETUP.md dosyasına bakın.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      console.error('Kayıt hatası detayları:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.registerContainer}>
        <Card className={styles.registerCard}>
          <div className={styles.registerHeader}>
            <h1>🎯 BaşarıYORUM</h1>
            <p>Kayıt Ol</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.registerForm}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Ad Soyad</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Mehmet Yılmaz"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="role">Kullanıcı Tipi</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'admin' | 'teacher' | 'student')}
                className={styles.select}
              >
                <option value="admin">Kurum Sahibi</option>
                <option value="teacher">Öğretmen</option>
                <option value="student">Öğrenci</option>
              </select>
            </div>

            {role === 'admin' && (
              <div className={styles.formGroup}>
                <label htmlFor="institutionId">Kurum ID</label>
                <input
                  id="institutionId"
                  type="text"
                  value={institutionId}
                  onChange={(e) => setInstitutionId(e.target.value)}
                  placeholder="Kurum ID'sini girin"
                  required={role === 'admin'}
                  className={styles.input}
                />
                <small className={styles.helpText}>
                  Kurum ID'sini kurum yöneticinizden alabilirsiniz
                </small>
              </div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Şifre</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className={styles.input}
              />
              <small className={styles.helpText}>
                En az 6 karakter olmalıdır
              </small>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Şifre Tekrar</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className={styles.input}
              />
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <Button
              type="submit"
              disabled={loading}
              className={styles.registerButton}
            >
              {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
            </Button>
          </form>

          <div className={styles.registerFooter}>
            <p>Zaten hesabınız var mı? <Link href="/login">Giriş Yap</Link></p>
          </div>
        </Card>
      </div>
    </div>
  );
}

