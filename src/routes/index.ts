import { Router } from "express";
import { router as RouteRegister } from "../user/routes/register.route";
import { routerAuth } from "../auth/Routers/auth.router";
import { routerUser } from "../auth/Routers/user.router";

const router = Router();

router.use("/register", RouteRegister);
router.use("/login", routerAuth);
router.use("/user", routerUser);

export default router;
