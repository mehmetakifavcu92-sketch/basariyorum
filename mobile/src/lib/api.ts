import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Institutions
export const institutionsApi = {
  get: (id: string) => api.get(`/v1/institutions/${id}`),
  create: (data: { name: string; adminId: string }) =>
    api.post('/v1/institutions', data),
};

// Teachers
export const teachersApi = {
  getAll: (institutionId: string) =>
    api.get(`/v1/institutions/${institutionId}/teachers`),
  get: (institutionId: string, id: string) =>
    api.get(`/v1/institutions/${institutionId}/teachers/${id}`),
  create: (institutionId: string, data: any) =>
    api.post(`/v1/institutions/${institutionId}/teachers`, data),
  update: (institutionId: string, id: string, data: any) =>
    api.put(`/v1/institutions/${institutionId}/teachers/${id}`, data),
  delete: (institutionId: string, id: string) =>
    api.delete(`/v1/institutions/${institutionId}/teachers/${id}`),
};

// Students
export const studentsApi = {
  getAll: (institutionId: string) =>
    api.get(`/v1/institutions/${institutionId}/students`),
  get: (institutionId: string, id: string) =>
    api.get(`/v1/institutions/${institutionId}/students/${id}`),
};

// Exam Results
export const examResultsApi = {
  getAll: (
    institutionId: string,
    params?: {
      subjects?: string[];
      studentId?: string;
      teacherId?: string;
    }
  ) => {
    const queryParams = new URLSearchParams();
    if (params?.subjects) {
      queryParams.append('subjects', params.subjects.join(','));
    }
    if (params?.studentId) {
      queryParams.append('studentId', params.studentId);
    }
    if (params?.teacherId) {
      queryParams.append('teacherId', params.teacherId);
    }
    return api.get(
      `/v1/institutions/${institutionId}/exam-results?${queryParams.toString()}`
    );
  },
  get: (institutionId: string, id: string) =>
    api.get(`/v1/institutions/${institutionId}/exam-results/${id}`),
};

// Exam Templates
export const examTemplatesApi = {
  getAll: (institutionId: string) =>
    api.get(`/v1/institutions/${institutionId}/exams/templates`),
  get: (institutionId: string, id: string) =>
    api.get(`/v1/institutions/${institutionId}/exams/templates/${id}`),
  create: (institutionId: string, data: any) =>
    api.post(`/v1/institutions/${institutionId}/exams/templates`, data),
  update: (institutionId: string, id: string, data: any) =>
    api.put(`/v1/institutions/${institutionId}/exams/templates/${id}`, data),
  delete: (institutionId: string, id: string) =>
    api.delete(`/v1/institutions/${institutionId}/exams/templates/${id}`),
};

// Bulk Upload (Web için, mobile'da dosya seçimi farklı olabilir)
export const bulkUploadApi = {
  upload: (institutionId: string, file: any, templateId?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (templateId) {
      formData.append('templateId', templateId);
    }
    return api.post(
      `/v1/institutions/${institutionId}/exams/bulk-upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },
};

// Analytics
export const analyticsApi = {
  get: (
    institutionId: string,
    params?: {
      subjects?: string[];
      teacherId?: string;
    }
  ) => {
    const queryParams = new URLSearchParams();
    if (params?.subjects) {
      queryParams.append('subjects', params.subjects.join(','));
    }
    if (params?.teacherId) {
      queryParams.append('teacherId', params.teacherId);
    }
    return api.get(
      `/v1/institutions/${institutionId}/analytics?${queryParams.toString()}`
    );
  },
};

