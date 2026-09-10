import mongoose, {
  Schema,
} from "mongoose";

import type {
  INotification,
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


const NOTIFICATION_PRIORITIES = [
  "LOW",
  "NORMAL",
  "HIGH",
] as const;


const NOTIFICATION_SOUNDS = [
  "DEFAULT",
  "IMPORTANT",
  "NONE",
] as const;


const NOTIFICATION_CHANNELS = [
  "IN_APP",
  "PUSH",
] as const;


const RECIPIENT_ROLES = [
  "SCHOOL_ADMIN",
  "TEACHER",
  "STUDENT",
] as const;


/* =====================================================
   NOTIFICATION SCHEMA
===================================================== */

const notificationSchema =
  new Schema<INotification>(
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
         RECIPIENT USER

         यहां User._id store होगा.
         Teacher._id या Student._id नहीं.
      =============================================== */

      recipientUserId: {
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
         RECIPIENT ROLE
      =============================================== */

      recipientRole: {
        type:
          String,

        enum:
          RECIPIENT_ROLES,

        required:
          true,

        index:
          true,
      },


      /* ===============================================
         NOTIFICATION TYPE
      =============================================== */

      type: {
        type:
          String,

        enum:
          NOTIFICATION_TYPES,

        required:
          true,

        index:
          true,
      },


      /* ===============================================
         TITLE
      =============================================== */

      title: {
        type:
          String,

        required:
          true,

        trim:
          true,

        maxlength:
          150,
      },


      /* ===============================================
         MESSAGE
      =============================================== */

      message: {
        type:
          String,

        required:
          true,

        trim:
          true,

        maxlength:
          1000,
      },


      /* ===============================================
         PRIORITY
      =============================================== */

      priority: {
        type:
          String,

        enum:
          NOTIFICATION_PRIORITIES,

        default:
          "NORMAL",

        required:
          true,

        index:
          true,
      },


      /* ===============================================
         SOUND
      =============================================== */

      sound: {
        type:
          String,

        enum:
          NOTIFICATION_SOUNDS,

        default:
          "DEFAULT",

        required:
          true,
      },


      /* ===============================================
         DELIVERY CHANNELS
      =============================================== */

      channels: {
        type: [
          {
            type:
              String,

            enum:
              NOTIFICATION_CHANNELS,
          },
        ],

        default: [
          "IN_APP",
          "PUSH",
        ],

        required:
          true,
      },


      /* ===============================================
         METADATA / DEEP-LINK DATA

         Example:
         {
           screen: "Subjects",
           url: "/teacher/subjects",
           assignmentId: "...",
           subjectId: "..."
         }
      =============================================== */

      metadata: {
        type:
          Schema.Types.Mixed,

        default:
          undefined,
      },


      /* ===============================================
         READ STATUS
      =============================================== */

      isRead: {
        type:
          Boolean,

        default:
          false,

        required:
          true,

        index:
          true,
      },


      /* ===============================================
         READ DATE
      =============================================== */

      readAt: {
        type:
          Date,

        default:
          undefined,
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
   VALIDATE READ STATUS

   isRead true होने पर readAt automatic set होगा.

   isRead false होने पर readAt remove होगा.
===================================================== */

notificationSchema.pre(
  "validate",
  function () {
    if (
      this.isRead &&
      !this.readAt
    ) {
      this.readAt =
        new Date();
    }

    if (
      !this.isRead
    ) {
      this.readAt =
        undefined;
    }
  }
);


/* =====================================================
   USER NOTIFICATION LIST INDEX

   Logged-in user के latest notifications निकालने के लिए.
===================================================== */

notificationSchema.index({
  schoolId:
    1,

  recipientUserId:
    1,

  createdAt:
    -1,
});


/* =====================================================
   UNREAD NOTIFICATION INDEX

   Notification bell unread count के लिए.
===================================================== */

notificationSchema.index({
  schoolId:
    1,

  recipientUserId:
    1,

  isRead:
    1,

  createdAt:
    -1,
});


/* =====================================================
   NOTIFICATION TYPE FILTER INDEX
===================================================== */

notificationSchema.index({
  schoolId:
    1,

  recipientUserId:
    1,

  type:
    1,

  createdAt:
    -1,
});


/* =====================================================
   MODEL
===================================================== */

export const Notification =
  mongoose.model<INotification>(
    "Notification",
    notificationSchema
  );