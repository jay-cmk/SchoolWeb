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


// ============================================
// CATEGORY CONTROLLERS
// ============================================

import {
  createFeeCategoryController,
  getFeeCategoriesController,
  getFeeCategoryByIdController,
  updateFeeCategoryController,
  updateFeeCategoryStatusController,
} from "./controllers/feeCategory.controller";


// ============================================
// STRUCTURE CONTROLLERS
// ============================================

import {
  createFeeStructureController,
  getFeeStructuresController,
  getFeeStructureByIdController,
  updateFeeStructureController,
  updateFeeStructureStatusController,
} from "./controllers/feeStructure.controller";


const router =
  Router();


// ============================================
// PROTECT ALL FEES ROUTES
// ============================================

router.use(
  authenticate,
  authorize(
    UserRole.SCHOOL_ADMIN
  )
);


// ============================================
// FEE CATEGORY
// ============================================

router.post(
  "/categories",
  createFeeCategoryController
);

router.get(
  "/categories",
  getFeeCategoriesController
);

router.get(
  "/categories/:categoryId",
  getFeeCategoryByIdController
);

router.put(
  "/categories/:categoryId",
  updateFeeCategoryController
);

router.patch(
  "/categories/:categoryId/status",
  updateFeeCategoryStatusController
);


// ============================================
// FEE STRUCTURE
// ============================================

router.post(
  "/structures",
  createFeeStructureController
);

router.get(
  "/structures",
  getFeeStructuresController
);

router.get(
  "/structures/:structureId",
  getFeeStructureByIdController
);

router.put(
  "/structures/:structureId",
  updateFeeStructureController
);

router.patch(
  "/structures/:structureId/status",
  updateFeeStructureStatusController
);


export default router;