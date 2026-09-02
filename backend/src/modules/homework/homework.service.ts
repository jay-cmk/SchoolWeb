// import mongoose from "mongoose";

// import {
//   Homework,
// } from "./homework.model";

// import {
//   HomeworkStatus,
// } from "./homework.types";

// import type {
//   CreateHomeworkData,
//   HomeworkFilters,
//   UpdateHomeworkData,
// } from "./homework.types";


// // ============================================
// // IMPORT YOUR EXISTING MODELS
// // ============================================

// import {
//   AcademicSession,
// } from "../academic/academicSession.model";






// import {
//   Teacher,
// } from "../teachers/teacher.model";


// import { ClassModel } from "../academic/classes/class.model";
// import { SubjectAssignment } from "../academic/subjectAssignments/subjectAssignment.model";
// import { Subject } from "../academic/subjects/subject.model";
// import { Section } from "../academic/sections/section.model";


// // ============================================
// // HELPERS
// // ============================================

// const validateObjectId = (
//   id: string,
//   fieldName: string
// ) => {

//   if (
//     !mongoose.Types.ObjectId.isValid(
//       id
//     )
//   ) {
//     throw new Error(
//       `Invalid ${fieldName}`
//     );
//   }

// };


// const normalizeDate = (
//   value: Date | string,
//   fieldName: string
// ) => {

//   const date =
//     value instanceof Date
//       ? value
//       : new Date(value);


//   if (
//     Number.isNaN(
//       date.getTime()
//     )
//   ) {
//     throw new Error(
//       `Invalid ${fieldName}`
//     );
//   }


//   return date;
// };


// // ============================================
// // VALIDATE HOMEWORK RELATIONS
// // ============================================

// const validateHomeworkRelations =
//   async (
//     schoolId: string,
//     data: {
//       sessionId: string;
//       classId: string;
//       sectionId: string;
//       subjectId: string;
//       teacherId: string;
//     }
//   ) => {

//     validateObjectId(
//       schoolId,
//       "schoolId"
//     );

//     validateObjectId(
//       data.sessionId,
//       "sessionId"
//     );

//     validateObjectId(
//       data.classId,
//       "classId"
//     );

//     validateObjectId(
//       data.sectionId,
//       "sectionId"
//     );

//     validateObjectId(
//       data.subjectId,
//       "subjectId"
//     );

//     validateObjectId(
//       data.teacherId,
//       "teacherId"
//     );


//     // ============================================
//     // SESSION
//     // ============================================

//     const session =
//       await AcademicSession.findOne({
//         _id:
//           data.sessionId,

//         schoolId,
//       }).lean();


//     if (
//       !session
//     ) {
//       throw new Error(
//         "Academic session not found"
//       );
//     }


//     // ============================================
//     // CLASS
//     // ============================================

// //     const classData =

// //     console.log("HOMEWORK CLASS VALIDATION");

// // console.log("schoolId:", schoolId);
// // console.log("sessionId:", data.sessionId);
// // console.log("classId:", data.classId);

// // const classById = await ClassModel.findById(
// //   data.classId
// // ).lean();

// // console.log("CLASS FOUND BY ID:", classById);
// //         await ClassModel.findOne({
// //     _id: data.classId,
// //     schoolId,
// //     sessionId:
// //       data.sessionId,
// //   }).lean();

//     const classData =
//   await ClassModel.findOne({
//     _id: data.classId,
//     schoolId,
//     sessionId:
//       data.sessionId,
//   }).lean();


//     if (
//       !classData
//     ) {
//       throw new Error(
//         "Class not found in the selected academic session"
//       );
//     }


//     // ============================================
//     // SECTION
//     // ============================================

//     const section =
//       await Section.findOne({
//         _id:
//           data.sectionId,

//         schoolId,

//         sessionId:
//           data.sessionId,

//         classId:
//           data.classId,
//       }).lean();


//     if (
//       !section
//     ) {
//       throw new Error(
//         "Section not found for the selected class"
//       );
//     }


//     // ============================================
//     // SUBJECT
//     // ============================================

//     const subject =
//       await Subject.findOne({
//         _id:
//           data.subjectId,

//         schoolId,
//       }).lean();


//     if (
//       !subject
//     ) {
//       throw new Error(
//         "Subject not found"
//       );
//     }


//     // ============================================
//     // TEACHER
//     // ============================================

//     const teacher =
//       await Teacher.findOne({
//         _id:
//           data.teacherId,

//         schoolId,
//         isActive: true,
//       }).lean();


//     if (
//       !teacher
//     ) {
//       throw new Error(
//         "Teacher not found or inactive"
//       );
//     }


//     // ============================================
//     // SUBJECT ASSIGNMENT
//     // ============================================

//     const assignment =
//       await SubjectAssignment.findOne({
//         schoolId,

//         sessionId:
//           data.sessionId,

//         classId:
//           data.classId,

//         sectionId:
//           data.sectionId,

//         subjectId:
//           data.subjectId,

//         teacherId:
//           data.teacherId,

//         isActive: true,
//       }).lean();


//     if (
//       !assignment
//     ) {
//       throw new Error(
//         "Selected teacher is not assigned to this subject, class and section"
//       );
//     }

//   };


// // ============================================
// // CREATE HOMEWORK
// // ============================================

// export const createHomework =
//   async (
//     schoolId: string,
//     createdBy: string,
//     data: CreateHomeworkData
//   ) => {

//     validateObjectId(
//       schoolId,
//       "schoolId"
//     );

//     validateObjectId(
//       createdBy,
//       "createdBy"
//     );


//     await validateHomeworkRelations(
//       schoolId,
//       {
//         sessionId:
//           data.sessionId,

//         classId:
//           data.classId,

//         sectionId:
//           data.sectionId,

//         subjectId:
//           data.subjectId,

//         teacherId:
//           data.teacherId,
//       }
//     );


//     const assignedDate =
//       normalizeDate(
//         data.assignedDate,
//         "assignedDate"
//       );


//     const dueDate =
//       normalizeDate(
//         data.dueDate,
//         "dueDate"
//       );


//     if (
//       dueDate <
//       assignedDate
//     ) {
//       throw new Error(
//         "Due date must be on or after the assigned date"
//       );
//     }


//     if (
//       !data.title.trim()
//     ) {
//       throw new Error(
//         "Homework title is required"
//       );
//     }


//     if (
//       !data.description.trim()
//     ) {
//       throw new Error(
//         "Homework description is required"
//       );
//     }


//     const payload: {
//       schoolId:
//         mongoose.Types.ObjectId;

//       sessionId:
//         mongoose.Types.ObjectId;

//       classId:
//         mongoose.Types.ObjectId;

//       sectionId:
//         mongoose.Types.ObjectId;

//       subjectId:
//         mongoose.Types.ObjectId;

//       teacherId:
//         mongoose.Types.ObjectId;

//       title: string;

//       description: string;

//       assignedDate: Date;

//       dueDate: Date;

//       status: HomeworkStatus;

//       createdBy:
//         mongoose.Types.ObjectId;

//       isActive: boolean;

//       attachment?: {
//         fileName: string;

//         fileUrl: string;

//         fileType?: string;

//         fileSize?: number;
//       };
//     } = {

//       schoolId:
//         new mongoose.Types.ObjectId(
//           schoolId
//         ),

//       sessionId:
//         new mongoose.Types.ObjectId(
//           data.sessionId
//         ),

//       classId:
//         new mongoose.Types.ObjectId(
//           data.classId
//         ),

//       sectionId:
//         new mongoose.Types.ObjectId(
//           data.sectionId
//         ),

//       subjectId:
//         new mongoose.Types.ObjectId(
//           data.subjectId
//         ),

//       teacherId:
//         new mongoose.Types.ObjectId(
//           data.teacherId
//         ),

//       title:
//         data.title.trim(),

//       description:
//         data.description.trim(),

//       assignedDate,

//       dueDate,

//       status:
//         data.status ??
//         HomeworkStatus.DRAFT,

//       createdBy:
//         new mongoose.Types.ObjectId(
//           createdBy
//         ),

//       isActive:
//         true,
//     };


//     if (
//       data.attachment
//     ) {
//       payload.attachment = {
//         fileName:
//           data.attachment.fileName,

//         fileUrl:
//           data.attachment.fileUrl,
//       };


//       if (
//         data.attachment.fileType
//       ) {
//         payload.attachment.fileType =
//           data.attachment.fileType;
//       }


//       if (
//         data.attachment.fileSize !==
//         undefined
//       ) {
//         payload.attachment.fileSize =
//           data.attachment.fileSize;
//       }
//     }


//     const homework =
//       await Homework.create(
//         payload
//       );


//     return homework;

//   };


// // ============================================
// // GET HOMEWORK LIST
// // ============================================

// export const getHomeworks =
//   async (
//     schoolId: string,
//     filters:
//       HomeworkFilters = {}
//   ) => {

//     validateObjectId(
//       schoolId,
//       "schoolId"
//     );


//     const page =
//       Math.max(
//         Number(
//           filters.page
//         ) || 1,
//         1
//       );


//     const limit =
//       Math.min(
//         Math.max(
//           Number(
//             filters.limit
//           ) || 10,
//           1
//         ),
//         100
//       );


//     const skip =
//       (
//         page - 1
//       ) * limit;


//     const query:
//       Record<
//         string,
//         unknown
//       > = {

//       schoolId:
//         new mongoose.Types.ObjectId(
//           schoolId
//         ),

//       isActive:
//         true,
//     };


//     // ============================================
//     // SESSION FILTER
//     // ============================================

//     if (
//       filters.sessionId
//     ) {

//       validateObjectId(
//         filters.sessionId,
//         "sessionId"
//       );

//       query.sessionId =
//         new mongoose.Types.ObjectId(
//           filters.sessionId
//         );
//     }


//     // ============================================
//     // CLASS FILTER
//     // ============================================

