import { hashSync } from "bcrypt";
import { z } from "zod";

import { prisma } from "@/config/prisma";
import { updateUserSchema } from "@/modules/auth/schemas/userUpdate.Schema";

import { AppError } from "@/errors/appError";

type UserData = z.infer<typeof updateUserSchema>;

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      role: true,
      company: {
        select: {
          name: true,
        },
      },
    },
  });
  if (!user) {
    throw new AppError("Usuario não encontrado - 1", 404);
  }
  return user;
};

export const updateUser = async (userId: string, data: UserData) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new AppError("Usuario não encontrado", 404);
  }

  if (data.email) {
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: data.email,
        id: { not: userId },
      },
    });
    if (existingEmail) {
      throw new AppError("Email já cadastrado", 400);
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.email !== undefined && { email: data.email }),
      ...(data.password !== undefined && { password: hashSync(data.password, 10) }),
    },
    select: {
      name: true,
      email: true,
      role: true,
      updatedAt: true,
    },
  });
  return updatedUser;
};
