// export const HomeworkStatus = {
//   DRAFT: "DRAFT",
//   PUBLISHED: "PUBLISHED",
//   CLOSED: "CLOSED",
// } as const;

// export type HomeworkStatus =
//   (typeof HomeworkStatus)[keyof typeof HomeworkStatus];

// export interface HomeworkAttachment {
//   fileName: string;
//   fileUrl: string;
//   fileType?: string;
//   fileSize?: number;
// }

// export interface Homework {
//   _id: string;

//   schoolId?: string;

//   sessionId: string | {
//     _id: string;
//     name?: string;
//     sessionName?: string;
//   };

//   classId: string | {
//     _id: string;
//     name: string;
//   };

//   sectionId: string | {
//     _id: string;
//     name: string;
//   };

//   subjectId: string | {
//     _id: string;
//     name: string;
//   };

//   teacherId: string | {
//     _id: string;
//     name: string;
//     email?: string;
//   };

//   title: string;
//   description: string;

//   assignedDate: string;
//   dueDate: string;

//   attachment?: HomeworkAttachment;

//   status: HomeworkStatus;

//   createdBy?: string;
//   updatedBy?: string;

//   isActive?: boolean;

//   createdAt?: string;
//   updatedAt?: string;
// }

// export interface CreateHomeworkData {
//   sessionId: string;
//   classId: string;
//   sectionId: string;
//   subjectId: string;
//   teacherId: string;

//   title: string;
//   description: string;

//   assignedDate: string;
//   dueDate: string;

//   status?: HomeworkStatus;

//   attachment?: HomeworkAttachment;
// }

// export interface UpdateHomeworkData {
//   sessionId?: string;
//   classId?: string;
//   sectionId?: string;
//   subjectId?: string;
//   teacherId?: string;

//   title?: string;
//   description?: string;

//   assignedDate?: string;
//   dueDate?: string;

//   status?: HomeworkStatus;

//   attachment?: HomeworkAttachment | null;
// }

// export interface HomeworkFilters {
//   sessionId?: string;
//   classId?: string;
//   sectionId?: string;
//   subjectId?: string;
//   teacherId?: string;

//   status?: HomeworkStatus;

//   fromDate?: string;
//   toDate?: string;

//   search?: string;

//   page?: number;
//   limit?: number;
// }

// export interface HomeworkPagination {
//   page: number;
//   limit: number;
//   total: number;
//   totalPages: number;
// }

// export interface HomeworkStats {
//   total: number;
//   active: number;
//   overdue: number;
//   draft: number;
//   closed: number;
// }

// export interface HomeworkListResponse {
//   success: boolean;

//   data: {
//     homeworks: Homework[];
//     pagination?: HomeworkPagination;
//   };
// }

// export interface HomeworkDetailsResponse {
//   success: boolean;

//   data: {
//     homework: Homework;
//   };
// }

// export interface HomeworkStatsResponse {
//   success: boolean;

//   data: {
//     stats: HomeworkStats;
//   };
// }

// export interface HomeworkCreateResponse {
//   success: boolean;
//   message: string;

//   data: {
//     homework: Homework;
//   };
// }

// export interface HomeworkUpdateResponse {
//   success: boolean;
//   message: string;

//   data: {
//     homework: Homework;
//   };
// }

// export interface HomeworkDeleteResponse {
//   success: boolean;
//   message: string;
// }




// ======================================================
// HOMEWORK TYPES
// ======================================================


// ======================================================
// HOMEWORK STATUS
// ======================================================

export const HomeworkStatus = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  CLOSED: "CLOSED",
} as const;

export type HomeworkStatus =
  (typeof HomeworkStatus)[
    keyof typeof HomeworkStatus
  ];


// ======================================================
// ATTACHMENT
// ======================================================

export interface HomeworkAttachment {
  fileName: string;

  fileUrl: string;

  fileType?: string;

  fileSize?: number;
}


// ======================================================
// POPULATED SESSION
// ======================================================

export interface HomeworkSession {
  _id: string;

  name?: string;

  sessionName?: string;
}


// ======================================================
// POPULATED CLASS
// ======================================================

export interface HomeworkClass {
  _id: string;

  name: string;
}


// ======================================================
// POPULATED SECTION
// ======================================================

