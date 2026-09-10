import {
  getApp,
  getApps,
  initializeApp,
  type FirebaseApp,
} from "firebase/app";

import {
  deleteToken,
  getMessaging,
  getToken,
  isSupported,
  onMessage,
  type MessagePayload,
  type Messaging,
  type Unsubscribe,
} from "firebase/messaging";

import {
  deactivateWebDeviceTokenApi,
  registerWebDeviceTokenApi,
} from "../features/notifications/notification.api";


/* =====================================================
   FIREBASE CONFIGURATION

   Firebase Console > Project settings > Web app
===================================================== */

const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY,

  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,

  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID,

  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,

  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,

  appId:
    import.meta.env.VITE_FIREBASE_APP_ID,
};


const firebaseVapidKey =
  import.meta.env.VITE_FIREBASE_VAPID_KEY;


/* =====================================================
   STORAGE KEYS
===================================================== */

const WEB_DEVICE_ID_KEY =
  "schoolErpWebDeviceId";

const WEB_FCM_TOKEN_KEY =
  "schoolErpWebFcmToken";


/* =====================================================
   FOREGROUND NOTIFICATION
===================================================== */

export interface WebForegroundNotification {
  title: string;

  message: string;

  imageUrl?: string;

  data: Record<
    string,
    string
  >;

  rawPayload:
    MessagePayload;
}


/* =====================================================
   RESULT TYPE
===================================================== */

export interface WebPushRegistrationResult {
  success: boolean;

  permission:
    NotificationPermission;

  token?: string;

  deviceId?: string;

  message: string;
}


/* =====================================================
   VALIDATE FIREBASE CONFIG
===================================================== */

const hasFirebaseConfiguration =
  (): boolean => {
    return Boolean(
      firebaseConfig.apiKey &&
        firebaseConfig.authDomain &&
        firebaseConfig.projectId &&
        firebaseConfig.messagingSenderId &&
        firebaseConfig.appId &&
        firebaseVapidKey
    );
  };


/* =====================================================
   GET FIREBASE APP
===================================================== */

const getFirebaseApp =
  (): FirebaseApp => {
    if (
      getApps().length >
      0
    ) {
      return getApp();
    }

    return initializeApp(
      firebaseConfig
    );
  };


/* =====================================================
   GET FIREBASE MESSAGING
===================================================== */

const getFirebaseMessaging =
  async (): Promise<Messaging | null> => {
    if (
      typeof window ===
        "undefined" ||
      !(
        "serviceWorker" in
        navigator
      )
    ) {
      return null;
    }


    const messagingSupported =
      await isSupported();

    if (
      !messagingSupported
    ) {
      return null;
    }


    return getMessaging(
      getFirebaseApp()
    );
  };


/* =====================================================
   CREATE PERSISTENT DEVICE ID
===================================================== */

export const getWebDeviceId =
  (): string => {
    const existingDeviceId =
      localStorage.getItem(
        WEB_DEVICE_ID_KEY
      );


    if (
      existingDeviceId
    ) {
      return existingDeviceId;
    }


    const generatedDeviceId =
      typeof crypto !==
        "undefined" &&
      typeof crypto.randomUUID ===
        "function"
        ? crypto.randomUUID()
        : `web-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 12)}`;


    localStorage.setItem(
      WEB_DEVICE_ID_KEY,
      generatedDeviceId
    );


    return generatedDeviceId;
  };


/* =====================================================
   REGISTER FIREBASE SERVICE WORKER

   Required file:
   web/public/firebase-messaging-sw.js
===================================================== */

const registerFirebaseServiceWorker =
  async (): Promise<ServiceWorkerRegistration> => {
    const registration =
      await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
        {
          scope: "/",
        }
      );


    await navigator.serviceWorker.ready;


    return registration;
  };


/* =====================================================
   CHECK WEB PUSH SUPPORT
===================================================== */

export const isWebPushSupported =
  async (): Promise<boolean> => {
    if (
      typeof window ===
        "undefined" ||
      typeof Notification ===
        "undefined" ||
      !(
        "serviceWorker" in
        navigator
      )
    ) {
      return false;
    }


    return isSupported();
  };


/* =====================================================
   GET CURRENT PERMISSION
===================================================== */

export const getWebNotificationPermission =
  (): NotificationPermission => {
    if (
      typeof Notification ===
      "undefined"
    ) {
      return "denied";
    }


    return Notification.permission;
  };


/* =====================================================
   REGISTER WEB PUSH

   इसे user के button click पर call करें क्योंकि browser
   notification permission user interaction पर मांगनी चाहिए.
===================================================== */

