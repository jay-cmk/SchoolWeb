// import React, { useEffect, useMemo, useState } from "react";
// import { Icon } from "@iconify/react";
// import { useNavigate, useParams } from "react-router-dom";

// import api from "../../../api/axios";
// import { useAppDispatch, useAppSelector } from "../../../app/hooks";
// import { getStudentByIdApi } from "../../../features/student/student.api";
// import type { Student } from "../../../features/student/student.types";
// import { getSubjectAssignmentsApi } from "../../../features/academic/subjectAssignments/subjectAssignment.api";
// import type { SubjectAssignmentData } from "../../../features/academic/subjectAssignments/subjectAssignment.types";
// import {
//   assignStudentElective,
//   clearStudentElectiveMessages,
//   getStudentElectives,
//   updateStudentElective,
// } from "../../../features/student/studentElective.slice";
// import type {
//   ElectiveStudent,
//   ElectiveSubject,
//   ElectiveSubjectAssignment,
//   ElectiveTeacher,
//   StudentElectiveEnrollment,
//   StudentElectiveStatus,
// } from "../../../features/student/studentElective.types";

// type Relation = string | { _id: string; name?: string };

// type StudentWithAcademic = Student & {
//   stream?: string;
//   enrollment?: Student["enrollment"] & {
//     stream?: string;
//   };
// };

// interface CurrentAcademicEnrollment {
//   _id: string;
//   sessionId: Relation;
//   classId: Relation;
//   sectionId: Relation;
//   rollNumber?: number;
//   stream?: string;
//   enrollmentStatus?: string;
//   createdAt?: string;
// }

// interface StudentEnrollmentHistoryResponse {
//   success: boolean;
//   data: {
//     enrollments: CurrentAcademicEnrollment[];
//   };
// }

// const relationId = (value?: Relation): string => {
//   if (!value) return "";
//   return typeof value === "string" ? value : value._id;
// };

// const relationName = (value?: Relation): string => {
//   if (!value || typeof value === "string") return "—";
//   return value.name || "—";
// };

// const prettyText = (value?: string): string =>
//   value
//     ? value
//         .toLowerCase()
//         .replaceAll("_", " ")
//         .replace(/\b\w/g, (letter) => letter.toUpperCase())
//     : "—";

// const populated = <T extends object>(value: string | T): T | null =>
//   typeof value === "string" ? null : value;

// const getApiMessage = (error: unknown, fallback: string): string => {
//   const apiError = error as {
//     response?: { data?: { message?: string } };
//     message?: string;
//   };

//   return apiError.response?.data?.message ?? apiError.message ?? fallback;
// };

// const StudentElectiveAssignments: React.FC = () => {
//   const { studentId } = useParams<{ studentId: string }>();
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();

//   const { enrollments, loading, submitting, error, successMessage } =
//     useAppSelector((state) => state.studentElectives);

//   const [student, setStudent] = useState<Student | null>(null);
//   const [currentEnrollment, setCurrentEnrollment] =
//     useState<CurrentAcademicEnrollment | null>(null);
//   const [assignments, setAssignments] = useState<SubjectAssignmentData[]>([]);
//   const [selectedAssignmentId, setSelectedAssignmentId] = useState("");
//   const [remarks, setRemarks] = useState("");
//   const [pageLoading, setPageLoading] = useState(true);
//   const [pageError, setPageError] = useState<string | null>(null);
//   const [statusTarget, setStatusTarget] =
//     useState<StudentElectiveEnrollment | null>(null);

//   const academicStudent = student as StudentWithAcademic | null;
//   const sessionId = relationId(
//     currentEnrollment?.sessionId ??
//       (student?.sessionId as Relation | undefined),
//   );
//   const classId = relationId(
//     currentEnrollment?.classId ?? (student?.classId as Relation | undefined),
//   );
//   const sectionId = relationId(
//     currentEnrollment?.sectionId ??
//       (student?.sectionId as Relation | undefined),
//   );
//   const stream =
//     currentEnrollment?.stream ??
//     academicStudent?.enrollment?.stream ??
//     academicStudent?.stream;

//   useEffect(() => {
//     dispatch(clearStudentElectiveMessages());

//     if (!studentId) {
//       setPageError("Student ID is missing");
//       setPageLoading(false);
//       return;
//     }

//     const loadPage = async () => {
//       try {
//         setPageLoading(true);
//         setPageError(null);

//         const [studentData, enrollmentHistoryResponse] = await Promise.all([
//           getStudentByIdApi(studentId),
//           api.get<StudentEnrollmentHistoryResponse>(
//             `/students/${studentId}/enrollments`,
//           ),
//         ]);

//         const enrollmentHistory = Array.isArray(
//           enrollmentHistoryResponse.data?.data?.enrollments,
//         )
//           ? enrollmentHistoryResponse.data.data.enrollments
//           : [];

//         const studentSessionId = relationId(
//           studentData.sessionId as Relation | undefined,
//         );

//         const activeEnrollment =
//           enrollmentHistory.find(
//             (enrollment) =>
//               enrollment.enrollmentStatus === "ACTIVE" &&
//               (!studentSessionId ||
//                 relationId(enrollment.sessionId) === studentSessionId),
//           ) ??
//           enrollmentHistory.find(
//             (enrollment) => enrollment.enrollmentStatus === "ACTIVE",
//           ) ??
//           enrollmentHistory[0] ??
//           null;

//         const currentSessionId = relationId(
//           activeEnrollment?.sessionId ??
//             (studentData.sessionId as Relation | undefined),
//         );
//         const currentClassId = relationId(
//           activeEnrollment?.classId ??
//             (studentData.classId as Relation | undefined),
//         );
//         const currentSectionId = relationId(
//           activeEnrollment?.sectionId ??
//             (studentData.sectionId as Relation | undefined),
//         );

