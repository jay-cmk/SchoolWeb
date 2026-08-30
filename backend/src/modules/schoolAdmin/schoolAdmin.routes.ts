// import { Router } from "express";

// import {
//   getSchoolAdminDashboardController,getSchoolAdminsController,
//   updateSchoolAdminController,
//   updateSchoolAdminStatusController,
// } from "./schoolAdmin.controller";

// import { authenticate } from "../../middlewares/auth.middleware";
// import { authorize } from "../../middlewares/role.middleware";
// import { UserRole } from "../../constants/roles";

// const router = Router();

// router.get(
//   "/dashboard",
//   authenticate,
//   authorize(UserRole.SCHOOL_ADMIN),
//   getSchoolAdminDashboardController
// );


// router.get(
//   "/:schoolId/admin",
//   getSchoolAdminsController
// );


// router.put(
//   "/:schoolId/admin/:adminId",
//   updateSchoolAdminController
// );


// router.patch(
//   "/:schoolId/admin/:adminId/status",
//   updateSchoolAdminStatusController
// );

// export default router;






import {
  Router,
} from "express";

import {
  getSchoolAdminDashboardController,
  getSchoolAdminsController,
  updateSchoolAdminController,
  updateSchoolAdminStatusController,
} from "./schoolAdmin.controller";

import {
  authenticate,
} from "../../middlewares/auth.middleware";

import {
  authorize,
} from "../../middlewares/role.middleware";

import {
  UserRole,
} from "../../constants/roles";


const router =
  Router();


// ============================================
// SCHOOL ADMIN DASHBOARD
// ============================================

router.get(
  "/dashboard",

  authenticate,

  authorize(
    UserRole.SCHOOL_ADMIN
  ),

  getSchoolAdminDashboardController
);


// ============================================
// GET SCHOOL ADMINS
// ============================================

router.get(
  "/:schoolId/admin",

  getSchoolAdminsController
);


// ============================================
// UPDATE SCHOOL ADMIN
// ============================================

router.put(
  "/:schoolId/admin/:adminId",

  updateSchoolAdminController
);


// ============================================
// UPDATE SCHOOL ADMIN STATUS
// ============================================

router.patch(
  "/:schoolId/admin/:adminId/status",

  updateSchoolAdminStatusController
);


export default router;