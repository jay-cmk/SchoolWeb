


// import jwt from "jsonwebtoken";
// import { env } from "../config/env";
// import { UserRole } from "../constants/roles";
// import { AuthTokenPayload } from "../types/auth.types";

// export const generateAccessToken = (
//   userId: string,
//   role: UserRole
// ): string => {
//   const payload: AuthTokenPayload = {
//     userId,
//     role,
//   };

//   return jwt.sign(payload, env.jwtAccessSecret, {
//     expiresIn: "15m",
//   });
// };

// export const verifyAccessToken = (
//   token: string
// ): AuthTokenPayload => {
//   return jwt.verify(
//     token,
//     env.jwtAccessSecret
//   ) as AuthTokenPayload;
// };


import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { UserRole } from "../constants/roles";
import { AuthTokenPayload } from "../types/auth.types";

export const generateAccessToken = (
  userId: string,
  role: UserRole,
  schoolId?: string
): string => {
  const payload: AuthTokenPayload = {
    userId,
    role,
    ...(schoolId ? { schoolId } : {}),
  };

  return jwt.sign(payload, env.jwtAccessSecret, {
    expiresIn: "15m",
  });
};

export const verifyAccessToken = (
  token: string
): AuthTokenPayload => {
  return jwt.verify(
    token,
    env.jwtAccessSecret
  ) as AuthTokenPayload;
};