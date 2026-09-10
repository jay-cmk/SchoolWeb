import type {
  Request,
  Response,
} from "express";

import {
  deactivateDeviceToken,
  deleteUserNotification,
  getUnreadNotificationCount,
  getUserNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  registerDeviceToken,
} from "./notification.service";

import type {
  DevicePlatform,
  NotificationFilters,
  NotificationType,
  PushTokenType,
  RegisterDeviceTokenData,
} from "./notification.types";


/* =====================================================
   CONSTANTS
===================================================== */

const NOTIFICATION_TYPES = [
  "SUBJECT_ASSIGNED",
  "ELECTIVE_ASSIGNED",
  "HOMEWORK_ASSIGNED",
  "STUDENT_ABSENT",
  "TIMETABLE_CHANGED",
  "GENERAL_NOTICE",
] as const;


const DEVICE_PLATFORMS = [
  "ANDROID",
  "IOS",
  "WEB",
] as const;


const PUSH_TOKEN_TYPES = [
  "EXPO",
  "FCM",
] as const;


/* =====================================================
   GET SINGLE STRING VALUE

   Express query/params में value string|string[]
   हो सकती है, इसलिए यह helper TypeScript error रोकेगा.
===================================================== */

const getStringValue = (
  value: unknown
): string | undefined => {
  if (
    typeof value ===
    "string"
  ) {
    return value;
  }

  if (
    Array.isArray(value) &&
    typeof value[0] ===
      "string"
  ) {
    return value[0];
  }

  return undefined;
};


/* =====================================================
   GET AUTH CONTEXT
===================================================== */

const getAuthContext = (
  req: Request
): {
  schoolId: string;
  userId: string;
} => {
  const schoolId =
    req.user?.schoolId;

  const userId =
    req.user?.userId;

  if (
    !schoolId ||
    !userId
  ) {
    throw new Error(
      "Authenticated school user is required"
    );
  }

  return {
    schoolId,
    userId,
  };
};


/* =====================================================
   ERROR RESPONSE
===================================================== */

const sendErrorResponse = (
  res: Response,
  error: unknown
): void => {
  const message =
    error instanceof Error
      ? error.message
      : "Something went wrong";

  const statusCode =
    message.includes(
      "not found"
    )
      ? 404
      : message.startsWith(
            "Invalid"
          ) ||
          message.includes(
            "required"
          ) ||
          message.includes(
            "must use"
          )
        ? 400
        : 500;

  res
    .status(statusCode)
    .json({
      success:
        false,

      message,
    });
};


/* =====================================================
   GET MY NOTIFICATIONS

   GET /api/v1/notifications

   Query:
   ?type=SUBJECT_ASSIGNED
   &isRead=false
   &page=1
   &limit=20
===================================================== */

export const getMyNotificationsController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        schoolId,
        userId,
      } =
        getAuthContext(req);

      const typeValue =
        getStringValue(
          req.query.type
        );

      const isReadValue =
        getStringValue(
          req.query.isRead
        );

      const pageValue =
        getStringValue(
          req.query.page
        );

      const limitValue =
        getStringValue(
          req.query.limit
        );

      const filters:
        NotificationFilters =
        {};

      if (
        typeValue
      ) {
        if (
          !NOTIFICATION_TYPES.includes(
            typeValue as
              NotificationType
          )
        ) {
          res.status(400).json({
            success:
              false,

            message:
              "Invalid notification type",
          });

          return;
        }

        filters.type =
          typeValue as
            NotificationType;
      }

      if (
        isReadValue !==
        undefined
      ) {
        if (
          isReadValue !==
            "true" &&
          isReadValue !==
            "false"
        ) {
          res.status(400).json({
            success:
              false,

            message:
              "isRead must be true or false",
          });

          return;
        }

        filters.isRead =
          isReadValue ===
          "true";
      }

      if (
        pageValue
      ) {
        const page =
          Number(pageValue);

        if (
          !Number.isInteger(
            page
          ) ||
          page < 1
        ) {
          res.status(400).json({
            success:
              false,

            message:
              "Page must be a positive integer",
          });

          return;
        }

        filters.page =
          page;
      }

      if (
        limitValue
      ) {
        const limit =
          Number(limitValue);

        if (
          !Number.isInteger(
            limit
          ) ||
          limit < 1
        ) {
          res.status(400).json({
            success:
              false,

            message:
              "Limit must be a positive integer",
          });

          return;
        }

        filters.limit =
          limit;
      }

      const result =
        await getUserNotifications(
          schoolId,
          userId,
          filters
        );

      res.status(200).json({
        success:
          true,

        message:
          "Notifications fetched successfully",

        data:
          result,
      });
    } catch (
      error
    ) {
      sendErrorResponse(
        res,
        error
      );
    }
  };


