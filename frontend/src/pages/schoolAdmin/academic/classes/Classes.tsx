// ============================================
// CLASSES PAGE (Classes.tsx)
// ============================================

import {
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
  createClass,
  getClasses,
  getClassById,
  updateClass,
  updateClassStatus,
  clearSelectedClass,
  clearClassError,
} from "../../../../features/academic/classes/class.slice";

import {
  getSessions,
} from "../../../../features/academic/sessions/session.slice";

import type {
  ClassData,
  CreateClassPayload,
  UpdateClassPayload,
} from "../../../../features/academic/classes/class.types";


// ============================================
// FORM TYPE
// ============================================

interface ClassFormState {
  sessionId: string;
  name: string;
  order: string;
}


const initialFormState: ClassFormState = {
  sessionId: "",
  name: "",
  order: "",
};


// ============================================
// STAT CARD
// ============================================

interface StatCardProps {
  title: string;
  value: string | number;
  subtext: string;
}


const StatCard = ({
  title,
  value,
  subtext,
}: StatCardProps) => {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <p className="text-sm text-[#6B7280]">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-[#15243B]">
        {value}
      </p>

      <p className="mt-1 text-xs text-[#6B7280]">
        {subtext}
      </p>
    </div>
  );
};


// ============================================
// MAIN COMPONENT
// ============================================

