// import React, { useEffect, useMemo, useState } from "react";

// import { Icon } from "@iconify/react";

// import { useNavigate, useSearchParams } from "react-router-dom";

// import api from "../../../api/axios";

// import { useAppDispatch, useAppSelector } from "../../../app/hooks";

// import { getSessions } from "../../../features/academic/sessions/session.slice";

// import { getClasses } from "../../../features/academic/classes/class.slice";

// import { getSections } from "../../../features/academic/sections/section.slice";

// import {
//   getAttendance,
//   markBulkAttendance,
//   clearAttendanceError,
// } from "../../../features/attendance/attendance.slice";

// import type {
//   AttendanceStatus,
//   StudentAttendanceInput,
// } from "../../../features/attendance/attendance.types";

// // ============================================
// // LOCAL STUDENT TYPE
// //
// // Student module complete hone ke baad
// // isko student.types.ts se import kar sakte ho.
// // ============================================

// interface StudentData {
//   _id: string;

//   firstName: string;

//   lastName?: string;

//   admissionNumber?: string;

//   rollNumber?: string | number;

//   profileImage?: string;

//   sessionId:
//     | string
//     | {
//         _id: string;
//         name?: string;
//       };

//   classId:
//     | string
//     | {
//         _id: string;
//         name?: string;
//       };

//   sectionId:
//     | string
//     | {
//         _id: string;
//         name?: string;
//       };

//   isActive?: boolean;
// }

// // ============================================
// // EDITABLE ATTENDANCE ROW
// // ============================================

// interface AttendanceRow {
//   studentId: string;

//   firstName: string;

//   lastName: string;

//   admissionNumber: string;

//   rollNumber: string | number;

//   profileImage: string;

//   className: string;

//   sectionName: string;

//   status: AttendanceStatus;

//   remarks: string;
// }

// // ============================================
// // HELPER
// // ============================================

// const getRelationId = (value: unknown): string => {
//   if (typeof value === "string") {
//     return value;
//   }

//   if (value && typeof value === "object" && "_id" in value) {
//     const id = (
//       value as {
//         _id?: unknown;
//       }
//     )._id;

//     return typeof id === "string" ? id : String(id ?? "");
//   }

//   return "";
// };

// // ============================================
// // RELATION NAME
// // ============================================

// const getRelationName = (value: unknown): string => {
//   if (!value || typeof value !== "object" || !("name" in value)) {
//     return "";
//   }

//   const name = (
//     value as {
//       name?: unknown;
//     }
//   ).name;

//   return typeof name === "string" ? name : "";
// };

// // ============================================
// // DATE
// // ============================================

// const getToday = (): string => {
//   return new Date().toISOString().slice(0, 10);
// };

// // ============================================
// // DISPLAY DATE
// // ============================================

// const formatDate = (value: string): string => {
//   if (!value) {
//     return "-";
//   }

//   const date = new Date(`${value}T00:00:00`);

//   if (Number.isNaN(date.getTime())) {
//     return value;
//   }

//   return date.toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// // ============================================
// // INITIALS
// // ============================================

// const getInitials = (firstName: string, lastName: string) => {
//   return `${firstName.charAt(0)}${lastName.charAt(0)}`.trim().toUpperCase();
// };

// // ============================================
// // MAIN COMPONENT
// // ============================================

// const MarkAttendance: React.FC = () => {
//   const dispatch = useAppDispatch();

//   const navigate = useNavigate();

//   const [searchParams] = useSearchParams();

//   // ============================================
//   // REDUX DATA
//   // ============================================

//   const { sessions } = useAppSelector((state) => state.sessions);

//   const { classes } = useAppSelector((state) => state.classes);

//   const { sections } = useAppSelector((state) => state.sections);

//   const { attendance, saving, error } = useAppSelector(
//     (state) => state.attendance,
//   );

//   // ============================================
//   // FILTER STATE
//   // Query params DailyAttendance se aa sakte hain
//   // ============================================

//   const [selectedSessionId, setSelectedSessionId] = useState(
//     searchParams.get("sessionId") || "",
//   );

//   const [selectedClassId, setSelectedClassId] = useState(
//     searchParams.get("classId") || "",
//   );

//   const [selectedSectionId, setSelectedSectionId] = useState(
//     searchParams.get("sectionId") || "",
//   );

//   const [selectedDate, setSelectedDate] = useState(
//     searchParams.get("date") || getToday(),
//   );

//   const [searchQuery, setSearchQuery] = useState("");

//   // ============================================
//   // STUDENT STATE
//   // ============================================

//   const [students, setStudents] = useState<StudentData[]>([]);

//   const [attendanceRows, setAttendanceRows] = useState<AttendanceRow[]>([]);

//   const [originalRows, setOriginalRows] = useState<AttendanceRow[]>([]);

//   const [studentsLoading, setStudentsLoading] = useState(false);

//   const [studentsError, setStudentsError] = useState<string | null>(null);

//   const [successMessage, setSuccessMessage] = useState<string | null>(null);

//   // ============================================
//   // PAGINATION
//   // ============================================

//   const [currentPage, setCurrentPage] = useState(1);

//   const itemsPerPage = 25;

//   // ============================================
//   // LOAD MASTER DATA
//   // ============================================

//   useEffect(() => {
//     dispatch(getSessions());

//     dispatch(getClasses(undefined));

//     dispatch(getSections(undefined));
//   }, [dispatch]);

//   // ============================================
//   // DEFAULT SESSION
//   // ============================================

//   useEffect(() => {
//     if (selectedSessionId || sessions.length === 0) {
//       return;
//     }

//     const currentSession = sessions.find((session) => session.isCurrent);

//     setSelectedSessionId(currentSession?._id || sessions[0]?._id || "");
//   }, [sessions, selectedSessionId]);

//   // ============================================
//   // CLASSES FOR SESSION
//   // ============================================

//   const availableClasses = useMemo(() => {
//     if (!selectedSessionId) {
//       return [];
//     }

//     return classes.filter(
//       (item) => getRelationId(item.sessionId) === selectedSessionId,
//     );
//   }, [classes, selectedSessionId]);

//   // ============================================
//   // CHECK SELECTED CLASS
//   // ============================================

//   useEffect(() => {
//     if (!selectedClassId) {
//       return;
//     }

//     const exists = availableClasses.some(
//       (item) => item._id === selectedClassId,
//     );

//     if (!exists) {
//       setSelectedClassId("");

