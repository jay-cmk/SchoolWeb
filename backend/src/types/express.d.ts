 import { AuthTokenPayload } from "./auth.types";

// declare global {
//   namespace Express {
//     interface Request {
//       user?: AuthTokenPayload;
//     }
//   }
// }

// export {};

import { Types } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user?: {
        user?: AuthTokenPayload;
        userId: Types.ObjectId;
        schoolId: Types.ObjectId;
        role: "SUPER_ADMIN" | "SCHOOL_ADMIN" | "TEACHER";
      };
    }
  }
}

export {};