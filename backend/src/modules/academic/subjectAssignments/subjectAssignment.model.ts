// import mongoose, {
//   Document,
//   Schema,
// } from "mongoose";

// export interface ISubjectAssignment
//   extends Document {
//   schoolId:
//     mongoose.Types.ObjectId;

//   sessionId:
//     mongoose.Types.ObjectId;

//   subjectId:
//     mongoose.Types.ObjectId;

//   classId:
//     mongoose.Types.ObjectId;

//   sectionId:
//     mongoose.Types.ObjectId;

//   teacherId:
//     mongoose.Types.ObjectId;

//   weeklyPeriods: number;

//   isActive: boolean;

//   createdAt: Date;
//   updatedAt: Date;
// }

// const subjectAssignmentSchema =
//   new Schema<ISubjectAssignment>(
//     {
//       schoolId: {
//         type:
//           Schema.Types.ObjectId,

//         ref: "School",

//         required: true,

//         index: true,
//       },

//       sessionId: {
//         type:
//           Schema.Types.ObjectId,

//         ref:
//           "AcademicSession",

//         required: true,

//         index: true,
//       },

//       subjectId: {
//         type:
//           Schema.Types.ObjectId,

//         ref:
//           "Subject",

//         required: true,

//         index: true,
//       },

//       classId: {
//         type:
//           Schema.Types.ObjectId,

//         ref: "Class",

//         required: true,

//         index: true,
//       },

//       sectionId: {
//         type:
//           Schema.Types.ObjectId,

//         ref: "Section",

//         required: true,

//         index: true,
//       },

//       teacherId: {
//         type:
//           Schema.Types.ObjectId,

//         ref: "Teacher",

//         required: true,

//         index: true,
//       },

//       weeklyPeriods: {
//         type: Number,

//         required: true,

//         min: 1,
//       },

//       isActive: {
//         type: Boolean,

//         default: true,

//         index: true,
//       },
//     },

//     {
//       timestamps: true,
//     }
//   );


// // ============================================
// // DUPLICATE ASSIGNMENT PREVENT
// // ============================================

// subjectAssignmentSchema.index(
//   {
//     schoolId: 1,
//     sessionId: 1,
//     subjectId: 1,
//     classId: 1,
//     sectionId: 1,
//   },
//   {
//     unique: true,
//   }
// );


// export const SubjectAssignment =
//   mongoose.model<ISubjectAssignment>(
//     "SubjectAssignment",
//     subjectAssignmentSchema
//   );



import mongoose, {
  Document,
  Schema,
} from "mongoose";

export type SubjectAssignmentType =
  | "CLASS"
  | "STREAM";

export type SubjectAssignmentStream =
  | "SCIENCE"
  | "COMMERCE"
  | "ARTS"
  | "VOCATIONAL";

export interface ISubjectAssignment
  extends Document {
  schoolId: mongoose.Types.ObjectId;
  sessionId: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  sectionId: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;
  assignmentType: SubjectAssignmentType;
  stream?: SubjectAssignmentStream;
  weeklyPeriods: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ASSIGNMENT_TYPES = [
  "CLASS",
  "STREAM",
] as const;

const STUDENT_STREAMS = [
  "SCIENCE",
  "COMMERCE",
  "ARTS",
  "VOCATIONAL",
] as const;

const subjectAssignmentSchema =
  new Schema<ISubjectAssignment>(
    {
      schoolId: {
        type: Schema.Types.ObjectId,
        ref: "School",
        required: true,
        index: true,
      },

      sessionId: {
        type: Schema.Types.ObjectId,
        ref: "AcademicSession",
        required: true,
        index: true,
      },

      subjectId: {
        type: Schema.Types.ObjectId,
        ref: "Subject",
        required: true,
        index: true,
      },

      classId: {
        type: Schema.Types.ObjectId,
        ref: "Class",
        required: true,
        index: true,
      },

      sectionId: {
        type: Schema.Types.ObjectId,
        ref: "Section",
        required: true,
        index: true,
      },

      teacherId: {
        type: Schema.Types.ObjectId,
        ref: "Teacher",
        required: true,
        index: true,
      },

      assignmentType: {
        type: String,
        enum: ASSIGNMENT_TYPES,
        default: "CLASS",
        required: true,
        index: true,
      },

      stream: {
        type: String,
        enum: STUDENT_STREAMS,
        trim: true,
        uppercase: true,
        default: undefined,
        index: true,
      },

      weeklyPeriods: {
        type: Number,
        required: true,
        min: 1,
      },

      isActive: {
        type: Boolean,
        default: true,
        index: true,
      },
    },
    {
      timestamps: true,
    },
  );

/*
 * CLASS assignment:
 * stream must not be stored.
 *
 * STREAM assignment:
 * stream is required.
 */
subjectAssignmentSchema.pre("validate", function () {
  if (this.assignmentType === "STREAM" && !this.stream) {
    throw new Error(
      "Stream is required for stream subject assignment",
    );
  }

  if (this.assignmentType === "CLASS") {
    this.set("stream", undefined);
  }
});

/*
 * One subject may have:
 * - one CLASS assignment per class/section, or
 * - separate STREAM assignments for each stream.
 */
subjectAssignmentSchema.index(
  {
    schoolId: 1,
    sessionId: 1,
    subjectId: 1,
    classId: 1,
    sectionId: 1,
    assignmentType: 1,
    stream: 1,
  },
  {
    unique: true,
  },
);

subjectAssignmentSchema.index({
  schoolId: 1,
  sessionId: 1,
  classId: 1,
  sectionId: 1,
  assignmentType: 1,
  stream: 1,
  isActive: 1,
});

export const SubjectAssignment =
  mongoose.model<ISubjectAssignment>(
    "SubjectAssignment",
    subjectAssignmentSchema,
  );
