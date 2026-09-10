// import app from "./app";
// import { connectDatabase } from "./config/db";
// import { env } from "./config/env";

// import dotenv from "dotenv";

// dotenv.config();

// const startServer = async (): Promise<void> => {
//   try {
//     await connectDatabase();

//     app.listen(env.port, () => {
//       console.log(
//         `Server running on http://localhost:${env.port}`
//       );
//     });
//   } catch (error) {
//     console.error("Server startup failed:", error);

//     process.exit(1);
//   }
// };

// startServer();


import "dotenv/config";

import {
  createServer,
} from "http";

import mongoose from "mongoose";

import app
  from "./app";

import {
  connectDatabase,
} from "./config/db";

import {
  env,
} from "./config/env";

import {
  initializeSocket,
} from "./config/socket";

import {
  initializeFirebaseAdmin,
} from "./config/firebaseAdmin";


/* =====================================================
   CREATE HTTP SERVER

   Express + Socket.IO दोनों इसी HTTP server पर चलेंगे।
===================================================== */

const httpServer =
  createServer(
    app
  );


/* =====================================================
   START SERVER
===================================================== */

const startServer =
  async (): Promise<void> => {
    try {
      /* ===============================================
         CONNECT DATABASE
      =============================================== */

      await connectDatabase();


      /* ===============================================
         INITIALIZE FIREBASE ADMIN

         Firebase env missing होने पर push disable रहेगा,
         लेकिन backend server और Socket.IO चलते रहेंगे।
      =============================================== */

      const firebaseMessaging =
        initializeFirebaseAdmin();


      if (
        firebaseMessaging
      ) {
        console.log(
          "Firebase Cloud Messaging ready"
        );
      } else {
        console.warn(
          "Firebase Cloud Messaging is disabled"
        );
      }


      /* ===============================================
         INITIALIZE SOCKET.IO
      =============================================== */

      initializeSocket(
        httpServer
      );


      /* ===============================================
         START HTTP + SOCKET SERVER
      =============================================== */

      httpServer.listen(
        env.port,

        () => {
          console.log(
            `Server running on http://localhost:${env.port}`
          );

          console.log(
            `Socket.IO running on http://localhost:${env.port}`
          );
        }
      );
    } catch (
      error
    ) {
      console.error(
        "Server startup failed:",
        error
      );

      process.exit(
        1
      );
    }
  };


/* =====================================================
   SERVER ERROR
===================================================== */

httpServer.on(
  "error",

  (
    error
  ) => {
    console.error(
      "HTTP server error:",
      error
    );
  }
);


/* =====================================================
   GRACEFUL SHUTDOWN STATE

   SIGINT और SIGTERM एक साथ मिलने पर shutdown दो बार
   execute नहीं होना चाहिए।
===================================================== */

let isShuttingDown =
  false;


/* =====================================================
   GRACEFUL SHUTDOWN
===================================================== */

const shutdownServer =
  async (
    signal: string
  ): Promise<void> => {
    if (
      isShuttingDown
    ) {
      return;
    }


    isShuttingDown =
      true;


    console.log(
      `${signal} received. Shutting down server...`
    );


    /*
     * नई HTTP/Socket connections लेना बंद करें।
     */
    httpServer.close(
      async (
        error
      ) => {
        if (
          error
        ) {
          console.error(
            "Server shutdown error:",
            error
          );

          process.exit(
            1
          );
        }


        try {
          await mongoose.disconnect();


          console.log(
            "Database disconnected"
          );

          console.log(
            "Server stopped successfully"
          );


          process.exit(
            0
          );
        } catch (
          disconnectError
        ) {
          console.error(
            "Database disconnect error:",
            disconnectError
          );

          process.exit(
            1
          );
        }
      }
    );


    /*
     * कोई active connection server close को रोक रही हो
     * तो 10 seconds बाद process forcefully close होगा।
     */
    const forceShutdownTimer =
      setTimeout(
        () => {
          console.error(
            "Graceful shutdown timed out. Forcing exit."
          );

          process.exit(
            1
          );
        },

        10000
      );


    forceShutdownTimer.unref();
  };


/* =====================================================
   PROCESS SIGNALS
===================================================== */

process.on(
  "SIGINT",

  () => {
    void shutdownServer(
      "SIGINT"
    );
  }
);


process.on(
  "SIGTERM",

  () => {
    void shutdownServer(
      "SIGTERM"
    );
  }
);


/* =====================================================
   UNHANDLED PROMISE REJECTION

   Error log होगा। Server तुरंत बंद नहीं करेंगे क्योंकि
   notification जैसी background operation fail हो सकती है।
===================================================== */

process.on(
  "unhandledRejection",

  (
    reason
  ) => {
    console.error(
      "Unhandled promise rejection:",
      reason
    );
  }
);


/* =====================================================
   UNCAUGHT EXCEPTION

   Unknown state में server चलाते रहना unsafe होता है,
   इसलिए graceful shutdown शुरू करेंगे।
===================================================== */

process.on(
  "uncaughtException",

  (
    error
  ) => {
    console.error(
      "Uncaught exception:",
      error
    );

    void shutdownServer(
      "UNCAUGHT_EXCEPTION"
    );
  }
);


/* =====================================================
   START APPLICATION
===================================================== */

void startServer();