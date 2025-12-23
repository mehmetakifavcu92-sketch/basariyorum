// Kurum (Institution)
export interface Institution {
  id: string;
  name: string;
  adminId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Öğretmen (Teacher)
export type TeacherRole = 'admin' | 'guidance' | 'teacher';

export interface Teacher {
  id: string;
  institutionId: string;
  name: string;
  email: string;
  role: TeacherRole;
  assignedSubjects: string[]; // Normal öğretmen için dersler, rehber öğretmeni için boş veya tüm dersler
  createdAt: Date;
  updatedAt: Date;
}

// Öğrenci (Student)
export interface Student {
  id: string;
  institutionId: string;
  name: string;
  studentNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

// Sınav Sonucu (Exam Result)
export interface ExamTopicScore {
  topic: string;
  score: number;
}

export interface SubjectScore {
  subject: string;
  score: number;
  topics?: ExamTopicScore[];
}

export interface ExamResult {
  id: string;
  institutionId: string;
  studentId: string;
  examDate: Date;
  examName?: string;
  scores: SubjectScore[];
  createdAt: Date;
  updatedAt: Date;
}

// Excel Şablon (Excel Template)
export interface ExcelColumnMapping {
  column: string; // A, B, C, etc.
  field: string; // 'studentName', 'studentNumber', 'mathScore', etc.
  subject?: string; // Ders adı (score alanları için)
  topic?: string; // Konu adı (topic score alanları için)
}

export interface ExcelTemplate {
  id: string;
  institutionId: string;
  name: string;
  mappings: ExcelColumnMapping[];
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filter Types
export interface ExamResultFilter {
  institutionId: string;
  studentId?: string;
  subjects?: string[];
  examDateFrom?: Date;
  examDateTo?: Date;
  teacherId?: string; // Öğretmen ID'si için otomatik filtreleme
}