//     if (
//       filters.classId
//     ) {

//       validateObjectId(
//         filters.classId,
//         "classId"
//       );

//       query.classId =
//         new mongoose.Types.ObjectId(
//           filters.classId
//         );
//     }


//     // ============================================
//     // SECTION FILTER
//     // ============================================

//     if (
//       filters.sectionId
//     ) {

//       validateObjectId(
//         filters.sectionId,
//         "sectionId"
//       );

//       query.sectionId =
//         new mongoose.Types.ObjectId(
//           filters.sectionId
//         );
//     }


//     // ============================================
//     // SUBJECT FILTER
//     // ============================================

//     if (
//       filters.subjectId
//     ) {

//       validateObjectId(
//         filters.subjectId,
//         "subjectId"
//       );

//       query.subjectId =
//         new mongoose.Types.ObjectId(
//           filters.subjectId
//         );
//     }


//     // ============================================
//     // TEACHER FILTER
//     // ============================================

//     if (
//       filters.teacherId
//     ) {

//       validateObjectId(
//         filters.teacherId,
//         "teacherId"
//       );

//       query.teacherId =
//         new mongoose.Types.ObjectId(
//           filters.teacherId
//         );
//     }


//     // ============================================
//     // STATUS FILTER
//     // ============================================

//     if (
//       filters.status
//     ) {
//       query.status =
//         filters.status;
//     }


//     // ============================================
//     // ASSIGNED DATE FILTER
//     // ============================================

//     if (
//       filters.fromDate ||
//       filters.toDate
//     ) {

//       const assignedDateQuery: {
//         $gte?: Date;
//         $lte?: Date;
//       } = {};


//       if (
//         filters.fromDate
//       ) {

//         const fromDate =
//           new Date(
//             filters.fromDate
//           );

//         if (
//           Number.isNaN(
//             fromDate.getTime()
//           )
//         ) {
//           throw new Error(
//             "Invalid fromDate"
//           );
//         }


//         fromDate.setHours(
//           0,
//           0,
//           0,
//           0
//         );


//         assignedDateQuery.$gte =
//           fromDate;
//       }


//       if (
//         filters.toDate
//       ) {

//         const toDate =
//           new Date(
//             filters.toDate
//           );

//         if (
//           Number.isNaN(
//             toDate.getTime()
//           )
//         ) {
//           throw new Error(
//             "Invalid toDate"
//           );
//         }


//         toDate.setHours(
//           23,
//           59,
//           59,
//           999
//         );


//         assignedDateQuery.$lte =
//           toDate;
//       }


//       query.assignedDate =
//         assignedDateQuery;
//     }


//     // ============================================
//     // SEARCH
//     // ============================================

//     if (
//       filters.search?.trim()
//     ) {

//       const search =
//         filters.search.trim();


//       query.$or = [
//         {
//           title: {
//             $regex:
//               search,

//             $options:
//               "i",
//           },
//         },

//         {
//           description: {
//             $regex:
//               search,

//             $options:
//               "i",
//           },
//         },
//       ];
//     }


//     // ============================================
//     // FETCH
//     // ============================================

//     const [
//       homeworks,
//       total,
//     ] = await Promise.all([

//       Homework.find(
//         query
//       )
//         .populate(
//           "sessionId",
//           "name startDate endDate isCurrent"
//         )
//         .populate(
//           "classId",
//           "name"
//         )
//         .populate(
//           "sectionId",
//           "name"
//         )
//         .populate(
//           "subjectId",
//           "name code"
//         )
//         .populate(
//           "teacherId",
//           "name employeeId"
//         )
//         .sort({
//           assignedDate: -1,
//           createdAt: -1,
//         })
//         .skip(
//           skip
//         )
//         .limit(
//           limit
//         )
//         .lean(),


//       Homework.countDocuments(
//         query
//       ),
//     ]);


//     return {
//       homeworks,

//       pagination: {
//         total,

//         page,

//         limit,

//         totalPages:
//           Math.ceil(
//             total /
//             limit
//           ),
//       },
//     };

//   };


// // ============================================
// // GET HOMEWORK BY ID
// // ============================================

// export const getHomeworkById =
//   async (
//     schoolId: string,
//     homeworkId: string
//   ) => {

//     validateObjectId(
//       schoolId,
//       "schoolId"
//     );

//     validateObjectId(
//       homeworkId,
//       "homeworkId"
//     );


//     const homework =
//       await Homework.findOne({
//         _id:
//           homeworkId,

//         schoolId,

//         isActive:
//           true,
//       })
//         .populate(
//           "sessionId",
//           "name startDate endDate isCurrent"
//         )
//         .populate(
//           "classId",
//           "name"
//         )
//         .populate(
//           "sectionId",
//           "name"
//         )
//         .populate(
//           "subjectId",
//           "name code"
//         )
//         .populate(
//           "teacherId",
//           "name employeeId"
//         )
//         .lean();


//     if (
//       !homework
//     ) {
//       throw new Error(
//         "Homework not found"
//       );
//     }


//     return homework;

//   };


// // ============================================
// // UPDATE HOMEWORK
// // ============================================

// export const updateHomework =
//   async (
//     schoolId: string,
//     homeworkId: string,
//     updatedBy: string,
//     data: UpdateHomeworkData
//   ) => {

//     validateObjectId(
//       schoolId,
//       "schoolId"
//     );

//     validateObjectId(
//       homeworkId,
//       "homeworkId"
//     );

//     validateObjectId(
//       updatedBy,
//       "updatedBy"
//     );


//     const homework =
//       await Homework.findOne({
//         _id:
//           homeworkId,

//         schoolId,

//         isActive:
//           true,
//       });


//     if (
//       !homework
//     ) {
//       throw new Error(
//         "Homework not found"
//       );
//     }


//     // ============================================
//     // FINAL RELATION IDS
//     // ============================================

//     const sessionId =
//       data.sessionId ??
//       homework.sessionId.toString();


//     const classId =
//       data.classId ??
//       homework.classId.toString();


//     const sectionId =
//       data.sectionId ??
//       homework.sectionId.toString();


//     const subjectId =
//       data.subjectId ??
//       homework.subjectId.toString();


//     const teacherId =
//       data.teacherId ??
//       homework.teacherId.toString();


//     // ============================================
//     // VALIDATE FINAL RELATIONS
//     // ============================================

//     await validateHomeworkRelations(
//       schoolId,
//       {
//         sessionId,
//         classId,
//         sectionId,
//         subjectId,
//         teacherId,
//       }
//     );


//     // ============================================
//     // DATES
//     // ============================================

//     const assignedDate =
//       data.assignedDate
//         ? normalizeDate(
//             data.assignedDate,
//             "assignedDate"
//           )
//         : homework.assignedDate;


//     const dueDate =
//       data.dueDate
//         ? normalizeDate(
//             data.dueDate,
//             "dueDate"
//           )
//         : homework.dueDate;


//     if (
//       dueDate <
//       assignedDate
//     ) {
//       throw new Error(
//         "Due date must be on or after the assigned date"
//       );
//     }


//     // ============================================
//     // UPDATE RELATIONS
//     // ============================================

//     homework.sessionId =
//       new mongoose.Types.ObjectId(
//         sessionId
//       );


//     homework.classId =
//       new mongoose.Types.ObjectId(
//         classId
//       );


//     homework.sectionId =
//       new mongoose.Types.ObjectId(
//         sectionId
//       );


//     homework.subjectId =
//       new mongoose.Types.ObjectId(
//         subjectId
//       );


//     homework.teacherId =
//       new mongoose.Types.ObjectId(
//         teacherId
//       );


//     // ============================================
//     // UPDATE NORMAL FIELDS
//     // ============================================

//     if (
//       data.title !==
//       undefined
//     ) {

//       if (
//         !data.title.trim()
//       ) {
//         throw new Error(
//           "Homework title is required"
//         );
//       }


//       homework.title =
//         data.title.trim();
//     }


//     if (
//       data.description !==
//       undefined
//     ) {

//       if (
//         !data.description.trim()
//       ) {
//         throw new Error(
//           "Homework description is required"
//         );
//       }


//       homework.description =
//         data.description.trim();
//     }


//     homework.assignedDate =
//       assignedDate;


//     homework.dueDate =
//       dueDate;


//     if (
//       data.status !==
//       undefined
//     ) {
//       homework.status =
//         data.status;
//     }


//     // ============================================
//     // ATTACHMENT
//     // ============================================

//     if (
//       data.attachment ===
//       null
//     ) {

//       homework.set(
//         "attachment",
//         undefined
//       );

//     } else if (
//       data.attachment !==
//       undefined
//     ) {

//       homework.attachment = {
//         fileName:
//           data.attachment.fileName,

//         fileUrl:
//           data.attachment.fileUrl,
//       };


//       if (
//         data.attachment.fileType
//       ) {
//         homework.attachment.fileType =
//           data.attachment.fileType;
//       }


//       if (
//         data.attachment.fileSize !==
//         undefined
//       ) {
//         homework.attachment.fileSize =
//           data.attachment.fileSize;
//       }
//     }


//     homework.updatedBy =
//       new mongoose.Types.ObjectId(
//         updatedBy
//       );


//     await homework.save();


//     return homework;

//   };


// // ============================================
// // CHANGE HOMEWORK STATUS
// // ============================================

// export const changeHomeworkStatus =
//   async (
//     schoolId: string,
//     homeworkId: string,
//     updatedBy: string,
//     status: HomeworkStatus
//   ) => {

//     validateObjectId(
//       schoolId,
//       "schoolId"
//     );

//     validateObjectId(
//       homeworkId,
//       "homeworkId"
//     );

//     validateObjectId(
//       updatedBy,
//       "updatedBy"
//     );


//     if (
//       !Object.values(
//         HomeworkStatus
//       ).includes(
//         status
//       )
//     ) {
//       throw new Error(
//         "Invalid homework status"
//       );
//     }


//     const homework =
//       await Homework.findOne({
//         _id:
//           homeworkId,

//         schoolId,

//         isActive:
//           true,
//       });


//     if (
//       !homework
//     ) {
//       throw new Error(
//         "Homework not found"
//       );
//     }


//     homework.status =
//       status;


//     homework.updatedBy =
//       new mongoose.Types.ObjectId(
//         updatedBy
//       );


//     await homework.save();


//     return homework;

//   };


// // ============================================
// // DELETE HOMEWORK
// // SOFT DELETE
// // ============================================

// export const deleteHomework =
//   async (
//     schoolId: string,
//     homeworkId: string,
//     updatedBy: string
//   ) => {

//     validateObjectId(
//       schoolId,
//       "schoolId"
//     );

//     validateObjectId(
//       homeworkId,
//       "homeworkId"
//     );

//     validateObjectId(
//       updatedBy,
//       "updatedBy"
//     );


//     const homework =
//       await Homework.findOne({
//         _id:
//           homeworkId,

//         schoolId,

//         isActive:
//           true,
//       });


//     if (
//       !homework
//     ) {
//       throw new Error(
//         "Homework not found"
//       );
//     }


//     homework.isActive =
//       false;


//     homework.updatedBy =
//       new mongoose.Types.ObjectId(
//         updatedBy
//       );


//     await homework.save();


//     return {
//       message:
//         "Homework deleted successfully",
//     };

//   };


// // ============================================
// // GET HOMEWORK STATS
// // ============================================

// export const getHomeworkStats =
//   async (
//     schoolId: string
//   ) => {

//     validateObjectId(
//       schoolId,
//       "schoolId"
//     );


//     const schoolObjectId =
//       new mongoose.Types.ObjectId(
//         schoolId
//       );


//     const now =
//       new Date();


//     const [
//       totalHomework,
//       activeHomework,
//       overdueHomework,
//       draftHomework,
//       closedHomework,
//     ] = await Promise.all([

//       Homework.countDocuments({
//         schoolId:
//           schoolObjectId,

//         isActive:
//           true,
//       }),


//       Homework.countDocuments({
//         schoolId:
//           schoolObjectId,

//         isActive:
//           true,

//         status:
//           HomeworkStatus.PUBLISHED,

//         dueDate: {
//           $gte:
//             now,
//         },
//       }),


//       Homework.countDocuments({
//         schoolId:
//           schoolObjectId,

//         isActive:
//           true,

//         status:
//           HomeworkStatus.PUBLISHED,

//         dueDate: {
//           $lt:
//             now,
//         },
//       }),


//       Homework.countDocuments({
//         schoolId:
//           schoolObjectId,

//         isActive:
//           true,

//         status:
//           HomeworkStatus.DRAFT,
//       }),


//       Homework.countDocuments({
//         schoolId:
//           schoolObjectId,

//         isActive:
//           true,

//         status:
//           HomeworkStatus.CLOSED,
//       }),
//     ]);


//     return {
//       totalHomework,

//       activeHomework,

//       overdueHomework,

//       draftHomework,

//       closedHomework,
//     };

//   };



















// import mongoose from "mongoose";

// import {
//   Homework,
// } from "./homework.model";

// import {
//   HomeworkStatus,
// } from "./homework.types";

// import type {
//   CreateHomeworkData,
//   HomeworkFilters,
//   UpdateHomeworkData,
// } from "./homework.types";


// // ============================================
// // IMPORT YOUR EXISTING MODELS
// // ============================================

// import {
//   AcademicSession,
// } from "../academic/academicSession.model";






// import {
//   Teacher,
// } from "../teachers/teacher.model";


// import { ClassModel } from "../academic/classes/class.model";
// import { SubjectAssignment } from "../academic/subjectAssignments/subjectAssignment.model";
// import { Subject } from "../academic/subjects/subject.model";
// import { Section } from "../academic/sections/section.model";
// import Student from "../students/student.model";
// import { HomeworkSubmission } from "./homeworkSubmission.model";


// // ============================================
// // HELPERS
// // ============================================

// const validateObjectId = (
//   id: string,
//   fieldName: string
// ) => {

//   if (
//     !mongoose.Types.ObjectId.isValid(
//       id
//     )
//   ) {
//     throw new Error(
//       `Invalid ${fieldName}`
//     );
//   }

// };


// const normalizeDate = (
//   value: Date | string,
//   fieldName: string
// ) => {

//   const date =
//     value instanceof Date
//       ? value
//       : new Date(value);


//   if (
//     Number.isNaN(
//       date.getTime()
//     )
//   ) {
//     throw new Error(
//       `Invalid ${fieldName}`
//     );
//   }


//   return date;
// };


// // ============================================
// // VALIDATE HOMEWORK RELATIONS
// // ============================================

// const validateHomeworkRelations =
//   async (
//     schoolId: string,
//     data: {
//       sessionId: string;
//       classId: string;
//       sectionId: string;
//       subjectId: string;
//       teacherId: string;
//     }
//   ) => {

//     validateObjectId(
//       schoolId,
//       "schoolId"
//     );

//     validateObjectId(
//       data.sessionId,
//       "sessionId"
//     );

//     validateObjectId(
//       data.classId,
//       "classId"
//     );

//     validateObjectId(
//       data.sectionId,
//       "sectionId"
//     );

//     validateObjectId(
//       data.subjectId,
//       "subjectId"
//     );

//     validateObjectId(
//       data.teacherId,
//       "teacherId"
//     );


//     // ============================================
//     // SESSION
//     // ============================================

//     const session =
//       await AcademicSession.findOne({
//         _id:
//           data.sessionId,

//         schoolId,
//       }).lean();


//     if (
//       !session
//     ) {
//       throw new Error(
//         "Academic session not found"
//       );
//     }


//     // ============================================
//     // CLASS
//     // ============================================

// //     const classData =

// //     console.log("HOMEWORK CLASS VALIDATION");

// // console.log("schoolId:", schoolId);
// // console.log("sessionId:", data.sessionId);
// // console.log("classId:", data.classId);

// // const classById = await ClassModel.findById(
// //   data.classId
// // ).lean();

// // console.log("CLASS FOUND BY ID:", classById);
// //         await ClassModel.findOne({
// //     _id: data.classId,
// //     schoolId,
// //     sessionId:
// //       data.sessionId,
// //   }).lean();

//     const classData =
//   await ClassModel.findOne({
//     _id: data.classId,
//     schoolId,
//     sessionId:
//       data.sessionId,
//   }).lean();


//     if (
//       !classData
//     ) {
//       throw new Error(
//         "Class not found in the selected academic session"
//       );
//     }


//     // ============================================
//     // SECTION
//     // ============================================

//     const section =
//       await Section.findOne({
//         _id:
//           data.sectionId,

//         schoolId,

//         sessionId:
//           data.sessionId,

//         classId:
//           data.classId,
//       }).lean();


//     if (
//       !section
//     ) {
//       throw new Error(
//         "Section not found for the selected class"
//       );
//     }


//     // ============================================
//     // SUBJECT
//     // ============================================

//     const subject =
//       await Subject.findOne({
//         _id:
//           data.subjectId,

//         schoolId,
//       }).lean();


//     if (
//       !subject
//     ) {
//       throw new Error(
//         "Subject not found"
//       );
//     }


//     // ============================================
//     // TEACHER
//     // ============================================

//     const teacher =
//       await Teacher.findOne({
//         _id:
//           data.teacherId,

//         schoolId,
//         isActive: true,
//       }).lean();


//     if (
//       !teacher
//     ) {
//       throw new Error(
//         "Teacher not found or inactive"
//       );
//     }


//     // ============================================
//     // SUBJECT ASSIGNMENT
//     // ============================================

//     const assignment =
//       await SubjectAssignment.findOne({
//         schoolId,

//         sessionId:
//           data.sessionId,

//         classId:
//           data.classId,

//         sectionId:
//           data.sectionId,

//         subjectId:
//           data.subjectId,

//         teacherId:
//           data.teacherId,

//         isActive: true,
//       }).lean();


//     if (
//       !assignment
//     ) {
//       throw new Error(
//         "Selected teacher is not assigned to this subject, class and section"
//       );
//     }

//   };


// // ============================================
// // CREATE HOMEWORK
// // ============================================

// export const createHomework =
//   async (
//     schoolId: string,
//     createdBy: string,
//     data: CreateHomeworkData
//   ) => {

//     validateObjectId(
//       schoolId,
//       "schoolId"
//     );

//     validateObjectId(
//       createdBy,
//       "createdBy"
//     );


//     await validateHomeworkRelations(
//       schoolId,
//       {
//         sessionId:
//           data.sessionId,

//         classId:
//           data.classId,

//         sectionId:
//           data.sectionId,

//         subjectId:
//           data.subjectId,

//         teacherId:
//           data.teacherId,
//       }
//     );


//     const assignedDate =
//       normalizeDate(
//         data.assignedDate,
//         "assignedDate"
//       );


//     const dueDate =
//       normalizeDate(
//         data.dueDate,
//         "dueDate"
//       );


//     if (
//       dueDate <
//       assignedDate
//     ) {
//       throw new Error(
//         "Due date must be on or after the assigned date"
//       );
//     }


//     if (
//       !data.title.trim()
//     ) {
//       throw new Error(
//         "Homework title is required"
//       );
//     }


//     if (
//       !data.description.trim()
//     ) {
//       throw new Error(
//         "Homework description is required"
//       );
//     }


//     const payload: {
//       schoolId:
//         mongoose.Types.ObjectId;

//       sessionId:
//         mongoose.Types.ObjectId;

//       classId:
//         mongoose.Types.ObjectId;

//       sectionId:
//         mongoose.Types.ObjectId;

//       subjectId:
//         mongoose.Types.ObjectId;

//       teacherId:
//         mongoose.Types.ObjectId;

//       title: string;

//       description: string;

