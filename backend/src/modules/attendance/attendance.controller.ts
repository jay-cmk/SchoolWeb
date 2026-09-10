

import type {
  Request,
  Response,
} from "express";

import {
  AttendanceStatus,
} from "./attendance.types";

import type {
  BulkAttendanceData,
  AttendanceFilters,
  UpdateAttendanceData,
  StudentAttendanceSummaryFilters,
} from "./attendance.types";

import {
  markBulkAttendance,
  getAttendance,
  updateAttendance,
  getMonthlyAttendanceSummary,
  getStudentAttendanceSummary,
} from "./attendance.service";


// ============================================
// GET STRING QUERY HELPER
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
// ATTENDANCE STATUS HELPER
// ============================================

const isAttendanceStatus = (
  value: unknown
): value is AttendanceStatus => {
  return (
    typeof value ===
      "string" &&
    Object.values(
      AttendanceStatus
    ).includes(
      value as AttendanceStatus
    )
  );
};


// ============================================
// BULK MARK ATTENDANCE
//
// POST /api/v1/attendance/bulk
//
// SCHOOL_ADMIN + TEACHER
//
// Teacher access will be validated in service
// using SubjectAssignment.
// ============================================

export const markBulkAttendanceController =
  async (
    req: Request,
    res: Response
  ) => {
    try {

      // ========================================
      // AUTH
      // ========================================

      const schoolId =
        req.user?.schoolId;

      const userId =
        req.user?.userId;

      const teacherId =
        req.user?.teacherId;


      if (!schoolId) {
        return res
          .status(401)
          .json({
            success: false,

            message:
              "School ID not found in token",
          });
      }


      if (!userId) {
        return res
          .status(401)
          .json({
            success: false,

            message:
              "User ID not found in token",
          });
      }


      // ========================================
      // BODY
      // ========================================

      const {
        sessionId,
        classId,
        sectionId,
        date,
        attendance,
      } = req.body;


      if (
        typeof sessionId !==
          "string" ||
        !sessionId ||
        typeof classId !==
          "string" ||
        !classId ||
        typeof sectionId !==
          "string" ||
        !sectionId ||
        typeof date !==
          "string" ||
        !date
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Session, class, section and date are required",
          });
      }


      if (
        !Array.isArray(
          attendance
        ) ||
        attendance.length ===
          0
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Attendance data is required",
          });
      }


      // ========================================
      // VALIDATE EACH ITEM
      // ========================================

      for (
        const item
        of attendance
      ) {

        if (
          !item ||
          typeof item !==
            "object"
        ) {
          return res
            .status(400)
            .json({
              success: false,

              message:
                "Invalid attendance record",
            });
        }


        if (
          typeof item.studentId !==
            "string" ||
          !item.studentId
        ) {
          return res
            .status(400)
            .json({
              success: false,

              message:
                "Student ID is required for every attendance record",
            });
        }


        if (
          !isAttendanceStatus(
            item.status
          )
        ) {
          return res
            .status(400)
            .json({
              success: false,

              message:
                `Invalid attendance status for student ${item.studentId}`,
            });
        }


        if (
          item.remarks !==
            undefined &&
          typeof item.remarks !==
            "string"
        ) {
          return res
            .status(400)
            .json({
              success: false,

              message:
                `Remarks must be a string for student ${item.studentId}`,
            });
        }
      }


      // ========================================
      // BUILD PAYLOAD
      //
      // exactOptionalPropertyTypes safe
      // ========================================

      const payload:
        BulkAttendanceData = {

          sessionId,

          classId,

          sectionId,

          date,

          attendance:
            attendance.map(
              (item) => {

                const attendanceItem: {
                  studentId: string;

                  status:
                    AttendanceStatus;

                  remarks?: string;
                } = {

                  studentId:
                    item.studentId,

                  status:
                    item.status,
                };


                if (
                  typeof item.remarks ===
                    "string"
                ) {
                  attendanceItem.remarks =
                    item.remarks;
                }


                return attendanceItem;
              }
            ),
        };


      // ========================================
      // SERVICE
      //
      // School Admin:
      // teacherId = undefined
      //
      // Teacher:
      // teacherId from JWT
      // ========================================

      const result =
        await markBulkAttendance(
          schoolId,
          userId,
          payload,
          teacherId
        );


      return res
        .status(200)
        .json({
          success: true,

          message:
            "Attendance saved successfully",

          data: {
            attendance:
              result,
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
              : "Failed to save attendance",
        });
    }
  };


