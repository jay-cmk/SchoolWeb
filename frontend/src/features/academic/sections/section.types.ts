// ============================================
// SECTION TYPES
// ============================================

export interface SectionData {
  _id: string;

  schoolId: string;
  sessionId: string;
  classId: string;

  name: string;

  roomNumber?: string;
  capacity?: number;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}


// ============================================
// CREATE SECTION
// ============================================

export interface CreateSectionPayload {
  sessionId: string;
  classId: string;

  name: string;

  roomNumber?: string;
  capacity?: number;
}


// ============================================
// UPDATE SECTION
// ============================================

export interface UpdateSectionPayload {
  name?: string;

  roomNumber?: string;
  capacity?: number;
}


// ============================================
// GET SECTION FILTERS
// ============================================

export interface GetSectionsParams {
  sessionId?: string;
  classId?: string;
}


// ============================================
// SINGLE RESPONSE
// ============================================

export interface SectionResponse {
  success: boolean;

  message: string;

  data: {
    section: SectionData;
  };
}


// ============================================
// LIST RESPONSE
// ============================================

export interface SectionsResponse {
  success: boolean;

  message: string;

  data: {
    sections: SectionData[];
  };
}


// ============================================
// REDUX STATE
// ============================================

export interface SectionState {
  sections: SectionData[];

  selectedSection:
    | SectionData
    | null;

  loading: boolean;

  error: string | null;
}