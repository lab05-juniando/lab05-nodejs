import { Router } from "express";
import * as UserController from "../Controller/User.Controller";
import { authMiddleware } from "../Middleware/auth.middleware";

export const routerUser = Router();

routerUser.get("/perfil", authMiddleware, UserController.getMe);
routerUser.put("/update", authMiddleware, UserController.updateUser);
