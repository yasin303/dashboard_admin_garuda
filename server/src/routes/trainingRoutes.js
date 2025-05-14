// src/routes/trainingRoutes.js
const express = require('express');
const {
    getAllTrainings,
    getTrainingById,
    createTraining,
    updateTraining,
    deleteTraining
} = require('../controllers/trainingController');
const { authenticateToken, authorizeRoles, Role } = require('../middleware/authMiddleware'); 

const router = express.Router();

router.get('/', authenticateToken,
    authorizeRoles(Role.ADMINISTRATOR, Role.ADMIN, Role.SALES),
    getAllTrainings);

router.get('/:id', authenticateToken,
    authorizeRoles(Role.ADMINISTRATOR, Role.ADMIN, Role.SALES),
    getTrainingById);

router.post('/', authenticateToken,
    authorizeRoles(Role.ADMINISTRATOR, Role.ADMIN),
    createTraining);

router.put('/:id', authenticateToken,
    authorizeRoles(Role.ADMINISTRATOR, Role.ADMIN),
    updateTraining);

router.delete('/:id', authenticateToken,
    authorizeRoles(Role.ADMINISTRATOR, Role.ADMIN),
    deleteTraining);

module.exports = router;