// src/middleware/authorizationMiddleware.js
const { Role } = require('@prisma/client'); // Import enum Role jika diperlukan
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET; // atau langsung hardcode untuk testing

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <token>

    if (!token) {
        return res.status(401).json({ message: 'Token tidak ditemukan.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.admin = decoded; // isinya harus ada .role
        next();
        
    } catch (error) {
        return res.status(403).json({ message: 'Token tidak valid.' });
    }
};

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // console.log(`Allowed Roles: ${allowedxRoles}`);
        // console.log(`User Role: ${req.admin.role}`);
        
        // req.admin harus sudah di-set oleh authenticateToken middleware
        if (!req.admin || !req.admin.role) {
            return res.status(403).json({ message: 'Akses ditolak. Peran tidak terdefinisi.' });
        }

        const rolesArray = [...allowedRoles];

        // Jika ADMINISTRATOR diizinkan, maka dia bisa akses apa saja yang butuh role
        if (rolesArray.includes(Role.ADMINISTRATOR) && req.admin.role === Role.ADMINISTRATOR) {
            return next();
        }

        // Periksa apakah peran pengguna ada dalam daftar peran yang diizinkan
        if (!rolesArray.includes(req.admin.role)) {
            return res.status(403).json({
                message: `Akses ditolak. Peran '${req.admin.role}' tidak memiliki izin untuk sumber daya ini.`
            });
        }
        next(); // Pengguna memiliki peran yang diizinkan
    };
};

module.exports = { authenticateToken, authorizeRoles, Role }; // Ekspor juga Role agar mudah diimport di rute