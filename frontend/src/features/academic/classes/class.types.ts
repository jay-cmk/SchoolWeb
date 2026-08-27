// ============================================
// CLASS TYPES (class.types.ts)
// ============================================


// ============================================
// CLASS DATA
// Backend se jo complete class object aayega
// ============================================

export interface ClassData {
  _id: string;

  schoolId: string;
  sessionId: string;

  name: string;

  order?: number;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}


// ============================================
// CREATE CLASS PAYLOAD
// POST /academic/classes
// ============================================

export interface CreateClassPayload {
  sessionId: string;

  name: string;

  order?: number;
}


// ============================================
// UPDATE CLASS PAYLOAD
// PUT /academic/classes/:classId
// ============================================

export interface UpdateClassPayload {
  name?: string;

  order?: number;
}


// ============================================
// UPDATE CLASS STATUS PAYLOAD
// PATCH /academic/classes/:classId/status
// ============================================

export interface UpdateClassStatusPayload {
  classId: string;

  isActive: boolean;
}


// ============================================
// SINGLE CLASS API RESPONSE
//
// Used in:
// POST   /academic/classes
// GET    /academic/classes/:classId
// PUT    /academic/classes/:classId
// PATCH  /academic/classes/:classId/status
// ============================================

export interface ClassResponse {
  success: boolean;

  message: string;

  data: {
    class: ClassData;
  };
}


// ============================================
// GET ALL CLASSES RESPONSE
// GET /academic/classes
// ============================================

export interface ClassesResponse {
  success: boolean;

  message: string;

  data: {
    classes: ClassData[];
  };
}


// ============================================
// CLASS REDUX STATE
// ============================================

export interface ClassState {
  classes: ClassData[];

  selectedClass: ClassData | null;

  loading: boolean;

  error: string | null;
}