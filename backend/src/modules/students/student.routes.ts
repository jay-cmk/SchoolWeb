


import {
  Router,
} from "express";

import studentController
  from "./student.controller";

import {
  authenticate,
} from "../../middlewares/auth.middleware";

import {
  authorize,
} from "../../middlewares/role.middleware";

import {
  UserRole,
} from "../../constants/roles";

import studentPhotoUpload
  from "../../middlewares/studentPhoto.middleware";


const router = Router();


/* =====================================================
   AUTHENTICATION
===================================================== */

router.use(
  authenticate
);


/* =====================================================
   STUDENT - MY PROFILE

   GET /api/v1/students/me
===================================================== */

router.get(
  "/me",

  authorize(
    UserRole.STUDENT
  ),

  studentController.getMe
);


/* =====================================================
   CREATE STUDENT LOGIN ACCOUNT

   POST /api/v1/students/:studentId/account

   Only School Admin
===================================================== */

router.post(
  "/:studentId/account",

  authorize(
    UserRole.SCHOOL_ADMIN
  ),

  studentController.createAccount
);


/* =====================================================
   CREATE STUDENT

   POST /api/v1/students

   multipart/form-data supported
   photo field name = photo

   Only School Admin
===================================================== */

router.post(
  "/",

  authorize(
    UserRole.SCHOOL_ADMIN
  ),

  studentPhotoUpload.single(
    "photo"
  ),

  studentController.create
);


/* =====================================================
   GET ALL / FILTERED STUDENTS

   GET /api/v1/students
===================================================== */

router.get(
  "/",

  authorize(
    UserRole.SCHOOL_ADMIN,
    UserRole.TEACHER
  ),

  studentController.getAll
);


/* =====================================================
   GET SINGLE STUDENT

   GET /api/v1/students/:studentId
===================================================== */

router.get(
  "/:studentId",

  authorize(
    UserRole.SCHOOL_ADMIN,
    UserRole.TEACHER
  ),

  studentController.getOne
);


/* =====================================================
   UPDATE STUDENT STATUS

   PATCH /api/v1/students/:studentId/status

   Only School Admin
===================================================== */

router.patch(
  "/:studentId/status",

  authorize(
    UserRole.SCHOOL_ADMIN
  ),

  studentController.updateStatus
);


/* =====================================================
   UPDATE STUDENT

   PATCH /api/v1/students/:studentId

   multipart/form-data supported
   photo field name = photo

   Only School Admin
===================================================== */

router.patch(
  "/:studentId",

  authorize(
    UserRole.SCHOOL_ADMIN
  ),

  studentPhotoUpload.single(
    "photo"
  ),

  studentController.update
);


export default router;