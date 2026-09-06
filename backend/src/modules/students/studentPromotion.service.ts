import mongoose, { type ClientSession } from "mongoose";

import { Student } from "./student.model";

import { StudentEnrollment } from "./studentEnrollment.model";

import { AcademicSession } from "../academic/academicSession.model";

import { ClassModel } from "../academic/classes/class.model";
import { Section } from "../academic/sections/section.model";

import type {
  IBulkPromotionSummary,
  IBulkStudentPromotionRequest,
  IPromotionPreviewResult,
  IPromotionPreviewStudent,
  ISingleStudentPromotionRequest,
  IStudentPromotionItem,
  StudentPromotionDecision,
} from "./studentPromotion.types";

/* =====================================================
   TYPES
===================================================== */

interface PromotionContext {
  schoolId: string;
  userId: string;
}

interface ValidatedPromotionItem {
  studentId: string;

  studentName: string;

  admissionNumber: string;

  sourceEnrollmentId: string;

  sourceSessionId: string;

  sourceClassId: string;

  sourceSectionId: string;

  sourceRollNumber?: number;

  decision: StudentPromotionDecision;

  targetSessionId?: string;

  targetClassId?: string;

  targetSectionId?: string;

  rollNumber?: number;

  remarks?: string;
}

interface ValidationResult {
  preview: IPromotionPreviewResult;

  validItems: ValidatedPromotionItem[];
}

/* =====================================================
   OBJECT ID VALIDATION
===================================================== */

const validateObjectId = (value: string, fieldName: string): void => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error(`Invalid ${fieldName}.`);
  }
};

/* =====================================================
   TARGET ENROLLMENT REQUIRED?
===================================================== */

const requiresTargetEnrollment = (
  decision: StudentPromotionDecision,
): boolean => {
  return decision === "PROMOTED" || decision === "RETAINED";
};

/* =====================================================
   VALID DECISION
===================================================== */

const isValidDecision = (
  decision: string,
): decision is StudentPromotionDecision => {
  return ["PROMOTED", "RETAINED", "TRANSFERRED", "LEFT", "GRADUATED"].includes(
    decision,
  );
};

/* =====================================================
   BUILD INVALID PREVIEW
===================================================== */

const buildInvalidPreview = (
  item: IStudentPromotionItem,
  errors: string[],
): IPromotionPreviewStudent => {
  return {
    studentId: item.studentId,

    studentName: "",

    admissionNumber: "",

    currentEnrollmentId: "",

    decision: item.decision,

    valid: false,

    errors,

    source: {
      sessionId: "",
      classId: "",
      sectionId: "",
    },
  };
};

/* =====================================================
   VALIDATE REQUEST BASICS
===================================================== */

const validateRequestBasics = (data: IBulkStudentPromotionRequest): void => {
  if (!data.sourceSessionId) {
    throw new Error("Source academic session is required.");
  }

  if (!data.targetSessionId) {
    throw new Error("Target academic session is required.");
  }

  validateObjectId(data.sourceSessionId, "sourceSessionId");

  validateObjectId(data.targetSessionId, "targetSessionId");

  if (data.sourceSessionId === data.targetSessionId) {
    throw new Error("Source and target academic sessions must be different.");
  }

  if (!Array.isArray(data.students) || data.students.length === 0) {
    throw new Error("At least one student is required for promotion.");
  }

  /*
   * Prevent same student appearing twice
   * in one bulk promotion request.
   */

  const studentIds = data.students.map((item) => item.studentId);

  const uniqueStudentIds = new Set(studentIds);

  if (uniqueStudentIds.size !== studentIds.length) {
    throw new Error(
      "Duplicate students are not allowed in the same promotion request.",
    );
  }
};

/* =====================================================
   VALIDATE SESSION
===================================================== */

