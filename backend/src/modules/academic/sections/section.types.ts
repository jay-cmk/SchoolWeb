// ============================================
// SECTION TYPES
// ============================================

export interface CreateSectionData {
  sessionId: string;
  classId: string;

  name: string;

  roomNumber?: string;
  capacity?: number;
}

export interface UpdateSectionData {
  name?: string;

  roomNumber?: string;
  capacity?: number;
}