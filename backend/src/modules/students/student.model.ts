






// import mongoose, {
//   Document,
//   Schema,
//   Types,
// } from "mongoose";

// import type {
//   StudentGender,
//   // StudentStatus,
// } from "./student.interface";

// export interface IStudentDocument
//   extends Document {
//   schoolId: Types.ObjectId;

//   sessionId: Types.ObjectId;
//   classId: Types.ObjectId;
//   sectionId: Types.ObjectId;

//   admissionNumber: string;

//   rollNumber?: number;

//   name: string;

//   dob?: Date;

//   gender: StudentGender;

//   mobile?: string;
//   email?: string;

//   address?: {
//     addressLine?: string;
//     city?: string;
//     district?: string;
//     state?: string;
//     pincode?: string;
//   };

//   admissionDate: Date;

//   parentId?: Types.ObjectId;

//   status: StudentStatus;

//   createdBy: Types.ObjectId;
//   updatedBy?: Types.ObjectId;

//   createdAt: Date;
//   updatedAt: Date;
// }

// const studentAddressSchema =
//   new Schema(
//     {
//       addressLine: {
//         type: String,
//         trim: true,
//       },

//       city: {
//         type: String,
//         trim: true,
//       },

//       district: {
//         type: String,
//         trim: true,
//       },

//       state: {
//         type: String,
//         trim: true,
//       },

//       pincode: {
//         type: String,
//         trim: true,
//       },
//     },
//     {
//       _id: false,
//     }
//   );

// const studentSchema =
//   new Schema<IStudentDocument>(
//     {
//       schoolId: {
//         type: Schema.Types.ObjectId,
//         ref: "School",
//         required: true,
//         index: true,
//       },

//       sessionId: {
//         type: Schema.Types.ObjectId,
//         ref: "AcademicSession",
//         required: true,
//         index: true,
//       },

//       classId: {
//         type: Schema.Types.ObjectId,
//         ref: "Class",
//         required: true,
//         index: true,
//       },

//       sectionId: {
//         type: Schema.Types.ObjectId,
//         ref: "Section",
//         required: true,
//         index: true,
//       },

//       admissionNumber: {
//         type: String,
//         required: true,
//         uppercase: true,
//         trim: true,
//       },

//       rollNumber: {
//         type: Number,
//         min: 1,
//       },

//       name: {
//         type: String,
//         required: true,
//         trim: true,
//       },

//       dob: {
//         type: Date,
//       },

//       gender: {
//         type: String,

//         enum: [
//           "MALE",
//           "FEMALE",
//           "OTHER",
//         ],

//         required: true,
//       },

//       mobile: {
//         type: String,
//         trim: true,
//       },

//       email: {
//         type: String,
//         lowercase: true,
//         trim: true,
//       },

//       address: {
//         type: studentAddressSchema,
//       },

//       admissionDate: {
//         type: Date,
//         default: Date.now,
//       },

//       parentId: {
//         type: Schema.Types.ObjectId,
//         ref: "Parent",
//       },

//       status: {
//         type: String,

//         enum: [
//           "ACTIVE",
//           "INACTIVE",
//           "TRANSFERRED",
//           "PASSED",
//           "LEFT",
//         ],

//         default: "ACTIVE",
//       },

//       createdBy: {
//         type: Schema.Types.ObjectId,
//         ref: "User",
//         required: true,
//       },

//       updatedBy: {
//         type: Schema.Types.ObjectId,
//         ref: "User",
//       },
//     },
//     {
//       timestamps: true,
//     }
//   );

// // ============================================
// // UNIQUE ADMISSION NUMBER
// // PER SCHOOL + SESSION
// // ============================================

// studentSchema.index(
//   {
//     schoolId: 1,
//     sessionId: 1,
//     admissionNumber: 1,
//   },
//   {
//     unique: true,
//   }
// );

// // ============================================
// // UNIQUE ROLL NUMBER
// // PER SESSION + CLASS + SECTION
// // ============================================

// studentSchema.index(
//   {
//     schoolId: 1,
//     sessionId: 1,
//     classId: 1,
//     sectionId: 1,
//     rollNumber: 1,
//   },
//   {
//     unique: true,

//     partialFilterExpression: {
//       rollNumber: {
//         $exists: true,
//       },
//     },
//   }
// );

// // ============================================
// // SEARCH / FILTER INDEX
// // ============================================

// studentSchema.index({
//   schoolId: 1,
//   sessionId: 1,
//   classId: 1,
//   sectionId: 1,
//   status: 1,
// });

// const Student =
//   mongoose.models.Student ||
//   mongoose.model<IStudentDocument>(
//     "Student",
//     studentSchema
//   );

// export { Student };

// export default Student;













