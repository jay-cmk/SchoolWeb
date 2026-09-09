// import mongoose from "mongoose";

// import { Student } from "./student.model";

// import { StudentEnrollment } from "./studentEnrollment.model";

// import { StudentSubjectEnrollment } from "./studentSubjectEnrollment.model";

// import { Subject } from "../academic/subjects/subject.model";

// import { SubjectAssignment } from "../academic/subjectAssignments/subjectAssignment.model";

// import { ClassModel } from "../academic/classes/class.model";

// import type {
//   IAssignStudentElectiveSubjectRequest,
//   IBulkAssignStudentElectiveSubjectRequest,
//   IStudentSubjectEnrollmentQuery,
//   IUpdateStudentElectiveSubjectRequest,
// } from "./studentSubjectEnrollment.types";

// /* =====================================================
//    HELPERS
// ===================================================== */

// const validateObjectId = (value: string, label: string) => {
//   if (!mongoose.Types.ObjectId.isValid(value)) {
//     throw new Error(`Invalid ${label}`);
//   }
// };

// const normalizeClassName = (value?: string) => {
//   return value?.trim().toLowerCase().replace(/\s+/g, "") ?? "";
// };

// /* =====================================================
//    CHECK CLASS 11 OR 12
// ===================================================== */

// const isSeniorSecondaryClass = (classData: {
//   name?: string;
//   order?: number;
// }) => {
//   if (classData.order === 11 || classData.order === 12) {
//     return true;
//   }

//   const normalizedName = normalizeClassName(classData.name);

//   return ["11", "12", "class11", "class12", "xi", "xii"].includes(
//     normalizedName,
//   );
// };

// /* =====================================================
//    POPULATE STUDENT ELECTIVE SUBJECT
// ===================================================== */

// const getPopulatedStudentSubject = async (
//   schoolId: string,
//   enrollmentId: string,
// ) => {
//   return StudentSubjectEnrollment.findOne({
//     _id: enrollmentId,
//     schoolId,
//   })
//     .populate("studentId", "name admissionNumber rollNumber photo status")
//     .populate("sessionId", "name startDate endDate isCurrent")
//     .populate("classId", "name order")
//     .populate("sectionId", "name roomNumber")
//     .populate("subjectId", "name code subjectType description")
//     .populate({
//       path: "subjectAssignmentId",

//       select: "teacherId weeklyPeriods isActive",

//       populate: {
//         path: "teacherId",

//         select: "name employeeId email mobile profileImage",
//       },
//     })
//     .lean();
// };

// /* =====================================================
//    ASSIGN ELECTIVE SUBJECT

//    SCHOOL ADMIN
// ===================================================== */

// export const assignStudentElectiveSubject = async (
//   schoolId: string,
//   userId: string,
//   data: IAssignStudentElectiveSubjectRequest,
// ) => {
//   validateObjectId(schoolId, "school ID");

//   validateObjectId(userId, "user ID");

//   validateObjectId(data.studentId, "student ID");

//   validateObjectId(data.subjectAssignmentId, "subject assignment ID");

//   /* ===============================================
//        VERIFY STUDENT
//     =============================================== */

//   const student = await Student.findOne({
//     _id: data.studentId,

//     schoolId,

//     status: "ACTIVE",
//   })
//     .select("_id name admissionNumber status")
//     .lean();

//   if (!student) {
//     throw new Error("Student not found or inactive");
//   }

//   /* ===============================================
//        VERIFY SUBJECT ASSIGNMENT
//     =============================================== */

//   const assignment = await SubjectAssignment.findOne({
//     _id: data.subjectAssignmentId,

//     schoolId,

//     isActive: true,
//   })
//     .select(
//       "_id sessionId classId sectionId subjectId teacherId weeklyPeriods isActive",
//     )
//     .lean();

//   if (!assignment) {
//     throw new Error("Subject assignment not found or inactive");
//   }

//   /* ===============================================
//        VERIFY ELECTIVE SUBJECT
//     =============================================== */

//   const subject = await Subject.findOne({
//     _id: assignment.subjectId,

//     schoolId,

//     sessionId: assignment.sessionId,

//     subjectType: "ELECTIVE",

//     isActive: true,
//   })
//     .select("_id name code subjectType")
//     .lean();

//   if (!subject) {
//     throw new Error(
//       "Only an active ELECTIVE subject can be assigned individually",
//     );
//   }

