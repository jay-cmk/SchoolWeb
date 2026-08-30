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
  HomeworkSubmissionStatus,
} from "./homeworkSubmission.types";

import type {
  CreateHomeworkSubmissionData,
  HomeworkSubmissionFilters,
  ReviewHomeworkSubmissionData,
  UpdateHomeworkSubmissionData,
} from "./homeworkSubmission.types";


// ======================================================
// IMPORTANT
// ======================================================
//
// Student module ready hone ke baad actual path
// aur export name ke according import update karna.
//
// Example:
//
// import { Student } from "../students/student.model";
//
// Abhi Student validation intentionally commented hai.
//
// ======================================================


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
// HELPER: GET HOMEWORK FOR SCHOOL
// ======================================================

const getHomeworkForSchool =
  async (
    schoolId: string,
    homeworkId: string
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
      await Homework.findOne({
        _id: homeworkId,
        schoolId,
        isActive: true,
      });


    if (!homework) {
      throw new Error(
        "Homework not found"
      );
    }


    return homework;
  };


// ======================================================
// CREATE HOMEWORK SUBMISSION
// ======================================================

export const createHomeworkSubmission =
  async (
    schoolId: string,
    data: CreateHomeworkSubmissionData
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


    // --------------------------------------------------
    // Only published homework can accept submission
    // --------------------------------------------------

    if (
      homework.status !==
      HomeworkStatus.PUBLISHED
    ) {
      throw new Error(
        "Homework is not available for submission"
      );
    }


    // ==================================================
    // STUDENT VALIDATION
    // ==================================================
    //
    // Student module ready hone ke baad enable karna:
    //
    // const student =
    //   await Student.findOne({
    //     _id: data.studentId,
    //     schoolId,
    //     classId:
    //       homework.classId,
    //     sectionId:
    //       homework.sectionId,
    //     isActive: true,
    //   }).lean();
    //
    //
    // if (!student) {
    //   throw new Error(
    //     "Student does not belong to this homework class and section"
    //   );
    // }
    //
    // ==================================================


    // --------------------------------------------------
    // Duplicate submission check
    // --------------------------------------------------

    const existingSubmission =
      await HomeworkSubmission.findOne({
        schoolId,
        homeworkId:
          data.homeworkId,
        studentId:
          data.studentId,
        isActive: true,
      });


    if (existingSubmission) {
      throw new Error(
        "Student has already submitted this homework"
      );
    }


    // --------------------------------------------------
    // At least text or attachment required
    // --------------------------------------------------

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


    // --------------------------------------------------
    // Calculate submission status
    // --------------------------------------------------

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

      submissionStatus,

      reviewStatus:
        HomeworkReviewStatus.PENDING,

      submittedAt,

      isActive: true,
    };


    // --------------------------------------------------
    // Submission text
    // --------------------------------------------------

    if (
      data.submissionText?.trim()
    ) {
      payload.submissionText =
        data.submissionText.trim();
    }


    // --------------------------------------------------
    // Attachment
    // --------------------------------------------------

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


    const submission =
      await HomeworkSubmission.create(
        payload
      );


    return submission;
  };


// ======================================================
// GET HOMEWORK SUBMISSIONS
// ======================================================

export const getHomeworkSubmissions =
  async (
    schoolId: string,
    homeworkId: string,
    filters:
      HomeworkSubmissionFilters = {}
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
      homeworkId
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

      isActive: true,
    };


    // --------------------------------------------------
    // Student filter
    // --------------------------------------------------

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


    // --------------------------------------------------
    // Submission status filter
    // --------------------------------------------------

    if (
      filters.submissionStatus
    ) {
      query.submissionStatus =
        filters.submissionStatus;
    }


    // --------------------------------------------------
    // Review status filter
    // --------------------------------------------------

    if (
      filters.reviewStatus
    ) {
      query.reviewStatus =
        filters.reviewStatus;
    }


    // --------------------------------------------------
    // Search
    // --------------------------------------------------
    //
    // Student module complete hone ke baad
    // student name/admission number search
    // aggregation/populate based search add karenge.
    //
    // Abhi filters.search intentionally
    // database query me use nahi ho raha.
    //
    // --------------------------------------------------


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
        _id: submissionId,

        schoolId,

        isActive: true,
      })
        .populate(
          "homeworkId",
          "title description assignedDate dueDate status"
        )
        .populate(
          "studentId"
        )
        .populate(
          "reviewedBy",
          "name email"
        )
        .lean();


    if (!submission) {
      throw new Error(
        "Homework submission not found"
      );
    }


    return submission;
  };


// ======================================================
// UPDATE HOMEWORK SUBMISSION
// ======================================================

