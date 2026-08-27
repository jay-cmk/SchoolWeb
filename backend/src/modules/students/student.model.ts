// import mongoose, { Schema, Model } from "mongoose";
// import { IStudent } from "./student.interface";

// const studentAddressSchema = new Schema(
//   {
//     addressLine: {
//       type: String,
//       trim: true,
//     },

//     city: {
//       type: String,
//       trim: true,
//     },

//     district: {
//       type: String,
//       trim: true,
//     },

//     state: {
//       type: String,
//       trim: true,
//     },

//     pincode: {
//       type: String,
//       trim: true,
//     },
//   },
//   {
//     _id: false,
//   },
// );

// const studentSchema = new Schema<IStudent>(
//   {
//     schoolId: {
//       type: Schema.Types.ObjectId,
//       ref: "School",
//       required: true,
//       index: true,
//     },

//     sessionId: {
//       type: Schema.Types.ObjectId,
//       ref: "AcademicSession",
//       required: true,
//       index: true,
//     },

//     classId: {
//       type: Schema.Types.ObjectId,
//       ref: "Class",
//       required: true,
//       index: true,
//     },

//     sectionId: {
//       type: Schema.Types.ObjectId,
//       ref: "Section",
//       required: true,
//       index: true,
//     },

//     admissionNumber: {
//       type: String,
//       required: true,
//       trim: true,
//       uppercase: true,
//     },

//     rollNumber: {
//       type: Number,
//     },

//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     dob: {
//       type: Date,
//     },

//     gender: {
//       type: String,
//       enum: ["MALE", "FEMALE", "OTHER"],
//       required: true,
//     },

//     mobile: {
//       type: String,
//       trim: true,
//     },

//     email: {
//       type: String,
//       trim: true,
//       lowercase: true,
//     },

//     address: {
//       type: studentAddressSchema,
//     },

//     admissionDate: {
//       type: Date,
//       required: true,
//       default: Date.now,
//     },

//     status: {
//       type: String,
//       enum: ["ACTIVE", "INACTIVE", "TRANSFERRED", "PASSED", "LEFT"],
//       default: "ACTIVE",
//     },

//     parentId: {
//       type: Schema.Types.ObjectId,
//       ref: "Parent",
//     },

//     createdBy: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     updatedBy: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//     },
//   },

//   {
//     timestamps: true,
//   },
// );
/* hjdfh*/
import mongoose, { Document, Schema, Types } from "mongoose";

export interface IStudent extends Document {
  schoolId: Types.ObjectId;
  sessionId: Types.ObjectId;
  classId: Types.ObjectId;
  sectionId: Types.ObjectId;

  admissionNumber: string;
  rollNumber: number;

  name: string;
  dob: Date;
  gender: "MALE" | "FEMALE" | "OTHER";

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

  status: "ACTIVE" | "INACTIVE" | "TRANSFERRED" | "LEFT";

  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const studentSchema = new Schema<IStudent>(
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
    },

    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    sectionId: {
      type: Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },

    admissionNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    rollNumber: {
      type: Number,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    dob: {
      type: Date,
      required: true,
    },

    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
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
      addressLine: String,
      city: String,
      district: String,
      state: String,
      pincode: String,
    },

    admissionDate: {
      type: Date,
      required: true,
    },

    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Parent",
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "TRANSFERRED", "LEFT"],
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

/*
 * Important:
 * Export the Mongoose MODEL, not the Schema.
 */

const Student = mongoose.model<IStudent>("Student", studentSchema);

export default Student;