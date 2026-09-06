import React, { useEffect, useMemo, useState } from "react";

import { Icon } from "@iconify/react";

import { useNavigate, useSearchParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";

import {
  getAttendance,
  updateAttendance,
  clearAttendance,
  clearAttendanceError,
} from "../../../features/attendance/attendance.slice";

import type {
  AttendanceData,
  AttendanceStatus,
} from "../../../features/attendance/attendance.types";

// ============================================
// LOCAL TYPES
// ============================================

interface EditableAttendance {
  attendanceId: string;

  studentId: string;

  firstName: string;

  lastName?: string;

  profileImage?: string;

  admissionNumber?: string;

  rollNumber?: number;

  status: AttendanceStatus;

  remarks: string;
}

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

const getRelationName = (value: unknown): string => {
  if (!value || typeof value !== "object" || !("name" in value)) {
    return "";
  }

  const name = (
    value as {
      name?: unknown;
    }
  ).name;

  return typeof name === "string" ? name : "";
};

const formatDisplayDate = (date: string): string => {
  if (!date) {
    return "-";
  }

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getInitials = (firstName: string, lastName?: string): string => {
  return `${firstName.charAt(0)}${lastName?.charAt(0) || ""}`.toUpperCase();
};

// ============================================
// MAIN COMPONENT
// ============================================

const UpdateAttendance: React.FC = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  // ============================================
  // QUERY PARAMS
  // ============================================

  const classId = searchParams.get("classId") || "";

  const sectionId = searchParams.get("sectionId") || "";

  const date = searchParams.get("date") || "";

  // ============================================
  // REDUX
  // ============================================

  const { attendance, loading, saving, error } = useAppSelector(
    (state) => state.attendance,
  );

  const { selectedSessionId } = useAppSelector(
    (state) => state.sessionSelection,
  );

  const sessionId = selectedSessionId || "";

  // ============================================
  // LOCAL STATE
  // ============================================

  const [students, setStudents] = useState<EditableAttendance[]>([]);

  const [originalStudents, setOriginalStudents] = useState<
    EditableAttendance[]
  >([]);

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  // ============================================
  // VALIDATE QUERY PARAMS
  // ============================================

  const hasRequiredParams = Boolean(sessionId && classId && sectionId && date);

  // ============================================
  // LOAD EXISTING ATTENDANCE
  // ============================================

  useEffect(() => {
    if (!hasRequiredParams) {
      return;
    }

    dispatch(
      getAttendance({
        sessionId,
        classId,
        sectionId,
        date,
      }),
    );

    return () => {
      dispatch(clearAttendance());

      dispatch(clearAttendanceError());
    };
  }, [dispatch, sessionId, classId, sectionId, date, hasRequiredParams]);

  // ============================================
  // CONVERT API DATA TO EDITABLE DATA
  // ============================================

  useEffect(() => {
    if (!attendance.length) {
      setStudents([]);

      setOriginalStudents([]);

      return;
    }

    const mapped: EditableAttendance[] = attendance.map(
      (item: AttendanceData) => {
        const student =
          typeof item.studentId === "object" ? item.studentId : null;

        return {
          attendanceId: item._id,

          studentId: getRelationId(item.studentId),

          firstName: student?.firstName || "Student",

          lastName: student?.lastName,

          profileImage: student?.profileImage,

          admissionNumber: student?.admissionNumber,

          rollNumber: student?.rollNumber,

          status: item.status,

          remarks: item.remarks || "",
        };
      },
    );

    setStudents(mapped);

    setOriginalStudents(
      mapped.map((item) => ({
        ...item,
      })),
    );
  }, [attendance]);

  // ============================================
  // CLASS / SECTION / SESSION META
  // ============================================

  const firstAttendance = attendance[0];

  const className = getRelationName(firstAttendance?.classId);

  const sectionName = getRelationName(firstAttendance?.sectionId);

  // ============================================
  // CHANGED STUDENTS
  // ============================================

  const changedStudents = useMemo(() => {
    return students.filter((student) => {
      const original = originalStudents.find(
        (item) => item.attendanceId === student.attendanceId,
      );

      if (!original) {
        return false;
      }

      return (
        original.status !== student.status ||
        original.remarks !== student.remarks
      );
    });
  }, [students, originalStudents]);

  const changedCount = changedStudents.length;

  // ============================================
  // STATUS CHANGE
  // ============================================

  const handleStatusChange = (
    attendanceId: string,
    status: AttendanceStatus,
  ) => {
    setStudents((previous) =>
      previous.map((student) =>
        student.attendanceId === attendanceId
          ? {
              ...student,
              status,
            }
          : student,
      ),
    );
  };

  // ============================================
  // REMARK CHANGE
  // ============================================

  const handleRemarkChange = (attendanceId: string, remarks: string) => {
    setStudents((previous) =>
      previous.map((student) =>
        student.attendanceId === attendanceId
          ? {
              ...student,
              remarks,
            }
          : student,
      ),
    );
  };

  // ============================================
  // MARK ALL PRESENT
  // ============================================

  const handleMarkAllPresent = () => {
    setStudents((previous) =>
      previous.map((student) => ({
        ...student,

        status: "PRESENT",
      })),
    );
  };

  // ============================================
  // CANCEL CHANGES
  // ============================================

  const handleCancelChanges = () => {
    setStudents(
      originalStudents.map((student) => ({
        ...student,
      })),
    );
  };

  // ============================================
  // UPDATE BUTTON
  // ============================================

  const handleUpdateClick = () => {
    if (changedCount === 0) {
      return;
    }

    setIsConfirmationOpen(true);
  };

  // ============================================
  // SAVE CHANGES
  // ============================================

  const handleConfirmUpdate = async () => {
    setIsConfirmationOpen(false);

    if (changedStudents.length === 0) {
      return;
    }

    try {
      /*
       * IMPORTANT:
       *
       * Backend update API single attendance
       * record update karti hai.
       *
       * Isliye sirf changed records ko
       * updateAttendance() dispatch karenge.
       */

      for (const student of changedStudents) {
        await dispatch(
          updateAttendance({
            attendanceId: student.attendanceId,

            data: {
              status: student.status,

              remarks: student.remarks,
            },
          }),
        ).unwrap();
      }

      // ======================================
      // REFETCH AFTER UPDATE
      // ======================================

      await dispatch(
        getAttendance({
          sessionId,
          classId,
          sectionId,
          date,
        }),
      ).unwrap();

      setSuccessMessage(
        `${changedStudents.length} attendance record${
          changedStudents.length > 1 ? "s" : ""
        } updated successfully.`,
      );

      window.setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch {
      /*
       * Redux already stores
       * backend error in state.error.
       */
    }
  };

  // ============================================
  // BACK TO DAILY VIEW
  // ============================================

  const handleBackToDailyView = () => {
    const params = new URLSearchParams();

    if (sessionId) {
      params.set("sessionId", sessionId);
    }

    if (classId) {
      params.set("classId", classId);
    }

    if (sectionId) {
      params.set("sectionId", sectionId);
    }

    if (date) {
      params.set("date", date);
    }

    navigate(`/school-admin/attendance/daily?${params.toString()}`);
  };

  // ============================================
  // MISSING PARAMS
  // ============================================

  if (!hasRequiredParams) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-2xl rounded-xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex gap-3">
            <Icon
              icon="lucide:triangle-alert"
              className="mt-0.5 text-2xl text-amber-600"
            />

            <div>
              <h2 className="font-bold text-amber-800">
                Attendance information missing
              </h2>

              <p className="mt-1 text-sm text-amber-700">
                Select an academic session from the topbar. Class, section and
                attendance date are also required.
              </p>

              <button
                onClick={() => navigate("/school-admin/attendance/daily")}
                className="mt-4 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Go to Daily Attendance
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // PAGE
  // ============================================

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <main className="mx-auto w-full max-w-7xl space-y-6 p-5 md:p-8">
        {/* ======================================
            HEADER
        ====================================== */}

        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="flex items-center gap-1 text-sm text-gray-500">
              <span>Attendance</span>

              <Icon
                icon="lucide:chevron-right"
                className="h-3 w-3 text-gray-400"
              />

              <span>Daily Attendance</span>

              <Icon
                icon="lucide:chevron-right"
                className="h-3 w-3 text-gray-400"
              />

              <span className="font-medium text-gray-900">Update</span>
            </p>

            <h1 className="mt-2 text-2xl font-bold text-gray-900">
              Update Attendance
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Review changes carefully before updating the existing attendance
              record. Academic session is controlled from the topbar.
            </p>
          </div>

          <button
            onClick={handleBackToDailyView}
            className="flex min-h-11 items-center gap-2 self-start rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 md:self-auto"
          >
            <Icon icon="lucide:arrow-left" className="h-4 w-4" />
            Back to Daily View
          </button>
        </div>

        {/* ======================================
            WARNING
        ====================================== */}

        <section className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex gap-3">
            <Icon
              icon="lucide:triangle-alert"
              className="mt-0.5 shrink-0 text-xl text-yellow-600"
            />

            <div>
              <p className="font-semibold text-yellow-800">
                Attendance has already been recorded for this date.
              </p>

              <p className="mt-1 text-sm text-yellow-700">
                Editing this record will update the saved statuses
                {className ? ` for ${className}` : ""}
                {sectionName ? `, Section ${sectionName}` : ""}
                {" on "}
                {formatDisplayDate(date)}.
              </p>
            </div>
          </div>
        </section>

        {/* ======================================
            METADATA
        ====================================== */}

        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-gray-500">Class & Section</p>

              <p className="mt-1 font-semibold text-gray-900">
                {className || "Class"}

                {" · "}

                {sectionName || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Attendance Date</p>

              <p className="mt-1 font-semibold text-gray-900">
                {formatDisplayDate(date)}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Total Students</p>

              <p className="mt-1 font-semibold text-gray-900">
                {students.length}
              </p>
            </div>
          </div>
        </section>

        {/* ======================================
            ERROR
        ====================================== */}

        {error && (
          <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-3">
              <Icon icon="lucide:circle-x" className="text-xl text-red-600" />

              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>

            <button
              onClick={() => dispatch(clearAttendanceError())}
              className="text-red-600"
            >
              <Icon icon="lucide:x" />
            </button>
          </div>
        )}

        {/* ======================================
            SUCCESS
        ====================================== */}

        {successMessage && (
          <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
            <Icon
              icon="lucide:circle-check"
              className="text-xl text-green-600"
            />

            <p className="text-sm font-medium text-green-700">
              {successMessage}
            </p>
          </div>
        )}

        {/* ======================================
            LOADING
        ====================================== */}

        {loading ? (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-gray-200 bg-white">
            <Icon
              icon="lucide:loader-2"
              className="animate-spin text-4xl text-blue-600"
            />

            <p className="mt-3 text-sm text-gray-500">
              Loading existing attendance...
            </p>
          </div>
        ) : students.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-8 text-center">
            <Icon icon="lucide:calendar-x" className="text-4xl text-gray-400" />

            <h3 className="mt-3 text-lg font-bold text-gray-900">
              No attendance record found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Is class, section aur date ke liye existing attendance nahi mili.
            </p>
          </div>
        ) : (
          /* ====================================
              STUDENT TABLE
          ==================================== */

          <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* TABLE HEADER */}

            <div className="flex flex-col gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Student Statuses
                </h2>

                <p className="text-sm text-gray-500">
                  {changedCount} {changedCount === 1 ? "student" : "students"}
                  {" changed of "}
                  {students.length} total
                </p>
              </div>

              <button
                type="button"
                onClick={handleMarkAllPresent}
                disabled={saving}
                className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Icon icon="lucide:check-check" className="h-4 w-4" />
                Mark All Present
              </button>
            </div>

            {/* TABLE */}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50/50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold">Student</th>

                    <th className="px-4 py-3.5 font-semibold">Admission No.</th>

                    <th className="px-4 py-3.5 font-semibold">Roll No.</th>

                    <th className="px-4 py-3.5 font-semibold">Status</th>

                    <th className="px-4 py-3.5 font-semibold">Remarks</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {students.map((student) => {
                    const original = originalStudents.find(
                      (item) => item.attendanceId === student.attendanceId,
                    );

                    const changed = original
                      ? original.status !== student.status ||
                        original.remarks !== student.remarks
                      : false;

                    return (
                      <tr
                        key={student.attendanceId}
                        className={
                          changed
                            ? "bg-blue-50/40"
                            : "transition-colors hover:bg-gray-50/40"
                        }
                      >
                        {/* STUDENT */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {student.profileImage ? (
                              <img
                                src={student.profileImage}
                                alt={student.firstName}
                                className="h-10 w-10 rounded-full border border-gray-200 object-cover"
                              />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                                {getInitials(
                                  student.firstName,
                                  student.lastName,
                                )}
                              </div>
                            )}

                            <div>
                              <p className="font-semibold text-gray-900">
                                {student.firstName} {student.lastName}
                              </p>

                              {changed && (
                                <span className="mt-1 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-700">
                                  Changed
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* ADMISSION */}

                        <td className="px-4 py-4 font-mono text-xs text-gray-500">
                          {student.admissionNumber || "-"}
                        </td>

                        {/* ROLL */}

                        <td className="px-4 py-4 font-medium text-gray-900">
                          {student.rollNumber || "-"}
                        </td>

                        {/* STATUS */}

                        <td className="px-4 py-4">
                          <div className="inline-flex rounded-lg border border-gray-200 bg-gray-100/30 p-1">
                            <StatusButton
                              label="Present"
                              active={student.status === "PRESENT"}
                              activeClass="bg-green-600 text-white shadow-sm"
                              onClick={() =>
                                handleStatusChange(
                                  student.attendanceId,
                                  "PRESENT",
                                )
                              }
                            />

                            <StatusButton
                              label="Absent"
                              active={student.status === "ABSENT"}
                              activeClass="bg-red-600 text-white shadow-sm"
                              onClick={() =>
                                handleStatusChange(
                                  student.attendanceId,
                                  "ABSENT",
                                )
                              }
                            />

                            <StatusButton
                              label="Leave"
                              active={student.status === "LEAVE"}
                              activeClass="bg-amber-500 text-white shadow-sm"
                              onClick={() =>
                                handleStatusChange(
                                  student.attendanceId,
                                  "LEAVE",
                                )
                              }
                            />

                            <StatusButton
                              label="Half Day"
                              active={student.status === "HALF_DAY"}
                              activeClass="bg-blue-600 text-white shadow-sm"
                              onClick={() =>
                                handleStatusChange(
                                  student.attendanceId,
                                  "HALF_DAY",
                                )
                              }
                            />
                          </div>
                        </td>

                        {/* REMARK */}

                        <td className="px-4 py-4">
                          <div className="relative flex max-w-xs items-center">
                            <input
                              type="text"
                              placeholder="Optional remark"
                              value={student.remarks}
                              disabled={saving}
                              onChange={(event) =>
                                handleRemarkChange(
                                  student.attendanceId,
                                  event.target.value,
                                )
                              }
                              className="min-h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 pr-9 text-sm text-gray-900 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            />

                            {student.remarks && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemarkChange(student.attendanceId, "")
                                }
                                className="absolute right-2.5 text-gray-400 hover:text-gray-700"
                              >
                                <Icon icon="lucide:x" className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ==================================
                FOOTER
            ================================== */}

            <div className="flex flex-col gap-3 border-t border-gray-200 p-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCancelChanges}
                disabled={changedCount === 0 || saving}
                className="min-h-11 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel Changes
              </button>

              <button
                type="button"
                onClick={handleUpdateClick}
                disabled={changedCount === 0 || saving}
                className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Icon icon="lucide:loader-2" className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Icon icon="lucide:save" />
                    Update Attendance
                    {changedCount > 0 && ` (${changedCount})`}
                  </>
                )}
              </button>
            </div>
          </section>
        )}
      </main>

      {/* ========================================
          CONFIRMATION DIALOG
      ======================================== */}

      {isConfirmationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl">
            <button
              type="button"
              onClick={() => setIsConfirmationOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-700"
            >
              <Icon icon="lucide:x" className="h-5 w-5" />
            </button>

            <div className="flex items-start gap-4">
              <div className="shrink-0 rounded-full bg-yellow-50 p-3 text-yellow-600">
                <Icon icon="lucide:triangle-alert" className="text-2xl" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Update Attendance?
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  You changed <strong>{changedCount}</strong>{" "}
                  {changedCount === 1 ? "student" : "students"}. These existing
                  attendance records will be updated.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsConfirmationOpen(false)}
                className="min-h-11 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmUpdate}
                className="min-h-11 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// STATUS BUTTON
// ============================================

const StatusButton = ({
  label,
  active,
  activeClass,
  onClick,
}: {
  label: string;

  active: boolean;

  activeClass: string;

  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
        active ? activeClass : "text-gray-500 hover:text-gray-900"
      }`}
    >
      {label}
    </button>
  );
};

export default UpdateAttendance;
