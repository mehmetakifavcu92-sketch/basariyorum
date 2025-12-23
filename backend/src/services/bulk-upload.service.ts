import * as XLSX from 'xlsx';
import { Student, ExamResult, ExcelTemplate, ExcelColumnMapping } from '../types';
import { studentService, examResultService, examTemplateService } from './firestore.service';

export interface BulkUploadResult {
  studentsProcessed: number;
  resultsCreated: number;
  errors: string[];
}

class BulkUploadService {
  // Geçici olarak işlenen öğrencileri takip etmek için (duplicate kontrolü)
  private static students: Map<string, Student> = new Map();

  async processExcelFile(
    institutionId: string,
    filePath: string,
    templateId?: string
  ): Promise<BulkUploadResult> {
    try {
      // Excel dosyasını oku
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // İlk satırı header olarak al
      const headerRow = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' })[0] as any[];
      const dataRows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '', range: 2 }) as any[][];
      
      // Varsayılan template mapping (şablon yoksa)
      const defaultMappings: ExcelColumnMapping[] = this.getDefaultMappings(headerRow);
      
      // Template varsa yükle
      let mappings = defaultMappings;
      if (templateId) {
        const template = await examTemplateService.get(institutionId, templateId);
        if (template) {
          mappings = template.mappings;
        }
      }
      
      const result: BulkUploadResult = {
        studentsProcessed: 0,
        resultsCreated: 0,
        errors: [],
      };
      
      // Her satırı işle
      for (let i = 0; i < dataRows.length; i++) {
        const row = dataRows[i];
        
        // Boş satırları atla
        if (!row || row.every((cell: any) => !cell || cell === '')) {
          continue;
        }
        
        try {
          // Öğrenci bilgilerini çıkar
          const studentData = this.mapExcelRowToStudent(row, mappings);
          
          if (!studentData.name && !studentData.studentNumber) {
            result.errors.push(`Satır ${i + 2}: Öğrenci adı veya numarası bulunamadı`);
            continue;
          }
          
          // Öğrenciyi bul veya oluştur
          const studentNumber = studentData.studentNumber || `NUM-${Date.now()}-${i}`;
          const studentName = studentData.name || 'İsimsiz';
          
          const student = await studentService.getOrCreate(
            institutionId,
            studentNumber,
            studentName
          );
          
          if (!BulkUploadService.students.has(student.id)) {
            BulkUploadService.students.set(student.id, student);
            result.studentsProcessed++;
          }
          
          // Sınav sonucunu oluştur
          const examResultData = this.mapExcelRowToExamResult(row, mappings, student.id, institutionId);
          
          if (examResultData.scores && examResultData.scores.length > 0) {
            await examResultService.create(institutionId, {
              studentId: student.id,
              examDate: examResultData.examDate || new Date(),
              examName: examResultData.examName || 'Deneme Sınavı',
              scores: examResultData.scores || [],
            });
            
            result.resultsCreated++;
          }
        } catch (error: any) {
          result.errors.push(`Satır ${i + 2}: ${error.message || 'Bilinmeyen hata'}`);
        }
      }
      
