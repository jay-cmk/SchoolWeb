import mongoose, {
  Document,
  Schema,
  Types,
  type Model,
} from "mongoose";


/* =====================================================
   STUDENT ADMISSION COUNTER DOCUMENT

   Har school aur academic session ka alag
   admission sequence maintain hoga.
===================================================== */

export interface IStudentAdmissionCounter
  extends Document {

  schoolId: Types.ObjectId;

  sessionId: Types.ObjectId;

  sequence: number;

  createdAt: Date;

  updatedAt: Date;
}


/* =====================================================
   SCHEMA
===================================================== */

const studentAdmissionCounterSchema =
  new Schema<IStudentAdmissionCounter>(
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


      sequence: {
        type:
          Number,

        required:
          true,

        default:
          0,

        min:
          0,
      },
    },

    {
      timestamps:
        true,
    }
  );


/* =====================================================
   UNIQUE SCHOOL + SESSION COUNTER

   Ek school ke ek academic session ke liye
   sirf ek counter document hoga.
===================================================== */

studentAdmissionCounterSchema.index(
  {
    schoolId:
      1,

    sessionId:
      1,
  },

  {
    unique:
      true,
  }
);


/* =====================================================
   MODEL
===================================================== */

const StudentAdmissionCounter:
  Model<IStudentAdmissionCounter> =
    mongoose.models
      .StudentAdmissionCounter
      ? (
          mongoose.models
            .StudentAdmissionCounter as
              Model<IStudentAdmissionCounter>
        )
      : mongoose.model<IStudentAdmissionCounter>(
          "StudentAdmissionCounter",
          studentAdmissionCounterSchema
        );


export {
  StudentAdmissionCounter,
};

export default
  StudentAdmissionCounter;
