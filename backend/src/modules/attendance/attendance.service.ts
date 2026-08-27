import mongoose from "mongoose";

import {
  Attendance,
} from "./attendance.model";

import {
  AttendanceStatus,
} from "./attendance.types";

import type {
  BulkAttendanceData,
  AttendanceFilters,
  UpdateAttendanceData,
  MonthlyAttendanceSummaryFilters,
  StudentAttendanceSummaryFilters,
} from "./attendance.types";

import {
  AcademicSession,
} from "../academic/academicSession.model";

import {
  ClassModel,
} from "../academic/classes/class.model";

import {
  Section,
} from "../academic/sections/section.model";

import {
  Student,
} from "./student.model";


// ============================================
// NORMALIZE DATE
// ============================================

const normalizeDate = (
  value: string
) => {
  const date =
    new Date(value);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    throw new Error(
      "Invalid attendance date"
    );
  }


  date.setUTCHours(
    0,
    0,
    0,
    0
  );


  return date;
};


// ============================================
// BULK MARK ATTENDANCE
// ============================================

export const markBulkAttendance =
  async (
    schoolId: string,
    markedBy: string,
    data:
      BulkAttendanceData
  ) => {

    // ========================================
    // SCHOOL
    // ========================================

    if (
      !mongoose.Types.ObjectId.isValid(
        schoolId
      )
    ) {
      throw new Error(
        "Invalid school ID"
      );
    }


    // ========================================
    // MARKED BY
    // ========================================

    if (
      !mongoose.Types.ObjectId.isValid(
        markedBy
      )
    ) {
      throw new Error(
        "Invalid user ID"
      );
    }


    // ========================================
    // SESSION
    // ========================================

    if (
      !mongoose.Types.ObjectId.isValid(
        data.sessionId
      )
    ) {
      throw new Error(
        "Invalid academic session ID"
      );
    }


    const session =
      await AcademicSession.findOne({
        _id:
          data.sessionId,

        schoolId,
      });


    if (!session) {
      throw new Error(
        "Academic session not found"
      );
    }


    // ========================================
    // CLASS
    // ========================================

    if (
      !mongoose.Types.ObjectId.isValid(
        data.classId
      )
    ) {
      throw new Error(
        "Invalid class ID"
      );
    }


    const classData =
      await ClassModel.findOne({
        _id:
          data.classId,

        schoolId,

        sessionId:
          data.sessionId,
      });


    if (!classData) {
      throw new Error(
        "Class not found in selected academic session"
      );
    }


    // ========================================
    // SECTION
    // ========================================

    if (
      !mongoose.Types.ObjectId.isValid(
        data.sectionId
      )
    ) {
      throw new Error(
        "Invalid section ID"
      );
    }


    const section =
      await Section.findOne({
        _id:
          data.sectionId,

        schoolId,

        sessionId:
          data.sessionId,

        classId:
          data.classId,
      });


    if (!section) {
      throw new Error(
        "Section not found for selected class"
      );
    }


    // ========================================
    // DATE
    // ========================================

    const attendanceDate =
      normalizeDate(
        data.date
      );


    // ========================================
    // ATTENDANCE ARRAY
    // ========================================

    if (
      !Array.isArray(
        data.attendance
      ) ||
      data.attendance.length ===
        0
    ) {
      throw new Error(
        "Attendance data is required"
      );
    }


    // ========================================
    // DUPLICATE STUDENTS IN REQUEST
    // ========================================

    const studentIds =
      data.attendance.map(
        (item) =>
          item.studentId
      );


    const uniqueStudentIds =
      new Set(
        studentIds
      );


    if (
      uniqueStudentIds.size !==
      studentIds.length
    ) {
      throw new Error(
        "Duplicate student found in attendance request"
      );
    }


    // ========================================
    // VALIDATE STUDENT IDS
    // ========================================

    for (
      const studentId
      of studentIds
    ) {
      if (
        !mongoose.Types.ObjectId.isValid(
          studentId
        )
      ) {
        throw new Error(
          `Invalid student ID: ${studentId}`
        );
      }
    }


    // ========================================
    // CHECK STUDENTS
    //
    // Student must belong to same:
    // school + session + class + section
    // ========================================

    const students =
      await Student.find({
        _id: {
          $in:
            studentIds,
        },

        schoolId,

        sessionId:
          data.sessionId,

        classId:
          data.classId,

        sectionId:
          data.sectionId,

        isActive: true,
      })
        .select(
          "_id"
        )
        .lean();


    if (
      students.length !==
      studentIds.length
    ) {
      throw new Error(
        "One or more students do not belong to selected class and section"
      );
    }


    // ========================================
    // BULK OPERATIONS
    //
    // upsert = existing record update
    // otherwise new record create
    // ========================================

    const operations =
      data.attendance.map(
        (item) => {

          const updateData: {
            status:
              AttendanceStatus;

            markedBy:
              mongoose.Types.ObjectId;

            remarks?: string;
          } = {
            status:
              item.status,

            markedBy:
              new mongoose.Types.ObjectId(
                markedBy
              ),
          };


          if (
            item.remarks !==
            undefined
          ) {
            updateData.remarks =
              item.remarks.trim();
          }


          return {
            updateOne: {
              filter: {
                schoolId:
                  new mongoose.Types.ObjectId(
                    schoolId
                  ),

                studentId:
                  new mongoose.Types.ObjectId(
                    item.studentId
                  ),

                date:
                  attendanceDate,
              },


              update: {
                $set:
                  updateData,


                $setOnInsert: {
                  schoolId:
                    new mongoose.Types.ObjectId(
                      schoolId
                    ),

                  sessionId:
                    new mongoose.Types.ObjectId(
                      data.sessionId
                    ),

                  classId:
                    new mongoose.Types.ObjectId(
                      data.classId
                    ),

                  sectionId:
                    new mongoose.Types.ObjectId(
                      data.sectionId
                    ),

                  studentId:
                    new mongoose.Types.ObjectId(
                      item.studentId
                    ),

                  date:
                    attendanceDate,
                },
              },


              upsert: true,
            },
          };
        }
      );


    await Attendance.bulkWrite(
      operations
    );


    // ========================================
    // RETURN SAVED ATTENDANCE
    // ========================================

    const attendance =
      await Attendance.find({
        schoolId,

        sessionId:
          data.sessionId,

        classId:
          data.classId,

        sectionId:
          data.sectionId,

        date:
          attendanceDate,
      })
        .populate(
          "studentId",
          "firstName lastName admissionNumber rollNumber profileImage"
        )
        .sort({
          createdAt: 1,
        })
        .lean();


    return attendance;
  };


