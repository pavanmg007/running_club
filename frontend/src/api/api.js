import axios from 'axios';

console.log('API_BASE_URL:', process.env.REACT_APP_API_BASE_URL);
const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
});

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

// Auth APIs
export const signup = (data) => api.post('/auth/signup', data);
export const login = (data) => api.post('/auth/login', data);
export const forgotPassword = (data) => api.post('/auth/forgot-password', data);
export const resetPassword = (data) => api.post('/auth/reset-password', data);
export const updatePassword = (data) => api.put('/auth/password', data);

// Marathon APIs
export const getMarathons = () => api.get('/marathons');
export const getMarathonById = (id) => api.get(`/marathons/${id}`);
export const getParticipants = (id) => api.get(`/marathons/${id}/participants`);
export const participate = (id, data) => api.post(`/marathons/${id}/participate`, data);

export default api;