//       assignedDate: Date;

//       dueDate: Date;

//       status: HomeworkStatus;

//       createdBy:
//         mongoose.Types.ObjectId;

//       isActive: boolean;

//       attachment?: {
//         fileName: string;

//         fileUrl: string;

//         fileType?: string;

//         fileSize?: number;
//       };
//     } = {

//       schoolId:
//         new mongoose.Types.ObjectId(
//           schoolId
//         ),

//       sessionId:
//         new mongoose.Types.ObjectId(
//           data.sessionId
//         ),

//       classId:
//         new mongoose.Types.ObjectId(
//           data.classId
//         ),

//       sectionId:
//         new mongoose.Types.ObjectId(
//           data.sectionId
//         ),

//       subjectId:
//         new mongoose.Types.ObjectId(
//           data.subjectId
//         ),

//       teacherId:
//         new mongoose.Types.ObjectId(
//           data.teacherId
//         ),

//       title:
//         data.title.trim(),

//       description:
//         data.description.trim(),

//       assignedDate,

//       dueDate,

//       status:
//         data.status ??
//         HomeworkStatus.DRAFT,

//       createdBy:
//         new mongoose.Types.ObjectId(
//           createdBy
//         ),

//       isActive:
//         true,
//     };


//     if (
//       data.attachment
//     ) {
//       payload.attachment = {
//         fileName:
//           data.attachment.fileName,

//         fileUrl:
//           data.attachment.fileUrl,
//       };


//       if (
//         data.attachment.fileType
//       ) {
//         payload.attachment.fileType =
//           data.attachment.fileType;
//       }


//       if (
//         data.attachment.fileSize !==
//         undefined
//       ) {
//         payload.attachment.fileSize =
//           data.attachment.fileSize;
//       }
//     }


//     const homework =
//       await Homework.create(
//         payload
//       );


//     return homework;

//   };


// // ============================================
// // GET HOMEWORK LIST
// // ============================================

// export const getHomeworks =
//   async (
//     schoolId: string,
//     filters:
//       HomeworkFilters = {}
//   ) => {

//     validateObjectId(
//       schoolId,
//       "schoolId"
//     );


//     const page =
//       Math.max(
//         Number(
//           filters.page
//         ) || 1,
//         1
//       );


//     const limit =
//       Math.min(
//         Math.max(
//           Number(
//             filters.limit
//           ) || 10,
//           1
//         ),
//         100
//       );


//     const skip =
//       (
//         page - 1
//       ) * limit;


//     const query:
//       Record<
//         string,
//         unknown
//       > = {

//       schoolId:
//         new mongoose.Types.ObjectId(
//           schoolId
//         ),

//       isActive:
//         true,
//     };


//     // ============================================
//     // SESSION FILTER
//     // ============================================

//     if (
//       filters.sessionId
//     ) {

//       validateObjectId(
//         filters.sessionId,
//         "sessionId"
//       );

//       query.sessionId =
//         new mongoose.Types.ObjectId(
//           filters.sessionId
//         );
//     }


//     // ============================================
//     // CLASS FILTER
//     // ============================================

//     if (
//       filters.classId
//     ) {

//       validateObjectId(
//         filters.classId,
//         "classId"
//       );

//       query.classId =
//         new mongoose.Types.ObjectId(
//           filters.classId
//         );
//     }


//     // ============================================
//     // SECTION FILTER
//     // ============================================

//     if (
//       filters.sectionId
//     ) {

//       validateObjectId(
//         filters.sectionId,
//         "sectionId"
//       );

//       query.sectionId =
//         new mongoose.Types.ObjectId(
//           filters.sectionId
//         );
//     }


//     // ============================================
//     // SUBJECT FILTER
//     // ============================================

//     if (
//       filters.subjectId
//     ) {

//       validateObjectId(
//         filters.subjectId,
//         "subjectId"
//       );

//       query.subjectId =
//         new mongoose.Types.ObjectId(
//           filters.subjectId
//         );
//     }


//     // ============================================
//     // TEACHER FILTER
//     // ============================================

//     if (
//       filters.teacherId
//     ) {

//       validateObjectId(
//         filters.teacherId,
//         "teacherId"
//       );

//       query.teacherId =
//         new mongoose.Types.ObjectId(
//           filters.teacherId
//         );
//     }


//     // ============================================
//     // STATUS FILTER
//     // ============================================

//     if (
//       filters.status
//     ) {
//       query.status =
//         filters.status;
//     }


//     // ============================================
//     // ASSIGNED DATE FILTER
//     // ============================================

//     if (
//       filters.fromDate ||
//       filters.toDate
//     ) {

//       const assignedDateQuery: {
//         $gte?: Date;
//         $lte?: Date;
//       } = {};


//       if (
//         filters.fromDate
//       ) {

//         const fromDate =
//           new Date(
//             filters.fromDate
//           );

//         if (
//           Number.isNaN(
//             fromDate.getTime()
//           )
//         ) {
//           throw new Error(
//             "Invalid fromDate"
//           );
//         }


//         fromDate.setHours(
//           0,
//           0,
//           0,
//           0
//         );


//         assignedDateQuery.$gte =
//           fromDate;
//       }


//       if (
//         filters.toDate
//       ) {

//         const toDate =
//           new Date(
//             filters.toDate
//           );

//         if (
//           Number.isNaN(
//             toDate.getTime()
//           )
//         ) {
//           throw new Error(
//             "Invalid toDate"
//           );
//         }


//         toDate.setHours(
//           23,
//           59,
//           59,
//           999
//         );


//         assignedDateQuery.$lte =
//           toDate;
//       }


//       query.assignedDate =
//         assignedDateQuery;
//     }


//     // ============================================
//     // SEARCH
//     // ============================================

//     if (
//       filters.search?.trim()
//     ) {

//       const search =
//         filters.search.trim();


//       query.$or = [
//         {
//           title: {
//             $regex:
//               search,

//             $options:
//               "i",
//           },
//         },

//         {
//           description: {
//             $regex:
//               search,

//             $options:
//               "i",
//           },
//         },
//       ];
//     }


//     // ============================================
//     // FETCH
//     // ============================================

//     const [
//       homeworks,
//       total,
//     ] = await Promise.all([

//       Homework.find(
//         query
//       )
//         .populate(
//           "sessionId",
//           "name startDate endDate isCurrent"
//         )
//         .populate(
//           "classId",
//           "name"
//         )
//         .populate(
//           "sectionId",
//           "name"
//         )
//         .populate(
//           "subjectId",
//           "name code"
//         )
//         .populate(
//           "teacherId",
//           "name employeeId"
//         )
//         .sort({
//           assignedDate: -1,
//           createdAt: -1,
//         })
//         .skip(
//           skip
//         )
//         .limit(
//           limit
//         )
//         .lean(),


//       Homework.countDocuments(
//         query
//       ),
//     ]);


//     return {
//       homeworks,

//       pagination: {
//         total,

//         page,

//         limit,

//         totalPages:
//           Math.ceil(
//             total /
//             limit
//           ),
//       },
//     };

//   };


// // ============================================
// // GET HOMEWORK BY ID
// // ============================================

// export const getHomeworkById =
//   async (
//     schoolId: string,
//     homeworkId: string
//   ) => {

//     validateObjectId(
//       schoolId,
//       "schoolId"
//     );

//     validateObjectId(
//       homeworkId,
//       "homeworkId"
//     );


//     const homework =
//       await Homework.findOne({
//         _id:
//           homeworkId,

//         schoolId,

//         isActive:
//           true,
//       })
//         .populate(
//           "sessionId",
//           "name startDate endDate isCurrent"
//         )
//         .populate(
//           "classId",
//           "name"
//         )
//         .populate(
//           "sectionId",
//           "name"
//         )
//         .populate(
//           "subjectId",
//           "name code"
//         )
//         .populate(
//           "teacherId",
//           "name employeeId"
//         )
//         .lean();


//     if (
//       !homework
//     ) {
//       throw new Error(
//         "Homework not found"
//       );
//     }


//     return homework;

//   };


// // ============================================
// // UPDATE HOMEWORK
// // ============================================

// export const updateHomework =
//   async (
//     schoolId: string,
//     homeworkId: string,
//     updatedBy: string,
//     data: UpdateHomeworkData
//   ) => {

//     validateObjectId(
//       schoolId,
//       "schoolId"
//     );

//     validateObjectId(
//       homeworkId,
//       "homeworkId"
//     );

//     validateObjectId(
//       updatedBy,
//       "updatedBy"
//     );


//     const homework =
//       await Homework.findOne({
//         _id:
//           homeworkId,

//         schoolId,

//         isActive:
//           true,
//       });


//     if (
//       !homework
//     ) {
//       throw new Error(
//         "Homework not found"
//       );
//     }


//     // ============================================
//     // FINAL RELATION IDS
//     // ============================================

//     const sessionId =
//       data.sessionId ??
//       homework.sessionId.toString();


//     const classId =
//       data.classId ??
//       homework.classId.toString();


//     const sectionId =
//       data.sectionId ??
//       homework.sectionId.toString();


//     const subjectId =
//       data.subjectId ??
//       homework.subjectId.toString();


//     const teacherId =
//       data.teacherId ??
//       homework.teacherId.toString();


//     // ============================================
//     // VALIDATE FINAL RELATIONS
//     // ============================================

//     await validateHomeworkRelations(
//       schoolId,
//       {
//         sessionId,
//         classId,
//         sectionId,
//         subjectId,
//         teacherId,
//       }
//     );


//     // ============================================
//     // DATES
//     // ============================================

//     const assignedDate =
//       data.assignedDate
//         ? normalizeDate(
//             data.assignedDate,
//             "assignedDate"
//           )
//         : homework.assignedDate;


//     const dueDate =
//       data.dueDate
//         ? normalizeDate(
//             data.dueDate,
//             "dueDate"
//           )
//         : homework.dueDate;


