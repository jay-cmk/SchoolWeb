// import bcrypt from "bcrypt";
// import { User } from "./user.model";
// import { generateAccessToken } from "../../utils/jwt";

// interface LoginInput {
//   email: string;
//   password: string;
// }

// export const loginUser = async ({
//   email,
//   password,
// }: LoginInput) => {
//   const user = await User.findOne({
//     email: email.toLowerCase(),
//   }).select("+password");

//   if (!user) {
//     throw new Error("Invalid email or password");
//   }

//   if (!user.isActive) {
//     throw new Error("User account is inactive");
//   }

//   const isPasswordValid = await bcrypt.compare(
//     password,
//     user.password
//   );

//   if (!isPasswordValid) {
//     throw new Error("Invalid email or password");
//   }

//   user.lastLoginAt = new Date();

//   await user.save();

//   const accessToken = generateAccessToken(
//     user._id.toString(),
//     user.role,
//     user.schoolId?.toString()
//   );

//   return {
//     accessToken,
//     user: {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       schoolId: user.schoolId,
//     },
//   };
// };

// import bcrypt from "bcrypt";

// import { User } from "./user.model";

// import Student from "../students/student.model";

// import {
//   generateAccessToken,
// } from "../../utils/jwt";

// import {
//   UserRole,
// } from "../../constants/roles";

// interface LoginInput {
//   email: string;

//   password: string;
// }

// export const loginUser = async ({
//   email,
//   password,
// }: LoginInput) => {

//   // ============================================
//   // FIND USER
//   // ============================================

//   const user =
//     await User.findOne({
//       email:
//         email.toLowerCase().trim(),
//     }).select("+password");

//   if (!user) {
//     throw new Error(
//       "Invalid email or password"
//     );
//   }

//   // ============================================
//   // USER ACTIVE CHECK
//   // ============================================

//   if (!user.isActive) {
//     throw new Error(
//       "User account is inactive"
//     );
//   }

//   // ============================================
//   // PASSWORD CHECK
//   // ============================================

//   const isPasswordValid =
//     await bcrypt.compare(
//       password,
//       user.password
//     );

//   if (!isPasswordValid) {
//     throw new Error(
//       "Invalid email or password"
//     );
//   }

//   // ============================================
//   // STUDENT DATA
//   // ============================================

//   let studentId:
//     string | undefined;

//   if (
//     user.role ===
//     UserRole.STUDENT
//   ) {

//     // Student must always belong to a school
//     if (!user.schoolId) {
//       throw new Error(
//         "Student account is not linked to a school"
//       );
//     }

//     const student =
//       await Student.findOne({
//         userId:
//           user._id,

//         schoolId:
//           user.schoolId,

//         status:
//           "ACTIVE",
//       })
//         .select(
//           "_id schoolId status"
//         )
//         .lean();

//     if (!student) {
//       throw new Error(
//         "Student profile not found or inactive"
//       );
//     }

//     studentId =
//       student._id.toString();
//   }

//   // ============================================
//   // UPDATE LAST LOGIN
//   // ============================================

//   user.lastLoginAt =
//     new Date();

//   await user.save();

//   // ============================================
//   // GENERATE ACCESS TOKEN
//   // ============================================

//   const accessToken =
//     generateAccessToken(
//       user._id.toString(),

//       user.role,

//       user.schoolId
//         ?.toString(),

//       studentId
//     );

//   // ============================================
//   // RESPONSE USER
//   // ============================================

//   return {

//     accessToken,

//     user: {
//       id:
//         user._id,

//       name:
//         user.name,

//       email:
//         user.email,

//       role:
//         user.role,

//       schoolId:
//         user.schoolId,

//       ...(studentId
//         ? {
//             studentId,
//           }
//         : {}),
//     },

//   };
// };



import bcrypt from "bcrypt";

import { User } from "./user.model";

import Student from "../students/student.model";

import { Teacher } from "../teachers/teacher.model";

import { generateAccessToken } from "../../utils/jwt";

import { UserRole } from "../../constants/roles";

interface LoginInput {
  email: string;

  password: string;
}

// ============================================
// LOGIN USER
// ============================================

export const loginUser = async ({
  email,

  password,
}: LoginInput) => {
  // ============================================
  // FIND USER
  // ============================================

  const user = await User.findOne({
    email: email.toLowerCase().trim(),
  }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // ============================================
  // USER ACTIVE CHECK
  // ============================================

  if (!user.isActive) {
    throw new Error("User account is inactive");
  }

  // ============================================
  // PASSWORD CHECK
  // ============================================

  const isPasswordValid = await bcrypt.compare(
    password,

    user.password,
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // ============================================
  // STUDENT IDENTITY
  // ============================================

  let studentId: string | undefined;

  if (user.role === UserRole.STUDENT) {
    if (!user.schoolId) {
      throw new Error("Student account is not linked to a school");
    }

    const student = await Student.findOne({
      userId: user._id,

      schoolId: user.schoolId,

      status: "ACTIVE",
    })
      .select("_id schoolId status")
      .lean();

    if (!student) {
      throw new Error("Student profile not found or inactive");
    }

    studentId = student._id.toString();
  }

  // ============================================
  // TEACHER IDENTITY
  // ============================================

  let teacherId: string | undefined;

  if (user.role === UserRole.TEACHER) {
    if (!user.schoolId) {
      throw new Error("Teacher account is not linked to a school");
    }

    const teacher = await Teacher.findOne({
      userId: user._id,

      schoolId: user.schoolId,

      isActive: true,
    })
      .select("_id schoolId isActive")
      .lean();

    if (!teacher) {
      throw new Error("Teacher profile not found or inactive");
    }

    teacherId = teacher._id.toString();
  }

  // ============================================
  // UPDATE LAST LOGIN
  // ============================================

  user.lastLoginAt = new Date();

  await user.save();

  // ============================================
  // GENERATE ACCESS TOKEN
  // ============================================

  const accessToken = generateAccessToken(
    user._id.toString(),

    user.role,

    user.schoolId?.toString(),

    studentId,

    teacherId,
  );

  // ============================================
  // RESPONSE
  // ============================================

  return {
    accessToken,

    user: {
      id: user._id,

      name: user.name,

      email: user.email,

      role: user.role,

      schoolId: user.schoolId,

      ...(studentId
        ? {
            studentId,
          }
        : {}),

      ...(teacherId
        ? {
            teacherId,
          }
        : {}),
    },
  };
};
