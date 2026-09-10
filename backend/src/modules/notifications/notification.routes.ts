import {
  Router,
} from "express";

import {
  authenticate,
} from "../../middlewares/auth.middleware";

import {
  authorize,
} from "../../middlewares/role.middleware";

import {
  UserRole,
} from "../../constants/roles";

import {
  deactivateDeviceTokenController,
  deleteNotificationController,
  getMyNotificationsController,
  getMyUnreadCountController,
  markAllNotificationsReadController,
  markNotificationReadController,
  registerDeviceTokenController,
} from "./notification.controller";


/* =====================================================
   ROUTER
===================================================== */

const router =
  Router();


/* =====================================================
   AUTHENTICATION

   सभी notification APIs protected हैं।
===================================================== */

router.use(
  authenticate
);


/* =====================================================
   ROLE AUTHORIZATION

   Notifications केवल tenant users के लिए हैं।
===================================================== */

router.use(
  authorize(
    UserRole.SCHOOL_ADMIN,
    UserRole.TEACHER,
    UserRole.STUDENT
  )
);


/* =====================================================
   GET MY NOTIFICATIONS

   GET /api/v1/notifications

   Query:
   ?page=1
   &limit=20
   &isRead=false
   &type=SUBJECT_ASSIGNED
===================================================== */

router.get(
  "/",

  getMyNotificationsController
);


/* =====================================================
   GET UNREAD COUNT

   GET /api/v1/notifications/unread-count
===================================================== */

router.get(
  "/unread-count",

  getMyUnreadCountController
);


/* =====================================================
   MARK ALL AS READ

   इसे /:notificationId/read से पहले रखना बेहतर है।
===================================================== */

router.patch(
  "/read-all",

  markAllNotificationsReadController
);


/* =====================================================
   REGISTER OR UPDATE DEVICE TOKEN

   POST /api/v1/notifications/devices

   Mobile:
   {
     "platform": "ANDROID",
     "tokenType": "EXPO",
     "token": "ExponentPushToken[...]",
     "deviceId": "...",
     "deviceName": "Samsung..."
   }

   Web:
   {
     "platform": "WEB",
     "tokenType": "FCM",
     "token": "...",
     "deviceId": "...",
     "deviceName": "Chrome..."
   }
===================================================== */

router.post(
  "/devices",

  registerDeviceTokenController
);


/* =====================================================
   DEACTIVATE DEVICE TOKEN

   DELETE /api/v1/notifications/devices/:deviceId

   Mobile/Web logout से पहले call करेंगे।
===================================================== */

router.delete(
  "/devices/:deviceId",

  deactivateDeviceTokenController
);


/* =====================================================
   MARK ONE NOTIFICATION AS READ

   PATCH
   /api/v1/notifications/:notificationId/read
===================================================== */

router.patch(
  "/:notificationId/read",

  markNotificationReadController
);


/* =====================================================
   DELETE ONE NOTIFICATION

   DELETE /api/v1/notifications/:notificationId
===================================================== */

router.delete(
  "/:notificationId",

  deleteNotificationController
);


export default
  router;