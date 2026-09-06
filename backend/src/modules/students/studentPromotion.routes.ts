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
//   bulkPromoteStudentsController,
//   getEnrollmentByIdController,
//   getPromotionCandidatesController,
//   getStudentEnrollmentHistoryController,
//   previewBulkPromotionController,
//   promoteSingleStudentController,
//   updateEnrollmentController,
// } from "./studentPromotion.controller";
// import {
//   backfillStudentEnrollmentsController,
// } from "./studentEnrollmentBackfill.controller";

// const router =
//   Router();


// /* =====================================================
//    AUTHENTICATION
// ===================================================== */

// router.use(
//   authenticate
// );


// /* =====================================================
//    SCHOOL ADMIN ONLY

//    Promotion / enrollment correction should not
//    be available to Teacher or Student.
// ===================================================== */

// router.use(
//   authorize(
//     UserRole.SCHOOL_ADMIN
//   )
// );


// /* =====================================================
//    PROMOTION CANDIDATES
// ===================================================== */

// router.get(
//   "/promotions/candidates",
//   getPromotionCandidatesController
// );


// /* =====================================================
//    PREVIEW BULK PROMOTION
// ===================================================== */

// router.post(
//   "/promotions/preview",
//   previewBulkPromotionController
// );


// /* =====================================================
//    EXECUTE BULK PROMOTION
// ===================================================== */

// router.post(
//   "/promotions/bulk",
//   bulkPromoteStudentsController
// );


// /* =====================================================
//    GET ENROLLMENT BY ID

//    IMPORTANT:
//    Keep this before /:studentId/enrollments
//    where possible for clear route structure.
// ===================================================== */

// router.get(
//   "/enrollments/:enrollmentId",
//   getEnrollmentByIdController
// );


// /* =====================================================
//    UPDATE ENROLLMENT
// ===================================================== */

// router.patch(
//   "/enrollments/:enrollmentId",
//   updateEnrollmentController
// );


// /* =====================================================
//    STUDENT ENROLLMENT HISTORY
// ===================================================== */

// router.get(
//   "/:studentId/enrollments",
//   getStudentEnrollmentHistoryController
// );


// /* =====================================================
//    SINGLE STUDENT PROMOTION
// ===================================================== */

// router.post(
//   "/:studentId/promotion",
//   promoteSingleStudentController
// );

// // router.post(
// //   "/enrollments/backfill",
// //   backfillStudentEnrollmentsController
// // );

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
//   bulkPromoteStudentsController,
//   getEnrollmentByIdController,
//   getPromotionCandidatesController,
//   getStudentEnrollmentHistoryController,
//   getStudentsByEnrollmentController,
//   previewBulkPromotionController,
//   promoteSingleStudentController,
//   updateEnrollmentController,
// } from "./studentPromotion.controller";

// import {
//   backfillStudentEnrollmentsController,
// } from "./studentEnrollmentBackfill.controller";


// const router =
//   Router();


// /* =====================================================
//    AUTHENTICATION
// ===================================================== */

// router.use(
//   authenticate
// );


// /* =====================================================
//    SCHOOL ADMIN ONLY

//    Promotion / enrollment correction should not
//    be available to Teacher or Student.
// ===================================================== */

// router.use(
//   authorize(
//     UserRole.SCHOOL_ADMIN
//   )
// );


// /* =====================================================
//    PROMOTION CANDIDATES
// ===================================================== */

// router.get(
//   "/promotions/candidates",
//   getPromotionCandidatesController
// );


// /* =====================================================
//    PREVIEW BULK PROMOTION
// ===================================================== */

// router.post(
//   "/promotions/preview",
//   previewBulkPromotionController
// );


// /* =====================================================
//    EXECUTE BULK PROMOTION
// ===================================================== */

// router.post(
//   "/promotions/bulk",
//   bulkPromoteStudentsController
// );


// /* =====================================================
//    GET STUDENTS BY ENROLLMENT

//    Query:
//    sessionId = required
//    classId   = optional
//    sectionId = optional
//    search    = optional

//    IMPORTANT:
//    Keep this before /enrollments/:enrollmentId
// ===================================================== */

// router.get(
//   "/enrollments",
//   getStudentsByEnrollmentController
// );


