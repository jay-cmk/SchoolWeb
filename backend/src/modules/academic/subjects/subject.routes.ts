import {
  Router,
} from "express";

import {
  createSubjectController,
  getSubjectsController,
  getSubjectByIdController,
  updateSubjectController,
  updateSubjectStatusController,
} from "./subject.controller";

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
  createSubjectController
);


// GET ALL
router.get(
  "/",
  getSubjectsController
);


// STATUS
router.patch(
  "/:subjectId/status",
  updateSubjectStatusController
);


// GET ONE
router.get(
  "/:subjectId",
  getSubjectByIdController
);


// UPDATE
router.put(
  "/:subjectId",
  updateSubjectController
);


export default router;