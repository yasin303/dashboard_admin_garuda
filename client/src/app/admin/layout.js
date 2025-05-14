// src/app/admin/layout.js
'use client';

import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // Sesuaikan path
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '../../components/Sidebar'; // Sesuaikan path
import Header from '../../components/Header';   // Sesuaikan path
// import styles from './AdminLayout.module.css'; // Buat CSS module jika perlu

const AdminLayout = ({ children }) => {
    const { isAuthenticated, loading, user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !isAuthenticated && pathname !== '/login') { // Pastikan tidak redirect dari halaman login itu sendiri
            router.push('/login');
        }
    }, [isAuthenticated, loading, router, pathname]);

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading admin area...</div>;
    }

    // Jika belum terautentikasi dan bukan di halaman login, jangan render apapun (atau spinner)
    // Ini untuk mencegah flash of content sebelum redirect terjadi
    if (!isAuthenticated && pathname !== '/login') {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Redirecting to login...</div>;
    }


    // Hanya render layout admin jika terautentikasi
    // Halaman login tidak akan menggunakan layout ini karena routingnya beda
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6' /* dari globals.css */ }}>
            <Sidebar />
            <div style={{ flexGrow: 1, marginLeft: '250px' /* lebar sidebar */, display: 'flex', flexDirection: 'column' }}>
                <Header />
                <main style={{ flexGrow: 1, padding: '20px', marginTop: '70px' /* tinggi header */, overflowY: 'auto' }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;