import { Dashboard } from "../schemas/dashboard.schemas";

export async function buscarDashboard(): Promise<Dashboard> {
  return {
    balance: 1250.0,
    currentBalance: 8730.5,
    income: 5000.0,
    expenses: 3750.0,
    forecast: 1500.0,

    cashFlow: [
      {
        date: "2026-08-21",
        type: "RECEITA",
        total: 2000.0,
      },
      {
        date: "2026-08-21",
        type: "DESPESA",
        total: 500.0,
      },
      {
        date: "2026-08-20",
        type: "RECEITA",
        total: 3000.0,
      },
    ],

    recentTransactions: [
      {
        id: 42,
        companyId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        description: "Pagamento cliente X",
        amount: 1200.0,
        date: "2026-08-21",
        type: "RECEITA",
        note: "Referente ao contrato nº 123",
      },
      {
        id: 41,
        companyId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        description: "Fornecedor Y",
        amount: 300.0,
        date: "2026-08-20",
        type: "DESPESA",
        note: null,
      },
      {
        id: 40,
        companyId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        description: "Venda de mercadorias",
        amount: 2500.0,
        date: "2026-08-19",
        type: "RECEITA",
        note: "Pagamento referente à venda #456",
      },
      {
        id: 39,
        companyId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        description: "Conta de energia elétrica",
        amount: 487.65,
        date: "2026-08-18",
        type: "DESPESA",
        note: "Fatura do mês de agosto",
      },
      {
        id: 38,
        companyId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        description: "Pagamento de cliente",
        amount: 1800.0,
        date: "2026-08-17",
        type: "RECEITA",
        note: null,
      },
      {
        id: 37,
        companyId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        description: "Compra de materiais",
        amount: 750.0,
        date: "2026-08-16",
        type: "DESPESA",
        note: "Materiais para estoque",
      },
    ],
  };
}
