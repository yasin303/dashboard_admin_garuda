// src/controllers/trainingController.js
const { PrismaClient, TrainingStatus } = require('@prisma/client'); // Import enum jika perlu validasi
const prisma = new PrismaClient();

// Mendapatkan semua data pelatihan (dengan filter & pagination sederhana - opsional)
const getAllTrainings = async (req, res) => {
    // Contoh basic filter (bisa dikembangkan)
    const { category, status, month, year, search } = req.query;
    const where = {};

    if (category) where.category = category;
    if (status && Object.values(TrainingStatus).includes(status.toUpperCase())) {
        where.status = status.toUpperCase();
    }
    if (search) {
         where.name = { contains: search, mode: 'insensitive' }; // Case-insensitive search
    }
    // Filter by month/year (contoh sederhana, perlu penyesuaian lebih lanjut)
    if (month && year) {
        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        const endDate = new Date(parseInt(year), parseInt(month), 0); // Last day of the month
         where.OR = [ // Bisa mulai atau berakhir di bulan tsb
            { startDate: { gte: startDate, lte: endDate } },
            { endDate: { gte: startDate, lte: endDate } }
        ];
    } else if (year) {
        // Filter by year only if needed
    }


    try {
        const trainings = await prisma.training.findMany({
            where,
            orderBy: { createdAt: 'desc' }, // Urutkan berdasarkan terbaru
             include: { // Hitung jumlah peserta untuk setiap pelatihan
                 _count: {
                   select: { participants: true },
                 },
             },
        });

         // Map data untuk menyertakan participant count
         const formattedTrainings = trainings.map(t => ({
             ...t,
             participantCount: t._count.participants,
             _count: undefined // Hapus _count asli
         }));


        const total = await prisma.training.count({ where });

        res.status(200).json({ total, data: formattedTrainings });
    } catch (error) {
        console.error("Get all trainings error:", error);
        res.status(500).json({ message: 'Gagal mengambil data pelatihan.' });
    }
};

// Mendapatkan detail satu pelatihan
const getTrainingById = async (req, res) => {
    const { id } = req.params;
    try {
        const training = await prisma.training.findUnique({
            where: { id: parseInt(id) },
             include: { // Sertakan juga data pesertanya
                 participants: {
                     orderBy: { createdAt: 'asc' }
                 },
             },
        });
        if (!training) {
            return res.status(404).json({ message: 'Pelatihan tidak ditemukan.' });
        }
        res.status(200).json(training);
    } catch (error) {
         console.error("Get training by ID error:", error);
        res.status(500).json({ message: 'Gagal mengambil detail pelatihan.' });
    }
};

// Membuat pelatihan baru
const createTraining = async (req, res) => {
    const { name, category, startDate, endDate, batch, status } = req.body;

    // Validasi dasar
    if (!name || !category || !startDate || !endDate || !batch) {
         return res.status(400).json({ message: 'Semua field wajib diisi: name, category, startDate, endDate, batch.' });
    }

    try {
        const newTraining = await prisma.training.create({
            data: {
                name,
                category,
                startDate: new Date(startDate), // Pastikan format tanggal benar
                endDate: new Date(endDate),
                batch: parseInt(batch),
                status: status ? status.toUpperCase() : TrainingStatus.PLANNED, // Default PLANNED jika tidak ada
            },
        });
        res.status(201).json({ message: 'Pelatihan berhasil dibuat', data: newTraining });
    } catch (error) {
        console.error("Create training error:", error);
         // Cek error spesifik (misal: constraint violation) jika perlu
         if (error.code === 'P2002') { // Kode error Prisma untuk unique constraint violation
             return res.status(400).json({ message: `Error: ${error.meta?.target}` }); // Target akan memberitahu field mana yg error
         }
        res.status(500).json({ message: 'Gagal membuat pelatihan.' });
    }
};

// Mengupdate data pelatihan
const updateTraining = async (req, res) => {
    const { id } = req.params;
    const { name, category, startDate, endDate, batch, status } = req.body;

    try {
        const trainingToUpdate = await prisma.training.findUnique({ where: { id: parseInt(id) } });
         if (!trainingToUpdate) {
             return res.status(404).json({ message: 'Pelatihan tidak ditemukan.' });
         }

        const updatedTraining = await prisma.training.update({
            where: { id: parseInt(id) },
            data: {
                name: name ?? trainingToUpdate.name, // Gunakan nilai baru atau lama jika tidak disediakan
                category: category ?? trainingToUpdate.category,
                startDate: startDate ? new Date(startDate) : trainingToUpdate.startDate,
                endDate: endDate ? new Date(endDate) : trainingToUpdate.endDate,
                batch: batch ? parseInt(batch) : trainingToUpdate.batch,
                status: status ? status.toUpperCase() : trainingToUpdate.status,
            },
        });
        res.status(200).json({ message: 'Pelatihan berhasil diperbarui', data: updatedTraining });
    } catch (error) {
         console.error("Update training error:", error);
        res.status(500).json({ message: 'Gagal memperbarui pelatihan.' });
    }
};

// Menghapus pelatihan
const deleteTraining = async (req, res) => {
    const { id } = req.params;
    try {
         const trainingToDelete = await prisma.training.findUnique({ where: { id: parseInt(id) } });
         if (!trainingToDelete) {
             return res.status(404).json({ message: 'Pelatihan tidak ditemukan.' });
         }

         // Hati-hati: Menghapus pelatihan akan menghapus pesertanya juga karena onDelete: Cascade
        await prisma.training.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({ message: 'Pelatihan berhasil dihapus' }); // atau 204 No Content
    } catch (error) {
         console.error("Delete training error:", error);
        res.status(500).json({ message: 'Gagal menghapus pelatihan.' });
    }
};

module.exports = {
    getAllTrainings,
    getTrainingById,
    createTraining,
    updateTraining,
    deleteTraining,
};