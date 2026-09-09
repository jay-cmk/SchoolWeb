import type {
  Request,
  Response,
} from "express";

import {
  getMyTeacherAttendance,
  getTeacherAttendance,
  getTeacherAttendanceMonthlySummary,
  getTeacherAttendanceSummary,
  markBulkTeacherAttendance,
  updateTeacherAttendance,
} from "./teacherAttendance.service";

import type {
  BulkTeacherAttendanceData,
  TeacherAttendanceFilters,
  TeacherAttendanceStatus,
  UpdateTeacherAttendanceData,
} from "./teacherAttendance.types";

const getStringQuery = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

const getRouteParam = (
  value: string | string[] | undefined,
): string | undefined => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

const getNumberQuery = (value: unknown): number | undefined => {
  const normalized = getStringQuery(value);

  if (!normalized) return undefined;

  const number = Number(normalized);

  return Number.isInteger(number) ? number : undefined;
};

const sendError = (res: Response, error: unknown): void => {
  const message =
    error instanceof Error ? error.message : "Something went wrong";

  const mongoError = error as {
    code?: number;
  };

  const statusCode =
    mongoError?.code === 11000
      ? 409
      : message.toLowerCase().includes("not found")
        ? 404
        : 400;

  res.status(statusCode).json({
    success: false,
    message:
      mongoError?.code === 11000
        ? "Teacher attendance is already recorded for this date"
        : message,
  });
};

export const markBulkTeacherAttendanceController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const schoolId = req.user?.schoolId;
    const userId = req.user?.userId;

    if (!schoolId || !userId) {
      res.status(401).json({
        success: false,
        message: "School or user context not found in token",
      });
      return;
    }

    const body = req.body as Partial<BulkTeacherAttendanceData>;

    if (typeof body.date !== "string" || !Array.isArray(body.attendance)) {
      res.status(400).json({
        success: false,
        message: "Date and teacher attendance entries are required",
      });
      return;
    }

    const attendance = await markBulkTeacherAttendance(
      schoolId,
      userId,
      {
        date: body.date,
        attendance: body.attendance,
      },
    );

    res.status(200).json({
      success: true,
      message: "Teacher attendance saved successfully",
      data: {
        attendance,
        total: attendance.length,
      },
    });
  } catch (error) {
    sendError(res, error);
  }
};

export const getTeacherAttendanceController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const schoolId = req.user?.schoolId;

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message: "School context not found in token",
      });
      return;
    }

    const filters: TeacherAttendanceFilters = {};
    const teacherId = getStringQuery(req.query.teacherId);
    const date = getStringQuery(req.query.date);
    const status = getStringQuery(req.query.status);
    const month = getNumberQuery(req.query.month);
    const year = getNumberQuery(req.query.year);

    if (teacherId) filters.teacherId = teacherId;
    if (date) filters.date = date;
    if (status) filters.status = status as TeacherAttendanceStatus;
    if (month !== undefined) filters.month = month;
    if (year !== undefined) filters.year = year;

    const attendance = await getTeacherAttendance(schoolId, filters);

    res.status(200).json({
      success: true,
      message: "Teacher attendance fetched successfully",
      data: {
        attendance,
        total: attendance.length,
      },
    });
  } catch (error) {
    sendError(res, error);
  }
};

export const updateTeacherAttendanceController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const schoolId = req.user?.schoolId;
    const userId = req.user?.userId;
    const attendanceId = getRouteParam(req.params.attendanceId);

    if (!schoolId || !userId) {
      res.status(401).json({
        success: false,
        message: "School or user context not found in token",
      });
      return;
    }

    if (!attendanceId) {
      res.status(400).json({
        success: false,
        message: "Attendance ID is required",
      });
      return;
    }

    const body = req.body as UpdateTeacherAttendanceData;
    const data: UpdateTeacherAttendanceData = {};

    if (body.status !== undefined) data.status = body.status;
    if (body.checkInTime !== undefined) data.checkInTime = body.checkInTime;
    if (body.checkOutTime !== undefined) data.checkOutTime = body.checkOutTime;
    if (body.remarks !== undefined) data.remarks = body.remarks;

    if (Object.keys(data).length === 0) {
      res.status(400).json({
        success: false,
        message: "At least one attendance field is required",
      });
      return;
    }

    const attendance = await updateTeacherAttendance(
      schoolId,
      userId,
      attendanceId,
      data,
    );

    res.status(200).json({
      success: true,
      message: "Teacher attendance updated successfully",
      data: {
        attendance,
      },
    });
  } catch (error) {
    sendError(res, error);
  }
};

export const getTeacherAttendanceMonthlySummaryController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const schoolId = req.user?.schoolId;
    const month = getNumberQuery(req.query.month);
    const year = getNumberQuery(req.query.year);
    const teacherId = getStringQuery(req.query.teacherId);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message: "School context not found in token",
      });
      return;
    }

    if (month === undefined || year === undefined) {
      res.status(400).json({
        success: false,
        message: "Valid month and year are required",
      });
      return;
    }

    const filters = teacherId
      ? {
          teacherId,
          month,
          year,
        }
      : {
          month,
          year,
        };

    const data = await getTeacherAttendanceMonthlySummary(schoolId, filters);

    res.status(200).json({
      success: true,
      message: "Teacher attendance summary fetched successfully",
      data,
    });
  } catch (error) {
    sendError(res, error);
  }
};

export const getSingleTeacherAttendanceSummaryController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const schoolId = req.user?.schoolId;
    const teacherId = getRouteParam(req.params.teacherId);
    const month = getNumberQuery(req.query.month);
    const year = getNumberQuery(req.query.year);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message: "School context not found in token",
      });
      return;
    }

    if (!teacherId || month === undefined || year === undefined) {
      res.status(400).json({
        success: false,
        message: "Teacher ID, valid month and year are required",
      });
      return;
    }

    const data = await getTeacherAttendanceSummary(
      schoolId,
      teacherId,
      month,
      year,
    );

    res.status(200).json({
      success: true,
      message: "Teacher attendance summary fetched successfully",
      data,
    });
  } catch (error) {
    sendError(res, error);
  }
};

export const getMyTeacherAttendanceController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const schoolId = req.user?.schoolId;
    const teacherId = req.user?.teacherId;
    const now = new Date();
    const month = getNumberQuery(req.query.month) ?? now.getUTCMonth() + 1;
    const year = getNumberQuery(req.query.year) ?? now.getUTCFullYear();

    if (!schoolId || !teacherId) {
      res.status(401).json({
        success: false,
        message: "Teacher context not found in token",
      });
      return;
    }

    const data = await getMyTeacherAttendance(
      schoolId,
      teacherId,
      month,
      year,
    );

    res.status(200).json({
      success: true,
      message: "My teacher attendance fetched successfully",
      data,
    });
  } catch (error) {
    sendError(res, error);
  }
};
