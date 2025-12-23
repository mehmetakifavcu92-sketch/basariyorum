import { Router } from 'express';
import { studentService } from '../services/firestore.service';

const router = Router({ mergeParams: true });

// GET /v1/institutions/:institutionId/students
router.get('/', async (req, res, next) => {
  try {
    const { institutionId } = req.params;
    const students = await studentService.getAll(institutionId);
    res.json({ success: true, data: students });
  } catch (error) {
    next(error);
  }
});

// GET /v1/institutions/:institutionId/students/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { institutionId, id } = req.params;
    const student = await studentService.get(institutionId, id);
    
    if (!student) {
      return res.status(404).json({ 
        success: false, 
        error: 'Öğrenci bulunamadı' 
      });
    }
    
    res.json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
});

export { router as studentsRouter };

