import { Request, Response } from "express";

import { authUser, logoutUser, refreshUserToken } from "@/modules/auth/service/auth.service";
import { authSchemaUser } from "@/modules/auth/schemas/auth.schema";

import { AppError } from "@/errors/appError";

export const AuthController = async (req: Request, res: Response) => {
  try {
    const validationUser = authSchemaUser.safeParse(req.body);

    if (!validationUser.success) {
      return res.status(400).json({ message: validationUser.error.message });
    }

    const loginUser = await authUser(validationUser.data.email, validationUser.data.password);

    return res.status(200).json(loginUser);
  } catch (error) {
    console.log(error);

    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json("Erro interno no servidor");
  }
};

export const RefreshController = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token é obrigatório" });
    }

    const newAccessToken = await refreshUserToken(refreshToken);

    return res.status(200).json(newAccessToken);
  } catch (error) {
    console.log(error);

    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json("Erro interno no servidor");
  }
};

export const LogoutController = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token é obrigatório para o logout." });
    }

    await logoutUser(refreshToken);

    return res.status(200).json({ message: "Logout realizado com sucesso." });
  } catch (error) {
    console.log(error);

    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json("Erro interno no servidor");
  }
};