const validateSessions = async (
  schoolId: string,
  sourceSessionId: string,
  targetSessionId: string,
  mongoSession?: ClientSession,
) => {
  const query = AcademicSession.find({
    _id: {
      $in: [sourceSessionId, targetSessionId],
    },

    schoolId,
  }).select("_id name startDate endDate");

  if (mongoSession) {
    query.session(mongoSession);
  }

  const sessions = await query.lean();

  const sourceSession = sessions.find(
    (session) => session._id.toString() === sourceSessionId,
  );

  const targetSession = sessions.find(
    (session) => session._id.toString() === targetSessionId,
  );

  if (!sourceSession) {
    throw new Error("Source academic session not found.");
  }

  if (!targetSession) {
    throw new Error("Target academic session not found.");
  }

  /*
   * Target session should normally be
   * chronologically after source session.
   */

  if (
    sourceSession.startDate &&
    targetSession.startDate &&
    new Date(targetSession.startDate).getTime() <=
      new Date(sourceSession.startDate).getTime()
  ) {
    throw new Error(
      "Target academic session must be after the source academic session.",
    );
  }

  return {
    sourceSession,
    targetSession,
  };
};

/* =====================================================
   VALIDATE TARGET CLASS + SECTION
===================================================== */

const validateTargetAcademicMapping = async (
  schoolId: string,
  targetSessionId: string,
  targetClassId: string,
  targetSectionId: string,
  mongoSession?: ClientSession,
) => {
  validateObjectId(targetClassId, "targetClassId");

  validateObjectId(targetSectionId, "targetSectionId");

  const classQuery = ClassModel.findOne({
    _id: targetClassId,

    schoolId,

    sessionId: targetSessionId,
  }).select("_id name order isActive");

  if (mongoSession) {
    classQuery.session(mongoSession);
  }

  const classData = await classQuery.lean();

  if (!classData) {
    throw new Error(
      "Target class does not belong to the target academic session.",
    );
  }

  if (classData.isActive === false) {
    throw new Error("Target class is inactive.");
  }

  const sectionQuery = Section.findOne({
    _id: targetSectionId,

    schoolId,

    sessionId: targetSessionId,

    classId: targetClassId,
  }).select("_id name capacity isActive");

  if (mongoSession) {
    sectionQuery.session(mongoSession);
  }

  const section = await sectionQuery.lean();

  if (!section) {
    throw new Error("Target section does not belong to the target class.");
  }

  if (section.isActive === false) {
    throw new Error("Target section is inactive.");
  }

  return {
    classData,
    section,
  };
};

/* =====================================================
   VALIDATE ONE PROMOTION ITEM
===================================================== */

