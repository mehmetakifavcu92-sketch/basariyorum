// API Endpoints
export const API_ENDPOINTS = {
  INSTITUTIONS: '/v1/institutions',
  TEACHERS: '/v1/institutions/:institutionId/teachers',
  STUDENTS: '/v1/institutions/:institutionId/students',
  EXAM_RESULTS: '/v1/institutions/:institutionId/exam-results',
  EXAM_BULK_UPLOAD: '/v1/institutions/:institutionId/exams/bulk-upload',
  EXAM_TEMPLATES: '/v1/institutions/:institutionId/exams/templates',
  ANALYTICS: '/v1/institutions/:institutionId/analytics',
} as const;

// Teacher Roles
export const TEACHER_ROLES = {
  ADMIN: 'admin',
  GUIDANCE: 'guidance',
  TEACHER: 'teacher',
} as const;

// Excel Field Types
export const EXCEL_FIELD_TYPES = {
  STUDENT_NAME: 'studentName',
  STUDENT_NUMBER: 'studentNumber',
  EXAM_DATE: 'examDate',
  EXAM_NAME: 'examName',
  SUBJECT_SCORE: 'subjectScore',
  TOPIC_SCORE: 'topicScore',
} as const;

