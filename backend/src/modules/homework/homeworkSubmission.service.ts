




// import mongoose from "mongoose";

// import {
//   Homework,
// } from "./homework.model";

// import {
//   HomeworkSubmission,
// } from "./homeworkSubmission.model";

// import {
//   HomeworkStatus,
// } from "./homework.types";

// import {
//   HomeworkReviewStatus,
//   HomeworkSubmissionStatus,
// } from "./homeworkSubmission.types";

// import type {
//   CreateHomeworkSubmissionData,
//   HomeworkSubmissionFilters,
//   ReviewHomeworkSubmissionData,
//   UpdateHomeworkSubmissionData,
// } from "./homeworkSubmission.types";

// import Student from "../students/student.model";


// // ======================================================
// // HELPER: VALIDATE OBJECT ID
// // ======================================================

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


// // ======================================================
// // HELPER: GET HOMEWORK FOR SCHOOL
// // ======================================================

// const getHomeworkForSchool =
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
//         _id: homeworkId,
//         schoolId,
//         isActive: true,
//       });


//     if (!homework) {
//       throw new Error(
//         "Homework not found"
//       );
//     }


//     return homework;
//   };


// // ======================================================
// // CREATE HOMEWORK SUBMISSION
// // ======================================================

// export const createHomeworkSubmission =
//   async (
//     schoolId: string,
//     data: CreateHomeworkSubmissionData
//   ) => {

//     validateObjectId(
//       schoolId,
//       "schoolId"
//     );

//     validateObjectId(
//       data.homeworkId,
//       "homeworkId"
//     );

//     validateObjectId(
//       data.studentId,
//       "studentId"
//     );


//     const homework =
//       await getHomeworkForSchool(
//         schoolId,
//         data.homeworkId
//       );


//     // --------------------------------------------------
//     // Only published homework can accept submission
//     // --------------------------------------------------

//     if (
//       homework.status !==
//       HomeworkStatus.PUBLISHED
//     ) {
//       throw new Error(
//         "Homework is not available for submission"
//       );
//     }


//     // ==================================================
//     // STUDENT VALIDATION
//     // ==================================================

//     const student =
//       await Student.findOne({
//         _id: data.studentId,
//         schoolId,

//         sessionId:
//           homework.sessionId,

//         classId:
//           homework.classId,

//         sectionId:
//           homework.sectionId,

//         status: "ACTIVE",
//       }).lean();


//     if (!student) {
//       throw new Error(
//         "Student does not belong to this homework class and section"
//       );
//     }


//     // --------------------------------------------------
//     // Duplicate submission check
//     // --------------------------------------------------

//     const existingSubmission =
//       await HomeworkSubmission.findOne({
//         schoolId,

//         homeworkId:
//           data.homeworkId,

//         studentId:
//           data.studentId,

//         isActive: true,
//       });


//     if (existingSubmission) {
//       throw new Error(
//         "Student has already submitted this homework"
//       );
//     }


//     // --------------------------------------------------
//     // At least text or attachment required
//     // --------------------------------------------------

//     if (
//       !data.submissionText?.trim() &&
//       !data.attachment
//     ) {
//       throw new Error(
//         "Submission text or attachment is required"
//       );
//     }


//     const submittedAt =
//       new Date();


//     // --------------------------------------------------
//     // Calculate submission status
//     // --------------------------------------------------

//     const submissionStatus =
//       submittedAt <=
//       homework.dueDate
//         ? HomeworkSubmissionStatus.SUBMITTED
//         : HomeworkSubmissionStatus.LATE;


//     const payload: {
//       schoolId:
//         mongoose.Types.ObjectId;

//       homeworkId:
//         mongoose.Types.ObjectId;

//       studentId:
//         mongoose.Types.ObjectId;

//       submissionStatus:
//         HomeworkSubmissionStatus;

//       reviewStatus:
//         HomeworkReviewStatus;

//       submittedAt:
//         Date;

//       isActive:
//         boolean;

//       submissionText?: string;

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

//       homeworkId:
//         new mongoose.Types.ObjectId(
//           data.homeworkId
//         ),

//       studentId:
//         new mongoose.Types.ObjectId(
//           data.studentId
//         ),

//       submissionStatus,

//       reviewStatus:
//         HomeworkReviewStatus.PENDING,

//       submittedAt,

//       isActive: true,
//     };


//     // --------------------------------------------------
//     // Submission text
//     // --------------------------------------------------

//     if (
//       data.submissionText?.trim()
//     ) {
//       payload.submissionText =
//         data.submissionText.trim();
//     }


//     // --------------------------------------------------
//     // Attachment
//     // --------------------------------------------------

//     if (data.attachment) {

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


//     const submission =
//       await HomeworkSubmission.create(
//         payload
//       );


//     return submission;
//   };


// // ======================================================
// // GET HOMEWORK SUBMISSIONS
// // ======================================================

// export const getHomeworkSubmissions =
//   async (
//     schoolId: string,
//     homeworkId: string,
//     filters:
//       HomeworkSubmissionFilters = {}
//   ) => {

//     validateObjectId(
//       schoolId,
//       "schoolId"
//     );

//     validateObjectId(
//       homeworkId,
//       "homeworkId"
//     );


//     await getHomeworkForSchool(
//       schoolId,
//       homeworkId
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
//       (page - 1) *
//       limit;


//     const query:
//       Record<
//         string,
//         unknown
//       > = {

//       schoolId:
//         new mongoose.Types.ObjectId(
//           schoolId
//         ),

//       homeworkId:
//         new mongoose.Types.ObjectId(
//           homeworkId
//         ),

//       isActive: true,
//     };


//     // --------------------------------------------------
//     // Student filter
//     // --------------------------------------------------

//     if (
//       filters.studentId
//     ) {

//       validateObjectId(
//         filters.studentId,
//         "studentId"
//       );


//       query.studentId =
//         new mongoose.Types.ObjectId(
//           filters.studentId
//         );
//     }


//     // --------------------------------------------------
//     // Submission status filter
//     // --------------------------------------------------

//     if (
//       filters.submissionStatus
//     ) {
//       query.submissionStatus =
//         filters.submissionStatus;
//     }


//     // --------------------------------------------------
//     // Review status filter
//     // --------------------------------------------------

//     if (
//       filters.reviewStatus
//     ) {
//       query.reviewStatus =
//         filters.reviewStatus;
//     }


//     // --------------------------------------------------
//     // Search
//     // --------------------------------------------------
//     //
//     // Student name / admission number search
//     // baad me aggregation based add karenge.
//     // --------------------------------------------------


//     const [
//       submissions,
//       total,
//     ] = await Promise.all([

//       HomeworkSubmission.find(
//         query
//       )
//         .populate(
//           "studentId"
//         )
//         .populate(
//           "reviewedBy",
//           "name email"
//         )
//         .sort({
//           submittedAt: -1,
//           createdAt: -1,
//         })
//         .skip(skip)
//         .limit(limit)
//         .lean(),


//       HomeworkSubmission.countDocuments(
//         query
//       ),

//     ]);


//     return {
//       submissions,

//       pagination: {
//         total,

//         page,

//         limit,

//         totalPages:
//           Math.ceil(
//             total / limit
//           ),
//       },
//     };
//   };


// // ======================================================
// // GET SUBMISSION BY ID
// // ======================================================

// export const getHomeworkSubmissionById =
//   async (
//     schoolId: string,
//     submissionId: string
//   ) => {

//     validateObjectId(
//       schoolId,
//       "schoolId"
//     );

//     validateObjectId(
//       submissionId,
//       "submissionId"
//     );


//     const submission =
//       await HomeworkSubmission.findOne({
//         _id: submissionId,

//         schoolId,

//         isActive: true,
//       })
//         .populate(
//           "homeworkId",
//           "title description assignedDate dueDate status"
//         )
//         .populate(
//           "studentId"
//         )
//         .populate(
//           "reviewedBy",
//           "name email"
//         )
//         .lean();


//     if (!submission) {
//       throw new Error(
//         "Homework submission not found"
//       );
//     }


//     return submission;
//   };


// // ======================================================
// // UPDATE HOMEWORK SUBMISSION
// // ======================================================

// export const updateHomeworkSubmission =
//   async (
//     schoolId: string,
//     submissionId: string,
//     data: UpdateHomeworkSubmissionData
//   ) => {

//     validateObjectId(
//       schoolId,
//       "schoolId"
//     );

//     validateObjectId(
//       submissionId,
//       "submissionId"
//     );


//     const submission =
//       await HomeworkSubmission.findOne({
//         _id: submissionId,

//         schoolId,

//         isActive: true,
//       });


//     if (!submission) {
//       throw new Error(
//         "Homework submission not found"
//       );
//     }


//     const homework =
//       await getHomeworkForSchool(
//         schoolId,
//         submission.homeworkId.toString()
//       );


//     // --------------------------------------------------
//     // Homework must be published
//     // --------------------------------------------------

