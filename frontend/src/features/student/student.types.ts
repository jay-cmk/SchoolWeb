

// /* =====================================================
//    COMMON STUDENT RELATION
// ===================================================== */
// export interface StudentRelation {
//   _id: string;
//   name?: string;
// }


// /* =====================================================
//    ACADEMIC SESSION RELATION
// ===================================================== */

// export interface StudentSession
//   extends StudentRelation {

//   schoolId?: string;
//   startDate?: string;
//   endDate?: string;
//   isCurrent?: boolean;
//   createdAt?: string;
//   updatedAt?: string;
// }


// /* =====================================================
//    CLASS RELATION
// ===================================================== */

// export interface StudentClass
//   extends StudentRelation {

//   schoolId?: string;
//   sessionId?: string;
//   order?: number;
//   isActive?: boolean;
//   createdAt?: string;
//   updatedAt?: string;
// }


// /* =====================================================
//    SECTION RELATION
// ===================================================== */

// export interface StudentSection
//   extends StudentRelation {

//   schoolId?: string;
//   sessionId?: string;
//   classId?: string;
//   roomNumber?: string;
//   capacity?: number;
//   isActive?: boolean;
//   createdAt?: string;
//   updatedAt?: string;
// }


// /* =====================================================
//    STUDENT TYPES
// ===================================================== */

// export type StudentGender =
//   | "MALE"
//   | "FEMALE"
//   | "OTHER";


// export type StudentStatus =
//   | "ACTIVE"
//   | "INACTIVE"
//   | "TRANSFERRED"
//   | "PASSED"
//   | "LEFT";


// export type StudentBloodGroup =
//   | "A+"
//   | "A-"
//   | "B+"
//   | "B-"
//   | "AB+"
//   | "AB-"
//   | "O+"
//   | "O-";


// export type StudentCategory =
//   | "GENERAL"
//   | "OBC"
//   | "SC"
//   | "ST"
//   | "OTHER";


// export type AdmissionType =
//   | "NEW"
//   | "TRANSFER"
//   | "READMISSION";


// export type AdmissionCategory =
//   | "REGULAR"
//   | "RTE"
//   | "EWS"
//   | "MANAGEMENT"
//   | "OTHER";


// /* =====================================================
//    STUDENT ADDRESS
// ===================================================== */

// export interface StudentAddress {
//   addressLine?: string;
//   city?: string;
//   district?: string;
//   state?: string;
//   pincode?: string;
//   country?: string;
// }


// /* =====================================================
//    PARENT DETAILS
// ===================================================== */

// export interface StudentParentDetails {
//   name?: string;
//   mobile?: string;
//   aadhaarNumber?: string;
//   occupation?: string;
// }


// /* =====================================================
//    STUDENT
// ===================================================== */

// export interface Student {
//   _id: string;
//   schoolId: string;
//   userId?: string;

//   sessionId:
//     | string
//     | StudentSession;

//   classId:
//     | string
//     | StudentClass;

//   sectionId:
//     | string
//     | StudentSection;

//   admissionNumber: string;
//   rollNumber?: number;

//   admissionType?: AdmissionType;
//   admissionCategory?: AdmissionCategory;
//   admissionDate?: string;

//   name: string;
//   dob?: string;
//   gender?: StudentGender;

//   bloodGroup?: StudentBloodGroup;
//   religion?: string;
//   category?: StudentCategory;
//   caste?: string;
//   aadhaarNumber?: string;

//   photo?: string;

//   mobile?: string;
//   email?: string;

//   // OLD FIELD - keep for existing records
//   address?: StudentAddress;

//   currentAddress?: StudentAddress;
//   permanentAddress?: StudentAddress;

//   father?: StudentParentDetails;
//   mother?: StudentParentDetails;

//   parentId?: string;

//   status?: StudentStatus;

//   createdBy?: string;
//   updatedBy?: string;

//   createdAt?: string;
//   updatedAt?: string;
// }


// /* =====================================================
//    CREATE STUDENT DATA
// ===================================================== */

// export interface CreateStudentData {
//   name: string;
//   admissionNumber: string;

//   sessionId: string;
//   classId: string;
//   sectionId: string;

//   gender: StudentGender;

//   rollNumber?: number;

//   admissionType?: AdmissionType;
//   admissionCategory?: AdmissionCategory;
//   admissionDate?: string;

//   dob?: string;

//   bloodGroup?: StudentBloodGroup;
//   religion?: string;
//   category?: StudentCategory;
//   caste?: string;
//   aadhaarNumber?: string;

//   photo?: File;

//   mobile?: string;
//   email?: string;

//   // backward compatibility
//   address?: StudentAddress;

//   currentAddress?: StudentAddress;
//   permanentAddress?: StudentAddress;

//   father?: StudentParentDetails;
//   mother?: StudentParentDetails;

//   parentId?: string;
// }


// /* =====================================================
//    UPDATE STUDENT DATA
// ===================================================== */

