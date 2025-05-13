// src/routes/authRoutes.js
const express = require('express');
const { loginAdmin, getAdminProfile } = require('../controllers/authController');
const { authenticateToken, authorizeRoles, Role } = require('../middleware/authMiddleware'); // Import


const router = express.Router();

// Rute Login (Publik)
router.post('/login', loginAdmin);

// Rute untuk mendapatkan profil admin yang sedang login (Terproteksi)
router.get('/profile', authenticateToken,
    authorizeRoles(Role.ADMINISTRATOR, Role.ADMIN, Role.SALES, Role.FINANCE), 
    getAdminProfile);

module.exports = router;