//         setStudent(studentData);
//         setCurrentEnrollment(activeEnrollment);

//         const [assignmentData] = await Promise.all([
//           getSubjectAssignmentsApi({
//             ...(currentSessionId ? { sessionId: currentSessionId } : {}),
//             ...(currentClassId ? { classId: currentClassId } : {}),
//             ...(currentSectionId ? { sectionId: currentSectionId } : {}),
//           }),
//           dispatch(getStudentElectives({ studentId })).unwrap(),
//         ]);

//         setAssignments(assignmentData);
//       } catch (loadError: unknown) {
//         setPageError(
//           getApiMessage(loadError, "Failed to load elective subject details"),
//         );
//       } finally {
//         setPageLoading(false);
//       }
//     };

//     void loadPage();
//   }, [dispatch, studentId]);

//   const electiveAssignments = useMemo(
//     () =>
//       assignments.filter((assignment) => {
//         const subject = populated(assignment.subjectId);
//         const assignmentSessionId = relationId(
//           assignment.sessionId as Relation,
//         );
//         const assignmentClassId = relationId(assignment.classId as Relation);
//         const assignmentSectionId = relationId(
//           assignment.sectionId as Relation,
//         );

//         return (
//           subject?.subjectType === "ELECTIVE" &&
//           assignment.isActive !== false &&
//           (!sessionId || assignmentSessionId === sessionId) &&
//           (!classId || assignmentClassId === classId) &&
//           (!sectionId || assignmentSectionId === sectionId)
//         );
//       }),
//     [assignments, classId, sectionId, sessionId],
//   );

//   const assignedAssignmentIds = useMemo(
//     () =>
//       new Set(
//         enrollments
//           .filter((item) => item.status === "ACTIVE")
//           .map((item) => relationId(item.subjectAssignmentId as Relation)),
//       ),
//     [enrollments],
//   );

//   const availableAssignments = useMemo(
//     () =>
//       electiveAssignments.filter(
//         (assignment) => !assignedAssignmentIds.has(assignment._id),
//       ),
//     [assignedAssignmentIds, electiveAssignments],
//   );

//   const handleAssign = async (event: React.FormEvent) => {
//     event.preventDefault();
//     if (!studentId || !selectedAssignmentId || submitting) return;

//     const cleanRemarks = remarks.trim();

//     try {
//       await dispatch(
//         assignStudentElective({
//           studentId,
//           subjectAssignmentId: selectedAssignmentId,
//           ...(cleanRemarks ? { remarks: cleanRemarks } : {}),
//         }),
//       ).unwrap();

//       setSelectedAssignmentId("");
//       setRemarks("");
//       await dispatch(getStudentElectives({ studentId })).unwrap();
//     } catch {
//       // Redux state already contains the API error.
//     }
//   };

//   const handleStatusUpdate = async (
//     enrollment: StudentElectiveEnrollment,
//     status: StudentElectiveStatus,
//   ) => {
//     try {
//       await dispatch(
//         updateStudentElective({
//           enrollmentId: enrollment._id,
//           data: { status },
//         }),
//       ).unwrap();
//       setStatusTarget(null);
//     } catch {
//       // Redux state already contains the API error.
//     }
//   };

//   if (pageLoading) {
//     return (
//       <PageState icon="lucide:loader-circle" title="Loading electives" spin />
//     );
//   }

//   if (!student || pageError) {
//     return (
//       <PageState
//         icon="lucide:circle-alert"
//         title="Unable to load student"
//         message={pageError ?? "Student record was not found"}
//         action={() => navigate("/school-admin/students")}
//       />
//     );
//   }

//   const displayedSession =
//     currentEnrollment?.sessionId ?? (student.sessionId as Relation);
//   const displayedClass =
//     currentEnrollment?.classId ?? (student.classId as Relation);
//   const displayedSection =
//     currentEnrollment?.sectionId ?? (student.sectionId as Relation);

//   const normalizedClassName = relationName(displayedClass)
//     .toLowerCase()
//     .replace("class", "")
//     .trim();

//   const isSeniorClass = ["11", "12"].includes(normalizedClassName);

//   return (
//     <div className="min-h-full bg-slate-50 px-4 py-5 md:px-6 md:py-7 lg:px-8">
//       <div className="mx-auto max-w-[1380px]">
//         <button
//           type="button"
//           onClick={() => navigate("/school-admin/students")}
//           className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-blue-700"
//         >
//           <Icon icon="lucide:arrow-left" className="h-4 w-4" />
//           Back to students
//         </button>

//         <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#102A56] via-[#174F91] to-[#2874C6] p-6 text-white shadow-xl md:p-8">
//           <div className="pointer-events-none absolute -right-16 -top-20 h-60 w-60 rounded-full bg-white/10" />
//           <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
//             <div className="flex items-center gap-4">
//               <StudentAvatar student={student} />
//               <div>
//                 <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
//                   Elective subject management
//                 </p>
//                 <h1 className="mt-1 text-2xl font-extrabold md:text-3xl">
//                   {student.name}
//                 </h1>
//                 <p className="mt-1 text-sm text-blue-100">
//                   {student.admissionNumber} · Roll{" "}
//                   {currentEnrollment?.rollNumber ?? student.rollNumber ?? "—"}
//                 </p>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
//               <HeaderValue
//                 label="Session"
//                 value={relationName(displayedSession)}
//               />
//               <HeaderValue label="Class" value={relationName(displayedClass)} />
//               <HeaderValue
//                 label="Section"
//                 value={relationName(displayedSection)}
//               />
//               <HeaderValue label="Stream" value={prettyText(stream)} />
//             </div>
//           </div>
//         </header>

