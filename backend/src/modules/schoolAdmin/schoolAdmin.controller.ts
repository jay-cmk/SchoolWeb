// import { Request, Response } from "express";

// import {
//   getSchoolAdminDashboard,getSchoolAdmins,
//   updateSchoolAdmin,
//   updateSchoolAdminStatus,
// } from "./schoolAdmin.service";

// export const getSchoolAdminDashboardController = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     if (!req.user) {
//       res.status(401).json({
//         success: false,
//         message: "Authentication required",
//       });

//       return;
//     }

//     const { schoolId } = req.user;

//     if (!schoolId) {
//       res.status(403).json({
//         success: false,
//         message: "School ID not found",
//       });

//       return;
//     }

//     const dashboard = await getSchoolAdminDashboard(
//       schoolId
//     );

//     res.status(200).json({
//       success: true,
//       message: "School admin dashboard fetched successfully",
//       data: dashboard,
//     });
//   } catch (error) {
//     console.error(
//       "School admin dashboard error:",
//       error
//     );

//     res.status(500).json({
//       success: false,
//       message:
//         error instanceof Error
//           ? error.message
//           : "Failed to fetch dashboard",
//     });
//   }
// };



//   export const getSchoolAdminsController =
//   async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {
//     try {
//       const { schoolId } = req.params;

//       if (
//         typeof schoolId !== "string"
//       ) {
//         res.status(400).json({
//           success: false,
//           message: "Invalid school ID",
//         });

//         return;
//       }

//       const admins =
//         await getSchoolAdmins(
//           schoolId
//         );

//       res.status(200).json({
//         success: true,
//         message:
//           "School admins fetched successfully",
//         data: {
//           admins,
//         },
//       });
//     } catch (error) {
//       res.status(400).json({
//         success: false,
//         message:
//           error instanceof Error
//             ? error.message
//             : "Failed to fetch school admins",
//       });
//     }
//   };


//   export const updateSchoolAdminController =
//   async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {
//     try {
//       const {
//         schoolId,
//         adminId,
//       } = req.params;

//       if (
//         typeof schoolId !== "string" ||
//         typeof adminId !== "string"
//       ) {
//         res.status(400).json({
//           success: false,
//           message:
//             "Invalid school or admin ID",
//         });

//         return;
//       }

//       const admin =
//         await updateSchoolAdmin(
//           schoolId,
//           adminId,
//           req.body
//         );

//       res.status(200).json({
//         success: true,
//         message:
//           "School admin updated successfully",
//         data: {
//           admin,
//         },
//       });
//     } catch (error) {
//       res.status(400).json({
//         success: false,
//         message:
//           error instanceof Error
//             ? error.message
//             : "Failed to update school admin",
//       });
//     }
//   };


//   export const updateSchoolAdminStatusController =
//   async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {
//     try {
//       const {
//         schoolId,
//         adminId,
//       } = req.params;

//       const {
//         isActive,
//       } = req.body;

//       if (
//         typeof schoolId !== "string" ||
//         typeof adminId !== "string"
//       ) {
//         res.status(400).json({
//           success: false,
//           message:
//             "Invalid school or admin ID",
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

//       const admin =
//         await updateSchoolAdminStatus(
//           schoolId,
//           adminId,
//           isActive
//         );

//       res.status(200).json({
//         success: true,
//         message:
//           "School admin status updated successfully",
//         data: {
//           admin,
//         },
//       });
//     } catch (error) {
//       res.status(400).json({
//         success: false,
//         message:
//           error instanceof Error
//             ? error.message
//             : "Failed to update school admin status",
//       });
//     }
//   };






// import {
//   Request,
//   Response,
// } from "express";

// import {
//   getSchoolAdminDashboard,
//   getSchoolAdmins,
//   updateSchoolAdmin,
//   updateSchoolAdminStatus,
// } from "./schoolAdmin.service";


// // ============================================
// // GET SCHOOL ADMIN DASHBOARD
// // ============================================

