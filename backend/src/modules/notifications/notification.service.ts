import mongoose from "mongoose";

import {
  Notification,
} from "./notification.model";

import {
  DeviceToken,
} from "./deviceToken.model";

import {
  emitNotificationToUser,
} from "../../config/socket";

import type {
  CreateBulkNotificationData,
  CreateNotificationData,
  NotificationFilters,
  RegisterDeviceTokenData,
} from "./notification.types";


/* =====================================================
   OBJECT ID VALIDATION
===================================================== */

const validateObjectId = (
  value: string,
  fieldName: string
): void => {
  if (
    !mongoose.Types.ObjectId
      .isValid(value)
  ) {
    throw new Error(
      `Invalid ${fieldName}`
    );
  }
};


/* =====================================================
   CREATE SINGLE NOTIFICATION

   यह पहले MongoDB में notification save करेगा.
===================================================== */
/* =====================================================
   CREATE SINGLE NOTIFICATION

   Flow:
   1. MongoDB में save
   2. Online user को Socket.IO event
   3. Saved notification return
===================================================== */
/* =====================================================
   CREATE SINGLE NOTIFICATION

   Flow:
   1. MongoDB में save
   2. Online user को Socket.IO event
   3. Saved notification return
===================================================== */

export const createNotification =
  async (
    data:
      CreateNotificationData
  ) => {
    validateObjectId(
      data.schoolId,
      "school ID"
    );

    validateObjectId(
      data.recipientUserId,
      "recipient user ID"
    );

    const title =
      data.title.trim();

    const message =
      data.message.trim();

    if (!title) {
      throw new Error(
        "Notification title is required"
      );
    }

    if (!message) {
      throw new Error(
        "Notification message is required"
      );
    }

    const notification =
      await Notification.create({
        schoolId:
          new mongoose.Types.ObjectId(
            data.schoolId
          ),

        recipientUserId:
          new mongoose.Types.ObjectId(
            data.recipientUserId
          ),

        recipientRole:
          data.recipientRole,

        type:
          data.type,

        title,

        message,

        priority:
          data.priority ??
          "NORMAL",

        sound:
          data.sound ??
          "DEFAULT",

        channels:
          data.channels ?? [
            "IN_APP",
            "PUSH",
          ],

        ...(
          data.metadata
            ? {
                metadata:
                  data.metadata,
              }
            : {}
        ),
      });

    /*
     * Socket.IO को plain object भेजें.
     */
    const notificationObject =
      notification.toObject();

    /*
     * केवल IN_APP channel होने पर realtime event.
     * Socket server initialize न हो तो function false
     * return करेगा, लेकिन API fail नहीं होगी.
     */
    if (
      notification.channels.includes(
        "IN_APP"
      )
    ) {
      emitNotificationToUser(
        data.recipientUserId,
        notificationObject
      );
    }

    return notification;
  };


/* =====================================================
   CREATE BULK NOTIFICATIONS

   Homework या general notice multiple users को भेजने
   के लिए इस्तेमाल होगा.
===================================================== */

/* =====================================================
   CREATE BULK NOTIFICATIONS

   Homework या notice multiple users को भेजने के लिए.

   Flow:
   1. सभी records MongoDB में insert
   2. हर online recipient को realtime socket event
===================================================== */

export const createBulkNotifications =
  async (
    data:
      CreateBulkNotificationData
  ) => {
    validateObjectId(
      data.schoolId,
      "school ID"
    );

    if (
      !Array.isArray(
        data.recipients
      ) ||
      data.recipients.length ===
        0
    ) {
      return [];
    }

    const title =
      data.title.trim();

    const message =
      data.message.trim();

    if (!title) {
      throw new Error(
        "Notification title is required"
      );
    }

    if (!message) {
      throw new Error(
        "Notification message is required"
      );
    }

    const schoolObjectId =
      new mongoose.Types.ObjectId(
        data.schoolId
      );

    /*
     * Same user दो बार आया हो तो duplicate
     * notification नहीं बनेगी.
     */
    const uniqueRecipients =
      Array.from(
        new Map(
          data.recipients.map(
            (recipient) => [
              recipient.userId,
              recipient,
            ]
          )
        ).values()
      );

    const channels =
      data.channels ?? [
        "IN_APP",
        "PUSH",
      ];

    const documents =
      uniqueRecipients.map(
        (recipient) => {
          validateObjectId(
            recipient.userId,
            "recipient user ID"
          );

          return {
            schoolId:
              schoolObjectId,

            recipientUserId:
              new mongoose.Types.ObjectId(
                recipient.userId
              ),

            recipientRole:
              recipient.role,

            type:
              data.type,

            title,

            message,

            priority:
              data.priority ??
              "NORMAL",

            sound:
              data.sound ??
              "DEFAULT",

            channels,

            ...(
              data.metadata
                ? {
                    metadata:
                      data.metadata,
                  }
                : {}
            ),

            isRead:
              false,
          };
        }
      );

    const notifications =
      await Notification.insertMany(
        documents
      );

    /*
     * Online recipients को realtime notification.
     */
    if (
      channels.includes(
        "IN_APP"
      )
    ) {
      notifications.forEach(
        (
          notification
        ) => {
          emitNotificationToUser(
            notification
              .recipientUserId
              .toString(),

            notification.toObject()
          );
        }
      );
    }

    return notifications;
  };