// ============================================
// GET ATTENDANCE
// ============================================

export const getAttendance =
  async (
    schoolId: string,
    filters:
      AttendanceFilters
  ) => {

    if (
      !mongoose.Types.ObjectId.isValid(
        schoolId
      )
    ) {
      throw new Error(
        "Invalid school ID"
      );
    }


    const query:
      Record<
        string,
        unknown
      > = {
        schoolId,
      };


    // ========================================
    // SESSION
    // ========================================

    if (
      filters.sessionId
    ) {
      if (
        !mongoose.Types.ObjectId.isValid(
          filters.sessionId
        )
      ) {
        throw new Error(
          "Invalid academic session ID"
        );
      }


      query.sessionId =
        filters.sessionId;
    }


    // ========================================
    // CLASS
    // ========================================

    if (
      filters.classId
    ) {
      if (
        !mongoose.Types.ObjectId.isValid(
          filters.classId
        )
      ) {
        throw new Error(
          "Invalid class ID"
        );
      }


      query.classId =
        filters.classId;
    }


    // ========================================
    // SECTION
    // ========================================

    if (
      filters.sectionId
    ) {
      if (
        !mongoose.Types.ObjectId.isValid(
          filters.sectionId
        )
      ) {
        throw new Error(
          "Invalid section ID"
        );
      }


      query.sectionId =
        filters.sectionId;
    }


    // ========================================
    // STUDENT
    // ========================================

    if (
      filters.studentId
    ) {
      if (
        !mongoose.Types.ObjectId.isValid(
          filters.studentId
        )
      ) {
        throw new Error(
          "Invalid student ID"
        );
      }


      query.studentId =
        filters.studentId;
    }


    // ========================================
    // DATE
    // ========================================

    if (
      filters.date
    ) {
      query.date =
        normalizeDate(
          filters.date
        );
    }


    // ========================================
    // STATUS
    // ========================================

    if (
      filters.status
    ) {
      query.status =
        filters.status;
    }


    // ========================================
    // FETCH
    // ========================================

    const attendance =
      await Attendance.find(
        query
      )
        .populate(
          "studentId",
          "firstName lastName admissionNumber rollNumber profileImage"
        )
        .populate(
          "classId",
          "name"
        )
        .populate(
          "sectionId",
          "name"
        )
        .populate(
          "sessionId",
          "name"
        )
        .populate(
          "markedBy",
          "name email"
        )
        .sort({
          date: -1,

          createdAt: 1,
        })
        .lean();


    return attendance;
  };


