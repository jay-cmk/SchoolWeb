import mongoose, {
  Schema,
} from "mongoose";

import type {
  IDeviceToken,
} from "./notification.types";


/* =====================================================
   CONSTANTS
===================================================== */

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
   DEVICE TOKEN SCHEMA

   Mobile:
   platform = ANDROID / IOS
   tokenType = EXPO

   Web:
   platform = WEB
   tokenType = FCM
===================================================== */

const deviceTokenSchema =
  new Schema<IDeviceToken>(
    {
      /* ===============================================
         SCHOOL / TENANT
      =============================================== */

      schoolId: {
        type:
          Schema.Types.ObjectId,

        ref:
          "School",

        required:
          true,

        index:
          true,
      },


      /* ===============================================
         LOGGED-IN USER

         यहां User._id store होगा.
      =============================================== */

      userId: {
        type:
          Schema.Types.ObjectId,

        ref:
          "User",

        required:
          true,

        index:
          true,
      },


      /* ===============================================
         DEVICE PLATFORM
      =============================================== */

      platform: {
        type:
          String,

        enum:
          DEVICE_PLATFORMS,

        required:
          true,

        index:
          true,
      },


      /* ===============================================
         PUSH TOKEN TYPE
      =============================================== */

      tokenType: {
        type:
          String,

        enum:
          PUSH_TOKEN_TYPES,

        required:
          true,

        index:
          true,
      },


      /* ===============================================
         PUSH TOKEN

         Mobile:
         ExponentPushToken[...]

         Web:
         Firebase FCM token
      =============================================== */

      token: {
        type:
          String,

        required:
          true,

        trim:
          true,
      },


      /* ===============================================
         DEVICE ID

         Mobile:
         App generated persistent UUID.

         Web:
         Browser generated persistent UUID.
      =============================================== */

      deviceId: {
        type:
          String,

        required:
          true,

        trim:
          true,
      },


      /* ===============================================
         OPTIONAL DEVICE NAME
      =============================================== */

      deviceName: {
        type:
          String,

        trim:
          true,

        maxlength:
          150,

        default:
          undefined,
      },


      /* ===============================================
         TOKEN STATUS
      =============================================== */

      isActive: {
        type:
          Boolean,

        default:
          true,

        required:
          true,

        index:
          true,
      },


      /* ===============================================
         LAST USED DATE
      =============================================== */

      lastUsedAt: {
        type:
          Date,

        default: () =>
          new Date(),

        required:
          true,
      },
    },

    {
      timestamps:
        true,

      versionKey:
        false,
    }
  );


/* =====================================================
   ONE DEVICE RECORD PER USER

   Same user के same device से दो records नहीं बनेंगे.
   Token बदलने पर existing record update होगा.
===================================================== */

deviceTokenSchema.index(
  {
    schoolId:
      1,

    userId:
      1,

    deviceId:
      1,
  },

  {
    unique:
      true,
  }
);


/* =====================================================
   UNIQUE PUSH TOKEN

   एक push token केवल एक device record में रहेगा.
===================================================== */

deviceTokenSchema.index(
  {
    token:
      1,
  },

  {
    unique:
      true,
  }
);


/* =====================================================
   ACTIVE USER DEVICES

   Notification भेजते समय active tokens निकालने के लिए.
===================================================== */

deviceTokenSchema.index({
  schoolId:
    1,

  userId:
    1,

  isActive:
    1,

  platform:
    1,
});


/* =====================================================
   STALE DEVICE CLEANUP LOOKUP
===================================================== */

deviceTokenSchema.index({
  isActive:
    1,

  lastUsedAt:
    1,
});


/* =====================================================
   VALIDATE PLATFORM AND TOKEN TYPE
===================================================== */

deviceTokenSchema.pre(
  "validate",
  function () {
    if (
      this.platform ===
        "WEB" &&
      this.tokenType !==
        "FCM"
    ) {
      throw new Error(
        "Web devices must use an FCM token"
      );
    }

    if (
      (
        this.platform ===
          "ANDROID" ||
        this.platform ===
          "IOS"
      ) &&
      this.tokenType !==
        "EXPO"
    ) {
      throw new Error(
        "Mobile devices must use an Expo push token"
      );
    }
  }
);


/* =====================================================
   MODEL
===================================================== */

export const DeviceToken =
  mongoose.model<IDeviceToken>(
    "DeviceToken",
    deviceTokenSchema
  );