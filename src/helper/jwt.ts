import { sign, verify } from 'hono/jwt'

const signToken = (payload: any, key: string) => {
    return sign(payload, key)
}

const verifyToken = (token: string, key: string) => {
    return verify(token, key)
}

export { signToken, verifyToken }