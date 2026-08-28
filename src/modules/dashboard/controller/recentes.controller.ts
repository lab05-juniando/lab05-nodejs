import { Request, Response } from "express";
import { buscarRecentes } from "../service/recentes.service";

export async function getRecentes(req: Request, res: Response) {
  try {
    const recentes = await buscarRecentes();

    res.status(200).json(recentes);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao buscar transações recentes",
    });
  }
}
