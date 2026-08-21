import { prisma } from "@/config/prisma";
import { hashSync } from "bcrypt";
import { z } from "zod";
import { registerSchema } from "../schemas/register.schema";
import { ValidationExistingUserCompany } from "@/utils/validation-existing-user-company";

type UserData = z.infer<typeof registerSchema>;

export const register = async (data: UserData) => {
  const { company, user } = data;

  await ValidationExistingUserCompany(company.cnpj, user.email);

  const hashedPassword = hashSync(data.user.password, 10);

  const result = await prisma.$transaction(async (tx) => {
    const createdCompany = await tx.company.create({
      data: {
        name: company.name,
        cnpj: company.cnpj,
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
