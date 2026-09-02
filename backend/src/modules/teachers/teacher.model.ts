// import mongoose, {
//   Document,
//   Schema,
// } from "mongoose";

// export type TeacherGender =
//   | "MALE"
//   | "FEMALE"
//   | "OTHER";

// export interface ITeacher
//   extends Document {
//   schoolId:
//     mongoose.Types.ObjectId;

//   employeeId: string;

//   name: string;

//   email: string;

//   mobile?: string;

//   gender?: TeacherGender;

//   qualification?: string;

//   joiningDate?: Date;

//   profileImage?: string;

//   isActive: boolean;

//   createdAt: Date;
//   updatedAt: Date;
// }

// const teacherSchema =
//   new Schema<ITeacher>(
//     {
//       schoolId: {
//         type:
//           Schema.Types.ObjectId,

//         ref: "School",

//         required: true,

//         index: true,
//       },

//       employeeId: {
//         type: String,

//         required: true,

//         trim: true,

//         uppercase: true,
//       },

//       name: {
//         type: String,

//         required: true,

//         trim: true,
//       },

//       email: {
//         type: String,

//         required: true,

//         trim: true,

//         lowercase: true,
//       },

//       mobile: {
//         type: String,

//         trim: true,
//       },

//       gender: {
//         type: String,

//         enum: [
//           "MALE",
//           "FEMALE",
//           "OTHER",
//         ],
//       },

//       qualification: {
//         type: String,

//         trim: true,
//       },

//       joiningDate: {
//         type: Date,
//       },

//       profileImage: {
//         type: String,

//         trim: true,
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
// // UNIQUE EMPLOYEE ID PER SCHOOL
// // ============================================

// teacherSchema.index(
//   {
//     schoolId: 1,
//     employeeId: 1,
//   },
//   {
//     unique: true,
//   }
// );


// // ============================================
// // UNIQUE EMAIL PER SCHOOL
// // ============================================

// teacherSchema.index(
//   {
//     schoolId: 1,
//     email: 1,
//   },
//   {
//     unique: true,
//   }
// );


// export const Teacher =
//   mongoose.model<ITeacher>(
//     "Teacher",
//     teacherSchema
//   );










import mongoose, {
  Document,
  Schema,
} from "mongoose";


export type TeacherGender =
  | "MALE"
  | "FEMALE"
  | "OTHER";


export interface ITeacher
  extends Document {

  schoolId:
    mongoose.Types.ObjectId;

  userId?:
    mongoose.Types.ObjectId;

  employeeId: string;

  name: string;

  email: string;

  mobile?: string;

  gender?: TeacherGender;

  qualification?: string;

  joiningDate?: Date;

  profileImage?: string;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;
}


const teacherSchema =
  new Schema<ITeacher>(
    {
      // ============================================
      // SCHOOL
      // ============================================

      schoolId: {
        type:
          Schema.Types.ObjectId,

        ref: "School",

        required: true,

        index: true,
      },


      // ============================================
      // USER ACCOUNT RELATION
      // ============================================

      userId: {
        type:
          Schema.Types.ObjectId,

        ref: "User",

        default: undefined,
      },


      // ============================================
      // EMPLOYEE ID
      // ============================================

      employeeId: {
        type: String,

        required: true,

        trim: true,

        uppercase: true,
      },


      // ============================================
      // NAME
      // ============================================

      name: {
        type: String,

        required: true,

        trim: true,
      },


      // ============================================
      // EMAIL
      // ============================================

      email: {
        type: String,

        required: true,

        trim: true,

        lowercase: true,
      },


      // ============================================
      // MOBILE
      // ============================================

      mobile: {
        type: String,

        trim: true,
      },


      // ============================================
      // GENDER
      // ============================================

      gender: {
        type: String,

        enum: [
          "MALE",
          "FEMALE",
          "OTHER",
        ],
      },


      // ============================================
      // QUALIFICATION
      // ============================================

      qualification: {
        type: String,

        trim: true,
      },


      // ============================================
      // JOINING DATE
      // ============================================

      joiningDate: {
        type: Date,
      },


      // ============================================
      // PROFILE IMAGE
      // ============================================

      profileImage: {
        type: String,

        trim: true,
      },


      // ============================================
      // STATUS
      // ============================================

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
// UNIQUE EMPLOYEE ID PER SCHOOL
// ============================================

teacherSchema.index(
  {
    schoolId: 1,
    employeeId: 1,
  },
  {
    unique: true,
  }
);


// ============================================
// UNIQUE EMAIL PER SCHOOL
// ============================================

teacherSchema.index(
  {
    schoolId: 1,
    email: 1,
  },
  {
    unique: true,
  }
);


// ============================================
// ONE USER ACCOUNT → ONE TEACHER PROFILE
// ============================================

teacherSchema.index(
  {
    userId: 1,
  },
  {
    unique: true,

    sparse: true,
  }
);


// ============================================
// MODEL
// ============================================

export const Teacher =
  mongoose.model<ITeacher>(
    "Teacher",
    teacherSchema
  );