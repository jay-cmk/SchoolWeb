import { Router } from "express";

import studentController from "./student.controller";

import { authenticate } from "../../middlewares/auth.middleware";

import { authorize } from "../../middlewares/role.middleware";

const router = Router();


// CREATE STUDENT
router.post(
  "/",
  authenticate,
  authorize(
    "SUPER_ADMIN",
    "SCHOOL_ADMIN"
  ),
  studentController.create
);


// GET ALL STUDENTS
router.get(
  "/",
  authenticate,
  authorize(
    "SUPER_ADMIN",
    "SCHOOL_ADMIN"
  ),
  studentController.getAll
);


// GET SINGLE STUDENT
router.get(
  "/:studentId",
  authenticate,
  authorize(
    "SUPER_ADMIN",
    "SCHOOL_ADMIN"
  ),
  studentController.getOne
);


// UPDATE STUDENT
router.patch(
  "/:studentId",
  authenticate,
  authorize(
    "SUPER_ADMIN",
    "SCHOOL_ADMIN"
  ),
  studentController.update
);


// UPDATE STATUS
router.patch(
  "/:studentId/status",
  authenticate,
  authorize(
    "SUPER_ADMIN",
    "SCHOOL_ADMIN"
  ),
  studentController.updateStatus
);

export default router;