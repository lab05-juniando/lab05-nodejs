import { z } from "zod";

export const userSettingsSchema = z.object({
  theme: z.enum(["LIGHT", "DARK", "SYSTEM"]).optional(),
  language: z.string().min(2).max(10).optional(),
  currency: z.string().length(3).toUpperCase().optional(),
  notifications: z.boolean().optional(),
});

export const companySettingsSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  cnpj: z.string().length(14).regex(/^\d+$/).nullable().optional(),
});

export const updateSettingsSchema = z
  .object({
    settings: userSettingsSchema.optional(),
    company: companySettingsSchema.optional(),
  })
  .refine((data) => data.settings !== undefined || data.company !== undefined, {
    message: "Informe settings ou company para atualizar",
  });

export type UpdateSettingsData = z.infer<typeof updateSettingsSchema>;
export type UserSettingsData = z.infer<typeof userSettingsSchema>;
export type CompanySettingsData = z.infer<typeof companySettingsSchema>;
