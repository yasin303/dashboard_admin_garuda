// src/routes/trainingRoutes.js
const express = require('express');
const {
    getAllTrainings,
    getTrainingById,
    createTraining,
    updateTraining,
    deleteTraining
} = require('../controllers/trainingController');

const router = express.Router();

router.get('/', getAllTrainings);          // GET /api/v1/trainings
router.post('/', createTraining);         // POST /api/v1/trainings
router.get('/:id', getTrainingById);     // GET /api/v1/trainings/:id
router.put('/:id', updateTraining);      // PUT /api/v1/trainings/:id
router.delete('/:id', deleteTraining);   // DELETE /api/v1/trainings/:id

module.exports = router;