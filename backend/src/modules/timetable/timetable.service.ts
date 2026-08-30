import mongoose from "mongoose";

import {
  Timetable,
} from "./timetable.model";

import {
  TimetableDay,
  TimetablePeriodType,
} from "./timetable.types";

import type {
  CreateTimetableData,
  UpdateTimetableData,
  TimetableFilters,
  CopyTimetableData,
  CopyTimetableResult,
} from "./timetable.types";

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
  Subject,
} from "../academic/subjects/subject.model";

import {
  SubjectAssignment,
} from "../academic/subjectAssignments/subjectAssignment.model";

import {
  Teacher,
} from "../teachers/teacher.model";


// ============================================
// VALIDATE OBJECT ID
// ============================================

const validateObjectId = (
  value: string,
  message: string
) => {
  if (
    !mongoose.Types.ObjectId.isValid(
      value
    )
  ) {
    throw new Error(
      message
    );
  }
};


// ============================================
// TIME TO MINUTES
// ============================================

const timeToMinutes = (
  time: string
): number => {

  const timeRegex =
    /^([01]\d|2[0-3]):([0-5]\d)$/;


  if (
    !timeRegex.test(
      time
    )
  ) {
    throw new Error(
      "Invalid time format. Use HH:mm"
    );
  }


  const [
    hoursValue,
    minutesValue,
  ] = time.split(":");


  const hours =
    Number(
      hoursValue
    );


  const minutes =
    Number(
      minutesValue
    );


  return (
    hours * 60 +
    minutes
  );
};


// ============================================
// VALIDATE TIME RANGE
// ============================================

const validateTimeRange = (
  startTime: string,
  endTime: string
) => {

  const start =
    timeToMinutes(
      startTime
    );


  const end =
    timeToMinutes(
      endTime
    );


  if (
    start >= end
  ) {
    throw new Error(
      "End time must be greater than start time"
    );
  }
};


// ============================================
// TIME OVERLAP
// ============================================

const isTimeOverlap = (
  existingStart: string,
  existingEnd: string,
  newStart: string,
  newEnd: string
): boolean => {

  const existingStartMinutes =
    timeToMinutes(
      existingStart
    );


  const existingEndMinutes =
    timeToMinutes(
      existingEnd
    );


  const newStartMinutes =
    timeToMinutes(
      newStart
    );


  const newEndMinutes =
    timeToMinutes(
      newEnd
    );


  return (
    newStartMinutes <
      existingEndMinutes &&
    newEndMinutes >
      existingStartMinutes
  );
};


// ============================================
// VALIDATE PERIOD NUMBER
// ============================================

const validatePeriodNumber = (
  periodNumber: number
) => {

  if (
    !Number.isInteger(
      periodNumber
    ) ||
    periodNumber < 1
  ) {
    throw new Error(
      "Period number must be a positive integer"
    );
  }
};


// ============================================
// VALIDATE CONTEXT
//
// Session → Class → Section
// ============================================

const validateContext =
  async (
    schoolId: string,
    sessionId: string,
    classId: string,
    sectionId: string
  ) => {

    validateObjectId(
      schoolId,
      "Invalid school ID"
    );


    validateObjectId(
      sessionId,
      "Invalid academic session ID"
    );


    validateObjectId(
      classId,
      "Invalid class ID"
    );


    validateObjectId(
      sectionId,
      "Invalid section ID"
    );


    // ========================================
    // SESSION
    // ========================================

    const session =
      await AcademicSession.findOne({
        _id:
          sessionId,

        schoolId,
      }).lean();


    if (!session) {
      throw new Error(
        "Academic session not found"
      );
    }


    // ========================================
    // CLASS
    // ========================================

    const classData =
      await ClassModel.findOne({
        _id:
          classId,

        schoolId,

        sessionId,
      }).lean();


    if (!classData) {
      throw new Error(
        "Class not found in selected academic session"
      );
    }


    // ========================================
    // SECTION
    // ========================================

    const section =
      await Section.findOne({
        _id:
          sectionId,

        schoolId,

        sessionId,

        classId,
      }).lean();


    if (!section) {
      throw new Error(
        "Section not found for selected class"
      );
    }


    return {
      session,
      classData,
      section,
    };
  };


