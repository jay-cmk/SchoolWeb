// ============================================
// SUBJECT TYPES
// ============================================

export type SubjectType =
  | "CORE"
  | "LANGUAGE"
  | "PRACTICAL"
  | "ELECTIVE";


export interface SubjectData {
  _id: string;

  schoolId: string;
  sessionId: string;

  name: string;
  code: string;

  description?: string;

  subjectType: SubjectType;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}


// ============================================
// CREATE
// ============================================

export interface CreateSubjectPayload {
  sessionId: string;

  name: string;
  code: string;

  description?: string;

  subjectType: SubjectType;
}


// ============================================
// UPDATE
// ============================================

export interface UpdateSubjectPayload {
  name?: string;
  code?: string;

  description?: string;

  subjectType?: SubjectType;
}


// ============================================
// FILTERS
// ============================================

export interface GetSubjectsParams {
  sessionId?: string;

  subjectType?: SubjectType;

  isActive?: boolean;
}


// ============================================
// SINGLE RESPONSE
// ============================================

export interface SubjectResponse {
  success: boolean;

  message: string;

  data: {
    subject: SubjectData;
  };
}


// ============================================
// LIST RESPONSE
// ============================================

export interface SubjectsResponse {
  success: boolean;

  message: string;

  data: {
    subjects: SubjectData[];
  };
}


// ============================================
// REDUX STATE
// ============================================

export interface SubjectState {
  subjects: SubjectData[];

  selectedSubject:
    | SubjectData
    | null;

  loading: boolean;

  error: string | null;
}