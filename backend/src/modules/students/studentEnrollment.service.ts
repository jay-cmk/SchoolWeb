// import mongoose from "mongoose";

// import { StudentEnrollment } from "./studentEnrollment.model";

// import { Student } from "./student.model";

// import { AcademicSession } from "../academic/academicSession.model";

// import type {
//   ICreateStudentEnrollmentData,
//   IUpdateStudentEnrollmentData,
//   StudentStream,
// } from "./studentEnrollment.types";
// import { ClassModel } from "../academic/classes/class.model";
// import { Section } from "../academic/sections/section.model";

// /* =====================================================
//    VALIDATE OBJECT ID
// ===================================================== */

// const validateObjectId = (value: string, fieldName: string): void => {
//   if (!mongoose.Types.ObjectId.isValid(value)) {
//     throw new Error(`Invalid ${fieldName}`);
//   }
// };

// /* =====================================================
//    VALIDATE ACADEMIC MAPPING

//    Checks:

//    Session belongs to school
//    Class belongs to session + school
//    Section belongs to class + session + school
// ===================================================== */

// export const validateEnrollmentAcademicMapping = async (
//   schoolId: string,
//   sessionId: string,
//   classId: string,
//   sectionId: string,
// ): Promise<void> => {
//   validateObjectId(schoolId, "schoolId");

//   validateObjectId(sessionId, "sessionId");

//   validateObjectId(classId, "classId");

//   validateObjectId(sectionId, "sectionId");

//   /* ===============================================
//        SESSION
//     =============================================== */

//   const session = await AcademicSession.findOne({
//     _id: sessionId,
//     schoolId,
//   })
//     .select("_id")
//     .lean();

//   if (!session) {
//     throw new Error("Academic session not found.");
//   }

//   /* ===============================================
//        CLASS
//     =============================================== */

//   const classData = await ClassModel.findOne({
//     _id: classId,
//     schoolId,
//     sessionId,
//   })
//     .select("_id isActive")
//     .lean();

//   if (!classData) {
//     throw new Error("Class does not belong to the selected academic session.");
//   }

//   if (classData.isActive === false) {
//     throw new Error("Selected class is inactive.");
//   }

//   /* ===============================================
//        SECTION
//     =============================================== */

//   const section = await Section.findOne({
//     _id: sectionId,
//     schoolId,
//     sessionId,
//     classId,
//   })
//     .select("_id isActive")
//     .lean();

//   if (!section) {
//     throw new Error("Section does not belong to the selected class.");
//   }

//   if (section.isActive === false) {
//     throw new Error("Selected section is inactive.");
//   }
// };

// /* =====================================================
//    CREATE INITIAL ENROLLMENT

//    Called when a new Student is created.

//    IMPORTANT:
//    Existing Student document remains the current
//    academic snapshot.

//    StudentEnrollment stores academic history.
// ===================================================== */

// export const createInitialEnrollment = async (
//   data: ICreateStudentEnrollmentData,
//   mongoSession?: mongoose.ClientSession,
// ) => {
//   validateObjectId(data.schoolId, "schoolId");

//   validateObjectId(data.studentId, "studentId");

//   validateObjectId(data.createdBy, "createdBy");

//   /* ===============================================
//        VALIDATE STUDENT
//     =============================================== */

//   const studentQuery = Student.findOne({
//     _id: data.studentId,

//     schoolId: data.schoolId,
//   }).select("_id");

//   if (mongoSession) {
//     studentQuery.session(mongoSession);
//   }

//   const student = await studentQuery;

//   if (!student) {
//     throw new Error("Student not found.");
//   }

//   /* ===============================================
//        VALIDATE ACADEMIC MAPPING
//     =============================================== */

//   /*
//    * We do not call
//    * validateEnrollmentAcademicMapping()
//    * here because transaction-aware validation
//    * needs the same MongoDB session.
//    */

//   const academicSessionQuery = AcademicSession.findOne({
//     _id: data.sessionId,

//     schoolId: data.schoolId,
//   }).select("_id");

//   if (mongoSession) {
//     academicSessionQuery.session(mongoSession);
//   }

//   const academicSession = await academicSessionQuery;

//   if (!academicSession) {
//     throw new Error("Academic session not found.");
//   }

//   const classQuery = ClassModel.findOne({
//     _id: data.classId,

//     schoolId: data.schoolId,

//     sessionId: data.sessionId,
//   }).select("_id isActive");

//   if (mongoSession) {
//     classQuery.session(mongoSession);
//   }

//   const classData = await classQuery;

//   if (!classData) {
//     throw new Error("Class does not belong to the selected academic session.");
//   }

//   if (classData.isActive === false) {
//     throw new Error("Selected class is inactive.");
//   }

//   const sectionQuery = Section.findOne({
//     _id: data.sectionId,

//     schoolId: data.schoolId,

//     sessionId: data.sessionId,

//     classId: data.classId,
//   }).select("_id isActive");

//   if (mongoSession) {
//     sectionQuery.session(mongoSession);
//   }

//   const section = await sectionQuery;

//   if (!section) {
//     throw new Error("Section does not belong to the selected class.");
//   }

//   if (section.isActive === false) {
//     throw new Error("Selected section is inactive.");
//   }

//   /* ===============================================
//        DUPLICATE ENROLLMENT
//     =============================================== */

//   const duplicateQuery = StudentEnrollment.findOne({
//     schoolId: data.schoolId,

//     studentId: data.studentId,

//     sessionId: data.sessionId,
//   }).select("_id");

//   if (mongoSession) {
//     duplicateQuery.session(mongoSession);
//   }

//   const duplicateEnrollment = await duplicateQuery;

//   if (duplicateEnrollment) {
//     throw new Error("Student is already enrolled in this academic session.");
//   }

//   /* ===============================================
//        CREATE ENROLLMENT PAYLOAD
//     =============================================== */

//   const enrollmentData: {
//     schoolId: mongoose.Types.ObjectId;

//     studentId: mongoose.Types.ObjectId;

//     sessionId: mongoose.Types.ObjectId;

//     classId: mongoose.Types.ObjectId;

//     sectionId: mongoose.Types.ObjectId;

//     rollNumber?: number;

//     stream?: StudentStream;

//     enrollmentStatus: "ACTIVE" | "COMPLETED" | "CANCELLED";

//     promotionStatus:
//       | "NOT_DECIDED"
//       | "PROMOTED"
//       | "RETAINED"
//       | "TRANSFERRED"
//       | "LEFT"
//       | "GRADUATED";

//     promotedFromEnrollmentId?: mongoose.Types.ObjectId;

//     promotionDate?: Date;

//     remarks?: string;

//     createdBy: mongoose.Types.ObjectId;
//   } = {
//     schoolId: new mongoose.Types.ObjectId(data.schoolId),

//     studentId: new mongoose.Types.ObjectId(data.studentId),

//     sessionId: new mongoose.Types.ObjectId(data.sessionId),

//     classId: new mongoose.Types.ObjectId(data.classId),

//     sectionId: new mongoose.Types.ObjectId(data.sectionId),

//     enrollmentStatus: data.enrollmentStatus ?? "ACTIVE",

//     promotionStatus: data.promotionStatus ?? "NOT_DECIDED",

//     createdBy: new mongoose.Types.ObjectId(data.createdBy),
//   };

//   if (data.rollNumber !== undefined) {
//     enrollmentData.rollNumber = data.rollNumber;
//   }

//   if (data.stream !== undefined) {
//     enrollmentData.stream = data.stream;
//   }

//   if (data.promotedFromEnrollmentId) {
//     validateObjectId(data.promotedFromEnrollmentId, "promotedFromEnrollmentId");

//     enrollmentData.promotedFromEnrollmentId = new mongoose.Types.ObjectId(
//       data.promotedFromEnrollmentId,
//     );
//   }

//   if (data.promotionDate) {
//     enrollmentData.promotionDate = data.promotionDate;
//   }

//   if (data.remarks?.trim()) {
//     enrollmentData.remarks = data.remarks.trim();
//   }

//   /* ===============================================
//        CREATE
//     =============================================== */

//   const created = await StudentEnrollment.create(
//     [enrollmentData],
//     mongoSession
//       ? {
//           session: mongoSession,
//         }
//       : undefined,
//   );

//   const enrollment = created[0];

//   if (!enrollment) {
//     throw new Error("Failed to create student enrollment.");
//   }

//   return enrollment;
// };

// /* =====================================================
//    GET CURRENT ENROLLMENT
// ===================================================== */

// export const getCurrentEnrollment = async (
//   schoolId: string,
//   studentId: string,
// ) => {
//   validateObjectId(schoolId, "schoolId");

//   validateObjectId(studentId, "studentId");

//   return StudentEnrollment.findOne({
//     schoolId,
//     studentId,
//     enrollmentStatus: "ACTIVE",
//   })
//     .populate("sessionId", "name startDate endDate isCurrent")
//     .populate("classId", "name order")
//     .populate("sectionId", "name roomNumber")
//     .sort({
//       createdAt: -1,
//     })
//     .lean();
// };

// /* =====================================================
//    GET STUDENT ENROLLMENT HISTORY
// ===================================================== */

// export const getStudentEnrollmentHistory = async (
//   schoolId: string,
//   studentId: string,
// ) => {
//   validateObjectId(schoolId, "schoolId");

//   validateObjectId(studentId, "studentId");

//   /* ===============================================
//        VERIFY STUDENT BELONGS TO SCHOOL
//     =============================================== */

//   const student = await Student.findOne({
//     _id: studentId,

//     schoolId,
//   })
//     .select("_id name admissionNumber")
//     .lean();

//   if (!student) {
//     throw new Error("Student not found.");
//   }

//   const enrollments = await StudentEnrollment.find({
//     schoolId,
//     studentId,
//   })
//     .populate("sessionId", "name startDate endDate isCurrent")
//     .populate("classId", "name order")
//     .populate("sectionId", "name roomNumber")
//     .sort({
//       createdAt: -1,
//     })
//     .lean();

//   return {
//     student,
//     enrollments,
//   };
// };

// /* =====================================================
//    GET PROMOTION CANDIDATES
// ===================================================== */

// export const getPromotionCandidates = async (
//   schoolId: string,
//   sessionId: string,
//   classId: string,
//   sectionId?: string,
// ) => {
//   validateObjectId(schoolId, "schoolId");

//   validateObjectId(sessionId, "sessionId");

//   validateObjectId(classId, "classId");

//   if (sectionId) {
//     validateObjectId(sectionId, "sectionId");
//   }

//   const filter: {
//     schoolId: string;
//     sessionId: string;
//     classId: string;
//     enrollmentStatus: "ACTIVE";
//     sectionId?: string;
//   } = {
//     schoolId,

//     sessionId,

//     classId,

//     enrollmentStatus: "ACTIVE",
//   };

//   if (sectionId) {
//     filter.sectionId = sectionId;
//   }

//   return StudentEnrollment.find(filter)
//     .populate(
//       "studentId",
//       ["name", "admissionNumber", "gender", "photo", "status"].join(" "),
//     )
//     .populate("sessionId", "name")
//     .populate("classId", "name order")
//     .populate("sectionId", "name roomNumber capacity")
//     .sort({
//       rollNumber: 1,
//       createdAt: 1,
//     })
//     .lean();
// };

// /* =====================================================
//    GET ENROLLMENT BY ID
// ===================================================== */

// export const getEnrollmentById = async (
//   schoolId: string,
//   enrollmentId: string,
// ) => {
//   validateObjectId(schoolId, "schoolId");

//   validateObjectId(enrollmentId, "enrollmentId");

//   const enrollment = await StudentEnrollment.findOne({
//     _id: enrollmentId,

//     schoolId,
//   })
//     .populate("studentId", "name admissionNumber")
//     .populate("sessionId", "name startDate endDate")
//     .populate("classId", "name order")
//     .populate("sectionId", "name roomNumber")
//     .lean();

//   if (!enrollment) {
//     throw new Error("Student enrollment not found.");
//   }

//   return enrollment;
// };

// /* =====================================================
//    UPDATE ENROLLMENT

//    Intended for controlled corrections:
//    section / class / roll / status etc.

//    Promotion itself will NOT use this public
//    function. Promotion service will run inside
//    a MongoDB transaction.
// ===================================================== */

// export const updateEnrollment = async (
//   schoolId: string,
//   enrollmentId: string,
//   data: IUpdateStudentEnrollmentData,
// ) => {
//   validateObjectId(schoolId, "schoolId");

//   validateObjectId(enrollmentId, "enrollmentId");

//   validateObjectId(data.updatedBy, "updatedBy");

