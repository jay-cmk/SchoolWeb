// import bcrypt from "bcrypt";
// import mongoose, { Types } from "mongoose";

// import Student from "./student.model";

// import {
//   createInitialEnrollment,
// } from "./studentEnrollment.service";

// import {
//   User,
// } from "../auth/user.model";

// import {
//   UserRole,
// } from "../../constants/roles";

// import type {
//   ICreateStudentRequest,
//   IUpdateStudentRequest,
//   IStudentQuery,
//   ICreateStudentAccountRequest,
// } from "./student.types";

// import type {
//   StudentStatus,
// } from "./student.interface";

// import {
//   ClassModel,
// } from "../academic/classes/class.model";

// import {
//   Section,
// } from "../academic/sections/section.model";

// import {
//   AcademicSession,
// } from "../academic/academicSession.model";

// export class StudentService {

//   // ============================================
//   // VALIDATE OBJECT ID
//   // ============================================

//   private validateObjectId(
//     id: string,
//     fieldName: string
//   ) {
//     if (!Types.ObjectId.isValid(id)) {
//       throw new Error(
//         `Invalid ${fieldName}`
//       );
//     }
//   }

//   // ============================================
//   // VALIDATE AADHAAR NUMBER
//   // ============================================

//   private validateAadhaarNumber(
//     aadhaarNumber: string,
//     fieldName: string
//   ) {
//     const value =
//       aadhaarNumber
//         .replace(/\s/g, "")
//         .trim();

//     if (!/^\d{12}$/.test(value)) {
//       throw new Error(
//         `${fieldName} must be exactly 12 digits`
//       );
//     }

//     return value;
//   }

//   // ============================================
//   // VALIDATE ACADEMIC RELATIONSHIP
//   // ============================================

//   private async validateAcademicMapping(
//     schoolId: string,
//     sessionId: string,
//     classId: string,
//     sectionId: string
//   ) {
//     this.validateObjectId(
//       sessionId,
//       "academic session ID"
//     );

//     this.validateObjectId(
//       classId,
//       "class ID"
//     );

//     this.validateObjectId(
//       sectionId,
//       "section ID"
//     );

//     // ------------------------------------------
//     // SESSION
//     // ------------------------------------------

//     const session =
//       await AcademicSession.findOne({
//         _id: sessionId,
//         schoolId,
//       }).lean();

//     if (!session) {
//       throw new Error(
//         "Academic session not found for this school"
//       );
//     }

//     // ------------------------------------------
//     // CLASS
//     // ------------------------------------------

//     const classData =
//       await ClassModel.findOne({
//         _id: classId,
//         schoolId,
//         sessionId,
//       }).lean();

//     if (!classData) {
//       throw new Error(
//         "Class does not belong to selected academic session"
//       );
//     }

//     // ------------------------------------------
//     // SECTION
//     // ------------------------------------------

//     const section =
//       await Section.findOne({
//         _id: sectionId,
//         schoolId,
//         sessionId,
//         classId,
//       }).lean();

//     if (!section) {
//       throw new Error(
//         "Section does not belong to selected class"
//       );
//     }
//   }

//   // ============================================
//   // CREATE STUDENT
//   // ============================================

//   async createStudent(
//     schoolId: string,
//     userId: string,
//     data: ICreateStudentRequest
//   ) {
//     this.validateObjectId(
//       schoolId,
//       "school ID"
//     );

//     this.validateObjectId(
//       userId,
//       "user ID"
//     );

//     // ==========================================
//     // REQUIRED DATA
//     // ==========================================

//     if (!data.sessionId) {
//       throw new Error(
//         "Academic session is required"
//       );
//     }

//     if (!data.classId) {
//       throw new Error(
//         "Class is required"
//       );
//     }

//     if (!data.sectionId) {
//       throw new Error(
//         "Section is required"
//       );
//     }

//     if (
//       !data.admissionNumber ||
//       !data.admissionNumber.trim()
//     ) {
//       throw new Error(
//         "Admission number is required"
//       );
//     }

//     if (
//       !data.name ||
//       !data.name.trim()
//     ) {
//       throw new Error(
//         "Student name is required"
//       );
//     }

//     // ==========================================
//     // ACADEMIC VALIDATION
//     // ==========================================

//     await this.validateAcademicMapping(
//       schoolId,
//       data.sessionId,
//       data.classId,
//       data.sectionId
//     );

//     const admissionNumber =
//       data.admissionNumber
//         .trim()
//         .toUpperCase();

//     // ==========================================
//     // DUPLICATE ADMISSION NUMBER
//     // ==========================================

//     const existingAdmission =
//       await Student.findOne({
//         schoolId,
//         sessionId: data.sessionId,
//         admissionNumber,
//       }).lean();

//     if (existingAdmission) {
//       throw new Error(
//         "Admission number already exists"
//       );
//     }

//     // ==========================================
//     // DUPLICATE ROLL NUMBER
//     // ==========================================

//     if (
//       data.rollNumber !== undefined
//     ) {
//       if (
//         !Number.isInteger(
//           data.rollNumber
//         ) ||
//         data.rollNumber < 1
//       ) {
//         throw new Error(
//           "Roll number must be a positive integer"
//         );
//       }

//       const existingRoll =
//         await Student.findOne({
//           schoolId,

//           sessionId:
//             data.sessionId,

//           classId:
//             data.classId,

//           sectionId:
//             data.sectionId,

//           rollNumber:
//             data.rollNumber,
//         }).lean();

//       if (existingRoll) {
//         throw new Error(
//           "Roll number already exists in this class and section"
//         );
//       }
//     }

//     // ==========================================
//     // PARENT VALIDATION
//     // ==========================================

//     if (
//       data.parentId &&
//       !Types.ObjectId.isValid(
//         data.parentId
//       )
//     ) {
//       throw new Error(
//         "Invalid parent ID"
//       );
//     }

//     // ==========================================
//     // CREATE PAYLOAD
//     // ==========================================

//     const createData: Record<
//       string,
//       unknown
//     > = {
//       schoolId,

//       sessionId:
//         data.sessionId,

//       classId:
//         data.classId,

//       sectionId:
//         data.sectionId,

//       admissionNumber,

//       name:
//         data.name.trim(),

//       gender:
//         data.gender,

//       createdBy:
//         userId,
//     };

//     // ==========================================
//     // ACADEMIC / ADMISSION DETAILS
//     // ==========================================

//     if (
//       data.rollNumber !== undefined
//     ) {
//       createData.rollNumber =
//         data.rollNumber;
//     }

//     if (data.admissionType) {
//       createData.admissionType =
//         data.admissionType;
//     }

//     if (data.admissionCategory) {
//       createData.admissionCategory =
//         data.admissionCategory;
//     }

//     if (data.admissionDate) {
//       createData.admissionDate =
//         new Date(
//           data.admissionDate
//         );
//     }

//     // ==========================================
//     // PERSONAL DETAILS
//     // ==========================================

//     if (data.dob) {
//       createData.dob =
//         new Date(
//           data.dob
//         );
//     }

//     if (data.bloodGroup) {
//       createData.bloodGroup =
//         data.bloodGroup;
//     }

//     if (data.religion) {
//       createData.religion =
//         data.religion.trim();
//     }

//     if (data.category) {
//       createData.category =
//         data.category;
//     }

//     if (data.caste) {
//       createData.caste =
//         data.caste.trim();
//     }

//     if (data.aadhaarNumber) {
//       createData.aadhaarNumber =
//         this.validateAadhaarNumber(
//           data.aadhaarNumber,
//           "Student Aadhaar number"
//         );
//     }

//     if (data.photo) {
//       createData.photo =
//         data.photo.trim();
//     }

//     // ==========================================
//     // CONTACT DETAILS
//     // ==========================================

//     if (data.mobile) {
//       createData.mobile =
//         data.mobile.trim();
//     }

//     if (data.email) {
//       createData.email =
//         data.email
//           .trim()
//           .toLowerCase();
//     }

//     // ==========================================
//     // OLD ADDRESS
//     // Keep for backward compatibility
//     // ==========================================

//     if (data.address) {
//       createData.address =
//         data.address;
//     }

//     // ==========================================
//     // CURRENT ADDRESS
//     // ==========================================

//     if (data.currentAddress) {
//       createData.currentAddress =
//         data.currentAddress;
//     }

//     // ==========================================
//     // PERMANENT ADDRESS
//     // ==========================================

//     if (data.permanentAddress) {
//       createData.permanentAddress =
//         data.permanentAddress;
//     }

//     // ==========================================
//     // FATHER DETAILS
//     // ==========================================

//     if (data.father) {
//       const father = {
//         ...data.father,
//       };

//       if (father.name) {
//         father.name =
//           father.name.trim();
//       }

//       if (father.mobile) {
//         father.mobile =
//           father.mobile.trim();
//       }

//       if (father.occupation) {
//         father.occupation =
//           father.occupation.trim();
//       }

//       if (father.aadhaarNumber) {
//         father.aadhaarNumber =
//           this.validateAadhaarNumber(
//             father.aadhaarNumber,
//             "Father Aadhaar number"
//           );
//       }

//       createData.father =
//         father;
//     }

//     // ==========================================
//     // MOTHER DETAILS
//     // ==========================================

//     if (data.mother) {
//       const mother = {
//         ...data.mother,
//       };

//       if (mother.name) {
//         mother.name =
//           mother.name.trim();
//       }

//       if (mother.mobile) {
//         mother.mobile =
//           mother.mobile.trim();
//       }

//       if (mother.occupation) {
//         mother.occupation =
//           mother.occupation.trim();
//       }

//       if (mother.aadhaarNumber) {
//         mother.aadhaarNumber =
//           this.validateAadhaarNumber(
//             mother.aadhaarNumber,
//             "Mother Aadhaar number"
//           );
//       }

//       createData.mother =
//         mother;
//     }

//     // ==========================================
//     // EXISTING PARENT MODULE RELATION
//     // ==========================================

//     if (data.parentId) {
//       createData.parentId =
//         data.parentId;
//     }

//     // ==========================================
//     // CREATE STUDENT
//     // ==========================================

//     const mongoSession =
//       await mongoose.startSession();

//     try {
//       let createdStudent:
//         InstanceType<typeof Student> | null =
//         null;

//       await mongoSession.withTransaction(
//         async () => {

//           // ========================================
//           // CREATE STUDENT INSIDE TRANSACTION
//           // ========================================

//           const students =
//             await Student.create(
//               [createData],
//               {
//                 session:
//                   mongoSession,
//               }
//             );

//           const student =
//             students[0];

//           if (!student) {
//             throw new Error(
//               "Failed to create student"
//             );
//           }

//           // ========================================
//           // CREATE INITIAL ENROLLMENT
//           // SAME TRANSACTION
//           // ========================================

//           const enrollmentData = {
//             schoolId,
//             studentId:
//               student._id.toString(),
//             sessionId:
//               data.sessionId,
//             classId:
//               data.classId,
//             sectionId:
//               data.sectionId,
//             createdBy:
//               userId,
//           };

//           if (
//             data.rollNumber !==
//             undefined
//           ) {
//             Object.assign(
//               enrollmentData,
//               {
//                 rollNumber:
//                   data.rollNumber,
//               }
//             );
//           }

//           await createInitialEnrollment(
//             enrollmentData,
//             mongoSession
//           );

//           createdStudent =
//             student;
//         }
//       );

//       if (!createdStudent) {
//         throw new Error(
//           "Student creation transaction did not complete"
//         );
//       }

//       return createdStudent;

//     } finally {
//       await mongoSession.endSession();
//     }
//   }

//   // ============================================
//   // GET MY STUDENT PROFILE
//   // ============================================

//   async getMyProfile(
//     schoolId: string,
//     studentId: string
//   ) {
//     this.validateObjectId(
//       schoolId,
//       "school ID"
//     );

//     this.validateObjectId(
//       studentId,
//       "student ID"
//     );

//     const student =
//       await Student.findOne({
//         _id: studentId,
//         schoolId,
//         status: "ACTIVE",
//       })
//         .populate("sessionId")
//         .populate("classId")
//         .populate("sectionId")
//         .populate("parentId")
//         .populate(
//           "userId",
//           "name email mobile role isActive"
//         );

//     if (!student) {
//       throw new Error(
//         "Student profile not found or inactive"
//       );
//     }

//     return student;
//   }

//   // ============================================
//   // GET ALL STUDENTS
//   // ============================================

//   async getStudents(
//     schoolId: string,
//     query: IStudentQuery
//   ) {
//     this.validateObjectId(
//       schoolId,
//       "school ID"
//     );

//     let page =
//       Number(query.page) || 1;

//     let limit =
//       Number(query.limit) || 10;

//     if (page < 1) {
//       page = 1;
//     }

//     if (limit < 1) {
//       limit = 10;
//     }

//     if (limit > 100) {
//       limit = 100;
//     }

//     const skip =
//       (page - 1) * limit;

//     const filter: Record<
//       string,
//       unknown
//     > = {
//       schoolId,
//     };

//     // ==========================================
//     // SESSION FILTER
//     // ==========================================

//     if (query.sessionId) {
//       this.validateObjectId(
//         query.sessionId,
//         "academic session ID"
//       );

//       filter.sessionId =
//         query.sessionId;
//     }

//     // ==========================================
//     // CLASS FILTER
//     // ==========================================

//     if (query.classId) {
//       this.validateObjectId(
//         query.classId,
//         "class ID"
//       );

//       filter.classId =
//         query.classId;
//     }

//     // ==========================================
//     // SECTION FILTER
//     // ==========================================

//     if (query.sectionId) {
//       this.validateObjectId(
//         query.sectionId,
//         "section ID"
//       );

//       filter.sectionId =
//         query.sectionId;
//     }

//     // ==========================================
//     // STATUS FILTER
//     // ==========================================

//     if (query.status) {

//       const allowedStatuses:
//         StudentStatus[] = [
//           "ACTIVE",
//           "INACTIVE",
//           "TRANSFERRED",
//           "PASSED",
//           "LEFT",
//         ];

//       if (
//         !allowedStatuses.includes(
//           query.status as StudentStatus
//         )
//       ) {
//         throw new Error(
//           "Invalid student status"
//         );
//       }

//       filter.status =
//         query.status;
//     }

//     // ==========================================
//     // SEARCH
//     // ==========================================

//     if (query.search) {

//       const search =
//         query.search.trim();

//       if (search) {

//         filter.$or = [
//           {
//             name: {
//               $regex:
//                 search,
//               $options:
//                 "i",
//             },
//           },

//           {
//             admissionNumber: {
//               $regex:
//                 search,
//               $options:
//                 "i",
//             },
//           },
//         ];
//       }
//     }

//     // ==========================================
//     // FETCH
//     // ==========================================

//     const [
//       students,
//       total,
//     ] = await Promise.all([

//       Student.find(filter)

//         .populate(
//           "sessionId"
//         )

//         .populate(
//           "classId"
//         )

//         .populate(
//           "sectionId"
//         )

//         .populate(
//           "parentId"
//         )

//         .sort({
//           createdAt: -1,
//         })

//         .skip(skip)

//         .limit(limit),

//       Student.countDocuments(
//         filter
//       ),

//     ]);

//     return {

//       students,

//       pagination: {

//         page,

//         limit,

//         total,

//         totalPages:
//           Math.ceil(
//             total / limit
//           ),

//       },

//     };
//   }

//   // ============================================
//   // GET SINGLE STUDENT
//   // ============================================

