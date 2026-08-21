import { prisma } from "../../db/db";
import { AppError } from "../../errors/appError";
import {
  CompanySettingsData,
  UpdateSettingsData,
  UserSettingsData,
} from "../schemas/settings.schema";

const settingsSelect = {
  theme: true,
  language: true,
  currency: true,
  notifications: true,
};

export const getSettings = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      company: true,
      settings: { select: settingsSelect },
    },
  });

  if (!user) throw new AppError("Usuário não encontrado", 404);

  const settings =
    user.settings ??
    (await prisma.userSettings.create({
      data: { userId },
      select: settingsSelect,
    }));

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    settings,
    company: user.company,
  };
};

export const updateSettings = async (userId: string, data: UpdateSettingsData) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { companyId: true, role: true },
  });

  if (!user) throw new AppError("Usuário não encontrado", 404);
  if (data.company && user.role !== "ADMIN") {
    throw new AppError("Apenas administradores podem alterar os dados da empresa", 403);
  }

  if (data.settings) {
    const settingsData = {
      ...(data.settings.theme !== undefined && { theme: data.settings.theme }),
      ...(data.settings.language !== undefined && { language: data.settings.language }),
      ...(data.settings.currency !== undefined && { currency: data.settings.currency }),
      ...(data.settings.notifications !== undefined && {
        notifications: data.settings.notifications,
      }),
    };

    await prisma.userSettings.upsert({
      where: { userId },
      create: { userId, ...settingsData },
      update: settingsData,
    });
  }

  if (data.company) {
    const companyData = {
      ...(data.company.name !== undefined && { name: data.company.name }),
      ...(data.company.cnpj !== undefined && { cnpj: data.company.cnpj }),
    };

    await prisma.company.update({ where: { id: user.companyId }, data: companyData });
  }

  return getSettings(userId);
};

export const getUserSettings = async (userId: string) => {
  const result = await getSettings(userId);
  return result.settings;
};

export const updateUserSettings = async (userId: string, data: UserSettingsData) => {
  await updateSettings(userId, { settings: data });
  return getUserSettings(userId);
};

export const getOrganizationSettings = async (userId: string) => {
  const result = await getSettings(userId);
  return result.company;
};

export const updateOrganizationSettings = async (userId: string, data: CompanySettingsData) => {
  await updateSettings(userId, { company: data });
  return getOrganizationSettings(userId);
};
