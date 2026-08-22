import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

const authMiddleware = (req: Request, res: Response, next: NextFunction): Response | void => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: "É necessário refazer o login" });
  }

  jwt.verify(token as string, process.env.JWT_SECRET!, (err: unknown, decoded: unknown) => {
    if (err) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const payload = decoded as TokenPayload;
    res.locals.userId = payload.userId;
    res.locals.role = payload.role;
    req.userId = payload.userId;
    req.userRole = payload.role;

    return next();
  });
};

export default authMiddleware;