//         {!isSeniorClass && (
//           <Notice
//             tone="amber"
//             title="Elective assignment is intended for Class 11 and 12"
//             message="This student is not currently enrolled in Class 11 or Class 12."
//           />
//         )}

//         {!stream && isSeniorClass && (
//           <Notice
//             tone="amber"
//             title="Student stream is missing"
//             message="Assign a stream in the current enrollment before assigning elective subjects."
//           />
//         )}

//         {(pageError || error) && (
//           <Notice
//             tone="rose"
//             title="Unable to process request"
//             message={pageError ?? error ?? "Something went wrong"}
//           />
//         )}

//         <div className="mt-6 grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
//           <section className="h-fit rounded-2xl border border-slate-200 bg-white shadow-sm">
//             <div className="border-b border-slate-200 p-5">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
//                   <Icon icon="lucide:book-plus" className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <h2 className="font-extrabold text-slate-900">
//                     Assign Elective
//                   </h2>
//                   <p className="mt-0.5 text-xs text-slate-500">
//                     Choose an available elective assignment.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <form onSubmit={handleAssign} className="space-y-5 p-5">
//               <div>
//                 <label className="mb-2 block text-xs font-bold text-slate-600">
//                   Elective subject assignment{" "}
//                   <span className="text-rose-500">*</span>
//                 </label>
//                 <select
//                   value={selectedAssignmentId}
//                   onChange={(event) =>
//                     setSelectedAssignmentId(event.target.value)
//                   }
//                   disabled={!isSeniorClass || !stream || submitting}
//                   className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition disabled:cursor-not-allowed disabled:bg-slate-100 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
//                 >
//                   <option value="">Select elective subject</option>
//                   {availableAssignments.map((assignment) => {
//                     const subject = populated(assignment.subjectId);
//                     const teacher = populated(assignment.teacherId);
//                     return (
//                       <option key={assignment._id} value={assignment._id}>
//                         {subject?.name ?? "Unnamed subject"} (
//                         {subject?.code ?? "—"})
//                         {teacher?.name ? ` · ${teacher.name}` : ""}
//                       </option>
//                     );
//                   })}
//                 </select>
//                 {availableAssignments.length === 0 && (
//                   <p className="mt-2 text-xs leading-5 text-amber-700">
//                     No unassigned elective subject is available for this class
//                     and section.
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="mb-2 block text-xs font-bold text-slate-600">
//                   Remarks
//                 </label>
//                 <textarea
//                   value={remarks}
//                   onChange={(event) => setRemarks(event.target.value)}
//                   rows={3}
//                   maxLength={1000}
//                   placeholder="Optional note about this elective..."
//                   className="w-full resize-none rounded-xl border border-slate-300 px-3 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={
//                   !selectedAssignmentId ||
//                   !isSeniorClass ||
//                   !stream ||
//                   submitting
//                 }
//                 className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 text-sm font-extrabold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
//               >
//                 <Icon
//                   icon={submitting ? "lucide:loader-circle" : "lucide:plus"}
//                   className={`h-5 w-5 ${submitting ? "animate-spin" : ""}`}
//                 />
//                 {submitting ? "Assigning..." : "Assign Elective Subject"}
//               </button>
//             </form>
//           </section>

//           <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//             <div className="flex items-center justify-between border-b border-slate-200 p-5">
//               <div>
//                 <h2 className="font-extrabold text-slate-900">
//                   Assigned Electives
//                 </h2>
//                 <p className="mt-0.5 text-xs text-slate-500">
//                   {enrollments.length} assignment
//                   {enrollments.length === 1 ? "" : "s"}
//                 </p>
//               </div>
//               {loading && (
//                 <Icon
//                   icon="lucide:loader-circle"
//                   className="h-5 w-5 animate-spin text-blue-700"
//                 />
//               )}
//             </div>

//             {enrollments.length > 0 ? (
//               <div className="divide-y divide-slate-200">
//                 {enrollments.map((enrollment) => (
//                   <ElectiveRow
//                     key={enrollment._id}
//                     enrollment={enrollment}
//                     disabled={submitting}
//                     onStatusClick={() => setStatusTarget(enrollment)}
//                   />
//                 ))}
//               </div>
//             ) : (
//               <div className="px-6 py-16 text-center">
//                 <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
//                   <Icon icon="lucide:book-open" className="h-7 w-7" />
//                 </div>
//                 <h3 className="mt-4 font-extrabold text-slate-900">
//                   No elective assigned
//                 </h3>
//                 <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
//                   Select an elective assignment from the form to add the
//                   student’s first elective.
//                 </p>
//               </div>
//             )}
//           </section>
//         </div>

//         <StatusModal
//           enrollment={statusTarget}
//           submitting={submitting}
//           onClose={() => !submitting && setStatusTarget(null)}
//           onUpdate={handleStatusUpdate}
//         />

//         <SuccessModal
//           open={Boolean(successMessage)}
//           message={successMessage ?? "Elective assignment updated successfully"}
//           onClose={() => dispatch(clearStudentElectiveMessages())}
//         />
//       </div>
//     </div>
//   );
// };

// const HeaderValue = ({ label, value }: { label: string; value: string }) => (
//   <div className="min-w-[105px] rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 backdrop-blur-sm">
//     <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
//       {label}
//     </p>
//     <p className="mt-1 truncate text-sm font-extrabold text-white">{value}</p>
//   </div>
// );

// const StudentAvatar = ({ student }: { student: Student }) => (
//   <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white/15 text-xl font-extrabold">
//     {student.photo ? (
//       <img
//         src={student.photo}
//         alt={student.name}
//         className="h-full w-full object-cover"
//       />
//     ) : (
//       student.name?.trim().charAt(0).toUpperCase() || "S"
//     )}
//   </div>
// );