//   /* ===============================================
//        VERIFY STUDENT ACADEMIC ENROLLMENT

//        Student और subject assignment का:
//        session, class और section same होना चाहिए।
//     =============================================== */

//   const academicEnrollment = await StudentEnrollment.findOne({
//     schoolId,

//     studentId: data.studentId,

//     sessionId: assignment.sessionId,

//     classId: assignment.classId,

//     sectionId: assignment.sectionId,

//     enrollmentStatus: "ACTIVE",
//   })
//     .select("_id studentId sessionId classId sectionId stream enrollmentStatus")
//     .lean();

//   if (!academicEnrollment) {
//     throw new Error(
//       "Student does not have an active enrollment in this subject assignment's class and section",
//     );
//   }

//   /* ===============================================
//        VERIFY CLASS 11 OR 12
//     =============================================== */

//   const classData = await ClassModel.findOne({
//     _id: academicEnrollment.classId,

//     schoolId,

//     isActive: true,
//   })
//     .select("_id name order")
//     .lean();

//   if (!classData) {
//     throw new Error("Class not found or inactive");
//   }

//   if (!isSeniorSecondaryClass(classData)) {
//     throw new Error(
//       "Individual elective subjects can only be assigned to Class 11 or Class 12 students",
//     );
//   }

//   /* ===============================================
//        VERIFY STREAM
//     =============================================== */

//   if (!academicEnrollment.stream) {
//     throw new Error(
//       "Student stream is required before assigning an elective subject",
//     );
//   }

//   /* ===============================================
//        CHECK EXISTING RECORD
//     =============================================== */

//   const existingEnrollment = await StudentSubjectEnrollment.findOne({
//     schoolId,

//     studentEnrollmentId: academicEnrollment._id,

//     subjectId: assignment.subjectId,
//   });

//   if (existingEnrollment?.status === "ACTIVE") {
//     throw new Error("This elective subject is already assigned to the student");
//   }

//   if (existingEnrollment?.status === "COMPLETED") {
//     throw new Error(
//       "Completed elective subject enrollment cannot be reactivated",
//     );
//   }

//   /* ===============================================
//        REACTIVATE DROPPED SUBJECT
//     =============================================== */

//   if (existingEnrollment?.status === "DROPPED") {
//     existingEnrollment.status = "ACTIVE";

//     existingEnrollment.subjectAssignmentId = assignment._id;

//     existingEnrollment.stream = academicEnrollment.stream;

//     existingEnrollment.updatedBy = new mongoose.Types.ObjectId(userId);

//     if (data.remarks !== undefined) {
//       const normalizedRemarks = data.remarks.trim();

//       if (normalizedRemarks) {
//         existingEnrollment.remarks = normalizedRemarks;
//       } else {
//         existingEnrollment.set("remarks", undefined);
//       }
//     }

//     await existingEnrollment.save();

//     const reactivated = await getPopulatedStudentSubject(
//       schoolId,
//       String(existingEnrollment._id),
//     );

//     if (!reactivated) {
//       throw new Error("Failed to fetch reactivated elective subject");
//     }

//     return reactivated;
//   }

//   /* ===============================================
//        CREATE ELECTIVE ENROLLMENT
//     =============================================== */

//   const electiveEnrollment = await StudentSubjectEnrollment.create({
//     schoolId: new mongoose.Types.ObjectId(schoolId),

//     studentEnrollmentId: academicEnrollment._id,

//     studentId: academicEnrollment.studentId,

//     sessionId: academicEnrollment.sessionId,

//     classId: academicEnrollment.classId,

//     sectionId: academicEnrollment.sectionId,

//     stream: academicEnrollment.stream,

//     subjectId: assignment.subjectId,

//     subjectAssignmentId: assignment._id,

//     status: "ACTIVE",

//     ...(data.remarks?.trim()
//       ? {
//           remarks: data.remarks.trim(),
//         }
//       : {}),

//     createdBy: new mongoose.Types.ObjectId(userId),
//   });

//   const populatedEnrollment = await getPopulatedStudentSubject(
//     schoolId,
//     String(electiveEnrollment._id),
//   );

//   if (!populatedEnrollment) {
//     throw new Error("Failed to fetch created elective subject enrollment");
//   }

//   return populatedEnrollment;
// };

// /* =====================================================
//    BULK ASSIGN ELECTIVE SUBJECT

//    SCHOOL ADMIN

