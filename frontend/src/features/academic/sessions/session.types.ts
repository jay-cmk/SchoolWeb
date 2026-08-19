




// export interface AcademicSession {
//   _id: string;
//   schoolId: string;
//   name: string;
//   startDate: string;
//   endDate: string;
//   academicStatus: 'ACTIVE' | 'COMPLETED' | 'UPCOMING';
//   isCurrent: boolean;
//   createdAt: string;
//   updatedAt: string;
//   stats?: {
//     classes: number;
//     sections: number;
//     students: number;
//     subjects: number;
//   };
//   classes?: any[];
//   sections?: any[];
//   students?: any[];
// }

// export interface CreateSessionPayload {
//   name: string;
//   startDate: string;
//   endDate: string;
//   academicStatus: 'ACTIVE' | 'COMPLETED' | 'UPCOMING';
// }

// export interface UpdateSessionPayload {
//   name?: string;
//   startDate?: string;
//   endDate?: string;
//   academicStatus?: 'ACTIVE' | 'COMPLETED' | 'UPCOMING';
// }




export type AcademicStatus =
  | "ACTIVE"
  | "UPCOMING"
  | "COMPLETED";

export interface AcademicSession {
  _id: string;
  schoolId: string;

  name: string;
  startDate: string;
  endDate: string;

  isCurrent: boolean;

  academicStatus: AcademicStatus;

  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionPayload {
  name: string;
  startDate: string;
  endDate: string;
}

export interface UpdateSessionPayload {
  name?: string;
  startDate?: string;
  endDate?: string;
}

export interface SessionResponse {
  success: boolean;
  message: string;

  data: {
    session: AcademicSession;
  };
}

export interface SessionsResponse {
  success: boolean;
  message: string;

  data: {
    sessions: AcademicSession[];
  };
}