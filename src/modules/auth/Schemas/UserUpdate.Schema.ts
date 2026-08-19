import { z } from "zod";

export const updateUserSchema = z
  .object({
    name: z.string().min(3).max(100).optional(),
    email: z.email().optional(),
    password: z.string().min(6).max(100).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Pelo menos um campo deve ser preenchido.",
  });
