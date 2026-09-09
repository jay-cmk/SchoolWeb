import mongoose, {
  Document,
  Schema,
} from "mongoose";

import type {
  TeacherAttendanceStatus,
} from "./teacherAttendance.types";

export interface ITeacherAttendance extends Document {
  schoolId: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;
  date: Date;
  status: TeacherAttendanceStatus;
  checkInTime?: string;
  checkOutTime?: string;
  remarks?: string;
  markedBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TEACHER_ATTENDANCE_STATUSES = [
  "PRESENT",
  "ABSENT",
  "LEAVE",
  "HALF_DAY",
] as const;

const teacherAttendanceSchema =
  new Schema<ITeacherAttendance>(
    {
      schoolId: {
        type: Schema.Types.ObjectId,
        ref: "School",
        required: true,
        index: true,
      },

      teacherId: {
        type: Schema.Types.ObjectId,
        ref: "Teacher",
        required: true,
        index: true,
      },

      date: {
        type: Date,
        required: true,
        index: true,
      },

      status: {
        type: String,
        enum: TEACHER_ATTENDANCE_STATUSES,
        required: true,
        index: true,
      },

      checkInTime: {
        type: String,
        trim: true,
        default: undefined,
      },

      checkOutTime: {
        type: String,
        trim: true,
        default: undefined,
      },

      remarks: {
        type: String,
        trim: true,
        maxlength: 500,
        default: undefined,
      },

      markedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: undefined,
      },
    },
    {
      timestamps: true,
    },
  );

teacherAttendanceSchema.index(
  {
    schoolId: 1,
    teacherId: 1,
    date: 1,
  },
  {
    unique: true,
  },
);

teacherAttendanceSchema.index({
  schoolId: 1,
  date: -1,
  status: 1,
});

teacherAttendanceSchema.index({
  schoolId: 1,
  teacherId: 1,
  date: -1,
});

export const TeacherAttendance =
  mongoose.model<ITeacherAttendance>(
    "TeacherAttendance",
    teacherAttendanceSchema,
  );

