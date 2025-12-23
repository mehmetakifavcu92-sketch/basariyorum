import { Router } from 'express';
import multer from 'multer';
import { bulkUploadService } from '../services/bulk-upload.service';

const router = Router({ mergeParams: true });
const upload = multer({ dest: 'uploads/' });

// POST /v1/institutions/:institutionId/exams/bulk-upload
router.post('/', upload.single('file'), async (req, res, next) => {
  try {
    const { institutionId } = req.params;
    const { templateId } = req.body;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ 
        success: false, 
        error: 'Dosya yüklenmedi' 
      });
    }
    
    // TODO: Excel dosyasını oku ve işle
    const result = await bulkUploadService.processExcelFile(
      institutionId,
      file.path,
      templateId
    );
    
    res.json({ 
      success: true, 
      data: result,
      message: `${result.studentsProcessed} öğrenci işlendi, ${result.resultsCreated} sonuç kaydedildi`
    });
  } catch (error) {
    next(error);
  }
});

export { router as bulkUploadRouter };

