'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styles from './Layout.module.css';
import Button from '@/components/Button';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  // Login ve register sayfalarında layout gösterme
  if (pathname === '/login' || pathname === '/register') {
    return <>{children}</>;
  }

  // Kullanıcı yoksa ve loading değilse login'e yönlendir
  if (!loading && !user) {
    router.push('/login');
    return null;
  }

  const navItems = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/upload', label: 'Excel Yükle', icon: '📤' },
    { href: '/templates', label: 'Şablonlar', icon: '📋' },
    { href: '/results', label: 'Sonuçlar', icon: '📈' },
    { href: '/analytics', label: 'Analizler', icon: '📉' },
    { href: '/teachers', label: 'Öğretmenler', icon: '👨‍🏫' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Çıkış yapılamadı:', error);
    }
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'Kurum Sahibi';
      case 'teacher':
        return 'Öğretmen';
      case 'student':
        return 'Öğrenci';
      default:
        return 'Kullanıcı';
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <h1>🎯 BaşarıYORUM</h1>
        </div>
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${
                pathname === item.href ? styles.active : ''
              }`}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className={styles.footer}>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user?.name || user?.email}</p>
            <p className={styles.userRole}>{getRoleLabel(user?.role)}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="secondary"
            size="sm"
            className={styles.logoutButton}
          >
            Çıkış Yap
          </Button>
        </div>
      </aside>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}

