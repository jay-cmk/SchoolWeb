import type {
  Types,
} from "mongoose";

import type {
  StudentStream,
} from "./studentEnrollment.types";


/* =====================================================
   ELECTIVE SUBJECT STATUS
===================================================== */

export type StudentSubjectStatus =
  | "ACTIVE"
  | "DROPPED"
  | "COMPLETED";


/* =====================================================
   STUDENT SUBJECT ENROLLMENT

   केवल student-wise elective subjects के लिए।

   CORE, LANGUAGE और PRACTICAL subjects
   existing SubjectAssignment से class/section
   के सभी students को मिलेंगे।
===================================================== */

export interface IStudentSubjectEnrollment {
  _id?: Types.ObjectId;

  schoolId:
    Types.ObjectId;

  /*
   * Student के academic enrollment से relation.
   *
   * इससे selected session, class, section और
   * stream का सही historical record मिलेगा।
   */
  studentEnrollmentId:
    Types.ObjectId;

  studentId:
    Types.ObjectId;

  sessionId:
    Types.ObjectId;

  classId:
    Types.ObjectId;

  sectionId:
    Types.ObjectId;

  stream:
    StudentStream;

  /*
   * केवल ELECTIVE subject allowed होगा।
   */
  subjectId:
    Types.ObjectId;

  /*
   * इसी assignment से elective subject का
   * teacher और weekly periods मिलेंगे।
   */
  subjectAssignmentId:
    Types.ObjectId;

  status:
    StudentSubjectStatus;

  remarks?: string;

  createdBy:
    Types.ObjectId;

  updatedBy?:
    Types.ObjectId;

  createdAt?: Date;

  updatedAt?: Date;
}


/* =====================================================
   ASSIGN ELECTIVE SUBJECT REQUEST

   Frontend केवल student और subject assignment भेजेगा।

   schoolId, sessionId, classId, sectionId और stream
   backend active StudentEnrollment से निकालेगा।
===================================================== */

export interface IAssignStudentElectiveSubjectRequest {
  studentId: string;

  subjectAssignmentId: string;

  remarks?: string;
}


/* =====================================================
   BULK ASSIGN ELECTIVE SUBJECT REQUEST

   एक elective subject कई students को देने के लिए।
===================================================== */

export interface IBulkAssignStudentElectiveSubjectRequest {
  studentIds: string[];

  subjectAssignmentId: string;

  remarks?: string;
}


/* =====================================================
   UPDATE ELECTIVE SUBJECT REQUEST
===================================================== */

export interface IUpdateStudentElectiveSubjectRequest {
  status?:
    StudentSubjectStatus;

  remarks?: string;
}


/* =====================================================
   ELECTIVE SUBJECT QUERY
===================================================== */

export interface IStudentSubjectEnrollmentQuery {
  sessionId?: string;

  classId?: string;

  sectionId?: string;

  studentId?: string;

  subjectId?: string;

  subjectAssignmentId?: string;

  stream?: StudentStream;

  status?:
    StudentSubjectStatus;
}