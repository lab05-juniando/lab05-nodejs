import { Router } from "express";
import * as registerController from "../controller/register.controller";

export const router = Router();

router.post("/register", registerController.register);