// ============================================
// VALIDATE SUBJECT
// ============================================

const validateSubject =
  async (
    schoolId: string,
    subjectId: string
  ) => {

    validateObjectId(
      subjectId,
      "Invalid subject ID"
    );


    const subject =
      await Subject.findOne({
        _id:
          subjectId,

        schoolId,

        isActive: true,
      }).lean();


    if (!subject) {
      throw new Error(
        "Subject not found or inactive"
      );
    }


    return subject;
  };


// ============================================
// VALIDATE TEACHER
// ============================================

const validateTeacher =
  async (
    schoolId: string,
    teacherId: string
  ) => {

    validateObjectId(
      teacherId,
      "Invalid teacher ID"
    );


    const teacher =
      await Teacher.findOne({
        _id:
          teacherId,

        schoolId,

        isActive: true,
      }).lean();


    if (!teacher) {
      throw new Error(
        "Teacher not found or inactive"
      );
    }


    return teacher;
  };


// ============================================
// VALIDATE SUBJECT ASSIGNMENT
//
// Checks:
// school
// session
// class
// section
// subject
// teacher
// ============================================

const validateSubjectAssignment =
  async ({
    schoolId,
    sessionId,
    classId,
    sectionId,
    subjectId,
    teacherId,
  }: {
    schoolId: string;

    sessionId: string;

    classId: string;

    sectionId: string;

    subjectId: string;

    teacherId: string;
  }) => {

    validateObjectId(
      subjectId,
      "Invalid subject ID"
    );


    validateObjectId(
      teacherId,
      "Invalid teacher ID"
    );


    const assignment =
      await SubjectAssignment.findOne({
        schoolId,

        sessionId,

        classId,

        sectionId,

        subjectId,

        teacherId,

        isActive: true,
      }).lean();


    if (!assignment) {
      throw new Error(
        "Selected teacher is not assigned to this subject for the selected class and section"
      );
    }


    return assignment;
  };


// ============================================
// WEEKLY PERIOD LIMIT
// ============================================

const validateWeeklyPeriodLimit =
  async ({
    schoolId,
    sessionId,
    classId,
    sectionId,
    subjectId,
    teacherId,
    excludeTimetableId,
  }: {
    schoolId: string;

    sessionId: string;

    classId: string;

    sectionId: string;

    subjectId: string;

    teacherId: string;

    excludeTimetableId?: string;
  }) => {

    const assignment =
      await validateSubjectAssignment({
        schoolId,

        sessionId,

        classId,

        sectionId,

        subjectId,

        teacherId,
      });


    const query:
      Record<
        string,
        unknown
      > = {

      schoolId,

      sessionId,

      classId,

      sectionId,

      subjectId,

      periodType:
        TimetablePeriodType.REGULAR,

      isActive: true,
    };


    if (
      excludeTimetableId
    ) {
      query._id = {
        $ne:
          excludeTimetableId,
      };
    }


    const currentPeriods =
      await Timetable.countDocuments(
        query
      );


    if (
      currentPeriods >=
      assignment.weeklyPeriods
    ) {
      throw new Error(
        `Weekly period limit reached. This subject is assigned ${assignment.weeklyPeriods} period(s) per week`
      );
    }


    return assignment;
  };


// ============================================
// PERIOD TYPE RULES
// ============================================

const validatePeriodTypeRules =
  ({
    periodType,
    subjectId,
    teacherId,
  }: {
    periodType:
      TimetablePeriodType;

    subjectId?: string;

    teacherId?: string;
  }) => {

    // ========================================
    // REGULAR
    // ========================================

    if (
      periodType ===
      TimetablePeriodType.REGULAR
    ) {
      if (!subjectId) {
        throw new Error(
          "Subject is required for regular period"
        );
      }


      if (!teacherId) {
        throw new Error(
          "Teacher is required for regular period"
        );
      }
    }


    // ========================================
    // BREAK / LUNCH
    //
    // Subject / teacher should not exist.
    // ========================================

    if (
      periodType ===
        TimetablePeriodType.BREAK ||
      periodType ===
        TimetablePeriodType.LUNCH
    ) {
      if (
        subjectId ||
        teacherId
      ) {
        throw new Error(
          "Subject and teacher are not allowed for break or lunch period"
        );
      }
    }
  };