//     if (
//       homework.status !==
//       HomeworkStatus.PUBLISHED
//     ) {
//       throw new Error(
//         "Closed or draft homework submission cannot be updated"
//       );
//     }


//     // --------------------------------------------------
//     // Reviewed submission cannot be edited
//     // --------------------------------------------------

//     if (
//       submission.reviewStatus ===
//       HomeworkReviewStatus.REVIEWED
//     ) {
//       throw new Error(
//         "Reviewed submission cannot be updated"
//       );
//     }


//     // --------------------------------------------------
//     // Update submission text
//     // --------------------------------------------------

//     if (
//       data.submissionText !==
//       undefined
//     ) {

//       const submissionText =
//         data.submissionText.trim();


//       if (submissionText) {

//         submission.submissionText =
//           submissionText;

//       } else {

//         submission.set(
//           "submissionText",
//           undefined
//         );
//       }
//     }


//     // --------------------------------------------------
//     // Update/remove attachment
//     // --------------------------------------------------

//     if (
//       data.attachment ===
//       null
//     ) {

//       submission.set(
//         "attachment",
//         undefined
//       );

//     } else if (
//       data.attachment !==
//       undefined
//     ) {

//       submission.attachment = {
//         fileName:
//           data.attachment.fileName,

//         fileUrl:
//           data.attachment.fileUrl,
//       };


//       if (
//         data.attachment.fileType
//       ) {
//         submission.attachment.fileType =
//           data.attachment.fileType;
//       }


//       if (
//         data.attachment.fileSize !==
//         undefined
//       ) {
//         submission.attachment.fileSize =
//           data.attachment.fileSize;
//       }
//     }


//     // --------------------------------------------------
//     // At least one submission content required
//     // --------------------------------------------------

//     if (
//       !submission.submissionText &&
//       !submission.attachment
//     ) {
//       throw new Error(
//         "Submission text or attachment is required"
//       );
//     }


//     // --------------------------------------------------
//     // Update submission time
//     // --------------------------------------------------

//     const submittedAt =
//       new Date();


//     submission.submittedAt =
//       submittedAt;


//     // --------------------------------------------------
//     // Recalculate late/on-time
//     // --------------------------------------------------

//     submission.submissionStatus =
//       submittedAt <=
//       homework.dueDate
//         ? HomeworkSubmissionStatus.SUBMITTED
//         : HomeworkSubmissionStatus.LATE;


//     // --------------------------------------------------
//     // Since student edited submission,
//     // review should become pending again
//     // --------------------------------------------------

//     submission.reviewStatus =
//       HomeworkReviewStatus.PENDING;


//     submission.set(
//       "reviewedBy",
//       undefined
//     );


//     submission.set(
//       "reviewedAt",
//       undefined
//     );


//     submission.set(
//       "remarks",
//       undefined
//     );


//     submission.set(
//       "marks",
//       undefined
//     );


//     await submission.save();


//     return submission;
//   };


// // ======================================================
// // REVIEW HOMEWORK SUBMISSION
// // ======================================================

// export const reviewHomeworkSubmission =
//   async (
//     schoolId: string,
//     submissionId: string,
//     reviewedBy: string,
//     data: ReviewHomeworkSubmissionData
//   ) => {

//     validateObjectId(
//       schoolId,
//       "schoolId"
//     );

//     validateObjectId(
//       submissionId,
//       "submissionId"
//     );

//     validateObjectId(
//       reviewedBy,
//       "reviewedBy"
//     );


//     const submission =
//       await HomeworkSubmission.findOne({
//         _id: submissionId,

//         schoolId,

//         isActive: true,
//       });


//     if (!submission) {
//       throw new Error(
//         "Homework submission not found"
//       );
//     }


//     // --------------------------------------------------
//     // Marks validation
//     // --------------------------------------------------

//     if (
//       data.marks !==
//         undefined &&
//       data.marks < 0
//     ) {
//       throw new Error(
//         "Marks cannot be negative"
//       );
//     }


//     // --------------------------------------------------
//     // Remarks
//     // --------------------------------------------------

//     if (
//       data.remarks !==
//       undefined
//     ) {

//       const remarks =
//         data.remarks.trim();


//       if (remarks) {

//         submission.remarks =
//           remarks;

//       } else {

//         submission.set(
//           "remarks",
//           undefined
//         );
//       }
//     }


//     // --------------------------------------------------
//     // Marks
//     // --------------------------------------------------

//     if (
//       data.marks !==
//       undefined
//     ) {

//       submission.marks =
//         data.marks;
//     }


//     // --------------------------------------------------
//     // Review information
//     // --------------------------------------------------

//     submission.reviewStatus =
//       HomeworkReviewStatus.REVIEWED;


//     submission.reviewedBy =
//       new mongoose.Types.ObjectId(
//         reviewedBy
//       );


//     submission.reviewedAt =
//       new Date();


//     await submission.save();


//     return submission;
//   };


// // ======================================================
// // DELETE HOMEWORK SUBMISSION
// // ======================================================

// export const deleteHomeworkSubmission =
//   async (
//     schoolId: string,
//     submissionId: string
//   ) => {

//     validateObjectId(
//       schoolId,
//       "schoolId"
//     );

//     validateObjectId(
//       submissionId,
//       "submissionId"
//     );


//     const submission =
//       await HomeworkSubmission.findOne({
//         _id: submissionId,

//         schoolId,

//         isActive: true,
//       });


//     if (!submission) {
//       throw new Error(
//         "Homework submission not found"
//       );
//     }


//     // --------------------------------------------------
//     // Reviewed submission cannot be deleted
//     // --------------------------------------------------

//     if (
//       submission.reviewStatus ===
//       HomeworkReviewStatus.REVIEWED
//     ) {
//       throw new Error(
//         "Reviewed submission cannot be deleted"
//       );
//     }


//     // --------------------------------------------------
//     // Soft delete
//     // --------------------------------------------------

//     submission.isActive =
//       false;


//     await submission.save();


//     return {
//       message:
//         "Homework submission deleted successfully",
//     };
//   };


// // ======================================================
// // GET HOMEWORK SUBMISSION STATS
// // ======================================================

// export const getHomeworkSubmissionStats =
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
//       await getHomeworkForSchool(
//         schoolId,
//         homeworkId
//       );


//     const schoolObjectId =
//       new mongoose.Types.ObjectId(
//         schoolId
//       );


//     const homeworkObjectId =
//       new mongoose.Types.ObjectId(
//         homeworkId
//       );


//     const baseQuery = {

//       schoolId:
//         schoolObjectId,

//       homeworkId:
//         homeworkObjectId,

//       isActive:
//         true,
//     };


//     const [
//       totalSubmitted,
//       onTimeSubmitted,
//       lateSubmitted,
//       reviewed,
//       pendingReview,
//       totalStudents,
//     ] = await Promise.all([

//       // Total actual submission records

//       HomeworkSubmission.countDocuments(
//         baseQuery
//       ),


//       // Submitted on time

//       HomeworkSubmission.countDocuments({
//         ...baseQuery,

//         submissionStatus:
//           HomeworkSubmissionStatus.SUBMITTED,
//       }),


//       // Submitted late

//       HomeworkSubmission.countDocuments({
//         ...baseQuery,

//         submissionStatus:
//           HomeworkSubmissionStatus.LATE,
//       }),


//       // Reviewed

//       HomeworkSubmission.countDocuments({
//         ...baseQuery,

//         reviewStatus:
//           HomeworkReviewStatus.REVIEWED,
//       }),


//       // Awaiting review

//       HomeworkSubmission.countDocuments({
//         ...baseQuery,

//         reviewStatus:
//           HomeworkReviewStatus.PENDING,
//       }),


//       // Total active students for homework
//       // session + class + section

//       Student.countDocuments({
//         schoolId,

//         sessionId:
//           homework.sessionId,

//         classId:
//           homework.classId,

//         sectionId:
//           homework.sectionId,

//         status: "ACTIVE",
//       }),

//     ]);


//     const pendingStudents =
//       Math.max(
//         totalStudents -
//           totalSubmitted,
//         0
//       );


//     return {

//       homeworkId:
//         homework._id,

//       totalStudents,

//       totalSubmitted,

//       pendingStudents,

//       onTimeSubmitted,

//       lateSubmitted,

//       reviewed,

//       pendingReview,
//     };
//   };


// // ======================================================
// // GET STUDENT SUBMISSION FOR A HOMEWORK
// // ======================================================

// export const getStudentHomeworkSubmission =
//   async (
//     schoolId: string,
//     homeworkId: string,
//     studentId: string
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
//       studentId,
//       "studentId"
//     );


//     const homework =
//       await getHomeworkForSchool(
//         schoolId,
//         homeworkId
//       );


//     // --------------------------------------------------
//     // Student must belong to homework
//     // --------------------------------------------------

//     const student =
//       await Student.findOne({
//         _id: studentId,

//         schoolId,

//         sessionId:
//           homework.sessionId,

//         classId:
//           homework.classId,

//         sectionId:
//           homework.sectionId,

