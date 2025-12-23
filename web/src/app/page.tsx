import Card from '@/components/Card';
import styles from './page.module.css';

export default function Home() {
  const stats = [
    { label: 'Toplam Öğrenci', value: '1,234', icon: '👥', color: '#6366f1' },
    { label: 'Sınav Sayısı', value: '45', icon: '📝', color: '#8b5cf6' },
    { label: 'Ortalama Puan', value: '78.5', icon: '⭐', color: '#10b981' },
    { label: 'Aktif Öğretmen', value: '12', icon: '👨‍🏫', color: '#f59e0b' },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Dashboard</h1>
        <p>Deneme sınavı sonuçlarınızın genel görünümü</p>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <Card key={index} className={styles.statCard}>
            <div className={styles.statContent}>
              <div 
                className={styles.statIcon}
                style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
              >
                {stat.icon}
              </div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>{stat.label}</p>
                <h2 className={styles.statValue}>{stat.value}</h2>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className={styles.grid}>
        <Card className={styles.chartCard}>
          <h3>Son 5 Sınav Ortalamaları</h3>
          <div className={styles.chartPlaceholder}>
            <p>📊 Grafik buraya gelecek</p>
          </div>
        </Card>

        <Card className={styles.chartCard}>
          <h3>Ders Bazlı Başarı</h3>
          <div className={styles.chartPlaceholder}>
            <p>📈 Grafik buraya gelecek</p>
          </div>
        </Card>
      </div>

      <Card className={styles.recentCard}>
        <h3>Son Yüklenen Sınavlar</h3>
        <div className={styles.table}>
          <div className={styles.tableRow}>
            <span>TYT Deneme 1</span>
            <span>15 Aralık 2024</span>
            <span>234 öğrenci</span>
            <span className={styles.badge}>Başarılı</span>
          </div>
          <div className={styles.tableRow}>
            <span>AYT Deneme 2</span>
            <span>10 Aralık 2024</span>
            <span>198 öğrenci</span>
            <span className={styles.badge}>Başarılı</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

