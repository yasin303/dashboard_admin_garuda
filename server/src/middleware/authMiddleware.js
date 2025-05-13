// src/middleware/authMiddleware.js
const { verifyToken } = require('../utils/jwt');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // Bearer TOKEN_STRING
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(403).json({ message: 'Token tidak valid atau kedaluwarsa.' });
    }

    // Simpan informasi user (misal: id admin) di request untuk digunakan controller selanjutnya
    req.admin = decoded; // Payload token berisi data admin saat login
    next(); // Lanjutkan ke handler rute berikutnya
};

module.exports = { authenticateToken };