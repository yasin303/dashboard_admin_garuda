// src/lib/api.js
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
      },
});

// Interceptor untuk menambahkan token ke setiap request jika ada
axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if (token && !config.headers['Authorization']) { // Hanya set jika belum ada
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor untuk menangani error global (misal, 401 Unauthorized)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            Cookies.remove('token');
            // Di App Router, penanganan redirect lebih baik dilakukan di layout atau middleware
            // Untuk sementara, kita bisa log atau melempar error agar ditangani di komponen
            console.warn("Token expired or invalid. User should be redirected.");
            if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
                 // window.location.href = '/login'; // Hindari hard redirect jika bisa
            }
        }
        return Promise.reject(error);
    }
);

// Pelatihan
export const getTrainings = (params = {}) => axiosInstance.get('/trainings', { params });
export const getTrainingById = (id) => axiosInstance.get(`/trainings/${id}`);
export const createTraining = (data) => axiosInstance.post('/trainings', data);
export const updateTraining = (id, data) => axiosInstance.put(`/trainings/${id}`, data);
export const deleteTraining = (id) => axiosInstance.delete(`/trainings/${id}`);

// Peserta
export const getParticipants = (params = {}) => axiosInstance.get('/participants', { params });
// ... (fungsi API lainnya)

export default axiosInstance; // Ekspor instance-nya