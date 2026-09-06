import mongoose, {
  Document,
  Schema,
} from "mongoose";

import {
  HomeworkStatus,
} from "./homework.types";


// ============================================
// ATTACHMENT INTERFACE
// ============================================

export interface IHomeworkAttachment {
  fileName: string;

  fileUrl: string;

  fileType?: string;

  fileSize?: number;
}


// ============================================
// HOMEWORK INTERFACE
// ============================================

export interface IHomework
  extends Document {

  schoolId:
    mongoose.Types.ObjectId;

  sessionId:
    mongoose.Types.ObjectId;

  classId:
    mongoose.Types.ObjectId;

  sectionId:
    mongoose.Types.ObjectId;

  subjectId:
    mongoose.Types.ObjectId;

  teacherId:
    mongoose.Types.ObjectId;


  title: string;

  description: string;


  assignedDate: Date;

  dueDate: Date;


  attachment?: IHomeworkAttachment;


  status: HomeworkStatus;


  createdBy:
    mongoose.Types.ObjectId;

  updatedBy?:
    mongoose.Types.ObjectId;


  isActive: boolean;


  createdAt: Date;

  updatedAt: Date;
}


// ============================================
// ATTACHMENT SCHEMA
// ============================================

const homeworkAttachmentSchema =
  new Schema<IHomeworkAttachment>(
    {
      fileName: {
        type: String,
        required: true,
        trim: true,
      },

      fileUrl: {
        type: String,
        required: true,
        trim: true,
      },

      fileType: {
        type: String,
        trim: true,
      },

      fileSize: {
        type: Number,
        min: 0,
      },
    },
    {
      _id: false,
    }
  );


// ============================================
// HOMEWORK SCHEMA
// ============================================

const homeworkSchema =
  new Schema<IHomework>(
    {
      schoolId: {
        type:
          Schema.Types.ObjectId,

        ref:
          "School",

        required:
          true,

        index:
          true,
      },


      sessionId: {
        type:
          Schema.Types.ObjectId,

        ref:
          "AcademicSession",

        required:
          true,

        index:
          true,
      },


      classId: {
        type:
          Schema.Types.ObjectId,

        ref:
          "Class",

        required:
          true,

        index:
          true,
      },


      sectionId: {
        type:
          Schema.Types.ObjectId,

        ref:
          "Section",

        required:
          true,

        index:
          true,
      },


      subjectId: {
        type:
          Schema.Types.ObjectId,

        ref:
          "Subject",

        required:
          true,

        index:
          true,
      },


      teacherId: {
        type:
          Schema.Types.ObjectId,

        ref:
          "Teacher",

        required:
          true,

        index:
          true,
      },


      title: {
        type:
          String,

        required:
          true,

        trim:
          true,

        maxlength:
          200,
      },


      description: {
        type:
          String,

        required:
          true,

        trim:
          true,

        maxlength:
          5000,
      },


      assignedDate: {
        type:
          Date,

        required:
          true,

        index:
          true,
      },


      dueDate: {
        type:
          Date,

        required:
          true,

        index:
          true,
      },


      attachment: {
        type:
          homeworkAttachmentSchema,

        required:
          false,
      },


      status: {
        type:
          String,

        enum:
          Object.values(
            HomeworkStatus
          ),

        default:
          HomeworkStatus.DRAFT,

        required:
          true,

        index:
          true,
      },


      createdBy: {
        type:
          Schema.Types.ObjectId,

        ref:
          "User",

        required:
          true,
      },


      updatedBy: {
        type:
          Schema.Types.ObjectId,

        ref:
          "User",
      },


      isActive: {
        type:
          Boolean,

        default:
          true,

        index:
          true,
      },
    },
    {
      timestamps:
        true,
    }
  );


// ============================================
// VALIDATION
// ============================================
//
// IMPORTANT:
// Mongoose ke current middleware style me
// yahan next() use nahi kar rahe.
// Validation fail hone par directly error throw hoga.
//
// ============================================

homeworkSchema.pre(
  "validate",
  function () {

    if (
      this.assignedDate &&
      this.dueDate &&
      this.dueDate <
        this.assignedDate
    ) {

      throw new Error(
        "Due date must be on or after the assigned date"
      );

    }

  }
);


// ============================================
// INDEXES
// ============================================


// ============================================
// MAIN HOMEWORK LIST FILTERS
// ============================================

homeworkSchema.index({
  schoolId: 1,
  sessionId: 1,
  classId: 1,
  sectionId: 1,
  isActive: 1,
});


// ============================================
// SUBJECT FILTER
// ============================================

homeworkSchema.index({
  schoolId: 1,
  sessionId: 1,
  subjectId: 1,
});


// ============================================
// TEACHER FILTER
// ============================================

homeworkSchema.index({
  schoolId: 1,
  teacherId: 1,
  assignedDate: -1,
});


// ============================================
// STATUS / DASHBOARD STATS
// ============================================

homeworkSchema.index({
  schoolId: 1,
  status: 1,
  dueDate: 1,
});


// ============================================
// CALENDAR VIEW
// ============================================

homeworkSchema.index({
  schoolId: 1,
  sessionId: 1,
  dueDate: 1,
});


// ============================================
// MODEL
// ============================================

export const Homework =
  mongoose.model<IHomework>(
    "Homework",
    homeworkSchema
  );