//   async getStudentById(
//     schoolId: string,
//     studentId: string
//   ) {
//     this.validateObjectId(
//       schoolId,
//       "school ID"
//     );

//     this.validateObjectId(
//       studentId,
//       "student ID"
//     );

//     const student =
//       await Student.findOne({
//         _id: studentId,
//         schoolId,
//       })

//         .populate(
//           "sessionId"
//         )

//         .populate(
//           "classId"
//         )

//         .populate(
//           "sectionId"
//         )

//         .populate(
//           "parentId"
//         );

//     if (!student) {
//       throw new Error(
//         "Student not found"
//       );
//     }

//     return student;
//   }

//   // ============================================
//   // UPDATE STUDENT
//   // ============================================

//   async updateStudent(
//     schoolId: string,
//     userId: string,
//     studentId: string,
//     data: IUpdateStudentRequest
//   ) {
//     this.validateObjectId(
//       schoolId,
//       "school ID"
//     );

//     this.validateObjectId(
//       userId,
//       "user ID"
//     );

//     this.validateObjectId(
//       studentId,
//       "student ID"
//     );

//     const existingStudent =
//       await Student.findOne({
//         _id: studentId,
//         schoolId,
//       });

//     if (!existingStudent) {
//       throw new Error(
//         "Student not found"
//       );
//     }

//     // ==========================================
//     // ACADEMIC FIELDS ARE ENROLLMENT-CONTROLLED
//     // ==========================================

//     if (
//       data.sessionId !== undefined ||
//       data.classId !== undefined ||
//       data.sectionId !== undefined ||
//       data.rollNumber !== undefined
//     ) {
//       throw new Error(
//         "Session, class, section and roll number must be changed through the student enrollment/promotion APIs"
//       );
//     }

//     // ==========================================
//     // FINAL ACADEMIC VALUES
//     // ==========================================

//     const sessionId =
//       data.sessionId ??
//       existingStudent.sessionId.toString();

//     const classId =
//       data.classId ??
//       existingStudent.classId.toString();

//     const sectionId =
//       data.sectionId ??
//       existingStudent.sectionId.toString();

//     if (
//       data.sessionId ||
//       data.classId ||
//       data.sectionId
//     ) {
//       await this.validateAcademicMapping(
//         schoolId,
//         sessionId,
//         classId,
//         sectionId
//       );
//     }

//     // ==========================================
//     // ADMISSION NUMBER
//     // ==========================================

//     let admissionNumber =
//       existingStudent.admissionNumber;

//     if (
//       data.admissionNumber !==
//       undefined
//     ) {
//       admissionNumber =
//         data.admissionNumber
//           .trim()
//           .toUpperCase();

//       if (!admissionNumber) {
//         throw new Error(
//           "Admission number cannot be empty"
//         );
//       }

//       const duplicateAdmission =
//         await Student.findOne({

//           _id: {
//             $ne:
//               studentId,
//           },

//           schoolId,

//           sessionId,

//           admissionNumber,

//         }).lean();

//       if (
//         duplicateAdmission
//       ) {
//         throw new Error(
//           "Admission number already exists"
//         );
//       }
//     }

//     // ==========================================
//     // ROLL NUMBER
//     // ==========================================

//     const finalRollNumber =
//       data.rollNumber !==
//       undefined
//         ? data.rollNumber
//         : existingStudent.rollNumber;

//     if (
//       finalRollNumber !==
//       undefined
//     ) {
//       if (
//         !Number.isInteger(
//           finalRollNumber
//         ) ||
//         finalRollNumber < 1
//       ) {
//         throw new Error(
//           "Roll number must be a positive integer"
//         );
//       }

//       const duplicateRoll =
//         await Student.findOne({

//           _id: {
//             $ne:
//               studentId,
//           },

//           schoolId,

//           sessionId,

//           classId,

//           sectionId,

//           rollNumber:
//             finalRollNumber,

//         }).lean();

//       if (
//         duplicateRoll
//       ) {
//         throw new Error(
//           "Roll number already exists in this class and section"
//         );
//       }
//     }

//     // ==========================================
//     // PARENT ID
//     // ==========================================

//     if (
//       data.parentId !==
//         undefined &&
//       data.parentId !==
//         null &&
//       !Types.ObjectId.isValid(
//         data.parentId
//       )
//     ) {
//       throw new Error(
//         "Invalid parent ID"
//       );
//     }

//     // ==========================================
//     // UPDATE PAYLOAD
//     // ==========================================

//     const updateData: Record<
//       string,
//       unknown
//     > = {
//       updatedBy:
//         userId,
//     };

//     // ==========================================
//     // ACADEMIC DETAILS
//     // ==========================================

//     if (
//       data.sessionId !==
//       undefined
//     ) {
//       updateData.sessionId =
//         data.sessionId;
//     }

//     if (
//       data.classId !==
//       undefined
//     ) {
//       updateData.classId =
//         data.classId;
//     }

//     if (
//       data.sectionId !==
//       undefined
//     ) {
//       updateData.sectionId =
//         data.sectionId;
//     }

//     // ==========================================
//     // ADMISSION DETAILS
//     // ==========================================

//     if (
//       data.admissionNumber !==
//       undefined
//     ) {
//       updateData.admissionNumber =
//         admissionNumber;
//     }

//     if (
//       data.rollNumber !==
//       undefined
//     ) {
//       updateData.rollNumber =
//         data.rollNumber;
//     }

//     if (
//       data.admissionType !==
//       undefined
//     ) {
//       updateData.admissionType =
//         data.admissionType;
//     }

//     if (
//       data.admissionCategory !==
//       undefined
//     ) {
//       updateData.admissionCategory =
//         data.admissionCategory;
//     }

//     if (
//       data.admissionDate !==
//       undefined
//     ) {
//       updateData.admissionDate =
//         new Date(
//           data.admissionDate
//         );
//     }

//     // ==========================================
//     // BASIC DETAILS
//     // ==========================================

//     if (
//       data.name !==
//       undefined
//     ) {
//       const name =
//         data.name.trim();

//       if (!name) {
//         throw new Error(
//           "Student name cannot be empty"
//         );
//       }

//       updateData.name =
//         name;
//     }

//     if (
//       data.dob !==
//       undefined
//     ) {
//       updateData.dob =
//         new Date(
//           data.dob
//         );
//     }

//     if (
//       data.gender !==
//       undefined
//     ) {
//       updateData.gender =
//         data.gender;
//     }

//     if (
//       data.bloodGroup !==
//       undefined
//     ) {
//       updateData.bloodGroup =
//         data.bloodGroup;
//     }

//     if (
//       data.religion !==
//       undefined
//     ) {
//       updateData.religion =
//         data.religion.trim();
//     }

//     if (
//       data.category !==
//       undefined
//     ) {
//       updateData.category =
//         data.category;
//     }

//     if (
//       data.caste !==
//       undefined
//     ) {
//       updateData.caste =
//         data.caste.trim();
//     }

//     if (
//       data.aadhaarNumber !==
//       undefined
//     ) {
//       updateData.aadhaarNumber =
//         data.aadhaarNumber
//           ? this.validateAadhaarNumber(
//               data.aadhaarNumber,
//               "Student Aadhaar number"
//             )
//           : "";
//     }

//     if (
//       data.photo !==
//       undefined
//     ) {
//       updateData.photo =
//         data.photo.trim();
//     }

//     // ==========================================
//     // CONTACT DETAILS
//     // ==========================================

//     if (
//       data.mobile !==
//       undefined
//     ) {
//       updateData.mobile =
//         data.mobile.trim();
//     }

//     if (
//       data.email !==
//       undefined
//     ) {
//       updateData.email =
//         data.email
//           .trim()
//           .toLowerCase();
//     }

//     // ==========================================
//     // OLD ADDRESS
//     // ==========================================

//     if (
//       data.address !==
//       undefined
//     ) {
//       updateData.address =
//         data.address;
//     }

//     // ==========================================
//     // CURRENT ADDRESS
//     // ==========================================

//     if (
//       data.currentAddress !==
//       undefined
//     ) {
//       updateData.currentAddress =
//         data.currentAddress;
//     }

//     // ==========================================
//     // PERMANENT ADDRESS
//     // ==========================================

//     if (
//       data.permanentAddress !==
//       undefined
//     ) {
//       updateData.permanentAddress =
//         data.permanentAddress;
//     }

//     // ==========================================
//     // FATHER DETAILS
//     // ==========================================

//     if (
//       data.father !==
//       undefined
//     ) {
//       const father = {
//         ...data.father,
//       };

//       if (father.name) {
//         father.name =
//           father.name.trim();
//       }

//       if (father.mobile) {
//         father.mobile =
//           father.mobile.trim();
//       }

//       if (father.occupation) {
//         father.occupation =
//           father.occupation.trim();
//       }

//       if (father.aadhaarNumber) {
//         father.aadhaarNumber =
//           this.validateAadhaarNumber(
//             father.aadhaarNumber,
//             "Father Aadhaar number"
//           );
//       }

//       updateData.father =
//         father;
//     }

//     // ==========================================
//     // MOTHER DETAILS
//     // ==========================================

//     if (
//       data.mother !==
//       undefined
//     ) {
//       const mother = {
//         ...data.mother,
//       };

//       if (mother.name) {
//         mother.name =
//           mother.name.trim();
//       }

//       if (mother.mobile) {
//         mother.mobile =
//           mother.mobile.trim();
//       }

//       if (mother.occupation) {
//         mother.occupation =
//           mother.occupation.trim();
//       }

//       if (mother.aadhaarNumber) {
//         mother.aadhaarNumber =
//           this.validateAadhaarNumber(
//             mother.aadhaarNumber,
//             "Mother Aadhaar number"
//           );
//       }

//       updateData.mother =
//         mother;
//     }

//     // ==========================================
//     // EXISTING PARENT RELATION
//     // ==========================================

//     if (
//       data.parentId !==
//       undefined
//     ) {
//       updateData.parentId =
//         data.parentId;
//     }

//     // ==========================================
//     // STATUS
//     // ==========================================

//     if (
//       data.status !==
//       undefined
//     ) {
//       updateData.status =
//         data.status;
//     }

//     // ==========================================
//     // UPDATE
//     // ==========================================

//     const student =
//       await Student.findOneAndUpdate(

//         {
//           _id:
//             studentId,

//           schoolId,
//         },

//         updateData,

//         {
//           new: true,
//           runValidators: true,
//         }

//       );

//     if (!student) {
//       throw new Error(
//         "Student not found"
//       );
//     }

//     return student;
//   }

//   // ============================================
//   // UPDATE STUDENT STATUS
//   // ============================================

//   async updateStatus(
//     schoolId: string,
//     userId: string,
//     studentId: string,
//     status: StudentStatus
//   ) {
//     this.validateObjectId(
//       schoolId,
//       "school ID"
//     );

//     this.validateObjectId(
//       userId,
//       "user ID"
//     );

//     this.validateObjectId(
//       studentId,
//       "student ID"
//     );

//     const allowedStatuses:
//       StudentStatus[] = [
//         "ACTIVE",
//         "INACTIVE",
//         "TRANSFERRED",
//         "PASSED",
//         "LEFT",
//       ];

//     if (
//       !allowedStatuses.includes(
//         status
//       )
//     ) {
//       throw new Error(
//         "Invalid student status"
//       );
//     }

//     const student =
//       await Student.findOneAndUpdate(

//         {
//           _id:
//             studentId,

//           schoolId,
//         },

//         {
//           status,

//           updatedBy:
//             userId,
//         },

//         {
//           new: true,
//           runValidators: true,
//         }

//       );

//     if (!student) {
//       throw new Error(
//         "Student not found"
//       );
//     }

//     return student;
//   }

//   // ============================================
//   // CREATE STUDENT LOGIN ACCOUNT
//   // ============================================

//   async createStudentAccount(
//     schoolId: string,
//     userId: string,
//     studentId: string,
//     data: ICreateStudentAccountRequest
//   ) {

//     // ==========================================
//     // VALIDATE IDS
//     // ==========================================

//     this.validateObjectId(
//       schoolId,
//       "school ID"
//     );

//     this.validateObjectId(
//       userId,
//       "user ID"
//     );

//     this.validateObjectId(
//       studentId,
//       "student ID"
//     );

//     // ==========================================
//     // VALIDATE EMAIL
//     // ==========================================

//     if (
//       !data.email ||
//       !data.email.trim()
//     ) {
//       throw new Error(
//         "Email is required"
//       );
//     }

//     const email =
//       data.email
//         .trim()
//         .toLowerCase();

//     // ==========================================
//     // VALIDATE PASSWORD
//     // ==========================================

//     if (
//       !data.password ||
//       !data.password.trim()
//     ) {
//       throw new Error(
//         "Password is required"
//       );
//     }

//     if (
//       data.password.length < 6
//     ) {
//       throw new Error(
//         "Password must be at least 6 characters"
//       );
//     }

//     // ==========================================
//     // FIND STUDENT
//     // TENANT ISOLATION
//     // ==========================================

//     const student =
//       await Student.findOne({
//         _id:
//           studentId,

//         schoolId,
//       });

//     if (!student) {
//       throw new Error(
//         "Student not found"
//       );
//     }

//     // ==========================================
//     // STUDENT ACTIVE CHECK
//     // ==========================================

//     if (
//       student.status !==
//       "ACTIVE"
//     ) {
//       throw new Error(
//         "Only active students can have login accounts"
//       );
//     }

//     // ==========================================
//     // ACCOUNT ALREADY LINKED
//     // ==========================================

//     if (student.userId) {
//       throw new Error(
//         "Student login account already exists"
//       );
//     }

//     // ==========================================
//     // DUPLICATE EMAIL CHECK
//     // ==========================================

//     const existingUser =
//       await User.findOne({
//         email,
//       }).lean();

//     if (existingUser) {
//       throw new Error(
//         "Email is already registered"
//       );
//     }

//     // ==========================================
//     // HASH PASSWORD
//     // ==========================================

//     const hashedPassword =
//       await bcrypt.hash(
//         data.password,
//         10
//       );

//     // ==========================================
//     // CREATE STUDENT USER ACCOUNT
//     // ==========================================

//     const studentUser =
//       await User.create({

//         name:
//           student.name,

//         email,

//         ...(student.mobile
//           ? {
//               mobile:
//                 student.mobile,
//             }
//           : {}),

//         password:
//           hashedPassword,

//         role:
//           UserRole.STUDENT,

//         schoolId,

//         isActive:
//           true,

//       });

//     // ==========================================
//     // LINK USER WITH STUDENT
//     // ==========================================

//     student.userId =
//       studentUser._id as Types.ObjectId;

//     student.updatedBy =
//       new Types.ObjectId(
//         userId
//       );

//     await student.save();

//     // ==========================================
//     // RETURN SAFE DATA
//     // ==========================================

//     return {

//       student: {
//         id:
//           student._id,

//         name:
//           student.name,

//         admissionNumber:
//           student.admissionNumber,

//         userId:
//           studentUser._id,

//         email:
//           studentUser.email,

//         role:
//           studentUser.role,

//         schoolId:
//           studentUser.schoolId,
//       },

//     };
//   }
// }

// export default new StudentService();





// import bcrypt from "bcrypt";
// import mongoose, { Types } from "mongoose";

// import Student from "./student.model";

// import { createInitialEnrollment } from "./studentEnrollment.service";

// import { User } from "../auth/user.model";

// import { UserRole } from "../../constants/roles";

