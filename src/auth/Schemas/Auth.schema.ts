import { z } from "zod";

export const authSchemaUser = z.object({
  email: z.email(),
  password: z.string(),
});
