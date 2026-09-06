import React, { useEffect, useMemo, useRef, useState } from "react";

import { Icon } from "@iconify/react";

import { useNavigate, useSearchParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";

import { getSessions } from "../../../features/academic/sessions/session.slice";

import { getClasses } from "../../../features/academic/classes/class.slice";

import { getSections } from "../../../features/academic/sections/section.slice";

import {
  getMonthlyAttendanceSummary,
  clearMonthlyAttendanceSummary,
  clearAttendanceError,
} from "../../../features/attendance/attendance.slice";

import type { MonthlyStudentSummary } from "../../../features/attendance/attendance.types";

// ============================================
// HELPERS
// ============================================

const getRelationId = (value: unknown): string => {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object" && "_id" in value) {
    const id = (
      value as {
        _id?: unknown;
      }
    )._id;

    return typeof id === "string" ? id : String(id ?? "");
  }

  return "";
};

const getInitials = (firstName?: string, lastName?: string) => {
  const first = typeof firstName === "string" ? firstName.trim() : "";

  const last = typeof lastName === "string" ? lastName.trim() : "";

  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || "ST";
};

const getStudentName = (student: MonthlyStudentSummary["student"]) => {
  const fullName = student.name?.trim();

  if (fullName) {
    return fullName;
  }

  return (
    [student.firstName, student.lastName].filter(Boolean).join(" ").trim() ||
    "Student"
  );
};

const getMonthLabel = (month: number, year: number) => {
  const date = new Date(year, month - 1, 1);

  return date.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
};

// ============================================
// MONTH OPTIONS
// ============================================

const monthOptions = [
  {
    value: 1,
    label: "January",
  },
  {
    value: 2,
    label: "February",
  },
  {
    value: 3,
    label: "March",
  },
  {
    value: 4,
    label: "April",
  },
  {
    value: 5,
    label: "May",
  },
  {
    value: 6,
    label: "June",
  },
  {
    value: 7,
    label: "July",
  },
  {
    value: 8,
    label: "August",
  },
  {
    value: 9,
    label: "September",
  },
  {
    value: 10,
    label: "October",
  },
  {
    value: 11,
    label: "November",
  },
  {
    value: 12,
    label: "December",
  },
];

// ============================================
// MAIN COMPONENT
// ============================================

