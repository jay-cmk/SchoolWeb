export interface CreateAcademicSessionData {
  name: string;
  startDate: Date;
  endDate: Date;
  isCurrent?: boolean;
}

export interface UpdateAcademicSessionData {
  name?: string;
  startDate?: Date;
  endDate?: Date;
  isCurrent?: boolean;
}


export interface AcademicSession {
  _id: string;
  schoolId: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;

  academicStatus:
    | "ACTIVE"
    | "UPCOMING"
    | "COMPLETED";

  createdAt: string;
  updatedAt: string;
}