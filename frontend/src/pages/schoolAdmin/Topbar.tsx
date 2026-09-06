// import { useAppSelector } from "../../app/hooks";

// interface TopbarProps {
//   onMenuClick: () => void;
// }

// const Topbar = ({
//   onMenuClick,
// }: TopbarProps) => {

//   const user = useAppSelector(
//     (state) => state.auth.user
//   );

//   const firstLetter =
//     user?.name?.charAt(0)?.toUpperCase() || "A";

//   return (
//     <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">

//       {/* Left */}
//       <div className="flex items-center gap-4">

//         {/* Mobile Menu */}
//         <button
//           onClick={onMenuClick}
//           className="lg:hidden text-gray-600 text-2xl"
//         >
//           ☰
//         </button>

//         <div>

//           <h2 className="font-semibold text-gray-800">
//             Dashboard
//           </h2>

//           <p className="text-xs text-gray-500 hidden sm:block">
//             School administration panel
//           </p>

//         </div>

//       </div>

//       {/* Right */}
//       <div className="flex items-center gap-3">

//         <div className="text-right hidden sm:block">

//           <p className="text-sm font-medium text-gray-800">
//             {user?.name || "School Admin"}
//           </p>

//           <p className="text-xs text-gray-500">
//             School Admin
//           </p>

//         </div>

//         <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
//           {firstLetter}
//         </div>

//       </div>

//     </header>
//   );
// };

// export default Topbar;




// Topbar.tsx

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import { Icon } from "@iconify/react";

import {
  useAppDispatch,
  useAppSelector,
} from "../../app/hooks";

import {
  getSessions,
} from "../../features/academic/sessions/session.slice";

import {
  setSelectedSessionId,
} from "../../features/academic/sessions/sessionSelection.slice";

interface TopbarProps {
  onToggleSidebar: () => void;

  searchQuery: string;

  onSearchChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;

  onQuickActionClick: () => void;
}

