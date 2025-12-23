import { Router } from 'express';
import { examResultService } from '../services/firestore.service';
import { teacherService } from '../services/firestore.service';
import { TeacherRole } from '../types';

const router = Router({ mergeParams: true });

// GET /v1/institutions/:institutionId/exam-results
// Query params: ?subjects=Matematik,Türkçe&studentId=xxx&teacherId=xxx
router.get('/', async (req, res, next) => {
  try {
    const { institutionId } = req.params;
    const { subjects, studentId, teacherId } = req.query;
    
    // Teacher bilgisini al (teacherId varsa)
    let teacher = null;
    if (teacherId) {
      teacher = await teacherService.get(institutionId, teacherId as string);
    }
    
    // Filtreleme mantığı
    let allowedSubjects: string[] | undefined;
    
    if (teacher) {
      if (teacher.role === 'admin' || teacher.role === 'guidance') {
        // Admin ve rehber öğretmeni: tüm dersler
        allowedSubjects = subjects ? (subjects as string).split(',') : undefined;
      } else {
        // Normal öğretmen: varsayılan kendi dersleri, isterse diğerlerini de seçebilir
        allowedSubjects = subjects 
          ? (subjects as string).split(',')
          : teacher.assignedSubjects;
      }
    } else {
      // Kurum sahibi veya teacherId yoksa
      allowedSubjects = subjects ? (subjects as string).split(',') : undefined;
    }
    
    const results = await examResultService.getAll(institutionId, {
      studentId: studentId as string,
      subjects: allowedSubjects,
      teacherId: teacherId as string,
    });
    
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
});

// GET /v1/institutions/:institutionId/exam-results/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { institutionId, id } = req.params;
    const result = await examResultService.get(institutionId, id);
    
    if (!result) {
      return res.status(404).json({ 
        success: false, 
        error: 'Sınav sonucu bulunamadı' 
      });
    }
    
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

export { router as examResultsRouter };

