import { Router } from "express";
import * as dashboardController from "./Controller/dashboard.controller";
import authMiddleware from "../auth/middleware/auth.middleware";

export const router = Router();

router.get("/current-balance", authMiddleware, dashboardController.getCurrentBalance);
router.get("/incomes-last-30-days", authMiddleware, dashboardController.getIncomesAt30lastDays);
router.get("/expenses-last-30-days", authMiddleware, dashboardController.getExpensesAt30lastDays);
router.get("/recents", authMiddleware, dashboardController.getRecents);