//       setSelectedSectionId("");
//     }
//   }, [availableClasses, selectedClassId]);

//   // ============================================
//   // SECTIONS FOR CLASS
//   // ============================================

//   const availableSections = useMemo(() => {
//     if (!selectedSessionId || !selectedClassId) {
//       return [];
//     }

//     return sections.filter(
//       (section) =>
//         getRelationId(section.sessionId) === selectedSessionId &&
//         getRelationId(section.classId) === selectedClassId &&
//         section.isActive !== false,
//     );
//   }, [sections, selectedSessionId, selectedClassId]);

//   // ============================================
//   // CHECK SELECTED SECTION
//   // ============================================

//   useEffect(() => {
//     if (!selectedSectionId) {
//       return;
//     }

//     const exists = availableSections.some(
//       (item) => item._id === selectedSectionId,
//     );

//     if (!exists) {
//       setSelectedSectionId("");
//     }
//   }, [availableSections, selectedSectionId]);

//   // ============================================
//   // SELECTED LABELS
//   // ============================================

//   const selectedSession = sessions.find(
//     (item) => item._id === selectedSessionId,
//   );

//   const selectedClass = availableClasses.find(
//     (item) => item._id === selectedClassId,
//   );

//   const selectedSection = availableSections.find(
//     (item) => item._id === selectedSectionId,
//   );

//   // ============================================
//   // GET STUDENTS
//   //
//   // Student backend ready hote hi:
//   // GET /students
//   // ?sessionId=
//   // &classId=
//   // &sectionId=
//   // &isActive=true
//   // ============================================

//   useEffect(() => {
//     const fetchStudents = async () => {
//       if (!selectedSessionId || !selectedClassId || !selectedSectionId) {
//         setStudents([]);

//         setAttendanceRows([]);

//         return;
//       }

//       try {
//         setStudentsLoading(true);

//         setStudentsError(null);

//         const response = await api.get("/students", {
//           params: {
//             sessionId: selectedSessionId,

//             classId: selectedClassId,

//             sectionId: selectedSectionId,

//             isActive: true,
//           },
//         });

//         // Different common response shapes tolerate karega
//         const result =
//           response.data?.data?.students ?? response.data?.students ?? [];

//         setStudents(Array.isArray(result) ? result : []);
//       } catch (error: any) {
//         setStudents([]);

//         setStudentsError(
//           error.response?.data?.message || "Failed to load students",
//         );
//       } finally {
//         setStudentsLoading(false);
//       }
//     };

//     fetchStudents();
//   }, [selectedSessionId, selectedClassId, selectedSectionId]);

//   // ============================================
//   // EXISTING ATTENDANCE
//   //
//   // Date already saved hai to statuses load honge.
//   // ============================================

//   useEffect(() => {
//     if (
//       !selectedSessionId ||
//       !selectedClassId ||
//       !selectedSectionId ||
//       !selectedDate
//     ) {
//       return;
//     }

//     dispatch(
//       getAttendance({
//         sessionId: selectedSessionId,

//         classId: selectedClassId,

//         sectionId: selectedSectionId,

//         date: selectedDate,
//       }),
//     );
//   }, [
//     dispatch,
//     selectedSessionId,
//     selectedClassId,
//     selectedSectionId,
//     selectedDate,
//   ]);

//   // ============================================
//   // BUILD EDITABLE ROWS
//   //
//   // Existing attendance ho to status use karega.
//   // Otherwise default PRESENT.
//   // ============================================

//   useEffect(() => {
//     if (students.length === 0) {
//       setAttendanceRows([]);

//       setOriginalRows([]);

//       return;
//     }

//     const rows = students.map((student) => {
//       const existing = attendance.find((record) => {
//         const recordStudentId = getRelationId(record.studentId);

//         return recordStudentId === student._id;
//       });

//       const row: AttendanceRow = {
//         studentId: student._id,

//         firstName: student.firstName,

//         lastName: student.lastName || "",

//         admissionNumber: student.admissionNumber || "-",

//         rollNumber: student.rollNumber ?? "-",

//         profileImage: student.profileImage || "",

//         className:
//           getRelationName(student.classId) || selectedClass?.name || "-",

//         sectionName:
//           getRelationName(student.sectionId) || selectedSection?.name || "-",

//         status: existing?.status || "PRESENT",

//         remarks: existing?.remarks || "",
//       };

//       return row;
//     });

//     setAttendanceRows(rows);

//     setOriginalRows(
//       rows.map((row) => ({
//         ...row,
//       })),
//     );
//   }, [students, attendance, selectedClass?.name, selectedSection?.name]);

//   // ============================================
//   // SEARCH
//   // ============================================

//   const filteredRows = useMemo(() => {
//     const search = searchQuery.trim().toLowerCase();

//     if (!search) {
//       return attendanceRows;
//     }

//     return attendanceRows.filter((row) => {
//       const text = [
//         row.firstName,
//         row.lastName,
//         row.admissionNumber,
//         String(row.rollNumber),
//       ]
//         .join(" ")
//         .toLowerCase();

//       return text.includes(search);
//     });
//   }, [attendanceRows, searchQuery]);

//   // ============================================
//   // STATS
//   // ============================================

//   const stats = useMemo(() => {
//     const total = attendanceRows.length;

//     const present = attendanceRows.filter(
//       (row) => row.status === "PRESENT",
//     ).length;

//     const absent = attendanceRows.filter(
//       (row) => row.status === "ABSENT",
//     ).length;

//     const leave = attendanceRows.filter((row) => row.status === "LEAVE").length;

//     const halfDay = attendanceRows.filter(
//       (row) => row.status === "HALF_DAY",
//     ).length;

//     const attendanceUnits = present + halfDay * 0.5;

//     const percentage =
//       total > 0 ? Number(((attendanceUnits / total) * 100).toFixed(1)) : 0;

//     return {
//       total,
//       present,
//       absent,
//       leave,
//       halfDay,
//       percentage,
//     };
//   }, [attendanceRows]);

//   // ============================================
//   // PAGINATION
//   // ============================================

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [selectedSessionId, selectedClassId, selectedSectionId, searchQuery]);

//   const totalPages = Math.max(1, Math.ceil(filteredRows.length / itemsPerPage));

//   const paginatedRows = useMemo(() => {
//     const start = (currentPage - 1) * itemsPerPage;

//     return filteredRows.slice(start, start + itemsPerPage);
//   }, [filteredRows, currentPage]);

