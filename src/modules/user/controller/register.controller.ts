import { Request, Response } from "express";

import { registerSchema } from "@/modules/user/schemas/register.schema";
import { register } from "@/modules/user/services/register.service";
import { AppError } from "@/errors/appError";

export const registerController = async (req: Request, res: Response) => {
  try {
    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: validation.error.message,
      });
    }

    const { createdCompany: company, createdUser: user } = await register(validation.data);

    return res.status(201).json({ company, user });
  } catch (error) {
    console.log(error);

    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      error: "Erro interno do servidor",
    });
  }
};
