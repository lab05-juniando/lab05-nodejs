import { Router } from "express";
import { router as RouteRegister } from "../modules/user/routes/register.route";
import { routerAuth } from "../modules/auth/Routers/auth.router";

const router = Router();

router.use("/users", RouteRegister);
router.use("/login", routerAuth);

export default router;
