import mongoose from "mongoose";

import {
  Section,
} from "./section.model";

import {
  AcademicSession,
} from "../academicSession.model";

import {
  ClassModel,
} from "../../academic/classes/class.model";

import type {
  CreateSectionData,
  UpdateSectionData,
} from "./section.types";


// ============================================
// CREATE SECTION
// ============================================

export const createSection = async (
  schoolId: string,
  data: CreateSectionData
) => {
  // School
  if (
    !mongoose.Types.ObjectId.isValid(
      schoolId
    )
  ) {
    throw new Error(
      "Invalid school ID"
    );
  }

  // Session
  if (
    !mongoose.Types.ObjectId.isValid(
      data.sessionId
    )
  ) {
    throw new Error(
      "Invalid academic session ID"
    );
  }

  // Class
  if (
    !mongoose.Types.ObjectId.isValid(
      data.classId
    )
  ) {
    throw new Error(
      "Invalid class ID"
    );
  }


  // ==========================================
  // SESSION SAME SCHOOL KI HONI CHAHIYE
  // ==========================================

  const session =
    await AcademicSession.findOne({
      _id: data.sessionId,
      schoolId,
    });

  if (!session) {
    throw new Error(
      "Academic session not found"
    );
  }


  // ==========================================
  // CLASS SAME SCHOOL + SESSION KI HONI CHAHIYE
  // ==========================================

  const classData =
    await ClassModel.findOne({
      _id: data.classId,
      schoolId,
      sessionId:
        data.sessionId,
    });

  if (!classData) {
    throw new Error(
      "Class not found in this academic session"
    );
  }


  const sectionName =
    data.name.trim();

  if (!sectionName) {
    throw new Error(
      "Section name is required"
    );
  }


  // ==========================================
  // DUPLICATE SECTION CHECK
  // ==========================================

  const existingSection =
    await Section.findOne({
      schoolId,
      sessionId:
        data.sessionId,
      classId:
        data.classId,
      name:
        sectionName,
    });

  if (existingSection) {
    throw new Error(
      "Section already exists in this class"
    );
  }


  // ==========================================
  // CAPACITY VALIDATION
  // ==========================================

  if (
    data.capacity !== undefined &&
    (
      typeof data.capacity !==
        "number" ||
      data.capacity < 1
    )
  ) {
    throw new Error(
      "Capacity must be greater than 0"
    );
  }


  const section =
    await Section.create({
      schoolId,

      sessionId:
        data.sessionId,

      classId:
        data.classId,

      name:
        sectionName,

      ...(data.roomNumber
        ? {
            roomNumber:
              data.roomNumber.trim(),
          }
        : {}),

      ...(data.capacity !==
      undefined
        ? {
            capacity:
              data.capacity,
          }
        : {}),

      isActive: true,
    });

  return section;
};


// ============================================
// GET ALL SECTIONS
// ============================================

export const getSections = async (
  schoolId: string,
  sessionId?: string,
  classId?: string
) => {
  if (
    !mongoose.Types.ObjectId.isValid(
      schoolId
    )
  ) {
    throw new Error(
      "Invalid school ID"
    );
  }


  const query: {
    schoolId: string;
    sessionId?: string;
    classId?: string;
  } = {
    schoolId,
  };


  if (sessionId) {
    if (
      !mongoose.Types.ObjectId.isValid(
        sessionId
      )
    ) {
      throw new Error(
        "Invalid academic session ID"
      );
    }

    query.sessionId =
      sessionId;
  }


  if (classId) {
    if (
      !mongoose.Types.ObjectId.isValid(
        classId
      )
    ) {
      throw new Error(
        "Invalid class ID"
      );
    }

    query.classId =
      classId;
  }


  return Section.find(query)
    .sort({
      name: 1,
    })
    .lean();
};


// ============================================
// GET SECTION BY ID
// ============================================

export const getSectionById =
  async (
    schoolId: string,
    sectionId: string
  ) => {
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
        sectionId
      )
    ) {
      throw new Error(
        "Invalid section ID"
      );
    }


    const section =
      await Section.findOne({
        _id:
          sectionId,

        schoolId,
      }).lean();


    if (!section) {
      throw new Error(
        "Section not found"
      );
    }


    return section;
  };


// ============================================
// UPDATE SECTION
// ============================================

export const updateSection = async (
  schoolId: string,
  sectionId: string,
  data: UpdateSectionData
) => {
  if (
    !mongoose.Types.ObjectId.isValid(
      sectionId
    )
  ) {
    throw new Error(
      "Invalid section ID"
    );
  }


  const section =
    await Section.findOne({
      _id:
        sectionId,

      schoolId,
    });


  if (!section) {
    throw new Error(
      "Section not found"
    );
  }


  // ==========================================
  // UPDATE NAME
  // ==========================================

  if (
    data.name !== undefined
  ) {
    const name =
      data.name.trim();

    if (!name) {
      throw new Error(
        "Section name cannot be empty"
      );
    }


    const duplicate =
      await Section.findOne({
        _id: {
          $ne:
            sectionId,
        },

        schoolId,

        sessionId:
          section.sessionId,

        classId:
          section.classId,

        name,
      });


    if (duplicate) {
      throw new Error(
        "Section already exists in this class"
      );
    }


    section.name =
      name;
  }


  // ==========================================
  // ROOM NUMBER
  // ==========================================

  if (
    data.roomNumber !== undefined
  ) {
    section.roomNumber =
      data.roomNumber.trim();
  }


  // ==========================================
  // CAPACITY
  // ==========================================

  if (
    data.capacity !== undefined
  ) {
    if (
      typeof data.capacity !==
        "number" ||
      data.capacity < 1
    ) {
      throw new Error(
        "Capacity must be greater than 0"
      );
    }

    section.capacity =
      data.capacity;
  }


  await section.save();

  return section;
};


// ============================================
// UPDATE SECTION STATUS
// ============================================

export const updateSectionStatus =
  async (
    schoolId: string,
    sectionId: string,
    isActive: boolean
  ) => {
    if (
      !mongoose.Types.ObjectId.isValid(
        sectionId
      )
    ) {
      throw new Error(
        "Invalid section ID"
      );
    }


    if (
      typeof isActive !==
      "boolean"
    ) {
      throw new Error(
        "isActive must be boolean"
      );
    }


    const section =
      await Section.findOneAndUpdate(
        {
          _id:
            sectionId,

          schoolId,
        },

        {
          isActive,
        },

        {
          new: true,
          runValidators: true,
        }
      );


    if (!section) {
      throw new Error(
        "Section not found"
      );
    }


    return section;
  };