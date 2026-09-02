// import {
//   Request,
//   Response,
// } from "express";

// import studentService from "./student.service";

// import type {
//   StudentStatus,
// } from "./student.interface";


// export class StudentController {

//   // ============================================
//   // CREATE STUDENT
//   // ============================================

//   async create(
//     req: Request,
//     res: Response
//   ) {
//     try {

//       if (!req.user) {
//         return res.status(401).json({
//           success: false,
//           message: "Unauthorized",
//         });
//       }

//       const {
//         schoolId,
//         userId,
//       } = req.user;


//       if (!schoolId) {
//         return res.status(403).json({
//           success: false,
//           message: "School ID not found",
//         });
//       }


//       const student =
//         await studentService.createStudent(
//           schoolId,
//           userId,
//           req.body
//         );


//       return res.status(201).json({
//         success: true,
//         message:
//           "Student created successfully",
//         data: student,
//       });

//     } catch (error: unknown) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to create student";


//       return res.status(400).json({
//         success: false,
//         message,
//       });
//     }
//   }


//   // ============================================
//   // GET ALL STUDENTS
//   // ============================================

//   async getAll(
//     req: Request,
//     res: Response
//   ) {
//     try {

//       if (!req.user) {
//         return res.status(401).json({
//           success: false,
//           message: "Unauthorized",
//         });
//       }


//       const {
//         schoolId,
//       } = req.user;


//       if (!schoolId) {
//         return res.status(403).json({
//           success: false,
//           message: "School ID not found",
//         });
//       }


//       const result =
//         await studentService.getStudents(
//           schoolId,
//           req.query
//         );


//       return res.status(200).json({
//         success: true,
//         data: result.students,
//         pagination:
//           result.pagination,
//       });

//     } catch (error: unknown) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to fetch students";


//       return res.status(400).json({
//         success: false,
//         message,
//       });
//     }
//   }


//   // ============================================
//   // GET SINGLE STUDENT
//   // ============================================

//   async getOne(
//     req: Request,
//     res: Response
//   ) {
//     try {

//       if (!req.user) {
//         return res.status(401).json({
//           success: false,
//           message: "Unauthorized",
//         });
//       }


//       const {
//         schoolId,
//       } = req.user;


//       if (!schoolId) {
//         return res.status(403).json({
//           success: false,
//           message: "School ID not found",
//         });
//       }


//       const {
//         studentId,
//       } = req.params;


//       if (
//         typeof studentId !== "string"
//       ) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid student ID",
//         });
//       }


//       const student =
//         await studentService
//           .getStudentById(
//             schoolId,
//             studentId
//           );


//       return res.status(200).json({
//         success: true,
//         data: student,
//       });

//     } catch (error: unknown) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to fetch student";


//       return res.status(404).json({
//         success: false,
//         message,
//       });
//     }
//   }


//   // ============================================
//   // UPDATE STUDENT
//   // ============================================

//   async update(
//     req: Request,
//     res: Response
//   ) {
//     try {

//       if (!req.user) {
//         return res.status(401).json({
//           success: false,
//           message: "Unauthorized",
//         });
//       }


//       const {
//         schoolId,
//         userId,
//       } = req.user;


//       if (!schoolId) {
//         return res.status(403).json({
//           success: false,
//           message: "School ID not found",
//         });
//       }


//       const {
//         studentId,
//       } = req.params;


//       if (
//         typeof studentId !== "string"
//       ) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid student ID",
//         });
//       }


//       const student =
//         await studentService
//           .updateStudent(
//             schoolId,
//             userId,
//             studentId,
//             req.body
//           );


//       return res.status(200).json({
//         success: true,
//         message:
//           "Student updated successfully",
//         data: student,
//       });

//     } catch (error: unknown) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to update student";


//       return res.status(400).json({
//         success: false,
//         message,
//       });
//     }
//   }


//   // ============================================
//   // UPDATE STUDENT STATUS
//   // ============================================

//   async updateStatus(
//     req: Request,
//     res: Response
//   ) {
//     try {

//       if (!req.user) {
//         return res.status(401).json({
//           success: false,
//           message: "Unauthorized",
//         });
//       }


//       const {
//         schoolId,
//         userId,
//       } = req.user;


//       if (!schoolId) {
//         return res.status(403).json({
//           success: false,
//           message: "School ID not found",
//         });
//       }


//       const {
//         studentId,
//       } = req.params;


//       if (
//         typeof studentId !== "string"
//       ) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid student ID",
//         });
//       }


//       const {
//         status,
//       } = req.body as {
//         status?: StudentStatus;
//       };


//       if (!status) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "Student status is required",
//         });
//       }


//       const student =
//         await studentService
//           .updateStatus(
//             schoolId,
//             userId,
//             studentId,
//             status
//           );


//       return res.status(200).json({
//         success: true,
//         message:
//           "Student status updated successfully",
//         data: student,
//       });

//     } catch (error: unknown) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to update student status";


//       return res.status(400).json({
//         success: false,
//         message,
//       });
//     }
//   }
// }




// export default new StudentController();











import {
  Request,
  Response,
} from "express";

import studentService from "./student.service";

import type {
  StudentStatus,
} from "./student.interface";


export class StudentController {

  // ============================================
  // CREATE STUDENT
  // ============================================

