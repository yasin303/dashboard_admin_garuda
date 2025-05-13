// src/controllers/authController.js
const { PrismaClient } = require('@prisma/client');
const { comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

const prisma = new PrismaClient();

const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email dan password harus diisi.' });
    }

    try {
        const admin = await prisma.admin.findUnique({
            where: { email: email },
        });

        if (!admin) {
            return res.status(401).json({ message: 'Email atau password salah.' });
        }

        const isPasswordValid = await comparePassword(password, admin.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email atau password salah.' });
        }

        const tokenPayload = {
            adminId: admin.id,
            email: admin.email,
            role: admin.role, // Sertakan role di sini
        };
        const token = generateToken(tokenPayload);

        res.status(200).json({
            message: 'Login berhasil',
            token: token,
            admin: {
                id: admin.id,
                email: admin.email,
                name: admin.name,
                role: admin.role, // Sertakan role di sini
            }
         });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Terjadi kesalahan saat proses login.' });
    }
};

// Opsional: Fungsi untuk mendapatkan profil admin yang sedang login (berdasarkan token)
const getAdminProfile = async (req, res) => {
    // Informasi admin sudah ada di req.admin dari middleware authenticateToken
    const adminId = req.admin.adminId;

    try {
        const admin = await prisma.admin.findUnique({
            where: { id: adminId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true, // Sertakan role
                createdAt: true
            }
        });

        if (!admin) {
            return res.status(404).json({ message: 'Admin tidak ditemukan.' });
        }
        res.status(200).json(admin);
    } catch (error) {
         console.error("Get profile error:", error);
        res.status(500).json({ message: 'Gagal mengambil profil admin.' });
    }
}


module.exports = { loginAdmin, getAdminProfile };