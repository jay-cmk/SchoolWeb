import {
  Expo,
} from "expo-server-sdk";

import type {
  ExpoPushMessage,
  ExpoPushTicket,
} from "expo-server-sdk";

import type {
  BatchResponse,
  MulticastMessage,
} from "firebase-admin/messaging";

import {
  getFirebaseAdminMessaging,
} from "../../config/firebaseAdmin";

import {
  DeviceToken,
} from "./deviceToken.model";

import type {
  INotification,
  NotificationMetadata,
  NotificationSound,
} from "./notification.types";


/* =====================================================
   EXPO CLIENT
===================================================== */

const expo =
  new Expo();


/* =====================================================
   MAX FCM TOKENS PER REQUEST

   Firebase multicast request में maximum 500 tokens।
===================================================== */

const FCM_BATCH_SIZE =
  500;


/* =====================================================
   MOBILE PUSH RESULT
===================================================== */

export interface PushDeliveryResult {
  attempted: number;

  sent: number;

  failed: number;

  invalidTokens: number;

  tickets:
    ExpoPushTicket[];
}


/* =====================================================
   WEB PUSH RESULT
===================================================== */

export interface WebPushDeliveryResult {
  attempted: number;

  sent: number;

  failed: number;

  invalidTokens: number;

  responses:
    BatchResponse[];
}


/* =====================================================
   COMBINED PUSH RESULT
===================================================== */

export interface CombinedPushDeliveryResult {
  mobile:
    PushDeliveryResult;

  web:
    WebPushDeliveryResult;

  attempted: number;

  sent: number;

  failed: number;

  invalidTokens: number;
}


/* =====================================================
   EMPTY MOBILE RESULT
===================================================== */

const getEmptyMobileResult =
  (): PushDeliveryResult => {
    return {
      attempted: 0,

      sent: 0,

      failed: 0,

      invalidTokens: 0,

      tickets: [],
    };
  };


/* =====================================================
   EMPTY WEB RESULT
===================================================== */

const getEmptyWebResult =
  (): WebPushDeliveryResult => {
    return {
      attempted: 0,

      sent: 0,

      failed: 0,

      invalidTokens: 0,

      responses: [],
    };
  };


/* =====================================================
   GET MOBILE SOUND SETTINGS
===================================================== */

const getSoundConfiguration = (
  sound:
    NotificationSound
): {
  sound:
    "default" | null;

  channelId:
    | "general"
    | "important"
    | "silent";
} => {
  if (
    sound ===
    "IMPORTANT"
  ) {
    return {
      sound:
        "default",

      channelId:
        "important",
    };
  }


  if (
    sound ===
    "NONE"
  ) {
    return {
      sound:
        null,

      channelId:
        "silent",
    };
  }


  return {
    sound:
      "default",

    channelId:
      "general",
  };
};


/* =====================================================
   NORMALIZE METADATA

   केवल JSON-compatible primitive values push payload
   में भेजे जाएंगे।
===================================================== */

const normalizeMetadata = (
  metadata?:
    NotificationMetadata
): Record<
  string,
  string | number | boolean
> => {
  const normalized: Record<
    string,
    string | number | boolean
  > = {};


  if (
    !metadata
  ) {
    return normalized;
  }


  Object.entries(
    metadata
  ).forEach(
    ([
      key,
      value,
    ]) => {
      if (
        typeof value ===
          "string" ||
        typeof value ===
          "number" ||
        typeof value ===
          "boolean"
      ) {
        normalized[key] =
          value;
      }
    }
  );


  return normalized;
};


/* =====================================================
   CONVERT METADATA TO FCM DATA

   Firebase data payload में हर value string होनी चाहिए।
===================================================== */

const createFirebaseData = (
  notification:
    INotification
): Record<
  string,
  string