// ============================================
// GET ATTENDANCE
//
// GET /api/v1/attendance
//
// SCHOOL_ADMIN + TEACHER
//
// Teacher must send:
// sessionId + classId + sectionId
// ============================================

export const getAttendanceController =
  async (
    req: Request,
    res: Response
  ) => {
    try {

      // ========================================
      // AUTH
      // ========================================

      const schoolId =
        req.user?.schoolId;

      const teacherId =
        req.user?.teacherId;


      if (!schoolId) {
        return res
          .status(401)
          .json({
            success: false,

            message:
              "School ID not found in token",
          });
      }


      // ========================================
      // BUILD FILTERS
      //
      // exactOptionalPropertyTypes safe
      // ========================================

      const filters:
        AttendanceFilters = {};


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


      const studentId =
        getStringQuery(
          req.query.studentId
        );


      const date =
        getStringQuery(
          req.query.date
        );


      const status =
        getStringQuery(
          req.query.status
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
      // STUDENT
      // ========================================

      if (studentId) {
        filters.studentId =
          studentId;
      }


      // ========================================
      // DATE
      // ========================================

      if (date) {
        filters.date =
          date;
      }


      // ========================================
      // STATUS
      // ========================================

      if (status) {

        if (
          !isAttendanceStatus(
            status
          )
        ) {
          return res
            .status(400)
            .json({
              success: false,

              message:
                "Invalid attendance status",
            });
        }


        filters.status =
          status;
      }


      // ========================================
      // SERVICE
      // ========================================

      const attendance =
        await getAttendance(
          schoolId,
          filters,
          teacherId
        );


      return res
        .status(200)
        .json({
          success: true,

          message:
            "Attendance fetched successfully",

          data: {
            attendance,
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
              : "Failed to fetch attendance",
        });
    }
  };


// ============================================
// UPDATE SINGLE ATTENDANCE
//
// PUT /api/v1/attendance/:attendanceId
//
// SCHOOL_ADMIN + TEACHER
// ============================================

export const updateAttendanceController =
  async (
    req: Request,
    res: Response
  ) => {
    try {

      // ========================================
      // AUTH
      // ========================================

      const schoolId =
        req.user?.schoolId;

      const userId =
        req.user?.userId;

      const teacherId =
        req.user?.teacherId;


      if (!schoolId) {
        return res
          .status(401)
          .json({
            success: false,

            message:
              "School ID not found in token",
          });
      }


      if (!userId) {
        return res
          .status(401)
          .json({
            success: false,

            message:
              "User ID not found in token",
          });
      }


      // ========================================
      // ATTENDANCE ID
      // ========================================

      const attendanceId =
        req.params.attendanceId;


      if (
        typeof attendanceId !==
          "string" ||
        !attendanceId
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Attendance ID is required",
          });
      }


      // ========================================
      // PAYLOAD
      // ========================================

      const payload:
        UpdateAttendanceData = {};


      // ========================================
      // STATUS
      // ========================================

      if (
        req.body.status !==
          undefined
      ) {

        if (
          !isAttendanceStatus(
            req.body.status
          )
        ) {
          return res
            .status(400)
            .json({
              success: false,

              message:
                "Invalid attendance status",
            });
        }


        payload.status =
          req.body.status;
      }


      // ========================================
      // REMARKS
      // ========================================

      if (
        req.body.remarks !==
          undefined
      ) {

        if (
          typeof req.body.remarks !==
            "string"
        ) {
          return res
            .status(400)
            .json({
              success: false,

              message:
                "Remarks must be a string",
            });
        }


        payload.remarks =
          req.body.remarks;
      }


      // ========================================
      // EMPTY UPDATE CHECK
      // ========================================

      if (
        payload.status ===
          undefined &&
        payload.remarks ===
          undefined
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Status or remarks is required",
          });
      }


      // ========================================
      // SERVICE
      // ========================================

      const attendance =
        await updateAttendance(
          schoolId,
          attendanceId,
          userId,
          payload,
          teacherId
        );


      return res
        .status(200)
        .json({
          success: true,

          message:
            "Attendance updated successfully",

          data: {
            attendance,
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
              : "Failed to update attendance",
        });
    }
  };


