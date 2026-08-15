import { Request, Response } from "express";
import { registerSchema } from "../schemas/register.schema";
import { createUser } from "../services/register.service";
import { AppError } from "../../../errors/appError";

export const register = async (req: Request, res: Response) => {
  try {
    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: validation.error.message,
      });
    }

    const { createdCompany: company, createdUser: user } = await createUser(validation.data);

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
