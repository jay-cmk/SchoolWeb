// import { Types } from "mongoose";
// import Student from "./student.model";
// import { ICreateStudentRequest, IUpdateStudentRequest } from "./student.types";

// export class StudentService {
//   async createStudent(
//     schoolId: Types.ObjectId,
//     userId: Types.ObjectId,
//     data: ICreateStudentRequest,
//   ) {
//     const existingStudent = await Student.findOne({
//       schoolId,
//       sessionId: data.sessionId,
//       admissionNumber: data.admissionNumber.toUpperCase(),
//     });

//     if (existingStudent) {
//       throw new Error("Admission number already exists");
//     }

//     const student = await Student.create({
//       ...data,

//       admissionNumber: data.admissionNumber.toUpperCase(),

//       schoolId,

//       createdBy: userId,
//     });

//     return student;
//   }

//   async getStudents(
//     schoolId: Types.ObjectId,
//     query: {
//       page?: number;
//       limit?: number;
//       search?: string;
//       sessionId?: string;
//       classId?: string;
//       sectionId?: string;
//       status?: string;
//     },
//   ) {
//     const page = Number(query.page) || 1;

//     const limit = Number(query.limit) || 10;

//     const skip = (page - 1) * limit;

//     const filter: any = {
//       schoolId,
//     };

//     if (query.sessionId) {
//       filter.sessionId = new Types.ObjectId(query.sessionId);
//     }

//     if (query.classId) {
//       filter.classId = new Types.ObjectId(query.classId);
//     }

//     if (query.sectionId) {
//       filter.sectionId = new Types.ObjectId(query.sectionId);
//     }

//     if (query.status) {
//       filter.status = query.status;
//     }

//     if (query.search) {
//       filter.$or = [
//         {
//           name: {
//             $regex: query.search,
//             $options: "i",
//           },
//         },
//         {
//           admissionNumber: {
//             $regex: query.search,
//             $options: "i",
//           },
//         },
//       ];
//     }

//     const [students, total] = await Promise.all([
//       Student.find(filter)
//         .populate("sessionId")
//         .populate("classId")
//         .populate("sectionId")
//         .populate("parentId")
//         .sort({ createdAt: -1 })
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

//   async getStudentById(schoolId: Types.ObjectId, studentId: string) {
//     if (!Types.ObjectId.isValid(studentId)) {
//       throw new Error("Invalid student ID");
//     }

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

//   async updateStudent(
//     schoolId: Types.ObjectId,
//     userId: Types.ObjectId,
//     studentId: string,
//     data: IUpdateStudentRequest,
//   ) {
//     if (!Types.ObjectId.isValid(studentId)) {
//       throw new Error("Invalid student ID");
//     }

//     const student = await Student.findOneAndUpdate(
//       {
//         _id: studentId,
//         schoolId,
//       },

//       {
//         ...data,
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

//   async updateStatus(
//     schoolId: Types.ObjectId,
//     userId: Types.ObjectId,
//     studentId: string,
//     status: string,
//   ) {
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
// }

// export default new StudentService();




// import { Types } from "mongoose";
// import Student from "./student.model";
// import {
//   ICreateStudentRequest,
//   IUpdateStudentRequest,
// } from "./student.types";

// export class StudentService {
//   // ============================================
//   // CREATE STUDENT
//   // ============================================

//   async createStudent(
//     schoolId: string,
//     userId: string,
//     data: ICreateStudentRequest
//   ) {
//     // Validate School ID
//     if (!Types.ObjectId.isValid(schoolId)) {
//       throw new Error("Invalid school ID");
//     }

//     // Validate User ID
//     if (!Types.ObjectId.isValid(userId)) {
//       throw new Error("Invalid user ID");
//     }

//     // Check duplicate admission number
//     const existingStudent = await Student.findOne({
//       schoolId,
//       sessionId: data.sessionId,
//       admissionNumber: data.admissionNumber
//         .trim()
//         .toUpperCase(),
//     });

//     if (existingStudent) {
//       throw new Error(
//         "Admission number already exists"
//       );
//     }

//     // Create student
//     const student = await Student.create({
//       ...data,

//       admissionNumber: data.admissionNumber
//         .trim()
//         .toUpperCase(),

//       schoolId,

//       createdBy: userId,
//     });

//     return student;
//   }

//   // ============================================
//   // GET ALL STUDENTS
//   // ============================================

