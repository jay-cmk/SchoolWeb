import {
  useEffect,
  useState,
} from "react";



import {
  getWebNotificationPermission,
  isWebPushSupported,
  registerWebPushNotification,
  syncExistingWebPushToken,
} from "../services/webPushNotification.service";
import {
  Icon,
} from "@iconify/react";

/* =====================================================
   STORAGE
===================================================== */

const PUSH_PROMPT_DISMISSED_KEY =
  "webPushPromptDismissedAt";


/* =====================================================
   DISMISS DURATION

   Dismiss करने के बाद 7 दिन तक banner नहीं दिखेगा।
===================================================== */

const DISMISS_DURATION =
  7 *
  24 *
  60 *
  60 *
  1000;


/* =====================================================
   STATUS
===================================================== */

type RegistrationStatus =
  | "IDLE"
  | "LOADING"
  | "SUCCESS"
  | "ERROR";


/* =====================================================
   COMPONENT
===================================================== */

const WebPushPermission = () => {
  const [
    supported,
    setSupported,
  ] =
    useState<boolean | null>(
      null
    );


  const [
    permission,
    setPermission,
  ] =
    useState<NotificationPermission>(
      getWebNotificationPermission()
    );


  const [
    registrationStatus,
    setRegistrationStatus,
  ] =
    useState<RegistrationStatus>(
      "IDLE"
    );


  const [
    message,
    setMessage,
  ] =
    useState<string>(
      ""
    );


  const [
    dismissed,
    setDismissed,
  ] =
    useState<boolean>(
      false
    );


  /* ===================================================
     CHECK DISMISSED STATUS
  =================================================== */

  useEffect(
    () => {
      const dismissedAtValue =
        localStorage.getItem(
          PUSH_PROMPT_DISMISSED_KEY
        );


      if (
        !dismissedAtValue
      ) {
        return;
      }


      const dismissedAt =
        Number(
          dismissedAtValue
        );


      const isStillDismissed =
        Number.isFinite(
          dismissedAt
        ) &&
        Date.now() -
          dismissedAt <
          DISMISS_DURATION;


      setDismissed(
        isStillDismissed
      );


      if (
        !isStillDismissed
      ) {
        localStorage.removeItem(
          PUSH_PROMPT_DISMISSED_KEY
        );
      }
    },

    []
  );


  /* ===================================================
     CHECK BROWSER SUPPORT
  =================================================== */

  useEffect(
    () => {
      let active =
        true;


      const checkSupport =
        async () => {
          const result =
            await isWebPushSupported();


          if (
            !active
          ) {
            return;
          }


          setSupported(
            result
          );

          setPermission(
            getWebNotificationPermission()
          );
        };


      void checkSupport();


      return () => {
        active =
          false;
      };
    },

    []
  );


  /* ===================================================
     SYNC EXISTING GRANTED TOKEN

     Permission पहले से granted है तो कोई browser popup
     नहीं आएगा। Token केवल backend के साथ sync होगा।
  =================================================== */

  useEffect(
    () => {
      if (
        supported !==
          true ||
        permission !==
          "granted"
      ) {
        return;
      }


      let active =
        true;


      const syncToken =
        async () => {
          const result =
            await syncExistingWebPushToken();


          if (
            !active
          ) {
            return;
          }


          if (
            result.success
          ) {
            setRegistrationStatus(
              "SUCCESS"
            );

            setMessage(
              result.message
            );
          }
        };


      void syncToken();


      return () => {
        active =
          false;
      };
    },

    [
      permission,
      supported,
    ]
  );


  /* ===================================================
     SERVICE WORKER TOKEN REFRESH MESSAGE
  =================================================== */

  useEffect(
    () => {
      if (
        !(
          "serviceWorker" in
          navigator
        )
      ) {
        return;
      }


      const handleServiceWorkerMessage = (
        event: MessageEvent
      ) => {
        if (
          event.data?.type !==
          "FCM_TOKEN_REFRESH_REQUIRED"
        ) {
          return;
        }


        void syncExistingWebPushToken();
      };


      navigator.serviceWorker.addEventListener(
        "message",
        handleServiceWorkerMessage
      );


      return () => {
        navigator.serviceWorker.removeEventListener(
          "message",
          handleServiceWorkerMessage
        );
      };
    },

    []
  );


  /* ===================================================
     ENABLE NOTIFICATIONS
  =================================================== */

  const handleEnableNotifications =
    async () => {
      setRegistrationStatus(
        "LOADING"
      );

      setMessage(
        ""
      );


      const result =
        await registerWebPushNotification();


      setPermission(
        result.permission
      );


      if (
        result.success
      ) {
        setRegistrationStatus(
          "SUCCESS"
        );

        setMessage(
          result.message
        );

        localStorage.removeItem(
          PUSH_PROMPT_DISMISSED_KEY
        );

        return;
      }


      setRegistrationStatus(
        "ERROR"
      );

      setMessage(
        result.message
      );
    };


  /* ===================================================
     DISMISS
  =================================================== */

  const handleDismiss =
    () => {
      localStorage.setItem(
        PUSH_PROMPT_DISMISSED_KEY,
        String(
          Date.now()
        )
      );

      setDismissed(
        true
      );
    };


  /* ===================================================
     DO NOT SHOW
  =================================================== */

  if (
    supported ===
      null ||
    supported ===
      false ||
    dismissed
  ) {
    return null;
  }


  /*
   * Permission granted और token sync complete होने पर
   * permission banner दिखाने की जरूरत नहीं है।
   */
  if (
    permission ===
      "granted" &&
    registrationStatus !==
      "ERROR"
  ) {
    return null;
  }


  /* ===================================================
     PERMISSION BLOCKED
  =================================================== */

  if (
    permission ===
    "denied"
  ) {
    return (
      <div
        className="
          fixed
          bottom-5
          right-5
          z-[9990]
          w-[400px]
          max-w-[calc(100vw-40px)]
          rounded-2xl
          border
          border-amber-200
          bg-white
          p-5
          shadow-[0_20px_60px_rgba(15,23,42,0.18)]
        "
      >
        <div
          className="
            flex
            items-start
            gap-3
          "
        >
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-amber-50
              text-amber-600
            "
          >
            <Icon
              icon="solar:bell-off-bold-duotone"
              className="text-2xl"
            />
          </div>


          <div
            className="
              min-w-0
              flex-1
            "
          >
            <h3
              className="
                text-sm
                font-bold
                text-slate-900
              "
            >
              Notifications are blocked
            </h3>

            <p
              className="
                mt-1
                text-xs
                leading-5
                text-slate-500
              "
            >
              Browser address bar में lock icon खोलकर
              Notifications को Allow करें, फिर page reload करें।
            </p>
          </div>


          <button
            type="button"
            onClick={
              handleDismiss
            }
            aria-label="Dismiss"
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-slate-400
              transition
              hover:bg-slate-100
              hover:text-slate-700
            "
          >
            <Icon
              icon="solar:close-circle-linear"
              className="text-xl"
            />
          </button>
        </div>


        <button
          type="button"
          onClick={() =>
            window.location.reload()
          }
          className="
            mt-4
            inline-flex
            h-10
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-amber-200
            bg-amber-50
            text-xs
            font-bold
            text-amber-700
            transition
            hover:bg-amber-100
          "
        >
          <Icon
            icon="solar:refresh-linear"
            className="text-lg"
          />

          Reload after allowing
        </button>
      </div>
    );
  }


  /* ===================================================
     ENABLE NOTIFICATION BANNER
  =================================================== */

  return (
    <div
      className="
        fixed
        bottom-5
        right-5
        z-[9990]
        w-[420px]
        max-w-[calc(100vw-40px)]
        overflow-hidden
        rounded-2xl
        border
        border-blue-100
        bg-white
        shadow-[0_20px_60px_rgba(15,23,42,0.2)]
      "
    >
      <div
        className="
          h-1
          w-full
          bg-gradient-to-r
          from-blue-600
          to-violet-600
        "
      />


      <div
        className="p-5"
      >
        <div
          className="
            flex
            items-start
            gap-3
          "
        >
          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-blue-50
              text-blue-600
            "
          >
            <Icon
              icon="solar:bell-bing-bold-duotone"
              className="text-2xl"
            />
          </div>


          <div
            className="
              min-w-0
              flex-1
            "
          >
            <h3
              className="
                text-sm
                font-bold
                text-slate-900
              "
            >
              Never miss an update
            </h3>

            <p
              className="
                mt-1
                text-xs
                leading-5
                text-slate-500
              "
            >
              Subject assignments, attendance, homework और
              important school updates के लिए browser
              notifications enable करें।
            </p>
          </div>


          <button
            type="button"
            onClick={
              handleDismiss
            }
            aria-label="Dismiss notification prompt"
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-slate-400
              transition
              hover:bg-slate-100
              hover:text-slate-700
            "
          >
            <Icon
              icon="solar:close-circle-linear"
              className="text-xl"
            />
          </button>
        </div>


        {registrationStatus ===
          "ERROR" &&
          message && (
            <div
              className="
                mt-4
                flex
                items-start
                gap-2
                rounded-xl
                border
                border-red-100
                bg-red-50
                px-3
                py-2.5
                text-xs
                text-red-700
              "
            >
              <Icon
                icon="solar:danger-circle-bold"
                className="
                  mt-0.5
                  shrink-0
                  text-base
                "
              />

              <span>
                {message}
              </span>
            </div>
          )}


        <div
          className="
            mt-5
            flex
            items-center
            gap-3
          "
        >
          <button
            type="button"
            disabled={
              registrationStatus ===
              "LOADING"
            }
            onClick={() => {
              void handleEnableNotifications();
            }}
            className="
              inline-flex
              h-11
              flex-1
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-blue-600
              px-4
              text-sm
              font-bold
              text-white
              transition
              hover:bg-blue-700
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500/30
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <Icon
              icon={
                registrationStatus ===
                "LOADING"
                  ? "svg-spinners:ring-resize"
                  : "solar:bell-bing-linear"
              }
              className="text-lg"
            />

            {registrationStatus ===
            "LOADING"
              ? "Enabling..."
              : "Enable notifications"}
          </button>


          <button
            type="button"
            disabled={
              registrationStatus ===
              "LOADING"
            }
            onClick={
              handleDismiss
            }
            className="
              h-11
              rounded-xl
              px-4
              text-sm
              font-semibold
              text-slate-500
              transition
              hover:bg-slate-100
              hover:text-slate-800
              disabled:opacity-50
            "
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
};


export default WebPushPermission;