// ============================================
// UPDATE SINGLE ATTENDANCE
// ============================================

export const updateAttendance =
  async (
    schoolId: string,
    attendanceId: string,
    markedBy: string,
    data:
      UpdateAttendanceData
  ) => {

    if (
      !mongoose.Types.ObjectId.isValid(
        schoolId
      )
    ) {
      throw new Error(
        "Invalid school ID"
      );
    }


    if (
      !mongoose.Types.ObjectId.isValid(
        attendanceId
      )
    ) {
      throw new Error(
        "Invalid attendance ID"
      );
    }


    if (
      !mongoose.Types.ObjectId.isValid(
        markedBy
      )
    ) {
      throw new Error(
        "Invalid user ID"
      );
    }


    const attendance =
      await Attendance.findOne({
        _id:
          attendanceId,

        schoolId,
      });


    if (!attendance) {
      throw new Error(
        "Attendance not found"
      );
    }


    if (
      data.status !==
      undefined
    ) {
      attendance.status =
        data.status;
    }


    if (
      data.remarks !==
      undefined
    ) {
      attendance.remarks =
        data.remarks.trim();
    }


    attendance.markedBy =
      new mongoose.Types.ObjectId(
        markedBy
      );


    await attendance.save();


    const updatedAttendance =
      await Attendance.findOne({
        _id:
          attendanceId,

        schoolId,
      })
        .populate(
          "studentId",
          "firstName lastName admissionNumber rollNumber profileImage"
        )
        .populate(
          "classId",
          "name"
        )
        .populate(
          "sectionId",
          "name"
        )
        .populate(
          "sessionId",
          "name"
        )
        .lean();


    return updatedAttendance;
  };


// ============================================
// MONTHLY ATTENDANCE SUMMARY
// ============================================

