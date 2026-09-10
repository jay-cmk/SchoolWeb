import {
  useCallback,
  useEffect,
  useRef,
} from "react";

import {
  useAppDispatch,
  useAppSelector,
} from "../app/hooks";

import {
  clearLatestNotification,
  getUnreadNotificationCount,
  notificationReceived,
  restoreNotificationSoundPreference,
  setNotificationSoundEnabled,
  setUnreadCount,
} from "../features/notifications/notification.slice";

import type {
  NotificationData,
} from "../features/notifications/notification.types";

import {
  connectSocket,
  disconnectSocket,
  subscribeToNotifications,
  subscribeToUnreadCount,
} from "../services/socket.service";


/* =====================================================
   NOTIFICATION SOUND

   File location:
   web/public/sounds/notification.mp3

   Browser URL:
   /sounds/notification.mp3
===================================================== */

const NOTIFICATION_SOUND_URL =
  "/sounds/notification.wav";


/* =====================================================
   HOOK
===================================================== */

const useNotifications = () => {
  const dispatch =
    useAppDispatch();


  const accessToken =
    useAppSelector(
      (
        state
      ) =>
        state.auth.accessToken
    );


  const {
    notifications,

    unreadCount,

    latestNotification,

    loading,

    updating,

    initialized,

    error,

    soundEnabled,
  } =
    useAppSelector(
      (
        state
      ) =>
        state.notifications
    );


  /*
   * Audio instance हर render पर दोबारा नहीं बनेगा।
   */
  const audioRef =
    useRef<HTMLAudioElement | null>(
      null
    );


  /*
   * Browser ने sound interaction allow किया है या नहीं।
   */
  const soundUnlockedRef =
    useRef<boolean>(
      false
    );


  /* ===================================================
     INITIALIZE AUDIO
  =================================================== */

  useEffect(
    () => {
      const audio =
        new Audio(
          NOTIFICATION_SOUND_URL
        );

      audio.preload =
        "auto";

      audio.volume =
        0.65;

      audioRef.current =
        audio;


      return () => {
        audio.pause();

        audio.currentTime =
          0;

        audioRef.current =
          null;
      };
    },

    []
  );


  /* ===================================================
     RESTORE SOUND SETTING
  =================================================== */

  useEffect(
    () => {
      dispatch(
        restoreNotificationSoundPreference()
      );
    },

    [
      dispatch,
    ]
  );


  /* ===================================================
     UNLOCK BROWSER AUDIO

     Browser autoplay policy के कारण user का पहला click,
     keydown या touch होने के बाद sound unlock होगी।
  =================================================== */

  useEffect(
    () => {
      const unlockSound =
        async () => {
          const audio =
            audioRef.current;


          if (
            !audio ||
            soundUnlockedRef.current
          ) {
            return;
          }


          try {
            audio.muted =
              true;

            await audio.play();

            audio.pause();

            audio.currentTime =
              0;

            audio.muted =
              false;

            soundUnlockedRef.current =
              true;
          } catch {
            /*
             * Browser ने अभी interaction स्वीकार नहीं
             * किया है। अगले click पर फिर प्रयास होगा।
             */
          }
        };


      window.addEventListener(
        "click",
        unlockSound
      );

      window.addEventListener(
        "keydown",
        unlockSound
      );

      window.addEventListener(
        "touchstart",
        unlockSound
      );


      return () => {
        window.removeEventListener(
          "click",
          unlockSound
        );

        window.removeEventListener(
          "keydown",
          unlockSound
        );

        window.removeEventListener(
          "touchstart",
          unlockSound
        );
      };
    },

    []
  );


  /* ===================================================
     PLAY NOTIFICATION SOUND
  =================================================== */

  const playNotificationSound =
    useCallback(
      async () => {
        const audio =
          audioRef.current;


        if (
          !audio ||
          !soundEnabled
        ) {
          return;
        }


        try {
          audio.currentTime =
            0;

          await audio.play();

          soundUnlockedRef.current =
            true;
        } catch (error) {
          /*
           * Browser autoplay block होने पर application
           * crash नहीं होगी। User interaction के बाद
           * अगली notification पर sound चलेगी।
           */
          console.warn(
            "Notification sound could not play:",
            error
          );
        }
      },

      [
        soundEnabled,
      ]
    );


  /* ===================================================
     HANDLE SOCKET NOTIFICATION
  =================================================== */

  const handleNewNotification =
    useCallback(
      (
        notification:
          NotificationData
      ) => {
        dispatch(
          notificationReceived(
            notification
          )
        );


        /*
         * Backend notification में sound NONE है तो
         * Web पर आवाज नहीं चलेगी।
         */
        if (
          notification.sound !==
          "NONE"
        ) {
          void playNotificationSound();
        }
      },

      [
        dispatch,
        playNotificationSound,
      ]
    );


  /* ===================================================
     HANDLE SOCKET UNREAD COUNT
  =================================================== */

  const handleUnreadCount =
    useCallback(
      (
        count: number
      ) => {
        dispatch(
          setUnreadCount(
            count
          )
        );
      },

      [
        dispatch,
      ]
    );


  /* ===================================================
     CONNECT SOCKET

     Login token मिलते ही socket connect होगी।
  =================================================== */

  useEffect(
    () => {
      if (
        !accessToken
      ) {
        disconnectSocket();

        return;
      }


      connectSocket();


      const unsubscribeNotifications =
        subscribeToNotifications(
          handleNewNotification
        );


      const unsubscribeUnreadCount =
        subscribeToUnreadCount(
          handleUnreadCount
        );


      /*
       * Page refresh के बाद initial unread count REST API
       * से आएगा। उसके बाद Socket.IO real-time updates देगा।
       */
      void dispatch(
        getUnreadNotificationCount()
      );


      return () => {
        unsubscribeNotifications();

        unsubscribeUnreadCount();
      };
    },

    [
      accessToken,
      dispatch,
      handleNewNotification,
      handleUnreadCount,
    ]
  );


  /* ===================================================
     TOGGLE SOUND
  =================================================== */

  const toggleNotificationSound =
    useCallback(
      () => {
        dispatch(
          setNotificationSoundEnabled(
            !soundEnabled
          )
        );
      },

      [
        dispatch,
        soundEnabled,
      ]
    );


  /* ===================================================
     ENABLE SOUND
  =================================================== */

  const enableNotificationSound =
    useCallback(
      async () => {
        dispatch(
          setNotificationSoundEnabled(
            true
          )
        );


        /*
         * Button click user interaction होता है,
         * इसलिए इसी समय sound test भी चल सकती है।
         */
        const audio =
          audioRef.current;


        if (!audio) {
          return;
        }


        try {
          audio.currentTime =
            0;

          await audio.play();

          soundUnlockedRef.current =
            true;
        } catch (error) {
          console.warn(
            "Notification sound permission blocked:",
            error
          );
        }
      },

      [
        dispatch,
      ]
    );


  /* ===================================================
     DISABLE SOUND
  =================================================== */

  const disableNotificationSound =
    useCallback(
      () => {
        dispatch(
          setNotificationSoundEnabled(
            false
          )
        );


        const audio =
          audioRef.current;


        if (audio) {
          audio.pause();

          audio.currentTime =
            0;
        }
      },

      [
        dispatch,
      ]
    );


  /* ===================================================
     DISMISS LATEST NOTIFICATION POPUP
  =================================================== */

  const dismissLatestNotification =
    useCallback(
      () => {
        dispatch(
          clearLatestNotification()
        );
      },

      [
        dispatch,
      ]
    );


  return {
    notifications,

    unreadCount,

    latestNotification,

    loading,

    updating,

    initialized,

    error,

    soundEnabled,

    toggleNotificationSound,

    enableNotificationSound,

    disableNotificationSound,

    playNotificationSound,

    dismissLatestNotification,
  };
};


export default
  useNotifications;