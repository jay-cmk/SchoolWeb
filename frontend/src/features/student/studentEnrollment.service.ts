import mongoose from "mongoose";

import {
  StudentEnrollment,
} from "./studentEnrollment.model";

import {
  Student,
} from "./";


// ============================================
// TYPES
// ============================================

export interface GetStudentEnrollmentsFilters {
  sessionId: string;

  classId?: string;

  sectionId?: string;

  search?: string;
}


export interface CreateStudentEnrollmentData {
  studentId: string;

  sessionId: string;

  classId: string;

  sectionId: string;

  rollNumber?: number;

  createdBy?: string;
}


// ============================================
// OBJECT ID VALIDATION
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


// ============================================
// GET STUDENTS BY SESSION
// ============================================

export const getStudentEnrollments =
  async (
    schoolId: string,
    filters: GetStudentEnrollmentsFilters
  ) => {

    validateObjectId(
      schoolId,
      "schoolId"
    );

    validateObjectId(
      filters.sessionId,
      "sessionId"
    );


    if (filters.classId) {
      validateObjectId(
        filters.classId,
        "classId"
      );
    }


    if (filters.sectionId) {
      validateObjectId(
        filters.sectionId,
        "sectionId"
      );
    }


    // ========================================
    // ENROLLMENT QUERY
    // ========================================

    const query: {
      schoolId:
        mongoose.Types.ObjectId;

      sessionId:
        mongoose.Types.ObjectId;

      classId?:
        mongoose.Types.ObjectId;

      sectionId?:
        mongoose.Types.ObjectId;
    } = {
      schoolId:
        new mongoose.Types.ObjectId(
          schoolId
        ),

      sessionId:
        new mongoose.Types.ObjectId(
          filters.sessionId
        ),
    };


    if (filters.classId) {
      query.classId =
        new mongoose.Types.ObjectId(
          filters.classId
        );
    }


    if (filters.sectionId) {
      query.sectionId =
        new mongoose.Types.ObjectId(
          filters.sectionId
        );
    }


    // ========================================
    // GET ENROLLMENTS
    // ========================================

    const enrollments =
      await StudentEnrollment
        .find(query)

        .populate({
          path: "studentId",

          select: [
            "name",
            "admissionNumber",
            "admissionDate",
            "admissionType",
            "admissionCategory",
            "dob",
            "gender",
            "bloodGroup",
            "religion",
            "category",
            "caste",
            "aadhaarNumber",
            "photo",
            "mobile",
            "email",
            "address",
            "currentAddress",
            "permanentAddress",
            "father",
            "mother",
            "parentId",
            "status",
            "userId",
            "createdAt",
            "updatedAt",
          ].join(" "),
        })

        .populate({
          path: "sessionId",
          select:
            "name startDate endDate isCurrent",
        })

        .populate({
          path: "classId",
          select:
            "name order isActive sessionId",
        })

        .populate({
          path: "sectionId",
          select:
            "name roomNumber capacity isActive classId sessionId",
        })

        .sort({
          rollNumber: 1,
          createdAt: 1,
        })

        .lean();


    // ========================================
    // SEARCH
    // ========================================

    const search =
      filters.search
        ?.trim()
        .toLowerCase();


    const filteredEnrollments =
      !search
        ? enrollments
        : enrollments.filter(
            (enrollment: any) => {

              const student =
                enrollment.studentId;


              if (
                !student ||
                typeof student !==
                  "object"
              ) {
                return false;
              }


              const name =
                String(
                  student.name ?? ""
                ).toLowerCase();


              const admissionNumber =
                String(
                  student.admissionNumber ??
                    ""
                ).toLowerCase();


              const mobile =
                String(
                  student.mobile ?? ""
                ).toLowerCase();


              return (
                name.includes(
                  search
                ) ||
                admissionNumber.includes(
                  search
                ) ||
                mobile.includes(
                  search
                )
              );
            }
          );


    // ========================================
    // FORMAT RESPONSE
    // ========================================

    return filteredEnrollments
      .filter(
        (enrollment: any) =>
          enrollment.studentId
      )
      .map(
        (enrollment: any) => {

          const student =
            enrollment.studentId;


          /*
           * IMPORTANT:
           *
           * Student master ka current
           * sessionId/classId/sectionId
           * yahan use nahi kar rahe.
           *
           * Selected historical session ki
           * academic placement enrollment
           * record se aa rahi hai.
           */

          return {
            ...student,

            _id:
              String(
                student._id
              ),

            schoolId:
              String(
                enrollment.schoolId
              ),

            sessionId:
              enrollment.sessionId,

            classId:
              enrollment.classId,

            sectionId:
              enrollment.sectionId,

            rollNumber:
              enrollment.rollNumber,

            enrollmentId:
              String(
                enrollment._id
              ),

            enrollmentStatus:
              enrollment.status,

            isCurrentEnrollment:
              enrollment.isCurrent,

            enrolledAt:
              enrollment.enrolledAt,

            completedAt:
              enrollment.completedAt,
          };
        }
      );
  };


