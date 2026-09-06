// import {
//   Request,
//   Response,
// } from "express";

// import {
//   createTeacher,
//   getTeachers,
//   getTeacherById,
//   updateTeacher,
//   updateTeacherStatus,
// } from "./teacher.service";

// import type {
//   TeacherGender,
// } from "./teacher.types";


// // ============================================
// // CREATE
// // ============================================

// export const createTeacherController =
//   async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {
//     try {
//       const schoolId =
//         req.user?.schoolId;


//       if (!schoolId) {
//         res.status(403).json({
//           success: false,

//           message:
//             "School access required",
//         });

//         return;
//       }


//       const {
//         employeeId,
//         name,
//         email,
//         mobile,
//         gender,
//         qualification,
//         joiningDate,
//         profileImage,
//       } = req.body;


//       if (
//         !employeeId ||
//         !name ||
//         !email
//       ) {
//         res.status(400).json({
//           success: false,

//           message:
//             "Employee ID, teacher name and email are required",
//         });

//         return;
//       }


//       const teacher =
//         await createTeacher(
//           schoolId,
//           {
//             employeeId,
//             name,
//             email,

//             ...(mobile !==
//             undefined
//               ? {
//                   mobile,
//                 }
//               : {}),

//             ...(gender !==
//             undefined
//               ? {
//                   gender,
//                 }
//               : {}),

//             ...(qualification !==
//             undefined
//               ? {
//                   qualification,
//                 }
//               : {}),

//             ...(joiningDate !==
//             undefined
//               ? {
//                   joiningDate,
//                 }
//               : {}),

//             ...(profileImage !==
//             undefined
//               ? {
//                   profileImage,
//                 }
//               : {}),
//           }
//         );


//       res.status(201).json({
//         success: true,

//         message:
//           "Teacher created successfully",

//         data: {
//           teacher,
//         },
//       });

//     } catch (error) {
//       res.status(400).json({
//         success: false,

//         message:
//           error instanceof Error
//             ? error.message
//             : "Failed to create teacher",
//       });
//     }
//   };


// // ============================================
// // GET ALL
// // ============================================

// export const getTeachersController =
//   async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {
//     try {
//       const schoolId =
//         req.user?.schoolId;


//       if (!schoolId) {
//         res.status(403).json({
//           success: false,

//           message:
//             "School access required",
//         });

//         return;
//       }


//       let isActive:
//         | boolean
//         | undefined;


//       if (
//         req.query.isActive ===
//         "true"
//       ) {
//         isActive =
//           true;
//       }


//       if (
//         req.query.isActive ===
//         "false"
//       ) {
//         isActive =
//           false;
//       }


//       const gender =
//         typeof req.query
//           .gender ===
//         "string"
//           ? (
//               req.query
//                 .gender as TeacherGender
//             )
//           : undefined;


//       const teachers =
//         await getTeachers(
//           schoolId,
//           isActive,
//           gender
//         );


//       res.status(200).json({
//         success: true,

//         message:
//           "Teachers fetched successfully",

//         data: {
//           teachers,
//         },
//       });

//     } catch (error) {
//       res.status(400).json({
//         success: false,

//         message:
//           error instanceof Error
//             ? error.message
//             : "Failed to fetch teachers",
//       });
//     }
//   };


// // ============================================
// // GET BY ID
// // ============================================

// export const getTeacherByIdController =
//   async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {
//     try {
//       const schoolId =
//         req.user?.schoolId;


//       const {
//         teacherId,
//       } = req.params;


//       if (
//         !schoolId ||
//         typeof teacherId !==
//           "string"
//       ) {
//         res.status(400).json({
//           success: false,

//           message:
//             "Invalid request",
//         });

//         return;
//       }


//       const teacher =
//         await getTeacherById(
//           schoolId,
//           teacherId
//         );


//       res.status(200).json({
//         success: true,