//         status: "ACTIVE",
//       }).lean();


//     if (!student) {
//       throw new Error(
//         "Student does not belong to this homework class and section"
//       );
//     }


//     const submission =
//       await HomeworkSubmission.findOne({
//         schoolId,

//         homeworkId,

//         studentId,

//         isActive: true,
//       })
//         .populate(
//           "studentId"
//         )
//         .populate(
//           "reviewedBy",
//           "name email"
//         )
//         .lean();


//     return submission;
//   };









// import mongoose from "mongoose";

// import {
//   Homework,
// } from "./homework.model";

// import {
//   HomeworkSubmission,
// } from "./homeworkSubmission.model";

// import {
//   HomeworkStatus,
// } from "./homework.types";

// import {
//   HomeworkReviewStatus,
//   HomeworkSubmissionStatus,
// } from "./homeworkSubmission.types";

// import type {
//   CreateHomeworkSubmissionData,
//   HomeworkSubmissionFilters,
//   ReviewHomeworkSubmissionData,
//   UpdateHomeworkSubmissionData,
// } from "./homeworkSubmission.types";

// import Student from "../students/student.model";


// // ======================================================
// // HELPER: VALIDATE OBJECT ID
// // ======================================================

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


// // ======================================================
// // HELPER: GET HOMEWORK FOR SCHOOL
// // ======================================================

// const getHomeworkForSchool =
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
//         _id: homeworkId,
//         schoolId,
//         isActive: true,
//       });


//     if (!homework) {
//       throw new Error(
//         "Homework not found"
//       );
//     }


//     return homework;
//   };


// // ======================================================
// // CREATE HOMEWORK SUBMISSION
// // ======================================================

// export const createHomeworkSubmission =
//   async (
//     schoolId: string,
//     data: CreateHomeworkSubmissionData
//   ) => {

//     validateObjectId(
//       schoolId,
//       "schoolId"
//     );

//     validateObjectId(
//       data.homeworkId,
//       "homeworkId"
//     );

//     validateObjectId(
//       data.studentId,
//       "studentId"
//     );


//     const homework =
//       await getHomeworkForSchool(
//         schoolId,
//         data.homeworkId
//       );


//     // --------------------------------------------------
//     // Only published homework can accept submission
//     // --------------------------------------------------

//     if (
//       homework.status !==
//       HomeworkStatus.PUBLISHED
//     ) {
//       throw new Error(
//         "Homework is not available for submission"
//       );
//     }


//     // ==================================================
//     // STUDENT VALIDATION
//     // ==================================================

//     const student =
//       await Student.findOne({
//         _id: data.studentId,
//         schoolId,

//         sessionId:
//           homework.sessionId,

//         classId:
//           homework.classId,

//         sectionId:
//           homework.sectionId,

//         status: "ACTIVE",
//       }).lean();


//     if (!student) {
//       throw new Error(
//         "Student does not belong to this homework class and section"
//       );
//     }


//     // --------------------------------------------------
//     // Duplicate submission check
//     // --------------------------------------------------

//     const existingSubmission =
//       await HomeworkSubmission.findOne({
//         schoolId,

//         homeworkId:
//           data.homeworkId,

//         studentId:
//           data.studentId,

//         isActive: true,
//       });


//     if (existingSubmission) {
//       throw new Error(
//         "Student has already submitted this homework"
//       );
//     }


//     // --------------------------------------------------
//     // At least text or attachment required
//     // --------------------------------------------------

//     if (
//       !data.submissionText?.trim() &&
//       !data.attachment
//     ) {
//       throw new Error(
//         "Submission text or attachment is required"
//       );
//     }


//     const submittedAt =
//       new Date();


//     // --------------------------------------------------
//     // Calculate submission status
//     // --------------------------------------------------

//     const submissionStatus =
//       submittedAt <=
//       homework.dueDate
//         ? HomeworkSubmissionStatus.SUBMITTED
//         : HomeworkSubmissionStatus.LATE;


//     const payload: {
//       schoolId:
//         mongoose.Types.ObjectId;

//       homeworkId:
//         mongoose.Types.ObjectId;

//       studentId:
//         mongoose.Types.ObjectId;

//       submissionStatus:
//         HomeworkSubmissionStatus;

//       reviewStatus:
//         HomeworkReviewStatus;

//       submittedAt:
//         Date;

//       isActive:
//         boolean;

//       submissionText?: string;

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

//       homeworkId:
//         new mongoose.Types.ObjectId(
//           data.homeworkId
//         ),

//       studentId:
//         new mongoose.Types.ObjectId(
//           data.studentId
//         ),

//       submissionStatus,

//       reviewStatus:
//         HomeworkReviewStatus.PENDING,

//       submittedAt,

//       isActive: true,
//     };


//     // --------------------------------------------------
//     // Submission text
//     // --------------------------------------------------

//     if (
//       data.submissionText?.trim()
//     ) {
//       payload.submissionText =
//         data.submissionText.trim();
//     }


//     // --------------------------------------------------
//     // Attachment
//     // --------------------------------------------------

//     if (data.attachment) {

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


//     const submission =
//       await HomeworkSubmission.create(
//         payload
//       );


//     return submission;
//   };


// // ======================================================
// // GET HOMEWORK SUBMISSIONS
// // ======================================================

// export const getHomeworkSubmissions =
//   async (
//     schoolId: string,
//     homeworkId: string,
//     filters:
//       HomeworkSubmissionFilters = {}
//   ) => {

//     validateObjectId(
//       schoolId,
//       "schoolId"
//     );

//     validateObjectId(
//       homeworkId,
//       "homeworkId"
//     );


//     await getHomeworkForSchool(
//       schoolId,
//       homeworkId
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
//       (page - 1) *
//       limit;


//     const query:
//       Record<
//         string,
//         unknown
//       > = {

//       schoolId:
//         new mongoose.Types.ObjectId(
//           schoolId
//         ),

//       homeworkId:
//         new mongoose.Types.ObjectId(
//           homeworkId
//         ),

//       isActive: true,
//     };


//     // --------------------------------------------------
//     // Student filter
//     // --------------------------------------------------

//     if (
//       filters.studentId
//     ) {

//       validateObjectId(
//         filters.studentId,
//         "studentId"
//       );


//       query.studentId =
//         new mongoose.Types.ObjectId(
//           filters.studentId
//         );
//     }


//     // --------------------------------------------------
//     // Submission status filter
//     // --------------------------------------------------

//     if (
//       filters.submissionStatus
//     ) {
//       query.submissionStatus =
//         filters.submissionStatus;
//     }


//     // --------------------------------------------------
//     // Review status filter
//     // --------------------------------------------------

//     if (
//       filters.reviewStatus
//     ) {
//       query.reviewStatus =
//         filters.reviewStatus;
//     }


//     // --------------------------------------------------
//     // Search
//     // --------------------------------------------------
//     //
//     // Student name / admission number search
//     // baad me aggregation based add karenge.
//     // --------------------------------------------------


//     const [
//       submissions,
//       total,
//     ] = await Promise.all([

//       HomeworkSubmission.find(
//         query
//       )
//         .populate(
//           "studentId"
//         )
//         .populate(
//           "reviewedBy",
//           "name email"
//         )
//         .sort({
//           submittedAt: -1,
//           createdAt: -1,
//         })
//         .skip(skip)
//         .limit(limit)
//         .lean(),


//       HomeworkSubmission.countDocuments(
//         query
//       ),

//     ]);


//     return {
//       submissions,

//       pagination: {
//         total,

//         page,

//         limit,

//         totalPages:
//           Math.ceil(
//             total / limit
//           ),
//       },
//     };
//   };


// // ======================================================
// // GET SUBMISSION BY ID
// // ======================================================

// export const getHomeworkSubmissionById =
//   async (
//     schoolId: string,
//     submissionId: string
//   ) => {

//     validateObjectId(
//       schoolId,
//       "schoolId"
//     );

//     validateObjectId(
//       submissionId,
//       "submissionId"
//     );


//     const submission =
//       await HomeworkSubmission.findOne({
//         _id: submissionId,

//         schoolId,

//         isActive: true,
//       })
//         .populate(
//           "homeworkId",
//           "title description assignedDate dueDate status"
//         )
//         .populate(
//           "studentId"
//         )
//         .populate(
//           "reviewedBy",
//           "name email"
//         )
//         .lean();


//     if (!submission) {
//       throw new Error(
//         "Homework submission not found"
//       );
//     }


//     return submission;
//   };


// // ======================================================
// // UPDATE HOMEWORK SUBMISSION
// // ======================================================

// export const updateHomeworkSubmission =
//   async (
//     schoolId: string,
//     submissionId: string,
//     data: UpdateHomeworkSubmissionData
//   ) => {

//     validateObjectId(
//       schoolId,
//       "schoolId"
//     );

//     validateObjectId(
//       submissionId,
//       "submissionId"
//     );


//     const submission =
//       await HomeworkSubmission.findOne({
//         _id: submissionId,

