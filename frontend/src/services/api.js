import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const rfpService = {
    generateFromText: (text) => api.post('/rfps/generate-from-text', { text }),
    create: (data) => api.post('/rfps', data),
    getAll: () => api.get('/rfps'),
    getById: (id) => api.get(`/rfps/${id}`),
    sendToVendors: (id, vendorIds) => api.post(`/rfps/${id}/send-to-vendors`, { vendorIds }),
    getComparison: (id) => api.get(`/rfps/${id}/comparison`),
};

export const vendorService = {
    create: (data) => api.post('/vendors', data),
    getAll: () => api.get('/vendors'),
    update: (id, data) => api.put(`/vendors/${id}`, data),
};

export default api;
