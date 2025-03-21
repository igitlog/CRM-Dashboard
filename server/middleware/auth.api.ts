import { defineEventHandler, getCookie, createError } from 'h3'
import { verifyJWT } from '../../utils/jwt'

const JWT_SECRET = 'your_jwt_secret'

export default defineEventHandler(async (event) => {
  const url = event.node.req.url || ''

  // Разрешаем /login без токена
  if (url.startsWith('/login') || url.startsWith('/api/login')) return

  const token = getCookie(event, 'token')

  if (!token) {
    event.node.res.writeHead(302, {
      'Location': '/login'
    })
    event.node.res.end()
    // Можно просто 401 без редиректа — клиент сам обработает
    throw createError({ statusCode: 401, message: 'No token provided' })
  }

  const decoded = await verifyJWT(token, JWT_SECRET)

  if (!decoded) {
    throw createError({ statusCode: 401, message: 'Invalid token' })
  }

  event.context.user = decoded
})
