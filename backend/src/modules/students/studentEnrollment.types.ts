import type {
  Types,
} from "mongoose";


/* =====================================================
   ENROLLMENT STATUS
===================================================== */

export type EnrollmentStatus =
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED";


/* =====================================================
   PROMOTION STATUS
===================================================== */

export type PromotionStatus =
  | "NOT_DECIDED"
  | "PROMOTED"
  | "RETAINED"
  | "TRANSFERRED"
  | "LEFT"
  | "GRADUATED";


/* =====================================================
   STUDENT ENROLLMENT
===================================================== */

export interface IStudentEnrollment {

  _id?: Types.ObjectId;

  schoolId:
    Types.ObjectId;

  studentId:
    Types.ObjectId;

  sessionId:
    Types.ObjectId;

  classId:
    Types.ObjectId;

  sectionId:
    Types.ObjectId;

  rollNumber?: number;

  enrollmentStatus:
    EnrollmentStatus;

  promotionStatus:
    PromotionStatus;

  promotedFromEnrollmentId?:
    Types.ObjectId;

  promotionDate?: Date;

  remarks?: string;

  createdBy:
    Types.ObjectId;

  updatedBy?:
    Types.ObjectId;

  createdAt?: Date;

  updatedAt?: Date;
}


/* =====================================================
   CREATE ENROLLMENT DATA
===================================================== */

export interface ICreateStudentEnrollmentData {

  schoolId: string;

  studentId: string;

  sessionId: string;

  classId: string;

  sectionId: string;

  rollNumber?: number;

  enrollmentStatus?:
    EnrollmentStatus;

  promotionStatus?:
    PromotionStatus;

  promotedFromEnrollmentId?:
    string;

  promotionDate?: Date;

  remarks?: string;

  createdBy: string;
}


/* =====================================================
   UPDATE ENROLLMENT DATA
===================================================== */

export interface IUpdateStudentEnrollmentData {

  classId?: string;

  sectionId?: string;

  rollNumber?: number;

  enrollmentStatus?:
    EnrollmentStatus;

  promotionStatus?:
    PromotionStatus;

  promotionDate?: Date;

  remarks?: string;

  updatedBy: string;
}