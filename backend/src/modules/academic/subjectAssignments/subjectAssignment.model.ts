import mongoose, {
  Document,
  Schema,
} from "mongoose";

export interface ISubjectAssignment
  extends Document {
  schoolId:
    mongoose.Types.ObjectId;

  sessionId:
    mongoose.Types.ObjectId;

  subjectId:
    mongoose.Types.ObjectId;

  classId:
    mongoose.Types.ObjectId;

  sectionId:
    mongoose.Types.ObjectId;

  teacherId:
    mongoose.Types.ObjectId;

  weeklyPeriods: number;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const subjectAssignmentSchema =
  new Schema<ISubjectAssignment>(
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

      subjectId: {
        type:
          Schema.Types.ObjectId,

        ref:
          "Subject",

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

      teacherId: {
        type:
          Schema.Types.ObjectId,

        ref: "Teacher",

        required: true,

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
    }
  );


// ============================================
// DUPLICATE ASSIGNMENT PREVENT
// ============================================

subjectAssignmentSchema.index(
  {
    schoolId: 1,
    sessionId: 1,
    subjectId: 1,
    classId: 1,
    sectionId: 1,
  },
  {
    unique: true,
  }
);


export const SubjectAssignment =
  mongoose.model<ISubjectAssignment>(
    "SubjectAssignment",
    subjectAssignmentSchema
  );