// ============================================
// CLASS TYPES (class.types.ts)
// ============================================


// ============================================
// CLASS DATA
// Backend se jo class object return hoga
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
// POST /api/v1/academic/classes
// ============================================

export interface CreateClassPayload {
  sessionId: string;

  name: string;

  order?: number;
}


// ============================================
// UPDATE CLASS PAYLOAD
// PUT /api/v1/academic/classes/:classId
// ============================================

export interface UpdateClassPayload {
  name?: string;

  order?: number;
}


// ============================================
// UPDATE CLASS STATUS PAYLOAD
// PATCH /api/v1/academic/classes/:classId/status
// ============================================

export interface UpdateClassStatusPayload {
  classId: string;

  isActive: boolean;
}


// ============================================
// GET CLASSES PARAMS
// GET /api/v1/academic/classes
// GET /api/v1/academic/classes?sessionId=...
// ============================================

export interface GetClassesParams {
  sessionId?: string;
}


// ============================================
// SINGLE CLASS RESPONSE
// Used by:
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
// CLASSES LIST RESPONSE
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
// REDUX STATE
// ============================================

export interface ClassState {
  classes: ClassData[];

  selectedClass: ClassData | null;

  loading: boolean;

  error: string | null;
}