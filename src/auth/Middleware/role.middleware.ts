import { NextFunction, Request, Response } from "express";

export const checkRole = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRole = res.locals.userRole;

      if (!userRole) {
        return res.status(401).json({ error: "Token inválido - Role não encontrada" });
      }

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          error: "Você não tem permissão para realizar esta ação.",
          requiredRoles: allowedRoles,
          userRole: userRole,
        });
      }

      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro ao verificar permissões" });
    }
  };
};
