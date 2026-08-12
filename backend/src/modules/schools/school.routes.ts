import { Router } from "express";

import {
  createSchoolController,
  getSchoolsController,
  createSchoolAdminController
} from "./school.controller";

const router = Router();

router.post(
  "/",
  createSchoolController
);

router.get(
  "/",
  getSchoolsController
);

router.post(
  "/:schoolId/admin",
  createSchoolAdminController
);



export default router;