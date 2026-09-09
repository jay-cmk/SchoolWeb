


import mongoose from "mongoose";

import {
  SubjectAssignment,
} from "./subjectAssignment.model";
import {
  AcademicSession,
} from "../academicSession.model";
import {
  ClassModel,
} from "../classes/class.model";
import {
  Section,
} from "../sections/section.model";
import {
  Subject,
} from "../subjects/subject.model";
import {
  Teacher,
} from "../../teachers/teacher.model";

import type {
  CreateSubjectAssignmentData,
  GetSubjectAssignmentsFilters,
  SubjectAssignmentStream,
  SubjectAssignmentType,
  UpdateSubjectAssignmentData,
} from "./subjectAssignment.types";

const ASSIGNMENT_TYPES: SubjectAssignmentType[] = [
  "CLASS",
  "STREAM",
];

const STUDENT_STREAMS: SubjectAssignmentStream[] = [
  "SCIENCE",
  "COMMERCE",
  "ARTS",
  "VOCATIONAL",
];

const isValidId = (value: string): boolean =>
  mongoose.Types.ObjectId.isValid(value);

const normalizeClassName = (value: string): string =>
  value.toLowerCase().replace("class", "").trim();

const isSeniorSecondaryClass = (className: string): boolean =>
  ["11", "12"].includes(normalizeClassName(className));

const validateAssignmentScope = (
  assignmentType: SubjectAssignmentType,
  stream: SubjectAssignmentStream | undefined,
  className: string,
): void => {
  if (!ASSIGNMENT_TYPES.includes(assignmentType)) {
    throw new Error("Invalid subject assignment type");
  }

  if (assignmentType === "CLASS") {
    if (stream !== undefined) {
      throw new Error("Stream must not be provided for a class assignment");
    }
    return;
  }

  if (!isSeniorSecondaryClass(className)) {
    throw new Error(
      "Stream subject assignments are allowed only for Class 11 and Class 12",
    );
  }

  if (!stream || !STUDENT_STREAMS.includes(stream)) {
    throw new Error("A valid stream is required for a stream assignment");
  }
};

const populateAssignment = (query: any) =>
  query
    .populate("sessionId", "name startDate endDate isCurrent")
    .populate("subjectId", "name code subjectType")
    .populate("classId", "name order")
    .populate("sectionId", "name roomNumber")
    .populate(
      "teacherId",
      "name employeeId email mobile profileImage",
    );

export const createSubjectAssignment = async (
  schoolId: string,
  data: CreateSubjectAssignmentData,
) => {
  if (!isValidId(schoolId)) {
    throw new Error("Invalid school ID");
  }

  const ids = [
    data.sessionId,
    data.subjectId,
    data.classId,
    data.sectionId,
    data.teacherId,
  ];

  if (ids.some((id) => !isValidId(id))) {
    throw new Error("One or more assignment IDs are invalid");
  }

  const [session, classData, section, subject, teacher] =
    await Promise.all([
      AcademicSession.findOne({
        _id: data.sessionId,
        schoolId,
      }).lean(),
      ClassModel.findOne({
        _id: data.classId,
        schoolId,
        sessionId: data.sessionId,
      }).lean(),
      Section.findOne({
        _id: data.sectionId,
        schoolId,
        sessionId: data.sessionId,
        classId: data.classId,
      }).lean(),
      Subject.findOne({
        _id: data.subjectId,
        schoolId,
        sessionId: data.sessionId,
      }).lean(),
      Teacher.findOne({
        _id: data.teacherId,
        schoolId,
        isActive: true,
      }).lean(),
    ]);

  if (!session) throw new Error("Academic session not found");
  if (!classData) {
    throw new Error("Class not found in this academic session");
  }
  if (!section) throw new Error("Section not found in this class");
  if (!subject) {
    throw new Error("Subject not found in this academic session");
  }
  if (!teacher) throw new Error("Teacher not found or inactive");

  if (typeof data.weeklyPeriods !== "number" || data.weeklyPeriods < 1) {
    throw new Error("Weekly periods must be greater than 0");
  }

  const assignmentType = data.assignmentType ?? "CLASS";
  const stream =
    assignmentType === "STREAM" ? data.stream : undefined;

  validateAssignmentScope(assignmentType, stream, classData.name);

  const duplicateFilter: Record<string, unknown> = {
    schoolId,
    sessionId: data.sessionId,
    subjectId: data.subjectId,
    classId: data.classId,
    sectionId: data.sectionId,
    assignmentType,
    stream: stream ?? { $exists: false },
  };

  const existing = await SubjectAssignment.findOne(duplicateFilter).lean();

  if (existing) {
    throw new Error(
      assignmentType === "STREAM"
        ? `Subject is already assigned to this class, section and ${stream} stream`
        : "Subject is already assigned to this class and section",
    );
  }

  const assignment = await SubjectAssignment.create({
    schoolId,
    sessionId: data.sessionId,
    subjectId: data.subjectId,
    classId: data.classId,
    sectionId: data.sectionId,
    teacherId: data.teacherId,
    assignmentType,
    ...(stream ? { stream } : {}),
    weeklyPeriods: data.weeklyPeriods,
    isActive: true,
  });

  return populateAssignment(
    SubjectAssignment.findById(assignment._id),
  ).lean();
};

