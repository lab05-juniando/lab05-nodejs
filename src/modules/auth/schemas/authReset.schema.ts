import { z } from "zod";

export const forgotPasswordSchema  = z.object({
  email: z.string().email("Email inválido"),
});


export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token é obrigatório"),
  newPassword: z.string().min(4),
});