export const updateHomeworkSubmission =
  async (
    schoolId: string,
    submissionId: string,
    data: UpdateHomeworkSubmissionData
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
        _id: submissionId,

        schoolId,

        isActive: true,
      });


    if (!submission) {
      throw new Error(
        "Homework submission not found"
      );
    }


    const homework =
      await getHomeworkForSchool(
        schoolId,
        submission.homeworkId.toString()
      );


    // --------------------------------------------------
    // Homework must be published
    // --------------------------------------------------

    if (
      homework.status !==
      HomeworkStatus.PUBLISHED
    ) {
      throw new Error(
        "Closed or draft homework submission cannot be updated"
      );
    }


    // --------------------------------------------------
    // Reviewed submission cannot be edited
    // --------------------------------------------------

    if (
      submission.reviewStatus ===
      HomeworkReviewStatus.REVIEWED
    ) {
      throw new Error(
        "Reviewed submission cannot be updated"
      );
    }


    // --------------------------------------------------
    // Update submission text
    // --------------------------------------------------

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


    // --------------------------------------------------
    // Update/remove attachment
    // --------------------------------------------------

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


    // --------------------------------------------------
    // At least one submission content required
    // --------------------------------------------------

    if (
      !submission.submissionText &&
      !submission.attachment
    ) {
      throw new Error(
        "Submission text or attachment is required"
      );
    }


    // --------------------------------------------------
    // Update submission time
    // --------------------------------------------------

    const submittedAt =
      new Date();


    submission.submittedAt =
      submittedAt;


    // --------------------------------------------------
    // Recalculate late/on-time
    // --------------------------------------------------

    submission.submissionStatus =
      submittedAt <=
      homework.dueDate
        ? HomeworkSubmissionStatus.SUBMITTED
        : HomeworkSubmissionStatus.LATE;


    // --------------------------------------------------
    // Since student edited submission,
    // review should become pending again
    // --------------------------------------------------

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
// REVIEW HOMEWORK SUBMISSION
// ======================================================

export const reviewHomeworkSubmission =
  async (
    schoolId: string,
    submissionId: string,
    reviewedBy: string,
    data: ReviewHomeworkSubmissionData
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


    const submission =
      await HomeworkSubmission.findOne({
        _id: submissionId,

        schoolId,

        isActive: true,
      });


    if (!submission) {
      throw new Error(
        "Homework submission not found"
      );
    }


    // --------------------------------------------------
    // Marks validation
    // --------------------------------------------------

    if (
      data.marks !==
        undefined &&
      data.marks < 0
    ) {
      throw new Error(
        "Marks cannot be negative"
      );
    }


    // --------------------------------------------------
    // Remarks
    // --------------------------------------------------

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


    // --------------------------------------------------
    // Marks
    // --------------------------------------------------

    if (
      data.marks !==
      undefined
    ) {

      submission.marks =
        data.marks;
    }


    // --------------------------------------------------
    // Review information
    // --------------------------------------------------

    submission.reviewStatus =
      HomeworkReviewStatus.REVIEWED;


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
        _id: submissionId,

        schoolId,

        isActive: true,
      });


    if (!submission) {
      throw new Error(
        "Homework submission not found"
      );
    }


    // --------------------------------------------------
    // Reviewed submission cannot be deleted
    // --------------------------------------------------

    if (
      submission.reviewStatus ===
      HomeworkReviewStatus.REVIEWED
    ) {
      throw new Error(
        "Reviewed submission cannot be deleted"
      );
    }


    // --------------------------------------------------
    // Soft delete
    // --------------------------------------------------

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
    homeworkId: string
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
        homeworkId
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
      totalSubmitted,
      onTimeSubmitted,
      lateSubmitted,
      reviewed,
      pendingReview,
    ] = await Promise.all([

      // Total actual submission records

      HomeworkSubmission.countDocuments(
        baseQuery
      ),


      // Submitted on time

      HomeworkSubmission.countDocuments({
        ...baseQuery,

        submissionStatus:
          HomeworkSubmissionStatus.SUBMITTED,
      }),


      // Submitted late

      HomeworkSubmission.countDocuments({
        ...baseQuery,

        submissionStatus:
          HomeworkSubmissionStatus.LATE,
      }),


      // Reviewed

      HomeworkSubmission.countDocuments({
        ...baseQuery,

        reviewStatus:
          HomeworkReviewStatus.REVIEWED,
      }),


      // Awaiting review

      HomeworkSubmission.countDocuments({
        ...baseQuery,

        reviewStatus:
          HomeworkReviewStatus.PENDING,
      }),

    ]);


    return {

      homeworkId:
        homework._id,

      totalSubmitted,

      onTimeSubmitted,

      lateSubmitted,

      reviewed,

      pendingReview,


      // ================================================
      // Student module ready hone ke baad
      // yaha ye add karenge:
      // ================================================
      //
      // const totalStudents =
      //   await Student.countDocuments({
      //     schoolId,
      //     classId:
      //       homework.classId,
      //     sectionId:
      //       homework.sectionId,
      //     isActive: true,
      //   });
      //
      //
      // const pendingStudents =
      //   Math.max(
      //     totalStudents -
      //       totalSubmitted,
      //     0
      //   );
      //
      //
      // return:
      //
      // totalStudents,
      // submitted: totalSubmitted,
      // pending: pendingStudents,
      // late: lateSubmitted
      //
      // ================================================
    };
  };


// ======================================================
// GET STUDENT SUBMISSION FOR A HOMEWORK
// ======================================================

export const getStudentHomeworkSubmission =
  async (
    schoolId: string,
    homeworkId: string,
    studentId: string
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


    await getHomeworkForSchool(
      schoolId,
      homeworkId
    );


    const submission =
      await HomeworkSubmission.findOne({
        schoolId,

        homeworkId,

        studentId,

        isActive: true,
      })
        .populate(
          "studentId"
        )
        .populate(
          "reviewedBy",
          "name email"
        )
        .lean();


    return submission;
  };