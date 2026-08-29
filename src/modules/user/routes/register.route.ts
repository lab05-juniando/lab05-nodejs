import { Router } from "express";
import * as register from "@/modules/user/controller/register.controller";

export const router = Router();

router.post("/register", register.registerController);

