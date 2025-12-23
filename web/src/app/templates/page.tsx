'use client';

import { useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import styles from './page.module.css';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([
    {
      id: '1',
      name: 'Standart Format',
      columns: 8,
      createdAt: '15 Aralık 2024',
    },
    {
      id: '2',
      name: 'Özel Format 1',
      columns: 12,
      createdAt: '10 Aralık 2024',
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    mappings: [{ column: 'A', field: 'studentName', subject: '', topic: '' }],
  });

  const addMapping = () => {
    const nextColumn = String.fromCharCode(65 + newTemplate.mappings.length);
    setNewTemplate({
      ...newTemplate,
      mappings: [
        ...newTemplate.mappings,
        { column: nextColumn, field: '', subject: '', topic: '' },
      ],
    });
  };

  const removeMapping = (index: number) => {
    setNewTemplate({
      ...newTemplate,
      mappings: newTemplate.mappings.filter((_, i) => i !== index),
    });
  };

  return (
    <div className={styles.templatesPage}>
      <div className={styles.header}>
        <div>
          <h1>📋 Excel Şablonları</h1>
          <p>Excel dosyalarınızın kolon eşleştirmelerini tanımlayın</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          ➕ Yeni Şablon
        </Button>
      </div>

      <div className={styles.templatesGrid}>
        {templates.map((template) => (
          <Card key={template.id} className={styles.templateCard}>
            <div className={styles.templateHeader}>
              <h3>{template.name}</h3>
              <div className={styles.templateActions}>
                <button className={styles.iconBtn}>✏️</button>
                <button className={styles.iconBtn}>🗑️</button>
              </div>
            </div>
            <div className={styles.templateInfo}>
              <span>📊 {template.columns} Kolon</span>
              <span>📅 {template.createdAt}</span>
            </div>
            <Button variant="secondary" size="sm" className={styles.viewBtn}>
              Detayları Gör
            </Button>
          </Card>
        ))}
      </div>

      {showCreateModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Yeni Şablon Oluştur</h2>
              <button
                className={styles.closeBtn}
                onClick={() => setShowCreateModal(false)}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.formGroup}>
                <label>Şablon Adı</label>
                <input
                  type="text"
                  value={newTemplate.name}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, name: e.target.value })
                  }
                  placeholder="Örn: Standart Format"
                />
              </div>

              <div className={styles.mappingsSection}>
                <div className={styles.mappingsHeader}>
                  <h3>Kolon Eşleştirmeleri</h3>
                  <Button size="sm" onClick={addMapping}>
                    ➕ Kolon Ekle
                  </Button>
                </div>

                <div className={styles.mappingsList}>
                  {newTemplate.mappings.map((mapping, index) => (
                    <div key={index} className={styles.mappingRow}>
                      <div className={styles.mappingColumn}>
                        <label>Kolon</label>
                        <input
                          type="text"
                          value={mapping.column}
                          readOnly
                          className={styles.columnInput}
                        />
                      </div>
                      <div className={styles.mappingField}>
                        <label>Alan</label>
                        <select
                          value={mapping.field}
                          onChange={(e) => {
                            const updated = [...newTemplate.mappings];
                            updated[index].field = e.target.value;
                            setNewTemplate({ ...newTemplate, mappings: updated });
                          }}
                        >
                          <option value="">Seçin...</option>
                          <option value="studentName">Öğrenci Adı</option>
                          <option value="studentNumber">Öğrenci No</option>
                          <option value="examDate">Sınav Tarihi</option>
                          <option value="examName">Sınav Adı</option>
                          <option value="subjectScore">Ders Puanı</option>
                          <option value="topicScore">Konu Puanı</option>
                        </select>
                      </div>
                      {(mapping.field === 'subjectScore' ||
                        mapping.field === 'topicScore') && (
                        <>
                          <div className={styles.mappingSubject}>
                            <label>Ders</label>
                            <input
                              type="text"
                              value={mapping.subject}
                              onChange={(e) => {
                                const updated = [...newTemplate.mappings];
                                updated[index].subject = e.target.value;
                                setNewTemplate({
                                  ...newTemplate,
                                  mappings: updated,
                                });
                              }}
                              placeholder="Matematik"
                            />
                          </div>
                          {mapping.field === 'topicScore' && (
                            <div className={styles.mappingTopic}>
                              <label>Konu</label>
                              <input
                                type="text"
                                value={mapping.topic}
                                onChange={(e) => {
                                  const updated = [...newTemplate.mappings];
                                  updated[index].topic = e.target.value;
                                  setNewTemplate({
                                    ...newTemplate,
                                    mappings: updated,
                                  });
                                }}
                                placeholder="Fonksiyonlar"
                              />
                            </div>
                          )}
                        </>
                      )}
                      <button
                        className={styles.removeMappingBtn}
                        onClick={() => removeMapping(index)}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                İptal
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  // TODO: API çağrısı
                  alert('Şablon oluşturuldu!');
                  setShowCreateModal(false);
                }}
              >
                Oluştur
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

