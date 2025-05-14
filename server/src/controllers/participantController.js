// src/controllers/participantController.js
const { PrismaClient, PaymentStatus, DocumentStatus } = require('@prisma/client');
const prisma = new PrismaClient();

const generateRegistrationId = async (trainingId) => {
    const date = new Date();
    const year = date.getFullYear();
    const count = await prisma.participant.count({ where: { trainingId } });
    return `DATA/CSI/${count + 1}/${year}`;
}

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
         where.OR = [ 
             { name: { contains: search, mode: 'insensitive' } },
             { registrationId: { contains: search, mode: 'insensitive' } }
         ];
     }

    try {
        const participants = await prisma.participant.findMany({
            where,
            include: { 
               training: {
                   select: { id: true, name: true, startDate: true, endDate: true } 
               }
            },
            orderBy: { createdAt: 'desc' },
        });

        const total = await prisma.participant.count({ where });
         
         const formattedParticipants = participants.map(p => ({
             ...p,
             trainingName: p.training ? `${p.training.name} ${p.training.startDate.toLocaleDateString('id-ID')} - ${p.training.endDate.toLocaleDateString('id-ID')}` : 'N/A',
             training: undefined 
         }));

        res.status(200).json({ total, data: formattedParticipants });
    } catch (error) {
        console.error("Get all participants error:", error);
        res.status(500).json({ message: 'Gagal mengambil data peserta.' });
    }
};

const getParticipantById = async (req, res) => {
    const { id } = req.params;
    try {
        const participant = await prisma.participant.findUnique({
            where: { id: parseInt(id) },
             include: { training: true } 
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

const createParticipant = async (req, res) => {
    const {
        name,
        notes,
        paymentStatus,
        documentStatus,
        sales,
        trainingId 
    } = req.body;

    if (!name || !paymentStatus || !documentStatus || !trainingId) {
        return res.status(400).json({ message: 'Field wajib: name, paymentStatus, documentStatus, trainingId.' });
    }

    try {        
        const trainingExists = await prisma.training.findUnique({ where: { id: parseInt(trainingId) } });
        if (!trainingExists) {
            return res.status(400).json({ message: `Pelatihan dengan ID ${trainingId} tidak ditemukan.` });
        }

        const regId = await generateRegistrationId(parseInt(trainingId));
        const newParticipant = await prisma.participant.create({
            data: {
                name,
                notes,
                paymentStatus: paymentStatus.toUpperCase(),
                documentStatus: documentStatus.toUpperCase(),
                sales,
                trainingId: parseInt(trainingId),
                registrationId: regId, 
            },
            include: { training: true } 
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

const updateParticipant = async (req, res) => {
    const { id } = req.params;
    const { name, notes, paymentStatus, documentStatus, sales, trainingId } = req.body;

    try {
         const participantToUpdate = await prisma.participant.findUnique({ where: { id: parseInt(id) } });
         if (!participantToUpdate) {
             return res.status(404).json({ message: 'Peserta tidak ditemukan.' });
         }
        
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
            },
             include: { training: true }
        });
        res.status(200).json({ message: 'Data peserta berhasil diperbarui', data: updatedParticipant });
    } catch (error) {
         console.error("Update participant error:", error);
        res.status(500).json({ message: 'Gagal memperbarui data peserta.' });
    }
};

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
        res.status(200).json({ message: 'Peserta berhasil dihapus' }); 
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