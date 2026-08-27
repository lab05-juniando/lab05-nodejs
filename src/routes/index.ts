import { Router } from "express";
import { router as RouteRegister } from "../modules/user/routes/register.route";
import { routerAuth } from "../modules/auth/Routers/auth.router";
import { routerUser } from "../modules/auth/Routers/User.router";
import { router as routerDashboard } from "../modules/dashboard/dashboard.routes";

const router = Router();

router.use("/users", RouteRegister);
router.use("/login", routerAuth);
router.use("/users", routerUser);
router.use("/dashboard", routerDashboard);

export default router;
