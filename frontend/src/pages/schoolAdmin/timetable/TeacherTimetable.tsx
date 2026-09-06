// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { Icon } from "@iconify/react";
// import { useNavigate, useSearchParams } from "react-router-dom";

// import { useAppDispatch, useAppSelector } from "../../../app/hooks";
// import { getSessions } from "../../../features/academic/sessions/session.slice";
// import { getTeachers } from "../../../features/teachers/teacher.slice";
// import {
//   clearTimetableError,
//   getTimetable,
// } from "../../../features/timetable/timetable.slice";

// const getRelationId = (value: unknown): string => {
//   if (typeof value === "string") return value;
//   if (value && typeof value === "object" && "_id" in value) {
//     const id = (value as { _id?: unknown })._id;
//     return typeof id === "string" ? id : String(id ?? "");
//   }
//   return "";
// };

// const getRelationName = (value: unknown): string => {
//   if (!value || typeof value !== "object" || !("name" in value)) return "";
//   const name = (value as { name?: unknown }).name;
//   return typeof name === "string" ? name : "";
// };

// const DAY_ORDER: Record<string, number> = {
//   MONDAY: 1,
//   TUESDAY: 2,
//   WEDNESDAY: 3,
//   THURSDAY: 4,
//   FRIDAY: 5,
//   SATURDAY: 6,
// };

// const dayLabel = (day: string) =>
//   day.charAt(0) + day.slice(1).toLowerCase();

// const TeacherTimetable: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();
//   const [searchParams, setSearchParams] = useSearchParams();
//   const tableRef = useRef<HTMLDivElement | null>(null);

//   const { timetable, loading, error } = useAppSelector((state) => state.timetable);
//   const { sessions } = useAppSelector((state) => state.sessions);
//   const { teachers } = useAppSelector((state) => state.teachers);
//   const { selectedSessionId } = useAppSelector(
//     (state) => state.sessionSelection
//   );

//   const sessionId = selectedSessionId || "";

//   const selectedSession = useMemo(
//     () =>
//       sessions.find(
//         (item) => item._id === selectedSessionId
//       ) || null,
//     [sessions, selectedSessionId]
//   );

//   const [teacherId, setTeacherId] = useState(
//     searchParams.get("teacherId") || ""
//   );

//   useEffect(() => {
//     if (sessions.length === 0) {
//       dispatch(getSessions());
//     }

//     dispatch(getTeachers());
//   }, [dispatch, sessions.length]);

//   useEffect(() => {
//     setTeacherId("");
//     dispatch(clearTimetableError());
//   }, [dispatch, sessionId]);

//   useEffect(() => {
//     const params = new URLSearchParams();
//     if (sessionId) params.set("sessionId", sessionId);
//     if (teacherId) params.set("teacherId", teacherId);
//     setSearchParams(params, { replace: true });
//   }, [sessionId, teacherId, setSearchParams]);

//   useEffect(() => {
//     if (!sessionId || !teacherId) return;
//     dispatch(
//       getTimetable({
//         sessionId,
//         teacherId,
//         isActive: true,
//       })
//     );
//   }, [dispatch, sessionId, teacherId]);

//   const selectedTeacher = teachers.find((item) => item._id === teacherId);

//   const periods = useMemo(
//     () =>
//       [...timetable].sort(
//         (a, b) =>
//           (DAY_ORDER[a.day] ?? 99) - (DAY_ORDER[b.day] ?? 99) ||
//           a.periodNumber - b.periodNumber
//       ),
//     [timetable]
//   );

//   const stats = useMemo(() => {
//     const classIds = new Set<string>();
//     const sectionIds = new Set<string>();
//     const subjects = new Set<string>();

//     periods.forEach((item) => {
//       const classId = getRelationId(item.classId);
//       const sectionId = getRelationId(item.sectionId);
//       const subjectId = getRelationId(item.subjectId);
//       if (classId) classIds.add(classId);
//       if (sectionId) sectionIds.add(sectionId);
//       if (subjectId) subjects.add(subjectId);
//     });

//     return {
//       periods: periods.length,
//       classes: classIds.size,
//       sections: sectionIds.size,
//       subjects: subjects.size,
//     };
//   }, [periods]);

