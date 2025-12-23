'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // Başarılı giriş - efekt başlat
      setIsExiting(true);
      // Efekt animasyonu için bekle (1 saniye)
      await new Promise(resolve => setTimeout(resolve, 800));
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Giriş yapılamadı. Email ve şifrenizi kontrol edin.');
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.loginPage} ${isExiting ? styles.exiting : ''}`}>
      <div className={styles.background}>
        <div className={styles.gradient1}></div>
        <div className={styles.gradient2}></div>
        <div className={styles.gradient3}></div>
      </div>

      <div className={styles.loginContainer}>
        <div className={`${styles.loginCard} ${isExiting ? styles.cardExiting : ''}`}>
          <div className={styles.loginHeader}>
            <div className={styles.logoContainer}>
              <div className={styles.logoIcon}>🎯</div>
              <h1>BaşarıYORUM</h1>
            </div>
            <p className={styles.subtitle}>Hoş geldiniz! Lütfen giriş yapın</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                <span className={styles.labelIcon}>📧</span>
                Email Adresi
              </label>
              <div className={styles.inputWrapper}>
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
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                <span className={styles.labelIcon}>🔒</span>
                Şifre
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={styles.input}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.passwordToggle}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {error && (
              <div className={styles.error}>
                <span className={styles.errorIcon}>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={styles.loginButton}
            >
              {loading ? (
                <>
                  <span className={styles.spinner}></span>
                  <span>Giriş yapılıyor...</span>
                </>
              ) : (
                <>
                  <span>Giriş Yap</span>
                  <span className={styles.buttonIcon}>→</span>
                </>
              )}
            </button>
          </form>

          <div className={styles.loginFooter}>
            <p>
              Hesabınız yok mu?{' '}
              <Link href="/register" className={styles.registerLink}>
                Kayıt Ol
              </Link>
            </p>
          </div>

          <div className={styles.decorativeElements}>
            <div className={styles.circle1}></div>
            <div className={styles.circle2}></div>
            <div className={styles.circle3}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

