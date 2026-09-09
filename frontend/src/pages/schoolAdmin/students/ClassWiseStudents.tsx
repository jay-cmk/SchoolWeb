// import React, { useEffect, useMemo, useState } from "react";

// import { useNavigate } from "react-router-dom";

// import { Icon } from "@iconify/react";

// import { getSessions } from "../../../features/academic/sessions/session.slice";

// import { getClasses } from "../../../features/academic/classes/class.slice";

// import { getSections } from "../../../features/academic/sections/section.slice";

// import {
//   clearStudents,
//   getStudentsByEnrollment,
// } from "../../../features/student/student.slice";

// import type {
//   Student,
//   StudentRelation,
// } from "../../../features/student/student.types";
// import { useAppDispatch, useAppSelector } from "../../../app/hooks";

// const ClassWiseStudents: React.FC = () => {
//   const dispatch = useAppDispatch();

//   const navigate = useNavigate();

//   // ============================================
//   // REDUX
//   // ============================================

//   const { sessions } = useAppSelector((state) => state.sessions);

//   const selectedSessionId = useAppSelector(
//     (state) => state.sessionSelection.selectedSessionId,
//   );

//   const { classes, loading: classLoading } = useAppSelector(
//     (state) => state.classes,
//   );

//   const { sections, loading: sectionLoading } = useAppSelector(
//     (state) => state.sections,
//   );

//   const {
//     students,
//     loading: studentLoading,
//     error: studentError,
//   } = useAppSelector((state) => state.students);

//   // ============================================
//   // LOCAL STATE
//   // ============================================

//   const [classId, setClassId] = useState("");

//   const [sectionId, setSectionId] = useState("");

//   const [searchQuery, setSearchQuery] = useState("");

//   // ============================================
//   // LOAD ACADEMIC SESSIONS
//   // ============================================

//   useEffect(() => {
//     if (sessions.length === 0) {
//       dispatch(getSessions());
//     }
//   }, [dispatch, sessions.length]);

//   // ============================================
//   // LOAD CLASSES AND RESET DEPENDENT DATA
//   // WHEN TOPBAR SESSION CHANGES
//   // ============================================

//   useEffect(() => {
//     setClassId("");
//     setSectionId("");
//     setSearchQuery("");

//     dispatch(clearStudents());

//     if (!selectedSessionId) {
//       return;
//     }

//     dispatch(
//       getClasses({
//         sessionId: selectedSessionId,
//       }),
//     );
//   }, [dispatch, selectedSessionId]);

//   // ============================================
//   // FILTER CLASSES
//   // ClassData.sessionId is string
//   // ============================================

//   const filteredClasses = useMemo(() => {
//     if (!selectedSessionId) {
//       return [];
//     }

//     return classes.filter(
//       (classItem) => classItem.sessionId === selectedSessionId,
//     );
//   }, [classes, selectedSessionId]);

//   // ============================================
//   // HELPERS
//   // Student relation can be string or object
//   // ============================================

//   const getRelationId = (relation: string | StudentRelation) => {
//     if (typeof relation === "string") {
//       return relation;
//     }

//     return relation._id;
//   };

//   // ============================================
//   // FILTER STUDENTS
//   // ============================================

//   const filteredStudents = useMemo(() => {
//     if (!selectedSessionId || !classId || !sectionId) {
//       return [];
//     }

//     const query = searchQuery.trim().toLowerCase();

//     return students.filter((student) => {
//       const studentSessionId = getRelationId(student.sessionId);

//       const studentClassId = getRelationId(student.classId);

//       const studentSectionId = getRelationId(student.sectionId);

//       const matchesAcademic =
//         studentSessionId === selectedSessionId &&
//         studentClassId === classId &&
//         studentSectionId === sectionId;

//       if (!matchesAcademic) {
//         return false;
//       }

//       if (!query) {
//         return true;
//       }

//       const name = student.name?.toLowerCase() || "";

//       const admissionNumber = student.admissionNumber?.toLowerCase() || "";

//       const rollNumber = student.rollNumber?.toString().toLowerCase() || "";

//       const email = student.email?.toLowerCase() || "";

//       const mobile = student.mobile?.toLowerCase() || "";

//       return (
//         name.includes(query) ||
//         admissionNumber.includes(query) ||
//         rollNumber.includes(query) ||
//         email.includes(query) ||
//         mobile.includes(query)
//       );
//     });
//   }, [students, selectedSessionId, classId, sectionId, searchQuery]);

//   // ============================================
//   // SELECTED DATA
//   // ============================================

//   const selectedSession = useMemo(
//     () => sessions.find((session) => session._id === selectedSessionId),
//     [sessions, selectedSessionId],
//   );

//   const selectedClass = useMemo(
//     () => classes.find((classItem) => classItem._id === classId),
//     [classes, classId],
//   );

//   const selectedSection = useMemo(
//     () => sections.find((section) => section._id === sectionId),
//     [sections, sectionId],
//   );

//   // ============================================
//   // CLASS CHANGE
//   // ============================================

//   const handleClassChange = (value: string) => {
//     setClassId(value);

//     setSectionId("");

//     setSearchQuery("");

//     dispatch(clearStudents());

//     if (!selectedSessionId || !value) {
//       return;
//     }

//     dispatch(
//       getSections({
//         sessionId: selectedSessionId,
//         classId: value,
//       }),
//     );
//   };

//   // ============================================
//   // SECTION CHANGE
//   // ============================================

//   const handleSectionChange = (value: string) => {
//     setSectionId(value);

//     setSearchQuery("");

//     dispatch(clearStudents());

//     if (!selectedSessionId || !classId || !value) {
//       return;
//     }

//     dispatch(
//       getStudentsByEnrollment({
//         sessionId: selectedSessionId,
//         classId,
//         sectionId: value,
//       }),
//     );
//   };

//   // ============================================
//   // VIEW STUDENT
//   // ============================================

//   const handleViewStudent = (student: Student) => {
//     navigate(`/school-admin/students/${student._id}`);
//   };

//   // ============================================
//   // EDIT STUDENT
//   // ============================================

