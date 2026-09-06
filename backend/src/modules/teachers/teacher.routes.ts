// import {
//   Router,
// } from "express";

// import {
//   createTeacherController,
//   getTeachersController,
//   getTeacherByIdController,
//   updateTeacherController,
//   updateTeacherStatusController,
// } from "./teacher.controller";

// import {
//   authenticate,
// } from "../../middlewares/auth.middleware";

// import {
//   authorize,
// } from "../../middlewares/role.middleware";

// import {
//   UserRole,
// } from "../../constants/roles";


// const router =
//   Router();


// router.use(
//   authenticate,

//   authorize(
//     UserRole.SCHOOL_ADMIN
//   )
// );


// // CREATE
// router.post(
//   "/",
//   createTeacherController
// );


// // GET ALL
// router.get(
//   "/",
//   getTeachersController
// );


// // STATUS
// router.patch(
//   "/:teacherId/status",
//   updateTeacherStatusController
// );


// // GET ONE
// router.get(
//   "/:teacherId",
//   getTeacherByIdController
// );


// // UPDATE
// router.put(
//   "/:teacherId",
//   updateTeacherController
// );


// export default router;







import {
  Router,
} from "express";

import {
  createTeacherController,
  getTeachersController,
  getTeacherByIdController,
  getMyTeacherProfileController,
  updateTeacherController,
  updateTeacherStatusController,
} from "./teacher.controller";

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
// AUTHENTICATION
// ============================================

router.use(
  authenticate
);


// ============================================
// TEACHER SELF PROFILE
// IMPORTANT: /me BEFORE /:teacherId
// ============================================

router.get(

  "/me",

  authorize(
    UserRole.TEACHER
  ),

  getMyTeacherProfileController
);


// ============================================
// CREATE TEACHER
// SCHOOL ADMIN ONLY
// ============================================

router.post(

  "/",

  authorize(
    UserRole.SCHOOL_ADMIN
  ),

  createTeacherController
);


// ============================================
// GET ALL TEACHERS
// SCHOOL ADMIN ONLY
// ============================================

router.get(

  "/",

  authorize(
    UserRole.SCHOOL_ADMIN
  ),

  getTeachersController
);


// ============================================
// UPDATE STATUS
// SCHOOL ADMIN ONLY
// ============================================

router.patch(

  "/:teacherId/status",

  authorize(
    UserRole.SCHOOL_ADMIN
  ),

  updateTeacherStatusController
);


// ============================================
// GET ONE
// SCHOOL ADMIN ONLY
// ============================================

router.get(

  "/:teacherId",

  authorize(
    UserRole.SCHOOL_ADMIN
  ),

  getTeacherByIdController
);


// ============================================
// UPDATE
// SCHOOL ADMIN ONLY
// ============================================

router.put(

  "/:teacherId",

  authorize(
    UserRole.SCHOOL_ADMIN
  ),

  updateTeacherController
);


export default router;