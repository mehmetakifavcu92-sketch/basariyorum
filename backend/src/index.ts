import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './config/firebase'; // Firebase'i initialize et
import { institutionsRouter } from './routes/institutions';
import { teachersRouter } from './routes/teachers';
import { studentsRouter } from './routes/students';
import { examResultsRouter } from './routes/exam-results';
import { examTemplatesRouter } from './routes/exam-templates';
import { bulkUploadRouter } from './routes/bulk-upload';
import { analyticsRouter } from './routes/analytics';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/v1/institutions', institutionsRouter);
app.use('/v1/institutions/:institutionId/teachers', teachersRouter);
app.use('/v1/institutions/:institutionId/students', studentsRouter);
app.use('/v1/institutions/:institutionId/exam-results', examResultsRouter);
app.use('/v1/institutions/:institutionId/exams/templates', examTemplatesRouter);
app.use('/v1/institutions/:institutionId/exams/bulk-upload', bulkUploadRouter);
app.use('/v1/institutions/:institutionId/analytics', analyticsRouter);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