//    Transaction use नहीं किया गया है ताकि standalone
//    MongoDB deployment पर भी काम करे।
// ===================================================== */

// export const bulkAssignStudentElectiveSubject = async (
//   schoolId: string,
//   userId: string,
//   data: IBulkAssignStudentElectiveSubjectRequest,
// ) => {
//   if (!Array.isArray(data.studentIds) || data.studentIds.length === 0) {
//     throw new Error("At least one student is required");
//   }

//   const uniqueStudentIds = Array.from(new Set(data.studentIds));

//   const successful: Array<{
//     studentId: string;
//     enrollment: unknown;
//   }> = [];

//   const failed: Array<{
//     studentId: string;
//     message: string;
//   }> = [];

//   for (const studentId of uniqueStudentIds) {
//     try {
//       const enrollment = await assignStudentElectiveSubject(schoolId, userId, {
//         studentId,

//         subjectAssignmentId: data.subjectAssignmentId,

//         ...(data.remarks?.trim()
//           ? {
//               remarks: data.remarks.trim(),
//             }
//           : {}),
//       });

//       successful.push({
//         studentId,
//         enrollment,
//       });
//     } catch (error) {
//       failed.push({
//         studentId,

//         message:
//           error instanceof Error
//             ? error.message
//             : "Failed to assign elective subject",
//       });
//     }
//   }

//   return {
//     total: uniqueStudentIds.length,

//     successfulCount: successful.length,

//     failedCount: failed.length,

//     successful,

//     failed,
//   };
// };

// /* =====================================================
//    GET ELECTIVE SUBJECT ENROLLMENTS

//    SCHOOL ADMIN
// ===================================================== */

// export const getStudentElectiveSubjects = async (
//   schoolId: string,
//   query: IStudentSubjectEnrollmentQuery,
// ) => {
//   validateObjectId(schoolId, "school ID");

//   const filter: Record<string, unknown> = {
//     schoolId: new mongoose.Types.ObjectId(schoolId),
//   };

//   const objectIdFilters = [
//     ["sessionId", query.sessionId],

//     ["classId", query.classId],

//     ["sectionId", query.sectionId],

//     ["studentId", query.studentId],

//     ["subjectId", query.subjectId],

//     ["subjectAssignmentId", query.subjectAssignmentId],
//   ] as const;

//   for (const [key, value] of objectIdFilters) {
//     if (!value) {
//       continue;
//     }

//     validateObjectId(value, key);

//     filter[key] = new mongoose.Types.ObjectId(value);
//   }

//   if (query.stream) {
//     filter.stream = query.stream;
//   }

//   if (query.status) {
//     filter.status = query.status;
//   }

//   return StudentSubjectEnrollment.find(filter)
//     .populate("studentId", "name admissionNumber rollNumber photo status")
//     .populate("sessionId", "name startDate endDate isCurrent")
//     .populate("classId", "name order")
//     .populate("sectionId", "name roomNumber")
//     .populate("subjectId", "name code subjectType description")
//     .populate({
//       path: "subjectAssignmentId",

//       select: "teacherId weeklyPeriods isActive",

//       populate: {
//         path: "teacherId",

//         select: "name employeeId email mobile profileImage",
//       },
//     })
//     .sort({
//       createdAt: -1,
//     })
//     .lean();
// };

// /* =====================================================
//    GET LOGGED-IN STUDENT ELECTIVE SUBJECTS

//    STUDENT
// ===================================================== */

// export const getMyElectiveSubjects = async (
//   schoolId: string,
//   studentId: string,
// ) => {
//   validateObjectId(schoolId, "school ID");

//   validateObjectId(studentId, "student ID");

//   const student = await Student.findOne({
//     _id: studentId,

//     schoolId,

//     status: "ACTIVE",
//   })
//     .select("_id name admissionNumber status")
//     .lean();

//   if (!student) {
//     throw new Error("Student profile not found or inactive");
//   }

//   const activeEnrollment = await StudentEnrollment.findOne({
//     schoolId,

//     studentId,

//     enrollmentStatus: "ACTIVE",
//   })
//     .select("_id sessionId classId sectionId stream")
//     .sort({
//       createdAt: -1,
//     })
//     .lean();

//   if (!activeEnrollment) {
//     throw new Error("Active student enrollment not found");
//   }

//   const electiveSubjects = await StudentSubjectEnrollment.find({
//     schoolId,

//     studentId,

//     studentEnrollmentId: activeEnrollment._id,

