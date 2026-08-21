import { z } from "zod";

export const registerSchema = z.object({
  company: z.object({
    name: z.string().min(2).max(100),
    cnpj: z.string().length(14).regex(/^\d+$/),
  }),

  user: z.object({
    name: z.string().min(3).max(100),
    email: z.email(),
    password: z.string().min(4),
    role: z.enum(["ADMIN", "USER"]),
  }),
});
