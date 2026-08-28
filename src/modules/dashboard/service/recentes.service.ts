import { AppError } from "../../../errors/appError";
import { buscarDashboard } from "../client/dashboard.client";
import { DashboardSchema } from "../schemas/dashboard.schemas";

export async function buscarRecentes() {
  const resposta = await buscarDashboard();

  const dadosValidados = DashboardSchema.safeParse(resposta);
  if (!dadosValidados.success) {
    throw new AppError("Dados inválidos", 400);
  }
  const dadosRecentes = dadosValidados.data.recentTransactions;

  return dadosRecentes;
}
