import { Router } from "express";

import {
  createSchoolController,
  getSchoolsController,
  createSchoolAdminController,
   getSchoolByIdController,
  updateSchoolController,
  updateSchoolStatusController,
  
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





// ==============================
// SCHOOL STATUS
// ==============================

router.patch(
  "/:schoolId/status",
  updateSchoolStatusController
);


// ==============================
// SINGLE SCHOOL
// ==============================

router.get(
  "/:schoolId",
  getSchoolByIdController
);


router.put(
  "/:schoolId",
  updateSchoolController
);


export default router;