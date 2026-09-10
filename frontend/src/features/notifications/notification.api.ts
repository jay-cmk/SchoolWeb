// import api from "../../api/axios";

// import type {
//   DeactivateWebDeviceTokenPayload,
//   GetNotificationsParams,
//   NotificationData,
//   NotificationListData,
//   NotificationListResponse,
//   NotificationResponse,
//   RegisterWebDeviceTokenPayload,
//   UnreadCountResponse,
// } from "./notification.types";


// /* =====================================================
//    GET MY NOTIFICATIONS

//    GET /api/v1/notifications
// ===================================================== */

// export const getNotificationsApi =
//   async (
//     params?: GetNotificationsParams
//   ): Promise<NotificationListData> => {
//     const queryParams: Record<
//       string,
//       string | number | boolean
//     > = {};

//     if (params?.page !== undefined) {
//       queryParams.page = params.page;
//     }

//     if (params?.limit !== undefined) {
//       queryParams.limit = params.limit;
//     }

//     if (params?.isRead !== undefined) {
//       queryParams.isRead = params.isRead;
//     }

//     if (params?.type) {
//       queryParams.type = params.type;
//     }

//     const response =
//       await api.get<NotificationListResponse>(
//         "/notifications",
//         {
//           params: queryParams,
//         }
//       );

//     return response.data.data;
//   };


// /* =====================================================
//    GET UNREAD COUNT

//    GET /api/v1/notifications/unread-count
// ===================================================== */

// export const getUnreadNotificationCountApi =
//   async (): Promise<number> => {
//     const response =
//       await api.get<UnreadCountResponse>(
//         "/notifications/unread-count"
//       );

//     return response.data.data.unreadCount;
//   };


// /* =====================================================
//    MARK ONE NOTIFICATION AS READ

//    PATCH /api/v1/notifications/:notificationId/read
// ===================================================== */

// export const markNotificationReadApi =
//   async (
//     notificationId: string
//   ): Promise<NotificationData> => {
//     const response =
//       await api.patch<NotificationResponse>(
//         `/notifications/${notificationId}/read`
//       );

//     return response.data.data.notification;
//   };


// /* =====================================================
//    MARK ALL NOTIFICATIONS AS READ

//    PATCH /api/v1/notifications/read-all
// ===================================================== */

// export const markAllNotificationsReadApi =
//   async (): Promise<number> => {
//     const response = await api.patch<{
//       success: boolean;
//       message: string;
//       data: {
//         modifiedCount: number;
//       };
//     }>(
//       "/notifications/read-all"
//     );

//     return response.data.data.modifiedCount;
//   };


// /* =====================================================
//    DELETE ONE NOTIFICATION

//    DELETE /api/v1/notifications/:notificationId
// ===================================================== */

// export const deleteNotificationApi =
//   async (
//     notificationId: string
//   ): Promise<string> => {
//     await api.delete(
//       `/notifications/${notificationId}`
//     );

//     return notificationId;
//   };


// /* =====================================================
//    REGISTER WEB FCM TOKEN

//    POST /api/v1/notifications/devices
// ===================================================== */

// export const registerWebDeviceTokenApi =
//   async (
//     data: RegisterWebDeviceTokenPayload
//   ): Promise<void> => {
//     await api.post(
//       "/notifications/devices",
//       data
//     );
//   };


// /* =====================================================
//    DEACTIVATE WEB FCM TOKEN

//    PATCH /api/v1/notifications/devices/deactivate
// ===================================================== */

// export const deactivateWebDeviceTokenApi =
//   async (
//     data:
//       DeactivateWebDeviceTokenPayload
//   ): Promise<void> => {
//     await api.delete(
//       `/notifications/devices/${encodeURIComponent(
//         data.deviceId
//       )}`
//     );
//   };


import api from "../../api/axios";

import type {
  DeactivateWebDeviceTokenPayload,
  GetNotificationsParams,
  NotificationData,
  NotificationListData,
  NotificationListResponse,
  NotificationResponse,
  RegisterWebDeviceTokenPayload,
  UnreadCountResponse,
} from "./notification.types";


/* =====================================================
   MARK ALL READ RESPONSE
===================================================== */

