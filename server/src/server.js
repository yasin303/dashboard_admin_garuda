// src/server.js
require('dotenv').config(); // Load environment variables first
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');

// Import Rute
const authRoutes = require('./routes/authRoutes');
const trainingRoutes = require('./routes/trainingRoutes');
const participantRoutes = require('./routes/participantRoutes');

// Middleware Autentikasi
const { authorizeRoles, Role } = require('./middleware/authMiddleware');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Aktifkan CORS untuk semua origin (sesuaikan untuk produksi)
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Middleware Global (opsional, contoh logging sederhana)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Rute Publik (Login tidak perlu token)
app.use('/api/v1/auth', authRoutes);

// Rute Terproteksi (Memerlukan token JWT)
// Semua rute di bawah ini akan dicek oleh authorizeRoles
app.use('/api/v1/trainings', authorizeRoles(Role.ADMINISTRATOR, Role.ADMIN, Role.SALES, Role.FINANCE), trainingRoutes);
app.use('/api/v1/participants', authorizeRoles(Role.ADMINISTRATOR, Role.ADMIN, Role.SALES, Role.FINANCE), participantRoutes);

// Rute Dasar
app.get('/', (req, res) => {
    res.send('Selamat Datang di API Training Management!');
});

// Middleware Penanganan Error (Basic)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: err.message });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});

// Graceful shutdown (opsional tapi bagus)
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    console.log('Koneksi Prisma diputus.');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    console.log('Koneksi Prisma diputus.');
    process.exit(0);
});