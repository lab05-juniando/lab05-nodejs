import { Router } from "express";
import * as UserController from "../Controller/User.controller";
import authMiddleware from "../Middleware/auth.middleware";

export const routerUser = Router();

routerUser.get("/profile", authMiddleware, UserController.getMe);
routerUser.put("/update", authMiddleware, UserController.updateUser);
