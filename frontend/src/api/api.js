import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Adjust to your backend URL
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