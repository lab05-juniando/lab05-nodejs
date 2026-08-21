import { Router } from "express";

import { RouterAuth } from "@/modules/auth/routers/auth.router";
import { router as RouteRegister } from "@/modules/user/routes/register.route";

const router = Router();

router.use("/users", RouteRegister);
router.use("/auth", RouterAuth);

export default router;
