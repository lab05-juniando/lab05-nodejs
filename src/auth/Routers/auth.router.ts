import {Router} from "express";
import {AuthController} from "../../auth/Controller/Auth.Controller"


export const routerAuth = Router();

routerAuth.post("/", AuthController);