const validatePromotionItem = async (
  context: PromotionContext,

  sourceSessionId: string,

  targetSessionId: string,

  item: IStudentPromotionItem,

  mongoSession?: ClientSession,
): Promise<{
  preview: IPromotionPreviewStudent;

  validItem?: ValidatedPromotionItem;
}> => {
  const errors: string[] = [];

  /* ===============================================
       BASIC VALIDATION
    =============================================== */

  if (!item.studentId || !mongoose.Types.ObjectId.isValid(item.studentId)) {
    return {
      preview: buildInvalidPreview(item, ["Invalid studentId."]),
    };
  }

  if (!isValidDecision(item.decision)) {
    return {
      preview: buildInvalidPreview(item, ["Invalid promotion decision."]),
    };
  }

  if (
    item.rollNumber !== undefined &&
    (!Number.isInteger(item.rollNumber) || item.rollNumber <= 0)
  ) {
    errors.push("Roll number must be a positive integer.");
  }

  /* ===============================================
       STUDENT
    =============================================== */

  const studentQuery = Student.findOne({
    _id: item.studentId,

    schoolId: context.schoolId,
  }).select("_id name admissionNumber status");

  if (mongoSession) {
    studentQuery.session(mongoSession);
  }

  const student = await studentQuery.lean();

  if (!student) {
    return {
      preview: buildInvalidPreview(item, ["Student not found."]),
    };
  }

  /* ===============================================
       SOURCE ENROLLMENT
    =============================================== */

  const sourceQuery = StudentEnrollment.findOne({
    schoolId: context.schoolId,

    studentId: item.studentId,

    sessionId: sourceSessionId,

    enrollmentStatus: "ACTIVE",
  });

  if (mongoSession) {
    sourceQuery.session(mongoSession);
  }

  const sourceEnrollment = await sourceQuery.lean();

  if (!sourceEnrollment) {
    return {
      preview: {
        studentId: student._id.toString(),

        studentName: student.name,

        admissionNumber: student.admissionNumber,

        currentEnrollmentId: "",

        decision: item.decision,

        valid: false,

        errors: ["Active source enrollment not found."],

        source: {
          sessionId: sourceSessionId,

          classId: "",

          sectionId: "",
        },
      },
    };
  }

  /* ===============================================
       ALREADY PROCESSED?
    =============================================== */

  if (sourceEnrollment.promotionStatus !== "NOT_DECIDED") {
    errors.push(
      `Student promotion has already been processed as ${sourceEnrollment.promotionStatus}.`,
    );
  }

  /* ===============================================
       STUDENT STATUS
    =============================================== */

  if (student.status && student.status !== "ACTIVE") {
    errors.push("Only active students can be processed for promotion.");
  }

  /* ===============================================
       TARGET VALIDATION
    =============================================== */

  let targetClassId: string | undefined;

  let targetSectionId: string | undefined;

  if (requiresTargetEnrollment(item.decision)) {
    if (!item.targetClassId) {
      errors.push("Target class is required.");
    } else {
      targetClassId = item.targetClassId;
    }

    if (!item.targetSectionId) {
      errors.push("Target section is required.");
    } else {
      targetSectionId = item.targetSectionId;
    }

    if (targetClassId && targetSectionId) {
      try {
        const target = await validateTargetAcademicMapping(
          context.schoolId,
          targetSessionId,
          targetClassId,
          targetSectionId,
          mongoSession,
        );

        /*
         * RETAINED:
         * target class should represent
         * the same class level/order.
         *
         * Since classes belong to sessions,
         * their ObjectIds will normally differ.
         */

        if (item.decision === "RETAINED") {
          const sourceClassQuery = ClassModel.findOne({
            _id: sourceEnrollment.classId,

            schoolId: context.schoolId,

            sessionId: sourceSessionId,
          }).select("_id name order");

          if (mongoSession) {
            sourceClassQuery.session(mongoSession);
          }

          const sourceClass = await sourceClassQuery.lean();

          if (!sourceClass) {
            errors.push("Source class not found.");
          } else if (
            sourceClass.order !== undefined &&
            target.classData.order !== undefined &&
            sourceClass.order !== target.classData.order
          ) {
            errors.push(
              "Retained student must remain in the same class level.",
            );
          }
        }

        /*
         * PROMOTED:
         * target class should be above
         * source class where class order
         * is available.
         */

        if (item.decision === "PROMOTED") {
          const sourceClassQuery = ClassModel.findOne({
            _id: sourceEnrollment.classId,

            schoolId: context.schoolId,

            sessionId: sourceSessionId,
          }).select("_id name order");

          if (mongoSession) {
            sourceClassQuery.session(mongoSession);
          }

          const sourceClass = await sourceClassQuery.lean();

          if (
            sourceClass &&
            sourceClass.order !== undefined &&
            target.classData.order !== undefined &&
            target.classData.order <= sourceClass.order
          ) {
            errors.push(
              "Promoted student's target class must be above the source class.",
            );
          }
        }
      } catch (error) {
        errors.push(
          error instanceof Error
            ? error.message
            : "Invalid target academic mapping.",
        );
      }
    }

    /* =============================================
         ALREADY TARGET ENROLLED?
      ============================================= */

    const targetEnrollmentQuery = StudentEnrollment.findOne({
      schoolId: context.schoolId,

      studentId: item.studentId,

      sessionId: targetSessionId,
    }).select("_id");

    if (mongoSession) {
      targetEnrollmentQuery.session(mongoSession);
    }

    const targetEnrollment = await targetEnrollmentQuery.lean();

    if (targetEnrollment) {
      errors.push(
        "Student is already enrolled in the target academic session.",
      );
    }
  } else {
    /*
     * LEFT / TRANSFERRED / GRADUATED
     * must not create target enrollment.
     */

    if (item.targetClassId || item.targetSectionId) {
      errors.push(
        `${item.decision} student must not have a target class or section.`,
      );
    }

    if (item.rollNumber !== undefined) {
      errors.push(
        `${item.decision} student must not have a target roll number.`,
      );
    }
  }

  /* ===============================================
       BUILD PREVIEW
    =============================================== */

  const preview: IPromotionPreviewStudent = {
    studentId: student._id.toString(),

    studentName: student.name,

    admissionNumber: student.admissionNumber,

    currentEnrollmentId: sourceEnrollment._id.toString(),

    decision: item.decision,

    valid: errors.length === 0,

    errors,

    source: {
      sessionId: sourceEnrollment.sessionId.toString(),

      classId: sourceEnrollment.classId.toString(),

      sectionId: sourceEnrollment.sectionId.toString(),
    },
  };

  if (sourceEnrollment.rollNumber !== undefined) {
    preview.source.rollNumber = sourceEnrollment.rollNumber;
  }

  if (
    requiresTargetEnrollment(item.decision) &&
    targetClassId &&
    targetSectionId
  ) {
    preview.target = {
      sessionId: targetSessionId,

      classId: targetClassId,

      sectionId: targetSectionId,
    };

    if (item.rollNumber !== undefined) {
      preview.target.rollNumber = item.rollNumber;
    }
  }

  if (errors.length > 0) {
    return {
      preview,
    };
  }

  const validItem: ValidatedPromotionItem = {
    studentId: student._id.toString(),

    studentName: student.name,

    admissionNumber: student.admissionNumber,

    sourceEnrollmentId: sourceEnrollment._id.toString(),

    sourceSessionId,

    sourceClassId: sourceEnrollment.classId.toString(),

    sourceSectionId: sourceEnrollment.sectionId.toString(),

    decision: item.decision,
  };

  if (sourceEnrollment.rollNumber !== undefined) {
    validItem.sourceRollNumber = sourceEnrollment.rollNumber;
  }

  if (requiresTargetEnrollment(item.decision)) {
    validItem.targetSessionId = targetSessionId;

    validItem.targetClassId = targetClassId!;

    validItem.targetSectionId = targetSectionId!;
  }

  if (item.rollNumber !== undefined) {
    validItem.rollNumber = item.rollNumber;
  }

  if (item.remarks?.trim()) {
    validItem.remarks = item.remarks.trim();
  }

  return {
    preview,
    validItem,
  };
};