// export const getSchoolAdminDashboardController =
//   async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {

//     try {

//       // ============================================
//       // AUTH CHECK
//       // ============================================

//       if (!req.user) {

//         res.status(401).json({
//           success: false,
//           message:
//             "Authentication required",
//         });

//         return;
//       }


//       const {
//         schoolId,
//         userId,
//       } = req.user;


//       // ============================================
//       // SCHOOL ID CHECK
//       // ============================================

//       if (!schoolId) {

//         res.status(403).json({
//           success: false,
//           message:
//             "School ID not found",
//         });

//         return;
//       }


//       // ============================================
//       // USER ID CHECK
//       // ============================================

//       if (!userId) {

//         res.status(401).json({
//           success: false,
//           message:
//             "User ID not found",
//         });

//         return;
//       }


//       // ============================================
//       // GET DASHBOARD
//       // ============================================

//       const dashboard =
//         await getSchoolAdminDashboard(
//           schoolId,
//           userId
//         );


//       res.status(200).json({
//         success: true,
//         message:
//           "School admin dashboard fetched successfully",
//         data:
//           dashboard,
//       });

//     } catch (error) {

//       console.error(
//         "School admin dashboard error:",
//         error
//       );


//       res.status(500).json({
//         success: false,

//         message:
//           error instanceof Error
//             ? error.message
//             : "Failed to fetch dashboard",
//       });
//     }
//   };


// // ============================================
// // GET SCHOOL ADMINS
// // ============================================

// export const getSchoolAdminsController =
//   async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {

//     try {

//       const {
//         schoolId,
//       } = req.params;


//       if (
//         typeof schoolId !==
//         "string"
//       ) {

//         res.status(400).json({
//           success: false,
//           message:
//             "Invalid school ID",
//         });

//         return;
//       }


//       const admins =
//         await getSchoolAdmins(
//           schoolId
//         );


//       res.status(200).json({
//         success: true,

//         message:
//           "School admins fetched successfully",

//         data: {
//           admins,
//         },
//       });

//     } catch (error) {

//       res.status(400).json({
//         success: false,

//         message:
//           error instanceof Error
//             ? error.message
//             : "Failed to fetch school admins",
//       });
//     }
//   };


// // ============================================
// // UPDATE SCHOOL ADMIN
// // ============================================

// export const updateSchoolAdminController =
//   async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {

//     try {

//       const {
//         schoolId,
//         adminId,
//       } = req.params;


//       if (
//         typeof schoolId !==
//           "string" ||
//         typeof adminId !==
//           "string"
//       ) {

//         res.status(400).json({
//           success: false,

//           message:
//             "Invalid school or admin ID",
//         });

//         return;
//       }


//       const admin =
//         await updateSchoolAdmin(
//           schoolId,
//           adminId,
//           req.body
//         );


//       res.status(200).json({
//         success: true,

//         message:
//           "School admin updated successfully",

//         data: {
//           admin,
//         },
//       });

//     } catch (error) {

//       res.status(400).json({
//         success: false,

//         message:
//           error instanceof Error
//             ? error.message
//             : "Failed to update school admin",
//       });
//     }
//   };


// // ============================================
// // UPDATE SCHOOL ADMIN STATUS
// // ============================================

// export const updateSchoolAdminStatusController =
//   async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {

//     try {

//       const {
//         schoolId,
//         adminId,
//       } = req.params;


//       const {
//         isActive,
//       } = req.body;


//       if (
//         typeof schoolId !==
//           "string" ||
//         typeof adminId !==
//           "string"
//       ) {

//         res.status(400).json({
//           success: false,

//           message:
//             "Invalid school or admin ID",
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


//       const admin =
//         await updateSchoolAdminStatus(
//           schoolId,
//           adminId,
//           isActive
//         );


//       res.status(200).json({
//         success: true,

//         message:
//           "School admin status updated successfully",

//         data: {
//           admin,
//         },
//       });

//     } catch (error) {

//       res.status(400).json({
//         success: false,

