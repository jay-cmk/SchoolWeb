

import { useEffect, useMemo, useState } from "react";

import { Icon } from "@iconify/react";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";

import {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  updateTeacherStatus,
  clearTeacherError,
  clearSelectedTeacher,
} from "../../../features/teachers/teacher.slice";

import type {
  TeacherData,
  TeacherGender,
  CreateTeacherPayload,
  UpdateTeacherPayload,
} from "../../../features/teachers/teacher.types";

import { getSessions } from "../../../features/academic/sessions/session.slice";

import { getSubjectAssignments } from "../../../features/academic/subjectAssignments/subjectAssignment.slice";

import type { SubjectAssignmentData } from "../../../features/academic/subjectAssignments/subjectAssignment.types";

// ============================================
// FORM TYPE
// ============================================

interface TeacherFormState {
  employeeId: string;

  name: string;

  email: string;

  password: string;

  mobile: string;

  gender: TeacherGender | "";

  qualification: string;

  joiningDate: string;

  profileImage: string;
}

// ============================================
// INITIAL FORM
// ============================================

const initialFormState: TeacherFormState = {
  employeeId: "",

  name: "",

  email: "",

  password: "",

  mobile: "",

  gender: "",

  qualification: "",

  joiningDate: "",

  profileImage: "",
};

// ============================================
// GENDER OPTIONS
// ============================================

const GENDER_OPTIONS: {
  value: TeacherGender;
  label: string;
}[] = [
  {
    value: "MALE",
    label: "Male",
  },

  {
    value: "FEMALE",
    label: "Female",
  },

  {
    value: "OTHER",
    label: "Other",
  },
];

// ============================================
// STAT CARD
// ============================================

interface StatCardProps {
  title: string;

  value: string | number;

  text: string;

  icon: string;
}

