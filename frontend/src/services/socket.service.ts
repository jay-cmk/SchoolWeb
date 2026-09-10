import {
  io,
  type Socket,
} from "socket.io-client";

import type {
  NotificationData,
} from "../features/notifications/notification.types";


/* =====================================================
   SOCKET EVENT TYPES
===================================================== */

interface ServerToClientEvents {
  "notification:new": (
    notification: NotificationData
  ) => void;

  "notification:unread-count": (
    data: {
      unreadCount: number;
    }
  ) => void;

  connect_error: (
    error: Error
  ) => void;
}


interface ClientToServerEvents {
  "notification:read": (
    notificationId: string
  ) => void;
}


/* =====================================================
   SOCKET URL

   VITE_API_URL:
   http://localhost:5000/api/v1

   Socket URL:
   http://localhost:5000
===================================================== */

const API_URL =
  import.meta.env.VITE_API_URL ??
  "http://localhost:5000/api/v1";


const SOCKET_URL =
  API_URL.replace(
    /\/api\/v1\/?$/,
    ""
  );


/* =====================================================
   SOCKET INSTANCE
===================================================== */

let socket:
  Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null = null;


/* =====================================================
   GET ACCESS TOKEN
===================================================== */

const getAccessToken =
  (): string | null => {
    return localStorage.getItem(
      "accessToken"
    );
  };


/* =====================================================
   CONNECT SOCKET

   Login/restoreAuth complete होने के बाद call करें।
===================================================== */

export const connectSocket =
  (): Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null => {
    const accessToken =
      getAccessToken();

    if (!accessToken) {
      console.warn(
        "Socket connection skipped: access token missing"
      );

      return null;
    }


    /*
     * Existing socket connected है तो duplicate
     * connection नहीं बनाएंगे।
     */
    if (
      socket?.connected
    ) {
      return socket;
    }


    /*
     * पुराना disconnected socket मौजूद है तो
     * authentication token update करके reconnect करें।
     */
    if (socket) {
      socket.auth = {
        token:
          accessToken,
      };

      socket.connect();

      return socket;
    }


    socket = io(
      SOCKET_URL,
      {
        transports: [
          "websocket",
          "polling",
        ],

        auth: {
          token:
            accessToken,
        },

        autoConnect:
          true,

        reconnection:
          true,

        reconnectionAttempts:
          Infinity,

        reconnectionDelay:
          1000,

        reconnectionDelayMax:
          5000,

        timeout:
          10000,
      }
    );


    socket.on(
      "connect",

      () => {
        console.log(
          "Socket connected:",
          socket?.id
        );
      }
    );


    socket.on(
      "disconnect",

      (
        reason
      ) => {
        console.log(
          "Socket disconnected:",
          reason
        );
      }
    );


    socket.on(
      "connect_error",

      (
        error
      ) => {
        console.error(
          "Socket connection error:",
          error.message
        );
      }
    );


    return socket;
  };


/* =====================================================
   GET SOCKET INSTANCE
===================================================== */

export const getSocket =
  (): Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null => {
    return socket;
  };


/* =====================================================
   LISTEN FOR NEW NOTIFICATION

   Redux hook/component callback pass करेगा।
===================================================== */

export const subscribeToNotifications =
  (
    callback: (
      notification:
        NotificationData
    ) => void
  ): (() => void) => {
    const activeSocket =
      connectSocket();


    if (!activeSocket) {
      return () => undefined;
    }


    /*
     * पहले यही callback remove करना duplicate
     * listener से बचाता है।
     */
    activeSocket.off(
      "notification:new",
      callback
    );

    activeSocket.on(
      "notification:new",
      callback
    );


    return () => {
      activeSocket.off(
        "notification:new",
        callback
      );
    };
  };


/* =====================================================
   LISTEN FOR UNREAD COUNT
===================================================== */

export const subscribeToUnreadCount =
  (
    callback: (
      unreadCount: number
    ) => void
  ): (() => void) => {
    const activeSocket =
      connectSocket();


    if (!activeSocket) {
      return () => undefined;
    }


    const listener = (
      data: {
        unreadCount: number;
      }
    ) => {
      callback(
        Math.max(
          0,
          data.unreadCount
        )
      );
    };


    activeSocket.on(
      "notification:unread-count",
      listener
    );


    return () => {
      activeSocket.off(
        "notification:unread-count",
        listener
      );
    };
  };


/* =====================================================
   EMIT NOTIFICATION READ EVENT

   Optional realtime sync for multiple open tabs/devices.
===================================================== */

export const emitNotificationRead =
  (
    notificationId: string
  ): void => {
    if (
      !socket?.connected
    ) {
      return;
    }


    socket.emit(
      "notification:read",
      notificationId
    );
  };


/* =====================================================
   REFRESH SOCKET AUTH

   नया access token मिलने के बाद उपयोग कर सकते हैं।
===================================================== */

export const refreshSocketAuthentication =
  (): void => {
    const accessToken =
      getAccessToken();


    if (!accessToken) {
      disconnectSocket();

      return;
    }


    if (!socket) {
      connectSocket();

      return;
    }


    socket.auth = {
      token:
        accessToken,
    };


    if (
      socket.connected
    ) {
      socket.disconnect();
    }


    socket.connect();
  };


/* =====================================================
   DISCONNECT SOCKET

   Logout पर जरूर call करें।
===================================================== */

export const disconnectSocket =
  (): void => {
    if (!socket) {
      return;
    }


    socket.removeAllListeners();

    socket.disconnect();

    socket = null;
  };