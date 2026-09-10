import {
  cert,
  getApps,
  initializeApp,
  type App,
} from "firebase-admin/app";

import {
  getMessaging,
  type Messaging,
} from "firebase-admin/messaging";


/* =====================================================
   FIREBASE ADMIN STATE
===================================================== */

let firebaseAdminApp: App | null =
  null;

let firebaseMessaging: Messaging | null =
  null;


/* =====================================================
   ENVIRONMENT CONFIGURATION
===================================================== */

interface FirebaseAdminEnvironment {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}


/* =====================================================
   GET + VALIDATE ENVIRONMENT
===================================================== */

const getFirebaseAdminEnvironment =
  (): FirebaseAdminEnvironment | null => {
    const projectId =
      process.env.FIREBASE_PROJECT_ID;

    const clientEmail =
      process.env.FIREBASE_CLIENT_EMAIL;

    const rawPrivateKey =
      process.env.FIREBASE_PRIVATE_KEY;


    if (
      !projectId ||
      !clientEmail ||
      !rawPrivateKey
    ) {
      console.warn(
        "Firebase Admin credentials are missing"
      );

      return null;
    }


    /*
     * .env me private key generally
     * \n ke form me stored hoti hai.
     *
     * Firebase Admin ko real newline chahiye.
     */
    const privateKey =
      rawPrivateKey.replace(
        /\\n/g,
        "\n"
      );


    return {
      projectId:
        projectId.trim(),

      clientEmail:
        clientEmail.trim(),

      privateKey,
    };
  };


/* =====================================================
   INITIALIZE FIREBASE ADMIN

   Server startup par ek baar call kar sakte ho.
===================================================== */

export const initializeFirebaseAdmin =
  (): Messaging | null => {
    /*
     * Already initialized
     */
    if (
      firebaseMessaging
    ) {
      return firebaseMessaging;
    }


    try {
      /*
       * Development hot reload / tests me
       * Firebase app pehle se initialized ho sakti hai.
       */
      const existingApp =
        getApps()[0];


      if (
        existingApp
      ) {
        firebaseAdminApp =
          existingApp;

        firebaseMessaging =
          getMessaging(
            existingApp
          );

        return firebaseMessaging;
      }


      const environment =
        getFirebaseAdminEnvironment();


      if (
        !environment
      ) {
        return null;
      }


      firebaseAdminApp =
        initializeApp({
          credential:
            cert({
              projectId:
                environment.projectId,

              clientEmail:
                environment.clientEmail,

              privateKey:
                environment.privateKey,
            }),

          projectId:
            environment.projectId,
        });


      firebaseMessaging =
        getMessaging(
          firebaseAdminApp
        );


      console.log(
        "Firebase Admin initialized successfully"
      );


      return firebaseMessaging;

    } catch (error) {
      console.error(
        "FIREBASE ADMIN INITIALIZATION ERROR:",
        error
      );


      firebaseAdminApp =
        null;

      firebaseMessaging =
        null;


      return null;
    }
  };


/* =====================================================
   GET FIREBASE MESSAGING INSTANCE

   Notification service me isi function ko use karo.
===================================================== */

export const getFirebaseAdminMessaging =
  (): Messaging | null => {
    if (
      firebaseMessaging
    ) {
      return firebaseMessaging;
    }


    return initializeFirebaseAdmin();
  };


/* =====================================================
   FIREBASE ADMIN READY STATUS
===================================================== */

export const isFirebaseAdminReady =
  (): boolean => {
    return (
      getFirebaseAdminMessaging() !==
      null
    );
  };


/* =====================================================
   OPTIONAL: GET FIREBASE ADMIN APP
===================================================== */

export const getFirebaseAdminApp =
  (): App | null => {
    if (
      firebaseAdminApp
    ) {
      return firebaseAdminApp;
    }


    initializeFirebaseAdmin();


    return firebaseAdminApp;
  };