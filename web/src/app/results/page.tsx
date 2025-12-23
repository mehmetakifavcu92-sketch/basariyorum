'use client';

import { useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import styles from './page.module.css';

export default function ResultsPage() {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Matematik', 'Türkçe']);
  const [searchTerm, setSearchTerm] = useState('');

  const subjects = ['Matematik', 'Türkçe', 'Fizik', 'Kimya', 'Biyoloji', 'Tarih', 'Coğrafya'];

  const results = [
    {
      id: '1',
      studentName: 'Ahmet Yılmaz',
      studentNumber: '2024001',
      examName: 'TYT Deneme 1',
      examDate: '15 Aralık 2024',
      scores: [
        { subject: 'Matematik', score: 85 },
        { subject: 'Türkçe', score: 92 },
        { subject: 'Fizik', score: 78 },
      ],
    },
    {
      id: '2',
      studentName: 'Ayşe Demir',
      studentNumber: '2024002',
      examName: 'TYT Deneme 1',
      examDate: '15 Aralık 2024',
      scores: [
        { subject: 'Matematik', score: 90 },
        { subject: 'Türkçe', score: 88 },
        { subject: 'Fizik', score: 85 },
      ],
    },
  ];

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  return (
    <div className={styles.resultsPage}>
      <div className={styles.header}>
        <h1>📈 Sınav Sonuçları</h1>
        <p>Öğrenci sınav sonuçlarını görüntüleyin ve filtreleyin</p>
      </div>

      <div className={styles.filters}>
        <Card className={styles.filterCard}>
          <div className={styles.searchSection}>
            <input
              type="text"
              placeholder="🔍 Öğrenci adı veya numara ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.subjectsSection}>
            <label className={styles.filterLabel}>Dersler</label>
            <div className={styles.subjectsGrid}>
              {subjects.map((subject) => (
                <button
                  key={subject}
                  className={`${styles.subjectChip} ${
                    selectedSubjects.includes(subject) ? styles.active : ''
                  }`}
                  onClick={() => toggleSubject(subject)}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className={styles.resultsList}>
        {results.map((result) => (
          <Card key={result.id} className={styles.resultCard}>
            <div className={styles.resultHeader}>
              <div>
                <h3>{result.studentName}</h3>
                <p className={styles.studentNumber}>#{result.studentNumber}</p>
              </div>
              <div className={styles.examInfo}>
                <span className={styles.examName}>{result.examName}</span>
                <span className={styles.examDate}>{result.examDate}</span>
              </div>
            </div>

            <div className={styles.scoresGrid}>
              {result.scores
                .filter((score) => selectedSubjects.includes(score.subject))
                .map((score, index) => (
                  <div key={index} className={styles.scoreItem}>
                    <span className={styles.scoreSubject}>{score.subject}</span>
                    <div className={styles.scoreBar}>
                      <div
                        className={styles.scoreFill}
                        style={{
                          width: `${score.score}%`,
                          backgroundColor:
                            score.score >= 80
                              ? 'var(--success)'
                              : score.score >= 60
                              ? 'var(--warning)'
                              : 'var(--danger)',
                        }}
                      />
                    </div>
                    <span className={styles.scoreValue}>{score.score}</span>
                  </div>
                ))}
            </div>

            <div className={styles.resultFooter}>
              <div className={styles.averageScore}>
                <span>Ortalama:</span>
                <strong>
                  {Math.round(
                    result.scores
                      .filter((s) => selectedSubjects.includes(s.subject))
                      .reduce((sum, s) => sum + s.score, 0) /
                      result.scores.filter((s) =>
                        selectedSubjects.includes(s.subject)
                      ).length
                  )}
                </strong>
              </div>
              <Button variant="secondary" size="sm">
                Detayları Gör
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

