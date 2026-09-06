// import mongoose from "mongoose";

// import {
//   Subject,
// } from "./subject.model";

// import {
//   AcademicSession,
// } from "../academicSession.model";

// import type {
//   CreateSubjectData,
//   UpdateSubjectData,
//   SubjectType,
// } from "./subject.types";


// // ============================================
// // VALID SUBJECT TYPES
// // ============================================

// const subjectTypes:
//   SubjectType[] = [
//     "CORE",
//     "LANGUAGE",
//     "PRACTICAL",
//     "ELECTIVE",
//   ];


// // ============================================
// // CREATE SUBJECT
// // ============================================

// export const createSubject = async (
//   schoolId: string,
//   data: CreateSubjectData
// ) => {
//   if (
//     !mongoose.Types.ObjectId.isValid(
//       schoolId
//     )
//   ) {
//     throw new Error(
//       "Invalid school ID"
//     );
//   }

//   if (
//     !mongoose.Types.ObjectId.isValid(
//       data.sessionId
//     )
//   ) {
//     throw new Error(
//       "Invalid academic session ID"
//     );
//   }


//   // Check session belongs to same school
//   const session =
//     await AcademicSession.findOne({
//       _id: data.sessionId,
//       schoolId,
//     });

//   if (!session) {
//     throw new Error(
//       "Academic session not found"
//     );
//   }


//   const subjectName =
//     data.name.trim();

//   if (!subjectName) {
//     throw new Error(
//       "Subject name is required"
//     );
//   }


//   const subjectCode =
//     data.code
//       .trim()
//       .toUpperCase();

//   if (!subjectCode) {
//     throw new Error(
//       "Subject code is required"
//     );
//   }


//   if (
//     !subjectTypes.includes(
//       data.subjectType
//     )
//   ) {
//     throw new Error(
//       "Invalid subject type"
//     );
//   }


//   // Duplicate code
//   const existingCode =
//     await Subject.findOne({
//       schoolId,
//       sessionId:
//         data.sessionId,
//       code:
//         subjectCode,
//     });

//   if (existingCode) {
//     throw new Error(
//       "Subject code already exists in this academic session"
//     );
//   }


//   // Duplicate name
//   const existingName =
//     await Subject.findOne({
//       schoolId,
//       sessionId:
//         data.sessionId,
//       name:
//         subjectName,
//     });

//   if (existingName) {
//     throw new Error(
//       "Subject already exists in this academic session"
//     );
//   }


//   const subject =
//     await Subject.create({
//       schoolId,

//       sessionId:
//         data.sessionId,

//       name:
//         subjectName,

//       code:
//         subjectCode,

//       subjectType:
//         data.subjectType,

//       ...(data.description
//         ? {
//             description:
//               data.description.trim(),
//           }
//         : {}),

//       isActive: true,
//     });


//   return subject;
// };


// // ============================================
// // GET ALL SUBJECTS
// // ============================================

// export const getSubjects = async (
//   schoolId: string,
//   sessionId?: string,
//   subjectType?: SubjectType,
//   isActive?: boolean
// ) => {
//   if (
//     !mongoose.Types.ObjectId.isValid(
//       schoolId
//     )
//   ) {
//     throw new Error(
//       "Invalid school ID"
//     );
//   }


//   const query: {
//     schoolId: string;

//     sessionId?: string;

//     subjectType?: SubjectType;

//     isActive?: boolean;
//   } = {
//     schoolId,
//   };


//   if (sessionId) {
//     if (
//       !mongoose.Types.ObjectId.isValid(
//         sessionId
//       )
//     ) {
//       throw new Error(
//         "Invalid academic session ID"
//       );
//     }

//     query.sessionId =
//       sessionId;
//   }


//   if (subjectType) {
//     if (
//       !subjectTypes.includes(
//         subjectType
//       )
//     ) {
//       throw new Error(
//         "Invalid subject type"
//       );
//     }

//     query.subjectType =
//       subjectType;
//   }


//   if (
//     isActive !== undefined
//   ) {
//     query.isActive =
//       isActive;
//   }


