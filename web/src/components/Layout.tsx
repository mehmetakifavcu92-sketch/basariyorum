'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/upload', label: 'Excel Yükle', icon: '📤' },
    { href: '/templates', label: 'Şablonlar', icon: '📋' },
    { href: '/results', label: 'Sonuçlar', icon: '📈' },
    { href: '/analytics', label: 'Analizler', icon: '📉' },
    { href: '/teachers', label: 'Öğretmenler', icon: '👨‍🏫' },
  ];

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <h1>🎓 Deneme Sonucum</h1>
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
          <p>Kurum: Örnek Kurum</p>
        </div>
      </aside>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}

