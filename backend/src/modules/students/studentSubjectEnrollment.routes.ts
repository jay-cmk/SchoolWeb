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
  assignStudentElectiveSubjectController,
  bulkAssignStudentElectiveSubjectController,
  getMyElectiveSubjectsController,
  getStudentElectiveSubjectsController,
  updateStudentElectiveSubjectController,
} from "./studentSubjectEnrollment.controller";


const router =
  Router();


/* =====================================================
   AUTHENTICATION

   सभी routes के लिए login required है।
===================================================== */

router.use(
  authenticate
);


/* =====================================================
   STUDENT - MY ELECTIVE SUBJECTS

   GET /api/v1/students/elective-subjects/me

   IMPORTANT:
   /me को /:enrollmentId से पहले रखें।
===================================================== */

router.get(
  "/me",

  authorize(
    UserRole.STUDENT
  ),

  getMyElectiveSubjectsController
);


/* =====================================================
   SCHOOL ADMIN - BULK ASSIGN

   POST /api/v1/students/elective-subjects/bulk

   Body:
   {
     studentIds: [],
     subjectAssignmentId: "",
     remarks?: ""
   }

   IMPORTANT:
   /bulk को /:enrollmentId से पहले रखें।
===================================================== */

router.post(
  "/bulk",

  authorize(
    UserRole.SCHOOL_ADMIN
  ),

  bulkAssignStudentElectiveSubjectController
);


/* =====================================================
   SCHOOL ADMIN - ASSIGN SINGLE ELECTIVE

   POST /api/v1/students/elective-subjects

   Body:
   {
     studentId: "",
     subjectAssignmentId: "",
     remarks?: ""
   }
===================================================== */

router.post(
  "/",

  authorize(
    UserRole.SCHOOL_ADMIN
  ),

  assignStudentElectiveSubjectController
);


/* =====================================================
   SCHOOL ADMIN - GET ELECTIVE ENROLLMENTS

   GET /api/v1/students/elective-subjects

   Optional query:
   sessionId
   classId
   sectionId
   studentId
   subjectId
   subjectAssignmentId
   stream
   status
===================================================== */

router.get(
  "/",

  authorize(
    UserRole.SCHOOL_ADMIN
  ),

  getStudentElectiveSubjectsController
);


/* =====================================================
   SCHOOL ADMIN - UPDATE STATUS / REMARKS

   PATCH
   /api/v1/students/elective-subjects/:enrollmentId

   Body:
   {
     status?: "ACTIVE" | "DROPPED" | "COMPLETED",
     remarks?: ""
   }
===================================================== */

router.patch(
  "/:enrollmentId",

  authorize(
    UserRole.SCHOOL_ADMIN
  ),

  updateStudentElectiveSubjectController
);


export default router;