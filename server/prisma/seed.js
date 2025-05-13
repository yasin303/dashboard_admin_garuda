// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../src/utils/password'); // Sesuaikan path jika perlu

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    const adminEmail = 'admin@mail.com'; // Ganti dengan email admin Anda
    const adminPassword = 'password123';    // Ganti dengan password admin awal
    const adminName = 'Admin Utama';
    

    // Hash password sebelum disimpan
    const hashedPassword = await hashPassword(adminPassword);

    // Hapus admin lama jika ada (untuk idempotency)
    await prisma.admin.deleteMany({ where: { email: adminEmail } });

    // Buat admin baru
    const admin = await prisma.admin.create({
        data: {
            email: adminEmail,
            password: hashedPassword,
            name: adminName,
        },
    });

    console.log(`Created admin user with id: ${admin.id} and email: ${admin.email}`);

    // Anda bisa menambahkan data seed lain di sini (misal: contoh pelatihan)
    // const training1 = await prisma.training.create({ ... });
    // const participant1 = await prisma.participant.create({ ... });

    console.log('Seeding finished.');
}

main()
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });