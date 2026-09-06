import {
  Request,
  Response,
} from "express";

import {
  createFeeCategory,
  getFeeCategories,
  getFeeCategoryById,
  updateFeeCategory,
  updateFeeCategoryStatus,
} from "../services/feeCategory.service";

export const createFeeCategoryController =
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
          success: false,
          message:
            "School or user ID not found",
        });

        return;
      }

      const category =
        await createFeeCategory(
          schoolId,
          userId,
          req.body
        );

      res.status(201).json({
        success: true,
        message:
          "Fee category created successfully",
        data: {
          category,
        },
      });

    } catch (error) {

      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create fee category",
      });
    }
  };


export const getFeeCategoriesController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const schoolId =
        req.user?.schoolId;

      if (!schoolId) {
        res.status(403).json({
          success: false,
          message:
            "School ID not found",
        });

        return;
      }

      const {
        type,
        status,
        search,
      } = req.query;

      const filters: {
        type?: string;
        isActive?: boolean;
        search?: string;
      } = {};

      if (
        typeof type ===
        "string"
      ) {
        filters.type =
          type;
      }

      if (
        typeof search ===
        "string"
      ) {
        filters.search =
          search;
      }

      if (
        status === "active"
      ) {
        filters.isActive =
          true;
      }

      if (
        status === "inactive"
      ) {
        filters.isActive =
          false;
      }

      const categories =
        await getFeeCategories(
          schoolId,
          filters
        );

      res.status(200).json({
        success: true,
        message:
          "Fee categories fetched successfully",
        data: {
          categories,
        },
      });

    } catch (error) {

      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch fee categories",
      });
    }
  };


export const getFeeCategoryByIdController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const schoolId =
        req.user?.schoolId;

      const {
        categoryId,
      } = req.params;

      if (
        !schoolId ||
        typeof categoryId !==
          "string"
      ) {
        res.status(400).json({
          success: false,
          message:
            "Invalid request",
        });

        return;
      }

      const category =
        await getFeeCategoryById(
          schoolId,
          categoryId
        );

      res.status(200).json({
        success: true,
        data: {
          category,
        },
      });

    } catch (error) {

      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch fee category",
      });
    }
  };


export const updateFeeCategoryController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const schoolId =
        req.user?.schoolId;

      const {
        categoryId,
      } = req.params;

      if (
        !schoolId ||
        typeof categoryId !==
          "string"
      ) {
        res.status(400).json({
          success: false,
          message:
            "Invalid request",
        });

        return;
      }

      const category =
        await updateFeeCategory(
          schoolId,
          categoryId,
          req.body
        );

      res.status(200).json({
        success: true,
        message:
          "Fee category updated successfully",
        data: {
          category,
        },
      });

    } catch (error) {

      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update fee category",
      });
    }
  };


export const updateFeeCategoryStatusController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const schoolId =
        req.user?.schoolId;

      const {
        categoryId,
      } = req.params;

      const {
        isActive,
      } = req.body;

      if (
        !schoolId ||
        typeof categoryId !==
          "string"
      ) {
        res.status(400).json({
          success: false,
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
          success: false,
          message:
            "isActive must be boolean",
        });

        return;
      }

      const category =
        await updateFeeCategoryStatus(
          schoolId,
          categoryId,
          isActive
        );

      res.status(200).json({
        success: true,
        message:
          "Fee category status updated successfully",
        data: {
          category,
        },
      });

    } catch (error) {

      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update fee category status",
      });
    }
  };