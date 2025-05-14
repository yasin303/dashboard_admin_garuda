// prisma/seed.js
const { PrismaClient, Role } = require('@prisma/client'); 
const { hashPassword } = require('../src/utils/password');

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    const usersToSeed = [
        {
            email: 'administrator@mail.com',
            password: 'administrator123',
            name: 'Super Admin',
            role: Role.ADMINISTRATOR,
        },
        {
            email: 'admin@mail.com',
            password: 'admin123',
            name: 'Admin',
            role: Role.ADMIN,
        },
        {
            email: 'finance@mail.com',
            password: 'finance123',
            name: 'Finance',
            role: Role.FINANCE,
        },
        {
            email: 'sales@mail.com',
            password: 'sales123',
            name: 'Sales',
            role: Role.SALES,
        },
    ];

    for (const userData of usersToSeed) {
        const hashedPassword = await hashPassword(userData.password);
        await prisma.admin.deleteMany({ where: { email: userData.email } });

        const admin = await prisma.admin.create({
            data: {
                email: userData.email,
                password: hashedPassword,
                name: userData.name,
                role: userData.role,
            },
        });
        console.log(`Created admin user: ${admin.email} with role: ${admin.role}`);
    }

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