import { Request, Response } from "express";

import {
  authUser,
  logoutUser,
  refreshUserToken,
  requestPasswordReset,
  resetPassword,
} from "@/modules/auth/service/auth.service";
import { authSchemaUser } from "@/modules/auth/schemas/auth.schema";
import { forgotPasswordSchema, resetPasswordSchema } from "@/modules/auth/schemas/authReset.schema";

import { AppError } from "@/errors/appError";

export const AuthController = async (req: Request, res: Response) => {
  try {
    const validationUser = authSchemaUser.safeParse(req.body);

    if (!validationUser.success) {
      return res.status(400).json({ message: validationUser.error.message });
    }

    const loginUser = await authUser(validationUser.data.email, validationUser.data.password);

    // Envia o token como cookie HttpOnly
    res.cookie("token", loginUser.token, {
      httpOnly: true, // JS do front-end não consegue ler
      secure: process.env.NODE_ENV === "production", // só HTTPS em produção
      sameSite: "strict", // proteção extra contra CSRF
      maxAge: 60 * 60 * 1000, // 1 hora (bate com o expiresIn do seu jwt.sign)
    });

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

export const forgotPassword = async (req: Request, res: Response) => {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.message });
  }
  try {
    await requestPasswordReset(parsed.data.email);
    return res.status(200).json({
      message: "Se o email existir, um link de redefinição foi enviado.",
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json("Erro interno no servidor");
  }
};

export async function resetingPassword(req: Request, res: Response) {
  const parsed = resetPasswordSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
  }

  try {
    await resetPassword(parsed.data.token, parsed.data.newPassword);
    return res.status(200).json({ message: "Senha redefinida com sucesso." });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json("Erro interno no servidor");
  }
}
