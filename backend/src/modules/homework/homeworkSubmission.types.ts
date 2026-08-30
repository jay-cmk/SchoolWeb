export enum HomeworkSubmissionStatus {
  SUBMITTED = "SUBMITTED",
  LATE = "LATE",
}

export enum HomeworkReviewStatus {
  PENDING = "PENDING",
  REVIEWED = "REVIEWED",
}


export interface SubmissionAttachment {
  fileName: string;

  fileUrl: string;

  fileType?: string;

  fileSize?: number;
}


export interface CreateHomeworkSubmissionData {
  homeworkId: string;

  studentId: string;

  submissionText?: string;

  attachment?: SubmissionAttachment;
}


export interface UpdateHomeworkSubmissionData {
  submissionText?: string;

  attachment?:
    | SubmissionAttachment
    | null;
}


export interface ReviewHomeworkSubmissionData {
  remarks?: string;

  marks?: number;
}


export interface HomeworkSubmissionFilters {
  homeworkId?: string;

  studentId?: string;

  submissionStatus?: HomeworkSubmissionStatus;

  reviewStatus?: HomeworkReviewStatus;

  search?: string;

  page?: number;

  limit?: number;
}