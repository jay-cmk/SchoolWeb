// import mongoose from "mongoose";

// import { ClassModel } from "./class.model";
// import { AcademicSession } from "../academicSession.model";

// export interface CreateClassData {
//   name: string;
//   academicSessionId: string;
//   classTeacherId?: string;
//   description?: string;
//   status?: "ACTIVE" | "INACTIVE";
// }

// export interface UpdateClassData {
//   name?: string;
//   academicSessionId?: string;
//   classTeacherId?: string | null;
//   description?: string;
//   status?: "ACTIVE" | "INACTIVE";
// }


// // ===============================
// // CREATE CLASS
// // ===============================

// export const createClass = async (
//   schoolId: string,
//   data: CreateClassData
// ) => {
//   // ===============================
//   // VALIDATE SCHOOL ID
//   // ===============================

//   if (
//     !mongoose.Types.ObjectId.isValid(
//       schoolId
//     )
//   ) {
//     throw new Error(
//       "Invalid school ID"
//     );
//   }

//   // ===============================
//   // VALIDATE SESSION ID
//   // ===============================

//   if (
//     !mongoose.Types.ObjectId.isValid(
//       data.sessionId
//     )
//   ) {
//     throw new Error(
//       "Invalid academic session ID"
//     );
//   }

//   // ===============================
//   // CHECK SESSION BELONGS TO SCHOOL
//   // ===============================

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

//   // ===============================
//   // VALIDATE CLASS NAME
//   // ===============================

//   const className =
//     data.name.trim();

//   if (!className) {
//     throw new Error(
//       "Class name is required"
//     );
//   }

//   // ===============================
//   // CHECK DUPLICATE CLASS
//   // ===============================

//   const existingClass =
//     await ClassModel.findOne({
//       schoolId,
//       sessionId: data.sessionId,
//       name: className,
//     });

//   if (existingClass) {
//     throw new Error(
//       "Class already exists in this academic session"
//     );
//   }

//   // ===============================
//   // VALIDATE ORDER
//   // ===============================

//   if (
//     data.order !== undefined &&
//     (
//       typeof data.order !== "number" ||
//       data.order < 0
//     )
//   ) {
//     throw new Error(
//       "Class order must be a valid positive number"
//     );
//   }

//   // ===============================
//   // CREATE CLASS
//   // ===============================

//   const newClass =
//     await ClassModel.create({
//       schoolId,
//       sessionId: data.sessionId,
//       name: className,

//       ...(data.order !== undefined
//         ? {
//             order: data.order,
//           }
//         : {}),

//       isActive: true,
//     });

//   return newClass;
// };


// // ===============================
// // GET ALL CLASSES
// // ===============================

// export const getClasses = async (
//   schoolId: string,
//   sessionId?: string
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

//   const classes =
//     await ClassModel.find(query)
//       .populate(
//         "sessionId",
//         "name startDate endDate isCurrent"
//       )
//       .sort({
//         order: 1,
//         name: 1,
//       })
//       .lean();

//   return classes;
// };


// // ===============================
// // GET CLASS BY ID
// // ===============================

// export const getClassById = async (
//   schoolId: string,
//   classId: string
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
//       classId
//     )
//   ) {
//     throw new Error(
//       "Invalid class ID"
//     );
//   }

//   const classData =
//     await ClassModel.findOne({
//       _id: classId,
//       schoolId,
//     })
//       .populate(
//         "sessionId",
//         "name startDate endDate isCurrent"
//       )
//       .lean();

//   if (!classData) {
//     throw new Error(
//       "Class not found"
//     );
//   }

//   return classData;
// };


// // ===============================
// // UPDATE CLASS
// // ===============================

// export const updateClass = async (
//   schoolId: string,
//   classId: string,
//   data: UpdateClassData
// ) => {
//   if (
//     !mongoose.Types.ObjectId.isValid(
//       classId
//     )
//   ) {
//     throw new Error(
//       "Invalid class ID"
//     );
//   }

//   const existingClass =
//     await ClassModel.findOne({
//       _id: classId,
//       schoolId,
//     });

//   if (!existingClass) {
//     throw new Error(
//       "Class not found"
//     );
//   }

//   // ===============================
//   // UPDATE ACADEMIC SESSION
//   // ===============================

//   if (data.academicSessionId) {
//     if (
//       !mongoose.Types.ObjectId.isValid(
//         data.academicSessionId
//       )
//     ) {
//       throw new Error(
//         "Invalid academic session ID"
//       );
//     }

//     const session =
//       await AcademicSession.findOne({
//         _id: data.academicSessionId,
//         schoolId,
//       });

//     if (!session) {
//       throw new Error(
//         "Academic session not found"
//       );
//     }

//     existingClass.academicSessionId =
//       new mongoose.Types.ObjectId(
//         data.academicSessionId
//       );
//   }

//   // ===============================
//   // UPDATE NAME
//   // ===============================

//   if (data.name !== undefined) {
//     existingClass.name =
//       data.name.trim();
//   }

//   // ===============================
//   // UPDATE DESCRIPTION
//   // ===============================

//   if (data.description !== undefined) {
//     existingClass.description =
//       data.description.trim();
//   }

//   // ===============================
//   // UPDATE STATUS
//   // ===============================

//   if (data.status !== undefined) {
//     existingClass.status =
//       data.status;
//   }

//   // ===============================
//   // UPDATE / REMOVE CLASS TEACHER
//   // ===============================

