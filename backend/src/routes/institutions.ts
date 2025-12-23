import { Router } from 'express';
import { institutionService } from '../services/firestore.service';

const router = Router();

// GET /v1/institutions/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const institution = await institutionService.get(id);
    
    if (!institution) {
      return res.status(404).json({ 
        success: false, 
        error: 'Kurum bulunamadı' 
      });
    }
    
    res.json({ success: true, data: institution });
  } catch (error) {
    next(error);
  }
});

// POST /v1/institutions
router.post('/', async (req, res, next) => {
  try {
    const { name, adminId } = req.body;
    
    if (!name || !adminId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Kurum adı ve admin ID gereklidir' 
      });
    }
    
    const institution = await institutionService.create({ name, adminId });
    res.status(201).json({ success: true, data: institution });
  } catch (error) {
    next(error);
  }
});

export { router as institutionsRouter };