//     status: "ACTIVE",
//   })
//     .populate("subjectId", "name code subjectType description")
//     .populate({
//       path: "subjectAssignmentId",

//       match: {
//         isActive: true,
//       },

//       select: "teacherId weeklyPeriods isActive",

//       populate: {
//         path: "teacherId",

//         select: "name employeeId email mobile profileImage",
//       },
//     })
//     .sort({
//       createdAt: 1,
//     })
//     .lean();

//   return {
//     student,

//     enrollment: {
//       id: activeEnrollment._id,

//       sessionId: activeEnrollment.sessionId,

//       classId: activeEnrollment.classId,

//       sectionId: activeEnrollment.sectionId,

//       stream: activeEnrollment.stream,
//     },

//     subjects: electiveSubjects.filter(
//       (item) => item.subjectId && item.subjectAssignmentId,
//     ),
//   };
// };

// /* =====================================================
//    UPDATE ELECTIVE SUBJECT STATUS

//    SCHOOL ADMIN
// ===================================================== */

// export const updateStudentElectiveSubject = async (
//   schoolId: string,
//   userId: string,
//   enrollmentId: string,
//   data: IUpdateStudentElectiveSubjectRequest,
// ) => {
//   validateObjectId(schoolId, "school ID");

//   validateObjectId(userId, "user ID");

//   validateObjectId(enrollmentId, "student subject enrollment ID");

//   if (data.status === undefined && data.remarks === undefined) {
//     throw new Error("Status or remarks is required");
//   }

//   const enrollment = await StudentSubjectEnrollment.findOne({
//     _id: enrollmentId,

//     schoolId,
//   });

//   if (!enrollment) {
//     throw new Error("Student elective subject enrollment not found");
//   }

//   if (data.status !== undefined) {
//     enrollment.status = data.status;
//   }

//   if (data.remarks !== undefined) {
//     const normalizedRemarks = data.remarks.trim();

//     if (normalizedRemarks) {
//       enrollment.remarks = normalizedRemarks;
//     } else {
//       enrollment.set("remarks", undefined);
//     }
//   }

//   enrollment.updatedBy = new mongoose.Types.ObjectId(userId);

//   await enrollment.save();

//   const updatedEnrollment = await getPopulatedStudentSubject(
//     schoolId,
//     enrollmentId,
//   );

//   if (!updatedEnrollment) {
//     throw new Error("Failed to fetch updated elective subject enrollment");
//   }

//   return updatedEnrollment;
// };





import mongoose from "mongoose";

import { Student } from "./student.model";

import { StudentEnrollment } from "./studentEnrollment.model";

import { StudentSubjectEnrollment } from "./studentSubjectEnrollment.model";

import { Subject } from "../academic/subjects/subject.model";

import { SubjectAssignment } from "../academic/subjectAssignments/subjectAssignment.model";

import { ClassModel } from "../academic/classes/class.model";

import type {
  IAssignStudentElectiveSubjectRequest,
  IBulkAssignStudentElectiveSubjectRequest,
  IStudentSubjectEnrollmentQuery,
  IUpdateStudentElectiveSubjectRequest,
} from "./studentSubjectEnrollment.types";

/* =====================================================
   HELPERS
===================================================== */

const validateObjectId = (value: string, label: string) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error(`Invalid ${label}`);
  }
};

const normalizeClassName = (value?: string) => {
  return value?.trim().toLowerCase().replace(/\s+/g, "") ?? "";
};

/* =====================================================
   CHECK CLASS 11 OR 12
===================================================== */

const isSeniorSecondaryClass = (classData: {
  name?: string;
  order?: number;
}) => {
  if (classData.order === 11 || classData.order === 12) {
    return true;
  }

  const normalizedName = normalizeClassName(classData.name);

  return ["11", "12", "class11", "class12", "xi", "xii"].includes(
    normalizedName,
  );
};

/* =====================================================
   POPULATE STUDENT ELECTIVE SUBJECT
===================================================== */

const getPopulatedStudentSubject = async (
  schoolId: string,
  enrollmentId: string,
) => {
  return StudentSubjectEnrollment.findOne({
    _id: enrollmentId,
    schoolId,
  })
    .populate("studentId", "name admissionNumber rollNumber photo status")
    .populate("sessionId", "name startDate endDate isCurrent")
    .populate("classId", "name order")
    .populate("sectionId", "name roomNumber")
    .populate("subjectId", "name code subjectType description")
    .populate({
      path: "subjectAssignmentId",

      select:
        "teacherId weeklyPeriods assignmentType stream isActive",

      populate: {
        path: "teacherId",

        select: "name employeeId email mobile profileImage",
      },
    })
    .lean();
};

