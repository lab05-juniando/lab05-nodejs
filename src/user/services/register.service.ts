import { prisma } from "../../db/db";
import { hashSync } from "bcrypt";
import { z } from "zod";
import { registerSchema } from "../schemas/register.schema";
import { AppError } from "../../errors/appError";

type UserData = z.infer<typeof registerSchema>;

export const createUser = async (data: UserData) => {
  const { company, user } = data;

  const existingCompany = company.cnpj
    ? await prisma.company.findFirst({
        where: {
          cnpj: company.cnpj,
        },
      })
    : null;

  if (existingCompany) throw new AppError("Empresa já cadastrada", 409);

  const existingUser = await prisma.user.findFirst({
    where: {
      email: user.email,
    },
  });

  if (existingUser) throw new AppError("E-mail já cadastrado", 409);

  const hashedPassword = hashSync(data.user.password, 10);

  const result = await prisma.$transaction(async (tx) => {
    const createdCompany = await tx.company.create({
      data: {
        name: company.name,
        cnpj: company.cnpj ?? null,
      },
    });

    const createdUser = await tx.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role,
        companyId: createdCompany.id,
      },
      select: {
        name: true,
        email: true,
        role: true,
      },
    });

    return { createdCompany, createdUser };
  });

  return result;
};