//     if (
//       dueDate <
//       assignedDate
//     ) {
//       throw new Error(
//         "Due date must be on or after the assigned date"
//       );
//     }


//     // ============================================
//     // UPDATE RELATIONS
//     // ============================================

//     homework.sessionId =
//       new mongoose.Types.ObjectId(
//         sessionId
//       );


//     homework.classId =
//       new mongoose.Types.ObjectId(
//         classId
//       );


//     homework.sectionId =
//       new mongoose.Types.ObjectId(
//         sectionId
//       );


//     homework.subjectId =
//       new mongoose.Types.ObjectId(
//         subjectId
//       );


//     homework.teacherId =
//       new mongoose.Types.ObjectId(
//         teacherId
//       );


//     // ============================================
//     // UPDATE NORMAL FIELDS
//     // ============================================

//     if (
//       data.title !==
//       undefined
//     ) {

//       if (
//         !data.title.trim()
//       ) {
//         throw new Error(
//           "Homework title is required"
//         );
//       }


//       homework.title =
//         data.title.trim();
//     }


//     if (
//       data.description !==
//       undefined
//     ) {

//       if (
//         !data.description.trim()
//       ) {
//         throw new Error(
//           "Homework description is required"
//         );
//       }


//       homework.description =
//         data.description.trim();
//     }


//     homework.assignedDate =
//       assignedDate;


//     homework.dueDate =
//       dueDate;


//     if (
//       data.status !==
//       undefined
//     ) {
//       homework.status =
//         data.status;
//     }


//     // ============================================
//     // ATTACHMENT
//     // ============================================

//     if (
//       data.attachment ===
//       null
//     ) {

//       homework.set(
//         "attachment",
//         undefined
//       );

//     } else if (
//       data.attachment !==
//       undefined
//     ) {

//       homework.attachment = {
//         fileName:
//           data.attachment.fileName,

//         fileUrl:
//           data.attachment.fileUrl,
//       };


//       if (
//         data.attachment.fileType
//       ) {
//         homework.attachment.fileType =
//           data.attachment.fileType;
//       }


//       if (
//         data.attachment.fileSize !==
//         undefined
//       ) {
//         homework.attachment.fileSize =
//           data.attachment.fileSize;
//       }
//     }


//     homework.updatedBy =
//       new mongoose.Types.ObjectId(
//         updatedBy
//       );


//     await homework.save();


//     return homework;

//   };


// // ============================================
// // CHANGE HOMEWORK STATUS
// // ============================================

// export const changeHomeworkStatus =
//   async (
//     schoolId: string,
//     homeworkId: string,
//     updatedBy: string,
//     status: HomeworkStatus
//   ) => {

//     validateObjectId(
//       schoolId,
//       "schoolId"
//     );

//     validateObjectId(
//       homeworkId,
//       "homeworkId"
//     );

//     validateObjectId(
//       updatedBy,
//       "updatedBy"
//     );


//     if (
//       !Object.values(
//         HomeworkStatus
//       ).includes(
//         status
//       )
//     ) {
//       throw new Error(
//         "Invalid homework status"
//       );
//     }


//     const homework =
//       await Homework.findOne({
//         _id:
//           homeworkId,

//         schoolId,

//         isActive:
//           true,
//       });


//     if (
//       !homework
//     ) {
//       throw new Error(
//         "Homework not found"
//       );
//     }


//     homework.status =
//       status;


//     homework.updatedBy =
//       new mongoose.Types.ObjectId(
//         updatedBy
//       );


//     await homework.save();


//     return homework;

//   };


// // ============================================
// // DELETE HOMEWORK
// // SOFT DELETE
// // ============================================

// export const deleteHomework =
//   async (
//     schoolId: string,
//     homeworkId: string,
//     updatedBy: string
//   ) => {

//     validateObjectId(
//       schoolId,
//       "schoolId"
//     );

//     validateObjectId(
//       homeworkId,
//       "homeworkId"
//     );

//     validateObjectId(
//       updatedBy,
//       "updatedBy"
//     );


//     const homework =
//       await Homework.findOne({
//         _id:
//           homeworkId,

//         schoolId,

//         isActive:
//           true,
//       });


//     if (
//       !homework
//     ) {
//       throw new Error(
//         "Homework not found"
//       );
//     }


//     homework.isActive =
//       false;


//     homework.updatedBy =
//       new mongoose.Types.ObjectId(
//         updatedBy
//       );


//     await homework.save();


//     return {
//       message:
//         "Homework deleted successfully",
//     };

//   };


// // ============================================
// // GET HOMEWORK STATS
// // ============================================

// export const getHomeworkStats =
//   async (
//     schoolId: string
//   ) => {

//     validateObjectId(
//       schoolId,
//       "schoolId"
//     );


//     const schoolObjectId =
//       new mongoose.Types.ObjectId(
//         schoolId
//       );


//     const now =
//       new Date();


//     const [
//       totalHomework,
//       activeHomework,
//       overdueHomework,
//       draftHomework,
//       closedHomework,
//     ] = await Promise.all([

//       Homework.countDocuments({
//         schoolId:
//           schoolObjectId,

//         isActive:
//           true,
//       }),


//       Homework.countDocuments({
//         schoolId:
//           schoolObjectId,

//         isActive:
//           true,

//         status:
//           HomeworkStatus.PUBLISHED,

//         dueDate: {
//           $gte:
//             now,
//         },
//       }),


//       Homework.countDocuments({
//         schoolId:
//           schoolObjectId,

//         isActive:
//           true,

//         status:
//           HomeworkStatus.PUBLISHED,

//         dueDate: {
//           $lt:
//             now,
//         },
//       }),


//       Homework.countDocuments({
//         schoolId:
//           schoolObjectId,

//         isActive:
//           true,

//         status:
//           HomeworkStatus.DRAFT,
//       }),


//       Homework.countDocuments({
//         schoolId:
//           schoolObjectId,

//         isActive:
//           true,

//         status:
//           HomeworkStatus.CLOSED,
//       }),
//     ]);


//     return {
//       totalHomework,

//       activeHomework,

//       overdueHomework,

//       draftHomework,

//       closedHomework,
//     };

//   };

// // ============================================
// // STUDENT - MY HOMEWORK
// //
// // Student identity comes from JWT.
// // Session/Class/Section are derived from the
// // active Student profile.
// // Only PUBLISHED + active homework is returned.
// // Student's own submission is attached to each item.
// // ============================================

// export const getMyHomeworks =
//   async (
//     schoolId: string,
//     studentId: string
//   ) => {

//     validateObjectId(
//       schoolId,
//       "schoolId"
//     );

//     validateObjectId(
//       studentId,
//       "studentId"
//     );


//     const student =
//       await Student.findOne({
//         _id:
//           studentId,

//         schoolId,

//         status:
//           "ACTIVE",
//       })
//         .select(
//           "_id name admissionNumber rollNumber sessionId classId sectionId"
//         )
//         .populate(
//           "sessionId",
//           "name startDate endDate isCurrent"
//         )
//         .populate(
//           "classId",
//           "name"
//         )
//         .populate(
//           "sectionId",
//           "name"
//         )
//         .lean();


//     if (!student) {
//       throw new Error(
//         "Student profile not found or inactive"
//       );
//     }


//     const getId = (
//       value: unknown
//     ): string => {

//       if (
//         value &&
//         typeof value ===
//           "object" &&
//         "_id" in value
//       ) {
//         return String(
//           (
//             value as {
//               _id: unknown;
//             }
//           )._id
//         );
//       }


//       return String(value);
//     };


//     const sessionId =
//       getId(
//         student.sessionId
//       );

//     const classId =
//       getId(
//         student.classId
//       );

//     const sectionId =
//       getId(
//         student.sectionId
//       );


//     const homeworks =
//       await Homework.find({
//         schoolId:
//           new mongoose.Types.ObjectId(
//             schoolId
//           ),

//         sessionId:
//           new mongoose.Types.ObjectId(
//             sessionId
//           ),

//         classId:
//           new mongoose.Types.ObjectId(
//             classId
//           ),

//         sectionId:
//           new mongoose.Types.ObjectId(
//             sectionId
//           ),

//         status:
//           HomeworkStatus.PUBLISHED,

//         isActive:
//           true,
//       })
//         .populate(
//           "sessionId",
//           "name startDate endDate isCurrent"
//         )
//         .populate(
//           "classId",
//           "name"
//         )
//         .populate(
//           "sectionId",
//           "name"
//         )
//         .populate(
//           "subjectId",
//           "name code subjectType"
//         )
//         .populate(
//           "teacherId",
//           "name employeeId"
//         )
//         .sort({
//           assignedDate: -1,
//           createdAt: -1,
//         })
//         .lean();


//     const homeworkIds =
//       homeworks.map(
//         (homework) =>
//           homework._id
//       );


//     const submissions =
//       homeworkIds.length > 0
//         ? await HomeworkSubmission.find({
//             schoolId:
//               new mongoose.Types.ObjectId(
//                 schoolId
//               ),

//             studentId:
//               new mongoose.Types.ObjectId(
//                 studentId
//               ),

//             homeworkId: {
//               $in:
//                 homeworkIds,
//             },

//             isActive:
//               true,
//           })
//             .select(
//               "homeworkId submissionText attachment submissionStatus reviewStatus submittedAt remarks marks reviewedAt"
//             )
//             .lean()
//         : [];


//     const submissionMap =
//       new Map(
//         submissions.map(
//           (submission) => [
//             submission.homeworkId.toString(),
//             submission,
//           ]
//         )
//       );


//     const now =
//       new Date();


//     const homework =
//       homeworks.map(
//         (item) => {

//           const submission =
//             submissionMap.get(
//               item._id.toString()
//             ) ?? null;


//           return {
//             ...item,

//             studentHomeworkStatus:
//               submission
//                 ? "SUBMITTED"
//                 : item.dueDate <
//                   now
//                   ? "OVERDUE"
//                   : "PENDING",