export const getSubjectAssignments = async (
  schoolId: string,
  filters?: GetSubjectAssignmentsFilters,
) => {
  if (!isValidId(schoolId)) throw new Error("Invalid school ID");

  const query: Record<string, unknown> = { schoolId };
  const idFilters = [
    ["sessionId", filters?.sessionId],
    ["subjectId", filters?.subjectId],
    ["classId", filters?.classId],
    ["sectionId", filters?.sectionId],
    ["teacherId", filters?.teacherId],
  ] as const;

  for (const [key, value] of idFilters) {
    if (!value) continue;
    if (!isValidId(value)) throw new Error(`Invalid ${key}`);
    query[key] = value;
  }

  if (filters?.assignmentType) {
    if (!ASSIGNMENT_TYPES.includes(filters.assignmentType)) {
      throw new Error("Invalid subject assignment type");
    }
    query.assignmentType = filters.assignmentType;
  }

  if (filters?.stream) {
    if (!STUDENT_STREAMS.includes(filters.stream)) {
      throw new Error("Invalid student stream");
    }
    query.stream = filters.stream;
  }

  if (filters?.isActive !== undefined) {
    query.isActive = filters.isActive;
  }

  return populateAssignment(SubjectAssignment.find(query))
    .sort({ createdAt: -1 })
    .lean();
};

export const getMySubjectAssignments = async (
  schoolId: string,
  teacherId: string,
  userId: string,
) => {
  if (!isValidId(schoolId)) throw new Error("Invalid school ID");
  if (!isValidId(teacherId)) throw new Error("Invalid teacher ID");
  if (!isValidId(userId)) throw new Error("Invalid user ID");

  const teacher = await Teacher.findOne({
    _id: teacherId,
    schoolId,
    userId,
    isActive: true,
  })
    .select("_id name employeeId email")
    .lean();

  if (!teacher) throw new Error("Teacher profile not found or inactive");

  const assignments = await populateAssignment(
    SubjectAssignment.find({
      schoolId,
      teacherId,
      isActive: true,
    }),
  )
    .sort({ createdAt: -1 })
    .lean();

  return { teacher, assignments };
};

export const getSubjectAssignmentById = async (
  schoolId: string,
  assignmentId: string,
) => {
  if (!isValidId(schoolId)) throw new Error("Invalid school ID");
  if (!isValidId(assignmentId)) throw new Error("Invalid assignment ID");

  const assignment = await populateAssignment(
    SubjectAssignment.findOne({
      _id: assignmentId,
      schoolId,
    }),
  ).lean();

  if (!assignment) throw new Error("Subject assignment not found");
  return assignment;
};

export const updateSubjectAssignment = async (
  schoolId: string,
  assignmentId: string,
  data: UpdateSubjectAssignmentData,
) => {
  if (!isValidId(schoolId)) throw new Error("Invalid school ID");
  if (!isValidId(assignmentId)) throw new Error("Invalid assignment ID");

  const assignment = await SubjectAssignment.findOne({
    _id: assignmentId,
    schoolId,
  });

  if (!assignment) throw new Error("Subject assignment not found");

  if (data.teacherId !== undefined) {
    if (!isValidId(data.teacherId)) throw new Error("Invalid teacher ID");
    const teacher = await Teacher.exists({
      _id: data.teacherId,
      schoolId,
      isActive: true,
    });
    if (!teacher) throw new Error("Teacher not found or inactive");
    assignment.teacherId = new mongoose.Types.ObjectId(data.teacherId);
  }

  if (data.weeklyPeriods !== undefined) {
    if (typeof data.weeklyPeriods !== "number" || data.weeklyPeriods < 1) {
      throw new Error("Weekly periods must be greater than 0");
    }
    assignment.weeklyPeriods = data.weeklyPeriods;
  }

  if (data.assignmentType !== undefined || data.stream !== undefined) {
    const classData = await ClassModel.findOne({
      _id: assignment.classId,
      schoolId,
      sessionId: assignment.sessionId,
    })
      .select("name")
      .lean();

    if (!classData) throw new Error("Assignment class not found");

    const assignmentType =
      data.assignmentType ?? assignment.assignmentType ?? "CLASS";
    const stream =
      assignmentType === "STREAM"
        ? data.stream === null
          ? undefined
          : data.stream ?? assignment.stream
        : undefined;

    validateAssignmentScope(assignmentType, stream, classData.name);

    const duplicate = await SubjectAssignment.findOne({
      _id: { $ne: assignment._id },
      schoolId,
      sessionId: assignment.sessionId,
      subjectId: assignment.subjectId,
      classId: assignment.classId,
      sectionId: assignment.sectionId,
      assignmentType,
      stream: stream ?? { $exists: false },
    }).lean();

    if (duplicate) {
      throw new Error("A matching subject assignment already exists");
    }

    assignment.assignmentType = assignmentType;
    if (stream) assignment.stream = stream;
    else assignment.set("stream", undefined);
  }

  await assignment.save();

  return populateAssignment(
    SubjectAssignment.findById(assignment._id),
  ).lean();
};

export const updateSubjectAssignmentStatus = async (
  schoolId: string,
  assignmentId: string,
  isActive: boolean,
) => {
  if (!isValidId(schoolId)) throw new Error("Invalid school ID");
  if (!isValidId(assignmentId)) throw new Error("Invalid assignment ID");
  if (typeof isActive !== "boolean") {
    throw new Error("isActive must be boolean");
  }

  const assignment = await SubjectAssignment.findOneAndUpdate(
    { _id: assignmentId, schoolId },
    { isActive },
    { new: true, runValidators: true },
  );

  if (!assignment) throw new Error("Subject assignment not found");
  return assignment;
};
