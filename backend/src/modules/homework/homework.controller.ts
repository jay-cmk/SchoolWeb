import type {
  Request,
  Response,
} from "express";

import {
  HomeworkStatus,
} from "./homework.types";

import {
  changeHomeworkStatus,
  createHomework,
  deleteHomework,
  getHomeworkById,
  getHomeworks,
  getHomeworkStats,
  updateHomework,
} from "./homework.service";


// ============================================
// CREATE HOMEWORK
// ============================================

export const createHomeworkController =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const schoolId =
        req.user?.schoolId;

      const userId =
        req.user?.userId;


      if (
        !schoolId
      ) {
        return res.status(
          400
        ).json({
          success: false,

          message:
            "School ID not found in token",
        });
      }


      if (
        !userId
      ) {
        return res.status(
          401
        ).json({
          success: false,

          message:
            "User ID not found in token",
        });
      }


      const {
        sessionId,
        classId,
        sectionId,
        subjectId,
        teacherId,
        title,
        description,
        assignedDate,
        dueDate,
        status,
        attachment,
      } = req.body;


      if (
        !sessionId ||
        !classId ||
        !sectionId ||
        !subjectId ||
        !teacherId ||
        !title ||
        !description ||
        !assignedDate ||
        !dueDate
      ) {

        return res.status(
          400
        ).json({
          success: false,

          message:
            "Required homework fields are missing",
        });
      }


      const homework =
        await createHomework(
          schoolId,
          userId,
          {
            sessionId,

            classId,

            sectionId,

            subjectId,

            teacherId,

            title,

            description,

            assignedDate,

            dueDate,

            ...(status !==
            undefined
              ? {
                  status,
                }
              : {}),

            ...(attachment !==
            undefined
              ? {
                  attachment,
                }
              : {}),
          }
        );


      return res.status(
        201
      ).json({
        success: true,

        message:
          "Homework created successfully",

        data: {
          homework,
        },
      });

    } catch (
      error
    ) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to create homework";


      return res.status(
        400
      ).json({
        success: false,

        message,
      });

    }

  };


// ============================================
// GET HOMEWORK LIST
// ============================================

export const getHomeworksController =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const schoolId =
        req.user?.schoolId;


      if (
        !schoolId
      ) {

        return res.status(
          400
        ).json({
          success: false,

          message:
            "School ID not found in token",
        });

      }


      const filters = {
        ...(typeof req.query.sessionId ===
        "string"
          ? {
              sessionId:
                req.query.sessionId,
            }
          : {}),

        ...(typeof req.query.classId ===
        "string"
          ? {
              classId:
                req.query.classId,
            }
          : {}),

        ...(typeof req.query.sectionId ===
        "string"
          ? {
              sectionId:
                req.query.sectionId,
            }
          : {}),

        ...(typeof req.query.subjectId ===
        "string"
          ? {
              subjectId:
                req.query.subjectId,
            }
          : {}),

        ...(typeof req.query.teacherId ===
        "string"
          ? {
              teacherId:
                req.query.teacherId,
            }
          : {}),

        ...(typeof req.query.status ===
        "string"
          ? {
              status:
                req.query.status as HomeworkStatus,
            }
          : {}),

        ...(typeof req.query.fromDate ===
        "string"
          ? {
              fromDate:
                req.query.fromDate,
            }
          : {}),

        ...(typeof req.query.toDate ===
        "string"
          ? {
              toDate:
                req.query.toDate,
            }
          : {}),

        ...(typeof req.query.search ===
        "string"
          ? {
              search:
                req.query.search,
            }
          : {}),

        ...(typeof req.query.page ===
        "string"
          ? {
              page:
                Number(
                  req.query.page
                ),
            }
          : {}),

        ...(typeof req.query.limit ===
        "string"
          ? {
              limit:
                Number(
                  req.query.limit
                ),
            }
          : {}),
      };


      const result =
        await getHomeworks(
          schoolId,
          filters
        );


      return res.status(
        200
      ).json({
        success: true,

        data: result,
      });

    } catch (
      error
    ) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch homework";


      return res.status(
        400
      ).json({
        success: false,

        message,
      });

    }

  };


// ============================================
// GET HOMEWORK BY ID
// ============================================

export const getHomeworkByIdController =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const schoolId =
        req.user?.schoolId;


      const {
        homeworkId,
      } = req.params;


      if (
        !schoolId
      ) {

        return res.status(
          400
        ).json({
          success: false,

          message:
            "School ID not found in token",
        });

      }


      if (
        !homeworkId ||
        typeof homeworkId !==
          "string"
      ) {

        return res.status(
          400
        ).json({
          success: false,

          message:
            "Homework ID is required",
        });

      }


      const homework =
        await getHomeworkById(
          schoolId,
          homeworkId
        );


      return res.status(
        200
      ).json({
        success: true,

        data: {
          homework,
        },
      });

    } catch (
      error
    ) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch homework";


      return res.status(
        400
      ).json({
        success: false,

        message,
      });

    }

  };


