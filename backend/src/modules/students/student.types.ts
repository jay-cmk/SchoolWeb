// import { Types } from "mongoose";
// import {
//   StudentGender,
//   StudentStatus,
//   IStudentAddress
// } from "./student.interface";

// export interface ICreateStudentRequest {
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

//   admissionDate?: Date;
// }

// export interface IUpdateStudentRequest {
//   sessionId?: Types.ObjectId;

//   classId?: Types.ObjectId;

//   sectionId?: Types.ObjectId;

//   rollNumber?: number;

//   name?: string;

//   dob?: Date;

//   gender?: StudentGender;

//   mobile?: string;

//   email?: string;

//   address?: IStudentAddress;

//   status?: StudentStatus;
// }














import type {
  StudentGender,
  StudentStatus,
  IStudentAddress,
} from "./student.interface";

export interface ICreateStudentRequest {
  sessionId: string;
  classId: string;
  sectionId: string;

  admissionNumber: string;

  rollNumber?: number;

  name: string;

  dob?: string | Date;

  gender: StudentGender;

  mobile?: string;
  email?: string;

  address?: IStudentAddress;

  admissionDate?: string | Date;

  parentId?: string;
}

export interface IUpdateStudentRequest {
  sessionId?: string;
  classId?: string;
  sectionId?: string;

  admissionNumber?: string;

  rollNumber?: number;

  name?: string;

  dob?: string | Date;

  gender?: StudentGender;

  mobile?: string;
  email?: string;

  address?: IStudentAddress;

  admissionDate?: string | Date;

  parentId?: string | null;

  status?: StudentStatus;
}

export interface IStudentQuery {
  page?: number | string;
  limit?: number | string;

  search?: string;

  sessionId?: string;
  classId?: string;
  sectionId?: string;

  status?: StudentStatus | string;
}

export interface ICreateStudentAccountRequest {
  email: string;
  password: string;
}