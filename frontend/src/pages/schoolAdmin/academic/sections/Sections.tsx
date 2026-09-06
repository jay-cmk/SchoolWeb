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
  createSection,
  getSections,
  getSectionById,
  updateSection,
  updateSectionStatus,
  clearSectionError,
  clearSelectedSection,
} from "../../../../features/academic/sections/section.slice";

import {
  getSessions,
} from "../../../../features/academic/sessions/session.slice";

import {
  getClasses,
} from "../../../../features/academic/classes/class.slice";

import type {
  SectionData,
  CreateSectionPayload,
  UpdateSectionPayload,
} from "../../../../features/academic/sections/section.types";


// ============================================
// FORM TYPE
// ============================================

interface SectionFormState {
  sessionId: string;
  classId: string;
  name: string;
  roomNumber: string;
  capacity: string;
}


// ============================================
// INITIAL FORM
// ============================================

const initialFormState: SectionFormState = {
  sessionId: "",
  classId: "",
  name: "",
  roomNumber: "",
  capacity: "",
};


// ============================================
// STAT CARD
// ============================================

interface StatCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: string;
}


const StatCard = ({
  title,
  value,
  subtext,
  icon,
}: StatCardProps) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <Icon
            icon={icon}
            className="text-xl"
          />
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        {subtext}
      </p>
    </div>
  );
};


// ============================================
// MAIN COMPONENT
// ============================================