      return result;
    } catch (error: any) {
      throw new Error(`Excel dosyası okunamadı: ${error.message}`);
    }
  }
  
  private getDefaultMappings(headerRow: any[]): ExcelColumnMapping[] {
    const mappings: ExcelColumnMapping[] = [];
    
    // Header satırından otomatik mapping yap
    headerRow.forEach((header, index) => {
      const column = this.indexToColumn(index);
      const headerStr = String(header || '').toLowerCase().trim();
      
      if (headerStr.includes('ad') || headerStr.includes('isim') || headerStr.includes('name')) {
        mappings.push({ column, field: 'studentName' });
      } else if (headerStr.includes('numara') || headerStr.includes('no') || headerStr.includes('num')) {
        mappings.push({ column, field: 'studentNumber' });
      } else if (headerStr.includes('tarih') || headerStr.includes('date')) {
        mappings.push({ column, field: 'examDate' });
      } else if (headerStr.includes('sınav') || headerStr.includes('exam')) {
        mappings.push({ column, field: 'examName' });
      } else if (headerStr.includes('matematik') || headerStr.includes('math')) {
        mappings.push({ column, field: 'subjectScore', subject: 'Matematik' });
      } else if (headerStr.includes('türkçe') || headerStr.includes('turkce') || headerStr.includes('turkish')) {
        mappings.push({ column, field: 'subjectScore', subject: 'Türkçe' });
      } else if (headerStr.includes('fizik') || headerStr.includes('physics')) {
        mappings.push({ column, field: 'subjectScore', subject: 'Fizik' });
      } else if (headerStr.includes('kimya') || headerStr.includes('chemistry')) {
        mappings.push({ column, field: 'subjectScore', subject: 'Kimya' });
      } else if (headerStr.includes('biyoloji') || headerStr.includes('biology')) {
        mappings.push({ column, field: 'subjectScore', subject: 'Biyoloji' });
      } else if (headerStr.includes('tarih') && !headerStr.includes('sınav')) {
        mappings.push({ column, field: 'subjectScore', subject: 'Tarih' });
      } else if (headerStr.includes('coğrafya') || headerStr.includes('geography')) {
        mappings.push({ column, field: 'subjectScore', subject: 'Coğrafya' });
      }
    });
    
    // Eğer hiç mapping bulunamadıysa, varsayılan mapping kullan
    if (mappings.length === 0) {
      mappings.push(
        { column: 'A', field: 'studentName' },
        { column: 'B', field: 'studentNumber' },
        { column: 'C', field: 'subjectScore', subject: 'Matematik' },
        { column: 'D', field: 'subjectScore', subject: 'Türkçe' },
      );
    }
    
    return mappings;
  }
  
  private indexToColumn(index: number): string {
    // 0 -> A, 1 -> B, 25 -> Z, 26 -> AA, etc.
    let column = '';
    index++;
    while (index > 0) {
      const remainder = (index - 1) % 26;
      column = String.fromCharCode(65 + remainder) + column;
      index = Math.floor((index - 1) / 26);
    }
    return column;
  }
  
  private mapExcelRowToStudent(
    row: any[],
    mappings: ExcelColumnMapping[]
  ): Partial<Student> {
    const student: Partial<Student> = {};
    
    for (const mapping of mappings) {
      const columnIndex = this.columnToIndex(mapping.column);
      const value = row[columnIndex];
      
      if (value === undefined || value === null || value === '') {
        continue;
      }
      
      switch (mapping.field) {
        case 'studentName':
          student.name = String(value).trim();
          break;
        case 'studentNumber':
          student.studentNumber = String(value).trim();
          break;
      }
    }
    
    return student;
  }
  
  private mapExcelRowToExamResult(
    row: any[],
    mappings: ExcelColumnMapping[],
    studentId: string,
    institutionId: string
  ): Partial<ExamResult> {
    const result: Partial<ExamResult> = {
      studentId,
      institutionId,
      scores: [],
    };
    
    // Subject score'ları topla
    const subjectScores: { [subject: string]: any } = {};
    
    for (const mapping of mappings) {
      const columnIndex = this.columnToIndex(mapping.column);
      const value = row[columnIndex];
      
      if (value === undefined || value === null || value === '') {
        continue;
      }
      
      if (mapping.field === 'subjectScore' && mapping.subject) {
        if (!subjectScores[mapping.subject]) {
          subjectScores[mapping.subject] = {
            subject: mapping.subject,
            score: 0,
            topics: [],
          };
        }
        const numValue = typeof value === 'number' ? value : parseFloat(String(value));
        if (!isNaN(numValue)) {
          subjectScores[mapping.subject].score = numValue;
        }
      }
      
      if (mapping.field === 'topicScore' && mapping.subject && mapping.topic) {
        if (!subjectScores[mapping.subject]) {
          subjectScores[mapping.subject] = {
            subject: mapping.subject,
            score: 0,
            topics: [],
          };
        }
        const numValue = typeof value === 'number' ? value : parseFloat(String(value));
        if (!isNaN(numValue)) {
          subjectScores[mapping.subject].topics.push({
            topic: mapping.topic,
            score: numValue,
          });
        }
      }
      
      if (mapping.field === 'examDate') {
        const dateValue = value instanceof Date ? value : new Date(value);
        if (!isNaN(dateValue.getTime())) {
          result.examDate = dateValue;
        }
      }
      
      if (mapping.field === 'examName') {
        result.examName = String(value).trim();
      }
    }
    
    result.scores = Object.values(subjectScores);
    
    return result;
  }
  
  private columnToIndex(column: string): number {
    // A -> 0, B -> 1, Z -> 25, AA -> 26, etc.
    let index = 0;
    for (let i = 0; i < column.length; i++) {
      index = index * 26 + (column.charCodeAt(i) - 64);
    }
    return index - 1;
  }
  
  // Geçici olarak işlenen öğrencileri takip etmek için (duplicate kontrolü)
  private static students: Map<string, Student> = new Map();
}

export const bulkUploadService = new BulkUploadService();
export { BulkUploadService };