//   const existingEnrollment = await StudentEnrollment.findOne({
//     _id: enrollmentId,

//     schoolId,
//   });

//   if (!existingEnrollment) {
//     throw new Error("Student enrollment not found.");
//   }

//   /* ===============================================
//        FINAL CLASS
//     =============================================== */

//   const finalClassId = data.classId ?? existingEnrollment.classId.toString();

//   /* ===============================================
//        FINAL SECTION
//     =============================================== */

//   const finalSectionId =
//     data.sectionId ?? existingEnrollment.sectionId.toString();

//   /* ===============================================
//        IF CLASS / SECTION CHANGES,
//        VALIDATE MAPPING
//     =============================================== */

//   if (data.classId || data.sectionId) {
//     await validateEnrollmentAcademicMapping(
//       schoolId,
//       existingEnrollment.sessionId.toString(),
//       finalClassId,
//       finalSectionId,
//     );
//   }

//   /* ===============================================
//        UPDATE PAYLOAD
//     =============================================== */

//   const updateData: {
//     classId?: mongoose.Types.ObjectId;

//     sectionId?: mongoose.Types.ObjectId;

//     rollNumber?: number;

//     stream?: StudentStream;

//     enrollmentStatus?: "ACTIVE" | "COMPLETED" | "CANCELLED";

//     promotionStatus?:
//       | "NOT_DECIDED"
//       | "PROMOTED"
//       | "RETAINED"
//       | "TRANSFERRED"
//       | "LEFT"
//       | "GRADUATED";

//     promotionDate?: Date;

//     remarks?: string;

//     updatedBy: mongoose.Types.ObjectId;
//   } = {
//     updatedBy: new mongoose.Types.ObjectId(data.updatedBy),
//   };

//   if (data.classId) {
//     validateObjectId(data.classId, "classId");

//     updateData.classId = new mongoose.Types.ObjectId(data.classId);
//   }

//   if (data.sectionId) {
//     validateObjectId(data.sectionId, "sectionId");

//     updateData.sectionId = new mongoose.Types.ObjectId(data.sectionId);
//   }

//   if (data.rollNumber !== undefined) {
//     if (!Number.isInteger(data.rollNumber) || data.rollNumber <= 0) {
//       throw new Error("Roll number must be a positive integer.");
//     }

//     updateData.rollNumber = data.rollNumber;
//   }

//   if (data.stream !== undefined && data.stream !== null) {
//     updateData.stream = data.stream;
//   }

//   if (data.enrollmentStatus) {
//     updateData.enrollmentStatus = data.enrollmentStatus;
//   }

//   if (data.promotionStatus) {
//     updateData.promotionStatus = data.promotionStatus;
//   }

//   if (data.promotionDate) {
//     updateData.promotionDate = data.promotionDate;
//   }

//   if (data.remarks !== undefined) {
//     updateData.remarks = data.remarks.trim();
//   }

//   /* ===============================================
//        UPDATE
//     =============================================== */

//   const enrollment = await StudentEnrollment.findOneAndUpdate(
//     {
//       _id: enrollmentId,

//       schoolId,
//     },
//     data.stream === null
//       ? {
//           $set: updateData,

//           $unset: {
//             stream: 1,
//           },
//         }
//       : {
//           $set: updateData,
//         },
//     {
//       new: true,
//       runValidators: true,
//     },
//   )
//     .populate("studentId", "name admissionNumber")
//     .populate("sessionId", "name")
//     .populate("classId", "name order")
//     .populate("sectionId", "name roomNumber");

//   if (!enrollment) {
//     throw new Error("Failed to update student enrollment.");
//   }

//   /*
//    * IMPORTANT:
//    *
//    * If active enrollment's class/section/roll
//    * is corrected, current Student snapshot must
//    * also remain synchronized.
//    */

//   if (enrollment.enrollmentStatus === "ACTIVE") {
//     const studentUpdate: {
//       classId?: mongoose.Types.ObjectId;

//       sectionId?: mongoose.Types.ObjectId;

//       rollNumber?: number;
//     } = {};

//     if (data.classId) {
//       studentUpdate.classId = new mongoose.Types.ObjectId(data.classId);
//     }

//     if (data.sectionId) {
//       studentUpdate.sectionId = new mongoose.Types.ObjectId(data.sectionId);
//     }

//     if (data.rollNumber !== undefined) {
//       studentUpdate.rollNumber = data.rollNumber;
//     }

//     if (Object.keys(studentUpdate).length > 0) {
//       await Student.updateOne(
//         {
//           _id: existingEnrollment.studentId,

//           schoolId,
//         },
//         {
//           $set: studentUpdate,
//         },
//       );
//     }
//   }

//   return enrollment;
// };

// /* =====================================================
//    GET STUDENTS BY ACADEMIC SESSION

//    Used by:
//    School Admin -> Students List

//    IMPORTANT:
//    Student document stores current academic snapshot.

//    StudentEnrollment is the source of truth for
//    session-wise / historical academic placement.

//    Therefore:
//    - Current session students
//    - Previous session students
//    - Class filtering
//    - Section filtering

//    are fetched through StudentEnrollment.
// ===================================================== */

// export const getStudentsByEnrollment = async (
//   schoolId: string,
//   sessionId: string,
//   classId?: string,
//   sectionId?: string,
//   search?: string,
// ) => {
//   /* ===============================================
//        VALIDATE IDS
//     =============================================== */

//   validateObjectId(schoolId, "schoolId");

//   validateObjectId(sessionId, "sessionId");

//   if (classId) {
//     validateObjectId(classId, "classId");
//   }

//   if (sectionId) {
//     validateObjectId(sectionId, "sectionId");
//   }

//   /* ===============================================
//        VERIFY SESSION BELONGS TO SCHOOL
//     =============================================== */

//   const academicSession = await AcademicSession.findOne({
//     _id: sessionId,

//     schoolId,
//   })
//     .select("_id name startDate endDate isCurrent")
//     .lean();

//   if (!academicSession) {
//     throw new Error("Academic session not found.");
//   }

//   /* ===============================================
//        VERIFY CLASS

//        Only when class filter is supplied.
//     =============================================== */

//   if (classId) {
//     const classData = await ClassModel.findOne({
//       _id: classId,

//       schoolId,

//       sessionId,
//     })
//       .select("_id")
//       .lean();

//     if (!classData) {
//       throw new Error(
//         "Class does not belong to the selected academic session.",
//       );
//     }
//   }

//   /* ===============================================
//        VERIFY SECTION

//        Section filter requires classId because
//        section belongs to a class.
//     =============================================== */

//   if (sectionId) {
//     if (!classId) {
//       throw new Error("classId is required when sectionId is provided.");
//     }

//     const section = await Section.findOne({
//       _id: sectionId,

//       schoolId,

//       sessionId,

//       classId,
//     })
//       .select("_id")
//       .lean();

//     if (!section) {
//       throw new Error("Section does not belong to the selected class.");
//     }
//   }

//   /* ===============================================
//        BUILD ENROLLMENT FILTER

//        IMPORTANT:
//        We intentionally do NOT filter only ACTIVE.

//        Why?

//        Historical sessions normally contain
//        COMPLETED enrollments after promotion.

//        Example:
//        2025-26 -> COMPLETED
//        2026-27 -> ACTIVE

//        If ACTIVE was forced here, previous-session
//        students would disappear from Student List.
//     =============================================== */

//   const filter: {
//     schoolId: string;
//     sessionId: string;
//     classId?: string;
//     sectionId?: string;
//   } = {
//     schoolId,

//     sessionId,
//   };

//   if (classId) {
//     filter.classId = classId;
//   }

//   if (sectionId) {
//     filter.sectionId = sectionId;
//   }

//   /* ===============================================
//        FETCH ENROLLMENTS

//        Student personal/master information comes
//        from studentId.

//        Academic placement comes from enrollment:
//        sessionId
//        classId
//        sectionId
//        rollNumber
//     =============================================== */

//   const enrollments = await StudentEnrollment.find(filter)

//     .populate(
//       "studentId",
//       [
//         "name",
//         "admissionNumber",
//         "admissionDate",
//         "admissionType",
//         "admissionCategory",
//         "dob",
//         "gender",
//         "bloodGroup",
//         "religion",
//         "category",
//         "caste",
//         "aadhaarNumber",
//         "photo",
//         "mobile",
//         "email",
//         "address",
//         "currentAddress",
//         "permanentAddress",
//         "father",
//         "mother",
//         "parentId",
//         "status",
//         "userId",
//         "createdAt",
//         "updatedAt",
//       ].join(" "),
//     )

//     .populate("sessionId", "name startDate endDate isCurrent")

//     .populate("classId", "name order isActive")

//     .populate("sectionId", "name roomNumber capacity isActive")

//     .sort({
//       classId: 1,
//       sectionId: 1,
//       rollNumber: 1,
//       createdAt: 1,
//     })

//     .lean();

//   /* ===============================================
//        SEARCH

//        Search happens against populated Student
//        because name/admissionNumber/mobile belong
//        to Student, not StudentEnrollment.
//     =============================================== */

//   const normalizedSearch = search?.trim().toLowerCase();

//   const filteredEnrollments = !normalizedSearch
//     ? enrollments
//     : enrollments.filter((enrollment) => {
//         const student = enrollment.studentId;

//         /*
//          * After populate(), studentId should
//          * be a Student object.
//          *
//          * This guard also safely handles
//          * deleted/broken student references.
//          */

//         if (!student || typeof student !== "object") {
//           return false;
//         }

//         const populatedStudent = student as unknown as {
//           name?: string;
//           admissionNumber?: string;
//           mobile?: string;
//           email?: string;
//         };

//         const name = populatedStudent.name?.toLowerCase() ?? "";

//         const admissionNumber =
//           populatedStudent.admissionNumber?.toLowerCase() ?? "";

//         const mobile = populatedStudent.mobile?.toLowerCase() ?? "";

//         const email = populatedStudent.email?.toLowerCase() ?? "";

//         return (
//           name.includes(normalizedSearch) ||
//           admissionNumber.includes(normalizedSearch) ||
//           mobile.includes(normalizedSearch) ||
//           email.includes(normalizedSearch)
//         );
//       });

//   /* ===============================================
//        FORMAT FOR STUDENT LIST

//        Existing frontend expects Student-like data.

//        Personal data:
//        Student document

//        Academic data:
//        StudentEnrollment

//        So enrollment academic values intentionally
//        override Student's current snapshot.
//     =============================================== */

//   const students = filteredEnrollments
//     .filter(
//       (enrollment) =>
//         enrollment.studentId && typeof enrollment.studentId === "object",
//     )
//     .map((enrollment) => {
//       const student = enrollment.studentId as unknown as Record<
//         string,
//         unknown
//       >;

//       return {
//         ...student,

//         /*
//          * Student identity
//          */

//         _id: String(student._id),

//         /*
//          * Tenant
//          */

//         schoolId: String(enrollment.schoolId),

//         /*
//          * IMPORTANT:
//          * Academic values come from
//          * StudentEnrollment.
//          */

//         sessionId: enrollment.sessionId,

//         classId: enrollment.classId,

//         sectionId: enrollment.sectionId,

//         rollNumber: enrollment.rollNumber,

//         /*
//          * Enrollment metadata
//          */

//         enrollmentId: String(enrollment._id),

//         enrollmentStatus: enrollment.enrollmentStatus,

//         promotionStatus: enrollment.promotionStatus,

//         promotedFromEnrollmentId: enrollment.promotedFromEnrollmentId
//           ? String(enrollment.promotedFromEnrollmentId)
//           : undefined,

//         promotionDate: enrollment.promotionDate,

//         enrollmentRemarks: enrollment.remarks,

//         enrollmentCreatedAt: enrollment.createdAt,

//         enrollmentUpdatedAt: enrollment.updatedAt,
//       };
//     });

//   /* ===============================================
//        RESPONSE
//     =============================================== */

//   return {
//     session: academicSession,

//     students,

//     total: students.length,
//   };
// };

// import mongoose from "mongoose";

// import { StudentEnrollment } from "./studentEnrollment.model";

// import { Student } from "./student.model";

// import { AcademicSession } from "../academic/academicSession.model";

// import type {
//   ICreateStudentEnrollmentData,
//   IUpdateStudentEnrollmentData,
//   StudentStream,
// } from "./studentEnrollment.types";
// import { ClassModel } from "../academic/classes/class.model";
// import { Section } from "../academic/sections/section.model";

// /* =====================================================
//    VALIDATE OBJECT ID
// ===================================================== */

// const validateObjectId = (value: string, fieldName: string): void => {
//   if (!mongoose.Types.ObjectId.isValid(value)) {
//     throw new Error(`Invalid ${fieldName}`);
//   }
// };

