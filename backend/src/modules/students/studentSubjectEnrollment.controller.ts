import type { Request, Response } from "express";

import {
  assignStudentElectiveSubject,
  bulkAssignStudentElectiveSubject,
  getMyElectiveSubjects,
  getStudentElectiveSubjects,
  updateStudentElectiveSubject,
} from "./studentSubjectEnrollment.service";

import type {
  IBulkAssignStudentElectiveSubjectRequest,
  IAssignStudentElectiveSubjectRequest,
  IStudentSubjectEnrollmentQuery,
  IUpdateStudentElectiveSubjectRequest,
  StudentSubjectStatus,
} from "./studentSubjectEnrollment.types";

import type { StudentStream } from "./studentEnrollment.types";

/* =====================================================
   HELPERS
===================================================== */

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  return error instanceof Error ? error.message : fallbackMessage;
};

const getQueryString = (value: unknown): string | undefined => {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
};

/* =====================================================
   ASSIGN ELECTIVE SUBJECT

   POST /students/elective-subjects

   SCHOOL_ADMIN
===================================================== */

export const assignStudentElectiveSubjectController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    const { schoolId, userId } = req.user;

    if (!schoolId) {
      res.status(403).json({
        success: false,
        message: "School ID not found",
      });

      return;
    }

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "User ID not found",
      });

      return;
    }

    const { studentId, subjectAssignmentId, remarks } =
      req.body as IAssignStudentElectiveSubjectRequest;

    if (typeof studentId !== "string" || !studentId.trim()) {
      res.status(400).json({
        success: false,
        message: "Student ID is required",
      });

      return;
    }

    if (
      typeof subjectAssignmentId !== "string" ||
      !subjectAssignmentId.trim()
    ) {
      res.status(400).json({
        success: false,
        message: "Subject assignment ID is required",
      });

      return;
    }

    if (remarks !== undefined && typeof remarks !== "string") {
      res.status(400).json({
        success: false,
        message: "Remarks must be a string",
      });

      return;
    }

    const enrollment = await assignStudentElectiveSubject(schoolId, userId, {
      studentId: studentId.trim(),

      subjectAssignmentId: subjectAssignmentId.trim(),

      ...(remarks?.trim()
        ? {
            remarks: remarks.trim(),
          }
        : {}),
    });

    res.status(201).json({
      success: true,

      message: "Elective subject assigned successfully",

      data: {
        enrollment,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,

      message: getErrorMessage(error, "Failed to assign elective subject"),
    });
  }
};

/* =====================================================
   BULK ASSIGN ELECTIVE SUBJECT

   POST /students/elective-subjects/bulk

   SCHOOL_ADMIN
===================================================== */

export const bulkAssignStudentElectiveSubjectController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    const { schoolId, userId } = req.user;

    if (!schoolId) {
      res.status(403).json({
        success: false,
        message: "School ID not found",
      });

      return;
    }

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "User ID not found",
      });

      return;
    }

    const { studentIds, subjectAssignmentId, remarks } =
      req.body as IBulkAssignStudentElectiveSubjectRequest;

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      res.status(400).json({
        success: false,
        message: "At least one student is required",
      });

      return;
    }

    const validStudentIds = studentIds.filter(
      (studentId): studentId is string =>
        typeof studentId === "string" && Boolean(studentId.trim()),
    );

    if (validStudentIds.length !== studentIds.length) {
      res.status(400).json({
        success: false,
        message: "Every student ID must be a valid string",
      });

      return;
    }

    if (
      typeof subjectAssignmentId !== "string" ||
      !subjectAssignmentId.trim()
    ) {
      res.status(400).json({
        success: false,
        message: "Subject assignment ID is required",
      });

      return;
    }

    if (remarks !== undefined && typeof remarks !== "string") {
      res.status(400).json({
        success: false,
        message: "Remarks must be a string",
      });

      return;
    }

    const result = await bulkAssignStudentElectiveSubject(schoolId, userId, {
      studentIds: validStudentIds.map((studentId) => studentId.trim()),

      subjectAssignmentId: subjectAssignmentId.trim(),

      ...(remarks?.trim()
        ? {
            remarks: remarks.trim(),
          }
        : {}),
    });

    res.status(200).json({
      success: result.failedCount === 0,

      message:
        result.failedCount === 0
          ? "Elective subject assigned to all students successfully"
          : "Elective subject assignment completed with some failures",

      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,

      message: getErrorMessage(error, "Failed to bulk assign elective subject"),
    });
  }
};