interface MarkAllNotificationsReadResponse {
  success: boolean;

  message: string;

  data: {
    modifiedCount: number;
  };
}


/* =====================================================
   GET MY NOTIFICATIONS

   GET /api/v1/notifications
===================================================== */

export const getNotificationsApi =
  async (
    params?:
      GetNotificationsParams
  ): Promise<NotificationListData> => {
    const queryParams: Record<
      string,
      string | number | boolean
    > = {};


    if (
      params?.page !==
      undefined
    ) {
      queryParams.page =
        params.page;
    }


    if (
      params?.limit !==
      undefined
    ) {
      queryParams.limit =
        params.limit;
    }


    if (
      params?.isRead !==
      undefined
    ) {
      queryParams.isRead =
        params.isRead;
    }


    if (
      params?.type
    ) {
      queryParams.type =
        params.type;
    }


    const response =
      await api.get<NotificationListResponse>(
        "/notifications",

        {
          params:
            queryParams,
        }
      );


    return response.data.data;
  };


/* =====================================================
   GET UNREAD COUNT

   GET /api/v1/notifications/unread-count
===================================================== */

export const getUnreadNotificationCountApi =
  async (): Promise<number> => {
    const response =
      await api.get<UnreadCountResponse>(
        "/notifications/unread-count"
      );


    return response.data.data.unreadCount;
  };


/* =====================================================
   MARK ONE NOTIFICATION AS READ

   PATCH /api/v1/notifications/:notificationId/read
===================================================== */

export const markNotificationReadApi =
  async (
    notificationId: string
  ): Promise<NotificationData> => {
    const normalizedNotificationId =
      notificationId.trim();


    if (
      !normalizedNotificationId
    ) {
      throw new Error(
        "Notification ID is required"
      );
    }


    const response =
      await api.patch<NotificationResponse>(
        `/notifications/${encodeURIComponent(
          normalizedNotificationId
        )}/read`
      );


    return response.data.data.notification;
  };


/* =====================================================
   MARK ALL NOTIFICATIONS AS READ

   PATCH /api/v1/notifications/read-all
===================================================== */

export const markAllNotificationsReadApi =
  async (): Promise<number> => {
    const response =
      await api.patch<MarkAllNotificationsReadResponse>(
        "/notifications/read-all"
      );


    return response.data.data.modifiedCount;
  };


/* =====================================================
   DELETE ONE NOTIFICATION

   DELETE /api/v1/notifications/:notificationId
===================================================== */

export const deleteNotificationApi =
  async (
    notificationId: string
  ): Promise<string> => {
    const normalizedNotificationId =
      notificationId.trim();


    if (
      !normalizedNotificationId
    ) {
      throw new Error(
        "Notification ID is required"
      );
    }


    await api.delete(
      `/notifications/${encodeURIComponent(
        normalizedNotificationId
      )}`
    );


    return normalizedNotificationId;
  };


/* =====================================================
   REGISTER WEB FCM TOKEN

   POST /api/v1/notifications/devices
===================================================== */

export const registerWebDeviceTokenApi =
  async (
    data:
      RegisterWebDeviceTokenPayload
  ): Promise<void> => {
    await api.post(
      "/notifications/devices",

      {
        platform:
          data.platform,

        tokenType:
          data.tokenType,

        token:
          data.token.trim(),

        deviceId:
          data.deviceId.trim(),

        ...(data.deviceName?.trim()
          ? {
              deviceName:
                data.deviceName
                  .trim()
                  .slice(
                    0,
                    150
                  ),
            }
          : {}),
      }
    );
  };


/* =====================================================
   DEACTIVATE WEB FCM TOKEN

   DELETE /api/v1/notifications/devices/:deviceId
===================================================== */

export const deactivateWebDeviceTokenApi =
  async (
    data:
      DeactivateWebDeviceTokenPayload
  ): Promise<void> => {
    const normalizedDeviceId =
      data.deviceId.trim();


    if (
      !normalizedDeviceId
    ) {
      throw new Error(
        "Device ID is required"
      );
    }


    await api.delete(
      `/notifications/devices/${encodeURIComponent(
        normalizedDeviceId
      )}`
    );
  };