//   return Subject.find(query)
//     .sort({
//       name: 1,
//     })
//     .lean();
// };


// // ============================================
// // GET SUBJECT BY ID
// // ============================================

// export const getSubjectById =
//   async (
//     schoolId: string,
//     subjectId: string
//   ) => {
//     if (
//       !mongoose.Types.ObjectId.isValid(
//         schoolId
//       )
//     ) {
//       throw new Error(
//         "Invalid school ID"
//       );
//     }


//     if (
//       !mongoose.Types.ObjectId.isValid(
//         subjectId
//       )
//     ) {
//       throw new Error(
//         "Invalid subject ID"
//       );
//     }


//     const subject =
//       await Subject.findOne({
//         _id:
//           subjectId,

//         schoolId,
//       }).lean();


//     if (!subject) {
//       throw new Error(
//         "Subject not found"
//       );
//     }


//     return subject;
//   };


// // ============================================
// // UPDATE SUBJECT
// // ============================================

// export const updateSubject = async (
//   schoolId: string,
//   subjectId: string,
//   data: UpdateSubjectData
// ) => {
//   if (
//     !mongoose.Types.ObjectId.isValid(
//       schoolId
//     )
//   ) {
//     throw new Error(
//       "Invalid school ID"
//     );
//   }


//   if (
//     !mongoose.Types.ObjectId.isValid(
//       subjectId
//     )
//   ) {
//     throw new Error(
//       "Invalid subject ID"
//     );
//   }


//   const subject =
//     await Subject.findOne({
//       _id:
//         subjectId,

//       schoolId,
//     });


//   if (!subject) {
//     throw new Error(
//       "Subject not found"
//     );
//   }


//   // ========================================
//   // UPDATE NAME
//   // ========================================

//   if (
//     data.name !== undefined
//   ) {
//     const name =
//       data.name.trim();

//     if (!name) {
//       throw new Error(
//         "Subject name cannot be empty"
//       );
//     }


//     const duplicateName =
//       await Subject.findOne({
//         _id: {
//           $ne:
//             subjectId,
//         },

//         schoolId,

//         sessionId:
//           subject.sessionId,

//         name,
//       });


//     if (duplicateName) {
//       throw new Error(
//         "Subject already exists in this academic session"
//       );
//     }


//     subject.name =
//       name;
//   }


//   // ========================================
//   // UPDATE CODE
//   // ========================================

//   if (
//     data.code !== undefined
//   ) {
//     const code =
//       data.code
//         .trim()
//         .toUpperCase();

//     if (!code) {
//       throw new Error(
//         "Subject code cannot be empty"
//       );
//     }


//     const duplicateCode =
//       await Subject.findOne({
//         _id: {
//           $ne:
//             subjectId,
//         },

//         schoolId,

//         sessionId:
//           subject.sessionId,

//         code,
//       });


//     if (duplicateCode) {
//       throw new Error(
//         "Subject code already exists in this academic session"
//       );
//     }


//     subject.code =
//       code;
//   }


//   // ========================================
//   // DESCRIPTION
//   // ========================================

//   if (
//     data.description !==
//     undefined
//   ) {
//     subject.description =
//       data.description.trim();
//   }


//   // ========================================
//   // SUBJECT TYPE
//   // ========================================

//   if (
//     data.subjectType !==
//     undefined
//   ) {
//     if (
//       !subjectTypes.includes(
//         data.subjectType
//       )
//     ) {
//       throw new Error(
//         "Invalid subject type"
//       );
//     }


//     subject.subjectType =
//       data.subjectType;
//   }


//   await subject.save();

//   return subject;
// };


// // ============================================
// // UPDATE SUBJECT STATUS
// // ============================================

// export const updateSubjectStatus =
//   async (
//     schoolId: string,
//     subjectId: string,
//     isActive: boolean
//   ) => {
//     if (
//       !mongoose.Types.ObjectId.isValid(
//         schoolId
//       )
//     ) {
//       throw new Error(
//         "Invalid school ID"
//       );
//     }


