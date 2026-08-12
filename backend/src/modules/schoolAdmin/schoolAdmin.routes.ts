import { Router } from "express";

import {
  getSchoolAdminDashboardController,
} from "./schoolAdmin.controller";

import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { UserRole } from "../../constants/roles";

const router = Router();

router.get(
  "/dashboard",
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN),
  getSchoolAdminDashboardController
);

export default router;