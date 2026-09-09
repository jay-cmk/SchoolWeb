import mongoose from "mongoose";

import { Teacher } from "../teachers/teacher.model";

import { TeacherAttendance } from "./teacherAttendance.model";

import type {
  BulkTeacherAttendanceData,
  TeacherAttendanceFilters,
  TeacherAttendanceStatus,
  TeacherAttendanceSummary,
  TeacherAttendanceSummaryFilters,
  UpdateTeacherAttendanceData,
} from "./teacherAttendance.types";

const VALID_STATUSES = new Set<TeacherAttendanceStatus>([
  "PRESENT",
  "ABSENT",
  "LEAVE",
  "HALF_DAY",
]);

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

const validateObjectId = (value: string, label: string): void => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error(`Invalid ${label}`);
  }
};

const normalizeDate = (value: string): Date => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error("Date must use YYYY-MM-DD format");
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    throw new Error("Invalid attendance date");
  }

  return date;
};

const validateMonthYear = (month: number, year: number): void => {
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error("Month must be between 1 and 12");
  }

  if (!Number.isInteger(year) || year < 2000 || year > 2200) {
    throw new Error("Invalid year");
  }
};

const getMonthRange = (month: number, year: number) => {
  validateMonthYear(month, year);

  return {
    startDate: new Date(Date.UTC(year, month - 1, 1)),
    endDate: new Date(Date.UTC(year, month, 1)),
  };
};

const validateTime = (value: string | undefined, label: string): void => {
  if (value !== undefined && !TIME_PATTERN.test(value)) {
    throw new Error(`${label} must use HH:mm format`);
  }
};

const validateTimeRange = (
  checkInTime?: string,
  checkOutTime?: string,
): void => {
  validateTime(checkInTime, "Check-in time");
  validateTime(checkOutTime, "Check-out time");

  if (checkInTime && checkOutTime && checkOutTime <= checkInTime) {
    throw new Error("Check-out time must be later than check-in time");
  }
};

const calculateSummary = (
  records: Array<{
    status: TeacherAttendanceStatus;
  }>,
): TeacherAttendanceSummary => {
  const summary: TeacherAttendanceSummary = {
    totalDays: records.length,
    presentDays: 0,
    absentDays: 0,
    leaveDays: 0,
    halfDays: 0,
    attendancePercentage: 0,
  };

  for (const record of records) {
    if (record.status === "PRESENT") summary.presentDays += 1;
    if (record.status === "ABSENT") summary.absentDays += 1;
    if (record.status === "LEAVE") summary.leaveDays += 1;
    if (record.status === "HALF_DAY") summary.halfDays += 1;
  }

  if (summary.totalDays > 0) {
    const attendanceUnits = summary.presentDays + summary.halfDays * 0.5;

    summary.attendancePercentage = Number(
      ((attendanceUnits / summary.totalDays) * 100).toFixed(2),
    );
  }

  return summary;
};

const getPopulatedAttendance = async (
  schoolId: string,
  attendanceId: string,
) => {
  return TeacherAttendance.findOne({
    _id: attendanceId,
    schoolId,
  })
    .populate(
      "teacherId",
      "employeeId name email mobile gender qualification profileImage isActive",
    )
    .populate("markedBy", "name email role")
    .populate("updatedBy", "name email role")
    .lean();
};

