import { Types } from "mongoose";
import {
  StudentGender,
  StudentStatus,
  IStudentAddress
} from "./student.interface";

export interface ICreateStudentRequest {
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

  admissionDate?: Date;
}

export interface IUpdateStudentRequest {
  sessionId?: Types.ObjectId;

  classId?: Types.ObjectId;

  sectionId?: Types.ObjectId;

  rollNumber?: number;

  name?: string;

  dob?: Date;

  gender?: StudentGender;

  mobile?: string;

  email?: string;

  address?: IStudentAddress;

  status?: StudentStatus;
}