/* =====================================================
   ASSIGN ELECTIVE SUBJECT

   SCHOOL ADMIN
===================================================== */

export const assignStudentElectiveSubject = async (
  schoolId: string,
  userId: string,
  data: IAssignStudentElectiveSubjectRequest,
) => {
  validateObjectId(schoolId, "school ID");

  validateObjectId(userId, "user ID");

  validateObjectId(data.studentId, "student ID");

  validateObjectId(data.subjectAssignmentId, "subject assignment ID");

  /* ===============================================
       VERIFY STUDENT
    =============================================== */

  const student = await Student.findOne({
    _id: data.studentId,

    schoolId,

    status: "ACTIVE",
  })
    .select("_id name admissionNumber status")
    .lean();

  if (!student) {
    throw new Error("Student not found or inactive");
  }

  /* ===============================================
       VERIFY SUBJECT ASSIGNMENT
    =============================================== */

  const assignment = await SubjectAssignment.findOne({
    _id: data.subjectAssignmentId,

    schoolId,

    isActive: true,
  })
    .select(
      "_id sessionId classId sectionId subjectId teacherId assignmentType stream weeklyPeriods isActive",
    )
    .lean();

  if (!assignment) {
    throw new Error("Subject assignment not found or inactive");
  }

  /* ===============================================
       VERIFY ELECTIVE SUBJECT
    =============================================== */

  const subject = await Subject.findOne({
    _id: assignment.subjectId,

    schoolId,

    sessionId: assignment.sessionId,

    subjectType: "ELECTIVE",

    isActive: true,
  })
    .select("_id name code subjectType")
    .lean();

  if (!subject) {
    throw new Error(
      "Only an active ELECTIVE subject can be assigned individually",
    );
  }

  /* ===============================================
       VERIFY STUDENT ACADEMIC ENROLLMENT

       Student और subject assignment का:
       session, class और section same होना चाहिए।
    =============================================== */

  const academicEnrollment = await StudentEnrollment.findOne({
    schoolId,

    studentId: data.studentId,

    sessionId: assignment.sessionId,

    classId: assignment.classId,

    sectionId: assignment.sectionId,

    enrollmentStatus: "ACTIVE",
  })
    .select("_id studentId sessionId classId sectionId stream enrollmentStatus")
    .lean();

  if (!academicEnrollment) {
    throw new Error(
      "Student does not have an active enrollment in this subject assignment's class and section",
    );
  }

  /* ===============================================
       VERIFY CLASS 11 OR 12
    =============================================== */

  const classData = await ClassModel.findOne({
    _id: academicEnrollment.classId,

    schoolId,

    isActive: true,
  })
    .select("_id name order")
    .lean();

  if (!classData) {
    throw new Error("Class not found or inactive");
  }

  if (!isSeniorSecondaryClass(classData)) {
    throw new Error(
      "Individual elective subjects can only be assigned to Class 11 or Class 12 students",
    );
  }

  /* ===============================================
       VERIFY STREAM
    =============================================== */

  if (!academicEnrollment.stream) {
    throw new Error(
      "Student stream is required before assigning an elective subject",
    );
  }

  /* ===============================================
       VERIFY SUBJECT ASSIGNMENT SCOPE

       Old assignments without assignmentType are
       treated as CLASS assignments for compatibility.

       CLASS  -> any stream student in same placement
       STREAM -> only student of the matching stream
    =============================================== */

  const assignmentType = assignment.assignmentType ?? "CLASS";

  if (assignmentType === "STREAM") {
    if (!assignment.stream) {
      throw new Error(
        "Stream is missing in the selected stream subject assignment",
      );
    }

    if (assignment.stream !== academicEnrollment.stream) {
      throw new Error(
        `This elective subject is assigned to the ${assignment.stream} stream and cannot be assigned to a ${academicEnrollment.stream} student`,
      );
    }
  }

  /* ===============================================
       CHECK EXISTING RECORD
    =============================================== */

  const existingEnrollment = await StudentSubjectEnrollment.findOne({
    schoolId,

    studentEnrollmentId: academicEnrollment._id,

    subjectId: assignment.subjectId,
  });

  if (existingEnrollment?.status === "ACTIVE") {
    throw new Error("This elective subject is already assigned to the student");
  }

  if (existingEnrollment?.status === "COMPLETED") {
    throw new Error(
      "Completed elective subject enrollment cannot be reactivated",
    );
  }

  /* ===============================================
       REACTIVATE DROPPED SUBJECT
    =============================================== */

  if (existingEnrollment?.status === "DROPPED") {
    existingEnrollment.status = "ACTIVE";

    existingEnrollment.subjectAssignmentId = assignment._id;

    existingEnrollment.stream = academicEnrollment.stream;

    existingEnrollment.updatedBy = new mongoose.Types.ObjectId(userId);

    if (data.remarks !== undefined) {
      const normalizedRemarks = data.remarks.trim();

      if (normalizedRemarks) {
        existingEnrollment.remarks = normalizedRemarks;
      } else {
        existingEnrollment.set("remarks", undefined);
      }
    }

    await existingEnrollment.save();

    const reactivated = await getPopulatedStudentSubject(
      schoolId,
      String(existingEnrollment._id),
    );

    if (!reactivated) {
      throw new Error("Failed to fetch reactivated elective subject");
    }

    return reactivated;
  }

  /* ===============================================
       CREATE ELECTIVE ENROLLMENT
    =============================================== */

  const electiveEnrollment = await StudentSubjectEnrollment.create({
    schoolId: new mongoose.Types.ObjectId(schoolId),

    studentEnrollmentId: academicEnrollment._id,

    studentId: academicEnrollment.studentId,

    sessionId: academicEnrollment.sessionId,

    classId: academicEnrollment.classId,

    sectionId: academicEnrollment.sectionId,

    stream: academicEnrollment.stream,

    subjectId: assignment.subjectId,

    subjectAssignmentId: assignment._id,

    status: "ACTIVE",

    ...(data.remarks?.trim()
      ? {
          remarks: data.remarks.trim(),
        }
      : {}),

    createdBy: new mongoose.Types.ObjectId(userId),
  });

  const populatedEnrollment = await getPopulatedStudentSubject(
    schoolId,
    String(electiveEnrollment._id),
  );

  if (!populatedEnrollment) {
    throw new Error("Failed to fetch created elective subject enrollment");
  }

  return populatedEnrollment;
};

