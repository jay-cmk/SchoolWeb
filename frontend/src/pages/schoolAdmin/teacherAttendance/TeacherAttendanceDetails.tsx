import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  clearSelectedTeacherAttendanceSummary,
  clearTeacherAttendanceError,
  getSingleTeacherAttendanceSummary,
} from "../../../features/teacherAttendance/teacherAttendance.slice";
import {
  TeacherAttendanceStatus,
} from "../../../features/teacherAttendance/teacherAttendance.types";
import type {
  TeacherAttendanceData,
  TeacherAttendanceStatus as TeacherAttendanceStatusType,
} from "../../../features/teacherAttendance/teacherAttendance.types";

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

const now = new Date();

const parseNumber = (
  value: string | null,
  fallback: number,
  minimum: number,
  maximum: number,
): number => {
  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed >= minimum && parsed <= maximum
    ? parsed
    : fallback;
};

const formatStatus = (status: string): string =>
  status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const getStatusStyle = (status: TeacherAttendanceStatusType): string => {
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

const formatDate = (date: string): string =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    weekday: "short",
  }).format(new Date(date));

const TeacherAttendanceDetails = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // This normalization also remains safe if a router type returns string[].
  const rawTeacherId = params.teacherId as string | string[] | undefined;
  const teacherId = Array.isArray(rawTeacherId)
    ? rawTeacherId[0] ?? ""
    : rawTeacherId ?? "";

  const initialMonth = parseNumber(
    searchParams.get("month"),
    now.getMonth() + 1,
    1,
    12,
  );
  const initialYear = parseNumber(
    searchParams.get("year"),
    now.getFullYear(),
    2000,
    2100,
  );

  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | TeacherAttendanceStatusType
  >("ALL");

  const { selectedTeacherSummary, loading, error } = useAppSelector(
    (state) => state.teacherAttendance,
  );

  useEffect(() => {
    if (!teacherId) return;

    dispatch(clearTeacherAttendanceError());
    dispatch(
      getSingleTeacherAttendanceSummary({
        teacherId,
        month,
        year,
      }),
    );

    setSearchParams(
      {
        month: String(month),
        year: String(year),
      },
      { replace: true },
    );
  }, [dispatch, teacherId, month, year, setSearchParams]);

  useEffect(
    () => () => {
      dispatch(clearSelectedTeacherAttendanceSummary());
    },
    [dispatch],
  );

  const attendance = selectedTeacherSummary?.attendance ?? [];

  const filteredAttendance = useMemo(
    () =>
      statusFilter === "ALL"
        ? attendance
        : attendance.filter((item) => item.status === statusFilter),
    [attendance, statusFilter],
  );

  if (!teacherId) {
    return (
      <PageMessage
        icon="lucide:circle-alert"
        title="Invalid teacher"
        text="Teacher ID is missing from the URL."
        onBack={() => navigate("/school-admin/teacher-attendance/monthly")}
      />
    );
  }

  return (
    <div className="min-h-full bg-[#F6F8FC] p-4 sm:p-6">
      <div className="mx-auto max-w-[1450px] space-y-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#475569] hover:text-[#1F5FAE]"
        >
          <Icon icon="lucide:arrow-left" />
          Back to attendance
        </button>

        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-[#64748B]">
              <span>Teacher Attendance</span>
              <Icon icon="lucide:chevron-right" />
              <span className="font-semibold text-[#15243B]">Teacher Details</span>
            </div>
            <h1 className="text-2xl font-bold text-[#15243B] sm:text-3xl">
              Attendance Details
            </h1>
            <p className="mt-1 text-sm text-[#64748B]">
              Detailed monthly attendance record for an individual teacher.
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
          <div className="flex items-start justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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

        {loading && !selectedTeacherSummary ? (
          <div className="flex min-h-96 items-center justify-center rounded-2xl border border-[#DDE3EC] bg-white">
            <Icon
              icon="lucide:loader-circle"
              className="animate-spin text-4xl text-[#2563EB]"
            />
          </div>
        ) : !selectedTeacherSummary ? (
          <PageMessage
            icon="lucide:user-x"
            title="Teacher attendance not found"
            text="No attendance information is available for this teacher."
            onBack={() => navigate("/school-admin/teacher-attendance/monthly")}
          />
        ) : (
          <>
            <TeacherProfileHeader
              name={selectedTeacherSummary.teacher.name}
              employeeId={selectedTeacherSummary.teacher.employeeId}
              email={selectedTeacherSummary.teacher.email}
              mobile={selectedTeacherSummary.teacher.mobile}
              qualification={selectedTeacherSummary.teacher.qualification}
              profileImage={selectedTeacherSummary.teacher.profileImage}
              month={month}
              year={year}
            />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
              <SummaryCard label="Total Days" value={selectedTeacherSummary.summary.totalDays} color="blue" />
              <SummaryCard label="Present" value={selectedTeacherSummary.summary.presentDays} color="green" />
              <SummaryCard label="Absent" value={selectedTeacherSummary.summary.absentDays} color="red" />
              <SummaryCard label="Leave" value={selectedTeacherSummary.summary.leaveDays} color="amber" />
              <SummaryCard label="Half Day" value={selectedTeacherSummary.summary.halfDays} color="violet" />
              <SummaryCard label="Attendance" value={`${selectedTeacherSummary.summary.attendancePercentage.toFixed(1)}%`} color={selectedTeacherSummary.summary.attendancePercentage < 75 ? "red" : "green"} />
            </div>

            <section className="overflow-hidden rounded-2xl border border-[#DDE3EC] bg-white shadow-sm">
              <div className="flex flex-col gap-3 border-b border-[#E2E8F0] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#15243B]">Daily Records</h2>
                  <p className="text-sm text-[#64748B]">
                    {MONTHS[month - 1]} {year} · {attendance.length} marked days
                  </p>
                </div>

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value as "ALL" | TeacherAttendanceStatusType,
                    )
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
                  <Icon icon="lucide:loader-circle" className="animate-spin text-4xl text-[#2563EB]" />
                </div>
              ) : filteredAttendance.length === 0 ? (
                <div className="flex min-h-64 flex-col items-center justify-center p-6 text-center">
                  <Icon icon="lucide:calendar-x" className="mb-3 text-4xl text-[#94A3B8]" />
                  <h3 className="font-bold text-[#15243B]">No daily records</h3>
                  <p className="mt-1 text-sm text-[#64748B]">No record matches the selected month and status.</p>
                </div>
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
                      {filteredAttendance.map((record) => (
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

const TeacherProfileHeader = ({
  name,
  employeeId,
  email,
  mobile,
  qualification,
  profileImage,
  month,
  year,
}: {
  name: string;
  employeeId: string;
  email: string;
  mobile: string | undefined;
  qualification: string | undefined;
  profileImage: string | undefined;
  month: number;
  year: number;
}) => (
  <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-[#173F73] to-[#2C78C4] p-6 text-white shadow-lg sm:p-8">
    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        {profileImage ? (
          <img src={profileImage} alt={name} className="h-20 w-20 rounded-2xl border border-white/30 object-cover" />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/30 bg-white/15 text-3xl font-bold">
            {name.charAt(0).toUpperCase() || "T"}
          </div>
        )}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-100">Teacher Attendance</p>
          <h2 className="mt-1 text-3xl font-bold">{name}</h2>
          <p className="mt-1 text-sm text-blue-100">{employeeId} · {email}</p>
          {(mobile || qualification) && <p className="mt-1 text-sm text-blue-100">{mobile || "—"}{qualification ? ` · ${qualification}` : ""}</p>}
        </div>
      </div>
      <div className="rounded-xl border border-white/20 bg-white/10 px-5 py-4">
        <p className="text-xs font-semibold uppercase text-blue-100">Selected period</p>
        <p className="mt-1 text-lg font-bold">{MONTHS[month - 1]} {year}</p>
      </div>
    </div>
  </div>
);

const SummaryCard = ({ label, value, color }: { label: string; value: string | number; color: "blue" | "green" | "red" | "amber" | "violet" }) => {
  const colors = {
    blue: "border-blue-100 bg-blue-50 text-blue-700",
    green: "border-emerald-100 bg-emerald-50 text-emerald-700",
    red: "border-red-100 bg-red-50 text-red-700",
    amber: "border-amber-100 bg-amber-50 text-amber-700",
    violet: "border-violet-100 bg-violet-50 text-violet-700",
  };

  return <div className={`rounded-2xl border p-5 shadow-sm ${colors[color]}`}><p className="text-sm font-medium opacity-80">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></div>;
};

const AttendanceRow = ({ record }: { record: TeacherAttendanceData }) => (
  <tr className="hover:bg-[#FAFCFF]">
    <td className="px-5 py-4 font-semibold text-[#334155]">{formatDate(record.date)}</td>
    <td className="px-5 py-4"><span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(record.status)}`}>{formatStatus(record.status)}</span></td>
    <td className="px-5 py-4 text-sm text-[#475569]">{record.checkInTime || "—"}</td>
    <td className="px-5 py-4 text-sm text-[#475569]">{record.checkOutTime || "—"}</td>
    <td className="max-w-sm px-5 py-4 text-sm text-[#64748B]">{record.remarks || "—"}</td>
  </tr>
);

const PageMessage = ({ icon, title, text, onBack }: { icon: string; title: string; text: string; onBack: () => void }) => (
  <div className="flex min-h-[70vh] items-center justify-center bg-[#F6F8FC] p-6">
    <div className="w-full max-w-lg rounded-2xl border border-[#DDE3EC] bg-white p-8 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB]"><Icon icon={icon} className="text-3xl" /></div>
      <h1 className="text-xl font-bold text-[#15243B]">{title}</h1>
      <p className="mt-2 text-sm text-[#64748B]">{text}</p>
      <button type="button" onClick={onBack} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#1F5FAE] px-5 font-semibold text-white hover:bg-[#174D91]"><Icon icon="lucide:arrow-left" />Back</button>
    </div>
  </div>
);

export default TeacherAttendanceDetails;
