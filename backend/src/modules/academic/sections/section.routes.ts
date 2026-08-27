import { Router } from "express";

import {
  createSectionController,
  getSectionsController,
  getSectionByIdController,
  updateSectionController,
  updateSectionStatusController,
} from "./section.controller";

import {
  authenticate,
} from "../../../middlewares/auth.middleware";

import {
  authorize,
} from "../../../middlewares/role.middleware";

import {
  UserRole,
} from "../../../constants/roles";

const router = Router();

router.use(
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN)
);


// CREATE
router.post(
  "/",
  createSectionController
);


// GET ALL
router.get(
  "/",
  getSectionsController
);


// STATUS
router.patch(
  "/:sectionId/status",
  updateSectionStatusController
);


// GET ONE
router.get(
  "/:sectionId",
  getSectionByIdController
);


// UPDATE
router.put(
  "/:sectionId",
  updateSectionController
);

export default router;