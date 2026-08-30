import {
  Request,
  Response,
} from "express";

import {
  createAcademicSession,
  getAcademicSessions,
  getAcademicSessionById,
  updateAcademicSession,
} from "./academicSession.service";


  import {
  setCurrentAcademicSession,
} from "./academicSession.service";


export const createAcademicSessionController =
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
        name,
        startDate,
        endDate,
        isCurrent,
      } = req.body;

      if (
        !name ||
        !startDate ||
        !endDate
      ) {
        res.status(400).json({
          success: false,
          message:
            "Name, start date and end date are required",
        });

        return;
      }

      const session =
        await createAcademicSession(
          schoolId,
          {
            name,
            startDate,
            endDate,
            isCurrent,
          }
        );

      res.status(201).json({
        success: true,
        message:
          "Academic session created successfully",
        data: {
          session,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create academic session",
      });
    }
  };


export const getAcademicSessionsController =
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

      const sessions =
        await getAcademicSessions(
          schoolId
        );

      res.status(200).json({
        success: true,
        message:
          "Academic sessions fetched successfully",
        data: {
          sessions,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Failed to fetch academic sessions",
      });
    }
  };


export const getAcademicSessionByIdController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const schoolId =
        req.user?.schoolId;

      const { sessionId } =
        req.params;

      if (
        !schoolId ||
        typeof sessionId !== "string"
      ) {
        res.status(400).json({
          success: false,
          message:
            "Invalid request",
        });

        return;
      }

      const session =
        await getAcademicSessionById(
          schoolId,
          sessionId
        );

      res.status(200).json({
        success: true,
        message:
          "Academic session fetched successfully",
        data: {
          session,
        },
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Academic session not found",
      });
    }
  };


export const updateAcademicSessionController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const schoolId =
        req.user?.schoolId;

      const { sessionId } =
        req.params;

      if (
        !schoolId ||
        typeof sessionId !== "string"
      ) {
        res.status(400).json({
          success: false,
          message:
            "Invalid request",
        });

        return;
      }

      const session =
        await updateAcademicSession(
          schoolId,
          sessionId,
          req.body
        );

      res.status(200).json({
        success: true,
        message:
          "Academic session updated successfully",
        data: {
          session,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update academic session",
      });
    }
  };



export const setCurrentAcademicSessionController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const schoolId = req.user?.schoolId;
      const { sessionId } = req.params;

      if (!schoolId) {
        res.status(403).json({
          success: false,
          message: "School access required",
        });

        return;
      }

      if (typeof sessionId !== "string") {
        res.status(400).json({
          success: false,
          message: "Invalid session ID",
        });

        return;
      }

      const session =
        await setCurrentAcademicSession(
          schoolId,
          sessionId
        );

      res.status(200).json({
        success: true,
        message:
          "Current academic session updated successfully",
        data: {
          session,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update current session",
      });
    }
  };