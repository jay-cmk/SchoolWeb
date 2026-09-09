import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getTeachers } from "../../../features/teachers/teacher.slice";
import type { TeacherData } from "../../../features/teachers/teacher.types";
import {
  clearTeacherAttendanceError,
  clearTeacherAttendanceSuccess,
  getTeacherAttendance,
  markBulkTeacherAttendance,
} from "../../../features/teacherAttendance/teacherAttendance.slice";
import {
  TeacherAttendanceStatus,
} from "../../../features/teacherAttendance/teacherAttendance.types";
import type {
  TeacherAttendanceData,
  TeacherAttendanceInput,
  TeacherAttendanceStatus as TeacherAttendanceStatusType,
} from "../../../features/teacherAttendance/teacherAttendance.types";

interface AttendanceRow {
  status: TeacherAttendanceStatusType;
  checkInTime: string;
  checkOutTime: string;
  remarks: string;
}

const STATUS_OPTIONS: Array<{
  value: TeacherAttendanceStatusType;
  label: string;
  activeClass: string;
}> = [
  {
    value: TeacherAttendanceStatus.PRESENT,
    label: "Present",
    activeClass: "border-emerald-500 bg-emerald-50 text-emerald-700",
  },
  {
    value: TeacherAttendanceStatus.ABSENT,
    label: "Absent",
    activeClass: "border-red-500 bg-red-50 text-red-700",
  },
  {
    value: TeacherAttendanceStatus.LEAVE,
    label: "Leave",
    activeClass: "border-amber-500 bg-amber-50 text-amber-700",
  },
  {
    value: TeacherAttendanceStatus.HALF_DAY,
    label: "Half Day",
    activeClass: "border-violet-500 bg-violet-50 text-violet-700",
  },
];

const getToday = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const defaultRow = (): AttendanceRow => ({
  status: TeacherAttendanceStatus.PRESENT,
  checkInTime: "",
  checkOutTime: "",
  remarks: "",
});

const getTeacherId = (
  teacher: TeacherAttendanceData["teacherId"],
): string => (typeof teacher === "string" ? teacher : teacher._id);