// import type {
//   ICreateStudentRequest,
//   IUpdateStudentRequest,
//   IStudentQuery,
//   ICreateStudentAccountRequest,
// } from "./student.types";

// import type { StudentStatus } from "./student.interface";

// import { ClassModel } from "../academic/classes/class.model";

// import { Section } from "../academic/sections/section.model";

// import { AcademicSession } from "../academic/academicSession.model";

// export class StudentService {
//   // ============================================
//   // VALIDATE OBJECT ID
//   // ============================================

//   private validateObjectId(id: string, fieldName: string) {
//     if (!Types.ObjectId.isValid(id)) {
//       throw new Error(`Invalid ${fieldName}`);
//     }
//   }

//   // ============================================
//   // VALIDATE AADHAAR NUMBER
//   // ============================================

//   private validateAadhaarNumber(aadhaarNumber: string, fieldName: string) {
//     const value = aadhaarNumber.replace(/\s/g, "").trim();

//     if (!/^\d{12}$/.test(value)) {
//       throw new Error(`${fieldName} must be exactly 12 digits`);
//     }

//     return value;
//   }

//   // ============================================
//   // VALIDATE APAAR ID
//   // ============================================

//   private validateApaarId(apaarId: string) {
//     const value = apaarId.replace(/\s/g, "").trim();

//     if (!/^\d{12}$/.test(value)) {
//       throw new Error("APAAR ID must be exactly 12 digits");
//     }

//     return value;
//   }

//   // ============================================
//   // VALIDATE ACADEMIC RELATIONSHIP
//   // ============================================

//   private async validateAcademicMapping(
//     schoolId: string,
//     sessionId: string,
//     classId: string,
//     sectionId: string,
//   ) {
//     this.validateObjectId(sessionId, "academic session ID");

//     this.validateObjectId(classId, "class ID");

//     this.validateObjectId(sectionId, "section ID");

//     // ------------------------------------------
//     // SESSION
//     // ------------------------------------------

//     const session = await AcademicSession.findOne({
//       _id: sessionId,
//       schoolId,
//     }).lean();

//     if (!session) {
//       throw new Error("Academic session not found for this school");
//     }

//     // ------------------------------------------
//     // CLASS
//     // ------------------------------------------

//     const classData = await ClassModel.findOne({
//       _id: classId,
//       schoolId,
//       sessionId,
//     }).lean();

//     if (!classData) {
//       throw new Error("Class does not belong to selected academic session");
//     }

//     // ------------------------------------------
//     // SECTION
//     // ------------------------------------------

//     const section = await Section.findOne({
//       _id: sectionId,
//       schoolId,
//       sessionId,
//       classId,
//     }).lean();

//     if (!section) {
//       throw new Error("Section does not belong to selected class");
//     }
//   }

//   // ============================================
//   // CREATE STUDENT
//   // ============================================

//   async createStudent(
//     schoolId: string,
//     userId: string,
//     data: ICreateStudentRequest,
//   ) {
//     this.validateObjectId(schoolId, "school ID");

//     this.validateObjectId(userId, "user ID");

//     // ==========================================
//     // REQUIRED DATA
//     // ==========================================

//     if (!data.sessionId) {
//       throw new Error("Academic session is required");
//     }

//     if (!data.classId) {
//       throw new Error("Class is required");
//     }

//     if (!data.sectionId) {
//       throw new Error("Section is required");
//     }

//     if (!data.admissionNumber || !data.admissionNumber.trim()) {
//       throw new Error("Admission number is required");
//     }

//     if (!data.name || !data.name.trim()) {
//       throw new Error("Student name is required");
//     }

//     // ==========================================
//     // ACADEMIC VALIDATION
//     // ==========================================

//     await this.validateAcademicMapping(
//       schoolId,
//       data.sessionId,
//       data.classId,
//       data.sectionId,
//     );

//     const admissionNumber = data.admissionNumber.trim().toUpperCase();

//     // ==========================================
//     // DUPLICATE ADMISSION NUMBER
//     // ==========================================

//     const existingAdmission = await Student.findOne({
//       schoolId,
//       sessionId: data.sessionId,
//       admissionNumber,
//     }).lean();

//     if (existingAdmission) {
//       throw new Error("Admission number already exists");
//     }

//     // ==========================================
//     // DUPLICATE APAAR ID
//     // ==========================================

//     if (data.apaarId) {
//       const apaarId = this.validateApaarId(data.apaarId);

//       const existingApaarId = await Student.findOne({
//         schoolId,
//         apaarId,
//       }).lean();

//       if (existingApaarId) {
//         throw new Error("APAAR ID already exists");
//       }
//     }

//     // ==========================================
//     // DUPLICATE ROLL NUMBER
//     // ==========================================

//     if (data.rollNumber !== undefined) {
//       if (!Number.isInteger(data.rollNumber) || data.rollNumber < 1) {
//         throw new Error("Roll number must be a positive integer");
//       }

//       const existingRoll = await Student.findOne({
//         schoolId,

//         sessionId: data.sessionId,

//         classId: data.classId,

//         sectionId: data.sectionId,

//         rollNumber: data.rollNumber,
//       }).lean();

//       if (existingRoll) {
//         throw new Error("Roll number already exists in this class and section");
//       }
//     }

//     // ==========================================
//     // PARENT VALIDATION
//     // ==========================================

//     if (data.parentId && !Types.ObjectId.isValid(data.parentId)) {
//       throw new Error("Invalid parent ID");
//     }

//     // ==========================================
//     // CREATE PAYLOAD
//     // ==========================================

//     const createData: Record<string, unknown> = {
//       schoolId,

//       sessionId: data.sessionId,

//       classId: data.classId,

//       sectionId: data.sectionId,

//       admissionNumber,

//       name: data.name.trim(),

//       gender: data.gender,

//       createdBy: userId,
//     };

//     // ==========================================
//     // ACADEMIC / ADMISSION DETAILS
//     // ==========================================

//     if (data.rollNumber !== undefined) {
//       createData.rollNumber = data.rollNumber;
//     }

//     if (data.admissionType) {
//       createData.admissionType = data.admissionType;
//     }

//     if (data.admissionCategory) {
//       createData.admissionCategory = data.admissionCategory;
//     }

//     if (data.admissionDate) {
//       createData.admissionDate = new Date(data.admissionDate);
//     }

//     // ==========================================
//     // PERSONAL DETAILS
//     // ==========================================

//     if (data.dob) {
//       createData.dob = new Date(data.dob);
//     }

//     if (data.bloodGroup) {
//       createData.bloodGroup = data.bloodGroup;
//     }

//     if (data.religion) {
//       createData.religion = data.religion.trim();
//     }

//     if (data.category) {
//       createData.category = data.category;
//     }

//     if (data.caste) {
//       createData.caste = data.caste.trim();
//     }

//     if (data.aadhaarNumber) {
//       createData.aadhaarNumber = this.validateAadhaarNumber(
//         data.aadhaarNumber,
//         "Student Aadhaar number",
//       );
//     }

//     if (data.apaarId) {
//       createData.apaarId = this.validateApaarId(data.apaarId);
//     }

//     if (data.photo) {
//       createData.photo = data.photo.trim();
//     }

//     // ==========================================
//     // CONTACT DETAILS
//     // ==========================================

//     if (data.mobile) {
//       createData.mobile = data.mobile.trim();
//     }

//     if (data.email) {
//       createData.email = data.email.trim().toLowerCase();
//     }

//     // ==========================================
//     // OLD ADDRESS
//     // Keep for backward compatibility
//     // ==========================================

//     if (data.address) {
//       createData.address = data.address;
//     }

//     // ==========================================
//     // CURRENT ADDRESS
//     // ==========================================

//     if (data.currentAddress) {
//       createData.currentAddress = data.currentAddress;
//     }

//     // ==========================================
//     // PERMANENT ADDRESS
//     // ==========================================

//     if (data.permanentAddress) {
//       createData.permanentAddress = data.permanentAddress;
//     }

//     // ==========================================
//     // FATHER DETAILS
//     // ==========================================

//     if (data.father) {
//       const father = {
//         ...data.father,
//       };

//       if (father.name) {
//         father.name = father.name.trim();
//       }

//       if (father.mobile) {
//         father.mobile = father.mobile.trim();
//       }

//       if (father.occupation) {
//         father.occupation = father.occupation.trim();
//       }

//       if (father.aadhaarNumber) {
//         father.aadhaarNumber = this.validateAadhaarNumber(
//           father.aadhaarNumber,
//           "Father Aadhaar number",
//         );
//       }

//       createData.father = father;
//     }

//     // ==========================================
//     // MOTHER DETAILS
//     // ==========================================

//     if (data.mother) {
//       const mother = {
//         ...data.mother,
//       };

//       if (mother.name) {
//         mother.name = mother.name.trim();
//       }

//       if (mother.mobile) {
//         mother.mobile = mother.mobile.trim();
//       }

//       if (mother.occupation) {
//         mother.occupation = mother.occupation.trim();
//       }

//       if (mother.aadhaarNumber) {
//         mother.aadhaarNumber = this.validateAadhaarNumber(
//           mother.aadhaarNumber,
//           "Mother Aadhaar number",
//         );
//       }

//       createData.mother = mother;
//     }

//     // ==========================================
//     // EXISTING PARENT MODULE RELATION
//     // ==========================================

//     if (data.parentId) {
//       createData.parentId = data.parentId;
//     }

//     // ==========================================
//     // CREATE STUDENT
//     // ==========================================

//     const mongoSession = await mongoose.startSession();

//     try {
//       let createdStudent: InstanceType<typeof Student> | null = null;

//       await mongoSession.withTransaction(async () => {
//         // ========================================
//         // CREATE STUDENT INSIDE TRANSACTION
//         // ========================================

//         const students = await Student.create([createData], {
//           session: mongoSession,
//         });

//         const student = students[0];

//         if (!student) {
//           throw new Error("Failed to create student");
//         }

//         // ========================================
//         // CREATE INITIAL ENROLLMENT
//         // SAME TRANSACTION
//         // ========================================

//         const enrollmentData = {
//           schoolId,
//           studentId: student._id.toString(),
//           sessionId: data.sessionId,
//           classId: data.classId,
//           sectionId: data.sectionId,
//           createdBy: userId,
//         };

//         if (data.rollNumber !== undefined) {
//           Object.assign(enrollmentData, {
//             rollNumber: data.rollNumber,
//           });
//         }

//         await createInitialEnrollment(enrollmentData, mongoSession);

//         createdStudent = student;
//       });

//       if (!createdStudent) {
//         throw new Error("Student creation transaction did not complete");
//       }

//       return createdStudent;
//     } finally {
//       await mongoSession.endSession();
//     }
//   }

//   // ============================================
//   // GET MY STUDENT PROFILE
//   // ============================================

//   async getMyProfile(schoolId: string, studentId: string) {
//     this.validateObjectId(schoolId, "school ID");

//     this.validateObjectId(studentId, "student ID");

//     const student = await Student.findOne({
//       _id: studentId,
//       schoolId,
//       status: "ACTIVE",
//     })
//       .populate("sessionId")
//       .populate("classId")
//       .populate("sectionId")
//       .populate("parentId")
//       .populate("userId", "name email mobile role isActive");

//     if (!student) {
//       throw new Error("Student profile not found or inactive");
//     }

//     return student;
//   }

//   // ============================================
//   // GET ALL STUDENTS
//   // ============================================

//   async getStudents(schoolId: string, query: IStudentQuery) {
//     this.validateObjectId(schoolId, "school ID");

//     let page = Number(query.page) || 1;

//     let limit = Number(query.limit) || 10;

//     if (page < 1) {
//       page = 1;
//     }

//     if (limit < 1) {
//       limit = 10;
//     }

//     if (limit > 100) {
//       limit = 100;
//     }

//     const skip = (page - 1) * limit;

//     const filter: Record<string, unknown> = {
//       schoolId,
//     };

//     // ==========================================
//     // SESSION FILTER
//     // ==========================================

//     if (query.sessionId) {
//       this.validateObjectId(query.sessionId, "academic session ID");

//       filter.sessionId = query.sessionId;
//     }

//     // ==========================================
//     // CLASS FILTER
//     // ==========================================

//     if (query.classId) {
//       this.validateObjectId(query.classId, "class ID");

//       filter.classId = query.classId;
//     }

//     // ==========================================
//     // SECTION FILTER
//     // ==========================================

//     if (query.sectionId) {
//       this.validateObjectId(query.sectionId, "section ID");

//       filter.sectionId = query.sectionId;
//     }

//     // ==========================================
//     // STATUS FILTER
//     // ==========================================

//     if (query.status) {
//       const allowedStatuses: StudentStatus[] = [
//         "ACTIVE",
//         "INACTIVE",
//         "TRANSFERRED",
//         "PASSED",
//         "LEFT",
//       ];

//       if (!allowedStatuses.includes(query.status as StudentStatus)) {
//         throw new Error("Invalid student status");
//       }

//       filter.status = query.status;
//     }

//     // ==========================================
//     // SEARCH
//     // ==========================================

//     if (query.search) {
//       const search = query.search.trim();

//       if (search) {
//         filter.$or = [
//           {
//             name: {
//               $regex: search,
//               $options: "i",
//             },
//           },

//           {
//             admissionNumber: {
//               $regex: search,
//               $options: "i",
//             },
//           },

//           {
//             apaarId: {
//               $regex: search,
//               $options: "i",
//             },
//           },
//         ];
//       }
//     }

//     // ==========================================
//     // FETCH
//     // ==========================================

//     const [students, total] = await Promise.all([
//       Student.find(filter)

//         .populate("sessionId")

//         .populate("classId")

//         .populate("sectionId")

//         .populate("parentId")

//         .sort({
//           createdAt: -1,
//         })

//         .skip(skip)

//         .limit(limit),

//       Student.countDocuments(filter),
//     ]);

//     return {
//       students,

//       pagination: {
//         page,

//         limit,

//         total,

//         totalPages: Math.ceil(total / limit),
//       },
//     };
//   }

//   // ============================================
//   // GET SINGLE STUDENT
//   // ============================================

//   async getStudentById(schoolId: string, studentId: string) {
//     this.validateObjectId(schoolId, "school ID");

//     this.validateObjectId(studentId, "student ID");

//     const student = await Student.findOne({
//       _id: studentId,
//       schoolId,
//     })

//       .populate("sessionId")

//       .populate("classId")

//       .populate("sectionId")

//       .populate("parentId");

//     if (!student) {
//       throw new Error("Student not found");
//     }

//     return student;
//   }

//   // ============================================
//   // UPDATE STUDENT
//   // ============================================

//   async updateStudent(
//     schoolId: string,
//     userId: string,
//     studentId: string,
//     data: IUpdateStudentRequest,
//   ) {
//     this.validateObjectId(schoolId, "school ID");

//     this.validateObjectId(userId, "user ID");

//     this.validateObjectId(studentId, "student ID");

//     const existingStudent = await Student.findOne({
//       _id: studentId,
//       schoolId,
//     });

//     if (!existingStudent) {
//       throw new Error("Student not found");
//     }

//     // ==========================================
//     // ACADEMIC FIELDS ARE ENROLLMENT-CONTROLLED
//     // ==========================================

//     if (
//       data.sessionId !== undefined ||
//       data.classId !== undefined ||
//       data.sectionId !== undefined ||
//       data.rollNumber !== undefined
//     ) {
//       throw new Error(
//         "Session, class, section and roll number must be changed through the student enrollment/promotion APIs",
//       );
//     }