export const getMonthlyAttendanceSummary =
  async (
    schoolId: string,
    filters:
      MonthlyAttendanceSummaryFilters
  ) => {

    // ========================================
    // VALIDATE SCHOOL
    // ========================================

    if (
      !mongoose.Types.ObjectId.isValid(
        schoolId
      )
    ) {
      throw new Error(
        "Invalid school ID"
      );
    }


    // ========================================
    // VALIDATE SESSION
    // ========================================

    if (
      !mongoose.Types.ObjectId.isValid(
        filters.sessionId
      )
    ) {
      throw new Error(
        "Invalid academic session ID"
      );
    }


    // ========================================
    // VALIDATE CLASS
    // ========================================

    if (
      !mongoose.Types.ObjectId.isValid(
        filters.classId
      )
    ) {
      throw new Error(
        "Invalid class ID"
      );
    }


    // ========================================
    // VALIDATE SECTION
    // ========================================

    if (
      !mongoose.Types.ObjectId.isValid(
        filters.sectionId
      )
    ) {
      throw new Error(
        "Invalid section ID"
      );
    }


    // ========================================
    // VALIDATE MONTH
    // ========================================

    if (
      !Number.isInteger(
        filters.month
      ) ||
      filters.month < 1 ||
      filters.month > 12
    ) {
      throw new Error(
        "Month must be between 1 and 12"
      );
    }


    // ========================================
    // VALIDATE YEAR
    // ========================================

    if (
      !Number.isInteger(
        filters.year
      ) ||
      filters.year < 2000
    ) {
      throw new Error(
        "Invalid year"
      );
    }


    // ========================================
    // SESSION EXISTS?
    // ========================================

    const session =
      await AcademicSession.findOne({
        _id:
          filters.sessionId,

        schoolId,
      });


    if (!session) {
      throw new Error(
        "Academic session not found"
      );
    }


    // ========================================
    // CLASS EXISTS?
    // ========================================

    const classData =
      await ClassModel.findOne({
        _id:
          filters.classId,

        schoolId,

        sessionId:
          filters.sessionId,
      });


    if (!classData) {
      throw new Error(
        "Class not found in selected academic session"
      );
    }


    // ========================================
    // SECTION EXISTS?
    // ========================================

    const section =
      await Section.findOne({
        _id:
          filters.sectionId,

        schoolId,

        sessionId:
          filters.sessionId,

        classId:
          filters.classId,
      });


    if (!section) {
      throw new Error(
        "Section not found"
      );
    }


    // ========================================
    // MONTH RANGE
    // ========================================

    const startDate =
      new Date(
        Date.UTC(
          filters.year,

          filters.month - 1,

          1
        )
      );


    const endDate =
      new Date(
        Date.UTC(
          filters.year,

          filters.month,

          1
        )
      );


    // ========================================
    // GET STUDENTS
    // ========================================

    const students =
      await Student.find({
        schoolId,

        sessionId:
          filters.sessionId,

        classId:
          filters.classId,

        sectionId:
          filters.sectionId,

        isActive: true,
      })
        .select(
          "_id firstName lastName admissionNumber rollNumber profileImage"
        )
        .sort({
          rollNumber: 1,
        })
        .lean();


    const studentIds =
      students.map(
        (student) =>
          student._id
      );


    // ========================================
    // GET MONTH RECORDS
    // ========================================

    const records =
      await Attendance.find({
        schoolId,

        sessionId:
          filters.sessionId,

        classId:
          filters.classId,

        sectionId:
          filters.sectionId,

        studentId: {
          $in:
            studentIds,
        },

        date: {
          $gte:
            startDate,

          $lt:
            endDate,
        },
      })
        .select(
          "studentId status date"
        )
        .lean();


    // ========================================
    // WORKING DAYS
    //
    // Unique days when attendance was marked.
    // ========================================

    const workingDaySet =
      new Set(
        records.map(
          (record) =>
            new Date(
              record.date
            )
              .toISOString()
              .slice(
                0,
                10
              )
        )
      );


    const workingDays =
      workingDaySet.size;


    // ========================================
    // STUDENT SUMMARY
    // ========================================

    const summary =
      students.map(
        (student) => {

          const studentRecords =
            records.filter(
              (record) =>
                String(
                  record.studentId
                ) ===
                String(
                  student._id
                )
            );


          const presentDays =
            studentRecords.filter(
              (record) =>
                record.status ===
                AttendanceStatus.PRESENT
            ).length;


          const absentDays =
            studentRecords.filter(
              (record) =>
                record.status ===
                AttendanceStatus.ABSENT
            ).length;


          const leaveDays =
            studentRecords.filter(
              (record) =>
                record.status ===
                AttendanceStatus.LEAVE
            ).length;


          const halfDays =
            studentRecords.filter(
              (record) =>
                record.status ===
                AttendanceStatus.HALF_DAY
            ).length;


          // ====================================
          // HALF DAY = 0.5 PRESENT
          // ====================================

          const attendanceUnits =
            presentDays +
            halfDays * 0.5;


          const attendancePercentage =
            workingDays > 0
              ? Number(
                  (
                    (
                      attendanceUnits /
                      workingDays
                    ) *
                    100
                  ).toFixed(
                    1
                  )
                )
              : 0;


          return {
            student,

            presentDays,

            absentDays,

            leaveDays,

            halfDays,

            workingDays,

            attendancePercentage,

            below75:
              workingDays > 0 &&
              attendancePercentage <
                75,
          };
        }
      );


    return {
      month:
        filters.month,

      year:
        filters.year,

      workingDays,

      totalStudents:
        students.length,

      summary,
    };
  };


// ============================================
// STUDENT ATTENDANCE SUMMARY
// ============================================

