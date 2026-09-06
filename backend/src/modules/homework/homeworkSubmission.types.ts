// export enum HomeworkSubmissionStatus {
//   SUBMITTED = "SUBMITTED",
//   LATE = "LATE",
// }

// export enum HomeworkReviewStatus {
//   PENDING = "PENDING",
//   REVIEWED = "REVIEWED",
// }


// export interface SubmissionAttachment {
//   fileName: string;

//   fileUrl: string;

//   fileType?: string;

//   fileSize?: number;
// }


// export interface CreateHomeworkSubmissionData {
//   homeworkId: string;

//   studentId: string;

//   submissionText?: string;

//   attachment?: SubmissionAttachment;
// }


// export interface UpdateHomeworkSubmissionData {
//   submissionText?: string;

//   attachment?:
//     | SubmissionAttachment
//     | null;
// }


// export interface ReviewHomeworkSubmissionData {
//   remarks?: string;

//   marks?: number;
// }


// export interface HomeworkSubmissionFilters {
//   homeworkId?: string;

//   studentId?: string;

//   submissionStatus?: HomeworkSubmissionStatus;

//   reviewStatus?: HomeworkReviewStatus;

//   search?: string;

//   page?: number;

//   limit?: number;
// }







export enum HomeworkSubmissionMode {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
}

export enum HomeworkSubmissionStatus {
  NOT_SUBMITTED = "NOT_SUBMITTED",
  SUBMITTED = "SUBMITTED",
  LATE = "LATE",
}

export enum HomeworkReviewStatus {
  PENDING = "PENDING",

  COMPLETED = "COMPLETED",
  INCOMPLETE = "INCOMPLETE",
  REDO_REQUIRED = "REDO_REQUIRED",

  // Legacy status.
  // Existing DB records ko break hone se bachane ke liye.
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
  reviewStatus: HomeworkReviewStatus;
  remarks?: string;
  marks?: number;
}

export interface OfflineHomeworkReviewData {
  studentId: string;

  reviewStatus: HomeworkReviewStatus;

  remarks?: string;

  marks?: number;
}

export interface BulkHomeworkReviewItem {
  studentId: string;

  reviewStatus: HomeworkReviewStatus;

  remarks?: string;

  marks?: number;
}

export interface BulkHomeworkReviewData {
  students: BulkHomeworkReviewItem[];
}

export interface HomeworkSubmissionFilters {
  homeworkId?: string;

  studentId?: string;

  submissionMode?: HomeworkSubmissionMode;

  submissionStatus?: HomeworkSubmissionStatus;

  reviewStatus?: HomeworkReviewStatus;

  search?: string;

  page?: number;

  limit?: number;
}