  async create(
    req: Request,
    res: Response
  ) {
    try {

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const {
        schoolId,
        userId,
      } = req.user;


      if (!schoolId) {
        return res.status(403).json({
          success: false,
          message: "School ID not found",
        });
      }


      const student =
        await studentService.createStudent(
          schoolId,
          userId,
          req.body
        );


      return res.status(201).json({
        success: true,
        message:
          "Student created successfully",
        data: student,
      });

    } catch (error: unknown) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to create student";


      return res.status(400).json({
        success: false,
        message,
      });
    }
  }


  // ============================================
  // GET ALL STUDENTS
  // ============================================

  async getAll(
    req: Request,
    res: Response
  ) {
    try {

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }


      const {
        schoolId,
      } = req.user;


      if (!schoolId) {
        return res.status(403).json({
          success: false,
          message: "School ID not found",
        });
      }


      const result =
        await studentService.getStudents(
          schoolId,
          req.query
        );


      return res.status(200).json({
        success: true,
        data: result.students,
        pagination:
          result.pagination,
      });

    } catch (error: unknown) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch students";


      return res.status(400).json({
        success: false,
        message,
      });
    }
  }


  // ============================================
  // GET SINGLE STUDENT
  // ============================================

  async getOne(
    req: Request,
    res: Response
  ) {
    try {

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }


      const {
        schoolId,
      } = req.user;


      if (!schoolId) {
        return res.status(403).json({
          success: false,
          message: "School ID not found",
        });
      }


      const {
        studentId,
      } = req.params;


      if (
        typeof studentId !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid student ID",
        });
      }


      const student =
        await studentService
          .getStudentById(
            schoolId,
            studentId
          );


      return res.status(200).json({
        success: true,
        data: student,
      });

    } catch (error: unknown) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch student";


      return res.status(404).json({
        success: false,
        message,
      });
    }
  }


  // ============================================
  // UPDATE STUDENT
  // ============================================

  async update(
    req: Request,
    res: Response
  ) {
    try {

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }


      const {
        schoolId,
        userId,
      } = req.user;


      if (!schoolId) {
        return res.status(403).json({
          success: false,
          message: "School ID not found",
        });
      }


      const {
        studentId,
      } = req.params;


      if (
        typeof studentId !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid student ID",
        });
      }


      const student =
        await studentService
          .updateStudent(
            schoolId,
            userId,
            studentId,
            req.body
          );


      return res.status(200).json({
        success: true,
        message:
          "Student updated successfully",
        data: student,
      });

    } catch (error: unknown) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to update student";


      return res.status(400).json({
        success: false,
        message,
      });
    }
  }


  // ============================================
  // UPDATE STUDENT STATUS
  // ============================================

  async updateStatus(
    req: Request,
    res: Response
  ) {
    try {

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }


      const {
        schoolId,
        userId,
      } = req.user;


      if (!schoolId) {
        return res.status(403).json({
          success: false,
          message: "School ID not found",
        });
      }


      const {
        studentId,
      } = req.params;


      if (
        typeof studentId !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid student ID",
        });
      }


      const {
        status,
      } = req.body as {
        status?: StudentStatus;
      };


      if (!status) {
        return res.status(400).json({
          success: false,
          message:
            "Student status is required",
        });
      }


      const student =
        await studentService
          .updateStatus(
            schoolId,
            userId,
            studentId,
            status
          );


      return res.status(200).json({
        success: true,
        message:
          "Student status updated successfully",
        data: student,
      });

    } catch (error: unknown) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to update student status";


      return res.status(400).json({
        success: false,
        message,
      });
    }
  }


  // ============================================
  // CREATE STUDENT LOGIN ACCOUNT
  // ============================================

  async createAccount(
    req: Request,
    res: Response
  ) {
    try {

      // ==========================================
      // AUTH CHECK
      // ==========================================

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }


      const {
        schoolId,
        userId,
      } = req.user;


      // ==========================================
      // SCHOOL CHECK
      // ==========================================

      if (!schoolId) {
        return res.status(403).json({
          success: false,
          message: "School ID not found",
        });
      }


      // ==========================================
      // STUDENT ID
      // ==========================================

      const {
        studentId,
      } = req.params;


      if (
        typeof studentId !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid student ID",
        });
      }


      // ==========================================
      // CREATE ACCOUNT
      // ==========================================

      const result =
        await studentService
          .createStudentAccount(
            schoolId,
            userId,
            studentId,
            req.body
          );


      // ==========================================
      // RESPONSE
      // ==========================================

      return res.status(201).json({
        success: true,
        message:
          "Student login account created successfully",
        data: result,
      });

    } catch (error: unknown) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to create student login account";


      return res.status(400).json({
        success: false,
        message,
      });
    }
  }

  // ============================================
// GET MY PROFILE
// ============================================

async getMe(
  req: Request,
  res: Response
) {
  try {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }


    const {
      schoolId,
      studentId,
    } = req.user;


    if (!schoolId) {
      return res.status(403).json({
        success: false,
        message: "School ID not found",
      });
    }


    if (!studentId) {
      return res.status(403).json({
        success: false,
        message: "Student ID not found in token",
      });
    }


    const student =
      await studentService.getMyProfile(
        schoolId,
        studentId
      );


    return res.status(200).json({
      success: true,
      message:
        "Student profile fetched successfully",
      data: student,
    });

  } catch (error: unknown) {

    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch student profile";


    return res.status(400).json({
      success: false,
      message,
    });
  }
}
}


export default new StudentController();