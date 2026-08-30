import {
  Schema,
  model,
  Document,
  Types,
} from "mongoose";

import {
  FeeFrequency,
} from "../fee.types";


export interface IFeeStructure
  extends Document {

  schoolId: Types.ObjectId;

  sessionId: Types.ObjectId;

  feeCategoryId: Types.ObjectId;

  name: string;

  amount: number;

  frequency: FeeFrequency;

  description?: string;

  dueDay?: number;

  isActive: boolean;

  createdBy: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}


const feeStructureSchema =
  new Schema<IFeeStructure>(
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
        index: true,
      },

      feeCategoryId: {
        type: Schema.Types.ObjectId,
        ref: "FeeCategory",
        required: true,
        index: true,
      },

      name: {
        type: String,
        required: true,
        trim: true,
      },

      amount: {
        type: Number,
        required: true,
        min: 0,
      },

      frequency: {
        type: String,
        enum: Object.values(
          FeeFrequency
        ),
        required: true,
      },

      description: {
        type: String,
        trim: true,
      },

      dueDay: {
        type: Number,
        min: 1,
        max: 31,
      },

      isActive: {
        type: Boolean,
        default: true,
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


// ============================================
// UNIQUE STRUCTURE
// ============================================

feeStructureSchema.index(
  {
    schoolId: 1,
    sessionId: 1,
    feeCategoryId: 1,
    name: 1,
  },
  {
    unique: true,
  }
);


// ============================================
// QUERY INDEX
// ============================================

feeStructureSchema.index({
  schoolId: 1,
  sessionId: 1,
  isActive: 1,
});


export const FeeStructure =
  model<IFeeStructure>(
    "FeeStructure",
    feeStructureSchema
  );