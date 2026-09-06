// import React, { useEffect, useMemo, useState } from "react";
// import { Icon } from "@iconify/react";
// import { useNavigate, useSearchParams } from "react-router-dom";

// import { useAppDispatch, useAppSelector } from "../../../app/hooks";
// import { getSessions } from "../../../features/academic/sessions/session.slice";
// import { getClasses } from "../../../features/academic/classes/class.slice";
// import { getSections } from "../../../features/academic/sections/section.slice";
// import {
//   clearTimetableError,
//   getTimetable,
// } from "../../../features/timetable/timetable.slice";
// import {
//   TimetableDay,
//   TimetablePeriodType,
// } from "../../../features/timetable/timetable.types";
// import type { TimetableDay as TimetableDayType } from "../../../features/timetable/timetable.types";

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

// const getToday = () => new Date().toISOString().slice(0, 10);

// const dateToTimetableDay = (date: string): TimetableDayType | null => {
//   const value = new Date(`${date}T00:00:00`).getDay();
//   const map: Partial<Record<number, TimetableDayType>> = {
//     1: TimetableDay.MONDAY,
//     2: TimetableDay.TUESDAY,
//     3: TimetableDay.WEDNESDAY,
//     4: TimetableDay.THURSDAY,
//     5: TimetableDay.FRIDAY,
//     6: TimetableDay.SATURDAY,
//   };
//   return map[value] ?? null;
// };

// const formatDate = (date: string) =>
//   new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
//     weekday: "long",
//     day: "2-digit",
//     month: "long",
//     year: "numeric",
//   });

// const formatTime = (time: string): string => {
//   const [h = "0", m = "00"] = time.split(":");
//   const hours = Number(h);
//   const suffix = hours >= 12 ? "PM" : "AM";
//   return `${String(hours % 12 || 12).padStart(2, "0")}:${m} ${suffix}`;
// };

// const DailyTimetable: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();
//   const [searchParams, setSearchParams] = useSearchParams();

//   const { timetable, loading, error } = useAppSelector((state) => state.timetable);
//   const { sessions } = useAppSelector((state) => state.sessions);
//   const { classes } = useAppSelector((state) => state.classes);
//   const { sections } = useAppSelector((state) => state.sections);
//   const { selectedSessionId } = useAppSelector(
//     (state) => state.sessionSelection
//   );

//   const selectedSession = useMemo(
//     () =>
//       sessions.find(
//         (item) => item._id === selectedSessionId
//       ) || null,
//     [sessions, selectedSessionId]
//   );

//   const sessionId = selectedSessionId || "";

//   const [classId, setClassId] = useState(
//     searchParams.get("classId") || ""
//   );

//   const [sectionId, setSectionId] = useState(
//     searchParams.get("sectionId") || ""
//   );

//   const [selectedDate, setSelectedDate] = useState(
//     searchParams.get("date") || getToday()
//   );

//   useEffect(() => {
//     if (sessions.length === 0) {
//       dispatch(getSessions());
//     }
//   }, [dispatch, sessions.length]);

//   useEffect(() => {
//     setClassId("");
//     setSectionId("");

//     if (!sessionId) return;

//     dispatch(
//       getClasses({
//         sessionId,
//       })
//     );

//     dispatch(
//       getSections({
//         sessionId,
//       })
//     );
//   }, [dispatch, sessionId]);

//   const availableClasses = useMemo(
//     () =>
//       sessionId
//         ? classes.filter(
//             (item) => getRelationId(item.sessionId) === sessionId
//           )
//         : [],
//     [classes, sessionId]
//   );

//   const availableSections = useMemo(
//     () =>
//       sessionId && classId
//         ? sections.filter(
//             (item) =>
//               getRelationId(item.sessionId) === sessionId &&
//               getRelationId(item.classId) === classId &&
//               item.isActive !== false
//           )
//         : [],
//     [sections, sessionId, classId]
//   );

//   const handleClassChange = (value: string) => {
//     setClassId(value);
//     setSectionId("");

//     if (!sessionId || !value) return;

//     dispatch(
//       getSections({
//         sessionId,
//         classId: value,
//       })
//     );
//   };

//   const day = dateToTimetableDay(selectedDate);

//   useEffect(() => {
//     const params = new URLSearchParams();
//     if (sessionId) params.set("sessionId", sessionId);
//     if (classId) params.set("classId", classId);
//     if (sectionId) params.set("sectionId", sectionId);
//     params.set("date", selectedDate);
//     setSearchParams(params, { replace: true });
//   }, [sessionId, classId, sectionId, selectedDate, setSearchParams]);