/* =====================================================
   TARGET ROLL NUMBER VALIDATION

   Rules:
   1. Roll number must be unique inside:
      target session + target class + target section.
   2. Duplicate roll numbers inside the same bulk request
      are rejected.
   3. Roll number already used by an ACTIVE target
      enrollment is rejected.
===================================================== */

const validateTargetRollNumbers = async (
  schoolId: string,
  targetSessionId: string,
  items: ValidatedPromotionItem[],
  mongoSession?: ClientSession,
): Promise<Map<string, string[]>> => {
  const errors = new Map<string, string[]>();

  const addError = (studentId: string, message: string) => {
    const current = errors.get(studentId) ?? [];

    current.push(message);

    errors.set(studentId, current);
  };

  const targetItems = items.filter(
    (item) =>
      requiresTargetEnrollment(item.decision) &&
      item.targetClassId &&
      item.targetSectionId &&
      item.rollNumber !== undefined,
  );

  /* ===============================================
       DUPLICATES INSIDE CURRENT BULK REQUEST
    =============================================== */

  const grouped = new Map<string, ValidatedPromotionItem[]>();

  for (const item of targetItems) {
    const key = [
      targetSessionId,
      item.targetClassId,
      item.targetSectionId,
      item.rollNumber,
    ].join(":");

    const current = grouped.get(key) ?? [];

    current.push(item);

    grouped.set(key, current);
  }

  for (const itemsWithSameRoll of grouped.values()) {
    if (itemsWithSameRoll.length <= 1) {
      continue;
    }

    const first = itemsWithSameRoll[0];

    const message = `Duplicate roll number ${first?.rollNumber} in the same target class and section.`;

    for (const item of itemsWithSameRoll) {
      addError(item.studentId, message);
    }
  }

  /* ===============================================
       DUPLICATES AGAINST DATABASE
    =============================================== */

  for (const item of targetItems) {
    /*
     * If already invalid because the request itself
     * contains the same roll number multiple times,
     * DB lookup is unnecessary.
     */

    if (errors.has(item.studentId)) {
      continue;
    }
    const targetClassId = item.targetClassId;

    const targetSectionId = item.targetSectionId;

    const rollNumber = item.rollNumber;

    if (!targetClassId || !targetSectionId || rollNumber === undefined) {
      continue;
    }

    const existingQuery = StudentEnrollment.findOne({
      schoolId,

      sessionId: targetSessionId,

      classId: targetClassId,

      sectionId: targetSectionId,

      rollNumber,

      enrollmentStatus: "ACTIVE",
    }).select("_id studentId rollNumber");

    if (mongoSession) {
      existingQuery.session(mongoSession);
    }

    const existing = await existingQuery.lean();

    if (existing) {
      addError(
        item.studentId,
        `Roll number ${item.rollNumber} is already assigned in the target class and section.`,
      );
    }
  }

  return errors;
};

