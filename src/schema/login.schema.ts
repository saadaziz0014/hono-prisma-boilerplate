import { z } from "zod";


const loginSchema = z.object({
    email: z
        .string()
        .transform((email) => email.toLowerCase()),
    password: z
        .string()
});

export default loginSchema