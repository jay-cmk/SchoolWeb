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
  updateHomeworkController,
} from "./homework.controller";


const router =
  Router();


// ============================================
// AUTH + ROLE
// ============================================

router.use(
  authenticate,
  authorize(
    UserRole.SCHOOL_ADMIN
  )
);


// ============================================
// HOMEWORK ROUTES
// ============================================


// CREATE HOMEWORK

router.post(
  "/",
  createHomeworkController
);


// GET HOMEWORK STATS
// IMPORTANT: keep this before /:homeworkId

router.get(
  "/stats",
  getHomeworkStatsController
);


// GET HOMEWORK LIST

router.get(
  "/",
  getHomeworksController
);


// GET HOMEWORK BY ID

router.get(
  "/:homeworkId",
  getHomeworkByIdController
);


// UPDATE HOMEWORK

router.put(
  "/:homeworkId",
  updateHomeworkController
);


// CHANGE HOMEWORK STATUS

router.patch(
  "/:homeworkId/status",
  changeHomeworkStatusController
);


// DELETE HOMEWORK

router.delete(
  "/:homeworkId",
  deleteHomeworkController
);


export default router;