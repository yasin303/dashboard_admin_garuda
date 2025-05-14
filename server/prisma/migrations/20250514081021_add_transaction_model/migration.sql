-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('TRANSFER', 'QRIS', 'CASH', 'VIRTUAL_ACCOUNT', 'CREDIT_CARD', 'OTHER');

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "kode_transaksi" TEXT NOT NULL,
    "peserta_id" INTEGER NOT NULL,
    "pelatihan_id" INTEGER NOT NULL,
    "metode_pembayaran" "PaymentMethod" NOT NULL,
    "jumlah_pembayaran" DECIMAL(65,30) NOT NULL,
    "status_pembayaran" "PaymentStatus" NOT NULL,
    "bukti_pembayaran" TEXT,
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_kode_transaksi_key" ON "Transaction"("kode_transaksi");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_peserta_id_fkey" FOREIGN KEY ("peserta_id") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_pelatihan_id_fkey" FOREIGN KEY ("pelatihan_id") REFERENCES "Training"("id") ON DELETE CASCADE ON UPDATE CASCADE;
