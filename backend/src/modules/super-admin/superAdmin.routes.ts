// import { Router } from "express";

// import { getDashboard } from "./superAdmin.controller";
// import { createSchoolController } from "../schools/school.controller";


// import { authenticate } from "../../middlewares/auth.middleware";
// import { authorize } from "../../middlewares/role.middleware";
// import { UserRole } from "../../constants/roles";

// const router = Router();

// router.get(
//   "/dashboard",
//   authenticate,
//   authorize(UserRole.SUPER_ADMIN),
//   getDashboard
// );


// router.post(
//   "/schools",
//   authenticate,
//   authorize(UserRole.SUPER_ADMIN),
//   createSchoolController
// );

// export default router;


import { Router } from "express";

import { getDashboard } from "./superAdmin.controller";

import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { UserRole } from "../../constants/roles";

import schoolRoutes from "../schools/school.routes";

const router = Router();

router.get(
  "/dashboard",
  authenticate,
  authorize(UserRole.SUPER_ADMIN),
  getDashboard
);

router.use(
  "/schools",
  authenticate,
  authorize(UserRole.SUPER_ADMIN),
  schoolRoutes
);

export default router;