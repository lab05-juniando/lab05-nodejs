import { Request, Response } from "express";
import { AppError } from "../../../errors/appError";
import {
  getCurrentBalance as getCurrentBalanceService,
  getExpensesAt30lastDays as getExpensesAt30lastDaysService,
  getIncomesAt30lastDays as getIncomesAt30lastDaysService,
  getRecents as getRecentsService,
} from "../Service/dashboard.service";

export async function getRecents(req: Request, res: Response) {
  try {
    const companyId = req.companyId;
    const recentes = await getRecentsService(companyId as string);
    res.status(200).json(recentes);
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    }

    res.status(500).json({
      mensagem: "Erro ao buscar transações recentes",
    });
  }
}

export const getCurrentBalance = async (req: Request, res: Response) => {
  try {
    const companyId = req.companyId;
    const currentBalance = await getCurrentBalanceService(companyId as string);
    return res.status(200).json({ currentBalance: currentBalance });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json("Erro interno no servidor");
  }
};

export const getIncomesAt30lastDays = async (req: Request, res: Response) => {
  try {
    const companyId = req.companyId;
    const incomesAt30LastDays = await getIncomesAt30lastDaysService(companyId as string);
    return res.status(200).json({ incomesAt30LastDays: incomesAt30LastDays });
  } catch (error) {
    console.log(error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json("Erro interno no servidor");
  }
};

export const getExpensesAt30lastDays = async (req: Request, res: Response) => {
  try {
    const companyId = req.companyId;
    const expensesAt30LastDays = await getExpensesAt30lastDaysService(companyId as string);
    return res.status(200).json({ expensesAt30LastDays: expensesAt30LastDays });
  } catch (error) {
    console.log(error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json("Erro interno no servidor");
  }
};
