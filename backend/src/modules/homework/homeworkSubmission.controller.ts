import type {
  Request,
  Response,
} from "express";

import {
  HomeworkReviewStatus,
  HomeworkSubmissionStatus,
} from "./homeworkSubmission.types";

import {
  createHomeworkSubmission,
  deleteHomeworkSubmission,
  getHomeworkSubmissionById,
  getHomeworkSubmissions,
  getHomeworkSubmissionStats,
  getStudentHomeworkSubmission,
  reviewHomeworkSubmission,
  updateHomeworkSubmission,
} from "./homeworkSubmission.service";


// ======================================================
// CREATE HOMEWORK SUBMISSION
// ======================================================

export const createHomeworkSubmissionController =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const schoolId =
        req.user?.schoolId;


      if (!schoolId) {
        return res.status(
          400
        ).json({
          success: false,
          message:
            "School ID not found in token",
        });
      }


      const {
        homeworkId,
        studentId,
        submissionText,
        attachment,
      } = req.body;


      if (
        !homeworkId ||
        !studentId
      ) {
        return res.status(
          400
        ).json({
          success: false,
          message:
            "Homework ID and Student ID are required",
        });
      }


      const submission =
        await createHomeworkSubmission(
          schoolId,
          {
            homeworkId,
            studentId,

            ...(submissionText !== undefined
              ? {
                  submissionText,
                }
              : {}),

            ...(attachment !== undefined
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
          "Homework submitted successfully",

        data: {
          submission,
        },
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to submit homework";


      return res.status(
        400
      ).json({
        success: false,
        message,
      });
    }
  };


// ======================================================
// GET HOMEWORK SUBMISSIONS
// ======================================================

export const getHomeworkSubmissionsController =
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


      if (!schoolId) {
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


      const filters = {

        ...(typeof req.query.studentId ===
        "string"
          ? {
              studentId:
                req.query.studentId,
            }
          : {}),


        ...(typeof req.query.submissionStatus ===
        "string"
          ? {
              submissionStatus:
                req.query
                  .submissionStatus as
                  HomeworkSubmissionStatus,
            }
          : {}),


        ...(typeof req.query.reviewStatus ===
        "string"
          ? {
              reviewStatus:
                req.query
                  .reviewStatus as
                  HomeworkReviewStatus,
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
        await getHomeworkSubmissions(
          schoolId,
          homeworkId,
          filters
        );


      return res.status(
        200
      ).json({
        success: true,
        data: result,
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch homework submissions";


      return res.status(
        400
      ).json({
        success: false,
        message,
      });
    }
  };


// ======================================================
// GET HOMEWORK SUBMISSION STATS
// ======================================================

export const getHomeworkSubmissionStatsController =
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


      if (!schoolId) {
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


      const stats =
        await getHomeworkSubmissionStats(
          schoolId,
          homeworkId
        );


      return res.status(
        200
      ).json({
        success: true,

        data: {
          stats,
        },
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch submission stats";


      return res.status(
        400
      ).json({
        success: false,
        message,
      });
    }
  };


// ======================================================
// GET SINGLE SUBMISSION
// ======================================================

export const getHomeworkSubmissionByIdController =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const schoolId =
        req.user?.schoolId;

      const {
        submissionId,
      } = req.params;


      if (!schoolId) {
        return res.status(
          400
        ).json({
          success: false,
          message:
            "School ID not found in token",
        });
      }


      if (
        !submissionId ||
        typeof submissionId !==
          "string"
      ) {
        return res.status(
          400
        ).json({
          success: false,
          message:
            "Submission ID is required",
        });
      }


      const submission =
        await getHomeworkSubmissionById(
          schoolId,
          submissionId
        );


      return res.status(
        200
      ).json({
        success: true,

        data: {
          submission,
        },
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch homework submission";


      return res.status(
        400
      ).json({
        success: false,
        message,
      });
    }
  };


// ======================================================
// UPDATE HOMEWORK SUBMISSION
// ======================================================

export const updateHomeworkSubmissionController =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const schoolId =
        req.user?.schoolId;

      const {
        submissionId,
      } = req.params;


      if (!schoolId) {
        return res.status(
          400
        ).json({
          success: false,
          message:
            "School ID not found in token",
        });
      }


      if (
        !submissionId ||
        typeof submissionId !==
          "string"
      ) {
        return res.status(
          400
        ).json({
          success: false,
          message:
            "Submission ID is required",
        });
      }


      const {
        submissionText,
        attachment,
      } = req.body;


      const submission =
        await updateHomeworkSubmission(
          schoolId,
          submissionId,
          {
            ...(submissionText !== undefined
              ? {
                  submissionText,
                }
              : {}),

            ...(attachment !== undefined
              ? {
                  attachment,
                }
              : {}),
          }
        );


      return res.status(
        200
      ).json({
        success: true,

        message:
          "Homework submission updated successfully",

        data: {
          submission,
        },
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to update homework submission";


      return res.status(
        400
      ).json({
        success: false,
        message,
      });
    }
  };


// ======================================================
// REVIEW HOMEWORK SUBMISSION
// ======================================================

export const reviewHomeworkSubmissionController =
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
        submissionId,
      } = req.params;


      if (!schoolId) {
        return res.status(
          400
        ).json({
          success: false,
          message:
            "School ID not found in token",
        });
      }


      if (!userId) {
        return res.status(
          401
        ).json({
          success: false,
          message:
            "User ID not found in token",
        });
      }


      if (
        !submissionId ||
        typeof submissionId !==
          "string"
      ) {
        return res.status(
          400
        ).json({
          success: false,
          message:
            "Submission ID is required",
        });
      }


      const {
        remarks,
        marks,
      } = req.body;


      const submission =
        await reviewHomeworkSubmission(
          schoolId,
          submissionId,
          userId,
          {
            ...(remarks !== undefined
              ? {
                  remarks,
                }
              : {}),

            ...(marks !== undefined
              ? {
                  marks:
                    Number(marks),
                }
              : {}),
          }
        );


      return res.status(
        200
      ).json({
        success: true,

        message:
          "Homework submission reviewed successfully",

        data: {
          submission,
        },
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to review homework submission";


      return res.status(
        400
      ).json({
        success: false,
        message,
      });
    }
  };


// ======================================================
// DELETE HOMEWORK SUBMISSION
// ======================================================

export const deleteHomeworkSubmissionController =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const schoolId =
        req.user?.schoolId;

      const {
        submissionId,
      } = req.params;


      if (!schoolId) {
        return res.status(
          400
        ).json({
          success: false,
          message:
            "School ID not found in token",
        });
      }


      if (
        !submissionId ||
        typeof submissionId !==
          "string"
      ) {
        return res.status(
          400
        ).json({
          success: false,
          message:
            "Submission ID is required",
        });
      }


      const result =
        await deleteHomeworkSubmission(
          schoolId,
          submissionId
        );


      return res.status(
        200
      ).json({
        success: true,
        ...result,
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete homework submission";


      return res.status(
        400
      ).json({
        success: false,
        message,
      });
    }
  };


// ======================================================
// GET STUDENT SUBMISSION FOR HOMEWORK
// ======================================================

export const getStudentHomeworkSubmissionController =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const schoolId =
        req.user?.schoolId;

      const {
        homeworkId,
        studentId,
      } = req.params;


      if (!schoolId) {
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


      if (
        !studentId ||
        typeof studentId !==
          "string"
      ) {
        return res.status(
          400
        ).json({
          success: false,
          message:
            "Student ID is required",
        });
      }


      const submission =
        await getStudentHomeworkSubmission(
          schoolId,
          homeworkId,
          studentId
        );


      return res.status(
        200
      ).json({
        success: true,

        data: {
          submission,
        },
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch student homework submission";


      return res.status(
        400
      ).json({
        success: false,
        message,
      });
    }
  };