// src/middleware/authorizationMiddleware.js
const { Role } = require('@prisma/client'); // Import enum Role jika diperlukan

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
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

module.exports = { authorizeRoles, Role }; // Ekspor juga Role agar mudah diimport di rute