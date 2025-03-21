import { PrismaClient } from '@prisma/client'
import {
  defineEventHandler,
  readBody,
  getQuery,
  getMethod,
  getRequestURL,
  createError
} from 'h3'
import { createJWT } from '../../utils/jwt' // собственная реализация (см. ниже)

// Безопасная инициализация Prisma
let prisma: PrismaClient | null = null
try {
  prisma = new PrismaClient()
  console.log('✅ Prisma connected successfully')
} catch (error) {
  console.error('❌ Prisma failed to initialize:', error)
  prisma = null
}

// Мок-данные
const mockUsers = [
  { id: 1, username: 'mock_admin', email: 'mock_admin@example.com', password: 'admin123' },
  { id: 2, username: 'mock_developer', email: 'mock_dev@example.com', password: 'dev123' }
]

const JWT_SECRET = 'your_jwt_secret'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const url = getRequestURL(event).pathname

  // LOGIN
  if (method === 'POST' && url === '/api/login') {
    const { username, password } = await readBody(event)

    if (!username || !password) {
      throw createError({ statusCode: 400, message: 'Username and password are required' })
    }

    const user = prisma
      ? await prisma.Users.findUnique({ where: { username } })
      : mockUsers.find(u => u.username === username)

    if (user && user.password === password) {
      const token = await createJWT({ id: user.id, username: user.username }, JWT_SECRET)
      return { token }
    }

    throw createError({ statusCode: 401, message: 'Invalid credentials' })
  }

  // GET USERS
  if (method === 'GET') {
    if (!prisma) {
      console.warn('⚠️ Using mock data because Prisma is unavailable')
      return mockUsers
    }

    try {
      return await prisma.Users.findMany()
    } catch (error) {
      console.error('⚠️ Prisma query error:', error)
      prisma = null
      return mockUsers
    }
  }

  // CREATE USER
  if (method === 'POST') {
    const body = await readBody(event)
    const { username, email, password } = body

    if (!username || !email || !password) {
      throw createError({
        statusCode: 400,
        message: 'Username, email, and password are required',
      })
    }

    if (!prisma) {
      const newUser = { id: mockUsers.length + 1, ...body }
      mockUsers.push(newUser)
      return newUser
    }

    try {
      return await prisma.Users.create({ data: body })
    } catch (error) {
      console.error('⚠️ Prisma create error:', error)
      throw createError({ statusCode: 500, message: 'Database error' })
    }
  }

  // UPDATE USER
  if (method === 'PUT') {
    const { id, username, email } = await readBody(event)

    if (!id) {
      throw createError({ statusCode: 400, message: 'User ID is required' })
    }

    if (!prisma) {
      const user = mockUsers.find(u => u.id === id)
      if (user) {
        user.username = username || user.username
        user.email = email || user.email
        return user
      }
      return { error: 'User not found' }
    }

    try {
      return await prisma.Users.update({
        where: { id: Number(id) },
        data: { username, email },
      })
    } catch (error) {
      console.error('⚠️ Prisma update error:', error)
      throw createError({ statusCode: 500, message: 'Error updating user' })
    }
  }

  // DELETE USER
  if (method === 'DELETE') {
    const query = getQuery(event)
    const userId = Number(query.id)

    if (!userId) {
      throw createError({ statusCode: 400, message: 'User ID is required' })
    }

    if (!prisma) {
      const index = mockUsers.findIndex(u => u.id === userId)
      if (index !== -1) {
        return mockUsers.splice(index, 1)[0]
      }
      return { error: 'User not found' }
    }

    try {
      return await prisma.Users.delete({ where: { id: userId } })
    } catch (error) {
      console.error('⚠️ Prisma delete error:', error)
      throw createError({ statusCode: 500, message: 'Error deleting user' })
    }
  }

  throw createError({ statusCode: 405, message: 'Method Not Allowed' })
})
