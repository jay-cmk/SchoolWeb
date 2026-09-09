import mongoose, {
  Schema,
} from "mongoose";

import type {
  IStudentSubjectEnrollment,
} from "./studentSubjectEnrollment.types";


/* =====================================================
   CONSTANTS
===================================================== */

const STUDENT_STREAMS = [
  "SCIENCE",
  "COMMERCE",
  "ARTS",
  "VOCATIONAL",
] as const;


const STUDENT_SUBJECT_STATUSES = [
  "ACTIVE",
  "DROPPED",
  "COMPLETED",
] as const;


/* =====================================================
   STUDENT SUBJECT ENROLLMENT SCHEMA

   केवल Class 11–12 के student-wise
   elective subjects के लिए।
===================================================== */

const studentSubjectEnrollmentSchema =
  new Schema<IStudentSubjectEnrollment>(
    {
      /* ===============================================
         SCHOOL / TENANT
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
         ACADEMIC ENROLLMENT

         Student के session-specific enrollment से link।
      =============================================== */

      studentEnrollmentId: {
        type:
          Schema.Types.ObjectId,

        ref:
          "StudentEnrollment",

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
         STREAM
      =============================================== */

      stream: {
        type:
          String,

        enum:
          STUDENT_STREAMS,

        required: true,

        uppercase: true,

        trim: true,

        index: true,
      },


      /* ===============================================
         ELECTIVE SUBJECT
      =============================================== */

      subjectId: {
        type:
          Schema.Types.ObjectId,

        ref:
          "Subject",

        required: true,

        index: true,
      },


      /* ===============================================
         SUBJECT ASSIGNMENT

         इससे teacher और weekly periods मिलेंगे।
      =============================================== */

      subjectAssignmentId: {
        type:
          Schema.Types.ObjectId,

        ref:
          "SubjectAssignment",

        required: true,

        index: true,
      },


      /* ===============================================
         STATUS
      =============================================== */

      status: {
        type:
          String,

        enum:
          STUDENT_SUBJECT_STATUSES,

        default:
          "ACTIVE",

        required: true,

        index: true,
      },


      /* ===============================================
         REMARKS
      =============================================== */

      remarks: {
        type:
          String,

        trim: true,

        maxlength: 500,

        default:
          undefined,
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
   UNIQUE STUDENT ENROLLMENT + SUBJECT

   एक academic enrollment में एक subject का
   केवल एक record रहेगा।

   Subject drop होने के बाद नया duplicate record
   नहीं बनेगा। Existing record को ACTIVE किया जाएगा।
===================================================== */

studentSubjectEnrollmentSchema.index(
  {
    schoolId: 1,
    studentEnrollmentId: 1,
    subjectId: 1,
  },
  {
    unique: true,
  }
);


/* =====================================================
   STUDENT SUBJECT LOOKUP

   Student mobile application में selected session
   के elective subjects निकालने के लिए।
===================================================== */

studentSubjectEnrollmentSchema.index(
  {
    schoolId: 1,
    studentId: 1,
    sessionId: 1,
    status: 1,
  }
);


/* =====================================================
   CLASS / SECTION ELECTIVE LOOKUP

   School Admin को class और section के elective
   enrollments दिखाने के लिए।
===================================================== */

studentSubjectEnrollmentSchema.index(
  {
    schoolId: 1,
    sessionId: 1,
    classId: 1,
    sectionId: 1,
    stream: 1,
    status: 1,
  }
);


/* =====================================================
   SUBJECT-WISE STUDENT LOOKUP

   किसी elective subject को लेने वाले students
   निकालने के लिए।
===================================================== */

studentSubjectEnrollmentSchema.index(
  {
    schoolId: 1,
    sessionId: 1,
    subjectId: 1,
    status: 1,
  }
);


/* =====================================================
   SUBJECT ASSIGNMENT LOOKUP
===================================================== */

studentSubjectEnrollmentSchema.index(
  {
    schoolId: 1,
    subjectAssignmentId: 1,
    status: 1,
  }
);


/* =====================================================
   MODEL
===================================================== */

export const StudentSubjectEnrollment =
  mongoose.model<IStudentSubjectEnrollment>(
    "StudentSubjectEnrollment",
    studentSubjectEnrollmentSchema
  );