//         schoolId,

//         isActive: true,
//       });


//     if (!submission) {
//       throw new Error(
//         "Homework submission not found"
//       );
//     }


//     const homework =
//       await getHomeworkForSchool(
//         schoolId,
//         submission.homeworkId.toString()
//       );


//     // --------------------------------------------------
//     // Homework must be published
//     // --------------------------------------------------

//     if (
//       homework.status !==
//       HomeworkStatus.PUBLISHED
//     ) {
//       throw new Error(
//         "Closed or draft homework submission cannot be updated"
//       );
//     }


//     // --------------------------------------------------
//     // Reviewed submission cannot be edited
//     // --------------------------------------------------

//     if (
//       submission.reviewStatus ===
//       HomeworkReviewStatus.REVIEWED
//     ) {
//       throw new Error(
//         "Reviewed submission cannot be updated"
//       );
//     }


//     // --------------------------------------------------
//     // Update submission text
//     // --------------------------------------------------

//     if (
//       data.submissionText !==
//       undefined
//     ) {

//       const submissionText =
//         data.submissionText.trim();


//       if (submissionText) {

//         submission.submissionText =
//           submissionText;

//       } else {

//         submission.set(
//           "submissionText",
//           undefined
//         );
//       }
//     }


//     // --------------------------------------------------
//     // Update/remove attachment
//     // --------------------------------------------------

//     if (
//       data.attachment ===
//       null
//     ) {

//       submission.set(
//         "attachment",
//         undefined
//       );

//     } else if (
//       data.attachment !==
//       undefined
//     ) {

//       submission.attachment = {
//         fileName:
//           data.attachment.fileName,

//         fileUrl:
//           data.attachment.fileUrl,
//       };


//       if (
//         data.attachment.fileType
//       ) {
//         submission.attachment.fileType =
//           data.attachment.fileType;
//       }


//       if (
//         data.attachment.fileSize !==
//         undefined
//       ) {
//         submission.attachment.fileSize =
//           data.attachment.fileSize;
//       }
//     }


//     // --------------------------------------------------
//     // At least one submission content required
//     // --------------------------------------------------

//     if (
//       !submission.submissionText &&
//       !submission.attachment
//     ) {
//       throw new Error(
//         "Submission text or attachment is required"
//       );
//     }


//     // --------------------------------------------------
//     // Update submission time
//     // --------------------------------------------------

//     const submittedAt =
//       new Date();


//     submission.submittedAt =
//       submittedAt;


//     // --------------------------------------------------
//     // Recalculate late/on-time
//     // --------------------------------------------------

//     submission.submissionStatus =
//       submittedAt <=
//       homework.dueDate
//         ? HomeworkSubmissionStatus.SUBMITTED
//         : HomeworkSubmissionStatus.LATE;


//     // --------------------------------------------------
//     // Since student edited submission,
//     // review should become pending again
//     // --------------------------------------------------

//     submission.reviewStatus =
//       HomeworkReviewStatus.PENDING;


//     submission.set(
//       "reviewedBy",
//       undefined
//     );


//     submission.set(
//       "reviewedAt",
//       undefined
//     );


//     submission.set(
//       "remarks",
//       undefined
//     );


//     submission.set(
//       "marks",
//       undefined
//     );


//     await submission.save();


//     return submission;
//   };


// // ======================================================
// // REVIEW HOMEWORK SUBMISSION
// // ======================================================

// export const reviewHomeworkSubmission =
//   async (
//     schoolId: string,
//     submissionId: string,
//     reviewedBy: string,
//     data: ReviewHomeworkSubmissionData
//   ) => {

//     validateObjectId(
//       schoolId,
//       "schoolId"
//     );

//     validateObjectId(
//       submissionId,
//       "submissionId"
//     );

//     validateObjectId(
//       reviewedBy,
//       "reviewedBy"
//     );


//     const submission =
//       await HomeworkSubmission.findOne({
//         _id: submissionId,

//         schoolId,

//         isActive: true,
//       });


//     if (!submission) {
//       throw new Error(
//         "Homework submission not found"
//       );
//     }


//     // --------------------------------------------------
//     // Marks validation
//     // --------------------------------------------------

//     if (
//       data.marks !==
//         undefined &&
//       data.marks < 0
//     ) {
//       throw new Error(
//         "Marks cannot be negative"
//       );
//     }


//     // --------------------------------------------------
//     // Remarks
//     // --------------------------------------------------

//     if (
//       data.remarks !==
//       undefined
//     ) {

//       const remarks =
//         data.remarks.trim();


//       if (remarks) {

//         submission.remarks =
//           remarks;

//       } else {

//         submission.set(
//           "remarks",
//           undefined
//         );
//       }
//     }


//     // --------------------------------------------------
//     // Marks
//     // --------------------------------------------------

//     if (
//       data.marks !==
//       undefined
//     ) {

//       submission.marks =
//         data.marks;
//     }


//     // --------------------------------------------------
//     // Review information
//     // --------------------------------------------------

//     submission.reviewStatus =
//       HomeworkReviewStatus.REVIEWED;


//     submission.reviewedBy =
//       new mongoose.Types.ObjectId(
//         reviewedBy
//       );


//     submission.reviewedAt =
//       new Date();


//     await submission.save();


//     return submission;
//   };


// // ======================================================
// // DELETE HOMEWORK SUBMISSION
// // ======================================================

// export const deleteHomeworkSubmission =
//   async (
//     schoolId: string,
//     submissionId: string
//   ) => {

//     validateObjectId(
//       schoolId,
//       "schoolId"
//     );

//     validateObjectId(
//       submissionId,
//       "submissionId"
//     );


//     const submission =
//       await HomeworkSubmission.findOne({
//         _id: submissionId,

//         schoolId,

//         isActive: true,
//       });


//     if (!submission) {
//       throw new Error(
//         "Homework submission not found"
//       );
//     }


//     // --------------------------------------------------
//     // Reviewed submission cannot be deleted
//     // --------------------------------------------------

//     if (
//       submission.reviewStatus ===
//       HomeworkReviewStatus.REVIEWED
//     ) {
//       throw new Error(
//         "Reviewed submission cannot be deleted"
//       );
//     }


//     // --------------------------------------------------
//     // Soft delete
//     // --------------------------------------------------

//     submission.isActive =
//       false;


//     await submission.save();


//     return {
//       message:
//         "Homework submission deleted successfully",
//     };
//   };


// // ======================================================
// // GET HOMEWORK SUBMISSION STATS
// // ======================================================

// export const getHomeworkSubmissionStats =
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
//       await getHomeworkForSchool(
//         schoolId,
//         homeworkId
//       );


//     const schoolObjectId =
//       new mongoose.Types.ObjectId(
//         schoolId
//       );


//     const homeworkObjectId =
//       new mongoose.Types.ObjectId(
//         homeworkId
//       );


//     const baseQuery = {

//       schoolId:
//         schoolObjectId,

//       homeworkId:
//         homeworkObjectId,

//       isActive:
//         true,
//     };


//     const [
//       totalSubmitted,
//       onTimeSubmitted,
//       lateSubmitted,
//       reviewed,
//       pendingReview,
//       totalStudents,
//     ] = await Promise.all([

//       // Total actual submission records

//       HomeworkSubmission.countDocuments(
//         baseQuery
//       ),


//       // Submitted on time

//       HomeworkSubmission.countDocuments({
//         ...baseQuery,

//         submissionStatus:
//           HomeworkSubmissionStatus.SUBMITTED,
//       }),


//       // Submitted late

//       HomeworkSubmission.countDocuments({
//         ...baseQuery,

//         submissionStatus:
//           HomeworkSubmissionStatus.LATE,
//       }),


//       // Reviewed

//       HomeworkSubmission.countDocuments({
//         ...baseQuery,

//         reviewStatus:
//           HomeworkReviewStatus.REVIEWED,
//       }),


//       // Awaiting review

//       HomeworkSubmission.countDocuments({
//         ...baseQuery,

//         reviewStatus:
//           HomeworkReviewStatus.PENDING,
//       }),


//       // Total active students for homework
//       // session + class + section

//       Student.countDocuments({
//         schoolId,

//         sessionId:
//           homework.sessionId,

//         classId:
//           homework.classId,

//         sectionId:
//           homework.sectionId,

//         status: "ACTIVE",
//       }),

//     ]);


//     const pendingStudents =
//       Math.max(
//         totalStudents -
//           totalSubmitted,
//         0
//       );


//     return {

//       homeworkId:
//         homework._id,

//       totalStudents,

//       totalSubmitted,

//       pendingStudents,

//       onTimeSubmitted,

//       lateSubmitted,

//       reviewed,

//       pendingReview,
//     };
//   };


// // ======================================================
// // GET STUDENT SUBMISSION FOR A HOMEWORK
// // ======================================================

// export const getStudentHomeworkSubmission =
//   async (
//     schoolId: string,
//     homeworkId: string,
//     studentId: string
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
//       studentId,
//       "studentId"
//     );