//     // ==========================================
//     // FINAL ACADEMIC VALUES
//     // ==========================================

//     const sessionId = data.sessionId ?? existingStudent.sessionId.toString();

//     const classId = data.classId ?? existingStudent.classId.toString();

//     const sectionId = data.sectionId ?? existingStudent.sectionId.toString();

//     if (data.sessionId || data.classId || data.sectionId) {
//       await this.validateAcademicMapping(
//         schoolId,
//         sessionId,
//         classId,
//         sectionId,
//       );
//     }

//     // ==========================================
//     // ADMISSION NUMBER
//     // ==========================================

//     let admissionNumber = existingStudent.admissionNumber;

//     if (data.admissionNumber !== undefined) {
//       admissionNumber = data.admissionNumber.trim().toUpperCase();

//       if (!admissionNumber) {
//         throw new Error("Admission number cannot be empty");
//       }

//       const duplicateAdmission = await Student.findOne({
//         _id: {
//           $ne: studentId,
//         },

//         schoolId,

//         sessionId,

//         admissionNumber,
//       }).lean();

//       if (duplicateAdmission) {
//         throw new Error("Admission number already exists");
//       }
//     }

//     // ==========================================
//     // APAAR ID
//     // ==========================================

//     if (data.apaarId !== undefined && data.apaarId.trim()) {
//       const apaarId = this.validateApaarId(data.apaarId);

//       const duplicateApaarId = await Student.findOne({
//         _id: {
//           $ne: studentId,
//         },

//         schoolId,

//         apaarId,
//       }).lean();

//       if (duplicateApaarId) {
//         throw new Error("APAAR ID already exists");
//       }
//     }

//     // ==========================================
//     // ROLL NUMBER
//     // ==========================================

//     const finalRollNumber =
//       data.rollNumber !== undefined
//         ? data.rollNumber
//         : existingStudent.rollNumber;

//     if (finalRollNumber !== undefined) {
//       if (!Number.isInteger(finalRollNumber) || finalRollNumber < 1) {
//         throw new Error("Roll number must be a positive integer");
//       }

//       const duplicateRoll = await Student.findOne({
//         _id: {
//           $ne: studentId,
//         },

//         schoolId,

//         sessionId,

//         classId,

//         sectionId,

//         rollNumber: finalRollNumber,
//       }).lean();

//       if (duplicateRoll) {
//         throw new Error("Roll number already exists in this class and section");
//       }
//     }

//     // ==========================================
//     // PARENT ID
//     // ==========================================

//     if (
//       data.parentId !== undefined &&
//       data.parentId !== null &&
//       !Types.ObjectId.isValid(data.parentId)
//     ) {
//       throw new Error("Invalid parent ID");
//     }

//     // ==========================================
//     // UPDATE PAYLOAD
//     // ==========================================

//     const updateData: Record<string, unknown> = {
//       updatedBy: userId,
//     };

//     // ==========================================
//     // ACADEMIC DETAILS
//     // ==========================================

//     if (data.sessionId !== undefined) {
//       updateData.sessionId = data.sessionId;
//     }

//     if (data.classId !== undefined) {
//       updateData.classId = data.classId;
//     }

//     if (data.sectionId !== undefined) {
//       updateData.sectionId = data.sectionId;
//     }

//     // ==========================================
//     // ADMISSION DETAILS
//     // ==========================================

//     if (data.admissionNumber !== undefined) {
//       updateData.admissionNumber = admissionNumber;
//     }

//     if (data.rollNumber !== undefined) {
//       updateData.rollNumber = data.rollNumber;
//     }

//     if (data.admissionType !== undefined) {
//       updateData.admissionType = data.admissionType;
//     }

//     if (data.admissionCategory !== undefined) {
//       updateData.admissionCategory = data.admissionCategory;
//     }

//     if (data.admissionDate !== undefined) {
//       updateData.admissionDate = new Date(data.admissionDate);
//     }

//     // ==========================================
//     // BASIC DETAILS
//     // ==========================================

//     if (data.name !== undefined) {
//       const name = data.name.trim();

//       if (!name) {
//         throw new Error("Student name cannot be empty");
//       }

//       updateData.name = name;
//     }

//     if (data.dob !== undefined) {
//       updateData.dob = new Date(data.dob);
//     }

//     if (data.gender !== undefined) {
//       updateData.gender = data.gender;
//     }

//     if (data.bloodGroup !== undefined) {
//       updateData.bloodGroup = data.bloodGroup;
//     }

//     if (data.religion !== undefined) {
//       updateData.religion = data.religion.trim();
//     }

//     if (data.category !== undefined) {
//       updateData.category = data.category;
//     }

//     if (data.caste !== undefined) {
//       updateData.caste = data.caste.trim();
//     }

//     if (data.aadhaarNumber !== undefined) {
//       updateData.aadhaarNumber = data.aadhaarNumber
//         ? this.validateAadhaarNumber(
//             data.aadhaarNumber,
//             "Student Aadhaar number",
//           )
//         : "";
//     }

//     if (data.apaarId !== undefined && data.apaarId.trim()) {
//       updateData.apaarId = this.validateApaarId(data.apaarId);
//     }

//     if (data.photo !== undefined) {
//       updateData.photo = data.photo.trim();
//     }

//     // ==========================================
//     // CONTACT DETAILS
//     // ==========================================

//     if (data.mobile !== undefined) {
//       updateData.mobile = data.mobile.trim();
//     }

//     if (data.email !== undefined) {
//       updateData.email = data.email.trim().toLowerCase();
//     }

//     // ==========================================
//     // OLD ADDRESS
//     // ==========================================

//     if (data.address !== undefined) {
//       updateData.address = data.address;
//     }

//     // ==========================================
//     // CURRENT ADDRESS
//     // ==========================================

//     if (data.currentAddress !== undefined) {
//       updateData.currentAddress = data.currentAddress;
//     }

//     // ==========================================
//     // PERMANENT ADDRESS
//     // ==========================================

//     if (data.permanentAddress !== undefined) {
//       updateData.permanentAddress = data.permanentAddress;
//     }

//     // ==========================================
//     // FATHER DETAILS
//     // ==========================================

//     if (data.father !== undefined) {
//       const father = {
//         ...data.father,
//       };

//       if (father.name) {
//         father.name = father.name.trim();
//       }

//       if (father.mobile) {
//         father.mobile = father.mobile.trim();
//       }

//       if (father.occupation) {
//         father.occupation = father.occupation.trim();
//       }

//       if (father.aadhaarNumber) {
//         father.aadhaarNumber = this.validateAadhaarNumber(
//           father.aadhaarNumber,
//           "Father Aadhaar number",
//         );
//       }

//       updateData.father = father;
//     }

//     // ==========================================
//     // MOTHER DETAILS
//     // ==========================================

//     if (data.mother !== undefined) {
//       const mother = {
//         ...data.mother,
//       };

//       if (mother.name) {
//         mother.name = mother.name.trim();
//       }

//       if (mother.mobile) {
//         mother.mobile = mother.mobile.trim();
//       }

//       if (mother.occupation) {
//         mother.occupation = mother.occupation.trim();
//       }

//       if (mother.aadhaarNumber) {
//         mother.aadhaarNumber = this.validateAadhaarNumber(
//           mother.aadhaarNumber,
//           "Mother Aadhaar number",
//         );
//       }

//       updateData.mother = mother;
//     }

//     // ==========================================
//     // EXISTING PARENT RELATION
//     // ==========================================

//     if (data.parentId !== undefined) {
//       updateData.parentId = data.parentId;
//     }

//     // ==========================================
//     // STATUS
//     // ==========================================

//     if (data.status !== undefined) {
//       updateData.status = data.status;
//     }

//     // ==========================================
//     // UPDATE
//     // ==========================================

//     const student = await Student.findOneAndUpdate(
//       {
//         _id: studentId,

//         schoolId,
//       },

//       updateData,

//       {
//         new: true,
//         runValidators: true,
//       },
//     );

//     if (!student) {
//       throw new Error("Student not found");
//     }

//     return student;
//   }

//   // ============================================
//   // UPDATE STUDENT STATUS
//   // ============================================

//   async updateStatus(
//     schoolId: string,
//     userId: string,
//     studentId: string,
//     status: StudentStatus,
//   ) {
//     this.validateObjectId(schoolId, "school ID");

//     this.validateObjectId(userId, "user ID");

//     this.validateObjectId(studentId, "student ID");

//     const allowedStatuses: StudentStatus[] = [
//       "ACTIVE",
//       "INACTIVE",
//       "TRANSFERRED",
//       "PASSED",
//       "LEFT",
//     ];

//     if (!allowedStatuses.includes(status)) {
//       throw new Error("Invalid student status");
//     }

//     const student = await Student.findOneAndUpdate(
//       {
//         _id: studentId,

//         schoolId,
//       },

//       {
//         status,

//         updatedBy: userId,
//       },

//       {
//         new: true,
//         runValidators: true,
//       },
//     );

//     if (!student) {
//       throw new Error("Student not found");
//     }

//     return student;
//   }

//   // ============================================
//   // CREATE STUDENT LOGIN ACCOUNT
//   // ============================================

//   async createStudentAccount(
//     schoolId: string,
//     userId: string,
//     studentId: string,
//     data: ICreateStudentAccountRequest,
//   ) {
//     // ==========================================
//     // VALIDATE IDS
//     // ==========================================

//     this.validateObjectId(schoolId, "school ID");

//     this.validateObjectId(userId, "user ID");

//     this.validateObjectId(studentId, "student ID");

//     // ==========================================
//     // VALIDATE EMAIL
//     // ==========================================

//     if (!data.email || !data.email.trim()) {
//       throw new Error("Email is required");
//     }

//     const email = data.email.trim().toLowerCase();

//     // ==========================================
//     // VALIDATE PASSWORD
//     // ==========================================

//     if (!data.password || !data.password.trim()) {
//       throw new Error("Password is required");
//     }

//     if (data.password.length < 6) {
//       throw new Error("Password must be at least 6 characters");
//     }

//     // ==========================================
//     // FIND STUDENT
//     // TENANT ISOLATION
//     // ==========================================

//     const student = await Student.findOne({
//       _id: studentId,

//       schoolId,
//     });

//     if (!student) {
//       throw new Error("Student not found");
//     }

//     // ==========================================
//     // STUDENT ACTIVE CHECK
//     // ==========================================

//     if (student.status !== "ACTIVE") {
//       throw new Error("Only active students can have login accounts");
//     }

//     // ==========================================
//     // ACCOUNT ALREADY LINKED
//     // ==========================================

//     if (student.userId) {
//       throw new Error("Student login account already exists");
//     }

//     // ==========================================
//     // DUPLICATE EMAIL CHECK
//     // ==========================================

//     const existingUser = await User.findOne({
//       email,
//     }).lean();

//     if (existingUser) {
//       throw new Error("Email is already registered");
//     }

//     // ==========================================
//     // HASH PASSWORD
//     // ==========================================

//     const hashedPassword = await bcrypt.hash(data.password, 10);

//     // ==========================================
//     // CREATE STUDENT USER ACCOUNT
//     // ==========================================

//     const studentUser = await User.create({
//       name: student.name,

//       email,

//       ...(student.mobile
//         ? {
//             mobile: student.mobile,
//           }
//         : {}),

//       password: hashedPassword,

//       role: UserRole.STUDENT,

//       schoolId,

//       isActive: true,
//     });

//     // ==========================================
//     // LINK USER WITH STUDENT
//     // ==========================================

//     student.userId = studentUser._id as Types.ObjectId;

//     student.updatedBy = new Types.ObjectId(userId);

//     await student.save();

//     // ==========================================
//     // RETURN SAFE DATA
//     // ==========================================

//     return {
//       student: {
//         id: student._id,

//         name: student.name,

//         admissionNumber: student.admissionNumber,

//         userId: studentUser._id,

//         email: studentUser.email,

//         role: studentUser.role,

//         schoolId: studentUser.schoolId,
//       },
//     };
//   }
// }

// export default new StudentService();










// import bcrypt from "bcrypt";
// import mongoose, { Types } from "mongoose";

// import Student from "./student.model";

// import StudentAdmissionCounter from "./studentAdmissionCounter.model";

// import StudentRollNumberCounter from "./studentRollNumberCounter.model";

// import {
//   StudentEnrollment,
// } from "./studentEnrollment.model";

// import {
//   createInitialEnrollment,
// } from "./studentEnrollment.service";

// import { User } from "../auth/user.model";

// import { School } from "../schools/school.model";

// import { UserRole } from "../../constants/roles";

// import type {
//   ICreateStudentRequest,
//   IUpdateStudentRequest,
//   IStudentQuery,
//   ICreateStudentAccountRequest,
// } from "./student.types";

// import type { StudentStatus } from "./student.interface";

// import { ClassModel } from "../academic/classes/class.model";

// import { Section } from "../academic/sections/section.model";

// import { AcademicSession } from "../academic/academicSession.model";

// export class StudentService {
//   // ============================================
//   // VALIDATE OBJECT ID
//   // ============================================

//   private validateObjectId(id: string, fieldName: string) {
//     if (!Types.ObjectId.isValid(id)) {
//       throw new Error(`Invalid ${fieldName}`);
//     }
//   }

//   // ============================================
//   // VALIDATE AADHAAR NUMBER
//   // ============================================

//   private validateAadhaarNumber(aadhaarNumber: string, fieldName: string) {
//     const value = aadhaarNumber.replace(/\s/g, "").trim();

//     if (!/^\d{12}$/.test(value)) {
//       throw new Error(`${fieldName} must be exactly 12 digits`);
//     }

//     return value;
//   }

//   // ============================================
//   // VALIDATE APAAR ID
//   // ============================================

//   private validateApaarId(apaarId: string) {
//     const value = apaarId.replace(/\s/g, "").trim();

//     if (!/^\d{12}$/.test(value)) {
//       throw new Error("APAAR ID must be exactly 12 digits");
//     }

//     return value;
//   }

//   // ============================================
//   // GENERATE ADMISSION NUMBER
//   // ============================================

//   private async generateAdmissionNumber(
//     schoolId: string,
//     sessionId: string,
//     mongoSession: mongoose.ClientSession,
//   ) {
//     const [school, academicSession] = await Promise.all([
//       School.findOne({
//         _id: schoolId,
//       })
//         .select("code")
//         .session(mongoSession)
//         .lean(),

//       AcademicSession.findOne({
//         _id: sessionId,
//         schoolId,
//       })
//         .select("name")
//         .session(mongoSession)
//         .lean(),
//     ]);

//     if (!school) {
//       throw new Error("School not found");
//     }

//     if (!academicSession) {
//       throw new Error(
//         "Academic session not found for this school",
//       );
//     }

//     const schoolCode = school.code
//       .trim()
//       .toUpperCase()
//       .replace(/[^A-Z0-9-]/g, "");

//     const sessionName = academicSession.name
//       .trim()
//       .toUpperCase()
//       .replace(/\s+/g, "")
//       .replace(/\//g, "-");

//     if (!schoolCode) {
//       throw new Error(
//         "School code is required to generate admission number",
//       );
//     }

//     if (!sessionName) {
//       throw new Error(
//         "Academic session name is required to generate admission number",
//       );
//     }

//     const counter =
//       await StudentAdmissionCounter.findOneAndUpdate(
//         {
//           schoolId,
//           sessionId,
//         },
//         {
//           $inc: {
//             sequence: 1,
//           },
//         },
//         {
//           new: true,
//           upsert: true,
//           setDefaultsOnInsert: true,
//           runValidators: true,
//           session: mongoSession,
//         },
//       );

