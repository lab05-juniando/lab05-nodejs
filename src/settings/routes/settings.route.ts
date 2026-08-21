import { Router } from "express";
import { authMiddleware } from "../../auth/Middleware/auth.middleware";
import * as settingsController from "../controllers/settings.controller";

export const settingsRouter = Router();

settingsRouter.use(authMiddleware);
settingsRouter.get("/", settingsController.show);
settingsRouter.patch("/", settingsController.update);
settingsRouter.get("/user", settingsController.showUser);
settingsRouter.patch("/user", settingsController.updateUser);
settingsRouter.get("/organization", settingsController.showOrganization);
settingsRouter.patch("/organization", settingsController.updateOrganization);
