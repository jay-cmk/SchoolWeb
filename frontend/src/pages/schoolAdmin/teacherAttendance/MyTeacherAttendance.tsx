import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  clearMyTeacherAttendance,
  clearTeacherAttendanceError,
  getMyTeacherAttendance,
} from "../../../features/teacherAttendance/teacherAttendance.slice";
import {
  TeacherAttendanceStatus,
} from "../../../features/teacherAttendance/teacherAttendance.types";
import type {
  TeacherAttendanceData,
  TeacherAttendanceStatus as TeacherAttendanceStatusType,
} from "../../../features/teacherAttendance/teacherAttendance.types";

type StatusFilter = "ALL" | TeacherAttendanceStatusType;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const currentDate = new Date();

const formatDate = (value: string): string =>
  new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

const formatStatus = (status: string): string =>
  status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const statusClass = (status: TeacherAttendanceStatusType): string => {
  switch (status) {
    case TeacherAttendanceStatus.PRESENT:
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case TeacherAttendanceStatus.ABSENT:
      return "border-red-200 bg-red-50 text-red-700";
    case TeacherAttendanceStatus.LEAVE:
      return "border-amber-200 bg-amber-50 text-amber-700";
    default:
      return "border-violet-200 bg-violet-50 text-violet-700";
  }
};