//     if (!counter) {
//       throw new Error(
//         "Failed to generate admission number",
//       );
//     }

//     const sequence = String(
//       counter.sequence,
//     ).padStart(4, "0");

//     return `${schoolCode}/${sessionName}/${sequence}`;
//   }

//   // ============================================
//   // GENERATE CLASS-WISE ROLL NUMBER
//   //
//   // Roll number poori class me continuous rahega.
//   // Section change hone par reset nahi hoga.
//   // ============================================

//   private async generateRollNumber(
//     schoolId: string,
//     sessionId: string,
//     classId: string,
//     sectionId: string,
//     mongoSession: mongoose.ClientSession,
//   ) {
//     const classSections =
//       await Section.find({
//         schoolId,
//         sessionId,
//         classId,
//         isActive: true,
//       })
//         .sort({
//           name: 1,
//         })
//         .session(mongoSession)
//         .lean();

//     const selectedSectionIndex =
//       classSections.findIndex(
//         (section) =>
//           section._id.toString() ===
//           sectionId,
//       );

//     if (selectedSectionIndex === -1) {
//       throw new Error(
//         "Selected section not found or inactive",
//       );
//     }

//     const selectedSection =
//       classSections[
//         selectedSectionIndex
//       ];

//     if (!selectedSection) {
//       throw new Error(
//         "Selected section not found",
//       );
//     }

//     if (
//       !selectedSection.capacity ||
//       selectedSection.capacity < 1
//     ) {
//       throw new Error(
//         `Capacity must be configured for Section ${selectedSection.name}`,
//       );
//     }

//     let sectionRollStart = 1;

//     for (
//       let index = 0;
//       index < selectedSectionIndex;
//       index += 1
//     ) {
//       const previousSection =
//         classSections[index];

//       if (!previousSection) {
//         continue;
//       }

//       if (
//         !previousSection.capacity ||
//         previousSection.capacity < 1
//       ) {
//         throw new Error(
//           `Capacity must be configured for Section ${previousSection.name}`,
//         );
//       }

//       const previousSectionStudents =
//         await StudentEnrollment.countDocuments({
//           schoolId,
//           sessionId,
//           classId,
//           sectionId:
//             previousSection._id,
//           enrollmentStatus: {
//             $ne: "CANCELLED",
//           },
//         }).session(mongoSession);

//       if (
//         previousSectionStudents <
//         previousSection.capacity
//       ) {
//         throw new Error(
//           `Section ${previousSection.name} must be filled before Section ${selectedSection.name}`,
//         );
//       }

//       sectionRollStart +=
//         previousSection.capacity;
//     }

//     const selectedSectionStudents =
//       await StudentEnrollment.countDocuments({
//         schoolId,
//         sessionId,
//         classId,
//         sectionId,
//         enrollmentStatus: {
//           $ne: "CANCELLED",
//         },
//       }).session(mongoSession);

//     if (
//       selectedSectionStudents >=
//       selectedSection.capacity
//     ) {
//       throw new Error(
//         `Section ${selectedSection.name} has reached its capacity of ${selectedSection.capacity} students`,
//       );
//     }

//     const sectionRollEnd =
//       sectionRollStart +
//       selectedSection.capacity -
//       1;

//     const highestExistingEnrollment =
//       await StudentEnrollment.findOne({
//         schoolId,
//         sessionId,
//         classId,
//         rollNumber: {
//           $exists: true,
//         },
//       })
//         .sort({
//           rollNumber: -1,
//         })
//         .select("rollNumber")
//         .session(mongoSession)
//         .lean();

//     const highestExistingRoll =
//       highestExistingEnrollment
//         ?.rollNumber ?? 0;

//     await StudentRollNumberCounter.findOneAndUpdate(
//       {
//         schoolId,
//         sessionId,
//         classId,
//       },
//       {
//         $max: {
//           sequence:
//             highestExistingRoll,
//         },
//       },
//       {
//         upsert: true,
//         runValidators: true,
//         session: mongoSession,
//       },
//     );

//     const counter =
//       await StudentRollNumberCounter.findOneAndUpdate(
//         {
//           schoolId,
//           sessionId,
//           classId,
//         },
//         {
//           $inc: {
//             sequence: 1,
//           },
//         },
//         {
//           new: true,
//           runValidators: true,
//           session: mongoSession,
//         },
//       );

//     if (!counter) {
//       throw new Error(
//         "Failed to generate roll number",
//       );
//     }

//     const rollNumber =
//       counter.sequence;

//     if (
//       rollNumber <
//         sectionRollStart ||
//       rollNumber >
//         sectionRollEnd
//     ) {
//       throw new Error(
//         `Next roll number ${rollNumber} does not belong to Section ${selectedSection.name} range ${sectionRollStart}-${sectionRollEnd}`,
//       );
//     }

//     return rollNumber;
//   }

//   // ============================================
//   // VALIDATE ACADEMIC RELATIONSHIP
//   // ============================================

//   private async validateAcademicMapping(
//     schoolId: string,
//     sessionId: string,
//     classId: string,
//     sectionId: string,
//   ) {
//     this.validateObjectId(sessionId, "academic session ID");

//     this.validateObjectId(classId, "class ID");

//     this.validateObjectId(sectionId, "section ID");

//     // ------------------------------------------
//     // SESSION
//     // ------------------------------------------

//     const session = await AcademicSession.findOne({
//       _id: sessionId,
//       schoolId,
//     }).lean();

//     if (!session) {
//       throw new Error("Academic session not found for this school");
//     }

//     // ------------------------------------------
//     // CLASS
//     // ------------------------------------------

//     const classData = await ClassModel.findOne({
//       _id: classId,
//       schoolId,
//       sessionId,
//     }).lean();

//     if (!classData) {
//       throw new Error("Class does not belong to selected academic session");
//     }

//     // ------------------------------------------
//     // SECTION
//     // ------------------------------------------

//     const section = await Section.findOne({
//       _id: sectionId,
//       schoolId,
//       sessionId,
//       classId,
//     }).lean();

//     if (!section) {
//       throw new Error("Section does not belong to selected class");
//     }
//   }

//   // ============================================
//   // CREATE STUDENT
//   // ============================================

//   async createStudent(
//     schoolId: string,
//     userId: string,
//     data: ICreateStudentRequest,
//   ) {
//     this.validateObjectId(schoolId, "school ID");

//     this.validateObjectId(userId, "user ID");

//     // ==========================================
//     // REQUIRED DATA
//     // ==========================================

//     if (!data.sessionId) {
//       throw new Error("Academic session is required");
//     }

//     if (!data.classId) {
//       throw new Error("Class is required");
//     }

//     if (!data.sectionId) {
//       throw new Error("Section is required");
//     }

//     if (!data.name || !data.name.trim()) {
//       throw new Error("Student name is required");
//     }

//     // ==========================================
//     // ACADEMIC VALIDATION
//     // ==========================================

//     await this.validateAcademicMapping(
//       schoolId,
//       data.sessionId,
//       data.classId,
//       data.sectionId,
//     );

//     const manualAdmissionNumber =
//       data.admissionNumber?.trim().toUpperCase() || null;

//     // ==========================================
//     // DUPLICATE ADMISSION NUMBER
//     // ==========================================

//     if (manualAdmissionNumber) {
//       const existingAdmission = await Student.findOne({
//         schoolId,
//         sessionId: data.sessionId,
//         admissionNumber: manualAdmissionNumber,
//       }).lean();

//       if (existingAdmission) {
//         throw new Error("Admission number already exists");
//       }
//     }

//     // ==========================================
//     // DUPLICATE APAAR ID
//     // ==========================================

//     if (data.apaarId) {
//       const apaarId = this.validateApaarId(data.apaarId);

//       const existingApaarId = await Student.findOne({
//         schoolId,
//         apaarId,
//       }).lean();

//       if (existingApaarId) {
//         throw new Error("APAAR ID already exists");
//       }
//     }

//     // ==========================================
//     // PARENT VALIDATION
//     // ==========================================

//     if (data.parentId && !Types.ObjectId.isValid(data.parentId)) {
//       throw new Error("Invalid parent ID");
//     }

//     // ==========================================
//     // CREATE PAYLOAD
//     // ==========================================

//     const createData: Record<string, unknown> = {
//       schoolId,

//       sessionId: data.sessionId,

//       classId: data.classId,

//       sectionId: data.sectionId,

//       name: data.name.trim(),

//       gender: data.gender,

//       createdBy: userId,
//     };

//     // ==========================================
//     // ACADEMIC / ADMISSION DETAILS
//     // ==========================================

//     if (data.admissionType) {
//       createData.admissionType = data.admissionType;
//     }

//     if (data.admissionCategory) {
//       createData.admissionCategory = data.admissionCategory;
//     }

//     if (data.admissionDate) {
//       createData.admissionDate = new Date(data.admissionDate);
//     }

//     // ==========================================
//     // PERSONAL DETAILS
//     // ==========================================

//     if (data.dob) {
//       createData.dob = new Date(data.dob);
//     }

//     if (data.bloodGroup) {
//       createData.bloodGroup = data.bloodGroup;
//     }

//     if (data.religion) {
//       createData.religion = data.religion.trim();
//     }

//     if (data.category) {
//       createData.category = data.category;
//     }

//     if (data.caste) {
//       createData.caste = data.caste.trim();
//     }

//     if (data.aadhaarNumber) {
//       createData.aadhaarNumber = this.validateAadhaarNumber(
//         data.aadhaarNumber,
//         "Student Aadhaar number",
//       );
//     }

//     if (data.apaarId) {
//       createData.apaarId = this.validateApaarId(data.apaarId);
//     }

//     if (data.photo) {
//       createData.photo = data.photo.trim();
//     }

//     // ==========================================
//     // CONTACT DETAILS
//     // ==========================================

//     if (data.mobile) {
//       createData.mobile = data.mobile.trim();
//     }

//     if (data.email) {
//       createData.email = data.email.trim().toLowerCase();
//     }

//     // ==========================================
//     // OLD ADDRESS
//     // Keep for backward compatibility
//     // ==========================================

//     if (data.address) {
//       createData.address = data.address;
//     }

//     // ==========================================
//     // CURRENT ADDRESS
//     // ==========================================

//     if (data.currentAddress) {
//       createData.currentAddress = data.currentAddress;
//     }

//     // ==========================================
//     // PERMANENT ADDRESS
//     // ==========================================

//     if (data.permanentAddress) {
//       createData.permanentAddress = data.permanentAddress;
//     }

//     // ==========================================
//     // FATHER DETAILS
//     // ==========================================

//     if (data.father) {
//       const father = {
//         ...data.father,
//       };

//       if (father.name) {
//         father.name = father.name.trim();
//       }

//       if (father.mobile) {
//         father.mobile = father.mobile.trim();
//       }

//       if (father.occupation) {
//         father.occupation = father.occupation.trim();
//       }

//       if (father.aadhaarNumber) {
//         father.aadhaarNumber = this.validateAadhaarNumber(
//           father.aadhaarNumber,
//           "Father Aadhaar number",
//         );
//       }

//       createData.father = father;
//     }

//     // ==========================================
//     // MOTHER DETAILS
//     // ==========================================

//     if (data.mother) {
//       const mother = {
//         ...data.mother,
//       };

//       if (mother.name) {
//         mother.name = mother.name.trim();
//       }

//       if (mother.mobile) {
//         mother.mobile = mother.mobile.trim();
//       }

//       if (mother.occupation) {
//         mother.occupation = mother.occupation.trim();
//       }

//       if (mother.aadhaarNumber) {
//         mother.aadhaarNumber = this.validateAadhaarNumber(
//           mother.aadhaarNumber,
//           "Mother Aadhaar number",
//         );
//       }

//       createData.mother = mother;
//     }

//     // ==========================================
//     // EXISTING PARENT MODULE RELATION
//     // ==========================================

//     if (data.parentId) {
//       createData.parentId = data.parentId;
//     }

//     // ==========================================
//     // CREATE STUDENT
//     // ==========================================

//     const mongoSession = await mongoose.startSession();

//     try {
//       let createdStudent: InstanceType<typeof Student> | null = null;

//       await mongoSession.withTransaction(async () => {
//         const admissionNumber =
//           manualAdmissionNumber ??
//           (await this.generateAdmissionNumber(
//             schoolId,
//             data.sessionId,
//             mongoSession,
//           ));

//         createData.admissionNumber =
//           admissionNumber;

//         const rollNumber =
//           await this.generateRollNumber(
//             schoolId,
//             data.sessionId,
//             data.classId,
//             data.sectionId,
//             mongoSession,
//           );

//         createData.rollNumber =
//           rollNumber;

//         // ========================================
//         // CREATE STUDENT INSIDE TRANSACTION
//         // ========================================

//         const students = await Student.create([createData], {
//           session: mongoSession,
//         });

//         const student = students[0];

//         if (!student) {
//           throw new Error("Failed to create student");
//         }

//         // ========================================
//         // CREATE INITIAL ENROLLMENT
//         // SAME TRANSACTION
//         // ========================================

//         const enrollmentData = {
//           schoolId,
//           studentId: student._id.toString(),
//           sessionId: data.sessionId,
//           classId: data.classId,
//           sectionId: data.sectionId,
//           rollNumber,
//           createdBy: userId,
//         };

//         await createInitialEnrollment(enrollmentData, mongoSession);

//         createdStudent = student;
//       });

//       if (!createdStudent) {
//         throw new Error("Student creation transaction did not complete");
//       }

//       return createdStudent;
//     } finally {
//       await mongoSession.endSession();
//     }
//   }

//   // ============================================
//   // GET MY STUDENT PROFILE
//   // ============================================

//   async getMyProfile(schoolId: string, studentId: string) {
//     this.validateObjectId(schoolId, "school ID");

//     this.validateObjectId(studentId, "student ID");

//     const student = await Student.findOne({
//       _id: studentId,
//       schoolId,
//       status: "ACTIVE",
//     })
//       .populate("sessionId")
//       .populate("classId")
//       .populate("sectionId")
//       .populate("parentId")
//       .populate("userId", "name email mobile role isActive");

//     if (!student) {
//       throw new Error("Student profile not found or inactive");
//     }

//     return student;
//   }

//   // ============================================
//   // GET ALL STUDENTS
//   // ============================================

//   async getStudents(schoolId: string, query: IStudentQuery) {
//     this.validateObjectId(schoolId, "school ID");

//     let page = Number(query.page) || 1;

//     let limit = Number(query.limit) || 10;

//     if (page < 1) {
//       page = 1;
//     }

//     if (limit < 1) {
//       limit = 10;
//     }

//     if (limit > 100) {
//       limit = 100;
//     }

//     const skip = (page - 1) * limit;

//     const filter: Record<string, unknown> = {
//       schoolId,
//     };

//     // ==========================================
//     // SESSION FILTER
//     // ==========================================

//     if (query.sessionId) {
//       this.validateObjectId(query.sessionId, "academic session ID");

//       filter.sessionId = query.sessionId;
//     }

//     // ==========================================
//     // CLASS FILTER
//     // ==========================================

//     if (query.classId) {
//       this.validateObjectId(query.classId, "class ID");

//       filter.classId = query.classId;
//     }

//     // ==========================================
//     // SECTION FILTER
//     // ==========================================

//     if (query.sectionId) {
//       this.validateObjectId(query.sectionId, "section ID");