> => {
  const metadata =
    normalizeMetadata(
      notification.metadata
    );


  const firebaseData: Record<
    string,
    string
  > = {
    notificationId:
      notification._id.toString(),

    notificationType:
      notification.type,

    type:
      notification.type,

    title:
      notification.title,

    message:
      notification.message,

    priority:
      notification.priority,

    sound:
      notification.sound,
  };


  Object.entries(
    metadata
  ).forEach(
    ([
      key,
      value,
    ]) => {
      firebaseData[key] =
        String(
          value
        );
    }
  );


  if (
    !firebaseData.url
  ) {
    firebaseData.url =
      "/notifications";
  }


  return firebaseData;
};


/* =====================================================
   SPLIT ARRAY INTO CHUNKS
===================================================== */

const createChunks = <T>(
  items:
    T[],

  chunkSize:
    number
): T[][] => {
  const chunks:
    T[][] = [];


  for (
    let index = 0;
    index <
    items.length;
    index +=
      chunkSize
  ) {
    chunks.push(
      items.slice(
        index,
        index +
          chunkSize
      )
    );
  }


  return chunks;
};


/* =====================================================
   DEACTIVATE INVALID TOKENS
===================================================== */

const deactivateTokens =
  async (
    tokens:
      string[]
  ): Promise<void> => {
    const uniqueTokens =
      Array.from(
        new Set(
          tokens.filter(
            Boolean
          )
        )
      );


    if (
      uniqueTokens.length ===
      0
    ) {
      return;
    }


    await DeviceToken.updateMany(
      {
        token: {
          $in:
            uniqueTokens,
        },
      },

      {
        $set: {
          isActive:
            false,

          lastUsedAt:
            new Date(),
        },
      }
    );
  };


/* =====================================================
   CHECK FCM INVALID TOKEN ERROR
===================================================== */

const isInvalidFirebaseTokenError = (
  errorCode?: string
): boolean => {
  return (
    errorCode ===
      "messaging/registration-token-not-registered" ||
    errorCode ===
      "messaging/invalid-registration-token"
  );
};


/* =====================================================
   SEND MOBILE PUSH

   ANDROID / IOS + EXPO tokens
===================================================== */

export const sendMobilePushNotification =
  async (
    notification:
      INotification
  ): Promise<
    PushDeliveryResult
  > => {
    if (
      !notification.channels.includes(
        "PUSH"
      )
    ) {
      return getEmptyMobileResult();
    }


    const devices =
      await DeviceToken.find({
        schoolId:
          notification.schoolId,

        userId:
          notification
            .recipientUserId,

        platform: {
          $in: [
            "ANDROID",
            "IOS",
          ],
        },

        tokenType:
          "EXPO",

        isActive:
          true,
      })
        .select({
          token: 1,

          platform: 1,

          deviceId: 1,
        })
        .lean();


    if (
      devices.length ===
      0
    ) {
      return getEmptyMobileResult();
    }


    const invalidTokens:
      string[] = [];


    const validDevices =
      devices.filter(
        (
          device
        ) => {
          const valid =
            Expo.isExpoPushToken(
              device.token
            );


          if (
            !valid
          ) {
            invalidTokens.push(
              device.token
            );
          }


          return valid;
        }
      );


    await deactivateTokens(
      invalidTokens
    );


    if (
      validDevices.length ===
      0
    ) {
      return {
        attempted:
          devices.length,

        sent: 0,

        failed:
          devices.length,

        invalidTokens:
          invalidTokens.length,

        tickets: [],
      };
    }


    const {
      sound,
      channelId,
    } =
      getSoundConfiguration(
        notification.sound
      );


    const metadata =
      normalizeMetadata(
        notification.metadata
      );


    const messages:
      ExpoPushMessage[] =
      validDevices.map(
        (
          device
        ) => ({
          to:
            device.token,

          title:
            notification.title,

          body:
            notification.message,

          sound,

          channelId,

          priority:
            notification.priority ===
            "HIGH"
              ? "high"
              : "default",

          data: {
            ...metadata,

            notificationId:
              notification._id.toString(),

            notificationType:
              notification.type,
          },
        })
      );


    const chunks =
      expo.chunkPushNotifications(
        messages
      );


    const tickets:
      ExpoPushTicket[] = [];


    const rejectedTokens:
      string[] = [];


    let sent =
      0;

    let failed =
      invalidTokens.length;

    let messageIndex =
      0;


    for (
      const chunk of
      chunks
    ) {
      try {
        const chunkTickets =
          await expo
            .sendPushNotificationsAsync(
              chunk
            );


        tickets.push(
          ...chunkTickets
        );


        chunkTickets.forEach(
          (
            ticket
          ) => {
            const currentMessage =
              messages[
                messageIndex
              ];


            messageIndex +=
              1;


            if (
              ticket.status ===
              "ok"
            ) {
              sent +=
                1;

              return;
            }


            failed +=
              1;


            if (
              ticket.details
                ?.error ===
                "DeviceNotRegistered" &&
              currentMessage
            ) {
              const token =
                Array.isArray(
                  currentMessage.to
                )
                  ? currentMessage
                      .to[0]
                  : currentMessage
                      .to;


              if (
                token
              ) {
                rejectedTokens.push(
                  token
                );
              }
            }


            console.error(
              "EXPO PUSH TICKET ERROR:",
              ticket.message,
              ticket.details
            );
          }
        );
      } catch (
        error
      ) {
        failed +=
          chunk.length;

        messageIndex +=
          chunk.length;


        console.error(
          "EXPO PUSH SEND ERROR:",
          error
        );
      }
    }


    await deactivateTokens(
      rejectedTokens
    );


    return {
      attempted:
        devices.length,

      sent,

      failed,

      invalidTokens:
        invalidTokens.length +
        rejectedTokens.length,

      tickets,
    };
  };


