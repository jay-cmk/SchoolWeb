// // ============================================
// // DAY
// // ============================================

// // ============================================
// // DAY
// // ============================================

// export const TimetableDay = {
//   MONDAY: "MONDAY",
//   TUESDAY: "TUESDAY",
//   WEDNESDAY: "WEDNESDAY",
//   THURSDAY: "THURSDAY",
//   FRIDAY: "FRIDAY",
//   SATURDAY: "SATURDAY",
// } as const;

// export type TimetableDay =
//   (typeof TimetableDay)[
//     keyof typeof TimetableDay
//   ];


// // ============================================
// // PERIOD TYPE
// // ============================================

// export const TimetablePeriodType = {
//   REGULAR: "REGULAR",
//   BREAK: "BREAK",
//   LUNCH: "LUNCH",
//   ACTIVITY: "ACTIVITY",
// } as const;

// export type TimetablePeriodType =
//   (typeof TimetablePeriodType)[
//     keyof typeof TimetablePeriodType
//   ];


// // ============================================
// // POPULATED BASIC TYPES
// // ============================================

// export interface TimetableSession {
//   _id: string;
//   name: string;
//   startDate?: string;
//   endDate?: string;
//   isCurrent?: boolean;
// }


// export interface TimetableClass {
//   _id: string;
//   name: string;
// }


// export interface TimetableSection {
//   _id: string;
//   name: string;
// }


// export interface TimetableSubject {
//   _id: string;
//   name: string;
//   code?: string;
// }


// export interface TimetableTeacher {
//   _id: string;
//   name: string;
//   employeeId?: string;
//   email?: string;
// }


// // ============================================
// // TIMETABLE
// // ============================================

// export interface Timetable {
//   _id: string;

//   schoolId: string;

//   sessionId:
//     | string
//     | TimetableSession;

//   classId:
//     | string
//     | TimetableClass;

//   sectionId:
//     | string
//     | TimetableSection;

//   day: TimetableDay;

//   periodNumber: number;

//   startTime: string;

//   endTime: string;

//   periodType:
//     TimetablePeriodType;

//   subjectId?:
//     | string
//     | TimetableSubject
//     | null;

//   teacherId?:
//     | string
//     | TimetableTeacher
//     | null;

//   roomNumber?: string;

//   isActive: boolean;

//   createdBy: string;

//   updatedBy?: string;

//   createdAt: string;

//   updatedAt: string;
// }


// // ============================================
// // CREATE
// // ============================================

// export interface CreateTimetableData {
//   sessionId: string;

//   classId: string;

//   sectionId: string;

//   day: TimetableDay;

//   periodNumber: number;

//   startTime: string;

//   endTime: string;

//   periodType:
//     TimetablePeriodType;

//   subjectId?: string;

//   teacherId?: string;

//   roomNumber?: string;
// }


// // ============================================
// // UPDATE
// // ============================================

// export interface UpdateTimetableData {
//   day?: TimetableDay;

//   periodNumber?: number;

//   startTime?: string;

//   endTime?: string;

//   periodType?:
//     TimetablePeriodType;

//   subjectId?:
//     string | null;

//   teacherId?:
//     string | null;

//   roomNumber?:
//     string | null;

//   isActive?: boolean;
// }


// // ============================================
// // FILTERS
// // ============================================

// export interface TimetableFilters {
//   sessionId?: string;

//   classId?: string;

//   sectionId?: string;

//   teacherId?: string;

//   subjectId?: string;

//   day?: TimetableDay;

//   periodType?:
//     TimetablePeriodType;

//   isActive?: boolean;
// }


// // ============================================
// // COPY
// // ============================================

// export interface CopyTimetableData {
//   sessionId: string;

//   sourceClassId: string;

//   sourceSectionId: string;

//   targetClassId: string;

//   targetSectionId: string;
// }


// // ============================================
// // COPY RESULT
// // ============================================

// export interface CopyTimetableResult {
//   copied: number;

//   skipped: number;

//   conflicts: string[];
// }


// // ============================================
// // API RESPONSE
// // ============================================

// export interface TimetableListResponse {
//   success: boolean;

//   message: string;

//   data: {
//     timetable: Timetable[];
//   };
// }


// export interface TimetableSingleResponse {
//   success: boolean;

//   message: string;

//   data: {
//     timetable: Timetable;
//   };
// }


