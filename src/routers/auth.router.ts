import { Hono } from "hono";
import signupSchema from "../schema/signup.schema";
import { validator } from "hono/validator";
import prisma from "../helper/prisma-client";
import { comparePassword, hashPassword } from "../helper/password-handler";
import { signToken } from "../helper/jwt";
import loginSchema from "../schema/login.schema";
const authRouter = new Hono();

authRouter.post("/", validator('json', (value, ctx) => {
    let parsed = signupSchema.safeParse(value);
    if (!parsed.success) {
        return ctx.json(parsed.error, 400);
    }
    return parsed.data
}), async (c) => {
    let data = c.req.valid("json");
    let checkUser = await prisma.user.findUnique({
        where: {
            email: data.email
        }
    })
    if (checkUser) {
        return c.json({ message: "User already exists" })
    }
    let hashedPassword = await hashPassword(data.password);
    let user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword
        }
    })
    let payload = {
        id: user.id,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + 60 * 60
    }
    let token = signToken(payload, process.env.JWT_SECRET!);
    return c.json({ data: { user, token }, message: "User created" })
});

authRouter.post("/login", validator('json', (value, ctx) => {
    let parsed = loginSchema.safeParse(value);
    if (!parsed.success) {
        return ctx.json(parsed.error, 400);
    }
    return parsed.data
}), async (c) => {
    let data = c.req.valid("json");
    let checkUser = await prisma.user.findUnique({
        where: {
            email: data.email
        }
    })
    if (!checkUser) {
        return c.json({ message: "User not found" })
    }
    let checkPassword = await comparePassword(data.password, checkUser.password);
    if (!checkPassword) {
        return c.json({ message: "Invalid password" })
    }
    let payload = {
        id: checkUser.id,
        email: checkUser.email,
        exp: Math.floor(Date.now() / 1000) + 60 * 60
    }

    let token = signToken(payload, process.env.JWT_SECRET!);
    return c.json({ data: { user: checkUser, token }, message: "User logged in" })

});

export default authRouter