// export interface UpdateStudentData {
//   name?: string;
//   admissionNumber?: string;

//   sessionId?: string;
//   classId?: string;
//   sectionId?: string;

//   rollNumber?: number;

//   admissionType?: AdmissionType;
//   admissionCategory?: AdmissionCategory;
//   admissionDate?: string;

//   dob?: string;
//   gender?: StudentGender;

//   bloodGroup?: StudentBloodGroup;
//   religion?: string;
//   category?: StudentCategory;
//   caste?: string;
//   aadhaarNumber?: string;

//   photo?: File;

//   mobile?: string;
//   email?: string;

//   address?: StudentAddress;
//   currentAddress?: StudentAddress;
//   permanentAddress?: StudentAddress;

//   father?: StudentParentDetails;
//   mother?: StudentParentDetails;

//   parentId?: string | null;

//   status?: StudentStatus;
// }


// /* =====================================================
//    STUDENT FILTERS
// ===================================================== */

// export interface StudentFilters {
//   sessionId?: string;
//   classId?: string;
//   sectionId?: string;
//   search?: string;
// }


// /* =====================================================
//    STUDENT PAGINATION
// ===================================================== */

// export interface StudentPagination {
//   page: number;
//   limit: number;
//   total: number;
//   totalPages: number;
// }


// /* =====================================================
//    STUDENTS RESPONSE
// ===================================================== */

// export interface StudentsResponse {
//   success: boolean;
//   data: Student[];
//   pagination?: StudentPagination;
// }


// /* =====================================================
//    STUDENT STATE
// ===================================================== */

// export interface StudentState {
//   students: Student[];
//   selectedStudent: Student | null;
//   loading: boolean;
//   error: string | null;
// }



/* =====================================================
   COMMON STUDENT RELATION
===================================================== */

export interface StudentRelation {
  _id: string;

  name?: string;
}


/* =====================================================
   ACADEMIC SESSION RELATION
===================================================== */

export interface StudentSession
  extends StudentRelation {
  schoolId?: string;

  startDate?: string;

  endDate?: string;

  isCurrent?: boolean;

  createdAt?: string;

  updatedAt?: string;
}


/* =====================================================
   CLASS RELATION
===================================================== */

export interface StudentClass
  extends StudentRelation {
  schoolId?: string;

  sessionId?: string;

  order?: number;

  isActive?: boolean;

  createdAt?: string;

  updatedAt?: string;
}


/* =====================================================
   SECTION RELATION
===================================================== */

export interface StudentSection
  extends StudentRelation {
  schoolId?: string;

  sessionId?: string;

  classId?: string;

  roomNumber?: string;

  capacity?: number;

  isActive?: boolean;

  createdAt?: string;

  updatedAt?: string;
}


/* =====================================================
   STUDENT TYPES
===================================================== */

export type StudentGender =
  | "MALE"
  | "FEMALE"
  | "OTHER";


export type StudentStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "TRANSFERRED"
  | "PASSED"
  | "LEFT";


export type StudentBloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";


export type StudentCategory =
  | "GENERAL"
  | "OBC"
  | "SC"
  | "ST"
  | "OTHER";


export type AdmissionType =
  | "NEW"
  | "TRANSFER"
  | "READMISSION";


export type AdmissionCategory =
  | "REGULAR"
  | "RTE"
  | "EWS"
  | "MANAGEMENT"
  | "OTHER";


/* =====================================================
   STUDENT ENROLLMENT TYPES
===================================================== */

export type StudentEnrollmentStatus =
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED";


export type StudentPromotionStatus =
  | "NOT_DECIDED"
  | "PROMOTED"
  | "RETAINED"
  | "TRANSFERRED"
  | "LEFT"
  | "GRADUATED";


/* =====================================================
   STUDENT ADDRESS
===================================================== */

export interface StudentAddress {
  addressLine?: string;

  city?: string;

  district?: string;

  state?: string;

  pincode?: string;

  country?: string;
}


/* =====================================================
   PARENT DETAILS
===================================================== */

export interface StudentParentDetails {
  name?: string;

  mobile?: string;

  aadhaarNumber?: string;

  occupation?: string;
}


/* =====================================================
   STUDENT ENROLLMENT META

   Ye GET /students/enrollments se aayega.
===================================================== */

export interface StudentEnrollmentMeta {
  _id: string;

  enrollmentStatus:
    StudentEnrollmentStatus;

  promotionStatus:
    StudentPromotionStatus;

  promotedFromEnrollmentId?: string;

  promotionDate?: string;

  remarks?: string;

  createdAt?: string;

  updatedAt?: string;
}


/* =====================================================
   STUDENT
===================================================== */

export interface Student {
  _id: string;

  schoolId: string;

  userId?: string;


  /*
   * Normal GET /students me ye current academic
   * snapshot hoga.
   *
   * GET /students/enrollments me ye selected
   * academic session ka enrollment hoga.
   */

  sessionId:
    | string
    | StudentSession;