// /* =====================================================
//    VALIDATE ACADEMIC MAPPING

//    Checks:

//    Session belongs to school
//    Class belongs to session + school
//    Section belongs to class + session + school
// ===================================================== */

// export const validateEnrollmentAcademicMapping = async (
//   schoolId: string,
//   sessionId: string,
//   classId: string,
//   sectionId: string,
// ): Promise<void> => {
//   validateObjectId(schoolId, "schoolId");

//   validateObjectId(sessionId, "sessionId");

//   validateObjectId(classId, "classId");

//   validateObjectId(sectionId, "sectionId");

//   /* ===============================================
//        SESSION
//     =============================================== */

//   const session = await AcademicSession.findOne({
//     _id: sessionId,
//     schoolId,
//   })
//     .select("_id")
//     .lean();

//   if (!session) {
//     throw new Error("Academic session not found.");
//   }

//   /* ===============================================
//        CLASS
//     =============================================== */

//   const classData = await ClassModel.findOne({
//     _id: classId,
//     schoolId,
//     sessionId,
//   })
//     .select("_id isActive")
//     .lean();

//   if (!classData) {
//     throw new Error("Class does not belong to the selected academic session.");
//   }

//   if (classData.isActive === false) {
//     throw new Error("Selected class is inactive.");
//   }

//   /* ===============================================
//        SECTION
//     =============================================== */

//   const section = await Section.findOne({
//     _id: sectionId,
//     schoolId,
//     sessionId,
//     classId,
//   })
//     .select("_id isActive")
//     .lean();

//   if (!section) {
//     throw new Error("Section does not belong to the selected class.");
//   }

//   if (section.isActive === false) {
//     throw new Error("Selected section is inactive.");
//   }
// };

// /* =====================================================
//    CREATE INITIAL ENROLLMENT

//    Called when a new Student is created.

//    IMPORTANT:
//    Existing Student document remains the current
//    academic snapshot.

//    StudentEnrollment stores academic history.
// ===================================================== */

// export const createInitialEnrollment = async (
//   data: ICreateStudentEnrollmentData,
//   mongoSession?: mongoose.ClientSession,
// ) => {
//   validateObjectId(data.schoolId, "schoolId");

//   validateObjectId(data.studentId, "studentId");

//   validateObjectId(data.createdBy, "createdBy");

//   /* ===============================================
//        VALIDATE STUDENT
//     =============================================== */

//   const studentQuery = Student.findOne({
//     _id: data.studentId,

//     schoolId: data.schoolId,
//   }).select("_id");

//   if (mongoSession) {
//     studentQuery.session(mongoSession);
//   }

//   const student = await studentQuery;

//   if (!student) {
//     throw new Error("Student not found.");
//   }

//   /* ===============================================
//        VALIDATE ACADEMIC MAPPING
//     =============================================== */

//   /*
//    * We do not call
//    * validateEnrollmentAcademicMapping()
//    * here because transaction-aware validation
//    * needs the same MongoDB session.
//    */

//   const academicSessionQuery = AcademicSession.findOne({
//     _id: data.sessionId,

//     schoolId: data.schoolId,
//   }).select("_id");

//   if (mongoSession) {
//     academicSessionQuery.session(mongoSession);
//   }

//   const academicSession = await academicSessionQuery;

//   if (!academicSession) {
//     throw new Error("Academic session not found.");
//   }

//   const classQuery = ClassModel.findOne({
//     _id: data.classId,

//     schoolId: data.schoolId,

//     sessionId: data.sessionId,
//   }).select("_id isActive");

//   if (mongoSession) {
//     classQuery.session(mongoSession);
//   }

//   const classData = await classQuery;

//   if (!classData) {
//     throw new Error("Class does not belong to the selected academic session.");
//   }

//   if (classData.isActive === false) {
//     throw new Error("Selected class is inactive.");
//   }

//   const sectionQuery = Section.findOne({
//     _id: data.sectionId,

//     schoolId: data.schoolId,

//     sessionId: data.sessionId,

//     classId: data.classId,
//   }).select("_id isActive");

//   if (mongoSession) {
//     sectionQuery.session(mongoSession);
//   }

//   const section = await sectionQuery;

//   if (!section) {
//     throw new Error("Section does not belong to the selected class.");
//   }

//   if (section.isActive === false) {
//     throw new Error("Selected section is inactive.");
//   }

//   /* ===============================================
//        DUPLICATE ENROLLMENT
//     =============================================== */

//   const duplicateQuery = StudentEnrollment.findOne({
//     schoolId: data.schoolId,

//     studentId: data.studentId,

//     sessionId: data.sessionId,
//   }).select("_id");

//   if (mongoSession) {
//     duplicateQuery.session(mongoSession);
//   }

//   const duplicateEnrollment = await duplicateQuery;

//   if (duplicateEnrollment) {
//     throw new Error("Student is already enrolled in this academic session.");
//   }

//   /* ===============================================
//        CREATE ENROLLMENT PAYLOAD
//     =============================================== */

//   const enrollmentData: {
//     schoolId: mongoose.Types.ObjectId;

//     studentId: mongoose.Types.ObjectId;

//     sessionId: mongoose.Types.ObjectId;

//     classId: mongoose.Types.ObjectId;

//     sectionId: mongoose.Types.ObjectId;

//     rollNumber?: number;

//     stream?: StudentStream;

//     enrollmentStatus: "ACTIVE" | "COMPLETED" | "CANCELLED";

//     promotionStatus:
//       | "NOT_DECIDED"
//       | "PROMOTED"
//       | "RETAINED"
//       | "TRANSFERRED"
//       | "LEFT"
//       | "GRADUATED";

//     promotedFromEnrollmentId?: mongoose.Types.ObjectId;

//     promotionDate?: Date;

//     remarks?: string;

//     createdBy: mongoose.Types.ObjectId;
//   } = {
//     schoolId: new mongoose.Types.ObjectId(data.schoolId),

//     studentId: new mongoose.Types.ObjectId(data.studentId),

//     sessionId: new mongoose.Types.ObjectId(data.sessionId),

//     classId: new mongoose.Types.ObjectId(data.classId),

//     sectionId: new mongoose.Types.ObjectId(data.sectionId),

//     enrollmentStatus: data.enrollmentStatus ?? "ACTIVE",

//     promotionStatus: data.promotionStatus ?? "NOT_DECIDED",

//     createdBy: new mongoose.Types.ObjectId(data.createdBy),
//   };

//   if (data.rollNumber !== undefined) {
//     enrollmentData.rollNumber = data.rollNumber;
//   }

//   if (data.stream !== undefined) {
//     enrollmentData.stream = data.stream;
//   }

//   if (data.promotedFromEnrollmentId) {
//     validateObjectId(data.promotedFromEnrollmentId, "promotedFromEnrollmentId");

//     enrollmentData.promotedFromEnrollmentId = new mongoose.Types.ObjectId(
//       data.promotedFromEnrollmentId,
//     );
//   }

//   if (data.promotionDate) {
//     enrollmentData.promotionDate = data.promotionDate;
//   }

//   if (data.remarks?.trim()) {
//     enrollmentData.remarks = data.remarks.trim();
//   }

//   /* ===============================================
//        CREATE
//     =============================================== */

//   const created = await StudentEnrollment.create(
//     [enrollmentData],
//     mongoSession
//       ? {
//           session: mongoSession,
//         }
//       : undefined,
//   );

//   const enrollment = created[0];

//   if (!enrollment) {
//     throw new Error("Failed to create student enrollment.");
//   }

//   return enrollment;
// };

// /* =====================================================
//    GET CURRENT ENROLLMENT
// ===================================================== */

// export const getCurrentEnrollment = async (
//   schoolId: string,
//   studentId: string,
// ) => {
//   validateObjectId(schoolId, "schoolId");

//   validateObjectId(studentId, "studentId");

//   return StudentEnrollment.findOne({
//     schoolId,
//     studentId,
//     enrollmentStatus: "ACTIVE",
//   })
//     .populate("sessionId", "name startDate endDate isCurrent")
//     .populate("classId", "name order")
//     .populate("sectionId", "name roomNumber")
//     .sort({
//       createdAt: -1,
//     })
//     .lean();
// };

// /* =====================================================
//    GET STUDENT ENROLLMENT HISTORY
// ===================================================== */

// export const getStudentEnrollmentHistory = async (
//   schoolId: string,
//   studentId: string,
// ) => {
//   validateObjectId(schoolId, "schoolId");

//   validateObjectId(studentId, "studentId");

//   /* ===============================================
//        VERIFY STUDENT BELONGS TO SCHOOL
//     =============================================== */

//   const student = await Student.findOne({
//     _id: studentId,

//     schoolId,
//   })
//     .select("_id name admissionNumber")
//     .lean();

//   if (!student) {
//     throw new Error("Student not found.");
//   }

//   const enrollments = await StudentEnrollment.find({
//     schoolId,
//     studentId,
//   })
//     .populate("sessionId", "name startDate endDate isCurrent")
//     .populate("classId", "name order")
//     .populate("sectionId", "name roomNumber")
//     .sort({
//       createdAt: -1,
//     })
//     .lean();

//   return {
//     student,
//     enrollments,
//   };
// };

// /* =====================================================
//    GET PROMOTION CANDIDATES
// ===================================================== */

// export const getPromotionCandidates = async (
//   schoolId: string,
//   sessionId: string,
//   classId: string,
//   sectionId?: string,
// ) => {
//   validateObjectId(schoolId, "schoolId");

//   validateObjectId(sessionId, "sessionId");

//   validateObjectId(classId, "classId");

//   if (sectionId) {
//     validateObjectId(sectionId, "sectionId");
//   }

//   const filter: {
//     schoolId: string;
//     sessionId: string;
//     classId: string;
//     enrollmentStatus: "ACTIVE";
//     sectionId?: string;
//   } = {
//     schoolId,

//     sessionId,

//     classId,

//     enrollmentStatus: "ACTIVE",
//   };

//   if (sectionId) {
//     filter.sectionId = sectionId;
//   }

//   return StudentEnrollment.find(filter)
//     .populate(
//       "studentId",
//       ["name", "admissionNumber", "gender", "photo", "status"].join(" "),
//     )
//     .populate("sessionId", "name")
//     .populate("classId", "name order")
//     .populate("sectionId", "name roomNumber capacity")
//     .sort({
//       rollNumber: 1,
//       createdAt: 1,
//     })
//     .lean();
// };

// /* =====================================================
//    GET ENROLLMENT BY ID
// ===================================================== */

// export const getEnrollmentById = async (
//   schoolId: string,
//   enrollmentId: string,
// ) => {
//   validateObjectId(schoolId, "schoolId");

//   validateObjectId(enrollmentId, "enrollmentId");

//   const enrollment = await StudentEnrollment.findOne({
//     _id: enrollmentId,

//     schoolId,
//   })
//     .populate("studentId", "name admissionNumber")
//     .populate("sessionId", "name startDate endDate")
//     .populate("classId", "name order")
//     .populate("sectionId", "name roomNumber")
//     .lean();

//   if (!enrollment) {
//     throw new Error("Student enrollment not found.");
//   }

//   return enrollment;
// };

// /* =====================================================
//    UPDATE ENROLLMENT

//    Intended for controlled corrections:
//    section / class / roll / status etc.

//    Promotion itself will NOT use this public
//    function. Promotion service will run inside
//    a MongoDB transaction.
// ===================================================== */

// export const updateEnrollment = async (
//   schoolId: string,
//   enrollmentId: string,
//   data: IUpdateStudentEnrollmentData,
// ) => {
//   validateObjectId(schoolId, "schoolId");

//   validateObjectId(enrollmentId, "enrollmentId");

//   validateObjectId(data.updatedBy, "updatedBy");

//   const existingEnrollment = await StudentEnrollment.findOne({
//     _id: enrollmentId,

//     schoolId,
//   });

//   if (!existingEnrollment) {
//     throw new Error("Student enrollment not found.");
//   }

//   /* ===============================================
//        FINAL CLASS
//     =============================================== */

//   const finalClassId = data.classId ?? existingEnrollment.classId.toString();

//   /* ===============================================
//        FINAL SECTION
//     =============================================== */

//   const finalSectionId =
//     data.sectionId ?? existingEnrollment.sectionId.toString();

//   /* ===============================================
//        IF CLASS / SECTION CHANGES,
//        VALIDATE MAPPING
//     =============================================== */

//   if (data.classId || data.sectionId) {
//     await validateEnrollmentAcademicMapping(
//       schoolId,
//       existingEnrollment.sessionId.toString(),
//       finalClassId,
//       finalSectionId,
//     );
//   }

