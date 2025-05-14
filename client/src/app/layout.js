// src/app/layout.js
import { AuthProvider } from '../context/AuthContext'; 
import './globals.css'; 

export const metadata = {
  title: 'Garuda QHSE Institution',
  description: 'Training Management System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}