//       filter.sectionId = query.sectionId;
//     }

//     // ==========================================
//     // STATUS FILTER
//     // ==========================================

//     if (query.status) {
//       const allowedStatuses: StudentStatus[] = [
//         "ACTIVE",
//         "INACTIVE",
//         "TRANSFERRED",
//         "PASSED",
//         "LEFT",
//       ];

//       if (!allowedStatuses.includes(query.status as StudentStatus)) {
//         throw new Error("Invalid student status");
//       }

//       filter.status = query.status;
//     }

//     // ==========================================
//     // SEARCH
//     // ==========================================

//     if (query.search) {
//       const search = query.search.trim();

//       if (search) {
//         filter.$or = [
//           {
//             name: {
//               $regex: search,
//               $options: "i",
//             },
//           },

//           {
//             admissionNumber: {
//               $regex: search,
//               $options: "i",
//             },
//           },

//           {
//             apaarId: {
//               $regex: search,
//               $options: "i",
//             },
//           },
//         ];
//       }
//     }

//     // ==========================================
//     // FETCH
//     // ==========================================

//     const [students, total] = await Promise.all([
//       Student.find(filter)

//         .populate("sessionId")

//         .populate("classId")

//         .populate("sectionId")

//         .populate("parentId")

//         .sort({
//           createdAt: -1,
//         })

//         .skip(skip)

//         .limit(limit),

//       Student.countDocuments(filter),
//     ]);

//     return {
//       students,

//       pagination: {
//         page,

//         limit,

//         total,

//         totalPages: Math.ceil(total / limit),
//       },
//     };
//   }

//   // ============================================
//   // GET SINGLE STUDENT
//   // ============================================

//   async getStudentById(schoolId: string, studentId: string) {
//     this.validateObjectId(schoolId, "school ID");

//     this.validateObjectId(studentId, "student ID");

//     const student = await Student.findOne({
//       _id: studentId,
//       schoolId,
//     })

//       .populate("sessionId")

//       .populate("classId")

//       .populate("sectionId")

//       .populate("parentId");

//     if (!student) {
//       throw new Error("Student not found");
//     }

//     return student;
//   }

//   // ============================================
//   // UPDATE STUDENT
//   // ============================================

//   async updateStudent(
//     schoolId: string,
//     userId: string,
//     studentId: string,
//     data: IUpdateStudentRequest,
//   ) {
//     this.validateObjectId(schoolId, "school ID");

//     this.validateObjectId(userId, "user ID");

//     this.validateObjectId(studentId, "student ID");

//     const existingStudent = await Student.findOne({
//       _id: studentId,
//       schoolId,
//     });

//     if (!existingStudent) {
//       throw new Error("Student not found");
//     }

//     // ==========================================
//     // ACADEMIC FIELDS ARE ENROLLMENT-CONTROLLED
//     // ==========================================

//     if (
//       data.sessionId !== undefined ||
//       data.classId !== undefined ||
//       data.sectionId !== undefined ||
//       data.rollNumber !== undefined
//     ) {
//       throw new Error(
//         "Session, class, section and roll number must be changed through the student enrollment/promotion APIs",
//       );
//     }

//     // ==========================================
//     // FINAL ACADEMIC VALUES
//     // ==========================================

//     const sessionId = data.sessionId ?? existingStudent.sessionId.toString();

//     const classId = data.classId ?? existingStudent.classId.toString();

//     const sectionId = data.sectionId ?? existingStudent.sectionId.toString();

//     if (data.sessionId || data.classId || data.sectionId) {
//       await this.validateAcademicMapping(
//         schoolId,
//         sessionId,
//         classId,
//         sectionId,
//       );
//     }

//     // ==========================================
//     // ADMISSION NUMBER
//     // ==========================================

//     let admissionNumber = existingStudent.admissionNumber;

//     if (data.admissionNumber !== undefined) {
//       admissionNumber = data.admissionNumber.trim().toUpperCase();

//       if (!admissionNumber) {
//         throw new Error("Admission number cannot be empty");
//       }

//       const duplicateAdmission = await Student.findOne({
//         _id: {
//           $ne: studentId,
//         },

//         schoolId,

//         sessionId,

//         admissionNumber,
//       }).lean();

//       if (duplicateAdmission) {
//         throw new Error("Admission number already exists");
//       }
//     }

//     // ==========================================
//     // APAAR ID
//     // ==========================================

//     if (data.apaarId !== undefined && data.apaarId.trim()) {
//       const apaarId = this.validateApaarId(data.apaarId);

//       const duplicateApaarId = await Student.findOne({
//         _id: {
//           $ne: studentId,
//         },

//         schoolId,

//         apaarId,
//       }).lean();

//       if (duplicateApaarId) {
//         throw new Error("APAAR ID already exists");
//       }
//     }

//     // ==========================================
//     // ROLL NUMBER
//     // ==========================================

//     const finalRollNumber =
//       data.rollNumber !== undefined
//         ? data.rollNumber
//         : existingStudent.rollNumber;

//     if (finalRollNumber !== undefined) {
//       if (!Number.isInteger(finalRollNumber) || finalRollNumber < 1) {
//         throw new Error("Roll number must be a positive integer");
//       }

//       const duplicateRoll = await Student.findOne({
//         _id: {
//           $ne: studentId,
//         },

//         schoolId,

//         sessionId,

//         classId,

//         sectionId,

//         rollNumber: finalRollNumber,
//       }).lean();

//       if (duplicateRoll) {
//         throw new Error("Roll number already exists in this class and section");
//       }
//     }

//     // ==========================================
//     // PARENT ID
//     // ==========================================

//     if (
//       data.parentId !== undefined &&
//       data.parentId !== null &&
//       !Types.ObjectId.isValid(data.parentId)
//     ) {
//       throw new Error("Invalid parent ID");
//     }

//     // ==========================================
//     // UPDATE PAYLOAD
//     // ==========================================

//     const updateData: Record<string, unknown> = {
//       updatedBy: userId,
//     };

//     // ==========================================
//     // ACADEMIC DETAILS
//     // ==========================================

//     if (data.sessionId !== undefined) {
//       updateData.sessionId = data.sessionId;
//     }

//     if (data.classId !== undefined) {
//       updateData.classId = data.classId;
//     }

//     if (data.sectionId !== undefined) {
//       updateData.sectionId = data.sectionId;
//     }

//     // ==========================================
//     // ADMISSION DETAILS
//     // ==========================================

//     if (data.admissionNumber !== undefined) {
//       updateData.admissionNumber = admissionNumber;
//     }

//     if (data.rollNumber !== undefined) {
//       updateData.rollNumber = data.rollNumber;
//     }

//     if (data.admissionType !== undefined) {
//       updateData.admissionType = data.admissionType;
//     }

//     if (data.admissionCategory !== undefined) {
//       updateData.admissionCategory = data.admissionCategory;
//     }

//     if (data.admissionDate !== undefined) {
//       updateData.admissionDate = new Date(data.admissionDate);
//     }

//     // ==========================================
//     // BASIC DETAILS
//     // ==========================================

//     if (data.name !== undefined) {
//       const name = data.name.trim();

//       if (!name) {
//         throw new Error("Student name cannot be empty");
//       }

//       updateData.name = name;
//     }

//     if (data.dob !== undefined) {
//       updateData.dob = new Date(data.dob);
//     }

//     if (data.gender !== undefined) {
//       updateData.gender = data.gender;
//     }

//     if (data.bloodGroup !== undefined) {
//       updateData.bloodGroup = data.bloodGroup;
//     }

//     if (data.religion !== undefined) {
//       updateData.religion = data.religion.trim();
//     }

//     if (data.category !== undefined) {
//       updateData.category = data.category;
//     }

//     if (data.caste !== undefined) {
//       updateData.caste = data.caste.trim();
//     }

//     if (data.aadhaarNumber !== undefined) {
//       updateData.aadhaarNumber = data.aadhaarNumber
//         ? this.validateAadhaarNumber(
//             data.aadhaarNumber,
//             "Student Aadhaar number",
//           )
//         : "";
//     }

//     if (data.apaarId !== undefined && data.apaarId.trim()) {
//       updateData.apaarId = this.validateApaarId(data.apaarId);
//     }

//     if (data.photo !== undefined) {
//       updateData.photo = data.photo.trim();
//     }

//     // ==========================================
//     // CONTACT DETAILS
//     // ==========================================

//     if (data.mobile !== undefined) {
//       updateData.mobile = data.mobile.trim();
//     }

//     if (data.email !== undefined) {
//       updateData.email = data.email.trim().toLowerCase();
//     }

//     // ==========================================
//     // OLD ADDRESS
//     // ==========================================

//     if (data.address !== undefined) {
//       updateData.address = data.address;
//     }

//     // ==========================================
//     // CURRENT ADDRESS
//     // ==========================================

//     if (data.currentAddress !== undefined) {
//       updateData.currentAddress = data.currentAddress;
//     }

//     // ==========================================
//     // PERMANENT ADDRESS
//     // ==========================================

//     if (data.permanentAddress !== undefined) {
//       updateData.permanentAddress = data.permanentAddress;
//     }

//     // ==========================================
//     // FATHER DETAILS
//     // ==========================================

//     if (data.father !== undefined) {
//       const father = {
//         ...data.father,
//       };

//       if (father.name) {
//         father.name = father.name.trim();
//       }

//       if (father.mobile) {
//         father.mobile = father.mobile.trim();
//       }

//       if (father.occupation) {
//         father.occupation = father.occupation.trim();
//       }

//       if (father.aadhaarNumber) {
//         father.aadhaarNumber = this.validateAadhaarNumber(
//           father.aadhaarNumber,
//           "Father Aadhaar number",
//         );
//       }

//       updateData.father = father;
//     }

//     // ==========================================
//     // MOTHER DETAILS
//     // ==========================================

//     if (data.mother !== undefined) {
//       const mother = {
//         ...data.mother,
//       };

//       if (mother.name) {
//         mother.name = mother.name.trim();
//       }

//       if (mother.mobile) {
//         mother.mobile = mother.mobile.trim();
//       }

//       if (mother.occupation) {
//         mother.occupation = mother.occupation.trim();
//       }

//       if (mother.aadhaarNumber) {
//         mother.aadhaarNumber = this.validateAadhaarNumber(
//           mother.aadhaarNumber,
//           "Mother Aadhaar number",
//         );
//       }

//       updateData.mother = mother;
//     }

//     // ==========================================
//     // EXISTING PARENT RELATION
//     // ==========================================

//     if (data.parentId !== undefined) {
//       updateData.parentId = data.parentId;
//     }

//     // ==========================================
//     // STATUS
//     // ==========================================

//     if (data.status !== undefined) {
//       updateData.status = data.status;
//     }

//     // ==========================================
//     // UPDATE
//     // ==========================================

//     const student = await Student.findOneAndUpdate(
//       {
//         _id: studentId,

//         schoolId,
//       },

//       updateData,

//       {
//         new: true,
//         runValidators: true,
//       },
//     );

//     if (!student) {
//       throw new Error("Student not found");
//     }

//     return student;
//   }

//   // ============================================
//   // UPDATE STUDENT STATUS
//   // ============================================

//   async updateStatus(
//     schoolId: string,
//     userId: string,
//     studentId: string,
//     status: StudentStatus,
//   ) {
//     this.validateObjectId(schoolId, "school ID");

//     this.validateObjectId(userId, "user ID");

//     this.validateObjectId(studentId, "student ID");

//     const allowedStatuses: StudentStatus[] = [
//       "ACTIVE",
//       "INACTIVE",
//       "TRANSFERRED",
//       "PASSED",
//       "LEFT",
//     ];

//     if (!allowedStatuses.includes(status)) {
//       throw new Error("Invalid student status");
//     }

//     const student = await Student.findOneAndUpdate(
//       {
//         _id: studentId,

//         schoolId,
//       },

//       {
//         status,

//         updatedBy: userId,
//       },

//       {
//         new: true,
//         runValidators: true,
//       },
//     );

//     if (!student) {
//       throw new Error("Student not found");
//     }

//     return student;
//   }

//   // ============================================
//   // CREATE STUDENT LOGIN ACCOUNT
//   // ============================================

//   async createStudentAccount(
//     schoolId: string,
//     userId: string,
//     studentId: string,
//     data: ICreateStudentAccountRequest,
//   ) {
//     // ==========================================
//     // VALIDATE IDS
//     // ==========================================

//     this.validateObjectId(schoolId, "school ID");

//     this.validateObjectId(userId, "user ID");

//     this.validateObjectId(studentId, "student ID");

//     // ==========================================
//     // VALIDATE EMAIL
//     // ==========================================

//     if (!data.email || !data.email.trim()) {
//       throw new Error("Email is required");
//     }

//     const email = data.email.trim().toLowerCase();

//     // ==========================================
//     // VALIDATE PASSWORD
//     // ==========================================

//     if (!data.password || !data.password.trim()) {
//       throw new Error("Password is required");
//     }

//     if (data.password.length < 6) {
//       throw new Error("Password must be at least 6 characters");
//     }

//     // ==========================================
//     // FIND STUDENT
//     // TENANT ISOLATION
//     // ==========================================

//     const student = await Student.findOne({
//       _id: studentId,

//       schoolId,
//     });

//     if (!student) {
//       throw new Error("Student not found");
//     }

//     // ==========================================
//     // STUDENT ACTIVE CHECK
//     // ==========================================

//     if (student.status !== "ACTIVE") {
//       throw new Error("Only active students can have login accounts");
//     }

//     // ==========================================
//     // ACCOUNT ALREADY LINKED
//     // ==========================================

//     if (student.userId) {
//       throw new Error("Student login account already exists");
//     }

//     // ==========================================
//     // DUPLICATE EMAIL CHECK
//     // ==========================================

//     const existingUser = await User.findOne({
//       email,
//     }).lean();

//     if (existingUser) {
//       throw new Error("Email is already registered");
//     }

//     // ==========================================
//     // HASH PASSWORD
//     // ==========================================

//     const hashedPassword = await bcrypt.hash(data.password, 10);

//     // ==========================================
//     // CREATE STUDENT USER ACCOUNT
//     // ==========================================

//     const studentUser = await User.create({
//       name: student.name,

//       email,

//       ...(student.mobile
//         ? {
//             mobile: student.mobile,
//           }
//         : {}),

//       password: hashedPassword,

//       role: UserRole.STUDENT,

//       schoolId,

//       isActive: true,
//     });

//     // ==========================================
//     // LINK USER WITH STUDENT
//     // ==========================================

//     student.userId = studentUser._id as Types.ObjectId;

//     student.updatedBy = new Types.ObjectId(userId);

//     await student.save();

//     // ==========================================
//     // RETURN SAFE DATA
//     // ==========================================

//     return {
//       student: {
//         id: student._id,

//         name: student.name,

//         admissionNumber: student.admissionNumber,

//         userId: studentUser._id,

//         email: studentUser.email,

//         role: studentUser.role,

//         schoolId: studentUser.schoolId,
//       },
//     };
//   }
// }

// export default new StudentService();



















import bcrypt from "bcrypt";
import { Types } from "mongoose";

import Student from "./student.model";

import StudentAdmissionCounter from "./studentAdmissionCounter.model";

import StudentRollNumberCounter from "./studentRollNumberCounter.model";

import {
  StudentEnrollment,
} from "./studentEnrollment.model";

import {
  createInitialEnrollment,
} from "./studentEnrollment.service";

import { User } from "../auth/user.model";

