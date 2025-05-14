// src/middleware/authorizationMiddleware.js
const { Role } = require('@prisma/client'); 
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET; 

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'Token tidak ditemukan.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.admin = decoded; 
        next();
        
    } catch (error) {
        return res.status(403).json({ message: 'Token tidak valid.' });
    }
};

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.admin || !req.admin.role) {
            return res.status(403).json({ message: 'Akses ditolak. Peran tidak terdefinisi.' });
        }

        const rolesArray = [...allowedRoles];

        if (rolesArray.includes(Role.ADMINISTRATOR) && req.admin.role === Role.ADMINISTRATOR) {
            return next();
        }
        
        if (!rolesArray.includes(req.admin.role)) {
            return res.status(403).json({
                message: `Akses ditolak. Peran '${req.admin.role}' tidak memiliki izin untuk sumber daya ini.`
            });
        }
        next(); 
    };
};

module.exports = { authenticateToken, authorizeRoles, Role }; 