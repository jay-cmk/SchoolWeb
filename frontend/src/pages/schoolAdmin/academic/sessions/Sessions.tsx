

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Icon } from "@iconify/react";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../../app/hooks";

import {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  setCurrentSession,
  clearSessionError,
  clearSelectedSession,
} from "../../../../features/academic/sessions/session.slice";

import type {
  AcademicStatus,
  CreateSessionPayload,
  UpdateSessionPayload,
} from "../../../../features/academic/sessions/session.types";




interface SessionFormState {
  name: string;
  startDate: string;
  endDate: string;
}


const initialFormState: SessionFormState = {
  name: "",
  startDate: "",
  endDate: "",
};


const Sessions: React.FC = () => {
  const dispatch = useAppDispatch();

  const {
    sessions,
    selectedSession,
    loading,
    error,
  } = useAppSelector(
    (state) => state.sessions
  );


  // ============================================
  // FILTER STATE
  // ============================================

  const [searchQuery, setSearchQuery] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [currentFilter, setCurrentFilter] =
    useState("All");


  // ============================================
  // MODAL STATE
  // ============================================

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [showViewModal, setShowViewModal] =
    useState(false);


  // ============================================
  // FORM STATE
  // ============================================

  const [formData, setFormData] =
    useState<SessionFormState>(
      initialFormState
    );


  // ============================================
  // ACTION STATE
  // ============================================

  const [submitting, setSubmitting] =
    useState(false);

  const [
    currentActionSessionId,
    setCurrentActionSessionId,
  ] = useState<string | null>(null);

  const [toastMessage, setToastMessage] =
    useState<string | null>(null);


  // ============================================
  // GET ALL SESSIONS
  // ============================================

  useEffect(() => {
    dispatch(getSessions());
  }, [dispatch]);


  // ============================================
  // ERROR HANDLING
  // ============================================

  useEffect(() => {
    if (error) {
      showToast(error);
    }
  }, [error]);


  useEffect(() => {
    return () => {
      dispatch(clearSessionError());
      dispatch(clearSelectedSession());
    };
  }, [dispatch]);


  // ============================================
  // TOAST
  // ============================================

  const showToast = (
    message: string
  ) => {
    setToastMessage(message);

    window.setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };


  // ============================================
  // DATE FORMATTER
  // ============================================

  const formatDate = (
    date?: string
  ) => {
    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  // ============================================
  // INPUT DATE FORMATTER
  // ============================================

  const toInputDate = (
    date?: string
  ) => {
    if (!date) {
      return "";
    }

    return new Date(date)
      .toISOString()
      .split("T")[0];
  };


  // ============================================
  // FORM CHANGE
  // ============================================

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  // ============================================
  // CREATE MODAL
  // ============================================

  const openCreateModal = () => {
    setFormData(initialFormState);

    dispatch(clearSessionError());

    setShowCreateModal(true);
  };


  const closeCreateModal = () => {
    setShowCreateModal(false);

    setFormData(initialFormState);
  };


  // ============================================
  // CREATE SESSION
  // POST /academic/sessions
  // ============================================

  const handleCreateSession = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.startDate ||
      !formData.endDate
    ) {
      showToast(
        "All fields are required"
      );

      return;
    }

    if (
      new Date(formData.startDate) >=
      new Date(formData.endDate)
    ) {
      showToast(
        "Start date must be before end date"
      );

      return;
    }

    const payload: CreateSessionPayload = {
      name: formData.name.trim(),
      startDate: formData.startDate,
      endDate: formData.endDate,
    };

    try {
      setSubmitting(true);

      await dispatch(
        createSession(payload)
      ).unwrap();

      showToast(
        "Academic session created successfully"
      );

      closeCreateModal();

      // Re-fetch to ensure backend-computed
      // academicStatus is fresh.
      await dispatch(
        getSessions()
      ).unwrap();
    } catch (err) {
      showToast(
        typeof err === "string"
          ? err
          : "Failed to create session"
      );
    } finally {
      setSubmitting(false);
    }
  };


  // ============================================
  // VIEW SESSION
  // GET /academic/sessions/:sessionId
  // ============================================

  const handleViewSession = async (
    sessionId: string
  ) => {
    try {
      dispatch(
        clearSelectedSession()
      );

      await dispatch(
        getSessionById(sessionId)
      ).unwrap();

      setShowViewModal(true);
    } catch (err) {
      showToast(
        typeof err === "string"
          ? err
          : "Failed to fetch session"
      );
    }
  };


  const closeViewModal = () => {
    setShowViewModal(false);

    dispatch(
      clearSelectedSession()
    );
  };


  // ============================================
  // OPEN EDIT
  // GET /academic/sessions/:sessionId
  // ============================================

  const handleOpenEdit = async (
    sessionId: string
  ) => {
    try {
      dispatch(
        clearSelectedSession()
      );

      const session =
        await dispatch(
          getSessionById(sessionId)
        ).unwrap();

      setFormData({
        name: session.name,
        startDate:
          toInputDate(
            session.startDate
          ),
        endDate:
          toInputDate(
            session.endDate
          ),
      });

      setShowEditModal(true);
    } catch (err) {
      showToast(
        typeof err === "string"
          ? err
          : "Failed to fetch session"
      );
    }
  };


  const closeEditModal = () => {
    setShowEditModal(false);

    setFormData(initialFormState);

    dispatch(
      clearSelectedSession()
    );
  };


  // ============================================
  // UPDATE SESSION
  // PUT /academic/sessions/:sessionId
  // ============================================

  const handleUpdateSession = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!selectedSession?._id) {
      showToast(
        "Session not selected"
      );

      return;
    }

    if (
      !formData.name.trim() ||
      !formData.startDate ||
      !formData.endDate
    ) {
      showToast(
        "All fields are required"
      );

      return;
    }

    if (
      new Date(formData.startDate) >=
      new Date(formData.endDate)
    ) {
      showToast(
        "Start date must be before end date"
      );

      return;
    }

    const data: UpdateSessionPayload = {
      name: formData.name.trim(),
      startDate: formData.startDate,
      endDate: formData.endDate,
    };

    try {
      setSubmitting(true);

      await dispatch(
        updateSession({
          sessionId:
            selectedSession._id,

          data,
        })
      ).unwrap();

      showToast(
        "Academic session updated successfully"
      );

      closeEditModal();

      await dispatch(
        getSessions()
      ).unwrap();
    } catch (err) {
      showToast(
        typeof err === "string"
          ? err
          : "Failed to update session"
      );
    } finally {
      setSubmitting(false);
    }
  };


  // ============================================
  // SET CURRENT
  // PATCH /academic/sessions/:id/current
  // ============================================

  const handleSetCurrent = async (
    sessionId: string
  ) => {
    try {
      setCurrentActionSessionId(
        sessionId
      );

      await dispatch(
        setCurrentSession(sessionId)
      ).unwrap();

      showToast(
        "Current academic session updated successfully"
      );

      await dispatch(
        getSessions()
      ).unwrap();
    } catch (err) {
      showToast(
        typeof err === "string"
          ? err
          : "Failed to set current session"
      );
    } finally {
      setCurrentActionSessionId(
        null
      );
    }
  };


  // ============================================
  // FILTERING
  // ============================================

  const filteredSessions =
    useMemo(() => {
      return sessions.filter(
        (session) => {
          const matchesSearch =
            session.name
              .toLowerCase()
              .includes(
                searchQuery
                  .trim()
                  .toLowerCase()
              );

          const matchesStatus =
            statusFilter === "All" ||
            session.academicStatus ===
              statusFilter;

          const matchesCurrent =
            currentFilter === "All" ||
            (
              currentFilter ===
                "Current" &&
              session.isCurrent
            ) ||
            (
              currentFilter ===
                "Not Current" &&
              !session.isCurrent
            );

          return (
            matchesSearch &&
            matchesStatus &&
            matchesCurrent
          );
        }
      );
    }, [
      sessions,
      searchQuery,
      statusFilter,
      currentFilter,
    ]);


  // ============================================
  // STATS
  // ============================================

  const totalSessions =
    sessions.length;

  const currentSession =
    sessions.find(
      (session) =>
        session.isCurrent
    );

  const previousSession =
    useMemo(() => {
      return [...sessions]
        .filter(
          (session) =>
            session.academicStatus ===
            "COMPLETED"
        )
        .sort(
          (a, b) =>
            new Date(
              b.endDate
            ).getTime() -
            new Date(
              a.endDate
            ).getTime()
        )[0];
    }, [sessions]);


  // ============================================
  // STATUS BADGE
  // ============================================

  const getStatusBadge = (
    status: AcademicStatus
  ) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

            Active
          </span>
        );

      case "UPCOMING":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />

            Upcoming
          </span>
        );

      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-500/20 bg-slate-500/10 px-2.5 py-1 text-xs font-semibold text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />

            Completed
          </span>
        );

      default:
        return null;
    }
  };


  // ============================================
  // INITIAL LOADING
  // ============================================

  if (
    loading &&
    sessions.length === 0
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F9FC]">
        <div className="flex flex-col items-center gap-4">
          <Icon
            icon="lucide:loader-2"
            className="animate-spin text-4xl text-[#1F5FAE]"
          />

          <p className="text-[#6B7280]">
            Loading sessions...
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen w-full bg-[#F7F9FC]">

      {/* ========================================
          TOAST
      ======================================== */}

      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[100] flex items-center gap-2 rounded-lg bg-[#15243B] px-4 py-3 text-white shadow-lg">
          <Icon
            icon="lucide:info"
            className="text-lg text-emerald-400"
          />

          <span className="text-sm font-semibold">
            {toastMessage}
          </span>
        </div>
      )}


      <div className="p-4 md:p-6 lg:p-8">

        {/* ========================================
            HEADER
        ======================================== */}

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

          <div>
            <div className="flex items-center gap-2 text-sm text-[#6B7280]">
              <span>
                Academics
              </span>

              <Icon
                icon="lucide:chevron-right"
                className="text-xs"
              />

              <span className="font-semibold text-[#15243B]">
                Academic Sessions
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-bold text-[#15243B]">
              Academic Sessions
            </h1>

            <p className="mt-1 text-sm text-[#6B7280]">
              Manage academic years and select
              the current active session for
              your school.
            </p>
          </div>


          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1F5FAE] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#174E91]"
          >
            <Icon
              icon="lucide:plus"
              className="text-lg"
            />

            Add Academic Session
          </button>

        </div>


        {/* ========================================
            STATS
        ======================================== */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E8F0FB] text-[#1F5FAE]">
                <Icon
                  icon="lucide:calendar"
                  className="text-xl"
                />
              </div>

              <div>
                <p className="text-sm text-[#6B7280]">
                  Total Sessions
                </p>

                <p className="text-2xl font-bold text-[#15243B]">
                  {totalSessions}
                </p>
              </div>

            </div>

            <p className="mt-2 text-xs text-[#6B7280]">
              Across school history
            </p>
          </div>


          <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                <Icon
                  icon="lucide:check-circle"
                  className="text-xl"
                />
              </div>

              <div>
                <p className="text-sm text-[#6B7280]">
                  Current Session
                </p>

                <p className="text-2xl font-bold text-[#15243B]">
                  {currentSession
                    ? currentSession.name
                    : "None"}
                </p>
              </div>

            </div>

            {currentSession && (
              <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                Current
              </span>
            )}

            <p className="mt-2 text-xs text-[#6B7280]">
              Selected academic session
            </p>
          </div>


          <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-500/10 text-slate-600">
                <Icon
                  icon="lucide:clock"
                  className="text-xl"
                />
              </div>

              <div>
                <p className="text-sm text-[#6B7280]">
                  Previous Session
                </p>

                <p className="text-2xl font-bold text-[#15243B]">
                  {previousSession
                    ? previousSession.name
                    : "None"}
                </p>
              </div>

            </div>

            {previousSession && (
              <span className="mt-2 inline-flex rounded-full border border-slate-500/20 bg-slate-500/10 px-2.5 py-1 text-xs font-semibold text-slate-600">
                Completed
              </span>
            )}

            <p className="mt-2 text-xs text-[#6B7280]">
              Last completed session
            </p>
          </div>

        </div>


        {/* ========================================
            FILTERS
        ======================================== */}

        <div className="mt-6 flex flex-col gap-4 rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">

          <div className="relative flex-1">

            <Icon
              icon="lucide:search"
              className="absolute left-3 top-2.5 text-lg text-[#6B7280]"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }
              placeholder="Search session by name..."
              className="w-full rounded-lg border border-[#D1D5DB] bg-white py-2 pl-10 pr-4 text-sm text-[#15243B] outline-none focus:border-[#1F5FAE] focus:ring-1 focus:ring-[#1F5FAE]"
            />

          </div>


          <div className="flex flex-wrap items-center gap-3">

            <div className="flex items-center gap-2">

              <span className="text-xs font-semibold text-[#6B7280]">
                Status:
              </span>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
                className="rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#15243B] outline-none focus:border-[#1F5FAE]"
              >
                <option value="All">
                  All
                </option>

                <option value="ACTIVE">
                  Active
                </option>

                <option value="UPCOMING">
                  Upcoming
                </option>

                <option value="COMPLETED">
                  Completed
                </option>
              </select>

            </div>


            <div className="flex items-center gap-2">

              <span className="text-xs font-semibold text-[#6B7280]">
                Current:
              </span>

              <select
                value={currentFilter}
                onChange={(e) =>
                  setCurrentFilter(
                    e.target.value
                  )
                }
                className="rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#15243B] outline-none focus:border-[#1F5FAE]"
              >
                <option value="All">
                  All
                </option>

                <option value="Current">
                  Current
                </option>

                <option value="Not Current">
                  Not Current
                </option>
              </select>

            </div>

          </div>

        </div>


        {/* ========================================
            TABLE
        ======================================== */}

        <div className="mt-6 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">

            <div>
              <h2 className="text-sm font-semibold text-[#15243B]">
                Academic year records
              </h2>

              <p className="text-xs text-[#6B7280]">
                {filteredSessions.length}
                {" "}
                sessions returned
              </p>
            </div>

            <button
              onClick={() =>
                dispatch(
                  getSessions()
                )
              }
              className="inline-flex items-center gap-2 rounded-lg border border-[#D1D5DB] px-3 py-2 text-xs font-semibold text-[#15243B] hover:bg-[#F9FAFB]"
            >
              <Icon
                icon="lucide:refresh-cw"
              />

              Refresh
            </button>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full text-left text-sm">

              <thead className="bg-[#F9FAFB] text-xs uppercase text-[#6B7280]">

                <tr>
                  <th className="px-5 py-3 font-semibold">
                    Session Name
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Start Date
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    End Date
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Academic Status
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Current Session
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Created Date
                  </th>

                  <th className="px-5 py-3 text-center font-semibold">
                    Actions
                  </th>
                </tr>

              </thead>


              <tbody className="divide-y divide-[#E5E7EB]">

                {filteredSessions.length ===
                0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-10 text-center text-[#6B7280]"
                    >
                      No sessions found.
                    </td>
                  </tr>
                ) : (
                  filteredSessions.map(
                    (session) => (
                      <tr
                        key={session._id}
                        className="transition-colors hover:bg-[#F9FAFB]"
                      >

                        <td className="px-5 py-4 font-semibold text-[#15243B]">
                          {session.name}
                        </td>

                        <td className="px-5 py-4 text-[#6B7280]">
                          {formatDate(
                            session.startDate
                          )}
                        </td>

                        <td className="px-5 py-4 text-[#6B7280]">
                          {formatDate(
                            session.endDate
                          )}
                        </td>

                        <td className="px-5 py-4">
                          {getStatusBadge(
                            session.academicStatus
                          )}
                        </td>

                        <td className="px-5 py-4">

                          {session.isCurrent ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                              Current
                            </span>
                          ) : (
                            <button
                              onClick={() =>
                                handleSetCurrent(
                                  session._id
                                )
                              }
                              disabled={
                                currentActionSessionId ===
                                session._id
                              }
                              className="inline-flex items-center gap-1 text-xs font-semibold text-[#1F5FAE] hover:underline disabled:opacity-50"
                            >
                              {currentActionSessionId ===
                              session._id ? (
                                <>
                                  <Icon
                                    icon="lucide:loader-2"
                                    className="animate-spin"
                                  />

                                  Updating...
                                </>
                              ) : (
                                "Set as Current"
                              )}
                            </button>
                          )}

                        </td>

                        <td className="px-5 py-4 text-[#6B7280]">
                          {formatDate(
                            session.createdAt
                          )}
                        </td>

                        <td className="px-5 py-4">

                          <div className="flex items-center justify-center gap-2">

                            <button
                              onClick={() =>
                                handleViewSession(
                                  session._id
                                )
                              }
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#1F5FAE] transition hover:bg-[#E8F0FB]"
                              title="View"
                            >
                              <Icon
                                icon="lucide:eye"
                              />
                            </button>


                            <button
                              onClick={() =>
                                handleOpenEdit(
                                  session._id
                                )
                              }
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-amber-600 transition hover:bg-amber-50"
                              title="Edit"
                            >
                              <Icon
                                icon="lucide:pencil"
                              />
                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  )
                )}

              </tbody>

            </table>

          </div>


          <div className="border-t border-[#E5E7EB] bg-[#F9FAFB]/50 px-5 py-4">

            <p className="text-xs text-[#6B7280]">
              Showing
              {" "}
              {filteredSessions.length}
              {" "}
              of
              {" "}
              {sessions.length}
              {" "}
              sessions
            </p>

          </div>

        </div>

      </div>


      {/* ========================================
          CREATE MODAL
      ======================================== */}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b px-6 py-4">

              <div>
                <h2 className="text-lg font-bold text-[#15243B]">
                  Add Academic Session
                </h2>

                <p className="text-sm text-[#6B7280]">
                  Create a new academic year.
                </p>
              </div>

              <button
                onClick={closeCreateModal}
                className="text-[#6B7280] hover:text-[#15243B]"
              >
                <Icon
                  icon="lucide:x"
                  className="text-xl"
                />
              </button>

            </div>


            <form
              onSubmit={
                handleCreateSession
              }
            >

              <SessionForm
                formData={formData}
                onChange={
                  handleInputChange
                }
              />

              <div className="flex justify-end gap-3 border-t px-6 py-4">

                <button
                  type="button"
                  onClick={
                    closeCreateModal
                  }
                  className="rounded-lg border border-[#D1D5DB] px-4 py-2 text-sm font-semibold text-[#15243B]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#1F5FAE] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {submitting && (
                    <Icon
                      icon="lucide:loader-2"
                      className="animate-spin"
                    />
                  )}

                  Create Session
                </button>

              </div>

            </form>

          </div>

        </div>
      )}


      {/* ========================================
          EDIT MODAL
      ======================================== */}

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b px-6 py-4">

              <div>
                <h2 className="text-lg font-bold text-[#15243B]">
                  Edit Academic Session
                </h2>

                <p className="text-sm text-[#6B7280]">
                  Update session details.
                </p>
              </div>

              <button
                onClick={closeEditModal}
                className="text-[#6B7280] hover:text-[#15243B]"
              >
                <Icon
                  icon="lucide:x"
                  className="text-xl"
                />
              </button>

            </div>


            <form
              onSubmit={
                handleUpdateSession
              }
            >

              <SessionForm
                formData={formData}
                onChange={
                  handleInputChange
                }
              />

              <div className="flex justify-end gap-3 border-t px-6 py-4">

                <button
                  type="button"
                  onClick={
                    closeEditModal
                  }
                  className="rounded-lg border border-[#D1D5DB] px-4 py-2 text-sm font-semibold text-[#15243B]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#1F5FAE] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {submitting && (
                    <Icon
                      icon="lucide:loader-2"
                      className="animate-spin"
                    />
                  )}

                  Save Changes
                </button>

              </div>

            </form>

          </div>

        </div>
      )}


      {/* ========================================
          VIEW MODAL
      ======================================== */}

      {showViewModal &&
        selectedSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

            <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">

              <div className="flex items-center justify-between border-b px-6 py-4">

                <div>
                  <h2 className="text-lg font-bold text-[#15243B]">
                    Academic Session Details
                  </h2>

                  <p className="text-sm text-[#6B7280]">
                    Session information
                  </p>
                </div>

                <button
                  onClick={
                    closeViewModal
                  }
                >
                  <Icon
                    icon="lucide:x"
                    className="text-xl text-[#6B7280]"
                  />
                </button>

              </div>


              <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">

                <DetailItem
                  label="Session Name"
                  value={
                    selectedSession.name
                  }
                />

                <DetailItem
                  label="Academic Status"
                  value={
                    selectedSession
                      .academicStatus
                  }
                />

                <DetailItem
                  label="Start Date"
                  value={formatDate(
                    selectedSession
                      .startDate
                  )}
                />

                <DetailItem
                  label="End Date"
                  value={formatDate(
                    selectedSession
                      .endDate
                  )}
                />

                <DetailItem
                  label="Current Session"
                  value={
                    selectedSession
                      .isCurrent
                      ? "Yes"
                      : "No"
                  }
                />

                <DetailItem
                  label="Created Date"
                  value={formatDate(
                    selectedSession
                      .createdAt
                  )}
                />

              </div>


              <div className="flex justify-end border-t px-6 py-4">

                <button
                  onClick={
                    closeViewModal
                  }
                  className="rounded-lg bg-[#15243B] px-4 py-2 text-sm font-semibold text-white"
                >
                  Close
                </button>

              </div>

            </div>

          </div>
        )}

    </div>
  );
};


