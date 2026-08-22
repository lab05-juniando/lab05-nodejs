import { Router } from "express";

import { RouterAuth } from "@/modules/auth/routers/auth.router";
import { router as RouteRegister } from "@/modules/user/routes/register.route";
import { routerUser } from "@/modules/auth/routers/user.router";

const router = Router();

router.use("/users", RouteRegister);
router.use("/auth", RouterAuth);
router.use("/user", routerUser);

export default router;
