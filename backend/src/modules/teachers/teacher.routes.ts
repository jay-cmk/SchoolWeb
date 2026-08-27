import {
  Router,
} from "express";

import {
  createTeacherController,
  getTeachersController,
  getTeacherByIdController,
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


router.use(
  authenticate,

  authorize(
    UserRole.SCHOOL_ADMIN
  )
);


// CREATE
router.post(
  "/",
  createTeacherController
);


// GET ALL
router.get(
  "/",
  getTeachersController
);


// STATUS
router.patch(
  "/:teacherId/status",
  updateTeacherStatusController
);


// GET ONE
router.get(
  "/:teacherId",
  getTeacherByIdController
);


// UPDATE
router.put(
  "/:teacherId",
  updateTeacherController
);


export default router;