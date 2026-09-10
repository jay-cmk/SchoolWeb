import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Icon,
} from "@iconify/react";

import useNotifications from "../../hooks/useNotifications";

import {
  useAppDispatch,
} from "../../app/hooks";

import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../../features/notifications/notification.slice";

import type {
  NotificationData,
} from "../../features/notifications/notification.types";


/* =====================================================
   DATE FORMATTER
===================================================== */

const formatNotificationTime = (
  dateValue: string
): string => {
  const date =
    new Date(
      dateValue
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }


  const now =
    new Date();

  const difference =
    now.getTime() -
    date.getTime();

  const minutes =
    Math.floor(
      difference /
      (1000 * 60)
    );

  const hours =
    Math.floor(
      difference /
      (1000 * 60 * 60)
    );

  const days =
    Math.floor(
      difference /
      (1000 * 60 * 60 * 24)
    );


  if (
    minutes < 1
  ) {
    return "Just now";
  }


  if (
    minutes < 60
  ) {
    return `${minutes}m ago`;
  }


  if (
    hours < 24
  ) {
    return `${hours}h ago`;
  }


  if (
    days < 7
  ) {
    return `${days}d ago`;
  }


  return date.toLocaleDateString(
    "en-IN",
    {
      day:
        "2-digit",

      month:
        "short",

      year:
        date.getFullYear() !==
        now.getFullYear()
          ? "numeric"
          : undefined,
    }
  );
};


/* =====================================================
   NOTIFICATION ICON
===================================================== */

const getNotificationIcon = (
  type: string
): string => {
  switch (
    type
  ) {
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
      return "solar:bell-bold-duotone";
  }
};


/* =====================================================
   ICON COLOR
===================================================== */

const getNotificationIconStyles = (
  type: string
): string => {
  switch (
    type
  ) {
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

    default:
      return "bg-slate-100 text-slate-600";
  }
};


/* =====================================================
   COMPONENT
===================================================== */

