import { Router } from "express";
import { router as RouteRegister } from "../user/routes/register.route";
import { routerAuth } from "../auth/Routers/auth.router";

const router = Router();

router.use("/users", RouteRegister);
router.use("/login", routerAuth);

export default router;
