import { prisma } from "../../db/db";
import jwt from "jsonwebtoken";
import { compare } from "bcrypt";

import { AppError } from "../../errors/appError";

export const authUser = async (email: string, password: string) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      email: email,
      deletedAt: null,
    },
  });
  if (!existingUser) {
    throw new AppError("Usuário não existe", 409);
  }

  const isValue = await compare(password, existingUser.password);
  if (!isValue) {
    throw new AppError("Email ou Senha invalido", 401);
  }

  const token = jwt.sign(
    {
      id: existingUser.id,
      role: existingUser.role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" },
  );

  return {
    token,
    user: {
      email: existingUser.email,
    },
  };
};