/* =====================================================
   GET MY UNREAD COUNT

   GET /api/v1/notifications/unread-count
===================================================== */

export const getMyUnreadCountController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        schoolId,
        userId,
      } =
        getAuthContext(req);

      const unreadCount =
        await getUnreadNotificationCount(
          schoolId,
          userId
        );

      res.status(200).json({
        success:
          true,

        message:
          "Unread notification count fetched successfully",

        data: {
          unreadCount,
        },
      });
    } catch (
      error
    ) {
      sendErrorResponse(
        res,
        error
      );
    }
  };


/* =====================================================
   MARK ONE AS READ

   PATCH
   /api/v1/notifications/:notificationId/read
===================================================== */

export const markNotificationReadController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        schoolId,
        userId,
      } =
        getAuthContext(req);

      const notificationId =
        getStringValue(
          req.params
            .notificationId
        );

      if (
        !notificationId
      ) {
        res.status(400).json({
          success:
            false,

          message:
            "Notification ID is required",
        });

        return;
      }

      const notification =
        await markNotificationAsRead(
          schoolId,
          userId,
          notificationId
        );

      res.status(200).json({
        success:
          true,

        message:
          "Notification marked as read",

        data: {
          notification,
        },
      });
    } catch (
      error
    ) {
      sendErrorResponse(
        res,
        error
      );
    }
  };


/* =====================================================
   MARK ALL AS READ

   PATCH /api/v1/notifications/read-all
===================================================== */

export const markAllNotificationsReadController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        schoolId,
        userId,
      } =
        getAuthContext(req);

      const result =
        await markAllNotificationsAsRead(
          schoolId,
          userId
        );

      res.status(200).json({
        success:
          true,

        message:
          "All notifications marked as read",

        data:
          result,
      });
    } catch (
      error
    ) {
      sendErrorResponse(
        res,
        error
      );
    }
  };


/* =====================================================
   DELETE MY NOTIFICATION

   DELETE /api/v1/notifications/:notificationId
===================================================== */

export const deleteNotificationController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        schoolId,
        userId,
      } =
        getAuthContext(req);

      const notificationId =
        getStringValue(
          req.params
            .notificationId
        );

      if (
        !notificationId
      ) {
        res.status(400).json({
          success:
            false,

          message:
            "Notification ID is required",
        });

        return;
      }

      await deleteUserNotification(
        schoolId,
        userId,
        notificationId
      );

      res.status(200).json({
        success:
          true,

        message:
          "Notification deleted successfully",
      });
    } catch (
      error
    ) {
      sendErrorResponse(
        res,
        error
      );
    }
  };


/* =====================================================
   REGISTER DEVICE

   POST /api/v1/notifications/devices

   Mobile example:
   {
     platform: "ANDROID",
     tokenType: "EXPO",
     token: "ExponentPushToken[...]",
     deviceId: "...",
     deviceName: "Samsung..."
   }
===================================================== */