//             submission,
//           };
//         }
//       );


//     return {
//       student,
//       homework,
//     };
//   };











import mongoose from "mongoose";

import {
  Homework,
} from "./homework.model";

import {
  HomeworkStatus,
} from "./homework.types";

import type {
  CreateHomeworkData,
  HomeworkFilters,
  UpdateHomeworkData,
} from "./homework.types";


// ============================================
// MODELS
// ============================================

import {
  AcademicSession,
} from "../academic/academicSession.model";

import {
  Teacher,
} from "../teachers/teacher.model";

import {
  ClassModel,
} from "../academic/classes/class.model";

import {
  SubjectAssignment,
} from "../academic/subjectAssignments/subjectAssignment.model";

import {
  Subject,
} from "../academic/subjects/subject.model";

import {
  Section,
} from "../academic/sections/section.model";

import Student from "../students/student.model";

import {
  HomeworkSubmission,
} from "./homeworkSubmission.model";


// ============================================
// HELPERS
// ============================================

const validateObjectId = (
  id: string,
  fieldName: string
) => {

  if (
    !mongoose.Types.ObjectId.isValid(
      id
    )
  ) {
    throw new Error(
      `Invalid ${fieldName}`
    );
  }

};


const normalizeDate = (
  value: Date | string,
  fieldName: string
) => {

  const date =
    value instanceof Date
      ? value
      : new Date(value);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    throw new Error(
      `Invalid ${fieldName}`
    );
  }


  return date;
};


// ============================================
// VALIDATE HOMEWORK RELATIONS
//
// Validates:
//
// School
// Session
// Class
// Section
// Subject
// Teacher
// Subject Assignment
//
// This is also the main Teacher security check.
// ============================================

const validateHomeworkRelations =
  async (
    schoolId: string,
    data: {
      sessionId: string;
      classId: string;
      sectionId: string;
      subjectId: string;
      teacherId: string;
    }
  ) => {

    // ============================================
    // OBJECT ID VALIDATION
    // ============================================

    validateObjectId(
      schoolId,
      "schoolId"
    );

    validateObjectId(
      data.sessionId,
      "sessionId"
    );

    validateObjectId(
      data.classId,
      "classId"
    );

    validateObjectId(
      data.sectionId,
      "sectionId"
    );

    validateObjectId(
      data.subjectId,
      "subjectId"
    );

    validateObjectId(
      data.teacherId,
      "teacherId"
    );


    // ============================================
    // SESSION
    // ============================================

    const session =
      await AcademicSession.findOne({
        _id:
          data.sessionId,

        schoolId,
      }).lean();


    if (!session) {
      throw new Error(
        "Academic session not found"
      );
    }


    // ============================================
    // CLASS
    // ============================================

    const classData =
      await ClassModel.findOne({
        _id:
          data.classId,

        schoolId,

        sessionId:
          data.sessionId,
      }).lean();


    if (!classData) {
      throw new Error(
        "Class not found in the selected academic session"
      );
    }


    // ============================================
    // SECTION
    // ============================================

    const section =
      await Section.findOne({
        _id:
          data.sectionId,

        schoolId,

        sessionId:
          data.sessionId,

        classId:
          data.classId,
      }).lean();


    if (!section) {
      throw new Error(
        "Section not found for the selected class"
      );
    }


    // ============================================
    // SUBJECT
    // ============================================

    const subject =
      await Subject.findOne({
        _id:
          data.subjectId,

        schoolId,
      }).lean();


    if (!subject) {
      throw new Error(
        "Subject not found"
      );
    }


    // ============================================
    // TEACHER
    // ============================================

    const teacher =
      await Teacher.findOne({
        _id:
          data.teacherId,

        schoolId,

        isActive:
          true,
      }).lean();


    if (!teacher) {
      throw new Error(
        "Teacher not found or inactive"
      );
    }


    // ============================================
    // SUBJECT ASSIGNMENT
    //
    // Teacher must actually be assigned to:
    //
    // session
    // class
    // section
    // subject
    // ============================================

    const assignment =
      await SubjectAssignment.findOne({
        schoolId,

        sessionId:
          data.sessionId,

        classId:
          data.classId,

        sectionId:
          data.sectionId,

        subjectId:
          data.subjectId,

        teacherId:
          data.teacherId,

        isActive:
          true,
      }).lean();


    if (!assignment) {
      throw new Error(
        "Selected teacher is not assigned to this subject, class and section"
      );
    }

  };


// ============================================
// CREATE HOMEWORK
//
// SCHOOL ADMIN:
// teacherId comes from body.
//
// TEACHER:
// actorTeacherId comes from JWT and overrides
// body teacherId.
// ============================================

export const createHomework =
  async (
    schoolId: string,
    createdBy: string,
    data: CreateHomeworkData,
    actorTeacherId?: string
  ) => {

    // ============================================
    // AUTH IDS
    // ============================================

    validateObjectId(
      schoolId,
      "schoolId"
    );

    validateObjectId(
      createdBy,
      "createdBy"
    );


    // ============================================
    // FINAL TEACHER ID
    //
    // Teacher JWT always has priority.
    // ============================================

    const teacherId =
      actorTeacherId ??
      data.teacherId;


    if (!teacherId) {
      throw new Error(
        "Teacher ID is required"
      );
    }


    validateObjectId(
      teacherId,
      "teacherId"
    );


    // ============================================
    // RELATION VALIDATION
    // ============================================

    await validateHomeworkRelations(
      schoolId,
      {
        sessionId:
          data.sessionId,

        classId:
          data.classId,

        sectionId:
          data.sectionId,

        subjectId:
          data.subjectId,

        teacherId,
      }
    );


    // ============================================
    // DATES
    // ============================================

    const assignedDate =
      normalizeDate(
        data.assignedDate,
        "assignedDate"
      );


    const dueDate =
      normalizeDate(
        data.dueDate,
        "dueDate"
      );


    if (
      dueDate <
      assignedDate
    ) {
      throw new Error(
        "Due date must be on or after the assigned date"
      );
    }


    // ============================================
    // TITLE
    // ============================================

    if (
      !data.title.trim()
    ) {
      throw new Error(
        "Homework title is required"
      );
    }


    // ============================================
    // DESCRIPTION
    // ============================================

    if (
      !data.description.trim()
    ) {
      throw new Error(
        "Homework description is required"
      );
    }


    // ============================================
    // PAYLOAD
    // ============================================

    const payload: {
      schoolId:
        mongoose.Types.ObjectId;

      sessionId:
        mongoose.Types.ObjectId;

      classId:
        mongoose.Types.ObjectId;

      sectionId:
        mongoose.Types.ObjectId;

      subjectId:
        mongoose.Types.ObjectId;

      teacherId:
        mongoose.Types.ObjectId;

      title: string;

      description: string;

      assignedDate: Date;

      dueDate: Date;

      status: HomeworkStatus;

      createdBy:
        mongoose.Types.ObjectId;

      isActive: boolean;

      attachment?: {
        fileName: string;

        fileUrl: string;

        fileType?: string;

        fileSize?: number;
      };
    } = {

      schoolId:
        new mongoose.Types.ObjectId(
          schoolId
        ),

      sessionId:
        new mongoose.Types.ObjectId(
          data.sessionId
        ),

      classId:
        new mongoose.Types.ObjectId(
          data.classId
        ),

      sectionId:
        new mongoose.Types.ObjectId(
          data.sectionId
        ),

      subjectId:
        new mongoose.Types.ObjectId(
          data.subjectId
        ),

      teacherId:
        new mongoose.Types.ObjectId(
          teacherId
        ),

      title:
        data.title.trim(),

      description:
        data.description.trim(),

      assignedDate,

      dueDate,

      status:
        data.status ??
        HomeworkStatus.DRAFT,

      createdBy:
        new mongoose.Types.ObjectId(
          createdBy
        ),

      isActive:
        true,
    };


    // ============================================
    // ATTACHMENT
    // ============================================

    if (
      data.attachment
    ) {

      payload.attachment = {

        fileName:
          data.attachment.fileName,

        fileUrl:
          data.attachment.fileUrl,
      };


      if (
        data.attachment.fileType
      ) {
        payload.attachment.fileType =
          data.attachment.fileType;
      }


      if (
        data.attachment.fileSize !==
        undefined
      ) {
        payload.attachment.fileSize =
          data.attachment.fileSize;
      }
    }


    // ============================================
    // CREATE
    // ============================================

    const homework =
      await Homework.create(
        payload
      );


    return homework;

  };


// ============================================
// GET HOMEWORK LIST
//
// SCHOOL ADMIN:
// Can see school homework.
//
// TEACHER:
// actorTeacherId forces query to logged-in teacher.
// ============================================

