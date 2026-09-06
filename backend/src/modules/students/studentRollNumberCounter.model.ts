import mongoose, {
  Document,
  Schema,
  Types,
  type Model,
} from "mongoose";


/* =====================================================
   STUDENT ROLL NUMBER COUNTER DOCUMENT

   Har school, academic session aur class ka
   ek continuous roll-number sequence hoga.

   Section counter ka part nahi hai.

   Example:
   Class 8 - Section A = 1 to 40
   Class 8 - Section B = 41 to 80
   Class 8 - Section C = 81 to 120
===================================================== */

export interface IStudentRollNumberCounter
  extends Document {

  schoolId: Types.ObjectId;

  sessionId: Types.ObjectId;

  classId: Types.ObjectId;

  sequence: number;

  createdAt: Date;

  updatedAt: Date;
}


/* =====================================================
   SCHEMA
===================================================== */

const studentRollNumberCounterSchema =
  new Schema<IStudentRollNumberCounter>(
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
   UNIQUE CLASS COUNTER

   Ek school ke ek academic session ki ek class
   ke liye sirf ek counter document hoga.
===================================================== */

studentRollNumberCounterSchema.index(
  {
    schoolId:
      1,

    sessionId:
      1,

    classId:
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

const StudentRollNumberCounter:
  Model<IStudentRollNumberCounter> =
    mongoose.models
      .StudentRollNumberCounter
      ? (
          mongoose.models
            .StudentRollNumberCounter as
              Model<IStudentRollNumberCounter>
        )
      : mongoose.model<IStudentRollNumberCounter>(
          "StudentRollNumberCounter",
          studentRollNumberCounterSchema
        );


export {
  StudentRollNumberCounter,
};

export default
  StudentRollNumberCounter;
