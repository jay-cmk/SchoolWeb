// import {
//   Request,
//   Response,
// } from "express";

// import {
//   createClass,
//   getClasses,
//   getClassById,
//   updateClass,
//   updateClassStatus
// } from "./class.service";

// export const createClassController = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const schoolId =
//       req.user?.schoolId;

//     if (!schoolId) {
//       res.status(403).json({
//         success: false,
//         message:
//           "School access required",
//       });

//       return;
//     }

//     const {
//       sessionId,
//       name,
//       order,
//     } = req.body;

//     console.log(
//       "CREATE CLASS BODY:",
//       req.body
//     );

//     if (!sessionId || !name) {
//       res.status(400).json({
//         success: false,
//         message:
//           "Session ID and class name are required",
//       });

//       return;
//     }

//     const classData =
//       await createClass(
//         schoolId,
//         {
//           sessionId,
//           name,
//           ...(order !== undefined
//             ? { order }
//             : {}),
//         }
//       );

//     res.status(201).json({
//       success: true,
//       message:
//         "Class created successfully",
//       data: {
//         class: classData,
//       },
//     });
//   } catch (error) {
//     console.log(
//       "CREATE CLASS ERROR:",
//       error
//     );

//     res.status(400).json({
//       success: false,
//       message:
//         error instanceof Error
//           ? error.message
//           : "Failed to create class",
//     });
//   }
// };

//   export const getClassesController =
//   async (
//     req: Request,
//     res: Response
//   ) => {
//     try {
//       const schoolId =
//         req.user?.schoolId;

//       if (!schoolId) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "School ID is required",
//         });
//       }

//       const academicSessionId =
//         req.query.academicSessionId as
//           | string
//           | undefined;

//       const classes =
//         await getClasses(
//           schoolId,
//           academicSessionId
//         );

//       return res.status(200).json({
//         success: true,
//         message:
//           "Classes fetched successfully",
//         data: {
//           classes,
//         },
//       });
//     } catch (error: any) {
//       return res.status(500).json({
//         success: false,
//         message:
//           error.message ||
//           "Failed to fetch classes",
//       });
//     }
//   };

//   export const getClassByIdController =
//   async (
//     req: Request,
//     res: Response
//   ) => {
//     try {
//       const schoolId =
//         req.user?.schoolId;

//       const { classId } = req.params;

//       if (!schoolId) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "School ID is required",
//         });
//       }

//       const classData =
//         await getClassById(
//           schoolId,
//           classId
//         );

//       return res.status(200).json({
//         success: true,
//         message:
//           "Class fetched successfully",
//         data: {
//           class: classData,
//         },
//       });
//     } catch (error: any) {
//       return res.status(404).json({
//         success: false,
//         message:
//           error.message ||
//           "Class not found",
//       });
//     }
//   };

//   export const updateClassController =
//   async (
//     req: Request,
//     res: Response
//   ) => {
//     try {
//       const schoolId =
//         req.user?.schoolId;

//       const { classId } = req.params;

//       if (!schoolId) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "School ID is required",
//         });
//       }

//       const classData =
//         await updateClass(
//           schoolId,
//           classId,
//           req.body
//         );

//       return res.status(200).json({
//         success: true,
//         message:
//           "Class updated successfully",
//         data: {
//           class: classData,
//         },
//       });
//     } catch (error: any) {
//       return res.status(400).json({
//         success: false,
//         message:
//           error.message ||
//           "Failed to update class",
//       });
//     }
//   };

//   export const updateClassStatusController =
//   async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {
//     try {
//       const schoolId =
//         req.user?.schoolId;

//       const { classId } =
//         req.params;

//       const { isActive } =
//         req.body;

//       if (!schoolId) {
//         res.status(403).json({
//           success: false,
//           message:
//             "School access required",
//         });

//         return;
//       }

//       if (
//         typeof classId !== "string"
//       ) {
//         res.status(400).json({
//           success: false,
//           message:
//             "Invalid class ID",
//         });

//         return;
//       }

//       if (
//         typeof isActive !==
//         "boolean"
//       ) {
//         res.status(400).json({
//           success: false,
//           message:
//             "isActive must be boolean",
//         });

//         return;
//       }

//       const classData =
//         await updateClassStatus(
//           schoolId,
//           classId,
//           isActive
//         );

//       res.status(200).json({
//         success: true,
//         message:
//           "Class status updated successfully",
//         data: {
//           class: classData,
//         },
//       });
//     } catch (error) {
//       res.status(400).json({
//         success: false,
//         message:
//           error instanceof Error
//             ? error.message
//             : "Failed to update class status",
//       });
//     }
//   };

import type { Request, Response } from "express";

import {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  updateClassStatus,
} from "./class.service";

/* =====================================================
   GET SINGLE STRING VALUE

   Express params/query की value अलग versions में:
   string | string[] | undefined हो सकती है।

   Service को हमेशा string या undefined दिया जाएगा।
===================================================== */