//   const downloadCsv = () => {
//     const rows = [
//       ["Day", "Period", "Time", "Subject", "Class", "Section", "Room"],
//       ...periods.map((item) => [
//         dayLabel(item.day),
//         item.periodNumber,
//         `${item.startTime}-${item.endTime}`,
//         getRelationName(item.subjectId),
//         getRelationName(item.classId),
//         getRelationName(item.sectionId),
//         item.roomNumber || "",
//       ]),
//     ];

//     const csv = rows
//       .map((row) =>
//         row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")
//       )
//       .join("\n");

//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
//     const url = URL.createObjectURL(blob);
//     const anchor = document.createElement("a");
//     anchor.href = url;
//     const sessionName =
//       selectedSession?.name
//         ? selectedSession.name.replace(
//             /[^a-zA-Z0-9_-]+/g,
//             "-"
//           )
//         : "session";

//     anchor.download =
//       `${selectedTeacher?.name || "teacher"}-${sessionName}-timetable.csv`;
//     anchor.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-5 md:p-8">
//       <div className="mx-auto max-w-7xl space-y-5">
//         <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
//           <div>
//             <div className="flex items-center gap-2 text-sm text-gray-500">
//               <span>Academics</span>
//               <Icon icon="lucide:chevron-right" />
//               <span>Timetable</span>
//               <Icon icon="lucide:chevron-right" />
//               <span className="font-medium text-gray-900">Teacher timetable</span>
//             </div>
//             <h1 className="mt-2 text-3xl font-bold text-gray-950">Teacher Timetable</h1>
//             <p className="mt-1 text-sm text-gray-500">
//               Review workload and identify schedule conflicts for a selected teacher
//               in the academic session selected in the topbar.
//             </p>

//             <div className="mt-3">
//               <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
//                 <Icon icon="lucide:calendar-range" />
//                 {selectedSession
//                   ? `Academic Session: ${selectedSession.name}`
//                   : "No academic session selected"}
//               </span>
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-2">
//             <button
//               type="button"
//               onClick={() => {
//                 const params = new URLSearchParams();

//                 if (sessionId) {
//                   params.set("sessionId", sessionId);
//                 }

//                 navigate(
//                   `/school-admin/timetable/weekly?${params.toString()}`
//                 );
//               }}
//               disabled={!sessionId}
//               className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               <Icon icon="lucide:calendar" />
//               Class timetable
//             </button>
//             <button
//               type="button"
//               onClick={() => window.print()}
//               disabled={!sessionId || !teacherId || periods.length === 0}
//               className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               <Icon icon="lucide:printer" />
//               Print Timetable
//             </button>
//             <button
//               type="button"
//               onClick={downloadCsv}
//               disabled={!sessionId || !teacherId || periods.length === 0}
//               className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               <Icon icon="lucide:download" />
//               Download CSV
//             </button>
//           </div>
//         </div>

//         {!sessionId && (
//           <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
//             <Icon
//               icon="lucide:triangle-alert"
//               className="mt-0.5 text-xl text-amber-600"
//             />
//             <div>
//               <p className="text-sm font-semibold text-amber-900">
//                 Select an academic session from the topbar
//               </p>
//               <p className="mt-1 text-xs leading-5 text-amber-700">
//                 Teacher timetable and workload statistics are session-wise.
//               </p>
//             </div>
//           </div>
//         )}

//         <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//             <SelectField
//               label="Academic Session"
//               value={sessionId}
//               disabled
//               onChange={() => undefined}
//               options={
//                 selectedSession
//                   ? [
//                       {
//                         value: selectedSession._id,
//                         label: selectedSession.name,
//                       },
//                     ]
//                   : []
//               }
//             />

//             <SelectField
//               label="Teacher"
//               value={teacherId}
//               disabled={!sessionId}
//               onChange={setTeacherId}
//               options={teachers.map((item) => ({
//                 value: item._id,
//                 label: `${item.name}${item.employeeId ? ` — ${item.employeeId}` : ""}`,
//               }))}
//             />

