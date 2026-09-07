import mongoose, {
  Document,
  Schema,
} from "mongoose";

export enum StateType {
  STATE = "STATE",
  UNION_TERRITORY = "UNION_TERRITORY",
}

export interface IState
  extends Document {
  lgdCode: number;

  name: string;
  localName?: string;

  version?: number;

  census2001Code?: string;
  census2011Code?: string;

  type: StateType;

  countryCode: string;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const stateSchema =
  new Schema<IState>(
    {
      lgdCode: {
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

      census2001Code: {
        type: String,
        trim: true,
      },

      census2011Code: {
        type: String,
        trim: true,
      },

      type: {
        type: String,
        enum: Object.values(
          StateType
        ),
        required: true,
      },

      countryCode: {
        type: String,
        required: true,
        default: "IN",
        uppercase: true,
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

stateSchema.index(
  {
    countryCode: 1,
    lgdCode: 1,
  },
  {
    unique: true,
  }
);

stateSchema.index({
  countryCode: 1,
  name: 1,
});

stateSchema.index({
  isActive: 1,
});

export const State =
  mongoose.model<IState>(
    "State",
    stateSchema
  );