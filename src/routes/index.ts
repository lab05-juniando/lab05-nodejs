import { Router } from "express";
import { routerUser } from "./user.route";

const router = Router();

router.use("/", routerUser);

export default router;