//             <div className="flex items-end">
//               <div className="w-full rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800">
//                 <div className="flex items-center gap-2">
//                   <Icon icon="lucide:info" />
//                   <span>
//                     <strong>{selectedTeacher?.name || "Teacher"}</strong> · {stats.periods} weekly periods
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {error && (
//           <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
//             <span>{error}</span>
//             <button type="button" onClick={() => dispatch(clearTimetableError())}>
//               <Icon icon="lucide:x" />
//             </button>
//           </div>
//         )}

//         <section ref={tableRef} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
//           <div className="flex flex-col gap-3 border-b border-gray-200 p-5 md:flex-row md:items-center md:justify-between">
//             <div>
//               <h2 className="text-lg font-bold text-gray-950">
//                 {selectedTeacher?.name || "Teacher"}’s weekly workload
//               </h2>
//               <p className="mt-1 text-sm text-gray-500">
//                 {stats.subjects} subject(s) · {stats.classes} class(es) · {stats.sections} section(s)
//               </p>
//             </div>
//             <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
//               <StatPill label="Periods" value={stats.periods} />
//               <StatPill label="Subjects" value={stats.subjects} />
//               <StatPill label="Classes" value={stats.classes} />
//               <StatPill label="Sections" value={stats.sections} />
//             </div>
//           </div>

//           {!teacherId || !sessionId ? (
//             <EmptyState
//               title="Select teacher"
//               description="Select an academic session from the topbar, then choose a teacher to load workload."
//             />
//           ) : loading ? (
//             <div className="flex min-h-72 items-center justify-center">
//               <Icon icon="lucide:loader-2" className="animate-spin text-4xl text-blue-600" />
//             </div>
//           ) : periods.length === 0 ? (
//             <EmptyState title="No timetable found" description="This teacher has no active timetable periods in the selected session." />
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full min-w-[900px] text-left text-sm">
//                 <thead className="bg-gray-50 text-xs uppercase text-gray-500">
//                   <tr>
//                     <th className="px-5 py-4">Day</th>
//                     <th className="px-4 py-4">Period</th>
//                     <th className="px-4 py-4">Time</th>
//                     <th className="px-4 py-4">Subject</th>
//                     <th className="px-4 py-4">Class</th>
//                     <th className="px-4 py-4">Section</th>
//                     <th className="px-4 py-4">Room</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {periods.map((item) => (
//                     <tr key={item._id} className="hover:bg-gray-50">
//                       <td className="px-5 py-4 font-semibold text-gray-900">{dayLabel(item.day)}</td>
//                       <td className="px-4 py-4">{item.periodNumber}</td>
//                       <td className="px-4 py-4 text-gray-600">{item.startTime} – {item.endTime}</td>
//                       <td className="px-4 py-4 font-medium">{getRelationName(item.subjectId) || item.periodType}</td>
//                       <td className="px-4 py-4">{getRelationName(item.classId)}</td>
//                       <td className="px-4 py-4">Section {getRelationName(item.sectionId)}</td>
//                       <td className="px-4 py-4">{item.roomNumber || "—"}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// };

// const SelectField = ({
//   label,
//   value,
//   onChange,
//   options,
//   disabled = false,
// }: {
//   label: string;
//   value: string;
//   onChange: (value: string) => void;
//   options: { value: string; label: string }[];
//   disabled?: boolean;
// }) => (
//   <label className="text-sm font-medium text-gray-700">
//     {label}
//     <select
//       value={value}
//       disabled={disabled}
//       onChange={(event) => onChange(event.target.value)}
//       className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
//     >
//       <option value="">Select</option>
//       {options.map((item) => (
//         <option key={item.value} value={item.value}>
//           {item.label}
//         </option>
//       ))}
//     </select>
//   </label>
// );

// const StatPill = ({ label, value }: { label: string; value: number }) => (
//   <div className="rounded-lg bg-gray-50 px-3 py-2 text-center">
//     <p className="text-xs text-gray-500">{label}</p>
//     <p className="font-bold text-gray-950">{value}</p>
//   </div>
// );

// const EmptyState = ({ title, description }: { title: string; description: string }) => (
//   <div className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
//     <Icon icon="lucide:user-round-x" className="text-4xl text-gray-400" />
//     <h3 className="mt-3 text-lg font-bold text-gray-950">{title}</h3>
//     <p className="mt-1 text-sm text-gray-500">{description}</p>
//   </div>
// );

// export default TeacherTimetable;

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getSessions } from "../../../features/academic/sessions/session.slice";
import { getTeachers } from "../../../features/teachers/teacher.slice";
import {
  clearTimetableError,
  getTimetable,
} from "../../../features/timetable/timetable.slice";

const getRelationId = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "_id" in value) {
    const id = (value as { _id?: unknown })._id;
    return typeof id === "string" ? id : String(id ?? "");
  }
  return "";
};

