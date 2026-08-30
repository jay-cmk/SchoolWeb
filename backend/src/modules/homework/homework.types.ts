export enum HomeworkStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  CLOSED = "CLOSED",
}


export interface HomeworkAttachment {
  fileName: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: number;
}


export interface CreateHomeworkData {
  sessionId: string;

  classId: string;

  sectionId: string;

  subjectId: string;

  teacherId: string;

  title: string;

  description: string;

  assignedDate: Date | string;

  dueDate: Date | string;

  status?: HomeworkStatus;

  attachment?: HomeworkAttachment;
}


export interface UpdateHomeworkData {
  sessionId?: string;

  classId?: string;

  sectionId?: string;

  subjectId?: string;

  teacherId?: string;

  title?: string;

  description?: string;

  assignedDate?: Date | string;

  dueDate?: Date | string;

  status?: HomeworkStatus;

  attachment?:
    | HomeworkAttachment
    | null;
}


export interface HomeworkFilters {
  sessionId?: string;

  classId?: string;

  sectionId?: string;

  subjectId?: string;

  teacherId?: string;

  status?: HomeworkStatus;

  fromDate?: string;

  toDate?: string;

  search?: string;

  page?: number;

  limit?: number;
}