//   async getStudents(
//     schoolId: string,
//     query: {
//       page?: number;
//       limit?: number;
//       search?: string;
//       sessionId?: string;
//       classId?: string;
//       sectionId?: string;
//       status?: string;
//     }
//   ) {
//     // Validate School ID
//     if (!Types.ObjectId.isValid(schoolId)) {
//       throw new Error("Invalid school ID");
//     }

//     const page = Number(query.page) || 1;

//     const limit = Number(query.limit) || 10;

//     const skip = (page - 1) * limit;

//     // Base filter
//     const filter: Record<string, unknown> = {
//       schoolId,
//     };

//     // ============================================
//     // SESSION FILTER
//     // ============================================

//     if (query.sessionId) {
//       if (
//         !Types.ObjectId.isValid(
//           query.sessionId
//         )
//       ) {
//         throw new Error(
//           "Invalid academic session ID"
//         );
//       }

//       filter.sessionId =
//         query.sessionId;
//     }

//     // ============================================
//     // CLASS FILTER
//     // ============================================

//     if (query.classId) {
//       if (
//         !Types.ObjectId.isValid(
//           query.classId
//         )
//       ) {
//         throw new Error(
//           "Invalid class ID"
//         );
//       }

//       filter.classId =
//         query.classId;
//     }

//     // ============================================
//     // SECTION FILTER
//     // ============================================

//     if (query.sectionId) {
//       if (
//         !Types.ObjectId.isValid(
//           query.sectionId
//         )
//       ) {
//         throw new Error(
//           "Invalid section ID"
//         );
//       }

//       filter.sectionId =
//         query.sectionId;
//     }

//     // ============================================
//     // STATUS FILTER
//     // ============================================

//     if (query.status) {
//       filter.status = query.status;
//     }

//     // ============================================
//     // SEARCH
//     // ============================================

//     if (query.search) {
//       const search =
//         query.search.trim();

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
//         ];
//       }
//     }

//     // ============================================
//     // FETCH STUDENTS + TOTAL
//     // ============================================

//     const [students, total] =
//       await Promise.all([
//         Student.find(filter)
//           .populate("sessionId")
//           .populate("classId")
//           .populate("sectionId")
//           .populate("parentId")
//           .sort({
//             createdAt: -1,
//           })
//           .skip(skip)
//           .limit(limit),

//         Student.countDocuments(
//           filter
//         ),
//       ]);

//     return {
//       students,

//       pagination: {
//         page,
//         limit,
//         total,

//         totalPages: Math.ceil(
//           total / limit
//         ),
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
//     // Validate School ID
//     if (
//       !Types.ObjectId.isValid(
//         schoolId
//       )
//     ) {
//       throw new Error(
//         "Invalid school ID"
//       );
//     }

//     // Validate Student ID
//     if (
//       !Types.ObjectId.isValid(
//         studentId
//       )
//     ) {
//       throw new Error(
//         "Invalid student ID"
//       );
//     }

//     const student =
//       await Student.findOne({
//         _id: studentId,
//         schoolId,
//       })
//         .populate("sessionId")
//         .populate("classId")
//         .populate("sectionId")
//         .populate("parentId");

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
//     // Validate School ID
//     if (
//       !Types.ObjectId.isValid(
//         schoolId
//       )
//     ) {
//       throw new Error(
//         "Invalid school ID"
//       );
//     }

//     // Validate User ID
//     if (
//       !Types.ObjectId.isValid(
//         userId
//       )
//     ) {
//       throw new Error(
//         "Invalid user ID"
//       );
//     }

//     // Validate Student ID
//     if (
//       !Types.ObjectId.isValid(
//         studentId
//       )
//     ) {
//       throw new Error(
//         "Invalid student ID"
//       );
//     }

//     // Update data
//     const updateData: Record<
//       string,
//       unknown
//     > = {
//       ...data,
//       updatedBy: userId,
//     };

//     const student =
//       await Student.findOneAndUpdate(
//         {
//           _id: studentId,
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
//     status: string
//   ) {
//     // Validate School ID
//     if (
//       !Types.ObjectId.isValid(
//         schoolId
//       )
//     ) {
//       throw new Error(
//         "Invalid school ID"
//       );
//     }

//     // Validate User ID
//     if (
//       !Types.ObjectId.isValid(
//         userId
//       )
//     ) {
//       throw new Error(
//         "Invalid user ID"
//       );
//     }