/* =====================================================
   SEND WEB PUSH

   WEB + FCM tokens

   यह data-only FCM message भेजता है। Background में
   firebase-messaging-sw.js notification दिखाएगा।
===================================================== */

export const sendWebPushNotification =
  async (
    notification:
      INotification
  ): Promise<
    WebPushDeliveryResult
  > => {
    if (
      !notification.channels.includes(
        "PUSH"
      )
    ) {
      return getEmptyWebResult();
    }


    const messaging =
      getFirebaseAdminMessaging();


    if (
      !messaging
    ) {
      console.warn(
        "WEB PUSH SKIPPED: Firebase Admin is not configured"
      );

      return getEmptyWebResult();
    }


    const devices =
      await DeviceToken.find({
        schoolId:
          notification.schoolId,

        userId:
          notification
            .recipientUserId,

        platform:
          "WEB",

        tokenType:
          "FCM",

        isActive:
          true,
      })
        .select({
          token: 1,

          platform: 1,

          deviceId: 1,
        })
        .lean();


    if (
      devices.length ===
      0
    ) {
      return getEmptyWebResult();
    }


    const tokenChunks =
      createChunks(
        devices.map(
          (
            device
          ) =>
            device.token
        ),

        FCM_BATCH_SIZE
      );


    const responses:
      BatchResponse[] = [];


    const invalidTokens:
      string[] = [];


    let sent =
      0;

    let failed =
      0;


    const firebaseData =
      createFirebaseData(
        notification
      );


    for (
      const tokens of
      tokenChunks
    ) {
      try {
        const multicastMessage:
          MulticastMessage = {
          tokens,

          data:
            firebaseData,

          webpush: {
            headers: {
              Urgency:
                notification.priority ===
                "HIGH"
                  ? "high"
                  : "normal",
            },
          },
        };


        const response =
          await messaging
            .sendEachForMulticast(
              multicastMessage
            );


        responses.push(
          response
        );


        sent +=
          response.successCount;

        failed +=
          response.failureCount;


        response.responses.forEach(
          (
            sendResponse,
            responseIndex
          ) => {
            if (
              sendResponse.success
            ) {
              return;
            }


            const failedToken =
              tokens[
                responseIndex
              ];


            const errorCode =
              sendResponse.error
                ?.code;


            if (
              failedToken &&
              isInvalidFirebaseTokenError(
                errorCode
              )
            ) {
              invalidTokens.push(
                failedToken
              );
            }


            console.error(
              "FCM WEB PUSH ERROR:",
              {
                token:
                  failedToken
                    ? `${failedToken.slice(
                        0,
                        15
                      )}...`
                    : "unknown",

                code:
                  errorCode,

                message:
                  sendResponse.error
                    ?.message,
              }
            );
          }
        );
      } catch (
        error
      ) {
        failed +=
          tokens.length;


        console.error(
          "FCM WEB PUSH BATCH ERROR:",
          error
        );
      }
    }


    await deactivateTokens(
      invalidTokens
    );


    return {
      attempted:
        devices.length,

      sent,

      failed,

      invalidTokens:
        invalidTokens.length,

      responses,
    };
  };