export const registerWebPushNotification =
  async (): Promise<WebPushRegistrationResult> => {
    try {
      if (
        !hasFirebaseConfiguration()
      ) {
        return {
          success: false,

          permission:
            getWebNotificationPermission(),

          message:
            "Firebase environment configuration is missing",
        };
      }


      const supported =
        await isWebPushSupported();


      if (
        !supported
      ) {
        return {
          success: false,

          permission:
            getWebNotificationPermission(),

          message:
            "Web push notification is not supported in this browser",
        };
      }


      let permission =
        Notification.permission;


      if (
        permission ===
        "default"
      ) {
        permission =
          await Notification.requestPermission();
      }


      if (
        permission !==
        "granted"
      ) {
        return {
          success: false,

          permission,

          message:
            permission ===
            "denied"
              ? "Notification permission was blocked"
              : "Notification permission was not granted",
        };
      }


      const messaging =
        await getFirebaseMessaging();


      if (
        !messaging
      ) {
        return {
          success: false,

          permission,

          message:
            "Firebase messaging is unavailable",
        };
      }


      const serviceWorkerRegistration =
        await registerFirebaseServiceWorker();


      const token =
        await getToken(
          messaging,
          {
            vapidKey:
              firebaseVapidKey,

            serviceWorkerRegistration,
          }
        );


      if (
        !token
      ) {
        return {
          success: false,

          permission,

          message:
            "Firebase did not return a push token",
        };
      }


      const deviceId =
        getWebDeviceId();

await registerWebDeviceTokenApi({
  token,
  deviceId,
  platform: "WEB",
  tokenType: "FCM",
  deviceName:
    navigator.userAgent.slice(
      0,
      150
    ),
});


      localStorage.setItem(
        WEB_FCM_TOKEN_KEY,
        token
      );


      return {
        success: true,

        permission,

        token,

        deviceId,

        message:
          "Web push notification enabled successfully",
      };
    } catch (error) {
      console.error(
        "WEB PUSH REGISTRATION ERROR:",
        error
      );


      return {
        success: false,

        permission:
          getWebNotificationPermission(),

        message:
          error instanceof Error
            ? error.message
            : "Failed to enable web push notifications",
      };
    }
  };


/* =====================================================
   REFRESH EXISTING TOKEN

   Login/restoreAuth के बाद permission पहले से granted हो
   तो बिना popup दिखाए token backend पर sync करेगा.
===================================================== */

export const syncExistingWebPushToken =
  async (): Promise<WebPushRegistrationResult> => {
    if (
      getWebNotificationPermission() !==
      "granted"
    ) {
      return {
        success: false,

        permission:
          getWebNotificationPermission(),

        message:
          "Web notification permission has not been granted",
      };
    }


    return registerWebPushNotification();
  };


/* =====================================================
   FOREGROUND FIREBASE LISTENER

   Browser tab open होने पर FCM message यहां मिलेगा.
===================================================== */

export const subscribeToForegroundWebPush =
  async (
    callback: (
      notification:
        WebForegroundNotification
    ) => void
  ): Promise<
    Unsubscribe | null
  > => {
    const messaging =
      await getFirebaseMessaging();


    if (
      !messaging
    ) {
      return null;
    }


    return onMessage(
      messaging,

      (
        payload
      ) => {
        const title =
          payload.notification
            ?.title ??
          payload.data?.title ??
          "New notification";


        const message =
          payload.notification
            ?.body ??
          payload.data?.message ??
          "";


        const imageUrl =
          payload.notification
            ?.image ??
          payload.data?.imageUrl;


        const notification: WebForegroundNotification =
          {
            title,

            message,

            data:
              payload.data ??
              {},

            rawPayload:
              payload,
          };


        if (
          imageUrl
        ) {
          notification.imageUrl =
            imageUrl;
        }


        callback(
          notification
        );
      }
    );
  };


/* =====================================================
   DEACTIVATE WEB PUSH

   Logout या notification preference disable होने पर.
===================================================== */

export const deactivateWebPushNotification =
  async (): Promise<void> => {
    const deviceId =
      localStorage.getItem(
        WEB_DEVICE_ID_KEY
      );


    if (
      deviceId
    ) {
      try {
        await deactivateWebDeviceTokenApi({
          deviceId,
        });
      } catch (error) {
        console.error(
          "WEB DEVICE DEACTIVATION ERROR:",
          error
        );
      }
    }


    try {
      const messaging =
        await getFirebaseMessaging();


      if (
        messaging
      ) {
        await deleteToken(
          messaging
        );
      }
    } catch (error) {
      console.error(
        "FIREBASE TOKEN DELETE ERROR:",
        error
      );
    }


    localStorage.removeItem(
      WEB_FCM_TOKEN_KEY
    );
  };


/* =====================================================
   GET STORED FCM TOKEN
===================================================== */

export const getStoredWebFcmToken =
  (): string | null => {
    return localStorage.getItem(
      WEB_FCM_TOKEN_KEY
    );
  };