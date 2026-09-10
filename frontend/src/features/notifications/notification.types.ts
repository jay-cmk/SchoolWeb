/* =====================================================
   NOTIFICATION TYPES
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
   NOTIFICATION METADATA

   url:
   Web navigation के लिए.

   screen:
   Mobile navigation के लिए.
===================================================== */

export interface NotificationMetadata {
  screen?:
    string;

  url?:
    string;

  subjectId?:
    string;

  assignmentId?:
    string;

  studentSubjectEnrollmentId?:
    string;

  homeworkId?:
    string;

  attendanceId?:
    string;

  timetableId?:
    string;

  classId?:
    string;

  sectionId?:
    string;

  sessionId?:
    string;

  teacherId?:
    string;

  studentId?:
    string;

  stream?:
    string;

  sessionName?:
    string;

  weeklyPeriods?:
    number;

  [key: string]:
    | string
    | number
    | boolean
    | undefined;
}


/* =====================================================
   NOTIFICATION DATA
===================================================== */

export interface NotificationData {
  _id:
    string;

  schoolId:
    string;

  recipientUserId:
    string;

  recipientRole:
    NotificationRecipientRole;

  type:
    NotificationType;

  title:
    string;

  message:
    string;

  priority:
    NotificationPriority;

  sound:
    NotificationSound;

  channels:
    NotificationChannel[];

  metadata?:
    NotificationMetadata;

  isRead:
    boolean;

  readAt?:
    string;

  createdAt:
    string;

  updatedAt:
    string;
}


/* =====================================================
   PAGINATION
===================================================== */

export interface NotificationPagination {
  total:
    number;

  page:
    number;

  limit:
    number;

  totalPages:
    number;
}


/* =====================================================
   GET NOTIFICATIONS PARAMS
===================================================== */

export interface GetNotificationsParams {
  type?:
    NotificationType;

  isRead?:
    boolean;

  page?:
    number;

  limit?:
    number;
}


/* =====================================================
   NOTIFICATION LIST DATA
===================================================== */

export interface NotificationListData {
  notifications:
    NotificationData[];

  pagination:
    NotificationPagination;

  unreadCount:
    number;
}


/* =====================================================
   LIST RESPONSE
===================================================== */

export interface NotificationListResponse {
  success:
    boolean;

  message:
    string;

  data:
    NotificationListData;
}


/* =====================================================
   UNREAD COUNT RESPONSE
===================================================== */

export interface UnreadCountResponse {
  success:
    boolean;

  message:
    string;

  data: {
    unreadCount:
      number;
  };
}


/* =====================================================
   SINGLE NOTIFICATION RESPONSE
===================================================== */

export interface NotificationResponse {
  success:
    boolean;

  message:
    string;

  data: {
    notification:
      NotificationData;
  };
}


/* =====================================================
   MARK ALL READ RESPONSE
===================================================== */

export interface MarkAllReadResponse {
  success:
    boolean;

  message:
    string;

  data: {
    modifiedCount:
      number;
  };
}


/* =====================================================
   BASIC SUCCESS RESPONSE
===================================================== */

export interface NotificationSuccessResponse {
  success:
    boolean;

  message:
    string;
}


/* =====================================================
   WEB DEVICE REGISTRATION
===================================================== */

export interface RegisterWebDevicePayload {
  platform:
    "WEB";

  tokenType:
    "FCM";

  token:
    string;

  deviceId:
    string;

  deviceName?:
    string;
}


/* =====================================================
   DEVICE TOKEN RESPONSE
===================================================== */

export interface WebDeviceTokenData {
  _id:
    string;

  schoolId:
    string;

  userId:
    string;

  platform:
    "WEB";

  tokenType:
    "FCM";

  token:
    string;

  deviceId:
    string;

  deviceName?:
    string;

  isActive:
    boolean;

  lastUsedAt:
    string;

  createdAt:
    string;

  updatedAt:
    string;
}


export interface WebDeviceTokenResponse {
  success:
    boolean;

  message:
    string;

  data: {
    device:
      WebDeviceTokenData;
  };
}


/* =====================================================
   REDUX STATE
===================================================== */

export interface NotificationState {
  notifications:
    NotificationData[];

  unreadCount:
    number;

  pagination:
    NotificationPagination | null;

  loading:
    boolean;

  refreshing:
    boolean;

  error:
    string | null;

  initialized:
    boolean;

  /*
   * Realtime toast के लिए latest notification.
   */
  latestNotification:
    NotificationData | null;

  /*
   * User ने web sound enable किया या नहीं.
   */
  soundEnabled:
    boolean;
}

export interface GetNotificationsParams {
  page?: number;
  limit?: number;
  isRead?: boolean;
  type?: NotificationType;
}

export interface RegisterWebDeviceTokenPayload {
  token: string;
  deviceId: string;
  platform: "WEB";
  
}

export interface DeactivateWebDeviceTokenPayload {
  deviceId: string;
}

export interface NotificationListData {
  notifications: NotificationData[];
  pagination: NotificationPagination;
  unreadCount: number;
}

export interface NotificationState {
  notifications: NotificationData[];

  pagination:
    NotificationPagination | null;

  unreadCount: number;

  latestNotification:
    NotificationData | null;

  loading: boolean;

  loadingMore: boolean;

  updating: boolean;

  deviceRegistering: boolean;

  initialized: boolean;

  error: string | null;

  soundEnabled: boolean;
}
export interface RegisterWebDeviceTokenPayload {
  token: string;
  deviceId: string;
  platform: "WEB";
  tokenType: "FCM";
  deviceName?: string;
}