// ============================================
// CONFLICT CHECK
// ============================================

const checkConflicts =
  async ({
    schoolId,
    sessionId,
    classId,
    sectionId,
    day,
    periodNumber,
    startTime,
    endTime,
    teacherId,
    roomNumber,
    excludeTimetableId,
  }: {
    schoolId: string;

    sessionId: string;

    classId: string;

    sectionId: string;

    day: TimetableDay;

    periodNumber: number;

    startTime: string;

    endTime: string;

    teacherId?: string;

    roomNumber?: string;

    excludeTimetableId?: string;
  }) => {

    const query:
      Record<
        string,
        unknown
      > = {

      schoolId,

      sessionId,

      day,

      isActive: true,
    };


    if (
      excludeTimetableId
    ) {
      query._id = {
        $ne:
          excludeTimetableId,
      };
    }


    const records =
      await Timetable.find(
        query
      )
        .select(
          "classId sectionId teacherId roomNumber periodNumber startTime endTime"
        )
        .lean();


    // ========================================
    // SAME CLASS + SECTION PERIOD NUMBER
    // ========================================

    const periodNumberConflict =
      records.find(
        (record) =>
          String(
            record.classId
          ) ===
            classId &&
          String(
            record.sectionId
          ) ===
            sectionId &&
          record.periodNumber ===
            periodNumber
      );


    if (
      periodNumberConflict
    ) {
      throw new Error(
        `Period ${periodNumber} already exists for this class and section on ${day}`
      );
    }


    // ========================================
    // CLASS + SECTION TIME CONFLICT
    // ========================================

    const classConflict =
      records.find(
        (record) =>
          String(
            record.classId
          ) ===
            classId &&
          String(
            record.sectionId
          ) ===
            sectionId &&
          isTimeOverlap(
            record.startTime,
            record.endTime,
            startTime,
            endTime
          )
      );


    if (
      classConflict
    ) {
      throw new Error(
        "A period already exists for this class and section during the selected time"
      );
    }


    // ========================================
    // TEACHER CONFLICT
    // ========================================

    if (
      teacherId
    ) {
      const teacherConflict =
        records.find(
          (record) =>
            record.teacherId &&
            String(
              record.teacherId
            ) ===
              teacherId &&
            isTimeOverlap(
              record.startTime,
              record.endTime,
              startTime,
              endTime
            )
        );


      if (
        teacherConflict
      ) {
        throw new Error(
          "This teacher is already assigned to another class during the selected time"
        );
      }
    }


    // ========================================
    // ROOM CONFLICT
    // ========================================

    const normalizedRoom =
      roomNumber
        ?.trim()
        .toLowerCase();


    if (
      normalizedRoom
    ) {
      const roomConflict =
        records.find(
          (record) =>
            record.roomNumber
              ?.trim()
              .toLowerCase() ===
              normalizedRoom &&
            isTimeOverlap(
              record.startTime,
              record.endTime,
              startTime,
              endTime
            )
        );


      if (
        roomConflict
      ) {
        throw new Error(
          "This room is already assigned during the selected time"
        );
      }
    }
  };


// ============================================
// CREATE TIMETABLE PERIOD
// ============================================

