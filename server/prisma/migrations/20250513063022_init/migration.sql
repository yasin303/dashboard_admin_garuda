-- CreateEnum
CREATE TYPE "TrainingStatus" AS ENUM ('PLANNED', 'RUNNING', 'CHECKING', 'RESCHEDULE', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'DP', 'WARM', 'LUNAS');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('PENDING', 'INPUT', 'CLAIM', 'VERIFIED', 'REJECTED', 'BELUM');

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Training" (
    "id" SERIAL NOT NULL,
    "nama_pelatihan" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "periode_mulai" TIMESTAMP(3) NOT NULL,
    "periode_selesai" TIMESTAMP(3) NOT NULL,
    "batch" INTEGER NOT NULL,
    "status" "TrainingStatus" NOT NULL DEFAULT 'PLANNED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Training_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" SERIAL NOT NULL,
    "nomor_registrasi" TEXT,
    "nama_peserta" TEXT NOT NULL,
    "notes" TEXT,
    "status_pembayaran" "PaymentStatus" NOT NULL,
    "status_dokumen" "DocumentStatus" NOT NULL,
    "sales" TEXT,
    "pelatihan_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_nomor_registrasi_key" ON "Participant"("nomor_registrasi");

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_pelatihan_id_fkey" FOREIGN KEY ("pelatihan_id") REFERENCES "Training"("id") ON DELETE CASCADE ON UPDATE CASCADE;
