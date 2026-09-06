// import {
//   Router,
// } from "express";

// import {
//   authenticate,
// } from "../../middlewares/auth.middleware";

// import {
//   authorize,
// } from "../../middlewares/role.middleware";

// import {
//   UserRole,
// } from "../../constants/roles";

// import {
//   changeHomeworkStatusController,
//   createHomeworkController,
//   deleteHomeworkController,
//   getHomeworkByIdController,
//   getHomeworksController,
//   getHomeworkStatsController,
//   updateHomeworkController,
// } from "./homework.controller";


// const router =
//   Router();


// // ============================================
// // AUTH + ROLE
// // ============================================

// router.use(
//   authenticate,
//   authorize(
//     UserRole.SCHOOL_ADMIN
//   )
// );


// // ============================================
// // HOMEWORK ROUTES
// // ============================================


// // CREATE HOMEWORK

// router.post(
//   "/",
//   createHomeworkController
// );


// // GET HOMEWORK STATS
// // IMPORTANT: keep this before /:homeworkId

// router.get(
//   "/stats",
//   getHomeworkStatsController
// );


// // GET HOMEWORK LIST

// router.get(
//   "/",
//   getHomeworksController
// );


// // GET HOMEWORK BY ID

// router.get(
//   "/:homeworkId",
//   getHomeworkByIdController
// );


// // UPDATE HOMEWORK

// router.put(
//   "/:homeworkId",
//   updateHomeworkController
// );


// // CHANGE HOMEWORK STATUS

// router.patch(
//   "/:homeworkId/status",
//   changeHomeworkStatusController
// );


// // DELETE HOMEWORK

// router.delete(
//   "/:homeworkId",
//   deleteHomeworkController
// );


// export default router;








// import {
//   Router,
// } from "express";

// import {
//   authenticate,
// } from "../../middlewares/auth.middleware";

// import {
//   authorize,
// } from "../../middlewares/role.middleware";

// import {
//   UserRole,
// } from "../../constants/roles";

// import {
//   changeHomeworkStatusController,
//   createHomeworkController,
//   deleteHomeworkController,
//   getHomeworkByIdController,
//   getHomeworksController,
//   getHomeworkStatsController,
//   getMyHomeworksController,
//   updateHomeworkController,
// } from "./homework.controller";


// const router =
//   Router();


// // ============================================
// // AUTHENTICATION
// // ============================================

// router.use(
//   authenticate
// );


// // ============================================
// // STUDENT - MY HOMEWORK
// //
// // IMPORTANT:
// // /me must stay before /:homeworkId
// // ============================================

// router.get(
//   "/me",

//   authorize(
//     UserRole.STUDENT
//   ),

//   getMyHomeworksController
// );


// // ============================================
// // SCHOOL ADMIN - CREATE HOMEWORK
// // ============================================

// router.post(
//   "/",

//   authorize(
//     UserRole.SCHOOL_ADMIN
//   ),

//   createHomeworkController
// );


// // ============================================
// // SCHOOL ADMIN - GET HOMEWORK STATS
// //
// // IMPORTANT:
// // /stats must stay before /:homeworkId
// // ============================================

// router.get(
//   "/stats",

//   authorize(
//     UserRole.SCHOOL_ADMIN
//   ),

//   getHomeworkStatsController
// );


// // ============================================
// // SCHOOL ADMIN - GET HOMEWORK LIST
// // ============================================

// router.get(
//   "/",

//   authorize(
//     UserRole.SCHOOL_ADMIN
//   ),

//   getHomeworksController
// );


// // ============================================
// // SCHOOL ADMIN - GET HOMEWORK BY ID
// // ============================================

// router.get(
//   "/:homeworkId",

//   authorize(
//     UserRole.SCHOOL_ADMIN
//   ),

//   getHomeworkByIdController
// );


// // ============================================
// // SCHOOL ADMIN - UPDATE HOMEWORK
// // ============================================

// router.put(
//   "/:homeworkId",

//   authorize(
//     UserRole.SCHOOL_ADMIN
//   ),

//   updateHomeworkController
// );


// // ============================================
// // SCHOOL ADMIN - CHANGE HOMEWORK STATUS
// // ============================================

// router.patch(
//   "/:homeworkId/status",

//   authorize(
//     UserRole.SCHOOL_ADMIN
//   ),

//   changeHomeworkStatusController
// );


// // ============================================
// // SCHOOL ADMIN - DELETE HOMEWORK
// // ============================================

// router.delete(
//   "/:homeworkId",

//   authorize(
//     UserRole.SCHOOL_ADMIN
//   ),

//   deleteHomeworkController
// );


// export default router;




import {
  Router,
} from "express";

import {
  authenticate,
} from "../../middlewares/auth.middleware";

import {
  authorize,
} from "../../middlewares/role.middleware";

import {
  UserRole,
} from "../../constants/roles";

import {
  changeHomeworkStatusController,
  createHomeworkController,
  deleteHomeworkController,
  getHomeworkByIdController,
  getHomeworksController,
  getHomeworkStatsController,
  getMyHomeworksController,
  updateHomeworkController,
} from "./homework.controller";


const router =
  Router();


// ============================================
// AUTHENTICATION
// ============================================

router.use(
  authenticate
);


// ============================================
// STUDENT - MY HOMEWORK
//
// GET /api/v1/homework/me
//
// IMPORTANT:
// /me must stay before /:homeworkId
// ============================================

router.get(
  "/me",

  authorize(
    UserRole.STUDENT
  ),

  getMyHomeworksController
);


// ============================================
// SCHOOL ADMIN + TEACHER
// CREATE HOMEWORK
// ============================================

router.post(
  "/",

  authorize(
    UserRole.SCHOOL_ADMIN,
    UserRole.TEACHER
  ),

  createHomeworkController
);


// ============================================
// SCHOOL ADMIN + TEACHER
// GET HOMEWORK STATS
//
// IMPORTANT:
// /stats must stay before /:homeworkId
// ============================================

router.get(
  "/stats",

  authorize(
    UserRole.SCHOOL_ADMIN,
    UserRole.TEACHER
  ),

  getHomeworkStatsController
);


// ============================================
// SCHOOL ADMIN + TEACHER
// GET HOMEWORK LIST
// ============================================

router.get(
  "/",

  authorize(
    UserRole.SCHOOL_ADMIN,
    UserRole.TEACHER
  ),

  getHomeworksController
);


// ============================================
// SCHOOL ADMIN + TEACHER
// GET HOMEWORK BY ID
// ============================================

router.get(
  "/:homeworkId",

  authorize(
    UserRole.SCHOOL_ADMIN,
    UserRole.TEACHER
  ),

  getHomeworkByIdController
);


// ============================================
// SCHOOL ADMIN + TEACHER
// UPDATE HOMEWORK
// ============================================

router.put(
  "/:homeworkId",

  authorize(
    UserRole.SCHOOL_ADMIN,
    UserRole.TEACHER
  ),

  updateHomeworkController
);


// ============================================
// SCHOOL ADMIN + TEACHER
// CHANGE HOMEWORK STATUS
// ============================================

router.patch(
  "/:homeworkId/status",

  authorize(
    UserRole.SCHOOL_ADMIN,
    UserRole.TEACHER
  ),

  changeHomeworkStatusController
);


// ============================================
// SCHOOL ADMIN + TEACHER
// DELETE HOMEWORK
// ============================================

router.delete(
  "/:homeworkId",

  authorize(
    UserRole.SCHOOL_ADMIN,
    UserRole.TEACHER
  ),

  deleteHomeworkController
);


export default router;