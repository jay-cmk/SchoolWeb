import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  clearTeacherAttendanceError,
  clearTeacherAttendanceMonthlySummary,
  getTeacherAttendanceMonthlySummary,
} from "../../../features/teacherAttendance/teacherAttendance.slice";

type PercentageFilter = "ALL" | "BELOW_75" | "75_TO_90" | "ABOVE_90";

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

const MonthlyTeacherAttendance = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { monthlySummary, loading, error } = useAppSelector(
    (state) => state.teacherAttendance,
  );

  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [searchQuery, setSearchQuery] = useState("");
  const [percentageFilter, setPercentageFilter] =
    useState<PercentageFilter>("ALL");

  useEffect(() => {
    dispatch(clearTeacherAttendanceError());
    dispatch(
      getTeacherAttendanceMonthlySummary({
        month,
        year,
      }),
    );

    return () => {
      dispatch(clearTeacherAttendanceMonthlySummary());
    };
  }, [dispatch, month, year]);

  const rows = monthlySummary?.summary ?? [];

  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesSearch =
        !query ||
        [
          row.teacher.name,
          row.teacher.employeeId,
          row.teacher.email,
          row.teacher.mobile,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));

      const percentage = row.attendancePercentage;
      const matchesPercentage =
        percentageFilter === "ALL" ||
        (percentageFilter === "BELOW_75" && percentage < 75) ||
        (percentageFilter === "75_TO_90" &&
          percentage >= 75 &&
          percentage <= 90) ||
        (percentageFilter === "ABOVE_90" && percentage > 90);

      return matchesSearch && matchesPercentage;
    });
  }, [rows, searchQuery, percentageFilter]);

  const statistics = useMemo(() => {
    const totalTeachers = rows.length;
    const averageAttendance = totalTeachers
      ? rows.reduce(
          (sum, row) => sum + row.attendancePercentage,
          0,
        ) / totalTeachers
      : 0;
    const below75 = rows.filter(
      (row) => row.attendancePercentage < 75,
    ).length;
    const totalPresent = rows.reduce(
      (sum, row) => sum + row.presentDays,
      0,
    );

    return {
      totalTeachers,
      averageAttendance,
      below75,
      totalPresent,
    };
  }, [rows]);

  const resetFilters = () => {
    setSearchQuery("");
    setPercentageFilter("ALL");
  };

  const exportCsv = () => {
    if (filteredRows.length === 0) return;

    const headings = [
      "Teacher",
      "Employee ID",
      "Present",
      "Absent",
      "Leave",
      "Half Day",
      "Total Days",
      "Attendance Percentage",
    ];

    const csvRows = filteredRows.map((row) => [
      row.teacher.name,
      row.teacher.employeeId,
      row.presentDays,
      row.absentDays,
      row.leaveDays,
      row.halfDays,
      row.totalDays,
      row.attendancePercentage.toFixed(2),
    ]);

    const escapeCell = (value: string | number) =>
      `"${String(value).replaceAll('"', '""')}"`;

    const csv = [headings, ...csvRows]
      .map((row) => row.map(escapeCell).join(","))
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `teacher-attendance-${year}-${String(month).padStart(2, "0")}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-full bg-[#F6F8FC] p-4 sm:p-6">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-[#64748B]">
              <span>Teacher Attendance</span>
              <Icon icon="lucide:chevron-right" />
              <span className="font-semibold text-[#15243B]">
                Monthly Summary
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#15243B] sm:text-3xl">
              Monthly Teacher Attendance
            </h1>
            <p className="mt-1 text-sm text-[#64748B]">
              Teacher-wise attendance performance for {MONTHS[month - 1]} {year}.
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

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Teachers"
            value={statistics.totalTeachers}
            suffix=""
            icon="lucide:users"
            color="blue"
          />
          <StatCard
            label="Average Attendance"
            value={statistics.averageAttendance.toFixed(1)}
            suffix="%"
            icon="lucide:chart-no-axes-combined"
            color="green"
          />
          <StatCard
            label="Below 75%"
            value={statistics.below75}
            suffix=""
            icon="lucide:triangle-alert"
            color="red"
          />
          <StatCard
            label="Total Present Days"
            value={statistics.totalPresent}
            suffix=""
            icon="lucide:calendar-check"
            color="violet"
          />
        </div>

        <section className="overflow-hidden rounded-2xl border border-[#DDE3EC] bg-white shadow-sm">
          <div className="grid gap-3 border-b border-[#E2E8F0] p-5 md:grid-cols-[1fr_230px_auto_auto]">
            <div className="relative">
              <Icon
                icon="lucide:search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-[#94A3B8]"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search teacher, employee ID or email..."
                className="min-h-11 w-full rounded-xl border border-[#CBD5E1] pl-10 pr-4 text-sm outline-none focus:border-[#2563EB]"
              />
            </div>

            <select
              value={percentageFilter}
              onChange={(event) =>
                setPercentageFilter(event.target.value as PercentageFilter)
              }
              className="min-h-11 rounded-xl border border-[#CBD5E1] bg-white px-3 text-sm outline-none focus:border-[#2563EB]"
            >
              <option value="ALL">All Percentages</option>
              <option value="BELOW_75">Below 75%</option>
              <option value="75_TO_90">75% to 90%</option>
              <option value="ABOVE_90">Above 90%</option>
            </select>

            <button
              type="button"
              onClick={resetFilters}
              className="min-h-11 rounded-xl border border-[#CBD5E1] px-5 text-sm font-semibold text-[#334155] hover:bg-[#F8FAFC]"
            >
              Reset
            </button>

            <button
              type="button"
              disabled={filteredRows.length === 0}
              onClick={exportCsv}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#CBD5E1] px-5 text-sm font-semibold text-[#334155] hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon icon="lucide:download" className="text-lg" />
              Export
            </button>
          </div>

          {loading ? (
            <div className="flex min-h-72 items-center justify-center">
              <Icon
                icon="lucide:loader-circle"
                className="animate-spin text-4xl text-[#2563EB]"
              />
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center p-6 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
                <Icon icon="lucide:calendar-search" className="text-3xl" />
              </div>
              <h2 className="text-lg font-bold text-[#15243B]">
                No monthly attendance found
              </h2>
              <p className="mt-1 text-sm text-[#64748B]">
                No teacher attendance summary is available for the selected month.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] border-collapse text-left">
                <thead className="bg-[#F8FAFC] text-xs uppercase tracking-wide text-[#64748B]">
                  <tr>
                    <th className="px-5 py-4">Teacher</th>
                    <th className="px-5 py-4 text-center">Present</th>
                    <th className="px-5 py-4 text-center">Absent</th>
                    <th className="px-5 py-4 text-center">Leave</th>
                    <th className="px-5 py-4 text-center">Half Day</th>
                    <th className="px-5 py-4 text-center">Total Days</th>
                    <th className="px-5 py-4">Attendance</th>
                    <th className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {filteredRows.map((row) => (
                    <tr key={row.teacher._id} className="hover:bg-[#FAFCFF]">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {row.teacher.profileImage ? (
                            <img
                              src={row.teacher.profileImage}
                              alt={row.teacher.name}
                              className="h-11 w-11 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F0FB] font-bold text-[#1F5FAE]">
                              {row.teacher.name?.charAt(0).toUpperCase() || "T"}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-[#15243B]">
                              {row.teacher.name}
                            </p>
                            <p className="text-xs text-[#64748B]">
                              {row.teacher.employeeId} · {row.teacher.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center font-semibold text-emerald-600">{row.presentDays}</td>
                      <td className="px-5 py-4 text-center font-semibold text-red-600">{row.absentDays}</td>
                      <td className="px-5 py-4 text-center font-semibold text-amber-600">{row.leaveDays}</td>
                      <td className="px-5 py-4 text-center font-semibold text-violet-600">{row.halfDays}</td>
                      <td className="px-5 py-4 text-center font-semibold text-[#334155]">{row.totalDays}</td>
                      <td className="px-5 py-4">
                        <PercentageCell value={row.attendancePercentage} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/school-admin/teacher-attendance/teacher/${row.teacher._id}?month=${month}&year=${year}`,
                            )
                          }
                          className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#CBD5E1] px-3 text-sm font-semibold text-[#1F5FAE] hover:bg-[#EFF6FF]"
                        >
                          <Icon icon="lucide:eye" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filteredRows.length > 0 && (
            <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4 text-sm text-[#64748B]">
              Showing {filteredRows.length} of {rows.length} teachers
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const StatCard = ({
  label,
  value,
  suffix,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  suffix: string;
  icon: string;
  color: "blue" | "green" | "red" | "violet";
}) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
    violet: "bg-violet-50 text-violet-600",
  };

  return (
    <div className="rounded-2xl border border-[#DDE3EC] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[#64748B]">{label}</p>
          <p className="mt-2 text-3xl font-bold text-[#15243B]">
            {value}{suffix}
          </p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${colors[color]}`}>
          <Icon icon={icon} className="text-xl" />
        </div>
      </div>
    </div>
  );
};

const PercentageCell = ({ value }: { value: number }) => {
  const safeValue = Math.max(0, Math.min(100, value));
  const color =
    safeValue < 75
      ? "bg-red-500"
      : safeValue <= 90
        ? "bg-amber-500"
        : "bg-emerald-500";
  const textColor =
    safeValue < 75
      ? "text-red-600"
      : safeValue <= 90
        ? "text-amber-600"
        : "text-emerald-600";

  return (
    <div className="min-w-36">
      <div className="mb-1 flex items-center justify-between gap-3">
        <span className={`text-sm font-bold ${textColor}`}>
          {safeValue.toFixed(1)}%
        </span>
        {safeValue < 75 && (
          <span className="text-[11px] font-semibold text-red-600">Low</span>
        )}
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#E2E8F0]">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
};

export default MonthlyTeacherAttendance;