//   const handleEditStudent = (student: Student) => {
//     navigate(`/school-admin/students/${student._id}/edit`);
//   };

//   // ============================================
//   // COMMON INPUT CLASS
//   // ============================================

//   const inputClassName = `
//     min-h-11
//     w-full
//     rounded-lg
//     border
//     border-[#D1D5DB]
//     bg-white
//     px-3
//     text-sm
//     text-[#15243B]
//     outline-none
//     transition-all
//     focus:border-[#1F5FAE]
//     focus:ring-1
//     focus:ring-[#1F5FAE]
//     disabled:cursor-not-allowed
//     disabled:bg-[#F9FAFB]
//     disabled:text-[#9CA3AF]
//   `;

//   // ============================================
//   // LOADING
//   // ============================================

//   const initialLoading = studentLoading && students.length === 0;

//   return (
//     <div
//       className="
//         min-h-full
//         bg-[#F7F9FC]
//         p-4
//         md:p-6
//         lg:p-8
//       "
//     >
//       {/* ========================================
//           HEADER
//       ======================================== */}

//       <div
//         className="
//           mb-6
//           flex
//           flex-col
//           gap-4

//           lg:flex-row
//           lg:items-center
//           lg:justify-between
//         "
//       >
//         <div>
//           <div
//             className="
//               mb-2
//               flex
//               items-center
//               gap-2
//               text-sm
//               text-[#6B7280]
//             "
//           >
//             <button
//               type="button"
//               onClick={() => navigate("/school-admin/students")}
//               className="
//                 hover:text-[#1F5FAE]
//               "
//             >
//               Students
//             </button>

//             <Icon icon="lucide:chevron-right" className="text-sm" />

//             <span
//               className="
//                 text-[#15243B]
//               "
//             >
//               Class-wise Students
//             </span>
//           </div>

//           <h1
//             className="
//               text-2xl
//               font-bold
//               text-[#15243B]
//               md:text-3xl
//             "
//           >
//             Class-wise Students
//           </h1>

//           <p
//             className="
//               mt-1
//               text-sm
//               text-[#6B7280]
//             "
//           >
//             Select a class and section to view students for the Topbar academic
//             session.
//           </p>
//         </div>

//         <button
//           type="button"
//           onClick={() => navigate("/school-admin/students/add")}
//           className="
//             inline-flex
//             min-h-11
//             items-center
//             justify-center
//             gap-2
//             rounded-lg
//             bg-[#1F5FAE]
//             px-5
//             text-sm
//             font-semibold
//             text-white
//             transition-colors
//             hover:bg-[#174F91]
//           "
//         >
//           <Icon icon="lucide:user-plus" className="text-lg" />
//           Add Student
//         </button>
//       </div>

//       {/* ========================================
//           ERROR
//       ======================================== */}

//       {studentError && (
//         <div
//           className="
//             mb-5
//             flex
//             items-start
//             gap-3
//             rounded-lg
//             border
//             border-red-200
//             bg-red-50
//             p-4
//           "
//         >
//           <Icon
//             icon="lucide:circle-alert"
//             className="
//               mt-0.5
//               shrink-0
//               text-xl
//               text-red-500
//             "
//           />

//           <div className="flex-1">
//             <p
//               className="
//                 text-sm
//                 font-semibold
//                 text-red-700
//               "
//             >
//               Failed to load students
//             </p>