//   /* ===============================================
//        UPDATE PAYLOAD
//     =============================================== */

//   const updateData: {
//     classId?: mongoose.Types.ObjectId;

//     sectionId?: mongoose.Types.ObjectId;

//     rollNumber?: number;

//     stream?: StudentStream;

//     enrollmentStatus?: "ACTIVE" | "COMPLETED" | "CANCELLED";

//     promotionStatus?:
//       | "NOT_DECIDED"
//       | "PROMOTED"
//       | "RETAINED"
//       | "TRANSFERRED"
//       | "LEFT"
//       | "GRADUATED";

//     promotionDate?: Date;

//     remarks?: string;

//     updatedBy: mongoose.Types.ObjectId;
//   } = {
//     updatedBy: new mongoose.Types.ObjectId(data.updatedBy),
//   };

//   if (data.classId) {
//     validateObjectId(data.classId, "classId");

//     updateData.classId = new mongoose.Types.ObjectId(data.classId);
//   }

//   if (data.sectionId) {
//     validateObjectId(data.sectionId, "sectionId");

//     updateData.sectionId = new mongoose.Types.ObjectId(data.sectionId);
//   }

//   if (data.rollNumber !== undefined) {
//     if (!Number.isInteger(data.rollNumber) || data.rollNumber <= 0) {
//       throw new Error("Roll number must be a positive integer.");
//     }

//     updateData.rollNumber = data.rollNumber;
//   }

//   if (data.stream !== undefined && data.stream !== null) {
//     updateData.stream = data.stream;
//   }

//   if (data.enrollmentStatus) {
//     updateData.enrollmentStatus = data.enrollmentStatus;
//   }

//   if (data.promotionStatus) {
//     updateData.promotionStatus = data.promotionStatus;
//   }

//   if (data.promotionDate) {
//     updateData.promotionDate = data.promotionDate;
//   }

//   if (data.remarks !== undefined) {
//     updateData.remarks = data.remarks.trim();
//   }

//   /* ===============================================
//        UPDATE
//     =============================================== */

//   const enrollment = await StudentEnrollment.findOneAndUpdate(
//     {
//       _id: enrollmentId,

//       schoolId,
//     },
//     data.stream === null
//       ? {
//           $set: updateData,

//           $unset: {
//             stream: 1,
//           },
//         }
//       : {
//           $set: updateData,
//         },
//     {
//       new: true,
//       runValidators: true,
//     },
//   )
//     .populate("studentId", "name admissionNumber")
//     .populate("sessionId", "name")
//     .populate("classId", "name order")
//     .populate("sectionId", "name roomNumber");

//   if (!enrollment) {
//     throw new Error("Failed to update student enrollment.");
//   }

//   /*
//    * IMPORTANT:
//    *
//    * If active enrollment's class/section/roll
//    * is corrected, current Student snapshot must
//    * also remain synchronized.
//    */

//   if (enrollment.enrollmentStatus === "ACTIVE") {
//     const studentUpdate: {
//       classId?: mongoose.Types.ObjectId;

//       sectionId?: mongoose.Types.ObjectId;

//       rollNumber?: number;
//     } = {};

//     if (data.classId) {
//       studentUpdate.classId = new mongoose.Types.ObjectId(data.classId);
//     }

//     if (data.sectionId) {
//       studentUpdate.sectionId = new mongoose.Types.ObjectId(data.sectionId);
//     }

//     if (data.rollNumber !== undefined) {
//       studentUpdate.rollNumber = data.rollNumber;
//     }

//     if (Object.keys(studentUpdate).length > 0) {
//       await Student.updateOne(
//         {
//           _id: existingEnrollment.studentId,

//           schoolId,
//         },
//         {
//           $set: studentUpdate,
//         },
//       );
//     }
//   }

//   return enrollment;
// };

// /* =====================================================
//    GET STUDENTS BY ACADEMIC SESSION

//    Used by:
//    School Admin -> Students List

//    IMPORTANT:
//    Student document stores current academic snapshot.

//    StudentEnrollment is the source of truth for
//    session-wise / historical academic placement.

//    Therefore:
//    - Current session students
//    - Previous session students
//    - Class filtering
//    - Section filtering

//    are fetched through StudentEnrollment.
// ===================================================== */

// export const getStudentsByEnrollment = async (
//   schoolId: string,
//   sessionId: string,
//   classId?: string,
//   sectionId?: string,
//   search?: string,
// ) => {
//   /* ===============================================
//        VALIDATE IDS
//     =============================================== */

//   validateObjectId(schoolId, "schoolId");

//   validateObjectId(sessionId, "sessionId");

//   if (classId) {
//     validateObjectId(classId, "classId");
//   }

//   if (sectionId) {
//     validateObjectId(sectionId, "sectionId");
//   }

//   /* ===============================================
//        VERIFY SESSION BELONGS TO SCHOOL
//     =============================================== */

//   const academicSession = await AcademicSession.findOne({
//     _id: sessionId,

//     schoolId,
//   })
//     .select("_id name startDate endDate isCurrent")
//     .lean();

//   if (!academicSession) {
//     throw new Error("Academic session not found.");
//   }

//   /* ===============================================
//        VERIFY CLASS

//        Only when class filter is supplied.
//     =============================================== */

//   if (classId) {
//     const classData = await ClassModel.findOne({
//       _id: classId,

//       schoolId,

//       sessionId,
//     })
//       .select("_id")
//       .lean();

//     if (!classData) {
//       throw new Error(
//         "Class does not belong to the selected academic session.",
//       );
//     }
//   }

//   /* ===============================================
//        VERIFY SECTION

//        Section filter requires classId because
//        section belongs to a class.
//     =============================================== */

//   if (sectionId) {
//     if (!classId) {
//       throw new Error("classId is required when sectionId is provided.");
//     }

//     const section = await Section.findOne({
//       _id: sectionId,

//       schoolId,

//       sessionId,

//       classId,
//     })
//       .select("_id")
//       .lean();

//     if (!section) {
//       throw new Error("Section does not belong to the selected class.");
//     }
//   }

//   /* ===============================================
//        BUILD ENROLLMENT FILTER

//        IMPORTANT:
//        We intentionally do NOT filter only ACTIVE.

//        Why?

//        Historical sessions normally contain
//        COMPLETED enrollments after promotion.

//        Example:
//        2025-26 -> COMPLETED
//        2026-27 -> ACTIVE

//        If ACTIVE was forced here, previous-session
//        students would disappear from Student List.
//     =============================================== */

//   const filter: {
//     schoolId: string;
//     sessionId: string;
//     classId?: string;
//     sectionId?: string;
//   } = {
//     schoolId,

//     sessionId,
//   };

//   if (classId) {
//     filter.classId = classId;
//   }

//   if (sectionId) {
//     filter.sectionId = sectionId;
//   }

//   /* ===============================================
//        FETCH ENROLLMENTS

//        Student personal/master information comes
//        from studentId.

//        Academic placement comes from enrollment:
//        sessionId
//        classId
//        sectionId
//        rollNumber
//     =============================================== */

//   const enrollments = await StudentEnrollment.find(filter)

//     .populate(
//       "studentId",
//       [
//         "name",
//         "admissionNumber",
//         "admissionDate",
//         "admissionType",
//         "admissionCategory",
//         "dob",
//         "gender",
//         "bloodGroup",
//         "religion",
//         "category",
//         "caste",
//         "aadhaarNumber",
//         "photo",
//         "mobile",
//         "email",
//         "address",
//         "currentAddress",
//         "permanentAddress",
//         "father",
//         "mother",
//         "parentId",
//         "status",
//         "userId",
//         "createdAt",
//         "updatedAt",
//       ].join(" "),
//     )

//     .populate("sessionId", "name startDate endDate isCurrent")

//     .populate("classId", "name order isActive")

//     .populate("sectionId", "name roomNumber capacity isActive")

//     .sort({
//       classId: 1,
//       sectionId: 1,
//       rollNumber: 1,
//       createdAt: 1,
//     })

//     .lean();

//   /* ===============================================
//        SEARCH

//        Search happens against populated Student
//        because name/admissionNumber/mobile belong
//        to Student, not StudentEnrollment.
//     =============================================== */

//   const normalizedSearch = search?.trim().toLowerCase();

//   const filteredEnrollments = !normalizedSearch
//     ? enrollments
//     : enrollments.filter((enrollment) => {
//         const student = enrollment.studentId;

//         /*
//          * After populate(), studentId should
//          * be a Student object.
//          *
//          * This guard also safely handles
//          * deleted/broken student references.
//          */

//         if (!student || typeof student !== "object") {
//           return false;
//         }

//         const populatedStudent = student as unknown as {
//           name?: string;
//           admissionNumber?: string;
//           mobile?: string;
//           email?: string;
//         };

//         const name = populatedStudent.name?.toLowerCase() ?? "";

//         const admissionNumber =
//           populatedStudent.admissionNumber?.toLowerCase() ?? "";

//         const mobile = populatedStudent.mobile?.toLowerCase() ?? "";

//         const email = populatedStudent.email?.toLowerCase() ?? "";

//         return (
//           name.includes(normalizedSearch) ||
//           admissionNumber.includes(normalizedSearch) ||
//           mobile.includes(normalizedSearch) ||
//           email.includes(normalizedSearch)
//         );
//       });

//   /* ===============================================
//        FORMAT FOR STUDENT LIST

//        Existing frontend expects Student-like data.

//        Personal data:
//        Student document

//        Academic data:
//        StudentEnrollment

//        So enrollment academic values intentionally
//        override Student's current snapshot.
//     =============================================== */

//   const students = filteredEnrollments
//     .filter(
//       (enrollment) =>
//         enrollment.studentId && typeof enrollment.studentId === "object",
//     )
//     .map((enrollment) => {
//       const student = enrollment.studentId as unknown as Record<
//         string,
//         unknown
//       >;

//       return {
//         ...student,

//         /*
//          * Student identity
//          */

//         _id: String(student._id),

//         /*
//          * Tenant
//          */

//         schoolId: String(enrollment.schoolId),

//         /*
//          * IMPORTANT:
//          * Academic values come from
//          * StudentEnrollment.
//          */

//         sessionId: enrollment.sessionId,

//         classId: enrollment.classId,

//         sectionId: enrollment.sectionId,

//         rollNumber: enrollment.rollNumber,

//         /*
//          * Enrollment metadata
//          */

//         enrollmentId: String(enrollment._id),

//         enrollmentStatus: enrollment.enrollmentStatus,

//         promotionStatus: enrollment.promotionStatus,

//         promotedFromEnrollmentId: enrollment.promotedFromEnrollmentId
//           ? String(enrollment.promotedFromEnrollmentId)
//           : undefined,

//         promotionDate: enrollment.promotionDate,

//         enrollmentRemarks: enrollment.remarks,

//         enrollmentCreatedAt: enrollment.createdAt,

//         enrollmentUpdatedAt: enrollment.updatedAt,
//       };
//     });

//   /* ===============================================
//        RESPONSE
//     =============================================== */

//   return {
//     session: academicSession,

//     students,

//     total: students.length,
//   };
// };



// import mongoose from "mongoose";

// import { StudentEnrollment } from "./studentEnrollment.model";

// import { Student } from "./student.model";

// import { AcademicSession } from "../academic/academicSession.model";

// import type {
//   ICreateStudentEnrollmentData,
//   IUpdateStudentEnrollmentData,
//   StudentStream,
// } from "./studentEnrollment.types";
// import { ClassModel } from "../academic/classes/class.model";
// import { Section } from "../academic/sections/section.model";

// /* =====================================================
//    VALIDATE OBJECT ID
// ===================================================== */

// const validateObjectId = (value: string, fieldName: string): void => {
//   if (!mongoose.Types.ObjectId.isValid(value)) {
//     throw new Error(`Invalid ${fieldName}`);
//   }
// };

// /* =====================================================
//    VALIDATE ACADEMIC MAPPING

//    Checks:

//    Session belongs to school
//    Class belongs to session + school
//    Section belongs to class + session + school
// ===================================================== */

// export const validateEnrollmentAcademicMapping = async (
//   schoolId: string,
//   sessionId: string,
//   classId: string,
//   sectionId: string,
// ): Promise<void> => {
//   validateObjectId(schoolId, "schoolId");

//   validateObjectId(sessionId, "sessionId");

//   validateObjectId(classId, "classId");

//   validateObjectId(sectionId, "sectionId");

//   /* ===============================================
//        SESSION
//     =============================================== */

//   const session = await AcademicSession.findOne({
//     _id: sessionId,
//     schoolId,
//   })
//     .select("_id")
//     .lean();

