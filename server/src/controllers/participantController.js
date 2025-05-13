// src/controllers/participantController.js
const { PrismaClient, PaymentStatus, DocumentStatus } = require('@prisma/client');
const prisma = new PrismaClient();

// Fungsi helper untuk generate ID registrasi (contoh)
// Anda bisa membuatnya lebih kompleks sesuai format yg diinginkan
const generateRegistrationId = async (trainingId) => {
    const date = new Date();
    const year = date.getFullYear();
    // Hitung jumlah peserta di training ini untuk nomor urut
    const count = await prisma.participant.count({ where: { trainingId } });
    // Format: PREFIX/TRAINING_ID/COUNT+1/YEAR (sesuaikan)
    return `DATA/CSI/${count + 1}/${year}`;
}

// Mendapatkan semua peserta (dengan filter & pagination sederhana)
const getAllParticipants = async (req, res) => {
    const { trainingId, paymentStatus, documentStatus, search } = req.query;
    const where = {};

    if (trainingId) where.trainingId = parseInt(trainingId);
    if (paymentStatus && Object.values(PaymentStatus).includes(paymentStatus.toUpperCase())) {
        where.paymentStatus = paymentStatus.toUpperCase();
    }
    if (documentStatus && Object.values(DocumentStatus).includes(documentStatus.toUpperCase())) {
        where.documentStatus = documentStatus.toUpperCase();
    }
     if (search) {
         where.OR = [ // Cari berdasarkan nama atau nomor registrasi
             { name: { contains: search, mode: 'insensitive' } },
             { registrationId: { contains: search, mode: 'insensitive' } }
         ];
     }

    try {
        const participants = await prisma.participant.findMany({
            where,
            include: { // Sertakan detail pelatihan
               training: {
                   select: { id: true, name: true, startDate: true, endDate: true } // Pilih field yg relevan
               }
            },
            orderBy: { createdAt: 'desc' },
        });

        const total = await prisma.participant.count({ where });

         // Map data agar sesuai tampilan frontend (termasuk nama training)
         const formattedParticipants = participants.map(p => ({
             ...p,
             trainingName: p.training ? `${p.training.name} ${p.training.startDate.toLocaleDateString('id-ID')} - ${p.training.endDate.toLocaleDateString('id-ID')}` : 'N/A',
             training: undefined // Hapus objek training asli jika tidak perlu
         }));


        res.status(200).json({ total, data: formattedParticipants });
    } catch (error) {
        console.error("Get all participants error:", error);
        res.status(500).json({ message: 'Gagal mengambil data peserta.' });
    }
};

// Mendapatkan detail satu peserta
const getParticipantById = async (req, res) => {
    const { id } = req.params;
    try {
        const participant = await prisma.participant.findUnique({
            where: { id: parseInt(id) },
             include: { training: true } // Sertakan detail pelatihan
        });
        if (!participant) {
            return res.status(404).json({ message: 'Peserta tidak ditemukan.' });
        }
        res.status(200).json(participant);
    } catch (error) {
         console.error("Get participant by ID error:", error);
        res.status(500).json({ message: 'Gagal mengambil detail peserta.' });
    }
};

// Membuat peserta baru
const createParticipant = async (req, res) => {
    const {
        name,
        notes,
        paymentStatus,
        documentStatus,
        sales,
        trainingId // ID Pelatihan yang diikuti
    } = req.body;

    if (!name || !paymentStatus || !documentStatus || !trainingId) {
        return res.status(400).json({ message: 'Field wajib: name, paymentStatus, documentStatus, trainingId.' });
    }

    try {
        // 1. Cek apakah trainingId valid
        const trainingExists = await prisma.training.findUnique({ where: { id: parseInt(trainingId) } });
        if (!trainingExists) {
            return res.status(400).json({ message: `Pelatihan dengan ID ${trainingId} tidak ditemukan.` });
        }

        // 2. (Opsional) Generate ID Registrasi
        const regId = await generateRegistrationId(parseInt(trainingId));


        const newParticipant = await prisma.participant.create({
            data: {
                name,
                notes,
                paymentStatus: paymentStatus.toUpperCase(),
                documentStatus: documentStatus.toUpperCase(),
                sales,
                trainingId: parseInt(trainingId),
                registrationId: regId, // Simpan ID registrasi yang digenerate
            },
            include: { training: true } // Sertakan data training di response
        });
        res.status(201).json({ message: 'Peserta berhasil ditambahkan', data: newParticipant });
    } catch (error) {
         console.error("Create participant error:", error);
          if (error.code === 'P2002' && error.meta?.target?.includes('registrationId')) {
             return res.status(400).json({ message: 'Gagal generate ID registrasi unik, coba lagi.' });
         }
        res.status(500).json({ message: 'Gagal menambahkan peserta.' });
    }
};

// Mengupdate data peserta
const updateParticipant = async (req, res) => {
    const { id } = req.params;
    const { name, notes, paymentStatus, documentStatus, sales, trainingId } = req.body;

    try {
         const participantToUpdate = await prisma.participant.findUnique({ where: { id: parseInt(id) } });
         if (!participantToUpdate) {
             return res.status(404).json({ message: 'Peserta tidak ditemukan.' });
         }

        // Jika trainingId diubah, cek apakah training baru valid
        if (trainingId && parseInt(trainingId) !== participantToUpdate.trainingId) {
             const trainingExists = await prisma.training.findUnique({ where: { id: parseInt(trainingId) } });
             if (!trainingExists) {
                 return res.status(400).json({ message: `Pelatihan dengan ID ${trainingId} tidak ditemukan.` });
             }
        }

        const updatedParticipant = await prisma.participant.update({
            where: { id: parseInt(id) },
            data: {
                name: name ?? participantToUpdate.name,
                notes: notes ?? participantToUpdate.notes,
                paymentStatus: paymentStatus ? paymentStatus.toUpperCase() : participantToUpdate.paymentStatus,
                documentStatus: documentStatus ? documentStatus.toUpperCase() : participantToUpdate.documentStatus,
                sales: sales ?? participantToUpdate.sales,
                trainingId: trainingId ? parseInt(trainingId) : participantToUpdate.trainingId,
                // registrationId tidak diupdate biasanya
            },
             include: { training: true }
        });
        res.status(200).json({ message: 'Data peserta berhasil diperbarui', data: updatedParticipant });
    } catch (error) {
         console.error("Update participant error:", error);
        res.status(500).json({ message: 'Gagal memperbarui data peserta.' });
    }
};

// Menghapus peserta
const deleteParticipant = async (req, res) => {
    const { id } = req.params;
    try {
         const participantToDelete = await prisma.participant.findUnique({ where: { id: parseInt(id) } });
         if (!participantToDelete) {
             return res.status(404).json({ message: 'Peserta tidak ditemukan.' });
         }

        await prisma.participant.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({ message: 'Peserta berhasil dihapus' }); // atau 204 No Content
    } catch (error) {
         console.error("Delete participant error:", error);
        res.status(500).json({ message: 'Gagal menghapus peserta.' });
    }
};

module.exports = {
    getAllParticipants,
    getParticipantById,
    createParticipant,
    updateParticipant,
    deleteParticipant,
};