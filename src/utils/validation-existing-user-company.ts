import { prisma } from "@/config/prisma";

import { AppError } from "@/errors/appError";

export const ValidationExistingUserCompany = async (cnpj: string, email: string) => {
  const existingCompany = await prisma.company.findFirst({
    where: {
      cnpj: cnpj,
    },
  });

  if (existingCompany) throw new AppError("Empresa já cadastrada", 409);

  const existingUser = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (existingUser) throw new AppError("E-mail já cadastrado", 409);
};
