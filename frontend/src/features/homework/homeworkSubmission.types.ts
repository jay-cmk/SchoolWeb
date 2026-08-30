import type {
  Homework,
} from "./homework.types";

export const HomeworkSubmissionStatus = {
  SUBMITTED: "SUBMITTED",
  LATE: "LATE",
} as const;

export type HomeworkSubmissionStatus =
  (typeof HomeworkSubmissionStatus)[keyof typeof HomeworkSubmissionStatus];


export const HomeworkReviewStatus = {
  PENDING: "PENDING",
  REVIEWED: "REVIEWED",
} as const;

export type HomeworkReviewStatus =
  (typeof HomeworkReviewStatus)[keyof typeof HomeworkReviewStatus];


export interface SubmissionAttachment {
  fileName: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: number;
}


export interface SubmissionStudent {
  _id: string;

  name?: string;

  firstName?: string;
  lastName?: string;

  admissionNumber?: string;
  rollNumber?: string;

  email?: string;
}


export interface SubmissionReviewer {
  _id: string;
  name?: string;
  email?: string;
}


export interface HomeworkSubmission {
  _id: string;

  schoolId?: string;

  homeworkId:
    | string
    | Homework;

  studentId:
    | string
    | SubmissionStudent;

  submissionText?: string;

  attachment?: SubmissionAttachment;

  submissionStatus:
    HomeworkSubmissionStatus;

  reviewStatus:
    HomeworkReviewStatus;

  submittedAt: string;

  remarks?: string;

  marks?: number;

  reviewedBy?:
    | string
    | SubmissionReviewer;

  reviewedAt?: string;

  isActive?: boolean;

  createdAt?: string;
  updatedAt?: string;
}


// ======================================================
// CREATE SUBMISSION
// ======================================================

export interface CreateHomeworkSubmissionData {
  homeworkId: string;
  studentId: string;

  submissionText?: string;

  attachment?: SubmissionAttachment;
}


// ======================================================
// UPDATE SUBMISSION
// ======================================================

export interface UpdateHomeworkSubmissionData {
  submissionText?: string;

  attachment?:
    | SubmissionAttachment
    | null;
}


// ======================================================
// REVIEW SUBMISSION
// ======================================================

export interface ReviewHomeworkSubmissionData {
  remarks?: string;
  marks?: number;
}


// ======================================================
// FILTERS
// ======================================================

export interface HomeworkSubmissionFilters {
  studentId?: string;

  submissionStatus?:
    HomeworkSubmissionStatus;

  reviewStatus?:
    HomeworkReviewStatus;

  search?: string;

  page?: number;
  limit?: number;
}


// ======================================================
// PAGINATION
// ======================================================

export interface HomeworkSubmissionPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}


// ======================================================
// STATS
// ======================================================

export interface HomeworkSubmissionStats {
  totalSubmitted: number;

  onTimeSubmitted: number;

  lateSubmitted: number;

  reviewed: number;

  pendingReview: number;

  /*
    Student module complete hone ke baad
    backend se ye values bhi aa sakti hain:

    totalStudents?: number;
    pendingStudents?: number;
  */
}


// ======================================================
// API RESPONSES
// ======================================================

export interface HomeworkSubmissionListResponse {
  success: boolean;

  data: {
    submissions:
      HomeworkSubmission[];

    pagination?:
      HomeworkSubmissionPagination;
  };
}


export interface HomeworkSubmissionDetailsResponse {
  success: boolean;

  data: {
    submission:
      HomeworkSubmission | null;
  };
}


export interface HomeworkSubmissionCreateResponse {
  success: boolean;

  message: string;

  data: {
    submission:
      HomeworkSubmission;
  };
}


export interface HomeworkSubmissionUpdateResponse {
  success: boolean;

  message: string;

  data: {
    submission:
      HomeworkSubmission;
  };
}


export interface HomeworkSubmissionStatsResponse {
  success: boolean;

  data: {
    stats:
      HomeworkSubmissionStats;
  };
}


export interface HomeworkSubmissionDeleteResponse {
  success: boolean;
  message: string;
}