import { Types } from "mongoose";

export type StudentGender = "MALE" | "FEMALE" | "OTHER";

export type StudentStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "TRANSFERRED"
  | "PASSED"
  | "LEFT";

export interface IStudentAddress {
  addressLine?: string;
  city?: string;
  district?: string;
  state?: string;
  pincode?: string;
}

export interface IStudent {
  schoolId: Types.ObjectId;

  sessionId: Types.ObjectId;

  classId: Types.ObjectId;

  sectionId: Types.ObjectId;

  admissionNumber: string;

  rollNumber?: number;

  name: string;

  dob?: Date;

  gender: StudentGender;

  mobile?: string;

  email?: string;

  address?: IStudentAddress;

  admissionDate: Date;

  status: StudentStatus;

  parentId?: Types.ObjectId;

  createdBy: Types.ObjectId;

  updatedBy?: Types.ObjectId;
}