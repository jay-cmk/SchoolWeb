import mongoose, {
  Document,
  Schema,
} from "mongoose";

export interface IAcademicSession
  extends Document {
  schoolId: mongoose.Types.ObjectId;

  name: string;

  startDate: Date;
  endDate: Date;

  isCurrent: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const academicSessionSchema =
  new Schema<IAcademicSession>(
    {
      schoolId: {
        type: Schema.Types.ObjectId,
        ref: "School",
        required: true,
        index: true,
      },

      name: {
        type: String,
        required: true,
        trim: true,
      },

      startDate: {
        type: Date,
        required: true,
      },

      endDate: {
        type: Date,
        required: true,
      },

      isCurrent: {
        type: Boolean,
        default: false,
        index: true,
      },
    },
    {
      timestamps: true,
    }
  );

academicSessionSchema.index(
  {
    schoolId: 1,
    name: 1,
  },
  {
    unique: true,
  }
);

export const AcademicSession =
  mongoose.model<IAcademicSession>(
    "AcademicSession",
    academicSessionSchema
  );