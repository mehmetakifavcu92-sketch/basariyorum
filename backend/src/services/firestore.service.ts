import { db } from '../config/firebase';
import { 
  Institution, 
  Teacher, 
  Student, 
  ExamResult, 
  ExcelTemplate,
  ExamResultFilter
} from '../types';

// Collection referansları
const collections = {
  institutions: () => db.collection('institutions'),
  teachers: (institutionId: string) => 
    db.collection('institutions').doc(institutionId).collection('teachers'),
  students: (institutionId: string) => 
    db.collection('institutions').doc(institutionId).collection('students'),
  examResults: (institutionId: string) => 
    db.collection('institutions').doc(institutionId).collection('examResults'),
  examTemplates: (institutionId: string) => 
    db.collection('institutions').doc(institutionId).collection('examTemplates'),
};

// Helper: Firestore timestamp'leri Date'e çevir
const convertTimestamps = (data: any): any => {
  if (!data) return data;
  
  const converted = { ...data };
  
  // Timestamp'leri Date'e çevir
  Object.keys(converted).forEach(key => {
    if (converted[key] && typeof converted[key] === 'object') {
      if (converted[key].toDate && typeof converted[key].toDate === 'function') {
        converted[key] = converted[key].toDate();
      } else if (converted[key]._seconds) {
        // Firestore Timestamp formatı
        converted[key] = new Date(converted[key]._seconds * 1000);
      }
    }
  });
  
  return converted;
};

// Institution servisleri
export const institutionService = {
  async get(id: string): Promise<Institution | null> {
    try {
      const doc = await collections.institutions().doc(id).get();
      if (!doc.exists) return null;
      
      const data = doc.data();
      return {
        id: doc.id,
        ...convertTimestamps(data),
      } as Institution;
    } catch (error) {
      console.error('Institution get error:', error);
      throw error;
    }
  },
  
  async create(data: Omit<Institution, 'id' | 'createdAt' | 'updatedAt'>): Promise<Institution> {
    try {
      const now = new Date();
      const docRef = collections.institutions().doc();
      const institution: Institution = {
        id: docRef.id,
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      await docRef.set(institution);
      return institution;
    } catch (error) {
      console.error('Institution create error:', error);
      throw error;
    }
  },
};

// Teacher servisleri
export const teacherService = {
  async getAll(institutionId: string): Promise<Teacher[]> {
    try {
      const snapshot = await collections.teachers(institutionId).get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data()),
      } as Teacher));
    } catch (error) {
      console.error('Teacher getAll error:', error);
      throw error;
    }
  },
  
  async get(institutionId: string, id: string): Promise<Teacher | null> {
    try {
      const doc = await collections.teachers(institutionId).doc(id).get();
      if (!doc.exists) return null;
      
      return {
        id: doc.id,
        ...convertTimestamps(doc.data()),
      } as Teacher;
    } catch (error) {
      console.error('Teacher get error:', error);
      throw error;
    }
  },
  
  async create(
    institutionId: string, 
    data: Omit<Teacher, 'id' | 'institutionId' | 'createdAt' | 'updatedAt'>
  ): Promise<Teacher> {
    try {
      const now = new Date();
      const docRef = collections.teachers(institutionId).doc();
      const teacher: Teacher = {
        id: docRef.id,
        institutionId,
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      await docRef.set(teacher);
      return teacher;
    } catch (error) {
      console.error('Teacher create error:', error);
      throw error;
    }
  },
  
  async update(
    institutionId: string, 
    id: string, 
    data: Partial<Omit<Teacher, 'id' | 'institutionId' | 'createdAt'>>
  ): Promise<Teacher> {
    try {
      const docRef = collections.teachers(institutionId).doc(id);
      await docRef.update({
        ...data,
        updatedAt: new Date(),
      });
      const updated = await docRef.get();
      return {
        id: updated.id,
        ...convertTimestamps(updated.data()),
      } as Teacher;
    } catch (error) {
      console.error('Teacher update error:', error);
      throw error;
    }
  },
  
  async delete(institutionId: string, id: string): Promise<void> {
    try {
      await collections.teachers(institutionId).doc(id).delete();
    } catch (error) {
      console.error('Teacher delete error:', error);
      throw error;
    }
  },
};

// Student servisleri
export const studentService = {
  async getAll(institutionId: string): Promise<Student[]> {
    try {
      const snapshot = await collections.students(institutionId).get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data()),
      } as Student));
    } catch (error) {
      console.error('Student getAll error:', error);
      throw error;
    }
  },
  
  async get(institutionId: string, id: string): Promise<Student | null> {
    try {
      const doc = await collections.students(institutionId).doc(id).get();
      if (!doc.exists) return null;
      
      return {
        id: doc.id,
        ...convertTimestamps(doc.data()),
      } as Student;
    } catch (error) {
      console.error('Student get error:', error);
      throw error;
    }
  },
  
  async create(
    institutionId: string,
    data: Omit<Student, 'id' | 'institutionId' | 'createdAt' | 'updatedAt'>
  ): Promise<Student> {
    try {
      const now = new Date();
      const docRef = collections.students(institutionId).doc();
      const student: Student = {
        id: docRef.id,
        institutionId,
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      await docRef.set(student);
      return student;
    } catch (error) {
      console.error('Student create error:', error);
      throw error;
    }
  },
  
  async getOrCreate(
    institutionId: string,
    studentNumber: string,
    name: string
  ): Promise<Student> {
    try {
      // Önce öğrenci numarasına göre ara
      const snapshot = await collections.students(institutionId)
        .where('studentNumber', '==', studentNumber)
        .limit(1)
        .get();
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return {
          id: doc.id,
          ...convertTimestamps(doc.data()),
        } as Student;
      }
      
      // Yoksa oluştur
      return await this.create(institutionId, {
        name,
        studentNumber,
      });
    } catch (error) {
      console.error('Student getOrCreate error:', error);
      throw error;
    }
  },
};