//     const homework =
//       await getHomeworkForSchool(
//         schoolId,
//         homeworkId
//       );


//     // --------------------------------------------------
//     // Student must belong to homework
//     // --------------------------------------------------

//     const student =
//       await Student.findOne({
//         _id: studentId,

//         schoolId,

//         sessionId:
//           homework.sessionId,

//         classId:
//           homework.classId,

//         sectionId:
//           homework.sectionId,

//         status: "ACTIVE",
//       }).lean();


//     if (!student) {
//       throw new Error(
//         "Student does not belong to this homework class and section"
//       );
//     }


//     const submission =
//       await HomeworkSubmission.findOne({
//         schoolId,

//         homeworkId,

//         studentId,

//         isActive: true,
//       })
//         .populate(
//           "studentId"
//         )
//         .populate(
//           "reviewedBy",
//           "name email"
//         )
//         .lean();


//     return submission;
//   };

// // ======================================================
// // STUDENT - CREATE MY HOMEWORK SUBMISSION
// //
// // studentId is always taken from JWT.
// // ======================================================

// export const createMyHomeworkSubmission =
//   async (
//     schoolId: string,
//     studentId: string,
//     data: Omit<
//       CreateHomeworkSubmissionData,
//       "studentId"
//     >
//   ) => {

//     validateObjectId(
//       schoolId,
//       "schoolId"
//     );

//     validateObjectId(
//       studentId,
//       "studentId"
//     );


//     return createHomeworkSubmission(
//       schoolId,
//       {
//         homeworkId:
//           data.homeworkId,

//         studentId,

//         ...(data.submissionText !==
//         undefined
//           ? {
//               submissionText:
//                 data.submissionText,
//             }
//           : {}),

//         ...(data.attachment !==
//         undefined
//           ? {
//               attachment:
//                 data.attachment,
//             }
//           : {}),
//       }
//     );
//   };


// // ======================================================
// // STUDENT - GET MY HOMEWORK SUBMISSIONS
// // ======================================================

// export const getMyHomeworkSubmissions =
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
//         .lean();


//     if (!student) {
//       throw new Error(
//         "Student profile not found or inactive"
//       );
//     }


//     const submissions =
//       await HomeworkSubmission.find({
//         schoolId:
//           new mongoose.Types.ObjectId(
//             schoolId
//           ),

//         studentId:
//           new mongoose.Types.ObjectId(
//             studentId
//           ),

//         isActive:
//           true,
//       })
//         .populate({
//           path:
//             "homeworkId",

//           match: {
//             isActive:
//               true,
//           },

//           select:
//             "title description assignedDate dueDate status sessionId classId sectionId subjectId teacherId attachment",

//           populate: [
//             {
//               path:
//                 "subjectId",

//               select:
//                 "name code subjectType",
//             },
//             {
//               path:
//                 "teacherId",

//               select:
//                 "name employeeId",
//             },
//           ],
//         })
//         .populate(
//           "reviewedBy",
//           "name email"
//         )
//         .sort({
//           submittedAt: -1,
//           createdAt: -1,
//         })
//         .lean();


//     return submissions.filter(
//       (submission) =>
//         submission.homeworkId
//     );
//   };


// // ======================================================
// // STUDENT - UPDATE MY HOMEWORK SUBMISSION
// //
// // Ownership is verified before using the existing
// // updateHomeworkSubmission service.
// // ======================================================

// export const updateMyHomeworkSubmission =
//   async (
//     schoolId: string,
//     studentId: string,
//     submissionId: string,
//     data:
//       UpdateHomeworkSubmissionData
//   ) => {

//     validateObjectId(
//       schoolId,
//       "schoolId"
//     );

//     validateObjectId(
//       studentId,
//       "studentId"
//     );

//     validateObjectId(
//       submissionId,
//       "submissionId"
//     );


//     const ownedSubmission =
//       await HomeworkSubmission.findOne({
//         _id:
//           submissionId,

//         schoolId,

//         studentId,

//         isActive:
//           true,
//       })
//         .select(
//           "_id"
//         )
//         .lean();


//     if (!ownedSubmission) {
//       throw new Error(
//         "Homework submission not found"
//       );
//     }


//     return updateHomeworkSubmission(
//       schoolId,
//       submissionId,
//       data
//     );
//   };







import mongoose from "mongoose";

import {
  Homework,
} from "./homework.model";

import {
  HomeworkSubmission,
} from "./homeworkSubmission.model";

import {
  HomeworkStatus,
} from "./homework.types";

import {
  HomeworkReviewStatus,
  HomeworkSubmissionMode,
  HomeworkSubmissionStatus,
} from "./homeworkSubmission.types";

import type {
  BulkHomeworkReviewData,
  CreateHomeworkSubmissionData,
  HomeworkSubmissionFilters,
  OfflineHomeworkReviewData,
  ReviewHomeworkSubmissionData,
  UpdateHomeworkSubmissionData,
} from "./homeworkSubmission.types";

import Student from "../students/student.model";

import {
  Teacher,
} from "../teachers/teacher.model";

import {
  SubjectAssignment,
} from "../academic/subjectAssignments/subjectAssignment.model";


// ======================================================
// HELPER: VALIDATE OBJECT ID
// ======================================================

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


// ======================================================
// HELPER: VALID REVIEW STATUS
// ======================================================

const validateReviewStatus = (
  reviewStatus:
    HomeworkReviewStatus
) => {
  const allowedStatuses:
    HomeworkReviewStatus[] = [
      HomeworkReviewStatus.COMPLETED,
      HomeworkReviewStatus.INCOMPLETE,
      HomeworkReviewStatus.REDO_REQUIRED,
    ];

  if (
    !allowedStatuses.includes(
      reviewStatus
    )
  ) {
    throw new Error(
      "Review status must be COMPLETED, INCOMPLETE or REDO_REQUIRED"
    );
  }
};


// ======================================================
// HELPER: VALIDATE TEACHER IDENTITY
// ======================================================

const validateTeacherIdentity =
  async (
    schoolId: string,
    teacherId: string,
    userId?: string
  ) => {
    validateObjectId(
      schoolId,
      "schoolId"
    );

    validateObjectId(
      teacherId,
      "teacherId"
    );

    const query:
      Record<
        string,
        unknown
      > = {
        _id:
          teacherId,

        schoolId,

        isActive:
          true,
      };

    if (userId) {
      validateObjectId(
        userId,
        "userId"
      );

      query.userId =
        userId;
    }

    const teacher =
      await Teacher.findOne(
        query
      )
        .select(
          "_id userId schoolId employeeId name email isActive"
        )
        .lean();

    if (!teacher) {
      throw new Error(
        "Teacher profile not found or inactive"
      );
    }

    return teacher;
  };


// ======================================================
// HELPER: GET HOMEWORK FOR SCHOOL
//
// SCHOOL_ADMIN:
// school scoped.
//
// TEACHER:
// teacher must own homework
// + active SubjectAssignment required.
// ======================================================

const getHomeworkForSchool =
  async (
    schoolId: string,
    homeworkId: string,
    actorTeacherId?: string,
    actorUserId?: string
  ) => {
    validateObjectId(
      schoolId,
      "schoolId"
    );

    validateObjectId(
      homeworkId,
      "homeworkId"
    );

    if (actorTeacherId) {
      await validateTeacherIdentity(
        schoolId,
        actorTeacherId,
        actorUserId
      );
    }

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

    if (actorTeacherId) {
      homeworkQuery.teacherId =
        new mongoose.Types.ObjectId(
          actorTeacherId
        );
    }

    const homework =
      await Homework.findOne(
        homeworkQuery
      );

    if (!homework) {
      throw new Error(
        "Homework not found"
      );
    }

    if (actorTeacherId) {
      const assignment =
        await SubjectAssignment.findOne({
          schoolId:
            new mongoose.Types.ObjectId(
              schoolId
            ),

          sessionId:
            homework.sessionId,

          classId:
            homework.classId,

          sectionId:
            homework.sectionId,

          subjectId:
            homework.subjectId,

          teacherId:
            new mongoose.Types.ObjectId(
              actorTeacherId
            ),

          isActive:
            true,
        })
          .select("_id")
          .lean();

      if (!assignment) {
        throw new Error(
          "Teacher is not assigned to this homework subject, class and section"
        );
      }
    }

    return homework;
  };


// ======================================================
// HELPER: VALIDATE STUDENT FOR HOMEWORK
// ======================================================

const validateStudentForHomework =
  async (
    schoolId: string,
    studentId: string,
    homework: {
      sessionId: mongoose.Types.ObjectId;
      classId: mongoose.Types.ObjectId;
      sectionId: mongoose.Types.ObjectId;
    }
  ) => {
    validateObjectId(
      studentId,
      "studentId"
    );

    const student =
      await Student.findOne({
        _id:
          studentId,

        schoolId,

        sessionId:
          homework.sessionId,

        classId:
          homework.classId,

        sectionId:
          homework.sectionId,

        status:
          "ACTIVE",
      })
        .select(
          "_id name admissionNumber rollNumber"
        )
        .lean();

    if (!student) {
      throw new Error(
        "Student does not belong to this homework class and section"
      );
    }

    return student;
  };


