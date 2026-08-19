import { Router } from "express";

import {
  createAcademicSessionController,
  getAcademicSessionsController,
  getAcademicSessionByIdController,
  updateAcademicSessionController,
  setCurrentAcademicSessionController,
} from "./academicSession.controller";

import {
  authenticate,
} from "../../middlewares/auth.middleware";

import {
  authorize,
} from "../../middlewares/role.middleware";

import {
  UserRole,
} from "../../constants/roles";


const router = Router();


router.use(
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN)
);


router.post(
  "/sessions",
  createAcademicSessionController
);


router.get(
  "/sessions",
  getAcademicSessionsController
);


router.get(
  "/sessions/:sessionId",
  getAcademicSessionByIdController
);


router.put(
  "/sessions/:sessionId",
  updateAcademicSessionController
);

router.patch(
  "/sessions/:sessionId/current",
  setCurrentAcademicSessionController
);


export default router;