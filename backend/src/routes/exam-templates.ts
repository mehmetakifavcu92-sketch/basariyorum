import { Router } from 'express';
import { examTemplateService } from '../services/firestore.service';
import { InstitutionParams, InstitutionWithIdParams, CreateExamTemplateBody, UpdateExamTemplateBody } from '../types';

const router = Router({ mergeParams: true });

// GET /v1/institutions/:institutionId/exams/templates
router.get('/', async (req, res, next) => {
  try {
    const { institutionId } = req.params as unknown as InstitutionParams;
    const templates = await examTemplateService.getAll(institutionId);
    res.json({ success: true, data: templates });
  } catch (error) {
    next(error);
  }
});

// GET /v1/institutions/:institutionId/exams/templates/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { institutionId, id } = req.params as unknown as InstitutionWithIdParams;
    const template = await examTemplateService.get(institutionId, id);
    
    if (!template) {
      return res.status(404).json({ 
        success: false, 
        error: 'Şablon bulunamadı' 
      });
    }
    
    res.json({ success: true, data: template });
  } catch (error) {
    next(error);
  }
});

// POST /v1/institutions/:institutionId/exams/templates
router.post('/', async (req, res, next) => {
  try {
    const { institutionId } = req.params as unknown as InstitutionParams;
    const { name, mappings } = req.body as CreateExamTemplateBody;
    
    if (!name || !mappings || !Array.isArray(mappings)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Şablon adı ve mappings gereklidir' 
      });
    }
    
    const template = await examTemplateService.create(institutionId, {
      name,
      mappings,
    });
    
    res.status(201).json({ success: true, data: template });
  } catch (error) {
    next(error);
  }
});

// PUT /v1/institutions/:institutionId/exams/templates/:id
router.put('/:id', async (req, res, next) => {
  try {
    const { institutionId, id } = req.params as unknown as InstitutionWithIdParams;
    const { name, mappings } = req.body as UpdateExamTemplateBody;
    
    const template = await examTemplateService.update(institutionId, id, {
      name,
      mappings,
    });
    
    res.json({ success: true, data: template });
  } catch (error) {
    next(error);
  }
});

// DELETE /v1/institutions/:institutionId/exams/templates/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const { institutionId, id } = req.params as unknown as InstitutionWithIdParams;
    await examTemplateService.delete(institutionId, id);
    res.json({ success: true, message: 'Şablon silindi' });
  } catch (error) {
    next(error);
  }
});

export { router as examTemplatesRouter };

