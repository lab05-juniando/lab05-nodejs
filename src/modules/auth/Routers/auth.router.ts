import { Router } from "express";
import { AuthController , LogoutController, RefreshController} from "../../auth/Controller/Auth.Controller";

export const routerAuth = Router();

routerAuth.post("/", AuthController);
routerAuth.post("/refresh", RefreshController);
routerAuth.post("/logout", LogoutController);