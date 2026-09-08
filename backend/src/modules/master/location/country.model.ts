import mongoose, {
  Document,
  Schema,
} from "mongoose";

export interface ICountry
  extends Document {
  name: string;
  iso2: string;
  iso3: string;
  phoneCode?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const countrySchema =
  new Schema<ICountry>(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      iso2: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
      },

      iso3: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
      },

      phoneCode: {
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

countrySchema.index(
  { iso2: 1 },
  { unique: true }
);

countrySchema.index(
  { iso3: 1 },
  { unique: true }
);

countrySchema.index({
  name: 1,
});

export const Country =
  mongoose.model<ICountry>(
    "Country",
    countrySchema
  );