//   if (!session) {
//     throw new Error("Academic session not found.");
//   }

//   /* ===============================================
//        CLASS
//     =============================================== */

//   const classData = await ClassModel.findOne({
//     _id: classId,
//     schoolId,
//     sessionId,
//   })
//     .select("_id isActive")
//     .lean();

//   if (!classData) {
//     throw new Error("Class does not belong to the selected academic session.");
//   }

//   if (classData.isActive === false) {
//     throw new Error("Selected class is inactive.");
//   }

//   /* ===============================================
//        SECTION
//     =============================================== */

//   const section = await Section.findOne({
//     _id: sectionId,
//     schoolId,
//     sessionId,
//     classId,
//   })
//     .select("_id isActive")
//     .lean();

//   if (!section) {
//     throw new Error("Section does not belong to the selected class.");
//   }

//   if (section.isActive === false) {
//     throw new Error("Selected section is inactive.");
//   }
// };

// /* =====================================================
//    CREATE INITIAL ENROLLMENT

//    Called when a new Student is created.

//    IMPORTANT:
//    Existing Student document remains the current
//    academic snapshot.

//    StudentEnrollment stores academic history.
// ===================================================== */

// export const createInitialEnrollment = async (
//   data: ICreateStudentEnrollmentData,
//   mongoSession?: mongoose.ClientSession,
// ) => {
//   validateObjectId(data.schoolId, "schoolId");

//   validateObjectId(data.studentId, "studentId");

//   validateObjectId(data.createdBy, "createdBy");

//   /* ===============================================
//        VALIDATE STUDENT
//     =============================================== */

//   const studentQuery = Student.findOne({
//     _id: data.studentId,

//     schoolId: data.schoolId,
//   }).select("_id");

//   if (mongoSession) {
//     studentQuery.session(mongoSession);
//   }

//   const student = await studentQuery;

//   if (!student) {
//     throw new Error("Student not found.");
//   }

//   /* ===============================================
//        VALIDATE ACADEMIC MAPPING
//     =============================================== */

//   /*
//    * We do not call
//    * validateEnrollmentAcademicMapping()
//    * here because transaction-aware validation
//    * needs the same MongoDB session.
//    */

//   const academicSessionQuery = AcademicSession.findOne({
//     _id: data.sessionId,

//     schoolId: data.schoolId,
//   }).select("_id");

//   if (mongoSession) {
//     academicSessionQuery.session(mongoSession);
//   }

//   const academicSession = await academicSessionQuery;

//   if (!academicSession) {
//     throw new Error("Academic session not found.");
//   }

//   const classQuery = ClassModel.findOne({
//     _id: data.classId,

//     schoolId: data.schoolId,

//     sessionId: data.sessionId,
//   }).select("_id isActive");

//   if (mongoSession) {
//     classQuery.session(mongoSession);
//   }

//   const classData = await classQuery;

//   if (!classData) {
//     throw new Error("Class does not belong to the selected academic session.");
//   }

//   if (classData.isActive === false) {
//     throw new Error("Selected class is inactive.");
//   }

//   const sectionQuery = Section.findOne({
//     _id: data.sectionId,

//     schoolId: data.schoolId,

//     sessionId: data.sessionId,

//     classId: data.classId,
//   }).select("_id isActive");

//   if (mongoSession) {
//     sectionQuery.session(mongoSession);
//   }

//   const section = await sectionQuery;

//   if (!section) {
//     throw new Error("Section does not belong to the selected class.");
//   }

//   if (section.isActive === false) {
//     throw new Error("Selected section is inactive.");
//   }

//   /* ===============================================
//        DUPLICATE ENROLLMENT
//     =============================================== */

//   const duplicateQuery = StudentEnrollment.findOne({
//     schoolId: data.schoolId,

//     studentId: data.studentId,

//     sessionId: data.sessionId,
//   }).select("_id");

//   if (mongoSession) {
//     duplicateQuery.session(mongoSession);
//   }

//   const duplicateEnrollment = await duplicateQuery;

//   if (duplicateEnrollment) {
//     throw new Error("Student is already enrolled in this academic session.");
//   }

//   /* ===============================================
//        CREATE ENROLLMENT PAYLOAD
//     =============================================== */

//   const enrollmentData: {
//     schoolId: mongoose.Types.ObjectId;

//     studentId: mongoose.Types.ObjectId;

//     sessionId: mongoose.Types.ObjectId;

//     classId: mongoose.Types.ObjectId;

//     sectionId: mongoose.Types.ObjectId;

//     rollNumber?: number;

//     stream?: StudentStream;

//     enrollmentStatus: "ACTIVE" | "COMPLETED" | "CANCELLED";

//     promotionStatus:
//       | "NOT_DECIDED"
//       | "PROMOTED"
//       | "RETAINED"
//       | "TRANSFERRED"
//       | "LEFT"
//       | "GRADUATED";

//     promotedFromEnrollmentId?: mongoose.Types.ObjectId;

//     promotionDate?: Date;

//     remarks?: string;

//     createdBy: mongoose.Types.ObjectId;
//   } = {
//     schoolId: new mongoose.Types.ObjectId(data.schoolId),

//     studentId: new mongoose.Types.ObjectId(data.studentId),

//     sessionId: new mongoose.Types.ObjectId(data.sessionId),

//     classId: new mongoose.Types.ObjectId(data.classId),

//     sectionId: new mongoose.Types.ObjectId(data.sectionId),

//     enrollmentStatus: data.enrollmentStatus ?? "ACTIVE",

//     promotionStatus: data.promotionStatus ?? "NOT_DECIDED",

//     createdBy: new mongoose.Types.ObjectId(data.createdBy),
//   };

//   if (data.rollNumber !== undefined) {
//     enrollmentData.rollNumber = data.rollNumber;
//   }

//   if (data.stream !== undefined) {
//     enrollmentData.stream = data.stream;
//   }

//   if (data.promotedFromEnrollmentId) {
//     validateObjectId(data.promotedFromEnrollmentId, "promotedFromEnrollmentId");

//     enrollmentData.promotedFromEnrollmentId = new mongoose.Types.ObjectId(
//       data.promotedFromEnrollmentId,
//     );
//   }

//   if (data.promotionDate) {
//     enrollmentData.promotionDate = data.promotionDate;
//   }

//   if (data.remarks?.trim()) {
//     enrollmentData.remarks = data.remarks.trim();
//   }

//   /* ===============================================
//        CREATE
//     =============================================== */

//   const created = await StudentEnrollment.create(
//     [enrollmentData],
//     mongoSession
//       ? {
//           session: mongoSession,
//         }
//       : undefined,
//   );

//   const enrollment = created[0];

//   if (!enrollment) {
//     throw new Error("Failed to create student enrollment.");
//   }

//   return enrollment;
// };

// /* =====================================================
//    GET CURRENT ENROLLMENT
// ===================================================== */

// export const getCurrentEnrollment = async (
//   schoolId: string,
//   studentId: string,
// ) => {
//   validateObjectId(schoolId, "schoolId");

//   validateObjectId(studentId, "studentId");

//   return StudentEnrollment.findOne({
//     schoolId,
//     studentId,
//     enrollmentStatus: "ACTIVE",
//   })
//     .populate("sessionId", "name startDate endDate isCurrent")
//     .populate("classId", "name order")
//     .populate("sectionId", "name roomNumber")
//     .sort({
//       createdAt: -1,
//     })
//     .lean();
// };

// /* =====================================================
//    GET STUDENT ENROLLMENT HISTORY
// ===================================================== */

// export const getStudentEnrollmentHistory = async (
//   schoolId: string,
//   studentId: string,
// ) => {
//   validateObjectId(schoolId, "schoolId");

//   validateObjectId(studentId, "studentId");

//   /* ===============================================
//        VERIFY STUDENT BELONGS TO SCHOOL
//     =============================================== */

//   const student = await Student.findOne({
//     _id: studentId,

//     schoolId,
//   })
//     .select("_id name admissionNumber")
//     .lean();

//   if (!student) {
//     throw new Error("Student not found.");
//   }

//   const enrollments = await StudentEnrollment.find({
//     schoolId,
//     studentId,
//   })
//     .populate("sessionId", "name startDate endDate isCurrent")
//     .populate("classId", "name order")
//     .populate("sectionId", "name roomNumber")
//     .sort({
//       createdAt: -1,
//     })
//     .lean();

//   return {
//     student,
//     enrollments,
//   };
// };

// /* =====================================================
//    GET PROMOTION CANDIDATES
// ===================================================== */

// export const getPromotionCandidates = async (
//   schoolId: string,
//   sessionId: string,
//   classId: string,
//   sectionId?: string,
// ) => {
//   validateObjectId(schoolId, "schoolId");

//   validateObjectId(sessionId, "sessionId");

//   validateObjectId(classId, "classId");

//   if (sectionId) {
//     validateObjectId(sectionId, "sectionId");
//   }

//   const filter: {
//     schoolId: string;
//     sessionId: string;
//     classId: string;
//     enrollmentStatus: "ACTIVE";
//     sectionId?: string;
//   } = {
//     schoolId,

//     sessionId,

//     classId,

//     enrollmentStatus: "ACTIVE",
//   };

//   if (sectionId) {
//     filter.sectionId = sectionId;
//   }

//   return StudentEnrollment.find(filter)
//     .populate(
//       "studentId",
//       ["name", "admissionNumber", "gender", "photo", "status"].join(" "),
//     )
//     .populate("sessionId", "name")
//     .populate("classId", "name order")
//     .populate("sectionId", "name roomNumber capacity")
//     .sort({
//       rollNumber: 1,
//       createdAt: 1,
//     })
//     .lean();
// };

// /* =====================================================
//    GET ENROLLMENT BY ID
// ===================================================== */

// export const getEnrollmentById = async (
//   schoolId: string,
//   enrollmentId: string,
// ) => {
//   validateObjectId(schoolId, "schoolId");

//   validateObjectId(enrollmentId, "enrollmentId");

//   const enrollment = await StudentEnrollment.findOne({
//     _id: enrollmentId,

//     schoolId,
//   })
//     .populate("studentId", "name admissionNumber")
//     .populate("sessionId", "name startDate endDate")
//     .populate("classId", "name order")
//     .populate("sectionId", "name roomNumber")
//     .lean();

//   if (!enrollment) {
//     throw new Error("Student enrollment not found.");
//   }

//   return enrollment;
// };

// /* =====================================================
//    UPDATE ENROLLMENT

//    Intended for controlled corrections:
//    section / class / roll / status etc.

//    Promotion itself will NOT use this public
//    function. Promotion service will run inside
//    a MongoDB transaction.
// ===================================================== */

// export const updateEnrollment = async (
//   schoolId: string,
//   enrollmentId: string,
//   data: IUpdateStudentEnrollmentData,
// ) => {
//   validateObjectId(schoolId, "schoolId");

//   validateObjectId(enrollmentId, "enrollmentId");

//   validateObjectId(data.updatedBy, "updatedBy");

//   const existingEnrollment = await StudentEnrollment.findOne({
//     _id: enrollmentId,

//     schoolId,
//   });

//   if (!existingEnrollment) {
//     throw new Error("Student enrollment not found.");
//   }

//   /* ===============================================
//        FINAL CLASS
//     =============================================== */

//   const finalClassId = data.classId ?? existingEnrollment.classId.toString();

//   /* ===============================================
//        FINAL SECTION
//     =============================================== */

//   const finalSectionId =
//     data.sectionId ?? existingEnrollment.sectionId.toString();

//   /* ===============================================
//        IF CLASS / SECTION CHANGES,
//        VALIDATE MAPPING
//     =============================================== */

//   if (data.classId || data.sectionId) {
//     await validateEnrollmentAcademicMapping(
//       schoolId,
//       existingEnrollment.sessionId.toString(),
//       finalClassId,
//       finalSectionId,
//     );
//   }

//   /* ===============================================
//        UPDATE PAYLOAD
//     =============================================== */

//   const updateData: {
//     classId?: mongoose.Types.ObjectId;

//     sectionId?: mongoose.Types.ObjectId;

//     rollNumber?: number;

//     stream?: StudentStream;

//     enrollmentStatus?: "ACTIVE" | "COMPLETED" | "CANCELLED";

//     promotionStatus?:
//       | "NOT_DECIDED"
//       | "PROMOTED"
//       | "RETAINED"
//       | "TRANSFERRED"
//       | "LEFT"
//       | "GRADUATED";

//     promotionDate?: Date;

//     remarks?: string;

//     updatedBy: mongoose.Types.ObjectId;
//   } = {
//     updatedBy: new mongoose.Types.ObjectId(data.updatedBy),
//   };

