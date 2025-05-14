// src/routes/transactionRoutes.js
const express = require('express');
const {
    getAllTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction
} = require('../controllers/transactionController');
const { authenticateToken,authorizeRoles, Role } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken,
    authorizeRoles(Role.ADMINISTRATOR, Role.ADMIN, Role.SALES, Role.FINANCE),
    getAllTransactions);

router.get('/:id', authenticateToken,
    authorizeRoles(Role.ADMINISTRATOR, Role.ADMIN, Role.SALES, Role.FINANCE),
    getTransactionById);

router.post('/', authenticateToken,
    authorizeRoles(Role.ADMINISTRATOR, Role.ADMIN, Role.SALES),
    createTransaction);

router.put('/:id', authenticateToken,
    authorizeRoles(Role.ADMINISTRATOR, Role.ADMIN, Role.FINANCE),
    updateTransaction);

router.delete('/:id', authenticateToken,
    authorizeRoles(Role.ADMINISTRATOR, Role.ADMIN),
    deleteTransaction);

module.exports = router;