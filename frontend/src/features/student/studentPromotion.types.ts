// ==========================================
// COMMON TYPES
// ==========================================

export type StudentPromotionDecision =
  | "PROMOTED"
  | "RETAINED"
  | "TRANSFERRED"
  | "LEFT"
  | "GRADUATED";


export type EnrollmentStatus =
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED";


export type EnrollmentPromotionStatus =
  | "NOT_DECIDED"
  | "PROMOTED"
  | "RETAINED"
  | "TRANSFERRED"
  | "LEFT"
  | "GRADUATED";

export type StudentStream =
  | "SCIENCE"
  | "COMMERCE"
  | "ARTS"
  | "VOCATIONAL";
// ==========================================
// POPULATED STUDENT
// ==========================================

export interface PromotionCandidateStudent {
  _id: string;

  admissionNumber: string;

  name: string;

  gender?: string;

  status: string;
}


// ==========================================
// POPULATED SESSION
// ==========================================

export interface PromotionSession {
  _id: string;

  name: string;

  startDate?: string;

  endDate?: string;

  isCurrent?: boolean;
}


// ==========================================
// POPULATED CLASS
// ==========================================

export interface PromotionClass {
  _id: string;

  name: string;

  order?: number;

  isActive?: boolean;
}


// ==========================================
// POPULATED SECTION
// ==========================================

export interface PromotionSection {
  _id: string;

  name: string;

  roomNumber?: string;

  capacity?: number;

  isActive?: boolean;
}


// ==========================================
// STUDENT ENROLLMENT
// ==========================================

export interface StudentEnrollment {
  _id: string;

  schoolId: string;

  studentId:
    | string
    | PromotionCandidateStudent;

  sessionId:
    | string
    | PromotionSession;

  classId:
    | string
    | PromotionClass;

  sectionId:
    | string
    | PromotionSection;

  rollNumber?: number;

  enrollmentStatus: EnrollmentStatus;

  promotionStatus: EnrollmentPromotionStatus;

  promotedFromEnrollmentId?:
    | string
    | StudentEnrollment;

  promotionDate?: string;

  remarks?: string;

  createdBy: string;

  updatedBy?: string;

  createdAt: string;

  updatedAt: string;
  stream?: StudentStream;

}


// ==========================================
// PROMOTION CANDIDATE
// ==========================================

export interface PromotionCandidate {
  _id: string;

  schoolId: string;

  studentId: PromotionCandidateStudent;

  sessionId: PromotionSession;

  classId: PromotionClass;

  sectionId: PromotionSection;

  rollNumber?: number;

  enrollmentStatus: EnrollmentStatus;

  promotionStatus: EnrollmentPromotionStatus;

  promotedFromEnrollmentId?: string;

  promotionDate?: string;

  remarks?: string;

  createdBy: string;

  updatedBy?: string;

  createdAt: string;

  updatedAt: string;

  stream?: StudentStream;

}


// ==========================================
// CANDIDATE FILTERS
// ==========================================

export interface PromotionCandidateFilters {
  sessionId: string;

  classId: string;

  sectionId?: string;
}


// ==========================================
// ONE STUDENT PROMOTION ITEM
// ==========================================

export interface StudentPromotionItem {
  studentId: string;

  decision: StudentPromotionDecision;

  targetClassId?: string;

  targetSectionId?: string;

  rollNumber?: number;

  remarks?: string;
}


// ==========================================
// BULK PROMOTION REQUEST
// ==========================================

export interface BulkStudentPromotionRequest {
  sourceSessionId: string;

  targetSessionId: string;

  students: StudentPromotionItem[];
}


// ==========================================
// SINGLE PROMOTION REQUEST
// ==========================================

export interface SingleStudentPromotionRequest {
  sourceSessionId: string;

  targetSessionId: string;

  decision: StudentPromotionDecision;

  targetClassId?: string;

  targetSectionId?: string;

  rollNumber?: number;

  remarks?: string;
}


// ==========================================
// PREVIEW SOURCE
// ==========================================

export interface PromotionPreviewSource {
  sessionId: string;

  classId: string;

  sectionId: string;

  rollNumber?: number;
}


// ==========================================
// PREVIEW TARGET
// ==========================================

export interface PromotionPreviewTarget {
  sessionId: string;

  classId: string;

  sectionId: string;

  rollNumber?: number;
}


// ==========================================
// PREVIEW STUDENT
// ==========================================

export interface PromotionPreviewStudent {
  studentId: string;

  studentName: string;

  admissionNumber: string;

  currentEnrollmentId: string;

  decision: StudentPromotionDecision;

  valid: boolean;

  errors: string[];

  source: PromotionPreviewSource;

  target?: PromotionPreviewTarget;
}


// ==========================================
// PREVIEW RESULT
// ==========================================

export interface PromotionPreviewResult {
  total: number;

  valid: number;

  invalid: number;

  canPromote: boolean;

  students: PromotionPreviewStudent[];
}


// ==========================================
// BULK / SINGLE PROMOTION RESULT
// ==========================================

export interface BulkPromotionSummary {
  total: number;

  promoted: number;

  retained: number;

  transferred: number;

  left: number;

  graduated: number;

  failed: number;
}


// ==========================================
// UPDATE ENROLLMENT REQUEST
// ==========================================

export interface UpdateStudentEnrollmentData {
  classId?: string;

  sectionId?: string;

  rollNumber?: number;

  stream?: StudentStream | null;

  remarks?: string;
}


// ==========================================
// FRONTEND PROMOTION TABLE ROW
// ==========================================

export interface PromotionStudentRow {
  studentId: string;

  admissionNumber: string;

  name: string;

  currentClassId: string;

  currentClassName: string;

  currentSectionId: string;

  currentSectionName: string;

  currentRollNumber?: number;

  selected: boolean;

  decision: StudentPromotionDecision;

  targetClassId?: string;

  targetSectionId?: string;

  rollNumber?: number;

  remarks?: string;
}


// ==========================================
// ROLL ASSIGNMENT MODE
// ==========================================

export type RollAssignmentMode =
  | "AUTO"
  | "KEEP_PREVIOUS"
  | "MANUAL";