// src/routes/participantRoutes.js
const express = require('express');
const {
    getAllParticipants,
    getParticipantById,
    createParticipant,
    updateParticipant,
    deleteParticipant
} = require('../controllers/participantController');

const router = express.Router();

router.get('/', getAllParticipants);         // GET /api/v1/participants
router.post('/', createParticipant);        // POST /api/v1/participants
router.get('/:id', getParticipantById);    // GET /api/v1/participants/:id
router.put('/:id', updateParticipant);     // PUT /api/v1/participants/:id
router.delete('/:id', deleteParticipant);  // DELETE /api/v1/participants/:id

module.exports = router;