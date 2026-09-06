import mongoose from "mongoose";

import Student from "./student.model";

import {
  StudentEnrollment,
} from "./studentEnrollment.model";


interface BackfillResult {
  totalStudents: number;
  created: number;
  skipped: number;
  failed: number;

  failures: Array<{
    studentId: string;
    admissionNumber?: string;
    reason: string;
  }>;
}


/* =====================================================
   BACKFILL EXISTING STUDENT ENROLLMENTS

   PURPOSE:

   Students created before StudentEnrollment module
   do not have enrollment history.

   This function creates their current enrollment
   from Student's current academic snapshot.

   SAFE TO RUN AGAIN:
   Existing enrollment = SKIPPED
===================================================== */

export const backfillStudentEnrollments =
  async (
    schoolId: string,
    userId: string
  ): Promise<BackfillResult> => {

    /* ===============================================
       VALIDATE IDS
    =============================================== */

    if (
      !mongoose.Types.ObjectId.isValid(
        schoolId
      )
    ) {
      throw new Error(
        "Invalid school ID"
      );
    }


    if (
      !mongoose.Types.ObjectId.isValid(
        userId
      )
    ) {
      throw new Error(
        "Invalid user ID"
      );
    }


    /* ===============================================
       GET EXISTING STUDENTS
    =============================================== */

    const students =
      await Student.find({
        schoolId,
      })
        .select(
          [
            "_id",
            "admissionNumber",
            "sessionId",
            "classId",
            "sectionId",
            "rollNumber",
            "status",
            "createdBy",
          ].join(" ")
        )
        .lean();


    const result:
      BackfillResult = {

      totalStudents:
        students.length,

      created:
        0,

      skipped:
        0,

      failed:
        0,

      failures:
        [],
    };


    /* ===============================================
       PROCESS STUDENTS
    =============================================== */

    for (
      const student of students
    ) {

      const studentId =
        student._id.toString();


      try {

        /* ===========================================
           REQUIRED ACADEMIC DATA
        =========================================== */

        if (
          !student.sessionId ||
          !student.classId ||
          !student.sectionId
        ) {

          result.failed += 1;

          result.failures.push({
            studentId,

            ...(student.admissionNumber
              ? {
                  admissionNumber:
                    student.admissionNumber,
                }
              : {}),

            reason:
              "Student does not have complete session/class/section data.",
          });

          continue;
        }


        /* ===========================================
           CHECK EXISTING ENROLLMENT

           Unique rule:
           school + student + session
        =========================================== */

        const existingEnrollment =
          await StudentEnrollment
            .findOne({
              schoolId,

              studentId:
                student._id,

              sessionId:
                student.sessionId,
            })
            .select("_id")
            .lean();


        if (existingEnrollment) {

          result.skipped += 1;

          continue;
        }


        /* ===========================================
           DETERMINE ENROLLMENT STATUS

           Only currently ACTIVE students should
           receive ACTIVE enrollment.

           Historical/inactive students are kept
           as COMPLETED so they don't appear as
           promotion candidates accidentally.
        =========================================== */

        const enrollmentStatus:
          "ACTIVE" |
          "COMPLETED" =

          student.status ===
          "ACTIVE"
            ? "ACTIVE"
            : "COMPLETED";


        /* ===========================================
           DETERMINE PROMOTION STATUS

           Existing ACTIVE student:
             NOT_DECIDED

           Existing exited/passed students:
             map existing status where possible
        =========================================== */

        let promotionStatus:
          | "NOT_DECIDED"
          | "PROMOTED"
          | "RETAINED"
          | "TRANSFERRED"
          | "LEFT"
          | "GRADUATED" =
          "NOT_DECIDED";


        if (
          student.status ===
          "TRANSFERRED"
        ) {

          promotionStatus =
            "TRANSFERRED";
        }


        if (
          student.status ===
          "LEFT"
        ) {

          promotionStatus =
            "LEFT";
        }


        if (
          student.status ===
          "PASSED"
        ) {

          promotionStatus =
            "GRADUATED";
        }


        /*
         * INACTIVE is not automatically treated
         * as LEFT/TRANSFERRED because we do not
         * know why the student was made inactive.
         *
         * Therefore enrollment is COMPLETED but
         * promotionStatus stays NOT_DECIDED.
         */


        /* ===========================================
           BUILD DATA
        =========================================== */

        const enrollmentData: {
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

          enrollmentStatus:
            "ACTIVE" |
            "COMPLETED";

          promotionStatus:
            | "NOT_DECIDED"
            | "PROMOTED"
            | "RETAINED"
            | "TRANSFERRED"
            | "LEFT"
            | "GRADUATED";

          createdBy:
            mongoose.Types.ObjectId;
        } = {

          schoolId:
            new mongoose.Types.ObjectId(
              schoolId
            ),

          studentId:
            student._id,

          sessionId:
            student.sessionId,

          classId:
            student.classId,

          sectionId:
            student.sectionId,

          enrollmentStatus,

          promotionStatus,

          createdBy:
            new mongoose.Types.ObjectId(
              userId
            ),
        };


        if (
          student.rollNumber !==
          undefined
        ) {

          enrollmentData.rollNumber =
            student.rollNumber;
        }


        /* ===========================================
           CREATE
        =========================================== */

        await StudentEnrollment.create(
          enrollmentData
        );


        result.created += 1;

      } catch (error) {

        /*
         * Handle duplicate race condition too.
         */

        if (
          error instanceof Error &&
          "code" in error &&
          (
            error as Error & {
              code?: number;
            }
          ).code === 11000
        ) {

          result.skipped += 1;

          continue;
        }


        result.failed += 1;


        result.failures.push({

          studentId,

          ...(student.admissionNumber
            ? {
                admissionNumber:
                  student.admissionNumber,
              }
            : {}),

          reason:
            error instanceof Error
              ? error.message
              : "Unknown backfill error",
        });
      }
    }


    return result;
  };