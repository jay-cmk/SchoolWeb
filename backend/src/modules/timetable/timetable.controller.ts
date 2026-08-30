import type {
  Request,
  Response,
} from "express";

import {
  TimetableDay,
  TimetablePeriodType,
} from "./timetable.types";

import type {
  TimetableFilters,
  CreateTimetableData,
  UpdateTimetableData,
  CopyTimetableData,
} from "./timetable.types";

import {
  createTimetablePeriod,
  getTimetable,
  getTimetableById,
  updateTimetablePeriod,
  deleteTimetablePeriod,
  copyTimetable,
} from "./timetable.service";


// ============================================
// QUERY HELPER
// ============================================

const getStringQuery = (
  value: unknown
): string | undefined => {
  return typeof value ===
    "string"
    ? value
    : undefined;
};


// ============================================
// DAY VALIDATOR
// ============================================

const isTimetableDay = (
  value: unknown
): value is TimetableDay => {
  return (
    typeof value ===
      "string" &&
    Object.values(
      TimetableDay
    ).includes(
      value as TimetableDay
    )
  );
};


// ============================================
// PERIOD TYPE VALIDATOR
// ============================================

const isTimetablePeriodType = (
  value: unknown
): value is TimetablePeriodType => {
  return (
    typeof value ===
      "string" &&
    Object.values(
      TimetablePeriodType
    ).includes(
      value as TimetablePeriodType
    )
  );
};


// ============================================
// CREATE
//
// POST /api/v1/timetable
// ============================================

export const createTimetableController =
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
        !schoolId ||
        !userId
      ) {
        return res
          .status(401)
          .json({
            success: false,

            message:
              "Unauthorized",
          });
      }


      // ========================================
      // BODY
      // ========================================

      const {
        sessionId,
        classId,
        sectionId,
        day,
        periodNumber,
        startTime,
        endTime,
        periodType,
        subjectId,
        teacherId,
        roomNumber,
      } = req.body;


      // ========================================
      // REQUIRED FIELDS
      // ========================================

      if (
        typeof sessionId !==
          "string" ||
        !sessionId ||
        typeof classId !==
          "string" ||
        !classId ||
        typeof sectionId !==
          "string" ||
        !sectionId
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Session, class and section are required",
          });
      }


      if (
        !isTimetableDay(
          day
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Invalid timetable day",
          });
      }


      if (
        typeof periodNumber !==
          "number" ||
        !Number.isInteger(
          periodNumber
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Period number must be a valid integer",
          });
      }


      if (
        typeof startTime !==
          "string" ||
        !startTime ||
        typeof endTime !==
          "string" ||
        !endTime
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Start time and end time are required",
          });
      }


      if (
        !isTimetablePeriodType(
          periodType
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Invalid period type",
          });
      }


      // ========================================
      // BUILD PAYLOAD
      //
      // exactOptionalPropertyTypes safe
      // ========================================

      const payload:
        CreateTimetableData = {

        sessionId,

        classId,

        sectionId,

        day,

        periodNumber,

        startTime,

        endTime,

        periodType,
      };


      if (
        typeof subjectId ===
          "string" &&
        subjectId
      ) {
        payload.subjectId =
          subjectId;
      }


      if (
        typeof teacherId ===
          "string" &&
        teacherId
      ) {
        payload.teacherId =
          teacherId;
      }


      if (
        typeof roomNumber ===
          "string" &&
        roomNumber.trim()
      ) {
        payload.roomNumber =
          roomNumber.trim();
      }


      // ========================================
      // SERVICE
      // ========================================

      const timetable =
        await createTimetablePeriod(
          schoolId,
          userId,
          payload
        );


      return res
        .status(201)
        .json({
          success: true,

          message:
            "Timetable period created successfully",

          data: {
            timetable,
          },
        });

    } catch (error) {

      return res
        .status(400)
        .json({
          success: false,

          message:
            error instanceof Error
              ? error.message
              : "Failed to create timetable period",
        });
    }
  };