//   useEffect(() => {
//     if (!sessionId || !classId || !sectionId || !day) return;
//     dispatch(
//       getTimetable({
//         sessionId,
//         classId,
//         sectionId,
//         day,
//         isActive: true,
//       })
//     );
//   }, [dispatch, sessionId, classId, sectionId, day]);

//   const selectedClass = availableClasses.find((item) => item._id === classId);
//   const selectedSection = availableSections.find((item) => item._id === sectionId);

//   const sortedPeriods = useMemo(
//     () =>
//       [...timetable].sort(
//         (a, b) =>
//           a.periodNumber - b.periodNumber ||
//           a.startTime.localeCompare(b.startTime)
//       ),
//     [timetable]
//   );

//   const dayName = day
//     ? day.charAt(0) + day.slice(1).toLowerCase()
//     : "Sunday";

//   const downloadCsv = () => {
//     const rows = [
//       ["Period", "Time", "Type", "Subject", "Teacher", "Room"],
//       ...sortedPeriods.map((item) => [
//         item.periodNumber,
//         `${item.startTime}-${item.endTime}`,
//         item.periodType,
//         getRelationName(item.subjectId),
//         getRelationName(item.teacherId),
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
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `daily-timetable-${selectedDate}.csv`;
//     a.click();
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
//               <span className="font-medium text-gray-900">Daily view</span>
//             </div>
//             <h1 className="mt-2 text-3xl font-bold text-gray-950">Daily Timetable</h1>
//             <p className="mt-1 text-sm text-gray-500">
//               Review the class schedule one day at a time for the academic
//               session selected in the topbar.
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

//           <div className="flex gap-2">
//             <button
//               type="button"
//               onClick={() => {
//                 const params = new URLSearchParams();
//                 if (sessionId) params.set("sessionId", sessionId);
//                 if (classId) params.set("classId", classId);
//                 if (sectionId) params.set("sectionId", sectionId);
//                 navigate(`/school-admin/timetable/weekly?${params.toString()}`);
//               }}
//               disabled={!sessionId}
//               className="min-h-11 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               Weekly view
//             </button>
//             <button
//               type="button"
//               onClick={() => window.print()}
//               disabled={!sessionId || !classId || !sectionId || !day}
//               className="flex min-h-11 items-center rounded-lg border border-gray-300 bg-white px-3 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
//               title="Print"
//             >
//               <Icon icon="lucide:printer" />
//             </button>
//             <button
//               type="button"
//               onClick={downloadCsv}
//               disabled={!sessionId || !classId || !sectionId || !day}
//               className="flex min-h-11 items-center rounded-lg border border-gray-300 bg-white px-3 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
//               title="Download CSV"
//             >
//               <Icon icon="lucide:download" />
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
//                 Classes, sections and timetable periods are session-wise.
//               </p>
//             </div>
//           </div>
//         )}

//         <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
//             <label className="text-sm font-medium text-gray-700">
//               Date / Day
//               <input
//                 type="date"
//                 value={selectedDate}
//                 onChange={(event) => setSelectedDate(event.target.value)}
//                 className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 px-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//               />
//             </label>

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
//               label="Class"
//               value={classId}
//               disabled={!sessionId}
//               onChange={handleClassChange}
//               options={availableClasses.map((item) => ({
//                 value: item._id,
//                 label: item.name,
//               }))}
//             />

//             <SelectField
//               label="Section"
//               value={sectionId}
//               disabled={!classId}
//               onChange={setSectionId}
//               options={availableSections.map((item) => ({
//                 value: item._id,
//                 label: `Section ${item.name}`,
//               }))}
//             />
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

//         <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
//           <div className="border-b border-gray-200 p-5">
//             <h2 className="text-lg font-bold text-gray-950">
//               {dayName} · {selectedClass?.name || "Class"} · Section{" "}
//               {selectedSection?.name || "-"}
//             </h2>
//             <p className="mt-1 text-sm text-gray-500">
//               {formatDate(selectedDate)} · {sortedPeriods.length} scheduled period(s)
//             </p>
//           </div>

