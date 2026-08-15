import { Request, Response } from "express";
import { AppError } from "../../errors/appError";
import { getMe as getMeService, updateUser as updateUserService } from "../Service/user.service";
import { updateUserSchema } from "../Schemas/User.schema";

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const user = await getMeService(userId as string);
    return res.status(200).json(user);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const validation = updateUserSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.message });
    }
    const user = await updateUserService(userId as string, req.body);
    return res.status(200).json(user);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
};
