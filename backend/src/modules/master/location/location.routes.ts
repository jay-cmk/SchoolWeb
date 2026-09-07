import {
  Router,
} from "express";

import {
  getCountriesController,
  getStatesController,
  getDistrictsController,
  getSubDistrictsController,
} from "./location.controller";

const router = Router();

// ============================================
// LOCATION MASTER ROUTES
// ============================================

// Countries
router.get(
  "/countries",
  getCountriesController
);

// States by country
router.get(
  "/states",
  getStatesController
);

// Districts by state
router.get(
  "/districts",
  getDistrictsController
);

// Sub-Districts / Tehsils by district
router.get(
  "/sub-districts",
  getSubDistrictsController
);

export default router;