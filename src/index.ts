import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import authRouter from './routers/auth.router'

const app = new Hono()

app.use('*', cors(), logger())

app.route("/auth", authRouter)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
