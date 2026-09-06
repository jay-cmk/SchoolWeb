// ============================================
// DAY
// ============================================

export enum TimetableDay {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
}


// ============================================
// PERIOD TYPE
// ============================================

export enum TimetablePeriodType {
  REGULAR = "REGULAR",
  BREAK = "BREAK",
  LUNCH = "LUNCH",
  ACTIVITY = "ACTIVITY",
}


// ============================================
// CREATE PERIOD
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
// UPDATE PERIOD
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
// TIMETABLE FILTERS
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
// COPY TIMETABLE
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