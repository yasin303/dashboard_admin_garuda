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
        // 1. Cari admin berdasarkan email
        const admin = await prisma.admin.findUnique({
            where: { email: email },
        });
        console.log("Admin found:", admin);
        console.log("Password input:", password);
        console.log("email input:", email);
        

        if (!admin) {
            return res.status(401).json({ message: 'Email atau password salah.' }); // Pesan generik
        }

        // 2. Bandingkan password yang diinput dengan hash di database
        const isPasswordValid = await comparePassword(password, admin.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email atau password salah.' }); // Pesan generik
        }

        // 3. Jika valid, generate JWT
        // Payload bisa berisi id, email, atau role (jika ada)
        const tokenPayload = {
            adminId: admin.id,
            email: admin.email,
            // Tambahkan role jika perlu: role: 'admin'
        };
        const token = generateToken(tokenPayload);

        // 4. Kirim token ke client
        res.status(200).json({
            message: 'Login berhasil',
            token: token,
            admin: { // Opsional: Kirim data admin non-sensitif
                id: admin.id,
                email: admin.email,
                name: admin.name
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
            select: { // Hanya pilih field yang aman untuk dikirim
                id: true,
                email: true,
                name: true,
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