export const getHomeworks =
  async (
    schoolId: string,
    filters:
      HomeworkFilters = {},
    actorTeacherId?: string
  ) => {

    validateObjectId(
      schoolId,
      "schoolId"
    );


    // ============================================
    // PAGINATION
    // ============================================

    const page =
      Math.max(
        Number(
          filters.page
        ) || 1,
        1
      );


    const limit =
      Math.min(
        Math.max(
          Number(
            filters.limit
          ) || 10,
          1
        ),
        100
      );


    const skip =
      (
        page - 1
      ) * limit;


    // ============================================
    // BASE QUERY
    // ============================================

    const query:
      Record<
        string,
        unknown
      > = {

      schoolId:
        new mongoose.Types.ObjectId(
          schoolId
        ),

      isActive:
        true,
    };


    // ============================================
    // SESSION FILTER
    // ============================================

    if (
      filters.sessionId
    ) {

      validateObjectId(
        filters.sessionId,
        "sessionId"
      );

      query.sessionId =
        new mongoose.Types.ObjectId(
          filters.sessionId
        );
    }


    // ============================================
    // CLASS FILTER
    // ============================================

    if (
      filters.classId
    ) {

      validateObjectId(
        filters.classId,
        "classId"
      );

      query.classId =
        new mongoose.Types.ObjectId(
          filters.classId
        );
    }


    // ============================================
    // SECTION FILTER
    // ============================================

    if (
      filters.sectionId
    ) {

      validateObjectId(
        filters.sectionId,
        "sectionId"
      );

      query.sectionId =
        new mongoose.Types.ObjectId(
          filters.sectionId
        );
    }


    // ============================================
    // SUBJECT FILTER
    // ============================================

    if (
      filters.subjectId
    ) {

      validateObjectId(
        filters.subjectId,
        "subjectId"
      );

      query.subjectId =
        new mongoose.Types.ObjectId(
          filters.subjectId
        );
    }


    // ============================================
    // TEACHER SECURITY
    //
    // Logged-in Teacher:
    // JWT teacherId always wins.
    //
    // School Admin:
    // teacherId filter can be used normally.
    // ============================================

    if (
      actorTeacherId
    ) {

      validateObjectId(
        actorTeacherId,
        "teacherId"
      );


      const teacher =
        await Teacher.findOne({
          _id:
            actorTeacherId,

          schoolId,

          isActive:
            true,
        })
          .select(
            "_id"
          )
          .lean();


      if (!teacher) {
        throw new Error(
          "Teacher profile not found or inactive"
        );
      }


      query.teacherId =
        new mongoose.Types.ObjectId(
          actorTeacherId
        );

    } else if (
      filters.teacherId
    ) {

      validateObjectId(
        filters.teacherId,
        "teacherId"
      );


      query.teacherId =
        new mongoose.Types.ObjectId(
          filters.teacherId
        );
    }


    // ============================================
    // STATUS FILTER
    // ============================================

    if (
      filters.status
    ) {
      query.status =
        filters.status;
    }


    // ============================================
    // ASSIGNED DATE FILTER
    // ============================================

    if (
      filters.fromDate ||
      filters.toDate
    ) {

      const assignedDateQuery: {
        $gte?: Date;
        $lte?: Date;
      } = {};


      if (
        filters.fromDate
      ) {

        const fromDate =
          new Date(
            filters.fromDate
          );


        if (
          Number.isNaN(
            fromDate.getTime()
          )
        ) {
          throw new Error(
            "Invalid fromDate"
          );
        }


        fromDate.setHours(
          0,
          0,
          0,
          0
        );


        assignedDateQuery.$gte =
          fromDate;
      }


      if (
        filters.toDate
      ) {

        const toDate =
          new Date(
            filters.toDate
          );


        if (
          Number.isNaN(
            toDate.getTime()
          )
        ) {
          throw new Error(
            "Invalid toDate"
          );
        }


        toDate.setHours(
          23,
          59,
          59,
          999
        );


        assignedDateQuery.$lte =
          toDate;
      }


      query.assignedDate =
        assignedDateQuery;
    }


    // ============================================
    // SEARCH
    // ============================================

    if (
      filters.search?.trim()
    ) {

      const search =
        filters.search.trim();


      query.$or = [

        {
          title: {
            $regex:
              search,

            $options:
              "i",
          },
        },

        {
          description: {
            $regex:
              search,

            $options:
              "i",
          },
        },
      ];
    }


    // ============================================
    // FETCH
    // ============================================

    const [
      homeworks,
      total,
    ] = await Promise.all([

      Homework.find(
        query
      )
        .populate(
          "sessionId",
          "name startDate endDate isCurrent"
        )
        .populate(
          "classId",
          "name"
        )
        .populate(
          "sectionId",
          "name"
        )
        .populate(
          "subjectId",
          "name code"
        )
        .populate(
          "teacherId",
          "name employeeId"
        )
        .sort({
          assignedDate:
            -1,

          createdAt:
            -1,
        })
        .skip(
          skip
        )
        .limit(
          limit
        )
        .lean(),


      Homework.countDocuments(
        query
      ),
    ]);


    return {

      homeworks,

      pagination: {

        total,

        page,

        limit,

        totalPages:
          Math.ceil(
            total /
            limit
          ),
      },
    };

  };


// ============================================
// GET HOMEWORK BY ID
//
// Teacher can only access own homework.
// ============================================

export const getHomeworkById =
  async (
    schoolId: string,
    homeworkId: string,
    actorTeacherId?: string
  ) => {

    validateObjectId(
      schoolId,
      "schoolId"
    );

    validateObjectId(
      homeworkId,
      "homeworkId"
    );


    // ============================================
    // QUERY
    // ============================================

    const query:
      Record<
        string,
        unknown
      > = {

      _id:
        homeworkId,

      schoolId,

      isActive:
        true,
    };


    // ============================================
    // TEACHER SECURITY
    // ============================================

    if (
      actorTeacherId
    ) {

      validateObjectId(
        actorTeacherId,
        "teacherId"
      );


      query.teacherId =
        new mongoose.Types.ObjectId(
          actorTeacherId
        );
    }


    // ============================================
    // FETCH
    // ============================================

    const homework =
      await Homework.findOne(
        query
      )
        .populate(
          "sessionId",
          "name startDate endDate isCurrent"
        )
        .populate(
          "classId",
          "name"
        )
        .populate(
          "sectionId",
          "name"
        )
        .populate(
          "subjectId",
          "name code"
        )
        .populate(
          "teacherId",
          "name employeeId"
        )
        .lean();


    if (
      !homework
    ) {
      throw new Error(
        "Homework not found"
      );
    }


    return homework;

  };


// ============================================
// UPDATE HOMEWORK
//
// Teacher:
// - Can update only own homework.
// - Cannot transfer homework to another teacher.
// - Final relation must still have valid
//   SubjectAssignment.
// ============================================

export const updateHomework =
  async (
    schoolId: string,
    homeworkId: string,
    updatedBy: string,
    data: UpdateHomeworkData,
    actorTeacherId?: string
  ) => {

    validateObjectId(
      schoolId,
      "schoolId"
    );

    validateObjectId(
      homeworkId,
      "homeworkId"
    );

    validateObjectId(
      updatedBy,
      "updatedBy"
    );


    // ============================================
    // HOMEWORK QUERY
    // ============================================

    const homeworkQuery:
      Record<
        string,
        unknown
      > = {

      _id:
        homeworkId,

      schoolId,

      isActive:
        true,
    };


    // ============================================
    // TEACHER SECURITY
    // ============================================

    if (
      actorTeacherId
    ) {

      validateObjectId(
        actorTeacherId,
        "teacherId"
      );


      homeworkQuery.teacherId =
        new mongoose.Types.ObjectId(
          actorTeacherId
        );
    }


    const homework =
      await Homework.findOne(
        homeworkQuery
      );


    if (
      !homework
    ) {
      throw new Error(
        "Homework not found"
      );
    }


    // ============================================
    // FINAL RELATION IDS
    // ============================================

    const sessionId =
      data.sessionId ??
      homework.sessionId.toString();


    const classId =
      data.classId ??
      homework.classId.toString();


    const sectionId =
      data.sectionId ??
      homework.sectionId.toString();


    const subjectId =
      data.subjectId ??
      homework.subjectId.toString();


    // ============================================
    // FINAL TEACHER ID
    //
    // Logged-in Teacher cannot change teacherId.
    // ============================================

    const teacherId =
      actorTeacherId ??
      data.teacherId ??
      homework.teacherId.toString();


    // ============================================
    // VALIDATE FINAL RELATIONS
    // ============================================

    await validateHomeworkRelations(
      schoolId,
      {
        sessionId,

        classId,

        sectionId,

        subjectId,

        teacherId,
      }
    );


    // ============================================
    // DATES
    // ============================================

    const assignedDate =
      data.assignedDate
        ? normalizeDate(
            data.assignedDate,
            "assignedDate"
          )
        : homework.assignedDate;


    const dueDate =
      data.dueDate
        ? normalizeDate(
            data.dueDate,
            "dueDate"
          )
        : homework.dueDate;


    if (
      dueDate <
      assignedDate
    ) {
      throw new Error(
        "Due date must be on or after the assigned date"
      );
    }


    // ============================================
    // UPDATE RELATIONS
    // ============================================

    homework.sessionId =
      new mongoose.Types.ObjectId(
        sessionId
      );


    homework.classId =
      new mongoose.Types.ObjectId(
        classId
      );


    homework.sectionId =
      new mongoose.Types.ObjectId(
        sectionId
      );


    homework.subjectId =
      new mongoose.Types.ObjectId(
        subjectId
      );


    homework.teacherId =
      new mongoose.Types.ObjectId(
        teacherId
      );


    // ============================================
    // TITLE
    // ============================================

    if (
      data.title !==
      undefined
    ) {

      if (
        !data.title.trim()
      ) {
        throw new Error(
          "Homework title is required"
        );
      }


      homework.title =
        data.title.trim();
    }


    // ============================================
    // DESCRIPTION
    // ============================================

    if (
      data.description !==
      undefined
    ) {

      if (
        !data.description.trim()
      ) {
        throw new Error(
          "Homework description is required"
        );
      }


      homework.description =
        data.description.trim();
    }


    // ============================================
    // DATES
    // ============================================

    homework.assignedDate =
      assignedDate;


    homework.dueDate =
      dueDate;


    // ============================================
    // STATUS
    // ============================================

    if (
      data.status !==
      undefined
    ) {
      homework.status =
        data.status;
    }


    // ============================================
    // ATTACHMENT
    // ============================================

    if (
      data.attachment ===
      null
    ) {

      homework.set(
        "attachment",
        undefined
      );

    } else if (
      data.attachment !==
      undefined
    ) {

      homework.attachment = {

        fileName:
          data.attachment.fileName,

        fileUrl:
          data.attachment.fileUrl,
      };


      if (
        data.attachment.fileType
      ) {
        homework.attachment.fileType =
          data.attachment.fileType;
      }


      if (
        data.attachment.fileSize !==
        undefined
      ) {
        homework.attachment.fileSize =
          data.attachment.fileSize;
      }
    }


    // ============================================
    // UPDATED BY
    // ============================================

    homework.updatedBy =
      new mongoose.Types.ObjectId(
        updatedBy
      );


    // ============================================
    // SAVE
    // ============================================

    await homework.save();


    return homework;

  };


