


// import { Types } from "mongoose";

// export type StudentGender =
//   | "MALE"
//   | "FEMALE"
//   | "OTHER";

// export type StudentStatus =
//   | "ACTIVE"
//   | "INACTIVE"
//   | "TRANSFERRED"
//   | "PASSED"
//   | "LEFT";

// export interface IStudentAddress {
//   addressLine?: string;
//   city?: string;
//   district?: string;
//   state?: string;
//   pincode?: string;
// }

// export interface IStudent {
//   schoolId: Types.ObjectId;

//   sessionId: Types.ObjectId;
//   classId: Types.ObjectId;
//   sectionId: Types.ObjectId;

//   admissionNumber: string;
//   rollNumber?: number;

//   name: string;

//   dob?: Date;

//   gender: StudentGender;

//   mobile?: string;
//   email?: string;

//   address?: IStudentAddress;

//   admissionDate: Date;

//   parentId?: Types.ObjectId;

//   status: StudentStatus;

//   createdBy: Types.ObjectId;
//   updatedBy?: Types.ObjectId;

//   createdAt?: Date;
//   updatedAt?: Date;
// }







import { Types } from "mongoose";

export type StudentGender =
  | "MALE"
  | "FEMALE"
  | "OTHER";

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

  // Student login account
  userId?: Types.ObjectId;

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

  parentId?: Types.ObjectId;

  status: StudentStatus;

  createdBy: Types.ObjectId;

  updatedBy?: Types.ObjectId;

  createdAt?: Date;

  updatedAt?: Date;
}