// src/app/admin/layout.js
'use client';

import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; //
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '../../components/Sidebar'; 
import Header from '../../components/Header';   
// import styles from './AdminLayout.module.css'; 

const AdminLayout = ({ children }) => {
    const { isAuthenticated, loading, user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !isAuthenticated && pathname !== '/login') { 
            router.push('/login');
        }
    }, [isAuthenticated, loading, router, pathname]);

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading admin area...</div>;
    }

    if (!isAuthenticated && pathname !== '/login') {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Redirecting to login...</div>;
    }

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