export const registerDeviceTokenController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        schoolId,
        userId,
      } =
        getAuthContext(req);


      const platform =
        getStringValue(
          req.body?.platform
        );

      const tokenType =
        getStringValue(
          req.body?.tokenType
        );

      const token =
        getStringValue(
          req.body?.token
        );

      const deviceId =
        getStringValue(
          req.body?.deviceId
        );

      const deviceName =
        getStringValue(
          req.body?.deviceName
        );


      /* ===============================================
         VALIDATE PLATFORM
      =============================================== */

      if (
        !platform ||
        !DEVICE_PLATFORMS.includes(
          platform as DevicePlatform
        )
      ) {
        res.status(400).json({
          success: false,

          message:
            "Valid device platform is required",
        });

        return;
      }


      /* ===============================================
         VALIDATE TOKEN TYPE
      =============================================== */

      if (
        !tokenType ||
        !PUSH_TOKEN_TYPES.includes(
          tokenType as PushTokenType
        )
      ) {
        res.status(400).json({
          success: false,

          message:
            "Valid push token type is required",
        });

        return;
      }


      /* ===============================================
         VALIDATE TOKEN
      =============================================== */

      if (
        !token?.trim()
      ) {
        res.status(400).json({
          success: false,

          message:
            "Push token is required",
        });

        return;
      }


      /* ===============================================
         VALIDATE DEVICE ID
      =============================================== */

      if (
        !deviceId?.trim()
      ) {
        res.status(400).json({
          success: false,

          message:
            "Device ID is required",
        });

        return;
      }


      /* ===============================================
         NORMALIZED VALUES
      =============================================== */

      const normalizedPlatform =
        platform as DevicePlatform;

      const normalizedTokenType =
        tokenType as PushTokenType;


      /* ===============================================
         WEB MUST USE FCM
      =============================================== */

      if (
        normalizedPlatform ===
          "WEB" &&
        normalizedTokenType !==
          "FCM"
      ) {
        res.status(400).json({
          success: false,

          message:
            "Web devices must use an FCM token",
        });

        return;
      }


      /* ===============================================
         MOBILE MUST USE EXPO
      =============================================== */

      if (
        (
          normalizedPlatform ===
            "ANDROID" ||
          normalizedPlatform ===
            "IOS"
        ) &&
        normalizedTokenType !==
          "EXPO"
      ) {
        res.status(400).json({
          success: false,

          message:
            "Mobile devices must use an Expo push token",
        });

        return;
      }


      /* ===============================================
         CREATE SERVICE DATA
      =============================================== */

      const registerData:
        RegisterDeviceTokenData = {
          platform:
            normalizedPlatform,

          tokenType:
            normalizedTokenType,

          token:
            token.trim(),

          deviceId:
            deviceId.trim(),

          ...(deviceName?.trim()
            ? {
                deviceName:
                  deviceName
                    .trim()
                    .slice(
                      0,
                      150
                    ),
              }
            : {}),
        };


      const device =
        await registerDeviceToken(
          schoolId,
          userId,
          registerData
        );


      res.status(200).json({
        success: true,

        message:
          "Device registered successfully",

        data: {
          device,
        },
      });
    } catch (
      error
    ) {
      sendErrorResponse(
        res,
        error
      );
    }
  };


/* =====================================================
   DEACTIVATE DEVICE

   DELETE
   /api/v1/notifications/devices/:deviceId

   Logout से पहले mobile/web इसे call करेंगे.
===================================================== */

// export const deactivateDeviceTokenController =
//   async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {
//     try {
//       const {
//         schoolId,
//         userId,
//       } =
//         getAuthContext(req);

//       const deviceId =
//         getStringValue(
//           req.params.deviceId
//         );

//       if (
//         !deviceId
//       ) {
//         res.status(400).json({
//           success:
//             false,

//           message:
//             "Device ID is required",
//         });

//         return;
//       }

//       const device =
//         await deactivateDeviceToken(
//           schoolId,
//           userId,
//           deviceId
//         );

//       res.status(200).json({
//         success:
//           true,

//         message:
//           "Device deactivated successfully",

//         data: {
//           device,
//         },
//       });
//     } catch (
//       error
//     ) {
//       sendErrorResponse(
//         res,
//         error
//       );
//     }
//   };


  /* =====================================================
   DEACTIVATE DEVICE TOKEN

   DELETE /api/v1/notifications/devices/:deviceId
===================================================== */

export const deactivateDeviceTokenController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        schoolId,
        userId,
      } =
        getAuthContext(req);

      const deviceId =
        getStringValue(
          req.params.deviceId
        );

      if (!deviceId) {
        res.status(400).json({
          success: false,
          message:
            "Device ID is required",
        });

        return;
      }

      const device =
        await deactivateDeviceToken(
          schoolId,
          userId,
          deviceId
        );

      res.status(200).json({
        success: true,

        message:
          "Device token deactivated successfully",

        data: {
          device,
        },
      });
    } catch (error) {
      sendErrorResponse(
        res,
        error
      );
    }
  };