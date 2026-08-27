export interface CreateSubjectAssignmentData {
  sessionId: string;
  subjectId: string;
  classId: string;
  sectionId: string;
  teacherId: string;

  weeklyPeriods: number;
}

export interface UpdateSubjectAssignmentData {
  teacherId?: string;

  weeklyPeriods?: number;
}