import type {
  Server as HttpServer,
} from "http";

import {
  Server,
} from "socket.io";

import {
  verifyAccessToken,
} from "../utils/jwt";

import type {
  AuthTokenPayload,
} from "../types/auth.types";


/* =====================================================
   SOCKET USER DATA
===================================================== */

interface SocketUserData {
  userId: string;

  schoolId: string;

  role: string;

  studentId?: string;

  teacherId?: string;
}


/* =====================================================
   SOCKET INSTANCE
===================================================== */

let io:
  Server | null =
  null;


/* =====================================================
   GET SOCKET TOKEN

   Mobile/Web client token इनमें से भेज सकता है:

   socket.auth.token

   या:

   Authorization: Bearer token
===================================================== */

const getSocketToken = (
  authorization:
    string | undefined,

  authToken:
    unknown
): string | null => {
  if (
    typeof authToken ===
      "string" &&
    authToken.trim()
  ) {
    return authToken.trim();
  }

  if (
    !authorization
  ) {
    return null;
  }

  const [
    scheme,
    token,
  ] =
    authorization.split(
      " "
    );

  if (
    scheme !==
      "Bearer" ||
    !token
  ) {
    return null;
  }

  return token;
};


/* =====================================================
   ROOM NAMES
===================================================== */

export const getUserRoom = (
  userId: string
): string => {
  return `user:${userId}`;
};


export const getSchoolRoom = (
  schoolId: string
): string => {
  return `school:${schoolId}`;
};


export const getRoleRoom = (
  schoolId: string,
  role: string
): string => {
  return (
    `school:${schoolId}:role:${role}`
  );
};


/* =====================================================
   INITIALIZE SOCKET SERVER
===================================================== */

export const initializeSocket =
  (
    httpServer:
      HttpServer
  ): Server => {
    if (io) {
      return io;
    }

    const allowedOrigins =
      process.env.CLIENT_URL
        ?.split(",")
        .map(
          (origin) =>
            origin.trim()
        )
        .filter(Boolean);

    io =
      new Server(
        httpServer,
        {
          cors: {
            origin:
              allowedOrigins &&
              allowedOrigins.length >
                0
                ? allowedOrigins
                : [
                    "http://localhost:5173",
                  ],

            credentials:
              true,

            methods: [
              "GET",
              "POST",
            ],
          },

          transports: [
            "websocket",
            "polling",
          ],
        }
      );


    /* =================================================
       SOCKET AUTHENTICATION
    ================================================= */

    io.use(
      (
        socket,
        next
      ) => {
        try {
          const token =
            getSocketToken(
              socket.handshake
                .headers
                .authorization,

              socket.handshake
                .auth
                ?.token
            );

          if (!token) {
            next(
              new Error(
                "Authentication token is required"
              )
            );

            return;
          }

          const payload =
            verifyAccessToken(
              token
            ) as
              AuthTokenPayload;

          if (
            !payload.userId ||
            !payload.schoolId ||
            !payload.role
          ) {
            next(
              new Error(
                "Invalid school user token"
              )
            );

            return;
          }

          const socketUser:
            SocketUserData = {
              userId:
                payload.userId,

              schoolId:
                payload.schoolId,

              role:
                payload.role,

              ...(
                payload.studentId
                  ? {
                      studentId:
                        payload
                          .studentId,
                    }
                  : {}
              ),

              ...(
                payload.teacherId
                  ? {
                      teacherId:
                        payload
                          .teacherId,
                    }
                  : {}
              ),
            };

          socket.data.user =
            socketUser;

          next();
        } catch (
          error
        ) {
          console.error(
            "SOCKET AUTHENTICATION ERROR:",
            error
          );

          next(
            new Error(
              "Invalid or expired authentication token"
            )
          );
        }
      }
    );


    /* =================================================
       SOCKET CONNECTION
    ================================================= */

    io.on(
      "connection",
      (socket) => {
        const user =
          socket.data
            .user as
            SocketUserData;

        const userRoom =
          getUserRoom(
            user.userId
          );

        const schoolRoom =
          getSchoolRoom(
            user.schoolId
          );

        const roleRoom =
          getRoleRoom(
            user.schoolId,
            user.role
          );

        socket.join(
          userRoom
        );

        socket.join(
          schoolRoom
        );

        socket.join(
          roleRoom
        );

        console.log(
          `Socket connected: ${socket.id} user=${user.userId}`
        );


        /* =============================================
           CLIENT READY EVENT
        ============================================= */

        socket.emit(
          "socket:ready",
          {
            success:
              true,

            userId:
              user.userId,
          }
        );


        /* =============================================
           DISCONNECT
        ============================================= */

        socket.on(
          "disconnect",
          (
            reason
          ) => {
            console.log(
              `Socket disconnected: ${socket.id} reason=${reason}`
            );
          }
        );
      }
    );

    return io;
  };


/* =====================================================
   GET INITIALIZED SOCKET SERVER
===================================================== */

export const getSocketServer =
  (): Server | null => {
    return io;
  };


/* =====================================================
   EMIT NOTIFICATION TO ONE USER
===================================================== */

export const emitNotificationToUser =
  (
    userId: string,

    notification:
      unknown
  ): boolean => {
    if (!io) {
      return false;
    }

    io
      .to(
        getUserRoom(
          userId
        )
      )
      .emit(
        "notification:new",
        notification
      );

    return true;
  };


/* =====================================================
   EMIT NOTIFICATION TO SCHOOL
===================================================== */

export const emitNotificationToSchool =
  (
    schoolId: string,

    notification:
      unknown
  ): boolean => {
    if (!io) {
      return false;
    }

    io
      .to(
        getSchoolRoom(
          schoolId
        )
      )
      .emit(
        "notification:new",
        notification
      );

    return true;
  };


/* =====================================================
   EMIT NOTIFICATION TO ROLE

   Example:
   School के सभी teachers को notification.
===================================================== */

export const emitNotificationToRole =
  (
    schoolId: string,

    role: string,

    notification:
      unknown
  ): boolean => {
    if (!io) {
      return false;
    }

    io
      .to(
        getRoleRoom(
          schoolId,
          role
        )
      )
      .emit(
        "notification:new",
        notification
      );

    return true;
  };