//           {!day ? (
//             <EmptyState
//               icon="lucide:calendar-off"
//               title="Sunday has no school timetable"
//               description="Select Monday to Saturday to view scheduled periods."
//             />
//           ) : !sessionId || !classId || !sectionId ? (
//             <EmptyState
//               icon="lucide:list-filter"
//               title="Select timetable context"
//               description="Select academic session from the topbar, then choose class and section."
//             />
//           ) : loading ? (
//             <div className="flex min-h-72 flex-col items-center justify-center gap-3">
//               <Icon icon="lucide:loader-2" className="animate-spin text-4xl text-blue-600" />
//               <p className="text-sm text-gray-500">Loading timetable...</p>
//             </div>
//           ) : sortedPeriods.length === 0 ? (
//             <EmptyState
//               icon="lucide:calendar-x"
//               title="No periods scheduled"
//               description="No timetable periods were found for this class, section and day."
//             />
//           ) : (
//             <div className="divide-y divide-gray-200">
//               {sortedPeriods.map((period) => {
//                 const breakLike =
//                   period.periodType === TimetablePeriodType.BREAK ||
//                   period.periodType === TimetablePeriodType.LUNCH;
//                 return (
//                   <div
//                     key={period._id}
//                     className={`grid grid-cols-1 gap-4 p-5 md:grid-cols-[120px_1fr_auto] md:items-center ${
//                       breakLike ? "bg-sky-50" : "bg-white"
//                     }`}
//                   >
//                     <div>
//                       <p className="font-bold text-gray-950">
//                         {breakLike
//                           ? period.periodType === TimetablePeriodType.BREAK
//                             ? "Break"
//                             : "Lunch"
//                           : `Period ${period.periodNumber}`}
//                       </p>
//                       <p className="mt-1 text-xs text-gray-500">
//                         {formatTime(period.startTime)} – {formatTime(period.endTime)}
//                       </p>
//                     </div>

//                     <div>
//                       <p className="font-semibold text-gray-900">
//                         {getRelationName(period.subjectId) ||
//                           (breakLike ? "Common break" : "Activity")}
//                       </p>
//                       <p className="mt-1 text-sm text-gray-500">
//                         {getRelationName(period.teacherId) || "No teacher"}
//                         {period.roomNumber ? ` · Room ${period.roomNumber}` : ""}
//                       </p>
//                     </div>

//                     <div className="flex items-center gap-2">
//                       <span
//                         className={`rounded-full px-3 py-1 text-xs font-semibold ${
//                           breakLike
//                             ? "bg-sky-100 text-sky-700"
//                             : period.periodType === TimetablePeriodType.ACTIVITY
//                               ? "bg-teal-100 text-teal-700"
//                               : "bg-blue-50 text-blue-700"
//                         }`}
//                       >
//                         {period.periodType.replace("_", " ")}
//                       </span>
//                       <button
//                         type="button"
//                         onClick={() =>
//                           navigate(`/school-admin/timetable/${period._id}/edit`)
//                         }
//                         className="min-h-10 rounded-lg border border-gray-300 px-3 text-sm font-semibold text-blue-600 hover:bg-gray-50"
//                       >
//                         View period
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
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
//       className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
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

// const EmptyState = ({
//   icon,
//   title,
//   description,
// }: {
//   icon: string;
//   title: string;
//   description: string;
// }) => (
//   <div className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
//     <Icon icon={icon} className="text-4xl text-gray-400" />
//     <h3 className="mt-3 text-lg font-bold text-gray-950">{title}</h3>
//     <p className="mt-1 max-w-md text-sm text-gray-500">{description}</p>
//   </div>
// );

// export default DailyTimetable;

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getSessions } from "../../../features/academic/sessions/session.slice";
import { getClasses } from "../../../features/academic/classes/class.slice";
import { getSections } from "../../../features/academic/sections/section.slice";
import {
  clearTimetableError,
  getTimetable,
} from "../../../features/timetable/timetable.slice";
import {
  TimetableDay,
  TimetablePeriodType,
} from "../../../features/timetable/timetable.types";
import type { TimetableDay as TimetableDayType } from "../../../features/timetable/timetable.types";

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

const getToday = () => new Date().toISOString().slice(0, 10);

const dateToTimetableDay = (date: string): TimetableDayType | null => {
  const value = new Date(`${date}T00:00:00`).getDay();
  const map: Partial<Record<number, TimetableDayType>> = {
    1: TimetableDay.MONDAY,
    2: TimetableDay.TUESDAY,
    3: TimetableDay.WEDNESDAY,
    4: TimetableDay.THURSDAY,
    5: TimetableDay.FRIDAY,
    6: TimetableDay.SATURDAY,
  };
  return map[value] ?? null;
};

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const formatTime = (time: string): string => {
  const [h = "0", m = "00"] = time.split(":");
  const hours = Number(h);
  const suffix = hours >= 12 ? "PM" : "AM";
  return `${String(hours % 12 || 12).padStart(2, "0")}:${m} ${suffix}`;
};