const StatCard = ({ title, value, text, icon }: StatCardProps) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>

          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <Icon icon={icon} className="text-xl" />
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-500">{text}</p>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const Teachers = () => {
  const dispatch = useAppDispatch();

  // ============================================
  // REDUX
  // ============================================

  const { teachers, selectedTeacher, loading, error } = useAppSelector(
    (state) => state.teachers,
  );

  const { assignments } = useAppSelector((state) => state.subjectAssignments);

  const { selectedSessionId } = useAppSelector(
    (state) => state.sessionSelection,
  );

  const { sessions } = useAppSelector((state) => state.sessions);

  const selectedSession = useMemo(
    () => sessions.find((session) => session._id === selectedSessionId) ?? null,
    [sessions, selectedSessionId],
  );

  // ============================================
  // FILTERS
  // ============================================

  const [searchQuery, setSearchQuery] = useState("");

  const [genderFilter, setGenderFilter] = useState<TeacherGender | "ALL">(
    "ALL",
  );

  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "INACTIVE"
  >("ALL");

  // ============================================
  // PAGINATION
  // ============================================

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  // ============================================
  // MODALS
  // ============================================

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);

  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // ============================================
  // FORM
  // ============================================

  const [formData, setFormData] = useState<TeacherFormState>(initialFormState);

  // ============================================
  // ACTION STATE
  // ============================================

  const [submitting, setSubmitting] = useState(false);

  const [statusActionId, setStatusActionId] = useState<string | null>(null);

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // ============================================
  // GET ALL TEACHERS
  //
  // GET /api/v1/teachers
  // ============================================

  useEffect(() => {
    dispatch(getTeachers(undefined));

    if (sessions.length === 0) {
      dispatch(getSessions());
    }

    dispatch(getSubjectAssignments(undefined));
  }, [dispatch, sessions.length]);

  // ============================================
  // CLEANUP
  // ============================================

  useEffect(() => {
    return () => {
      dispatch(clearTeacherError());

      dispatch(clearSelectedTeacher());
    };
  }, [dispatch]);

  // ============================================
  // ERROR
  // ============================================

  useEffect(() => {
    if (error) {
      showToast(error);
    }
  }, [error]);

  // ============================================
  // GLOBAL ACADEMIC SESSION CHANGE
  // ============================================

  useEffect(() => {
    setCurrentPage(1);

    setActiveMenuId(null);

    setShowDetailsModal(false);

    dispatch(clearSelectedTeacher());
  }, [dispatch, selectedSessionId]);

  // ============================================
  // TOAST
  // ============================================

  const showToast = (message: string) => {
    setToastMessage(message);

    window.setTimeout(
      () => {
        setToastMessage(null);
      },

      3000,
    );
  };

  // ============================================
  // INPUT CHANGE
  // ============================================

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

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

    dispatch(clearTeacherError());

    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);

    setFormData(initialFormState);
  };

  // ============================================
  // CREATE TEACHER
  //
  // POST /api/v1/teachers
  // ============================================

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.employeeId.trim()) {
      showToast("Employee ID is required");

      return;
    }

    if (!formData.name.trim()) {
      showToast("Teacher name is required");

      return;
    }

    if (!formData.email.trim()) {
      showToast("Teacher email is required");

      return;
    }

    if (!formData.password.trim()) {
      showToast("Password is required");

      return;
    }

    if (formData.password.length < 6) {
      showToast("Password must be at least 6 characters");

      return;
    }

    const payload: CreateTeacherPayload = {
      employeeId: formData.employeeId.trim().toUpperCase(),

      name: formData.name.trim(),

      email: formData.email.trim().toLowerCase(),

      password: formData.password,

      ...(formData.mobile.trim()
        ? {
            mobile: formData.mobile.trim(),
          }
        : {}),

      ...(formData.gender
        ? {
            gender: formData.gender,
          }
        : {}),

      ...(formData.qualification.trim()
        ? {
            qualification: formData.qualification.trim(),
          }
        : {}),

      ...(formData.joiningDate
        ? {
            joiningDate: formData.joiningDate,
          }
        : {}),

      ...(formData.profileImage.trim()
        ? {
            profileImage: formData.profileImage.trim(),
          }
        : {}),
    };

    try {
      setSubmitting(true);

      await dispatch(createTeacher(payload)).unwrap();

      showToast("Teacher created successfully");

      closeCreateModal();

      await dispatch(getTeachers(undefined)).unwrap();
    } catch (err) {
      showToast(typeof err === "string" ? err : "Failed to create teacher");
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================
  // VIEW TEACHER
  //
  // GET /api/v1/teachers/:teacherId
  // ============================================

  const handleViewTeacher = async (teacherId: string) => {
    try {
      setActiveMenuId(null);

      dispatch(clearSelectedTeacher());

      await dispatch(getTeacherById(teacherId)).unwrap();

      setShowDetailsModal(true);
    } catch (err) {
      showToast(typeof err === "string" ? err : "Failed to fetch teacher");
    }
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);

    dispatch(clearSelectedTeacher());
  };

  // ============================================
  // OPEN EDIT
  // ============================================

  const handleOpenEdit = async (teacherId: string) => {
    try {
      setActiveMenuId(null);

      dispatch(clearSelectedTeacher());

      const teacher = await dispatch(getTeacherById(teacherId)).unwrap();

      setFormData({
        employeeId: teacher.employeeId,

        name: teacher.name,

        email: teacher.email,

        password: "",

        mobile: teacher.mobile || "",

        gender: teacher.gender || "",

        qualification: teacher.qualification || "",

        joiningDate: teacher.joiningDate
          ? teacher.joiningDate.slice(0, 10)
          : "",

        profileImage: teacher.profileImage || "",
      });

      setShowEditModal(true);
    } catch (err) {
      showToast(typeof err === "string" ? err : "Failed to fetch teacher");
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);

    setFormData(initialFormState);

    dispatch(clearSelectedTeacher());
  };

  // ============================================
  // UPDATE TEACHER
  //
  // PUT /api/v1/teachers/:teacherId
  // ============================================

  const handleUpdateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTeacher?._id) {
      showToast("Teacher not selected");

      return;
    }

    if (
      !formData.employeeId.trim() ||
      !formData.name.trim() ||
      !formData.email.trim()
    ) {
      showToast("Employee ID, name and email are required");

      return;
    }

    const data: UpdateTeacherPayload = {
      employeeId: formData.employeeId.trim().toUpperCase(),

      name: formData.name.trim(),

      email: formData.email.trim().toLowerCase(),

      mobile: formData.mobile.trim(),

      qualification: formData.qualification.trim(),

      profileImage: formData.profileImage.trim(),

      ...(formData.gender
        ? {
            gender: formData.gender,
          }
        : {}),

      ...(formData.joiningDate
        ? {
            joiningDate: formData.joiningDate,
          }
        : {}),
    };

    try {
      setSubmitting(true);

      await dispatch(
        updateTeacher({
          teacherId: selectedTeacher._id,

          data,
        }),
      ).unwrap();

      showToast("Teacher updated successfully");

      closeEditModal();

      await dispatch(getTeachers(undefined)).unwrap();
    } catch (err) {
      showToast(typeof err === "string" ? err : "Failed to update teacher");
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================
  // UPDATE STATUS
  //
  // PATCH /api/v1/teachers/:teacherId/status
  // ============================================

  const handleToggleStatus = async (teacher: TeacherData) => {
    try {
      setActiveMenuId(null);

      setStatusActionId(teacher._id);

      await dispatch(
        updateTeacherStatus({
          teacherId: teacher._id,

          isActive: !teacher.isActive,
        }),
      ).unwrap();

      showToast(
        teacher.isActive ? "Teacher marked inactive" : "Teacher marked active",
      );
    } catch (err) {
      showToast(
        typeof err === "string" ? err : "Failed to update teacher status",
      );
    } finally {
      setStatusActionId(null);
    }
  };

  // ============================================
  // ASSIGNMENT HELPERS
  // ============================================

  const getRelationId = (
    value:
      | string
      | {
          _id: string;
        },
  ): string => {
    return typeof value === "string" ? value : value._id;
  };

  const getRelationName = (
    value:
      | string
      | {
          name?: string;
        },
  ): string => {
    if (typeof value === "string") {
      return "";
    }

    return value.name || "";
  };

  const getTeacherAssignments = (
    teacherId: string,
  ): SubjectAssignmentData[] => {
    if (!selectedSessionId) {
      return [];
    }

    return assignments.filter(
      (assignment) =>
        getRelationId(assignment.teacherId) === teacherId &&
        getRelationId(assignment.sessionId) === selectedSessionId,
    );
  };

  const getAssignedSubjects = (teacherId: string): string[] => {
    const values = getTeacherAssignments(teacherId).map((assignment) =>
      getRelationName(assignment.subjectId),
    );

    return [...new Set(values.filter(Boolean))];
  };

  const getAssignedClasses = (teacherId: string): string[] => {
    const values = getTeacherAssignments(teacherId).map((assignment) =>
      getRelationName(assignment.classId),
    );

    return [...new Set(values.filter(Boolean))];
  };

  const getAssignedSections = (teacherId: string): string[] => {
    const values = getTeacherAssignments(teacherId).map((assignment) =>
      getRelationName(assignment.sectionId),
    );

    return [...new Set(values.filter(Boolean))];
  };

  const getWeeklyPeriods = (teacherId: string): number => {
    return getTeacherAssignments(teacherId).reduce(
      (total, assignment) =>
        total + (assignment.isActive ? assignment.weeklyPeriods : 0),
      0,
    );
  };

  // ============================================
  // FILTER DATA
  // ============================================

  const filteredTeachers = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();

    return teachers.filter((teacher) => {
      const teacherAssignments = getTeacherAssignments(teacher._id);

      if (selectedSessionId && teacherAssignments.length === 0) {
        return false;
      }

      const assignedSearchText = [
        ...getAssignedSubjects(teacher._id),
        ...getAssignedClasses(teacher._id),
        ...getAssignedSections(teacher._id),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        teacher.name.toLowerCase().includes(search) ||
        teacher.employeeId.toLowerCase().includes(search) ||
        teacher.email.toLowerCase().includes(search) ||
        (teacher.mobile || "").toLowerCase().includes(search) ||
        (teacher.qualification || "").toLowerCase().includes(search) ||
        assignedSearchText.includes(search);

      const matchesGender =
        genderFilter === "ALL" || teacher.gender === genderFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && teacher.isActive) ||
        (statusFilter === "INACTIVE" && !teacher.isActive);

      return matchesSearch && matchesGender && matchesStatus;
    });
  }, [
    teachers,
    assignments,
    selectedSessionId,
    searchQuery,
    genderFilter,
    statusFilter,
  ]);

  // ============================================
  // PAGINATION
  // ============================================

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

  const paginatedTeachers = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,

    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, genderFilter, statusFilter]);

  // ============================================
  // STATS
  // ============================================

  const sessionTeachers = useMemo(() => {
    if (!selectedSessionId) {
      return [];
    }

    return teachers.filter(
      (teacher) => getTeacherAssignments(teacher._id).length > 0,
    );
  }, [teachers, assignments, selectedSessionId]);

  const totalTeachers = sessionTeachers.length;

  const activeTeachers = sessionTeachers.filter(
    (teacher) => teacher.isActive,
  ).length;

  const inactiveTeachers = sessionTeachers.filter(
    (teacher) => !teacher.isActive,
  ).length;

  const assignedTeachers = sessionTeachers.length;

  // ============================================
  // RESET
  // ============================================

  const resetFilters = () => {
    setSearchQuery("");

    setGenderFilter("ALL");

    setStatusFilter("ALL");

    setCurrentPage(1);
  };

  // ============================================
  // EXPORT
  // ============================================

  const handleExport = () => {
    if (filteredTeachers.length === 0) {
      showToast("No teachers to export");

      return;
    }

    const headers = [
      "Teacher",
      "Employee ID",
      "Email",
      "Mobile",
      "Assigned Subjects (Selected Session)",
      "Classes (Selected Session)",
      "Sections (Selected Session)",
      "Weekly Periods",
      "Joining Date",
      "Status",
    ];

    const rows = filteredTeachers.map((teacher) => [
      teacher.name,

      teacher.employeeId,

      teacher.email,

      teacher.mobile || "",

      getAssignedSubjects(teacher._id).join(", "),

      getAssignedClasses(teacher._id).join(", "),

      getAssignedSections(teacher._id).join(", "),

      getWeeklyPeriods(teacher._id),

      formatDate(teacher.joiningDate),

      teacher.isActive ? "Active" : "Inactive",
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((item) => `"${String(item).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    const sessionName = selectedSession?.name
      ? selectedSession.name.replace(/[^a-zA-Z0-9_-]+/g, "-")
      : "no-session";

    link.download = `teachers-${sessionName}.csv`;

    link.click();

    URL.revokeObjectURL(url);
  };

  // ============================================
  // LOADING
  // ============================================

  if (loading && teachers.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Icon
            icon="lucide:loader-2"
            className="mx-auto animate-spin text-4xl text-blue-600"
          />

          <p className="mt-3 text-sm text-gray-500">Loading teachers...</p>
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
          <Icon icon="lucide:circle-check" className="text-lg text-green-400" />

          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* ========================================
          BREADCRUMB
      ======================================== */}

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Staff</span>

        <Icon icon="lucide:chevron-right" />

        <span className="font-medium text-gray-900">Teachers</span>
      </div>

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>

          <p className="mt-1 text-sm text-gray-500">
            Teachers, assignment details and summary counts are shown for the
            academic session selected in the topbar.
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <Icon icon="lucide:calendar-range" />
              {selectedSession
                ? `Academic Session: ${selectedSession.name}`
                : "No academic session selected"}
            </span>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700"
        >
          <Icon icon="lucide:plus" className="text-lg" />
          Add Teacher
        </button>
      </div>

      {/* ========================================
          ERROR
      ======================================== */}

      {error && (
        <div className="mt-5 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>

          <button onClick={() => dispatch(clearTeacherError())}>
            <Icon icon="lucide:x" className="text-red-600" />
          </button>
        </div>
      )}

      {!selectedSessionId && (
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <Icon
            icon="lucide:triangle-alert"
            className="mt-0.5 text-xl text-amber-600"
          />

          <div>
            <p className="text-sm font-semibold text-amber-900">
              Select an academic session from the topbar
            </p>

            <p className="mt-1 text-xs leading-5 text-amber-700">
              Teacher master records will still be visible, but subject, class,
              section and weekly-period assignment data requires a selected
              session.
            </p>
          </div>
        </div>
      )}

      {/* ========================================
          STATS
      ======================================== */}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Teachers"
          value={totalTeachers}
          text={
            selectedSession
              ? `Teachers in ${selectedSession.name}`
              : "Select academic session"
          }
          icon="lucide:users"
        />

        <StatCard
          title="Active Teachers"
          value={activeTeachers}
          text={
            selectedSession
              ? `Active in ${selectedSession.name}`
              : "Select academic session"
          }
          icon="lucide:user-check"
        />

        <StatCard
          title="Inactive Teachers"
          value={inactiveTeachers}
          text={
            selectedSession
              ? `Inactive in ${selectedSession.name}`
              : "Select academic session"
          }
          icon="lucide:user-x"
        />

        <StatCard
          title="Assigned Teachers"
          value={assignedTeachers}
          text={
            selectedSession
              ? `Assigned in ${selectedSession.name}`
              : "Select academic session"
          }
          icon="lucide:book-user"
        />
      </div>

      {/* ========================================
          TABLE CARD
      ======================================== */}

      <section className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* FILTERS */}

        <div className="border-b border-gray-200 p-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
            {/* SEARCH */}

            <div className="relative xl:col-span-2">
              <Icon
                icon="lucide:search"
                className="absolute left-3 top-3.5 text-gray-400"
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search teacher, employee ID, email..."
                className="min-h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 text-sm outline-none focus:border-blue-600"
              />
            </div>

            {/* STATUS */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "ALL" | "ACTIVE" | "INACTIVE")
              }
              className="min-h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-blue-600"
            >
              <option value="ALL">All Status</option>

              <option value="ACTIVE">Active</option>

              <option value="INACTIVE">Inactive</option>
            </select>

            {/* GENDER */}

            <select
              value={genderFilter}
              onChange={(e) =>
                setGenderFilter(e.target.value as TeacherGender | "ALL")
              }
              className="min-h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-blue-600"
            >
              <option value="ALL">All Genders</option>

              {GENDER_OPTIONS.map((gender) => (
                <option key={gender.value} value={gender.value}>
                  {gender.label}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 rounded-lg border border-gray-300 px-4 text-sm font-medium hover:bg-gray-50"
              >
                Reset
              </button>

              <button
                onClick={handleExport}
                className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 text-sm font-medium hover:bg-gray-50"
              >
                <Icon icon="lucide:download" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* ========================================
            TABLE
        ======================================== */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1350px] text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-4 text-left font-semibold">Teacher</th>

                <th className="px-4 py-4 text-left font-semibold">
                  Employee ID
                </th>

                <th className="px-4 py-4 text-left font-semibold">Email</th>

                <th className="px-4 py-4 text-left font-semibold">
                  Mobile Number
                </th>

                <th className="px-4 py-4 text-left font-semibold">
                  Assigned Subject (Session)
                </th>

                <th className="px-4 py-4 text-left font-semibold">
                  Classes (Session)
                </th>

                <th className="px-4 py-4 text-left font-semibold">
                  Sections (Session)
                </th>

                <th className="px-4 py-4 text-left font-semibold">
                  Weekly Periods
                </th>

                <th className="px-4 py-4 text-left font-semibold">
                  Joining Date
                </th>

                <th className="px-4 py-4 text-left font-semibold">Status</th>

                <th className="px-5 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {paginatedTeachers.map((teacher) => {
                const assignedSubjects = getAssignedSubjects(teacher._id);

                const assignedClasses = getAssignedClasses(teacher._id);

                const assignedSections = getAssignedSections(teacher._id);

                const weeklyPeriods = getWeeklyPeriods(teacher._id);

                return (
                  <tr key={teacher._id} className="transition hover:bg-gray-50">
                    {/* TEACHER */}

                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleViewTeacher(teacher._id)}
                        className="flex items-center gap-3 text-left"
                      >
                        <TeacherAvatar teacher={teacher} />

                        <div>
                          <p className="font-semibold text-gray-900 hover:text-blue-600">
                            {teacher.name}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-500">
                            {teacher.qualification || "Teacher"}
                          </p>
                        </div>
                      </button>
                    </td>

                    {/* EMPLOYEE ID */}

                    <td className="px-4 py-4 font-mono text-xs text-gray-600">
                      {teacher.employeeId}
                    </td>

                    {/* EMAIL */}

                    <td className="px-4 py-4 text-gray-600">{teacher.email}</td>

                    {/* MOBILE */}

                    <td className="px-4 py-4 text-gray-600">
                      {teacher.mobile || "-"}
                    </td>

                    {/* SUBJECT */}

                    <td className="px-4 py-4">
                      <TagList
                        values={assignedSubjects}
                        emptyText="Not assigned"
                      />
                    </td>

                    {/* CLASSES */}

                    <td className="px-4 py-4">
                      <TagList
                        values={assignedClasses}
                        emptyText="Not assigned"
                      />
                    </td>

                    {/* SECTIONS */}

                    <td className="px-4 py-4">
                      <TagList
                        values={assignedSections}
                        emptyText="Not assigned"
                      />
                    </td>

                    {/* WEEKLY PERIODS */}

                    <td className="px-4 py-4">
                      {weeklyPeriods > 0 ? (
                        <span className="font-semibold text-gray-800">
                          {weeklyPeriods}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>

                    {/* JOINING DATE */}

                    <td className="px-4 py-4 text-gray-600">
                      {formatDate(teacher.joiningDate)}
                    </td>

                    {/* STATUS */}

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          teacher.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {teacher.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* ACTIONS */}

                    <td className="relative px-5 py-4 text-right">
                      <div className="inline-block">
                        <button
                          onClick={() =>
                            setActiveMenuId(
                              activeMenuId === teacher._id ? null : teacher._id,
                            )
                          }
                          className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-100"
                        >
                          <Icon
                            icon="lucide:ellipsis-vertical"
                            className="text-lg text-gray-500"
                          />
                        </button>

                        {activeMenuId === teacher._id && (
                          <div className="absolute right-5 top-14 z-50 w-48 rounded-lg border border-gray-200 bg-white py-1 text-left shadow-xl">
                            {/* VIEW */}

                            <button
                              onClick={() => handleViewTeacher(teacher._id)}
                              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Icon icon="lucide:eye" />
                              View Details
                            </button>

                            {/* EDIT */}

                            <button
                              onClick={() => handleOpenEdit(teacher._id)}
                              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Icon icon="lucide:pencil" />
                              Edit Teacher
                            </button>

                            {/* STATUS */}

                            <button
                              onClick={() => handleToggleStatus(teacher)}
                              disabled={statusActionId === teacher._id}
                              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                              <Icon
                                icon={
                                  teacher.isActive
                                    ? "lucide:user-x"
                                    : "lucide:user-check"
                                }
                              />

                              {statusActionId === teacher._id
                                ? "Updating..."
                                : teacher.isActive
                                  ? "Make Inactive"
                                  : "Make Active"}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* EMPTY */}

          {paginatedTeachers.length === 0 && (
            <div className="p-12 text-center">
              <Icon
                icon="lucide:users"
                className="mx-auto text-4xl text-gray-400"
              />

              <h3 className="mt-3 font-semibold text-gray-900">
                No teachers found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {selectedSessionId
                  ? "No teacher is assigned in the selected academic session."
                  : "Select an academic session from the topbar."}
              </p>
            </div>
          )}
        </div>

        {/* ========================================
            PAGINATION
        ======================================== */}

        <div className="flex flex-col gap-3 border-t border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {filteredTeachers.length === 0
                ? 0
                : (currentPage - 1) * itemsPerPage + 1}

              {" - "}

              {Math.min(
                currentPage * itemsPerPage,

                filteredTeachers.length,
              )}
            </span>
            {" of "}
            <span className="font-semibold text-gray-700">
              {filteredTeachers.length}
            </span>
            {" teachers"}
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((page) => page - 1)}
              disabled={currentPage === 1}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-50"
            >
              Previous
            </button>

            {Array.from(
              {
                length: totalPages,
              },

              (_, index) => index + 1,
            ).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-10 w-10 rounded-lg text-sm font-semibold ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 bg-white text-gray-700"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((page) => page + 1)}
              disabled={totalPages === 0 || currentPage === totalPages}
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
        <TeacherFormModal
          title="Add Teacher"
          submitLabel="Create Teacher"
          formData={formData}
          submitting={submitting}
          showPassword
          onChange={handleInputChange}
          onClose={closeCreateModal}
          onSubmit={handleCreateTeacher}
        />
      )}

      {/* ========================================
          EDIT MODAL
      ======================================== */}

      {showEditModal && (
        <TeacherFormModal
          title="Edit Teacher"
          submitLabel="Save Changes"
          formData={formData}
          submitting={submitting}
          onChange={handleInputChange}
          onClose={closeEditModal}
          onSubmit={handleUpdateTeacher}
        />
      )}

      {/* ========================================
          DETAILS
      ======================================== */}

      {showDetailsModal && selectedTeacher && (
        <TeacherDetailsModal
          teacher={selectedTeacher}
          assignments={getTeacherAssignments(selectedTeacher._id)}
          assignedSubjects={getAssignedSubjects(selectedTeacher._id)}
          assignedClasses={getAssignedClasses(selectedTeacher._id)}
          assignedSections={getAssignedSections(selectedTeacher._id)}
          weeklyPeriods={getWeeklyPeriods(selectedTeacher._id)}
          sessionName={selectedSession?.name ?? ""}
          onClose={closeDetailsModal}
        />
      )}
    </div>
  );
};

// ============================================
// FORM MODAL
// ============================================

interface TeacherFormModalProps {
  title: string;

  submitLabel: string;

  formData: TeacherFormState;

  showPassword?: boolean;

  submitting: boolean;

  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => void;

  onClose: () => void;

  onSubmit: (e: React.FormEvent) => void;
}

const TeacherFormModal = ({
  title,
  submitLabel,
  formData,
  showPassword = false,
  submitting,
  onChange,
  onClose,
  onSubmit,
}: TeacherFormModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>

            <p className="mt-1 text-sm text-gray-500">
              Enter teacher profile information.
            </p>
          </div>

          <button type="button" onClick={onClose}>
            <Icon icon="lucide:x" className="text-xl text-gray-500" />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="space-y-5 p-6">
            {/* EMPLOYEE ID + NAME */}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FormInput
                label="Employee ID"
                required
                name="employeeId"
                value={formData.employeeId}
                onChange={onChange}
                placeholder="TCH-2026-001"
              />

              <FormInput
                label="Full Name"
                required
                name="name"
                value={formData.name}
                onChange={onChange}
                placeholder="Ananya Rao"
              />
            </div>

            {/* EMAIL + MOBILE */}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FormInput
                label="Email"
                required
                name="email"
                type="email"
                value={formData.email}
                onChange={onChange}
                placeholder="teacher@school.com"
              />

              <FormInput
                label="Mobile Number"
                name="mobile"
                type="tel"
                value={formData.mobile}
                onChange={onChange}
                placeholder="9876543210"
              />
            </div>

            {showPassword && (
              <FormInput
                label="Login Password"
                required
                name="password"
                type="password"
                value={formData.password}
                onChange={onChange}
                placeholder="Minimum 6 characters"
              />
            )}

            {/* GENDER + JOIN DATE */}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Gender
                </label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={onChange}
                  className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-blue-600"
                >
                  <option value="">Select Gender</option>

                  {GENDER_OPTIONS.map((gender) => (
                    <option key={gender.value} value={gender.value}>
                      {gender.label}
                    </option>
                  ))}
                </select>
              </div>

              <FormInput
                label="Joining Date"
                name="joiningDate"
                type="date"
                value={formData.joiningDate}
                onChange={onChange}
              />
            </div>

            {/* QUALIFICATION */}

            <FormInput
              label="Qualification"
              name="qualification"
              value={formData.qualification}
              onChange={onChange}
              placeholder="M.Sc Mathematics, B.Ed"
            />

            {/* PROFILE IMAGE */}

            <FormInput
              label="Profile Image URL"
              name="profileImage"
              value={formData.profileImage}
              onChange={onChange}
              placeholder="https://..."
            />

            {/* PREVIEW */}

            {formData.profileImage && (
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <img
                  src={formData.profileImage}
                  alt="Teacher preview"
                  className="h-12 w-12 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />

                <p className="text-sm text-gray-500">Profile image preview</p>
              </div>
            )}

            {/* INFO */}

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <div className="flex gap-3">
                <Icon
                  icon="lucide:info"
                  className="mt-0.5 text-xl text-blue-600"
                />

                <div>
                  <p className="text-sm font-semibold text-blue-900">
                    Teaching Assignment
                  </p>

                  <p className="mt-1 text-xs leading-5 text-blue-700">
                    Subject, class and section assignment teacher create karte
                    waqt nahi hoga. Teacher create hone ke baad Subject
                    Assignment module me teacherId use hoga.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* BUTTONS */}

          <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting && (
                <Icon icon="lucide:loader-2" className="animate-spin" />
              )}

              {submitting ? "Saving..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================
// DETAILS RELATION NAME
// ============================================

const getAssignmentRelationName = (
  value:
    | string
    | {
        name?: string;
      },
): string => {
  if (typeof value === "string") {
    return "";
  }

  return value.name || "";
};

// ============================================
// DETAILS MODAL
// ============================================

interface TeacherDetailsModalProps {
  teacher: TeacherData;

  assignments: SubjectAssignmentData[];

  assignedSubjects: string[];

  assignedClasses: string[];

  assignedSections: string[];

  weeklyPeriods: number;

  sessionName: string;

  onClose: () => void;
}

const TeacherDetailsModal = ({
  teacher,
  assignments,
  assignedSubjects,
  assignedClasses,
  assignedSections,
  weeklyPeriods,
  sessionName,
  onClose,
}: TeacherDetailsModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl">
        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <h2 className="text-xl font-bold text-gray-900">Teacher Profile</h2>

          <button onClick={onClose}>
            <Icon icon="lucide:x" className="text-xl text-gray-500" />
          </button>
        </div>

        {/* PROFILE */}

        <div className="border-b border-gray-200 p-6 text-center">
          <div className="flex justify-center">
            <TeacherAvatar teacher={teacher} large />
          </div>

          <h3 className="mt-4 text-2xl font-bold text-gray-900">
            {teacher.name}
          </h3>

          <p className="mt-1 font-mono text-sm text-gray-500">
            {teacher.employeeId}
          </p>

          <span
            className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              teacher.isActive
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {teacher.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* INFO */}

        <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
          <DetailItem label="Email" value={teacher.email} />

          <DetailItem label="Mobile" value={teacher.mobile || "-"} />

          <DetailItem label="Gender" value={formatGender(teacher.gender)} />

          <DetailItem
            label="Qualification"
            value={teacher.qualification || "-"}
          />

          <DetailItem
            label="Joining Date"
            value={formatDate(teacher.joiningDate)}
          />

          <DetailItem label="Employee ID" value={teacher.employeeId} />
        </div>

        <div className="mx-6 mb-6 space-y-5">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-900">
              <Icon icon="lucide:calendar-range" />
              {sessionName
                ? `Academic Session: ${sessionName}`
                : "No academic session selected"}
            </div>

            <p className="mt-1 text-xs leading-5 text-blue-700">
              The assignment summary below is limited to the selected academic
              session. Teacher profile information above remains global.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <SummaryCard label="Subjects" value={assignedSubjects.length} />

            <SummaryCard label="Classes" value={assignedClasses.length} />

            <SummaryCard label="Sections" value={assignedSections.length} />

            <SummaryCard label="Weekly Periods" value={weeklyPeriods} />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <AssignmentSummaryBox
              label="Assigned Subjects"
              values={assignedSubjects}
            />

            <AssignmentSummaryBox
              label="Assigned Classes"
              values={assignedClasses}
            />

            <AssignmentSummaryBox
              label="Assigned Sections"
              values={assignedSections}
            />
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900">
              Individual Assignments
            </h4>

            {assignments.length === 0 ? (
              <div className="mt-3 rounded-lg border border-dashed border-gray-300 p-5 text-center text-sm text-gray-500">
                No subject assignment found for this teacher in the selected
                academic session.
              </div>
            ) : (
              <div className="mt-3 overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full min-w-[650px] text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-4 py-3 text-left">Subject</th>

                      <th className="px-4 py-3 text-left">Class</th>

                      <th className="px-4 py-3 text-left">Section</th>

                      <th className="px-4 py-3 text-left">Periods</th>

                      <th className="px-4 py-3 text-left">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {assignments.map((assignment) => (
                      <tr key={assignment._id}>
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {getAssignmentRelationName(assignment.subjectId) ||
                            "-"}
                        </td>

                        <td className="px-4 py-3 text-gray-700">
                          {getAssignmentRelationName(assignment.classId) || "-"}
                        </td>

                        <td className="px-4 py-3 text-gray-700">
                          {getAssignmentRelationName(assignment.sectionId) ||
                            "-"}
                        </td>

                        <td className="px-4 py-3 text-gray-700">
                          {assignment.weeklyPeriods}
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              assignment.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {assignment.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
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
// TAG LIST
// ============================================

const TagList = ({
  values,
  emptyText,
}: {
  values: string[];
  emptyText: string;
}) => {
  if (values.length === 0) {
    return <span className="text-sm italic text-gray-400">{emptyText}</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {values.map((value) => (
        <span
          key={value}
          className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700"
        >
          {value}
        </span>
      ))}
    </div>
  );
};

// ============================================
// SUMMARY CARD
// ============================================

const SummaryCard = ({ label, value }: { label: string; value: number }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

// ============================================
// ASSIGNMENT SUMMARY BOX
// ============================================

const AssignmentSummaryBox = ({
  label,
  values,
}: {
  label: string;
  values: string[];
}) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      {values.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {values.map((value) => (
            <span
              key={value}
              className="rounded-md bg-white px-2 py-1 text-xs font-medium text-gray-700 shadow-sm"
            >
              {value}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-sm italic text-gray-400">Not assigned</p>
      )}
    </div>
  );
};

// ============================================
// AVATAR
// ============================================

const TeacherAvatar = ({
  teacher,
  large = false,
}: {
  teacher: TeacherData;

  large?: boolean;
}) => {
  const size = large ? "h-24 w-24 text-2xl" : "h-10 w-10 text-sm";

  if (teacher.profileImage) {
    return (
      <img
        src={teacher.profileImage}
        alt={teacher.name}
        className={`${size} rounded-full border border-gray-200 object-cover`}
      />
    );
  }

  const initials = teacher.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`${size} flex items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700`}
    >
      {initials}
    </div>
  );
};

// ============================================
// FORM INPUT
// ============================================

interface FormInputProps {
  label: string;

  name: string;

  value: string;

  type?: string;

  placeholder?: string;

  required?: boolean;

  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput = ({
  label,
  name,
  value,
  type = "text",
  placeholder,
  required = false,
  onChange,
}: FormInputProps) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="min-h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-600"
      />
    </div>
  );
};

// ============================================
// DETAIL
// ============================================

const DetailItem = ({
  label,
  value,
}: {
  label: string;

  value: string;
}) => {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 font-medium text-gray-900">{value}</p>
    </div>
  );
};

// ============================================
// FORMAT GENDER
// ============================================

const formatGender = (gender?: TeacherGender) => {
  switch (gender) {
    case "MALE":
      return "Male";

    case "FEMALE":
      return "Female";

    case "OTHER":
      return "Other";

    default:
      return "-";
  }
};

// ============================================
// FORMAT DATE
// ============================================

const formatDate = (date?: string) => {
  if (!date) {
    return "-";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",

    month: "short",

    year: "numeric",
  });
};

export default Teachers;