//   // ============================================
//   // STATUS CHANGE
//   // ============================================

//   const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
//     setAttendanceRows((previous) =>
//       previous.map((row) =>
//         row.studentId === studentId
//           ? {
//               ...row,
//               status,
//             }
//           : row,
//       ),
//     );
//   };

//   // ============================================
//   // REMARK
//   // ============================================

//   const handleRemarksChange = (studentId: string, remarks: string) => {
//     setAttendanceRows((previous) =>
//       previous.map((row) =>
//         row.studentId === studentId
//           ? {
//               ...row,
//               remarks,
//             }
//           : row,
//       ),
//     );
//   };

//   // ============================================
//   // MARK ALL PRESENT
//   // ============================================

//   const handleMarkAllPresent = () => {
//     setAttendanceRows((previous) =>
//       previous.map((row) => ({
//         ...row,

//         status: "PRESENT",
//       })),
//     );
//   };

//   // ============================================
//   // CANCEL
//   // ============================================

//   const handleCancelChanges = () => {
//     setAttendanceRows(
//       originalRows.map((row) => ({
//         ...row,
//       })),
//     );
//   };

//   // ============================================
//   // SAVE BULK ATTENDANCE
//   // ============================================

//   const handleSaveAttendance = async () => {
//     if (
//       !selectedSessionId ||
//       !selectedClassId ||
//       !selectedSectionId ||
//       !selectedDate
//     ) {
//       return;
//     }

//     if (attendanceRows.length === 0) {
//       return;
//     }

//     setSuccessMessage(null);

//     dispatch(clearAttendanceError());

//     // exactOptionalPropertyTypes safe
//     const attendancePayload: StudentAttendanceInput[] = attendanceRows.map(
//       (row) => {
//         const item: StudentAttendanceInput = {
//           studentId: row.studentId,

//           status: row.status,
//         };

//         if (row.remarks.trim()) {
//           item.remarks = row.remarks.trim();
//         }

//         return item;
//       },
//     );

//     const result = await dispatch(
//       markBulkAttendance({
//         sessionId: selectedSessionId,

//         classId: selectedClassId,

//         sectionId: selectedSectionId,

//         date: selectedDate,

//         attendance: attendancePayload,
//       }),
//     );

//     if (markBulkAttendance.fulfilled.match(result)) {
//       setSuccessMessage("Attendance saved successfully.");

//       setOriginalRows(
//         attendanceRows.map((row) => ({
//           ...row,
//         })),
//       );

//       window.setTimeout(() => {
//         navigate(
//           `/school-admin/attendance/daily?sessionId=${selectedSessionId}&classId=${selectedClassId}&sectionId=${selectedSectionId}&date=${selectedDate}`,
//         );
//       }, 700);
//     }
//   };

//   // ============================================
//   // RESET FILTERS
//   // ============================================

//   const handleReset = () => {
//     const currentSession = sessions.find((session) => session.isCurrent);

//     setSelectedSessionId(currentSession?._id || sessions[0]?._id || "");

//     setSelectedClassId("");

//     setSelectedSectionId("");

//     setSelectedDate(getToday());

//     setSearchQuery("");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-5 md:p-8">
//       {/* ========================================
//           HEADER
//       ======================================== */}

//       <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
//         <div>
//           <div className="flex items-center gap-2 text-sm text-gray-500">
//             <span>Attendance</span>

//             <Icon icon="lucide:chevron-right" />

//             <span className="font-medium text-gray-900">
//               Student Attendance
//             </span>
//           </div>

//           <h1 className="mt-2 text-3xl font-bold text-gray-900">
//             Mark Attendance
//           </h1>

//           <p className="mt-1 text-sm text-gray-500">
//             Mark student attendance by academic year, class and section.
//           </p>
//         </div>

//         <button
//           onClick={() => navigate("/school-admin/attendance/daily")}
//           className="flex min-h-11 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
//         >
//           <Icon icon="lucide:list-checks" />
//           Daily Attendance
//         </button>
//       </div>

//       {/* ========================================
//           STATS
//       ======================================== */}

//       <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
//         <StatCard
//           label="Total Students"
//           value={stats.total}
//           icon="lucide:users"
//         />

//         <StatCard
//           label="Present"
//           value={stats.present}
//           icon="lucide:user-check"
//           valueClass="text-green-600"
//         />

//         <StatCard
//           label="Absent"
//           value={stats.absent}
//           icon="lucide:user-x"
//           valueClass="text-red-600"
//         />

//         <StatCard
//           label="On Leave"
//           value={stats.leave}
//           icon="lucide:calendar-days"
//           valueClass="text-amber-600"
//         />

//         <StatCard
//           label="Half Day"
//           value={stats.halfDay}
//           icon="lucide:clock-3"
//           valueClass="text-blue-600"
//         />

//         <StatCard
//           label="Attendance"
//           value={`${stats.percentage}%`}
//           icon="lucide:percent"
//         />
//       </div>

//       {/* ========================================
//           MAIN CARD
//       ======================================== */}

//       <section className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
//         {/* ======================================
//             FILTERS
//         ====================================== */}

//         <div className="border-b border-gray-200 p-5">
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
//             {/* SESSION */}

//             <div>
//               <label className="mb-2 block text-sm font-semibold text-gray-700">
//                 Academic Year *
//               </label>

//               <select
//                 value={selectedSessionId}
//                 onChange={(e) => {
//                   setSelectedSessionId(e.target.value);

//                   setSelectedClassId("");

//                   setSelectedSectionId("");
//                 }}
//                 className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm"
//               >
//                 <option value="">Select Academic Year</option>

//                 {sessions.map((session) => (
//                   <option key={session._id} value={session._id}>
//                     {session.name}

//                     {session.isCurrent ? " (Current)" : ""}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* CLASS */}

//             <div>
//               <label className="mb-2 block text-sm font-semibold text-gray-700">
//                 Class *
//               </label>

//               <select
//                 value={selectedClassId}
//                 disabled={!selectedSessionId}
//                 onChange={(e) => {
//                   setSelectedClassId(e.target.value);

//                   setSelectedSectionId("");
//                 }}
//                 className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm disabled:bg-gray-100"
//               >
//                 <option value="">Select Class</option>

//                 {availableClasses.map((item) => (
//                   <option key={item._id} value={item._id}>
//                     {item.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* SECTION */}

