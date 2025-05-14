// src/app/layout.js
import { AuthProvider } from '../context/AuthContext'; // Sesuaikan path
import './globals.css'; // Import global styles

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