const { PrismaClient, PaymentStatus, DocumentStatus } = require('@prisma/client');
const prisma = new PrismaClient();

const formatTrainingName = (training) =>
  training ? `${training.name} ${training.startDate.toLocaleDateString('id-ID')} - ${training.endDate.toLocaleDateString('id-ID')}` : 'N/A';

const getAllTransactions = async (req, res) => {
  try {
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

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          training: {
            select: { id: true, name: true, startDate: true, endDate: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.transaction.count({ where })
    ]);

    const formattedData = transactions.map(t => ({
      ...t,
      trainingName: formatTrainingName(t.training),
      training: undefined
    }));

    res.status(200).json({ total, data: formattedData });
  } catch (error) {
    console.error("Get all transactions error:", error);
    res.status(500).json({ message: 'Gagal mengambil data transaksi.' });
  }
};

const getTransactionById = async (req, res) => {
  const { id } = req.params;
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: parseInt(id) },
      include: { training: true }
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan.' });
    }

    res.status(200).json(transaction);
  } catch (error) {
    console.error("Get transaction by ID error:", error);
    res.status(500).json({ message: 'Gagal mengambil detail transaksi.' });
  }
};

const createTransaction = async (req, res) => {
  try {
    const {
      participantName,
      notes,
      sales,
      trainingId,
      paymentMethod,
      amount,
      status,
      proofUrl
    } = req.body;

    if (!participantName || !trainingId || !paymentMethod || !amount || !status) {
      return res.status(400).json({
        message: 'Field wajib: participantName, trainingId, paymentMethod, amount, status.'
      });
    }

    const training = await prisma.training.findUnique({
      where: { id: parseInt(trainingId) }
    });

    if (!training) {
      return res.status(400).json({ message: `Pelatihan dengan ID ${trainingId} tidak ditemukan.` });
    }

    const participant = await prisma.participant.create({
      data: {
        name: participantName,
        trainingId: parseInt(trainingId),
        paymentStatus: status.toUpperCase(),
        documentStatus: DocumentStatus.BELUM,
        sales
      }
    });

    const newTransaction = await prisma.transaction.create({
      data: {
        code: `TRX-${Date.now()}`,
        participantId: participant.id,
        trainingId: parseInt(trainingId),
        method: paymentMethod.toUpperCase(),
        amount: parseFloat(amount),
        status: status.toUpperCase(),
        proofUrl,
        notes
      },
      include: {
        training: true,
        participant: true
      }
    });

    res.status(201).json({ message: 'Transaksi berhasil dibuat', data: newTransaction });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ message: 'Gagal membuat transaksi.' });
  }
};

const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { name, notes, paymentStatus, documentStatus, sales, trainingId } = req.body;

  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: parseInt(id) }
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan.' });
    }

    if (trainingId && parseInt(trainingId) !== transaction.trainingId) {
      const training = await prisma.training.findUnique({
        where: { id: parseInt(trainingId) }
      });
      if (!training) {
        return res.status(400).json({ message: `Pelatihan dengan ID ${trainingId} tidak ditemukan.` });
      }
    }

    const updated = await prisma.transaction.update({
      where: { id: parseInt(id) },
      data: {
        name: name ?? transaction.name,
        notes: notes ?? transaction.notes,
        paymentStatus: paymentStatus ? paymentStatus.toUpperCase() : transaction.paymentStatus,
        documentStatus: documentStatus ? documentStatus.toUpperCase() : transaction.documentStatus,
        sales: sales ?? transaction.sales,
        trainingId: trainingId ? parseInt(trainingId) : transaction.trainingId
      },
      include: { training: true }
    });

    res.status(200).json({ message: 'Transaksi berhasil diperbarui', data: updated });
  } catch (error) {
    console.error("Update transaction error:", error);
    res.status(500).json({ message: 'Gagal memperbarui transaksi.' });
  }
};

const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: parseInt(id) }
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan.' });
    }

    await prisma.transaction.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({ message: 'Transaksi berhasil dihapus' });
  } catch (error) {
    console.error("Delete transaction error:", error);
    res.status(500).json({ message: 'Gagal menghapus transaksi.' });
  }
};

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction
};
