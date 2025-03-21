import { defineEventHandler, readBody, setCookie, createError } from 'h3'
import { createJWT } from '../../utils/jwt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const JWT_SECRET = 'your_jwt_secret'

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event)

  const user = await prisma.Users.findUnique({ where: { username } })

  if (!user || user.password !== password) {
    throw createError({ statusCode: 401, message: 'Invalid credentials' })
  }

  const token = await createJWT(
    { id: user.id, username: user.username },
    JWT_SECRET
  )

  // Устанавливаем токен в cookie
  setCookie(event, 'token', token, {
    // httpOnly: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60, // 1 час
  })

  return { success: true }
})
