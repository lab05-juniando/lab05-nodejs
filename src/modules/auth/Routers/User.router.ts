import { Router } from "express";
import * as UserController from "@/modules/auth/controller/user.controller";
import authMiddleware from "../middleware/auth.middleware";

export const routerUser = Router();

routerUser.get("/profile", authMiddleware, UserController.getMe);
routerUser.put("/update", authMiddleware, UserController.updateUser);