//             <div>
//               <label className="mb-2 block text-sm font-semibold text-gray-700">
//                 Section *
//               </label>

//               <select
//                 value={selectedSectionId}
//                 disabled={!selectedClassId}
//                 onChange={(e) => setSelectedSectionId(e.target.value)}
//                 className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm disabled:bg-gray-100"
//               >
//                 <option value="">Select Section</option>

//                 {availableSections.map((section) => (
//                   <option key={section._id} value={section._id}>
//                     Section {section.name}
//                   </option>
//                 ))}
//               </select>

//               {selectedClassId && (
//                 <p className="mt-1 text-xs text-gray-500">
//                   Sections shown for {selectedClass?.name || "selected class"}
//                 </p>
//               )}
//             </div>

//             {/* DATE */}

//             <div>
//               <label className="mb-2 block text-sm font-semibold text-gray-700">
//                 Date *
//               </label>

//               <input
//                 type="date"
//                 value={selectedDate}
//                 onChange={(e) => setSelectedDate(e.target.value)}
//                 className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm"
//               />
//             </div>
//           </div>

//           {/* SEARCH */}

//           <div className="mt-4 flex flex-col gap-3 md:flex-row">
//             <div className="flex-1">
//               <label className="mb-2 block text-sm font-semibold text-gray-700">
//                 Search Student
//               </label>

//               <div className="relative">
//                 <Icon
//                   icon="lucide:search"
//                   className="absolute left-3 top-3.5 text-gray-400"
//                 />

//                 <input
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder="Search by student name, admission number or roll number"
//                   className="min-h-11 w-full rounded-lg border border-gray-300 pl-10 pr-3 text-sm"
//                 />
//               </div>
//             </div>

//             <button
//               onClick={handleReset}
//               className="min-h-11 self-end rounded-lg border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
//             >
//               Reset Filters
//             </button>
//           </div>
//         </div>

//         {/* ======================================
//             TABLE HEADER
//         ====================================== */}

//         <div className="flex flex-col gap-3 border-b border-gray-200 bg-gray-50/40 p-5 md:flex-row md:items-center md:justify-between">
//           <div>
//             <h2 className="text-lg font-bold text-gray-900">
//               {selectedClass?.name || "Select Class"}

//               {selectedSection?.name
//                 ? ` · Section ${selectedSection.name}`
//                 : ""}
//             </h2>

//             <p className="mt-1 text-sm text-gray-500">
//               {attendanceRows.length} students loaded
//               {selectedDate ? ` for ${formatDate(selectedDate)}` : ""}
//               {selectedSession?.name ? ` · ${selectedSession.name}` : ""}
//             </p>
//           </div>

//           <button
//             onClick={handleMarkAllPresent}
//             disabled={attendanceRows.length === 0}
//             className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             <Icon icon="lucide:check-check" />
//             Mark All Present
//           </button>
//         </div>

//         {/* ======================================
//             STUDENT ERROR
//         ====================================== */}

//         {studentsError && (
//           <div className="border-b border-red-200 bg-red-50 p-4 text-sm text-red-700">
//             {studentsError}

//             <p className="mt-1 text-xs">
//               Student module API endpoint and response structure check karo.
//             </p>
//           </div>
//         )}

//         {/* ======================================
//             ATTENDANCE ERROR
//         ====================================== */}

//         {error && (
//           <div className="border-b border-red-200 bg-red-50 p-4 text-sm text-red-700">
//             {error}
//           </div>
//         )}

//         {/* ======================================
//             SUCCESS
//         ====================================== */}

//         {successMessage && (
//           <div className="border-b border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
//             <div className="flex items-center gap-2">
//               <Icon icon="lucide:circle-check" />

//               {successMessage}
//             </div>
//           </div>
//         )}

//         {/* ======================================
//             LOADING / EMPTY / TABLE
//         ====================================== */}

//         {studentsLoading ? (
//           <div className="flex min-h-72 flex-col items-center justify-center gap-3">
//             <Icon
//               icon="lucide:loader-2"
//               className="animate-spin text-4xl text-blue-600"
//             />

//             <p className="text-sm text-gray-500">Loading students...</p>
//           </div>
//         ) : !selectedSessionId || !selectedClassId || !selectedSectionId ? (
//           <EmptyState
//             title="Select class and section"
//             description="Academic year, class and section select karo. Uske baad students load honge."
//           />
//         ) : paginatedRows.length === 0 ? (
//           <EmptyState
//             title="No students found"
//             description="Selected class and section me active students nahi mile."
//           />
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[1100px] text-left text-sm">
//               <thead className="bg-gray-50 text-xs uppercase text-gray-500">
//                 <tr>
//                   <th className="px-5 py-4">Student</th>

//                   <th className="px-4 py-4">Admission Number</th>

//                   <th className="px-4 py-4">Roll Number</th>

//                   <th className="px-4 py-4">Class</th>

//                   <th className="px-4 py-4">Section</th>

//                   <th className="px-4 py-4">Attendance Status</th>

//                   <th className="px-4 py-4">Remarks</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-gray-200">
//                 {paginatedRows.map((student) => (
//                   <tr key={student.studentId} className="hover:bg-gray-50">
//                     {/* STUDENT */}

//                     <td className="px-5 py-4">
//                       <div className="flex items-center gap-3">
//                         {student.profileImage ? (
//                           <img
//                             src={student.profileImage}
//                             alt={student.firstName}
//                             className="h-10 w-10 rounded-full border border-gray-200 object-cover"
//                           />
//                         ) : (
//                           <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
//                             {getInitials(student.firstName, student.lastName)}
//                           </div>
//                         )}

//                         <div>
//                           <p className="font-semibold text-gray-900">
//                             {student.firstName} {student.lastName}
//                           </p>
//                         </div>
//                       </div>
//                     </td>

//                     <td className="px-4 py-4 font-mono text-xs text-gray-600">
//                       {student.admissionNumber}
//                     </td>

//                     <td className="px-4 py-4 font-medium">
//                       {student.rollNumber}
//                     </td>

//                     <td className="px-4 py-4 text-gray-600">
//                       {student.className}
//                     </td>

//                     <td className="px-4 py-4 text-gray-600">
//                       {student.sectionName}
//                     </td>

//                     {/* STATUS */}

//                     <td className="px-4 py-4">
//                       <div className="inline-flex flex-wrap gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
//                         <StatusButton
//                           label="Present"
//                           active={student.status === "PRESENT"}
//                           activeClass="bg-green-600 text-white"
//                           onClick={() =>
//                             handleStatusChange(student.studentId, "PRESENT")
//                           }
//                         />