// import mongoose, {
//   Document,
//   Schema,
//   Types,
//   type Model,
// } from "mongoose";

// import type {
//   StudentGender,
//   StudentStatus,
// } from "./student.interface";


// // ============================================
// // STUDENT DOCUMENT INTERFACE
// // ============================================

// export interface IStudentDocument
//   extends Document {

//   schoolId: Types.ObjectId;

//   sessionId: Types.ObjectId;

//   classId: Types.ObjectId;

//   sectionId: Types.ObjectId;

//   admissionNumber: string;

//   rollNumber?: number;

//   name: string;

//   dob?: Date;

//   gender: StudentGender;

//   mobile?: string;

//   email?: string;

//   address?: {
//     addressLine?: string;
//     city?: string;
//     district?: string;
//     state?: string;
//     pincode?: string;
//   };

//   admissionDate: Date;

//   parentId?: Types.ObjectId;

//   status: StudentStatus;

//   createdBy: Types.ObjectId;

//   updatedBy?: Types.ObjectId;

//   createdAt: Date;

//   updatedAt: Date;
// }


// // ============================================
// // STUDENT ADDRESS SCHEMA
// // ============================================

// const studentAddressSchema =
//   new Schema(
//     {
//       addressLine: {
//         type: String,
//         trim: true,
//       },

//       city: {
//         type: String,
//         trim: true,
//       },

//       district: {
//         type: String,
//         trim: true,
//       },

//       state: {
//         type: String,
//         trim: true,
//       },

//       pincode: {
//         type: String,
//         trim: true,
//       },
//     },
//     {
//       _id: false,
//     }
//   );


// // ============================================
// // STUDENT SCHEMA
// // ============================================

// const studentSchema =
//   new Schema<IStudentDocument>(
//     {

//       schoolId: {
//         type: Schema.Types.ObjectId,
//         ref: "School",
//         required: true,
//         index: true,
//       },


//       sessionId: {
//         type: Schema.Types.ObjectId,
//         ref: "AcademicSession",
//         required: true,
//         index: true,
//       },


//       classId: {
//         type: Schema.Types.ObjectId,
//         ref: "Class",
//         required: true,
//         index: true,
//       },


//       sectionId: {
//         type: Schema.Types.ObjectId,
//         ref: "Section",
//         required: true,
//         index: true,
//       },


//       admissionNumber: {
//         type: String,
//         required: true,
//         uppercase: true,
//         trim: true,
//       },


//       rollNumber: {
//         type: Number,
//         min: 1,
//       },


//       name: {
//         type: String,
//         required: true,
//         trim: true,
//       },


//       dob: {
//         type: Date,
//       },


//       gender: {
//         type: String,

//         enum: [
//           "MALE",
//           "FEMALE",
//           "OTHER",
//         ],

//         required: true,
//       },


//       mobile: {
//         type: String,
//         trim: true,
//       },


//       email: {
//         type: String,
//         lowercase: true,
//         trim: true,
//       },


//       address: {
//         type: studentAddressSchema,
//       },


//       admissionDate: {
//         type: Date,
//         default: Date.now,
//       },


//       parentId: {
//         type: Schema.Types.ObjectId,
//         ref: "Parent",
//       },


//       status: {
//         type: String,

//         enum: [
//           "ACTIVE",
//           "INACTIVE",
//           "TRANSFERRED",
//           "PASSED",
//           "LEFT",
//         ],

//         default: "ACTIVE",
//       },


//       createdBy: {
//         type: Schema.Types.ObjectId,
//         ref: "User",
//         required: true,
//       },


//       updatedBy: {
//         type: Schema.Types.ObjectId,
//         ref: "User",
//       },

//     },
//     {
//       timestamps: true,
//     }
//   );


// // ============================================
// // UNIQUE ADMISSION NUMBER
// // SCHOOL + SESSION
// // ============================================

// studentSchema.index(
//   {
//     schoolId: 1,
//     sessionId: 1,
//     admissionNumber: 1,
//   },
//   {
//     unique: true,
//   }
// );


// // ============================================
// // UNIQUE ROLL NUMBER
// // SCHOOL + SESSION + CLASS + SECTION
// // ============================================

// studentSchema.index(
//   {
//     schoolId: 1,
//     sessionId: 1,
//     classId: 1,
//     sectionId: 1,
//     rollNumber: 1,
//   },
//   {
//     unique: true,

//     partialFilterExpression: {
//       rollNumber: {
//         $exists: true,
//       },
//     },
//   }
// );


// // ============================================
// // FILTER INDEX
// // ============================================

// studentSchema.index({
//   schoolId: 1,
//   sessionId: 1,
//   classId: 1,
//   sectionId: 1,
//   status: 1,
// });


