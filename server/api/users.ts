import { PrismaClient } from '@prisma/client';
import { defineEventHandler, readBody, getQuery, createError } from 'h3';

// Безопасная инициализация Prisma
let prisma: PrismaClient | null = null;
try {
    prisma = new PrismaClient();
    console.log('✅ Prisma connected successfully');
} catch (error) {
    console.error('❌ Prisma failed to initialize:', error);
    prisma = null;  // Если не подключилось, работаем с мок-данными
}

// Мок-данные
const mockUsers = [
    { id: 1, username: 'mock_admin', email: 'mock_admin@example.com', password: 'admin123' },
    { id: 2, username: 'mock_developer', email: 'mock_dev@example.com', password: 'dev123' }
];

export default defineEventHandler(async (event) => {
    const method = event.node.req.method;

    try {
        if (method === 'GET') {
            if (!prisma) {
                console.warn('⚠️ Using mock data because Prisma is unavailable');
                return mockUsers;
            }

            try {
                return await prisma.Users.findMany();
            } catch (error) {
                console.error('⚠️ Prisma query error:', error);
                prisma = null; // Отключаем Prisma при сбое
                console.warn('⚠️ Switching to mock data.');
                return mockUsers;
            }
        }

        if (method === 'POST') {
            const body = await readBody(event);
            if (!prisma) {
                console.warn('⚠️ Cannot save to DB, adding to mock data');
                const newUser = { id: mockUsers.length + 1, ...body };
                mockUsers.push(newUser);
                return newUser;
            }

            try {
                return await prisma.Users.create({ data: body });
            } catch (error) {
                console.error('⚠️ Prisma query error:', error);
                return createError({ statusCode: 500, message: 'Database error' });
            }
        }

        if (method === 'PUT') {
            const body = await readBody(event);
            console.log('Received PUT request:', body);
        
            const { id, username, email } = body;
        
            if (!id) {
                console.error('Error: Missing user ID');
                throw createError({
                    statusCode: 400,
                    message: 'User ID is required',
                });
            }

            if (!prisma) {
                console.warn('⚠️ Cannot update in DB, updating mock data');
                const user = mockUsers.find(u => u.id === id);
                if (user) {
                    user.username = username || user.username;
                    user.email = email || user.email;
                }
                return user || { error: 'User not found' };
            }

            try {
                return await prisma.Users.update({
                    where: { id: Number(id) },
                    data: { username, email },
                });
            } catch (error) {
                console.error('⚠️ Prisma update error:', error);
                return createError({ statusCode: 500, message: 'Error updating user' });
            }
        }

        if (method === 'DELETE') {
            const query = getQuery(event);
            const userId = Number(query.id);

            if (!prisma) {
                console.warn('⚠️ Cannot delete from DB, removing from mock data');
                const index = mockUsers.findIndex(u => u.id === userId);
                if (index !== -1) {
                    return mockUsers.splice(index, 1)[0];
                }
                return { error: 'User not found' };
            }

            try {
                return await prisma.Users.delete({
                    where: { id: userId },
                });
            } catch (error) {
                console.error('⚠️ Prisma delete error:', error);
                return createError({ statusCode: 500, message: 'Error deleting user' });
            }
        }

    } catch (error) {
        console.error('⚠️ API Error:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: 'An error occurred while processing the request.',
        });
    }
});