//     // Validate Student ID
//     if (
//       !Types.ObjectId.isValid(
//         studentId
//       )
//     ) {
//       throw new Error(
//         "Invalid student ID"
//       );
//     }

//     const student =
//       await Student.findOneAndUpdate(
//         {
//           _id: studentId,
//           schoolId,
//         },

//         {
//           status,
//           updatedBy: userId,
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
// }

// export default new StudentService();


















// import { Types } from "mongoose";

// import Student from "./student.model";


// import type {
//   ICreateStudentRequest,
//   IUpdateStudentRequest,
//   IStudentQuery,
// } from "./student.types";

// import type {
//   StudentStatus,
// } from "./student.interface";
// import { ClassModel } from "../academic/classes/class.model";
// import { Section } from "../academic/sections/section.model";
// import { AcademicSession } from "../academic/academicSession.model";

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

//     if (data.rollNumber !== undefined) {
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
//           sessionId: data.sessionId,
//           classId: data.classId,
//           sectionId: data.sectionId,
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

//     if (
//       data.rollNumber !== undefined
//     ) {
//       createData.rollNumber =
//         data.rollNumber;
//     }

//     if (data.dob) {
//       createData.dob =
//         new Date(data.dob);
//     }

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

//     if (data.address) {
//       createData.address =
//         data.address;
//     }

//     if (data.admissionDate) {
//       createData.admissionDate =
//         new Date(
//           data.admissionDate
//         );
//     }

//     if (data.parentId) {
//       createData.parentId =
//         data.parentId;
//     }

//     const student =
//       await Student.create(
//         createData
//       );

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

//     // If any academic mapping changes,
//     // validate complete relationship.

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
//             $ne: studentId,
//           },

//           schoolId,
//           sessionId,
//           admissionNumber,
//         }).lean();

//       if (duplicateAdmission) {
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
//             $ne: studentId,
//           },

//           schoolId,
//           sessionId,
//           classId,
//           sectionId,

//           rollNumber:
//             finalRollNumber,
//         }).lean();

//       if (duplicateRoll) {
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
//       data.parentId !== null &&
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
//       updatedBy: userId,
//     };

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

//     if (data.name !== undefined) {
//       const name =
//         data.name.trim();

//       if (!name) {
//         throw new Error(
//           "Student name cannot be empty"
//         );
//       }

//       updateData.name = name;
//     }

//     if (data.dob !== undefined) {
//       updateData.dob =
//         new Date(data.dob);
//     }

//     if (
//       data.gender !==
//       undefined
//     ) {
//       updateData.gender =
//         data.gender;
//     }

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

//     if (
//       data.address !==
//       undefined
//     ) {
//       updateData.address =
//         data.address;
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

//     if (
//       data.parentId !==
//       undefined
//     ) {
//       updateData.parentId =
//         data.parentId;
//     }

//     if (
//       data.status !==
//       undefined
//     ) {
//       updateData.status =
//         data.status;
//     }

//     const student =
//       await Student.findOneAndUpdate(
//         {
//           _id: studentId,
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
//           _id: studentId,
//           schoolId,
//         },

//         {
//           status,
//           updatedBy: userId,
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
// }

// export default new StudentService();











import bcrypt from "bcrypt";
import { Types } from "mongoose";

import Student from "./student.model";

import {
  User,
} from "../auth/user.model";

import {
  UserRole,
} from "../../constants/roles";

import type {
  ICreateStudentRequest,
  IUpdateStudentRequest,
  IStudentQuery,
  ICreateStudentAccountRequest,
} from "./student.types";

import type {
  StudentStatus,
} from "./student.interface";

import {
  ClassModel,
} from "../academic/classes/class.model";

import {
  Section,
} from "../academic/sections/section.model";

import {
  AcademicSession,
} from "../academic/academicSession.model";


export class StudentService {

  // ============================================
  // VALIDATE OBJECT ID
  // ============================================

