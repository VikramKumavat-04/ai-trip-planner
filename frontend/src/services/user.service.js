import api from './api.js';

export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/change-password', data),
  deleteAccount: (data) => api.delete('/users/account', { data }),
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/users/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  getFavorites: () => api.get('/favorites'),
  addFavorite: (destination) => api.post('/favorites', { destination }),
  removeFavorite: (destination) => api.delete(`/favorites/${encodeURIComponent(destination)}`),
};