// ======================================================
// CREATE HOMEWORK SUBMISSION
// ONLINE SUBMISSION
// ======================================================

export const createHomeworkSubmission =
  async (
    schoolId: string,
    data:
      CreateHomeworkSubmissionData
  ) => {
    validateObjectId(
      schoolId,
      "schoolId"
    );

    validateObjectId(
      data.homeworkId,
      "homeworkId"
    );

    validateObjectId(
      data.studentId,
      "studentId"
    );

    const homework =
      await getHomeworkForSchool(
        schoolId,
        data.homeworkId
      );

    if (
      homework.status !==
      HomeworkStatus.PUBLISHED
    ) {
      throw new Error(
        "Homework is not available for submission"
      );
    }

    await validateStudentForHomework(
      schoolId,
      data.studentId,
      homework
    );

    const existingSubmission =
      await HomeworkSubmission.findOne({
        schoolId,

        homeworkId:
          data.homeworkId,

        studentId:
          data.studentId,
      });

    if (
      existingSubmission &&
      existingSubmission.isActive
    ) {
      throw new Error(
        "Student has already submitted this homework"
      );
    }

    if (
      !data.submissionText?.trim() &&
      !data.attachment
    ) {
      throw new Error(
        "Submission text or attachment is required"
      );
    }

    const submittedAt =
      new Date();

    const submissionStatus =
      submittedAt <=
      homework.dueDate
        ? HomeworkSubmissionStatus.SUBMITTED
        : HomeworkSubmissionStatus.LATE;

    const payload: {
      schoolId:
        mongoose.Types.ObjectId;

      homeworkId:
        mongoose.Types.ObjectId;

      studentId:
        mongoose.Types.ObjectId;

      submissionMode:
        HomeworkSubmissionMode;

      submissionStatus:
        HomeworkSubmissionStatus;

      reviewStatus:
        HomeworkReviewStatus;

      submittedAt:
        Date;

      isActive:
        boolean;

      submissionText?: string;

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

      homeworkId:
        new mongoose.Types.ObjectId(
          data.homeworkId
        ),

      studentId:
        new mongoose.Types.ObjectId(
          data.studentId
        ),

      submissionMode:
        HomeworkSubmissionMode.ONLINE,

      submissionStatus,

      reviewStatus:
        HomeworkReviewStatus.PENDING,

      submittedAt,

      isActive:
        true,
    };

    if (
      data.submissionText?.trim()
    ) {
      payload.submissionText =
        data.submissionText.trim();
    }

    if (data.attachment) {
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

    // Soft-deleted old record may still exist because
    // unique index is schoolId + homeworkId + studentId.
    if (existingSubmission) {
      existingSubmission.isActive =
        true;

      existingSubmission.submissionMode =
        HomeworkSubmissionMode.ONLINE;

      existingSubmission.submissionStatus =
        submissionStatus;

      existingSubmission.reviewStatus =
        HomeworkReviewStatus.PENDING;

      existingSubmission.submittedAt =
        submittedAt;

      existingSubmission.set(
        "reviewedBy",
        undefined
      );

      existingSubmission.set(
        "reviewedAt",
        undefined
      );

      existingSubmission.set(
        "remarks",
        undefined
      );

      existingSubmission.set(
        "marks",
        undefined
      );

      if (
        payload.submissionText !==
        undefined
      ) {
        existingSubmission.submissionText =
          payload.submissionText;
      } else {
        existingSubmission.set(
          "submissionText",
          undefined
        );
      }

      if (
        payload.attachment
      ) {
        existingSubmission.attachment =
          payload.attachment;
      } else {
        existingSubmission.set(
          "attachment",
          undefined
        );
      }

      await existingSubmission.save();

      return existingSubmission;
    }

    return HomeworkSubmission.create(
      payload
    );
  };


// ======================================================
// GET HOMEWORK SUBMISSIONS
// ======================================================

export const getHomeworkSubmissions =
  async (
    schoolId: string,
    homeworkId: string,
    filters:
      HomeworkSubmissionFilters = {},
    actorTeacherId?: string,
    actorUserId?: string
  ) => {
    validateObjectId(
      schoolId,
      "schoolId"
    );

    validateObjectId(
      homeworkId,
      "homeworkId"
    );

    await getHomeworkForSchool(
      schoolId,
      homeworkId,
      actorTeacherId,
      actorUserId
    );

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
      (page - 1) *
      limit;

    const query:
      Record<
        string,
        unknown
      > = {
        schoolId:
          new mongoose.Types.ObjectId(
            schoolId
          ),

        homeworkId:
          new mongoose.Types.ObjectId(
            homeworkId
          ),

        isActive:
          true,
      };

    if (
      filters.studentId
    ) {
      validateObjectId(
        filters.studentId,
        "studentId"
      );

      query.studentId =
        new mongoose.Types.ObjectId(
          filters.studentId
        );
    }

    if (
      filters.submissionMode
    ) {
      query.submissionMode =
        filters.submissionMode;
    }

    if (
      filters.submissionStatus
    ) {
      query.submissionStatus =
        filters.submissionStatus;
    }

    if (
      filters.reviewStatus
    ) {
      query.reviewStatus =
        filters.reviewStatus;
    }

    const [
      submissions,
      total,
    ] = await Promise.all([
      HomeworkSubmission.find(
        query
      )
        .populate(
          "studentId"
        )
        .populate(
          "reviewedBy",
          "name email"
        )
        .sort({
          submittedAt: -1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      HomeworkSubmission.countDocuments(
        query
      ),
    ]);

    return {
      submissions,

      pagination: {
        total,
        page,
        limit,

        totalPages:
          Math.ceil(
            total / limit
          ),
      },
    };
  };


// ======================================================
// GET SUBMISSION BY ID
// ======================================================

export const getHomeworkSubmissionById =
  async (
    schoolId: string,
    submissionId: string,
    actorTeacherId?: string,
    actorUserId?: string
  ) => {
    validateObjectId(
      schoolId,
      "schoolId"
    );

    validateObjectId(
      submissionId,
      "submissionId"
    );

    const submission =
      await HomeworkSubmission.findOne({
        _id:
          submissionId,

        schoolId,

        isActive:
          true,
      });

    if (!submission) {
      throw new Error(
        "Homework submission not found"
      );
    }

    if (actorTeacherId) {
      await getHomeworkForSchool(
        schoolId,
        submission.homeworkId.toString(),
        actorTeacherId,
        actorUserId
      );
    }

    const populatedSubmission =
      await HomeworkSubmission.findOne({
        _id:
          submissionId,

        schoolId,

        isActive:
          true,
      })
        .populate(
          "homeworkId",
          "title description assignedDate dueDate status sessionId classId sectionId subjectId teacherId"
        )
        .populate(
          "studentId"
        )
        .populate(
          "reviewedBy",
          "name email"
        )
        .lean();

    if (!populatedSubmission) {
      throw new Error(
        "Homework submission not found"
      );
    }

    return populatedSubmission;
  };


// ======================================================
// UPDATE HOMEWORK SUBMISSION
//
// COMPLETED / INCOMPLETE / legacy REVIEWED:
// locked.
//
// REDO_REQUIRED:
// student may correct and resubmit.
// ======================================================

export const updateHomeworkSubmission =
  async (
    schoolId: string,
    submissionId: string,
    data:
      UpdateHomeworkSubmissionData
  ) => {
    validateObjectId(
      schoolId,
      "schoolId"
    );

    validateObjectId(
      submissionId,
      "submissionId"
    );

    const submission =
      await HomeworkSubmission.findOne({
        _id:
          submissionId,

        schoolId,

        isActive:
          true,
      });

    if (!submission) {
      throw new Error(
        "Homework submission not found"
      );
    }

    if (
      submission.submissionMode ===
      HomeworkSubmissionMode.OFFLINE
    ) {
      throw new Error(
        "Offline homework record cannot be edited as an online submission"
      );
    }

    const homework =
      await getHomeworkForSchool(
        schoolId,
        submission.homeworkId.toString()
      );

    if (
      homework.status !==
      HomeworkStatus.PUBLISHED
    ) {
      throw new Error(
        "Closed or draft homework submission cannot be updated"
      );
    }

    if (
      submission.reviewStatus ===
        HomeworkReviewStatus.COMPLETED ||
      submission.reviewStatus ===
        HomeworkReviewStatus.INCOMPLETE ||
      submission.reviewStatus ===
        HomeworkReviewStatus.REVIEWED
    ) {
      throw new Error(
        "Reviewed submission cannot be updated"
      );
    }

    if (
      data.submissionText !==
      undefined
    ) {
      const submissionText =
        data.submissionText.trim();

      if (submissionText) {
        submission.submissionText =
          submissionText;
      } else {
        submission.set(
          "submissionText",
          undefined
        );
      }
    }

    if (
      data.attachment ===
      null
    ) {
      submission.set(
        "attachment",
        undefined
      );
    } else if (
      data.attachment !==
      undefined
    ) {
      submission.attachment = {
        fileName:
          data.attachment.fileName,

        fileUrl:
          data.attachment.fileUrl,
      };

      if (
        data.attachment.fileType
      ) {
        submission.attachment.fileType =
          data.attachment.fileType;
      }

      if (
        data.attachment.fileSize !==
        undefined
      ) {
        submission.attachment.fileSize =
          data.attachment.fileSize;
      }
    }

    if (
      !submission.submissionText &&
      !submission.attachment
    ) {
      throw new Error(
        "Submission text or attachment is required"
      );
    }

    const submittedAt =
      new Date();

    submission.submissionMode =
      HomeworkSubmissionMode.ONLINE;

    submission.submittedAt =
      submittedAt;

    submission.submissionStatus =
      submittedAt <=
      homework.dueDate
        ? HomeworkSubmissionStatus.SUBMITTED
        : HomeworkSubmissionStatus.LATE;

    submission.reviewStatus =
      HomeworkReviewStatus.PENDING;

    submission.set(
      "reviewedBy",
      undefined
    );

    submission.set(
      "reviewedAt",
      undefined
    );

    submission.set(
      "remarks",
      undefined
    );

    submission.set(
      "marks",
      undefined
    );

    await submission.save();

    return submission;
  };


// ======================================================
// REVIEW ONLINE HOMEWORK SUBMISSION
// ======================================================

export const reviewHomeworkSubmission =
  async (
    schoolId: string,
    submissionId: string,
    reviewedBy: string,
    data:
      ReviewHomeworkSubmissionData,
    actorTeacherId?: string,
    actorUserId?: string
  ) => {
    validateObjectId(
      schoolId,
      "schoolId"
    );

    validateObjectId(
      submissionId,
      "submissionId"
    );

    validateObjectId(
      reviewedBy,
      "reviewedBy"
    );

    validateReviewStatus(
      data.reviewStatus
    );

    const submission =
      await HomeworkSubmission.findOne({
        _id:
          submissionId,

        schoolId,

        isActive:
          true,
      });

    if (!submission) {
      throw new Error(
        "Homework submission not found"
      );
    }

    if (actorTeacherId) {
      await getHomeworkForSchool(
        schoolId,
        submission.homeworkId.toString(),
        actorTeacherId,
        actorUserId
      );
    }

    if (
      data.marks !==
        undefined &&
      data.marks < 0
    ) {
      throw new Error(
        "Marks cannot be negative"
      );
    }

    if (
      data.remarks !==
      undefined
    ) {
      const remarks =
        data.remarks.trim();

      if (remarks) {
        submission.remarks =
          remarks;
      } else {
        submission.set(
          "remarks",
          undefined
        );
      }
    }

    if (
      data.marks !==
      undefined
    ) {
      submission.marks =
        data.marks;
    } else {
      submission.set(
        "marks",
        undefined
      );
    }

    submission.reviewStatus =
      data.reviewStatus;

    submission.reviewedBy =
      new mongoose.Types.ObjectId(
        reviewedBy
      );

    submission.reviewedAt =
      new Date();

    await submission.save();

    return submission;
  };


// ======================================================
// MARK OFFLINE / NOTEBOOK HOMEWORK
//
// If online submission already exists:
// preserve ONLINE mode and review that submission.
//
// Otherwise:
// create/update OFFLINE teacher verification record.
// ======================================================

export const markOfflineHomework =
  async (
    schoolId: string,
    homeworkId: string,
    reviewedBy: string,
    data:
      OfflineHomeworkReviewData,
    actorTeacherId?: string,
    actorUserId?: string
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
      reviewedBy,
      "reviewedBy"
    );

    validateObjectId(
      data.studentId,
      "studentId"
    );

    validateReviewStatus(
      data.reviewStatus
    );

    if (
      data.marks !==
        undefined &&
      data.marks < 0
    ) {
      throw new Error(
        "Marks cannot be negative"
      );
    }

    const homework =
      await getHomeworkForSchool(
        schoolId,
        homeworkId,
        actorTeacherId,
        actorUserId
      );

    await validateStudentForHomework(
      schoolId,
      data.studentId,
      homework
    );

    const submission =
      await HomeworkSubmission.findOne({
        schoolId:
          new mongoose.Types.ObjectId(
            schoolId
          ),

        homeworkId:
          new mongoose.Types.ObjectId(
            homeworkId
          ),

        studentId:
          new mongoose.Types.ObjectId(
            data.studentId
          ),
      });

    // Existing active online submission:
    // don't convert it to OFFLINE.
    if (
      submission &&
      submission.isActive &&
      submission.submissionMode ===
        HomeworkSubmissionMode.ONLINE
    ) {
      return reviewHomeworkSubmission(
        schoolId,
        submission._id.toString(),
        reviewedBy,
        {
          reviewStatus:
            data.reviewStatus,

          ...(data.remarks !==
          undefined
            ? {
                remarks:
                  data.remarks,
              }
            : {}),

          ...(data.marks !==
          undefined
            ? {
                marks:
                  data.marks,
              }
            : {}),
        },
        actorTeacherId,
        actorUserId
      );
    }

    // Existing offline/soft deleted record:
    // restore/update instead of creating duplicate.
    if (submission) {
      submission.isActive =
        true;

      submission.submissionMode =
        HomeworkSubmissionMode.OFFLINE;

      submission.submissionStatus =
        HomeworkSubmissionStatus.NOT_SUBMITTED;

      submission.reviewStatus =
        data.reviewStatus;

      submission.reviewedBy =
        new mongoose.Types.ObjectId(
          reviewedBy
        );

      submission.reviewedAt =
        new Date();

      submission.set(
        "submittedAt",
        undefined
      );

      submission.set(
        "submissionText",
        undefined
      );

      submission.set(
        "attachment",
        undefined
      );

      if (
        data.remarks !==
        undefined &&
        data.remarks.trim()
      ) {
        submission.remarks =
          data.remarks.trim();
      } else {
        submission.set(
          "remarks",
          undefined
        );
      }

      if (
        data.marks !==
        undefined
      ) {
        submission.marks =
          data.marks;
      } else {
        submission.set(
          "marks",
          undefined
        );
      }

      await submission.save();

      return submission;
    }

    const payload: {
      schoolId:
        mongoose.Types.ObjectId;

      homeworkId:
        mongoose.Types.ObjectId;

      studentId:
        mongoose.Types.ObjectId;

      submissionMode:
        HomeworkSubmissionMode;

      submissionStatus:
        HomeworkSubmissionStatus;

      reviewStatus:
        HomeworkReviewStatus;

      reviewedBy:
        mongoose.Types.ObjectId;

      reviewedAt:
        Date;

      isActive:
        boolean;

      remarks?: string;

      marks?: number;
    } = {
      schoolId:
        new mongoose.Types.ObjectId(
          schoolId
        ),

      homeworkId:
        new mongoose.Types.ObjectId(
          homeworkId
        ),

      studentId:
        new mongoose.Types.ObjectId(
          data.studentId
        ),

      submissionMode:
        HomeworkSubmissionMode.OFFLINE,

      submissionStatus:
        HomeworkSubmissionStatus.NOT_SUBMITTED,

      reviewStatus:
        data.reviewStatus,

      reviewedBy:
        new mongoose.Types.ObjectId(
          reviewedBy
        ),

      reviewedAt:
        new Date(),

      isActive:
        true,
    };

    if (
      data.remarks?.trim()
    ) {
      payload.remarks =
        data.remarks.trim();
    }

    if (
      data.marks !==
      undefined
    ) {
      payload.marks =
        data.marks;
    }

    return HomeworkSubmission.create(
      payload
    );
  };


// ======================================================
// BULK HOMEWORK REVIEW
//
// Teacher/Admin can mark multiple students.
// Existing online submissions remain ONLINE.
// No submission -> OFFLINE record.
// ======================================================

export const bulkReviewHomework =
  async (
    schoolId: string,
    homeworkId: string,
    reviewedBy: string,
    data:
      BulkHomeworkReviewData,
    actorTeacherId?: string,
    actorUserId?: string
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
      reviewedBy,
      "reviewedBy"
    );

    if (
      !Array.isArray(
        data.students
      ) ||
      data.students.length === 0
    ) {
      throw new Error(
        "At least one student is required"
      );
    }

    if (
      data.students.length >
      100
    ) {
      throw new Error(
        "Maximum 100 students can be reviewed at once"
      );
    }

    // Validate Teacher/homework before processing.
    await getHomeworkForSchool(
      schoolId,
      homeworkId,
      actorTeacherId,
      actorUserId
    );

    const uniqueStudentIds =
      new Set<string>();

    for (
      const item of
      data.students
    ) {
      validateObjectId(
        item.studentId,
        "studentId"
      );

      validateReviewStatus(
        item.reviewStatus
      );

      if (
        uniqueStudentIds.has(
          item.studentId
        )
      ) {
        throw new Error(
          "Duplicate student found in bulk review"
        );
      }

      uniqueStudentIds.add(
        item.studentId
      );

      if (
        item.marks !==
          undefined &&
        item.marks < 0
      ) {
        throw new Error(
          "Marks cannot be negative"
        );
      }
    }

    const results = [];

    for (
      const item of
      data.students
    ) {
      const result =
        await markOfflineHomework(
          schoolId,
          homeworkId,
          reviewedBy,
          {
            studentId:
              item.studentId,

            reviewStatus:
              item.reviewStatus,

            ...(item.remarks !==
            undefined
              ? {
                  remarks:
                    item.remarks,
                }
              : {}),

            ...(item.marks !==
            undefined
              ? {
                  marks:
                    item.marks,
                }
              : {}),
          },
          actorTeacherId,
          actorUserId
        );

      results.push(
        result
      );
    }

    return {
      total:
        results.length,

      submissions:
        results,
    };
  };


// ======================================================
// DELETE HOMEWORK SUBMISSION
// ======================================================

export const deleteHomeworkSubmission =
  async (
    schoolId: string,
    submissionId: string
  ) => {
    validateObjectId(
      schoolId,
      "schoolId"
    );

    validateObjectId(
      submissionId,
      "submissionId"
    );

    const submission =
      await HomeworkSubmission.findOne({
        _id:
          submissionId,

        schoolId,

        isActive:
          true,
      });

    if (!submission) {
      throw new Error(
        "Homework submission not found"
      );
    }

    if (
      submission.reviewStatus !==
      HomeworkReviewStatus.PENDING
    ) {
      throw new Error(
        "Reviewed submission cannot be deleted"
      );
    }

    submission.isActive =
      false;

    await submission.save();

    return {
      message:
        "Homework submission deleted successfully",
    };
  };


// ======================================================
// GET HOMEWORK SUBMISSION STATS
// ======================================================

export const getHomeworkSubmissionStats =
  async (
    schoolId: string,
    homeworkId: string,
    actorTeacherId?: string,
    actorUserId?: string
  ) => {
    validateObjectId(
      schoolId,
      "schoolId"
    );

    validateObjectId(
      homeworkId,
      "homeworkId"
    );

    const homework =
      await getHomeworkForSchool(
        schoolId,
        homeworkId,
        actorTeacherId,
        actorUserId
      );

    const schoolObjectId =
      new mongoose.Types.ObjectId(
        schoolId
      );

    const homeworkObjectId =
      new mongoose.Types.ObjectId(
        homeworkId
      );

    const baseQuery = {
      schoolId:
        schoolObjectId,

      homeworkId:
        homeworkObjectId,

      isActive:
        true,
    };

    const [
      totalRecords,
      onlineSubmitted,
      offlineChecked,
      onTimeSubmitted,
      lateSubmitted,
      completed,
      incomplete,
      redoRequired,
      pendingReview,
      legacyReviewed,
      totalStudents,
    ] = await Promise.all([
      HomeworkSubmission.countDocuments(
        baseQuery
      ),

      HomeworkSubmission.countDocuments({
        ...baseQuery,

        submissionMode:
          HomeworkSubmissionMode.ONLINE,
      }),

      HomeworkSubmission.countDocuments({
        ...baseQuery,

        submissionMode:
          HomeworkSubmissionMode.OFFLINE,
      }),

      HomeworkSubmission.countDocuments({
        ...baseQuery,

        submissionStatus:
          HomeworkSubmissionStatus.SUBMITTED,
      }),

      HomeworkSubmission.countDocuments({
        ...baseQuery,

        submissionStatus:
          HomeworkSubmissionStatus.LATE,
      }),

      HomeworkSubmission.countDocuments({
        ...baseQuery,

        reviewStatus:
          HomeworkReviewStatus.COMPLETED,
      }),

      HomeworkSubmission.countDocuments({
        ...baseQuery,

        reviewStatus:
          HomeworkReviewStatus.INCOMPLETE,
      }),

      HomeworkSubmission.countDocuments({
        ...baseQuery,

        reviewStatus:
          HomeworkReviewStatus.REDO_REQUIRED,
      }),

      HomeworkSubmission.countDocuments({
        ...baseQuery,

        reviewStatus:
          HomeworkReviewStatus.PENDING,
      }),

      HomeworkSubmission.countDocuments({
        ...baseQuery,

        reviewStatus:
          HomeworkReviewStatus.REVIEWED,
      }),

      Student.countDocuments({
        schoolId,

        sessionId:
          homework.sessionId,

        classId:
          homework.classId,

        sectionId:
          homework.sectionId,

        status:
          "ACTIVE",
      }),
    ]);

    const pendingStudents =
      Math.max(
        totalStudents -
          totalRecords,
        0
      );

    return {
      homeworkId:
        homework._id,

      totalStudents,

      totalRecords,

      onlineSubmitted,

      offlineChecked,

      pendingStudents,

      onTimeSubmitted,

      lateSubmitted,

      completed,

      incomplete,

      redoRequired,

      pendingReview,

      legacyReviewed,
    };
  };


// ======================================================
// GET STUDENT SUBMISSION FOR HOMEWORK
// ======================================================

export const getStudentHomeworkSubmission =
  async (
    schoolId: string,
    homeworkId: string,
    studentId: string,
    actorTeacherId?: string,
    actorUserId?: string
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
      studentId,
      "studentId"
    );

    const homework =
      await getHomeworkForSchool(
        schoolId,
        homeworkId,
        actorTeacherId,
        actorUserId
      );

    await validateStudentForHomework(
      schoolId,
      studentId,
      homework
    );

    return HomeworkSubmission.findOne({
      schoolId,

      homeworkId,

      studentId,

      isActive:
        true,
    })
      .populate(
        "studentId"
      )
      .populate(
        "reviewedBy",
        "name email"
      )
      .lean();
  };


