import { Router } from "express";
import { AuthController } from "../../auth/Controller/Auth.Controller";
import { checkRole } from "../Middleware/role.middleware";

export const routerAuth = Router();

routerAuth.post("/", checkRole, AuthController);
