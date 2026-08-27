import { Router } from "express";

import {
  createClassController,
  getClassesController,
  getClassByIdController,
  updateClassController,
  updateClassStatusController
} from "./class.controller";

import { authenticate } from "../../../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  createClassController
);

router.get(
  "/",
  getClassesController
);

router.get(
  "/:classId",
  getClassByIdController
);

router.put(
  "/:classId",
  updateClassController
);

router.patch(
  "/classes/:classId/status",
  updateClassStatusController
);

export default router;