//                         <StatusButton
//                           label="Absent"
//                           active={student.status === "ABSENT"}
//                           activeClass="bg-red-600 text-white"
//                           onClick={() =>
//                             handleStatusChange(student.studentId, "ABSENT")
//                           }
//                         />

//                         <StatusButton
//                           label="Leave"
//                           active={student.status === "LEAVE"}
//                           activeClass="bg-amber-400 text-amber-950"
//                           onClick={() =>
//                             handleStatusChange(student.studentId, "LEAVE")
//                           }
//                         />

//                         <StatusButton
//                           label="Half Day"
//                           active={student.status === "HALF_DAY"}
//                           activeClass="bg-blue-600 text-white"
//                           onClick={() =>
//                             handleStatusChange(student.studentId, "HALF_DAY")
//                           }
//                         />
//                       </div>
//                     </td>

//                     {/* REMARK */}

//                     <td className="px-4 py-4">
//                       <input
//                         type="text"
//                         value={student.remarks}
//                         onChange={(e) =>
//                           handleRemarksChange(student.studentId, e.target.value)
//                         }
//                         placeholder="Optional remark"
//                         className="min-h-10 w-44 rounded-lg border border-gray-300 px-3 text-sm"
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* ======================================
//             FOOTER
//         ====================================== */}

//         {attendanceRows.length > 0 && (
//           <div className="flex flex-col gap-4 border-t border-gray-200 p-5 md:flex-row md:items-center md:justify-between">
//             {/* PAGINATION */}

//             <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
//               <span>
//                 Showing{" "}
//                 {filteredRows.length === 0
//                   ? 0
//                   : (currentPage - 1) * itemsPerPage + 1}
//                 -{Math.min(currentPage * itemsPerPage, filteredRows.length)} of{" "}
//                 {filteredRows.length} students
//               </span>

//               <div className="flex gap-2">
//                 <button
//                   onClick={() =>
//                     setCurrentPage((previous) => Math.max(1, previous - 1))
//                   }
//                   disabled={currentPage <= 1}
//                   className="min-h-10 rounded-lg border border-gray-300 px-3 font-medium disabled:opacity-40"
//                 >
//                   Previous
//                 </button>

//                 <button
//                   onClick={() =>
//                     setCurrentPage((previous) =>
//                       Math.min(totalPages, previous + 1),
//                     )
//                   }
//                   disabled={currentPage >= totalPages}
//                   className="min-h-10 rounded-lg border border-gray-300 px-3 font-medium disabled:opacity-40"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>

//             {/* ACTIONS */}

//             <div className="flex gap-3">
//               <button
//                 onClick={handleCancelChanges}
//                 disabled={saving}
//                 className="min-h-11 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Cancel Changes
//               </button>

//               <button
//                 onClick={handleSaveAttendance}
//                 disabled={saving || attendanceRows.length === 0}
//                 className="flex min-h-11 items-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
//               >
//                 {saving ? (
//                   <>
//                     <Icon icon="lucide:loader-2" className="animate-spin" />
//                     Saving...
//                   </>
//                 ) : (
//                   <>
//                     <Icon icon="lucide:save" />
//                     Save Attendance
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         )}
//       </section>
//     </div>
//   );
// };

// // ============================================
// // STATUS BUTTON
// // ============================================

// const StatusButton = ({
//   label,
//   active,
//   activeClass,
//   onClick,
// }: {
//   label: string;

//   active: boolean;

//   activeClass: string;

//   onClick: () => void;
// }) => {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
//         active ? activeClass : "text-gray-600 hover:bg-white"
//       }`}
//     >
//       {label}
//     </button>
//   );
// };

// // ============================================
// // STAT CARD
// // ============================================

// const StatCard = ({
//   label,
//   value,
//   icon,
//   valueClass = "text-gray-900",
// }: {
//   label: string;

//   value: number | string;

//   icon: string;

//   valueClass?: string;
// }) => {
//   return (
//     <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
//       <div className="flex items-center justify-between">
//         <p className="text-xs font-medium text-gray-500">{label}</p>

//         <Icon icon={icon} className="text-gray-400" />
//       </div>

//       <p className={`mt-2 text-2xl font-bold ${valueClass}`}>{value}</p>
//     </div>
//   );
// };

// // ============================================
// // EMPTY STATE
// // ============================================

// const EmptyState = ({
//   title,
//   description,
// }: {
//   title: string;

//   description: string;
// }) => {
//   return (
//     <div className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
//       <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
//         <Icon icon="lucide:users" className="text-2xl text-gray-400" />
//       </div>

//       <h3 className="mt-4 text-lg font-bold text-gray-900">{title}</h3>

//       <p className="mt-1 max-w-md text-sm text-gray-500">{description}</p>
//     </div>
//   );
// };

// export default MarkAttendance;






import React, { useEffect, useMemo, useRef, useState } from "react";

import { Icon } from "@iconify/react";

import { useNavigate, useSearchParams } from "react-router-dom";

import api from "../../../api/axios";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";

import { getSessions } from "../../../features/academic/sessions/session.slice";

import { getClasses } from "../../../features/academic/classes/class.slice";

import { getSections } from "../../../features/academic/sections/section.slice";

import {
  getAttendance,
  markBulkAttendance,
  clearAttendance,
  clearAttendanceError,
} from "../../../features/attendance/attendance.slice";

import type {
  AttendanceStatus,
  StudentAttendanceInput,
} from "../../../features/attendance/attendance.types";

// ============================================
// LOCAL STUDENT TYPE
//
// Student module complete hone ke baad
// isko student.types.ts se import kar sakte ho.
// ============================================

interface StudentData {
  _id: string;

  name?: string;

  firstName?: string;

  lastName?: string;

  admissionNumber?: string;

  rollNumber?: string | number;

  profileImage?: string;

  sessionId:
    | string
    | {
        _id: string;
        name?: string;
      };

  classId:
    | string
    | {
        _id: string;
        name?: string;
      };

  sectionId:
    | string
    | {
        _id: string;
        name?: string;
      };

  isActive?: boolean;
}

// ============================================
// EDITABLE ATTENDANCE ROW
// ============================================

interface AttendanceRow {
  studentId: string;

  firstName: string;

  lastName: string;

  admissionNumber: string;

