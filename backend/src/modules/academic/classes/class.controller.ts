import {
  Request,
  Response,
} from "express";

import {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  updateClassStatus
} from "./class.service";


export const createClassController = async (
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
      name,
      order,
    } = req.body;

    console.log(
      "CREATE CLASS BODY:",
      req.body
    );

    if (!sessionId || !name) {
      res.status(400).json({
        success: false,
        message:
          "Session ID and class name are required",
      });

      return;
    }

    const classData =
      await createClass(
        schoolId,
        {
          sessionId,
          name,
          ...(order !== undefined
            ? { order }
            : {}),
        }
      );

    res.status(201).json({
      success: true,
      message:
        "Class created successfully",
      data: {
        class: classData,
      },
    });
  } catch (error) {
    console.log(
      "CREATE CLASS ERROR:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create class",
    });
  }
};


  export const getClassesController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const schoolId =
        req.user?.schoolId;

      if (!schoolId) {
        return res.status(400).json({
          success: false,
          message:
            "School ID is required",
        });
      }

      const academicSessionId =
        req.query.academicSessionId as
          | string
          | undefined;

      const classes =
        await getClasses(
          schoolId,
          academicSessionId
        );

      return res.status(200).json({
        success: true,
        message:
          "Classes fetched successfully",
        data: {
          classes,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to fetch classes",
      });
    }
  };


  export const getClassByIdController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const schoolId =
        req.user?.schoolId;

      const { classId } = req.params;

      if (!schoolId) {
        return res.status(400).json({
          success: false,
          message:
            "School ID is required",
        });
      }

      const classData =
        await getClassById(
          schoolId,
          classId
        );

      return res.status(200).json({
        success: true,
        message:
          "Class fetched successfully",
        data: {
          class: classData,
        },
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message:
          error.message ||
          "Class not found",
      });
    }
  };


  export const updateClassController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const schoolId =
        req.user?.schoolId;

      const { classId } = req.params;

      if (!schoolId) {
        return res.status(400).json({
          success: false,
          message:
            "School ID is required",
        });
      }

      const classData =
        await updateClass(
          schoolId,
          classId,
          req.body
        );

      return res.status(200).json({
        success: true,
        message:
          "Class updated successfully",
        data: {
          class: classData,
        },
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "Failed to update class",
      });
    }
  };


  export const updateClassStatusController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const schoolId =
        req.user?.schoolId;

      const { classId } =
        req.params;

      const { isActive } =
        req.body;

      if (!schoolId) {
        res.status(403).json({
          success: false,
          message:
            "School access required",
        });

        return;
      }

      if (
        typeof classId !== "string"
      ) {
        res.status(400).json({
          success: false,
          message:
            "Invalid class ID",
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

      const classData =
        await updateClassStatus(
          schoolId,
          classId,
          isActive
        );

      res.status(200).json({
        success: true,
        message:
          "Class status updated successfully",
        data: {
          class: classData,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update class status",
      });
    }
  };