//     if (
//       !mongoose.Types.ObjectId.isValid(
//         subjectId
//       )
//     ) {
//       throw new Error(
//         "Invalid subject ID"
//       );
//     }


//     if (
//       typeof isActive !==
//       "boolean"
//     ) {
//       throw new Error(
//         "isActive must be boolean"
//       );
//     }


//     const subject =
//       await Subject.findOneAndUpdate(
//         {
//           _id:
//             subjectId,

//           schoolId,
//         },

//         {
//           isActive,
//         },

//         {
//           new: true,
//           runValidators: true,
//         }
//       );


//     if (!subject) {
//       throw new Error(
//         "Subject not found"
//       );
//     }


//     return subject;
//   };










import mongoose from "mongoose";

import {
  Subject,
} from "./subject.model";

import {
  AcademicSession,
} from "../academicSession.model";

import {
  SubjectAssignment,
} from "../subjectAssignments/subjectAssignment.model";

import Student from "../../students/student.model";

import type {
  CreateSubjectData,
  UpdateSubjectData,
  SubjectType,
} from "./subject.types";


// ============================================
// VALID SUBJECT TYPES
// ============================================

const subjectTypes:
  SubjectType[] = [
    "CORE",
    "LANGUAGE",
    "PRACTICAL",
    "ELECTIVE",
  ];


// ============================================
// CREATE SUBJECT
// ============================================

export const createSubject = async (
  schoolId: string,
  data: CreateSubjectData
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
      data.sessionId
    )
  ) {
    throw new Error(
      "Invalid academic session ID"
    );
  }


  // Check session belongs to same school
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


  const subjectName =
    data.name.trim();

  if (!subjectName) {
    throw new Error(
      "Subject name is required"
    );
  }


  const subjectCode =
    data.code
      .trim()
      .toUpperCase();

  if (!subjectCode) {
    throw new Error(
      "Subject code is required"
    );
  }


  if (
    !subjectTypes.includes(
      data.subjectType
    )
  ) {
    throw new Error(
      "Invalid subject type"
    );
  }


  // Duplicate code
  const existingCode =
    await Subject.findOne({
      schoolId,
      sessionId:
        data.sessionId,
      code:
        subjectCode,
    });

  if (existingCode) {
    throw new Error(
      "Subject code already exists in this academic session"
    );
  }


  // Duplicate name
  const existingName =
    await Subject.findOne({
      schoolId,
      sessionId:
        data.sessionId,
      name:
        subjectName,
    });

  if (existingName) {
    throw new Error(
      "Subject already exists in this academic session"
    );
  }


  const subject =
    await Subject.create({
      schoolId,

      sessionId:
        data.sessionId,

      name:
        subjectName,

      code:
        subjectCode,

      subjectType:
        data.subjectType,

      ...(data.description
        ? {
            description:
              data.description.trim(),
          }
        : {}),

      isActive: true,
    });


  return subject;
};


// ============================================
// GET ALL SUBJECTS
// ============================================

export const getSubjects = async (
  schoolId: string,
  sessionId?: string,
  subjectType?: SubjectType,
  isActive?: boolean
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

    subjectType?: SubjectType;

    isActive?: boolean;
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


  if (subjectType) {
    if (
      !subjectTypes.includes(
        subjectType
      )
    ) {
      throw new Error(
        "Invalid subject type"
      );
    }

    query.subjectType =
      subjectType;
  }


  if (
    isActive !== undefined
  ) {
    query.isActive =
      isActive;
  }


  return Subject.find(query)
    .sort({
      name: 1,
    })
    .lean();
};


// ============================================
// GET SUBJECT BY ID
// ============================================

export const getSubjectById =
  async (
    schoolId: string,
    subjectId: string
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
        subjectId
      )
    ) {
      throw new Error(
        "Invalid subject ID"
      );
    }


    const subject =
      await Subject.findOne({
        _id:
          subjectId,

        schoolId,
      }).lean();


    if (!subject) {
      throw new Error(
        "Subject not found"
      );
    }


    return subject;
  };


// ============================================
// UPDATE SUBJECT
// ============================================