export const createTimetablePeriod =
  async (
    schoolId: string,
    userId: string,
    data:
      CreateTimetableData
  ) => {

    validateObjectId(
      userId,
      "Invalid user ID"
    );


    await validateContext(
      schoolId,
      data.sessionId,
      data.classId,
      data.sectionId
    );


    validatePeriodNumber(
      data.periodNumber
    );


    validateTimeRange(
      data.startTime,
      data.endTime
    );


    validatePeriodTypeRules({
      periodType:
        data.periodType,

      ...(data.subjectId
        ? {
            subjectId:
              data.subjectId,
          }
        : {}),

      ...(data.teacherId
        ? {
            teacherId:
              data.teacherId,
          }
        : {}),
    });


    // ========================================
    // SUBJECT
    // ========================================

    if (
      data.subjectId
    ) {
      await validateSubject(
        schoolId,
        data.subjectId
      );
    }


    // ========================================
    // TEACHER
    // ========================================

    if (
      data.teacherId
    ) {
      await validateTeacher(
        schoolId,
        data.teacherId
      );
    }


    // ========================================
    // REGULAR SUBJECT ASSIGNMENT
    // + WEEKLY PERIOD LIMIT
    // ========================================

    if (
      data.periodType ===
        TimetablePeriodType.REGULAR &&
      data.subjectId &&
      data.teacherId
    ) {
      await validateWeeklyPeriodLimit({
        schoolId,

        sessionId:
          data.sessionId,

        classId:
          data.classId,

        sectionId:
          data.sectionId,

        subjectId:
          data.subjectId,

        teacherId:
          data.teacherId,
      });
    }


    // ========================================
    // CONFLICTS
    // ========================================

    const conflictInput: {
      schoolId: string;

      sessionId: string;

      classId: string;

      sectionId: string;

      day: TimetableDay;

      periodNumber: number;

      startTime: string;

      endTime: string;

      teacherId?: string;

      roomNumber?: string;
    } = {

      schoolId,

      sessionId:
        data.sessionId,

      classId:
        data.classId,

      sectionId:
        data.sectionId,

      day:
        data.day,

      periodNumber:
        data.periodNumber,

      startTime:
        data.startTime,

      endTime:
        data.endTime,
    };


    if (
      data.teacherId
    ) {
      conflictInput.teacherId =
        data.teacherId;
    }


    if (
      data.roomNumber?.trim()
    ) {
      conflictInput.roomNumber =
        data.roomNumber.trim();
    }


    await checkConflicts(
      conflictInput
    );


    // ========================================
    // CREATE PAYLOAD
    // ========================================

    const payload:
      Record<
        string,
        unknown
      > = {

      schoolId,

      sessionId:
        data.sessionId,

      classId:
        data.classId,

      sectionId:
        data.sectionId,

      day:
        data.day,

      periodNumber:
        data.periodNumber,

      startTime:
        data.startTime,

      endTime:
        data.endTime,

      periodType:
        data.periodType,

      isActive: true,

      createdBy:
        userId,
    };


    if (
      data.subjectId
    ) {
      payload.subjectId =
        data.subjectId;
    }


    if (
      data.teacherId
    ) {
      payload.teacherId =
        data.teacherId;
    }


    if (
      data.roomNumber?.trim()
    ) {
      payload.roomNumber =
        data.roomNumber.trim();
    }


    return Timetable.create(
      payload
    );
  };


// ============================================
// GET TIMETABLE
//
// Weekly:
// session + class + section
//
// Daily:
// + day
//
// Teacher:
// session + teacherId
// ============================================

export const getTimetable =
  async (
    schoolId: string,
    filters:
      TimetableFilters
  ) => {

    validateObjectId(
      schoolId,
      "Invalid school ID"
    );


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
      validateObjectId(
        filters.sessionId,
        "Invalid academic session ID"
      );


      query.sessionId =
        filters.sessionId;
    }


    // ========================================
    // CLASS
    // ========================================

    if (
      filters.classId
    ) {
      validateObjectId(
        filters.classId,
        "Invalid class ID"
      );


      query.classId =
        filters.classId;
    }


    // ========================================
    // SECTION
    // ========================================

    if (
      filters.sectionId
    ) {
      validateObjectId(
        filters.sectionId,
        "Invalid section ID"
      );


      query.sectionId =
        filters.sectionId;
    }


    // ========================================
    // TEACHER
    // ========================================

    if (
      filters.teacherId
    ) {
      validateObjectId(
        filters.teacherId,
        "Invalid teacher ID"
      );


      query.teacherId =
        filters.teacherId;
    }


    // ========================================
    // SUBJECT
    // ========================================

    if (
      filters.subjectId
    ) {
      validateObjectId(
        filters.subjectId,
        "Invalid subject ID"
      );


      query.subjectId =
        filters.subjectId;
    }


    // ========================================
    // DAY
    // ========================================

    if (
      filters.day
    ) {
      query.day =
        filters.day;
    }


    // ========================================
    // PERIOD TYPE
    // ========================================

    if (
      filters.periodType
    ) {
      query.periodType =
        filters.periodType;
    }


    // ========================================
    // STATUS
    // ========================================

    if (
      filters.isActive !==
      undefined
    ) {
      query.isActive =
        filters.isActive;
    }


    return Timetable.find(
      query
    )
      .populate(
        "sessionId",
        "name startDate endDate isCurrent"
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
        "subjectId",
        "name code"
      )
      .populate(
        "teacherId",
        "name employeeId email"
      )
      .sort({
        day: 1,

        periodNumber: 1,

        startTime: 1,
      })
      .lean();
  };


