import type {
  Types,
} from "mongoose";


/* =====================================================
   NOTIFICATION TYPES

   Controlled scope:
   - Subject assignment
   - Elective assignment
   - Homework
   - Absence
   - Timetable
   - General notice
===================================================== */

export type NotificationType =
  | "SUBJECT_ASSIGNED"
  | "ELECTIVE_ASSIGNED"
  | "HOMEWORK_ASSIGNED"
  | "STUDENT_ABSENT"
  | "TIMETABLE_CHANGED"
  | "GENERAL_NOTICE";


/* =====================================================
   NOTIFICATION PRIORITY
===================================================== */

export type NotificationPriority =
  | "LOW"
  | "NORMAL"
  | "HIGH";


/* =====================================================
   NOTIFICATION SOUND

   DEFAULT:
   Normal notification sound.

   IMPORTANT:
   Important/high-priority notification sound.

   NONE:
   Silent notification.
===================================================== */

export type NotificationSound =
  | "DEFAULT"
  | "IMPORTANT"
  | "NONE";


/* =====================================================
   DELIVERY CHANNEL
===================================================== */

export type NotificationChannel =
  | "IN_APP"
  | "PUSH";


/* =====================================================
   RECIPIENT ROLE
===================================================== */

export type NotificationRecipientRole =
  | "SCHOOL_ADMIN"
  | "TEACHER"
  | "STUDENT";


/* =====================================================
   NOTIFICATION DATA

   Deep-link और संबंधित record IDs इसमें जाएंगे.
===================================================== */

export interface NotificationMetadata {
  screen?: string;

  url?: string;

  subjectId?: string;

  assignmentId?: string;

  studentSubjectEnrollmentId?: string;

  homeworkId?: string;

  attendanceId?: string;

  timetableId?: string;

  classId?: string;

  sectionId?: string;

  sessionId?: string;

  teacherId?: string;

  studentId?: string;

  [key: string]:
    string | number | boolean | undefined;
}


/* =====================================================
   NOTIFICATION DOCUMENT
===================================================== */

export interface INotification {
  _id: Types.ObjectId;

  schoolId: Types.ObjectId;

  recipientUserId:
    Types.ObjectId;

  recipientRole:
    NotificationRecipientRole;

  type:
    NotificationType;

  title: string;

  message: string;

  priority:
    NotificationPriority;

  sound:
    NotificationSound;

  channels:
    NotificationChannel[];

  metadata?:
    NotificationMetadata;

  isRead: boolean;

  readAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}


/* =====================================================
   CREATE NOTIFICATION DATA

   Backend services इसे notification service को देंगे.
===================================================== */

export interface CreateNotificationData {
  schoolId: string;

  recipientUserId: string;

  recipientRole:
    NotificationRecipientRole;

  type:
    NotificationType;

  title: string;

  message: string;

  priority?:
    NotificationPriority;

  sound?:
    NotificationSound;

  channels?:
    NotificationChannel[];

  metadata?:
    NotificationMetadata;
}


/* =====================================================
   CREATE MULTIPLE NOTIFICATIONS

   Homework या notice कई users को भेजने के लिए.
===================================================== */

export interface CreateBulkNotificationData {
  schoolId: string;

  recipients: Array<{
    userId: string;

    role:
      NotificationRecipientRole;
  }>;

  type:
    NotificationType;

  title: string;

  message: string;

  priority?:
    NotificationPriority;

  sound?:
    NotificationSound;

  channels?:
    NotificationChannel[];

  metadata?:
    NotificationMetadata;
}


/* =====================================================
   NOTIFICATION FILTERS
===================================================== */

export interface NotificationFilters {
  type?:
    NotificationType;

  isRead?: boolean;

  limit?: number;

  page?: number;
}


/* =====================================================
   DEVICE PLATFORM
===================================================== */

export type DevicePlatform =
  | "ANDROID"
  | "IOS"
  | "WEB";


/* =====================================================
   PUSH TOKEN TYPE

   Mobile:
   EXPO

   Web:
   FCM
===================================================== */

export type PushTokenType =
  | "EXPO"
  | "FCM";


/* =====================================================
   DEVICE TOKEN DOCUMENT
===================================================== */

export interface IDeviceToken {
  _id: Types.ObjectId;

  schoolId: Types.ObjectId;

  userId: Types.ObjectId;

  platform:
    DevicePlatform;

  tokenType:
    PushTokenType;

  token: string;

  deviceId: string;

  deviceName?: string;

  isActive: boolean;

  lastUsedAt: Date;

  createdAt: Date;

  updatedAt: Date;
}


/* =====================================================
   REGISTER DEVICE TOKEN
===================================================== */

export interface RegisterDeviceTokenData {
  platform:
    DevicePlatform;

  tokenType:
    PushTokenType;

  token: string;

  deviceId: string;

  deviceName?: string;
}


/* =====================================================
   UPDATE NOTIFICATION PREFERENCE
===================================================== */

export interface NotificationPreferenceData {
  notificationsEnabled?: boolean;

  soundEnabled?: boolean;

  subjectAssignmentEnabled?: boolean;

  electiveAssignmentEnabled?: boolean;

  homeworkEnabled?: boolean;

  attendanceEnabled?: boolean;

  timetableEnabled?: boolean;

  generalNoticeEnabled?: boolean;
}