// ============================================
// GET ALL / WEEKLY / DAILY / TEACHER
//
// GET /api/v1/timetable
// ============================================

export const getTimetableController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const schoolId =
        req.user?.schoolId;


      if (!schoolId) {
        return res
          .status(401)
          .json({
            success: false,

            message:
              "Unauthorized",
          });
      }


      // ========================================
      // FILTERS
      //
      // exactOptionalPropertyTypes safe
      // ========================================

      const filters:
        TimetableFilters = {};


      const sessionId =
        getStringQuery(
          req.query.sessionId
        );


      const classId =
        getStringQuery(
          req.query.classId
        );


      const sectionId =
        getStringQuery(
          req.query.sectionId
        );


      const teacherId =
        getStringQuery(
          req.query.teacherId
        );


      const subjectId =
        getStringQuery(
          req.query.subjectId
        );


      const day =
        getStringQuery(
          req.query.day
        );


      const periodType =
        getStringQuery(
          req.query.periodType
        );


      const isActive =
        getStringQuery(
          req.query.isActive
        );


      // ========================================
      // SESSION
      // ========================================

      if (sessionId) {
        filters.sessionId =
          sessionId;
      }


      // ========================================
      // CLASS
      // ========================================

      if (classId) {
        filters.classId =
          classId;
      }


      // ========================================
      // SECTION
      // ========================================

      if (sectionId) {
        filters.sectionId =
          sectionId;
      }


      // ========================================
      // TEACHER
      // ========================================

      if (teacherId) {
        filters.teacherId =
          teacherId;
      }


      // ========================================
      // SUBJECT
      // ========================================

      if (subjectId) {
        filters.subjectId =
          subjectId;
      }


      // ========================================
      // DAY
      // ========================================

      if (day) {
        if (
          !isTimetableDay(
            day
          )
        ) {
          return res
            .status(400)
            .json({
              success: false,

              message:
                "Invalid timetable day",
            });
        }


        filters.day =
          day;
      }


      // ========================================
      // PERIOD TYPE
      // ========================================

      if (periodType) {
        if (
          !isTimetablePeriodType(
            periodType
          )
        ) {
          return res
            .status(400)
            .json({
              success: false,

              message:
                "Invalid period type",
            });
        }


        filters.periodType =
          periodType;
      }


      // ========================================
      // ACTIVE STATUS
      // ========================================

      if (
        isActive !==
        undefined
      ) {
        if (
          isActive !==
            "true" &&
          isActive !==
            "false"
        ) {
          return res
            .status(400)
            .json({
              success: false,

              message:
                "isActive must be true or false",
            });
        }


        filters.isActive =
          isActive ===
          "true";
      }


      // ========================================
      // SERVICE
      // ========================================

      const timetable =
        await getTimetable(
          schoolId,
          filters
        );


      return res
        .status(200)
        .json({
          success: true,

          message:
            "Timetable fetched successfully",

          data: {
            timetable,
          },
        });

    } catch (error) {

      return res
        .status(400)
        .json({
          success: false,

          message:
            error instanceof Error
              ? error.message
              : "Failed to fetch timetable",
        });
    }
  };


// ============================================
// GET ONE
//
// GET /api/v1/timetable/:timetableId
// ============================================

export const getTimetableByIdController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const schoolId =
        req.user?.schoolId;


      const timetableId =
        req.params.timetableId;


      if (!schoolId) {
        return res
          .status(401)
          .json({
            success: false,

            message:
              "Unauthorized",
          });
      }


      if (
        typeof timetableId !==
          "string" ||
        !timetableId
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Timetable ID is required",
          });
      }


      const timetable =
        await getTimetableById(
          schoolId,
          timetableId
        );


      return res
        .status(200)
        .json({
          success: true,

          message:
            "Timetable period fetched successfully",

          data: {
            timetable,
          },
        });

    } catch (error) {

      return res
        .status(400)
        .json({
          success: false,

          message:
            error instanceof Error
              ? error.message
              : "Failed to fetch timetable period",
        });
    }
  };


