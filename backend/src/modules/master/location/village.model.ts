import mongoose, {
  Document,
  Schema,
} from "mongoose";

export interface IVillage
  extends Document {
  lgdCode: number;

  stateCode: number;
  districtCode: number;
  subDistrictCode: number;

  name: string;
  localName?: string;

  version?: number;

  category?: string;
  status?: string;

  census2001Code?: string;
  census2011Code?: string;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const villageSchema =
  new Schema<IVillage>(
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

      subDistrictCode: {
        type: Number,
        required: true,
      },

      name: {
        type: String,
        required: true,
        trim: true,
      },

      localName: {
        type: String,
        trim: true,
      },

      version: {
        type: Number,
      },

      category: {
        type: String,
        trim: true,
      },

      status: {
        type: String,
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

villageSchema.index(
  {
    lgdCode: 1,
  },
  {
    unique: true,
  }
);

villageSchema.index({
  subDistrictCode: 1,
  name: 1,
});

villageSchema.index({
  stateCode: 1,
  districtCode: 1,
  subDistrictCode: 1,
});

villageSchema.index({
  subDistrictCode: 1,
  isActive: 1,
});

export const Village =
  mongoose.model<IVillage>(
    "Village",
    villageSchema
  );