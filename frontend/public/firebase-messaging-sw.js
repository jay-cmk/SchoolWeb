/* eslint-disable no-undef */

/* =====================================================
   NOTIFICATION CLICK
===================================================== */

self.addEventListener(
  "notificationclick",

  function (event) {
    event.notification.close();

    const notificationData = event.notification.data || {};

    const targetUrl = notificationData.url || "/notifications";

    /*
     * Dismiss action par sirf notification close hogi.
     */
    if (event.action === "close") {
      return;
    }

    event.waitUntil(
      clients
        .matchAll({
          type: "window",
          includeUncontrolled: true,
        })
        .then(function (clientList) {
          /*
           * App pehle se open hai to existing
           * browser tab ko focus karenge.
           */
          for (const client of clientList) {
            if ("focus" in client) {
              return client.focus().then(function () {
                if ("navigate" in client) {
                  return client.navigate(targetUrl);
                }

                return client;
              });
            }
          }

          /*
           * App open nahi hai to new tab open hoga.
           */
          if (clients.openWindow) {
            return clients.openWindow(targetUrl);
          }

          return undefined;
        }),
    );
  },
);

/* =====================================================
   FIREBASE COMPAT LIBRARIES

   public folder ke service worker me Vite
   import.meta.env directly available nahi hota.
===================================================== */

importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js",
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js",
);

/* =====================================================
   FIREBASE WEB CONFIG
===================================================== */

firebase.initializeApp({
  apiKey: "AIzaSyCfhUsxQX_UlEWDgoG2DDgrCNrBjk62fT0",

  authDomain: "schoolap-9ca02.firebaseapp.com",

  projectId: "schoolap-9ca02",

  storageBucket: "schoolap-9ca02.firebasestorage.app",

  messagingSenderId: "227907990410",

  appId: "1:227907990410:web:1ae72775ef770a48390e73",
});

/* =====================================================
   FIREBASE MESSAGING
===================================================== */

const messaging = firebase.messaging();

/* =====================================================
   BACKGROUND MESSAGE

   Backend se data-only FCM message bhejna better hai.
   Isse notification display ko hum control kar sakte hain.
===================================================== */

messaging.onBackgroundMessage(function (payload) {
  console.log("BACKGROUND WEB PUSH RECEIVED:", payload);

  const payloadData = payload.data || {};

  const title =
    payload.notification?.title || payloadData.title || "New notification";

  const message =
    payload.notification?.body ||
    payloadData.message ||
    "You have received a new school update.";

  const icon =
    payload.notification?.icon ||
    payloadData.icon ||
    "/icons/notification-icon.png";

  const badge = payloadData.badge || "/icons/notification-badge.png";

  const image = payload.notification?.image || payloadData.imageUrl;

  const url = payloadData.url || "/notifications";

  const tag = payloadData.notificationId || `notification-${Date.now()}`;

  const notificationOptions = {
    body: message,

    icon,

    badge,

    tag,

    /*
     * Same tag wali notification dobara aane
     * par user ko alert karne deta hai.
     */
    renotify: true,

    requireInteraction: payloadData.priority === "HIGH",

    /*
     * NONE hone par silent notification.
     */
    silent: payloadData.sound === "NONE",

    data: {
      url,

      notificationId: payloadData.notificationId,

      type: payloadData.type,

      metadata: payloadData.metadata,
    },

    actions: [
      {
        action: "open",
        title: "View details",
      },
      {
        action: "close",
        title: "Dismiss",
      },
    ],
  };

  if (image) {
    notificationOptions.image = image;
  }

  return self.registration.showNotification(title, notificationOptions);
});

/* =====================================================
   PUSH SUBSCRIPTION CHANGE

   Browser push subscription change hone par
   open app ko token refresh ka message bhejenge.
===================================================== */

self.addEventListener(
  "pushsubscriptionchange",

  function (event) {
    event.waitUntil(
      clients
        .matchAll({
          type: "window",
          includeUncontrolled: true,
        })
        .then(function (clientList) {
          for (const client of clientList) {
            client.postMessage({
              type: "FCM_TOKEN_REFRESH_REQUIRED",
            });
          }
        }),
    );
  },
);