const MyTeacherAttendance = () => {
  const dispatch = useAppDispatch();

  const { myAttendance, loading, error } = useAppSelector(
    (state) => state.teacherAttendance,
  );

  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  useEffect(() => {
    dispatch(clearTeacherAttendanceError());
    dispatch(
      getMyTeacherAttendance({
        month,
        year,
      }),
    );

    return () => {
      dispatch(clearMyTeacherAttendance());
    };
  }, [dispatch, month, year]);

  const filteredRecords = useMemo(() => {
    const records = myAttendance?.attendance ?? [];

    if (statusFilter === "ALL") return records;

    return records.filter((record) => record.status === statusFilter);
  }, [myAttendance, statusFilter]);

  const summary = myAttendance?.summary;
  const teacher = myAttendance?.teacher;
  const percentage = summary?.attendancePercentage ?? 0;

  return (
    <div className="min-h-full bg-[#F6F8FC] p-4 sm:p-6">
      <div className="mx-auto max-w-[1400px] space-y-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold text-[#1F5FAE]">
              Teacher Portal
            </p>
            <h1 className="text-2xl font-bold text-[#15243B] sm:text-3xl">
              My Attendance
            </h1>
            <p className="mt-1 text-sm text-[#64748B]">
              View your monthly attendance summary and daily records.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={month}
              onChange={(event) => setMonth(Number(event.target.value))}
              className="min-h-11 rounded-xl border border-[#CBD5E1] bg-white px-4 text-sm font-semibold outline-none focus:border-[#2563EB]"
            >
              {MONTHS.map((monthName, index) => (
                <option key={monthName} value={index + 1}>
                  {monthName}
                </option>
              ))}
            </select>

            <input
              type="number"
              min={2000}
              max={2100}
              value={year}
              onChange={(event) => setYear(Number(event.target.value))}
              className="min-h-11 w-full rounded-xl border border-[#CBD5E1] bg-white px-4 text-sm font-semibold outline-none focus:border-[#2563EB] sm:w-28"
            />
          </div>
        </header>

        {error && (
          <div className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <div className="flex gap-2">
              <Icon icon="lucide:circle-alert" className="mt-0.5 text-lg" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => dispatch(clearTeacherAttendanceError())}
            >
              <Icon icon="lucide:x" className="text-lg" />
            </button>
          </div>
        )}

        {loading && !myAttendance ? (
          <div className="flex min-h-96 items-center justify-center rounded-2xl border border-[#DDE3EC] bg-white">
            <Icon
              icon="lucide:loader-circle"
              className="animate-spin text-4xl text-[#2563EB]"
            />
          </div>
        ) : !myAttendance ? (
          <EmptyState
            title="Attendance not available"
            text="No attendance information is available for the selected month."
          />
        ) : (
          <>
            <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-[#173F73] to-[#2C78C4] p-6 text-white shadow-lg sm:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  {teacher?.profileImage ? (
                    <img
                      src={teacher.profileImage}
                      alt={teacher.name}
                      className="h-20 w-20 rounded-2xl border border-white/30 object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/30 bg-white/15 text-3xl font-bold">
                      {teacher?.name?.charAt(0).toUpperCase() || "T"}
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-100">
                      Attendance Profile
                    </p>
                    <h2 className="mt-1 text-3xl font-bold">
                      {teacher?.name ?? "Teacher"}
                    </h2>
                    <p className="mt-1 text-sm text-blue-100">
                      {teacher?.employeeId ?? "—"} · {teacher?.email ?? "—"}
                    </p>
                    {teacher?.mobile && (
                      <p className="mt-1 text-sm text-blue-100">
                        {teacher.mobile}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:flex">
                  <div className="rounded-xl border border-white/20 bg-white/10 px-5 py-4">
                    <p className="text-xs font-semibold uppercase text-blue-100">
                      Period
                    </p>
                    <p className="mt-1 font-bold">
                      {MONTHS[month - 1]} {year}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/20 bg-white/10 px-5 py-4">
                    <p className="text-xs font-semibold uppercase text-blue-100">
                      Attendance
                    </p>
                    <p className="mt-1 text-xl font-bold">
                      {percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
              <SummaryCard label="Total Days" value={summary?.totalDays ?? 0} icon="lucide:calendar-days" color="blue" />
              <SummaryCard label="Present" value={summary?.presentDays ?? 0} icon="lucide:circle-check" color="green" />
              <SummaryCard label="Absent" value={summary?.absentDays ?? 0} icon="lucide:circle-x" color="red" />
              <SummaryCard label="Leave" value={summary?.leaveDays ?? 0} icon="lucide:calendar-off" color="amber" />
              <SummaryCard label="Half Day" value={summary?.halfDays ?? 0} icon="lucide:clock-3" color="violet" />
              <SummaryCard label="Percentage" value={`${percentage.toFixed(1)}%`} icon="lucide:chart-no-axes-combined" color={percentage < 75 ? "red" : "green"} />
            </div>

            {percentage < 75 && (summary?.totalDays ?? 0) > 0 && (
              <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-amber-800">
                <Icon icon="lucide:triangle-alert" className="mt-0.5 text-xl" />
                <div>
                  <p className="font-bold">Attendance below 75%</p>
                  <p className="mt-1 text-sm">
                    Your attendance percentage for the selected month is below the expected level.
                  </p>
                </div>
              </div>
            )}

            <section className="overflow-hidden rounded-2xl border border-[#DDE3EC] bg-white shadow-sm">
              <div className="flex flex-col gap-3 border-b border-[#E2E8F0] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#15243B]">
                    Daily Attendance Records
                  </h2>
                  <p className="text-sm text-[#64748B]">
                    {MONTHS[month - 1]} {year} · {myAttendance.attendance.length} records
                  </p>
                </div>

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as StatusFilter)
                  }
                  className="min-h-11 rounded-xl border border-[#CBD5E1] bg-white px-4 text-sm outline-none focus:border-[#2563EB]"
                >
                  <option value="ALL">All Status</option>
                  <option value={TeacherAttendanceStatus.PRESENT}>Present</option>
                  <option value={TeacherAttendanceStatus.ABSENT}>Absent</option>
                  <option value={TeacherAttendanceStatus.LEAVE}>Leave</option>
                  <option value={TeacherAttendanceStatus.HALF_DAY}>Half Day</option>
                </select>
              </div>

              {loading ? (
                <div className="flex min-h-64 items-center justify-center">
                  <Icon
                    icon="lucide:loader-circle"
                    className="animate-spin text-4xl text-[#2563EB]"
                  />
                </div>
              ) : filteredRecords.length === 0 ? (
                <EmptyState
                  title="No daily records"
                  text="No attendance record matches the selected month and status."
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px] border-collapse text-left">
                    <thead className="bg-[#F8FAFC] text-xs uppercase tracking-wide text-[#64748B]">
                      <tr>
                        <th className="px-5 py-4">Date</th>
                        <th className="px-5 py-4">Status</th>
                        <th className="px-5 py-4">Check in</th>
                        <th className="px-5 py-4">Check out</th>
                        <th className="px-5 py-4">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {filteredRecords.map((record) => (
                        <AttendanceRow key={record._id} record={record} />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

const SummaryCard = ({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: string;
  color: "blue" | "green" | "red" | "amber" | "violet";
}) => {
  const colors = {
    blue: "border-blue-100 bg-blue-50 text-blue-700",
    green: "border-emerald-100 bg-emerald-50 text-emerald-700",
    red: "border-red-100 bg-red-50 text-red-700",
    amber: "border-amber-100 bg-amber-50 text-amber-700",
    violet: "border-violet-100 bg-violet-50 text-violet-700",
  };

  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${colors[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{label}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
        </div>
        <Icon icon={icon} className="text-2xl opacity-70" />
      </div>
    </div>
  );
};

const AttendanceRow = ({ record }: { record: TeacherAttendanceData }) => (
  <tr className="hover:bg-[#FAFCFF]">
    <td className="px-5 py-4 font-semibold text-[#334155]">
      {formatDate(record.date)}
    </td>
    <td className="px-5 py-4">
      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(record.status)}`}>
        {formatStatus(record.status)}
      </span>
    </td>
    <td className="px-5 py-4 text-sm text-[#334155]">
      {record.checkInTime || "—"}
    </td>
    <td className="px-5 py-4 text-sm text-[#334155]">
      {record.checkOutTime || "—"}
    </td>
    <td className="max-w-sm px-5 py-4 text-sm text-[#64748B]">
      {record.remarks || "—"}
    </td>
  </tr>
);

const EmptyState = ({ title, text }: { title: string; text: string }) => (
  <div className="flex min-h-64 flex-col items-center justify-center p-6 text-center">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
      <Icon icon="lucide:calendar-x" className="text-3xl" />
    </div>
    <h2 className="text-lg font-bold text-[#15243B]">{title}</h2>
    <p className="mt-1 max-w-md text-sm text-[#64748B]">{text}</p>
  </div>
);

export default MyTeacherAttendance;