/* =====================================================
   GET LOGGED-IN USER NOTIFICATIONS
===================================================== */

export const getUserNotifications =
  async (
    schoolId: string,
    userId: string,
    filters:
      NotificationFilters = {}
  ) => {
    validateObjectId(
      schoolId,
      "school ID"
    );

    validateObjectId(
      userId,
      "user ID"
    );

    const requestedLimit =
      filters.limit ?? 20;

    const requestedPage =
      filters.page ?? 1;

    const limit =
      Math.min(
        Math.max(
          requestedLimit,
          1
        ),
        100
      );

    const page =
      Math.max(
        requestedPage,
        1
      );

    const query: Record<
      string,
      unknown
    > = {
      schoolId:
        new mongoose.Types.ObjectId(
          schoolId
        ),

      recipientUserId:
        new mongoose.Types.ObjectId(
          userId
        ),
    };

    if (
      filters.type
    ) {
      query.type =
        filters.type;
    }

    if (
      filters.isRead !==
      undefined
    ) {
      query.isRead =
        filters.isRead;
    }

    const [
      notifications,
      total,
      unreadCount,
    ] = await Promise.all([
      Notification.find(
        query
      )
        .sort({
          createdAt: -1,
        })
        .skip(
          (page - 1) *
            limit
        )
        .limit(limit)
        .lean(),

      Notification.countDocuments(
        query
      ),

      Notification.countDocuments({
        schoolId:
          new mongoose.Types.ObjectId(
            schoolId
          ),

        recipientUserId:
          new mongoose.Types.ObjectId(
            userId
          ),

        isRead:
          false,
      }),
    ]);

    return {
      notifications,

      pagination: {
        total,
        page,
        limit,

        totalPages:
          Math.ceil(
            total / limit
          ),
      },

      unreadCount,
    };
  };


/* =====================================================
   GET UNREAD COUNT
===================================================== */

export const getUnreadNotificationCount =
  async (
    schoolId: string,
    userId: string
  ): Promise<number> => {
    validateObjectId(
      schoolId,
      "school ID"
    );

    validateObjectId(
      userId,
      "user ID"
    );

    return Notification.countDocuments({
      schoolId:
        new mongoose.Types.ObjectId(
          schoolId
        ),

      recipientUserId:
        new mongoose.Types.ObjectId(
          userId
        ),

      isRead:
        false,
    });
  };


/* =====================================================
   MARK ONE NOTIFICATION AS READ
===================================================== */

export const markNotificationAsRead =
  async (
    schoolId: string,
    userId: string,
    notificationId: string
  ) => {
    validateObjectId(
      schoolId,
      "school ID"
    );

    validateObjectId(
      userId,
      "user ID"
    );

    validateObjectId(
      notificationId,
      "notification ID"
    );

    const notification =
      await Notification.findOneAndUpdate(
        {
          _id:
            new mongoose.Types.ObjectId(
              notificationId
            ),

          schoolId:
            new mongoose.Types.ObjectId(
              schoolId
            ),

          recipientUserId:
            new mongoose.Types.ObjectId(
              userId
            ),
        },

        {
          $set: {
            isRead:
              true,

            readAt:
              new Date(),
          },
        },

        {
          new:
            true,

          runValidators:
            true,
        }
      ).lean();

    if (
      !notification
    ) {
      throw new Error(
        "Notification not found"
      );
    }

    return notification;
  };


/* =====================================================
   MARK ALL NOTIFICATIONS AS READ
===================================================== */

export const markAllNotificationsAsRead =
  async (
    schoolId: string,
    userId: string
  ) => {
    validateObjectId(
      schoolId,
      "school ID"
    );

    validateObjectId(
      userId,
      "user ID"
    );

    const result =
      await Notification.updateMany(
        {
          schoolId:
            new mongoose.Types.ObjectId(
              schoolId
            ),

          recipientUserId:
            new mongoose.Types.ObjectId(
              userId
            ),

          isRead:
            false,
        },

        {
          $set: {
            isRead:
              true,

            readAt:
              new Date(),
          },
        }
      );

    return {
      modifiedCount:
        result.modifiedCount,
    };
  };


/* =====================================================
   DELETE ONE NOTIFICATION

   User केवल अपनी notification delete कर सकता है.
===================================================== */

