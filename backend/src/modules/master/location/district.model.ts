import mongoose, {
  Document,
  Schema,
} from "mongoose";

export interface IDistrict
  extends Document {
  lgdCode: number;

  stateCode: number;

  name: string;

  census2001Code?: string;
  census2011Code?: string;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const districtSchema =
  new Schema<IDistrict>(
    {
      lgdCode: {
        type: Number,
        required: true,
      },

      stateCode: {
        type: Number,
        required: true,
      },

      name: {
        type: String,
        required: true,
        trim: true,
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

districtSchema.index(
  {
    lgdCode: 1,
  },
  {
    unique: true,
  }
);

districtSchema.index({
  stateCode: 1,
  name: 1,
});

districtSchema.index({
  stateCode: 1,
  isActive: 1,
});

export const District =
  mongoose.model<IDistrict>(
    "District",
    districtSchema
  );