//             <p
//               className="
//                 mt-1
//                 text-sm
//                 text-red-600
//               "
//             >
//               {studentError}
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={() => {
//               if (!selectedSessionId || !classId || !sectionId) {
//                 return;
//               }

//               dispatch(
//                 getStudentsByEnrollment({
//                   sessionId: selectedSessionId,
//                   classId,
//                   sectionId,
//                 }),
//               );
//             }}
//             className="
//               text-sm
//               font-semibold
//               text-red-700
//               hover:underline
//             "
//           >
//             Retry
//           </button>
//         </div>
//       )}

//       {/* ========================================
//           FILTER CARD
//       ======================================== */}

//       <div
//         className="
//           mb-6
//           rounded-xl
//           border
//           border-[#E5E7EB]
//           bg-white
//         "
//       >
//         <div
//           className="
//             border-b
//             border-[#E5E7EB]
//             px-5
//             py-4
//           "
//         >
//           <div
//             className="
//               flex
//               items-center
//               gap-3
//             "
//           >
//             <div
//               className="
//                 flex
//                 h-10
//                 w-10
//                 items-center
//                 justify-center
//                 rounded-lg
//                 bg-[#E8F0FB]
//                 text-[#1F5FAE]
//               "
//             >
//               <Icon icon="lucide:list-filter" className="text-xl" />
//             </div>

//             <div>
//               <h2
//                 className="
//                   font-semibold
//                   text-[#15243B]
//                 "
//               >
//                 Select Class
//               </h2>

//               <p
//                 className="
//                   text-xs
//                   text-[#6B7280]
//                 "
//               >
//                 Academic Session comes from the Topbar
//               </p>
//             </div>
//           </div>
//         </div>

//         <div
//           className="
//             grid
//             grid-cols-1
//             gap-5
//             p-5

//             md:grid-cols-3
//           "
//         >
//           {/* GLOBAL SESSION */}

//           <div>
//             <label
//               className="
//                 mb-2
//                 block
//                 text-sm
//                 font-semibold
//                 text-[#15243B]
//               "
//             >
//               Academic Session
//             </label>

//             <div
//               className="
//                 flex
//                 min-h-11
//                 items-center
//                 gap-3
//                 rounded-lg
//                 border
//                 border-[#D1D5DB]
//                 bg-[#F9FAFB]
//                 px-3
//                 text-sm
//                 text-[#15243B]
//               "
//             >
//               <Icon
//                 icon="lucide:calendar-days"
//                 className="shrink-0 text-lg text-[#1F5FAE]"
//               />

//               <span className="font-medium">
//                 {selectedSession?.name ?? "Select a session from the Topbar"}
//               </span>
//             </div>
//           </div>

//           {/* CLASS */}

//           <div>
//             <label
//               className="
//                 mb-2
//                 block
//                 text-sm
//                 font-semibold
//                 text-[#15243B]
//               "
//             >
//               Class
//             </label>

//             <select
//               value={classId}
//               onChange={(event) => handleClassChange(event.target.value)}
//               disabled={!selectedSessionId || classLoading}
//               className={inputClassName}
//             >
//               <option value="">
//                 {classLoading
//                   ? "Loading classes..."
//                   : !selectedSessionId
//                     ? "Select session from Topbar"
//                     : "Select class"}
//               </option>

//               {filteredClasses.map((classItem) => (
//                 <option key={classItem._id} value={classItem._id}>
//                   {classItem.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* SECTION */}

//           <div>
//             <label
//               className="
//                 mb-2
//                 block
//                 text-sm
//                 font-semibold
//                 text-[#15243B]
//               "
//             >
//               Section
//             </label>

//             <select
//               value={sectionId}
//               onChange={(event) => handleSectionChange(event.target.value)}
//               disabled={!classId || sectionLoading}
//               className={inputClassName}
//             >
//               <option value="">
//                 {sectionLoading
//                   ? "Loading sections..."
//                   : !classId
//                     ? "Select class first"
//                     : "Select section"}
//               </option>

//               {sections.map((section) => (
//                 <option key={section._id} value={section._id}>
//                   {section.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* ========================================
//           NO SELECTION
//       ======================================== */}

//       {!selectedSessionId || !classId || !sectionId ? (
//         <div
//           className="
//             flex
//             min-h-[350px]
//             items-center
//             justify-center
//             rounded-xl
//             border
//             border-[#E5E7EB]
//             bg-white
//             p-6
//           "
//         >
//           <div
//             className="
//               max-w-md
//               text-center
//             "
//           >
//             <div
//               className="
//                 mx-auto
//                 flex
//                 h-14
//                 w-14
//                 items-center
//                 justify-center
//                 rounded-full
//                 bg-[#E8F0FB]
//                 text-[#1F5FAE]
//               "
//             >
//               <Icon icon="lucide:school" className="text-2xl" />
//             </div>

//             <h3
//               className="
//                 mt-4
//                 font-semibold
//                 text-[#15243B]
//               "
//             >
//               {!selectedSessionId
//                 ? "Select academic session"
//                 : "Select class and section"}
//             </h3>

//             <p
//               className="
//                 mt-1
//                 text-sm
//                 leading-6
//                 text-[#6B7280]
//               "
//             >
//               {!selectedSessionId
//                 ? "Select an academic session from the Topbar to continue."
//                 : "Select a class and section above to view students."}
//             </p>
//           </div>
//         </div>
//       ) : initialLoading ? (
//         /* ======================================
//             LOADING
//         ====================================== */

//         <div
//           className="
//             flex
//             min-h-[350px]
//             items-center
//             justify-center
//             rounded-xl
//             border
//             border-[#E5E7EB]
//             bg-white
//           "
//         >
//           <div className="text-center">
//             <Icon
//               icon="lucide:loader-circle"
//               className="
//                 mx-auto
//                 animate-spin
//                 text-4xl
//                 text-[#1F5FAE]
//               "
//             />

//             <p
//               className="
//                 mt-3
//                 text-sm
//                 text-[#6B7280]
//               "
//             >
//               Loading students...
//             </p>
//           </div>
//         </div>
//       ) : (
//         /* ======================================
//             STUDENTS CARD
//         ====================================== */

//         <div
//           className="
//             overflow-hidden
//             rounded-xl
//             border
//             border-[#E5E7EB]
//             bg-white
//           "
//         >
//           {/* CARD HEADER */}

//           <div
//             className="
//               flex
//               flex-col
//               gap-4
//               border-b
//               border-[#E5E7EB]
//               p-5

//               lg:flex-row
//               lg:items-center
//               lg:justify-between
//             "
//           >
//             <div>
//               <h2
//                 className="
//                   text-lg
//                   font-semibold
//                   text-[#15243B]
//                 "
//               >
//                 {selectedClass?.name}
//                 {" - "}
//                 {selectedSection?.name}
//               </h2>

//               <p
//                 className="
//                   mt-1
//                   text-sm
//                   text-[#6B7280]
//                 "
//               >
//                 {selectedSession?.name}
//                 {" • "}
//                 {filteredStudents.length} student
//                 {filteredStudents.length !== 1 ? "s" : ""}
//               </p>
//             </div>

//             <div
//               className="
//                 relative
//                 w-full
//                 lg:max-w-sm
//               "
//             >
//               <Icon
//                 icon="lucide:search"
//                 className="
//                   absolute
//                   left-3
//                   top-1/2
//                   -translate-y-1/2
//                   text-lg
//                   text-[#6B7280]
//                 "
//               />

//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(event) => setSearchQuery(event.target.value)}
//                 placeholder="Search students..."
//                 className="
//                   min-h-11
//                   w-full
//                   rounded-lg
//                   border
//                   border-[#D1D5DB]
//                   bg-white
//                   pl-10
//                   pr-10
//                   text-sm
//                   text-[#15243B]
//                   outline-none
//                   transition-all
//                   placeholder:text-[#9CA3AF]
//                   focus:border-[#1F5FAE]
//                   focus:ring-1
//                   focus:ring-[#1F5FAE]
//                 "
//               />

//               {searchQuery && (
//                 <button
//                   type="button"
//                   onClick={() => setSearchQuery("")}
//                   className="
//                     absolute
//                     right-3
//                     top-1/2
//                     -translate-y-1/2
//                     text-[#9CA3AF]
//                     hover:text-[#15243B]
//                   "
//                 >
//                   <Icon icon="lucide:x" className="text-lg" />
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* ====================================
//               STUDENT TABLE
//           ==================================== */}

//           {filteredStudents.length > 0 ? (
//             <div
//               className="
//                 overflow-x-auto
//               "
//             >
//               <table
//                 className="
//                   w-full
//                   min-w-[850px]
//                   text-left
//                 "
//               >
//                 <thead
//                   className="
//                     bg-[#F9FAFB]
//                   "
//                 >
//                   <tr
//                     className="
//                       border-b
//                       border-[#E5E7EB]
//                     "
//                   >
//                     <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
//                       Student
//                     </th>

//                     <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
//                       Admission No.
//                     </th>

//                     <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
//                       Roll No.
//                     </th>

//                     <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
//                       Mobile
//                     </th>

//                     <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody
//                   className="
//                     divide-y
//                     divide-[#E5E7EB]
//                   "
//                 >
//                   {filteredStudents.map((student) => (
//                     <tr
//                       key={student._id}
//                       className="
//                           transition-colors
//                           hover:bg-[#F9FAFB]
//                         "
//                     >
//                       <td
//                         className="
//                             px-5
//                             py-4
//                           "
//                       >
//                         <div
//                           className="
//                               flex
//                               items-center
//                               gap-3
//                             "
//                         >
//                           <div
//                             className="
//                                 flex
//                                 h-10
//                                 w-10
//                                 shrink-0
//                                 items-center
//                                 justify-center
//                                 rounded-full
//                                 bg-[#E8F0FB]
//                                 text-sm
//                                 font-bold
//                                 uppercase
//                                 text-[#1F5FAE]
//                               "
//                           >
//                             {student.name?.charAt(0) || "S"}
//                           </div>

//                           <div
//                             className="
//                                 min-w-0
//                               "
//                           >
//                             <p
//                               className="
//                                   truncate
//                                   text-sm
//                                   font-semibold
//                                   text-[#15243B]
//                                 "
//                             >
//                               {student.name}
//                             </p>

//                             <p
//                               className="
//                                   mt-0.5
//                                   truncate
//                                   text-xs
//                                   text-[#6B7280]
//                                 "
//                             >
//                               {student.email || "No email"}
//                             </p>
//                           </div>
//                         </div>
//                       </td>

//                       <td
//                         className="
//                             px-5
//                             py-4
//                             text-sm
//                             font-medium
//                             text-[#15243B]
//                           "
//                       >
//                         {student.admissionNumber}
//                       </td>

//                       <td
//                         className="
//                             px-5
//                             py-4
//                             text-sm
//                             text-[#6B7280]
//                           "
//                       >
//                         {student.rollNumber ?? "-"}
//                       </td>

//                       <td
//                         className="
//                             px-5
//                             py-4
//                             text-sm
//                             text-[#6B7280]
//                           "
//                       >
//                         {student.mobile || "-"}
//                       </td>

//                       <td
//                         className="
//                             px-5
//                             py-4
//                           "
//                       >
//                         <div
//                           className="
//                               flex
//                               items-center
//                               justify-end
//                               gap-1
//                             "
//                         >
//                           <button
//                             type="button"
//                             onClick={() => handleViewStudent(student)}
//                             title="View Student"
//                             className="
//                                 flex
//                                 h-9
//                                 w-9
//                                 items-center
//                                 justify-center
//                                 rounded-lg
//                                 text-[#6B7280]
//                                 transition-colors
//                                 hover:bg-[#E8F0FB]
//                                 hover:text-[#1F5FAE]
//                               "
//                           >
//                             <Icon icon="lucide:eye" className="text-lg" />
//                           </button>

//                           <button
//                             type="button"
//                             onClick={() => handleEditStudent(student)}
//                             title="Edit Student"
//                             className="
//                                 flex
//                                 h-9
//                                 w-9
//                                 items-center
//                                 justify-center
//                                 rounded-lg
//                                 text-[#6B7280]
//                                 transition-colors
//                                 hover:bg-[#F3F4F6]
//                                 hover:text-[#15243B]
//                               "
//                           >
//                             <Icon icon="lucide:pencil" className="text-lg" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             /* ==================================
//                 EMPTY STATE
//             ================================== */

//             <div
//               className="
//                 flex
//                 min-h-[320px]
//                 items-center
//                 justify-center
//                 p-6
//               "
//             >
//               <div
//                 className="
//                   max-w-sm
//                   text-center
//                 "
//               >
//                 <div
//                   className="
//                     mx-auto
//                     flex
//                     h-14
//                     w-14
//                     items-center
//                     justify-center
//                     rounded-full
//                     bg-[#F3F4F6]
//                     text-[#6B7280]
//                   "
//                 >
//                   <Icon
//                     icon={searchQuery ? "lucide:search-x" : "lucide:users"}
//                     className="text-2xl"
//                   />
//                 </div>

//                 <h3
//                   className="
//                     mt-4
//                     font-semibold
//                     text-[#15243B]
//                   "
//                 >
//                   {searchQuery
//                     ? "No students found"
//                     : "No students in this section"}
//                 </h3>

//                 <p
//                   className="
//                     mt-1
//                     text-sm
//                     leading-6
//                     text-[#6B7280]
//                   "
//                 >
//                   {searchQuery
//                     ? "No student matches your search."
//                     : "There are currently no students assigned to the selected session, class and section."}
//                 </p>

//                 {!searchQuery && (
//                   <button
//                     type="button"
//                     onClick={() => navigate("/school-admin/students/add")}
//                     className="
//                       mt-5
//                       inline-flex
//                       min-h-10
//                       items-center
//                       gap-2
//                       rounded-lg
//                       bg-[#1F5FAE]
//                       px-4
//                       text-sm
//                       font-semibold
//                       text-white
//                       hover:bg-[#174F91]
//                     "
//                   >
//                     <Icon icon="lucide:user-plus" />
//                     Add Student
//                   </button>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ClassWiseStudents;



import React, { useEffect, useMemo, useState } from "react";

import { createPortal } from "react-dom";

import { useNavigate } from "react-router-dom";

import { Icon } from "@iconify/react";

import { getSessions } from "../../../features/academic/sessions/session.slice";

import { getClasses } from "../../../features/academic/classes/class.slice";

import { getSections } from "../../../features/academic/sections/section.slice";

import {
  clearStudentError,
  clearStudents,
  getStudentsByEnrollment,
  updateStudentStatus,
} from "../../../features/student/student.slice";

import type {
  Student,
  StudentRelation,
  StudentStatus,
} from "../../../features/student/student.types";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";

import {
  showConfirmAlert,
  showErrorAlert,
  showSuccessAlert,
} from "../../../components/common/sweetAlert";

interface ActionMenuState {
  student: Student;
  top: number;
  left: number;
}

const formatStatus = (status?: string) =>
  status
    ? status
        .toLowerCase()
        .replaceAll("_", " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
    : "Unknown";

const getStatusClassName = (status?: string) => {
  switch (status?.toUpperCase()) {
    case "ACTIVE":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "COMPLETED":
    case "PASSED":
    case "GRADUATED":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "INACTIVE":
    case "CANCELLED":
    case "LEFT":
      return "border-red-200 bg-red-50 text-red-700";

    case "TRANSFERRED":
      return "border-amber-200 bg-amber-50 text-amber-700";

    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
};

const getStudentStatus = (student: Student): StudentStatus => {
  const normalizedStatus = String(
    student.status ??
      student.enrollment?.enrollmentStatus ??
      "ACTIVE",
  )
    .trim()
    .toUpperCase();

  return normalizedStatus === "INACTIVE" ? "INACTIVE" : "ACTIVE";
};

const ClassWiseStudents: React.FC = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  // ============================================
  // REDUX
  // ============================================

  const { sessions } = useAppSelector((state) => state.sessions);

  const selectedSessionId = useAppSelector(
    (state) => state.sessionSelection.selectedSessionId,
  );

  const { classes, loading: classLoading } = useAppSelector(
    (state) => state.classes,
  );

  const { sections, loading: sectionLoading } = useAppSelector(
    (state) => state.sections,
  );

  const {
    students,
    loading: studentLoading,
    error: studentError,
  } = useAppSelector((state) => state.students);

  // ============================================
  // LOCAL STATE
  // ============================================

  const [classId, setClassId] = useState("");

  const [sectionId, setSectionId] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(
    null,
  );

  const [actionMenu, setActionMenu] = useState<ActionMenuState | null>(null);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (!target.closest("[data-student-action-menu]")) {
        setActionMenu(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      setActionMenu(null);
    };

    document.addEventListener("mousedown", handleDocumentClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // ============================================
  // LOAD ACADEMIC SESSIONS
  // ============================================

  useEffect(() => {
    if (sessions.length === 0) {
      dispatch(getSessions());
    }
  }, [dispatch, sessions.length]);

  // ============================================
  // LOAD CLASSES AND RESET DEPENDENT DATA
  // WHEN TOPBAR SESSION CHANGES
  // ============================================

  useEffect(() => {
    setClassId("");
    setSectionId("");
    setSearchQuery("");

    dispatch(clearStudents());

    if (!selectedSessionId) {
      return;
    }

    dispatch(
      getClasses({
        sessionId: selectedSessionId,
      }),
    );
  }, [dispatch, selectedSessionId]);

  // ============================================
  // FILTER CLASSES
  // ClassData.sessionId is string
  // ============================================

  const filteredClasses = useMemo(() => {
    if (!selectedSessionId) {
      return [];
    }

    return classes.filter(
      (classItem) => classItem.sessionId === selectedSessionId,
    );
  }, [classes, selectedSessionId]);

  // ============================================
  // FILTER SECTIONS
  // Only selected session + class sections
  // ============================================

  const filteredSections = useMemo(() => {
    if (!selectedSessionId || !classId) {
      return [];
    }

    return sections.filter(
      (section) =>
        section.sessionId === selectedSessionId &&
        section.classId === classId,
    );
  }, [sections, selectedSessionId, classId]);

  // ============================================
  // HELPERS
  // Student relation can be string or object
  // ============================================

  const getRelationId = (relation: string | StudentRelation) => {
    if (typeof relation === "string") {
      return relation;
    }

    return relation._id;
  };

  // ============================================
  // FILTER STUDENTS
  // ============================================

  const filteredStudents = useMemo(() => {
    if (!selectedSessionId || !classId || !sectionId) {
      return [];
    }

    const query = searchQuery.trim().toLowerCase();

    return students.filter((student) => {
      const studentSessionId = getRelationId(student.sessionId);

      const studentClassId = getRelationId(student.classId);

      const studentSectionId = getRelationId(student.sectionId);

      const matchesAcademic =
        studentSessionId === selectedSessionId &&
        studentClassId === classId &&
        studentSectionId === sectionId;

      if (!matchesAcademic) {
        return false;
      }

      if (!query) {
        return true;
      }

      const name = student.name?.toLowerCase() || "";

      const admissionNumber = student.admissionNumber?.toLowerCase() || "";

      const rollNumber = student.rollNumber?.toString().toLowerCase() || "";

      const email = student.email?.toLowerCase() || "";

      const mobile = student.mobile?.toLowerCase() || "";

      return (
        name.includes(query) ||
        admissionNumber.includes(query) ||
        rollNumber.includes(query) ||
        email.includes(query) ||
        mobile.includes(query)
      );
    });
  }, [students, selectedSessionId, classId, sectionId, searchQuery]);

  // ============================================
  // SELECTED DATA
  // ============================================

  const selectedSession = useMemo(
    () => sessions.find((session) => session._id === selectedSessionId),
    [sessions, selectedSessionId],
  );

  const selectedClass = useMemo(
    () => classes.find((classItem) => classItem._id === classId),
    [classes, classId],
  );

  const selectedSection = useMemo(
    () => filteredSections.find((section) => section._id === sectionId),
    [filteredSections, sectionId],
  );

  // ============================================
  // CLASS CHANGE
  // ============================================

  const handleClassChange = (value: string) => {
    setClassId(value);

    setSectionId("");

    setSearchQuery("");

    dispatch(clearStudents());

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
  // SECTION CHANGE
  // ============================================

  const handleSectionChange = (value: string) => {
    setSectionId(value);

    setSearchQuery("");

    dispatch(clearStudents());

    if (!selectedSessionId || !classId || !value) {
      return;
    }

    dispatch(
      getStudentsByEnrollment({
        sessionId: selectedSessionId,
        classId,
        sectionId: value,
      }),
    );
  };

  // ============================================
  // VIEW STUDENT
  // ============================================

  const handleViewStudent = (student: Student) => {
    navigate(`/school-admin/students/${student._id}`);
  };

  // ============================================
  // EDIT STUDENT
  // ============================================

  const handleEditStudent = (student: Student) => {
    navigate(`/school-admin/students/${student._id}/edit`);
  };

  // ============================================
  // ACTIVE / INACTIVE STUDENT
  // ============================================

  const handleToggleStatus = async (student: Student) => {
    if (statusUpdatingId) {
      return;
    }

    setActionMenu(null);
    dispatch(clearStudentError());

    const currentStatus = getStudentStatus(student);

    const nextStatus: StudentStatus =
      currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    const activating = nextStatus === "ACTIVE";

    const confirmed = await showConfirmAlert({
      title: activating ? "Activate student?" : "Deactivate student?",
      text: activating
        ? `${student.name || "This student"} will regain access and appear as active in school records.`
        : `${student.name || "This student"} will be marked inactive. Academic history and existing records will remain preserved.`,
      confirmButtonText: activating ? "Yes, Activate" : "Yes, Deactivate",
      icon: "warning",
      confirmButtonColor: activating ? "#059669" : "#DC2626",
    });

    if (!confirmed) {
      return;
    }

    try {
      setStatusUpdatingId(student._id);

      await dispatch(
        updateStudentStatus({
          studentId: student._id,
          status: nextStatus,
        }),
      ).unwrap();

      await showSuccessAlert(
        activating ? "Student activated" : "Student deactivated",
        `${student.name || "Student"} has been ${
          activating ? "activated" : "deactivated"
        } successfully.`,
      );
    } catch (statusError) {
      const message =
        typeof statusError === "string"
          ? statusError
          : "Unable to update student status. Please try again.";

      await showErrorAlert(
        "Status update failed",
        message,
      );

      dispatch(clearStudentError());
    } finally {
      setStatusUpdatingId(null);
    }
  };

  // ============================================
  // COMMON INPUT CLASS
  // ============================================

  const inputClassName = `
    min-h-11
    w-full
    rounded-lg
    border
    border-[#D1D5DB]
    bg-white
    px-3
    text-sm
    text-[#15243B]
    outline-none
    transition-all
    focus:border-[#1F5FAE]
    focus:ring-1
    focus:ring-[#1F5FAE]
    disabled:cursor-not-allowed
    disabled:bg-[#F9FAFB]
    disabled:text-[#9CA3AF]
  `;

  // ============================================
  // LOADING
  // ============================================

  const initialLoading = studentLoading && students.length === 0;

  return (
    <div
      className="
        min-h-full
        bg-[#F7F9FC]
        p-4
        md:p-6
        lg:p-8
      "
    >
      {/* ========================================
          HEADER
      ======================================== */}

      <div
        className="
          mb-6
          flex
          flex-col
          gap-4

          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        <div>
          <div
            className="
              mb-2
              flex
              items-center
              gap-2
              text-sm
              text-[#6B7280]
            "
          >
            <button
              type="button"
              onClick={() => navigate("/school-admin/students")}
              className="
                hover:text-[#1F5FAE]
              "
            >
              Students
            </button>

            <Icon icon="lucide:chevron-right" className="text-sm" />

            <span
              className="
                text-[#15243B]
              "
            >
              Class-wise Students
            </span>
          </div>

          <h1
            className="
              text-2xl
              font-bold
              text-[#15243B]
              md:text-3xl
            "
          >
            Class-wise Students
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-[#6B7280]
            "
          >
            Select a class and section to view students for the Topbar academic
            session.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/school-admin/students/add")}
          className="
            inline-flex
            min-h-11
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-[#1F5FAE]
            px-5
            text-sm
            font-semibold
            text-white
            transition-colors
            hover:bg-[#174F91]
          "
        >
          <Icon icon="lucide:user-plus" className="text-lg" />
          Add Student
        </button>
      </div>

      {/* ========================================
          ERROR
      ======================================== */}

      {studentError && (
        <div
          className="
            mb-5
            flex
            items-start
            gap-3
            rounded-lg
            border
            border-red-200
            bg-red-50
            p-4
          "
        >
          <Icon
            icon="lucide:circle-alert"
            className="
              mt-0.5
              shrink-0
              text-xl
              text-red-500
            "
          />

          <div className="flex-1">
            <p
              className="
                text-sm
                font-semibold
                text-red-700
              "
            >
              Failed to load students
            </p>

            <p
              className="
                mt-1
                text-sm
                text-red-600
              "
            >
              {studentError}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (!selectedSessionId || !classId || !sectionId) {
                return;
              }

              dispatch(
                getStudentsByEnrollment({
                  sessionId: selectedSessionId,
                  classId,
                  sectionId,
                }),
              );
            }}
            className="
              text-sm
              font-semibold
              text-red-700
              hover:underline
            "
          >
            Retry
          </button>
        </div>
      )}

      {/* ========================================
          FILTER CARD
      ======================================== */}

      <div
        className="
          mb-6
          rounded-xl
          border
          border-[#E5E7EB]
          bg-white
        "
      >
        <div
          className="
            border-b
            border-[#E5E7EB]
            px-5
            py-4
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-lg
                bg-[#E8F0FB]
                text-[#1F5FAE]
              "
            >
              <Icon icon="lucide:list-filter" className="text-xl" />
            </div>

            <div>
              <h2
                className="
                  font-semibold
                  text-[#15243B]
                "
              >
                Select Class
              </h2>

              <p
                className="
                  text-xs
                  text-[#6B7280]
                "
              >
                Academic Session comes from the Topbar
              </p>
            </div>
          </div>
        </div>

        <div
          className="
            grid
            grid-cols-1
            gap-5
            p-5

            md:grid-cols-3
          "
        >
          {/* GLOBAL SESSION */}

          <div>
            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-[#15243B]
              "
            >
              Academic Session
            </label>

            <div
              className="
                flex
                min-h-11
                items-center
                gap-3
                rounded-lg
                border
                border-[#D1D5DB]
                bg-[#F9FAFB]
                px-3
                text-sm
                text-[#15243B]
              "
            >
              <Icon
                icon="lucide:calendar-days"
                className="shrink-0 text-lg text-[#1F5FAE]"
              />

              <span className="font-medium">
                {selectedSession?.name ?? "Select a session from the Topbar"}
              </span>
            </div>
          </div>

          {/* CLASS */}

          <div>
            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-[#15243B]
              "
            >
              Class
            </label>

            <select
              value={classId}
              onChange={(event) => handleClassChange(event.target.value)}
              disabled={!selectedSessionId || classLoading}
              className={inputClassName}
            >
              <option value="">
                {classLoading
                  ? "Loading classes..."
                  : !selectedSessionId
                    ? "Select session from Topbar"
                    : "Select class"}
              </option>

              {filteredClasses.map((classItem) => (
                <option key={classItem._id} value={classItem._id}>
                  {classItem.name}
                </option>
              ))}
            </select>
          </div>

          {/* SECTION */}

          <div>
            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-[#15243B]
              "
            >
              Section
            </label>

            <select
              value={sectionId}
              onChange={(event) => handleSectionChange(event.target.value)}
              disabled={!classId || sectionLoading}
              className={inputClassName}
            >
              <option value="">
                {sectionLoading
                  ? "Loading sections..."
                  : !classId
                    ? "Select class first"
                    : "Select section"}
              </option>

              {filteredSections.map((section) => (
                <option key={section._id} value={section._id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ========================================
          NO SELECTION
      ======================================== */}

      {!selectedSessionId || !classId || !sectionId ? (
        <div
          className="
            flex
            min-h-[350px]
            items-center
            justify-center
            rounded-xl
            border
            border-[#E5E7EB]
            bg-white
            p-6
          "
        >
          <div
            className="
              max-w-md
              text-center
            "
          >
            <div
              className="
                mx-auto
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                bg-[#E8F0FB]
                text-[#1F5FAE]
              "
            >
              <Icon icon="lucide:school" className="text-2xl" />
            </div>

            <h3
              className="
                mt-4
                font-semibold
                text-[#15243B]
              "
            >
              {!selectedSessionId
                ? "Select academic session"
                : "Select class and section"}
            </h3>

            <p
              className="
                mt-1
                text-sm
                leading-6
                text-[#6B7280]
              "
            >
              {!selectedSessionId
                ? "Select an academic session from the Topbar to continue."
                : "Select a class and section above to view students."}
            </p>
          </div>
        </div>
      ) : initialLoading ? (
        /* ======================================
            LOADING
        ====================================== */

        <div
          className="
            flex
            min-h-[350px]
            items-center
            justify-center
            rounded-xl
            border
            border-[#E5E7EB]
            bg-white
          "
        >
          <div className="text-center">
            <Icon
              icon="lucide:loader-circle"
              className="
                mx-auto
                animate-spin
                text-4xl
                text-[#1F5FAE]
              "
            />

            <p
              className="
                mt-3
                text-sm
                text-[#6B7280]
              "
            >
              Loading students...
            </p>
          </div>
        </div>
      ) : (
        /* ======================================
            STUDENTS CARD
        ====================================== */

        <div
          className="
            overflow-hidden
            rounded-xl
            border
            border-[#E5E7EB]
            bg-white
          "
        >
          {/* CARD HEADER */}

          <div
            className="
              flex
              flex-col
              gap-4
              border-b
              border-[#E5E7EB]
              p-5

              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div>
              <h2
                className="
                  text-lg
                  font-semibold
                  text-[#15243B]
                "
              >
                {selectedClass?.name}
                {" - "}
                {selectedSection?.name}
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-[#6B7280]
                "
              >
                {selectedSession?.name}
                {" • "}
                {filteredStudents.length} student
                {filteredStudents.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div
              className="
                relative
                w-full
                lg:max-w-sm
              "
            >
              <Icon
                icon="lucide:search"
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-lg
                  text-[#6B7280]
                "
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search students..."
                className="
                  min-h-11
                  w-full
                  rounded-lg
                  border
                  border-[#D1D5DB]
                  bg-white
                  pl-10
                  pr-10
                  text-sm
                  text-[#15243B]
                  outline-none
                  transition-all
                  placeholder:text-[#9CA3AF]
                  focus:border-[#1F5FAE]
                  focus:ring-1
                  focus:ring-[#1F5FAE]
                "
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-[#9CA3AF]
                    hover:text-[#15243B]
                  "
                >
                  <Icon icon="lucide:x" className="text-lg" />
                </button>
              )}
            </div>
          </div>

          {/* ====================================
              STUDENT TABLE
          ==================================== */}

          {filteredStudents.length > 0 ? (
            <div
              className="
                overflow-x-auto
              "
            >
              <table
                className="
                  w-full
                  min-w-[960px]
                  text-left
                "
              >
                <thead
                  className="
                    bg-[#F9FAFB]
                  "
                >
                  <tr
                    className="
                      border-b
                      border-[#E5E7EB]
                    "
                  >
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                      Student
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                      Admission No.
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                      Roll No.
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                      Mobile
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                      Status
                    </th>

                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody
                  className="
                    divide-y
                    divide-[#E5E7EB]
                  "
                >
                  {filteredStudents.map((student) => (
                    <tr
                      key={student._id}
                      className="
                          transition-colors
                          hover:bg-[#F9FAFB]
                        "
                    >
                      <td
                        className="
                            px-5
                            py-4
                          "
                      >
                        <div
                          className="
                              flex
                              items-center
                              gap-3
                            "
                        >
                          <div
                            className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-[#E8F0FB]
                                text-sm
                                font-bold
                                uppercase
                                text-[#1F5FAE]
                              "
                          >
                            {student.name?.trim().charAt(0).toUpperCase() || "S"}
                          </div>

                          <div
                            className="
                                min-w-0
                              "
                          >
                            <p
                              className="
                                  truncate
                                  text-sm
                                  font-semibold
                                  text-[#15243B]
                                "
                            >
                              {student.name}
                            </p>

                            <p
                              className="
                                  mt-0.5
                                  truncate
                                  text-xs
                                  text-[#6B7280]
                                "
                            >
                              {student.email || "No email"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td
                        className="
                            px-5
                            py-4
                            text-sm
                            font-medium
                            text-[#15243B]
                          "
                      >
                        {student.admissionNumber}
                      </td>

                      <td
                        className="
                            px-5
                            py-4
                            text-sm
                            text-[#6B7280]
                          "
                      >
                        {student.rollNumber ?? "-"}
                      </td>

                      <td
                        className="
                            px-5
                            py-4
                            text-sm
                            text-[#6B7280]
                          "
                      >
                        {student.mobile || "-"}
                      </td>

                      <td className="px-5 py-4">
                        {(() => {
                          const status =
                            getStudentStatus(student);

                          return (
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClassName(
                                status,
                              )}`}
                            >
                              {formatStatus(status)}
                            </span>
                          );
                        })()}
                      </td>

                      <td className="px-5 py-4">
                        <div
                          data-student-action-menu
                          className="flex justify-end"
                        >
                          <button
                            type="button"
                            aria-label={`Open actions for ${student.name}`}
                            aria-haspopup="menu"
                            aria-expanded={actionMenu?.student._id === student._id}
                            onClick={(event) => {
                              if (actionMenu?.student._id === student._id) {
                                setActionMenu(null);

                                return;
                              }

                              const rect = event.currentTarget.getBoundingClientRect();
                              const menuWidth = 224;
                              const menuHeight = 210;
                              const gap = 8;

                              const left = Math.min(
                                window.innerWidth - menuWidth - 12,
                                Math.max(12, rect.right - menuWidth),
                              );

                              const top =
                                rect.bottom + gap + menuHeight <= window.innerHeight
                                  ? rect.bottom + gap
                                  : Math.max(12, rect.top - menuHeight - gap);

                              setActionMenu({
                                student,
                                top,
                                left,
                              });
                            }}
                            className={`flex size-10 items-center justify-center rounded-xl border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5FAE] ${
                              actionMenu?.student._id === student._id
                                ? "border-blue-200 bg-blue-50 text-[#1F5FAE]"
                                : "border-[#E2E8F0] bg-white text-[#64748B] hover:border-blue-200 hover:bg-blue-50 hover:text-[#1F5FAE]"
                            }`}
                          >
                            {statusUpdatingId === student._id ? (
                              <Icon
                                icon="lucide:loader-circle"
                                className="animate-spin text-xl"
                              />
                            ) : (
                              <Icon
                                icon="lucide:ellipsis-vertical"
                                className="text-xl"
                              />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* ==================================
                EMPTY STATE
            ================================== */

            <div
              className="
                flex
                min-h-[320px]
                items-center
                justify-center
                p-6
              "
            >
              <div
                className="
                  max-w-sm
                  text-center
                "
              >
                <div
                  className="
                    mx-auto
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-full
                    bg-[#F3F4F6]
                    text-[#6B7280]
                  "
                >
                  <Icon
                    icon={searchQuery ? "lucide:search-x" : "lucide:users"}
                    className="text-2xl"
                  />
                </div>

                <h3
                  className="
                    mt-4
                    font-semibold
                    text-[#15243B]
                  "
                >
                  {searchQuery
                    ? "No students found"
                    : "No students in this section"}
                </h3>

                <p
                  className="
                    mt-1
                    text-sm
                    leading-6
                    text-[#6B7280]
                  "
                >
                  {searchQuery
                    ? "No student matches your search."
                    : "There are currently no students assigned to the selected session, class and section."}
                </p>

                {!searchQuery && (
                  <button
                    type="button"
                    onClick={() => navigate("/school-admin/students/add")}
                    className="
                      mt-5
                      inline-flex
                      min-h-10
                      items-center
                      gap-2
                      rounded-lg
                      bg-[#1F5FAE]
                      px-4
                      text-sm
                      font-semibold
                      text-white
                      hover:bg-[#174F91]
                    "
                  >
                    <Icon icon="lucide:user-plus" />
                    Add Student
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {actionMenu &&
        createPortal(
          <div
            data-student-action-menu
            role="menu"
            style={{
              top: actionMenu.top,
              left: actionMenu.left,
            }}
            className="fixed z-[1400] w-56 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-1.5 shadow-[0_20px_50px_rgba(15,23,42,0.22)]"
          >
            <div className="border-b border-[#E2E8F0] px-3 py-2.5">
              <p className="truncate text-sm font-bold text-[#15243B]">
                {actionMenu.student.name || "Student"}
              </p>
              <p className="mt-0.5 truncate text-xs text-[#64748B]">
                {actionMenu.student.admissionNumber || "No admission number"}
              </p>
            </div>

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setActionMenu(null);
                handleViewStudent(actionMenu.student);
              }}
              className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[#334155] transition hover:bg-blue-50 hover:text-[#1F5FAE]"
            >
              <Icon icon="lucide:eye" className="text-lg" />
              View Details
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setActionMenu(null);
                handleEditStudent(actionMenu.student);
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[#334155] transition hover:bg-slate-100"
            >
              <Icon icon="lucide:pencil" className="text-lg" />
              Edit Student
            </button>

            <div className="my-1 border-t border-[#E2E8F0]" />

            <button
              type="button"
              role="menuitem"
              disabled={statusUpdatingId !== null}
              onClick={() => void handleToggleStatus(actionMenu.student)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                getStudentStatus(actionMenu.student) === "INACTIVE"
                  ? "text-emerald-700 hover:bg-emerald-50"
                  : "text-red-600 hover:bg-red-50"
              }`}
            >
              <Icon
                icon={
                  getStudentStatus(actionMenu.student) === "INACTIVE"
                    ? "lucide:user-check"
                    : "lucide:user-x"
                }
                className="text-lg"
              />
              {getStudentStatus(actionMenu.student) === "INACTIVE"
                ? "Activate Student"
                : "Deactivate Student"}
            </button>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default ClassWiseStudents;