// // ============================================
// // STUDENT MODEL
// // ============================================

// const Student: Model<IStudentDocument> =
//   mongoose.models.Student
//     ? (mongoose.models.Student as Model<IStudentDocument>)
//     : mongoose.model<IStudentDocument>(
//         "Student",
//         studentSchema
//       );


// // ============================================
// // EXPORT
// // ============================================

// export { Student };

// export default Student;











import mongoose, {
  Document,
  Schema,
  Types,
  type Model,
} from "mongoose";

import type {
  StudentGender,
  StudentStatus,
} from "./student.interface";


// ============================================
// STUDENT DOCUMENT INTERFACE
// ============================================

export interface IStudentDocument
  extends Document {

  schoolId: Types.ObjectId;

  // Student login User account
  userId?: Types.ObjectId;

  sessionId: Types.ObjectId;

  classId: Types.ObjectId;

  sectionId: Types.ObjectId;

  admissionNumber: string;

  rollNumber?: number;

  name: string;

  dob?: Date;

  gender: StudentGender;

  mobile?: string;

  email?: string;

  address?: {
    addressLine?: string;
    city?: string;
    district?: string;
    state?: string;
    pincode?: string;
  };

  admissionDate: Date;

  parentId?: Types.ObjectId;

  status: StudentStatus;

  createdBy: Types.ObjectId;

  updatedBy?: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}


// ============================================
// STUDENT ADDRESS SCHEMA
// ============================================

const studentAddressSchema =
  new Schema(
    {
      addressLine: {
        type: String,
        trim: true,
      },

      city: {
        type: String,
        trim: true,
      },

      district: {
        type: String,
        trim: true,
      },

      state: {
        type: String,
        trim: true,
      },

      pincode: {
        type: String,
        trim: true,
      },
    },
    {
      _id: false,
    }
  );


// ============================================
// STUDENT SCHEMA
// ============================================

const studentSchema =
  new Schema<IStudentDocument>(
    {

      schoolId: {
        type: Schema.Types.ObjectId,
        ref: "School",
        required: true,
        index: true,
      },


      // ======================================
      // STUDENT LOGIN USER ACCOUNT
      // ======================================

      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },


      sessionId: {
        type: Schema.Types.ObjectId,
        ref: "AcademicSession",
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


      admissionNumber: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
      },


      rollNumber: {
        type: Number,
        min: 1,
      },


      name: {
        type: String,
        required: true,
        trim: true,
      },


      dob: {
        type: Date,
      },


      gender: {
        type: String,

        enum: [
          "MALE",
          "FEMALE",
          "OTHER",
        ],

        required: true,
      },


      mobile: {
        type: String,
        trim: true,
      },


      email: {
        type: String,
        lowercase: true,
        trim: true,
      },


      address: {
        type: studentAddressSchema,
      },


      admissionDate: {
        type: Date,
        default: Date.now,
      },


      parentId: {
        type: Schema.Types.ObjectId,
        ref: "Parent",
      },


      status: {
        type: String,

        enum: [
          "ACTIVE",
          "INACTIVE",
          "TRANSFERRED",
          "PASSED",
          "LEFT",
        ],

        default: "ACTIVE",
      },


      createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },


      updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },

    },
    {
      timestamps: true,
    }
  );


// ============================================
// UNIQUE USER ACCOUNT
// ONE USER = ONE STUDENT
// ============================================

studentSchema.index(
  {
    userId: 1,
  },
  {
    unique: true,
    sparse: true,
  }
);


// ============================================
// UNIQUE ADMISSION NUMBER
// SCHOOL + SESSION
// ============================================

studentSchema.index(
  {
    schoolId: 1,
    sessionId: 1,
    admissionNumber: 1,
  },
  {
    unique: true,
  }
);


// ============================================
// UNIQUE ROLL NUMBER
// SCHOOL + SESSION + CLASS + SECTION
// ============================================

studentSchema.index(
  {
    schoolId: 1,
    sessionId: 1,
    classId: 1,
    sectionId: 1,
    rollNumber: 1,
  },
  {
    unique: true,

    partialFilterExpression: {
      rollNumber: {
        $exists: true,
      },
    },
  }
);


// ============================================
// FILTER INDEX
// ============================================

studentSchema.index({
  schoolId: 1,
  sessionId: 1,
  classId: 1,
  sectionId: 1,
  status: 1,
});


// ============================================
// STUDENT MODEL
// ============================================

const Student: Model<IStudentDocument> =
  mongoose.models.Student
    ? (
        mongoose.models
          .Student as Model<IStudentDocument>
      )
    : mongoose.model<IStudentDocument>(
        "Student",
        studentSchema
      );


// ============================================
// EXPORT
// ============================================

export { Student };

export default Student;