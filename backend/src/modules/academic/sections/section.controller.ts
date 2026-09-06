import {
  Request,
  Response,
} from "express";

import {
  createSection,
  getSections,
  getSectionById,
  updateSection,
  updateSectionStatus,
} from "./section.service";


// ============================================
// CREATE
// ============================================

export const createSectionController =
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
            "School access required",
        });

        return;
      }


      const {
        sessionId,
        classId,
        name,
        roomNumber,
        capacity,
      } = req.body;


      if (
        !sessionId ||
        !classId ||
        !name
      ) {
        res.status(400).json({
          success: false,
          message:
            "Session ID, class ID and section name are required",
        });

        return;
      }


      const section =
        await createSection(
          schoolId,
          {
            sessionId,
            classId,
            name,

            ...(roomNumber !==
            undefined
              ? {
                  roomNumber,
                }
              : {}),

            ...(capacity !==
            undefined
              ? {
                  capacity,
                }
              : {}),
          }
        );


      res.status(201).json({
        success: true,
        message:
          "Section created successfully",

        data: {
          section,
        },
      });

    } catch (error) {
      res.status(400).json({
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to create section",
      });
    }
  };


// ============================================
// GET ALL
// ============================================

export const getSectionsController =
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
            "School access required",
        });

        return;
      }


      const sessionId =
        typeof req.query
          .sessionId ===
        "string"
          ? req.query
              .sessionId
          : undefined;


      const classId =
        typeof req.query
          .classId ===
        "string"
          ? req.query
              .classId
          : undefined;


      const sections =
        await getSections(
          schoolId,
          sessionId,
          classId
        );


      res.status(200).json({
        success: true,

        message:
          "Sections fetched successfully",

        data: {
          sections,
        },
      });

    } catch (error) {
      res.status(400).json({
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch sections",
      });
    }
  };


// ============================================
// GET BY ID
// ============================================

export const getSectionByIdController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const schoolId =
        req.user?.schoolId;

      const {
        sectionId,
      } = req.params;


      if (
        !schoolId ||
        typeof sectionId !==
          "string"
      ) {
        res.status(400).json({
          success: false,
          message:
            "Invalid request",
        });

        return;
      }


      const section =
        await getSectionById(
          schoolId,
          sectionId
        );


      res.status(200).json({
        success: true,

        message:
          "Section fetched successfully",

        data: {
          section,
        },
      });

    } catch (error) {
      res.status(404).json({
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Section not found",
      });
    }
  };


// ============================================
// UPDATE
// ============================================

export const updateSectionController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const schoolId =
        req.user?.schoolId;

      const {
        sectionId,
      } = req.params;


      if (
        !schoolId ||
        typeof sectionId !==
          "string"
      ) {
        res.status(400).json({
          success: false,
          message:
            "Invalid request",
        });

        return;
      }


      const section =
        await updateSection(
          schoolId,
          sectionId,
          req.body
        );


      res.status(200).json({
        success: true,

        message:
          "Section updated successfully",

        data: {
          section,
        },
      });

    } catch (error) {
      res.status(400).json({
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to update section",
      });
    }
  };


// ============================================
// STATUS
// ============================================

export const updateSectionStatusController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const schoolId =
        req.user?.schoolId;

      const {
        sectionId,
      } = req.params;

      const {
        isActive,
      } = req.body;


      if (
        !schoolId ||
        typeof sectionId !==
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


      const section =
        await updateSectionStatus(
          schoolId,
          sectionId,
          isActive
        );


      res.status(200).json({
        success: true,

        message:
          "Section status updated successfully",

        data: {
          section,
        },
      });

    } catch (error) {
      res.status(400).json({
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to update section status",
      });
    }
  };