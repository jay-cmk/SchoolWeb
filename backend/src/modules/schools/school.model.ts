import mongoose, { Document, Schema } from "mongoose";
import { SchoolStatus } from "../../constants/school";

export interface ISchool extends Document {
  name: string;
  code: string;

  email?: string;
  phone?: string;

  address?: {
    addressLine?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };

  logo?: string;

  status: SchoolStatus;

  createdBy: mongoose.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const schoolSchema = new Schema<ISchool>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    address: {
      addressLine: {
        type: String,
        trim: true,
      },

      city: {
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

      country: {
        type: String,
        trim: true,
        default: "India",
      },
    },

    logo: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: Object.values(SchoolStatus),
      default: SchoolStatus.ACTIVE,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const School = mongoose.model<ISchool>(
  "School",
  schoolSchema
);