// const Notice = ({
//   tone,
//   title,
//   message,
// }: {
//   tone: "amber" | "rose";
//   title: string;
//   message: string;
// }) => (
//   <div
//     className={`mt-5 flex gap-3 rounded-xl border p-4 ${
//       tone === "rose"
//         ? "border-rose-200 bg-rose-50 text-rose-800"
//         : "border-amber-200 bg-amber-50 text-amber-800"
//     }`}
//   >
//     <Icon icon="lucide:circle-alert" className="mt-0.5 h-5 w-5 shrink-0" />
//     <div>
//       <p className="text-sm font-extrabold">{title}</p>
//       <p className="mt-1 text-sm opacity-90">{message}</p>
//     </div>
//   </div>
// );

// const ElectiveRow = ({
//   enrollment,
//   disabled,
//   onStatusClick,
// }: {
//   enrollment: StudentElectiveEnrollment;
//   disabled: boolean;
//   onStatusClick: () => void;
// }) => {
//   const assignment = populated<ElectiveSubjectAssignment>(
//     enrollment.subjectAssignmentId,
//   );
//   const subject = assignment
//     ? populated<ElectiveSubject>(assignment.subjectId)
//     : null;
//   const teacher = assignment?.teacherId
//     ? populated<ElectiveTeacher>(assignment.teacherId)
//     : null;
//   const student = populated<ElectiveStudent>(enrollment.studentId);

//   const statusTones: Record<StudentElectiveStatus, string> = {
//     ACTIVE: "border-emerald-200 bg-emerald-50 text-emerald-700",
//     DROPPED: "border-rose-200 bg-rose-50 text-rose-700",
//     COMPLETED: "border-blue-200 bg-blue-50 text-blue-700",
//   };

//   return (
//     <article className="p-5 transition hover:bg-slate-50/70">
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
//         <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
//           <Icon icon="lucide:book-marked" className="h-6 w-6" />
//         </div>
//         <div className="min-w-0 flex-1">
//           <div className="flex flex-wrap items-center gap-2">
//             <h3 className="font-extrabold text-slate-900">
//               {subject?.name ?? "Elective subject"}
//             </h3>
//             <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-extrabold text-slate-600">
//               {subject?.code ?? "—"}
//             </span>
//             <span
//               className={`rounded-full border px-2.5 py-1 text-[10px] font-extrabold ${statusTones[enrollment.status]}`}
//             >
//               {prettyText(enrollment.status)}
//             </span>
//           </div>
//           <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
//             <span>
//               Teacher:{" "}
//               <strong className="text-slate-700">{teacher?.name ?? "—"}</strong>
//             </span>
//             <span>
//               Periods/week:{" "}
//               <strong className="text-slate-700">
//                 {assignment?.weeklyPeriods ?? "—"}
//               </strong>
//             </span>
//             {student?.name && (
//               <span>
//                 Student:{" "}
//                 <strong className="text-slate-700">{student.name}</strong>
//               </span>
//             )}
//           </div>
//           {enrollment.remarks && (
//             <p className="mt-2 text-xs leading-5 text-slate-500">
//               {enrollment.remarks}
//             </p>
//           )}
//         </div>
//         <button
//           type="button"
//           onClick={onStatusClick}
//           disabled={disabled}
//           className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-xs font-extrabold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50"
//         >
//           <Icon icon="lucide:refresh-cw" className="h-4 w-4" />
//           Update status
//         </button>
//       </div>
//     </article>
//   );
// };

// const StatusModal = ({
//   enrollment,
//   submitting,
//   onClose,
//   onUpdate,
// }: {
//   enrollment: StudentElectiveEnrollment | null;
//   submitting: boolean;
//   onClose: () => void;
//   onUpdate: (
//     enrollment: StudentElectiveEnrollment,
//     status: StudentElectiveStatus,
//   ) => void;
// }) => {
//   const [status, setStatus] = useState<StudentElectiveStatus>("ACTIVE");

//   useEffect(() => {
//     if (enrollment) setStatus(enrollment.status);
//   }, [enrollment]);

//   if (!enrollment) return null;