/* =====================================================
   BULK ASSIGN ELECTIVE SUBJECT

   SCHOOL ADMIN

   Transaction use नहीं किया गया है ताकि standalone
   MongoDB deployment पर भी काम करे।
===================================================== */

export const bulkAssignStudentElectiveSubject = async (
  schoolId: string,
  userId: string,
  data: IBulkAssignStudentElectiveSubjectRequest,
) => {
  if (!Array.isArray(data.studentIds) || data.studentIds.length === 0) {
    throw new Error("At least one student is required");
  }

  const uniqueStudentIds = Array.from(new Set(data.studentIds));

  const successful: Array<{
    studentId: string;
    enrollment: unknown;
  }> = [];

  const failed: Array<{
    studentId: string;
    message: string;
  }> = [];

  for (const studentId of uniqueStudentIds) {
    try {
      const enrollment = await assignStudentElectiveSubject(schoolId, userId, {
        studentId,

        subjectAssignmentId: data.subjectAssignmentId,

        ...(data.remarks?.trim()
          ? {
              remarks: data.remarks.trim(),
            }
          : {}),
      });

      successful.push({
        studentId,
        enrollment,
      });
    } catch (error) {
      failed.push({
        studentId,

        message:
          error instanceof Error
            ? error.message
            : "Failed to assign elective subject",
      });
    }
  }

  return {
    total: uniqueStudentIds.length,

    successfulCount: successful.length,

    failedCount: failed.length,

    successful,

    failed,
  };
};

/* =====================================================
   GET ELECTIVE SUBJECT ENROLLMENTS

   SCHOOL ADMIN
===================================================== */

