// src/routes/participantRoutes.js
const express = require('express');
const {
    getAllParticipants,
    getParticipantById,
    createParticipant,
    updateParticipant,
    deleteParticipant
} = require('../controllers/participantController');
const { authenticateToken,authorizeRoles, Role } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken,
    authorizeRoles(Role.ADMINISTRATOR, Role.ADMIN, Role.SALES, Role.FINANCE),
    getAllParticipants);

router.get('/:id', authenticateToken,
    authorizeRoles(Role.ADMINISTRATOR, Role.ADMIN, Role.SALES, Role.FINANCE),
    getParticipantById);

router.post('/', authenticateToken,
    authorizeRoles(Role.ADMINISTRATOR, Role.ADMIN, Role.SALES),
    createParticipant);

router.put('/:id', authenticateToken,
    authorizeRoles(Role.ADMINISTRATOR, Role.ADMIN, Role.FINANCE),
    updateParticipant);

router.delete('/:id', authenticateToken,
    authorizeRoles(Role.ADMINISTRATOR, Role.ADMIN),
    deleteParticipant);

module.exports = router;