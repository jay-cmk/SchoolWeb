export type SubjectType =
  | "CORE"
  | "LANGUAGE"
  | "PRACTICAL"
  | "ELECTIVE";

export interface CreateSubjectData {
  sessionId: string;

  name: string;

  code: string;

  description?: string;

  subjectType: SubjectType;
}

export interface UpdateSubjectData {
  name?: string;

  code?: string;

  description?: string;

  subjectType?: SubjectType;
}