//         message:
//           "Teacher fetched successfully",

//         data: {
//           teacher,
//         },
//       });

//     } catch (error) {
//       res.status(404).json({
//         success: false,

//         message:
//           error instanceof Error
//             ? error.message
//             : "Teacher not found",
//       });
//     }
//   };


// // ============================================
// // UPDATE
// // ============================================

// export const updateTeacherController =
//   async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {
//     try {
//       const schoolId =
//         req.user?.schoolId;


//       const {
//         teacherId,
//       } = req.params;


//       if (
//         !schoolId ||
//         typeof teacherId !==
//           "string"
//       ) {
//         res.status(400).json({
//           success: false,

//           message:
//             "Invalid request",
//         });

//         return;
//       }


//       const teacher =
//         await updateTeacher(
//           schoolId,
//           teacherId,
//           req.body
//         );


//       res.status(200).json({
//         success: true,

//         message:
//           "Teacher updated successfully",

//         data: {
//           teacher,
//         },
//       });

//     } catch (error) {
//       res.status(400).json({
//         success: false,

//         message:
//           error instanceof Error
//             ? error.message
//             : "Failed to update teacher",
//       });
//     }
//   };


// // ============================================
// // STATUS
// // ============================================

// export const updateTeacherStatusController =
//   async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {
//     try {
//       const schoolId =
//         req.user?.schoolId;


//       const {
//         teacherId,
//       } = req.params;


//       const {
//         isActive,
//       } = req.body;


//       if (
//         !schoolId ||
//         typeof teacherId !==
//           "string"
//       ) {
//         res.status(400).json({
//           success: false,

//           message:
//             "Invalid request",
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


//       const teacher =
//         await updateTeacherStatus(
//           schoolId,
//           teacherId,
//           isActive
//         );


//       res.status(200).json({
//         success: true,

//         message:
//           "Teacher status updated successfully",

//         data: {
//           teacher,
//         },
//       });

//     } catch (error) {
//       res.status(400).json({
//         success: false,

//         message:
//           error instanceof Error
//             ? error.message
//             : "Failed to update teacher status",
//       });
//     }
//   };










import {
  Request,
  Response,
} from "express";

import {
  createTeacher,
  getTeachers,
  getTeacherById,
  getMyTeacherProfile,
  updateTeacher,
  updateTeacherStatus,
} from "./teacher.service";

import type {
  TeacherGender,
} from "./teacher.types";


// ============================================
// CREATE
// ============================================

export const createTeacherController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const schoolId =
        req.user?.schoolId;


      if (!schoolId) {

        res.status(403).json({

          success: false,

          message:
            "School access required",
        });

        return;
      }


      const {

        employeeId,

        name,

        email,

        password,

        mobile,

        gender,

        qualification,

        joiningDate,

        profileImage,

      } = req.body;


      if (
        !employeeId ||
        !name ||
        !email ||
        !password
      ) {

        res.status(400).json({

          success: false,

          message:
            "Employee ID, teacher name, email and password are required",
        });

        return;
      }


      const teacher =
        await createTeacher(

          schoolId,

          {
            employeeId,

            name,

            email,

            password,

            ...(mobile !==
            undefined
              ? {
                  mobile,
                }
              : {}),

            ...(gender !==
            undefined
              ? {
                  gender,
                }
              : {}),

            ...(qualification !==
            undefined
              ? {
                  qualification,
                }
              : {}),

            ...(joiningDate !==
            undefined
              ? {
                  joiningDate,
                }
              : {}),

            ...(profileImage !==
            undefined
              ? {
                  profileImage,
                }
              : {}),
          }
        );


      res.status(201).json({

        success: true,

        message:
          "Teacher and login account created successfully",

        data: {
          teacher,
        },
      });

    } catch (error) {

      res.status(400).json({

        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to create teacher",
      });
    }
  };


// ============================================
// GET ALL
// ============================================

