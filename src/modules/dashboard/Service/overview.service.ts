import { prisma } from "@/config/prisma";
import { AppError } from "../../../errors/appError";
import { getDashboard } from "../Client/dashboard.client";

export const getCurrentBalance = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { companyId: true },
  });

  if (!user) throw new AppError("Usuário inválido.", 400);

  const companyId = user.companyId;

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const startDate = yesterday.toISOString().substring(0, 10);
  const endDate = today.toISOString().substring(0, 10);

  const springData = await getDashboard({
    companyId,
    start: startDate,
    end: endDate,
  });

  if (!springData || springData.length === 0) {
    throw new AppError("Nenhum dado encontrado", 404);
  }

  const sortedData = [...springData].sort((a, b) => {
    const dateA = new Date(a.cashFlow[0]?.date || 0).getTime();
    const dateB = new Date(b.cashFlow[0]?.date || 0).getTime();
    return dateB - dateA;
  });

  const currentBalance = sortedData[0]?.currentBalance;

  if (currentBalance === undefined || currentBalance === null) {
    throw new AppError("Erro ao buscar saldo atual.", 422);
  }
  console.log(currentBalance);
  return currentBalance;
};

export const getIncomesAt30lastDays = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { companyId: true },
  });

  if (!user) throw new AppError("Usuário inválido.", 400);

  const companyId = user.companyId;

  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const startDate = thirtyDaysAgo.toISOString().substring(0, 10);
  const endDate = today.toISOString().substring(0, 10);

  const springData = await getDashboard({
    companyId,
    start: startDate,
    end: endDate,
  });

  if (!springData || springData.length === 0) {
    throw new AppError("Nenhum dado encontrado.", 404);
  }

  const totalIncome = springData.reduce((total: number, day: { income: number }) => {
    return total + day.income;
  }, 0);

  return totalIncome;
};

export const getExpensesAt30lastDays = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { companyId: true },
  });

  if (!user) throw new AppError("Usuário inválido.", 400);

  const companyId = user.companyId;

  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const startDate = thirtyDaysAgo.toISOString().substring(0, 10);
  const endDate = today.toISOString().substring(0, 10);

  const springData = await getDashboard({
    companyId,
    start: startDate,
    end: endDate,
  });

  if (!springData || springData.length === 0) {
    throw new AppError("Nenhum dado encontrado.", 404);
  }

  const totalExpenses = springData.reduce((total: number, day: { expenses: number }) => {
    return total + day.expenses;
  }, 0);

  return totalExpenses;
};
