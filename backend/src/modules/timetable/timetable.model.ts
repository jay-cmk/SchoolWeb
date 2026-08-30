import mongoose, {
  Document,
  Schema,
} from "mongoose";

import {
  TimetableDay,
  TimetablePeriodType,
} from "./timetable.types";


// ============================================
// INTERFACE
// ============================================

export interface ITimetable
  extends Document {

  schoolId:
    mongoose.Types.ObjectId;

  sessionId:
    mongoose.Types.ObjectId;

  classId:
    mongoose.Types.ObjectId;

  sectionId:
    mongoose.Types.ObjectId;

  day:
    TimetableDay;

  periodNumber:
    number;

  startTime:
    string;

  endTime:
    string;

  periodType:
    TimetablePeriodType;

  subjectId?:
    mongoose.Types.ObjectId;

  teacherId?:
    mongoose.Types.ObjectId;

  roomNumber?:
    string;

  isActive:
    boolean;

  createdBy:
    mongoose.Types.ObjectId;

  updatedBy?:
    mongoose.Types.ObjectId;

  createdAt:
    Date;

  updatedAt:
    Date;
}


// ============================================
// SCHEMA
// ============================================

const timetableSchema =
  new Schema<ITimetable>(
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


      day: {
        type: String,

        enum:
          Object.values(
            TimetableDay
          ),

        required: true,

        index: true,
      },


      periodNumber: {
        type: Number,

        required: true,

        min: 1,
      },


      startTime: {
        type: String,

        required: true,

        trim: true,
      },


      endTime: {
        type: String,

        required: true,

        trim: true,
      },


      periodType: {
        type: String,

        enum:
          Object.values(
            TimetablePeriodType
          ),

        required: true,

        index: true,
      },


      subjectId: {
        type:
          Schema.Types.ObjectId,

        ref: "Subject",

        index: true,
      },


      teacherId: {
        type:
          Schema.Types.ObjectId,

        ref: "Teacher",

        index: true,
      },


      roomNumber: {
        type: String,

        trim: true,

        maxlength: 100,
      },


      isActive: {
        type: Boolean,

        default: true,

        index: true,
      },


      createdBy: {
        type:
          Schema.Types.ObjectId,

        ref: "User",

        required: true,
      },


      updatedBy: {
        type:
          Schema.Types.ObjectId,

        ref: "User",
      },
    },

    {
      timestamps: true,
    }
  );


// ============================================
// UNIQUE PERIOD NUMBER
//
// Ek class-section me same day same
// period number duplicate nahi ho sakta.
// ============================================

timetableSchema.index(
  {
    schoolId: 1,

    sessionId: 1,

    classId: 1,

    sectionId: 1,

    day: 1,

    periodNumber: 1,
  },
  {
    unique: true,
  }
);


// ============================================
// CLASS TIMETABLE LOOKUP
// ============================================

timetableSchema.index({
  schoolId: 1,

  sessionId: 1,

  classId: 1,

  sectionId: 1,

  day: 1,

  isActive: 1,
});


// ============================================
// TEACHER TIMETABLE LOOKUP
// ============================================

timetableSchema.index({
  schoolId: 1,

  sessionId: 1,

  teacherId: 1,

  day: 1,

  isActive: 1,
});


// ============================================
// SUBJECT LOOKUP
// ============================================

timetableSchema.index({
  schoolId: 1,

  sessionId: 1,

  subjectId: 1,

  classId: 1,

  sectionId: 1,
});


// ============================================
// ROOM LOOKUP
// ============================================

timetableSchema.index({
  schoolId: 1,

  sessionId: 1,

  roomNumber: 1,

  day: 1,

  isActive: 1,
});


// ============================================
// MODEL
// ============================================

export const Timetable =
  mongoose.model<ITimetable>(
    "Timetable",
    timetableSchema
  );