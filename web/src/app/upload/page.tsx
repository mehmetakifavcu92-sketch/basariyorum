'use client';

import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import Card from '@/components/Card';
import Button from '@/components/Button';
import styles from './page.module.css';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [templateId, setTemplateId] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewData, setPreviewData] = useState<any[][]>([]);
  const [previewHeaders, setPreviewHeaders] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const templates = [
    { id: '1', name: 'Standart Format' },
    { id: '2', name: 'Özel Format 1' },
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || droppedFile.name.endsWith('.xlsx'))) {
      setFile(droppedFile);
      readExcelPreview(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      readExcelPreview(selectedFile);
    }
  };

  const readExcelPreview = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // İlk 10 satırı önizleme için al
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          header: 1, 
          defval: '',
          range: 10 // İlk 10 satır
        }) as any[][];
        
        if (jsonData.length > 0) {
          // İlk satır header olarak al
          const headers = jsonData[0] as string[];
          const rows = jsonData.slice(1).filter(row => row.some(cell => cell !== ''));
          
          setPreviewHeaders(headers);
          setPreviewData(rows.slice(0, 10)); // İlk 10 veri satırı
        }
      } catch (error) {
        console.error('Excel okuma hatası:', error);
        setPreviewData([]);
        setPreviewHeaders([]);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (templateId) {
        formData.append('templateId', templateId);
      }

      // Gerçek API çağrısı
      const institutionId = 'inst-1'; // TODO: Gerçek institution ID'yi al
      
      // Progress simülasyonu
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 5;
        });
      }, 100);
      
      const response = await fetch(
        `http://localhost:3001/v1/institutions/${institutionId}/exams/bulk-upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      
      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error('Yükleme başarısız');
      }

      const result = await response.json();
      setUploadProgress(100);

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setFile(null);
        alert(
          result.message ||
          `${result.data?.studentsProcessed || 0} öğrenci işlendi, ${result.data?.resultsCreated || 0} sonuç kaydedildi`
        );
      }, 500);
    } catch (error: any) {
      setIsUploading(false);
      setUploadProgress(0);
      alert(`Hata: ${error.message || 'Dosya yüklenirken bir hata oluştu'}`);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className={styles.uploadPage}>
      <div className={styles.header}>
        <h1>📤 Excel Dosyası Yükle</h1>
        <p>Optik okuyucu sonuçlarını Excel dosyası olarak yükleyin</p>
      </div>

      <div className={styles.content}>
        <Card className={styles.uploadCard}>
          <div
            className={`${styles.dropZone} ${isDragging ? styles.dragging : ''} ${file ? styles.hasFile : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            
            {!file ? (
              <>
                <div className={styles.dropIcon}>📄</div>
                <h3>Dosyayı buraya sürükleyin veya tıklayın</h3>
                <p>Excel dosyaları (.xlsx, .xls) desteklenmektedir</p>
              </>
            ) : (
              <>
                <div className={styles.fileInfo}>
                  <div className={styles.fileIcon}>📊</div>
                  <div className={styles.fileDetails}>
                    <h3>{file.name}</h3>
                    <p>{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    className={styles.removeBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setPreviewData([]);
                      setPreviewHeaders([]);
                    }}
                  >
                    ✕
                  </button>
                </div>
              </>
            )}
          </div>

          <div className={styles.templateSection}>
            <label className={styles.label}>Şablon Seçin (Opsiyonel)</label>
            <select
              className={styles.select}
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
            >
              <option value="">Şablon seçin...</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.actions}>
            <Button
              variant="primary"
              size="lg"
              onClick={handleUpload}
              disabled={!file || isUploading}
            >
              {isUploading ? 'Yükleniyor...' : '📤 Dosyayı Yükle'}
            </Button>
          </div>

          {isUploading && (
            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className={styles.progressText}>%{uploadProgress}</p>
            </div>
          )}
        </Card>

        {file && previewData.length > 0 && (
          <Card className={styles.previewCard}>
            <h3>📊 Dosya Önizleme</h3>
            <p className={styles.previewInfo}>
              İlk {previewData.length} satır gösteriliyor
            </p>
            <div className={styles.tableContainer}>
              <table className={styles.previewTable}>
                <thead>
                  <tr>
                    {previewHeaders.map((header, index) => (
                      <th key={index}>{header || `Kolon ${index + 1}`}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {previewHeaders.map((_, colIndex) => (
                        <td key={colIndex}>
                          {row[colIndex] !== undefined ? String(row[colIndex]) : ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        <Card className={styles.infoCard}>
          <h3>💡 Bilgilendirme</h3>
          <ul className={styles.infoList}>
            <li>Excel dosyası en fazla 10MB olabilir</li>
            <li>Dosya formatı .xlsx veya .xls olmalıdır</li>
            <li>Şablon kullanarak kolon eşleştirmesi yapabilirsiniz</li>
            <li>Yükleme işlemi tamamlandığında öğrenciler otomatik kaydedilir</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