// ============================================
// MONTHLY ATTENDANCE SUMMARY
//
// GET /api/v1/attendance/monthly-summary
//
// SCHOOL_ADMIN + TEACHER
// ============================================

export const getMonthlyAttendanceSummaryController =
  async (
    req: Request,
    res: Response
  ) => {
    try {

      // ========================================
      // AUTH
      // ========================================

      const schoolId =
        req.user?.schoolId;

      const teacherId =
        req.user?.teacherId;


      if (!schoolId) {
        return res
          .status(401)
          .json({
            success: false,

            message:
              "School ID not found in token",
          });
      }


      // ========================================
      // QUERY
      // ========================================

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


      const monthValue =
        getStringQuery(
          req.query.month
        );


      const yearValue =
        getStringQuery(
          req.query.year
        );


      // ========================================
      // REQUIRED
      // ========================================

      if (
        !sessionId ||
        !classId ||
        !sectionId ||
        !monthValue ||
        !yearValue
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Session, class, section, month and year are required",
          });
      }


      // ========================================
      // MONTH + YEAR
      // ========================================

      const month =
        Number(
          monthValue
        );


      const year =
        Number(
          yearValue
        );


      if (
        !Number.isInteger(
          month
        ) ||
        !Number.isInteger(
          year
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Month and year must be valid numbers",
          });
      }


      // ========================================
      // SERVICE
      // ========================================

      const data =
        await getMonthlyAttendanceSummary(
          schoolId,
          {
            sessionId,

            classId,

            sectionId,

            month,

            year,
          },
          teacherId
        );


      return res
        .status(200)
        .json({
          success: true,

          message:
            "Monthly attendance summary fetched successfully",

          data,
        });

    } catch (error) {

      return res
        .status(400)
        .json({
          success: false,

          message:
            error instanceof Error
              ? error.message
              : "Failed to fetch monthly attendance summary",
        });
    }
  };


// ============================================
// STUDENT ATTENDANCE SUMMARY
//
// GET
// /api/v1/attendance/student/:studentId/summary
//
// SCHOOL_ADMIN + TEACHER
//
// Teacher:
// Student must belong to assigned
// class + section.
// ============================================

