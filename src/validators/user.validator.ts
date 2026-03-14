import { z } from "zod";

export const createUserSchema = z.object({

 email: z.string().email(),

 password: z.string().min(6),

 name: z.string().min(2),

 age: z.number().min(10).max(120),

 gender: z.enum(["male", "female", "other"])

});