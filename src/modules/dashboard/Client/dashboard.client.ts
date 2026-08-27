import axios from "axios";

interface DashboardParams {
  companyId: string;
  start: string;
  end?: string;
  limit?: number;
}

export const getDashboard = async ({ companyId, start, end, limit }: DashboardParams) => {
  const response = await axios.get("http://localhost:8080/transacoes/dashboard", {
    params: {
      companyId,
      start,
      end,
      limit,
    },
  });
  console.log(response);

  return response.data;
};