  classId:
    | string
    | StudentClass;

  sectionId:
    | string
    | StudentSection;


  admissionNumber: string;

  rollNumber?: number;


  admissionType?: AdmissionType;

  admissionCategory?: AdmissionCategory;

  admissionDate?: string;


  name: string;

  dob?: string;

  gender?: StudentGender;

  bloodGroup?: StudentBloodGroup;

  religion?: string;

  category?: StudentCategory;

  caste?: string;

  aadhaarNumber?: string;

  apaarId?: string;

  photo?: string;


  mobile?: string;

  email?: string;


  // OLD FIELD - keep for existing records
  address?: StudentAddress;

  currentAddress?: StudentAddress;

  permanentAddress?: StudentAddress;


  father?: StudentParentDetails;

  mother?: StudentParentDetails;

  parentId?: string;


  status?: StudentStatus;


  /*
   * Available when student comes from:
   * GET /students/enrollments
   */

  enrollment?: StudentEnrollmentMeta;


  createdBy?: string;

  updatedBy?: string;

  createdAt?: string;

  updatedAt?: string;
}


/* =====================================================
   CREATE STUDENT DATA
===================================================== */

export interface CreateStudentData {
  name: string;

  admissionNumber?: string;


  sessionId: string;

  classId: string;

  sectionId: string;


  gender: StudentGender;


  rollNumber?: number;


  admissionType?: AdmissionType;

  admissionCategory?: AdmissionCategory;

  admissionDate?: string;


  dob?: string;

  bloodGroup?: StudentBloodGroup;

  religion?: string;

  category?: StudentCategory;

  caste?: string;

  aadhaarNumber?: string;

  apaarId?: string;

  photo?: File;


  mobile?: string;

  email?: string;


  // backward compatibility
  address?: StudentAddress;

  currentAddress?: StudentAddress;

  permanentAddress?: StudentAddress;


  father?: StudentParentDetails;

  mother?: StudentParentDetails;

  parentId?: string;
}


/* =====================================================
   UPDATE STUDENT DATA

   IMPORTANT:
   Academic movement generic student update se nahi
   hoga.

   sessionId
   classId
   sectionId
   rollNumber

   in fields ko enrollment/promotion APIs handle
   karenge.
===================================================== */

export interface UpdateStudentData {
  name?: string;

  admissionNumber?: string;


  admissionType?: AdmissionType;

  admissionCategory?: AdmissionCategory;

  admissionDate?: string;


  dob?: string;

  gender?: StudentGender;

  bloodGroup?: StudentBloodGroup;

  religion?: string;

  category?: StudentCategory;

  caste?: string;

  aadhaarNumber?: string;

  apaarId?: string;

  photo?: File;


  mobile?: string;

  email?: string;


  address?: StudentAddress;

  currentAddress?: StudentAddress;

  permanentAddress?: StudentAddress;


  father?: StudentParentDetails;

  mother?: StudentParentDetails;

  parentId?: string | null;


  status?: StudentStatus;
}


/* =====================================================
   STUDENT FILTERS

   Existing:
   GET /students
===================================================== */

export interface StudentFilters {
  page?: number;

  limit?: number;

  sessionId?: string;

  classId?: string;

  sectionId?: string;

  search?: string;

  status?: StudentStatus;
}


/* =====================================================
   STUDENT ENROLLMENT FILTERS

   GET /students/enrollments

   sessionId required hai.
===================================================== */

export interface StudentEnrollmentFilters {
  sessionId: string;

  classId?: string;

  sectionId?: string;

  search?: string;
}


/* =====================================================
   STUDENT PAGINATION
===================================================== */

export interface StudentPagination {
  page: number;

  limit: number;

  total: number;

  totalPages: number;
}


/* =====================================================
   STUDENTS RESPONSE

   Existing GET /students
===================================================== */

export interface StudentsResponse {
  success: boolean;

  data: Student[];

  pagination?: StudentPagination;
}


/* =====================================================
   STUDENTS BY ENROLLMENT DATA

   Backend:

   GET /students/enrollments

   Response:

   {
     success: true,
     data: {
       session: {...},
       students: [...],
       total: number
     }
   }
===================================================== */

export interface StudentsByEnrollmentData {
  session: StudentSession;

  students: Student[];

  total: number;
}


/* =====================================================
   CREATE STUDENT ACCOUNT DATA
===================================================== */

export interface CreateStudentAccountData {
  email: string;

  password: string;
}


/* =====================================================
   CREATED STUDENT ACCOUNT
===================================================== */

export interface CreatedStudentAccount {
  id: string;

  name: string;

  admissionNumber: string;

  userId: string;

  email: string;

  role: string;

  schoolId: string;
}


export interface CreateStudentAccountResult {
  student: CreatedStudentAccount;
}


/* =====================================================
   STUDENT STATE
===================================================== */

export interface StudentState {
  students: Student[];

  selectedStudent: Student | null;

  loading: boolean;

  error: string | null;
}