  rollNumber: string | number;

  profileImage: string;

  className: string;

  sectionName: string;

  status: AttendanceStatus;

  remarks: string;
}

// ============================================
// HELPER
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

// ============================================
// RELATION NAME
// ============================================

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

// ============================================
// DATE
// ============================================

const getToday = (): string => {
  return new Date().toISOString().slice(0, 10);
};

// ============================================
// DISPLAY DATE
// ============================================

const formatDate = (value: string): string => {
  if (!value) {
    return "-";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ============================================
// INITIALS
// ============================================

const getInitials = (
  firstName?: string,
  lastName?: string
) => {
  const first =
    typeof firstName === "string"
      ? firstName.trim()
      : "";

  const last =
    typeof lastName === "string"
      ? lastName.trim()
      : "";

  return (
    `${first.charAt(0)}${last.charAt(0)}`
      .toUpperCase() || "ST"
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const MarkAttendance: React.FC = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  // ============================================
  // REDUX DATA
  // ============================================

  const { sessions } = useAppSelector((state) => state.sessions);

  const { classes } = useAppSelector((state) => state.classes);

  const { sections } = useAppSelector((state) => state.sections);

  const { selectedSessionId } = useAppSelector(
    (state) => state.sessionSelection,
  );

  const { attendance, saving, error } = useAppSelector(
    (state) => state.attendance,
  );

  // ============================================
  // FILTER STATE
  // Query params DailyAttendance se aa sakte hain
  // ============================================

  const [selectedClassId, setSelectedClassId] = useState(
    searchParams.get("classId") || "",
  );

  const [selectedSectionId, setSelectedSectionId] = useState(
    searchParams.get("sectionId") || "",
  );

  const [selectedDate, setSelectedDate] = useState(
    searchParams.get("date") || getToday(),
  );

  const [searchQuery, setSearchQuery] = useState("");

  // ============================================
  // STUDENT STATE
  // ============================================

  const [students, setStudents] = useState<StudentData[]>([]);

  const [attendanceRows, setAttendanceRows] = useState<AttendanceRow[]>([]);

  const [originalRows, setOriginalRows] = useState<AttendanceRow[]>([]);

  const [studentsLoading, setStudentsLoading] = useState(false);

  const [studentsError, setStudentsError] = useState<string | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // ============================================
  // PAGINATION
  // ============================================

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

      setSearchQuery("");

      setStudents([]);

      setAttendanceRows([]);

      setOriginalRows([]);

      setStudentsError(null);

      setSuccessMessage(null);
    }

    dispatch(clearAttendance());

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
  // CLASSES FOR SESSION
  // ============================================

  const availableClasses = useMemo(() => {
    if (!selectedSessionId) {
      return [];
    }

    return classes.filter(
      (item) =>
        getRelationId(
          item.sessionId
        ) === selectedSessionId &&
        item.isActive !== false,
    );
  }, [classes, selectedSessionId]);

  // ============================================
  // CHECK SELECTED CLASS
  // ============================================

  useEffect(() => {
    if (
      !selectedClassId ||
      availableClasses.length === 0
    ) {
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
  // SECTIONS FOR CLASS
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
  // CHECK SELECTED SECTION
  // ============================================

  useEffect(() => {
    if (
      !selectedSectionId ||
      availableSections.length === 0
    ) {
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
  // GET STUDENTS
  //
  // Student backend ready hote hi:
  // GET /students
  // ?classId=
  // &sectionId=
  // &isActive=true
  // ============================================

  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedSessionId || !selectedClassId || !selectedSectionId) {
        setStudents([]);

        setAttendanceRows([]);

        return;
      }

      try {
        setStudentsLoading(true);

        setStudentsError(null);

        const response = await api.get("/students", {
          params: {
            sessionId: selectedSessionId,

            classId: selectedClassId,

            sectionId: selectedSectionId,

            isActive: true,
          },
        });

        const result = response.data?.data;

        setStudents(Array.isArray(result) ? result : []);
      } catch (error: any) {
        setStudents([]);

        setStudentsError(
          error.response?.data?.message || "Failed to load students",
        );
      } finally {
        setStudentsLoading(false);
      }
    };

    fetchStudents();
  }, [selectedSessionId, selectedClassId, selectedSectionId]);

  // ============================================
  // EXISTING ATTENDANCE
  //
  // Date already saved hai to statuses load honge.
  // ============================================

  useEffect(() => {
    if (
      !selectedSessionId ||
      !selectedClassId ||
      !selectedSectionId ||
      !selectedDate
    ) {
      dispatch(clearAttendance());

      return;
    }

    dispatch(clearAttendance());

    dispatch(
      getAttendance({
        sessionId: selectedSessionId,

        classId: selectedClassId,

        sectionId: selectedSectionId,

        date: selectedDate,
      }),
    );
  }, [
    dispatch,
    selectedSessionId,
    selectedClassId,
    selectedSectionId,
    selectedDate,
  ]);

  // ============================================
  // BUILD EDITABLE ROWS
  //
  // Existing attendance ho to status use karega.
  // Otherwise default PRESENT.
  // ============================================

  useEffect(() => {
    if (students.length === 0) {
      setAttendanceRows([]);

      setOriginalRows([]);

      return;
    }

    const rows = students.map((student) => {
      const existing = attendance.find((record) => {
        const recordStudentId = getRelationId(record.studentId);

        return recordStudentId === student._id;
      });

      const row: AttendanceRow = {
        studentId: student._id,

        firstName:
          student.firstName?.trim() ||
          student.name?.trim() ||
          "Student",

        lastName:
          student.lastName?.trim() ||
          "",

        admissionNumber: student.admissionNumber || "-",

        rollNumber: student.rollNumber ?? "-",

        profileImage: student.profileImage || "",

        className:
          getRelationName(student.classId) || selectedClass?.name || "-",

        sectionName:
          getRelationName(student.sectionId) || selectedSection?.name || "-",

        status: existing?.status || "PRESENT",

        remarks: existing?.remarks || "",
      };

      return row;
    });

    setAttendanceRows(rows);

    setOriginalRows(
      rows.map((row) => ({
        ...row,
      })),
    );
  }, [students, attendance, selectedClass?.name, selectedSection?.name]);

  // ============================================
  // SEARCH
  // ============================================

  const filteredRows = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();

    if (!search) {
      return attendanceRows;
    }

    return attendanceRows.filter((row) => {
      const text = [
        row.firstName,
        row.lastName,
        row.admissionNumber,
        String(row.rollNumber),
      ]
        .join(" ")
        .toLowerCase();

      return text.includes(search);
    });
  }, [attendanceRows, searchQuery]);

  // ============================================
  // STATS
  // ============================================

  const stats = useMemo(() => {
    const total = attendanceRows.length;

    const present = attendanceRows.filter(
      (row) => row.status === "PRESENT",
    ).length;

    const absent = attendanceRows.filter(
      (row) => row.status === "ABSENT",
    ).length;

    const leave = attendanceRows.filter((row) => row.status === "LEAVE").length;

    const halfDay = attendanceRows.filter(
      (row) => row.status === "HALF_DAY",
    ).length;

    const attendanceUnits = present + halfDay * 0.5;

    const percentage =
      total > 0 ? Number(((attendanceUnits / total) * 100).toFixed(1)) : 0;

    return {
      total,
      present,
      absent,
      leave,
      halfDay,
      percentage,
    };
  }, [attendanceRows]);

  // ============================================
  // PAGINATION
  // ============================================

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSessionId, selectedClassId, selectedSectionId, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / itemsPerPage));

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;

    return filteredRows.slice(start, start + itemsPerPage);
  }, [filteredRows, currentPage]);

  // ============================================
  // STATUS CHANGE
  // ============================================

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceRows((previous) =>
      previous.map((row) =>
        row.studentId === studentId
          ? {
              ...row,
              status,
            }
          : row,
      ),
    );
  };

  // ============================================
  // REMARK
  // ============================================

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setAttendanceRows((previous) =>
      previous.map((row) =>
        row.studentId === studentId
          ? {
              ...row,
              remarks,
            }
          : row,
      ),
    );
  };

  // ============================================
  // MARK ALL PRESENT
  // ============================================

  const handleMarkAllPresent = () => {
    setAttendanceRows((previous) =>
      previous.map((row) => ({
        ...row,

        status: "PRESENT",
      })),
    );
  };

  // ============================================
  // CANCEL
  // ============================================

  const handleCancelChanges = () => {
    setAttendanceRows(
      originalRows.map((row) => ({
        ...row,
      })),
    );
  };

  // ============================================
  // SAVE BULK ATTENDANCE
  // ============================================

  const handleSaveAttendance = async () => {
    if (
      !selectedSessionId ||
      !selectedClassId ||
      !selectedSectionId ||
      !selectedDate
    ) {
      return;
    }

    if (attendanceRows.length === 0) {
      return;
    }

    setSuccessMessage(null);

    dispatch(clearAttendanceError());

    // exactOptionalPropertyTypes safe
    const attendancePayload: StudentAttendanceInput[] = attendanceRows.map(
      (row) => {
        const item: StudentAttendanceInput = {
          studentId: row.studentId,

          status: row.status,
        };

        if (row.remarks.trim()) {
          item.remarks = row.remarks.trim();
        }

        return item;
      },
    );

    const result = await dispatch(
      markBulkAttendance({
        sessionId: selectedSessionId,

        classId: selectedClassId,

        sectionId: selectedSectionId,

        date: selectedDate,

        attendance: attendancePayload,
      }),
    );

    if (markBulkAttendance.fulfilled.match(result)) {
      setSuccessMessage("Attendance saved successfully.");

      setOriginalRows(
        attendanceRows.map((row) => ({
          ...row,
        })),
      );

      window.setTimeout(() => {
        navigate(
          `/school-admin/attendance/daily?classId=${selectedClassId}&sectionId=${selectedSectionId}&date=${selectedDate}`,
        );
      }, 700);
    }
  };

  // ============================================
  // RESET FILTERS
  // ============================================

  const handleReset = () => {
    setSelectedClassId("");

    setSelectedSectionId("");

    setSelectedDate(getToday());

    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-5 md:p-8">
      {/* ========================================
          HEADER
      ======================================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Attendance</span>

            <Icon icon="lucide:chevron-right" />

            <span className="font-medium text-gray-900">
              Student Attendance
            </span>
          </div>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Mark Attendance
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Mark student attendance by class and section for the academic
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

        <button
          onClick={() =>
            navigate(
              "/school-admin/attendance/daily"
            )
          }
          className="flex min-h-11 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          <Icon icon="lucide:list-checks" />
          Daily Attendance
        </button>
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
              Students, classes, sections and attendance are session-wise.
            </p>
          </div>
        </div>
      )}

      {/* ========================================
          STATS
      ======================================== */}

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label="Total Students"
          value={stats.total}
          icon="lucide:users"
        />

        <StatCard
          label="Present"
          value={stats.present}
          icon="lucide:user-check"
          valueClass="text-green-600"
        />

        <StatCard
          label="Absent"
          value={stats.absent}
          icon="lucide:user-x"
          valueClass="text-red-600"
        />

        <StatCard
          label="On Leave"
          value={stats.leave}
          icon="lucide:calendar-days"
          valueClass="text-amber-600"
        />

        <StatCard
          label="Half Day"
          value={stats.halfDay}
          icon="lucide:clock-3"
          valueClass="text-blue-600"
        />

        <StatCard
          label="Attendance"
          value={`${stats.percentage}%`}
          icon="lucide:percent"
        />
      </div>

      {/* ========================================
          MAIN CARD
      ======================================== */}

      <section className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* ======================================
            FILTERS
        ====================================== */}

        <div className="border-b border-gray-200 p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* CLASS */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Class *
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
                Section *
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

              {selectedClassId && (
                <p className="mt-1 text-xs text-gray-500">
                  Sections shown for {selectedClass?.name || "selected class"}
                </p>
              )}
            </div>

            {/* DATE */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Date *
              </label>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm"
              />
            </div>
          </div>

          {/* SEARCH */}

          <div className="mt-4 flex flex-col gap-3 md:flex-row">
            <div className="flex-1">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Search Student
              </label>

              <div className="relative">
                <Icon
                  icon="lucide:search"
                  className="absolute left-3 top-3.5 text-gray-400"
                />

                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by student name, admission number or roll number"
                  className="min-h-11 w-full rounded-lg border border-gray-300 pl-10 pr-3 text-sm"
                />
              </div>
            </div>

            <button
              onClick={handleReset}
              className="min-h-11 self-end rounded-lg border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* ======================================
            TABLE HEADER
        ====================================== */}

        <div className="flex flex-col gap-3 border-b border-gray-200 bg-gray-50/40 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {selectedClass?.name || "Select Class"}

              {selectedSection?.name
                ? ` · Section ${selectedSection.name}`
                : ""}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {attendanceRows.length} students loaded
              {selectedDate ? ` for ${formatDate(selectedDate)}` : ""}
              {selectedSession?.name ? ` · ${selectedSession.name}` : ""}
            </p>
          </div>

          <button
            onClick={handleMarkAllPresent}
            disabled={attendanceRows.length === 0}
            className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon icon="lucide:check-check" />
            Mark All Present
          </button>
        </div>

        {/* ======================================
            STUDENT ERROR
        ====================================== */}

        {studentsError && (
          <div className="border-b border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {studentsError}

            <p className="mt-1 text-xs">
              Student module API endpoint and response structure check karo.
            </p>
          </div>
        )}

        {/* ======================================
            ATTENDANCE ERROR
        ====================================== */}

        {error && (
          <div className="border-b border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ======================================
            SUCCESS
        ====================================== */}

        {successMessage && (
          <div className="border-b border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
            <div className="flex items-center gap-2">
              <Icon icon="lucide:circle-check" />

              {successMessage}
            </div>
          </div>
        )}

        {/* ======================================
            LOADING / EMPTY / TABLE
        ====================================== */}

        {studentsLoading ? (
          <div className="flex min-h-72 flex-col items-center justify-center gap-3">
            <Icon
              icon="lucide:loader-2"
              className="animate-spin text-4xl text-blue-600"
            />

            <p className="text-sm text-gray-500">Loading students...</p>
          </div>
        ) : !selectedSessionId || !selectedClassId || !selectedSectionId ? (
          <EmptyState
            title="Select class and section"
            description="Topbar se academic session select karo, phir class aur section choose karo. Uske baad students load honge."
          />
        ) : paginatedRows.length === 0 ? (
          <EmptyState
            title="No students found"
            description="Selected class and section me active students nahi mile."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4">Student</th>

                  <th className="px-4 py-4">Admission Number</th>

                  <th className="px-4 py-4">Roll Number</th>

                  <th className="px-4 py-4">Class</th>

                  <th className="px-4 py-4">Section</th>

                  <th className="px-4 py-4">Attendance Status</th>

                  <th className="px-4 py-4">Remarks</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {paginatedRows.map((student) => (
                  <tr key={student.studentId} className="hover:bg-gray-50">
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
                            {getInitials(student.firstName, student.lastName)}
                          </div>
                        )}

                        <div>
                          <p className="font-semibold text-gray-900">
                            {student.firstName} {student.lastName}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 font-mono text-xs text-gray-600">
                      {student.admissionNumber}
                    </td>

                    <td className="px-4 py-4 font-medium">
                      {student.rollNumber}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {student.className}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {student.sectionName}
                    </td>

                    {/* STATUS */}

                    <td className="px-4 py-4">
                      <div className="inline-flex flex-wrap gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
                        <StatusButton
                          label="Present"
                          active={student.status === "PRESENT"}
                          activeClass="bg-green-600 text-white"
                          onClick={() =>
                            handleStatusChange(student.studentId, "PRESENT")
                          }
                        />

                        <StatusButton
                          label="Absent"
                          active={student.status === "ABSENT"}
                          activeClass="bg-red-600 text-white"
                          onClick={() =>
                            handleStatusChange(student.studentId, "ABSENT")
                          }
                        />

                        <StatusButton
                          label="Leave"
                          active={student.status === "LEAVE"}
                          activeClass="bg-amber-400 text-amber-950"
                          onClick={() =>
                            handleStatusChange(student.studentId, "LEAVE")
                          }
                        />

                        <StatusButton
                          label="Half Day"
                          active={student.status === "HALF_DAY"}
                          activeClass="bg-blue-600 text-white"
                          onClick={() =>
                            handleStatusChange(student.studentId, "HALF_DAY")
                          }
                        />
                      </div>
                    </td>

                    {/* REMARK */}

                    <td className="px-4 py-4">
                      <input
                        type="text"
                        value={student.remarks}
                        onChange={(e) =>
                          handleRemarksChange(student.studentId, e.target.value)
                        }
                        placeholder="Optional remark"
                        className="min-h-10 w-44 rounded-lg border border-gray-300 px-3 text-sm"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ======================================
            FOOTER
        ====================================== */}

        {attendanceRows.length > 0 && (
          <div className="flex flex-col gap-4 border-t border-gray-200 p-5 md:flex-row md:items-center md:justify-between">
            {/* PAGINATION */}

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <span>
                Showing{" "}
                {filteredRows.length === 0
                  ? 0
                  : (currentPage - 1) * itemsPerPage + 1}
                -{Math.min(currentPage * itemsPerPage, filteredRows.length)} of{" "}
                {filteredRows.length} students
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((previous) => Math.max(1, previous - 1))
                  }
                  disabled={currentPage <= 1}
                  className="min-h-10 rounded-lg border border-gray-300 px-3 font-medium disabled:opacity-40"
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
                  className="min-h-10 rounded-lg border border-gray-300 px-3 font-medium disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>

            {/* ACTIONS */}

            <div className="flex gap-3">
              <button
                onClick={handleCancelChanges}
                disabled={saving}
                className="min-h-11 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel Changes
              </button>

              <button
                onClick={handleSaveAttendance}
                disabled={saving || attendanceRows.length === 0}
                className="flex min-h-11 items-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Icon icon="lucide:loader-2" className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Icon icon="lucide:save" />
                    Save Attendance
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </section>
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
      className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
        active ? activeClass : "text-gray-600 hover:bg-white"
      }`}
    >
      {label}
    </button>
  );
};

// ============================================
// STAT CARD
// ============================================

const StatCard = ({
  label,
  value,
  icon,
  valueClass = "text-gray-900",
}: {
  label: string;

  value: number | string;

  icon: string;

  valueClass?: string;
}) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-500">{label}</p>

        <Icon icon={icon} className="text-gray-400" />
      </div>

      <p className={`mt-2 text-2xl font-bold ${valueClass}`}>{value}</p>
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
        <Icon icon="lucide:users" className="text-2xl text-gray-400" />
      </div>

      <h3 className="mt-4 text-lg font-bold text-gray-900">{title}</h3>

      <p className="mt-1 max-w-md text-sm text-gray-500">{description}</p>
    </div>
  );
};

export default MarkAttendance;
