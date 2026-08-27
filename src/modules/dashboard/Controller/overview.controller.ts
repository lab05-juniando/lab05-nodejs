import { Request, Response } from "express";
import { AppError } from "../../../errors/appError";
import {
  getCurrentBalance as getCurrentBalanceService,
  getExpensesAt30lastDays as getExpensesAt30lastDaysService,
  getIncomesAt30lastDays as getIncomesAt30lastDaysService,
} from "../Service/overview.service";

export const getCurrentBalance = async (req: Request, res: Response) => {
  try {
    const userId = req.userId as string;
    const currentBalance = await getCurrentBalanceService(userId);
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
    const userId = req.userId as string;
    const incomesAt30LastDays = await getIncomesAt30lastDaysService(userId);
    return res.status(200).json({ incomesAt30LastDays: incomesAt30LastDays });
  } catch (error) {
    console.log(error);
    return res.status(500).json("Erro interno no servidor");
  }
};

export const getExpensesAt30lastDays = async (req: Request, res: Response) => {
  try {
    const userId = req.userId as string;
    const expensesAt30LastDays = await getExpensesAt30lastDaysService(userId);
    return res.status(200).json({ expensesAt30LastDays: expensesAt30LastDays });
  } catch (error) {
    console.log(error);
    return res.status(500).json("Erro interno no servidor");
  }
};
