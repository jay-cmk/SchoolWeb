import mongoose, {
  Document,
  Schema,
} from "mongoose";

import {
  AttendanceStatus,
} from "./attendance.types";


// ============================================
// ATTENDANCE INTERFACE
// ============================================

export interface IAttendance
  extends Document {

  schoolId:
    mongoose.Types.ObjectId;

  sessionId:
    mongoose.Types.ObjectId;

  classId:
    mongoose.Types.ObjectId;

  sectionId:
    mongoose.Types.ObjectId;

  studentId:
    mongoose.Types.ObjectId;

  date: Date;

  status:
    AttendanceStatus;

  remarks?: string;

  markedBy:
    mongoose.Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}


// ============================================
// ATTENDANCE SCHEMA
// ============================================

const attendanceSchema =
  new Schema<IAttendance>(
    {
      schoolId: {
        type:
          Schema.Types.ObjectId,

        ref: "School",

        required: true,

        index: true,
      },


      sessionId: {
        type:
          Schema.Types.ObjectId,

        ref:
          "AcademicSession",

        required: true,

        index: true,
      },


      classId: {
        type:
          Schema.Types.ObjectId,

        ref: "Class",

        required: true,

        index: true,
      },


      sectionId: {
        type:
          Schema.Types.ObjectId,

        ref: "Section",

        required: true,

        index: true,
      },


      studentId: {
        type:
          Schema.Types.ObjectId,

        ref: "Student",

        required: true,

        index: true,
      },


      date: {
        type: Date,

        required: true,

        index: true,
      },


      status: {
        type: String,

        enum:
          Object.values(
            AttendanceStatus
          ),

        required: true,
      },


      remarks: {
        type: String,

        trim: true,
      },


      markedBy: {
        type:
          Schema.Types.ObjectId,

        ref: "User",

        required: true,
      },
    },

    {
      timestamps: true,
    }
  );


// ============================================
// PREVENT DUPLICATE ATTENDANCE
//
// Same student cannot have two attendance
// records for the same date in same school.
// ============================================

attendanceSchema.index(
  {
    schoolId: 1,

    studentId: 1,

    date: 1,
  },

  {
    unique: true,
  }
);


// ============================================
// CLASS / SECTION / DATE QUERY INDEX
// ============================================

attendanceSchema.index({
  schoolId: 1,

  sessionId: 1,

  classId: 1,

  sectionId: 1,

  date: 1,
});


// ============================================
// STUDENT HISTORY INDEX
// ============================================

attendanceSchema.index({
  schoolId: 1,

  studentId: 1,

  sessionId: 1,

  date: -1,
});


// ============================================
// MODEL
// ============================================

export const Attendance =
  mongoose.model<IAttendance>(
    "Attendance",
    attendanceSchema
  );