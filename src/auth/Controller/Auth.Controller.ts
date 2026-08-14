import { authUser } from "../../auth/Service/auth.service";
import { Request, Response } from "express";
import { authSchemaUser } from "../Schemas/Auth.schema";
import { AppError } from "../../errors/appError";

export const AuthController = async (req: Request, res: Response) => {
  try {
    const validationUser = authSchemaUser.safeParse(req.body);

    if (!validationUser.success) {
      return res.status(400).json({ message: validationUser.error.message });
    }

    const loginUser = await authUser(validationUser.data.email, validationUser.data.password);

    return res.status(200).json(loginUser);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json("Erro interno no servidor");
  }
};