export const getStudentElectiveSubjects = async (
  schoolId: string,
  query: IStudentSubjectEnrollmentQuery,
) => {
  validateObjectId(schoolId, "school ID");

  const filter: Record<string, unknown> = {
    schoolId: new mongoose.Types.ObjectId(schoolId),
  };

  const objectIdFilters = [
    ["sessionId", query.sessionId],

    ["classId", query.classId],

    ["sectionId", query.sectionId],

    ["studentId", query.studentId],

    ["subjectId", query.subjectId],

    ["subjectAssignmentId", query.subjectAssignmentId],
  ] as const;

  for (const [key, value] of objectIdFilters) {
    if (!value) {
      continue;
    }

    validateObjectId(value, key);

    filter[key] = new mongoose.Types.ObjectId(value);
  }

  if (query.stream) {
    filter.stream = query.stream;
  }

  if (query.status) {
    filter.status = query.status;
  }

  return StudentSubjectEnrollment.find(filter)
    .populate("studentId", "name admissionNumber rollNumber photo status")
    .populate("sessionId", "name startDate endDate isCurrent")
    .populate("classId", "name order")
    .populate("sectionId", "name roomNumber")
    .populate("subjectId", "name code subjectType description")
    .populate({
      path: "subjectAssignmentId",

      select:
        "teacherId weeklyPeriods assignmentType stream isActive",

      populate: {
        path: "teacherId",

        select: "name employeeId email mobile profileImage",
      },
    })
    .sort({
      createdAt: -1,
    })
    .lean();
};

/* =====================================================
   GET LOGGED-IN STUDENT ELECTIVE SUBJECTS

   STUDENT
===================================================== */

export const getMyElectiveSubjects = async (
  schoolId: string,
  studentId: string,
) => {
  validateObjectId(schoolId, "school ID");

  validateObjectId(studentId, "student ID");

  const student = await Student.findOne({
    _id: studentId,

    schoolId,

    status: "ACTIVE",
  })
    .select("_id name admissionNumber status")
    .lean();

  if (!student) {
    throw new Error("Student profile not found or inactive");
  }

  const activeEnrollment = await StudentEnrollment.findOne({
    schoolId,

    studentId,

    enrollmentStatus: "ACTIVE",
  })
    .select("_id sessionId classId sectionId stream")
    .sort({
      createdAt: -1,
    })
    .lean();

  if (!activeEnrollment) {
    throw new Error("Active student enrollment not found");
  }

  const electiveSubjects = await StudentSubjectEnrollment.find({
    schoolId,

    studentId,

    studentEnrollmentId: activeEnrollment._id,

    status: "ACTIVE",
  })
    .populate("subjectId", "name code subjectType description")
    .populate({
      path: "subjectAssignmentId",

      match: {
        isActive: true,
      },

      select:
        "teacherId weeklyPeriods assignmentType stream isActive",

      populate: {
        path: "teacherId",

        select: "name employeeId email mobile profileImage",
      },
    })
    .sort({
      createdAt: 1,
    })
    .lean();

  return {
    student,

    enrollment: {
      id: activeEnrollment._id,

      sessionId: activeEnrollment.sessionId,

      classId: activeEnrollment.classId,

      sectionId: activeEnrollment.sectionId,

      stream: activeEnrollment.stream,
    },

    subjects: electiveSubjects.filter(
      (item) => item.subjectId && item.subjectAssignmentId,
    ),
  };
};

/* =====================================================
   UPDATE ELECTIVE SUBJECT STATUS

   SCHOOL ADMIN
===================================================== */

export const updateStudentElectiveSubject = async (
  schoolId: string,
  userId: string,
  enrollmentId: string,
  data: IUpdateStudentElectiveSubjectRequest,
) => {
  validateObjectId(schoolId, "school ID");

  validateObjectId(userId, "user ID");

  validateObjectId(enrollmentId, "student subject enrollment ID");

  if (data.status === undefined && data.remarks === undefined) {
    throw new Error("Status or remarks is required");
  }

  const enrollment = await StudentSubjectEnrollment.findOne({
    _id: enrollmentId,

    schoolId,
  });

  if (!enrollment) {
    throw new Error("Student elective subject enrollment not found");
  }

  if (data.status !== undefined) {
    enrollment.status = data.status;
  }

  if (data.remarks !== undefined) {
    const normalizedRemarks = data.remarks.trim();

    if (normalizedRemarks) {
      enrollment.remarks = normalizedRemarks;
    } else {
      enrollment.set("remarks", undefined);
    }
  }

  enrollment.updatedBy = new mongoose.Types.ObjectId(userId);

  await enrollment.save();

  const updatedEnrollment = await getPopulatedStudentSubject(
    schoolId,
    enrollmentId,
  );

  if (!updatedEnrollment) {
    throw new Error("Failed to fetch updated elective subject enrollment");
  }

  return updatedEnrollment;
};
