import { Router } from "express";
import {
  AuthController,
  LogoutController,
  RefreshController,
  forgotPassword,
  resetingPassword,
} from "@/modules/auth/controller/auth.Controller";

export const RouterAuth = Router();

RouterAuth.post("/", AuthController);
RouterAuth.post("/refresh", RefreshController);
RouterAuth.post("/logout", LogoutController);
RouterAuth.post("/forgot-password", forgotPassword);
RouterAuth.post("/reset-password", resetingPassword);