// ============================================
// GET TIMETABLE BY ID
// ============================================

export const getTimetableById =
  async (
    schoolId: string,
    timetableId: string
  ) => {

    validateObjectId(
      schoolId,
      "Invalid school ID"
    );


    validateObjectId(
      timetableId,
      "Invalid timetable ID"
    );


    const timetable =
      await Timetable.findOne({
        _id:
          timetableId,

        schoolId,
      })
        .populate(
          "sessionId",
          "name startDate endDate isCurrent"
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
          "subjectId",
          "name code"
        )
        .populate(
          "teacherId",
          "name employeeId email"
        )
        .lean();


    if (!timetable) {
      throw new Error(
        "Timetable period not found"
      );
    }


    return timetable;
  };


// ============================================
// UPDATE TIMETABLE PERIOD
// ============================================

export const updateTimetablePeriod =
  async (
    schoolId: string,
    timetableId: string,
    userId: string,
    data:
      UpdateTimetableData
  ) => {

    validateObjectId(
      schoolId,
      "Invalid school ID"
    );


    validateObjectId(
      timetableId,
      "Invalid timetable ID"
    );


    validateObjectId(
      userId,
      "Invalid user ID"
    );


    const existing =
      await Timetable.findOne({
        _id:
          timetableId,

        schoolId,
      });


    if (!existing) {
      throw new Error(
        "Timetable period not found"
      );
    }


    // ========================================
    // FINAL VALUES AFTER UPDATE
    // ========================================

    const day =
      data.day ??
      existing.day;


    const periodNumber =
      data.periodNumber ??
      existing.periodNumber;


    const startTime =
      data.startTime ??
      existing.startTime;


    const endTime =
      data.endTime ??
      existing.endTime;


    const periodType =
      data.periodType ??
      existing.periodType;


    const subjectId =
      data.subjectId ===
      null
        ? undefined
        : data.subjectId ??
          existing.subjectId?.toString();


    const teacherId =
      data.teacherId ===
      null
        ? undefined
        : data.teacherId ??
          existing.teacherId?.toString();


    const roomNumber =
      data.roomNumber ===
      null
        ? undefined
        : data.roomNumber ??
          existing.roomNumber;


    // ========================================
    // VALIDATIONS
    // ========================================

    validatePeriodNumber(
      periodNumber
    );


    validateTimeRange(
      startTime,
      endTime
    );


    validatePeriodTypeRules({
      periodType,

      ...(subjectId
        ? {
            subjectId,
          }
        : {}),

      ...(teacherId
        ? {
            teacherId,
          }
        : {}),
    });


    if (
      subjectId
    ) {
      await validateSubject(
        schoolId,
        subjectId
      );
    }


    if (
      teacherId
    ) {
      await validateTeacher(
        schoolId,
        teacherId
      );
    }


    // ========================================
    // ASSIGNMENT + WEEKLY LIMIT
    // ========================================

    if (
      periodType ===
        TimetablePeriodType.REGULAR &&
      subjectId &&
      teacherId
    ) {
      await validateWeeklyPeriodLimit({
        schoolId,

        sessionId:
          existing.sessionId.toString(),

        classId:
          existing.classId.toString(),

        sectionId:
          existing.sectionId.toString(),

        subjectId,

        teacherId,

        excludeTimetableId:
          timetableId,
      });
    }


    // ========================================
    // CONFLICTS
    // ========================================

    const conflictInput: {
      schoolId: string;

      sessionId: string;

      classId: string;

      sectionId: string;

      day: TimetableDay;

      periodNumber: number;

      startTime: string;

      endTime: string;

      teacherId?: string;

      roomNumber?: string;

      excludeTimetableId: string;
    } = {

      schoolId,

      sessionId:
        existing.sessionId.toString(),

      classId:
        existing.classId.toString(),

      sectionId:
        existing.sectionId.toString(),

      day,

      periodNumber,

      startTime,

      endTime,

      excludeTimetableId:
        timetableId,
    };


    if (
      teacherId
    ) {
      conflictInput.teacherId =
        teacherId;
    }


    if (
      roomNumber?.trim()
    ) {
      conflictInput.roomNumber =
        roomNumber.trim();
    }


    await checkConflicts(
      conflictInput
    );


    // ========================================
    // BASIC UPDATE
    // ========================================

    if (
      data.day !==
      undefined
    ) {
      existing.day =
        data.day;
    }


    if (
      data.periodNumber !==
      undefined
    ) {
      existing.periodNumber =
        data.periodNumber;
    }


    if (
      data.startTime !==
      undefined
    ) {
      existing.startTime =
        data.startTime;
    }


    if (
      data.endTime !==
      undefined
    ) {
      existing.endTime =
        data.endTime;
    }


    if (
      data.periodType !==
      undefined
    ) {
      existing.periodType =
        data.periodType;
    }


    if (
      data.isActive !==
      undefined
    ) {
      existing.isActive =
        data.isActive;
    }


    // ========================================
    // SUBJECT
    // ========================================

    if (
      data.subjectId ===
      null
    ) {
      existing.set(
        "subjectId",
        undefined
      );

    } else if (
      data.subjectId !==
      undefined
    ) {
      existing.subjectId =
        new mongoose.Types.ObjectId(
          data.subjectId
        );
    }


    // ========================================
    // TEACHER
    // ========================================

    if (
      data.teacherId ===
      null
    ) {
      existing.set(
        "teacherId",
        undefined
      );

    } else if (
      data.teacherId !==
      undefined
    ) {
      existing.teacherId =
        new mongoose.Types.ObjectId(
          data.teacherId
        );
    }


    // ========================================
    // ROOM
    // ========================================

    if (
      data.roomNumber ===
      null
    ) {
      existing.set(
        "roomNumber",
        undefined
      );

    } else if (
      data.roomNumber !==
      undefined
    ) {
      const trimmed =
        data.roomNumber.trim();


      if (trimmed) {
        existing.roomNumber =
          trimmed;
      } else {
        existing.set(
          "roomNumber",
          undefined
        );
      }
    }


    // ========================================
    // BREAK / LUNCH CLEANUP
    // ========================================

    if (
      periodType ===
        TimetablePeriodType.BREAK ||
      periodType ===
        TimetablePeriodType.LUNCH
    ) {
      existing.set(
        "subjectId",
        undefined
      );


      existing.set(
        "teacherId",
        undefined
      );
    }


    existing.updatedBy =
      new mongoose.Types.ObjectId(
        userId
      );


    await existing.save();


    return getTimetableById(
      schoolId,
      timetableId
    );
  };


