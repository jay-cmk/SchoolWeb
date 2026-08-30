export const HomeworkStatus = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  CLOSED: "CLOSED",
} as const;

export type HomeworkStatus =
  (typeof HomeworkStatus)[keyof typeof HomeworkStatus];

export interface HomeworkAttachment {
  fileName: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: number;
}

export interface Homework {
  _id: string;

  schoolId?: string;

  sessionId: string | {
    _id: string;
    name?: string;
    sessionName?: string;
  };

  classId: string | {
    _id: string;
    name: string;
  };

  sectionId: string | {
    _id: string;
    name: string;
  };

  subjectId: string | {
    _id: string;
    name: string;
  };

  teacherId: string | {
    _id: string;
    name: string;
    email?: string;
  };

  title: string;
  description: string;

  assignedDate: string;
  dueDate: string;

  attachment?: HomeworkAttachment;

  status: HomeworkStatus;

  createdBy?: string;
  updatedBy?: string;

  isActive?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateHomeworkData {
  sessionId: string;
  classId: string;
  sectionId: string;
  subjectId: string;
  teacherId: string;

  title: string;
  description: string;

  assignedDate: string;
  dueDate: string;

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

  assignedDate?: string;
  dueDate?: string;

  status?: HomeworkStatus;

  attachment?: HomeworkAttachment | null;
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

export interface HomeworkPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface HomeworkStats {
  total: number;
  active: number;
  overdue: number;
  draft: number;
  closed: number;
}

export interface HomeworkListResponse {
  success: boolean;

  data: {
    homeworks: Homework[];
    pagination?: HomeworkPagination;
  };
}

export interface HomeworkDetailsResponse {
  success: boolean;

  data: {
    homework: Homework;
  };
}

export interface HomeworkStatsResponse {
  success: boolean;

  data: {
    stats: HomeworkStats;
  };
}

export interface HomeworkCreateResponse {
  success: boolean;
  message: string;

  data: {
    homework: Homework;
  };
}

export interface HomeworkUpdateResponse {
  success: boolean;
  message: string;

  data: {
    homework: Homework;
  };
}

export interface HomeworkDeleteResponse {
  success: boolean;
  message: string;
}