//   return (
//     <div
//       className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
//       onMouseDown={(event) => event.target === event.currentTarget && onClose()}
//     >
//       <div
//         role="dialog"
//         aria-modal="true"
//         className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
//       >
//         <div className="flex items-center justify-between">
//           <h2 className="text-lg font-extrabold text-slate-900">
//             Update elective status
//           </h2>
//           <button
//             type="button"
//             onClick={onClose}
//             disabled={submitting}
//             className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
//           >
//             <Icon icon="lucide:x" className="h-5 w-5" />
//           </button>
//         </div>
//         <div className="mt-5 grid grid-cols-3 gap-2">
//           {(["ACTIVE", "DROPPED", "COMPLETED"] as StudentElectiveStatus[]).map(
//             (item) => (
//               <button
//                 key={item}
//                 type="button"
//                 onClick={() => setStatus(item)}
//                 className={`min-h-11 rounded-xl border text-xs font-extrabold transition ${
//                   status === item
//                     ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-100"
//                     : "border-slate-200 text-slate-600 hover:bg-slate-50"
//                 }`}
//               >
//                 {prettyText(item)}
//               </button>
//             ),
//           )}
//         </div>
//         <div className="mt-6 grid grid-cols-2 gap-3">
//           <button
//             type="button"
//             onClick={onClose}
//             disabled={submitting}
//             className="min-h-11 rounded-xl border border-slate-300 text-sm font-bold text-slate-700"
//           >
//             Cancel
//           </button>
//           <button
//             type="button"
//             onClick={() => void onUpdate(enrollment, status)}
//             disabled={submitting || status === enrollment.status}
//             className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-700 text-sm font-bold text-white disabled:bg-slate-300"
//           >
//             {submitting && (
//               <Icon
//                 icon="lucide:loader-circle"
//                 className="h-4 w-4 animate-spin"
//               />
//             )}
//             Save status
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const SuccessModal = ({
//   open,
//   message,
//   onClose,
// }: {
//   open: boolean;
//   message: string;
//   onClose: () => void;
// }) => {
//   useEffect(() => {
//     if (!open) return;
//     const handleEscape = (event: KeyboardEvent) => {
//       if (event.key === "Escape") onClose();
//     };
//     document.addEventListener("keydown", handleEscape);
//     return () => document.removeEventListener("keydown", handleEscape);
//   }, [onClose, open]);

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
//       <div
//         role="dialog"
//         aria-modal="true"
//         className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl"
//       >
//         <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
//           <Icon icon="lucide:circle-check-big" className="h-8 w-8" />
//         </div>
//         <h2 className="mt-5 text-xl font-extrabold text-slate-900">
//           Updated successfully
//         </h2>
//         <p className="mt-2 text-sm leading-6 text-slate-500">{message}</p>
//         <button
//           type="button"
//           onClick={onClose}
//           className="mt-6 min-h-11 w-full rounded-xl bg-blue-700 text-sm font-extrabold text-white hover:bg-blue-800"
//         >
//           Continue
//         </button>
//       </div>
//     </div>
//   );
// };

// const PageState = ({
//   icon,
//   title,
//   message = "Please wait while the page is being prepared.",
//   spin = false,
//   action,
// }: {
//   icon: string;
//   title: string;
//   message?: string;
//   spin?: boolean;
//   action?: () => void;
// }) => (
//   <div className="flex min-h-[520px] items-center justify-center bg-slate-50 p-5">
//     <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
//       <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
//         <Icon icon={icon} className={`h-7 w-7 ${spin ? "animate-spin" : ""}`} />
//       </div>
//       <h2 className="mt-5 text-xl font-extrabold text-slate-900">{title}</h2>
//       <p className="mt-2 text-sm leading-6 text-slate-500">{message}</p>
//       {action && (
//         <button
//           type="button"
//           onClick={action}
//           className="mt-5 min-h-11 rounded-xl bg-blue-700 px-5 text-sm font-bold text-white"
//         >
//           Back to students
//         </button>
//       )}
//     </div>
//   </div>
// );

// export default StudentElectiveAssignments;




import React, { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../../api/axios";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getStudentByIdApi } from "../../../features/student/student.api";
import type { Student } from "../../../features/student/student.types";
import { getSubjectAssignmentsApi } from "../../../features/academic/subjectAssignments/subjectAssignment.api";
import type { SubjectAssignmentData } from "../../../features/academic/subjectAssignments/subjectAssignment.types";
import {
  assignStudentElective,
  clearStudentElectiveMessages,
  getStudentElectives,
  updateStudentElective,
} from "../../../features/student/studentElective.slice";
import type {
  ElectiveStudent,
  ElectiveSubject,
  ElectiveSubjectAssignment,
  ElectiveTeacher,
  StudentElectiveEnrollment,
  StudentElectiveStatus,
} from "../../../features/student/studentElective.types";

type Relation = string | { _id: string; name?: string };

type StudentWithAcademic = Student & {
  stream?: string;
  enrollment?: Student["enrollment"] & {
    stream?: string;
  };
};

interface CurrentAcademicEnrollment {
  _id: string;
  sessionId: Relation;
  classId: Relation;
  sectionId: Relation;
  rollNumber?: number;
  stream?: string;
  enrollmentStatus?: string;
  createdAt?: string;
}

interface StudentEnrollmentHistoryResponse {
  success: boolean;
  data: {
    enrollments: CurrentAcademicEnrollment[];
  };
}

const relationId = (value?: Relation): string => {
  if (!value) return "";
  return typeof value === "string" ? value : value._id;
};

const relationName = (value?: Relation): string => {
  if (!value || typeof value === "string") return "—";
  return value.name || "—";
};

const prettyText = (value?: string): string =>
  value
    ? value
        .toLowerCase()
        .replaceAll("_", " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
    : "—";

const populated = <T extends object>(value: string | T): T | null =>
  typeof value === "string" ? null : value;

const getApiMessage = (error: unknown, fallback: string): string => {
  const apiError = error as {
    response?: { data?: { message?: string } };
    message?: string;
  };

  return apiError.response?.data?.message ?? apiError.message ?? fallback;
};

const StudentElectiveAssignments: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { enrollments, loading, submitting, error, successMessage } =
    useAppSelector((state) => state.studentElectives);

  const [student, setStudent] = useState<Student | null>(null);
  const [currentEnrollment, setCurrentEnrollment] =
    useState<CurrentAcademicEnrollment | null>(null);
  const [assignments, setAssignments] = useState<SubjectAssignmentData[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState("");
  const [remarks, setRemarks] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [statusTarget, setStatusTarget] =
    useState<StudentElectiveEnrollment | null>(null);

  const academicStudent = student as StudentWithAcademic | null;
  const sessionId = relationId(
    currentEnrollment?.sessionId ??
      (student?.sessionId as Relation | undefined),
  );
  const classId = relationId(
    currentEnrollment?.classId ?? (student?.classId as Relation | undefined),
  );
  const sectionId = relationId(
    currentEnrollment?.sectionId ??
      (student?.sectionId as Relation | undefined),
  );
  const stream =
    currentEnrollment?.stream ??
    academicStudent?.enrollment?.stream ??
    academicStudent?.stream;

  useEffect(() => {
    dispatch(clearStudentElectiveMessages());

    if (!studentId) {
      setPageError("Student ID is missing");
      setPageLoading(false);
      return;
    }

    const loadPage = async () => {
      try {
        setPageLoading(true);
        setPageError(null);

        const [studentData, enrollmentHistoryResponse] = await Promise.all([
          getStudentByIdApi(studentId),
          api.get<StudentEnrollmentHistoryResponse>(
            `/students/${studentId}/enrollments`,
          ),
        ]);

        const enrollmentHistory = Array.isArray(
          enrollmentHistoryResponse.data?.data?.enrollments,
        )
          ? enrollmentHistoryResponse.data.data.enrollments
          : [];

        const studentSessionId = relationId(
          studentData.sessionId as Relation | undefined,
        );

        const activeEnrollment =
          enrollmentHistory.find(
            (enrollment) =>
              enrollment.enrollmentStatus === "ACTIVE" &&
              (!studentSessionId ||
                relationId(enrollment.sessionId) === studentSessionId),
          ) ??
          enrollmentHistory.find(
            (enrollment) => enrollment.enrollmentStatus === "ACTIVE",
          ) ??
          enrollmentHistory[0] ??
          null;

        const currentSessionId = relationId(
          activeEnrollment?.sessionId ??
            (studentData.sessionId as Relation | undefined),
        );
        const currentClassId = relationId(
          activeEnrollment?.classId ??
            (studentData.classId as Relation | undefined),
        );
        const currentSectionId = relationId(
          activeEnrollment?.sectionId ??
            (studentData.sectionId as Relation | undefined),
        );

        setStudent(studentData);
        setCurrentEnrollment(activeEnrollment);

        const [assignmentData] = await Promise.all([
          getSubjectAssignmentsApi({
            ...(currentSessionId ? { sessionId: currentSessionId } : {}),
            ...(currentClassId ? { classId: currentClassId } : {}),
            ...(currentSectionId ? { sectionId: currentSectionId } : {}),
          }),
          dispatch(getStudentElectives({ studentId })).unwrap(),
        ]);

        setAssignments(assignmentData);
      } catch (loadError: unknown) {
        setPageError(
          getApiMessage(loadError, "Failed to load elective subject details"),
        );
      } finally {
        setPageLoading(false);
      }
    };

    void loadPage();
  }, [dispatch, studentId]);

  const electiveAssignments = useMemo(
    () =>
      assignments.filter((assignment) => {
        const subject = populated(assignment.subjectId);
        const assignmentSessionId = relationId(
          assignment.sessionId as Relation,
        );
        const assignmentClassId = relationId(assignment.classId as Relation);
        const assignmentSectionId = relationId(
          assignment.sectionId as Relation,
        );

        const assignmentType =
          assignment.assignmentType ?? "CLASS";

        const matchesStudentScope =
          assignmentType === "CLASS" ||
          (
            assignmentType === "STREAM" &&
            Boolean(stream) &&
            assignment.stream === stream
          );

        return (
          subject?.subjectType === "ELECTIVE" &&
          assignment.isActive !== false &&
          matchesStudentScope &&
          (!sessionId || assignmentSessionId === sessionId) &&
          (!classId || assignmentClassId === classId) &&
          (!sectionId || assignmentSectionId === sectionId)
        );
      }),
    [assignments, classId, sectionId, sessionId, stream],
  );

  const assignedAssignmentIds = useMemo(
    () =>
      new Set(
        enrollments
          .filter((item) => item.status === "ACTIVE")
          .map((item) => relationId(item.subjectAssignmentId as Relation)),
      ),
    [enrollments],
  );

  const availableAssignments = useMemo(
    () =>
      electiveAssignments.filter(
        (assignment) => !assignedAssignmentIds.has(assignment._id),
      ),
    [assignedAssignmentIds, electiveAssignments],
  );

  const handleAssign = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!studentId || !selectedAssignmentId || submitting) return;

    const cleanRemarks = remarks.trim();

    try {
      await dispatch(
        assignStudentElective({
          studentId,
          subjectAssignmentId: selectedAssignmentId,
          ...(cleanRemarks ? { remarks: cleanRemarks } : {}),
        }),
      ).unwrap();

      setSelectedAssignmentId("");
      setRemarks("");
      await dispatch(getStudentElectives({ studentId })).unwrap();
    } catch {
      // Redux state already contains the API error.
    }
  };

  const handleStatusUpdate = async (
    enrollment: StudentElectiveEnrollment,
    status: StudentElectiveStatus,
  ) => {
    try {
      await dispatch(
        updateStudentElective({
          enrollmentId: enrollment._id,
          data: { status },
        }),
      ).unwrap();
      setStatusTarget(null);
    } catch {
      // Redux state already contains the API error.
    }
  };

  if (pageLoading) {
    return (
      <PageState icon="lucide:loader-circle" title="Loading electives" spin />
    );
  }

  if (!student || pageError) {
    return (
      <PageState
        icon="lucide:circle-alert"
        title="Unable to load student"
        message={pageError ?? "Student record was not found"}
        action={() => navigate("/school-admin/students")}
      />
    );
  }

  const displayedSession =
    currentEnrollment?.sessionId ?? (student.sessionId as Relation);
  const displayedClass =
    currentEnrollment?.classId ?? (student.classId as Relation);
  const displayedSection =
    currentEnrollment?.sectionId ?? (student.sectionId as Relation);

  const normalizedClassName = relationName(displayedClass)
    .toLowerCase()
    .replace("class", "")
    .trim();

  const isSeniorClass = ["11", "12"].includes(normalizedClassName);

  return (
    <div className="min-h-full bg-slate-50 px-4 py-5 md:px-6 md:py-7 lg:px-8">
      <div className="mx-auto max-w-[1380px]">
        <button
          type="button"
          onClick={() => navigate("/school-admin/students")}
          className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-blue-700"
        >
          <Icon icon="lucide:arrow-left" className="h-4 w-4" />
          Back to students
        </button>

        <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#102A56] via-[#174F91] to-[#2874C6] p-6 text-white shadow-xl md:p-8">
          <div className="pointer-events-none absolute -right-16 -top-20 h-60 w-60 rounded-full bg-white/10" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <StudentAvatar student={student} />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
                  Elective subject management
                </p>
                <h1 className="mt-1 text-2xl font-extrabold md:text-3xl">
                  {student.name}
                </h1>
                <p className="mt-1 text-sm text-blue-100">
                  {student.admissionNumber} · Roll{" "}
                  {currentEnrollment?.rollNumber ?? student.rollNumber ?? "—"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <HeaderValue
                label="Session"
                value={relationName(displayedSession)}
              />
              <HeaderValue label="Class" value={relationName(displayedClass)} />
              <HeaderValue
                label="Section"
                value={relationName(displayedSection)}
              />
              <HeaderValue label="Stream" value={prettyText(stream)} />
            </div>
          </div>
        </header>

        {!isSeniorClass && (
          <Notice
            tone="amber"
            title="Elective assignment is intended for Class 11 and 12"
            message="This student is not currently enrolled in Class 11 or Class 12."
          />
        )}

        {!stream && isSeniorClass && (
          <Notice
            tone="amber"
            title="Student stream is missing"
            message="Assign a stream in the current enrollment before assigning elective subjects."
          />
        )}

        {(pageError || error) && (
          <Notice
            tone="rose"
            title="Unable to process request"
            message={pageError ?? error ?? "Something went wrong"}
          />
        )}

        <div className="mt-6 grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <section className="h-fit rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Icon icon="lucide:book-plus" className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-extrabold text-slate-900">
                    Assign Elective
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Choose an available elective assignment.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleAssign} className="space-y-5 p-5">
              <div>
                <label className="mb-2 block text-xs font-bold text-slate-600">
                  Elective subject assignment{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedAssignmentId}
                  onChange={(event) =>
                    setSelectedAssignmentId(event.target.value)
                  }
                  disabled={!isSeniorClass || !stream || submitting}
                  className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition disabled:cursor-not-allowed disabled:bg-slate-100 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select elective subject</option>
                  {availableAssignments.map((assignment) => {
                    const subject = populated(assignment.subjectId);
                    const teacher = populated(assignment.teacherId);
                    const scope =
                      assignment.assignmentType === "STREAM"
                        ? `${prettyText(assignment.stream)} stream`
                        : "Entire class";
                    return (
                      <option key={assignment._id} value={assignment._id}>
                        {subject?.name ?? "Unnamed subject"} (
                        {subject?.code ?? "—"})
                        {teacher?.name ? ` · ${teacher.name}` : ""}
                        {` · ${scope}`}
                      </option>
                    );
                  })}
                </select>
                {availableAssignments.length === 0 && (
                  <p className="mt-2 text-xs leading-5 text-amber-700">
                    No unassigned elective subject is available for this class
                    and section.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-slate-600">
                  Remarks
                </label>
                <textarea
                  value={remarks}
                  onChange={(event) => setRemarks(event.target.value)}
                  rows={3}
                  maxLength={1000}
                  placeholder="Optional note about this elective..."
                  className="w-full resize-none rounded-xl border border-slate-300 px-3 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                disabled={
                  !selectedAssignmentId ||
                  !isSeniorClass ||
                  !stream ||
                  submitting
                }
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 text-sm font-extrabold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <Icon
                  icon={submitting ? "lucide:loader-circle" : "lucide:plus"}
                  className={`h-5 w-5 ${submitting ? "animate-spin" : ""}`}
                />
                {submitting ? "Assigning..." : "Assign Elective Subject"}
              </button>
            </form>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div>
                <h2 className="font-extrabold text-slate-900">
                  Assigned Electives
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  {enrollments.length} assignment
                  {enrollments.length === 1 ? "" : "s"}
                </p>
              </div>
              {loading && (
                <Icon
                  icon="lucide:loader-circle"
                  className="h-5 w-5 animate-spin text-blue-700"
                />
              )}
            </div>

            {enrollments.length > 0 ? (
              <div className="divide-y divide-slate-200">
                {enrollments.map((enrollment) => (
                  <ElectiveRow
                    key={enrollment._id}
                    enrollment={enrollment}
                    disabled={submitting}
                    onStatusClick={() => setStatusTarget(enrollment)}
                  />
                ))}
              </div>
            ) : (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                  <Icon icon="lucide:book-open" className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-extrabold text-slate-900">
                  No elective assigned
                </h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Select an elective assignment from the form to add the
                  student’s first elective.
                </p>
              </div>
            )}
          </section>
        </div>

        <StatusModal
          enrollment={statusTarget}
          submitting={submitting}
          onClose={() => !submitting && setStatusTarget(null)}
          onUpdate={handleStatusUpdate}
        />

        <SuccessModal
          open={Boolean(successMessage)}
          message={successMessage ?? "Elective assignment updated successfully"}
          onClose={() => dispatch(clearStudentElectiveMessages())}
        />
      </div>
    </div>
  );
};

const HeaderValue = ({ label, value }: { label: string; value: string }) => (
  <div className="min-w-[105px] rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 backdrop-blur-sm">
    <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
      {label}
    </p>
    <p className="mt-1 truncate text-sm font-extrabold text-white">{value}</p>
  </div>
);

const StudentAvatar = ({ student }: { student: Student }) => (
  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white/15 text-xl font-extrabold">
    {student.photo ? (
      <img
        src={student.photo}
        alt={student.name}
        className="h-full w-full object-cover"
      />
    ) : (
      student.name?.trim().charAt(0).toUpperCase() || "S"
    )}
  </div>
);

const Notice = ({
  tone,
  title,
  message,
}: {
  tone: "amber" | "rose";
  title: string;
  message: string;
}) => (
  <div
    className={`mt-5 flex gap-3 rounded-xl border p-4 ${
      tone === "rose"
        ? "border-rose-200 bg-rose-50 text-rose-800"
        : "border-amber-200 bg-amber-50 text-amber-800"
    }`}
  >
    <Icon icon="lucide:circle-alert" className="mt-0.5 h-5 w-5 shrink-0" />
    <div>
      <p className="text-sm font-extrabold">{title}</p>
      <p className="mt-1 text-sm opacity-90">{message}</p>
    </div>
  </div>
);

const ElectiveRow = ({
  enrollment,
  disabled,
  onStatusClick,
}: {
  enrollment: StudentElectiveEnrollment;
  disabled: boolean;
  onStatusClick: () => void;
}) => {
  const assignment = populated<ElectiveSubjectAssignment>(
    enrollment.subjectAssignmentId,
  );
  const subject = assignment
    ? populated<ElectiveSubject>(assignment.subjectId)
    : null;
  const teacher = assignment?.teacherId
    ? populated<ElectiveTeacher>(assignment.teacherId)
    : null;
  const student = populated<ElectiveStudent>(enrollment.studentId);

  const statusTones: Record<StudentElectiveStatus, string> = {
    ACTIVE: "border-emerald-200 bg-emerald-50 text-emerald-700",
    DROPPED: "border-rose-200 bg-rose-50 text-rose-700",
    COMPLETED: "border-blue-200 bg-blue-50 text-blue-700",
  };

  return (
    <article className="p-5 transition hover:bg-slate-50/70">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
          <Icon icon="lucide:book-marked" className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-extrabold text-slate-900">
              {subject?.name ?? "Elective subject"}
            </h3>
            <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-extrabold text-slate-600">
              {subject?.code ?? "—"}
            </span>
            <span
              className={`rounded-full border px-2.5 py-1 text-[10px] font-extrabold ${statusTones[enrollment.status]}`}
            >
              {prettyText(enrollment.status)}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
            <span>
              Teacher:{" "}
              <strong className="text-slate-700">{teacher?.name ?? "—"}</strong>
            </span>
            <span>
              Periods/week:{" "}
              <strong className="text-slate-700">
                {assignment?.weeklyPeriods ?? "—"}
              </strong>
            </span>
            {student?.name && (
              <span>
                Student:{" "}
                <strong className="text-slate-700">{student.name}</strong>
              </span>
            )}
          </div>
          {enrollment.remarks && (
            <p className="mt-2 text-xs leading-5 text-slate-500">
              {enrollment.remarks}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onStatusClick}
          disabled={disabled}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-xs font-extrabold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50"
        >
          <Icon icon="lucide:refresh-cw" className="h-4 w-4" />
          Update status
        </button>
      </div>
    </article>
  );
};

const StatusModal = ({
  enrollment,
  submitting,
  onClose,
  onUpdate,
}: {
  enrollment: StudentElectiveEnrollment | null;
  submitting: boolean;
  onClose: () => void;
  onUpdate: (
    enrollment: StudentElectiveEnrollment,
    status: StudentElectiveStatus,
  ) => void;
}) => {
  const [status, setStatus] = useState<StudentElectiveStatus>("ACTIVE");

  useEffect(() => {
    if (enrollment) setStatus(enrollment.status);
  }, [enrollment]);

  if (!enrollment) return null;

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900">
            Update elective status
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <Icon icon="lucide:x" className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {(["ACTIVE", "DROPPED", "COMPLETED"] as StudentElectiveStatus[]).map(
            (item) => (
              <button
                key={item}
                type="button"
                onClick={() => setStatus(item)}
                className={`min-h-11 rounded-xl border text-xs font-extrabold transition ${
                  status === item
                    ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-100"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {prettyText(item)}
              </button>
            ),
          )}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="min-h-11 rounded-xl border border-slate-300 text-sm font-bold text-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void onUpdate(enrollment, status)}
            disabled={submitting || status === enrollment.status}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-700 text-sm font-bold text-white disabled:bg-slate-300"
          >
            {submitting && (
              <Icon
                icon="lucide:loader-circle"
                className="h-4 w-4 animate-spin"
              />
            )}
            Save status
          </button>
        </div>
      </div>
    </div>
  );
};

const SuccessModal = ({
  open,
  message,
  onClose,
}: {
  open: boolean;
  message: string;
  onClose: () => void;
}) => {
  useEffect(() => {
    if (!open) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <Icon icon="lucide:circle-check-big" className="h-8 w-8" />
        </div>
        <h2 className="mt-5 text-xl font-extrabold text-slate-900">
          Updated successfully
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 min-h-11 w-full rounded-xl bg-blue-700 text-sm font-extrabold text-white hover:bg-blue-800"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

const PageState = ({
  icon,
  title,
  message = "Please wait while the page is being prepared.",
  spin = false,
  action,
}: {
  icon: string;
  title: string;
  message?: string;
  spin?: boolean;
  action?: () => void;
}) => (
  <div className="flex min-h-[520px] items-center justify-center bg-slate-50 p-5">
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
        <Icon icon={icon} className={`h-7 w-7 ${spin ? "animate-spin" : ""}`} />
      </div>
      <h2 className="mt-5 text-xl font-extrabold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">{message}</p>
      {action && (
        <button
          type="button"
          onClick={action}
          className="mt-5 min-h-11 rounded-xl bg-blue-700 px-5 text-sm font-bold text-white"
        >
          Back to students
        </button>
      )}
    </div>
  </div>
);

export default StudentElectiveAssignments;
