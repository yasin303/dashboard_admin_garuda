// src/context/AuthContext.js
'use client'; // Penting! Tandai sebagai Client Component

import { createContext, useState, useEffect, useContext } // Tambahkan useContext
from 'react';
import Cookies from 'js-cookie';
import axiosInstance from '../lib/api'; // Menggunakan instance axios dari api.js
import { useRouter, usePathname } from 'next/navigation'; // Gunakan dari next/navigation

const AuthContext = createContext();

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; // Untuk URL profil

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const loadUserFromCookies = async () => {
            const token = Cookies.get('token');
            if (token) {
                // Set token default untuk axiosInstance dari awal
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                try {
                    const { data } = await axiosInstance.get(`/auth/profile`); // Path relatif ke base URL
                    setUser(data);
                } catch (err) {
                    Cookies.remove('token');
                    delete axiosInstance.defaults.headers.common['Authorization'];
                    setUser(null);
                    // Redirect jika tidak di halaman login dan token tidak valid
                    if (pathname !== '/login') {
                        // router.push('/login'); // Dikelola oleh AdminLayout
                    }
                }
            }
            setLoading(false);
        };
        loadUserFromCookies();
    }, [pathname]); // Perhatikan dependency array

    const login = async (email, password) => {
        setError(null);
        try {
            // Pastikan API_BASE_URL sudah benar di .env.local
            const { data } = await axiosInstance.post(`/auth/login`, { email, password });
            Cookies.set('token', data.token, { expires: 1 });
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            setUser(data.admin);
            router.push('/admin/dashboard'); // Atau /admin/dashboard
            return true;
        } catch (err) {
            const message = err.response?.data?.message || 'Login gagal. Silakan coba lagi.';
            setError(message);
            console.error('Login error:', err);
            setUser(null);
            return false;
        }
    };

    const logout = () => {
        Cookies.remove('token');
        delete axiosInstance.defaults.headers.common['Authorization'];
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook untuk menggunakan AuthContext
export const useAuth = () => useContext(AuthContext);