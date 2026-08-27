import mongoose from "mongoose";

import {
  SubjectAssignment,
} from "./subjectAssignment.model";

import {
  AcademicSession,
} from "../academicSession.model";

import {
  ClassModel,
} from "../classes/class.model";

import {
  Section,
} from "../sections/section.model";

import {
  Subject,
} from "../subjects/subject.model";

import {
  Teacher,
} from "../../teachers/teacher.model";

import type {
  CreateSubjectAssignmentData,
  UpdateSubjectAssignmentData,
} from "./subjectAssignment.types";


// ============================================
// CREATE
// ============================================

export const createSubjectAssignment =
  async (
    schoolId: string,
    data:
      CreateSubjectAssignmentData
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
    // ALL IDS VALIDATE
    // ========================================

    const ids = [
      data.sessionId,
      data.subjectId,
      data.classId,
      data.sectionId,
      data.teacherId,
    ];


    if (
      ids.some(
        (id) =>
          !mongoose.Types.ObjectId.isValid(
            id
          )
      )
    ) {
      throw new Error(
        "One or more assignment IDs are invalid"
      );
    }


    // ========================================
    // SESSION CHECK
    // ========================================

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
    // CLASS CHECK
    // ========================================

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
        "Class not found in this academic session"
      );
    }


    // ========================================
    // SECTION CHECK
    // ========================================

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
        "Section not found in this class"
      );
    }


    // ========================================
    // SUBJECT CHECK
    // ========================================

    const subject =
      await Subject.findOne({
        _id:
          data.subjectId,

        schoolId,

        sessionId:
          data.sessionId,
      });


    if (!subject) {
      throw new Error(
        "Subject not found in this academic session"
      );
    }


    // ========================================
    // TEACHER CHECK
    // ========================================

    const teacher =
      await Teacher.findOne({
        _id:
          data.teacherId,

        schoolId,
      });


    if (!teacher) {
      throw new Error(
        "Teacher not found"
      );
    }


    // ========================================
    // WEEKLY PERIOD VALIDATION
    // ========================================

    if (
      typeof data.weeklyPeriods !==
        "number" ||
      data.weeklyPeriods < 1
    ) {
      throw new Error(
        "Weekly periods must be greater than 0"
      );
    }


    // ========================================
    // DUPLICATE CHECK
    // ========================================

    const existing =
      await SubjectAssignment.findOne({
        schoolId,

        sessionId:
          data.sessionId,

        subjectId:
          data.subjectId,

        classId:
          data.classId,

        sectionId:
          data.sectionId,
      });


    if (existing) {
      throw new Error(
        "Subject is already assigned to this class and section"
      );
    }


    // ========================================
    // CREATE
    // ========================================

    const assignment =
      await SubjectAssignment.create({
        schoolId,

        sessionId:
          data.sessionId,

        subjectId:
          data.subjectId,

        classId:
          data.classId,

        sectionId:
          data.sectionId,

        teacherId:
          data.teacherId,

        weeklyPeriods:
          data.weeklyPeriods,

        isActive: true,
      });


    return assignment;
  };


// ============================================
// GET ALL
// ============================================