// ExamResult servisleri
export const examResultService = {
  async getAll(
    institutionId: string,
    filters?: {
      studentId?: string;
      subjects?: string[];
      teacherId?: string;
    }
  ): Promise<ExamResult[]> {
    try {
      let query: FirebaseFirestore.Query = collections.examResults(institutionId);
      
      if (filters?.studentId) {
        query = query.where('studentId', '==', filters.studentId);
      }
      
      const snapshot = await query.get();
      let results = snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data()),
      } as ExamResult));
      
      // Subject filtreleme (client-side, çünkü array-contains karmaşık)
      if (filters?.subjects && filters.subjects.length > 0) {
        results = results.filter(result => 
          result.scores && result.scores.some(score => 
            filters.subjects!.includes(score.subject)
          )
        );
      }
      
      return results;
    } catch (error) {
      console.error('ExamResult getAll error:', error);
      throw error;
    }
  },
  
  async get(institutionId: string, id: string): Promise<ExamResult | null> {
    try {
      const doc = await collections.examResults(institutionId).doc(id).get();
      if (!doc.exists) return null;
      
      return {
        id: doc.id,
        ...convertTimestamps(doc.data()),
      } as ExamResult;
    } catch (error) {
      console.error('ExamResult get error:', error);
      throw error;
    }
  },
  
  async create(
    institutionId: string, 
    data: Omit<ExamResult, 'id' | 'institutionId' | 'createdAt' | 'updatedAt'>
  ): Promise<ExamResult> {
    try {
      const now = new Date();
      const docRef = collections.examResults(institutionId).doc();
      const examResult: ExamResult = {
        id: docRef.id,
        institutionId,
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      await docRef.set(examResult);
      return examResult;
    } catch (error) {
      console.error('ExamResult create error:', error);
      throw error;
    }
  },
  
  async createBatch(
    institutionId: string, 
    data: Omit<ExamResult, 'id' | 'institutionId' | 'createdAt' | 'updatedAt'>[]
  ): Promise<ExamResult[]> {
    try {
      const batch = db.batch();
      const now = new Date();
      const results: ExamResult[] = [];
      
      data.forEach(item => {
        const docRef = collections.examResults(institutionId).doc();
        const examResult: ExamResult = {
          id: docRef.id,
          institutionId,
          ...item,
          createdAt: now,
          updatedAt: now,
        };
        results.push(examResult);
        batch.set(docRef, examResult);
      });
      
      await batch.commit();
      return results;
    } catch (error) {
      console.error('ExamResult createBatch error:', error);
      throw error;
    }
  },
};

// ExcelTemplate servisleri
export const examTemplateService = {
  async getAll(institutionId: string): Promise<ExcelTemplate[]> {
    try {
      const snapshot = await collections.examTemplates(institutionId).get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data()),
      } as ExcelTemplate));
    } catch (error) {
      console.error('ExcelTemplate getAll error:', error);
      throw error;
    }
  },
  
  async get(institutionId: string, id: string): Promise<ExcelTemplate | null> {
    try {
      const doc = await collections.examTemplates(institutionId).doc(id).get();
      if (!doc.exists) return null;
      
      return {
        id: doc.id,
        ...convertTimestamps(doc.data()),
      } as ExcelTemplate;
    } catch (error) {
      console.error('ExcelTemplate get error:', error);
      throw error;
    }
  },
  
  async create(
    institutionId: string, 
    data: Omit<ExcelTemplate, 'id' | 'institutionId' | 'createdAt' | 'updatedAt'>
  ): Promise<ExcelTemplate> {
    try {
      const now = new Date();
      const docRef = collections.examTemplates(institutionId).doc();
      const template: ExcelTemplate = {
        id: docRef.id,
        institutionId,
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      await docRef.set(template);
      return template;
    } catch (error) {
      console.error('ExcelTemplate create error:', error);
      throw error;
    }
  },
  
  async update(
    institutionId: string, 
    id: string, 
    data: Partial<Omit<ExcelTemplate, 'id' | 'institutionId' | 'createdAt'>>
  ): Promise<ExcelTemplate> {
    try {
      const docRef = collections.examTemplates(institutionId).doc(id);
      await docRef.update({
        ...data,
        updatedAt: new Date(),
      });
      const updated = await docRef.get();
      return {
        id: updated.id,
        ...convertTimestamps(updated.data()),
      } as ExcelTemplate;
    } catch (error) {
      console.error('ExcelTemplate update error:', error);
      throw error;
    }
  },
  
  async delete(institutionId: string, id: string): Promise<void> {
    try {
      await collections.examTemplates(institutionId).doc(id).delete();
    } catch (error) {
      console.error('ExcelTemplate delete error:', error);
      throw error;
    }
  },
};

