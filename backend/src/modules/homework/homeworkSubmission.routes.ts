import { Router } from "express";

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
  createHomeworkSubmissionController,
  deleteHomeworkSubmissionController,
  getHomeworkSubmissionByIdController,
  getHomeworkSubmissionsController,
  getHomeworkSubmissionStatsController,
  getStudentHomeworkSubmissionController,
  reviewHomeworkSubmissionController,
  updateHomeworkSubmissionController,
} from "./homeworkSubmission.controller";

const router = Router();

router.use(
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN)
);


// Create submission
router.post(
  "/",
  createHomeworkSubmissionController
);


// Homework-wise stats
router.get(
  "/homework/:homeworkId/stats",
  getHomeworkSubmissionStatsController
);


// Homework-wise submissions list
router.get(
  "/homework/:homeworkId",
  getHomeworkSubmissionsController
);


// Particular student submission
router.get(
  "/homework/:homeworkId/student/:studentId",
  getStudentHomeworkSubmissionController
);


// Single submission
router.get(
  "/:submissionId",
  getHomeworkSubmissionByIdController
);


// Update submission
router.put(
  "/:submissionId",
  updateHomeworkSubmissionController
);


// Review submission
router.patch(
  "/:submissionId/review",
  reviewHomeworkSubmissionController
);


// Delete submission
router.delete(
  "/:submissionId",
  deleteHomeworkSubmissionController
);


export default router;