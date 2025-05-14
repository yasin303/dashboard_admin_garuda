// src/lib/api.js
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

// Token management
export const setToken = (token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
};
  
export const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
};
  
export const removeToken = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
};

// Axios instance, Api instance
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    },
});
  
// request add token
axiosInstance.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);
  
// response handle errors
axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        removeToken();
        window.location.href = "/admin"; // Redirect to login page
      }
      return Promise.reject(error);
    }
);
  
export default axiosInstance;

// API calls
export const login = async (credentials) => {
    try {
      const res = await axiosInstance.post("/auth/login", credentials);
  
      console.log("Response data:", res.data);
      return res.data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
};

export const getProfile = async () => {
    try {
        const res = await axiosInstance.get('/auth/profile');
        return res.data;
    } catch (error) {
        console.error("Error fetching profile:", error);
        throw error;
    }
};

export const getTrainings = async (params = {}) => {
    try {
        const res = await axiosInstance.get('/trainings', { params });
        return res.data;
    } catch (error) {
        console.error("Error fetching trainings:", error);
        throw error;
    }
};

export const getTrainingById = async (id) => {
    try {
        const res = await axiosInstance.get(`/trainings/${id}`);
        return res.data;
    } catch (error) {
        console.error("Error fetching training by ID:", error);
        throw error;
    }
};

export const createTraining = async (data) => {
    try {
        const res = await axiosInstance.post('/trainings', data);
        return res.data;
    } catch (error) {
        console.error("Error creating training:", error);
        throw error;
    }
};

export const updateTraining = async (id, data) => {
    try {
        const res = await axiosInstance.put(`/trainings/${id}`, data);
        return res.data;
    } catch (error) {
        console.error("Error updating training:", error);
        throw error;
    }
};

export const deleteTraining = async (id) => {
    try {
        const res = await axiosInstance.delete(`/trainings/${id}`);
        return res.data;
    } catch (error) {
        console.error("Error deleting training:", error);
        throw error;
    }
};

export const getParticipants = async (params = {}) => {
    try {
        const res = await axiosInstance.get('/participants', { params });
        return res.data;
    } catch (error) {
        console.error("Error fetching participants:", error);
        throw error;
    }
};

export const getParticipantById = async (id) => {
    try {
        const res = await axiosInstance.get(`/participants/${id}`);
        return res.data;
    } catch (error) {
        console.error("Error fetching participant by ID:", error);
        throw error;
    }
};

export const createParticipant = async (data) => {
    try {
        const res = await axiosInstance.post('/participants', data);
        return res.data;
    } catch (error) {
        console.error("Error creating participant:", error);
        throw error;
    }
};

export const updateParticipant = async (id, data) => {
    try {
        const res = await axiosInstance.put(`/participants/${id}`, data);
        return res.data;
    } catch (error) {
        console.error("Error updating participant:", error);
        throw error;
    }
};

export const deleteParticipant = async (id) => {
    try {
        const res = await axiosInstance.delete(`/participants/${id}`);
        return res.data;
    } catch (error) {
        console.error("Error deleting participant:", error);
        throw error;
    }
};