/* =====================================================
   SEND ALL PUSH NOTIFICATIONS

   Mobile Expo और Web FCM parallel भेजे जाएंगे।
===================================================== */

export const sendPushNotification =
  async (
    notification:
      INotification
  ): Promise<
    CombinedPushDeliveryResult
  > => {
    if (
      !notification.channels.includes(
        "PUSH"
      )
    ) {
      const mobile =
        getEmptyMobileResult();

      const web =
        getEmptyWebResult();


      return {
        mobile,

        web,

        attempted: 0,

        sent: 0,

        failed: 0,

        invalidTokens: 0,
      };
    }


    const [
      mobileResult,
      webResult,
    ] =
      await Promise.allSettled([
        sendMobilePushNotification(
          notification
        ),

        sendWebPushNotification(
          notification
        ),
      ]);


    const mobile =
      mobileResult.status ===
      "fulfilled"
        ? mobileResult.value
        : getEmptyMobileResult();


    const web =
      webResult.status ===
      "fulfilled"
        ? webResult.value
        : getEmptyWebResult();


    if (
      mobileResult.status ===
      "rejected"
    ) {
      console.error(
        "MOBILE PUSH DELIVERY ERROR:",
        mobileResult.reason
      );
    }


    if (
      webResult.status ===
      "rejected"
    ) {
      console.error(
        "WEB PUSH DELIVERY ERROR:",
        webResult.reason
      );
    }


    return {
      mobile,

      web,

      attempted:
        mobile.attempted +
        web.attempted,

      sent:
        mobile.sent +
        web.sent,

      failed:
        mobile.failed +
        web.failed,

      invalidTokens:
        mobile.invalidTokens +
        web.invalidTokens,
    };
  };


/* =====================================================
   SAFE ALL-DEVICE PUSH DELIVERY

   Notification delivery fail होने पर subject assignment,
   attendance या homework operation fail नहीं होगा।
===================================================== */

export const sendPushSafely =
  async (
    notification:
      INotification
  ): Promise<void> => {
    try {
      const result =
        await sendPushNotification(
          notification
        );


      console.log(
        "PUSH DELIVERY RESULT:",
        {
          notificationId:
            notification._id.toString(),

          attempted:
            result.attempted,

          sent:
            result.sent,

          failed:
            result.failed,

          invalidTokens:
            result.invalidTokens,

          mobileSent:
            result.mobile.sent,

          webSent:
            result.web.sent,
        }
      );
    } catch (
      error
    ) {
      console.error(
        "PUSH DELIVERY FAILED:",
        error
      );
    }
  };


/* =====================================================
   LEGACY COMPATIBILITY

   पुराने services में sendMobilePushSafely import हो
   सकता है। अब यह Mobile + Web दोनों पर भेजेगा।

   बाद में imports को sendPushSafely नाम पर migrate करें।
===================================================== */

export const sendMobilePushSafely =
  async (
    notification:
      INotification
  ): Promise<void> => {
    await sendPushSafely(
      notification
    );
  };