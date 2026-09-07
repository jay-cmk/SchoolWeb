import {
  Request,
  Response,
} from "express";

import {
  getCountries,
  getStatesByCountry,
  getDistrictsByState,
  getSubDistrictsByDistrict,
} from "./location.service";

// ============================================
// GET COUNTRIES
// ============================================

export const getCountriesController =
  async (
    _req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const countries =
        await getCountries();

      res.status(200).json({
        success: true,
        message:
          "Countries fetched successfully",
        data: {
          countries,
        },
      });
    } catch (error) {
      console.error(
        "Get countries error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch countries",
      });
    }
  };

// ============================================
// GET STATES
// ============================================

export const getStatesController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const countryCode =
        typeof req.query
          .countryCode ===
        "string"
          ? req.query
              .countryCode
          : "IN";

      const states =
        await getStatesByCountry(
          countryCode
        );

      res.status(200).json({
        success: true,
        message:
          "States fetched successfully",
        data: {
          states,
        },
      });
    } catch (error) {
      console.error(
        "Get states error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch states",
      });
    }
  };

// ============================================
// GET DISTRICTS
// ============================================

export const getDistrictsController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const stateCodeRaw =
        req.query.stateCode;

      if (
        typeof stateCodeRaw !==
          "string" ||
        !stateCodeRaw.trim()
      ) {
        res.status(400).json({
          success: false,
          message:
            "stateCode is required",
        });

        return;
      }

      const stateCode =
        Number(stateCodeRaw);

      if (
        !Number.isInteger(
          stateCode
        ) ||
        stateCode <= 0
      ) {
        res.status(400).json({
          success: false,
          message:
            "stateCode must be a valid number",
        });

        return;
      }

      const districts =
        await getDistrictsByState(
          stateCode
        );

      res.status(200).json({
        success: true,
        message:
          "Districts fetched successfully",
        data: {
          districts,
        },
      });
    } catch (error) {
      console.error(
        "Get districts error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch districts",
      });
    }
  };

// ============================================
// GET SUB-DISTRICTS / TEHSILS
// ============================================

export const getSubDistrictsController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const districtCodeRaw =
        req.query.districtCode;

      if (
        typeof districtCodeRaw !==
          "string" ||
        !districtCodeRaw.trim()
      ) {
        res.status(400).json({
          success: false,
          message:
            "districtCode is required",
        });

        return;
      }

      const districtCode =
        Number(
          districtCodeRaw
        );

      if (
        !Number.isInteger(
          districtCode
        ) ||
        districtCode <= 0
      ) {
        res.status(400).json({
          success: false,
          message:
            "districtCode must be a valid number",
        });

        return;
      }

      const subDistricts =
        await getSubDistrictsByDistrict(
          districtCode
        );

      res.status(200).json({
        success: true,
        message:
          "Sub-districts fetched successfully",
        data: {
          subDistricts,
        },
      });
    } catch (error) {
      console.error(
        "Get sub-districts error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch sub-districts",
      });
    }
  };