// ============================================
// DELETE TIMETABLE PERIOD
// ============================================

export const deleteTimetablePeriod =
  async (
    schoolId: string,
    timetableId: string
  ) => {

    validateObjectId(
      schoolId,
      "Invalid school ID"
    );


    validateObjectId(
      timetableId,
      "Invalid timetable ID"
    );


    const deleted =
      await Timetable.findOneAndDelete({
        _id:
          timetableId,

        schoolId,
      });


    if (!deleted) {
      throw new Error(
        "Timetable period not found"
      );
    }


    return deleted;
  };


// ============================================
// COPY TIMETABLE
//
// Source class-section
//        ↓
// Target class-section
//
// Important:
// Target SubjectAssignment validate hoga.
// Teacher conflict validate hoga.
// Room conflict validate hoga.
// Existing target periods overwrite nahi honge.
// ============================================

export const copyTimetable =
  async (
    schoolId: string,
    userId: string,
    data:
      CopyTimetableData
  ): Promise<
    CopyTimetableResult
  > => {

    validateObjectId(
      userId,
      "Invalid user ID"
    );


    await validateContext(
      schoolId,
      data.sessionId,
      data.sourceClassId,
      data.sourceSectionId
    );


    await validateContext(
      schoolId,
      data.sessionId,
      data.targetClassId,
      data.targetSectionId
    );


    if (
      data.sourceClassId ===
        data.targetClassId &&
      data.sourceSectionId ===
        data.targetSectionId
    ) {
      throw new Error(
        "Source and destination timetable cannot be same"
      );
    }


    // ========================================
    // SOURCE
    // ========================================

    const sourcePeriods =
      await Timetable.find({
        schoolId,

        sessionId:
          data.sessionId,

        classId:
          data.sourceClassId,

        sectionId:
          data.sourceSectionId,

        isActive: true,
      })
        .sort({
          day: 1,

          periodNumber: 1,
        })
        .lean();


    if (
      sourcePeriods.length ===
      0
    ) {
      throw new Error(
        "Source timetable is empty"
      );
    }


    let copied =
      0;


    let skipped =
      0;


    const conflicts:
      string[] = [];


    // ========================================
    // PROCESS ONE BY ONE
    //
    // insertMany blindly nahi karenge,
    // because assignment + teacher +
    // room conflicts validate hone chahiye.
    // ========================================

    for (
      const source
      of sourcePeriods
    ) {

      try {

        // ======================================
        // SUBJECT / TEACHER
        // ======================================

        const subjectId =
          source.subjectId
            ?.toString();


        const teacherId =
          source.teacherId
            ?.toString();


        // ======================================
        // TARGET SUBJECT ASSIGNMENT
        // ======================================

        if (
          source.periodType ===
            TimetablePeriodType.REGULAR
        ) {

          if (
            !subjectId ||
            !teacherId
          ) {
            throw new Error(
              "Source regular period has invalid subject or teacher"
            );
          }


          await validateSubject(
            schoolId,
            subjectId
          );


          await validateTeacher(
            schoolId,
            teacherId
          );


          await validateWeeklyPeriodLimit({
            schoolId,

            sessionId:
              data.sessionId,

            classId:
              data.targetClassId,

            sectionId:
              data.targetSectionId,

            subjectId,

            teacherId,
          });
        }


        // ======================================
        // TARGET CONFLICTS
        // ======================================

        const conflictInput: {
          schoolId: string;

          sessionId: string;

          classId: string;

          sectionId: string;

          day: TimetableDay;

          periodNumber: number;

          startTime: string;

          endTime: string;

          teacherId?: string;

          roomNumber?: string;
        } = {

          schoolId,

          sessionId:
            data.sessionId,

          classId:
            data.targetClassId,

          sectionId:
            data.targetSectionId,

          day:
            source.day,

          periodNumber:
            source.periodNumber,

          startTime:
            source.startTime,

          endTime:
            source.endTime,
        };


        if (
          teacherId
        ) {
          conflictInput.teacherId =
            teacherId;
        }


        if (
          source.roomNumber?.trim()
        ) {
          conflictInput.roomNumber =
            source.roomNumber.trim();
        }


        await checkConflicts(
          conflictInput
        );


        // ======================================
        // CREATE TARGET
        // ======================================

        const payload:
          Record<
            string,
            unknown
          > = {

          schoolId,

          sessionId:
            data.sessionId,

          classId:
            data.targetClassId,

          sectionId:
            data.targetSectionId,

          day:
            source.day,

          periodNumber:
            source.periodNumber,

          startTime:
            source.startTime,

          endTime:
            source.endTime,

          periodType:
            source.periodType,

          isActive: true,

          createdBy:
            userId,
        };


        if (
          subjectId
        ) {
          payload.subjectId =
            subjectId;
        }


        if (
          teacherId
        ) {
          payload.teacherId =
            teacherId;
        }


        if (
          source.roomNumber?.trim()
        ) {
          payload.roomNumber =
            source.roomNumber.trim();
        }


        await Timetable.create(
          payload
        );


        copied++;

      } catch (error) {

        skipped++;


        conflicts.push(
          `${source.day} Period ${source.periodNumber}: ${
            error instanceof Error
              ? error.message
              : "Unable to copy period"
          }`
        );
      }
    }


    return {
      copied,

      skipped,

      conflicts,
    };
  };