export const getSubjectAssignments =
  async (
    schoolId: string,

    filters?: {
      sessionId?: string;

      subjectId?: string;

      classId?: string;

      sectionId?: string;

      teacherId?: string;

      isActive?: boolean;
    }
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


    const query: Record<
      string,
      unknown
    > = {
      schoolId,
    };


    if (
      filters?.sessionId
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


    if (
      filters?.subjectId
    ) {
      if (
        !mongoose.Types.ObjectId.isValid(
          filters.subjectId
        )
      ) {
        throw new Error(
          "Invalid subject ID"
        );
      }

      query.subjectId =
        filters.subjectId;
    }


    if (
      filters?.classId
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


    if (
      filters?.sectionId
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


    if (
      filters?.teacherId
    ) {
      if (
        !mongoose.Types.ObjectId.isValid(
          filters.teacherId
        )
      ) {
        throw new Error(
          "Invalid teacher ID"
        );
      }

      query.teacherId =
        filters.teacherId;
    }


    if (
      filters?.isActive !==
      undefined
    ) {
      query.isActive =
        filters.isActive;
    }


    const assignments =
      await SubjectAssignment.find(
        query
      )

        .populate(
          "sessionId",
          "name startDate endDate isCurrent"
        )

        .populate(
          "subjectId",
          "name code subjectType"
        )

        .populate(
          "classId",
          "name order"
        )

        .populate(
          "sectionId",
          "name roomNumber"
        )

        .populate(
          "teacherId",
          "name employeeId email mobile profileImage"
        )

        .sort({
          createdAt: -1,
        })

        .lean();


    return assignments;
  };


// ============================================
// GET BY ID
// ============================================

export const getSubjectAssignmentById =
  async (
    schoolId: string,
    assignmentId: string
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
        assignmentId
      )
    ) {
      throw new Error(
        "Invalid assignment ID"
      );
    }


    const assignment =
      await SubjectAssignment.findOne({
        _id:
          assignmentId,

        schoolId,
      })

        .populate(
          "sessionId",
          "name startDate endDate isCurrent"
        )

        .populate(
          "subjectId",
          "name code subjectType"
        )

        .populate(
          "classId",
          "name order"
        )

        .populate(
          "sectionId",
          "name roomNumber"
        )

        .populate(
          "teacherId",
          "name employeeId email mobile profileImage"
        )

        .lean();


    if (!assignment) {
      throw new Error(
        "Subject assignment not found"
      );
    }


    return assignment;
  };


// ============================================
// UPDATE
// ============================================

export const updateSubjectAssignment =
  async (
    schoolId: string,
    assignmentId: string,
    data:
      UpdateSubjectAssignmentData
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
        assignmentId
      )
    ) {
      throw new Error(
        "Invalid assignment ID"
      );
    }


    const assignment =
      await SubjectAssignment.findOne({
        _id:
          assignmentId,

        schoolId,
      });


    if (!assignment) {
      throw new Error(
        "Subject assignment not found"
      );
    }


    // ========================================
    // TEACHER
    // ========================================

    if (
      data.teacherId !==
      undefined
    ) {
      if (
        !mongoose.Types.ObjectId.isValid(
          data.teacherId
        )
      ) {
        throw new Error(
          "Invalid teacher ID"
        );
      }


      const teacher =
        await Teacher.findOne({
          _id:
            data.teacherId,

          schoolId,
        });


      if (!teacher) {
        throw new Error(
          "Teacher not found"
        );
      }


      assignment.teacherId =
        new mongoose.Types.ObjectId(
          data.teacherId
        );
    }


    // ========================================
    // WEEKLY PERIODS
    // ========================================

    if (
      data.weeklyPeriods !==
      undefined
    ) {
      if (
        typeof data.weeklyPeriods !==
          "number" ||
        data.weeklyPeriods <
          1
      ) {
        throw new Error(
          "Weekly periods must be greater than 0"
        );
      }


      assignment.weeklyPeriods =
        data.weeklyPeriods;
    }


    await assignment.save();


    return assignment;
  };


// ============================================
// STATUS
// ============================================

export const updateSubjectAssignmentStatus =
  async (
    schoolId: string,
    assignmentId: string,
    isActive: boolean
  ) => {
    if (
      !mongoose.Types.ObjectId.isValid(
        assignmentId
      )
    ) {
      throw new Error(
        "Invalid assignment ID"
      );
    }


    if (
      typeof isActive !==
      "boolean"
    ) {
      throw new Error(
        "isActive must be boolean"
      );
    }


    const assignment =
      await SubjectAssignment.findOneAndUpdate(
        {
          _id:
            assignmentId,

          schoolId,
        },

        {
          isActive,
        },

        {
          new: true,

          runValidators: true,
        }
      );


    if (!assignment) {
      throw new Error(
        "Subject assignment not found"
      );
    }


    return assignment;
  };