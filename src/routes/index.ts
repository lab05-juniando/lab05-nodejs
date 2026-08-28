import { Router } from "express";

import { RouterAuth } from "@/modules/auth/routers/auth.router";
import { router as RouteRegister } from "@/modules/user/routes/register.route";
import { routerUser } from "@/modules/auth/routers/user.router";
import { router as routerDashboard } from "../modules/dashboard/dashboard.routes";

const router = Router();

router.use("/users", RouteRegister);
router.use("/auth", RouterAuth);
router.use("/user", routerUser);
router.use("/dashboard", routerDashboard);

export default router;
