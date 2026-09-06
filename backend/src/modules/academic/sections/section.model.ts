import mongoose, {
  Document,
  Schema,
} from "mongoose";


export interface ISection
  extends Document {
  schoolId:
    mongoose.Types.ObjectId;

  sessionId:
    mongoose.Types.ObjectId;

  classId:
    mongoose.Types.ObjectId;

  name: string;

  roomNumber?: string;

  capacity?: number;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}


const sectionSchema =
  new Schema<ISection>(
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


      name: {
        type: String,

        required: true,

        trim: true,
      },


      roomNumber: {
        type: String,

        trim: true,
      },


      capacity: {
        type: Number,

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
// SAME CLASS ME DUPLICATE SECTION NA HO
// ============================================

sectionSchema.index(
  {
    schoolId: 1,
    sessionId: 1,
    classId: 1,
    name: 1,
  },
  {
    unique: true,
  }
);


export const Section =
  mongoose.model<ISection>(
    "Section",
    sectionSchema
  );