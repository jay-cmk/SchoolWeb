import {
  useEffect,
  useState,
} from "react";

import {
  createPortal,
} from "react-dom";

import {
  useNavigate,
} from "react-router-dom";

import {
  Icon,
} from "@iconify/react";

import {
  useAppDispatch,
  useAppSelector,
} from "../../app/hooks";

import {
  clearLatestNotification,
  markNotificationRead,
} from "../../features/notifications/notification.slice";

import type {
  NotificationData,
} from "../../features/notifications/notification.types";


/* =====================================================
   AUTO CLOSE TIME
===================================================== */

const AUTO_CLOSE_TIME =
  7000;


/* =====================================================
   NOTIFICATION ICON
===================================================== */

const getNotificationIcon = (
  type: string
): string => {
  switch (type) {
    case "SUBJECT_ASSIGNED":
      return "solar:book-2-bold-duotone";

    case "ELECTIVE_ASSIGNED":
      return "solar:book-bookmark-bold-duotone";

    case "HOMEWORK_ASSIGNED":
      return "solar:document-text-bold-duotone";

    case "HOMEWORK_SUBMITTED":
      return "solar:clipboard-check-bold-duotone";

    case "ATTENDANCE_MARKED":
      return "solar:calendar-mark-bold-duotone";

    case "STUDENT_ABSENT":
      return "solar:user-cross-bold-duotone";

    case "TIMETABLE_UPDATED":
      return "solar:calendar-bold-duotone";

    case "FEE_REMINDER":
      return "solar:wallet-money-bold-duotone";

    case "ANNOUNCEMENT":
      return "solar:volume-loud-bold-duotone";

    default:
      return "solar:bell-bing-bold-duotone";
  }
};


/* =====================================================
   ICON STYLE
===================================================== */

const getNotificationIconStyle = (
  type: string
): string => {
  switch (type) {
    case "STUDENT_ABSENT":
      return "bg-red-50 text-red-600";

    case "FEE_REMINDER":
      return "bg-amber-50 text-amber-600";

    case "HOMEWORK_ASSIGNED":
    case "HOMEWORK_SUBMITTED":
      return "bg-violet-50 text-violet-600";

    case "SUBJECT_ASSIGNED":
    case "ELECTIVE_ASSIGNED":
      return "bg-blue-50 text-blue-600";

    case "ATTENDANCE_MARKED":
      return "bg-emerald-50 text-emerald-600";

    case "TIMETABLE_UPDATED":
      return "bg-cyan-50 text-cyan-600";

    default:
      return "bg-slate-100 text-slate-600";
  }
};


/* =====================================================
   COMPONENT
===================================================== */

