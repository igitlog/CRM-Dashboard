import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.users.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com', // ✅ Добавили email
      password: 'admin', // ❗️ Лучше использовать хэш
    },
  });

  await prisma.users.upsert({
    where: { username: 'developer' },
    update: {},
    create: {
      username: 'developer',
      email: 'developer@example.com', // ✅ Добавили email
      password: 'dev_password', // ❗️ Лучше использовать хэш
    },
  });
}

main()
  .catch((e) => {
    console.error('❌ Ошибка в seed.ts:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
