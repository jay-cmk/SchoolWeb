import React, { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  clearAttendanceError,
  clearStudentAttendanceSummary,
  getStudentAttendanceSummary,
} from "../../../features/attendance/attendance.slice";
import type {
  StudentAttendanceCalendarItem,
  StudentAttendanceSummaryData,
} from "../../../features/attendance/attendance.types";

interface MonthYear {
  month: number;
  year: number;
  name: string;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const formatDateString = (year: number, month: number, day: number) =>
  `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

const getRelationName = (value: unknown, fallback: string) => {
  if (value && typeof value === "object" && "name" in value) {
    const name = (value as { name?: unknown }).name;
    if (typeof name === "string" && name.trim()) return name.trim();
  }
  return fallback;
};

const getStudentName = (student: StudentAttendanceSummaryData["student"]) =>
  student.name?.trim() ||
  [student.firstName, student.lastName].filter(Boolean).join(" ").trim() ||
  "Student";

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return `${parts[0]?.charAt(0) ?? ""}${parts[1]?.charAt(0) ?? ""}`.toUpperCase() || "ST";
};

const getInitialMonth = (params: URLSearchParams): MonthYear => {
  const today = new Date();
  const requestedMonth = Number(params.get("month"));
  const requestedYear = Number(params.get("year"));
  const month = requestedMonth >= 1 && requestedMonth <= 12
    ? requestedMonth - 1
    : today.getMonth();
  const year = requestedYear >= 2000 && requestedYear <= 2100
    ? requestedYear
    : today.getFullYear();
  return { month, year, name: `${MONTH_NAMES[month]} ${year}` };
};

const Header = ({ onClose }: { onClose: () => void }) => (
  <div className="flex items-start justify-between border-b border-gray-200 p-5">
    <div>
      <p className="text-sm text-gray-500">
        Attendance <span className="mx-1">/</span> Student Details
      </p>
      <h1 className="mt-2 text-2xl font-bold text-gray-900">
        Student Attendance Details
      </h1>
    </div>
    <button
      type="button"
      onClick={onClose}
      className="flex min-h-11 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
    >
      <Icon icon="lucide:x" /> Close
    </button>
  </div>
);

const StudentProfileHeader = ({ data }: { data: StudentAttendanceSummaryData }) => {
  const name = getStudentName(data.student);
  return (
    <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center">
      {data.student.profileImage ? (
        <img
          className="h-16 w-16 rounded-full border border-gray-200 object-cover"
          src={data.student.profileImage}
          alt={name}
        />
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
          {getInitials(name)}
        </div>
      )}
      <div className="flex-1">
        <h2 className="text-lg font-bold text-gray-900">{name}</h2>
        <p className="mt-1 text-sm text-gray-500">
          Admission No. {data.student.admissionNumber || "—"}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
            {getRelationName(data.student.classId, "Class not available")}
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
            {getRelationName(data.student.sectionId, "Section not available")}
          </span>
          {data.summary.below75 && (
            <span className="flex items-center gap-1 rounded-full border border-yellow-800/10 bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-800">
              <Icon icon="lucide:alert-triangle" className="h-3.5 w-3.5" />
              Attendance below 75%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const StatsGrid = ({ data }: { data: StudentAttendanceSummaryData }) => {
  const stats = data.summary;
  const cards: Array<[string, number | string, string]> = [
    ["Present Days", stats.presentDays, "text-green-600"],
    ["Absent Days", stats.absentDays, "text-red-600"],
    ["Leave Days", stats.leaveDays, "text-yellow-700"],
    ["Half Days", stats.halfDays, "text-orange-600"],
    ["Attendance", `${stats.attendancePercentage.toFixed(1)}%`, "text-gray-900"],
  ];
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
      {cards.map(([label, value, color]) => (
        <div key={label} className="rounded-xl border border-gray-200 bg-gray-50 p-4 hover:shadow-sm">
          <p className="text-xs font-medium text-gray-500">{label}</p>
          <p className={twMerge("mt-2 text-2xl font-bold", color)}>{value}</p>
        </div>
      ))}
    </div>
  );
};

const CalendarDay = ({
  day,
  record,
  selected,
  onClick,
}: {
  day: number | null;
  record?: StudentAttendanceCalendarItem;
  selected: boolean;
  onClick?: () => void;
}) => {
  if (day === null) return <span className="py-3" />;
  const colors = {
    PRESENT: "bg-green-600 text-white font-semibold",
    ABSENT: "bg-red-600 text-white font-semibold",
    LEAVE: "bg-yellow-500 text-yellow-900 font-semibold",
    HALF_DAY: "bg-orange-500 text-white font-semibold",
  };
  return (
    <button
      type="button"
      disabled={!record}
      onClick={onClick}
      title={record ? `${record.status}${record.remarks ? ` - ${record.remarks}` : ""}` : "No attendance record"}
      className={twMerge(clsx(
        "rounded-lg py-3 text-center text-xs transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50",
        record ? colors[record.status] : "cursor-default bg-gray-100 text-gray-500",
        record && "cursor-pointer hover:opacity-90",
        selected && "ring-4 ring-blue-600 ring-offset-2",
      ))}
    >
      {day}
    </button>
  );
};

const AttendanceCalendar = ({
  currentMonth,
  records,
  selectedDate,
  onPrev,
  onNext,
  onSelect,
}: {
  currentMonth: MonthYear;
  records: StudentAttendanceCalendarItem[];
  selectedDate: string | null;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (record: StudentAttendanceCalendarItem) => void;
}) => {
  const days = new Date(currentMonth.year, currentMonth.month + 1, 0).getDate();
  const weekday = new Date(currentMonth.year, currentMonth.month, 1).getDay();
  const offset = weekday === 0 ? 6 : weekday - 1;
  const cells: (number | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: days }, (_, index) => index + 1),
  ];
  const recordByDate = new Map(records.map((record) => [record.date.slice(0, 10), record]));

  return (
    <div className="mt-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-900">{currentMonth.name}</h2>
            <div className="flex gap-1">
              <button type="button" onClick={onPrev} title="Previous Month" className="rounded-md border border-gray-200 p-1.5 text-gray-700 hover:bg-gray-50">
                <Icon icon="lucide:chevron-left" className="h-4 w-4" />
              </button>
              <button type="button" onClick={onNext} title="Next Month" className="rounded-md border border-gray-200 p-1.5 text-gray-700 hover:bg-gray-50">
                <Icon icon="lucide:chevron-right" className="h-4 w-4" />
              </button>
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500">Daily attendance calendar</p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs font-medium text-gray-700">
          {[
            ["bg-green-600", "Present"], ["bg-red-600", "Absent"],
            ["bg-yellow-500", "Leave"], ["bg-orange-500", "Half Day"],
            ["bg-gray-200", "No Record"],
          ].map(([color, label]) => (
            <span key={label} className="flex items-center gap-1.5">
              <i className={`inline-block h-3 w-3 rounded-full ${color}`} /> {label}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <span key={day} className="py-2 font-semibold text-gray-500">{day}</span>
        ))}
        {cells.map((day, index) => {
          const date = day ? formatDateString(currentMonth.year, currentMonth.month, day) : "";
          const record = date ? recordByDate.get(date) : undefined;
          return (
            <CalendarDay
              key={`${date || "empty"}-${index}`}
              day={day}
              record={record}
              selected={Boolean(record && selectedDate === date)}
              onClick={record ? () => onSelect(record) : undefined}
            />
          );
        })}
      </div>
    </div>
  );
};

const DayDetailModal = ({ record, onClose }: { record: StudentAttendanceCalendarItem; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <h3 className="text-lg font-bold text-gray-900">Attendance Details</h3>
        <button type="button" onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">
          <Icon icon="lucide:x" className="h-5 w-5" />
        </button>
      </div>
      <dl className="mt-4 space-y-4 text-sm">
        <div><dt className="font-medium text-gray-500">Date</dt><dd className="mt-1 font-semibold text-gray-900">{new Date(`${record.date.slice(0, 10)}T00:00:00`).toLocaleDateString("en-IN")}</dd></div>
        <div><dt className="font-medium text-gray-500">Status</dt><dd className="mt-1 font-semibold text-gray-900">{record.status.replace("_", " ")}</dd></div>
        <div><dt className="font-medium text-gray-500">Remarks</dt><dd className="mt-1 text-gray-900">{record.remarks?.trim() || "—"}</dd></div>
      </dl>
      <div className="mt-6 flex justify-end border-t border-gray-200 pt-4">
        <button type="button" onClick={onClose} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Close</button>
      </div>
    </div>
  </div>
);

const MessageState = ({ icon, title, message }: { icon: string; title: string; message: string }) => (
  <div className="flex min-h-72 flex-col items-center justify-center px-5 text-center">
    <Icon icon={icon} className="h-10 w-10 text-gray-400" />
    <h2 className="mt-4 text-lg font-bold text-gray-900">{title}</h2>
    <p className="mt-1 max-w-md text-sm text-gray-500">{message}</p>
  </div>
);

const StudentAttendanceDetails: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const { selectedSessionId } = useAppSelector((state) => state.sessionSelection);
  const { studentSummary, loading, error } = useAppSelector((state) => state.attendance);
  const [currentMonth, setCurrentMonth] = useState(() => getInitialMonth(searchParams));
  const [selectedRecord, setSelectedRecord] = useState<StudentAttendanceCalendarItem | null>(null);

  useEffect(() => {
    dispatch(clearStudentAttendanceSummary());
    dispatch(clearAttendanceError());
    if (!studentId || !selectedSessionId) return;
    dispatch(getStudentAttendanceSummary({
      studentId,
      sessionId: selectedSessionId,
      month: currentMonth.month + 1,
      year: currentMonth.year,
    }));
  }, [dispatch, studentId, selectedSessionId, currentMonth.month, currentMonth.year]);

  useEffect(() => () => {
    dispatch(clearStudentAttendanceSummary());
    dispatch(clearAttendanceError());
  }, [dispatch]);

  const changeMonth = (increment: number) => {
    const date = new Date(currentMonth.year, currentMonth.month + increment, 1);
    const next = {
      month: date.getMonth(),
      year: date.getFullYear(),
      name: `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`,
    };
    const params = new URLSearchParams(searchParams);
    params.delete("sessionId");
    params.set("month", String(next.month + 1));
    params.set("year", String(next.year));
    setSelectedRecord(null);
    setCurrentMonth(next);
    setSearchParams(params, { replace: true });
  };

  const calendar = useMemo(() => (studentSummary?.calendar ?? []).filter((record) => {
    const date = new Date(`${record.date.slice(0, 10)}T00:00:00`);
    return date.getMonth() === currentMonth.month && date.getFullYear() === currentMonth.year;
  }), [studentSummary?.calendar, currentMonth.month, currentMonth.year]);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-gray-50">
      <main className="w-full p-5 md:p-8">
        <section className="mx-auto max-w-5xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
          <Header onClose={() => navigate("/school-admin/attendance")} />
          {!selectedSessionId ? (
            <MessageState icon="lucide:calendar-range" title="Select an academic session" message="Topbar se Academic Session select karein. Attendance selected session ke hisab se load hogi." />
          ) : !studentId ? (
            <MessageState icon="lucide:user-x" title="Student not found" message="Student ID route me available nahi hai." />
          ) : loading ? (
            <MessageState icon="lucide:loader-circle" title="Loading attendance" message="Student attendance details load ho rahi hain..." />
          ) : error ? (
            <MessageState icon="lucide:circle-alert" title="Unable to load attendance" message={error} />
          ) : !studentSummary ? (
            <MessageState icon="lucide:calendar-x" title="No attendance data" message="Selected session aur month ke liye attendance data available nahi hai." />
          ) : (
            <div className="p-5 md:p-6">
              <StudentProfileHeader data={studentSummary} />
              <StatsGrid data={studentSummary} />
              <AttendanceCalendar
                currentMonth={currentMonth}
                records={calendar}
                selectedDate={selectedRecord?.date.slice(0, 10) ?? null}
                onPrev={() => changeMonth(-1)}
                onNext={() => changeMonth(1)}
                onSelect={setSelectedRecord}
              />
            </div>
          )}
        </section>
      </main>
      {selectedRecord && <DayDetailModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />}
    </div>
  );
};

export default StudentAttendanceDetails;