// ============================================
// GET ONE ENROLLMENT
// ============================================

export const getStudentEnrollmentById =
  async (
    schoolId: string,
    enrollmentId: string
  ) => {

    validateObjectId(
      schoolId,
      "schoolId"
    );

    validateObjectId(
      enrollmentId,
      "enrollmentId"
    );


    const enrollment =
      await StudentEnrollment
        .findOne({
          _id:
            enrollmentId,

          schoolId:
            schoolId,
        })

        .populate({
          path: "studentId",
        })

        .populate({
          path: "sessionId",
        })

        .populate({
          path: "classId",
        })

        .populate({
          path: "sectionId",
        })

        .lean();


    if (!enrollment) {
      throw new Error(
        "Student enrollment not found"
      );
    }


    return enrollment;
  };


// ============================================
// GET STUDENT ENROLLMENT FOR SESSION
// ============================================

export const getStudentEnrollmentBySession =
  async (
    schoolId: string,
    studentId: string,
    sessionId: string
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
      sessionId,
      "sessionId"
    );


    const enrollment =
      await StudentEnrollment
        .findOne({
          schoolId:
            schoolId,

          studentId:
            studentId,

          sessionId:
            sessionId,
        })

        .populate({
          path: "studentId",
        })

        .populate({
          path: "sessionId",
        })

        .populate({
          path: "classId",
        })

        .populate({
          path: "sectionId",
        })

        .lean();


    if (!enrollment) {
      throw new Error(
        "Student enrollment not found for this academic session"
      );
    }


    return enrollment;
  };


// ============================================
// GET CURRENT STUDENT ENROLLMENT
// ============================================

export const getCurrentStudentEnrollment =
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


    const enrollment =
      await StudentEnrollment
        .findOne({
          schoolId:
            schoolId,

          studentId:
            studentId,

          isCurrent:
            true,
        })

        .populate({
          path: "sessionId",
        })

        .populate({
          path: "classId",
        })

        .populate({
          path: "sectionId",
        })

        .lean();


    if (!enrollment) {
      throw new Error(
        "Current student enrollment not found"
      );
    }


    return enrollment;
  };


// ============================================
// CREATE STUDENT ENROLLMENT
// ============================================

export const createStudentEnrollment =
  async (
    schoolId: string,
    data: CreateStudentEnrollmentData
  ) => {

    validateObjectId(
      schoolId,
      "schoolId"
    );

    validateObjectId(
      data.studentId,
      "studentId"
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


    if (data.createdBy) {
      validateObjectId(
        data.createdBy,
        "createdBy"
      );
    }


    // ========================================
    // STUDENT VALIDATION
    // ========================================

    const student =
      await Student.findOne({
        _id:
          data.studentId,

        schoolId:
          schoolId,
      });


    if (!student) {
      throw new Error(
        "Student not found"
      );
    }


    // ========================================
    // DUPLICATE SESSION ENROLLMENT
    // ========================================

    const existingEnrollment =
      await StudentEnrollment.findOne({
        schoolId:
          schoolId,

        studentId:
          data.studentId,

        sessionId:
          data.sessionId,
      });


    if (existingEnrollment) {
      throw new Error(
        "Student is already enrolled in this academic session"
      );
    }


    // ========================================
    // OLD CURRENT ENROLLMENT
    // ========================================

    await StudentEnrollment.updateMany(
      {
        schoolId:
          schoolId,

        studentId:
          data.studentId,

        isCurrent:
          true,
      },

      {
        $set: {
          isCurrent:
            false,

          completedAt:
            new Date(),
        },
      }
    );


    // ========================================
    // CREATE NEW ENROLLMENT
    // ========================================

    const createData: {
      schoolId:
        mongoose.Types.ObjectId;

      studentId:
        mongoose.Types.ObjectId;

      sessionId:
        mongoose.Types.ObjectId;

      classId:
        mongoose.Types.ObjectId;

      sectionId:
        mongoose.Types.ObjectId;

      rollNumber?: number;

      status:
        "ACTIVE";

      isCurrent:
        boolean;

      enrolledAt:
        Date;

      createdBy?:
        mongoose.Types.ObjectId;
    } = {

      schoolId:
        new mongoose.Types.ObjectId(
          schoolId
        ),

      studentId:
        new mongoose.Types.ObjectId(
          data.studentId
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

      status:
        "ACTIVE",

      isCurrent:
        true,

      enrolledAt:
        new Date(),
    };


    if (
      data.rollNumber !==
      undefined
    ) {
      createData.rollNumber =
        data.rollNumber;
    }


    if (data.createdBy) {
      createData.createdBy =
        new mongoose.Types.ObjectId(
          data.createdBy
        );
    }


    const enrollment =
      await StudentEnrollment.create(
        createData
      );


    return enrollment;
  };