import {
  Router,
} from "express";

import {
  createSubjectAssignmentController,
  getSubjectAssignmentsController,
  getSubjectAssignmentByIdController,
  updateSubjectAssignmentController,
  updateSubjectAssignmentStatusController,
} from "./subjectAssignment.controller";

import {
  authenticate,
} from "../../../middlewares/auth.middleware";

import {
  authorize,
} from "../../../middlewares/role.middleware";

import {
  UserRole,
} from "../../../constants/roles";


const router =
  Router();


router.use(
  authenticate,

  authorize(
    UserRole.SCHOOL_ADMIN
  )
);


// CREATE
router.post(
  "/",
  createSubjectAssignmentController
);


// GET ALL
router.get(
  "/",
  getSubjectAssignmentsController
);


// STATUS
router.patch(
  "/:assignmentId/status",
  updateSubjectAssignmentStatusController
);


// GET ONE
router.get(
  "/:assignmentId",
  getSubjectAssignmentByIdController
);


// UPDATE
router.put(
  "/:assignmentId",
  updateSubjectAssignmentController
);


export default router;