export const markBulkTeacherAttendance = async (
  schoolId: string,
  userId: string,
  data: BulkTeacherAttendanceData,
) => {
  validateObjectId(schoolId, "school ID");
  validateObjectId(userId, "user ID");

  const date = normalizeDate(data.date);

  if (!Array.isArray(data.attendance) || data.attendance.length === 0) {
    throw new Error("At least one teacher attendance entry is required");
  }

  const uniqueTeacherIds = new Set<string>();

  for (const item of data.attendance) {
    validateObjectId(item.teacherId, "teacher ID");

    if (uniqueTeacherIds.has(item.teacherId)) {
      throw new Error("Duplicate teacher found in attendance payload");
    }

    uniqueTeacherIds.add(item.teacherId);

    if (!VALID_STATUSES.has(item.status)) {
      throw new Error("Invalid teacher attendance status");
    }

    validateTimeRange(item.checkInTime, item.checkOutTime);
  }

  const teachers = await Teacher.find({
    _id: {
      $in: Array.from(uniqueTeacherIds),
    },
    schoolId,
    isActive: true,
  })
    .select("_id")
    .lean();

  if (teachers.length !== uniqueTeacherIds.size) {
    throw new Error("One or more teachers were not found or are inactive");
  }

  const savedIds: string[] = [];

  for (const item of data.attendance) {
    const setData: Record<string, unknown> = {
      status: item.status,
      markedBy: new mongoose.Types.ObjectId(userId),
      updatedBy: new mongoose.Types.ObjectId(userId),
    };

    const unsetData: Record<string, 1> = {};

    if (item.status === "ABSENT" || item.status === "LEAVE") {
      unsetData.checkInTime = 1;
      unsetData.checkOutTime = 1;
    } else {
      if (item.checkInTime) setData.checkInTime = item.checkInTime;
      else unsetData.checkInTime = 1;

      if (item.checkOutTime) setData.checkOutTime = item.checkOutTime;
      else unsetData.checkOutTime = 1;
    }

    if (item.remarks?.trim()) setData.remarks = item.remarks.trim();
    else unsetData.remarks = 1;

    const update: Record<string, unknown> = {
      $set: setData,
      $setOnInsert: {
        schoolId: new mongoose.Types.ObjectId(schoolId),
        teacherId: new mongoose.Types.ObjectId(item.teacherId),
        date,
      },
    };

    if (Object.keys(unsetData).length > 0) {
      update.$unset = unsetData;
    }

    const saved = await TeacherAttendance.findOneAndUpdate(
      {
        schoolId,
        teacherId: item.teacherId,
        date,
      },
      update,
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    if (!saved) {
      throw new Error("Failed to save teacher attendance");
    }

    savedIds.push(String(saved._id));
  }

  return TeacherAttendance.find({
    _id: {
      $in: savedIds,
    },
    schoolId,
  })
    .populate("teacherId", "employeeId name email mobile profileImage isActive")
    .populate("markedBy", "name email role")
    .populate("updatedBy", "name email role")
    .sort({
      "teacherId.name": 1,
    })
    .lean();
};

export const getTeacherAttendance = async (
  schoolId: string,
  filters: TeacherAttendanceFilters,
) => {
  validateObjectId(schoolId, "school ID");

  const query: Record<string, unknown> = {
    schoolId: new mongoose.Types.ObjectId(schoolId),
  };

  if (filters.teacherId) {
    validateObjectId(filters.teacherId, "teacher ID");
    query.teacherId = new mongoose.Types.ObjectId(filters.teacherId);
  }

  if (filters.date) {
    query.date = normalizeDate(filters.date);
  } else if (filters.month !== undefined || filters.year !== undefined) {
    if (filters.month === undefined || filters.year === undefined) {
      throw new Error("Month and year must be provided together");
    }

    const { startDate, endDate } = getMonthRange(filters.month, filters.year);
    query.date = {
      $gte: startDate,
      $lt: endDate,
    };
  }

  if (filters.status) {
    if (!VALID_STATUSES.has(filters.status)) {
      throw new Error("Invalid teacher attendance status");
    }

    query.status = filters.status;
  }

  return TeacherAttendance.find(query)
    .populate("teacherId", "employeeId name email mobile profileImage isActive")
    .populate("markedBy", "name email role")
    .populate("updatedBy", "name email role")
    .sort({
      date: -1,
      teacherId: 1,
    })
    .lean();
};

export const updateTeacherAttendance = async (
  schoolId: string,
  userId: string,
  attendanceId: string,
  data: UpdateTeacherAttendanceData,
) => {
  validateObjectId(schoolId, "school ID");
  validateObjectId(userId, "user ID");
  validateObjectId(attendanceId, "attendance ID");

  const existing = await TeacherAttendance.findOne({
    _id: attendanceId,
    schoolId,
  })
    .select("_id status checkInTime checkOutTime")
    .lean();

  if (!existing) {
    throw new Error("Teacher attendance record not found");
  }

  const finalStatus = data.status ?? existing.status;

  if (!VALID_STATUSES.has(finalStatus)) {
    throw new Error("Invalid teacher attendance status");
  }

  const finalCheckIn =
    data.checkInTime === undefined
      ? existing.checkInTime
      : data.checkInTime ?? undefined;

  const finalCheckOut =
    data.checkOutTime === undefined
      ? existing.checkOutTime
      : data.checkOutTime ?? undefined;

  if (finalStatus !== "ABSENT" && finalStatus !== "LEAVE") {
    validateTimeRange(finalCheckIn, finalCheckOut);
  }

  const setData: Record<string, unknown> = {
    status: finalStatus,
    updatedBy: new mongoose.Types.ObjectId(userId),
  };

  const unsetData: Record<string, 1> = {};

  if (finalStatus === "ABSENT" || finalStatus === "LEAVE") {
    unsetData.checkInTime = 1;
    unsetData.checkOutTime = 1;
  } else {
    if (finalCheckIn) setData.checkInTime = finalCheckIn;
    else unsetData.checkInTime = 1;

    if (finalCheckOut) setData.checkOutTime = finalCheckOut;
    else unsetData.checkOutTime = 1;
  }

  if (data.remarks !== undefined) {
    if (data.remarks?.trim()) setData.remarks = data.remarks.trim();
    else unsetData.remarks = 1;
  }

  const update: Record<string, unknown> = {
    $set: setData,
  };

  if (Object.keys(unsetData).length > 0) {
    update.$unset = unsetData;
  }

  await TeacherAttendance.updateOne(
    {
      _id: attendanceId,
      schoolId,
    },
    update,
    {
      runValidators: true,
    },
  );

  const attendance = await getPopulatedAttendance(schoolId, attendanceId);

  if (!attendance) {
    throw new Error("Failed to fetch updated teacher attendance");
  }

  return attendance;
};

export const getTeacherAttendanceMonthlySummary = async (
  schoolId: string,
  filters: TeacherAttendanceSummaryFilters,
) => {
  validateObjectId(schoolId, "school ID");

  const { startDate, endDate } = getMonthRange(filters.month, filters.year);

  if (filters.teacherId) {
    validateObjectId(filters.teacherId, "teacher ID");
  }

  const teacherFilter: Record<string, unknown> = {
    schoolId: new mongoose.Types.ObjectId(schoolId),
    isActive: true,
  };

  if (filters.teacherId) {
    teacherFilter._id = new mongoose.Types.ObjectId(filters.teacherId);
  }

  const teachers = await Teacher.find(teacherFilter)
    .select("_id employeeId name email mobile profileImage isActive")
    .sort({
      name: 1,
    })
    .lean();

  const teacherIds = teachers.map((teacher) => teacher._id);

  const records = await TeacherAttendance.find({
    schoolId,
    teacherId: {
      $in: teacherIds,
    },
    date: {
      $gte: startDate,
      $lt: endDate,
    },
  })
    .select("teacherId status")
    .lean();

  const recordsByTeacher = new Map<string, typeof records>();

  for (const record of records) {
    const key = String(record.teacherId);
    const list = recordsByTeacher.get(key) ?? [];
    list.push(record);
    recordsByTeacher.set(key, list);
  }

  const summary = teachers.map((teacher) => ({
    teacher,
    ...calculateSummary(recordsByTeacher.get(String(teacher._id)) ?? []),
  }));

  return {
    month: filters.month,
    year: filters.year,
    totalTeachers: teachers.length,
    summary,
  };
};

export const getTeacherAttendanceSummary = async (
  schoolId: string,
  teacherId: string,
  month: number,
  year: number,
) => {
  validateObjectId(schoolId, "school ID");
  validateObjectId(teacherId, "teacher ID");

  const teacher = await Teacher.findOne({
    _id: teacherId,
    schoolId,
  })
    .select("_id employeeId name email mobile profileImage isActive")
    .lean();

  if (!teacher) {
    throw new Error("Teacher not found");
  }

  const { startDate, endDate } = getMonthRange(month, year);

  const attendance = await TeacherAttendance.find({
    schoolId,
    teacherId,
    date: {
      $gte: startDate,
      $lt: endDate,
    },
  })
    .populate("markedBy", "name email role")
    .populate("updatedBy", "name email role")
    .sort({
      date: -1,
    })
    .lean();

  return {
    teacher,
    month,
    year,
    summary: calculateSummary(attendance),
    attendance,
  };
};

export const getMyTeacherAttendance = async (
  schoolId: string,
  teacherId: string,
  month: number,
  year: number,
) => {
  return getTeacherAttendanceSummary(
    schoolId,
    teacherId,
    month,
    year,
  );
};