const getRelationName = (value: unknown): string => {
  if (!value || typeof value !== "object" || !("name" in value)) return "";
  const name = (value as { name?: unknown }).name;
  return typeof name === "string" ? name : "";
};

const DAY_ORDER: Record<string, number> = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

const dayLabel = (day: string) => day.charAt(0) + day.slice(1).toLowerCase();

const TeacherTimetable: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tableRef = useRef<HTMLDivElement | null>(null);

  const { timetable, loading, error } = useAppSelector(
    (state) => state.timetable,
  );
  const { sessions } = useAppSelector((state) => state.sessions);
  const { teachers } = useAppSelector((state) => state.teachers);
  const { selectedSessionId } = useAppSelector(
    (state) => state.sessionSelection,
  );

  const sessionId = selectedSessionId || "";

  const previousSessionId = useRef(selectedSessionId);

  const selectedSession = useMemo(
    () => sessions.find((item) => item._id === selectedSessionId) || null,
    [sessions, selectedSessionId],
  );

  const [teacherId, setTeacherId] = useState(
    searchParams.get("teacherId") || "",
  );

  useEffect(() => {
    if (sessions.length === 0) {
      dispatch(getSessions());
    }

    dispatch(getTeachers());
  }, [dispatch, sessions.length]);

  useEffect(() => {
    const sessionChanged = previousSessionId.current !== selectedSessionId;

    previousSessionId.current = selectedSessionId;

    if (sessionChanged) {
      setTeacherId("");
    }

    dispatch(clearTimetableError());
  }, [dispatch, selectedSessionId]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (teacherId) params.set("teacherId", teacherId);
    setSearchParams(params, { replace: true });
  }, [teacherId, setSearchParams]);

  useEffect(() => {
    if (!sessionId || !teacherId) return;
    dispatch(
      getTimetable({
        sessionId,
        teacherId,
        isActive: true,
      }),
    );
  }, [dispatch, sessionId, teacherId]);

  const selectedTeacher = teachers.find((item) => item._id === teacherId);

  const periods = useMemo(
    () =>
      [...timetable].sort(
        (a, b) =>
          (DAY_ORDER[a.day] ?? 99) - (DAY_ORDER[b.day] ?? 99) ||
          a.periodNumber - b.periodNumber,
      ),
    [timetable],
  );

  const stats = useMemo(() => {
    const classIds = new Set<string>();
    const sectionIds = new Set<string>();
    const subjects = new Set<string>();

    periods.forEach((item) => {
      const classId = getRelationId(item.classId);
      const sectionId = getRelationId(item.sectionId);
      const subjectId = getRelationId(item.subjectId);
      if (classId) classIds.add(classId);
      if (sectionId) sectionIds.add(sectionId);
      if (subjectId) subjects.add(subjectId);
    });

    return {
      periods: periods.length,
      classes: classIds.size,
      sections: sectionIds.size,
      subjects: subjects.size,
    };
  }, [periods]);

  const downloadCsv = () => {
    const rows = [
      ["Day", "Period", "Time", "Subject", "Class", "Section", "Room"],
      ...periods.map((item) => [
        dayLabel(item.day),
        item.periodNumber,
        `${item.startTime}-${item.endTime}`,
        getRelationName(item.subjectId),
        getRelationName(item.classId),
        getRelationName(item.sectionId),
        item.roomNumber || "",
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    const sessionName = selectedSession?.name
      ? selectedSession.name.replace(/[^a-zA-Z0-9_-]+/g, "-")
      : "session";

    anchor.download = `${selectedTeacher?.name || "teacher"}-${sessionName}-timetable.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-5 md:p-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Academics</span>
              <Icon icon="lucide:chevron-right" />
              <span>Timetable</span>
              <Icon icon="lucide:chevron-right" />
              <span className="font-medium text-gray-900">
                Teacher timetable
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-bold text-gray-950">
              Teacher Timetable
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Review workload and identify schedule conflicts for a selected
              teacher in the academic session selected in the topbar.
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

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate("/school-admin/timetable/weekly")}
              disabled={!sessionId}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon icon="lucide:calendar" />
              Class timetable
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              disabled={!sessionId || !teacherId || periods.length === 0}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon icon="lucide:printer" />
              Print Timetable
            </button>
            <button
              type="button"
              onClick={downloadCsv}
              disabled={!sessionId || !teacherId || periods.length === 0}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon icon="lucide:download" />
              Download CSV
            </button>
          </div>
        </div>

        {!sessionId && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <Icon
              icon="lucide:triangle-alert"
              className="mt-0.5 text-xl text-amber-600"
            />
            <div>
              <p className="text-sm font-semibold text-amber-900">
                Select an academic session from the topbar
              </p>
              <p className="mt-1 text-xs leading-5 text-amber-700">
                Teacher timetable and workload statistics are session-wise.
              </p>
            </div>
          </div>
        )}

        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SelectField
              label="Teacher"
              value={teacherId}
              disabled={!sessionId}
              onChange={setTeacherId}
              options={teachers.map((item) => ({
                value: item._id,
                label: `${item.name}${item.employeeId ? ` — ${item.employeeId}` : ""}`,
              }))}
            />

            <div className="flex items-end">
              <div className="w-full rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800">
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:info" />
                  <span>
                    <strong>{selectedTeacher?.name || "Teacher"}</strong> ·{" "}
                    {stats.periods} weekly periods
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => dispatch(clearTimetableError())}
            >
              <Icon icon="lucide:x" />
            </button>
          </div>
        )}

        <section
          ref={tableRef}
          className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="flex flex-col gap-3 border-b border-gray-200 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-950">
                {selectedTeacher?.name || "Teacher"}’s weekly workload
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {stats.subjects} subject(s) · {stats.classes} class(es) ·{" "}
                {stats.sections} section(s)
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <StatPill label="Periods" value={stats.periods} />
              <StatPill label="Subjects" value={stats.subjects} />
              <StatPill label="Classes" value={stats.classes} />
              <StatPill label="Sections" value={stats.sections} />
            </div>
          </div>

          {!teacherId || !sessionId ? (
            <EmptyState
              title="Select teacher"
              description="Select an academic session from the topbar, then choose a teacher to load workload."
            />
          ) : loading ? (
            <div className="flex min-h-72 items-center justify-center">
              <Icon
                icon="lucide:loader-2"
                className="animate-spin text-4xl text-blue-600"
              />
            </div>
          ) : periods.length === 0 ? (
            <EmptyState
              title="No timetable found"
              description="This teacher has no active timetable periods in the selected session."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Day</th>
                    <th className="px-4 py-4">Period</th>
                    <th className="px-4 py-4">Time</th>
                    <th className="px-4 py-4">Subject</th>
                    <th className="px-4 py-4">Class</th>
                    <th className="px-4 py-4">Section</th>
                    <th className="px-4 py-4">Room</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {periods.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-5 py-4 font-semibold text-gray-900">
                        {dayLabel(item.day)}
                      </td>
                      <td className="px-4 py-4">{item.periodNumber}</td>
                      <td className="px-4 py-4 text-gray-600">
                        {item.startTime} – {item.endTime}
                      </td>
                      <td className="px-4 py-4 font-medium">
                        {getRelationName(item.subjectId) || item.periodType}
                      </td>
                      <td className="px-4 py-4">
                        {getRelationName(item.classId)}
                      </td>
                      <td className="px-4 py-4">
                        Section {getRelationName(item.sectionId)}
                      </td>
                      <td className="px-4 py-4">{item.roomNumber || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const SelectField = ({
  label,
  value,
  onChange,
  options,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}) => (
  <label className="text-sm font-medium text-gray-700">
    {label}
    <select
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
    >
      <option value="">Select</option>
      {options.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  </label>
);

const StatPill = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-lg bg-gray-50 px-3 py-2 text-center">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-bold text-gray-950">{value}</p>
  </div>
);

const EmptyState = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
    <Icon icon="lucide:user-round-x" className="text-4xl text-gray-400" />
    <h3 className="mt-3 text-lg font-bold text-gray-950">{title}</h3>
    <p className="mt-1 text-sm text-gray-500">{description}</p>
  </div>
);

export default TeacherTimetable;
