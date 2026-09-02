// import { Router } from "express";

// import studentController from "./student.controller";

// import { authenticate } from "../../middlewares/auth.middleware";

// import { authorize } from "../../middlewares/role.middleware";

// const router = Router();


// // CREATE STUDENT
// router.post(
//   "/",
//   authenticate,
//   authorize(
//     "SUPER_ADMIN",
//     "SCHOOL_ADMIN"
//   ),
//   studentController.create
// );


// // GET ALL STUDENTS
// router.get(
//   "/",
//   authenticate,
//   authorize(
//     "SUPER_ADMIN",
//     "SCHOOL_ADMIN"
//   ),
//   studentController.getAll
// );


// // GET SINGLE STUDENT
// router.get(
//   "/:studentId",
//   authenticate,
//   authorize(
//     "SUPER_ADMIN",
//     "SCHOOL_ADMIN"
//   ),
//   studentController.getOne
// );


// // UPDATE STUDENT
// router.patch(
//   "/:studentId",
//   authenticate,
//   authorize(
//     "SUPER_ADMIN",
//     "SCHOOL_ADMIN"
//   ),
//   studentController.update
// );


// // UPDATE STATUS
// router.patch(
//   "/:studentId/status",
//   authenticate,
//   authorize(
//     "SUPER_ADMIN",
//     "SCHOOL_ADMIN"
//   ),
//   studentController.updateStatus
// );

// export default router;









// import { Router } from "express";

// import studentController from "./student.controller";

// import { authenticate } from "../../middlewares/auth.middleware";

// import { authorize } from "../../middlewares/role.middleware";

// import { UserRole } from "../../constants/roles";


// const router = Router();


// // ============================================
// // CREATE STUDENT
// // ============================================

// router.post(
//   "/",
//   authenticate,
//   authorize(
//     UserRole.SUPER_ADMIN,
//     UserRole.SCHOOL_ADMIN
//   ),
//   studentController.create
// );


// // ============================================
// // GET ALL STUDENTS
// // ============================================

// router.get(
//   "/",
//   authenticate,
//   authorize(
//     UserRole.SUPER_ADMIN,
//     UserRole.SCHOOL_ADMIN
//   ),
//   studentController.getAll
// );


// // ============================================
// // GET SINGLE STUDENT
// // ============================================

// router.get(
//   "/:studentId",
//   authenticate,
//   authorize(
//     UserRole.SUPER_ADMIN,
//     UserRole.SCHOOL_ADMIN
//   ),
//   studentController.getOne
// );


// // ============================================
// // UPDATE STUDENT
// // ============================================

// router.patch(
//   "/:studentId",
//   authenticate,
//   authorize(
//     UserRole.SUPER_ADMIN,
//     UserRole.SCHOOL_ADMIN
//   ),
//   studentController.update
// );


// // ============================================
// // UPDATE STUDENT STATUS
// // ============================================

// router.patch(
//   "/:studentId/status",
//   authenticate,
//   authorize(
//     UserRole.SUPER_ADMIN,
//     UserRole.SCHOOL_ADMIN
//   ),
//   studentController.updateStatus
// );


// export default router;













import {
  Router,
} from "express";

import studentController
  from "./student.controller";

import {
  authenticate,
} from "../../middlewares/auth.middleware";

import {
  authorize,
} from "../../middlewares/role.middleware";

import {
  UserRole,
} from "../../constants/roles";


const router = Router();


// ============================================
// APPLY AUTHENTICATION
// ============================================

router.use(
  authenticate
);






// ============================================
// CREATE STUDENT LOGIN ACCOUNT
// POST /api/v1/students/:studentId/account
// ============================================

router.post(
  "/:studentId/account",
  studentController.createAccount
);


// ============================================
// STUDENT - MY PROFILE
// GET /api/v1/students/me
// ============================================

router.get(
  "/me",
  authorize(
    UserRole.STUDENT
  ),
  studentController.getMe
);

// ============================================
// CREATE STUDENT
// POST /api/v1/students
// ============================================

router.post(
  "/",
  studentController.create
);


// ============================================
// GET ALL STUDENTS
// GET /api/v1/students
// ============================================

router.get(
  "/",
  studentController.getAll
);


// ============================================
// GET SINGLE STUDENT
// GET /api/v1/students/:studentId
// ============================================

router.get(
  "/:studentId",
  studentController.getOne
);


// ============================================
// UPDATE STUDENT STATUS
// PATCH /api/v1/students/:studentId/status
// ============================================

router.patch(
  "/:studentId/status",
  studentController.updateStatus
);


// ============================================
// UPDATE STUDENT
// PATCH /api/v1/students/:studentId
// ============================================

router.patch(
  "/:studentId",
  studentController.update
);


export default router;