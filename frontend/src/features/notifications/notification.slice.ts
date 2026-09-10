import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import {
  deactivateWebDeviceTokenApi,
  deleteNotificationApi,
  getNotificationsApi,
  getUnreadNotificationCountApi,
  markAllNotificationsReadApi,
  markNotificationReadApi,
  registerWebDeviceTokenApi,
} from "./notification.api";

import type {
  DeactivateWebDeviceTokenPayload,
  GetNotificationsParams,
  NotificationData,
  NotificationState,
  RegisterWebDeviceTokenPayload,
} from "./notification.types";


/* =====================================================
   INITIAL STATE
===================================================== */

const initialState: NotificationState = {
  notifications: [],

  pagination: null,

  unreadCount: 0,

  latestNotification: null,

  loading: false,

  loadingMore: false,

  refreshing: false,

  updating: false,

  deviceRegistering: false,

  initialized: false,

  error: null,

  soundEnabled: true,
};

/* =====================================================
   GET NOTIFICATIONS

   GET /api/v1/notifications
===================================================== */

export const getNotifications =
  createAsyncThunk(
    "notifications/getNotifications",

    async (
      params: GetNotificationsParams | undefined,

      {
        rejectWithValue,
      }
    ) => {
      try {
        return await getNotificationsApi(
          params
        );
      } catch (error: any) {
        return rejectWithValue(
          error?.response?.data?.message ??
            error?.message ??
            "Failed to fetch notifications"
        );
      }
    }
  );


/* =====================================================
   LOAD MORE NOTIFICATIONS
===================================================== */

export const loadMoreNotifications =
  createAsyncThunk(
    "notifications/loadMoreNotifications",

    async (
      params: GetNotificationsParams,

      {
        rejectWithValue,
      }
    ) => {
      try {
        return await getNotificationsApi(
          params
        );
      } catch (error: any) {
        return rejectWithValue(
          error?.response?.data?.message ??
            error?.message ??
            "Failed to load more notifications"
        );
      }
    }
  );


/* =====================================================
   GET UNREAD COUNT

   GET /api/v1/notifications/unread-count
===================================================== */

export const getUnreadNotificationCount =
  createAsyncThunk(
    "notifications/getUnreadNotificationCount",

    async (
      _,

      {
        rejectWithValue,
      }
    ) => {
      try {
        return await getUnreadNotificationCountApi();
      } catch (error: any) {
        return rejectWithValue(
          error?.response?.data?.message ??
            error?.message ??
            "Failed to fetch unread notification count"
        );
      }
    }
  );


/* =====================================================
   MARK ONE AS READ
===================================================== */

export const markNotificationRead =
  createAsyncThunk(
    "notifications/markNotificationRead",

    async (
      notificationId: string,

      {
        rejectWithValue,
      }
    ) => {
      try {
        return await markNotificationReadApi(
          notificationId
        );
      } catch (error: any) {
        return rejectWithValue(
          error?.response?.data?.message ??
            error?.message ??
            "Failed to mark notification as read"
        );
      }
    }
  );


/* =====================================================
   MARK ALL AS READ
===================================================== */

export const markAllNotificationsRead =
  createAsyncThunk(
    "notifications/markAllNotificationsRead",

    async (
      _,

      {
        rejectWithValue,
      }
    ) => {
      try {
        return await markAllNotificationsReadApi();
      } catch (error: any) {
        return rejectWithValue(
          error?.response?.data?.message ??
            error?.message ??
            "Failed to mark all notifications as read"
        );
      }
    }
  );


/* =====================================================
   DELETE NOTIFICATION
===================================================== */

export const deleteNotification =
  createAsyncThunk(
    "notifications/deleteNotification",

    async (
      notificationId: string,

      {
        rejectWithValue,
      }
    ) => {
      try {
        return await deleteNotificationApi(
          notificationId
        );
      } catch (error: any) {
        return rejectWithValue(
          error?.response?.data?.message ??
            error?.message ??
            "Failed to delete notification"
        );
      }
    }
  );