//   if (data.classId) {
//     validateObjectId(data.classId, "classId");

//     updateData.classId = new mongoose.Types.ObjectId(data.classId);
//   }

//   if (data.sectionId) {
//     validateObjectId(data.sectionId, "sectionId");

//     updateData.sectionId = new mongoose.Types.ObjectId(data.sectionId);
//   }

//   if (data.rollNumber !== undefined) {
//     if (!Number.isInteger(data.rollNumber) || data.rollNumber <= 0) {
//       throw new Error("Roll number must be a positive integer.");
//     }

//     updateData.rollNumber = data.rollNumber;
//   }

//   if (data.stream !== undefined && data.stream !== null) {
//     updateData.stream = data.stream;
//   }

//   if (data.enrollmentStatus) {
//     updateData.enrollmentStatus = data.enrollmentStatus;
//   }

//   if (data.promotionStatus) {
//     updateData.promotionStatus = data.promotionStatus;
//   }

//   if (data.promotionDate) {
//     updateData.promotionDate = data.promotionDate;
//   }

//   if (data.remarks !== undefined) {
//     updateData.remarks = data.remarks.trim();
//   }

//   /* ===============================================
//        UPDATE
//     =============================================== */

//   const enrollment = await StudentEnrollment.findOneAndUpdate(
//     {
//       _id: enrollmentId,

//       schoolId,
//     },
//     data.stream === null
//       ? {
//           $set: updateData,

//           $unset: {
//             stream: 1,
//           },
//         }
//       : {
//           $set: updateData,
//         },
//     {
//       new: true,
//       runValidators: true,
//     },
//   )
//     .populate("studentId", "name admissionNumber")
//     .populate("sessionId", "name")
//     .populate("classId", "name order")
//     .populate("sectionId", "name roomNumber");

//   if (!enrollment) {
//     throw new Error("Failed to update student enrollment.");
//   }

//   /*
//    * IMPORTANT:
//    *
//    * If active enrollment's class/section/roll
//    * is corrected, current Student snapshot must
//    * also remain synchronized.
//    */

//   if (enrollment.enrollmentStatus === "ACTIVE") {
//     const studentUpdate: {
//       classId?: mongoose.Types.ObjectId;

//       sectionId?: mongoose.Types.ObjectId;

//       rollNumber?: number;
//     } = {};

//     if (data.classId) {
//       studentUpdate.classId = new mongoose.Types.ObjectId(data.classId);
//     }

//     if (data.sectionId) {
//       studentUpdate.sectionId = new mongoose.Types.ObjectId(data.sectionId);
//     }

//     if (data.rollNumber !== undefined) {
//       studentUpdate.rollNumber = data.rollNumber;
//     }

//     if (Object.keys(studentUpdate).length > 0) {
//       await Student.updateOne(
//         {
//           _id: existingEnrollment.studentId,

//           schoolId,
//         },
//         {
//           $set: studentUpdate,
//         },
//       );
//     }
//   }

//   return enrollment;
// };

// /* =====================================================
//    GET STUDENTS BY ACADEMIC SESSION

//    Used by:
//    School Admin -> Students List

//    IMPORTANT:
//    Student document stores current academic snapshot.

//    StudentEnrollment is the source of truth for
//    session-wise / historical academic placement.

//    Therefore:
//    - Current session students
//    - Previous session students
//    - Class filtering
//    - Section filtering

//    are fetched through StudentEnrollment.
// ===================================================== */

// export const getStudentsByEnrollment = async (
//   schoolId: string,
//   sessionId: string,
//   classId?: string,
//   sectionId?: string,
//   search?: string,
// ) => {
//   /* ===============================================
//        VALIDATE IDS
//     =============================================== */

//   validateObjectId(schoolId, "schoolId");

//   validateObjectId(sessionId, "sessionId");

//   if (classId) {
//     validateObjectId(classId, "classId");
//   }

//   if (sectionId) {
//     validateObjectId(sectionId, "sectionId");
//   }

//   /* ===============================================
//        VERIFY SESSION BELONGS TO SCHOOL
//     =============================================== */

//   const academicSession = await AcademicSession.findOne({
//     _id: sessionId,

//     schoolId,
//   })
//     .select("_id name startDate endDate isCurrent")
//     .lean();

//   if (!academicSession) {
//     throw new Error("Academic session not found.");
//   }

//   /* ===============================================
//        VERIFY CLASS

//        Only when class filter is supplied.
//     =============================================== */

//   if (classId) {
//     const classData = await ClassModel.findOne({
//       _id: classId,

//       schoolId,

//       sessionId,
//     })
//       .select("_id")
//       .lean();

//     if (!classData) {
//       throw new Error(
//         "Class does not belong to the selected academic session.",
//       );
//     }
//   }

//   /* ===============================================
//        VERIFY SECTION

//        Section filter requires classId because
//        section belongs to a class.
//     =============================================== */

//   if (sectionId) {
//     if (!classId) {
//       throw new Error("classId is required when sectionId is provided.");
//     }

//     const section = await Section.findOne({
//       _id: sectionId,

//       schoolId,

//       sessionId,

//       classId,
//     })
//       .select("_id")
//       .lean();

//     if (!section) {
//       throw new Error("Section does not belong to the selected class.");
//     }
//   }

//   /* ===============================================
//        BUILD ENROLLMENT FILTER

//        IMPORTANT:
//        We intentionally do NOT filter only ACTIVE.

//        Why?

//        Historical sessions normally contain
//        COMPLETED enrollments after promotion.

//        Example:
//        2025-26 -> COMPLETED
//        2026-27 -> ACTIVE

//        If ACTIVE was forced here, previous-session
//        students would disappear from Student List.
//     =============================================== */

//   const filter: {
//     schoolId: string;
//     sessionId: string;
//     classId?: string;
//     sectionId?: string;
//   } = {
//     schoolId,

//     sessionId,
//   };

//   if (classId) {
//     filter.classId = classId;
//   }

//   if (sectionId) {
//     filter.sectionId = sectionId;
//   }

//   /* ===============================================
//        FETCH ENROLLMENTS

//        Student personal/master information comes
//        from studentId.

//        Academic placement comes from enrollment:
//        sessionId
//        classId
//        sectionId
//        rollNumber
//     =============================================== */

//   const enrollments = await StudentEnrollment.find(filter)
//     .populate(
//       "studentId",
//       [
//         "_id",
//         "name",
//         "admissionNumber",
//         "admissionDate",
//         "admissionType",
//         "admissionCategory",
//         "dob",
//         "gender",
//         "bloodGroup",
//         "religion",
//         "category",
//         "caste",
//         "aadhaarNumber",
//         "apaarId",
//         "penNumber",
//         "photo",
//         "mobile",
//         "email",
//         "address",
//         "currentAddress",
//         "permanentAddress",
//         "father",
//         "mother",
//         "parentId",
//         "status",
//         "userId",
//         "createdAt",
//         "updatedAt",
//       ].join(" "),
//     )
//     .populate("sessionId", "name startDate endDate isCurrent")
//     .populate("classId", "name order isActive")
//     .populate("sectionId", "name roomNumber capacity isActive")
//     .sort({
//       classId: 1,
//       sectionId: 1,
//       rollNumber: 1,
//       createdAt: 1,
//     })
//     .lean();

//   /* ===============================================
//        SEARCH

//        Search happens against populated Student
//        because name/admissionNumber/mobile belong
//        to Student, not StudentEnrollment.
//     =============================================== */

//   const normalizedSearch = search?.trim().toLowerCase();

//   const filteredEnrollments = !normalizedSearch
//     ? enrollments
//     : enrollments.filter((enrollment) => {
//         const student = enrollment.studentId;

//         /*
//          * After populate(), studentId should
//          * be a Student object.
//          *
//          * This guard also safely handles
//          * deleted/broken student references.
//          */

//         if (!student || typeof student !== "object") {
//           return false;
//         }

//         const populatedStudent = student as unknown as {
//           name?: string;
//           admissionNumber?: string;
//           mobile?: string;
//           email?: string;
//         };

//         const name = populatedStudent.name?.toLowerCase() ?? "";

//         const admissionNumber =
//           populatedStudent.admissionNumber?.toLowerCase() ?? "";

//         const mobile = populatedStudent.mobile?.toLowerCase() ?? "";

//         const email = populatedStudent.email?.toLowerCase() ?? "";

//         return (
//           name.includes(normalizedSearch) ||
//           admissionNumber.includes(normalizedSearch) ||
//           mobile.includes(normalizedSearch) ||
//           email.includes(normalizedSearch)
//         );
//       });

//   /* ===============================================
//        FORMAT FOR STUDENT LIST

//        Existing frontend expects Student-like data.

//        Personal data:
//        Student document

//        Academic data:
//        StudentEnrollment

//        So enrollment academic values intentionally
//        override Student's current snapshot.
//     =============================================== */

//   const students = filteredEnrollments
//     .filter(
//       (enrollment) =>
//         enrollment.studentId && typeof enrollment.studentId === "object",
//     )
//     .map((enrollment) => {
//       const student = enrollment.studentId as unknown as Record<
//         string,
//         unknown
//       >;

//       return {
//         ...student,

//         /*
//          * Student identity
//          */

//         _id: String(student._id),

//         /*
//          * Tenant
//          */

//         schoolId: String(enrollment.schoolId),

//         /*
//          * IMPORTANT:
//          * Academic values come from
//          * StudentEnrollment.
//          */

//         sessionId: enrollment.sessionId,

//         classId: enrollment.classId,

//         sectionId: enrollment.sectionId,

//         rollNumber: enrollment.rollNumber,

//         stream: enrollment.stream,

//         /*
//          * Enrollment metadata
//          */

//         enrollmentId: String(enrollment._id),

//         enrollmentStatus: enrollment.enrollmentStatus,

//         promotionStatus: enrollment.promotionStatus,

//         promotedFromEnrollmentId: enrollment.promotedFromEnrollmentId
//           ? String(enrollment.promotedFromEnrollmentId)
//           : undefined,

//         promotionDate: enrollment.promotionDate,

//         enrollmentRemarks: enrollment.remarks,

//         enrollmentCreatedAt: enrollment.createdAt,

//         enrollmentUpdatedAt: enrollment.updatedAt,

//         enrollment: {
//           _id: String(enrollment._id),

//           rollNumber: enrollment.rollNumber,

//           stream: enrollment.stream,

//           enrollmentStatus: enrollment.enrollmentStatus,

//           promotionStatus: enrollment.promotionStatus,

//           promotedFromEnrollmentId: enrollment.promotedFromEnrollmentId
//             ? String(enrollment.promotedFromEnrollmentId)
//             : undefined,

//           promotionDate: enrollment.promotionDate,

//           remarks: enrollment.remarks,

//           createdAt: enrollment.createdAt,

//           updatedAt: enrollment.updatedAt,
//         },
//       };
//     });

//   /* ===============================================
//        RESPONSE
//     =============================================== */

//   return {
//     session: academicSession,

//     students,

//     total: students.length,
//   };
// };




import mongoose from "mongoose";

import { StudentEnrollment } from "./studentEnrollment.model";

import { Student } from "./student.model";

import { StudentSubjectEnrollment } from "./studentSubjectEnrollment.model";

import { AcademicSession } from "../academic/academicSession.model";

import type {
  ICreateStudentEnrollmentData,
  IUpdateStudentEnrollmentData,
  StudentStream,
} from "./studentEnrollment.types";
import { ClassModel } from "../academic/classes/class.model";
import { Section } from "../academic/sections/section.model";

import { SubjectAssignment } from "../academic/subjectAssignments/subjectAssignment.model";

/* =====================================================
   VALIDATE OBJECT ID
===================================================== */

const validateObjectId = (value: string, fieldName: string): void => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error(`Invalid ${fieldName}`);
  }
};

const normalizeClassName = (value?: string): string =>
  value?.trim().toLowerCase().replace(/\s+/g, "") ?? "";

const isSeniorSecondaryClass = (classData: {
  name?: string;
  order?: number;
}): boolean => {
  if (classData.order === 11 || classData.order === 12) {
    return true;
  }

  return ["11", "12", "class11", "class12", "xi", "xii"].includes(
    normalizeClassName(classData.name),
  );
};

/* =====================================================
   VALIDATE ACADEMIC MAPPING

   Checks:

   Session belongs to school
   Class belongs to session + school
   Section belongs to class + session + school
===================================================== */