// ============================================
// UPDATE
//
// PUT /api/v1/timetable/:timetableId
// ============================================

export const updateTimetableController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const schoolId =
        req.user?.schoolId;

      const userId =
        req.user?.userId;

      const timetableId =
        req.params.timetableId;


      if (
        !schoolId ||
        !userId
      ) {
        return res
          .status(401)
          .json({
            success: false,

            message:
              "Unauthorized",
          });
      }


      if (
        typeof timetableId !==
          "string" ||
        !timetableId
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Timetable ID is required",
          });
      }


      // ========================================
      // UPDATE PAYLOAD
      // ========================================

      const payload:
        UpdateTimetableData = {};


      // ========================================
      // DAY
      // ========================================

      if (
        req.body.day !==
        undefined
      ) {
        if (
          !isTimetableDay(
            req.body.day
          )
        ) {
          return res
            .status(400)
            .json({
              success: false,

              message:
                "Invalid timetable day",
            });
        }


        payload.day =
          req.body.day;
      }


      // ========================================
      // PERIOD NUMBER
      // ========================================

      if (
        req.body.periodNumber !==
        undefined
      ) {
        if (
          typeof req.body.periodNumber !==
            "number" ||
          !Number.isInteger(
            req.body.periodNumber
          )
        ) {
          return res
            .status(400)
            .json({
              success: false,

              message:
                "Period number must be a valid integer",
            });
        }


        payload.periodNumber =
          req.body.periodNumber;
      }


      // ========================================
      // START TIME
      // ========================================

      if (
        req.body.startTime !==
        undefined
      ) {
        if (
          typeof req.body.startTime !==
          "string"
        ) {
          return res
            .status(400)
            .json({
              success: false,

              message:
                "Start time must be a string",
            });
        }


        payload.startTime =
          req.body.startTime;
      }


      // ========================================
      // END TIME
      // ========================================

      if (
        req.body.endTime !==
        undefined
      ) {
        if (
          typeof req.body.endTime !==
          "string"
        ) {
          return res
            .status(400)
            .json({
              success: false,

              message:
                "End time must be a string",
            });
        }


        payload.endTime =
          req.body.endTime;
      }


      // ========================================
      // PERIOD TYPE
      // ========================================

      if (
        req.body.periodType !==
        undefined
      ) {
        if (
          !isTimetablePeriodType(
            req.body.periodType
          )
        ) {
          return res
            .status(400)
            .json({
              success: false,

              message:
                "Invalid period type",
            });
        }


        payload.periodType =
          req.body.periodType;
      }


      // ========================================
      // SUBJECT
      //
      // null = remove
      // ========================================

      if (
        req.body.subjectId !==
        undefined
      ) {
        if (
          req.body.subjectId ===
          null
        ) {
          payload.subjectId =
            null;

        } else if (
          typeof req.body.subjectId ===
            "string"
        ) {
          payload.subjectId =
            req.body.subjectId;

        } else {
          return res
            .status(400)
            .json({
              success: false,

              message:
                "Subject ID must be a string or null",
            });
        }
      }


      // ========================================
      // TEACHER
      // ========================================

      if (
        req.body.teacherId !==
        undefined
      ) {
        if (
          req.body.teacherId ===
          null
        ) {
          payload.teacherId =
            null;

        } else if (
          typeof req.body.teacherId ===
            "string"
        ) {
          payload.teacherId =
            req.body.teacherId;

        } else {
          return res
            .status(400)
            .json({
              success: false,

              message:
                "Teacher ID must be a string or null",
            });
        }
      }


      // ========================================
      // ROOM
      // ========================================

      if (
        req.body.roomNumber !==
        undefined
      ) {
        if (
          req.body.roomNumber ===
          null
        ) {
          payload.roomNumber =
            null;

        } else if (
          typeof req.body.roomNumber ===
            "string"
        ) {
          payload.roomNumber =
            req.body.roomNumber;

        } else {
          return res
            .status(400)
            .json({
              success: false,

              message:
                "Room number must be a string or null",
            });
        }
      }


      // ========================================
      // ACTIVE
      // ========================================

      if (
        req.body.isActive !==
        undefined
      ) {
        if (
          typeof req.body.isActive !==
          "boolean"
        ) {
          return res
            .status(400)
            .json({
              success: false,

              message:
                "isActive must be boolean",
            });
        }


        payload.isActive =
          req.body.isActive;
      }


      // ========================================
      // CHECK EMPTY UPDATE
      // ========================================

      if (
        Object.keys(
          payload
        ).length ===
        0
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "At least one field is required for update",
          });
      }


      const timetable =
        await updateTimetablePeriod(
          schoolId,
          timetableId,
          userId,
          payload
        );


      return res
        .status(200)
        .json({
          success: true,

          message:
            "Timetable period updated successfully",

          data: {
            timetable,
          },
        });

    } catch (error) {

      return res
        .status(400)
        .json({
          success: false,

          message:
            error instanceof Error
              ? error.message
              : "Failed to update timetable period",
        });
    }
  };