export interface HomeworkSection {
  _id: string;

  name: string;
}


// ======================================================
// POPULATED SUBJECT
// ======================================================

export interface HomeworkSubject {
  _id: string;

  name: string;

  code?: string;
}


// ======================================================
// POPULATED TEACHER
// ======================================================

export interface HomeworkTeacher {
  _id: string;

  name: string;

  email?: string;

  employeeId?: string;

  profileImage?: string;
}


// ======================================================
// HOMEWORK
// ======================================================

export interface Homework {
  _id: string;

  schoolId?: string;

  sessionId:
    | string
    | HomeworkSession;

  classId:
    | string
    | HomeworkClass;

  sectionId:
    | string
    | HomeworkSection;

  subjectId:
    | string
    | HomeworkSubject;

  teacherId:
    | string
    | HomeworkTeacher;

  title: string;

  description: string;

  assignedDate: string;

  dueDate: string;

  attachment?:
    HomeworkAttachment;

  status:
    HomeworkStatus;

  createdBy?: string;

  updatedBy?: string;

  isActive?: boolean;

  createdAt?: string;

  updatedAt?: string;
}


// ======================================================
// CREATE HOMEWORK
//
// SCHOOL_ADMIN:
// teacherId provide karega.
//
// TEACHER:
// teacherId frontend se dene ki zarurat nahi.
// Backend JWT teacherId use karega.
// ======================================================

export interface CreateHomeworkData {
  sessionId: string;

  classId: string;

  sectionId: string;

  subjectId: string;

  teacherId?: string;

  title: string;

  description: string;

  assignedDate: string;

  dueDate: string;

  status?: HomeworkStatus;

  attachment?:
    HomeworkAttachment;
}


// ======================================================
// UPDATE HOMEWORK
//
// Backend Teacher ko sirf apna homework
// update karne dega.
// ======================================================

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

  attachment?:
    HomeworkAttachment | null;
}


// ======================================================
// HOMEWORK FILTERS
//
// SCHOOL_ADMIN:
// normal filters.
//
// TEACHER:
// backend automatically logged-in teacher
// ke homework tak scope karega.
// ======================================================

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


// ======================================================
// PAGINATION
// ======================================================

export interface HomeworkPagination {
  page: number;

  limit: number;

  total: number;

  totalPages: number;
}


// ======================================================
// STATS
// ======================================================

export interface HomeworkStats {
  total: number;

  active: number;

  overdue: number;

  draft: number;

  closed: number;
}


// ======================================================
// HOMEWORK LIST DATA
// ======================================================

export interface HomeworkListData {
  homeworks:
    Homework[];

  pagination?:
    HomeworkPagination;
}


// ======================================================
// HOMEWORK LIST RESPONSE
// ======================================================

export interface HomeworkListResponse {
  success: boolean;

  message?: string;

  data: {
    homeworks:
      Homework[];

    pagination?:
      HomeworkPagination;
  };
}


// ======================================================
// HOMEWORK DETAILS RESPONSE
// ======================================================

export interface HomeworkDetailsResponse {
  success: boolean;

  message?: string;

  data: {
    homework:
      Homework;
  };
}


// ======================================================
// HOMEWORK STATS RESPONSE
// ======================================================

export interface HomeworkStatsResponse {
  success: boolean;

  message?: string;

  data: {
    stats:
      HomeworkStats;
  };
}


// ======================================================
// CREATE RESPONSE
// ======================================================

export interface HomeworkCreateResponse {
  success: boolean;

  message: string;

  data: {
    homework:
      Homework;
  };
}


// ======================================================
// UPDATE RESPONSE
// ======================================================

export interface HomeworkUpdateResponse {
  success: boolean;

  message: string;

  data: {
    homework:
      Homework;
  };
}


// ======================================================
// DELETE RESPONSE
// ======================================================

export interface HomeworkDeleteResponse {
  success: boolean;

  message: string;
}


// ======================================================
// REDUX STATE
// ======================================================

export interface HomeworkState {
  homeworks:
    Homework[];

  selectedHomework:
    Homework | null;

  stats:
    HomeworkStats | null;

  pagination:
    HomeworkPagination | null;

  loading: boolean;

  saving: boolean;

  error: string | null;
}