export const validateEnrollmentAcademicMapping = async (
  schoolId: string,
  sessionId: string,
  classId: string,
  sectionId: string,
): Promise<void> => {
  validateObjectId(schoolId, "schoolId");

  validateObjectId(sessionId, "sessionId");

  validateObjectId(classId, "classId");

  validateObjectId(sectionId, "sectionId");

  /* ===============================================
       SESSION
    =============================================== */

  const session = await AcademicSession.findOne({
    _id: sessionId,
    schoolId,
  })
    .select("_id")
    .lean();

  if (!session) {
    throw new Error("Academic session not found.");
  }

  /* ===============================================
       CLASS
    =============================================== */

  const classData = await ClassModel.findOne({
    _id: classId,
    schoolId,
    sessionId,
  })
    .select("_id isActive")
    .lean();

  if (!classData) {
    throw new Error("Class does not belong to the selected academic session.");
  }

  if (classData.isActive === false) {
    throw new Error("Selected class is inactive.");
  }

  /* ===============================================
       SECTION
    =============================================== */

  const section = await Section.findOne({
    _id: sectionId,
    schoolId,
    sessionId,
    classId,
  })
    .select("_id isActive")
    .lean();

  if (!section) {
    throw new Error("Section does not belong to the selected class.");
  }

  if (section.isActive === false) {
    throw new Error("Selected section is inactive.");
  }
};

/* =====================================================
   CREATE INITIAL ENROLLMENT

   Called when a new Student is created.

   IMPORTANT:
   Existing Student document remains the current
   academic snapshot.

   StudentEnrollment stores academic history.
===================================================== */

export const createInitialEnrollment = async (
  data: ICreateStudentEnrollmentData,
  mongoSession?: mongoose.ClientSession,
) => {
  validateObjectId(data.schoolId, "schoolId");

  validateObjectId(data.studentId, "studentId");

  validateObjectId(data.createdBy, "createdBy");

  /* ===============================================
       VALIDATE STUDENT
    =============================================== */

  const studentQuery = Student.findOne({
    _id: data.studentId,

    schoolId: data.schoolId,
  }).select("_id");

  if (mongoSession) {
    studentQuery.session(mongoSession);
  }

  const student = await studentQuery;

  if (!student) {
    throw new Error("Student not found.");
  }

  /* ===============================================
       VALIDATE ACADEMIC MAPPING
    =============================================== */

  /*
   * We do not call
   * validateEnrollmentAcademicMapping()
   * here because transaction-aware validation
   * needs the same MongoDB session.
   */

  const academicSessionQuery = AcademicSession.findOne({
    _id: data.sessionId,

    schoolId: data.schoolId,
  }).select("_id");

  if (mongoSession) {
    academicSessionQuery.session(mongoSession);
  }

  const academicSession = await academicSessionQuery;

  if (!academicSession) {
    throw new Error("Academic session not found.");
  }

  const classQuery = ClassModel.findOne({
    _id: data.classId,

    schoolId: data.schoolId,

    sessionId: data.sessionId,
  }).select("_id isActive");

  if (mongoSession) {
    classQuery.session(mongoSession);
  }

  const classData = await classQuery;

  if (!classData) {
    throw new Error("Class does not belong to the selected academic session.");
  }

  if (classData.isActive === false) {
    throw new Error("Selected class is inactive.");
  }

  const sectionQuery = Section.findOne({
    _id: data.sectionId,

    schoolId: data.schoolId,

    sessionId: data.sessionId,

    classId: data.classId,
  }).select("_id isActive");

  if (mongoSession) {
    sectionQuery.session(mongoSession);
  }

  const section = await sectionQuery;

  if (!section) {
    throw new Error("Section does not belong to the selected class.");
  }

  if (section.isActive === false) {
    throw new Error("Selected section is inactive.");
  }

  /* ===============================================
       DUPLICATE ENROLLMENT
    =============================================== */

  const duplicateQuery = StudentEnrollment.findOne({
    schoolId: data.schoolId,

    studentId: data.studentId,

    sessionId: data.sessionId,
  }).select("_id");

  if (mongoSession) {
    duplicateQuery.session(mongoSession);
  }

  const duplicateEnrollment = await duplicateQuery;

  if (duplicateEnrollment) {
    throw new Error("Student is already enrolled in this academic session.");
  }

  /* ===============================================
       CREATE ENROLLMENT PAYLOAD
    =============================================== */

  const enrollmentData: {
    schoolId: mongoose.Types.ObjectId;

    studentId: mongoose.Types.ObjectId;

    sessionId: mongoose.Types.ObjectId;

    classId: mongoose.Types.ObjectId;

    sectionId: mongoose.Types.ObjectId;

    rollNumber?: number;

    stream?: StudentStream;

    enrollmentStatus: "ACTIVE" | "COMPLETED" | "CANCELLED";

    promotionStatus:
      | "NOT_DECIDED"
      | "PROMOTED"
      | "RETAINED"
      | "TRANSFERRED"
      | "LEFT"
      | "GRADUATED";

    promotedFromEnrollmentId?: mongoose.Types.ObjectId;

    promotionDate?: Date;

    remarks?: string;

    createdBy: mongoose.Types.ObjectId;
  } = {
    schoolId: new mongoose.Types.ObjectId(data.schoolId),

    studentId: new mongoose.Types.ObjectId(data.studentId),

    sessionId: new mongoose.Types.ObjectId(data.sessionId),

    classId: new mongoose.Types.ObjectId(data.classId),

    sectionId: new mongoose.Types.ObjectId(data.sectionId),

    enrollmentStatus: data.enrollmentStatus ?? "ACTIVE",

    promotionStatus: data.promotionStatus ?? "NOT_DECIDED",

    createdBy: new mongoose.Types.ObjectId(data.createdBy),
  };

  if (data.rollNumber !== undefined) {
    enrollmentData.rollNumber = data.rollNumber;
  }

  if (data.stream !== undefined) {
    enrollmentData.stream = data.stream;
  }

  if (data.promotedFromEnrollmentId) {
    validateObjectId(data.promotedFromEnrollmentId, "promotedFromEnrollmentId");

    enrollmentData.promotedFromEnrollmentId = new mongoose.Types.ObjectId(
      data.promotedFromEnrollmentId,
    );
  }

  if (data.promotionDate) {
    enrollmentData.promotionDate = data.promotionDate;
  }

  if (data.remarks?.trim()) {
    enrollmentData.remarks = data.remarks.trim();
  }

  /* ===============================================
       CREATE
    =============================================== */

  const created = await StudentEnrollment.create(
    [enrollmentData],
    mongoSession
      ? {
          session: mongoSession,
        }
      : undefined,
  );

  const enrollment = created[0];

  if (!enrollment) {
    throw new Error("Failed to create student enrollment.");
  }

  return enrollment;
};

/* =====================================================
   GET CURRENT ENROLLMENT
===================================================== */

export const getCurrentEnrollment = async (
  schoolId: string,
  studentId: string,
) => {
  validateObjectId(schoolId, "schoolId");

  validateObjectId(studentId, "studentId");

  return StudentEnrollment.findOne({
    schoolId,
    studentId,
    enrollmentStatus: "ACTIVE",
  })
    .populate("sessionId", "name startDate endDate isCurrent")
    .populate("classId", "name order")
    .populate("sectionId", "name roomNumber")
    .sort({
      createdAt: -1,
    })
    .lean();
};

/* =====================================================
   GET STUDENT ENROLLMENT HISTORY
===================================================== */

export const getStudentEnrollmentHistory = async (
  schoolId: string,
  studentId: string,
) => {
  validateObjectId(schoolId, "schoolId");

  validateObjectId(studentId, "studentId");

  /* ===============================================
       VERIFY STUDENT BELONGS TO SCHOOL
    =============================================== */

  const student = await Student.findOne({
    _id: studentId,

    schoolId,
  })
    .select("_id name admissionNumber")
    .lean();

  if (!student) {
    throw new Error("Student not found.");
  }

  const enrollments = await StudentEnrollment.find({
    schoolId,
    studentId,
  })
    .populate("sessionId", "name startDate endDate isCurrent")
    .populate("classId", "name order")
    .populate("sectionId", "name roomNumber")
    .sort({
      createdAt: -1,
    })
    .lean();

  return {
    student,
    enrollments,
  };
};

/* =====================================================
   GET PROMOTION CANDIDATES
===================================================== */

export const getPromotionCandidates = async (
  schoolId: string,
  sessionId: string,
  classId: string,
  sectionId?: string,
) => {
  validateObjectId(schoolId, "schoolId");

  validateObjectId(sessionId, "sessionId");

  validateObjectId(classId, "classId");

  if (sectionId) {
    validateObjectId(sectionId, "sectionId");
  }

  const filter: {
    schoolId: string;
    sessionId: string;
    classId: string;
    enrollmentStatus: "ACTIVE";
    sectionId?: string;
  } = {
    schoolId,

    sessionId,

    classId,

    enrollmentStatus: "ACTIVE",
  };

  if (sectionId) {
    filter.sectionId = sectionId;
  }

  return StudentEnrollment.find(filter)
    .populate(
      "studentId",
      ["name", "admissionNumber", "gender", "photo", "status"].join(" "),
    )
    .populate("sessionId", "name")
    .populate("classId", "name order")
    .populate("sectionId", "name roomNumber capacity")
    .sort({
      rollNumber: 1,
      createdAt: 1,
    })
    .lean();
};

/* =====================================================
   GET ENROLLMENT BY ID
===================================================== */

export const getEnrollmentById = async (
  schoolId: string,
  enrollmentId: string,
) => {
  validateObjectId(schoolId, "schoolId");

  validateObjectId(enrollmentId, "enrollmentId");

  const enrollment = await StudentEnrollment.findOne({
    _id: enrollmentId,

    schoolId,
  })
    .populate("studentId", "name admissionNumber")
    .populate("sessionId", "name startDate endDate")
    .populate("classId", "name order")
    .populate("sectionId", "name roomNumber")
    .lean();

  if (!enrollment) {
    throw new Error("Student enrollment not found.");
  }

  return enrollment;
};

/* =====================================================
   UPDATE ENROLLMENT

   Intended for controlled corrections:
   section / class / roll / status etc.

   Promotion itself will NOT use this public
   function. Promotion service will run inside
   a MongoDB transaction.
===================================================== */