/* =====================================================
   SECTION CAPACITY VALIDATION

   Counts:
   1. Students already enrolled in target section
   2. Students in this bulk request going there
===================================================== */

const validateSectionCapacities = async (
  schoolId: string,
  targetSessionId: string,
  items: ValidatedPromotionItem[],
  mongoSession?: ClientSession,
): Promise<Map<string, string>> => {
  const errors = new Map<string, string>();

  const targetItems = items.filter(
    (item) => requiresTargetEnrollment(item.decision) && item.targetSectionId,
  );

  const grouped = new Map<string, ValidatedPromotionItem[]>();

  for (const item of targetItems) {
    const sectionId = item.targetSectionId!;

    const existing = grouped.get(sectionId) ?? [];

    existing.push(item);

    grouped.set(sectionId, existing);
  }

  for (const [sectionId, sectionItems] of grouped) {
    const sectionQuery = Section.findOne({
      _id: sectionId,

      schoolId,

      sessionId: targetSessionId,
    }).select("_id name capacity");

    if (mongoSession) {
      sectionQuery.session(mongoSession);
    }

    const section = await sectionQuery.lean();

    if (!section) {
      for (const item of sectionItems) {
        errors.set(item.studentId, "Target section not found.");
      }

      continue;
    }

    /*
     * No capacity configured means
     * no capacity restriction.
     */

    if (section.capacity === undefined || section.capacity === null) {
      continue;
    }

    const countQuery = StudentEnrollment.countDocuments({
      schoolId,

      sessionId: targetSessionId,

      sectionId,

      enrollmentStatus: "ACTIVE",
    });

    if (mongoSession) {
      countQuery.session(mongoSession);
    }

    const existingCount = await countQuery;

    const finalCount = existingCount + sectionItems.length;

    if (finalCount > section.capacity) {
      const message =
        `Section ${section.name} capacity exceeded. ` +
        `Capacity: ${section.capacity}, ` +
        `currently enrolled: ${existingCount}, ` +
        `new students: ${sectionItems.length}.`;

      for (const item of sectionItems) {
        errors.set(item.studentId, message);
      }
    }
  }

  return errors;
};

/* =====================================================
   COMPLETE VALIDATION
===================================================== */

