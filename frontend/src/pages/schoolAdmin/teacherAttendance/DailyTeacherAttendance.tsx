import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  clearTeacherAttendanceError,
  clearTeacherAttendanceSuccess,
  getTeacherAttendance,
  updateTeacherAttendance,
} from "../../../features/teacherAttendance/teacherAttendance.slice";
import {
  TeacherAttendanceStatus,
} from "../../../features/teacherAttendance/teacherAttendance.types";
import type {
  TeacherAttendanceData,
  TeacherAttendanceStatus as TeacherAttendanceStatusType,
  TeacherAttendanceTeacher,
  UpdateTeacherAttendancePayload,
} from "../../../features/teacherAttendance/teacherAttendance.types";

type StatusFilter = "ALL" | TeacherAttendanceStatusType;

interface EditFormState {
  status: TeacherAttendanceStatusType;
  checkInTime: string;
  checkOutTime: string;
  remarks: string;
}

const getToday = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getTeacher = (
  teacher: TeacherAttendanceData["teacherId"],
): TeacherAttendanceTeacher | null =>
  typeof teacher === "string" ? null : teacher;

const getTeacherId = (
  teacher: TeacherAttendanceData["teacherId"],
): string => (typeof teacher === "string" ? teacher : teacher._id);

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

const formatStatus = (status: string): string =>
  status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const DailyTeacherAttendance = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { attendance, loading, saving, error, successMessage } =
    useAppSelector((state) => state.teacherAttendance);

  const [selectedDate, setSelectedDate] = useState(getToday());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [editingRecord, setEditingRecord] =
    useState<TeacherAttendanceData | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>({
    status: TeacherAttendanceStatus.PRESENT,
    checkInTime: "",
    checkOutTime: "",
    remarks: "",
  });

  useEffect(() => {
    dispatch(clearTeacherAttendanceError());
    dispatch(clearTeacherAttendanceSuccess());
    dispatch(getTeacherAttendance({ date: selectedDate }));
  }, [dispatch, selectedDate]);

  const filteredAttendance = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return attendance.filter((record) => {
      const teacher = getTeacher(record.teacherId);
      const matchesStatus =
        statusFilter === "ALL" || record.status === statusFilter;
      const matchesSearch =
        !query ||
        [teacher?.name, teacher?.employeeId, teacher?.email, teacher?.mobile]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));

      return matchesStatus && matchesSearch;
    });
  }, [attendance, searchQuery, statusFilter]);

  const counts = useMemo(
    () => ({
      total: attendance.length,
      present: attendance.filter(
        (item) => item.status === TeacherAttendanceStatus.PRESENT,
      ).length,
      absent: attendance.filter(
        (item) => item.status === TeacherAttendanceStatus.ABSENT,
      ).length,
      leave: attendance.filter(
        (item) => item.status === TeacherAttendanceStatus.LEAVE,
      ).length,
      halfDay: attendance.filter(
        (item) => item.status === TeacherAttendanceStatus.HALF_DAY,
      ).length,
    }),
    [attendance],
  );

  const openEditModal = (record: TeacherAttendanceData) => {
    setEditingRecord(record);
    setEditForm({
      status: record.status,
      checkInTime: record.checkInTime ?? "",
      checkOutTime: record.checkOutTime ?? "",
      remarks: record.remarks ?? "",
    });
  };

  const closeEditModal = () => {
    if (!saving) setEditingRecord(null);
  };

  const handleUpdate = async () => {
    if (!editingRecord) return;

    const payload: UpdateTeacherAttendancePayload = {
      status: editForm.status,
      checkInTime: editForm.checkInTime || null,
      checkOutTime: editForm.checkOutTime || null,
      remarks: editForm.remarks.trim() || null,
    };

    if (
      editForm.status === TeacherAttendanceStatus.ABSENT ||
      editForm.status === TeacherAttendanceStatus.LEAVE
    ) {
      payload.checkInTime = null;
      payload.checkOutTime = null;
    }

    try {
      await dispatch(
        updateTeacherAttendance({
          attendanceId: editingRecord._id,
          data: payload,
        }),
      ).unwrap();

      setEditingRecord(null);
    } catch {
      // Redux error state is shown above the table.
    }
  };

  return (
    <div className="min-h-full bg-[#F6F8FC] p-4 sm:p-6">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-[#64748B]">
              <span>Teacher Attendance</span>
              <Icon icon="lucide:chevron-right" />
              <span className="font-semibold text-[#15243B]">Daily Attendance</span>
            </div>
            <h1 className="text-2xl font-bold text-[#15243B] sm:text-3xl">
              Daily Teacher Attendance
            </h1>
            <p className="mt-1 text-sm text-[#64748B]">
              Review and update teachers&apos; attendance for a selected date.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div>
              <label htmlFor="daily-date" className="mb-1 block text-xs font-semibold uppercase text-[#64748B]">
                Attendance date
              </label>
              <input
                id="daily-date"
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="min-h-11 rounded-xl border border-[#CBD5E1] bg-white px-3 text-sm font-semibold outline-none focus:border-[#2563EB]"
              />
            </div>

            <button
              type="button"
              onClick={() => navigate("/school-admin/teacher-attendance/mark")}
              className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#1F5FAE] px-5 font-semibold text-white shadow-sm hover:bg-[#174D91]"
            >
              <Icon icon="lucide:user-check" className="text-lg" />
              Mark Attendance
            </button>
          </div>
        </header>

        {error && (
          <MessageBox
            type="error"
            message={error}
            onClose={() => dispatch(clearTeacherAttendanceError())}
          />
        )}

        {successMessage && (
          <MessageBox
            type="success"
            message={successMessage}
            onClose={() => dispatch(clearTeacherAttendanceSuccess())}
          />
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard label="Total Marked" value={counts.total} icon="lucide:users" color="blue" />
          <StatCard label="Present" value={counts.present} icon="lucide:user-check" color="green" />
          <StatCard label="Absent" value={counts.absent} icon="lucide:user-x" color="red" />
          <StatCard label="Leave" value={counts.leave} icon="lucide:calendar-off" color="amber" />
          <StatCard label="Half Day" value={counts.halfDay} icon="lucide:clock-3" color="violet" />
        </div>

        <section className="overflow-hidden rounded-2xl border border-[#DDE3EC] bg-white shadow-sm">
          <div className="grid gap-3 border-b border-[#E2E8F0] p-5 md:grid-cols-[1fr_220px_auto]">
            <div className="relative">
              <Icon icon="lucide:search" className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-[#94A3B8]" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search teacher, employee ID or email..."
                className="min-h-11 w-full rounded-xl border border-[#CBD5E1] pl-10 pr-4 text-sm outline-none focus:border-[#2563EB]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
              className="min-h-11 rounded-xl border border-[#CBD5E1] bg-white px-3 text-sm outline-none focus:border-[#2563EB]"
            >
              <option value="ALL">All Status</option>
              <option value={TeacherAttendanceStatus.PRESENT}>Present</option>
              <option value={TeacherAttendanceStatus.ABSENT}>Absent</option>
              <option value={TeacherAttendanceStatus.LEAVE}>Leave</option>
              <option value={TeacherAttendanceStatus.HALF_DAY}>Half Day</option>
            </select>

            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("ALL");
              }}
              className="min-h-11 rounded-xl border border-[#CBD5E1] px-5 text-sm font-semibold text-[#334155] hover:bg-[#F8FAFC]"
            >
              Reset Filters
            </button>
          </div>

          {loading ? (
            <div className="flex min-h-72 items-center justify-center">
              <Icon icon="lucide:loader-circle" className="animate-spin text-4xl text-[#2563EB]" />
            </div>
          ) : filteredAttendance.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] border-collapse text-left">
                <thead className="bg-[#F8FAFC] text-xs uppercase tracking-wide text-[#64748B]">
                  <tr>
                    <th className="px-5 py-4">Teacher</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Check in</th>
                    <th className="px-5 py-4">Check out</th>
                    <th className="px-5 py-4">Remarks</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {filteredAttendance.map((record) => {
                    const teacher = getTeacher(record.teacherId);
                    const teacherId = getTeacherId(record.teacherId);

                    return (
                      <tr key={record._id} className="hover:bg-[#FAFCFF]">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F0FB] font-bold text-[#1F5FAE]">
                              {teacher?.name?.charAt(0).toUpperCase() || "T"}
                            </div>
                            <div>
                              <p className="font-semibold text-[#15243B]">
                                {teacher?.name ?? "Teacher"}
                              </p>
                              <p className="text-xs text-[#64748B]">
                                {teacher?.employeeId ?? teacherId}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(record.status)}`}>
                            {formatStatus(record.status)}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-[#334155]">{record.checkInTime || "—"}</td>
                        <td className="px-5 py-4 text-sm text-[#334155]">{record.checkOutTime || "—"}</td>
                        <td className="max-w-xs px-5 py-4 text-sm text-[#64748B]">{record.remarks || "—"}</td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              title="View history"
                              onClick={() => navigate(`/school-admin/teacher-attendance/teacher/${teacherId}`)}
                              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#CBD5E1] text-[#1F5FAE] hover:bg-[#EFF6FF]"
                            >
                              <Icon icon="lucide:eye" className="text-lg" />
                            </button>
                            <button
                              type="button"
                              title="Edit attendance"
                              onClick={() => openEditModal(record)}
                              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#CBD5E1] text-[#475569] hover:bg-[#F8FAFC]"
                            >
                              <Icon icon="lucide:pencil" className="text-lg" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {editingRecord && (
        <EditAttendanceModal
          form={editForm}
          saving={saving}
          onChange={setEditForm}
          onClose={closeEditModal}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
};

const MessageBox = ({
  type,
  message,
  onClose,
}: {
  type: "error" | "success";
  message: string;
  onClose: () => void;
}) => (
  <div className={`flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${type === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
    <div className="flex gap-2">
      <Icon icon={type === "error" ? "lucide:circle-alert" : "lucide:circle-check"} className="mt-0.5 text-lg" />
      <span>{message}</span>
    </div>
    <button type="button" onClick={onClose}><Icon icon="lucide:x" className="text-lg" /></button>
  </div>
);

const StatCard = ({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) => {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
    amber: "bg-amber-50 text-amber-600",
    violet: "bg-violet-50 text-violet-600",
  };

  return (
    <div className="rounded-2xl border border-[#DDE3EC] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div><p className="text-sm text-[#64748B]">{label}</p><p className="mt-2 text-3xl font-bold text-[#15243B]">{value}</p></div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${colors[color]}`}><Icon icon={icon} className="text-xl" /></div>
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="flex min-h-72 flex-col items-center justify-center p-6 text-center">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB]"><Icon icon="lucide:calendar-x" className="text-3xl" /></div>
    <h2 className="text-lg font-bold text-[#15243B]">No attendance found</h2>
    <p className="mt-1 text-sm text-[#64748B]">Attendance has not been marked for this date or no record matches the filters.</p>
  </div>
);

const EditAttendanceModal = ({ form, saving, onChange, onClose, onSave }: {
  form: EditFormState;
  saving: boolean;
  onChange: (form: EditFormState) => void;
  onClose: () => void;
  onSave: () => void;
}) => {
  const disableTime = form.status === TeacherAttendanceStatus.ABSENT || form.status === TeacherAttendanceStatus.LEAVE;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4" onMouseDown={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-5">
          <div><h2 className="text-xl font-bold text-[#15243B]">Edit Attendance</h2><p className="text-sm text-[#64748B]">Update status, time and remarks.</p></div>
          <button type="button" onClick={onClose} disabled={saving} className="flex h-10 w-10 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F1F5F9]"><Icon icon="lucide:x" className="text-xl" /></button>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#334155]">Status</label>
            <select value={form.status} onChange={(event) => onChange({ ...form, status: event.target.value as TeacherAttendanceStatusType })} className="min-h-11 w-full rounded-xl border border-[#CBD5E1] bg-white px-3 outline-none focus:border-[#2563EB]">
              <option value={TeacherAttendanceStatus.PRESENT}>Present</option>
              <option value={TeacherAttendanceStatus.ABSENT}>Absent</option>
              <option value={TeacherAttendanceStatus.LEAVE}>Leave</option>
              <option value={TeacherAttendanceStatus.HALF_DAY}>Half Day</option>
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-[#334155]">Check in<input type="time" disabled={disableTime} value={form.checkInTime} onChange={(event) => onChange({ ...form, checkInTime: event.target.value })} className="mt-2 min-h-11 w-full rounded-xl border border-[#CBD5E1] px-3 font-normal outline-none disabled:bg-[#F1F5F9]" /></label>
            <label className="text-sm font-semibold text-[#334155]">Check out<input type="time" disabled={disableTime} value={form.checkOutTime} onChange={(event) => onChange({ ...form, checkOutTime: event.target.value })} className="mt-2 min-h-11 w-full rounded-xl border border-[#CBD5E1] px-3 font-normal outline-none disabled:bg-[#F1F5F9]" /></label>
          </div>

          <label className="block text-sm font-semibold text-[#334155]">Remarks<textarea value={form.remarks} maxLength={500} onChange={(event) => onChange({ ...form, remarks: event.target.value })} rows={3} placeholder="Optional remarks" className="mt-2 w-full resize-none rounded-xl border border-[#CBD5E1] p-3 font-normal outline-none focus:border-[#2563EB]" /></label>
        </div>

        <div className="flex justify-end gap-3 border-t border-[#E2E8F0] px-6 py-4">
          <button type="button" onClick={onClose} disabled={saving} className="min-h-11 rounded-xl border border-[#CBD5E1] px-5 font-semibold text-[#475569] hover:bg-[#F8FAFC]">Cancel</button>
          <button type="button" onClick={onSave} disabled={saving} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#1F5FAE] px-5 font-semibold text-white disabled:bg-[#AFC2D9]"><Icon icon={saving ? "lucide:loader-circle" : "lucide:save"} className={saving ? "animate-spin" : ""} />{saving ? "Updating..." : "Update Attendance"}</button>
        </div>
      </div>
    </div>
  );
};

export default DailyTeacherAttendance;