const DailyTimetable: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { timetable, loading, error } = useAppSelector(
    (state) => state.timetable,
  );
  const { sessions } = useAppSelector((state) => state.sessions);
  const { classes } = useAppSelector((state) => state.classes);
  const { sections } = useAppSelector((state) => state.sections);
  const { selectedSessionId } = useAppSelector(
    (state) => state.sessionSelection,
  );

  const selectedSession = useMemo(
    () => sessions.find((item) => item._id === selectedSessionId) || null,
    [sessions, selectedSessionId],
  );

  const sessionId = selectedSessionId || "";

  const previousSessionId = useRef(selectedSessionId);

  const [classId, setClassId] = useState(searchParams.get("classId") || "");

  const [sectionId, setSectionId] = useState(
    searchParams.get("sectionId") || "",
  );

  const [selectedDate, setSelectedDate] = useState(
    searchParams.get("date") || getToday(),
  );

  useEffect(() => {
    if (sessions.length === 0) {
      dispatch(getSessions());
    }
  }, [dispatch, sessions.length]);

  useEffect(() => {
    const sessionChanged = previousSessionId.current !== selectedSessionId;

    previousSessionId.current = selectedSessionId;

    if (sessionChanged) {
      setClassId("");
      setSectionId("");
    }

    if (!sessionId) return;

    dispatch(
      getClasses({
        sessionId,
      }),
    );

    dispatch(
      getSections({
        sessionId,
      }),
    );
  }, [dispatch, sessionId]);

  const availableClasses = useMemo(
    () =>
      sessionId
        ? classes.filter((item) => getRelationId(item.sessionId) === sessionId)
        : [],
    [classes, sessionId],
  );

  const availableSections = useMemo(
    () =>
      sessionId && classId
        ? sections.filter(
            (item) =>
              getRelationId(item.sessionId) === sessionId &&
              getRelationId(item.classId) === classId &&
              item.isActive !== false,
          )
        : [],
    [sections, sessionId, classId],
  );

  const handleClassChange = (value: string) => {
    setClassId(value);
    setSectionId("");

    if (!sessionId || !value) return;

    dispatch(
      getSections({
        sessionId,
        classId: value,
      }),
    );
  };

  const day = dateToTimetableDay(selectedDate);

  useEffect(() => {
    const params = new URLSearchParams();
    if (classId) params.set("classId", classId);
    if (sectionId) params.set("sectionId", sectionId);
    params.set("date", selectedDate);
    setSearchParams(params, { replace: true });
  }, [classId, sectionId, selectedDate, setSearchParams]);

  useEffect(() => {
    if (!sessionId || !classId || !sectionId || !day) return;
    dispatch(
      getTimetable({
        sessionId,
        classId,
        sectionId,
        day,
        isActive: true,
      }),
    );
  }, [dispatch, sessionId, classId, sectionId, day]);

  const selectedClass = availableClasses.find((item) => item._id === classId);
  const selectedSection = availableSections.find(
    (item) => item._id === sectionId,
  );

  const sortedPeriods = useMemo(
    () =>
      [...timetable].sort(
        (a, b) =>
          a.periodNumber - b.periodNumber ||
          a.startTime.localeCompare(b.startTime),
      ),
    [timetable],
  );

  const dayName = day ? day.charAt(0) + day.slice(1).toLowerCase() : "Sunday";

  const downloadCsv = () => {
    const rows = [
      ["Period", "Time", "Type", "Subject", "Teacher", "Room"],
      ...sortedPeriods.map((item) => [
        item.periodNumber,
        `${item.startTime}-${item.endTime}`,
        item.periodType,
        getRelationName(item.subjectId),
        getRelationName(item.teacherId),
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
    const a = document.createElement("a");
    a.href = url;
    a.download = `daily-timetable-${selectedDate}.csv`;
    a.click();
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
              <span className="font-medium text-gray-900">Daily view</span>
            </div>
            <h1 className="mt-2 text-3xl font-bold text-gray-950">
              Daily Timetable
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Review the class schedule one day at a time for the academic
              session selected in the topbar.
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
              type="button"
              onClick={() => {
                const params = new URLSearchParams();
                if (classId) params.set("classId", classId);
                if (sectionId) params.set("sectionId", sectionId);
                navigate(`/school-admin/timetable/weekly?${params.toString()}`);
              }}
              disabled={!sessionId}
              className="min-h-11 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Weekly view
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              disabled={!sessionId || !classId || !sectionId || !day}
              className="flex min-h-11 items-center rounded-lg border border-gray-300 bg-white px-3 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              title="Print"
            >
              <Icon icon="lucide:printer" />
            </button>
            <button
              type="button"
              onClick={downloadCsv}
              disabled={!sessionId || !classId || !sectionId || !day}
              className="flex min-h-11 items-center rounded-lg border border-gray-300 bg-white px-3 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              title="Download CSV"
            >
              <Icon icon="lucide:download" />
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
                Classes, sections and timetable periods are session-wise.
              </p>
            </div>
          </div>
        )}

        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <label className="text-sm font-medium text-gray-700">
              Date / Day
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 px-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <SelectField
              label="Class"
              value={classId}
              disabled={!sessionId}
              onChange={handleClassChange}
              options={availableClasses.map((item) => ({
                value: item._id,
                label: item.name,
              }))}
            />

            <SelectField
              label="Section"
              value={sectionId}
              disabled={!classId}
              onChange={setSectionId}
              options={availableSections.map((item) => ({
                value: item._id,
                label: `Section ${item.name}`,
              }))}
            />
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

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 p-5">
            <h2 className="text-lg font-bold text-gray-950">
              {dayName} · {selectedClass?.name || "Class"} · Section{" "}
              {selectedSection?.name || "-"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {formatDate(selectedDate)} · {sortedPeriods.length} scheduled
              period(s)
            </p>
          </div>

          {!day ? (
            <EmptyState
              icon="lucide:calendar-off"
              title="Sunday has no school timetable"
              description="Select Monday to Saturday to view scheduled periods."
            />
          ) : !sessionId || !classId || !sectionId ? (
            <EmptyState
              icon="lucide:list-filter"
              title="Select timetable context"
              description="Select academic session from the topbar, then choose class and section."
            />
          ) : loading ? (
            <div className="flex min-h-72 flex-col items-center justify-center gap-3">
              <Icon
                icon="lucide:loader-2"
                className="animate-spin text-4xl text-blue-600"
              />
              <p className="text-sm text-gray-500">Loading timetable...</p>
            </div>
          ) : sortedPeriods.length === 0 ? (
            <EmptyState
              icon="lucide:calendar-x"
              title="No periods scheduled"
              description="No timetable periods were found for this class, section and day."
            />
          ) : (
            <div className="divide-y divide-gray-200">
              {sortedPeriods.map((period) => {
                const breakLike =
                  period.periodType === TimetablePeriodType.BREAK ||
                  period.periodType === TimetablePeriodType.LUNCH;
                return (
                  <div
                    key={period._id}
                    className={`grid grid-cols-1 gap-4 p-5 md:grid-cols-[120px_1fr_auto] md:items-center ${
                      breakLike ? "bg-sky-50" : "bg-white"
                    }`}
                  >
                    <div>
                      <p className="font-bold text-gray-950">
                        {breakLike
                          ? period.periodType === TimetablePeriodType.BREAK
                            ? "Break"
                            : "Lunch"
                          : `Period ${period.periodNumber}`}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {formatTime(period.startTime)} –{" "}
                        {formatTime(period.endTime)}
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold text-gray-900">
                        {getRelationName(period.subjectId) ||
                          (breakLike ? "Common break" : "Activity")}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {getRelationName(period.teacherId) || "No teacher"}
                        {period.roomNumber
                          ? ` · Room ${period.roomNumber}`
                          : ""}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          breakLike
                            ? "bg-sky-100 text-sky-700"
                            : period.periodType === TimetablePeriodType.ACTIVITY
                              ? "bg-teal-100 text-teal-700"
                              : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {period.periodType.replace("_", " ")}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/school-admin/timetable/${period._id}/edit`)
                        }
                        className="min-h-10 rounded-lg border border-gray-300 px-3 text-sm font-semibold text-blue-600 hover:bg-gray-50"
                      >
                        View period
                      </button>
                    </div>
                  </div>
                );
              })}
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
      className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
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

const EmptyState = ({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) => (
  <div className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
    <Icon icon={icon} className="text-4xl text-gray-400" />
    <h3 className="mt-3 text-lg font-bold text-gray-950">{title}</h3>
    <p className="mt-1 max-w-md text-sm text-gray-500">{description}</p>
  </div>
);

export default DailyTimetable;