const validatePromotionRequest = async (
  context: PromotionContext,

  data: IBulkStudentPromotionRequest,

  mongoSession?: ClientSession,
): Promise<ValidationResult> => {
  validateRequestBasics(data);

  validateObjectId(context.schoolId, "schoolId");

  validateObjectId(context.userId, "userId");

  await validateSessions(
    context.schoolId,
    data.sourceSessionId,
    data.targetSessionId,
    mongoSession,
  );

  const previews: IPromotionPreviewStudent[] = [];

  const validItems: ValidatedPromotionItem[] = [];

  for (const item of data.students) {
    const result = await validatePromotionItem(
      context,
      data.sourceSessionId,
      data.targetSessionId,
      item,
      mongoSession,
    );

    previews.push(result.preview);

    if (result.validItem) {
      validItems.push(result.validItem);
    }
  }

  /* ===============================================
       TARGET ROLL NUMBERS
    =============================================== */

  if (validItems.length > 0) {
    const rollErrors = await validateTargetRollNumbers(
      context.schoolId,
      data.targetSessionId,
      validItems,
      mongoSession,
    );

    if (rollErrors.size > 0) {
      for (const preview of previews) {
        const studentErrors = rollErrors.get(preview.studentId);

        if (studentErrors && studentErrors.length > 0) {
          preview.valid = false;

          preview.errors.push(...studentErrors);
        }
      }
    }
  }

  /*
   * Only students still valid after roll-number
   * validation should be counted for section
   * capacity.
   */

  const rollValidItems = validItems.filter((item) => {
    const preview = previews.find(
      (value) => value.studentId === item.studentId,
    );

    return preview?.valid === true;
  });

  /* ===============================================
       SECTION CAPACITY
    =============================================== */

  if (rollValidItems.length > 0) {
    const capacityErrors = await validateSectionCapacities(
      context.schoolId,
      data.targetSessionId,
      rollValidItems,
      mongoSession,
    );

    if (capacityErrors.size > 0) {
      for (const preview of previews) {
        const error = capacityErrors.get(preview.studentId);

        if (error) {
          preview.valid = false;

          preview.errors.push(error);
        }
      }
    }
  }

  /*
   * Rebuild validItems because some
   * students may have failed capacity
   * validation.
   */

  const finalValidItems = validItems.filter((item) => {
    const preview = previews.find(
      (value) => value.studentId === item.studentId,
    );

    return preview?.valid === true;
  });

  const valid = previews.filter((item) => item.valid).length;

  const invalid = previews.length - valid;

  return {
    preview: {
      total: previews.length,

      valid,

      invalid,

      canPromote: invalid === 0,

      students: previews,
    },

    validItems: finalValidItems,
  };
};

/* =====================================================
   PREVIEW BULK PROMOTION

   Does NOT modify database.
===================================================== */

export const previewBulkPromotion = async (
  schoolId: string,
  userId: string,
  data: IBulkStudentPromotionRequest,
): Promise<IPromotionPreviewResult> => {
  const result = await validatePromotionRequest(
    {
      schoolId,
      userId,
    },
    data,
  );

  return result.preview;
};

/* =====================================================
   EXECUTE ONE ITEM

   Must only run inside transaction.
===================================================== */