// ============================================
// FORM COMPONENT
// ============================================

interface SessionFormProps {
  formData: SessionFormState;

  onChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}


const SessionForm = ({
  formData,
  onChange,
}: SessionFormProps) => {
  return (
    <div className="space-y-5 p-6">

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-[#374151]">
          Session Name
        </label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={onChange}
          placeholder="Example: 2026-27"
          className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2.5 text-sm outline-none focus:border-[#1F5FAE] focus:ring-1 focus:ring-[#1F5FAE]"
        />
      </div>


      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[#374151]">
            Start Date
          </label>

          <input
            type="date"
            name="startDate"
            value={
              formData.startDate
            }
            onChange={onChange}
            className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2.5 text-sm outline-none focus:border-[#1F5FAE]"
          />
        </div>


        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[#374151]">
            End Date
          </label>

          <input
            type="date"
            name="endDate"
            value={
              formData.endDate
            }
            onChange={onChange}
            className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2.5 text-sm outline-none focus:border-[#1F5FAE]"
          />
        </div>

      </div>

    </div>
  );
};


// ============================================
// DETAIL ITEM
// ============================================

interface DetailItemProps {
  label: string;
  value: string;
}


const DetailItem = ({
  label,
  value,
}: DetailItemProps) => {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">
        {label}
      </p>

      <p className="mt-1 font-semibold text-[#15243B]">
        {value}
      </p>
    </div>
  );
};


export default Sessions;