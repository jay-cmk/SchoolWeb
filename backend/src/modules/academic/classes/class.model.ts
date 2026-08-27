






// import mongoose, {
//   Document,
//   Schema,
// } from "mongoose";

// export interface IClass
//   extends Document {
//   schoolId:
//     mongoose.Types.ObjectId;

//   sessionId:
//     mongoose.Types.ObjectId;

//   name: string;

//   order?: number;

//   isActive: boolean;

//   createdAt: Date;
//   updatedAt: Date;
// }


// const classSchema =
//   new Schema<IClass>(
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


//       name: {
//         type: String,

//         required: true,

//         trim: true,
//       },


//       order: {
//         type: Number,
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
// // UNIQUE CLASS PER SCHOOL + SESSION
// // ============================================

// classSchema.index(
//   {
//     schoolId: 1,

//     sessionId: 1,

//     name: 1,
//   },

//   {
//     unique: true,
//   }
// );


// export const ClassModel =
//   mongoose.model<IClass>(
//     "Class",
//     classSchema
//   );


import mongoose, {
  Document,
  Schema,
} from "mongoose";

export interface IClass
  extends Document {
  schoolId:
    mongoose.Types.ObjectId;

  sessionId:
    mongoose.Types.ObjectId;

  name: string;

  order?: number;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}


const classSchema =
  new Schema<IClass>(
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


      order: {
        type: Number,
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
// UNIQUE CLASS PER SCHOOL + SESSION
// ============================================

classSchema.index(
  {
    schoolId: 1,

    sessionId: 1,

    name: 1,
  },

  {
    unique: true,
  }
);


export const ClassModel =
  mongoose.model<IClass>(
    "Class",
    classSchema
  );