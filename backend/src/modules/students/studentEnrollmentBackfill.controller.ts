import type {
  Request,
  Response,
} from "express";

import {
  backfillStudentEnrollments,
} from "./studentEnrollmentBackfill.service";


export const backfillStudentEnrollmentsController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const schoolId =
        req.user?.schoolId;

      const userId =
        req.user?.userId;


      if (!schoolId) {

        res.status(401).json({
          success: false,
          message:
            "School context not found.",
        });

        return;
      }


      if (!userId) {

        res.status(401).json({
          success: false,
          message:
            "Authenticated user not found.",
        });

        return;
      }


      const result =
        await backfillStudentEnrollments(
          schoolId.toString(),
          userId.toString()
        );


      res.status(200).json({

        success: true,

        message:
          "Student enrollment backfill completed.",

        data:
          result,
      });

    } catch (error) {

      res.status(400).json({

        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Student enrollment backfill failed.",
      });
    }
  };