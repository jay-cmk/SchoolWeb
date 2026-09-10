import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import { Icon } from "@iconify/react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";

import {
  clearNotificationError,
  deleteNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../../features/notifications/notification.slice";

import type { NotificationData } from "../../features/notifications/notification.types";

/* =====================================================
   FILTER TYPE
===================================================== */

type NotificationFilter = "ALL" | "UNREAD" | "READ";

/* =====================================================
   DATE FORMAT
===================================================== */

const formatNotificationDate = (dateValue: string): string => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",

    month: "short",

    year: "numeric",

    hour: "2-digit",

    minute: "2-digit",
  });
};

/* =====================================================
   NOTIFICATION ICON
===================================================== */

const getNotificationIcon = (type: string): string => {
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
      return "solar:bell-bold-duotone";
  }
};

/* =====================================================
   ICON STYLE
===================================================== */

const getNotificationIconStyle = (type: string): string => {
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

const Notifications = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const {
    notifications,

    pagination,

    unreadCount,

    loading,

    updating,

    error,
  } = useAppSelector((state) => state.notifications);

  const [page, setPage] = useState<number>(1);

  const [filter, setFilter] = useState<NotificationFilter>("ALL");

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const limit = 15;

  /* ===================================================
     API FILTER
  =================================================== */

  const readFilter = useMemo(() => {
    if (filter === "UNREAD") {
      return false;
    }

    if (filter === "READ") {
      return true;
    }

    return undefined;
  }, [filter]);

  /* ===================================================
     FETCH NOTIFICATIONS
  =================================================== */

  useEffect(() => {
    const params: {
      page: number;
      limit: number;
      isRead?: boolean;
    } = {
      page,
      limit,
    };

    if (readFilter !== undefined) {
      params.isRead = readFilter;
    }

    void dispatch(getNotifications(params));
  }, [dispatch, page, readFilter]);

  /* ===================================================
     CLEAR ERROR ON UNMOUNT
  =================================================== */

  useEffect(() => {
    return () => {
      dispatch(clearNotificationError());
    };
  }, [dispatch]);

  /* ===================================================
     CHANGE FILTER
  =================================================== */

  const handleFilterChange = (selectedFilter: NotificationFilter) => {
    setFilter(selectedFilter);

    setPage(1);
  };

  /* ===================================================
     OPEN NOTIFICATION
  =================================================== */

  const handleOpenNotification = async (notification: NotificationData) => {
    if (!notification.isRead) {
      await dispatch(markNotificationRead(notification._id));
    }

    const url =
      typeof notification.metadata?.url === "string"
        ? notification.metadata.url
        : null;

    if (url) {
      navigate(url);
    }
  };

  /* ===================================================
     MARK ONE READ WITHOUT OPENING
  =================================================== */

  const handleMarkRead = async (notificationId: string) => {
    await dispatch(markNotificationRead(notificationId));
  };

  /* ===================================================
     MARK ALL READ
  =================================================== */

  const handleMarkAllRead = async () => {
    if (unreadCount === 0 || updating) {
      return;
    }

    await dispatch(markAllNotificationsRead());
  };

  /* ===================================================
     DELETE NOTIFICATION

     दूसरी बार click करने पर deletion confirm होगी।
  =================================================== */

  const handleDelete = async (notificationId: string) => {
    if (deletingId !== notificationId) {
      setDeletingId(notificationId);

      return;
    }

    const result = await dispatch(deleteNotification(notificationId));

    if (deleteNotification.fulfilled.match(result)) {
      setDeletingId(null);

      /*
       * Current page की आखिरी item delete होने पर
       * previous page पर जाएं।
       */
      if (notifications.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      }
    }
  };

  /* ===================================================
     CANCEL DELETE
  =================================================== */

  const handleCancelDelete = () => {
    setDeletingId(null);
  };

  /* ===================================================
     PAGINATION VALUES
  =================================================== */

  const currentPage = pagination?.page ?? page;

  const totalPages = pagination?.totalPages ?? 1;

  const totalNotifications = pagination?.total ?? notifications.length;

  /* ===================================================
     RENDER
  =================================================== */

  return (
    <div
      className="
        min-h-full
        bg-[#F7F8FC]
        p-4
        md:p-6
      "
    >
      <div
        className="
          mx-auto
          max-w-6xl
        "
      >
        {/* =============================================
            PAGE HEADER
        ============================================= */}

        <div
          className="
            mb-6
            flex
            flex-col
            gap-4
            md:flex-row
            md:items-center
            md:justify-between
          "
        >
          <div>
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
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

              <div>
                <h1
                  className="
                    text-xl
                    font-bold
                    text-slate-900
                    md:text-2xl
                  "
                >
                  Notifications
                </h1>

                <p
                  className="
                    mt-0.5
                    text-sm
                    text-slate-500
                  "
                >
                  View your latest school updates and alerts.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled={unreadCount === 0 || updating}
            onClick={() => {
              void handleMarkAllRead();
            }}
            className="
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-blue-200
              bg-white
              px-4
              text-sm
              font-bold
              text-blue-600
              transition
              hover:bg-blue-50
              disabled:cursor-not-allowed
              disabled:border-slate-200
              disabled:text-slate-400
            "
          >
            <Icon
              icon={
                updating
                  ? "svg-spinners:ring-resize"
                  : "solar:check-read-linear"
              }
              className="text-lg"
            />
            Mark all as read
          </button>
        </div>

        {/* =============================================
            SUMMARY CARDS
        ============================================= */}

        <div
          className="
            mb-6
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-3
          "
        >
          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
            "
          >
            <p
              className="
                text-sm
                font-medium
                text-slate-500
              "
            >
              Total Notifications
            </p>

            <p
              className="
                mt-2
                text-3xl
                font-bold
                text-slate-900
              "
            >
              {totalNotifications}
            </p>
          </div>

          <div
            className="
              rounded-2xl
              border
              border-blue-100
              bg-blue-50
              p-5
            "
          >
            <p
              className="
                text-sm
                font-medium
                text-blue-600
              "
            >
              Unread Notifications
            </p>

            <p
              className="
                mt-2
                text-3xl
                font-bold
                text-blue-700
              "
            >
              {unreadCount}
            </p>
          </div>

          <div
            className="
              rounded-2xl
              border
              border-emerald-100
              bg-emerald-50
              p-5
            "
          >
            <p
              className="
                text-sm
                font-medium
                text-emerald-600
              "
            >
              Current Page
            </p>

            <p
              className="
                mt-2
                text-3xl
                font-bold
                text-emerald-700
              "
            >
              {currentPage}
            </p>
          </div>
        </div>

        {/* =============================================
            MAIN CARD
        ============================================= */}

        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-sm
          "
        >
          {/* FILTERS */}

          <div
            className="
              flex
              flex-col
              gap-3
              border-b
              border-slate-200
              px-4
              py-4
              sm:flex-row
              sm:items-center
              sm:justify-between
              md:px-6
            "
          >
            <div
              className="
                flex
                rounded-xl
                bg-slate-100
                p-1
              "
            >
              {(["ALL", "UNREAD", "READ"] as NotificationFilter[]).map(
                (filterItem) => (
                  <button
                    key={filterItem}
                    type="button"
                    onClick={() => handleFilterChange(filterItem)}
                    className={`
                      rounded-lg
                      px-4
                      py-2
                      text-xs
                      font-bold
                      transition
                      ${
                        filter === filterItem
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                      }
                    `}
                  >
                    {filterItem === "ALL"
                      ? "All"
                      : filterItem === "UNREAD"
                        ? "Unread"
                        : "Read"}
                  </button>
                ),
              )}
            </div>

            <p
              className="
                text-xs
                font-medium
                text-slate-500
              "
            >
              {totalNotifications} notification
              {totalNotifications === 1 ? "" : "s"}
            </p>
          </div>

          {/* ERROR */}

          {error && (
            <div
              className="
                m-4
                flex
                items-start
                justify-between
                gap-3
                rounded-xl
                border
                border-red-200
                bg-red-50
                px-4
                py-3
                text-sm
                text-red-700
                md:m-6
              "
            >
              <div
                className="
                  flex
                  items-start
                  gap-2
                "
              >
                <Icon
                  icon="solar:danger-circle-bold"
                  className="
                    mt-0.5
                    shrink-0
                    text-lg
                  "
                />

                <span>{error}</span>
              </div>

              <button
                type="button"
                onClick={() => dispatch(clearNotificationError())}
              >
                <Icon icon="solar:close-circle-linear" className="text-xl" />
              </button>
            </div>
          )}

          {/* LOADING */}

          {loading ? (
            <div
              className="
                flex
                min-h-[400px]
                flex-col
                items-center
                justify-center
              "
            >
              <Icon
                icon="svg-spinners:ring-resize"
                className="
                  text-4xl
                  text-blue-600
                "
              />

              <p
                className="
                  mt-3
                  text-sm
                  font-medium
                  text-slate-500
                "
              >
                Loading notifications...
              </p>
            </div>
          ) : notifications.length === 0 ? (
            /* EMPTY STATE */

            <div
              className="
                flex
                min-h-[420px]
                flex-col
                items-center
                justify-center
                px-6
                text-center
              "
            >
              <div
                className="
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-3xl
                  bg-slate-100
                  text-slate-400
                "
              >
                <Icon icon="solar:bell-off-linear" className="text-4xl" />
              </div>

              <h3
                className="
                  mt-5
                  text-lg
                  font-bold
                  text-slate-900
                "
              >
                No notifications found
              </h3>

              <p
                className="
                  mt-2
                  max-w-sm
                  text-sm
                  leading-6
                  text-slate-500
                "
              >
                {filter === "UNREAD"
                  ? "You have read all your notifications."
                  : filter === "READ"
                    ? "You do not have any read notifications."
                    : "New school notifications will appear here."}
              </p>
            </div>
          ) : (
            /* NOTIFICATION LIST */

            <div>
              {notifications.map((notification) => {
                const isDeleteConfirming = deletingId === notification._id;

                return (
                  <div
                    key={notification._id}
                    className={`
                        group
                        relative
                        flex
                        flex-col
                        gap-4
                        border-b
                        border-slate-100
                        px-4
                        py-5
                        transition
                        last:border-b-0
                        hover:bg-slate-50
                        sm:flex-row
                        sm:items-start
                        md:px-6
                        ${notification.isRead ? "bg-white" : "bg-blue-50/40"}
                      `}
                  >
                    {!notification.isRead && (
                      <span
                        className="
                            absolute
                            left-0
                            top-0
                            h-full
                            w-1
                            bg-blue-600
                          "
                      />
                    )}

                    {/* ICON */}

                    <button
                      type="button"
                      onClick={() => {
                        void handleOpenNotification(notification);
                      }}
                      className={`
                          flex
                          h-12
                          w-12
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          ${getNotificationIconStyle(notification.type)}
                        `}
                    >
                      <Icon
                        icon={getNotificationIcon(notification.type)}
                        className="text-2xl"
                      />
                    </button>

                    {/* CONTENT */}

                    <button
                      type="button"
                      onClick={() => {
                        void handleOpenNotification(notification);
                      }}
                      className="
                          min-w-0
                          flex-1
                          text-left
                        "
                    >
                      <div
                        className="
                            flex
                            flex-col
                            gap-1
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                          "
                      >
                        <div
                          className="
                              flex
                              items-center
                              gap-2
                            "
                        >
                          <h3
                            className={`
                                text-sm
                                text-slate-900
                                ${
                                  notification.isRead
                                    ? "font-semibold"
                                    : "font-bold"
                                }
                              `}
                          >
                            {notification.title}
                          </h3>

                          {!notification.isRead && (
                            <span
                              className="
                                  h-2
                                  w-2
                                  rounded-full
                                  bg-blue-600
                                "
                            />
                          )}

                          {notification.priority === "HIGH" && (
                            <span
                              className="
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
                              Important
                            </span>
                          )}
                        </div>

                        <span
                          className="
                              shrink-0
                              text-xs
                              font-medium
                              text-slate-400
                            "
                        >
                          {formatNotificationDate(notification.createdAt)}
                        </span>
                      </div>

                      <p
                        className="
                            mt-2
                            text-sm
                            leading-6
                            text-slate-500
                          "
                      >
                        {notification.message}
                      </p>
                    </button>

                    {/* ACTIONS */}

                    <div
                      className="
                          flex
                          shrink-0
                          items-center
                          gap-2
                          sm:self-center
                        "
                    >
                      {!notification.isRead && (
                        <button
                          type="button"
                          title="Mark as read"
                          disabled={updating}
                          onClick={() => {
                            void handleMarkRead(notification._id);
                          }}
                          className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-lg
                              border
                              border-slate-200
                              bg-white
                              text-blue-600
                              transition
                              hover:border-blue-200
                              hover:bg-blue-50
                              disabled:opacity-50
                            "
                        >
                          <Icon
                            icon="solar:check-read-linear"
                            className="text-lg"
                          />
                        </button>
                      )}

                      {isDeleteConfirming ? (
                        <div
                          className="
                              flex
                              items-center
                              gap-1
                              rounded-lg
                              border
                              border-red-200
                              bg-red-50
                              p-1
                            "
                        >
                          <button
                            type="button"
                            disabled={updating}
                            onClick={() => {
                              void handleDelete(notification._id);
                            }}
                            className="
                                rounded-md
                                bg-red-600
                                px-2.5
                                py-1.5
                                text-xs
                                font-bold
                                text-white
                                hover:bg-red-700
                                disabled:opacity-50
                              "
                          >
                            Delete
                          </button>

                          <button
                            type="button"
                            onClick={handleCancelDelete}
                            className="
                                rounded-md
                                px-2.5
                                py-1.5
                                text-xs
                                font-bold
                                text-slate-600
                                hover:bg-white
                              "
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          title="Delete notification"
                          onClick={() => {
                            void handleDelete(notification._id);
                          }}
                          className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-lg
                              border
                              border-slate-200
                              bg-white
                              text-slate-500
                              transition
                              hover:border-red-200
                              hover:bg-red-50
                              hover:text-red-600
                            "
                        >
                          <Icon
                            icon="solar:trash-bin-trash-linear"
                            className="text-lg"
                          />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ===========================================
              PAGINATION
          =========================================== */}

          {!loading && totalPages > 1 && (
            <div
              className="
                  flex
                  flex-col
                  gap-3
                  border-t
                  border-slate-200
                  px-4
                  py-4
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                  md:px-6
                "
            >
              <p
                className="
                    text-xs
                    font-medium
                    text-slate-500
                  "
              >
                Page {currentPage} of {totalPages}
              </p>

              <div
                className="
                    flex
                    items-center
                    gap-2
                  "
              >
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() =>
                    setPage((previousPage) => Math.max(1, previousPage - 1))
                  }
                  className="
                      flex
                      h-10
                      items-center
                      gap-1
                      rounded-lg
                      border
                      border-slate-200
                      bg-white
                      px-3
                      text-xs
                      font-bold
                      text-slate-600
                      transition
                      hover:bg-slate-50
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                >
                  <Icon
                    icon="solar:alt-arrow-left-linear"
                    className="text-lg"
                  />
                  Previous
                </button>

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() =>
                    setPage((previousPage) =>
                      Math.min(totalPages, previousPage + 1),
                    )
                  }
                  className="
                      flex
                      h-10
                      items-center
                      gap-1
                      rounded-lg
                      border
                      border-slate-200
                      bg-white
                      px-3
                      text-xs
                      font-bold
                      text-slate-600
                      transition
                      hover:bg-slate-50
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                >
                  Next
                  <Icon
                    icon="solar:alt-arrow-right-linear"
                    className="text-lg"
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
