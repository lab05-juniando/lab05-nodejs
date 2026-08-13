import { Router } from "express";
import { registerUser } from "../controller/user.controller";

export const routerUser = Router();

routerUser.post("/user", registerUser);