const Sections = () => {
  const dispatch = useAppDispatch();

  // ============================================
  // REDUX
  // ============================================

  const {
    sections,
    selectedSection,
    loading,
    error,
  } = useAppSelector(
    (state) => state.sections
  );

  const {
    sessions,
  } = useAppSelector(
    (state) => state.sessions
  );

  const {
    classes,
  } = useAppSelector(
    (state) => state.classes
  );

  // ============================================
  // GLOBAL SELECTED SESSION
  // ============================================

  const selectedSessionId =
    useAppSelector(
      (state) =>
        state.sessionSelection
          .selectedSessionId
    );


  // ============================================
  // FILTERS
  // ============================================

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  const [
    classFilter,
    setClassFilter,
  ] = useState("ALL");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState<
    "ALL" | "ACTIVE" | "INACTIVE"
  >("ALL");


  // ============================================
  // PAGINATION
  // ============================================

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const itemsPerPage = 6;


  // ============================================
  // MODALS
  // ============================================

  const [
    showCreateModal,
    setShowCreateModal,
  ] = useState(false);

  const [
    showEditModal,
    setShowEditModal,
  ] = useState(false);

  const [
    showDetailsModal,
    setShowDetailsModal,
  ] = useState(false);


  // ============================================
  // FORM
  // ============================================

  const [
    formData,
    setFormData,
  ] = useState<SectionFormState>(
    initialFormState
  );


  // ============================================
  // ACTION STATE
  // ============================================

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    statusActionId,
    setStatusActionId,
  ] = useState<string | null>(
    null
  );

  const [
    activeMenu,
    setActiveMenu,
  ] = useState<string | null>(
    null
  );

  const [
    toastMessage,
    setToastMessage,
  ] = useState<string | null>(
    null
  );


  // ============================================
  // LOAD ACADEMIC SESSIONS
  // ============================================

  useEffect(() => {
    if (sessions.length === 0) {
      dispatch(getSessions());
    }
  }, [
    dispatch,
    sessions.length,
  ]);


  // ============================================
  // LOAD DATA FOR GLOBAL SELECTED SESSION
  // ============================================

  useEffect(() => {
    if (!selectedSessionId) {
      return;
    }

    // Selected session ki classes
    dispatch(
      getClasses({
        sessionId:
          selectedSessionId,
      })
    );

    // Selected session ke sections
    dispatch(
      getSections({
        sessionId:
          selectedSessionId,
      })
    );

    // Session change hone par
    // old class filter clear
    setClassFilter("ALL");

    // Pagination reset
    setCurrentPage(1);

    // Open modals close
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDetailsModal(false);

    setFormData(
      initialFormState
    );

    dispatch(
      clearSelectedSection()
    );
  }, [
    dispatch,
    selectedSessionId,
  ]);


  // ============================================
  // CLEANUP
  // ============================================

  useEffect(() => {
    return () => {
      dispatch(
        clearSectionError()
      );

      dispatch(
        clearSelectedSection()
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

    window.setTimeout(
      () => {
        setToastMessage(null);
      },
      3000
    );
  };


  // ============================================
  // SELECTED SESSION
  // ============================================

  const selectedSession =
    useMemo(() => {
      if (!selectedSessionId) {
        return null;
      }

      return (
        sessions.find(
          (session) =>
            session._id ===
            selectedSessionId
        ) ?? null
      );
    }, [
      sessions,
      selectedSessionId,
    ]);


  // ============================================
  // GET SESSION NAME
  // ============================================

  const getSessionName = (
    sessionId: string
  ) => {
    const session =
      sessions.find(
        (item) =>
          item._id ===
          sessionId
      );

    return session?.name || "-";
  };


  // ============================================
  // GET CLASS NAME
  // ============================================

  const getClassName = (
    classId: string
  ) => {
    const classData =
      classes.find(
        (item) =>
          item._id ===
          classId
      );

    return classData?.name || "-";
  };


  // ============================================
  // AVAILABLE CLASSES
  // ============================================

  const availableClasses =
    useMemo(() => {
      if (!selectedSessionId) {
        return [];
      }

      return classes.filter(
        (classData) =>
          classData.sessionId ===
          selectedSessionId
      );
    }, [
      classes,
      selectedSessionId,
    ]);


  // ============================================
  // INPUT CHANGE
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

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };


  // ============================================
  // OPEN CREATE MODAL
  // ============================================

  const openCreateModal = () => {
    if (!selectedSessionId) {
      showToast(
        "Please select an academic session first"
      );

      return;
    }

    if (
      availableClasses.length ===
      0
    ) {
      showToast(
        "Create a class in the selected academic session first"
      );

      return;
    }

    setFormData({
      ...initialFormState,

      sessionId:
        selectedSessionId,
    });

    dispatch(
      clearSectionError()
    );

    setShowCreateModal(true);
  };


  const closeCreateModal = () => {
    setShowCreateModal(false);

    setFormData(
      initialFormState
    );
  };


  // ============================================
  // CREATE SECTION
  // POST /academic/sections
  // ============================================

  const handleCreateSection =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      if (!selectedSessionId) {
        showToast(
          "Academic session is required"
        );

        return;
      }

      if (
        formData.sessionId !==
        selectedSessionId
      ) {
        showToast(
          "Selected academic session does not match"
        );

        return;
      }

      if (!formData.classId) {
        showToast(
          "Class is required"
        );

        return;
      }

      const selectedClass =
        availableClasses.find(
          (classData) =>
            classData._id ===
            formData.classId
        );

      if (!selectedClass) {
        showToast(
          "Selected class does not belong to this academic session"
        );

        return;
      }

      if (!formData.name.trim()) {
        showToast(
          "Section name is required"
        );

        return;
      }

      if (
        formData.capacity &&
        Number(
          formData.capacity
        ) < 1
      ) {
        showToast(
          "Capacity must be greater than 0"
        );

        return;
      }

      const payload:
        CreateSectionPayload =
        {
          sessionId:
            selectedSessionId,

          classId:
            formData.classId,

          name:
            formData.name.trim(),

          ...(formData.roomNumber
            .trim()
            ? {
                roomNumber:
                  formData.roomNumber
                    .trim(),
              }
            : {}),

          ...(formData.capacity
            ? {
                capacity:
                  Number(
                    formData.capacity
                  ),
              }
            : {}),
        };

      try {
        setSubmitting(true);

        await dispatch(
          createSection(
            payload
          )
        ).unwrap();

        showToast(
          "Section created successfully"
        );

        closeCreateModal();

        await dispatch(
          getSections({
            sessionId:
              selectedSessionId,
          })
        ).unwrap();

      } catch (err) {
        showToast(
          typeof err === "string"
            ? err
            : "Failed to create section"
        );
      } finally {
        setSubmitting(false);
      }
    };


  // ============================================
  // VIEW SECTION
  // ============================================

  const handleViewSection =
    async (
      sectionId: string
    ) => {
      try {
        setActiveMenu(null);

        dispatch(
          clearSelectedSection()
        );

        await dispatch(
          getSectionById(
            sectionId
          )
        ).unwrap();

        setShowDetailsModal(
          true
        );

      } catch (err) {
        showToast(
          typeof err === "string"
            ? err
            : "Failed to fetch section"
        );
      }
    };


  const closeDetailsModal =
    () => {
      setShowDetailsModal(
        false
      );

      dispatch(
        clearSelectedSection()
      );
    };


  // ============================================
  // OPEN EDIT
  // ============================================

  const handleOpenEdit =
    async (
      sectionId: string
    ) => {
      try {
        setActiveMenu(null);

        dispatch(
          clearSelectedSection()
        );

        const section =
          await dispatch(
            getSectionById(
              sectionId
            )
          ).unwrap();

        setFormData({
          sessionId:
            section.sessionId,

          classId:
            section.classId,

          name:
            section.name,

          roomNumber:
            section.roomNumber ||
            "",

          capacity:
            section.capacity !==
            undefined
              ? String(
                  section.capacity
                )
              : "",
        });

        setShowEditModal(
          true
        );

      } catch (err) {
        showToast(
          typeof err === "string"
            ? err
            : "Failed to fetch section"
        );
      }
    };


  const closeEditModal =
    () => {
      setShowEditModal(
        false
      );

      setFormData(
        initialFormState
      );

      dispatch(
        clearSelectedSection()
      );
    };


  // ============================================
  // UPDATE SECTION
  // ============================================

  const handleUpdateSection =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      if (
        !selectedSection?._id
      ) {
        showToast(
          "Section not selected"
        );

        return;
      }

      if (
        selectedSessionId &&
        selectedSection.sessionId !==
          selectedSessionId
      ) {
        showToast(
          "This section does not belong to the selected academic session"
        );

        return;
      }

      if (!formData.name.trim()) {
        showToast(
          "Section name is required"
        );

        return;
      }

      if (
        formData.capacity &&
        Number(
          formData.capacity
        ) < 1
      ) {
        showToast(
          "Capacity must be greater than 0"
        );

        return;
      }

      const data:
        UpdateSectionPayload =
        {
          name:
            formData.name.trim(),

          roomNumber:
            formData.roomNumber
              .trim(),

          ...(formData.capacity
            ? {
                capacity:
                  Number(
                    formData.capacity
                  ),
              }
            : {}),
        };

      try {
        setSubmitting(true);

        await dispatch(
          updateSection({
            sectionId:
              selectedSection._id,

            data,
          })
        ).unwrap();

        showToast(
          "Section updated successfully"
        );

        closeEditModal();

        if (selectedSessionId) {
          await dispatch(
            getSections({
              sessionId:
                selectedSessionId,
            })
          ).unwrap();
        }

      } catch (err) {
        showToast(
          typeof err === "string"
            ? err
            : "Failed to update section"
        );
      } finally {
        setSubmitting(false);
      }
    };


  // ============================================
  // UPDATE STATUS
  // ============================================

  const handleToggleStatus =
    async (
      section: SectionData
    ) => {
      try {
        setActiveMenu(null);

        setStatusActionId(
          section._id
        );

        await dispatch(
          updateSectionStatus({
            sectionId:
              section._id,

            isActive:
              !section.isActive,
          })
        ).unwrap();

        showToast(
          section.isActive
            ? "Section marked inactive"
            : "Section marked active"
        );

      } catch (err) {
        showToast(
          typeof err === "string"
            ? err
            : "Failed to update section status"
        );
      } finally {
        setStatusActionId(
          null
        );
      }
    };


  // ============================================
  // FILTER DATA
  // ============================================

  const filteredSections =
    useMemo(() => {
      const search =
        searchQuery
          .trim()
          .toLowerCase();

      return sections.filter(
        (section) => {
          /*
           * API already selectedSessionId
           * se filtered data la rahi hai.
           *
           * Ye extra check defensive hai.
           */
          const matchesSelectedSession =
            !selectedSessionId ||
            section.sessionId ===
              selectedSessionId;

          const className =
            getClassName(
              section.classId
            ).toLowerCase();

          const sessionName =
            getSessionName(
              section.sessionId
            ).toLowerCase();

          const matchesSearch =
            section.name
              .toLowerCase()
              .includes(search) ||

            (
              section.roomNumber ||
              ""
            )
              .toLowerCase()
              .includes(search) ||

            className.includes(
              search
            ) ||

            sessionName.includes(
              search
            );

          const matchesClass =
            classFilter ===
              "ALL" ||
            section.classId ===
              classFilter;

          const matchesStatus =
            statusFilter ===
              "ALL" ||

            (
              statusFilter ===
                "ACTIVE" &&
              section.isActive
            ) ||

            (
              statusFilter ===
                "INACTIVE" &&
              !section.isActive
            );

          return (
            matchesSelectedSession &&
            matchesSearch &&
            matchesClass &&
            matchesStatus
          );
        }
      );
    }, [
      sections,
      sessions,
      classes,
      selectedSessionId,
      searchQuery,
      classFilter,
      statusFilter,
    ]);


  // ============================================
  // PAGINATION
  // ============================================

  const totalPages =
    Math.ceil(
      filteredSections.length /
        itemsPerPage
    );

  const paginatedSections =
    filteredSections.slice(
      (currentPage - 1) *
        itemsPerPage,

      currentPage *
        itemsPerPage
    );


  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    classFilter,
    statusFilter,
    selectedSessionId,
  ]);


  // ============================================
  // STATS
  // ============================================

  const sessionSections =
    useMemo(() => {
      if (!selectedSessionId) {
        return [];
      }

      return sections.filter(
        (section) =>
          section.sessionId ===
          selectedSessionId
      );
    }, [
      sections,
      selectedSessionId,
    ]);


  const totalSections =
    sessionSections.length;


  const activeSections =
    sessionSections.filter(
      (section) =>
        section.isActive
    ).length;


  const inactiveSections =
    sessionSections.filter(
      (section) =>
        !section.isActive
    ).length;


  const totalCapacity =
    sessionSections.reduce(
      (
        total,
        section
      ) =>
        total +
        (
          section.capacity ||
          0
        ),
      0
    );


  // ============================================
  // RESET FILTERS
  // ============================================

  const resetFilters = () => {
    setSearchQuery("");

    setClassFilter("ALL");

    setStatusFilter("ALL");

    setCurrentPage(1);
  };


  // ============================================
  // EXPORT CSV
  // ============================================

  const handleExport = () => {
    if (
      filteredSections.length ===
      0
    ) {
      showToast(
        "No sections to export"
      );

      return;
    }

    const headers = [
      "Section",
      "Class",
      "Academic Session",
      "Room Number",
      "Capacity",
      "Status",
    ];

    const rows =
      filteredSections.map(
        (section) => [
          section.name,

          getClassName(
            section.classId
          ),

          getSessionName(
            section.sessionId
          ),

          section.roomNumber ||
            "",

          section.capacity ??
            "",

          section.isActive
            ? "Active"
            : "Inactive",
        ]
      );

    const csv =
      [
        headers,
        ...rows,
      ]
        .map(
          (row) =>
            row
              .map(
                (item) =>
                  `"${String(
                    item
                  ).replace(
                    /"/g,
                    '""'
                  )}"`
              )
              .join(",")
        )
        .join("\n");

    const blob =
      new Blob(
        [csv],
        {
          type:
            "text/csv;charset=utf-8;",
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      selectedSession
        ? `sections-${selectedSession.name}.csv`
        : "sections.csv";

    link.click();

    URL.revokeObjectURL(
      url
    );
  };


  // ============================================
  // LOADING
  // ============================================

  if (
    loading &&
    sections.length === 0 &&
    selectedSessionId
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Icon
            icon="lucide:loader-2"
            className="mx-auto animate-spin text-4xl text-blue-600"
          />

          <p className="mt-3 text-sm text-gray-500">
            Loading sections...
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 p-5 lg:p-8">

      {/* ========================================
          TOAST
      ======================================== */}

      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[100] flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-white shadow-xl">
          <Icon
            icon="lucide:info"
            className="text-lg text-green-400"
          />

          <span className="text-sm font-medium">
            {toastMessage}
          </span>
        </div>
      )}


      {/* ========================================
          HEADER
      ======================================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>
              Academics
            </span>

            <Icon
              icon="lucide:chevron-right"
            />

            <span className="font-semibold text-gray-900">
              Sections
            </span>
          </div>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Sections
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage class sections, rooms and student capacity.
          </p>

          {selectedSession && (
            <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
              <Icon icon="lucide:calendar-range" />

              Academic Session:
              {" "}
              {selectedSession.name}
            </div>
          )}
        </div>


        <button
          onClick={
            openCreateModal
          }
          disabled={
            !selectedSessionId ||
            availableClasses.length ===
              0
          }
          className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon
            icon="lucide:plus"
            className="text-lg"
          />

          Add Section
        </button>
      </div>


      {/* ========================================
          MISSING DEPENDENCY
      ======================================== */}

      {!selectedSessionId && (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          Select an Academic Session from the topbar first.
        </div>
      )}


      {selectedSessionId &&
        availableClasses.length ===
          0 && (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
            No classes exist in{" "}
            <strong>
              {selectedSession?.name ||
                "the selected academic session"}
            </strong>
            . Create a Class before creating sections.
          </div>
        )}


      {/* ========================================
          ERROR
      ======================================== */}

      {error && (
        <div className="mt-5 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <span>
            {error}
          </span>

          <button
            onClick={() =>
              dispatch(
                clearSectionError()
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

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Sections"
          value={
            totalSections
          }
          subtext={
            selectedSession
              ? `${selectedSession.name} sections`
              : "Selected session sections"
          }
          icon="lucide:layers"
        />

        <StatCard
          title="Active Sections"
          value={
            activeSections
          }
          subtext="Currently active"
          icon="lucide:circle-check"
        />

        <StatCard
          title="Inactive Sections"
          value={
            inactiveSections
          }
          subtext="Currently inactive"
          icon="lucide:circle-off"
        />

        <StatCard
          title="Total Capacity"
          value={
            totalCapacity
          }
          subtext="Combined student capacity"
          icon="lucide:users"
        />
      </div>


      {/* ========================================
          MAIN TABLE CARD
      ======================================== */}

      <section className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        {/* FILTERS */}

        <div className="border-b border-gray-200 p-5">
          <div className="flex flex-col gap-3 xl:flex-row">

            {/* SEARCH */}

            <div className="relative flex-1">
              <Icon
                icon="lucide:search"
                className="absolute left-3 top-3.5 text-gray-400"
              />

              <input
                type="text"
                value={
                  searchQuery
                }
                onChange={(e) =>
                  setSearchQuery(
                    e.target.value
                  )
                }
                placeholder="Search section, class or room..."
                className="min-h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm outline-none focus:border-blue-600"
              />
            </div>


            {/* CLASS */}

            <select
              value={
                classFilter
              }
              onChange={(e) =>
                setClassFilter(
                  e.target.value
                )
              }
              disabled={
                !selectedSessionId
              }
              className="min-h-11 rounded-lg border border-gray-300 bg-white px-4 text-sm outline-none focus:border-blue-600 disabled:bg-gray-100"
            >
              <option value="ALL">
                All Classes
              </option>

              {availableClasses.map(
                (classData) => (
                  <option
                    key={
                      classData._id
                    }
                    value={
                      classData._id
                    }
                  >
                    {classData.name}
                  </option>
                )
              )}
            </select>


            {/* STATUS */}

            <select
              value={
                statusFilter
              }
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as
                    | "ALL"
                    | "ACTIVE"
                    | "INACTIVE"
                )
              }
              className="min-h-11 rounded-lg border border-gray-300 bg-white px-4 text-sm outline-none focus:border-blue-600"
            >
              <option value="ALL">
                All Status
              </option>

              <option value="ACTIVE">
                Active
              </option>

              <option value="INACTIVE">
                Inactive
              </option>
            </select>


            {/* RESET */}

            <button
              onClick={
                resetFilters
              }
              className="min-h-11 rounded-lg border border-gray-300 px-4 text-sm font-medium hover:bg-gray-50"
            >
              Reset
            </button>


            {/* EXPORT */}

            <button
              onClick={
                handleExport
              }
              className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 text-sm font-medium hover:bg-gray-50"
            >
              <Icon
                icon="lucide:download"
              />

              Export
            </button>
          </div>
        </div>


        {/* ========================================
            TABLE
        ======================================== */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-4 font-semibold">
                  Section
                </th>

                <th className="px-5 py-4 font-semibold">
                  Class
                </th>

                <th className="px-5 py-4 font-semibold">
                  Academic Session
                </th>

                <th className="px-5 py-4 font-semibold">
                  Room Number
                </th>

                <th className="px-5 py-4 font-semibold">
                  Capacity
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


            <tbody className="divide-y divide-gray-200">
              {paginatedSections.map(
                (section) => (
                  <tr
                    key={
                      section._id
                    }
                    className="transition hover:bg-gray-50"
                  >

                    {/* SECTION */}

                    <td className="px-5 py-4">
                      <button
                        onClick={() =>
                          handleViewSection(
                            section._id
                          )
                        }
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        Section{" "}
                        {section.name}
                      </button>
                    </td>


                    {/* CLASS */}

                    <td className="px-5 py-4 font-medium text-gray-700">
                      {getClassName(
                        section.classId
                      )}
                    </td>


                    {/* SESSION */}

                    <td className="px-5 py-4 text-gray-600">
                      {getSessionName(
                        section.sessionId
                      )}
                    </td>


                    {/* ROOM */}

                    <td className="px-5 py-4 text-gray-600">
                      {section.roomNumber ||
                        "-"}
                    </td>


                    {/* CAPACITY */}

                    <td className="px-5 py-4 text-gray-600">
                      {section.capacity !==
                      undefined
                        ? section.capacity
                        : "-"}
                    </td>


                    {/* STATUS */}

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          section.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {section.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>


                    {/* CREATED */}

                    <td className="px-5 py-4 text-gray-500">
                      {new Date(
                        section.createdAt
                      ).toLocaleDateString(
                        "en-IN"
                      )}
                    </td>


                    {/* ACTIONS */}

                    <td className="relative px-5 py-4 text-right">
                      <div className="flex justify-end gap-1">

                        <button
                          onClick={() =>
                            handleViewSection(
                              section._id
                            )
                          }
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                          title="View"
                        >
                          <Icon
                            icon="lucide:eye"
                          />
                        </button>


                        <button
                          onClick={() =>
                            handleOpenEdit(
                              section._id
                            )
                          }
                          className="rounded-lg p-2 text-amber-600 hover:bg-amber-50"
                          title="Edit"
                        >
                          <Icon
                            icon="lucide:pencil"
                          />
                        </button>


                        <div className="relative">
                          <button
                            onClick={() =>
                              setActiveMenu(
                                activeMenu ===
                                  section._id
                                  ? null
                                  : section._id
                              )
                            }
                            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                          >
                            <Icon
                              icon="lucide:ellipsis-vertical"
                            />
                          </button>


                          {activeMenu ===
                            section._id && (
                            <div className="absolute right-0 top-10 z-50 w-48 rounded-lg border border-gray-200 bg-white py-1 text-left shadow-xl">
                              <button
                                onClick={() =>
                                  handleToggleStatus(
                                    section
                                  )
                                }
                                disabled={
                                  statusActionId ===
                                  section._id
                                }
                                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                              >
                                <Icon
                                  icon={
                                    section.isActive
                                      ? "lucide:circle-off"
                                      : "lucide:circle-check"
                                  }
                                />

                                {statusActionId ===
                                section._id
                                  ? "Updating..."
                                  : section.isActive
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


          {/* EMPTY */}

          {paginatedSections.length ===
            0 && (
            <div className="p-12 text-center">
              <Icon
                icon="lucide:layers-3"
                className="mx-auto text-4xl text-gray-400"
              />

              <h3 className="mt-3 font-semibold text-gray-900">
                No sections found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {selectedSession
                  ? `No sections found for ${selectedSession.name}.`
                  : "Select an academic session from the topbar."}
              </p>
            </div>
          )}
        </div>


        {/* ========================================
            PAGINATION
        ======================================== */}

        <div className="flex flex-col gap-3 border-t border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Showing{" "}
            {filteredSections.length ===
            0
              ? 0
              : (currentPage - 1) *
                  itemsPerPage +
                1}

            {" - "}

            {Math.min(
              currentPage *
                itemsPerPage,
              filteredSections.length
            )}

            {" of "}

            {filteredSections.length}

            {" sections"}
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
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-50"
            >
              Previous
            </button>


            {Array.from(
              {
                length:
                  totalPages,
              },
              (_, index) =>
                index + 1
            ).map(
              (page) => (
                <button
                  key={page}
                  onClick={() =>
                    setCurrentPage(
                      page
                    )
                  }
                  className={`h-10 w-10 rounded-lg text-sm font-semibold ${
                    currentPage ===
                    page
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 bg-white text-gray-700"
                  }`}
                >
                  {page}
                </button>
              )
            )}


            <button
              disabled={
                totalPages === 0 ||
                currentPage ===
                  totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    page + 1
                )
              }
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </section>


      {/* ========================================
          CREATE MODAL
      ======================================== */}

      {showCreateModal && (
        <SectionFormModal
          title="Add Section"
          submitLabel="Create Section"
          formData={
            formData
          }
          sessionName={
            selectedSession?.name ||
            "-"
          }
          classes={
            availableClasses
          }
          submitting={
            submitting
          }
          disableRelations={
            false
          }
          onChange={
            handleInputChange
          }
          onClose={
            closeCreateModal
          }
          onSubmit={
            handleCreateSection
          }
        />
      )}


      {/* ========================================
          EDIT MODAL
      ======================================== */}

      {showEditModal && (
        <SectionFormModal
          title="Edit Section"
          submitLabel="Save Changes"
          formData={
            formData
          }
          sessionName={
            getSessionName(
              formData.sessionId
            )
          }
          classes={
            availableClasses
          }
          submitting={
            submitting
          }
          disableRelations={
            true
          }
          onChange={
            handleInputChange
          }
          onClose={
            closeEditModal
          }
          onSubmit={
            handleUpdateSection
          }
        />
      )}


      {/* ========================================
          DETAILS MODAL
      ======================================== */}

      {showDetailsModal &&
        selectedSection && (
          <SectionDetailsModal
            section={
              selectedSection
            }
            sessionName={
              getSessionName(
                selectedSection.sessionId
              )
            }
            className={
              getClassName(
                selectedSection.classId
              )
            }
            onClose={
              closeDetailsModal
            }
          />
        )}
    </div>
  );
};


// ============================================
// SECTION FORM MODAL
// ============================================

interface SectionFormModalProps {
  title: string;

  submitLabel: string;

  formData:
    SectionFormState;

  sessionName:
    string;

  classes: {
    _id: string;
    name: string;
    sessionId: string;
  }[];

  submitting:
    boolean;

  disableRelations:
    boolean;

  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => void;

  onClose:
    () => void;

  onSubmit: (
    e: React.FormEvent
  ) => void;
}


const SectionFormModal = ({
  title,
  submitLabel,
  formData,
  sessionName,
  classes,
  submitting,
  disableRelations,
  onChange,
  onClose,
  onSubmit,
}: SectionFormModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {title}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Configure section information.
            </p>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
          >
            <Icon
              icon="lucide:x"
              className="text-xl text-gray-500"
            />
          </button>
        </div>


        <form
          onSubmit={
            onSubmit
          }
        >
          <div className="space-y-5 p-6">

            {/* ==================================
                SESSION + CLASS
            ================================== */}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* SESSION */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Academic Session *
                </label>

                <div className="flex min-h-11 items-center rounded-lg border border-gray-300 bg-gray-100 px-3 text-sm font-medium text-gray-700">
                  {sessionName}
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  Session is controlled from the topbar.
                </p>
              </div>


              {/* CLASS */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Class *
                </label>

                <select
                  name="classId"
                  value={
                    formData.classId
                  }
                  onChange={
                    onChange
                  }
                  disabled={
                    disableRelations ||
                    !formData.sessionId
                  }
                  className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-blue-600 disabled:bg-gray-100"
                >
                  <option value="">
                    Select Class
                  </option>

                  {classes.map(
                    (classData) => (
                      <option
                        key={
                          classData._id
                        }
                        value={
                          classData._id
                        }
                      >
                        {classData.name}
                      </option>
                    )
                  )}
                </select>

                {classes.length ===
                  0 && (
                  <p className="mt-1 text-xs text-amber-600">
                    No classes are available in this academic session.
                  </p>
                )}
              </div>
            </div>


            {/* ==================================
                SECTION + ROOM
            ================================== */}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* SECTION NAME */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Section Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={
                    formData.name
                  }
                  onChange={
                    onChange
                  }
                  placeholder="Example: A"
                  className="min-h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-600"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Example: A, B, C
                </p>
              </div>


              {/* ROOM */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Room Number
                </label>

                <input
                  type="text"
                  name="roomNumber"
                  value={
                    formData.roomNumber
                  }
                  onChange={
                    onChange
                  }
                  placeholder="Example: 201"
                  className="min-h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-600"
                />
              </div>
            </div>


            {/* ==================================
                CAPACITY
            ================================== */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Student Capacity
              </label>

              <input
                type="number"
                name="capacity"
                value={
                  formData.capacity
                }
                onChange={
                  onChange
                }
                min="1"
                placeholder="Example: 40"
                className="min-h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-600"
              />

              <p className="mt-1 text-xs text-gray-500">
                Maximum number of students that can be assigned to this section.
              </p>
            </div>


            {/* ==================================
                INFO
            ================================== */}

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <div className="flex gap-3">
                <Icon
                  icon="lucide:info"
                  className="mt-0.5 shrink-0 text-xl text-blue-600"
                />

                <div>
                  <p className="text-sm font-semibold text-blue-900">
                    Student Roll Numbers
                  </p>

                  <p className="mt-1 text-xs leading-5 text-blue-700">
                    Roll number Section ka field nahi hai. Student module me each student ke saath sectionId aur rollNumber store hoga.
                  </p>
                </div>
              </div>
            </div>
          </div>


          {/* ==================================
              BUTTONS
          ================================== */}

          <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
            <button
              type="button"
              onClick={
                onClose
              }
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                submitting
              }
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting && (
                <Icon
                  icon="lucide:loader-2"
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
// SECTION DETAILS MODAL
// ============================================

interface SectionDetailsModalProps {
  section:
    SectionData;

  sessionName:
    string;

  className:
    string;

  onClose:
    () => void;
}


const SectionDetailsModal = ({
  section,
  sessionName,
  className,
  onClose,
}: SectionDetailsModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Section Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Section information
            </p>
          </div>

          <button
            onClick={
              onClose
            }
          >
            <Icon
              icon="lucide:x"
              className="text-xl text-gray-500"
            />
          </button>
        </div>


        <div className="p-6">

          {/* MAIN INFO */}

          <div className="mb-6 rounded-xl bg-gray-50 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {className}
                </p>

                <h3 className="mt-1 text-2xl font-bold text-gray-900">
                  Section{" "}
                  {section.name}
                </h3>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  section.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {section.isActive
                  ? "Active"
                  : "Inactive"}
              </span>
            </div>
          </div>


          {/* DETAILS */}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <DetailItem
              label="Academic Session"
              value={
                sessionName
              }
            />

            <DetailItem
              label="Class"
              value={
                className
              }
            />

            <DetailItem
              label="Section"
              value={
                section.name
              }
            />

            <DetailItem
              label="Room Number"
              value={
                section.roomNumber ||
                "-"
              }
            />

            <DetailItem
              label="Capacity"
              value={
                section.capacity !==
                undefined
                  ? String(
                      section.capacity
                    )
                  : "-"
              }
            />

            <DetailItem
              label="Status"
              value={
                section.isActive
                  ? "Active"
                  : "Inactive"
              }
            />

            <DetailItem
              label="Created"
              value={new Date(
                section.createdAt
              ).toLocaleDateString(
                "en-IN"
              )}
            />

            <DetailItem
              label="Updated"
              value={new Date(
                section.updatedAt
              ).toLocaleDateString(
                "en-IN"
              )}
            />
          </div>
        </div>


        <div className="flex justify-end border-t border-gray-200 px-6 py-4">
          <button
            onClick={
              onClose
            }
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Close
          </button>
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
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
};


export default Sections;