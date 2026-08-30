import jwt from "jsonwebtoken";
import { compare } from "bcrypt";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { Resend } from "resend";

import { prisma } from "@/config/prisma";

import { AppError } from "@/errors/appError";

const resend = new Resend(process.env.RESEND_API_KEY);
const RESET_TOKEN_EXPIRATION_MS = 30 * 60 * 1000; // 30 minutos

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...user } = existingUser;
  return {
    token,
    refreshToken,
    user: {
      ...user,
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

export const requestPasswordReset = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email: email,
      deletedAt: null,
    },
  });

  if (!user) {
    return null;
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = hashToken(rawToken);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: new Date(Date.now() + RESET_TOKEN_EXPIRATION_MS),
    },
  });

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev", // ajuste pro domínio verificado no Resend
    to: user.email,
    subject: "Redefinição de senha",
    html: "<strong>it works!</strong>",
  });

  console.log("📧 Resend data:", data);
  console.log("❌ Resend error:", error);
};

export const resetPassword = async (token: string, newPassword: string) => {
  const hashedToken = hashToken(token);

  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { gt: new Date() },
    },
  });
  if (!user) {
    throw new Error("INVALID_OR_EXPIRED_TOKEN");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    },
  });
};