export const deleteUserNotification =
  async (
    schoolId: string,
    userId: string,
    notificationId: string
  ) => {
    validateObjectId(
      schoolId,
      "school ID"
    );

    validateObjectId(
      userId,
      "user ID"
    );

    validateObjectId(
      notificationId,
      "notification ID"
    );

    const notification =
      await Notification.findOneAndDelete({
        _id:
          new mongoose.Types.ObjectId(
            notificationId
          ),

        schoolId:
          new mongoose.Types.ObjectId(
            schoolId
          ),

        recipientUserId:
          new mongoose.Types.ObjectId(
            userId
          ),
      }).lean();

    if (
      !notification
    ) {
      throw new Error(
        "Notification not found"
      );
    }

    return notification;
  };


/* =====================================================
   REGISTER OR UPDATE DEVICE TOKEN

   Login के बाद web/mobile app इस service को call करेगी.
===================================================== */

export const registerDeviceToken =
  async (
    schoolId: string,
    userId: string,
    data:
      RegisterDeviceTokenData
  ) => {
    validateObjectId(
      schoolId,
      "school ID"
    );

    validateObjectId(
      userId,
      "user ID"
    );

    const token =
      data.token.trim();

    const deviceId =
      data.deviceId.trim();

    if (!token) {
      throw new Error(
        "Push token is required"
      );
    }

    if (!deviceId) {
      throw new Error(
        "Device ID is required"
      );
    }

    /*
     * अगर वही token पहले किसी पुराने device/user record
     * में है तो उसे हटाया जाएगा, क्योंकि push token
     * एक समय में केवल एक active device record का होगा.
     */
    await DeviceToken.deleteMany({
      token,

      $or: [
        {
          schoolId: {
            $ne:
              new mongoose.Types.ObjectId(
                schoolId
              ),
          },
        },

        {
          userId: {
            $ne:
              new mongoose.Types.ObjectId(
                userId
              ),
          },
        },

        {
          deviceId: {
            $ne:
              deviceId,
          },
        },
      ],
    });

    const updateData: Record<
      string,
      unknown
    > = {
      token,

      platform:
        data.platform,

      tokenType:
        data.tokenType,

      isActive:
        true,

      lastUsedAt:
        new Date(),
    };

    if (
      data.deviceName
        ?.trim()
    ) {
      updateData.deviceName =
        data.deviceName.trim();
    }

    const device =
      await DeviceToken.findOneAndUpdate(
        {
          schoolId:
            new mongoose.Types.ObjectId(
              schoolId
            ),

          userId:
            new mongoose.Types.ObjectId(
              userId
            ),

          deviceId,
        },

        {
          $set:
            updateData,

          $setOnInsert: {
            schoolId:
              new mongoose.Types.ObjectId(
                schoolId
              ),

            userId:
              new mongoose.Types.ObjectId(
                userId
              ),

            deviceId,
          },
        },

        {
          new:
            true,

          upsert:
            true,

          runValidators:
            true,

          setDefaultsOnInsert:
            true,
        }
      ).lean();

    return device;
  };


/* =====================================================
   DEACTIVATE ONE DEVICE

   Logout के समय call होगा.
===================================================== */

export const deactivateDeviceToken =
  async (
    schoolId: string,
    userId: string,
    deviceId: string
  ) => {
    validateObjectId(
      schoolId,
      "school ID"
    );

    validateObjectId(
      userId,
      "user ID"
    );

    const normalizedDeviceId =
      deviceId.trim();

    if (
      !normalizedDeviceId
    ) {
      throw new Error(
        "Device ID is required"
      );
    }

    const device =
      await DeviceToken.findOneAndUpdate(
        {
          schoolId:
            new mongoose.Types.ObjectId(
              schoolId
            ),

          userId:
            new mongoose.Types.ObjectId(
              userId
            ),

          deviceId:
            normalizedDeviceId,
        },

        {
          $set: {
            isActive:
              false,

            lastUsedAt:
              new Date(),
          },
        },

        {
          new:
            true,
        }
      ).lean();

    if (!device) {
      throw new Error(
        "Device token not found"
      );
    }

    return device;
  };


/* =====================================================
   GET ACTIVE USER DEVICES

   Push service इसका इस्तेमाल करेगी.
===================================================== */

export const getActiveUserDevices =
  async (
    schoolId: string,
    userId: string
  ) => {
    validateObjectId(
      schoolId,
      "school ID"
    );

    validateObjectId(
      userId,
      "user ID"
    );

    return DeviceToken.find({
      schoolId:
        new mongoose.Types.ObjectId(
          schoolId
        ),

      userId:
        new mongoose.Types.ObjectId(
          userId
        ),

      isActive:
        true,
    })
      .select({
        platform: 1,
        tokenType: 1,
        token: 1,
        deviceId: 1,
      })
      .lean();
  };