// ============================================
// CHANGE HOMEWORK STATUS
//
// Teacher can change status only for own homework.
// ============================================

export const changeHomeworkStatus =
  async (
    schoolId: string,
    homeworkId: string,
    updatedBy: string,
    status: HomeworkStatus,
    actorTeacherId?: string
  ) => {

    validateObjectId(
      schoolId,
      "schoolId"
    );

    validateObjectId(
      homeworkId,
      "homeworkId"
    );

    validateObjectId(
      updatedBy,
      "updatedBy"
    );


    // ============================================
    // STATUS VALIDATION
    // ============================================

    if (
      !Object.values(
        HomeworkStatus
      ).includes(
        status
      )
    ) {
      throw new Error(
        "Invalid homework status"
      );
    }


    // ============================================
    // QUERY
    // ============================================

    const query:
      Record<
        string,
        unknown
      > = {

      _id:
        homeworkId,

      schoolId,

      isActive:
        true,
    };


    // ============================================
    // TEACHER SECURITY
    // ============================================

    if (
      actorTeacherId
    ) {

      validateObjectId(
        actorTeacherId,
        "teacherId"
      );


      query.teacherId =
        new mongoose.Types.ObjectId(
          actorTeacherId
        );
    }


    const homework =
      await Homework.findOne(
        query
      );


    if (
      !homework
    ) {
      throw new Error(
        "Homework not found"
      );
    }


    // ============================================
    // UPDATE
    // ============================================

    homework.status =
      status;


    homework.updatedBy =
      new mongoose.Types.ObjectId(
        updatedBy
      );


    await homework.save();


    return homework;

  };


// ============================================
// DELETE HOMEWORK
// SOFT DELETE
//
// Teacher can delete only own homework.
// ============================================

export const deleteHomework =
  async (
    schoolId: string,
    homeworkId: string,
    updatedBy: string,
    actorTeacherId?: string
  ) => {

    validateObjectId(
      schoolId,
      "schoolId"
    );

    validateObjectId(
      homeworkId,
      "homeworkId"
    );

    validateObjectId(
      updatedBy,
      "updatedBy"
    );


    // ============================================
    // QUERY
    // ============================================

    const query:
      Record<
        string,
        unknown
      > = {

      _id:
        homeworkId,

      schoolId,

      isActive:
        true,
    };


    // ============================================
    // TEACHER SECURITY
    // ============================================

    if (
      actorTeacherId
    ) {

      validateObjectId(
        actorTeacherId,
        "teacherId"
      );


      query.teacherId =
        new mongoose.Types.ObjectId(
          actorTeacherId
        );
    }


    const homework =
      await Homework.findOne(
        query
      );


    if (
      !homework
    ) {
      throw new Error(
        "Homework not found"
      );
    }


    // ============================================
    // SOFT DELETE
    // ============================================

    homework.isActive =
      false;


    homework.updatedBy =
      new mongoose.Types.ObjectId(
        updatedBy
      );


    await homework.save();


    return {
      message:
        "Homework deleted successfully",
    };

  };


// ============================================
// GET HOMEWORK STATS
//
// SCHOOL ADMIN:
// Whole school stats.
//
// TEACHER:
// Only logged-in teacher's stats.
// ============================================

export const getHomeworkStats =
  async (
    schoolId: string,
    actorTeacherId?: string
  ) => {

    validateObjectId(
      schoolId,
      "schoolId"
    );


    const schoolObjectId =
      new mongoose.Types.ObjectId(
        schoolId
      );


    // ============================================
    // BASE QUERY
    // ============================================

    const baseQuery:
      Record<
        string,
        unknown
      > = {

      schoolId:
        schoolObjectId,

      isActive:
        true,
    };


    // ============================================
    // TEACHER SECURITY
    // ============================================

    if (
      actorTeacherId
    ) {

      validateObjectId(
        actorTeacherId,
        "teacherId"
      );


      const teacher =
        await Teacher.findOne({
          _id:
            actorTeacherId,

          schoolId,

          isActive:
            true,
        })
          .select(
            "_id"
          )
          .lean();


      if (!teacher) {
        throw new Error(
          "Teacher profile not found or inactive"
        );
      }


      baseQuery.teacherId =
        new mongoose.Types.ObjectId(
          actorTeacherId
        );
    }


    const now =
      new Date();


    // ============================================
    // COUNTS
    // ============================================

    const [
      totalHomework,
      activeHomework,
      overdueHomework,
      draftHomework,
      closedHomework,
    ] = await Promise.all([

      Homework.countDocuments({
        ...baseQuery,
      }),


      Homework.countDocuments({
        ...baseQuery,

        status:
          HomeworkStatus.PUBLISHED,

        dueDate: {
          $gte:
            now,
        },
      }),


      Homework.countDocuments({
        ...baseQuery,

        status:
          HomeworkStatus.PUBLISHED,

        dueDate: {
          $lt:
            now,
        },
      }),


      Homework.countDocuments({
        ...baseQuery,

        status:
          HomeworkStatus.DRAFT,
      }),


      Homework.countDocuments({
        ...baseQuery,

        status:
          HomeworkStatus.CLOSED,
      }),
    ]);


    return {

      totalHomework,

      activeHomework,

      overdueHomework,

      draftHomework,

      closedHomework,
    };

  };


// ============================================
// STUDENT - MY HOMEWORK
//
// Student identity comes from JWT.
//
// Session/Class/Section are derived from
// active Student profile.
//
// Only PUBLISHED + active homework returned.
//
// Student's own submission is attached.
// ============================================

export const getMyHomeworks =
  async (
    schoolId: string,
    studentId: string
  ) => {

    validateObjectId(
      schoolId,
      "schoolId"
    );

    validateObjectId(
      studentId,
      "studentId"
    );


    // ============================================
    // STUDENT
    // ============================================

    const student =
      await Student.findOne({
        _id:
          studentId,

        schoolId,

        status:
          "ACTIVE",
      })
        .select(
          "_id name admissionNumber rollNumber sessionId classId sectionId"
        )
        .populate(
          "sessionId",
          "name startDate endDate isCurrent"
        )
        .populate(
          "classId",
          "name"
        )
        .populate(
          "sectionId",
          "name"
        )
        .lean();


    if (
      !student
    ) {
      throw new Error(
        "Student profile not found or inactive"
      );
    }


    // ============================================
    // POPULATED ID HELPER
    // ============================================

    const getId = (
      value: unknown
    ): string => {

      if (
        value &&
        typeof value ===
          "object" &&
        "_id" in value
      ) {

        return String(
          (
            value as {
              _id: unknown;
            }
          )._id
        );
      }


      return String(
        value
      );
    };


    // ============================================
    // STUDENT ACADEMIC IDS
    // ============================================

    const sessionId =
      getId(
        student.sessionId
      );


    const classId =
      getId(
        student.classId
      );


    const sectionId =
      getId(
        student.sectionId
      );


    // ============================================
    // FETCH PUBLISHED HOMEWORK
    // ============================================

    const homeworks =
      await Homework.find({

        schoolId:
          new mongoose.Types.ObjectId(
            schoolId
          ),

        sessionId:
          new mongoose.Types.ObjectId(
            sessionId
          ),

        classId:
          new mongoose.Types.ObjectId(
            classId
          ),

        sectionId:
          new mongoose.Types.ObjectId(
            sectionId
          ),

        status:
          HomeworkStatus.PUBLISHED,

        isActive:
          true,
      })
        .populate(
          "sessionId",
          "name startDate endDate isCurrent"
        )
        .populate(
          "classId",
          "name"
        )
        .populate(
          "sectionId",
          "name"
        )
        .populate(
          "subjectId",
          "name code subjectType"
        )
        .populate(
          "teacherId",
          "name employeeId"
        )
        .sort({
          assignedDate:
            -1,

          createdAt:
            -1,
        })
        .lean();


    // ============================================
    // HOMEWORK IDS
    // ============================================

    const homeworkIds =
      homeworks.map(
        (homework) =>
          homework._id
      );


    // ============================================
    // STUDENT SUBMISSIONS
    // ============================================

    const submissions =
      homeworkIds.length >
        0
        ? await HomeworkSubmission.find({

            schoolId:
              new mongoose.Types.ObjectId(
                schoolId
              ),

            studentId:
              new mongoose.Types.ObjectId(
                studentId
              ),

            homeworkId: {
              $in:
                homeworkIds,
            },

            isActive:
              true,
          })
            .select(
              "homeworkId submissionText attachment submissionStatus reviewStatus submittedAt remarks marks reviewedAt"
            )
            .lean()

        : [];


    // ============================================
    // SUBMISSION MAP
    // ============================================

    const submissionMap =
      new Map(
        submissions.map(
          (submission) => [

            submission
              .homeworkId
              .toString(),

            submission,
          ]
        )
      );


    const now =
      new Date();


    // ============================================
    // FINAL HOMEWORK
    // ============================================

    const homework =
      homeworks.map(
        (item) => {

          const submission =
            submissionMap.get(
              item._id.toString()
            ) ?? null;


          return {

            ...item,


            // ====================================
            // STUDENT HOMEWORK STATUS
            // ====================================

            studentHomeworkStatus:
              submission
                ? "SUBMITTED"

                : item.dueDate <
                    now
                  ? "OVERDUE"

                  : "PENDING",


            // ====================================
            // OWN SUBMISSION
            // ====================================

            submission,
          };
        }
      );


    // ============================================
    // RESPONSE
    // ============================================

    return {

      student,

      homework,
    };

  };