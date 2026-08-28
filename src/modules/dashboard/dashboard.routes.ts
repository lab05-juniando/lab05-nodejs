import { Router } from "express";
import * as dashboardController from "./controller/recentes.controller";
import authMiddleware from "../auth/middleware/auth.middleware";

export const router = Router();

router.get("/recentes", authMiddleware, dashboardController.getRecentes);