/* =====================================================
   GET ELECTIVE SUBJECT ENROLLMENTS

   GET /students/elective-subjects

   SCHOOL_ADMIN
===================================================== */

export const getStudentElectiveSubjectsController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    const { schoolId } = req.user;

    if (!schoolId) {
      res.status(403).json({
        success: false,
        message: "School ID not found",
      });

      return;
    }

    const sessionId = getQueryString(req.query.sessionId);

    const classId = getQueryString(req.query.classId);

    const sectionId = getQueryString(req.query.sectionId);

    const studentId = getQueryString(req.query.studentId);

    const subjectId = getQueryString(req.query.subjectId);

    const subjectAssignmentId = getQueryString(req.query.subjectAssignmentId);

    const stream = getQueryString(req.query.stream);

    const status = getQueryString(req.query.status);

    const query: IStudentSubjectEnrollmentQuery = {
      ...(sessionId
        ? {
            sessionId,
          }
        : {}),

      ...(classId
        ? {
            classId,
          }
        : {}),

      ...(sectionId
        ? {
            sectionId,
          }
        : {}),

      ...(studentId
        ? {
            studentId,
          }
        : {}),

      ...(subjectId
        ? {
            subjectId,
          }
        : {}),

      ...(subjectAssignmentId
        ? {
            subjectAssignmentId,
          }
        : {}),

      ...(stream
        ? {
            stream: stream.toUpperCase() as StudentStream,
          }
        : {}),

      ...(status
        ? {
            status: status.toUpperCase() as StudentSubjectStatus,
          }
        : {}),
    };

    const enrollments = await getStudentElectiveSubjects(schoolId, query);

    res.status(200).json({
      success: true,

      message: "Student elective subjects fetched successfully",

      data: {
        enrollments,

        total: enrollments.length,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,

      message: getErrorMessage(
        error,
        "Failed to fetch student elective subjects",
      ),
    });
  }
};

/* =====================================================
   GET LOGGED-IN STUDENT ELECTIVE SUBJECTS

   GET /students/elective-subjects/me

   STUDENT
===================================================== */

export const getMyElectiveSubjectsController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    const { schoolId, studentId } = req.user;

    if (!schoolId) {
      res.status(403).json({
        success: false,
        message: "School ID not found",
      });

      return;
    }

    if (!studentId) {
      res.status(403).json({
        success: false,
        message: "Student ID not found in authentication token",
      });

      return;
    }

    const result = await getMyElectiveSubjects(schoolId, studentId);

    res.status(200).json({
      success: true,

      message: "My elective subjects fetched successfully",

      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,

      message: getErrorMessage(error, "Failed to fetch elective subjects"),
    });
  }
};

/* =====================================================
   UPDATE ELECTIVE SUBJECT

   PATCH /students/elective-subjects/:enrollmentId

   SCHOOL_ADMIN
===================================================== */

export const updateStudentElectiveSubjectController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    const { schoolId, userId } = req.user;

    if (!schoolId) {
      res.status(403).json({
        success: false,
        message: "School ID not found",
      });

      return;
    }

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "User ID not found",
      });

      return;
    }

    const { enrollmentId } = req.params;

    if (typeof enrollmentId !== "string" || !enrollmentId.trim()) {
      res.status(400).json({
        success: false,
        message: "Student subject enrollment ID is required",
      });

      return;
    }

    const { status, remarks } =
      req.body as IUpdateStudentElectiveSubjectRequest;

    if (
      status !== undefined &&
      !["ACTIVE", "DROPPED", "COMPLETED"].includes(status)
    ) {
      res.status(400).json({
        success: false,
        message: "Status must be ACTIVE, DROPPED or COMPLETED",
      });

      return;
    }

    if (remarks !== undefined && typeof remarks !== "string") {
      res.status(400).json({
        success: false,
        message: "Remarks must be a string",
      });

      return;
    }

    if (status === undefined && remarks === undefined) {
      res.status(400).json({
        success: false,
        message: "Status or remarks is required",
      });

      return;
    }

    const enrollment = await updateStudentElectiveSubject(
      schoolId,
      userId,
      enrollmentId.trim(),
      {
        ...(status
          ? {
              status,
            }
          : {}),

        ...(remarks !== undefined
          ? {
              remarks,
            }
          : {}),
      },
    );

    res.status(200).json({
      success: true,

      message: "Student elective subject updated successfully",

      data: {
        enrollment,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,

      message: getErrorMessage(
        error,
        "Failed to update student elective subject",
      ),
    });
  }
};
