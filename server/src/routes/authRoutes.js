// src/routes/authRoutes.js
const express = require('express');
const { loginAdmin, getAdminProfile } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware'); // Import middleware auth

const router = express.Router();

// Rute Login (Publik)
router.post('/login', loginAdmin);

// Rute untuk mendapatkan profil admin yang sedang login (Terproteksi)
router.get('/profile', authenticateToken, getAdminProfile);

module.exports = router;