// /* =====================================================
//    GET ENROLLMENT BY ID
// ===================================================== */

// router.get(
//   "/enrollments/:enrollmentId",
//   getEnrollmentByIdController
// );


// /* =====================================================
//    UPDATE ENROLLMENT
// ===================================================== */

// router.patch(
//   "/enrollments/:enrollmentId",
//   updateEnrollmentController
// );


// /* =====================================================
//    STUDENT ENROLLMENT HISTORY
// ===================================================== */

// router.get(
//   "/:studentId/enrollments",
//   getStudentEnrollmentHistoryController
// );


// /* =====================================================
//    SINGLE STUDENT PROMOTION
// ===================================================== */

// router.post(
//   "/:studentId/promotion",
//   promoteSingleStudentController
// );


// /* =====================================================
//    BACKFILL

//    Keep disabled after successful migration.
// ===================================================== */

// // router.post(
// //   "/enrollments/backfill",
// //   backfillStudentEnrollmentsController
// // );


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
  bulkPromoteStudentsController,
  getEnrollmentByIdController,
  getPromotionCandidatesController,
  getStudentEnrollmentHistoryController,
  getStudentsByEnrollmentController,
  previewBulkPromotionController,
  promoteSingleStudentController,
  updateEnrollmentController,
} from "./studentPromotion.controller";


const router =
  Router();


/* =====================================================
   AUTHENTICATION
===================================================== */

router.use(
  authenticate
);


/* =====================================================
   SCHOOL ADMIN ONLY

   IMPORTANT:
   Do not apply SCHOOL_ADMIN authorization globally on
   this router because it is mounted at /api/v1/students.

   A global role guard would also intercept /students/me
   before student.routes.ts can handle that STUDENT route.
===================================================== */


/* =====================================================
   PROMOTION CANDIDATES
===================================================== */

router.get(
  "/promotions/candidates",
  authorize(
    UserRole.SCHOOL_ADMIN
  ),
  getPromotionCandidatesController
);


/* =====================================================
   PREVIEW BULK PROMOTION
===================================================== */

router.post(
  "/promotions/preview",
  authorize(
    UserRole.SCHOOL_ADMIN
  ),
  previewBulkPromotionController
);


/* =====================================================
   EXECUTE BULK PROMOTION
===================================================== */

router.post(
  "/promotions/bulk",
  authorize(
    UserRole.SCHOOL_ADMIN
  ),
  bulkPromoteStudentsController
);


/* =====================================================
   GET STUDENTS BY ENROLLMENT

   Query:
   sessionId = required
   classId   = optional
   sectionId = optional
   search    = optional

   IMPORTANT:
   Keep this before /enrollments/:enrollmentId
===================================================== */

router.get(
  "/enrollments",
  authorize(
    UserRole.SCHOOL_ADMIN
  ),
  getStudentsByEnrollmentController
);


/* =====================================================
   GET ENROLLMENT BY ID
===================================================== */

router.get(
  "/enrollments/:enrollmentId",
  authorize(
    UserRole.SCHOOL_ADMIN
  ),
  getEnrollmentByIdController
);


/* =====================================================
   UPDATE ENROLLMENT
===================================================== */

router.patch(
  "/enrollments/:enrollmentId",
  authorize(
    UserRole.SCHOOL_ADMIN
  ),
  updateEnrollmentController
);


/* =====================================================
   STUDENT ENROLLMENT HISTORY
===================================================== */

router.get(
  "/:studentId/enrollments",
  authorize(
    UserRole.SCHOOL_ADMIN
  ),
  getStudentEnrollmentHistoryController
);


/* =====================================================
   SINGLE STUDENT PROMOTION
===================================================== */

router.post(
  "/:studentId/promotion",
  authorize(
    UserRole.SCHOOL_ADMIN
  ),
  promoteSingleStudentController
);


/* =====================================================
   BACKFILL

   Keep disabled after successful migration.

   If this route is enabled later, import
   backfillStudentEnrollmentsController and apply the
   SCHOOL_ADMIN authorize middleware to this route too.
===================================================== */

// router.post(
//   "/enrollments/backfill",
//   authorize(
//     UserRole.SCHOOL_ADMIN
//   ),
//   backfillStudentEnrollmentsController
// );


export default router;