  private validateObjectId(
    id: string,
    fieldName: string
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error(
        `Invalid ${fieldName}`
      );
    }
  }


  // ============================================
  // VALIDATE ACADEMIC RELATIONSHIP
  // ============================================

  private async validateAcademicMapping(
    schoolId: string,
    sessionId: string,
    classId: string,
    sectionId: string
  ) {
    this.validateObjectId(
      sessionId,
      "academic session ID"
    );

    this.validateObjectId(
      classId,
      "class ID"
    );

    this.validateObjectId(
      sectionId,
      "section ID"
    );


    // ------------------------------------------
    // SESSION
    // ------------------------------------------

    const session =
      await AcademicSession.findOne({
        _id: sessionId,
        schoolId,
      }).lean();


    if (!session) {
      throw new Error(
        "Academic session not found for this school"
      );
    }


    // ------------------------------------------
    // CLASS
    // ------------------------------------------

    const classData =
      await ClassModel.findOne({
        _id: classId,
        schoolId,
        sessionId,
      }).lean();


    if (!classData) {
      throw new Error(
        "Class does not belong to selected academic session"
      );
    }


    // ------------------------------------------
    // SECTION
    // ------------------------------------------

    const section =
      await Section.findOne({
        _id: sectionId,
        schoolId,
        sessionId,
        classId,
      }).lean();


    if (!section) {
      throw new Error(
        "Section does not belong to selected class"
      );
    }
  }


  // ============================================
  // CREATE STUDENT
  // ============================================

  async createStudent(
    schoolId: string,
    userId: string,
    data: ICreateStudentRequest
  ) {
    this.validateObjectId(
      schoolId,
      "school ID"
    );

    this.validateObjectId(
      userId,
      "user ID"
    );


    // ==========================================
    // REQUIRED DATA
    // ==========================================

    if (!data.sessionId) {
      throw new Error(
        "Academic session is required"
      );
    }


    if (!data.classId) {
      throw new Error(
        "Class is required"
      );
    }


    if (!data.sectionId) {
      throw new Error(
        "Section is required"
      );
    }


    if (
      !data.admissionNumber ||
      !data.admissionNumber.trim()
    ) {
      throw new Error(
        "Admission number is required"
      );
    }


    if (
      !data.name ||
      !data.name.trim()
    ) {
      throw new Error(
        "Student name is required"
      );
    }


    // ==========================================
    // ACADEMIC VALIDATION
    // ==========================================

    await this.validateAcademicMapping(
      schoolId,
      data.sessionId,
      data.classId,
      data.sectionId
    );


    const admissionNumber =
      data.admissionNumber
        .trim()
        .toUpperCase();


    // ==========================================
    // DUPLICATE ADMISSION NUMBER
    // ==========================================

    const existingAdmission =
      await Student.findOne({
        schoolId,
        sessionId: data.sessionId,
        admissionNumber,
      }).lean();


    if (existingAdmission) {
      throw new Error(
        "Admission number already exists"
      );
    }


    // ==========================================
    // DUPLICATE ROLL NUMBER
    // ==========================================

    if (
      data.rollNumber !== undefined
    ) {
      if (
        !Number.isInteger(
          data.rollNumber
        ) ||
        data.rollNumber < 1
      ) {
        throw new Error(
          "Roll number must be a positive integer"
        );
      }


      const existingRoll =
        await Student.findOne({
          schoolId,
          sessionId:
            data.sessionId,
          classId:
            data.classId,
          sectionId:
            data.sectionId,
          rollNumber:
            data.rollNumber,
        }).lean();


      if (existingRoll) {
        throw new Error(
          "Roll number already exists in this class and section"
        );
      }
    }


    // ==========================================
    // PARENT VALIDATION
    // ==========================================

    if (
      data.parentId &&
      !Types.ObjectId.isValid(
        data.parentId
      )
    ) {
      throw new Error(
        "Invalid parent ID"
      );
    }


    // ==========================================
    // CREATE PAYLOAD
    // ==========================================

    const createData: Record<
      string,
      unknown
    > = {
      schoolId,

      sessionId:
        data.sessionId,

      classId:
        data.classId,

      sectionId:
        data.sectionId,

      admissionNumber,

      name:
        data.name.trim(),

      gender:
        data.gender,

      createdBy:
        userId,
    };


    if (
      data.rollNumber !== undefined
    ) {
      createData.rollNumber =
        data.rollNumber;
    }


    if (data.dob) {
      createData.dob =
        new Date(
          data.dob
        );
    }


    if (data.mobile) {
      createData.mobile =
        data.mobile.trim();
    }


    if (data.email) {
      createData.email =
        data.email
          .trim()
          .toLowerCase();
    }


    if (data.address) {
      createData.address =
        data.address;
    }


    if (data.admissionDate) {
      createData.admissionDate =
        new Date(
          data.admissionDate
        );
    }


    if (data.parentId) {
      createData.parentId =
        data.parentId;
    }


    const student =
      await Student.create(
        createData
      );


    return student;
  }


  // ============================================
