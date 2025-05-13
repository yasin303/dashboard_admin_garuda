// src/routes/participantRoutes.js
const express = require('express');
const {
    getAllParticipants,
    getParticipantById,
    createParticipant,
    updateParticipant,
    deleteParticipant
} = require('../controllers/participantController');
const { authenticateToken,authorizeRoles, Role } = require('../middleware/authMiddleware'); // Import

const router = express.Router();

// Yang bisa melihat semua peserta: ADMINISTRATOR, ADMIN, SALES, FINANCE
router.get('/', authenticateToken,
    authorizeRoles(Role.ADMINISTRATOR, Role.ADMIN, Role.SALES, Role.FINANCE),
    getAllParticipants);

router.get('/:id', authenticateToken,
    authorizeRoles(Role.ADMINISTRATOR, Role.ADMIN, Role.SALES, Role.FINANCE),
    getParticipantById);

// Yang bisa membuat peserta: ADMINISTRATOR, ADMIN, SALES (misalnya untuk mendaftarkan)
router.post('/', authenticateToken,
    authorizeRoles(Role.ADMINISTRATOR, Role.ADMIN, Role.SALES),
    createParticipant);

// Yang bisa update data peserta (misal, status dokumen oleh ADMIN, status pembayaran oleh FINANCE)
// Ini bisa jadi lebih granular, misal field tertentu hanya bisa diupdate oleh role tertentu.
// Untuk sekarang, kita buat ADMINISTRATOR, ADMIN, FINANCE bisa update.
router.put('/:id', authenticateToken,
    authorizeRoles(Role.ADMINISTRATOR, Role.ADMIN, Role.FINANCE),
    updateParticipant);

// Yang bisa menghapus peserta: ADMINISTRATOR, ADMIN
router.delete('/:id', authenticateToken,
    authorizeRoles(Role.ADMINISTRATOR, Role.ADMIN),
    deleteParticipant);

module.exports = router;