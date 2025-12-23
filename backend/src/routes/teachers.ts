import { Router } from 'express';
import { teacherService } from '../services/firestore.service';

const router = Router({ mergeParams: true });

// GET /v1/institutions/:institutionId/teachers
router.get('/', async (req, res, next) => {
  try {
    const { institutionId } = req.params;
    const teachers = await teacherService.getAll(institutionId);
    res.json({ success: true, data: teachers });
  } catch (error) {
    next(error);
  }
});

// GET /v1/institutions/:institutionId/teachers/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { institutionId, id } = req.params;
    const teacher = await teacherService.get(institutionId, id);
    
    if (!teacher) {
      return res.status(404).json({ 
        success: false, 
        error: 'Öğretmen bulunamadı' 
      });
    }
    
    res.json({ success: true, data: teacher });
  } catch (error) {
    next(error);
  }
});

// POST /v1/institutions/:institutionId/teachers
router.post('/', async (req, res, next) => {
  try {
    const { institutionId } = req.params;
    const { name, email, role, assignedSubjects } = req.body;
    
    if (!name || !email || !role) {
      return res.status(400).json({ 
        success: false, 
        error: 'Ad, email ve rol gereklidir' 
      });
    }
    
    const teacher = await teacherService.create(institutionId, {
      name,
      email,
      role,
      assignedSubjects: assignedSubjects || [],
    });
    
    res.status(201).json({ success: true, data: teacher });
  } catch (error) {
    next(error);
  }
});

// PUT /v1/institutions/:institutionId/teachers/:id
router.put('/:id', async (req, res, next) => {
  try {
    const { institutionId, id } = req.params;
    const { name, email, role, assignedSubjects } = req.body;
    
    const teacher = await teacherService.update(institutionId, id, {
      name,
      email,
      role,
      assignedSubjects,
    });
    
    res.json({ success: true, data: teacher });
  } catch (error) {
    next(error);
  }
});

// DELETE /v1/institutions/:institutionId/teachers/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const { institutionId, id } = req.params;
    await teacherService.delete(institutionId, id);
    res.json({ success: true, message: 'Öğretmen silindi' });
  } catch (error) {
    next(error);
  }
});

export { router as teachersRouter };