const getStringValue = (value: unknown): string | undefined => {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (Array.isArray(value) && typeof value[0] === "string" && value[0].trim()) {
    return value[0].trim();
  }

  return undefined;
};

/* =====================================================
   CREATE CLASS

   POST /api/v1/academic/classes
===================================================== */

export const createClassController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const schoolId = req.user?.schoolId;

    if (!schoolId) {
      res.status(403).json({
        success: false,
        message: "School access required",
      });

      return;
    }

    const sessionId = getStringValue(req.body?.sessionId);

    const name = getStringValue(req.body?.name);

    const order = req.body?.order;

    if (!sessionId || !name) {
      res.status(400).json({
        success: false,
        message: "Session ID and class name are required",
      });

      return;
    }

    if (
      order !== undefined &&
      (typeof order !== "number" || !Number.isInteger(order) || order < 1)
    ) {
      res.status(400).json({
        success: false,
        message: "Class order must be a positive integer",
      });

      return;
    }

    const classData = await createClass(schoolId, {
      sessionId,
      name,

      ...(order !== undefined
        ? {
            order,
          }
        : {}),
    });

    res.status(201).json({
      success: true,
      message: "Class created successfully",

      data: {
        class: classData,
      },
    });
  } catch (error) {
    console.error("CREATE CLASS ERROR:", error);

    res.status(400).json({
      success: false,

      message:
        error instanceof Error ? error.message : "Failed to create class",
    });
  }
};

/* =====================================================
   GET CLASSES

   GET /api/v1/academic/classes

   Optional query:
   ?academicSessionId=...
===================================================== */

export const getClassesController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const schoolId = req.user?.schoolId;

    if (!schoolId) {
      res.status(403).json({
        success: false,
        message: "School access required",
      });

      return;
    }

    const academicSessionId = getStringValue(req.query.academicSessionId);

    const classes = await getClasses(schoolId, academicSessionId);

    res.status(200).json({
      success: true,

      message: "Classes fetched successfully",

      data: {
        classes,
      },
    });
  } catch (error) {
    console.error("GET CLASSES ERROR:", error);

    res.status(500).json({
      success: false,

      message:
        error instanceof Error ? error.message : "Failed to fetch classes",
    });
  }
};

/* =====================================================
   GET CLASS BY ID

   GET /api/v1/academic/classes/:classId
===================================================== */

export const getClassByIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const schoolId = req.user?.schoolId;

    const classId = getStringValue(req.params.classId);

    if (!schoolId) {
      res.status(403).json({
        success: false,
        message: "School access required",
      });

      return;
    }

    if (!classId) {
      res.status(400).json({
        success: false,
        message: "Valid class ID is required",
      });

      return;
    }

    const classData = await getClassById(schoolId, classId);

    res.status(200).json({
      success: true,

      message: "Class fetched successfully",

      data: {
        class: classData,
      },
    });
  } catch (error) {
    console.error("GET CLASS ERROR:", error);

    res.status(404).json({
      success: false,

      message: error instanceof Error ? error.message : "Class not found",
    });
  }
};

/* =====================================================
   UPDATE CLASS

   PUT /api/v1/academic/classes/:classId
===================================================== */

export const updateClassController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const schoolId = req.user?.schoolId;

    const classId = getStringValue(req.params.classId);

    if (!schoolId) {
      res.status(403).json({
        success: false,
        message: "School access required",
      });

      return;
    }

    if (!classId) {
      res.status(400).json({
        success: false,
        message: "Valid class ID is required",
      });

      return;
    }

    const classData = await updateClass(schoolId, classId, req.body);

    res.status(200).json({
      success: true,

      message: "Class updated successfully",

      data: {
        class: classData,
      },
    });
  } catch (error) {
    console.error("UPDATE CLASS ERROR:", error);

    res.status(400).json({
      success: false,

      message:
        error instanceof Error ? error.message : "Failed to update class",
    });
  }
};

/* =====================================================
   UPDATE CLASS STATUS

   PATCH /api/v1/academic/classes/:classId/status
===================================================== */

export const updateClassStatusController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const schoolId = req.user?.schoolId;

    const classId = getStringValue(req.params.classId);

    const isActive = req.body?.isActive;

    if (!schoolId) {
      res.status(403).json({
        success: false,
        message: "School access required",
      });

      return;
    }

    if (!classId) {
      res.status(400).json({
        success: false,
        message: "Valid class ID is required",
      });

      return;
    }

    if (typeof isActive !== "boolean") {
      res.status(400).json({
        success: false,
        message: "isActive must be boolean",
      });

      return;
    }

    const classData = await updateClassStatus(schoolId, classId, isActive);

    res.status(200).json({
      success: true,

      message: isActive
        ? "Class activated successfully"
        : "Class deactivated successfully",

      data: {
        class: classData,
      },
    });
  } catch (error) {
    console.error("UPDATE CLASS STATUS ERROR:", error);

    res.status(400).json({
      success: false,

      message:
        error instanceof Error
          ? error.message
          : "Failed to update class status",
    });
  }
};
