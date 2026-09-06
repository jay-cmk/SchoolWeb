

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


export type StudentCategory =
  | "GENERAL"
  | "OBC"
  | "SC"
  | "ST"
  | "OTHER";


export type StudentBloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";


export type AdmissionType =
  | "NEW"
  | "TRANSFER"
  | "READMISSION";


export type AdmissionCategory =
  | "REGULAR"
  | "RTE"
  | "EWS"
  | "MANAGEMENT"
  | "OTHER";


export interface IStudentAddress {
  addressLine?: string;
  city?: string;
  district?: string;
  state?: string;
  pincode?: string;
  country?: string;
}


export interface IStudentParentDetails {
  name?: string;
  mobile?: string;
  aadhaarNumber?: string;
  occupation?: string;
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

  // ============================================
  // ADMISSION DETAILS
  // ============================================

  admissionType?: AdmissionType;

  admissionCategory?: AdmissionCategory;

  admissionDate: Date;

  // ============================================
  // BASIC DETAILS
  // ============================================

  name: string;

  dob?: Date;

  gender: StudentGender;

  bloodGroup?: StudentBloodGroup;

  religion?: string;

  category?: StudentCategory;

  caste?: string;

  aadhaarNumber?: string;

  photo?: string;

  // ============================================
  // CONTACT DETAILS
  // ============================================

  mobile?: string;

  email?: string;

  // ============================================
  // ADDRESS
  // ============================================

  // Kept for old student records compatibility
  address?: IStudentAddress;

  currentAddress?: IStudentAddress;

  permanentAddress?: IStudentAddress;

  // ============================================
  // PARENT DETAILS
  // ============================================

  father?: IStudentParentDetails;

  mother?: IStudentParentDetails;

  // Existing Parent module relation
  parentId?: Types.ObjectId;

  // ============================================
  // STATUS
  // ============================================

  status: StudentStatus;

  createdBy: Types.ObjectId;

  updatedBy?: Types.ObjectId;

  createdAt?: Date;

  updatedAt?: Date;
}