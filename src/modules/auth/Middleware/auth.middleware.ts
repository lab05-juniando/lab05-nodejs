import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";

interface TokenPayload {
  userId: string;
  role: string;
  companyId: string;
  iat: number;
  exp: number;
}

const authMiddleware = (req: Request, res: Response, next: NextFunction): Response | void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "É necessário refazer o login" });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    return res.status(401).json({ error: "Acesso não autorizado. Refaça o login." });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme as string)) {
    return res.status(401).json({ error: "Token malformatted" });
  }

  const secret: Secret | undefined = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({ error: "Secret não configurado" });
  }

  jwt.verify(token as string, secret, (err: unknown, decoded: unknown) => {
    if (err) return res.status(404).json({ error: "Usuário não encontrado" });

    const payload = decoded as TokenPayload;
    res.locals.userId = payload.userId;
    res.locals.role = payload.role;
    res.locals.companyId = payload.companyId;
    req.userId = payload.userId;
    req.userRole = payload.role;
    req.companyId = payload.companyId;

    return next();
  });
};

export default authMiddleware;
