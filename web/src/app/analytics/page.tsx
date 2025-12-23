'use client';

import { useState } from 'react';
import Card from '@/components/Card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import styles from './page.module.css';

const COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

export default function AnalyticsPage() {
  const [selectedView, setSelectedView] = useState<'subject' | 'topic' | 'student'>('subject');

  const subjectData = [
    { name: 'Matematik', ortalama: 78, enYuksek: 95, enDusuk: 45 },
    { name: 'Türkçe', ortalama: 82, enYuksek: 98, enDusuk: 52 },
    { name: 'Fizik', ortalama: 75, enYuksek: 92, enDusuk: 40 },
    { name: 'Kimya', ortalama: 70, enYuksek: 88, enDusuk: 38 },
    { name: 'Biyoloji', ortalama: 73, enYuksek: 90, enDusuk: 42 },
  ];

  const topicData = [
    { name: 'Fonksiyonlar', puan: 85 },
    { name: 'Limit', puan: 72 },
    { name: 'Türev', puan: 68 },
    { name: 'İntegral', puan: 75 },
    { name: 'Trigonometri', puan: 80 },
  ];

  const studentProgress = [
    { name: 'Sınav 1', puan: 65 },
    { name: 'Sınav 2', puan: 72 },
    { name: 'Sınav 3', puan: 78 },
    { name: 'Sınav 4', puan: 82 },
    { name: 'Sınav 5', puan: 85 },
  ];

  const distributionData = [
    { name: '90-100', value: 15 },
    { name: '80-89', value: 35 },
    { name: '70-79', value: 28 },
    { name: '60-69', value: 15 },
    { name: '0-59', value: 7 },
  ];

  return (
    <div className={styles.analyticsPage}>
      <div className={styles.header}>
        <h1>📉 Analizler ve Grafikler</h1>
        <p>Detaylı istatistikler ve görselleştirmeler</p>
      </div>

      <div className={styles.viewTabs}>
        <button
          className={`${styles.tab} ${selectedView === 'subject' ? styles.active : ''}`}
          onClick={() => setSelectedView('subject')}
        >
          Ders Bazlı
        </button>
        <button
          className={`${styles.tab} ${selectedView === 'topic' ? styles.active : ''}`}
          onClick={() => setSelectedView('topic')}
        >
          Konu Bazlı
        </button>
        <button
          className={`${styles.tab} ${selectedView === 'student' ? styles.active : ''}`}
          onClick={() => setSelectedView('student')}
        >
          Öğrenci İlerlemesi
        </button>
      </div>

      {selectedView === 'subject' && (
        <div className={styles.chartsGrid}>
          <Card className={styles.chartCard}>
            <h3>Ders Bazlı Ortalama Puanlar</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="ortalama" fill="#6366f1" name="Ortalama" />
                <Bar dataKey="enYuksek" fill="#10b981" name="En Yüksek" />
                <Bar dataKey="enDusuk" fill="#ef4444" name="En Düşük" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className={styles.chartCard}>
            <h3>Puan Dağılımı</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {selectedView === 'topic' && (
        <Card className={styles.chartCard}>
          <h3>Konu Bazlı Başarı Analizi</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topicData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="puan" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {selectedView === 'student' && (
        <Card className={styles.chartCard}>
          <h3>Öğrenci İlerleme Grafiği</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={studentProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="puan"
                stroke="#6366f1"
                strokeWidth={3}
                name="Puan"
                dot={{ fill: '#6366f1', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
            📊
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Toplam Sınav</p>
            <h2 className={styles.statValue}>45</h2>
          </div>
        </Card>
        <Card className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
            ⭐
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Genel Ortalama</p>
            <h2 className={styles.statValue}>76.5</h2>
          </div>
        </Card>
        <Card className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
            📈
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>En İyi Ders</p>
            <h2 className={styles.statValue}>Türkçe</h2>
          </div>
        </Card>
        <Card className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
            📉
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Geliştirilmeli</p>
            <h2 className={styles.statValue}>Kimya</h2>
          </div>
        </Card>
      </div>
    </div>
  );
}

