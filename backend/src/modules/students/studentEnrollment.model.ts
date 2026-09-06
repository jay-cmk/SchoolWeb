import mongoose, {
  Schema,
} from "mongoose";

import type {
  IStudentEnrollment,
} from "./studentEnrollment.types";


/* =====================================================
   CONSTANTS
===================================================== */

const ENROLLMENT_STATUSES = [
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
] as const;


const PROMOTION_STATUSES = [
  "NOT_DECIDED",
  "PROMOTED",
  "RETAINED",
  "TRANSFERRED",
  "LEFT",
  "GRADUATED",
] as const;


/* =====================================================
   SCHEMA
===================================================== */

const studentEnrollmentSchema =
  new Schema<IStudentEnrollment>(
    {

      /* ===============================================
         TENANT
      =============================================== */

      schoolId: {

        type:
          Schema.Types.ObjectId,

        ref:
          "School",

        required: true,

        index: true,
      },


      /* ===============================================
         STUDENT
      =============================================== */

      studentId: {

        type:
          Schema.Types.ObjectId,

        ref:
          "Student",

        required: true,

        index: true,
      },


      /* ===============================================
         ACADEMIC SESSION
      =============================================== */

      sessionId: {

        type:
          Schema.Types.ObjectId,

        ref:
          "AcademicSession",

        required: true,

        index: true,
      },


      /* ===============================================
         CLASS
      =============================================== */

      classId: {

        type:
          Schema.Types.ObjectId,

        ref:
          "Class",

        required: true,

        index: true,
      },


      /* ===============================================
         SECTION
      =============================================== */

      sectionId: {

        type:
          Schema.Types.ObjectId,

        ref:
          "Section",

        required: true,

        index: true,
      },


      /* ===============================================
         ROLL NUMBER
      =============================================== */

      rollNumber: {

        type: Number,

        min: 1,
      },


      /* ===============================================
         ENROLLMENT STATUS
      =============================================== */

      enrollmentStatus: {

        type: String,

        enum:
          ENROLLMENT_STATUSES,

        default:
          "ACTIVE",

        required: true,

        index: true,
      },


      /* ===============================================
         PROMOTION STATUS
      =============================================== */

      promotionStatus: {

        type: String,

        enum:
          PROMOTION_STATUSES,

        default:
          "NOT_DECIDED",

        required: true,

        index: true,
      },


      /* ===============================================
         PROMOTION SOURCE
      =============================================== */

      promotedFromEnrollmentId: {

        type:
          Schema.Types.ObjectId,

        ref:
          "StudentEnrollment",

        default:
          undefined,
      },


      /* ===============================================
         PROMOTION DATE
      =============================================== */

      promotionDate: {

        type: Date,

        default:
          undefined,
      },


      /* ===============================================
         REMARKS
      =============================================== */

      remarks: {

        type: String,

        trim: true,

        maxlength: 1000,
      },


      /* ===============================================
         CREATED BY
      =============================================== */

      createdBy: {

        type:
          Schema.Types.ObjectId,

        ref:
          "User",

        required: true,
      },


      /* ===============================================
         UPDATED BY
      =============================================== */

      updatedBy: {

        type:
          Schema.Types.ObjectId,

        ref:
          "User",

        default:
          undefined,
      },
    },

    {
      timestamps: true,
    }
  );


/* =====================================================
   UNIQUE STUDENT + SESSION

   Ek student ka ek academic session me
   sirf ek enrollment record hoga.
===================================================== */

studentEnrollmentSchema.index(
  {
    schoolId: 1,
    studentId: 1,
    sessionId: 1,
  },
  {
    unique: true,
  }
);


/* =====================================================
   CLASS / SECTION LOOKUP INDEX
===================================================== */

studentEnrollmentSchema.index(
  {
    schoolId: 1,
    sessionId: 1,
    classId: 1,
    sectionId: 1,
    enrollmentStatus: 1,
  }
);


/* =====================================================
   STUDENT HISTORY INDEX
===================================================== */

studentEnrollmentSchema.index(
  {
    schoolId: 1,
    studentId: 1,
    createdAt: -1,
  }
);


/* =====================================================
   PROMOTION CANDIDATE INDEX
===================================================== */

studentEnrollmentSchema.index(
  {
    schoolId: 1,
    sessionId: 1,
    enrollmentStatus: 1,
    promotionStatus: 1,
  }
);


/* =====================================================
   MODEL
===================================================== */

export const StudentEnrollment =
  mongoose.model<IStudentEnrollment>(
    "StudentEnrollment",
    studentEnrollmentSchema
  );