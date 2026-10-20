import { Router } from "express";
import { adminDashBoard } from "../controllers/admin.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorization.middleware";

const router = Router();

router.get("/dashboard",authenticate, authorize("admin"), adminDashBoard);

export default router;