// ============================================
// DELETE
//
// DELETE /api/v1/timetable/:timetableId
// ============================================

export const deleteTimetableController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const schoolId =
        req.user?.schoolId;

      const timetableId =
        req.params.timetableId;


      if (!schoolId) {
        return res
          .status(401)
          .json({
            success: false,

            message:
              "Unauthorized",
          });
      }


      if (
        typeof timetableId !==
          "string" ||
        !timetableId
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Timetable ID is required",
          });
      }


      const timetable =
        await deleteTimetablePeriod(
          schoolId,
          timetableId
        );


      return res
        .status(200)
        .json({
          success: true,

          message:
            "Timetable period deleted successfully",

          data: {
            timetable,
          },
        });

    } catch (error) {

      return res
        .status(400)
        .json({
          success: false,

          message:
            error instanceof Error
              ? error.message
              : "Failed to delete timetable period",
        });
    }
  };


// ============================================
// COPY
//
// POST /api/v1/timetable/copy
// ============================================

export const copyTimetableController =
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
        !schoolId ||
        !userId
      ) {
        return res
          .status(401)
          .json({
            success: false,

            message:
              "Unauthorized",
          });
      }


      const {
        sessionId,
        sourceClassId,
        sourceSectionId,
        targetClassId,
        targetSectionId,
      } = req.body;


      if (
        typeof sessionId !==
          "string" ||
        !sessionId ||
        typeof sourceClassId !==
          "string" ||
        !sourceClassId ||
        typeof sourceSectionId !==
          "string" ||
        !sourceSectionId ||
        typeof targetClassId !==
          "string" ||
        !targetClassId ||
        typeof targetSectionId !==
          "string" ||
        !targetSectionId
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Session, source class, source section, target class and target section are required",
          });
      }


      const payload:
        CopyTimetableData = {

        sessionId,

        sourceClassId,

        sourceSectionId,

        targetClassId,

        targetSectionId,
      };


      const result =
        await copyTimetable(
          schoolId,
          userId,
          payload
        );


      // ========================================
      // RESPONSE MESSAGE
      // ========================================

      const message =
        result.skipped >
        0
          ? `Timetable copy completed. ${result.copied} period(s) copied and ${result.skipped} skipped.`
          : `${result.copied} timetable period(s) copied successfully.`;


      return res
        .status(200)
        .json({
          success: true,

          message,

          data: {
            copied:
              result.copied,

            skipped:
              result.skipped,

            conflicts:
              result.conflicts,
          },
        });

    } catch (error) {

      return res
        .status(400)
        .json({
          success: false,

          message:
            error instanceof Error
              ? error.message
              : "Failed to copy timetable",
        });
    }
  };