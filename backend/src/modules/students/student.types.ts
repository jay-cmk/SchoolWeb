
// import type {
//   AdmissionCategory,
//   AdmissionType,
//   IStudentAddress,
//   IStudentParentDetails,
//   StudentBloodGroup,
//   StudentCategory,
//   StudentGender,
//   StudentStatus,
// } from "./student.interface";


// export interface ICreateStudentRequest {
//   // ============================================
//   // ACADEMIC DETAILS
//   // ============================================

//   sessionId: string;

//   classId: string;

//   sectionId: string;

//   // ============================================
//   // ADMISSION DETAILS
//   // ============================================

//   admissionNumber: string;

//   rollNumber?: number;

//   admissionType?: AdmissionType;

//   admissionCategory?: AdmissionCategory;

//   admissionDate?: string | Date;

//   // ============================================
//   // BASIC DETAILS
//   // ============================================

//   name: string;

//   dob?: string | Date;

//   gender: StudentGender;

//   bloodGroup?: StudentBloodGroup;

//   religion?: string;

//   category?: StudentCategory;

//   caste?: string;

//   aadhaarNumber?: string;

//   photo?: string;

//   // ============================================
//   // CONTACT DETAILS
//   // ============================================

//   mobile?: string;

//   email?: string;

//   // ============================================
//   // ADDRESS
//   // ============================================

//   // Old API compatibility
//   address?: IStudentAddress;

//   currentAddress?: IStudentAddress;

//   permanentAddress?: IStudentAddress;

//   // ============================================
//   // PARENT DETAILS
//   // ============================================

//   father?: IStudentParentDetails;

//   mother?: IStudentParentDetails;

//   // Existing Parent module relation
//   parentId?: string;
// }


// export interface IUpdateStudentRequest {
//   // ============================================
//   // ACADEMIC DETAILS
//   // ============================================

//   sessionId?: string;

//   classId?: string;

//   sectionId?: string;

//   // ============================================
//   // ADMISSION DETAILS
//   // ============================================

//   admissionNumber?: string;

//   rollNumber?: number;

//   admissionType?: AdmissionType;

//   admissionCategory?: AdmissionCategory;

//   admissionDate?: string | Date;

//   // ============================================
//   // BASIC DETAILS
//   // ============================================

//   name?: string;

//   dob?: string | Date;

//   gender?: StudentGender;

//   bloodGroup?: StudentBloodGroup;

//   religion?: string;

//   category?: StudentCategory;

//   caste?: string;

//   aadhaarNumber?: string;

//   photo?: string;

//   // ============================================
//   // CONTACT DETAILS
//   // ============================================

//   mobile?: string;

//   email?: string;

//   // ============================================
//   // ADDRESS
//   // ============================================

//   address?: IStudentAddress;

//   currentAddress?: IStudentAddress;

//   permanentAddress?: IStudentAddress;

//   // ============================================
//   // PARENT DETAILS
//   // ============================================

//   father?: IStudentParentDetails;

//   mother?: IStudentParentDetails;

//   parentId?: string | null;

//   // ============================================
//   // STATUS
//   // ============================================

//   status?: StudentStatus;
// }


// export interface IStudentQuery {
//   page?: number | string;

//   limit?: number | string;

//   search?: string;

//   sessionId?: string;

//   classId?: string;

//   sectionId?: string;

//   status?: StudentStatus | string;
// }


// export interface ICreateStudentAccountRequest {
//   email: string;

//   password: string;
// }









import type {
  AdmissionCategory,
  AdmissionType,
  IStudentAddress,
  IStudentParentDetails,
  StudentBloodGroup,
  StudentCategory,
  StudentGender,
  StudentStatus,
} from "./student.interface";


export interface ICreateStudentRequest {

  // ============================================
  // ACADEMIC DETAILS
  // ============================================

  sessionId: string;

  classId: string;

  sectionId: string;


  // ============================================
  // ADMISSION DETAILS
  // ============================================

  admissionNumber: string;

  rollNumber?: number;

  admissionType?: AdmissionType;

  admissionCategory?: AdmissionCategory;

  admissionDate?: string | Date;


  // ============================================
  // BASIC DETAILS
  // ============================================

  name: string;

  dob?: string | Date;

  gender: StudentGender;

  bloodGroup?: StudentBloodGroup;

  religion?: string;

  category?: StudentCategory;

  caste?: string;

  aadhaarNumber?: string;

  apaarId?: string;

  photo?: string;


  // ============================================
  // CONTACT DETAILS
  // ============================================

  mobile?: string;

  email?: string;


  // ============================================
  // ADDRESS
  // ============================================

  // Old API compatibility

  address?: IStudentAddress;

  currentAddress?: IStudentAddress;

  permanentAddress?: IStudentAddress;


  // ============================================
  // PARENT DETAILS
  // ============================================

  father?: IStudentParentDetails;

  mother?: IStudentParentDetails;

  // Existing Parent module relation

  parentId?: string;
}


export interface IUpdateStudentRequest {

  // ============================================
  // ACADEMIC DETAILS
  // ============================================

  sessionId?: string;

  classId?: string;

  sectionId?: string;


  // ============================================
  // ADMISSION DETAILS
  // ============================================

  admissionNumber?: string;

  rollNumber?: number;

  admissionType?: AdmissionType;

  admissionCategory?: AdmissionCategory;

  admissionDate?: string | Date;


  // ============================================
  // BASIC DETAILS
  // ============================================

  name?: string;

  dob?: string | Date;

  gender?: StudentGender;

  bloodGroup?: StudentBloodGroup;

  religion?: string;

  category?: StudentCategory;

  caste?: string;

  aadhaarNumber?: string;

  apaarId?: string;

  photo?: string;


  // ============================================
  // CONTACT DETAILS
  // ============================================

  mobile?: string;

  email?: string;


  // ============================================
  // ADDRESS
  // ============================================

  address?: IStudentAddress;

  currentAddress?: IStudentAddress;

  permanentAddress?: IStudentAddress;


  // ============================================
  // PARENT DETAILS
  // ============================================

  father?: IStudentParentDetails;

  mother?: IStudentParentDetails;

  parentId?: string | null;


  // ============================================
  // STATUS
  // ============================================

  status?: StudentStatus;
}


export interface IStudentQuery {

  page?: number | string;

  limit?: number | string;

  search?: string;

  sessionId?: string;

  classId?: string;

  sectionId?: string;

  status?: StudentStatus | string;
}


export interface ICreateStudentAccountRequest {

  email: string;

  password: string;
}