// GET MY STUDENT PROFILE
// ============================================

async getMyProfile(
  schoolId: string,
  studentId: string
) {
  this.validateObjectId(
    schoolId,
    "school ID"
  );

  this.validateObjectId(
    studentId,
    "student ID"
  );


  const student =
    await Student.findOne({
      _id: studentId,
      schoolId,
      status: "ACTIVE",
    })
      .populate("sessionId")
      .populate("classId")
      .populate("sectionId")
      .populate("parentId")
      .populate(
        "userId",
        "name email mobile role isActive"
      );


  if (!student) {
    throw new Error(
      "Student profile not found or inactive"
    );
  }


  return student;
}


  // ============================================
  // GET ALL STUDENTS
  // ============================================

  async getStudents(
    schoolId: string,
    query: IStudentQuery
  ) {
    this.validateObjectId(
      schoolId,
      "school ID"
    );


    let page =
      Number(query.page) || 1;


    let limit =
      Number(query.limit) || 10;


    if (page < 1) {
      page = 1;
    }


    if (limit < 1) {
      limit = 10;
    }


    if (limit > 100) {
      limit = 100;
    }


    const skip =
      (page - 1) * limit;


    const filter: Record<
      string,
      unknown
    > = {
      schoolId,
    };


    // ==========================================
    // SESSION FILTER
    // ==========================================

    if (query.sessionId) {
      this.validateObjectId(
        query.sessionId,
        "academic session ID"
      );

      filter.sessionId =
        query.sessionId;
    }


    // ==========================================
    // CLASS FILTER
    // ==========================================

    if (query.classId) {
      this.validateObjectId(
        query.classId,
        "class ID"
      );

      filter.classId =
        query.classId;
    }


    // ==========================================
    // SECTION FILTER
    // ==========================================

    if (query.sectionId) {
      this.validateObjectId(
        query.sectionId,
        "section ID"
      );

      filter.sectionId =
        query.sectionId;
    }


    // ==========================================
    // STATUS FILTER
    // ==========================================

    if (query.status) {

      const allowedStatuses:
        StudentStatus[] = [
          "ACTIVE",
          "INACTIVE",
          "TRANSFERRED",
          "PASSED",
          "LEFT",
        ];


      if (
        !allowedStatuses.includes(
          query.status as StudentStatus
        )
      ) {
        throw new Error(
          "Invalid student status"
        );
      }


      filter.status =
        query.status;
    }


    // ==========================================
    // SEARCH
    // ==========================================

    if (query.search) {

      const search =
        query.search.trim();


      if (search) {

        filter.$or = [
          {
            name: {
              $regex:
                search,
              $options:
                "i",
            },
          },

          {
            admissionNumber: {
              $regex:
                search,
              $options:
                "i",
            },
          },
        ];
      }
    }


    // ==========================================
    // FETCH
    // ==========================================

    const [
      students,
      total,
    ] = await Promise.all([

      Student.find(filter)

        .populate(
          "sessionId"
        )

        .populate(
          "classId"
        )

        .populate(
          "sectionId"
        )

        .populate(
          "parentId"
        )

        .sort({
          createdAt: -1,
        })

        .skip(skip)

        .limit(limit),


      Student.countDocuments(
        filter
      ),

    ]);


    return {

      students,

      pagination: {

        page,

        limit,

        total,

        totalPages:
          Math.ceil(
            total / limit
          ),

      },

    };
  }


  // ============================================
  // GET SINGLE STUDENT
  // ============================================

  async getStudentById(
    schoolId: string,
    studentId: string
  ) {
    this.validateObjectId(
      schoolId,
      "school ID"
    );


    this.validateObjectId(
      studentId,
      "student ID"
    );


    const student =
      await Student.findOne({
        _id: studentId,
        schoolId,
      })

        .populate(
          "sessionId"
        )

        .populate(
          "classId"
        )

        .populate(
          "sectionId"
        )

        .populate(
          "parentId"
        );


    if (!student) {
      throw new Error(
        "Student not found"
      );
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
    data: IUpdateStudentRequest
  ) {
    this.validateObjectId(
      schoolId,
      "school ID"
    );


    this.validateObjectId(
      userId,
      "user ID"
    );


    this.validateObjectId(
      studentId,
      "student ID"
    );


    const existingStudent =
      await Student.findOne({
        _id: studentId,
        schoolId,
      });


    if (!existingStudent) {
      throw new Error(
        "Student not found"
      );
    }


    // ==========================================
    // FINAL ACADEMIC VALUES
    // ==========================================

    const sessionId =
      data.sessionId ??
      existingStudent.sessionId.toString();


    const classId =
      data.classId ??
      existingStudent.classId.toString();


    const sectionId =
      data.sectionId ??
      existingStudent.sectionId.toString();


    if (
      data.sessionId ||
      data.classId ||
      data.sectionId
    ) {
      await this.validateAcademicMapping(
        schoolId,
        sessionId,
        classId,
        sectionId
      );
    }


    // ==========================================
    // ADMISSION NUMBER
    // ==========================================

    let admissionNumber =
      existingStudent.admissionNumber;


    if (
      data.admissionNumber !==
      undefined
    ) {
      admissionNumber =
        data.admissionNumber
          .trim()
          .toUpperCase();


      if (!admissionNumber) {
        throw new Error(
          "Admission number cannot be empty"
        );
      }


      const duplicateAdmission =
        await Student.findOne({

          _id: {
            $ne:
              studentId,
          },

          schoolId,

          sessionId,

          admissionNumber,

        }).lean();


      if (
        duplicateAdmission
      ) {
        throw new Error(
          "Admission number already exists"
        );
      }
    }


    // ==========================================
    // ROLL NUMBER
    // ==========================================

    const finalRollNumber =
      data.rollNumber !==
      undefined
        ? data.rollNumber
        : existingStudent.rollNumber;


    if (
      finalRollNumber !==
      undefined
    ) {
      if (
        !Number.isInteger(
          finalRollNumber
        ) ||
        finalRollNumber < 1
      ) {
        throw new Error(
          "Roll number must be a positive integer"
        );
      }


      const duplicateRoll =
        await Student.findOne({

          _id: {
            $ne:
              studentId,
          },

          schoolId,

          sessionId,

          classId,

          sectionId,

          rollNumber:
            finalRollNumber,

        }).lean();


      if (
        duplicateRoll
      ) {
        throw new Error(
          "Roll number already exists in this class and section"
        );
      }
    }


    // ==========================================
    // PARENT ID
    // ==========================================

    if (
      data.parentId !==
        undefined &&
      data.parentId !==
        null &&
      !Types.ObjectId.isValid(
        data.parentId
      )
    ) {
      throw new Error(
        "Invalid parent ID"
      );
    }


    // ==========================================
    // UPDATE PAYLOAD
    // ==========================================

    const updateData: Record<
      string,
      unknown
    > = {
      updatedBy:
        userId,
    };


    if (
      data.sessionId !==
      undefined
    ) {
      updateData.sessionId =
        data.sessionId;
    }


    if (
      data.classId !==
      undefined
    ) {
      updateData.classId =
        data.classId;
    }


    if (
      data.sectionId !==
      undefined
    ) {
      updateData.sectionId =
        data.sectionId;
    }


    if (
      data.admissionNumber !==
      undefined
    ) {
      updateData.admissionNumber =
        admissionNumber;
    }


    if (
      data.rollNumber !==
      undefined
    ) {
      updateData.rollNumber =
        data.rollNumber;
    }


    if (
      data.name !==
      undefined
    ) {
      const name =
        data.name.trim();


      if (!name) {
        throw new Error(
          "Student name cannot be empty"
        );
      }


      updateData.name =
        name;
    }


    if (
      data.dob !==
      undefined
    ) {
      updateData.dob =
        new Date(
          data.dob
        );
    }


    if (
      data.gender !==
      undefined
    ) {
      updateData.gender =
        data.gender;
    }


    if (
      data.mobile !==
      undefined
    ) {
      updateData.mobile =
        data.mobile.trim();
    }


    if (
      data.email !==
      undefined
    ) {
      updateData.email =
        data.email
          .trim()
          .toLowerCase();
    }


    if (
      data.address !==
      undefined
    ) {
      updateData.address =
        data.address;
    }


    if (
      data.admissionDate !==
      undefined
    ) {
      updateData.admissionDate =
        new Date(
          data.admissionDate
        );
    }


    if (
      data.parentId !==
      undefined
    ) {
      updateData.parentId =
        data.parentId;
    }


    if (
      data.status !==
      undefined
    ) {
      updateData.status =
        data.status;
    }


    const student =
      await Student.findOneAndUpdate(

        {
          _id:
            studentId,

          schoolId,
        },

        updateData,

        {
          new: true,
          runValidators: true,
        }

      );


    if (!student) {
      throw new Error(
        "Student not found"
      );
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
    status: StudentStatus
  ) {
    this.validateObjectId(
      schoolId,
      "school ID"
    );


    this.validateObjectId(
      userId,
      "user ID"
    );


    this.validateObjectId(
      studentId,
      "student ID"
    );


    const allowedStatuses:
      StudentStatus[] = [
        "ACTIVE",
        "INACTIVE",
        "TRANSFERRED",
        "PASSED",
        "LEFT",
      ];


    if (
      !allowedStatuses.includes(
        status
      )
    ) {
      throw new Error(
        "Invalid student status"
      );
    }


    const student =
      await Student.findOneAndUpdate(

        {
          _id:
            studentId,

          schoolId,
        },

        {
          status,

          updatedBy:
            userId,
        },

        {
          new: true,
          runValidators: true,
        }

      );


    if (!student) {
      throw new Error(
        "Student not found"
      );
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
    data: ICreateStudentAccountRequest
  ) {

    // ==========================================
    // VALIDATE IDS
    // ==========================================

    this.validateObjectId(
      schoolId,
      "school ID"
    );


    this.validateObjectId(
      userId,
      "user ID"
    );


    this.validateObjectId(
      studentId,
      "student ID"
    );


    // ==========================================
    // VALIDATE EMAIL
    // ==========================================

    if (
      !data.email ||
      !data.email.trim()
    ) {
      throw new Error(
        "Email is required"
      );
    }


    const email =
      data.email
        .trim()
        .toLowerCase();


    // ==========================================
    // VALIDATE PASSWORD
    // ==========================================

    if (
      !data.password ||
      !data.password.trim()
    ) {
      throw new Error(
        "Password is required"
      );
    }


    if (
      data.password.length < 6
    ) {
      throw new Error(
        "Password must be at least 6 characters"
      );
    }


    // ==========================================
    // FIND STUDENT
    // TENANT ISOLATION
    // ==========================================

    const student =
      await Student.findOne({
        _id:
          studentId,

        schoolId,
      });


    if (!student) {
      throw new Error(
        "Student not found"
      );
    }


    // ==========================================
    // STUDENT ACTIVE CHECK
    // ==========================================

    if (
      student.status !==
      "ACTIVE"
    ) {
      throw new Error(
        "Only active students can have login accounts"
      );
    }


    // ==========================================
    // ACCOUNT ALREADY LINKED
    // ==========================================

    if (student.userId) {
      throw new Error(
        "Student login account already exists"
      );
    }


    // ==========================================
    // DUPLICATE EMAIL CHECK
    // ==========================================

    const existingUser =
      await User.findOne({
        email,
      }).lean();


    if (existingUser) {
      throw new Error(
        "Email is already registered"
      );
    }


    // ==========================================
    // HASH PASSWORD
    // ==========================================

    const hashedPassword =
      await bcrypt.hash(
        data.password,
        10
      );


    // ==========================================
    // CREATE STUDENT USER ACCOUNT
    // ==========================================

    const studentUser =
      await User.create({

        name:
          student.name,

        email,

        ...(student.mobile
          ? {
              mobile:
                student.mobile,
            }
          : {}),

        password:
          hashedPassword,

        role:
          UserRole.STUDENT,

        schoolId,

        isActive:
          true,

      });


    // ==========================================
    // LINK USER WITH STUDENT
    // ==========================================

    student.userId =
      studentUser._id as Types.ObjectId;


    student.updatedBy =
      new Types.ObjectId(
        userId
      );


    await student.save();


    // ==========================================
    // RETURN SAFE DATA
    // ==========================================

    return {

      student: {
        id:
          student._id,

        name:
          student.name,

        admissionNumber:
          student.admissionNumber,

        userId:
          studentUser._id,

        email:
          studentUser.email,

        role:
          studentUser.role,

        schoolId:
          studentUser.schoolId,
      },

    };
  }
}


export default new StudentService();