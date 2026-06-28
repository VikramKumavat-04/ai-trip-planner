import api from './api.js';

export const tripService = {
  generate: (data) => api.post('/trips/generate', data),
  save: (data) => api.post('/trips', data),
  getAll: (params) => api.get('/trips', { params }),
  getById: (id) => api.get(`/trips/${id}`),
  getByShareToken: (token) => api.get(`/trips/shared/${token}`),
  update: (id, data) => api.put(`/trips/${id}`, data),
  delete: (id) => api.delete(`/trips/${id}`),
  share: (id) => api.post(`/trips/${id}/share`),
  getStats: () => api.get('/trips/stats'),
};
