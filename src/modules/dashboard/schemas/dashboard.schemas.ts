import { z } from "zod";

export const TipoTransacaoSchema = z.enum(["RECEITA", "DESPESA"]);

export const CashFlowSchema = z.object({
  date: z.string(),
  type: TipoTransacaoSchema,
  total: z.number(),
});

export const RecentTransactionSchema = z.object({
  id: z.number(),
  companyId: z.string().uuid(),
  description: z.string(),
  amount: z.number(),
  date: z.string(),
  type: TipoTransacaoSchema,
  note: z.string().nullable(),
});

export const DashboardSchema = z.object({
  balance: z.number(),
  currentBalance: z.number(),
  income: z.number(),
  expenses: z.number(),
  forecast: z.number(),

  cashFlow: z.array(CashFlowSchema),

  recentTransactions: z.array(RecentTransactionSchema),
});

export type TipoTransacao = z.infer<typeof TipoTransacaoSchema>;

export type CashFlow = z.infer<typeof CashFlowSchema>;

export type RecentTransaction = z.infer<typeof RecentTransactionSchema>;

export type Dashboard = z.infer<typeof DashboardSchema>;
