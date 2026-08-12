// import mongoose, { Document, Schema } from "mongoose";
// import { UserRole } from "../../constants/roles";

// export interface IUser extends Document {
//   name: string;
//   email: string;
//   password: string;
//   role: UserRole;
//   schoolId?: mongoose.Types.ObjectId;
//   isActive: boolean;
//   lastLoginAt?: Date;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const userSchema = new Schema<IUser>(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//       index: true,
//     },

//     password: {
//       type: String,
//       required: true,
//       select: false,
//     },

//     role: {
//       type: String,
//       enum: Object.values(UserRole),
//       required: true,
//     },

//     schoolId: {
//       type: Schema.Types.ObjectId,
//       ref: "School",
//       default: undefined,
//     },

//     isActive: {
//       type: Boolean,
//       default: true,
//     },

//     lastLoginAt: {
//       type: Date,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// export const User = mongoose.model<IUser>("User", userSchema);



import mongoose, { Document, Schema } from "mongoose";
import { UserRole } from "../../constants/roles";

export interface IUser extends Document {
  name: string;
  email: string;
  mobile?: string;
  password: string;

  role: UserRole;

  schoolId?: mongoose.Types.ObjectId;

  isActive: boolean;
  lastLoginAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    mobile: {
      type: String,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
      index: true,
    },

    schoolId: {
      type: Schema.Types.ObjectId,
      ref: "School",
      default: undefined,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", userSchema);