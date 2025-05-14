// src/components/Sidebar.js
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import styles from './Sidebar.module.css'; // Buat CSS Module

const menuItems = [
    // Sesuaikan rute dengan struktur App Router Anda
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/peserta', label: 'Peserta' },
    { href: '/admin/pelatihan', label: 'Pelatihan' },
    { href: '/admin/transaksi', label: 'Transaksi' },
];

const Sidebar = () => {
    const pathname = usePathname();

    return (
        <aside style={{ width: '250px', backgroundColor: '#ffffff', color: 'black', padding: '20px', height: '100vh', position: 'fixed', left: '0', top: '0', display: 'flex', flexDirection: 'column' /* className={styles.sidebar} */ }}>
            <div style={{ marginBottom: '30px', textAlign: 'center' /* className={styles.logo} */ }}>
                <img src="/garuda-logo.png" alt="Garuda QHSE" width={150} />
            </div>
            <nav>
                <ul style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
                    {menuItems.map((item) => (
                        <li key={item.href} style={{ marginBottom: '10px' }} className={pathname.startsWith(item.href) ? 'active-link-class' : ''}>
                            <Link href={item.href} style={{ color: '#e0e0e0', textDecoration: 'none', display: 'block', padding: '10px 15px', borderRadius: '5px' }}>
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
             {/* Tambahkan style untuk .active-link-class di globals.css atau CSS Module */}
        </aside>
    );
};
export default Sidebar;