/* =====================================================
   PROMOTION DECISION
===================================================== */

export type StudentPromotionDecision =
  | "PROMOTED"
  | "RETAINED"
  | "TRANSFERRED"
  | "LEFT"
  | "GRADUATED";


/* =====================================================
   SINGLE STUDENT PROMOTION ITEM
===================================================== */

export interface IStudentPromotionItem {

  studentId: string;

  decision:
    StudentPromotionDecision;

  /*
   * PROMOTED / RETAINED ke case me
   * target class + section required honge.
   *
   * LEFT / TRANSFERRED / GRADUATED ke case
   * me target enrollment create nahi hoga.
   */

  targetClassId?: string;

  targetSectionId?: string;

  rollNumber?: number;

  remarks?: string;
}


/* =====================================================
   BULK PROMOTION REQUEST
===================================================== */

export interface IBulkStudentPromotionRequest {

  sourceSessionId: string;

  targetSessionId: string;

  students:
    IStudentPromotionItem[];
}


/* =====================================================
   SINGLE PROMOTION REQUEST
===================================================== */

export interface ISingleStudentPromotionRequest {

  sourceSessionId: string;

  targetSessionId: string;

  decision:
    StudentPromotionDecision;

  targetClassId?: string;

  targetSectionId?: string;

  rollNumber?: number;

  remarks?: string;
}


/* =====================================================
   PROMOTION PREVIEW STUDENT
===================================================== */

export interface IPromotionPreviewStudent {

  studentId: string;

  studentName: string;

  admissionNumber: string;

  currentEnrollmentId: string;

  decision:
    StudentPromotionDecision;

  valid: boolean;

  errors: string[];

  source: {

    sessionId: string;

    classId: string;

    sectionId: string;

    rollNumber?: number;
  };

  target?: {

    sessionId: string;

    classId: string;

    sectionId: string;

    rollNumber?: number;
  };
}


/* =====================================================
   PROMOTION PREVIEW RESULT
===================================================== */

export interface IPromotionPreviewResult {

  total: number;

  valid: number;

  invalid: number;

  canPromote: boolean;

  students:
    IPromotionPreviewStudent[];
}


/* =====================================================
   BULK PROMOTION SUMMARY
===================================================== */

export interface IBulkPromotionSummary {

  total: number;

  promoted: number;

  retained: number;

  transferred: number;

  left: number;

  graduated: number;

  failed: number;
}