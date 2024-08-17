import { z } from "zod";

const signupSchema = z.object({
    name: z
        .string()
        .min(1, { message: "Name is required" })
        .max(100, { message: "Name is too long" }),
    email: z
        .string()
        .email({ message: "Invalid email" })
        .transform((email) => email.toLowerCase()),
    password: z
        .string()
        .min(1, { message: "Password is required" })
        .max(100, { message: "Password is too long" }),
});

export default signupSchema