const MarkTeacherAttendance = () => {
  const dispatch = useAppDispatch();

  const { teachers, loading: teachersLoading } = useAppSelector(
    (state) => state.teachers,
  );

  const {
    attendance,
    loading,
    saving,
    error,
    successMessage,
  } = useAppSelector((state) => state.teacherAttendance);

  const [selectedDate, setSelectedDate] = useState(getToday());
  const [searchQuery, setSearchQuery] = useState("");
  const [rows, setRows] = useState<Record<string, AttendanceRow>>({});

  const activeTeachers = useMemo(
    () => teachers.filter((teacher) => teacher.isActive !== false),
    [teachers],
  );

  const filteredTeachers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return activeTeachers;

    return activeTeachers.filter((teacher) =>
      [teacher.name, teacher.employeeId, teacher.email, teacher.mobile]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [activeTeachers, searchQuery]);

  useEffect(() => {
    dispatch(getTeachers(undefined));
  }, [dispatch]);

  useEffect(() => {
    if (!selectedDate) return;

    dispatch(clearTeacherAttendanceError());
    dispatch(clearTeacherAttendanceSuccess());
    dispatch(getTeacherAttendance({ date: selectedDate }));
  }, [dispatch, selectedDate]);

  useEffect(() => {
    const existingByTeacher = new Map(
      attendance.map((record) => [getTeacherId(record.teacherId), record]),
    );

    const nextRows: Record<string, AttendanceRow> = {};

    activeTeachers.forEach((teacher) => {
      const existing = existingByTeacher.get(teacher._id);

      nextRows[teacher._id] = existing
        ? {
            status: existing.status,
            checkInTime: existing.checkInTime ?? "",
            checkOutTime: existing.checkOutTime ?? "",
            remarks: existing.remarks ?? "",
          }
        : defaultRow();
    });

    setRows(nextRows);
  }, [activeTeachers, attendance]);

  const updateRow = (
    teacherId: string,
    changes: Partial<AttendanceRow>,
  ) => {
    setRows((previous) => ({
      ...previous,
      [teacherId]: {
        ...(previous[teacherId] ?? defaultRow()),
        ...changes,
      },
    }));
  };

  const markAll = (status: TeacherAttendanceStatusType) => {
    setRows((previous) => {
      const nextRows = { ...previous };

      activeTeachers.forEach((teacher) => {
        nextRows[teacher._id] = {
          ...(nextRows[teacher._id] ?? defaultRow()),
          status,
        };
      });

      return nextRows;
    });
  };

  const statusCounts = useMemo(() => {
    const counts = {
      present: 0,
      absent: 0,
      leave: 0,
      halfDay: 0,
    };

    activeTeachers.forEach((teacher) => {
      const status = rows[teacher._id]?.status;

      if (status === TeacherAttendanceStatus.PRESENT) counts.present += 1;
      if (status === TeacherAttendanceStatus.ABSENT) counts.absent += 1;
      if (status === TeacherAttendanceStatus.LEAVE) counts.leave += 1;
      if (status === TeacherAttendanceStatus.HALF_DAY) counts.halfDay += 1;
    });

    return counts;
  }, [activeTeachers, rows]);

  const handleSubmit = async () => {
    if (!selectedDate || activeTeachers.length === 0) return;

    const attendancePayload: TeacherAttendanceInput[] = activeTeachers.map(
      (teacher) => {
        const row = rows[teacher._id] ?? defaultRow();
        const item: TeacherAttendanceInput = {
          teacherId: teacher._id,
          status: row.status,
        };

        if (row.checkInTime) item.checkInTime = row.checkInTime;
        if (row.checkOutTime) item.checkOutTime = row.checkOutTime;
        if (row.remarks.trim()) item.remarks = row.remarks.trim();

        return item;
      },
    );

    try {
      await dispatch(
        markBulkTeacherAttendance({
          date: selectedDate,
          attendance: attendancePayload,
        }),
      ).unwrap();
    } catch {
      // Redux state displays the backend error.
    }
  };

  const pageLoading = teachersLoading || loading;

  return (
    <div className="min-h-full bg-[#F6F8FC] p-4 sm:p-6">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-[#64748B]">
              <span>Teacher Attendance</span>
              <Icon icon="lucide:chevron-right" />
              <span className="font-semibold text-[#15243B]">Mark Attendance</span>
            </div>
            <h1 className="text-2xl font-bold text-[#15243B] sm:text-3xl">
              Mark Teacher Attendance
            </h1>
            <p className="mt-1 text-sm text-[#64748B]">
              Mark attendance for all active teachers on the selected date.
            </p>
          </div>

          <div className="w-full rounded-xl border border-[#D8E0EC] bg-white p-3 shadow-sm sm:w-auto">
            <label htmlFor="attendance-date" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#64748B]">
              Attendance date
            </label>
            <input
              id="attendance-date"
              type="date"
              value={selectedDate}
              max={getToday()}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2 text-sm font-semibold text-[#15243B] outline-none focus:border-[#2563EB] sm:w-52"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <div className="flex items-start gap-2">
              <Icon icon="lucide:circle-alert" className="mt-0.5 text-lg" />
              <span>{error}</span>
            </div>
            <button type="button" onClick={() => dispatch(clearTeacherAttendanceError())}>
              <Icon icon="lucide:x" className="text-lg" />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="flex items-start justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <div className="flex items-start gap-2">
              <Icon icon="lucide:circle-check" className="mt-0.5 text-lg" />
              <span>{successMessage}</span>
            </div>
            <button type="button" onClick={() => dispatch(clearTeacherAttendanceSuccess())}>
              <Icon icon="lucide:x" className="text-lg" />
            </button>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <SummaryCard label="Active Teachers" value={activeTeachers.length} icon="lucide:users" color="blue" />
          <SummaryCard label="Present" value={statusCounts.present} icon="lucide:user-check" color="green" />
          <SummaryCard label="Absent" value={statusCounts.absent} icon="lucide:user-x" color="red" />
          <SummaryCard label="Leave" value={statusCounts.leave} icon="lucide:calendar-off" color="amber" />
          <SummaryCard label="Half Day" value={statusCounts.halfDay} icon="lucide:clock-3" color="violet" />
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#DDE3EC] bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-[#E2E8F0] p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Icon icon="lucide:search" className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-[#94A3B8]" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search teacher, employee ID or email..."
                className="w-full rounded-xl border border-[#CBD5E1] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#2563EB]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase text-[#64748B]">Mark all:</span>
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => markAll(option.value)}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${option.activeClass}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {pageLoading ? (
            <div className="flex min-h-72 items-center justify-center">
              <Icon icon="lucide:loader-circle" className="animate-spin text-4xl text-[#2563EB]" />
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center p-6 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
                <Icon icon="lucide:users" className="text-3xl" />
              </div>
              <h2 className="text-lg font-bold text-[#15243B]">No teachers found</h2>
              <p className="mt-1 text-sm text-[#64748B]">
                No active teacher matches the current search.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1180px] border-collapse text-left">
                <thead className="bg-[#F8FAFC] text-xs uppercase tracking-wide text-[#64748B]">
                  <tr>
                    <th className="px-5 py-4">Teacher</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Check in</th>
                    <th className="px-5 py-4">Check out</th>
                    <th className="px-5 py-4">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {filteredTeachers.map((teacher) => {
                    const row = rows[teacher._id] ?? defaultRow();

                    return (
                      <tr key={teacher._id} className="align-top hover:bg-[#FAFCFF]">
                        <td className="px-5 py-4">
                          <TeacherCell teacher={teacher} />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex min-w-[310px] flex-wrap gap-2">
                            {STATUS_OPTIONS.map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => updateRow(teacher._id, { status: option.value })}
                                className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                                  row.status === option.value
                                    ? option.activeClass
                                    : "border-[#CBD5E1] bg-white text-[#64748B] hover:bg-[#F8FAFC]"
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <input
                            type="time"
                            value={row.checkInTime}
                            disabled={row.status === TeacherAttendanceStatus.ABSENT || row.status === TeacherAttendanceStatus.LEAVE}
                            onChange={(event) => updateRow(teacher._id, { checkInTime: event.target.value })}
                            className="rounded-lg border border-[#CBD5E1] px-3 py-2 text-sm outline-none disabled:bg-[#F1F5F9] disabled:text-[#94A3B8]"
                          />
                        </td>
                        <td className="px-5 py-4">
                          <input
                            type="time"
                            value={row.checkOutTime}
                            disabled={row.status === TeacherAttendanceStatus.ABSENT || row.status === TeacherAttendanceStatus.LEAVE}
                            onChange={(event) => updateRow(teacher._id, { checkOutTime: event.target.value })}
                            className="rounded-lg border border-[#CBD5E1] px-3 py-2 text-sm outline-none disabled:bg-[#F1F5F9] disabled:text-[#94A3B8]"
                          />
                        </td>
                        <td className="px-5 py-4">
                          <input
                            type="text"
                            value={row.remarks}
                            maxLength={500}
                            onChange={(event) => updateRow(teacher._id, { remarks: event.target.value })}
                            placeholder="Optional remarks"
                            className="w-full min-w-56 rounded-lg border border-[#CBD5E1] px-3 py-2 text-sm outline-none focus:border-[#2563EB]"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-[#E2E8F0] bg-[#F8FAFC] p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#64748B]">
              Saving will create or update attendance for all {activeTeachers.length} active teachers.
            </p>
            <button
              type="button"
              disabled={saving || loading || !selectedDate || activeTeachers.length === 0}
              onClick={handleSubmit}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#1F5FAE] px-6 font-semibold text-white shadow-sm transition hover:bg-[#174D91] disabled:cursor-not-allowed disabled:bg-[#AFC2D9]"
            >
              <Icon icon={saving ? "lucide:loader-circle" : "lucide:save"} className={saving ? "animate-spin text-lg" : "text-lg"} />
              {saving ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SummaryCardProps {
  label: string;
  value: number;
  icon: string;
  color: "blue" | "green" | "red" | "amber" | "violet";
}

const CARD_COLORS: Record<SummaryCardProps["color"], string> = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-emerald-50 text-emerald-600",
  red: "bg-red-50 text-red-600",
  amber: "bg-amber-50 text-amber-600",
  violet: "bg-violet-50 text-violet-600",
};

const SummaryCard = ({ label, value, icon, color }: SummaryCardProps) => (
  <div className="rounded-2xl border border-[#DDE3EC] bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-[#64748B]">{label}</p>
        <p className="mt-2 text-3xl font-bold text-[#15243B]">{value}</p>
      </div>
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${CARD_COLORS[color]}`}>
        <Icon icon={icon} className="text-xl" />
      </div>
    </div>
  </div>
);

const TeacherCell = ({ teacher }: { teacher: TeacherData }) => {
  const initial = teacher.name?.trim().charAt(0).toUpperCase() || "T";

  return (
    <div className="flex min-w-60 items-center gap-3">
      {teacher.profileImage ? (
        <img src={teacher.profileImage} alt={teacher.name} className="h-11 w-11 rounded-xl object-cover" />
      ) : (
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F0FB] font-bold text-[#1F5FAE]">
          {initial}
        </div>
      )}
      <div>
        <p className="font-semibold text-[#15243B]">{teacher.name}</p>
        <p className="text-xs text-[#64748B]">
          {teacher.employeeId} · {teacher.email}
        </p>
      </div>
    </div>
  );
};

export default MarkTeacherAttendance;
