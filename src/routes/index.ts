import { Router } from "express";
import { router as RouteRegister } from "../user/routes/register.route";

const router = Router();

router.use("/users", RouteRegister);

export default router;