// ======================================================
// STUDENT - CREATE MY HOMEWORK SUBMISSION
//
// studentId always from JWT.
// ======================================================

export const createMyHomeworkSubmission =
  async (
    schoolId: string,
    studentId: string,
    data: Omit<
      CreateHomeworkSubmissionData,
      "studentId"
    >
  ) => {
    validateObjectId(
      schoolId,
      "schoolId"
    );

    validateObjectId(
      studentId,
      "studentId"
    );

    return createHomeworkSubmission(
      schoolId,
      {
        homeworkId:
          data.homeworkId,

        studentId,

        ...(data.submissionText !==
        undefined
          ? {
              submissionText:
                data.submissionText,
            }
          : {}),

        ...(data.attachment !==
        undefined
          ? {
              attachment:
                data.attachment,
            }
          : {}),
      }
    );
  };


// ======================================================
// STUDENT - GET MY HOMEWORK SUBMISSIONS
// ======================================================

export const getMyHomeworkSubmissions =
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
        .lean();

    if (!student) {
      throw new Error(
        "Student profile not found or inactive"
      );
    }

    const submissions =
      await HomeworkSubmission.find({
        schoolId:
          new mongoose.Types.ObjectId(
            schoolId
          ),

        studentId:
          new mongoose.Types.ObjectId(
            studentId
          ),

        isActive:
          true,
      })
        .populate({
          path:
            "homeworkId",

          match: {
            isActive:
              true,
          },

          select:
            "title description assignedDate dueDate status sessionId classId sectionId subjectId teacherId attachment",

          populate: [
            {
              path:
                "subjectId",

              select:
                "name code subjectType",
            },
            {
              path:
                "teacherId",

              select:
                "name employeeId",
            },
          ],
        })
        .populate(
          "reviewedBy",
          "name email"
        )
        .sort({
          submittedAt: -1,
          createdAt: -1,
        })
        .lean();

    return submissions.filter(
      (submission) =>
        submission.homeworkId
    );
  };


// ======================================================
// STUDENT - UPDATE MY HOMEWORK SUBMISSION
// ======================================================

export const updateMyHomeworkSubmission =
  async (
    schoolId: string,
    studentId: string,
    submissionId: string,
    data:
      UpdateHomeworkSubmissionData
  ) => {
    validateObjectId(
      schoolId,
      "schoolId"
    );

    validateObjectId(
      studentId,
      "studentId"
    );

    validateObjectId(
      submissionId,
      "submissionId"
    );

    const ownedSubmission =
      await HomeworkSubmission.findOne({
        _id:
          submissionId,

        schoolId,

        studentId,

        isActive:
          true,
      })
        .select(
          "_id submissionMode"
        )
        .lean();

    if (!ownedSubmission) {
      throw new Error(
        "Homework submission not found"
      );
    }

    if (
      ownedSubmission.submissionMode ===
      HomeworkSubmissionMode.OFFLINE
    ) {
      throw new Error(
        "Offline homework record cannot be edited by student"
      );
    }

    return updateHomeworkSubmission(
      schoolId,
      submissionId,
      data
    );
  };