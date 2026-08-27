import { Router } from "express";
import * as dashboardController from "./Controller/overview.controller";
import authMiddleware from "../auth/Middleware/auth.middleware";

export const router = Router();

router.get("/current-balance", authMiddleware, dashboardController.getCurrentBalance);
router.get("/incomes-last-30-days", authMiddleware, dashboardController.getIncomesAt30lastDays);
router.get("/expenses-last-30-days", authMiddleware, dashboardController.getExpensesAt30lastDays);