// export interface CopyTimetableResponse {
//   success: boolean;

//   message: string;

//   data: CopyTimetableResult;
// }













// ============================================
// TIMETABLE TYPES
// ============================================


// ============================================
// DAY
// ============================================

export const TimetableDay = {
  MONDAY: "MONDAY",
  TUESDAY: "TUESDAY",
  WEDNESDAY: "WEDNESDAY",
  THURSDAY: "THURSDAY",
  FRIDAY: "FRIDAY",
  SATURDAY: "SATURDAY",
} as const;

export type TimetableDay =
  (typeof TimetableDay)[
    keyof typeof TimetableDay
  ];


// ============================================
// PERIOD TYPE
// ============================================

export const TimetablePeriodType = {
  REGULAR: "REGULAR",
  BREAK: "BREAK",
  LUNCH: "LUNCH",
  ACTIVITY: "ACTIVITY",
} as const;

export type TimetablePeriodType =
  (typeof TimetablePeriodType)[
    keyof typeof TimetablePeriodType
  ];


// ============================================
// POPULATED BASIC TYPES
// ============================================

export interface TimetableSession {
  _id: string;

  name: string;

  startDate?: string;

  endDate?: string;

  isCurrent?: boolean;
}


export interface TimetableClass {
  _id: string;

  name: string;
}


export interface TimetableSection {
  _id: string;

  name: string;
}


export interface TimetableSubject {
  _id: string;

  name: string;

  code?: string;
}


export interface TimetableTeacher {
  _id: string;

  name: string;

  employeeId?: string;

  email?: string;
}


// ============================================
// TIMETABLE
// ============================================

export interface Timetable {
  _id: string;

  schoolId: string;

  sessionId:
    | string
    | TimetableSession;

  classId:
    | string
    | TimetableClass;

  sectionId:
    | string
    | TimetableSection;

  day: TimetableDay;

  periodNumber: number;

  startTime: string;

  endTime: string;

  periodType:
    TimetablePeriodType;

  subjectId?:
    | string
    | TimetableSubject
    | null;

  teacherId?:
    | string
    | TimetableTeacher
    | null;

  roomNumber?: string;

  isActive: boolean;

  createdBy: string;

  updatedBy?: string;

  createdAt: string;

  updatedAt: string;
}


// ============================================
// CREATE
// ============================================

export interface CreateTimetableData {
  sessionId: string;

  classId: string;

  sectionId: string;

  day: TimetableDay;

  periodNumber: number;

  startTime: string;

  endTime: string;

  periodType:
    TimetablePeriodType;

  subjectId?: string;

  teacherId?: string;

  roomNumber?: string;
}


// ============================================
// UPDATE
// ============================================

export interface UpdateTimetableData {
  day?: TimetableDay;

  periodNumber?: number;

  startTime?: string;

  endTime?: string;

  periodType?:
    TimetablePeriodType;

  subjectId?:
    string | null;

  teacherId?:
    string | null;

  roomNumber?:
    string | null;

  isActive?: boolean;
}


// ============================================
// ADMIN TIMETABLE FILTERS
// ============================================

export interface TimetableFilters {
  sessionId?: string;

  classId?: string;

  sectionId?: string;

  teacherId?: string;

  subjectId?: string;

  day?: TimetableDay;

  periodType?:
    TimetablePeriodType;

  isActive?: boolean;
}


// ============================================
// TEACHER MY TIMETABLE FILTERS
//
// GET /timetable/teacher/me
// GET /timetable/teacher/me?day=MONDAY
// ============================================

export interface MyTimetableFilters {
  day?: TimetableDay;
}


// ============================================
// COPY
// ============================================

export interface CopyTimetableData {
  sessionId: string;

  sourceClassId: string;

  sourceSectionId: string;

  targetClassId: string;

  targetSectionId: string;
}


// ============================================
// COPY RESULT
// ============================================

export interface CopyTimetableResult {
  copied: number;

  skipped: number;

  conflicts: string[];
}


// ============================================
// API RESPONSE
// ============================================

export interface TimetableListResponse {
  success: boolean;

  message: string;

  data: {
    timetable: Timetable[];
  };
}


export interface TimetableSingleResponse {
  success: boolean;

  message: string;

  data: {
    timetable: Timetable;
  };
}


export interface CopyTimetableResponse {
  success: boolean;

  message: string;

  data: CopyTimetableResult;
}