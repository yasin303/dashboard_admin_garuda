// src/routes/participantRoutes.js
const express = require('express');
const {
    getAllParticipants,
    getParticipantById,
    createParticipant,
    updateParticipant,
    deleteParticipant
} = require('../controllers/participantController');
const { authorizeRoles, Role } = require('../middleware/authMiddleware'); // Import

const router = express.Router();

// Yang bisa melihat semua peserta: ADMINISTRATOR, ADMIN, SALES, FINANCE
router.get('/', authorizeRoles(Role.ADMINISTRATOR, Role.ADMIN, Role.SALES, Role.FINANCE), getAllParticipants);
router.get('/:id', authorizeRoles(Role.ADMINISTRATOR, Role.ADMIN, Role.SALES, Role.FINANCE), getParticipantById);

// Yang bisa membuat peserta: ADMINISTRATOR, ADMIN, SALES (misalnya untuk mendaftarkan)
router.post('/', authorizeRoles(Role.ADMINISTRATOR, Role.ADMIN, Role.SALES), createParticipant);

// Yang bisa update data peserta (misal, status dokumen oleh ADMIN, status pembayaran oleh FINANCE)
// Ini bisa jadi lebih granular, misal field tertentu hanya bisa diupdate oleh role tertentu.
// Untuk sekarang, kita buat ADMINISTRATOR, ADMIN, FINANCE bisa update.
router.put('/:id', authorizeRoles(Role.ADMINISTRATOR, Role.ADMIN, Role.FINANCE), updateParticipant);

// Yang bisa menghapus peserta: ADMINISTRATOR, ADMIN
router.delete('/:id', authorizeRoles(Role.ADMINISTRATOR, Role.ADMIN), deleteParticipant);

module.exports = router;