const Classes = () => {
  const dispatch = useAppDispatch();


  // ============================================
  // REDUX
  // ============================================

  const {
    classes,
    selectedClass,
    loading,
    error,
  } = useAppSelector(
    (state) => state.classes
  );


  const {
    sessions,
  } = useAppSelector(
    (state) => state.sessions
  );


  // ============================================
  // FILTERS
  // ============================================

  const [searchQuery, setSearchQuery] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [sessionFilter, setSessionFilter] =
    useState("ALL");


  // ============================================
  // PAGINATION
  // ============================================

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 6;


  // ============================================
  // MODALS
  // ============================================

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [showDetailsModal, setShowDetailsModal] =
    useState(false);


  // ============================================
  // FORM
  // ============================================

  const [formData, setFormData] =
    useState<ClassFormState>(
      initialFormState
    );


  // ============================================
  // ACTION STATE
  // ============================================

  const [submitting, setSubmitting] =
    useState(false);

  const [
    statusActionId,
    setStatusActionId,
  ] = useState<string | null>(null);

  const [activeMenu, setActiveMenu] =
    useState<string | null>(null);

  const [toastMessage, setToastMessage] =
    useState<string | null>(null);


  // ============================================
  // INITIAL DATA
  // ============================================

  useEffect(() => {
    dispatch(
      getClasses(undefined)
    );

    dispatch(
      getSessions()
    );
  }, [dispatch]);


  // ============================================
  // CLEAR ERROR ON UNMOUNT
  // ============================================

  useEffect(() => {
    return () => {
      dispatch(
        clearClassError()
      );

      dispatch(
        clearSelectedClass()
      );
    };
  }, [dispatch]);


  // ============================================
  // ERROR TOAST
  // ============================================

  useEffect(() => {
    if (error) {
      showToast(error);
    }
  }, [error]);


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
  // GET SESSION NAME
  // ============================================

  const getSessionName = (
    sessionId: string
  ) => {
    const session =
      sessions.find(
        (item) =>
          item._id === sessionId
      );

    return session?.name || "-";
  };


  // ============================================
  // FORM CHANGE
  // ============================================

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
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
  // OPEN CREATE
  // ============================================

  const openCreateModal = () => {
    const currentSession =
      sessions.find(
        (session) =>
          session.isCurrent
      );

    setFormData({
      sessionId:
        currentSession?._id ||
        sessions[0]?._id ||
        "",

      name: "",
      order: "",
    });

    dispatch(
      clearClassError()
    );

    setShowAddModal(true);
  };


  const closeCreateModal = () => {
    setShowAddModal(false);

    setFormData(
      initialFormState
    );
  };


  // ============================================
  // CREATE CLASS
  // POST /academic/classes
  // ============================================

  const handleCreateClass = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!formData.sessionId) {
      showToast(
        "Academic session is required"
      );

      return;
    }

    if (!formData.name.trim()) {
      showToast(
        "Class name is required"
      );

      return;
    }


    const payload: CreateClassPayload = {
      sessionId:
        formData.sessionId,

      name:
        formData.name.trim(),

      ...(formData.order !== ""
        ? {
            order: Number(
              formData.order
            ),
          }
        : {}),
    };


    try {
      setSubmitting(true);

      await dispatch(
        createClass(payload)
      ).unwrap();

      showToast(
        "Class created successfully"
      );

      closeCreateModal();

      await dispatch(
        getClasses(undefined)
      ).unwrap();
    } catch (err) {
      showToast(
        typeof err === "string"
          ? err
          : "Failed to create class"
      );
    } finally {
      setSubmitting(false);
    }
  };


  // ============================================
  // VIEW CLASS
  // GET /academic/classes/:classId
  // ============================================

  const handleViewClass = async (
    classId: string
  ) => {
    try {
      setActiveMenu(null);

      dispatch(
        clearSelectedClass()
      );

      await dispatch(
        getClassById(classId)
      ).unwrap();

      setShowDetailsModal(true);
    } catch (err) {
      showToast(
        typeof err === "string"
          ? err
          : "Failed to fetch class"
      );
    }
  };


  const closeDetailsModal = () => {
    setShowDetailsModal(false);

    dispatch(
      clearSelectedClass()
    );
  };


  // ============================================
  // OPEN EDIT
  // GET CLASS BY ID FIRST
  // ============================================

  const handleOpenEdit = async (
    classId: string
  ) => {
    try {
      setActiveMenu(null);

      dispatch(
        clearSelectedClass()
      );

      const classData =
        await dispatch(
          getClassById(classId)
        ).unwrap();

      setFormData({
        sessionId:
          classData.sessionId,

        name:
          classData.name,

        order:
          classData.order !==
          undefined
            ? String(
                classData.order
              )
            : "",
      });

      setShowEditModal(true);
    } catch (err) {
      showToast(
        typeof err === "string"
          ? err
          : "Failed to fetch class"
      );
    }
  };


  const closeEditModal = () => {
    setShowEditModal(false);

    setFormData(
      initialFormState
    );

    dispatch(
      clearSelectedClass()
    );
  };


  // ============================================
  // UPDATE CLASS
  // PUT /academic/classes/:classId
  // ============================================

  const handleUpdateClass = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!selectedClass?._id) {
      showToast(
        "Class not selected"
      );

      return;
    }

    if (!formData.name.trim()) {
      showToast(
        "Class name is required"
      );

      return;
    }


    const data: UpdateClassPayload = {
      name:
        formData.name.trim(),

      ...(formData.order !== ""
        ? {
            order: Number(
              formData.order
            ),
          }
        : {}),
    };


    try {
      setSubmitting(true);

      await dispatch(
        updateClass({
          classId:
            selectedClass._id,

          data,
        })
      ).unwrap();

      showToast(
        "Class updated successfully"
      );

      closeEditModal();

      await dispatch(
        getClasses(undefined)
      ).unwrap();
    } catch (err) {
      showToast(
        typeof err === "string"
          ? err
          : "Failed to update class"
      );
    } finally {
      setSubmitting(false);
    }
  };


  // ============================================
  // UPDATE CLASS STATUS
  // PATCH /academic/classes/:classId/status
  // ============================================

  const handleToggleStatus = async (
    classData: ClassData
  ) => {
    try {
      setActiveMenu(null);

      setStatusActionId(
        classData._id
      );

      await dispatch(
        updateClassStatus({
          classId:
            classData._id,

          isActive:
            !classData.isActive,
        })
      ).unwrap();

      showToast(
        classData.isActive
          ? "Class marked inactive"
          : "Class marked active"
      );
    } catch (err) {
      showToast(
        typeof err === "string"
          ? err
          : "Failed to update class status"
      );
    } finally {
      setStatusActionId(null);
    }
  };


  // ============================================
  // FILTER
  // ============================================

  const filteredClasses =
    useMemo(() => {
      const search =
        searchQuery
          .trim()
          .toLowerCase();

      return classes.filter(
        (classData) => {
          const sessionName =
            getSessionName(
              classData.sessionId
            )
              .toLowerCase();


          const matchesSearch =
            classData.name
              .toLowerCase()
              .includes(search) ||
            sessionName.includes(
              search
            );


          const matchesStatus =
            statusFilter === "ALL" ||
            (
              statusFilter ===
                "ACTIVE" &&
              classData.isActive
            ) ||
            (
              statusFilter ===
                "INACTIVE" &&
              !classData.isActive
            );


          const matchesSession =
            sessionFilter === "ALL" ||
            classData.sessionId ===
              sessionFilter;


          return (
            matchesSearch &&
            matchesStatus &&
            matchesSession
          );
        }
      );
    }, [
      classes,
      sessions,
      searchQuery,
      statusFilter,
      sessionFilter,
    ]);


  // ============================================
  // PAGINATION
  // ============================================

  const totalPages =
    Math.ceil(
      filteredClasses.length /
        itemsPerPage
    );


  const paginatedClasses =
    filteredClasses.slice(
      (currentPage - 1) *
        itemsPerPage,

      currentPage *
        itemsPerPage
    );


  useEffect(() => {
    if (
      currentPage >
        totalPages &&
      totalPages > 0
    ) {
      setCurrentPage(
        totalPages
      );
    }
  }, [
    currentPage,
    totalPages,
  ]);


  // ============================================
  // STATS
  // ============================================

  const totalClasses =
    classes.length;


  const activeClasses =
    classes.filter(
      (item) =>
        item.isActive
    ).length;


  const inactiveClasses =
    classes.filter(
      (item) =>
        !item.isActive
    ).length;


  // ============================================
  // RESET FILTER
  // ============================================

  const resetFilters = () => {
    setSearchQuery("");

    setStatusFilter("ALL");

    setSessionFilter("ALL");

    setCurrentPage(1);
  };


  // ============================================
  // INITIAL LOADING
  // ============================================

  if (
    loading &&
    classes.length === 0
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F9FC]">

        <div className="text-center">

          <Icon
            icon="lucide:loader-circle"
            className="mx-auto animate-spin text-4xl text-[#1F5FAE]"
          />

          <p className="mt-3 text-sm text-[#6B7280]">
            Loading classes...
          </p>

        </div>

      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#F7F9FC]">

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


      <main className="p-5 lg:p-8">

        {/* ========================================
            HEADER
        ======================================== */}

        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

          <div>

            <div className="flex items-center gap-2 text-sm text-[#6B7280]">

              <span>
                Academics
              </span>

              <Icon
                icon="lucide:chevron-right"
              />

              <span className="font-semibold text-[#15243B]">
                Classes
              </span>

            </div>


            <h1 className="mt-2 text-2xl font-bold text-[#15243B]">
              Classes
            </h1>


            <p className="mt-1 text-sm text-[#6B7280]">
              Manage classes for each academic session.
            </p>

          </div>


          <button
            onClick={
              openCreateModal
            }
            disabled={
              sessions.length === 0
            }
            className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#1F5FAE] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#174E91] disabled:cursor-not-allowed disabled:opacity-50"
          >

            <Icon
              icon="lucide:plus"
              className="text-lg"
            />

            Add Class

          </button>

        </div>


        {sessions.length === 0 && (
          <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Create an Academic Session before creating classes.
          </div>
        )}


        {/* ========================================
            ERROR
        ======================================== */}

        {error && (
          <div className="mt-5 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

            <span>
              {error}
            </span>

            <button
              onClick={() =>
                dispatch(
                  clearClassError()
                )
              }
            >
              <Icon
                icon="lucide:x"
              />
            </button>

          </div>
        )}


        {/* ========================================
            STATS
        ======================================== */}

        <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-3">

          <StatCard
            title="Total Classes"
            value={totalClasses}
            subtext="All academic classes"
          />

          <StatCard
            title="Active Classes"
            value={activeClasses}
            subtext="Currently active classes"
          />

          <StatCard
            title="Inactive Classes"
            value={inactiveClasses}
            subtext="Currently inactive classes"
          />

        </div>


        {/* ========================================
            TABLE CARD
        ======================================== */}

        <div className="mt-6 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">

          {/* FILTERS */}

          <div className="flex flex-col gap-3 border-b border-[#E5E7EB] p-5 lg:flex-row">

            <div className="flex min-h-11 flex-1 items-center gap-2 rounded-lg border border-[#D1D5DB] bg-white px-3">

              <Icon
                icon="lucide:search"
                className="text-[#6B7280]"
              />

              <input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(
                    e.target.value
                  );

                  setCurrentPage(1);
                }}
                placeholder="Search class..."
                className="w-full bg-transparent text-sm text-[#15243B] outline-none"
              />

            </div>


            <select
              value={sessionFilter}
              onChange={(e) => {
                setSessionFilter(
                  e.target.value
                );

                setCurrentPage(1);
              }}
              className="min-h-11 rounded-lg border border-[#D1D5DB] bg-white px-4 text-sm text-[#15243B]"
            >

              <option value="ALL">
                All Academic Sessions
              </option>

              {sessions.map(
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
                      ? " (Current)"
                      : ""}
                  </option>
                )
              )}

            </select>


            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(
                  e.target.value
                );

                setCurrentPage(1);
              }}
              className="min-h-11 rounded-lg border border-[#D1D5DB] bg-white px-4 text-sm text-[#15243B]"
            >

              <option value="ALL">
                Status: All
              </option>

              <option value="ACTIVE">
                Active
              </option>

              <option value="INACTIVE">
                Inactive
              </option>

            </select>


            <button
              onClick={
                resetFilters
              }
              className="min-h-11 rounded-lg border border-[#D1D5DB] bg-white px-5 text-sm font-medium text-[#15243B] hover:bg-[#F9FAFB]"
            >
              Reset
            </button>

          </div>


          {/* ========================================
              TABLE
          ======================================== */}

          <div className="overflow-x-auto">

            <table className="w-full min-w-[800px] text-left text-sm">

              <thead className="bg-[#F9FAFB] text-xs uppercase text-[#6B7280]">

                <tr>

                  <th className="px-5 py-4 font-semibold">
                    Class Name
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Order
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Academic Session
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Status
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Created
                  </th>

                  <th className="px-5 py-4 text-right font-semibold">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-[#E5E7EB]">

                {paginatedClasses.map(
                  (classData) => (
                    <tr
                      key={
                        classData._id
                      }
                      className="transition-colors hover:bg-[#F9FAFB]"
                    >

                      <td className="px-5 py-4 font-semibold text-[#15243B]">
                        {classData.name}
                      </td>


                      <td className="px-5 py-4 text-[#6B7280]">
                        {classData.order ??
                          "-"}
                      </td>


                      <td className="px-5 py-4 text-[#6B7280]">
                        {getSessionName(
                          classData.sessionId
                        )}
                      </td>


                      <td className="px-5 py-4">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            classData.isActive
                              ? "bg-emerald-500/10 text-emerald-600"
                              : "bg-slate-500/10 text-slate-600"
                          }`}
                        >
                          {classData.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>

                      </td>


                      <td className="px-5 py-4 text-[#6B7280]">
                        {new Date(
                          classData.createdAt
                        ).toLocaleDateString(
                          "en-IN"
                        )}
                      </td>


                      <td className="relative px-5 py-4 text-right">

                        <div className="flex justify-end gap-1">

                          {/* VIEW */}

                          <button
                            onClick={() =>
                              handleViewClass(
                                classData._id
                              )
                            }
                            className="rounded-lg p-2 text-[#1F5FAE] hover:bg-[#E8F0FB]"
                            title="View"
                          >
                            <Icon
                              icon="lucide:eye"
                              className="text-lg"
                            />
                          </button>


                          {/* EDIT */}

                          <button
                            onClick={() =>
                              handleOpenEdit(
                                classData._id
                              )
                            }
                            className="rounded-lg p-2 text-amber-600 hover:bg-amber-50"
                            title="Edit"
                          >
                            <Icon
                              icon="lucide:pencil"
                              className="text-lg"
                            />
                          </button>


                          {/* MORE */}

                          <div className="relative">

                            <button
                              onClick={() =>
                                setActiveMenu(
                                  activeMenu ===
                                    classData._id
                                    ? null
                                    : classData._id
                                )
                              }
                              className="rounded-lg p-2 text-[#6B7280] hover:bg-[#F9FAFB]"
                            >
                              <Icon
                                icon="lucide:more-horizontal"
                                className="text-lg"
                              />
                            </button>


                            {activeMenu ===
                              classData._id && (
                              <div className="absolute right-0 top-10 z-40 w-48 rounded-lg border border-[#E5E7EB] bg-white py-1 shadow-lg">

                                <button
                                  onClick={() =>
                                    handleToggleStatus(
                                      classData
                                    )
                                  }
                                  disabled={
                                    statusActionId ===
                                    classData._id
                                  }
                                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-xs text-[#15243B] hover:bg-[#F9FAFB] disabled:opacity-50"
                                >

                                  <Icon
                                    icon={
                                      classData.isActive
                                        ? "lucide:circle-off"
                                        : "lucide:circle-check"
                                    }
                                  />

                                  {statusActionId ===
                                  classData._id
                                    ? "Updating..."
                                    : classData.isActive
                                      ? "Make Inactive"
                                      : "Make Active"}

                                </button>

                              </div>
                            )}

                          </div>

                        </div>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>


            {paginatedClasses.length ===
              0 && (
              <div className="p-12 text-center">

                <Icon
                  icon="lucide:inbox"
                  className="mx-auto text-4xl text-[#9CA3AF]"
                />

                <h3 className="mt-3 font-semibold text-[#15243B]">
                  No classes found
                </h3>

                <p className="mt-1 text-sm text-[#6B7280]">
                  Change filters or create a new class.
                </p>

              </div>
            )}

          </div>


          {/* ========================================
              PAGINATION
          ======================================== */}

          <div className="flex flex-col gap-3 border-t border-[#E5E7EB] p-4 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-sm text-[#6B7280]">

              Showing{" "}

              {filteredClasses.length ===
              0
                ? 0
                : (currentPage -
                    1) *
                    itemsPerPage +
                  1}

              {" - "}

              {Math.min(
                currentPage *
                  itemsPerPage,

                filteredClasses.length
              )}

              {" of "}

              {filteredClasses.length}

              {" classes"}

            </p>


            <div className="flex gap-2">

              <button
                disabled={
                  currentPage === 1
                }
                onClick={() =>
                  setCurrentPage(
                    (page) =>
                      page - 1
                  )
                }
                className="rounded-lg border border-[#D1D5DB] px-4 py-2 text-sm disabled:opacity-50"
              >
                Previous
              </button>


              <button
                disabled={
                  currentPage ===
                    totalPages ||
                  totalPages === 0
                }
                onClick={() =>
                  setCurrentPage(
                    (page) =>
                      page + 1
                  )
                }
                className="rounded-lg border border-[#D1D5DB] px-4 py-2 text-sm disabled:opacity-50"
              >
                Next
              </button>

            </div>

          </div>

        </div>

      </main>


      {/* ========================================
          CREATE MODAL
      ======================================== */}

      {showAddModal && (
        <ClassFormModal
          title="Add Class"
          submitLabel="Create Class"
          formData={formData}
          sessions={sessions}
          submitting={submitting}
          onChange={
            handleInputChange
          }
          onClose={
            closeCreateModal
          }
          onSubmit={
            handleCreateClass
          }
          allowSessionChange
        />
      )}


      {/* ========================================
          EDIT MODAL
      ======================================== */}

      {showEditModal && (
        <ClassFormModal
          title="Edit Class"
          submitLabel="Save Changes"
          formData={formData}
          sessions={sessions}
          submitting={submitting}
          onChange={
            handleInputChange
          }
          onClose={
            closeEditModal
          }
          onSubmit={
            handleUpdateClass
          }
          allowSessionChange={false}
        />
      )}


      {/* ========================================
          DETAILS MODAL
      ======================================== */}

      {showDetailsModal &&
        selectedClass && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

            <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">

              <div className="flex items-center justify-between border-b px-6 py-5">

                <h2 className="text-xl font-bold text-[#15243B]">
                  Class Details
                </h2>

                <button
                  onClick={
                    closeDetailsModal
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
                  label="Class Name"
                  value={
                    selectedClass.name
                  }
                />

                <DetailItem
                  label="Academic Session"
                  value={getSessionName(
                    selectedClass.sessionId
                  )}
                />

                <DetailItem
                  label="Order"
                  value={
                    selectedClass.order !==
                    undefined
                      ? String(
                          selectedClass.order
                        )
                      : "-"
                  }
                />

                <DetailItem
                  label="Status"
                  value={
                    selectedClass.isActive
                      ? "Active"
                      : "Inactive"
                  }
                />

                <DetailItem
                  label="Created"
                  value={new Date(
                    selectedClass.createdAt
                  ).toLocaleDateString(
                    "en-IN"
                  )}
                />

                <DetailItem
                  label="Updated"
                  value={new Date(
                    selectedClass.updatedAt
                  ).toLocaleDateString(
                    "en-IN"
                  )}
                />

              </div>


              <div className="flex justify-end border-t px-6 py-4">

                <button
                  onClick={
                    closeDetailsModal
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
// CLASS FORM MODAL
// ============================================

interface ClassFormModalProps {
  title: string;

  submitLabel: string;

  formData: ClassFormState;

  sessions: {
    _id: string;
    name: string;
    isCurrent: boolean;
  }[];

  submitting: boolean;

  allowSessionChange: boolean;

  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => void;

  onClose: () => void;

  onSubmit: (
    e: React.FormEvent
  ) => void;
}


const ClassFormModal = ({
  title,
  submitLabel,
  formData,
  sessions,
  submitting,
  allowSessionChange,
  onChange,
  onClose,
  onSubmit,
}: ClassFormModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">

        <div className="flex items-center justify-between border-b px-6 py-5">

          <h2 className="text-xl font-bold text-[#15243B]">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
          >
            <Icon
              icon="lucide:x"
              className="text-xl text-[#6B7280]"
            />
          </button>

        </div>


        <form
          onSubmit={onSubmit}
        >

          <div className="space-y-5 p-6">

            {/* SESSION */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-[#15243B]">
                Academic Session *
              </label>

              <select
                name="sessionId"
                value={
                  formData.sessionId
                }
                onChange={onChange}
                disabled={
                  !allowSessionChange
                }
                className="min-h-11 w-full rounded-lg border border-[#D1D5DB] px-3 text-sm disabled:bg-gray-100"
              >

                <option value="">
                  Select Academic Session
                </option>

                {sessions.map(
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
                        ? " (Current)"
                        : ""}
                    </option>
                  )
                )}

              </select>

            </div>


            {/* NAME */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-[#15243B]">
                Class Name *
              </label>

              <input
                type="text"
                name="name"
                value={
                  formData.name
                }
                onChange={onChange}
                placeholder="Example: Class 10"
                className="min-h-11 w-full rounded-lg border border-[#D1D5DB] px-3 text-sm outline-none focus:border-[#1F5FAE]"
              />

            </div>


            {/* ORDER */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-[#15243B]">
                Order
              </label>

              <input
                type="number"
                name="order"
                value={
                  formData.order
                }
                onChange={onChange}
                placeholder="Example: 10"
                min="0"
                className="min-h-11 w-full rounded-lg border border-[#D1D5DB] px-3 text-sm outline-none focus:border-[#1F5FAE]"
              />

              <p className="mt-1 text-xs text-[#6B7280]">
                Used to sort classes in the correct order.
              </p>

            </div>

          </div>


          <div className="flex justify-end gap-3 border-t px-6 py-4">

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#D1D5DB] px-5 py-2.5 text-sm font-semibold text-[#15243B]"
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-[#1F5FAE] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >

              {submitting && (
                <Icon
                  icon="lucide:loader-circle"
                  className="animate-spin"
                />
              )}

              {submitLabel}

            </button>

          </div>

        </form>

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


export default Classes;