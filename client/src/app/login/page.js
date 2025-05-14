// src/app/login/page.js
'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // Sesuaikan path
// import styles from './Login.module.css'; // Buat file CSS module jika perlu, atau gunakan global

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, error, loading: authLoading } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (authLoading) return;
        await login(email, password);
        // Navigasi sudah dihandle di AuthContext
    };

    // Gunakan class dari globals.css atau buat Login.module.css
    return (
        <div className="loginContainer" style={{ /* Tambahkan style inline atau dari CSS Module */
            display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#e0f2fe'
        }}>
            <div className="loginBox" style={{
                 backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px', textAlign: 'center'
            }}>
                <div style={{ marginBottom: '20px' }}>
                    <img src="/garuda-logo.png" alt="Garuda QHSE" style={{ maxWidth: '200px' }} />
                </div>
                <h2>Login Admin</h2>
                {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                        <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                        <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                        />
                    </div>
                    <button type="submit"
                        disabled={authLoading}
                        style={{ width: '100%', padding: '12px', backgroundColor: '#1e3a8a', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = authLoading ? '#9ca3af' : '#1c3276'}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = authLoading ? '#9ca3af' : '#1e3a8a'}
                    >
                        {authLoading ? 'Loading...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;