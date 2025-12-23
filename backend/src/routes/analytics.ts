import { Router } from 'express';
import { examResultService } from '../services/firestore.service';
import { teacherService } from '../services/firestore.service';

const router = Router({ mergeParams: true });

// GET /v1/institutions/:institutionId/analytics
// Query params: ?subjects=Matematik,Türkçe&teacherId=xxx
router.get('/', async (req, res, next) => {
  try {
    const { institutionId } = req.params;
    const { subjects, teacherId } = req.query;
    
    // Teacher bilgisini al (teacherId varsa)
    let teacher = null;
    if (teacherId) {
      teacher = await teacherService.get(institutionId, teacherId as string);
    }
    
    // Filtreleme mantığı
    let allowedSubjects: string[] | undefined;
    
    if (teacher) {
      if (teacher.role === 'admin' || teacher.role === 'guidance') {
        allowedSubjects = subjects ? (subjects as string).split(',') : undefined;
      } else {
        allowedSubjects = subjects 
          ? (subjects as string).split(',')
          : teacher.assignedSubjects;
      }
    } else {
      allowedSubjects = subjects ? (subjects as string).split(',') : undefined;
    }
    
    // Tüm sınav sonuçlarını getir
    const results = await examResultService.getAll(institutionId, {
      subjects: allowedSubjects,
      teacherId: teacherId as string,
    });
    
    // Analytics hesaplama
    const subjectStats: { [subject: string]: { count: number; total: number; average: number } } = {};
    const topicStats: { [key: string]: { count: number; total: number; average: number } } = {};
    const studentStats: { [studentId: string]: { name: string; count: number; total: number; average: number } } = {};
    
    results.forEach(result => {
      // Subject istatistikleri
      result.scores?.forEach(score => {
        if (!subjectStats[score.subject]) {
          subjectStats[score.subject] = { count: 0, total: 0, average: 0 };
        }
        subjectStats[score.subject].count++;
        subjectStats[score.subject].total += score.score;
        subjectStats[score.subject].average = 
          subjectStats[score.subject].total / subjectStats[score.subject].count;
        
        // Topic istatistikleri
        score.topics?.forEach(topic => {
          const key = `${score.subject}-${topic.topic}`;
          if (!topicStats[key]) {
            topicStats[key] = { count: 0, total: 0, average: 0 };
          }
          topicStats[key].count++;
          topicStats[key].total += topic.score;
          topicStats[key].average = topicStats[key].total / topicStats[key].count;
        });
      });
      
      // Student istatistikleri
      if (!studentStats[result.studentId]) {
        studentStats[result.studentId] = { name: result.studentId, count: 0, total: 0, average: 0 };
      }
      const studentTotal = result.scores?.reduce((sum, s) => sum + s.score, 0) || 0;
      studentStats[result.studentId].count++;
      studentStats[result.studentId].total += studentTotal;
      studentStats[result.studentId].average = 
        studentStats[result.studentId].total / studentStats[result.studentId].count;
    });
    
    // Chart verileri için formatla
    const chartData = Object.entries(subjectStats).map(([subject, stats]) => ({
      subject,
      average: stats.average,
      count: stats.count,
    }));
    
    const analytics = {
      subjectStats: Object.entries(subjectStats).map(([subject, stats]) => ({
        subject,
        ...stats,
      })),
      topicStats: Object.entries(topicStats).map(([key, stats]) => {
        const [subject, topic] = key.split('-');
        return { subject, topic, ...stats };
      }),
      studentStats: Object.entries(studentStats).map(([studentId, stats]) => ({
        studentId,
        ...stats,
      })),
      chartData,
    };
    
    res.json({ success: true, data: analytics });
  } catch (error) {
    next(error);
  }
});

export { router as analyticsRouter };

