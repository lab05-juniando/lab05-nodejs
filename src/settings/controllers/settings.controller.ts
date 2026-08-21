import { Request, Response } from "express";
import { AppError } from "../../errors/appError";
import {
  companySettingsSchema,
  updateSettingsSchema,
  userSettingsSchema,
} from "../schemas/settings.schema";
import {
  getOrganizationSettings,
  getSettings,
  getUserSettings,
  updateOrganizationSettings,
  updateSettings,
  updateUserSettings,
} from "../services/settings.service";

const getUserId = (req: Request) => req.userId;

export const show = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Acesso não autorizado" });

    return res.json(await getSettings(userId));
  } catch (error) {
    return handleError(res, error);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Acesso não autorizado" });

    const validation = updateSettingsSchema.safeParse(req.body);
    if (!validation.success) return res.status(400).json({ message: validation.error.message });

    return res.json(await updateSettings(userId, validation.data));
  } catch (error) {
    return handleError(res, error);
  }
};

export const showUser = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Acesso não autorizado" });

    return res.json(await getUserSettings(userId));
  } catch (error) {
    return handleError(res, error);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Acesso não autorizado" });

    const validation = userSettingsSchema.safeParse(req.body);
    if (!validation.success) return res.status(400).json({ message: validation.error.message });

    return res.json(await updateUserSettings(userId, validation.data));
  } catch (error) {
    return handleError(res, error);
  }
};

export const showOrganization = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Acesso não autorizado" });

    return res.json(await getOrganizationSettings(userId));
  } catch (error) {
    return handleError(res, error);
  }
};

export const updateOrganization = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Acesso não autorizado" });

    const validation = companySettingsSchema.safeParse(req.body);
    if (!validation.success) return res.status(400).json({ message: validation.error.message });

    return res.json(await updateOrganizationSettings(userId, validation.data));
  } catch (error) {
    return handleError(res, error);
  }
};

const handleError = (res: Response, error: unknown) => {
  if (error instanceof AppError) return res.status(error.statusCode).json({ error: error.message });
  return res.status(500).json({ error: "Erro interno do servidor" });
};
