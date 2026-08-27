import mongoose, {
  Document,
  Schema,
} from "mongoose";

export type SubjectType =
  | "CORE"
  | "LANGUAGE"
  | "PRACTICAL"
  | "ELECTIVE";

export interface ISubject
  extends Document {
  schoolId:
    mongoose.Types.ObjectId;

  sessionId:
    mongoose.Types.ObjectId;

  name: string;

  code: string;

  description?: string;

  subjectType: SubjectType;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const subjectSchema =
  new Schema<ISubject>(
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

      name: {
        type: String,

        required: true,

        trim: true,
      },

      code: {
        type: String,

        required: true,

        trim: true,

        uppercase: true,
      },

      description: {
        type: String,

        trim: true,
      },

      subjectType: {
        type: String,

        enum: [
          "CORE",
          "LANGUAGE",
          "PRACTICAL",
          "ELECTIVE",
        ],

        required: true,
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


// Same school + same session me
// duplicate subject code nahi hona chahiye
subjectSchema.index(
  {
    schoolId: 1,
    sessionId: 1,
    code: 1,
  },
  {
    unique: true,
  }
);


// Same school + same session me
// duplicate subject name bhi prevent
subjectSchema.index(
  {
    schoolId: 1,
    sessionId: 1,
    name: 1,
  },
  {
    unique: true,
  }
);


export const Subject =
  mongoose.model<ISubject>(
    "Subject",
    subjectSchema
  );