export const updateSubject = async (
  schoolId: string,
  subjectId: string,
  data: UpdateSubjectData
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
      subjectId
    )
  ) {
    throw new Error(
      "Invalid subject ID"
    );
  }


  const subject =
    await Subject.findOne({
      _id:
        subjectId,

      schoolId,
    });


  if (!subject) {
    throw new Error(
      "Subject not found"
    );
  }


  // ========================================
  // UPDATE NAME
  // ========================================

  if (
    data.name !== undefined
  ) {
    const name =
      data.name.trim();

    if (!name) {
      throw new Error(
        "Subject name cannot be empty"
      );
    }


    const duplicateName =
      await Subject.findOne({
        _id: {
          $ne:
            subjectId,
        },

        schoolId,

        sessionId:
          subject.sessionId,

        name,
      });


    if (duplicateName) {
      throw new Error(
        "Subject already exists in this academic session"
      );
    }


    subject.name =
      name;
  }


  // ========================================
  // UPDATE CODE
  // ========================================

  if (
    data.code !== undefined
  ) {
    const code =
      data.code
        .trim()
        .toUpperCase();

    if (!code) {
      throw new Error(
        "Subject code cannot be empty"
      );
    }


    const duplicateCode =
      await Subject.findOne({
        _id: {
          $ne:
            subjectId,
        },

        schoolId,

        sessionId:
          subject.sessionId,

        code,
      });


    if (duplicateCode) {
      throw new Error(
        "Subject code already exists in this academic session"
      );
    }


    subject.code =
      code;
  }


  // ========================================
  // DESCRIPTION
  // ========================================

  if (
    data.description !==
    undefined
  ) {
    subject.description =
      data.description.trim();
  }


  // ========================================
  // SUBJECT TYPE
  // ========================================

  if (
    data.subjectType !==
    undefined
  ) {
    if (
      !subjectTypes.includes(
        data.subjectType
      )
    ) {
      throw new Error(
        "Invalid subject type"
      );
    }


    subject.subjectType =
      data.subjectType;
  }


  await subject.save();

  return subject;
};


// ============================================
// UPDATE SUBJECT STATUS
// ============================================

export const updateSubjectStatus =
  async (
    schoolId: string,
    subjectId: string,
    isActive: boolean
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
        subjectId
      )
    ) {
      throw new Error(
        "Invalid subject ID"
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


    const subject =
      await Subject.findOneAndUpdate(
        {
          _id:
            subjectId,

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


    if (!subject) {
      throw new Error(
        "Subject not found"
      );
    }


    return subject;
  };


// ============================================
// STUDENT - MY SUBJECTS
//
// Student identity comes from JWT.
// Session/Class/Section are derived from
// active Student profile.
// ============================================

export const getMySubjects =
  async (
    schoolId: string,
    studentId: string
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
        studentId
      )
    ) {
      throw new Error(
        "Invalid student ID"
      );
    }


    const student =
      await Student.findOne({
        _id: studentId,

        schoolId,

        status: "ACTIVE",
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


    if (!student) {
      throw new Error(
        "Student profile not found or inactive"
      );
    }


    const getId = (
      value: unknown
    ): string => {

      if (
        value &&
        typeof value === "object" &&
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


      return String(value);
    };


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


    const assignments =
      await SubjectAssignment.find({
        schoolId,

        sessionId,

        classId,

        sectionId,

        isActive: true,
      })
        .populate({
          path: "subjectId",

          match: {
            isActive: true,
          },

          select:
            "name code subjectType description",
        })
        .populate(
          "teacherId",
          "name employeeId email mobile profileImage"
        )
        .sort({
          createdAt: 1,
        })
        .lean();


    const subjects =
      assignments
        .filter(
          (assignment) =>
            assignment.subjectId
        )
        .map(
          (assignment) => ({
            assignmentId:
              assignment._id,

            subject:
              assignment.subjectId,

            teacher:
              assignment.teacherId,

            weeklyPeriods:
              assignment.weeklyPeriods,
          })
        );


    return {
      student,

      subjects,
    };
  };