const NotificationBell = () => {
  const dispatch =
    useAppDispatch();

  const navigate =
    useNavigate();


  const {
    notifications,

    unreadCount,

    loading,

    updating,

    soundEnabled,

    toggleNotificationSound,
  } =
    useNotifications();


  const [
    isOpen,
    setIsOpen,
  ] =
    useState<boolean>(
      false
    );


  const dropdownRef =
    useRef<HTMLDivElement | null>(
      null
    );


  /* ===================================================
     LATEST NOTIFICATIONS

     Bell dropdown में केवल latest 8 दिखाएंगे।
  =================================================== */

  const recentNotifications =
    useMemo(
      () =>
        notifications.slice(
          0,
          8
        ),

      [
        notifications,
      ]
    );


  /* ===================================================
     OPEN / CLOSE DROPDOWN
  =================================================== */

  const toggleDropdown =
    () => {
      setIsOpen(
        (
          previous
        ) =>
          !previous
      );
    };


  /* ===================================================
     FETCH NOTIFICATIONS WHEN OPENED
  =================================================== */

  useEffect(
    () => {
      if (
        !isOpen
      ) {
        return;
      }


      void dispatch(
        getNotifications({
          page:
            1,

          limit:
            8,
        })
      );
    },

    [
      dispatch,
      isOpen,
    ]
  );


  /* ===================================================
     CLOSE ON OUTSIDE CLICK
  =================================================== */

  useEffect(
    () => {
      const handleOutsideClick = (
        event: MouseEvent
      ) => {
        const target =
          event.target as Node;


        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(
            target
          )
        ) {
          setIsOpen(
            false
          );
        }
      };


      document.addEventListener(
        "mousedown",
        handleOutsideClick
      );


      return () => {
        document.removeEventListener(
          "mousedown",
          handleOutsideClick
        );
      };
    },

    []
  );


  /* ===================================================
     CLOSE ON ESCAPE
  =================================================== */

  useEffect(
    () => {
      const handleEscape = (
        event:
          KeyboardEvent
      ) => {
        if (
          event.key ===
          "Escape"
        ) {
          setIsOpen(
            false
          );
        }
      };


      document.addEventListener(
        "keydown",
        handleEscape
      );


      return () => {
        document.removeEventListener(
          "keydown",
          handleEscape
        );
      };
    },

    []
  );


  /* ===================================================
     MARK ALL READ
  =================================================== */

  const handleMarkAllRead =
    async () => {
      if (
        unreadCount <= 0 ||
        updating
      ) {
        return;
      }


      await dispatch(
        markAllNotificationsRead()
      );
    };


  /* ===================================================
     OPEN NOTIFICATION
  =================================================== */

  const handleNotificationClick =
    async (
      notification:
        NotificationData
    ) => {
      if (
        !notification.isRead
      ) {
        await dispatch(
          markNotificationRead(
            notification._id
          )
        );
      }


      setIsOpen(
        false
      );


      const url =
        typeof notification
          .metadata?.url ===
        "string"
          ? notification
              .metadata.url
          : null;


      if (url) {
        navigate(
          url
        );

        return;
      }


      /*
       * Backend metadata में URL नहीं है तो notification
       * list page open होगा।
       */
      navigate(
        "/notifications"
      );
    };


  /* ===================================================
     VIEW ALL
  =================================================== */

  const handleViewAll =
    () => {
      setIsOpen(
        false
      );

      navigate(
        "/notifications"
      );
    };


  /* ===================================================
     RENDER
  =================================================== */

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      {/* ===============================================
          BELL BUTTON
      =============================================== */}

      <button
        type="button"
        onClick={
          toggleDropdown
        }
        aria-label="Notifications"
        aria-expanded={
          isOpen
        }
        className="
          relative
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          border
          border-slate-200
          bg-white
          text-slate-600
          transition-all
          duration-200
          hover:border-blue-200
          hover:bg-blue-50
          hover:text-blue-600
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500/20
        "
      >
        <Icon
          icon={
            isOpen
              ? "solar:bell-bold"
              : "solar:bell-linear"
          }
          className="text-[23px]"
        />


        {unreadCount > 0 && (
          <>
            <span
              className="
                absolute
                right-[7px]
                top-[7px]
                h-2
                w-2
                animate-ping
                rounded-full
                bg-red-500
                opacity-60
              "
            />

            <span
              className="
                absolute
                -right-1
                -top-1
                flex
                min-h-5
                min-w-5
                items-center
                justify-center
                rounded-full
                border-2
                border-white
                bg-red-500
                px-1
                text-[10px]
                font-bold
                leading-none
                text-white
              "
            >
              {unreadCount > 99
                ? "99+"
                : unreadCount}
            </span>
          </>
        )}
      </button>


      {/* ===============================================
          DROPDOWN
      =============================================== */}

      {isOpen && (
        <div
          className="
            absolute
            right-0
            top-[calc(100%+12px)]
            z-[1000]
            w-[380px]
            max-w-[calc(100vw-24px)]
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-[0_20px_60px_rgba(15,23,42,0.18)]
          "
        >
          {/* HEADER */}

          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-slate-100
              px-5
              py-4
            "
          >
            <div>
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <h3
                  className="
                    text-base
                    font-bold
                    text-slate-900
                  "
                >
                  Notifications
                </h3>

                {unreadCount > 0 && (
                  <span
                    className="
                      rounded-full
                      bg-blue-50
                      px-2
                      py-0.5
                      text-[11px]
                      font-bold
                      text-blue-600
                    "
                  >
                    {unreadCount} new
                  </span>
                )}
              </div>

              <p
                className="
                  mt-0.5
                  text-xs
                  text-slate-500
                "
              >
                Your latest school updates
              </p>
            </div>


            <div
              className="
                flex
                items-center
                gap-1
              "
            >
              {/* SOUND BUTTON */}

              <button
                type="button"
                onClick={
                  toggleNotificationSound
                }
                title={
                  soundEnabled
                    ? "Mute notification sound"
                    : "Enable notification sound"
                }
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  text-slate-500
                  transition
                  hover:bg-slate-100
                  hover:text-slate-800
                "
              >
                <Icon
                  icon={
                    soundEnabled
                      ? "solar:volume-loud-linear"
                      : "solar:volume-cross-linear"
                  }
                  className="text-xl"
                />
              </button>


              {/* CLOSE BUTTON */}

              <button
                type="button"
                onClick={() =>
                  setIsOpen(
                    false
                  )
                }
                aria-label="Close notifications"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  text-slate-500
                  transition
                  hover:bg-slate-100
                  hover:text-slate-800
                "
              >
                <Icon
                  icon="solar:close-circle-linear"
                  className="text-xl"
                />
              </button>
            </div>
          </div>


          {/* MARK ALL READ */}

          {unreadCount > 0 && (
            <div
              className="
                flex
                justify-end
                border-b
                border-slate-100
                bg-slate-50/60
                px-5
                py-2
              "
            >
              <button
                type="button"
                disabled={
                  updating
                }
                onClick={() => {
                  void handleMarkAllRead();
                }}
                className="
                  flex
                  items-center
                  gap-1.5
                  text-xs
                  font-semibold
                  text-blue-600
                  transition
                  hover:text-blue-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <Icon
                  icon="solar:check-read-linear"
                  className="text-base"
                />

                Mark all as read
              </button>
            </div>
          )}


          {/* NOTIFICATION LIST */}

          <div
            className="
              max-h-[430px]
              overflow-y-auto
              overscroll-contain
            "
          >
            {loading &&
            recentNotifications.length ===
              0 ? (
              <div
                className="
                  flex
                  items-center
                  justify-center
                  py-14
                "
              >
                <Icon
                  icon="svg-spinners:ring-resize"
                  className="
                    text-3xl
                    text-blue-600
                  "
                />
              </div>
            ) : recentNotifications.length ===
              0 ? (
              <div
                className="
                  flex
                  flex-col
                  items-center
                  justify-center
                  px-6
                  py-14
                  text-center
                "
              >
                <div
                  className="
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-2xl
                    bg-slate-100
                    text-slate-400
                  "
                >
                  <Icon
                    icon="solar:bell-off-linear"
                    className="text-3xl"
                  />
                </div>

                <h4
                  className="
                    mt-4
                    text-sm
                    font-bold
                    text-slate-800
                  "
                >
                  No notifications yet
                </h4>

                <p
                  className="
                    mt-1
                    text-xs
                    leading-5
                    text-slate-500
                  "
                >
                  New school updates will appear here.
                </p>
              </div>
            ) : (
              recentNotifications.map(
                (
                  notification
                ) => (
                  <button
                    key={
                      notification._id
                    }
                    type="button"
                    onClick={() => {
                      void handleNotificationClick(
                        notification
                      );
                    }}
                    className={`
                      relative
                      flex
                      w-full
                      gap-3
                      border-b
                      border-slate-100
                      px-5
                      py-4
                      text-left
                      transition
                      last:border-b-0
                      hover:bg-slate-50
                      ${
                        notification.isRead
                          ? "bg-white"
                          : "bg-blue-50/45"
                      }
                    `}
                  >
                    {!notification.isRead && (
                      <span
                        className="
                          absolute
                          left-1.5
                          top-1/2
                          h-2
                          w-2
                          -translate-y-1/2
                          rounded-full
                          bg-blue-600
                        "
                      />
                    )}


                    <div
                      className={`
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        ${getNotificationIconStyles(
                          notification.type
                        )}
                      `}
                    >
                      <Icon
                        icon={getNotificationIcon(
                          notification.type
                        )}
                        className="text-[22px]"
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
                        <h4
                          className={`
                            truncate
                            text-sm
                            text-slate-900
                            ${
                              notification.isRead
                                ? "font-medium"
                                : "font-bold"
                            }
                          `}
                        >
                          {notification.title}
                        </h4>

                        <span
                          className="
                            shrink-0
                            text-[10px]
                            font-medium
                            text-slate-400
                          "
                        >
                          {formatNotificationTime(
                            notification.createdAt
                          )}
                        </span>
                      </div>


                      <p
                        className="
                          mt-1
                          line-clamp-2
                          text-xs
                          leading-5
                          text-slate-500
                        "
                      >
                        {notification.message}
                      </p>


                      {notification.priority ===
                        "HIGH" && (
                        <span
                          className="
                            mt-2
                            inline-flex
                            items-center
                            gap-1
                            rounded-full
                            bg-red-50
                            px-2
                            py-0.5
                            text-[10px]
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
                  </button>
                )
              )
            )}
          </div>


          {/* FOOTER */}

          <div
            className="
              border-t
              border-slate-100
              bg-slate-50/70
              p-3
            "
          >
            <button
              type="button"
              onClick={
                handleViewAll
              }
              className="
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                px-4
                py-2.5
                text-sm
                font-bold
                text-blue-600
                transition
                hover:bg-blue-50
              "
            >
              View all notifications

              <Icon
                icon="solar:arrow-right-linear"
                className="text-lg"
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


export default
  NotificationBell;