const MonthlyAttendance: React.FC = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  // ============================================
  // REDUX
  // ============================================

  const { monthlySummary, loading, error } = useAppSelector(
    (state) => state.attendance,
  );

  const { sessions } = useAppSelector((state) => state.sessions);

  const { classes } = useAppSelector((state) => state.classes);

  const { sections } = useAppSelector((state) => state.sections);

  const { selectedSessionId } = useAppSelector(
    (state) => state.sessionSelection,
  );

  // ============================================
  // FILTER STATE
  // ============================================

  const today = new Date();

  const [selectedClassId, setSelectedClassId] = useState(
    searchParams.get("classId") || "",
  );

  const [selectedSectionId, setSelectedSectionId] = useState(
    searchParams.get("sectionId") || "",
  );

  const [selectedMonth, setSelectedMonth] = useState<number>(
    Number(searchParams.get("month")) || today.getMonth() + 1,
  );

  const [selectedYear, setSelectedYear] = useState<number>(
    Number(searchParams.get("year")) || today.getFullYear(),
  );

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 25;

  const previousSessionId = useRef<string | null>(null);

  // ============================================
  // LOAD MASTER DATA
  // ============================================

  useEffect(() => {
    if (sessions.length === 0) {
      dispatch(getSessions());
    }

    return () => {
      dispatch(clearMonthlyAttendanceSummary());

      dispatch(clearAttendanceError());
    };
  }, [dispatch, sessions.length]);

  // ============================================
  // LOAD TOPBAR SELECTED SESSION DATA
  // ============================================

  useEffect(() => {
    const sessionChanged =
      previousSessionId.current !== null &&
      previousSessionId.current !== selectedSessionId;

    previousSessionId.current = selectedSessionId;

    if (sessionChanged) {
      setSelectedClassId("");

      setSelectedSectionId("");

      setCurrentPage(1);
    }

    dispatch(clearMonthlyAttendanceSummary());

    dispatch(clearAttendanceError());

    if (!selectedSessionId) {
      return;
    }

    dispatch(
      getClasses({
        sessionId: selectedSessionId,
      }),
    );

    dispatch(
      getSections({
        sessionId: selectedSessionId,
      }),
    );
  }, [dispatch, selectedSessionId]);

  // ============================================
  // AVAILABLE CLASSES
  // ============================================

  const availableClasses = useMemo(() => {
    if (!selectedSessionId) {
      return [];
    }

    return classes.filter(
      (item) =>
        getRelationId(item.sessionId) === selectedSessionId &&
        item.isActive !== false,
    );
  }, [classes, selectedSessionId]);

  // ============================================
  // VALIDATE CLASS
  // ============================================

  useEffect(() => {
    if (!selectedClassId || availableClasses.length === 0) {
      return;
    }

    const exists = availableClasses.some(
      (item) => item._id === selectedClassId,
    );

    if (!exists) {
      setSelectedClassId("");

      setSelectedSectionId("");
    }
  }, [availableClasses, selectedClassId]);

  // ============================================
  // AVAILABLE SECTIONS
  // ============================================

  const availableSections = useMemo(() => {
    if (!selectedSessionId || !selectedClassId) {
      return [];
    }

    return sections.filter(
      (section) =>
        getRelationId(section.sessionId) === selectedSessionId &&
        getRelationId(section.classId) === selectedClassId &&
        section.isActive !== false,
    );
  }, [sections, selectedSessionId, selectedClassId]);

  const handleClassChange = (value: string) => {
    setSelectedClassId(value);

    setSelectedSectionId("");

    if (!selectedSessionId || !value) {
      return;
    }

    dispatch(
      getSections({
        sessionId: selectedSessionId,

        classId: value,
      }),
    );
  };

  // ============================================
  // VALIDATE SECTION
  // ============================================

  useEffect(() => {
    if (!selectedSectionId || availableSections.length === 0) {
      return;
    }

    const exists = availableSections.some(
      (item) => item._id === selectedSectionId,
    );

    if (!exists) {
      setSelectedSectionId("");
    }
  }, [availableSections, selectedSectionId]);

  // ============================================
  // FETCH MONTHLY SUMMARY
  // ============================================

  useEffect(() => {
    if (
      !selectedSessionId ||
      !selectedClassId ||
      !selectedSectionId ||
      !selectedMonth ||
      !selectedYear
    ) {
      dispatch(clearMonthlyAttendanceSummary());

      return;
    }

    dispatch(
      getMonthlyAttendanceSummary({
        sessionId: selectedSessionId,

        classId: selectedClassId,

        sectionId: selectedSectionId,

        month: selectedMonth,

        year: selectedYear,
      }),
    );
  }, [
    dispatch,
    selectedSessionId,
    selectedClassId,
    selectedSectionId,
    selectedMonth,
    selectedYear,
  ]);

  // ============================================
  // RESET PAGE
  // ============================================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedSessionId,
    selectedClassId,
    selectedSectionId,
    selectedMonth,
    selectedYear,
  ]);

  // ============================================
  // SELECTED LABELS
  // ============================================

  const selectedSession = sessions.find(
    (item) => item._id === selectedSessionId,
  );

  const selectedClass = availableClasses.find(
    (item) => item._id === selectedClassId,
  );

  const selectedSection = availableSections.find(
    (item) => item._id === selectedSectionId,
  );

  // ============================================
  // SUMMARY
  // ============================================

  const students = monthlySummary?.summary || [];

  const totalPages = Math.max(1, Math.ceil(students.length / itemsPerPage));

  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;

    return students.slice(start, start + itemsPerPage);
  }, [students, currentPage]);

  // ============================================
  // DAILY VIEW
  // ============================================

  const handleDailyView = () => {
    if (!selectedSessionId || !selectedClassId || !selectedSectionId) {
      return;
    }

    const params = new URLSearchParams();

    if (selectedClassId) {
      params.set("classId", selectedClassId);
    }

    if (selectedSectionId) {
      params.set("sectionId", selectedSectionId);
    }

    const date = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-01`;

    params.set("date", date);

    navigate(`/school-admin/attendance/daily?${params.toString()}`);
  };

  // ============================================
  // MARK ATTENDANCE
  // ============================================

  const handleMarkAttendance = () => {
    if (!selectedSessionId || !selectedClassId || !selectedSectionId) {
      return;
    }

    const params = new URLSearchParams();

    if (selectedClassId) {
      params.set("classId", selectedClassId);
    }

    if (selectedSectionId) {
      params.set("sectionId", selectedSectionId);
    }

    params.set("date", new Date().toISOString().slice(0, 10));

    navigate(`/school-admin/attendance/mark?${params.toString()}`);
  };

  // ============================================
  // STUDENT DETAILS
  // ============================================

  const handleStudentClick = (item: MonthlyStudentSummary) => {
    if (!selectedSessionId) {
      return;
    }

    const params = new URLSearchParams();

    params.set("month", String(selectedMonth));

    params.set("year", String(selectedYear));

    navigate(
      `/school-admin/attendance/student/${item.student._id}?${params.toString()}`,
    );
  };

  // ============================================
  // YEAR OPTIONS
  // ============================================

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();

    return [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-5 md:p-8">
      {/* ========================================
          HEADER
      ======================================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Attendance</span>

            <Icon icon="lucide:chevron-right" />

            <span className="font-medium text-gray-900">
              Student Attendance
            </span>
          </div>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Monthly Attendance
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Monitor monthly attendance trends for the academic session selected
            in the topbar.
          </p>

          <div className="mt-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <Icon icon="lucide:calendar-range" />

              {selectedSession
                ? `Academic Session: ${selectedSession.name}`
                : "No academic session selected"}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleDailyView}
            disabled={
              !selectedSessionId || !selectedClassId || !selectedSectionId
            }
            className="flex min-h-11 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon icon="lucide:calendar" />
            Daily View
          </button>

          <button
            onClick={handleMarkAttendance}
            disabled={
              !selectedSessionId || !selectedClassId || !selectedSectionId
            }
            className="flex min-h-11 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon icon="lucide:check-square" />
            Mark Attendance
          </button>
        </div>
      </div>

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
              Monthly attendance, classes and sections are session-wise.
            </p>
          </div>
        </div>
      )}

      {/* ========================================
          FILTERS
      ======================================== */}

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* CLASS */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Class
            </label>

            <select
              value={selectedClassId}
              disabled={!selectedSessionId}
              onChange={(e) => handleClassChange(e.target.value)}
              className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm disabled:bg-gray-100"
            >
              <option value="">Select Class</option>

              {availableClasses.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* SECTION */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Section
            </label>

            <select
              value={selectedSectionId}
              disabled={!selectedClassId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm disabled:bg-gray-100"
            >
              <option value="">Select Section</option>

              {availableSections.map((section) => (
                <option key={section._id} value={section._id}>
                  Section {section.name}
                </option>
              ))}
            </select>
          </div>

          {/* MONTH */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Month
            </label>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm"
            >
              {monthOptions.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          {/* YEAR */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Year
            </label>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm"
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* ========================================
          ERROR
      ======================================== */}

      {error && (
        <div className="mt-5 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <span>{error}</span>

          <button onClick={() => dispatch(clearAttendanceError())}>
            <Icon icon="lucide:x" />
          </button>
        </div>
      )}

      {/* ========================================
          TABLE
      ======================================== */}

      <section className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-5">
          <h2 className="text-lg font-bold text-gray-900">
            {selectedClass?.name || "Class"}

            {" · Section "}

            {selectedSection?.name || "-"}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {getMonthLabel(selectedMonth, selectedYear)}
            {" · "}
            {monthlySummary?.workingDays || 0} working days
            {selectedSession?.name ? ` · ${selectedSession.name}` : ""}
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-72 flex-col items-center justify-center gap-3">
            <Icon
              icon="lucide:loader-2"
              className="animate-spin text-4xl text-blue-600"
            />

            <p className="text-sm text-gray-500">
              Loading monthly attendance...
            </p>
          </div>
        ) : !selectedSessionId || !selectedClassId || !selectedSectionId ? (
          <EmptyState
            title="Select filters"
            description="Topbar se academic session select karo, phir class aur section choose karo."
          />
        ) : students.length === 0 ? (
          <EmptyState
            title="No attendance data"
            description="Selected month ke liye attendance records nahi mile."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4">Student</th>

                  <th className="px-4 py-4">Roll Number</th>

                  <th className="px-4 py-4">Present Days</th>

                  <th className="px-4 py-4">Absent Days</th>

                  <th className="px-4 py-4">Leave Days</th>

                  <th className="px-4 py-4">Half Days</th>

                  <th className="px-4 py-4">Working Days</th>

                  <th className="px-4 py-4">Attendance Percentage</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {paginatedStudents.map((item) => {
                  const student = item.student;

                  const studentName = getStudentName(student);

                  const isLowAttendance = item.below75;

                  return (
                    <tr key={student._id} className="hover:bg-gray-50">
                      {/* STUDENT */}

                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleStudentClick(item)}
                          className="flex items-center gap-3 text-left"
                        >
                          {student.profileImage ? (
                            <img
                              src={student.profileImage}
                              alt={studentName}
                              className="h-10 w-10 rounded-full border border-gray-200 object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                              {getInitials(
                                student.firstName || student.name,
                                student.lastName,
                              )}
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-gray-900 hover:text-blue-600">
                              {studentName}
                            </p>

                            {student.admissionNumber && (
                              <p className="mt-0.5 text-xs text-gray-500">
                                {student.admissionNumber}
                              </p>
                            )}
                          </div>
                        </button>
                      </td>

                      {/* ROLL */}

                      <td className="px-4 py-4 font-medium">
                        {student.rollNumber || "-"}
                      </td>

                      {/* PRESENT */}

                      <td className="px-4 py-4 font-semibold text-green-600">
                        {item.presentDays}
                      </td>

                      {/* ABSENT */}

                      <td className="px-4 py-4 font-semibold text-red-600">
                        {item.absentDays}
                      </td>

                      {/* LEAVE */}

                      <td className="px-4 py-4 text-amber-600">
                        {item.leaveDays}
                      </td>

                      {/* HALF DAY */}

                      <td className="px-4 py-4 text-blue-600">
                        {item.halfDays}
                      </td>

                      {/* WORKING DAYS */}

                      <td className="px-4 py-4 text-gray-600">
                        {item.workingDays}
                      </td>

                      {/* PERCENTAGE */}

                      <td className="px-4 py-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`font-bold ${
                              isLowAttendance ? "text-red-600" : "text-gray-900"
                            }`}
                          >
                            {item.attendancePercentage}%
                          </span>

                          {isLowAttendance && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                              <Icon icon="lucide:triangle-alert" />
                              Attendance below 75%
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ======================================
            PAGINATION
        ====================================== */}

        {students.length > 0 && (
          <div className="flex flex-col gap-4 border-t border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, students.length)} of{" "}
              {students.length} students
            </p>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  setCurrentPage((previous) => Math.max(1, previous - 1))
                }
                disabled={currentPage <= 1}
                className="min-h-10 rounded-lg border border-gray-300 px-4 text-sm font-semibold disabled:opacity-40"
              >
                Previous
              </button>

              <button
                onClick={() =>
                  setCurrentPage((previous) =>
                    Math.min(totalPages, previous + 1),
                  )
                }
                disabled={currentPage >= totalPages}
                className="min-h-10 rounded-lg border border-gray-300 px-4 text-sm font-semibold disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

// ============================================
// EMPTY STATE
// ============================================

const EmptyState = ({
  title,
  description,
}: {
  title: string;

  description: string;
}) => {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
        <Icon icon="lucide:calendar-x" className="text-2xl text-gray-400" />
      </div>

      <h3 className="mt-4 text-lg font-bold text-gray-900">{title}</h3>

      <p className="mt-1 max-w-md text-sm text-gray-500">{description}</p>
    </div>
  );
};

export default MonthlyAttendance;