export const getStudentAttendanceSummary =
  async (
    schoolId: string,
    studentId: string,
    filters:
      StudentAttendanceSummaryFilters
  ) => {

    // ========================================
    // SCHOOL
    // ========================================

    if (
      !mongoose.Types.ObjectId.isValid(
        schoolId
      )
    ) {
      throw new Error(
        "Invalid school ID"
      );
    }


    // ========================================
    // STUDENT ID
    // ========================================

    if (
      !mongoose.Types.ObjectId.isValid(
        studentId
      )
    ) {
      throw new Error(
        "Invalid student ID"
      );
    }


    // ========================================
    // STUDENT
    // ========================================

    const student =
      await Student.findOne({
        _id:
          studentId,

        schoolId,
      })
        .populate(
          "sessionId",
          "name"
        )
        .populate(
          "classId",
          "name"
        )
        .populate(
          "sectionId",
          "name"
        )
        .lean();


    if (!student) {
      throw new Error(
        "Student not found"
      );
    }


    // ========================================
    // BUILD QUERY
    // ========================================

    const query:
      Record<
        string,
        unknown
      > = {
        schoolId,

        studentId,
      };


    // ========================================
    // SESSION FILTER
    // ========================================

    if (
      filters.sessionId
    ) {
      if (
        !mongoose.Types.ObjectId.isValid(
          filters.sessionId
        )
      ) {
        throw new Error(
          "Invalid academic session ID"
        );
      }


      query.sessionId =
        filters.sessionId;
    }


    // ========================================
    // MONTH + YEAR
    // ========================================

    if (
      filters.month !==
        undefined ||
      filters.year !==
        undefined
    ) {
      if (
        filters.month ===
          undefined ||
        filters.year ===
          undefined
      ) {
        throw new Error(
          "Both month and year are required"
        );
      }


      if (
        !Number.isInteger(
          filters.month
        ) ||
        filters.month < 1 ||
        filters.month > 12
      ) {
        throw new Error(
          "Month must be between 1 and 12"
        );
      }


      if (
        !Number.isInteger(
          filters.year
        ) ||
        filters.year < 2000
      ) {
        throw new Error(
          "Invalid year"
        );
      }


      const startDate =
        new Date(
          Date.UTC(
            filters.year,

            filters.month - 1,

            1
          )
        );


      const endDate =
        new Date(
          Date.UTC(
            filters.year,

            filters.month,

            1
          )
        );


      query.date = {
        $gte:
          startDate,

        $lt:
          endDate,
      };
    }


    // ========================================
    // RECORDS
    // ========================================

    const records =
      await Attendance.find(
        query
      )
        .select(
          "date status remarks"
        )
        .sort({
          date: 1,
        })
        .lean();


    // ========================================
    // COUNTS
    // ========================================

    const presentDays =
      records.filter(
        (record) =>
          record.status ===
          AttendanceStatus.PRESENT
      ).length;


    const absentDays =
      records.filter(
        (record) =>
          record.status ===
          AttendanceStatus.ABSENT
      ).length;


    const leaveDays =
      records.filter(
        (record) =>
          record.status ===
          AttendanceStatus.LEAVE
      ).length;


    const halfDays =
      records.filter(
        (record) =>
          record.status ===
          AttendanceStatus.HALF_DAY
      ).length;


    // ========================================
    // WORKING DAYS
    // ========================================

    const workingDaySet =
      new Set(
        records.map(
          (record) =>
            new Date(
              record.date
            )
              .toISOString()
              .slice(
                0,
                10
              )
        )
      );


    const workingDays =
      workingDaySet.size;


    // ========================================
    // PERCENTAGE
    // ========================================

    const attendanceUnits =
      presentDays +
      halfDays * 0.5;


    const attendancePercentage =
      workingDays > 0
        ? Number(
            (
              (
                attendanceUnits /
                workingDays
              ) *
                100
            ).toFixed(
              1
            )
          )
        : 0;


    // ========================================
    // CALENDAR DATA
    // ========================================

    const calendar =
      records.map(
        (record) => ({
          date:
            new Date(
              record.date
            )
              .toISOString()
              .slice(
                0,
                10
              ),

          status:
            record.status,

          remarks:
            record.remarks ??
            "",
        })
      );


    return {
      student,

      summary: {
        presentDays,

        absentDays,

        leaveDays,

        halfDays,

        workingDays,

        attendancePercentage,

        below75:
          workingDays > 0 &&
          attendancePercentage <
            75,
      },

      calendar,
    };
  };