//   if (data.classTeacherId !== undefined) {
//     // Remove teacher
//     if (data.classTeacherId === null) {
//       await ClassModel.updateOne(
//         {
//           _id: classId,
//           schoolId,
//         },
//         {
//           $unset: {
//             classTeacherId: 1,
//           },
//         }
//       );
//     } else {
//       // Validate teacher ID
//       if (
//         !mongoose.Types.ObjectId.isValid(
//           data.classTeacherId
//         )
//       ) {
//         throw new Error(
//           "Invalid class teacher ID"
//         );
//       }

//       existingClass.classTeacherId =
//         new mongoose.Types.ObjectId(
//           data.classTeacherId
//         );
//     }
//   }

//   await existingClass.save();

//   const updatedClass =
//     await ClassModel.findOne({
//       _id: classId,
//       schoolId,
//     })
//       .populate(
//         "academicSessionId",
//         "name startDate endDate isCurrent academicStatus"
//       )
//       .populate(
//         "classTeacherId",
//         "name email"
//       );

//   return updatedClass;
// };


// export const updateClassStatus = async (
//   schoolId: string,
//   classId: string,
//   isActive: boolean
// ) => {
//   if (
//     !mongoose.Types.ObjectId.isValid(
//       classId
//     )
//   ) {
//     throw new Error(
//       "Invalid class ID"
//     );
//   }

//   const classData =
//     await ClassModel.findOneAndUpdate(
//       {
//         _id: classId,
//         schoolId,
//       },
//       {
//         isActive,
//       },
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//   if (!classData) {
//     throw new Error(
//       "Class not found"
//     );
//   }

//   return classData;
// };

import mongoose from "mongoose";

import { ClassModel } from "./class.model";
import { AcademicSession } from "../academicSession.model";


// ============================================
// TYPES
// ============================================

export interface CreateClassData {
  sessionId: string;
  name: string;
  order?: number;
}

export interface UpdateClassData {
  name?: string;
  order?: number;
}


// ============================================
// CREATE CLASS
// ============================================

export const createClass = async (
  schoolId: string,
  data: CreateClassData
) => {
  // Validate School ID
  if (
    !mongoose.Types.ObjectId.isValid(
      schoolId
    )
  ) {
    throw new Error(
      "Invalid school ID"
    );
  }

  // Validate Session ID
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

  // Validate class name
  const className =
    data.name.trim();

  if (!className) {
    throw new Error(
      "Class name is required"
    );
  }

  // Check duplicate class
  const existingClass =
    await ClassModel.findOne({
      schoolId,
      sessionId: data.sessionId,
      name: className,
    });

  if (existingClass) {
    throw new Error(
      "Class already exists in this academic session"
    );
  }

  // Validate order
  if (
    data.order !== undefined &&
    (
      typeof data.order !== "number" ||
      data.order < 0
    )
  ) {
    throw new Error(
      "Class order must be a valid positive number"
    );
  }

  // Create Class
  const newClass =
    await ClassModel.create({
      schoolId,
      sessionId: data.sessionId,
      name: className,

      ...(data.order !== undefined
        ? {
            order: data.order,
          }
        : {}),

      isActive: true,
    });

  return newClass;
};


// ============================================
// GET ALL CLASSES
// ============================================

export const getClasses = async (
  schoolId: string,
  sessionId?: string
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
  } = {
    schoolId,
  };

  // Optional Session Filter
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

  const classes =
    await ClassModel.find(query)
      .sort({
        order: 1,
        name: 1,
      })
      .lean();

  return classes;
};


// ============================================
// GET CLASS BY ID
// ============================================

export const getClassById = async (
  schoolId: string,
  classId: string
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
      classId
    )
  ) {
    throw new Error(
      "Invalid class ID"
    );
  }

  const classData =
    await ClassModel.findOne({
      _id: classId,
      schoolId,
    }).lean();

  if (!classData) {
    throw new Error(
      "Class not found"
    );
  }

  return classData;
};


// ============================================
// UPDATE CLASS
// ============================================

export const updateClass = async (
  schoolId: string,
  classId: string,
  data: UpdateClassData
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
      classId
    )
  ) {
    throw new Error(
      "Invalid class ID"
    );
  }

  const classData =
    await ClassModel.findOne({
      _id: classId,
      schoolId,
    });

  if (!classData) {
    throw new Error(
      "Class not found"
    );
  }

  // Update Name
  if (
    data.name !== undefined
  ) {
    const name =
      data.name.trim();

    if (!name) {
      throw new Error(
        "Class name cannot be empty"
      );
    }

    // Duplicate check
    const duplicate =
      await ClassModel.findOne({
        _id: {
          $ne: classId,
        },

        schoolId,

        sessionId:
          classData.sessionId,

        name,
      });

    if (duplicate) {
      throw new Error(
        "Class already exists in this academic session"
      );
    }

    classData.name =
      name;
  }

  // Update Order
  if (
    data.order !== undefined
  ) {
    if (
      typeof data.order !==
        "number" ||
      data.order < 0
    ) {
      throw new Error(
        "Class order must be a valid positive number"
      );
    }

    classData.order =
      data.order;
  }

  await classData.save();

  return classData;
};


// ============================================
// UPDATE CLASS STATUS
// ============================================

export const updateClassStatus =
  async (
    schoolId: string,
    classId: string,
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
        classId
      )
    ) {
      throw new Error(
        "Invalid class ID"
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

    const classData =
      await ClassModel.findOneAndUpdate(
        {
          _id: classId,
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

    if (!classData) {
      throw new Error(
        "Class not found"
      );
    }

    return classData;
  };