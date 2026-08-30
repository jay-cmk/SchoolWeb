import mongoose, {
  Document,
  Schema,
} from "mongoose";

import {
  HomeworkReviewStatus,
  HomeworkSubmissionStatus,
} from "./homeworkSubmission.types";


// ============================================
// ATTACHMENT INTERFACE
// ============================================

export interface ISubmissionAttachment {
  fileName: string;

  fileUrl: string;

  fileType?: string;

  fileSize?: number;
}


// ============================================
// HOMEWORK SUBMISSION INTERFACE
// ============================================

export interface IHomeworkSubmission
  extends Document {

  schoolId:
    mongoose.Types.ObjectId;

  homeworkId:
    mongoose.Types.ObjectId;

  studentId:
    mongoose.Types.ObjectId;


  submissionText?: string;


  attachment?:
    ISubmissionAttachment;


  submissionStatus:
    HomeworkSubmissionStatus;


  reviewStatus:
    HomeworkReviewStatus;


  submittedAt:
    Date;


  remarks?: string;

  marks?: number;


  reviewedBy?:
    mongoose.Types.ObjectId;

  reviewedAt?: Date;


  isActive: boolean;


  createdAt: Date;

  updatedAt: Date;
}


// ============================================
// ATTACHMENT SCHEMA
// ============================================

const submissionAttachmentSchema =
  new Schema<ISubmissionAttachment>(
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
// HOMEWORK SUBMISSION SCHEMA
// ============================================

const homeworkSubmissionSchema =
  new Schema<IHomeworkSubmission>(
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


      homeworkId: {
        type:
          Schema.Types.ObjectId,

        ref:
          "Homework",

        required:
          true,

        index:
          true,
      },


      studentId: {
        type:
          Schema.Types.ObjectId,

        ref:
          "Student",

        required:
          true,

        index:
          true,
      },


      submissionText: {
        type:
          String,

        trim:
          true,

        maxlength:
          5000,
      },


      attachment: {
        type:
          submissionAttachmentSchema,

        required:
          false,
      },


      submissionStatus: {
        type:
          String,

        enum:
          Object.values(
            HomeworkSubmissionStatus
          ),

        required:
          true,

        index:
          true,
      },


      reviewStatus: {
        type:
          String,

        enum:
          Object.values(
            HomeworkReviewStatus
          ),

        default:
          HomeworkReviewStatus.PENDING,

        required:
          true,

        index:
          true,
      },


      submittedAt: {
        type:
          Date,

        required:
          true,

        index:
          true,
      },


      remarks: {
        type:
          String,

        trim:
          true,

        maxlength:
          2000,
      },


      marks: {
        type:
          Number,

        min:
          0,
      },


      reviewedBy: {
        type:
          Schema.Types.ObjectId,

        ref:
          "User",
      },


      reviewedAt: {
        type:
          Date,
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
// UNIQUE SUBMISSION
// ============================================

homeworkSubmissionSchema.index(
  {
    schoolId: 1,

    homeworkId: 1,

    studentId: 1,
  },
  {
    unique: true,
  }
);


// ============================================
// HOMEWORK SUBMISSION LIST
// ============================================

homeworkSubmissionSchema.index({
  schoolId: 1,

  homeworkId: 1,

  submissionStatus: 1,

  reviewStatus: 1,

  submittedAt: -1,
});


// ============================================
// STUDENT SUBMISSION HISTORY
// ============================================

homeworkSubmissionSchema.index({
  schoolId: 1,

  studentId: 1,

  submittedAt: -1,
});


// ============================================
// REVIEW INDEX
// ============================================

homeworkSubmissionSchema.index({
  schoolId: 1,

  homeworkId: 1,

  reviewStatus: 1,

  reviewedAt: -1,
});


// ============================================
// MODEL
// ============================================

export const HomeworkSubmission =
  mongoose.model<IHomeworkSubmission>(
    "HomeworkSubmission",
    homeworkSubmissionSchema
  );