import { School } from "../schools/school.model";

import { UserRole } from "../../constants/roles";

import type {
  ICreateStudentRequest,
  IUpdateStudentRequest,
  IStudentQuery,
  ICreateStudentAccountRequest,
} from "./student.types";

import type { StudentStatus } from "./student.interface";

import { ClassModel } from "../academic/classes/class.model";

import { Section } from "../academic/sections/section.model";

import { AcademicSession } from "../academic/academicSession.model";

export class StudentService {
  // ============================================
  // VALIDATE OBJECT ID
  // ============================================

  private validateObjectId(id: string, fieldName: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error(`Invalid ${fieldName}`);
    }
  }

  // ============================================
  // VALIDATE AADHAAR NUMBER
  // ============================================

  private validateAadhaarNumber(aadhaarNumber: string, fieldName: string) {
    const value = aadhaarNumber.replace(/\s/g, "").trim();

    if (!/^\d{12}$/.test(value)) {
      throw new Error(`${fieldName} must be exactly 12 digits`);
    }

    return value;
  }

  // ============================================
  // VALIDATE APAAR ID
  // ============================================

  private validateApaarId(apaarId: string) {
    const value = apaarId.replace(/\s/g, "").trim();

    if (!/^\d{12}$/.test(value)) {
      throw new Error("APAAR ID must be exactly 12 digits");
    }

    return value;
  }

  // ============================================
  // GENERATE ADMISSION NUMBER
  // ============================================

  private async generateAdmissionNumber(
    schoolId: string,
    sessionId: string,
  ) {
    const [school, academicSession] = await Promise.all([
      School.findOne({
        _id: schoolId,
      })
        .select("code")
        .lean(),

      AcademicSession.findOne({
        _id: sessionId,
        schoolId,
      })
        .select("name")
        .lean(),
    ]);

    if (!school) {
      throw new Error("School not found");
    }

    if (!academicSession) {
      throw new Error(
        "Academic session not found for this school",
      );
    }

    const schoolCode = school.code
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9-]/g, "");

    const sessionName = academicSession.name
      .trim()
      .toUpperCase()
      .replace(/\s+/g, "")
      .replace(/\//g, "-");

    if (!schoolCode) {
      throw new Error(
        "School code is required to generate admission number",
      );
    }

    if (!sessionName) {
      throw new Error(
        "Academic session name is required to generate admission number",
      );
    }

    const counter =
      await StudentAdmissionCounter.findOneAndUpdate(
        {
          schoolId,
          sessionId,
        },
        {
          $inc: {
            sequence: 1,
          },
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
          runValidators: true,
        },
      );

    if (!counter) {
      throw new Error(
        "Failed to generate admission number",
      );
    }

    const sequence = String(
      counter.sequence,
    ).padStart(4, "0");

    return `${schoolCode}/${sessionName}/${sequence}`;
  }

  // ============================================
  // GENERATE CLASS-WISE ROLL NUMBER
  //
  // Roll number poori class me continuous rahega.
  // Section change hone par reset nahi hoga.
  // ============================================

  private async generateRollNumber(
    schoolId: string,
    sessionId: string,
    classId: string,
    sectionId: string,
  ) {
    const classSections =
      await Section.find({
        schoolId,
        sessionId,
        classId,
        isActive: true,
      })
        .sort({
          name: 1,
        })
        .lean();

    const selectedSectionIndex =
      classSections.findIndex(
        (section) =>
          section._id.toString() ===
          sectionId,
      );

    if (selectedSectionIndex === -1) {
      throw new Error(
        "Selected section not found or inactive",
      );
    }

    const selectedSection =
      classSections[
        selectedSectionIndex
      ];

    if (!selectedSection) {
      throw new Error(
        "Selected section not found",
      );
    }

    if (
      !selectedSection.capacity ||
      selectedSection.capacity < 1
    ) {
      throw new Error(
        `Capacity must be configured for Section ${selectedSection.name}`,
      );
    }

    let sectionRollStart = 1;

    for (
      let index = 0;
      index < selectedSectionIndex;
      index += 1
    ) {
      const previousSection =
        classSections[index];

      if (!previousSection) {
        continue;
      }

      if (
        !previousSection.capacity ||
        previousSection.capacity < 1
      ) {
        throw new Error(
          `Capacity must be configured for Section ${previousSection.name}`,
        );
      }

      const previousSectionStudents =
        await StudentEnrollment.countDocuments({
          schoolId,
          sessionId,
          classId,
          sectionId:
            previousSection._id,
          enrollmentStatus: {
            $ne: "CANCELLED",
          },
        });

      if (
        previousSectionStudents <
        previousSection.capacity
      ) {
        throw new Error(
          `Section ${previousSection.name} must be filled before Section ${selectedSection.name}`,
        );
      }

      sectionRollStart +=
        previousSection.capacity;
    }

    const selectedSectionStudents =
      await StudentEnrollment.countDocuments({
        schoolId,
        sessionId,
        classId,
        sectionId,
        enrollmentStatus: {
          $ne: "CANCELLED",
        },
      });

    if (
      selectedSectionStudents >=
      selectedSection.capacity
    ) {
      throw new Error(
        `Section ${selectedSection.name} has reached its capacity of ${selectedSection.capacity} students`,
      );
    }

    const sectionRollEnd =
      sectionRollStart +
      selectedSection.capacity -
      1;

    const highestExistingEnrollment =
      await StudentEnrollment.findOne({
        schoolId,
        sessionId,
        classId,
        rollNumber: {
          $exists: true,
        },
      })
        .sort({
          rollNumber: -1,
        })
        .select("rollNumber")
        .lean();

    const highestExistingRoll =
      highestExistingEnrollment
        ?.rollNumber ?? 0;

    await StudentRollNumberCounter.findOneAndUpdate(
      {
        schoolId,
        sessionId,
        classId,
      },
      {
        $max: {
          sequence:
            highestExistingRoll,
        },
      },
      {
        upsert: true,
        runValidators: true,
      },
    );

    const counter =
      await StudentRollNumberCounter.findOneAndUpdate(
        {
          schoolId,
          sessionId,
          classId,
        },
        {
          $inc: {
            sequence: 1,
          },
        },
        {
          new: true,
          runValidators: true,
        },
      );

    if (!counter) {
      throw new Error(
        "Failed to generate roll number",
      );
    }

    const rollNumber =
      counter.sequence;

    if (
      rollNumber <
        sectionRollStart ||
      rollNumber >
        sectionRollEnd
    ) {
      throw new Error(
        `Next roll number ${rollNumber} does not belong to Section ${selectedSection.name} range ${sectionRollStart}-${sectionRollEnd}`,
      );
    }

    return rollNumber;
  }

  // ============================================
  // VALIDATE ACADEMIC RELATIONSHIP
  // ============================================

  private async validateAcademicMapping(
    schoolId: string,
    sessionId: string,
    classId: string,
    sectionId: string,
  ) {
    this.validateObjectId(sessionId, "academic session ID");

    this.validateObjectId(classId, "class ID");

    this.validateObjectId(sectionId, "section ID");

    // ------------------------------------------
    // SESSION
    // ------------------------------------------

    const session = await AcademicSession.findOne({
      _id: sessionId,
      schoolId,
    }).lean();

    if (!session) {
      throw new Error("Academic session not found for this school");
    }

    // ------------------------------------------
    // CLASS
    // ------------------------------------------

    const classData = await ClassModel.findOne({
      _id: classId,
      schoolId,
      sessionId,
    }).lean();

    if (!classData) {
      throw new Error("Class does not belong to selected academic session");
    }

    // ------------------------------------------
    // SECTION
    // ------------------------------------------

    const section = await Section.findOne({
      _id: sectionId,
      schoolId,
      sessionId,
      classId,
    }).lean();

    if (!section) {
      throw new Error("Section does not belong to selected class");
    }
  }

  // ============================================
  // CREATE STUDENT
  // ============================================

  async createStudent(
    schoolId: string,
    userId: string,
    data: ICreateStudentRequest,
  ) {
    this.validateObjectId(schoolId, "school ID");

    this.validateObjectId(userId, "user ID");

    // ==========================================
    // REQUIRED DATA
    // ==========================================

    if (!data.sessionId) {
      throw new Error("Academic session is required");
    }

    if (!data.classId) {
      throw new Error("Class is required");
    }

    if (!data.sectionId) {
      throw new Error("Section is required");
    }

    if (!data.name || !data.name.trim()) {
      throw new Error("Student name is required");
    }

    // ==========================================
    // ACADEMIC VALIDATION
    // ==========================================

    await this.validateAcademicMapping(
      schoolId,
      data.sessionId,
      data.classId,
      data.sectionId,
    );

    const manualAdmissionNumber =
      data.admissionNumber?.trim().toUpperCase() || null;

    // ==========================================
    // DUPLICATE ADMISSION NUMBER
    // ==========================================

    if (manualAdmissionNumber) {
      const existingAdmission = await Student.findOne({
        schoolId,
        sessionId: data.sessionId,
        admissionNumber: manualAdmissionNumber,
      }).lean();

      if (existingAdmission) {
        throw new Error("Admission number already exists");
      }
    }

    // ==========================================
    // DUPLICATE APAAR ID
    // ==========================================

    if (data.apaarId) {
      const apaarId = this.validateApaarId(data.apaarId);

      const existingApaarId = await Student.findOne({
        schoolId,
        apaarId,
      }).lean();

      if (existingApaarId) {
        throw new Error("APAAR ID already exists");
      }
    }

    // ==========================================
    // PARENT VALIDATION
    // ==========================================

    if (data.parentId && !Types.ObjectId.isValid(data.parentId)) {
      throw new Error("Invalid parent ID");
    }

    // ==========================================
    // CREATE PAYLOAD
    // ==========================================

    const createData: Record<string, unknown> = {
      schoolId,

      sessionId: data.sessionId,

      classId: data.classId,

      sectionId: data.sectionId,

      name: data.name.trim(),

      gender: data.gender,

      createdBy: userId,
    };

    // ==========================================
    // ACADEMIC / ADMISSION DETAILS
    // ==========================================

    if (data.admissionType) {
      createData.admissionType = data.admissionType;
    }

    if (data.admissionCategory) {
      createData.admissionCategory = data.admissionCategory;
    }

    if (data.admissionDate) {
      createData.admissionDate = new Date(data.admissionDate);
    }

    // ==========================================
    // PERSONAL DETAILS
    // ==========================================

    if (data.dob) {
      createData.dob = new Date(data.dob);
    }

    if (data.bloodGroup) {
      createData.bloodGroup = data.bloodGroup;
    }

    if (data.religion) {
      createData.religion = data.religion.trim();
    }

    if (data.category) {
      createData.category = data.category;
    }

    if (data.caste) {
      createData.caste = data.caste.trim();
    }

    if (data.aadhaarNumber) {
      createData.aadhaarNumber = this.validateAadhaarNumber(
        data.aadhaarNumber,
        "Student Aadhaar number",
      );
    }

    if (data.apaarId) {
      createData.apaarId = this.validateApaarId(data.apaarId);
    }

   if (
  typeof data.photo === "string" &&
  data.photo.trim()
) {
  createData.photo =
    data.photo.trim();
}

    // ==========================================
    // CONTACT DETAILS
    // ==========================================

    if (data.mobile) {
      createData.mobile = data.mobile.trim();
    }

    if (data.email) {
      createData.email = data.email.trim().toLowerCase();
    }

    // ==========================================
    // OLD ADDRESS
    // Keep for backward compatibility
    // ==========================================

    if (data.address) {
      createData.address = data.address;
    }

    // ==========================================
    // CURRENT ADDRESS
    // ==========================================

    if (data.currentAddress) {
      createData.currentAddress = data.currentAddress;
    }

    // ==========================================
    // PERMANENT ADDRESS
    // ==========================================

    if (data.permanentAddress) {
      createData.permanentAddress = data.permanentAddress;
    }

    // ==========================================
    // FATHER DETAILS
    // ==========================================

    if (data.father) {
      const father = {
        ...data.father,
      };

      if (father.name) {
        father.name = father.name.trim();
      }

      if (father.mobile) {
        father.mobile = father.mobile.trim();
      }

      if (father.occupation) {
        father.occupation = father.occupation.trim();
      }

      if (father.aadhaarNumber) {
        father.aadhaarNumber = this.validateAadhaarNumber(
          father.aadhaarNumber,
          "Father Aadhaar number",
        );
      }

      createData.father = father;
    }

    // ==========================================
    // MOTHER DETAILS
    // ==========================================

    if (data.mother) {
      const mother = {
        ...data.mother,
      };

      if (mother.name) {
        mother.name = mother.name.trim();
      }

      if (mother.mobile) {
        mother.mobile = mother.mobile.trim();
      }

      if (mother.occupation) {
        mother.occupation = mother.occupation.trim();
      }

      if (mother.aadhaarNumber) {
        mother.aadhaarNumber = this.validateAadhaarNumber(
          mother.aadhaarNumber,
          "Mother Aadhaar number",
        );
      }

      createData.mother = mother;
    }

    // ==========================================
    // EXISTING PARENT MODULE RELATION
    // ==========================================

    if (data.parentId) {
      createData.parentId = data.parentId;
    }

    // ==========================================
    // CREATE STUDENT
    // ==========================================

    let createdStudent: InstanceType<typeof Student> | null = null;
    let generatedAdmissionNumber: string | null = null;
    let generatedRollNumber: number | null = null;

    try {
      const admissionNumber =
        manualAdmissionNumber ??
        (await this.generateAdmissionNumber(
          schoolId,
          data.sessionId,
        ));

      if (!manualAdmissionNumber) {
        generatedAdmissionNumber = admissionNumber;
      }

      createData.admissionNumber = admissionNumber;

      const rollNumber = await this.generateRollNumber(
        schoolId,
        data.sessionId,
        data.classId,
        data.sectionId,
      );

      generatedRollNumber = rollNumber;
      createData.rollNumber = rollNumber;

      // ========================================
      // CREATE STUDENT
      // ========================================

      createdStudent = await Student.create(createData);

      // ========================================
      // CREATE INITIAL ENROLLMENT
      // ========================================

      await createInitialEnrollment({
        schoolId,
        studentId: createdStudent._id.toString(),
        sessionId: data.sessionId,
        classId: data.classId,
        sectionId: data.sectionId,
        rollNumber,
        createdBy: userId,
      });

      return createdStudent;
    } catch (error) {
      /*
       * Standalone MongoDB multi-document transactions support nahi karta.
       * Isliye enrollment fail hone par created Student ko compensate karke
       * remove kiya jata hai. Counters ko tabhi rollback karte hain jab unke
       * baad kisi aur request ne next number reserve na kiya ho.
       */

      if (createdStudent) {
        await Student.deleteOne({
          _id: createdStudent._id,
          schoolId,
        }).catch(() => undefined);
      }

      if (generatedRollNumber !== null) {
        await StudentRollNumberCounter.findOneAndUpdate(
          {
            schoolId,
            sessionId: data.sessionId,
            classId: data.classId,
            sequence: generatedRollNumber,
          },
          {
            $inc: {
              sequence: -1,
            },
          },
        ).catch(() => undefined);
      }

      if (generatedAdmissionNumber) {
        const admissionNumberParts =
          generatedAdmissionNumber.split("/");

        const generatedSequence = Number(
          admissionNumberParts[admissionNumberParts.length - 1],
        );

        if (Number.isInteger(generatedSequence) && generatedSequence > 0) {
          await StudentAdmissionCounter.findOneAndUpdate(
            {
              schoolId,
              sessionId: data.sessionId,
              sequence: generatedSequence,
            },
            {
              $inc: {
                sequence: -1,
              },
            },
          ).catch(() => undefined);
        }
      }

      throw error;
    }
  }

  // ============================================
  // GET MY STUDENT PROFILE
  // ============================================

  async getMyProfile(schoolId: string, studentId: string) {
    this.validateObjectId(schoolId, "school ID");

    this.validateObjectId(studentId, "student ID");

    const student = await Student.findOne({
      _id: studentId,
      schoolId,
      status: "ACTIVE",
    })
      .populate("sessionId")
      .populate("classId")
      .populate("sectionId")
      .populate("parentId")
      .populate("userId", "name email mobile role isActive");

    if (!student) {
      throw new Error("Student profile not found or inactive");
    }

    return student;
  }

  // ============================================
  // GET ALL STUDENTS
  // ============================================

  async getStudents(schoolId: string, query: IStudentQuery) {
    this.validateObjectId(schoolId, "school ID");

    let page = Number(query.page) || 1;

    let limit = Number(query.limit) || 10;

    if (page < 1) {
      page = 1;
    }

    if (limit < 1) {
      limit = 10;
    }

    if (limit > 100) {
      limit = 100;
    }

    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {
      schoolId,
    };

    // ==========================================
    // SESSION FILTER
    // ==========================================

    if (query.sessionId) {
      this.validateObjectId(query.sessionId, "academic session ID");

      filter.sessionId = query.sessionId;
    }

    // ==========================================
    // CLASS FILTER
    // ==========================================

    if (query.classId) {
      this.validateObjectId(query.classId, "class ID");

      filter.classId = query.classId;
    }

    // ==========================================
    // SECTION FILTER
    // ==========================================

    if (query.sectionId) {
      this.validateObjectId(query.sectionId, "section ID");

      filter.sectionId = query.sectionId;
    }

    // ==========================================
    // STATUS FILTER
    // ==========================================

    if (query.status) {
      const allowedStatuses: StudentStatus[] = [
        "ACTIVE",
        "INACTIVE",
        "TRANSFERRED",
        "PASSED",
        "LEFT",
      ];

      if (!allowedStatuses.includes(query.status as StudentStatus)) {
        throw new Error("Invalid student status");
      }

      filter.status = query.status;
    }

    // ==========================================
    // SEARCH
    // ==========================================

    if (query.search) {
      const search = query.search.trim();

      if (search) {
        filter.$or = [
          {
            name: {
              $regex: search,
              $options: "i",
            },
          },

          {
            admissionNumber: {
              $regex: search,
              $options: "i",
            },
          },

          {
            apaarId: {
              $regex: search,
              $options: "i",
            },
          },
        ];
      }
    }

    // ==========================================
    // FETCH
    // ==========================================

    const [students, total] = await Promise.all([
      Student.find(filter)

        .populate("sessionId")

        .populate("classId")

        .populate("sectionId")

        .populate("parentId")

        .sort({
          createdAt: -1,
        })

        .skip(skip)

        .limit(limit),

      Student.countDocuments(filter),
    ]);

    return {
      students,

      pagination: {
        page,

        limit,

        total,

        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ============================================
  // GET SINGLE STUDENT
  // ============================================

  async getStudentById(schoolId: string, studentId: string) {
    this.validateObjectId(schoolId, "school ID");

    this.validateObjectId(studentId, "student ID");

    const student = await Student.findOne({
      _id: studentId,
      schoolId,
    })

      .populate("sessionId")

      .populate("classId")

      .populate("sectionId")

      .populate("parentId");

    if (!student) {
      throw new Error("Student not found");
    }

    return student;
  }

  // ============================================
  // UPDATE STUDENT
  // ============================================

  async updateStudent(
    schoolId: string,
    userId: string,
    studentId: string,
    data: IUpdateStudentRequest,
  ) {
    this.validateObjectId(schoolId, "school ID");

    this.validateObjectId(userId, "user ID");

    this.validateObjectId(studentId, "student ID");

    const existingStudent = await Student.findOne({
      _id: studentId,
      schoolId,
    });

    if (!existingStudent) {
      throw new Error("Student not found");
    }

    // ==========================================
    // ACADEMIC FIELDS ARE ENROLLMENT-CONTROLLED
    // ==========================================

    if (
      data.sessionId !== undefined ||
      data.classId !== undefined ||
      data.sectionId !== undefined ||
      data.rollNumber !== undefined
    ) {
      throw new Error(
        "Session, class, section and roll number must be changed through the student enrollment/promotion APIs",
      );
    }

    // ==========================================
    // FINAL ACADEMIC VALUES
    // ==========================================

    const sessionId = data.sessionId ?? existingStudent.sessionId.toString();

    const classId = data.classId ?? existingStudent.classId.toString();

    const sectionId = data.sectionId ?? existingStudent.sectionId.toString();

    if (data.sessionId || data.classId || data.sectionId) {
      await this.validateAcademicMapping(
        schoolId,
        sessionId,
        classId,
        sectionId,
      );
    }

    // ==========================================
    // ADMISSION NUMBER
    // ==========================================

    let admissionNumber = existingStudent.admissionNumber;

    if (data.admissionNumber !== undefined) {
      admissionNumber = data.admissionNumber.trim().toUpperCase();

      if (!admissionNumber) {
        throw new Error("Admission number cannot be empty");
      }

      const duplicateAdmission = await Student.findOne({
        _id: {
          $ne: studentId,
        },

        schoolId,

        sessionId,

        admissionNumber,
      }).lean();

      if (duplicateAdmission) {
        throw new Error("Admission number already exists");
      }
    }

    // ==========================================
    // APAAR ID
    // ==========================================

    if (data.apaarId !== undefined && data.apaarId.trim()) {
      const apaarId = this.validateApaarId(data.apaarId);

      const duplicateApaarId = await Student.findOne({
        _id: {
          $ne: studentId,
        },

        schoolId,

        apaarId,
      }).lean();

      if (duplicateApaarId) {
        throw new Error("APAAR ID already exists");
      }
    }

    // ==========================================
    // ROLL NUMBER
    // ==========================================

    const finalRollNumber =
      data.rollNumber !== undefined
        ? data.rollNumber
        : existingStudent.rollNumber;

    if (finalRollNumber !== undefined) {
      if (!Number.isInteger(finalRollNumber) || finalRollNumber < 1) {
        throw new Error("Roll number must be a positive integer");
      }

      const duplicateRoll = await Student.findOne({
        _id: {
          $ne: studentId,
        },

        schoolId,

        sessionId,

        classId,

        sectionId,

        rollNumber: finalRollNumber,
      }).lean();

      if (duplicateRoll) {
        throw new Error("Roll number already exists in this class and section");
      }
    }

    // ==========================================
    // PARENT ID
    // ==========================================

    if (
      data.parentId !== undefined &&
      data.parentId !== null &&
      !Types.ObjectId.isValid(data.parentId)
    ) {
      throw new Error("Invalid parent ID");
    }

    // ==========================================
    // UPDATE PAYLOAD
    // ==========================================

    const updateData: Record<string, unknown> = {
      updatedBy: userId,
    };

    // ==========================================
    // ACADEMIC DETAILS
    // ==========================================

    if (data.sessionId !== undefined) {
      updateData.sessionId = data.sessionId;
    }

    if (data.classId !== undefined) {
      updateData.classId = data.classId;
    }

    if (data.sectionId !== undefined) {
      updateData.sectionId = data.sectionId;
    }

    // ==========================================
    // ADMISSION DETAILS
    // ==========================================

    if (data.admissionNumber !== undefined) {
      updateData.admissionNumber = admissionNumber;
    }

    if (data.rollNumber !== undefined) {
      updateData.rollNumber = data.rollNumber;
    }

    if (data.admissionType !== undefined) {
      updateData.admissionType = data.admissionType;
    }

    if (data.admissionCategory !== undefined) {
      updateData.admissionCategory = data.admissionCategory;
    }

    if (data.admissionDate !== undefined) {
      updateData.admissionDate = new Date(data.admissionDate);
    }

    // ==========================================
    // BASIC DETAILS
    // ==========================================

    if (data.name !== undefined) {
      const name = data.name.trim();

      if (!name) {
        throw new Error("Student name cannot be empty");
      }

      updateData.name = name;
    }

    if (data.dob !== undefined) {
      updateData.dob = new Date(data.dob);
    }

    if (data.gender !== undefined) {
      updateData.gender = data.gender;
    }

    if (data.bloodGroup !== undefined) {
      updateData.bloodGroup = data.bloodGroup;
    }

    if (data.religion !== undefined) {
      updateData.religion = data.religion.trim();
    }

    if (data.category !== undefined) {
      updateData.category = data.category;
    }

    if (data.caste !== undefined) {
      updateData.caste = data.caste.trim();
    }

    if (data.aadhaarNumber !== undefined) {
      updateData.aadhaarNumber = data.aadhaarNumber
        ? this.validateAadhaarNumber(
            data.aadhaarNumber,
            "Student Aadhaar number",
          )
        : "";
    }

    if (data.apaarId !== undefined && data.apaarId.trim()) {
      updateData.apaarId = this.validateApaarId(data.apaarId);
    }

 if (
  typeof data.photo === "string"
) {
  updateData.photo =
    data.photo.trim();
}

    // ==========================================
    // CONTACT DETAILS
    // ==========================================

    if (data.mobile !== undefined) {
      updateData.mobile = data.mobile.trim();
    }

    if (data.email !== undefined) {
      updateData.email = data.email.trim().toLowerCase();
    }

    // ==========================================
    // OLD ADDRESS
    // ==========================================

    if (data.address !== undefined) {
      updateData.address = data.address;
    }

    // ==========================================
    // CURRENT ADDRESS
    // ==========================================

    if (data.currentAddress !== undefined) {
      updateData.currentAddress = data.currentAddress;
    }

    // ==========================================
    // PERMANENT ADDRESS
    // ==========================================

    if (data.permanentAddress !== undefined) {
      updateData.permanentAddress = data.permanentAddress;
    }

    // ==========================================
    // FATHER DETAILS
    // ==========================================

    if (data.father !== undefined) {
      const father = {
        ...data.father,
      };

      if (father.name) {
        father.name = father.name.trim();
      }

      if (father.mobile) {
        father.mobile = father.mobile.trim();
      }

      if (father.occupation) {
        father.occupation = father.occupation.trim();
      }

      if (father.aadhaarNumber) {
        father.aadhaarNumber = this.validateAadhaarNumber(
          father.aadhaarNumber,
          "Father Aadhaar number",
        );
      }

      updateData.father = father;
    }

    // ==========================================
    // MOTHER DETAILS
    // ==========================================

    if (data.mother !== undefined) {
      const mother = {
        ...data.mother,
      };

      if (mother.name) {
        mother.name = mother.name.trim();
      }

      if (mother.mobile) {
        mother.mobile = mother.mobile.trim();
      }

      if (mother.occupation) {
        mother.occupation = mother.occupation.trim();
      }

      if (mother.aadhaarNumber) {
        mother.aadhaarNumber = this.validateAadhaarNumber(
          mother.aadhaarNumber,
          "Mother Aadhaar number",
        );
      }

      updateData.mother = mother;
    }

    // ==========================================
    // EXISTING PARENT RELATION
    // ==========================================

    if (data.parentId !== undefined) {
      updateData.parentId = data.parentId;
    }

    // ==========================================
    // STATUS
    // ==========================================

    if (data.status !== undefined) {
      updateData.status = data.status;
    }

    // ==========================================
    // UPDATE
    // ==========================================

    const student = await Student.findOneAndUpdate(
      {
        _id: studentId,

        schoolId,
      },

      updateData,

      {
        new: true,
        runValidators: true,
      },
    );

    if (!student) {
      throw new Error("Student not found");
    }

    return student;
  }

  // ============================================
  // UPDATE STUDENT STATUS
  // ============================================

  async updateStatus(
    schoolId: string,
    userId: string,
    studentId: string,
    status: StudentStatus,
  ) {
    this.validateObjectId(schoolId, "school ID");

    this.validateObjectId(userId, "user ID");

    this.validateObjectId(studentId, "student ID");

    const allowedStatuses: StudentStatus[] = [
      "ACTIVE",
      "INACTIVE",
      "TRANSFERRED",
      "PASSED",
      "LEFT",
    ];

    if (!allowedStatuses.includes(status)) {
      throw new Error("Invalid student status");
    }

    const student = await Student.findOneAndUpdate(
      {
        _id: studentId,

        schoolId,
      },

      {
        status,

        updatedBy: userId,
      },

      {
        new: true,
        runValidators: true,
      },
    );

    if (!student) {
      throw new Error("Student not found");
    }

    return student;
  }

  // ============================================
  // CREATE STUDENT LOGIN ACCOUNT
  // ============================================

  async createStudentAccount(
    schoolId: string,
    userId: string,
    studentId: string,
    data: ICreateStudentAccountRequest,
  ) {
    // ==========================================
    // VALIDATE IDS
    // ==========================================

    this.validateObjectId(schoolId, "school ID");

    this.validateObjectId(userId, "user ID");

    this.validateObjectId(studentId, "student ID");

    // ==========================================
    // VALIDATE EMAIL
    // ==========================================

    if (!data.email || !data.email.trim()) {
      throw new Error("Email is required");
    }

    const email = data.email.trim().toLowerCase();

    // ==========================================
    // VALIDATE PASSWORD
    // ==========================================

    if (!data.password || !data.password.trim()) {
      throw new Error("Password is required");
    }

    if (data.password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    // ==========================================
    // FIND STUDENT
    // TENANT ISOLATION
    // ==========================================

    const student = await Student.findOne({
      _id: studentId,

      schoolId,
    });

    if (!student) {
      throw new Error("Student not found");
    }

    // ==========================================
    // STUDENT ACTIVE CHECK
    // ==========================================

    if (student.status !== "ACTIVE") {
      throw new Error("Only active students can have login accounts");
    }

    // ==========================================
    // ACCOUNT ALREADY LINKED
    // ==========================================

    if (student.userId) {
      throw new Error("Student login account already exists");
    }

    // ==========================================
    // DUPLICATE EMAIL CHECK
    // ==========================================

    const existingUser = await User.findOne({
      email,
    }).lean();

    if (existingUser) {
      throw new Error("Email is already registered");
    }

    // ==========================================
    // HASH PASSWORD
    // ==========================================

    const hashedPassword = await bcrypt.hash(data.password, 10);

    // ==========================================
    // CREATE STUDENT USER ACCOUNT
    // ==========================================

    const studentUser = await User.create({
      name: student.name,

      email,

      ...(student.mobile
        ? {
            mobile: student.mobile,
          }
        : {}),

      password: hashedPassword,

      role: UserRole.STUDENT,

      schoolId,

      isActive: true,
    });

    // ==========================================
    // LINK USER WITH STUDENT
    // ==========================================

    student.userId = studentUser._id as Types.ObjectId;

    student.updatedBy = new Types.ObjectId(userId);

    await student.save();

    // ==========================================
    // RETURN SAFE DATA
    // ==========================================

    return {
      student: {
        id: student._id,

        name: student.name,

        admissionNumber: student.admissionNumber,

        userId: studentUser._id,

        email: studentUser.email,

        role: studentUser.role,

        schoolId: studentUser.schoolId,
      },
    };
  }
}

export default new StudentService();