//         message:
//           error instanceof Error
//             ? error.message
//             : "Failed to update school admin status",
//       });
//     }
//   };



import {
  Request,
  Response,
} from "express";

import {
  getSchoolAdminDashboard,
  getSchoolAdmins,
  updateSchoolAdmin,
  updateSchoolAdminStatus,
} from "./schoolAdmin.service";


// ============================================
// GET SCHOOL ADMIN DASHBOARD
// ============================================

export const getSchoolAdminDashboardController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      // ============================================
      // AUTH CHECK
      // ============================================

      if (!req.user) {

        res.status(401).json({
          success: false,
          message:
            "Authentication required",
        });

        return;
      }


      const {
        schoolId,
        userId,
      } = req.user;


      // ============================================
      // SCHOOL ID CHECK
      // ============================================

      if (!schoolId) {

        res.status(403).json({
          success: false,
          message:
            "School ID not found",
        });

        return;
      }


      // ============================================
      // USER ID CHECK
      // ============================================

      if (!userId) {

        res.status(401).json({
          success: false,
          message:
            "User ID not found",
        });

        return;
      }


      // ============================================
      // ACADEMIC SESSION CHECK
      // ============================================

      const {
        sessionId,
      } = req.query;


      if (
        typeof sessionId !==
          "string" ||
        !sessionId.trim()
      ) {

        res.status(400).json({
          success: false,
          message:
            "Academic session ID is required",
        });

        return;
      }


      // ============================================
      // GET DASHBOARD
      // ============================================

      const dashboard =
        await getSchoolAdminDashboard(
          schoolId,
          userId,
          sessionId.trim()
        );


      res.status(200).json({
        success: true,
        message:
          "School admin dashboard fetched successfully",
        data:
          dashboard,
      });

    } catch (error) {

      console.error(
        "School admin dashboard error:",
        error
      );


      res.status(500).json({
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch dashboard",
      });
    }
  };


// ============================================
// GET SCHOOL ADMINS
// ============================================

export const getSchoolAdminsController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const {
        schoolId,
      } = req.params;


      if (
        typeof schoolId !==
        "string"
      ) {

        res.status(400).json({
          success: false,
          message:
            "Invalid school ID",
        });

        return;
      }


      const admins =
        await getSchoolAdmins(
          schoolId
        );


      res.status(200).json({
        success: true,

        message:
          "School admins fetched successfully",

        data: {
          admins,
        },
      });

    } catch (error) {

      res.status(400).json({
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch school admins",
      });
    }
  };


// ============================================
// UPDATE SCHOOL ADMIN
// ============================================

export const updateSchoolAdminController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const {
        schoolId,
        adminId,
      } = req.params;


      if (
        typeof schoolId !==
          "string" ||
        typeof adminId !==
          "string"
      ) {

        res.status(400).json({
          success: false,

          message:
            "Invalid school or admin ID",
        });

        return;
      }


      const admin =
        await updateSchoolAdmin(
          schoolId,
          adminId,
          req.body
        );


      res.status(200).json({
        success: true,

        message:
          "School admin updated successfully",

        data: {
          admin,
        },
      });

    } catch (error) {

      res.status(400).json({
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to update school admin",
      });
    }
  };


// ============================================
// UPDATE SCHOOL ADMIN STATUS
// ============================================

export const updateSchoolAdminStatusController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const {
        schoolId,
        adminId,
      } = req.params;


      const {
        isActive,
      } = req.body;


      if (
        typeof schoolId !==
          "string" ||
        typeof adminId !==
          "string"
      ) {

        res.status(400).json({
          success: false,

          message:
            "Invalid school or admin ID",
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


      const admin =
        await updateSchoolAdminStatus(
          schoolId,
          adminId,
          isActive
        );


      res.status(200).json({
        success: true,

        message:
          "School admin status updated successfully",

        data: {
          admin,
        },
      });

    } catch (error) {

      res.status(400).json({
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to update school admin status",
      });
    }
  };
