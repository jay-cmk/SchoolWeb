

export type SubjectAssignmentType =
  | "CLASS"
  | "STREAM";

export type SubjectAssignmentStream =
  | "SCIENCE"
  | "COMMERCE"
  | "ARTS"
  | "VOCATIONAL";

export interface CreateSubjectAssignmentData {
  sessionId: string;
  subjectId: string;
  classId: string;
  sectionId: string;
  teacherId: string;
  assignmentType?: SubjectAssignmentType;
  stream?: SubjectAssignmentStream;
  weeklyPeriods: number;
}

export interface UpdateSubjectAssignmentData {
  teacherId?: string;
  assignmentType?: SubjectAssignmentType;
  stream?: SubjectAssignmentStream | null;
  weeklyPeriods?: number;
}

export interface GetSubjectAssignmentsFilters {
  sessionId?: string;
  subjectId?: string;
  classId?: string;
  sectionId?: string;
  teacherId?: string;
  assignmentType?: SubjectAssignmentType;
  stream?: SubjectAssignmentStream;
  isActive?: boolean;
}



export type AssignmentStream =
  | "SCIENCE"
  | "COMMERCE"
  | "ARTS"
  | "VOCATIONAL";