export const getTeachersController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const schoolId =
        req.user?.schoolId;


      if (!schoolId) {

        res.status(403).json({

          success: false,

          message:
            "School access required",
        });

        return;
      }


      let isActive:
        | boolean
        | undefined;


      if (
        req.query.isActive ===
        "true"
      ) {

        isActive =
          true;
      }


      if (
        req.query.isActive ===
        "false"
      ) {

        isActive =
          false;
      }


      const gender =
        typeof req.query
          .gender ===
        "string"

          ? (
              req.query
                .gender as TeacherGender
            )

          : undefined;


      const teachers =
        await getTeachers(

          schoolId,

          isActive,

          gender
        );


      res.status(200).json({

        success: true,

        message:
          "Teachers fetched successfully",

        data: {
          teachers,
        },
      });

    } catch (error) {

      res.status(400).json({

        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch teachers",
      });
    }
  };


// ============================================
// GET MY PROFILE
// ============================================

export const getMyTeacherProfileController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const schoolId =
        req.user?.schoolId;

      const teacherId =
        req.user?.teacherId;

      const userId =
        req.user?.userId;


      if (
        !schoolId ||
        !teacherId ||
        !userId
      ) {

        res.status(403).json({

          success: false,

          message:
            "Teacher access required",
        });

        return;
      }


      const teacher =
        await getMyTeacherProfile(

          schoolId,

          teacherId,

          userId
        );


      res.status(200).json({

        success: true,

        message:
          "Teacher profile fetched successfully",

        data: {
          teacher,
        },
      });

    } catch (error) {

      res.status(404).json({

        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Teacher profile not found",
      });
    }
  };


// ============================================
// GET BY ID
// ============================================

export const getTeacherByIdController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const schoolId =
        req.user?.schoolId;


      const {
        teacherId,
      } = req.params;


      if (
        !schoolId ||
        typeof teacherId !==
          "string"
      ) {

        res.status(400).json({

          success: false,

          message:
            "Invalid request",
        });

        return;
      }


      const teacher =
        await getTeacherById(

          schoolId,

          teacherId
        );


      res.status(200).json({

        success: true,

        message:
          "Teacher fetched successfully",

        data: {
          teacher,
        },
      });

    } catch (error) {

      res.status(404).json({

        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Teacher not found",
      });
    }
  };


// ============================================
// UPDATE
// ============================================

export const updateTeacherController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const schoolId =
        req.user?.schoolId;


      const {
        teacherId,
      } = req.params;


      if (
        !schoolId ||
        typeof teacherId !==
          "string"
      ) {

        res.status(400).json({

          success: false,

          message:
            "Invalid request",
        });

        return;
      }


      const teacher =
        await updateTeacher(

          schoolId,

          teacherId,

          req.body
        );


      res.status(200).json({

        success: true,

        message:
          "Teacher updated successfully",

        data: {
          teacher,
        },
      });

    } catch (error) {

      res.status(400).json({

        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to update teacher",
      });
    }
  };


// ============================================
// STATUS
// ============================================

export const updateTeacherStatusController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const schoolId =
        req.user?.schoolId;


      const {
        teacherId,
      } = req.params;


      const {
        isActive,
      } = req.body;


      if (
        !schoolId ||
        typeof teacherId !==
          "string"
      ) {

        res.status(400).json({

          success: false,

          message:
            "Invalid request",
        });

        return;
      }


      if (
        typeof isActive !==
        "boolean"
      ) {

        res.status(400).json({

          success: false,

          message:
            "isActive must be boolean",
        });

        return;
      }


      const teacher =
        await updateTeacherStatus(

          schoolId,

          teacherId,

          isActive
        );


      res.status(200).json({

        success: true,

        message:
          "Teacher status updated successfully",

        data: {
          teacher,
        },
      });

    } catch (error) {

      res.status(400).json({

        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to update teacher status",
      });
    }
  };