const executePromotionItem = async (
  context: PromotionContext,

  item: ValidatedPromotionItem,

  mongoSession: ClientSession,
): Promise<void> => {
  const now = new Date();

  /* ===============================================
       CLOSE SOURCE ENROLLMENT
    =============================================== */

  const sourceEnrollment = await StudentEnrollment.findOneAndUpdate(
    {
      _id: item.sourceEnrollmentId,

      schoolId: context.schoolId,

      studentId: item.studentId,

      enrollmentStatus: "ACTIVE",

      promotionStatus: "NOT_DECIDED",
    },

    {
      $set: {
        enrollmentStatus: "COMPLETED",

        promotionStatus: item.decision,

        promotionDate: now,

        updatedBy: new mongoose.Types.ObjectId(context.userId),

        ...(item.remarks
          ? {
              remarks: item.remarks,
            }
          : {}),
      },
    },

    {
      new: true,

      session: mongoSession,

      runValidators: true,
    },
  );

  if (!sourceEnrollment) {
    throw new Error(
      `Source enrollment could not be processed for student ${item.studentName}.`,
    );
  }

  /* ===============================================
       PROMOTED / RETAINED

       Create target enrollment.
    =============================================== */

  if (requiresTargetEnrollment(item.decision)) {
    if (!item.targetSessionId || !item.targetClassId || !item.targetSectionId) {
      throw new Error(
        `Target academic details missing for student ${item.studentName}.`,
      );
    }

    const enrollmentData: {
      schoolId: mongoose.Types.ObjectId;

      studentId: mongoose.Types.ObjectId;

      sessionId: mongoose.Types.ObjectId;

      classId: mongoose.Types.ObjectId;

      sectionId: mongoose.Types.ObjectId;

      rollNumber?: number;

      enrollmentStatus: "ACTIVE";

      promotionStatus: "NOT_DECIDED";

      promotedFromEnrollmentId: mongoose.Types.ObjectId;

      createdBy: mongoose.Types.ObjectId;
    } = {
      schoolId: new mongoose.Types.ObjectId(context.schoolId),

      studentId: new mongoose.Types.ObjectId(item.studentId),

      sessionId: new mongoose.Types.ObjectId(item.targetSessionId),

      classId: new mongoose.Types.ObjectId(item.targetClassId),

      sectionId: new mongoose.Types.ObjectId(item.targetSectionId),

      enrollmentStatus: "ACTIVE",

      promotionStatus: "NOT_DECIDED",

      promotedFromEnrollmentId: sourceEnrollment._id,

      createdBy: new mongoose.Types.ObjectId(context.userId),
    };

    if (item.rollNumber !== undefined) {
      enrollmentData.rollNumber = item.rollNumber;
    }

    const created = await StudentEnrollment.create([enrollmentData], {
      session: mongoSession,
    });

    const newEnrollment = created[0];

    if (!newEnrollment) {
      throw new Error(
        `Failed to create target enrollment for ${item.studentName}.`,
      );
    }

    /* =============================================
         SYNC STUDENT CURRENT SNAPSHOT
      ============================================= */

    const studentUpdate: {
      sessionId: mongoose.Types.ObjectId;

      classId: mongoose.Types.ObjectId;

      sectionId: mongoose.Types.ObjectId;

      status: "ACTIVE";

      rollNumber?: number;

      updatedBy: mongoose.Types.ObjectId;
    } = {
      sessionId: new mongoose.Types.ObjectId(item.targetSessionId),

      classId: new mongoose.Types.ObjectId(item.targetClassId),

      sectionId: new mongoose.Types.ObjectId(item.targetSectionId),

      status: "ACTIVE",

      updatedBy: new mongoose.Types.ObjectId(context.userId),
    };

    if (item.rollNumber !== undefined) {
      studentUpdate.rollNumber = item.rollNumber;
    }

    const studentSnapshotUpdate: {
      $set: typeof studentUpdate;

      $unset?: {
        rollNumber: 1;
      };
    } = {
      $set: studentUpdate,
    };

    /*
     * If no new roll number is assigned, remove
     * the old class roll number from Student's
     * current snapshot.
     *
     * Old roll number remains preserved safely
     * inside the completed source enrollment.
     */

    if (item.rollNumber === undefined) {
      studentSnapshotUpdate.$unset = {
        rollNumber: 1,
      };
    }

    const studentResult = await Student.updateOne(
      {
        _id: item.studentId,

        schoolId: context.schoolId,
      },

      studentSnapshotUpdate,

      {
        session: mongoSession,
      },
    );

    if (studentResult.matchedCount !== 1) {
      throw new Error(
        `Student snapshot could not be updated for ${item.studentName}.`,
      );
    }

    return;
  }

  /* ===============================================
       LEFT
    =============================================== */

  if (item.decision === "LEFT") {
    const result = await Student.updateOne(
      {
        _id: item.studentId,

        schoolId: context.schoolId,
      },
      {
        $set: {
          status: "LEFT",

          updatedBy: new mongoose.Types.ObjectId(context.userId),
        },
      },
      {
        session: mongoSession,
      },
    );

    if (result.matchedCount !== 1) {
      throw new Error(
        `Student status could not be updated for ${item.studentName}.`,
      );
    }

    return;
  }

  /* ===============================================
       TRANSFERRED
    =============================================== */

  if (item.decision === "TRANSFERRED") {
    const result = await Student.updateOne(
      {
        _id: item.studentId,

        schoolId: context.schoolId,
      },
      {
        $set: {
          status: "TRANSFERRED",

          updatedBy: new mongoose.Types.ObjectId(context.userId),
        },
      },
      {
        session: mongoSession,
      },
    );

    if (result.matchedCount !== 1) {
      throw new Error(
        `Student status could not be updated for ${item.studentName}.`,
      );
    }

    return;
  }

  /* ===============================================
       GRADUATED
    =============================================== */

  if (item.decision === "GRADUATED") {
    /*
     * If your Student model currently uses
     * PASSED instead of GRADUATED as status,
     * keep PASSED here.
     */

    const result = await Student.updateOne(
      {
        _id: item.studentId,

        schoolId: context.schoolId,
      },
      {
        $set: {
          status: "PASSED",

          updatedBy: new mongoose.Types.ObjectId(context.userId),
        },
      },
      {
        session: mongoSession,
      },
    );

    if (result.matchedCount !== 1) {
      throw new Error(
        `Student status could not be updated for ${item.studentName}.`,
      );
    }
  }
};

