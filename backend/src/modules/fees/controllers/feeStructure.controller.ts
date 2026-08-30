import {
  Request,
  Response,
} from "express";

import {
  createFeeStructure,
  getFeeStructures,
  getFeeStructureById,
  updateFeeStructure,
  updateFeeStructureStatus,
} from "../services/feeStructure.service";


// ============================================
// CREATE
// ============================================

export const createFeeStructureController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const schoolId =
        req.user?.schoolId;

      const userId =
        req.user?.userId;


      if (
        !schoolId ||
        !userId
      ) {

        res.status(403).json({
          success:
            false,

          message:
            "School or user ID not found",
        });

        return;
      }


      const structure =
        await createFeeStructure(
          schoolId,
          userId,
          req.body
        );


      res.status(201).json({
        success:
          true,

        message:
          "Fee structure created successfully",

        data: {
          structure,
        },
      });

    } catch (error) {

      res.status(400).json({
        success:
          false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to create fee structure",
      });
    }
  };


// ============================================
// GET ALL
// ============================================

export const getFeeStructuresController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const schoolId =
        req.user?.schoolId;


      if (!schoolId) {

        res.status(403).json({
          success:
            false,

          message:
            "School ID not found",
        });

        return;
      }


      const {
        sessionId,
        feeCategoryId,
        status,
        search,
      } = req.query;


      const filters: {
        sessionId?: string;
        feeCategoryId?: string;
        isActive?: boolean;
        search?: string;
      } = {};


      if (
        typeof sessionId ===
        "string"
      ) {
        filters.sessionId =
          sessionId;
      }


      if (
        typeof feeCategoryId ===
        "string"
      ) {
        filters.feeCategoryId =
          feeCategoryId;
      }


      if (
        typeof search ===
        "string"
      ) {
        filters.search =
          search;
      }


      if (
        status ===
        "active"
      ) {
        filters.isActive =
          true;
      }


      if (
        status ===
        "inactive"
      ) {
        filters.isActive =
          false;
      }


      const structures =
        await getFeeStructures(
          schoolId,
          filters
        );


      res.status(200).json({
        success:
          true,

        message:
          "Fee structures fetched successfully",

        data: {
          structures,
        },
      });

    } catch (error) {

      res.status(400).json({
        success:
          false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch fee structures",
      });
    }
  };


// ============================================
// GET BY ID
// ============================================

export const getFeeStructureByIdController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const schoolId =
        req.user?.schoolId;

      const {
        structureId,
      } = req.params;


      if (
        !schoolId ||
        typeof structureId !==
          "string"
      ) {

        res.status(400).json({
          success:
            false,

          message:
            "Invalid request",
        });

        return;
      }


      const structure =
        await getFeeStructureById(
          schoolId,
          structureId
        );


      res.status(200).json({
        success:
          true,

        data: {
          structure,
        },
      });

    } catch (error) {

      res.status(400).json({
        success:
          false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch fee structure",
      });
    }
  };


// ============================================
// UPDATE
// ============================================

export const updateFeeStructureController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const schoolId =
        req.user?.schoolId;

      const {
        structureId,
      } = req.params;


      if (
        !schoolId ||
        typeof structureId !==
          "string"
      ) {

        res.status(400).json({
          success:
            false,

          message:
            "Invalid request",
        });

        return;
      }


      const structure =
        await updateFeeStructure(
          schoolId,
          structureId,
          req.body
        );


      res.status(200).json({
        success:
          true,

        message:
          "Fee structure updated successfully",

        data: {
          structure,
        },
      });

    } catch (error) {

      res.status(400).json({
        success:
          false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to update fee structure",
      });
    }
  };


// ============================================
// STATUS
// ============================================

export const updateFeeStructureStatusController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const schoolId =
        req.user?.schoolId;

      const {
        structureId,
      } = req.params;

      const {
        isActive,
      } = req.body;


      if (
        !schoolId ||
        typeof structureId !==
          "string"
      ) {

        res.status(400).json({
          success:
            false,

          message:
            "Invalid request",
        });

        return;
      }


      if (
        typeof isActive !==
        "boolean"
      ) {

        res.status(400).json({
          success:
            false,

          message:
            "isActive must be boolean",
        });

        return;
      }


      const structure =
        await updateFeeStructureStatus(
          schoolId,
          structureId,
          isActive
        );


      res.status(200).json({
        success:
          true,

        message:
          "Fee structure status updated successfully",

        data: {
          structure,
        },
      });

    } catch (error) {

      res.status(400).json({
        success:
          false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to update fee structure status",
      });
    }
  };