/* =====================================================
   REGISTER WEB DEVICE / FCM TOKEN
===================================================== */

export const registerWebDeviceToken =
  createAsyncThunk(
    "notifications/registerWebDeviceToken",

    async (
      data: RegisterWebDeviceTokenPayload,

      {
        rejectWithValue,
      }
    ) => {
      try {
        await registerWebDeviceTokenApi(
          data
        );

        return true;
      } catch (error: any) {
        return rejectWithValue(
          error?.response?.data?.message ??
            error?.message ??
            "Failed to register notification device"
        );
      }
    }
  );


/* =====================================================
   DEACTIVATE WEB DEVICE
===================================================== */

export const deactivateWebDeviceToken =
  createAsyncThunk(
    "notifications/deactivateWebDeviceToken",

    async (
      data: DeactivateWebDeviceTokenPayload,

      {
        rejectWithValue,
      }
    ) => {
      try {
        await deactivateWebDeviceTokenApi(
          data
        );

        return true;
      } catch (error: any) {
        return rejectWithValue(
          error?.response?.data?.message ??
            error?.message ??
            "Failed to deactivate notification device"
        );
      }
    }
  );


/* =====================================================
   NOTIFICATION SLICE
===================================================== */

const notificationSlice =
  createSlice({
    name: "notifications",

    initialState,

    reducers: {
      /* ===============================================
         SOCKET.IO REAL-TIME NOTIFICATION

         notification:new event मिलने पर call करें।
      =============================================== */

      notificationReceived: (
        state,
        action: PayloadAction<NotificationData>
      ) => {
        const notification =
          action.payload;

        const alreadyExists =
          state.notifications.some(
            (item) =>
              item._id ===
              notification._id
          );

        if (!alreadyExists) {
          state.notifications.unshift(
            notification
          );

          if (
            state.pagination
          ) {
            state.pagination.total += 1;
          }
        }

        state.latestNotification =
          notification;

        if (!notification.isRead) {
          state.unreadCount += 1;
        }
      },


      /* ===============================================
         CLEAR LATEST POPUP NOTIFICATION
      =============================================== */

      clearLatestNotification: (
        state
      ) => {
        state.latestNotification =
          null;
      },


      /* ===============================================
         SET UNREAD COUNT
      =============================================== */

      setUnreadCount: (
        state,
        action: PayloadAction<number>
      ) => {
        state.unreadCount =
          Math.max(
            0,
            action.payload
          );
      },


      /* ===============================================
         ENABLE/DISABLE WEB NOTIFICATION SOUND
      =============================================== */

      setNotificationSoundEnabled: (
        state,
        action: PayloadAction<boolean>
      ) => {
        state.soundEnabled =
          action.payload;

        localStorage.setItem(
          "notificationSoundEnabled",
          String(action.payload)
        );
      },


      /* ===============================================
         RESTORE SOUND PREFERENCE
      =============================================== */

      restoreNotificationSoundPreference: (
        state
      ) => {
        const storedValue =
          localStorage.getItem(
            "notificationSoundEnabled"
          );

        state.soundEnabled =
          storedValue !== "false";
      },


      /* ===============================================
         REMOVE NOTIFICATION LOCALLY
      =============================================== */

      removeNotificationLocally: (
        state,
        action: PayloadAction<string>
      ) => {
        const notification =
          state.notifications.find(
            (item) =>
              item._id ===
              action.payload
          );

        state.notifications =
          state.notifications.filter(
            (item) =>
              item._id !==
              action.payload
          );

        if (
          notification &&
          !notification.isRead
        ) {
          state.unreadCount =
            Math.max(
              0,
              state.unreadCount - 1
            );
        }

        if (
          state.latestNotification?._id ===
          action.payload
        ) {
          state.latestNotification =
            null;
        }
      },


      /* ===============================================
         CLEAR ERROR
      =============================================== */

      clearNotificationError: (
        state
      ) => {
        state.error = null;
      },


      /* ===============================================
         CLEAR NOTIFICATION STATE ON LOGOUT
      =============================================== */

      clearNotifications: (
        state
      ) => {
        state.notifications = [];

        state.pagination = null;

        state.unreadCount = 0;

        state.latestNotification =
          null;

        state.loading = false;

        state.loadingMore = false;

        state.updating = false;

        state.deviceRegistering =
          false;

        state.initialized = false;

        state.error = null;
      },
    },


    /* =================================================
       EXTRA REDUCERS
    ================================================= */

    extraReducers: (
      builder
    ) => {
      builder

        /* =============================================
           GET NOTIFICATIONS
        ============================================= */

        .addCase(
          getNotifications.pending,

          (
            state
          ) => {
            state.loading = true;

            state.error = null;
          }
        )

        .addCase(
          getNotifications.fulfilled,

          (
            state,
            action
          ) => {
            state.loading = false;

            state.error = null;

            state.notifications =
              action.payload.notifications;

            state.pagination =
              action.payload.pagination;

            state.unreadCount =
              action.payload.unreadCount;

            state.initialized = true;
          }
        )

        .addCase(
          getNotifications.rejected,

          (
            state,
            action
          ) => {
            state.loading = false;

            state.error =
              action.payload as string;

            state.initialized = true;
          }
        )


        /* =============================================
           LOAD MORE
        ============================================= */

        .addCase(
          loadMoreNotifications.pending,

          (
            state
          ) => {
            state.loadingMore = true;

            state.error = null;
          }
        )

        .addCase(
          loadMoreNotifications.fulfilled,

          (
            state,
            action
          ) => {
            state.loadingMore = false;

            const existingIds =
              new Set(
                state.notifications.map(
                  (item) =>
                    item._id
                )
              );

            const newNotifications =
              action.payload.notifications.filter(
                (item) =>
                  !existingIds.has(
                    item._id
                  )
              );

            state.notifications.push(
              ...newNotifications
            );

            state.pagination =
              action.payload.pagination;

            state.unreadCount =
              action.payload.unreadCount;
          }
        )

        .addCase(
          loadMoreNotifications.rejected,

          (
            state,
            action
          ) => {
            state.loadingMore = false;

            state.error =
              action.payload as string;
          }
        )


        /* =============================================
           UNREAD COUNT
        ============================================= */

        .addCase(
          getUnreadNotificationCount.fulfilled,

          (
            state,
            action
          ) => {
            state.unreadCount =
              Math.max(
                0,
                action.payload
              );
          }
        )

        .addCase(
          getUnreadNotificationCount.rejected,

          (
            state,
            action
          ) => {
            state.error =
              action.payload as string;
          }
        )


        /* =============================================
           MARK ONE AS READ
        ============================================= */

        .addCase(
          markNotificationRead.pending,

          (
            state
          ) => {
            state.updating = true;

            state.error = null;
          }
        )

        .addCase(
          markNotificationRead.fulfilled,

          (
            state,
            action
          ) => {
            state.updating = false;

            const index =
              state.notifications.findIndex(
                (notification) =>
                  notification._id ===
                  action.payload._id
              );

            if (
              index !== -1
            ) {
              const previousNotification =
                state.notifications[
                  index
                ];

              state.notifications[
                index
              ] =
                action.payload;

              if (
                previousNotification &&
                !previousNotification.isRead &&
                action.payload.isRead
              ) {
                state.unreadCount =
                  Math.max(
                    0,
                    state.unreadCount - 1
                  );
              }
            }

            if (
              state.latestNotification?._id ===
              action.payload._id
            ) {
              state.latestNotification =
                action.payload;
            }
          }
        )

        .addCase(
          markNotificationRead.rejected,

          (
            state,
            action
          ) => {
            state.updating = false;

            state.error =
              action.payload as string;
          }
        )


        /* =============================================
           MARK ALL AS READ
        ============================================= */

        .addCase(
          markAllNotificationsRead.pending,

          (
            state
          ) => {
            state.updating = true;

            state.error = null;
          }
        )

        .addCase(
          markAllNotificationsRead.fulfilled,

          (
            state
          ) => {
            state.updating = false;

            state.notifications =
              state.notifications.map(
                (notification) => ({
                  ...notification,

                  isRead: true,

                  readAt:
                    notification.readAt ??
                    new Date().toISOString(),
                })
              );

            state.unreadCount = 0;

            if (
              state.latestNotification
            ) {
              state.latestNotification = {
                ...state.latestNotification,

                isRead: true,

                readAt:
                  state.latestNotification
                    .readAt ??
                  new Date().toISOString(),
              };
            }
          }
        )

        .addCase(
          markAllNotificationsRead.rejected,

          (
            state,
            action
          ) => {
            state.updating = false;

            state.error =
              action.payload as string;
          }
        )


        /* =============================================
           DELETE NOTIFICATION
        ============================================= */

        .addCase(
          deleteNotification.pending,

          (
            state
          ) => {
            state.updating = true;

            state.error = null;
          }
        )

        .addCase(
          deleteNotification.fulfilled,

          (
            state,
            action
          ) => {
            state.updating = false;

            const deletedNotification =
              state.notifications.find(
                (notification) =>
                  notification._id ===
                  action.payload
              );

            state.notifications =
              state.notifications.filter(
                (notification) =>
                  notification._id !==
                  action.payload
              );

            if (
              deletedNotification &&
              !deletedNotification.isRead
            ) {
              state.unreadCount =
                Math.max(
                  0,
                  state.unreadCount - 1
                );
            }

            if (
              state.pagination
            ) {
              state.pagination.total =
                Math.max(
                  0,
                  state.pagination.total - 1
                );
            }

            if (
              state.latestNotification?._id ===
              action.payload
            ) {
              state.latestNotification =
                null;
            }
          }
        )

        .addCase(
          deleteNotification.rejected,

          (
            state,
            action
          ) => {
            state.updating = false;

            state.error =
              action.payload as string;
          }
        )


        /* =============================================
           REGISTER DEVICE
        ============================================= */

        .addCase(
          registerWebDeviceToken.pending,

          (
            state
          ) => {
            state.deviceRegistering =
              true;

            state.error = null;
          }
        )

        .addCase(
          registerWebDeviceToken.fulfilled,

          (
            state
          ) => {
            state.deviceRegistering =
              false;
          }
        )

        .addCase(
          registerWebDeviceToken.rejected,

          (
            state,
            action
          ) => {
            state.deviceRegistering =
              false;

            state.error =
              action.payload as string;
          }
        )


        /* =============================================
           DEACTIVATE DEVICE
        ============================================= */

        .addCase(
          deactivateWebDeviceToken.pending,

          (
            state
          ) => {
            state.deviceRegistering =
              true;

            state.error = null;
          }
        )

        .addCase(
          deactivateWebDeviceToken.fulfilled,

          (
            state
          ) => {
            state.deviceRegistering =
              false;
          }
        )

        .addCase(
          deactivateWebDeviceToken.rejected,

          (
            state,
            action
          ) => {
            state.deviceRegistering =
              false;

            state.error =
              action.payload as string;
          }
        );
    },
  });


/* =====================================================
   ACTIONS
===================================================== */

export const {
  notificationReceived,

  clearLatestNotification,

  setUnreadCount,

  setNotificationSoundEnabled,

  restoreNotificationSoundPreference,

  removeNotificationLocally,

  clearNotificationError,

  clearNotifications,
} =
  notificationSlice.actions;


/* =====================================================
   REDUCER
===================================================== */

export default
  notificationSlice.reducer;