export const getStudentAttendanceSummaryController =
  async (
    req: Request,
    res: Response
  ) => {
    try {

      // ========================================
      // AUTH
      // ========================================

      const schoolId =
        req.user?.schoolId;

      const teacherId =
        req.user?.teacherId;


      // ========================================
      // STUDENT ID
      // ========================================

      const studentId =
        req.params.studentId;


      if (!schoolId) {
        return res
          .status(401)
          .json({
            success: false,

            message:
              "School ID not found in token",
          });
      }


      if (
        typeof studentId !==
          "string" ||
        !studentId
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Invalid student ID",
          });
      }


      // ========================================
      // QUERY
      // ========================================

      const sessionId =
        getStringQuery(
          req.query.sessionId
        );


      const monthValue =
        getStringQuery(
          req.query.month
        );


      const yearValue =
        getStringQuery(
          req.query.year
        );


      // ========================================
      // FILTERS
      //
      // exactOptionalPropertyTypes safe
      // ========================================

      const filters:
        StudentAttendanceSummaryFilters =
        {};


      // ========================================
      // SESSION
      // ========================================

      if (sessionId) {
        filters.sessionId =
          sessionId;
      }


      // ========================================
      // MONTH
      // ========================================

      if (
        monthValue !==
          undefined
      ) {

        const month =
          Number(
            monthValue
          );


        if (
          !Number.isInteger(
            month
          )
        ) {
          return res
            .status(400)
            .json({
              success: false,

              message:
                "Invalid month",
            });
        }


        filters.month =
          month;
      }


      // ========================================
      // YEAR
      // ========================================

      if (
        yearValue !==
          undefined
      ) {

        const year =
          Number(
            yearValue
          );


        if (
          !Number.isInteger(
            year
          )
        ) {
          return res
            .status(400)
            .json({
              success: false,

              message:
                "Invalid year",
            });
        }


        filters.year =
          year;
      }


      // ========================================
      // SERVICE
      // ========================================

      const data =
        await getStudentAttendanceSummary(
          schoolId,
          studentId,
          filters,
          teacherId
        );


      return res
        .status(200)
        .json({
          success: true,

          message:
            "Student attendance summary fetched successfully",

          data,
        });

    } catch (error) {

      return res
        .status(400)
        .json({
          success: false,

          message:
            error instanceof Error
              ? error.message
              : "Failed to fetch student attendance summary",
        });
    }
  };


// ============================================
// MY ATTENDANCE SUMMARY - STUDENT
//
// GET /api/v1/attendance/me
//
// IMPORTANT:
// Student ID always comes from JWT.
// Teacher logic is NOT applied here.
// ============================================

export const getMyAttendanceSummaryController =
  async (
    req: Request,
    res: Response
  ) => {
    try {

      // ========================================
      // JWT DATA
      // ========================================

      const schoolId =
        req.user?.schoolId;

      const studentId =
        req.user?.studentId;


      if (!schoolId) {
        return res
          .status(401)
          .json({
            success: false,

            message:
              "School ID not found in token",
          });
      }


      if (!studentId) {
        return res
          .status(401)
          .json({
            success: false,

            message:
              "Student ID not found in token",
          });
      }


      // ========================================
      // QUERY FILTERS
      // ========================================

      const sessionId =
        getStringQuery(
          req.query.sessionId
        );


      const monthValue =
        getStringQuery(
          req.query.month
        );


      const yearValue =
        getStringQuery(
          req.query.year
        );


      const filters:
        StudentAttendanceSummaryFilters =
        {};


      // ========================================
      // SESSION
      // ========================================

      if (sessionId) {
        filters.sessionId =
          sessionId;
      }


      // ========================================
      // MONTH
      // ========================================

      if (
        monthValue !==
          undefined
      ) {

        const month =
          Number(
            monthValue
          );


        if (
          !Number.isInteger(
            month
          )
        ) {
          return res
            .status(400)
            .json({
              success: false,

              message:
                "Invalid month",
            });
        }


        filters.month =
          month;
      }


      // ========================================
      // YEAR
      // ========================================

      if (
        yearValue !==
          undefined
      ) {

        const year =
          Number(
            yearValue
          );


        if (
          !Number.isInteger(
            year
          )
        ) {
          return res
            .status(400)
            .json({
              success: false,

              message:
                "Invalid year",
            });
        }


        filters.year =
          year;
      }


      // ========================================
      // SERVICE
      //
      // No teacherId passed here.
      // ========================================

      const data =
        await getStudentAttendanceSummary(
          schoolId,
          studentId,
          filters
        );


      return res
        .status(200)
        .json({
          success: true,

          message:
            "My attendance summary fetched successfully",

          data,
        });

    } catch (error) {

      return res
        .status(400)
        .json({
          success: false,

          message:
            error instanceof Error
              ? error.message
              : "Failed to fetch attendance summary",
        });
    }
  };