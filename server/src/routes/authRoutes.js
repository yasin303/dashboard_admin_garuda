// src/routes/authRoutes.js
const express = require('express');
const { loginAdmin, getAdminProfile } = require('../controllers/authController');
const { authenticateToken, authorizeRoles, Role } = require('../middleware/authMiddleware'); 

const router = express.Router();

router.post('/login', loginAdmin);

router.get('/profile', authenticateToken,
    authorizeRoles(Role.ADMINISTRATOR, Role.ADMIN, Role.SALES, Role.FINANCE), 
    getAdminProfile);

module.exports = router;