const Topbar: React.FC<TopbarProps> = ({
  onToggleSidebar,
  searchQuery,
  onSearchChange,
  onQuickActionClick,
}) => {
  const dispatch = useAppDispatch();

  const [
    isProfileDropdownOpen,
    setIsProfileDropdownOpen,
  ] = useState(false);

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  /*
  |--------------------------------------------------------------------------
  | Redux - Academic Sessions
  |--------------------------------------------------------------------------
  */

  const sessions = useAppSelector(
    (state) => state.sessions.sessions
  );

  const sessionsLoading = useAppSelector(
    (state) => state.sessions.loading
  );

  const selectedSessionId =
    useAppSelector(
      (state) =>
        state.sessionSelection
          .selectedSessionId
    );

  /*
  |--------------------------------------------------------------------------
  | Load Academic Sessions
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (sessions.length === 0) {
      dispatch(getSessions());
    }
  }, [
    dispatch,
    sessions.length,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Set Default / Validate Selected Session
  |--------------------------------------------------------------------------
  |
  | Priority:
  |
  | 1. Existing selectedSessionId if it is still valid
  | 2. Current academic session
  | 3. First available session
  |
  */

  useEffect(() => {
    if (sessions.length === 0) {
      return;
    }

    const selectedSessionExists =
      selectedSessionId
        ? sessions.some(
            (session) =>
              session._id ===
              selectedSessionId
          )
        : false;

    if (selectedSessionExists) {
      return;
    }

    const currentSession =
      sessions.find(
        (session) =>
          session.isCurrent
      );

    if (currentSession) {
      dispatch(
        setSelectedSessionId(
          currentSession._id
        )
      );

      return;
    }

    const firstSession =
      sessions[0];

    if (firstSession) {
      dispatch(
        setSelectedSessionId(
          firstSession._id
        )
      );
    }
  }, [
    dispatch,
    sessions,
    selectedSessionId,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Session Change
  |--------------------------------------------------------------------------
  */

  const handleSessionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const sessionId =
      event.target.value;

    if (!sessionId) {
      return;
    }

    dispatch(
      setSelectedSessionId(sessionId)
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Profile Dropdown
  |--------------------------------------------------------------------------
  */

  const toggleProfileDropdown = () =>
    setIsProfileDropdownOpen(
      (previous) => !previous
    );

  const closeProfileDropdown = () =>
    setIsProfileDropdownOpen(false);

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        closeProfileDropdown();
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <header className="flex min-h-20 items-center gap-4 border-b border-[#E5E7EB] bg-white px-5 lg:px-8">
      {/* Mobile Sidebar Button */}
      <button
        onClick={onToggleSidebar}
        className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#15243B] transition-colors hover:bg-[#F9FAFB] lg:hidden"
      >
        <Icon
          icon="lucide:menu"
          className="text-xl"
        />
      </button>

      {/* Search */}
      <div className="hidden max-w-xl flex-1 lg:block">
        <label className="relative block">
          <span className="sr-only">
            Search school records
          </span>

          <Icon
            icon="lucide:search"
            className="absolute left-3 top-3 text-lg text-[#6B7280]"
          />

          <input
            value={searchQuery}
            onChange={
              onSearchChange
            }
            className="min-h-11 w-full rounded-lg border border-[#D1D5DB] bg-white pl-10 pr-4 text-sm text-[#15243B] transition-all focus:border-[#1F5FAE] focus:outline-none focus:ring-1 focus:ring-[#1F5FAE]"
            placeholder="Search students, staff, classes or records"
          />
        </label>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Academic Session Selector */}
        <div className="hidden md:block">
          <p className="mb-1 text-xs text-[#6B7280]">
            Academic Session
          </p>

          <div className="relative">
            <Icon
              icon="lucide:calendar-days"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-[#6B7280]"
            />

            <select
              value={
                selectedSessionId ??
                ""
              }
              onChange={
                handleSessionChange
              }
              disabled={
                sessionsLoading ||
                sessions.length ===
                  0
              }
              className="min-h-10 min-w-[145px] appearance-none rounded-lg border border-[#D1D5DB] bg-white py-2 pl-9 pr-9 text-sm font-semibold text-[#15243B] outline-none transition-colors hover:border-[#1F5FAE] focus:border-[#1F5FAE] focus:ring-1 focus:ring-[#1F5FAE] disabled:cursor-not-allowed disabled:bg-[#F9FAFB] disabled:text-[#9CA3AF]"
            >
              {sessionsLoading &&
              sessions.length ===
                0 ? (
                <option value="">
                  Loading...
                </option>
              ) : sessions.length ===
                0 ? (
                <option value="">
                  No Session
                </option>
              ) : (
                sessions.map(
                  (session) => (
                    <option
                      key={
                        session._id
                      }
                      value={
                        session._id
                      }
                    >
                      {session.name}
                      {session.isCurrent
                        ? " • Current"
                        : ""}
                    </option>
                  )
                )
              )}
            </select>

            <Icon
              icon="lucide:chevron-down"
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#6B7280]"
            />
          </div>
        </div>

        {/* Quick Action */}
        <button
          onClick={
            onQuickActionClick
          }
          className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#15243B] transition-colors hover:bg-[#F9FAFB]"
          title="Quick Action"
        >
          <Icon
            icon="lucide:plus"
            className="text-xl"
          />
        </button>

        {/* Notifications */}
        <button className="relative flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#15243B] transition-colors hover:bg-[#F9FAFB]">
          <Icon
            icon="lucide:bell"
            className="text-xl"
          />

          <span className="absolute right-2 top-2 h-2 w-2 animate-pulse rounded-full bg-[#EF4444]" />
        </button>

        {/* Profile */}
        <div
          className="relative"
          ref={dropdownRef}
        >
          <button
            onClick={
              toggleProfileDropdown
            }
            className="flex min-h-11 items-center gap-2 rounded-lg px-1 transition-colors hover:bg-[#F9FAFB]"
          >
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100"
              alt="Dr. Ananya Mehta"
              className="h-10 w-10 rounded-full object-cover ring-2 ring-[#1F5FAE]/20"
            />

            <span className="hidden text-left lg:block">
              <span className="block text-sm font-semibold text-[#15243B]">
                Dr. Mehta
              </span>

              <span className="block text-xs text-[#6B7280]">
                Principal
              </span>
            </span>

            <Icon
              icon="lucide:chevron-down"
              className="hidden text-[#6B7280] lg:block"
            />
          </button>

          {isProfileDropdownOpen && (
            <div className="absolute right-0 z-50 mt-2 w-48 animate-in rounded-lg border border-[#E5E7EB] bg-white p-2 shadow-lg slide-in-from-top-2 duration-200">
              <a
                href="#profile"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[#15243B] transition-colors hover:bg-[#F9FAFB]"
              >
                <Icon icon="lucide:user" />

                My Profile
              </a>

              <a
                href="#settings"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[#15243B] transition-colors hover:bg-[#F9FAFB]"
              >
                <Icon icon="lucide:settings" />

                Settings
              </a>

              <hr className="my-1 border-[#E5E7EB]" />

              <button
                onClick={() =>
                  alert(
                    "Logging out..."
                  )
                }
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-[#EF4444] transition-colors hover:bg-[#FEF2F2]"
              >
                <Icon icon="lucide:log-out" />

                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;