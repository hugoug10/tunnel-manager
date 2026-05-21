import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const activitiesApi = {
  getAll: () => api.get('/activities').then(r => r.data),
  getById: (id) => api.get(`/activities/${id}`).then(r => r.data),
  getSummary: () => api.get('/activities/stats/summary').then(r => r.data),
  create: (data) => api.post('/activities', data).then(r => r.data),
  update: (id, data) => api.put(`/activities/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/activities/${id}`).then(r => r.data),
};

export const reportsApi = {
  getDailyAll: () => api.get('/reports/daily').then(r => r.data),
  getDaily: (date) => api.get(`/reports/daily/${date}`).then(r => r.data),
  saveDaily: (data) => api.post('/reports/daily', data).then(r => r.data),
  getWeekly: () => api.get('/reports/weekly').then(r => r.data),
  analyzeWeekly: (data) => api.post('/reports/weekly/analyze', data).then(r => r.data),
};

export const materialsApi = {
  getAll: (activityId) => api.get('/materials', { params: activityId ? { activity_id: activityId } : {} }).then(r => r.data),
  create: (data) => api.post('/materials', data).then(r => r.data),
  update: (id, data) => api.put(`/materials/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/materials/${id}`).then(r => r.data),
};

export default api;
