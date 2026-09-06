import {
  Schema,
  model,
  Document,
  Types,
} from "mongoose";

import {
  FeeCategoryType,
} from "../fee.types";

export interface IFeeCategory
  extends Document {
  schoolId: Types.ObjectId;

  name: string;

  description?: string;

  type: FeeCategoryType;

  isActive: boolean;

  createdBy: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}

const feeCategorySchema =
  new Schema<IFeeCategory>(
    {
      schoolId: {
        type: Schema.Types.ObjectId,
        ref: "School",
        required: true,
        index: true,
      },

      name: {
        type: String,
        required: true,
        trim: true,
      },

      description: {
        type: String,
        trim: true,
      },

      type: {
        type: String,
        enum: Object.values(
          FeeCategoryType
        ),
        required: true,
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

feeCategorySchema.index(
  {
    schoolId: 1,
    name: 1,
  },
  {
    unique: true,
  }
);

export const FeeCategory =
  model<IFeeCategory>(
    "FeeCategory",
    feeCategorySchema
  );