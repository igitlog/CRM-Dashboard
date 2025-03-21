// utils/jwt.ts
const encoder = new TextEncoder()
const decoder = new TextDecoder()

const base64url = (input: Uint8Array | string) =>
  btoa(typeof input === 'string' ? input : String.fromCharCode(...input))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

const base64urlDecode = (input: string) => {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=')
  return JSON.parse(decoder.decode(Uint8Array.from(atob(padded), c => c.charCodeAt(0))))
}

export async function createJWT(payload: object, secret: string, expiresIn = 3600) {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  }

  const now = Math.floor(Date.now() / 1000)
  const body = {
    ...payload,
    iat: now,
    exp: now + expiresIn,
  }

  const headerBase = base64url(JSON.stringify(header))
  const payloadBase = base64url(JSON.stringify(body))
  const data = `${headerBase}.${payloadBase}`

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
  const signatureBase = base64url(new Uint8Array(signature))

  return `${data}.${signatureBase}`
}

export async function verifyJWT(token: string, secret: string) {
  const [header, payload, signature] = token.split('.')
  const data = `${header}.${payload}`

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  )

  const valid = await crypto.subtle.verify(
    'HMAC',
    key,
    Uint8Array.from(atob(signature.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)),
    encoder.encode(data)
  )

  if (!valid) return null

  const decoded = base64urlDecode(payload)
  const now = Math.floor(Date.now() / 1000)
  if (decoded.exp && decoded.exp < now) return null

  return decoded
}