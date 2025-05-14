// src/components/Header.js
'use client';
import { useAuth } from '../context/AuthContext'; 
// import styles from './Header.module.css'; 

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <header style={{ height: '70px', backgroundColor: '#ffffff', padding: '0 30px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'fixed', top: '0', left: '250px', right: '0', zIndex: '100' /* className={styles.header} */ }}>
            <div style={{ flexGrow: '1' /* className={styles.spacer} */ }}></div>
            {user && (
                <div style={{ display: 'flex', alignItems: 'center' /* className={styles.userInfo} */ }}>
                    <span style={{ marginRight: '15px' }}>Hi, {user.name || user.email}</span>
                    <div style={{ width: '40px', height: '40px', backgroundColor: '#e0e0e0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginRight: '15px' /* className={styles.avatar} */ }}>
                        {(user.name || user.email).charAt(0).toUpperCase()}
                    </div>
                    <button onClick={logout} className="btn btn-danger" style={{ /* Style dari globals.css atau custom */ }}>Logout</button>
                </div>
            )}
        </header>
    );
};
export default Header;