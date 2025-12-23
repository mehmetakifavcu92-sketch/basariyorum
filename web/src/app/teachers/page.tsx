'use client';

import { useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import styles from './page.module.css';

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([
    {
      id: '1',
      name: 'Mehmet Öğretmen',
      email: 'mehmet@example.com',
      role: 'teacher',
      assignedSubjects: ['Matematik', 'Fizik'],
    },
    {
      id: '2',
      name: 'Ayşe Rehber',
      email: 'ayse@example.com',
      role: 'guidance',
      assignedSubjects: [],
    },
    {
      id: '3',
      name: 'Ali Öğretmen',
      email: 'ali@example.com',
      role: 'teacher',
      assignedSubjects: ['Türkçe', 'Edebiyat'],
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    role: 'teacher' as 'teacher' | 'guidance',
    assignedSubjects: [] as string[],
  });

  const allSubjects = ['Matematik', 'Türkçe', 'Fizik', 'Kimya', 'Biyoloji', 'Tarih', 'Coğrafya'];

  const toggleSubject = (subject: string) => {
    setNewTeacher({
      ...newTeacher,
      assignedSubjects: newTeacher.assignedSubjects.includes(subject)
        ? newTeacher.assignedSubjects.filter((s) => s !== subject)
        : [...newTeacher.assignedSubjects, subject],
    });
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Kurum Sahibi';
      case 'guidance':
        return 'Rehber Öğretmeni';
      case 'teacher':
        return 'Öğretmen';
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'var(--primary)';
      case 'guidance':
        return 'var(--secondary)';
      case 'teacher':
        return 'var(--success)';
      default:
        return 'var(--text-secondary)';
    }
  };

  return (
    <div className={styles.teachersPage}>
      <div className={styles.header}>
        <div>
          <h1>👨‍🏫 Öğretmen Yönetimi</h1>
          <p>Öğretmenleri ekleyin, düzenleyin ve yönetin</p>
        </div>
        <Button onClick={() => setShowModal(true)}>➕ Yeni Öğretmen</Button>
      </div>

      <div className={styles.teachersGrid}>
        {teachers.map((teacher) => (
          <Card key={teacher.id} className={styles.teacherCard}>
            <div className={styles.teacherHeader}>
              <div>
                <h3>{teacher.name}</h3>
                <p className={styles.teacherEmail}>{teacher.email}</p>
              </div>
              <span
                className={styles.roleBadge}
                style={{ backgroundColor: `${getRoleColor(teacher.role)}15`, color: getRoleColor(teacher.role) }}
              >
                {getRoleLabel(teacher.role)}
              </span>
            </div>

            {teacher.role === 'teacher' && teacher.assignedSubjects.length > 0 && (
              <div className={styles.subjectsSection}>
                <label className={styles.subjectsLabel}>Dersler:</label>
                <div className={styles.subjectsList}>
                  {teacher.assignedSubjects.map((subject) => (
                    <span key={subject} className={styles.subjectTag}>
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {teacher.role === 'guidance' && (
              <div className={styles.guidanceNote}>
                <span>ℹ️ Tüm dersleri görüntüleyebilir</span>
              </div>
            )}

            <div className={styles.teacherActions}>
              <Button variant="secondary" size="sm">
                ✏️ Düzenle
              </Button>
              <Button variant="danger" size="sm">
                🗑️ Sil
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Yeni Öğretmen Ekle</h2>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.formGroup}>
                <label>Ad Soyad</label>
                <input
                  type="text"
                  value={newTeacher.name}
                  onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                  placeholder="Örn: Mehmet Öğretmen"
                />
              </div>

              <div className={styles.formGroup}>
                <label>E-posta</label>
                <input
                  type="email"
                  value={newTeacher.email}
                  onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                  placeholder="ornek@email.com"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Rol</label>
                <select
                  value={newTeacher.role}
                  onChange={(e) =>
                    setNewTeacher({
                      ...newTeacher,
                      role: e.target.value as 'teacher' | 'guidance',
                      assignedSubjects: e.target.value === 'guidance' ? [] : newTeacher.assignedSubjects,
                    })
                  }
                >
                  <option value="teacher">Öğretmen</option>
                  <option value="guidance">Rehber Öğretmeni</option>
                </select>
              </div>

              {newTeacher.role === 'teacher' && (
                <div className={styles.formGroup}>
                  <label>Dersler (Birden fazla seçebilirsiniz)</label>
                  <div className={styles.subjectsGrid}>
                    {allSubjects.map((subject) => (
                      <button
                        key={subject}
                        type="button"
                        className={`${styles.subjectChip} ${
                          newTeacher.assignedSubjects.includes(subject) ? styles.active : ''
                        }`}
                        onClick={() => toggleSubject(subject)}
                      >
                        {subject}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className={styles.modalFooter}>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                İptal
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  // TODO: API çağrısı
                  alert('Öğretmen eklendi!');
                  setShowModal(false);
                  setNewTeacher({ name: '', email: '', role: 'teacher', assignedSubjects: [] });
                }}
              >
                Ekle
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

