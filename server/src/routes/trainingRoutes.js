// src/routes/trainingRoutes.js
const express = require('express');
const {
    getAllTrainings,
    getTrainingById,
    createTraining,
    updateTraining,
    deleteTraining
} = require('../controllers/trainingController');
const { authorizeRoles, Role } = require('../middleware/authMiddleware'); // Import

const router = express.Router();

// Semua pengguna yang terautentikasi bisa melihat (jika diperlukan, atau batasi juga)
// Untuk contoh ini, SALES, ADMIN, ADMINISTRATOR bisa melihat
router.get('/', authorizeRoles(Role.ADMINISTRATOR, Role.ADMIN, Role.SALES), getAllTrainings);
router.get('/:id', authorizeRoles(Role.ADMINISTRATOR, Role.ADMIN, Role.SALES), getTrainingById);

// Hanya ADMINISTRATOR dan ADMIN yang bisa membuat, update, delete
router.post('/', authorizeRoles(Role.ADMINISTRATOR, Role.ADMIN), createTraining);
router.put('/:id', authorizeRoles(Role.ADMINISTRATOR, Role.ADMIN), updateTraining);
router.delete('/:id', authorizeRoles(Role.ADMINISTRATOR, Role.ADMIN), deleteTraining);

module.exports = router;