// ============================================
// UPDATE HOMEWORK
// ============================================

export const updateHomeworkController =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const schoolId =
        req.user?.schoolId;

      const userId =
        req.user?.userId;

      const {
        homeworkId,
      } = req.params;


      if (
        !schoolId
      ) {

        return res.status(
          400
        ).json({
          success: false,

          message:
            "School ID not found in token",
        });

      }


      if (
        !userId
      ) {

        return res.status(
          401
        ).json({
          success: false,

          message:
            "User ID not found in token",
        });

      }


      if (
        !homeworkId ||
        typeof homeworkId !==
          "string"
      ) {

        return res.status(
          400
        ).json({
          success: false,

          message:
            "Homework ID is required",
        });

      }


      const homework =
        await updateHomework(
          schoolId,
          homeworkId,
          userId,
          req.body
        );


      return res.status(
        200
      ).json({
        success: true,

        message:
          "Homework updated successfully",

        data: {
          homework,
        },
      });

    } catch (
      error
    ) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to update homework";


      return res.status(
        400
      ).json({
        success: false,

        message,
      });

    }

  };


// ============================================
// CHANGE HOMEWORK STATUS
// ============================================

export const changeHomeworkStatusController =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const schoolId =
        req.user?.schoolId;

      const userId =
        req.user?.userId;

      const {
        homeworkId,
      } = req.params;

      const {
        status,
      } = req.body;


      if (
        !schoolId
      ) {

        return res.status(
          400
        ).json({
          success: false,

          message:
            "School ID not found in token",
        });

      }


      if (
        !userId
      ) {

        return res.status(
          401
        ).json({
          success: false,

          message:
            "User ID not found in token",
        });

      }


      if (
        !homeworkId ||
        typeof homeworkId !==
          "string"
      ) {

        return res.status(
          400
        ).json({
          success: false,

          message:
            "Homework ID is required",
        });

      }


      if (
        !status
      ) {

        return res.status(
          400
        ).json({
          success: false,

          message:
            "Homework status is required",
        });

      }


      if (
        !Object.values(
          HomeworkStatus
        ).includes(
          status as HomeworkStatus
        )
      ) {

        return res.status(
          400
        ).json({
          success: false,

          message:
            "Invalid homework status",
        });

      }


      const homework =
        await changeHomeworkStatus(
          schoolId,
          homeworkId,
          userId,
          status as HomeworkStatus
        );


      return res.status(
        200
      ).json({
        success: true,

        message:
          "Homework status updated successfully",

        data: {
          homework,
        },
      });

    } catch (
      error
    ) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to update homework status";


      return res.status(
        400
      ).json({
        success: false,

        message,
      });

    }

  };


// ============================================
// DELETE HOMEWORK
// ============================================

export const deleteHomeworkController =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const schoolId =
        req.user?.schoolId;

      const userId =
        req.user?.userId;

      const {
        homeworkId,
      } = req.params;


      if (
        !schoolId
      ) {

        return res.status(
          400
        ).json({
          success: false,

          message:
            "School ID not found in token",
        });

      }


      if (
        !userId
      ) {

        return res.status(
          401
        ).json({
          success: false,

          message:
            "User ID not found in token",
        });

      }


      if (
        !homeworkId ||
        typeof homeworkId !==
          "string"
      ) {

        return res.status(
          400
        ).json({
          success: false,

          message:
            "Homework ID is required",
        });

      }


      const result =
        await deleteHomework(
          schoolId,
          homeworkId,
          userId
        );


      return res.status(
        200
      ).json({
        success: true,

        ...result,
      });

    } catch (
      error
    ) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete homework";


      return res.status(
        400
      ).json({
        success: false,

        message,
      });

    }

  };


// ============================================
// HOMEWORK STATS
// ============================================

export const getHomeworkStatsController =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const schoolId =
        req.user?.schoolId;


      if (
        !schoolId
      ) {

        return res.status(
          400
        ).json({
          success: false,

          message:
            "School ID not found in token",
        });

      }


      const stats =
        await getHomeworkStats(
          schoolId
        );


      return res.status(
        200
      ).json({
        success: true,

        data: {
          stats,
        },
      });

    } catch (
      error
    ) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch homework stats";


      return res.status(
        400
      ).json({
        success: false,

        message,
      });

    }

  };