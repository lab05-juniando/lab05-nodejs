import jwt from "jsonwebtoken";
import { compare } from "bcrypt";

import { prisma } from "@/config/prisma";

import { AppError } from "@/errors/appError";

export const authUser = async (email: string, passwordUser: string) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!existingUser || existingUser.deletedAt !== null) {
    throw new AppError("Usuário não existe", 409);
  }

  const hasValue = await compare(passwordUser, existingUser.password);

  if (!hasValue) {
    throw new AppError("Email ou Senha invalido", 401);
  }

  const token = jwt.sign(
    {
      userId: existingUser.id,
      role: existingUser.role,
      companyId: existingUser.companyId,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" },
  );

  const refreshToken = jwt.sign({ id: existingUser.id }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "7d",
  });

  await prisma.refreshToken.upsert({
    where: {
      userId: existingUser.id,
    },
    update: {
      token: refreshToken,
    },
    create: {
      token: refreshToken,
      userId: existingUser.id,
    },
  });

  const { password = undefined, ...user}  = existingUser;

  return {
    token,
    refreshToken,
    user: {
      ...user

    },
  };
};

export const refreshUserToken = async (refreshToken: string) => {
  const tokenRecord = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!tokenRecord) {
    throw new AppError("Refresh token inválido ou não encontrado", 401);
  }

  try {
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
  } catch {
    throw new AppError("Refresh token expirado. Faça login novamente.", 401);
  }

  const newToken = jwt.sign(
    { id: tokenRecord.user.id, role: tokenRecord.user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" },
  );

  return { token: newToken };
};

export const logoutUser = async (refreshToken: string) => {
  const tokenRecord = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  if (!tokenRecord) {
    return;
  }

  await prisma.refreshToken.delete({
    where: { token: refreshToken },
  });
};