const NotificationToast = () => {
  const dispatch =
    useAppDispatch();

  const navigate =
    useNavigate();


  const latestNotification =
    useAppSelector(
      (
        state
      ) =>
        state.notifications
          .latestNotification
    );


  const [
    visibleNotification,
    setVisibleNotification,
  ] =
    useState<NotificationData | null>(
      null
    );


  const [
    isVisible,
    setIsVisible,
  ] =
    useState<boolean>(
      false
    );


  const [
    isPaused,
    setIsPaused,
  ] =
    useState<boolean>(
      false
    );


  /* ===================================================
     SHOW NEW NOTIFICATION
  =================================================== */

  useEffect(
    () => {
      if (
        !latestNotification
      ) {
        return;
      }


      setVisibleNotification(
        latestNotification
      );


      /*
       * Browser को initial hidden state render करने का
       * समय देकर enter animation चलाते हैं।
       */
      const animationTimer =
        window.setTimeout(
          () => {
            setIsVisible(
              true
            );
          },

          30
        );


      return () => {
        window.clearTimeout(
          animationTimer
        );
      };
    },

    [
      latestNotification,
    ]
  );


  /* ===================================================
     CLOSE TOAST
  =================================================== */

  const closeToast =
    () => {
      setIsVisible(
        false
      );


      window.setTimeout(
        () => {
          setVisibleNotification(
            null
          );

          dispatch(
            clearLatestNotification()
          );
        },

        300
      );
    };


  /* ===================================================
     AUTO CLOSE

     Mouse hover करने पर timer pause रहेगा।
  =================================================== */

  useEffect(
    () => {
      if (
        !visibleNotification ||
        !isVisible ||
        isPaused
      ) {
        return;
      }


      const timer =
        window.setTimeout(
          () => {
            closeToast();
          },

          AUTO_CLOSE_TIME
        );


      return () => {
        window.clearTimeout(
          timer
        );
      };
    },

    [
      visibleNotification,
      isVisible,
      isPaused
    ]
  );


  /* ===================================================
     OPEN NOTIFICATION
  =================================================== */

  const handleOpenNotification =
    async () => {
      if (
        !visibleNotification
      ) {
        return;
      }


      if (
        !visibleNotification.isRead
      ) {
        await dispatch(
          markNotificationRead(
            visibleNotification._id
          )
        );
      }


      const notificationUrl =
        typeof visibleNotification
          .metadata?.url ===
        "string"
          ? visibleNotification
              .metadata.url
          : "/notifications";


      closeToast();

      navigate(
        notificationUrl
      );
    };


  /* ===================================================
     DO NOT RENDER
  =================================================== */

  if (
    !visibleNotification
  ) {
    return null;
  }


  /* ===================================================
     PORTAL CONTENT
  =================================================== */

  return createPortal(
    <div
      className={`
        fixed
        right-4
        top-4
        z-[99999]
        w-[390px]
        max-w-[calc(100vw-32px)]
        transform
        transition-all
        duration-300
        ease-out
        ${
          isVisible
            ? "translate-x-0 opacity-100"
            : "translate-x-[120%] opacity-0"
        }
      `}
      role="alert"
      aria-live="polite"
      onMouseEnter={() =>
        setIsPaused(
          true
        )
      }
      onMouseLeave={() =>
        setIsPaused(
          false
        )
      }
    >
      <div
        className={`
          relative
          overflow-hidden
          rounded-2xl
          border
          bg-white
          shadow-[0_24px_70px_rgba(15,23,42,0.25)]
          ${
            visibleNotification.priority ===
            "HIGH"
              ? "border-red-200"
              : "border-slate-200"
          }
        `}
      >
        {/* =============================================
            PRIORITY LINE
        ============================================= */}

        <div
          className={`
            absolute
            left-0
            top-0
            h-full
            w-1
            ${
              visibleNotification.priority ===
              "HIGH"
                ? "bg-red-500"
                : "bg-blue-600"
            }
          `}
        />


        {/* =============================================
            CONTENT
        ============================================= */}

        <div
          className="
            flex
            items-start
            gap-3
            px-5
            pb-4
            pt-5
          "
        >
          <div
            className={`
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-xl
              ${getNotificationIconStyle(
                visibleNotification.type
              )}
            `}
          >
            <Icon
              icon={getNotificationIcon(
                visibleNotification.type
              )}
              className="text-2xl"
            />
          </div>


          <div
            className="
              min-w-0
              flex-1
            "
          >
            <div
              className="
                flex
                items-start
                justify-between
                gap-3
              "
            >
              <div>
                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-2
                  "
                >
                  <p
                    className="
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-blue-600
                    "
                  >
                    New notification
                  </p>


                  {visibleNotification.priority ===
                    "HIGH" && (
                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1
                        rounded-full
                        bg-red-50
                        px-2
                        py-0.5
                        text-[9px]
                        font-bold
                        uppercase
                        text-red-600
                      "
                    >
                      <Icon
                        icon="solar:danger-triangle-bold"
                      />

                      Important
                    </span>
                  )}
                </div>


                <h3
                  className="
                    mt-1
                    text-sm
                    font-bold
                    text-slate-900
                  "
                >
                  {visibleNotification.title}
                </h3>
              </div>


              <button
                type="button"
                onClick={
                  closeToast
                }
                aria-label="Close notification"
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


            <p
              className="
                mt-2
                line-clamp-3
                text-sm
                leading-5
                text-slate-500
              "
            >
              {visibleNotification.message}
            </p>
          </div>
        </div>


        {/* =============================================
            ACTIONS
        ============================================= */}

        <div
          className="
            flex
            items-center
            justify-between
            border-t
            border-slate-100
            bg-slate-50/70
            px-5
            py-3
          "
        >
          <div
            className="
              flex
              items-center
              gap-1.5
              text-xs
              font-medium
              text-slate-400
            "
          >
            <Icon
              icon="solar:clock-circle-linear"
              className="text-base"
            />

            Just now
          </div>


          <button
            type="button"
            onClick={() => {
              void handleOpenNotification();
            }}
            className="
              inline-flex
              items-center
              gap-1.5
              rounded-lg
              bg-blue-600
              px-3
              py-2
              text-xs
              font-bold
              text-white
              transition
              hover:bg-blue-700
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500/30
            "
          >
            View details

            <Icon
              icon="solar:arrow-right-linear"
              className="text-base"
            />
          </button>
        </div>


        {/* =============================================
            AUTO-CLOSE PROGRESS BAR
        ============================================= */}

        {!isPaused && (
          <div
            className="
              absolute
              bottom-0
              left-0
              h-[3px]
              w-full
              overflow-hidden
              bg-slate-100
            "
          >
            <div
              key={
                visibleNotification._id
              }
              className="
                notification-toast-progress
                h-full
                bg-blue-600
              "
            />
          </div>
        )}
      </div>
    </div>,

    document.body
  );
};


export default NotificationToast;