export const updateEnrollment = async (
  schoolId: string,
  enrollmentId: string,
  data: IUpdateStudentEnrollmentData,
) => {
  validateObjectId(schoolId, "schoolId");

  validateObjectId(enrollmentId, "enrollmentId");

  validateObjectId(data.updatedBy, "updatedBy");

  const existingEnrollment = await StudentEnrollment.findOne({
    _id: enrollmentId,

    schoolId,
  });

  if (!existingEnrollment) {
    throw new Error("Student enrollment not found.");
  }

  /* ===============================================
       FINAL CLASS
    =============================================== */

  const finalClassId = data.classId ?? existingEnrollment.classId.toString();

  /* ===============================================
       FINAL SECTION
    =============================================== */

  const finalSectionId =
    data.sectionId ?? existingEnrollment.sectionId.toString();

  /* ===============================================
       IF CLASS / SECTION CHANGES,
       VALIDATE MAPPING
    =============================================== */

  if (data.classId || data.sectionId) {
    await validateEnrollmentAcademicMapping(
      schoolId,
      existingEnrollment.sessionId.toString(),
      finalClassId,
      finalSectionId,
    );
  }

  /* ===============================================
       VALIDATE FINAL STREAM AGAINST FINAL CLASS

       Class 11/12 requires a stream. Other classes
       must not store a stream.
    =============================================== */

  const finalClass = await ClassModel.findOne({
    _id: finalClassId,
    schoolId,
    sessionId: existingEnrollment.sessionId,
    isActive: true,
  })
    .select("_id name order")
    .lean();

  if (!finalClass) {
    throw new Error("Selected class not found or inactive.");
  }

  const finalStream =
    data.stream === undefined
      ? existingEnrollment.stream
      : data.stream ?? undefined;

  if (isSeniorSecondaryClass(finalClass)) {
    if (!finalStream) {
      throw new Error("Stream is required for Class 11 and Class 12 students.");
    }
  } else if (finalStream) {
    throw new Error(
      "Stream is only allowed for Class 11 and Class 12 students.",
    );
  }

  /* ===============================================
       UPDATE PAYLOAD
    =============================================== */

  const updateData: {
    classId?: mongoose.Types.ObjectId;

    sectionId?: mongoose.Types.ObjectId;

    rollNumber?: number;

    stream?: StudentStream;

    enrollmentStatus?: "ACTIVE" | "COMPLETED" | "CANCELLED";

    promotionStatus?:
      | "NOT_DECIDED"
      | "PROMOTED"
      | "RETAINED"
      | "TRANSFERRED"
      | "LEFT"
      | "GRADUATED";

    promotionDate?: Date;

    remarks?: string;

    updatedBy: mongoose.Types.ObjectId;
  } = {
    updatedBy: new mongoose.Types.ObjectId(data.updatedBy),
  };

  if (data.classId) {
    validateObjectId(data.classId, "classId");

    updateData.classId = new mongoose.Types.ObjectId(data.classId);
  }

  if (data.sectionId) {
    validateObjectId(data.sectionId, "sectionId");

    updateData.sectionId = new mongoose.Types.ObjectId(data.sectionId);
  }

  if (data.rollNumber !== undefined) {
    if (!Number.isInteger(data.rollNumber) || data.rollNumber <= 0) {
      throw new Error("Roll number must be a positive integer.");
    }

    updateData.rollNumber = data.rollNumber;
  }

  if (data.stream !== undefined && data.stream !== null) {
    updateData.stream = data.stream;
  }

  if (data.enrollmentStatus) {
    updateData.enrollmentStatus = data.enrollmentStatus;
  }

  if (data.promotionStatus) {
    updateData.promotionStatus = data.promotionStatus;
  }

  if (data.promotionDate) {
    updateData.promotionDate = data.promotionDate;
  }

  if (data.remarks !== undefined) {
    updateData.remarks = data.remarks.trim();
  }

  /* ===============================================
       UPDATE
    =============================================== */

  const enrollment = await StudentEnrollment.findOneAndUpdate(
    {
      _id: enrollmentId,

      schoolId,
    },
    data.stream === null
      ? {
          $set: updateData,

          $unset: {
            stream: 1,
          },
        }
      : {
          $set: updateData,
        },
    {
      new: true,
      runValidators: true,
    },
  )
    .populate("studentId", "name admissionNumber")
    .populate("sessionId", "name")
    .populate("classId", "name order")
    .populate("sectionId", "name roomNumber");

  if (!enrollment) {
    throw new Error("Failed to update student enrollment.");
  }

  /* ===============================================
       SYNC ELECTIVES AFTER STREAM CHANGE

       CLASS-scoped electives remain active.
       Matching STREAM-scoped electives remain active.
       Incompatible electives are marked DROPPED.
    =============================================== */

  if (data.stream !== undefined) {
    const activeElectives = await StudentSubjectEnrollment.find({
      schoolId,
      studentEnrollmentId: existingEnrollment._id,
      status: "ACTIVE",
    })
      .select("_id subjectAssignmentId")
      .lean();

    if (activeElectives.length > 0) {
      const assignmentIds = activeElectives.map(
        (item) => item.subjectAssignmentId,
      );

      if (!finalStream) {
        await StudentSubjectEnrollment.updateMany(
          {
            schoolId,
            studentEnrollmentId: existingEnrollment._id,
            status: "ACTIVE",
          },
          {
            $set: {
              status: "DROPPED",
              updatedBy: new mongoose.Types.ObjectId(data.updatedBy),
            },
          },
        );
      } else {
        const compatibleAssignments = await SubjectAssignment.find({
          _id: {
            $in: assignmentIds,
          },
          schoolId,
          isActive: true,
          $or: [
            {
              assignmentType: "CLASS",
            },
            {
              assignmentType: {
                $exists: false,
              },
            },
            {
              assignmentType: "STREAM",
              stream: finalStream,
            },
          ],
        })
          .select("_id")
          .lean();

        const compatibleAssignmentIds = compatibleAssignments.map(
          (item) => item._id,
        );

        await StudentSubjectEnrollment.updateMany(
          {
            schoolId,
            studentEnrollmentId: existingEnrollment._id,
            status: "ACTIVE",
            subjectAssignmentId: {
              $nin: compatibleAssignmentIds,
            },
          },
          {
            $set: {
              status: "DROPPED",
              updatedBy: new mongoose.Types.ObjectId(data.updatedBy),
            },
          },
        );

        await StudentSubjectEnrollment.updateMany(
          {
            schoolId,
            studentEnrollmentId: existingEnrollment._id,
            status: "ACTIVE",
            subjectAssignmentId: {
              $in: compatibleAssignmentIds,
            },
          },
          {
            $set: {
              stream: finalStream,
              updatedBy: new mongoose.Types.ObjectId(data.updatedBy),
            },
          },
        );
      }
    }
  }

  /*
   * IMPORTANT:
   *
   * If active enrollment's class/section/roll
   * is corrected, current Student snapshot must
   * also remain synchronized.
   */

  if (enrollment.enrollmentStatus === "ACTIVE") {
    const studentUpdate: {
      classId?: mongoose.Types.ObjectId;

      sectionId?: mongoose.Types.ObjectId;

      rollNumber?: number;
    } = {};

    if (data.classId) {
      studentUpdate.classId = new mongoose.Types.ObjectId(data.classId);
    }

    if (data.sectionId) {
      studentUpdate.sectionId = new mongoose.Types.ObjectId(data.sectionId);
    }

    if (data.rollNumber !== undefined) {
      studentUpdate.rollNumber = data.rollNumber;
    }

    if (Object.keys(studentUpdate).length > 0) {
      await Student.updateOne(
        {
          _id: existingEnrollment.studentId,

          schoolId,
        },
        {
          $set: studentUpdate,
        },
      );
    }
  }

  return enrollment;
};

/* =====================================================
   GET STUDENTS BY ACADEMIC SESSION

   Used by:
   School Admin -> Students List

   IMPORTANT:
   Student document stores current academic snapshot.

   StudentEnrollment is the source of truth for
   session-wise / historical academic placement.

   Therefore:
   - Current session students
   - Previous session students
   - Class filtering
   - Section filtering

   are fetched through StudentEnrollment.
===================================================== */

export const getStudentsByEnrollment = async (
  schoolId: string,
  sessionId: string,
  classId?: string,
  sectionId?: string,
  search?: string,
) => {
  /* ===============================================
       VALIDATE IDS
    =============================================== */

  validateObjectId(schoolId, "schoolId");

  validateObjectId(sessionId, "sessionId");

  if (classId) {
    validateObjectId(classId, "classId");
  }

  if (sectionId) {
    validateObjectId(sectionId, "sectionId");
  }

  /* ===============================================
       VERIFY SESSION BELONGS TO SCHOOL
    =============================================== */

  const academicSession = await AcademicSession.findOne({
    _id: sessionId,

    schoolId,
  })
    .select("_id name startDate endDate isCurrent")
    .lean();

  if (!academicSession) {
    throw new Error("Academic session not found.");
  }

  /* ===============================================
       VERIFY CLASS

       Only when class filter is supplied.
    =============================================== */

  if (classId) {
    const classData = await ClassModel.findOne({
      _id: classId,

      schoolId,

      sessionId,
    })
      .select("_id")
      .lean();

    if (!classData) {
      throw new Error(
        "Class does not belong to the selected academic session.",
      );
    }
  }

  /* ===============================================
       VERIFY SECTION

       Section filter requires classId because
       section belongs to a class.
    =============================================== */

  if (sectionId) {
    if (!classId) {
      throw new Error("classId is required when sectionId is provided.");
    }

    const section = await Section.findOne({
      _id: sectionId,

      schoolId,

      sessionId,

      classId,
    })
      .select("_id")
      .lean();

    if (!section) {
      throw new Error("Section does not belong to the selected class.");
    }
  }

  /* ===============================================
       BUILD ENROLLMENT FILTER

       IMPORTANT:
       We intentionally do NOT filter only ACTIVE.

       Why?

       Historical sessions normally contain
       COMPLETED enrollments after promotion.

       Example:
       2025-26 -> COMPLETED
       2026-27 -> ACTIVE

       If ACTIVE was forced here, previous-session
       students would disappear from Student List.
    =============================================== */

  const filter: {
    schoolId: string;
    sessionId: string;
    classId?: string;
    sectionId?: string;
  } = {
    schoolId,

    sessionId,
  };

  if (classId) {
    filter.classId = classId;
  }

  if (sectionId) {
    filter.sectionId = sectionId;
  }

  /* ===============================================
       FETCH ENROLLMENTS

       Student personal/master information comes
       from studentId.

       Academic placement comes from enrollment:
       sessionId
       classId
       sectionId
       rollNumber
    =============================================== */

  const enrollments = await StudentEnrollment.find(filter)
    .populate(
      "studentId",
      [
        "_id",
        "name",
        "admissionNumber",
        "admissionDate",
        "admissionType",
        "admissionCategory",
        "dob",
        "gender",
        "bloodGroup",
        "religion",
        "category",
        "caste",
        "aadhaarNumber",
        "apaarId",
        "penNumber",
        "photo",
        "mobile",
        "email",
        "address",
        "currentAddress",
        "permanentAddress",
        "father",
        "mother",
        "parentId",
        "status",
        "userId",
        "createdAt",
        "updatedAt",
      ].join(" "),
    )
    .populate("sessionId", "name startDate endDate isCurrent")
    .populate("classId", "name order isActive")
    .populate("sectionId", "name roomNumber capacity isActive")
    .sort({
      classId: 1,
      sectionId: 1,
      rollNumber: 1,
      createdAt: 1,
    })
    .lean();

  /* ===============================================
       SEARCH

       Search happens against populated Student
       because name/admissionNumber/mobile belong
       to Student, not StudentEnrollment.
    =============================================== */

  const normalizedSearch = search?.trim().toLowerCase();

  const filteredEnrollments = !normalizedSearch
    ? enrollments
    : enrollments.filter((enrollment) => {
        const student = enrollment.studentId;

        /*
         * After populate(), studentId should
         * be a Student object.
         *
         * This guard also safely handles
         * deleted/broken student references.
         */

        if (!student || typeof student !== "object") {
          return false;
        }

        const populatedStudent = student as unknown as {
          name?: string;
          admissionNumber?: string;
          mobile?: string;
          email?: string;
        };

        const name = populatedStudent.name?.toLowerCase() ?? "";

        const admissionNumber =
          populatedStudent.admissionNumber?.toLowerCase() ?? "";

        const mobile = populatedStudent.mobile?.toLowerCase() ?? "";

        const email = populatedStudent.email?.toLowerCase() ?? "";

        return (
          name.includes(normalizedSearch) ||
          admissionNumber.includes(normalizedSearch) ||
          mobile.includes(normalizedSearch) ||
          email.includes(normalizedSearch)
        );
      });

  /* ===============================================
       FORMAT FOR STUDENT LIST

       Existing frontend expects Student-like data.

       Personal data:
       Student document

       Academic data:
       StudentEnrollment

       So enrollment academic values intentionally
       override Student's current snapshot.
    =============================================== */

  const students = filteredEnrollments
    .filter(
      (enrollment) =>
        enrollment.studentId && typeof enrollment.studentId === "object",
    )
    .map((enrollment) => {
      const student = enrollment.studentId as unknown as Record<
        string,
        unknown
      >;

      return {
        ...student,

        /*
         * Student identity
         */

        _id: String(student._id),

        /*
         * Tenant
         */

        schoolId: String(enrollment.schoolId),

        /*
         * IMPORTANT:
         * Academic values come from
         * StudentEnrollment.
         */

        sessionId: enrollment.sessionId,

        classId: enrollment.classId,

        sectionId: enrollment.sectionId,

        rollNumber: enrollment.rollNumber,

        stream: enrollment.stream,

        /*
         * Enrollment metadata
         */

        enrollmentId: String(enrollment._id),

        enrollmentStatus: enrollment.enrollmentStatus,

        promotionStatus: enrollment.promotionStatus,

        promotedFromEnrollmentId: enrollment.promotedFromEnrollmentId
          ? String(enrollment.promotedFromEnrollmentId)
          : undefined,

        promotionDate: enrollment.promotionDate,

        enrollmentRemarks: enrollment.remarks,

        enrollmentCreatedAt: enrollment.createdAt,

        enrollmentUpdatedAt: enrollment.updatedAt,

        enrollment: {
          _id: String(enrollment._id),

          rollNumber: enrollment.rollNumber,

          stream: enrollment.stream,

          enrollmentStatus: enrollment.enrollmentStatus,

          promotionStatus: enrollment.promotionStatus,

          promotedFromEnrollmentId: enrollment.promotedFromEnrollmentId
            ? String(enrollment.promotedFromEnrollmentId)
            : undefined,

          promotionDate: enrollment.promotionDate,

          remarks: enrollment.remarks,

          createdAt: enrollment.createdAt,

          updatedAt: enrollment.updatedAt,
        },
      };
    });

  /* ===============================================
       RESPONSE
    =============================================== */

  return {
    session: academicSession,

    students,

    total: students.length,
  };
};
