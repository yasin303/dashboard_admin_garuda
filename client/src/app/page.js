// src/app/page.js
'use client'; // Karena menggunakan hooks

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext'; // Sesuaikan path

export default function HomePage() {
    const router = useRouter();
    const { isAuthenticated, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            if (isAuthenticated) {
                router.replace('/admin/pelatihan'); // Atau /admin/dashboard
            } else {
                router.replace('/login');
            }
        }
    }, [isAuthenticated, loading, router]);

    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
}