/* =====================================================
   BUILD SUMMARY
===================================================== */

const buildSummary = (
  items: ValidatedPromotionItem[],
): IBulkPromotionSummary => {
  const summary: IBulkPromotionSummary = {
    total: items.length,

    promoted: 0,

    retained: 0,

    transferred: 0,

    left: 0,

    graduated: 0,

    failed: 0,
  };

  for (const item of items) {
    switch (item.decision) {
      case "PROMOTED":
        summary.promoted += 1;

        break;

      case "RETAINED":
        summary.retained += 1;

        break;

      case "TRANSFERRED":
        summary.transferred += 1;

        break;

      case "LEFT":
        summary.left += 1;

        break;

      case "GRADUATED":
        summary.graduated += 1;

        break;
    }
  }

  return summary;
};

/* =====================================================
   EXECUTE BULK PROMOTION

   IMPORTANT:
   All-or-nothing MongoDB transaction.

   If any student fails:
   EVERYTHING rolls back.
===================================================== */

export const bulkPromoteStudents = async (
  schoolId: string,
  userId: string,
  data: IBulkStudentPromotionRequest,
): Promise<IBulkPromotionSummary> => {
  const mongoSession = await mongoose.startSession();

  try {
    let summary: IBulkPromotionSummary | null = null;

    await mongoSession.withTransaction(async () => {
      /*
       * Re-run ALL validations inside
       * transaction.
       *
       * Preview may have happened earlier,
       * but database may have changed since.
       */

      const validation = await validatePromotionRequest(
        {
          schoolId,
          userId,
        },
        data,
        mongoSession,
      );

      if (!validation.preview.canPromote) {
        const firstInvalid = validation.preview.students.find(
          (student) => !student.valid,
        );

        throw new Error(
          firstInvalid?.errors[0] ?? "Promotion validation failed.",
        );
      }

      if (validation.validItems.length !== data.students.length) {
        throw new Error("Some students failed promotion validation.");
      }

      /*
       * Execute sequentially.
       *
       * This is intentional:
       * easier transaction consistency,
       * deterministic failures and
       * avoids Promise.all transaction
       * concurrency problems.
       */

      for (const item of validation.validItems) {
        await executePromotionItem(
          {
            schoolId,
            userId,
          },
          item,
          mongoSession,
        );
      }

      summary = buildSummary(validation.validItems);
    });

    if (!summary) {
      throw new Error("Student promotion transaction did not complete.");
    }

    return summary;
  } finally {
    await mongoSession.endSession();
  }
};

/* =====================================================
   SINGLE STUDENT PROMOTION

   Uses same bulk engine so there is only
   ONE promotion implementation.
===================================================== */

export const promoteSingleStudent = async (
  schoolId: string,
  userId: string,
  studentId: string,
  data: ISingleStudentPromotionRequest,
): Promise<IBulkPromotionSummary> => {
  validateObjectId(studentId, "studentId");

  const item: IStudentPromotionItem = {
    studentId,

    decision: data.decision,
  };

  if (data.targetClassId) {
    item.targetClassId = data.targetClassId;
  }

  if (data.targetSectionId) {
    item.targetSectionId = data.targetSectionId;
  }

  if (data.rollNumber !== undefined) {
    item.rollNumber = data.rollNumber;
  }

  if (data.remarks?.trim()) {
    item.remarks = data.remarks.trim();
  }

  return bulkPromoteStudents(schoolId, userId, {
    sourceSessionId: data.sourceSessionId,

    targetSessionId: data.targetSessionId,

    students: [item],
  });
};
