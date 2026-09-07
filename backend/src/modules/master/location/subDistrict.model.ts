import mongoose, {
  Document,
  Schema,
} from "mongoose";

export interface ISubDistrict
  extends Document {
  lgdCode: number;

  stateCode: number;
  districtCode: number;

  name: string;

  version?: number;

  census2001Code?: string;
  census2011Code?: string;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const subDistrictSchema =
  new Schema<ISubDistrict>(
    {
      lgdCode: {
        type: Number,
        required: true,
      },

      stateCode: {
        type: Number,
        required: true,
      },

      districtCode: {
        type: Number,
        required: true,
      },

      name: {
        type: String,
        required: true,
        trim: true,
      },

      version: {
        type: Number,
      },

      census2001Code: {
        type: String,
        trim: true,
      },

      census2011Code: {
        type: String,
        trim: true,
      },

      isActive: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );

subDistrictSchema.index(
  {
    lgdCode: 1,
  },
  {
    unique: true,
  }
);

subDistrictSchema.index({
  districtCode: 1,
  name: 1,
});

subDistrictSchema.index({
  stateCode: 1,
  districtCode: 1,
});

subDistrictSchema.index({
  districtCode: 1,
  isActive: 1,
});

export const SubDistrict =
  mongoose.model<ISubDistrict>(
    "SubDistrict",
    subDistrictSchema
  );