// Geçici type definitions (shared package çalışana kadar)
import { Request } from 'express';

export interface Institution {
  id: string;
  name: string;
  adminId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TeacherRole = 'admin' | 'guidance' | 'teacher';

export interface Teacher {
  id: string;
  institutionId: string;
  name: string;
  email: string;
  role: TeacherRole;
  assignedSubjects: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Student {
  id: string;
  institutionId: string;
  name: string;
  studentNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

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

export interface ExcelColumnMapping {
  column: string;
  field: string;
  subject?: string;
  topic?: string;
}

export interface ExcelTemplate {
  id: string;
  institutionId: string;
  name: string;
  mappings: ExcelColumnMapping[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ExamResultFilter {
  institutionId: string;
  studentId?: string;
  subjects?: string[];
  examDateFrom?: Date;
  examDateTo?: Date;
  teacherId?: string;
}

// Express Request type extensions
export interface InstitutionParams {
  institutionId: string;
}

export interface InstitutionWithIdParams extends InstitutionParams {
  id: string;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    institutionId: string;
    userId?: string;
    role?: string;
  };
}

// Request body interfaces
export interface CreateInstitutionBody {
  name: string;
  adminId: string;
}

export interface CreateTeacherBody {
  name: string;
  email: string;
  role: TeacherRole;
  assignedSubjects?: string[];
}

export interface UpdateTeacherBody {
  name?: string;
  email?: string;
  role?: TeacherRole;
  assignedSubjects?: string[];
}

export interface CreateExamTemplateBody {
  name: string;
  mappings: ExcelColumnMapping[];
}

export interface UpdateExamTemplateBody {
  name?: string;
  mappings?: ExcelColumnMapping[];
}

export interface BulkUploadBody {
  templateId?: string;
}

