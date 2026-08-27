// import {
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import { Icon } from "@iconify/react";

// import {
//   useAppDispatch,
//   useAppSelector,
// } from "../../../../app/hooks";

// import {
//   createSubject,
//   getSubjects,
//   getSubjectById,
//   updateSubject,
//   updateSubjectStatus,
//   clearSubjectError,
//   clearSelectedSubject,
// } from "../../../../features/academic/subjects/subject.slice";

// import {
//   getSessions,
// } from "../../../../features/academic/sessions/session.slice";

// import type {
//   CreateSubjectPayload,
//   UpdateSubjectPayload,
//   SubjectData,
//   SubjectType,
// } from "../../../../features/academic/subjects/subject.types";


// // ============================================
// // TYPES
// // ============================================

// interface SubjectFormState {
//   sessionId: string;

//   name: string;

//   code: string;

//   description: string;

//   subjectType: SubjectType;
// }


// // ============================================
// // INITIAL FORM
// // ============================================

// const initialFormState: SubjectFormState = {
//   sessionId: "",
//   name: "",
//   code: "",
//   description: "",
//   subjectType: "CORE",
// };


// // ============================================
// // SUBJECT TYPE OPTIONS
// // ============================================

// const SUBJECT_TYPES: {
//   value: SubjectType;
//   label: string;
// }[] = [
//   {
//     value: "CORE",
//     label: "Core",
//   },
//   {
//     value: "LANGUAGE",
//     label: "Language",
//   },
//   {
//     value: "PRACTICAL",
//     label: "Practical",
//   },
//   {
//     value: "ELECTIVE",
//     label: "Elective",
//   },
// ];


// // ============================================
// // STAT CARD
// // ============================================

// interface StatCardProps {
//   title: string;
//   value: string | number;
//   subtext: string;
//   icon: string;
// }


// const StatCard = ({
//   title,
//   value,
//   subtext,
//   icon,
// }: StatCardProps) => {
//   return (
//     <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

//       <div className="flex items-start justify-between">

//         <div>
//           <p className="text-sm font-medium text-gray-500">
//             {title}
//           </p>

//           <p className="mt-2 text-3xl font-bold text-gray-900">
//             {value}
//           </p>
//         </div>

//         <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
//           <Icon
//             icon={icon}
//             className="text-xl"
//           />
//         </div>

//       </div>

//       <p className="mt-3 text-xs text-gray-500">
//         {subtext}
//       </p>

//     </div>
//   );
// };


// // ============================================
// // MAIN SUBJECTS PAGE
// // ============================================

// const Subjects = () => {
//   const dispatch = useAppDispatch();


//   // ============================================
//   // REDUX
//   // ============================================

//   const {
//     subjects,
//     selectedSubject,
//     loading,
//     error,
//   } = useAppSelector(
//     (state) => state.subjects
//   );


//   const {
//     sessions,
//   } = useAppSelector(
//     (state) => state.sessions
//   );


//   // ============================================
//   // FILTER STATE
//   // ============================================

//   const [
//     searchQuery,
//     setSearchQuery,
//   ] = useState("");

//   const [
//     sessionFilter,
//     setSessionFilter,
//   ] = useState("ALL");

//   const [
//     typeFilter,
//     setTypeFilter,
//   ] = useState<
//     SubjectType | "ALL"
//   >("ALL");

//   const [
//     statusFilter,
//     setStatusFilter,
//   ] = useState<
//     "ALL" | "ACTIVE" | "INACTIVE"
//   >("ALL");


//   // ============================================
//   // PAGINATION
//   // ============================================

//   const [
//     currentPage,
//     setCurrentPage,
//   ] = useState(1);

//   const itemsPerPage = 6;


//   // ============================================
//   // MODALS
//   // ============================================

//   const [
//     showCreateModal,
//     setShowCreateModal,
//   ] = useState(false);

//   const [
//     showEditModal,
//     setShowEditModal,
//   ] = useState(false);

//   const [
//     showDetailsModal,
//     setShowDetailsModal,
//   ] = useState(false);


//   // ============================================
//   // FORM
//   // ============================================

//   const [
//     formData,
//     setFormData,
//   ] = useState<SubjectFormState>(
//     initialFormState
//   );


//   // ============================================
//   // ACTION STATE
//   // ============================================

//   const [
//     submitting,
//     setSubmitting,
//   ] = useState(false);

//   const [
//     statusActionId,
//     setStatusActionId,
//   ] = useState<string | null>(
//     null
//   );

//   const [
//     activeMenu,
//     setActiveMenu,
//   ] = useState<string | null>(
//     null
//   );

//   const [
//     toastMessage,
//     setToastMessage,
//   ] = useState<string | null>(
//     null
//   );


//   // ============================================
//   // INITIAL LOAD
//   //
//   // GET /academic/subjects
//   // GET /academic/sessions
//   // ============================================

//   useEffect(() => {
//     dispatch(
//       getSubjects(undefined)
//     );

//     dispatch(
//       getSessions()
//     );
//   }, [dispatch]);


//   // ============================================
//   // CLEANUP
//   // ============================================

//   useEffect(() => {
//     return () => {
//       dispatch(
//         clearSubjectError()
//       );

//       dispatch(
//         clearSelectedSubject()
//       );
//     };
//   }, [dispatch]);


//   // ============================================
//   // ERROR
//   // ============================================

//   useEffect(() => {
//     if (error) {
//       showToast(error);
//     }
//   }, [error]);


//   // ============================================
//   // TOAST
//   // ============================================

//   const showToast = (
//     message: string
//   ) => {
//     setToastMessage(
//       message
//     );

//     window.setTimeout(
//       () => {
//         setToastMessage(
//           null
//         );
//       },
//       3000
//     );
//   };


//   // ============================================
//   // SESSION NAME
//   // ============================================

//   const getSessionName = (
//     sessionId: string
//   ) => {
//     const session =
//       sessions.find(
//         (item) =>
//           item._id ===
//           sessionId
//       );

//     return session?.name || "-";
//   };


//   // ============================================
//   // SUBJECT TYPE LABEL
//   // ============================================

//   const getSubjectTypeLabel = (
//     subjectType: SubjectType
//   ) => {
//     return (
//       SUBJECT_TYPES.find(
//         (item) =>
//           item.value ===
//           subjectType
//       )?.label ||
//       subjectType
//     );
//   };


//   // ============================================
//   // FORM CHANGE
//   // ============================================

//   const handleInputChange = (
//     e:
//       | React.ChangeEvent<HTMLInputElement>
//       | React.ChangeEvent<HTMLTextAreaElement>
//       | React.ChangeEvent<HTMLSelectElement>
//   ) => {
//     const {
//       name,
//       value,
//     } = e.target;

//     setFormData(
//       (previous) => ({
//         ...previous,

//         [name]:
//           value,
//       })
//     );
//   };


//   // ============================================
//   // OPEN CREATE MODAL
//   // ============================================

//   const openCreateModal = () => {
//     const currentSession =
//       sessions.find(
//         (session) =>
//           session.isCurrent
//       );

//     setFormData({
//       ...initialFormState,

//       sessionId:
//         currentSession?._id ||
//         sessions[0]?._id ||
//         "",
//     });

//     dispatch(
//       clearSubjectError()
//     );

//     setShowCreateModal(
//       true
//     );
//   };


//   const closeCreateModal = () => {
//     setShowCreateModal(
//       false
//     );

//     setFormData(
//       initialFormState
//     );
//   };


//   // ============================================
//   // CREATE SUBJECT
//   //
//   // POST /academic/subjects
//   // ============================================

//   const handleCreateSubject =
//     async (
//       e: React.FormEvent
//     ) => {
//       e.preventDefault();


//       if (!formData.sessionId) {
//         showToast(
//           "Academic session is required"
//         );

//         return;
//       }


//       if (
//         !formData.name.trim()
//       ) {
//         showToast(
//           "Subject name is required"
//         );

//         return;
//       }


//       if (
//         !formData.code.trim()
//       ) {
//         showToast(
//           "Subject code is required"
//         );

//         return;
//       }


//       const payload:
//         CreateSubjectPayload = {
//           sessionId:
//             formData.sessionId,

//           name:
//             formData.name.trim(),

//           code:
//             formData.code
//               .trim()
//               .toUpperCase(),

//           subjectType:
//             formData.subjectType,

//           ...(formData.description
//             .trim()
//             ? {
//                 description:
//                   formData.description.trim(),
//               }
//             : {}),
//         };


//       try {
//         setSubmitting(
//           true
//         );


//         await dispatch(
//           createSubject(
//             payload
//           )
//         ).unwrap();


//         showToast(
//           "Subject created successfully"
//         );


//         closeCreateModal();


//         await dispatch(
//           getSubjects(
//             undefined
//           )
//         ).unwrap();

//       } catch (err) {
//         showToast(
//           typeof err ===
//             "string"
//             ? err
//             : "Failed to create subject"
//         );
//       } finally {
//         setSubmitting(
//           false
//         );
//       }
//     };


//   // ============================================
//   // VIEW SUBJECT
//   //
//   // GET /academic/subjects/:subjectId
//   // ============================================

//   const handleViewSubject =
//     async (
//       subjectId: string
//     ) => {
//       try {
//         setActiveMenu(
//           null
//         );

//         dispatch(
//           clearSelectedSubject()
//         );


//         await dispatch(
//           getSubjectById(
//             subjectId
//           )
//         ).unwrap();


//         setShowDetailsModal(
//           true
//         );

//       } catch (err) {
//         showToast(
//           typeof err ===
//             "string"
//             ? err
//             : "Failed to fetch subject"
//         );
//       }
//     };


//   const closeDetailsModal =
//     () => {
//       setShowDetailsModal(
//         false
//       );

//       dispatch(
//         clearSelectedSubject()
//       );
//     };


//   // ============================================
//   // OPEN EDIT
//   //
//   // GET /academic/subjects/:subjectId
//   // ============================================

//   const handleOpenEdit =
//     async (
//       subjectId: string
//     ) => {
//       try {
//         setActiveMenu(
//           null
//         );

//         dispatch(
//           clearSelectedSubject()
//         );


//         const subject =
//           await dispatch(
//             getSubjectById(
//               subjectId
//             )
//           ).unwrap();


//         setFormData({
//           sessionId:
//             subject.sessionId,

//           name:
//             subject.name,

//           code:
//             subject.code,

//           description:
//             subject.description ||
//             "",

//           subjectType:
//             subject.subjectType,
//         });


//         setShowEditModal(
//           true
//         );

//       } catch (err) {
//         showToast(
//           typeof err ===
//             "string"
//             ? err
//             : "Failed to fetch subject"
//         );
//       }
//     };


//   const closeEditModal = () => {
//     setShowEditModal(
//       false
//     );

//     setFormData(
//       initialFormState
//     );

//     dispatch(
//       clearSelectedSubject()
//     );
//   };


//   // ============================================
//   // UPDATE SUBJECT
//   //
//   // PUT /academic/subjects/:subjectId
//   // ============================================

//   const handleUpdateSubject =
//     async (
//       e: React.FormEvent
//     ) => {
//       e.preventDefault();


//       if (
//         !selectedSubject?._id
//       ) {
//         showToast(
//           "Subject not selected"
//         );

//         return;
//       }


//       if (
//         !formData.name.trim()
//       ) {
//         showToast(
//           "Subject name is required"
//         );

//         return;
//       }


//       if (
//         !formData.code.trim()
//       ) {
//         showToast(
//           "Subject code is required"
//         );

//         return;
//       }


//       const data:
//         UpdateSubjectPayload = {
//           name:
//             formData.name.trim(),

//           code:
//             formData.code
//               .trim()
//               .toUpperCase(),

//           description:
//             formData.description.trim(),

//           subjectType:
//             formData.subjectType,
//         };


//       try {
//         setSubmitting(
//           true
//         );


//         await dispatch(
//           updateSubject({
//             subjectId:
//               selectedSubject._id,

//             data,
//           })
//         ).unwrap();


//         showToast(
//           "Subject updated successfully"
//         );


//         closeEditModal();


//         await dispatch(
//           getSubjects(
//             undefined
//           )
//         ).unwrap();

//       } catch (err) {
//         showToast(
//           typeof err ===
//             "string"
//             ? err
//             : "Failed to update subject"
//         );
//       } finally {
//         setSubmitting(
//           false
//         );
//       }
//     };


//   // ============================================
//   // STATUS
//   //
//   // PATCH /academic/subjects/:subjectId/status
//   // ============================================

//   const handleToggleStatus =
//     async (
//       subject: SubjectData
//     ) => {
//       try {
//         setActiveMenu(
//           null
//         );

//         setStatusActionId(
//           subject._id
//         );


//         await dispatch(
//           updateSubjectStatus({
//             subjectId:
//               subject._id,

//             isActive:
//               !subject.isActive,
//           })
//         ).unwrap();


//         showToast(
//           subject.isActive
//             ? "Subject marked inactive"
//             : "Subject marked active"
//         );

//       } catch (err) {
//         showToast(
//           typeof err ===
//             "string"
//             ? err
//             : "Failed to update subject status"
//         );
//       } finally {
//         setStatusActionId(
//           null
//         );
//       }
//     };


//   // ============================================
//   // FILTER SUBJECTS
//   // ============================================

//   const filteredSubjects =
//     useMemo(() => {
//       const search =
//         searchQuery
//           .trim()
//           .toLowerCase();


//       return subjects.filter(
//         (subject) => {
//           const matchesSearch =
//             subject.name
//               .toLowerCase()
//               .includes(
//                 search
//               ) ||
//             subject.code
//               .toLowerCase()
//               .includes(
//                 search
//               ) ||
//             (
//               subject.description ||
//               ""
//             )
//               .toLowerCase()
//               .includes(
//                 search
//               );


//           const matchesSession =
//             sessionFilter ===
//               "ALL" ||
//             subject.sessionId ===
//               sessionFilter;


//           const matchesType =
//             typeFilter ===
//               "ALL" ||
//             subject.subjectType ===
//               typeFilter;


//           const matchesStatus =
//             statusFilter ===
//               "ALL" ||
//             (
//               statusFilter ===
//                 "ACTIVE" &&
//               subject.isActive
//             ) ||
//             (
//               statusFilter ===
//                 "INACTIVE" &&
//               !subject.isActive
//             );


//           return (
//             matchesSearch &&
//             matchesSession &&
//             matchesType &&
//             matchesStatus
//           );
//         }
//       );
//     }, [
//       subjects,
//       searchQuery,
//       sessionFilter,
//       typeFilter,
//       statusFilter,
//     ]);


//   // ============================================
//   // PAGINATION
//   // ============================================

//   const totalPages =
//     Math.ceil(
//       filteredSubjects.length /
//         itemsPerPage
//     );


//   const paginatedSubjects =
//     filteredSubjects.slice(
//       (currentPage - 1) *
//         itemsPerPage,

//       currentPage *
//         itemsPerPage
//     );


//   useEffect(() => {
//     setCurrentPage(1);
//   }, [
//     searchQuery,
//     sessionFilter,
//     typeFilter,
//     statusFilter,
//   ]);


//   // ============================================
//   // STATS
//   // ============================================

//   const totalSubjects =
//     subjects.length;


//   const coreSubjects =
//     subjects.filter(
//       (subject) =>
//         subject.subjectType ===
//         "CORE"
//     ).length;


//   const activeSubjects =
//     subjects.filter(
//       (subject) =>
//         subject.isActive
//     ).length;


//   const inactiveSubjects =
//     subjects.filter(
//       (subject) =>
//         !subject.isActive
//     ).length;


//   // ============================================
//   // RESET FILTERS
//   // ============================================

//   const resetFilters = () => {
//     setSearchQuery("");

//     setSessionFilter(
//       "ALL"
//     );

//     setTypeFilter(
//       "ALL"
//     );

//     setStatusFilter(
//       "ALL"
//     );

//     setCurrentPage(1);
//   };


//   // ============================================
//   // EXPORT CSV
//   // ============================================

//   const handleExport = () => {
//     if (
//       filteredSubjects.length ===
//       0
//     ) {
//       showToast(
//         "No subjects to export"
//       );

//       return;
//     }


//     const headers = [
//       "Subject Name",
//       "Code",
//       "Type",
//       "Academic Session",
//       "Status",
//     ];


//     const rows =
//       filteredSubjects.map(
//         (subject) => [
//           subject.name,
//           subject.code,
//           getSubjectTypeLabel(
//             subject.subjectType
//           ),
//           getSessionName(
//             subject.sessionId
//           ),
//           subject.isActive
//             ? "Active"
//             : "Inactive",
//         ]
//       );


//     const csv =
//       [
//         headers,
//         ...rows,
//       ]
//         .map((row) =>
//           row
//             .map(
//               (item) =>
//                 `"${String(
//                   item
//                 ).replace(
//                   /"/g,
//                   '""'
//                 )}"`
//             )
//             .join(",")
//         )
//         .join("\n");


//     const blob =
//       new Blob(
//         [csv],
//         {
//           type:
//             "text/csv;charset=utf-8;",
//         }
//       );


//     const url =
//       URL.createObjectURL(
//         blob
//       );


//     const link =
//       document.createElement(
//         "a"
//       );


//     link.href = url;

//     link.download =
//       "subjects.csv";

//     link.click();


//     URL.revokeObjectURL(
//       url
//     );
//   };


//   // ============================================
//   // LOADING
//   // ============================================

//   if (
//     loading &&
//     subjects.length === 0
//   ) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-gray-50">

//         <div className="text-center">

//           <Icon
//             icon="lucide:loader-2"
//             className="mx-auto animate-spin text-4xl text-blue-600"
//           />

//           <p className="mt-3 text-sm text-gray-500">
//             Loading subjects...
//           </p>

//         </div>

//       </div>
//     );
//   }


//   return (
//     <div className="min-h-screen bg-gray-50 p-5 lg:p-8">

//       {/* ========================================
//           TOAST
//       ======================================== */}

//       {toastMessage && (
//         <div className="fixed bottom-5 right-5 z-[100] flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-white shadow-xl">

//           <Icon
//             icon="lucide:info"
//             className="text-lg text-green-400"
//           />

//           <span className="text-sm font-medium">
//             {toastMessage}
//           </span>

//         </div>
//       )}


//       {/* ========================================
//           HEADER
//       ======================================== */}

//       <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

//         <div>

//           <div className="flex items-center gap-2 text-sm text-gray-500">

//             <span>
//               Academics
//             </span>

//             <Icon
//               icon="lucide:chevron-right"
//             />

//             <span className="font-semibold text-gray-900">
//               Subjects
//             </span>

//           </div>


//           <h1 className="mt-2 text-3xl font-bold text-gray-900">
//             Subjects
//           </h1>


//           <p className="mt-1 text-sm text-gray-500">
//             Manage the subject catalogue for each academic session.
//           </p>

//         </div>


//         <button
//           onClick={
//             openCreateModal
//           }
//           disabled={
//             sessions.length === 0
//           }
//           className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
//         >

//           <Icon
//             icon="lucide:plus"
//             className="text-lg"
//           />

//           Add Subject

//         </button>

//       </div>


//       {/* NO SESSION */}

//       {sessions.length === 0 && (
//         <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
//           Create an Academic Session before creating subjects.
//         </div>
//       )}


//       {/* ERROR */}

//       {error && (
//         <div className="mt-5 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

//           <span>
//             {error}
//           </span>

//           <button
//             onClick={() =>
//               dispatch(
//                 clearSubjectError()
//               )
//             }
//           >
//             <Icon
//               icon="lucide:x"
//             />
//           </button>

//         </div>
//       )}


//       {/* ========================================
//           STATS
//       ======================================== */}

//       <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

//         <StatCard
//           title="Total Subjects"
//           value={totalSubjects}
//           subtext="Subjects in catalogue"
//           icon="lucide:book-open"
//         />


//         <StatCard
//           title="Core Subjects"
//           value={coreSubjects}
//           subtext="Core academic subjects"
//           icon="lucide:book-marked"
//         />


//         <StatCard
//           title="Active Subjects"
//           value={activeSubjects}
//           subtext="Currently active"
//           icon="lucide:circle-check"
//         />


//         <StatCard
//           title="Inactive Subjects"
//           value={inactiveSubjects}
//           subtext="Currently inactive"
//           icon="lucide:circle-off"
//         />

//       </div>


//       {/* ========================================
//           TABLE CARD
//       ======================================== */}

//       <section className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

//         {/* FILTERS */}

//         <div className="border-b border-gray-200 p-5">

//           <div className="flex flex-col gap-3 xl:flex-row">

//             {/* SEARCH */}

//             <div className="relative flex-1">

//               <Icon
//                 icon="lucide:search"
//                 className="absolute left-3 top-3.5 text-gray-400"
//               />

//               <input
//                 type="text"
//                 value={
//                   searchQuery
//                 }
//                 onChange={(e) =>
//                   setSearchQuery(
//                     e.target.value
//                   )
//                 }
//                 placeholder="Search by subject name, code or description..."
//                 className="min-h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-blue-600"
//               />

//             </div>


//             {/* SESSION FILTER */}

//             <select
//               value={
//                 sessionFilter
//               }
//               onChange={(e) =>
//                 setSessionFilter(
//                   e.target.value
//                 )
//               }
//               className="min-h-11 rounded-lg border border-gray-300 bg-white px-4 text-sm outline-none focus:border-blue-600"
//             >

//               <option value="ALL">
//                 All Academic Sessions
//               </option>

//               {sessions.map(
//                 (session) => (
//                   <option
//                     key={
//                       session._id
//                     }
//                     value={
//                       session._id
//                     }
//                   >
//                     {session.name}
//                     {session.isCurrent
//                       ? " (Current)"
//                       : ""}
//                   </option>
//                 )
//               )}

//             </select>


//             {/* TYPE */}

//             <select
//               value={
//                 typeFilter
//               }
//               onChange={(e) =>
//                 setTypeFilter(
//                   e.target.value as
//                     | SubjectType
//                     | "ALL"
//                 )
//               }
//               className="min-h-11 rounded-lg border border-gray-300 bg-white px-4 text-sm"
//             >

//               <option value="ALL">
//                 All Subject Types
//               </option>

//               {SUBJECT_TYPES.map(
//                 (item) => (
//                   <option
//                     key={
//                       item.value
//                     }
//                     value={
//                       item.value
//                     }
//                   >
//                     {item.label}
//                   </option>
//                 )
//               )}

//             </select>


//             {/* STATUS */}

//             <select
//               value={
//                 statusFilter
//               }
//               onChange={(e) =>
//                 setStatusFilter(
//                   e.target.value as
//                     | "ALL"
//                     | "ACTIVE"
//                     | "INACTIVE"
//                 )
//               }
//               className="min-h-11 rounded-lg border border-gray-300 bg-white px-4 text-sm"
//             >

//               <option value="ALL">
//                 All Status
//               </option>

//               <option value="ACTIVE">
//                 Active
//               </option>

//               <option value="INACTIVE">
//                 Inactive
//               </option>

//             </select>


//             <button
//               onClick={
//                 resetFilters
//               }
//               className="min-h-11 rounded-lg border border-gray-300 px-4 text-sm font-medium hover:bg-gray-50"
//             >
//               Reset
//             </button>


//             <button
//               onClick={
//                 handleExport
//               }
//               className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 text-sm font-medium hover:bg-gray-50"
//             >
//               <Icon
//                 icon="lucide:download"
//               />

//               Export
//             </button>

//           </div>

//         </div>


//         {/* ========================================
//             TABLE
//         ======================================== */}

//         <div className="overflow-x-auto">

//           <table className="w-full min-w-[900px] text-left text-sm">

//             <thead className="bg-gray-50 text-xs uppercase text-gray-500">

//               <tr>

//                 <th className="px-5 py-4 font-semibold">
//                   Subject Name
//                 </th>

//                 <th className="px-5 py-4 font-semibold">
//                   Code
//                 </th>

//                 <th className="px-5 py-4 font-semibold">
//                   Subject Type
//                 </th>

//                 <th className="px-5 py-4 font-semibold">
//                   Academic Session
//                 </th>

//                 <th className="px-5 py-4 font-semibold">
//                   Status
//                 </th>

//                 <th className="px-5 py-4 font-semibold">
//                   Created
//                 </th>

//                 <th className="px-5 py-4 text-right font-semibold">
//                   Actions
//                 </th>

//               </tr>

//             </thead>


//             <tbody className="divide-y divide-gray-200">

//               {paginatedSubjects.map(
//                 (subject) => (
//                   <tr
//                     key={
//                       subject._id
//                     }
//                     className="transition hover:bg-gray-50"
//                   >

//                     {/* NAME */}

//                     <td className="px-5 py-4">

//                       <button
//                         onClick={() =>
//                           handleViewSubject(
//                             subject._id
//                           )
//                         }
//                         className="font-semibold text-blue-600 hover:underline"
//                       >
//                         {subject.name}
//                       </button>

//                       {subject.description && (
//                         <p className="mt-1 max-w-xs truncate text-xs text-gray-500">
//                           {subject.description}
//                         </p>
//                       )}

//                     </td>


//                     {/* CODE */}

//                     <td className="px-5 py-4 font-mono text-xs text-gray-600">
//                       {subject.code}
//                     </td>


//                     {/* TYPE */}

//                     <td className="px-5 py-4">

//                       <SubjectTypeBadge
//                         type={
//                           subject.subjectType
//                         }
//                       />

//                     </td>


//                     {/* SESSION */}

//                     <td className="px-5 py-4 text-gray-600">
//                       {getSessionName(
//                         subject.sessionId
//                       )}
//                     </td>


//                     {/* STATUS */}

//                     <td className="px-5 py-4">

//                       <span
//                         className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
//                           subject.isActive
//                             ? "bg-green-100 text-green-700"
//                             : "bg-gray-100 text-gray-600"
//                         }`}
//                       >
//                         {subject.isActive
//                           ? "Active"
//                           : "Inactive"}
//                       </span>

//                     </td>


//                     {/* CREATED */}

//                     <td className="px-5 py-4 text-gray-500">
//                       {new Date(
//                         subject.createdAt
//                       ).toLocaleDateString(
//                         "en-IN"
//                       )}
//                     </td>


//                     {/* ACTION */}

//                     <td className="relative px-5 py-4 text-right">

//                       <div className="flex justify-end gap-1">

//                         <button
//                           onClick={() =>
//                             handleViewSubject(
//                               subject._id
//                             )
//                           }
//                           className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
//                           title="View"
//                         >
//                           <Icon
//                             icon="lucide:eye"
//                           />
//                         </button>


//                         <button
//                           onClick={() =>
//                             handleOpenEdit(
//                               subject._id
//                             )
//                           }
//                           className="rounded-lg p-2 text-amber-600 hover:bg-amber-50"
//                           title="Edit"
//                         >
//                           <Icon
//                             icon="lucide:pencil"
//                           />
//                         </button>


//                         <div className="relative">

//                           <button
//                             onClick={() =>
//                               setActiveMenu(
//                                 activeMenu ===
//                                   subject._id
//                                   ? null
//                                   : subject._id
//                               )
//                             }
//                             className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
//                           >
//                             <Icon
//                               icon="lucide:ellipsis-vertical"
//                             />
//                           </button>


//                           {activeMenu ===
//                             subject._id && (
//                             <div className="absolute right-0 top-10 z-50 w-48 rounded-lg border border-gray-200 bg-white py-1 text-left shadow-xl">

//                               <button
//                                 onClick={() =>
//                                   handleToggleStatus(
//                                     subject
//                                   )
//                                 }
//                                 disabled={
//                                   statusActionId ===
//                                   subject._id
//                                 }
//                                 className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
//                               >

//                                 <Icon
//                                   icon={
//                                     subject.isActive
//                                       ? "lucide:circle-off"
//                                       : "lucide:circle-check"
//                                   }
//                                 />

//                                 {statusActionId ===
//                                 subject._id
//                                   ? "Updating..."
//                                   : subject.isActive
//                                     ? "Make Inactive"
//                                     : "Make Active"}

//                               </button>

//                             </div>
//                           )}

//                         </div>

//                       </div>

//                     </td>

//                   </tr>
//                 )
//               )}

//             </tbody>

//           </table>


//           {/* EMPTY */}

//           {paginatedSubjects.length ===
//             0 && (
//             <div className="p-12 text-center">

//               <Icon
//                 icon="lucide:book-x"
//                 className="mx-auto text-4xl text-gray-400"
//               />

//               <h3 className="mt-3 font-semibold text-gray-900">
//                 No subjects found
//               </h3>

//               <p className="mt-1 text-sm text-gray-500">
//                 Change filters or create a new subject.
//               </p>

//             </div>
//           )}

//         </div>


//         {/* ========================================
//             PAGINATION
//         ======================================== */}

//         <div className="flex flex-col gap-3 border-t border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">

//           <p className="text-sm text-gray-500">

//             Showing{" "}

//             {filteredSubjects.length ===
//             0
//               ? 0
//               : (currentPage -
//                   1) *
//                   itemsPerPage +
//                 1}

//             {" - "}

//             {Math.min(
//               currentPage *
//                 itemsPerPage,

//               filteredSubjects.length
//             )}

//             {" of "}

//             {filteredSubjects.length}

//             {" subjects"}

//           </p>


//           <div className="flex gap-2">

//             <button
//               disabled={
//                 currentPage === 1
//               }
//               onClick={() =>
//                 setCurrentPage(
//                   (page) =>
//                     page - 1
//                 )
//               }
//               className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-50"
//             >
//               Previous
//             </button>


//             {Array.from(
//               {
//                 length:
//                   totalPages,
//               },
//               (_, index) =>
//                 index + 1
//             ).map(
//               (page) => (
//                 <button
//                   key={page}
//                   onClick={() =>
//                     setCurrentPage(
//                       page
//                     )
//                   }
//                   className={`h-10 w-10 rounded-lg text-sm font-semibold ${
//                     currentPage ===
//                     page
//                       ? "bg-blue-600 text-white"
//                       : "border border-gray-300 bg-white text-gray-700"
//                   }`}
//                 >
//                   {page}
//                 </button>
//               )
//             )}


//             <button
//               disabled={
//                 totalPages === 0 ||
//                 currentPage ===
//                   totalPages
//               }
//               onClick={() =>
//                 setCurrentPage(
//                   (page) =>
//                     page + 1
//                 )
//               }
//               className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-50"
//             >
//               Next
//             </button>

//           </div>

//         </div>

//       </section>


//       {/* ========================================
//           CREATE MODAL
//       ======================================== */}

//       {showCreateModal && (
//         <SubjectFormModal
//           title="Add Subject"
//           submitLabel="Create Subject"
//           formData={
//             formData
//           }
//           sessions={
//             sessions
//           }
//           submitting={
//             submitting
//           }
//           disableSession={
//             false
//           }
//           onChange={
//             handleInputChange
//           }
//           onClose={
//             closeCreateModal
//           }
//           onSubmit={
//             handleCreateSubject
//           }
//         />
//       )}


//       {/* ========================================
//           EDIT MODAL
//       ======================================== */}

//       {showEditModal && (
//         <SubjectFormModal
//           title="Edit Subject"
//           submitLabel="Save Changes"
//           formData={
//             formData
//           }
//           sessions={
//             sessions
//           }
//           submitting={
//             submitting
//           }
//           disableSession={
//             true
//           }
//           onChange={
//             handleInputChange
//           }
//           onClose={
//             closeEditModal
//           }
//           onSubmit={
//             handleUpdateSubject
//           }
//         />
//       )}


//       {/* ========================================
//           DETAILS MODAL
//       ======================================== */}

//       {showDetailsModal &&
//         selectedSubject && (
//           <SubjectDetailsModal
//             subject={
//               selectedSubject
//             }
//             sessionName={getSessionName(
//               selectedSubject.sessionId
//             )}
//             onClose={
//               closeDetailsModal
//             }
//           />
//         )}

//     </div>
//   );
// };


// // ============================================
// // SUBJECT FORM MODAL
// // ============================================

// interface SubjectFormModalProps {
//   title: string;

//   submitLabel: string;

//   formData:
//     SubjectFormState;

//   sessions: {
//     _id: string;
//     name: string;
//     isCurrent: boolean;
//   }[];

//   submitting: boolean;

//   disableSession: boolean;

//   onChange: (
//     e:
//       | React.ChangeEvent<HTMLInputElement>
//       | React.ChangeEvent<HTMLTextAreaElement>
//       | React.ChangeEvent<HTMLSelectElement>
//   ) => void;

//   onClose: () => void;

//   onSubmit: (
//     e: React.FormEvent
//   ) => void;
// }


// const SubjectFormModal = ({
//   title,
//   submitLabel,
//   formData,
//   sessions,
//   submitting,
//   disableSession,
//   onChange,
//   onClose,
//   onSubmit,
// }: SubjectFormModalProps) => {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

//       <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">

//         {/* HEADER */}

//         <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">

//           <div>

//             <h2 className="text-xl font-bold text-gray-900">
//               {title}
//             </h2>

//             <p className="mt-1 text-sm text-gray-500">
//               Manage subject catalogue information.
//             </p>

//           </div>


//           <button
//             type="button"
//             onClick={
//               onClose
//             }
//           >
//             <Icon
//               icon="lucide:x"
//               className="text-xl text-gray-500"
//             />
//           </button>

//         </div>


//         <form
//           onSubmit={
//             onSubmit
//           }
//         >

//           <div className="space-y-5 p-6">

//             {/* SESSION */}

//             <div>

//               <label className="mb-2 block text-sm font-semibold text-gray-700">
//                 Academic Session *
//               </label>

//               <select
//                 name="sessionId"
//                 value={
//                   formData.sessionId
//                 }
//                 onChange={
//                   onChange
//                 }
//                 disabled={
//                   disableSession
//                 }
//                 className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-blue-600 disabled:bg-gray-100"
//               >

//                 <option value="">
//                   Select Academic Session
//                 </option>

//                 {sessions.map(
//                   (session) => (
//                     <option
//                       key={
//                         session._id
//                       }
//                       value={
//                         session._id
//                       }
//                     >
//                       {session.name}
//                       {session.isCurrent
//                         ? " (Current)"
//                         : ""}
//                     </option>
//                   )
//                 )}

//               </select>

//             </div>


//             <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

//               {/* NAME */}

//               <div>

//                 <label className="mb-2 block text-sm font-semibold text-gray-700">
//                   Subject Name *
//                 </label>

//                 <input
//                   type="text"
//                   name="name"
//                   value={
//                     formData.name
//                   }
//                   onChange={
//                     onChange
//                   }
//                   placeholder="Example: Mathematics"
//                   className="min-h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-600"
//                 />

//               </div>


//               {/* CODE */}

//               <div>

//                 <label className="mb-2 block text-sm font-semibold text-gray-700">
//                   Subject Code *
//                 </label>

//                 <input
//                   type="text"
//                   name="code"
//                   value={
//                     formData.code
//                   }
//                   onChange={
//                     onChange
//                   }
//                   placeholder="Example: MTH-101"
//                   className="min-h-11 w-full rounded-lg border border-gray-300 px-3 text-sm uppercase outline-none focus:border-blue-600"
//                 />

//               </div>

//             </div>


//             {/* TYPE */}

//             <div>

//               <label className="mb-2 block text-sm font-semibold text-gray-700">
//                 Subject Type *
//               </label>

//               <select
//                 name="subjectType"
//                 value={
//                   formData.subjectType
//                 }
//                 onChange={
//                   onChange
//                 }
//                 className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-blue-600"
//               >

//                 {SUBJECT_TYPES.map(
//                   (type) => (
//                     <option
//                       key={
//                         type.value
//                       }
//                       value={
//                         type.value
//                       }
//                     >
//                       {type.label}
//                     </option>
//                   )
//                 )}

//               </select>

//             </div>


//             {/* DESCRIPTION */}

//             <div>

//               <label className="mb-2 block text-sm font-semibold text-gray-700">
//                 Description
//               </label>

//               <textarea
//                 name="description"
//                 value={
//                   formData.description
//                 }
//                 onChange={
//                   onChange
//                 }
//                 rows={4}
//                 placeholder="Brief description of the subject..."
//                 className="w-full resize-none rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-blue-600"
//               />

//             </div>


//             {/* FUTURE INFO */}

//             <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">

//               <div className="flex gap-3">

//                 <Icon
//                   icon="lucide:info"
//                   className="mt-0.5 shrink-0 text-xl text-blue-600"
//                 />

//                 <div>

//                   <p className="text-sm font-semibold text-blue-900">
//                     Class, Section & Teacher Assignment
//                   </p>

//                   <p className="mt-1 text-xs leading-5 text-blue-700">
//                     Class, section, teacher and weekly periods will be configured after the Teacher and Subject Assignment modules are completed.
//                   </p>

//                 </div>

//               </div>

//             </div>

//           </div>


//           {/* BUTTONS */}

//           <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">

//             <button
//               type="button"
//               onClick={
//                 onClose
//               }
//               className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
//             >
//               Cancel
//             </button>


//             <button
//               type="submit"
//               disabled={
//                 submitting
//               }
//               className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
//             >

//               {submitting && (
//                 <Icon
//                   icon="lucide:loader-2"
//                   className="animate-spin"
//                 />
//               )}

//               {submitLabel}

//             </button>

//           </div>

//         </form>

//       </div>

//     </div>
//   );
// };


// // ============================================
// // SUBJECT DETAILS MODAL
// // ============================================

// interface SubjectDetailsModalProps {
//   subject:
//     SubjectData;

//   sessionName:
//     string;

//   onClose:
//     () => void;
// }


// const SubjectDetailsModal = ({
//   subject,
//   sessionName,
//   onClose,
// }: SubjectDetailsModalProps) => {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

//       <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">

//         <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">

//           <div>

//             <h2 className="text-xl font-bold text-gray-900">
//               Subject Details
//             </h2>

//             <p className="mt-1 text-sm text-gray-500">
//               Subject catalogue information
//             </p>

//           </div>


//           <button
//             onClick={
//               onClose
//             }
//           >
//             <Icon
//               icon="lucide:x"
//               className="text-xl text-gray-500"
//             />
//           </button>

//         </div>


//         <div className="p-6">

//           <div className="mb-6 rounded-xl bg-gray-50 p-5">

//             <div className="flex items-start justify-between">

//               <div>

//                 <h3 className="text-2xl font-bold text-gray-900">
//                   {subject.name}
//                 </h3>

//                 <p className="mt-1 font-mono text-sm text-gray-500">
//                   {subject.code}
//                 </p>

//               </div>


//               <span
//                 className={`rounded-full px-3 py-1 text-xs font-semibold ${
//                   subject.isActive
//                     ? "bg-green-100 text-green-700"
//                     : "bg-gray-200 text-gray-600"
//                 }`}
//               >
//                 {subject.isActive
//                   ? "Active"
//                   : "Inactive"}
//               </span>

//             </div>

//           </div>


//           <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

//             <DetailItem
//               label="Subject Type"
//               value={getTypeLabel(
//                 subject.subjectType
//               )}
//             />


//             <DetailItem
//               label="Academic Session"
//               value={
//                 sessionName
//               }
//             />


//             <DetailItem
//               label="Created"
//               value={new Date(
//                 subject.createdAt
//               ).toLocaleDateString(
//                 "en-IN"
//               )}
//             />


//             <DetailItem
//               label="Updated"
//               value={new Date(
//                 subject.updatedAt
//               ).toLocaleDateString(
//                 "en-IN"
//               )}
//             />

//           </div>


//           {subject.description && (
//             <div className="mt-6">

//               <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
//                 Description
//               </p>

//               <p className="mt-2 text-sm leading-6 text-gray-700">
//                 {subject.description}
//               </p>

//             </div>
//           )}

//         </div>


//         <div className="flex justify-end border-t border-gray-200 px-6 py-4">

//           <button
//             onClick={
//               onClose
//             }
//             className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white"
//           >
//             Close
//           </button>

//         </div>

//       </div>

//     </div>
//   );
// };


// // ============================================
// // SUBJECT TYPE BADGE
// // ============================================

// const SubjectTypeBadge = ({
//   type,
// }: {
//   type: SubjectType;
// }) => {
//   const styles:
//     Record<
//       SubjectType,
//       string
//     > = {
//       CORE:
//         "bg-blue-100 text-blue-700",

//       LANGUAGE:
//         "bg-purple-100 text-purple-700",

//       PRACTICAL:
//         "bg-orange-100 text-orange-700",

//       ELECTIVE:
//         "bg-cyan-100 text-cyan-700",
//     };


//   return (
//     <span
//       className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[type]}`}
//     >
//       {getTypeLabel(
//         type
//       )}
//     </span>
//   );
// };


// // ============================================
// // GET TYPE LABEL
// // ============================================

// const getTypeLabel = (
//   type: SubjectType
// ) => {
//   switch (type) {
//     case "CORE":
//       return "Core";

//     case "LANGUAGE":
//       return "Language";

//     case "PRACTICAL":
//       return "Practical";

//     case "ELECTIVE":
//       return "Elective";

//     default:
//       return type;
//   }
// };


// // ============================================
// // DETAIL ITEM
// // ============================================

// interface DetailItemProps {
//   label: string;
//   value: string;
// }


// const DetailItem = ({
//   label,
//   value,
// }: DetailItemProps) => {
//   return (
//     <div>

//       <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
//         {label}
//       </p>

//       <p className="mt-1 font-semibold text-gray-900">
//         {value}
//       </p>

//     </div>
//   );
// };


// export default Subjects;





import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Icon } from "@iconify/react";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../../app/hooks";

import {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  updateSubjectStatus,
  clearSubjectError,
  clearSelectedSubject,
} from "../../../../features/academic/subjects/subject.slice";

import {
  getSessions,
} from "../../../../features/academic/sessions/session.slice";

import {
  getSubjectAssignments,
} from "../../../../features/academic/subjectAssignments/subjectAssignment.slice";

import type {
  CreateSubjectPayload,
  UpdateSubjectPayload,
  SubjectData,
  SubjectType,
} from "../../../../features/academic/subjects/subject.types";

import type {
  SubjectAssignmentData,
} from "../../../../features/academic/subjectAssignments/subjectAssignment.types";


// ============================================
// TYPES
// ============================================

interface SubjectFormState {
  sessionId: string;
  name: string;
  code: string;
  description: string;
  subjectType: SubjectType;
}

interface SubjectAssignmentSummary {
  classes: string[];
  sections: string[];
  teachers: string[];
  weeklyPeriods: number;
  activeAssignments: number;
  totalAssignments: number;
}


// ============================================
// INITIAL FORM
// ============================================

const initialFormState: SubjectFormState = {
  sessionId: "",
  name: "",
  code: "",
  description: "",
  subjectType: "CORE",
};


// ============================================
// SUBJECT TYPE OPTIONS
// ============================================

const SUBJECT_TYPES: {
  value: SubjectType;
  label: string;
}[] = [
  {
    value: "CORE",
    label: "Core",
  },
  {
    value: "LANGUAGE",
    label: "Language",
  },
  {
    value: "PRACTICAL",
    label: "Practical",
  },
  {
    value: "ELECTIVE",
    label: "Elective",
  },
];


// ============================================
// HELPERS
// ============================================

const getRelationId = (
  value:
    | string
    | {
        _id: string;
      }
): string => {
  return typeof value === "string"
    ? value
    : value._id;
};


const getRelationName = (
  value:
    | string
    | {
        name?: string;
      }
): string => {
  if (
    typeof value === "string"
  ) {
    return "";
  }

  return value.name || "";
};


const uniqueValues = (
  values: string[]
): string[] => {
  return [
    ...new Set(
      values.filter(Boolean)
    ),
  ];
};


// ============================================
// STAT CARD
// ============================================

interface StatCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: string;
}


const StatCard = ({
  title,
  value,
  subtext,
  icon,
}: StatCardProps) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <Icon
            icon={icon}
            className="text-xl"
          />
        </div>

      </div>

      <p className="mt-3 text-xs text-gray-500">
        {subtext}
      </p>

    </div>
  );
};


// ============================================
// MAIN SUBJECTS PAGE
// ============================================

const Subjects = () => {
  const dispatch =
    useAppDispatch();


  // ============================================
  // REDUX
  // ============================================

  const {
    subjects,
    selectedSubject,
    loading,
    error,
  } = useAppSelector(
    (state) =>
      state.subjects
  );


  const {
    sessions,
  } = useAppSelector(
    (state) =>
      state.sessions
  );


  const {
    assignments,
  } = useAppSelector(
    (state) =>
      state.subjectAssignments
  );


  // ============================================
  // FILTER STATE
  // ============================================

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");


  const [
    sessionFilter,
    setSessionFilter,
  ] = useState("ALL");


  const [
    typeFilter,
    setTypeFilter,
  ] = useState<
    SubjectType | "ALL"
  >("ALL");


  const [
    statusFilter,
    setStatusFilter,
  ] = useState<
    "ALL" |
    "ACTIVE" |
    "INACTIVE"
  >("ALL");


  // ============================================
  // PAGINATION
  // ============================================

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);


  const itemsPerPage =
    6;


  // ============================================
  // MODALS
  // ============================================

  const [
    showCreateModal,
    setShowCreateModal,
  ] = useState(false);


  const [
    showEditModal,
    setShowEditModal,
  ] = useState(false);


  const [
    showDetailsModal,
    setShowDetailsModal,
  ] = useState(false);


  // ============================================
  // FORM
  // ============================================

  const [
    formData,
    setFormData,
  ] =
    useState<SubjectFormState>(
      initialFormState
    );


  // ============================================
  // ACTION STATE
  // ============================================

  const [
    submitting,
    setSubmitting,
  ] = useState(false);


  const [
    statusActionId,
    setStatusActionId,
  ] =
    useState<
      string | null
    >(null);


  const [
    activeMenu,
    setActiveMenu,
  ] =
    useState<
      string | null
    >(null);


  const [
    toastMessage,
    setToastMessage,
  ] =
    useState<
      string | null
    >(null);


  // ============================================
  // INITIAL LOAD
  // ============================================

  useEffect(() => {
    dispatch(
      getSubjects(
        undefined
      )
    );

    dispatch(
      getSessions()
    );

    dispatch(
      getSubjectAssignments(
        undefined
      )
    );
  }, [
    dispatch,
  ]);


  // ============================================
  // CLEANUP
  // ============================================

  useEffect(() => {
    return () => {
      dispatch(
        clearSubjectError()
      );

      dispatch(
        clearSelectedSubject()
      );
    };
  }, [
    dispatch,
  ]);


  // ============================================
  // ERROR TOAST
  // ============================================

  useEffect(() => {
    if (error) {
      showToast(
        error
      );
    }
  }, [
    error,
  ]);


  // ============================================
  // TOAST
  // ============================================

  const showToast = (
    message: string
  ) => {
    setToastMessage(
      message
    );

    window.setTimeout(
      () => {
        setToastMessage(
          null
        );
      },
      3000
    );
  };


  // ============================================
  // SESSION NAME
  // ============================================

  const getSessionName = (
    sessionId: string
  ) => {
    const session =
      sessions.find(
        (item) =>
          item._id ===
          sessionId
      );

    return (
      session?.name ||
      "-"
    );
  };


  // ============================================
  // ASSIGNMENT DATA
  // ============================================

  const getAssignmentsForSubject = (
    subjectId: string
  ): SubjectAssignmentData[] => {
    return assignments.filter(
      (assignment) =>
        getRelationId(
          assignment.subjectId
        ) === subjectId
    );
  };


  const getAssignmentSummary = (
    subjectId: string
  ): SubjectAssignmentSummary => {
    const subjectAssignments =
      getAssignmentsForSubject(
        subjectId
      );

    const classes =
      uniqueValues(
        subjectAssignments.map(
          (assignment) =>
            getRelationName(
              assignment.classId
            )
        )
      );

    const sections =
      uniqueValues(
        subjectAssignments.map(
          (assignment) =>
            getRelationName(
              assignment.sectionId
            )
        )
      );

    const teachers =
      uniqueValues(
        subjectAssignments.map(
          (assignment) =>
            getRelationName(
              assignment.teacherId
            )
        )
      );

    const weeklyPeriods =
      subjectAssignments.reduce(
        (
          total,
          assignment
        ) =>
          total +
          assignment.weeklyPeriods,
        0
      );

    const activeAssignments =
      subjectAssignments.filter(
        (assignment) =>
          assignment.isActive
      ).length;

    return {
      classes,
      sections,
      teachers,
      weeklyPeriods,
      activeAssignments,
      totalAssignments:
        subjectAssignments.length,
    };
  };


  // ============================================
  // SUBJECT TYPE LABEL
  // ============================================

  const getSubjectTypeLabel = (
    subjectType: SubjectType
  ) => {
    return (
      SUBJECT_TYPES.find(
        (item) =>
          item.value ===
          subjectType
      )?.label ||
      subjectType
    );
  };


  // ============================================
  // FORM CHANGE
  // ============================================

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const {
      name,
      value,
    } = e.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]:
          value,
      })
    );
  };


  // ============================================
  // OPEN CREATE MODAL
  // ============================================

  const openCreateModal =
    () => {
      const currentSession =
        sessions.find(
          (session) =>
            session.isCurrent
        );

      setFormData({
        ...initialFormState,
        sessionId:
          currentSession?._id ||
          sessions[0]?._id ||
          "",
      });

      dispatch(
        clearSubjectError()
      );

      setShowCreateModal(
        true
      );
    };


  const closeCreateModal =
    () => {
      setShowCreateModal(
        false
      );

      setFormData(
        initialFormState
      );
    };


  // ============================================
  // CREATE SUBJECT
  // POST /academic/subjects
  // ============================================

  const handleCreateSubject =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      if (
        !formData.sessionId
      ) {
        showToast(
          "Academic session is required"
        );

        return;
      }

      if (
        !formData.name.trim()
      ) {
        showToast(
          "Subject name is required"
        );

        return;
      }

      if (
        !formData.code.trim()
      ) {
        showToast(
          "Subject code is required"
        );

        return;
      }

      const payload:
        CreateSubjectPayload =
        {
          sessionId:
            formData.sessionId,

          name:
            formData.name.trim(),

          code:
            formData.code
              .trim()
              .toUpperCase(),

          subjectType:
            formData.subjectType,

          ...(formData.description
            .trim()
            ? {
                description:
                  formData.description.trim(),
              }
            : {}),
        };

      try {
        setSubmitting(
          true
        );

        await dispatch(
          createSubject(
            payload
          )
        ).unwrap();

        showToast(
          "Subject created successfully"
        );

        closeCreateModal();

        await dispatch(
          getSubjects(
            undefined
          )
        ).unwrap();

      } catch (err) {
        showToast(
          typeof err ===
            "string"
            ? err
            : "Failed to create subject"
        );

      } finally {
        setSubmitting(
          false
        );
      }
    };


  // ============================================
  // VIEW SUBJECT
  // GET /academic/subjects/:subjectId
  // ============================================

  const handleViewSubject =
    async (
      subjectId: string
    ) => {
      try {
        setActiveMenu(
          null
        );

        dispatch(
          clearSelectedSubject()
        );

        await dispatch(
          getSubjectById(
            subjectId
          )
        ).unwrap();

        setShowDetailsModal(
          true
        );

      } catch (err) {
        showToast(
          typeof err ===
            "string"
            ? err
            : "Failed to fetch subject"
        );
      }
    };


  const closeDetailsModal =
    () => {
      setShowDetailsModal(
        false
      );

      dispatch(
        clearSelectedSubject()
      );
    };


  // ============================================
  // OPEN EDIT
  // GET /academic/subjects/:subjectId
  // ============================================

  const handleOpenEdit =
    async (
      subjectId: string
    ) => {
      try {
        setActiveMenu(
          null
        );

        dispatch(
          clearSelectedSubject()
        );

        const subject =
          await dispatch(
            getSubjectById(
              subjectId
            )
          ).unwrap();

        setFormData({
          sessionId:
            subject.sessionId,

          name:
            subject.name,

          code:
            subject.code,

          description:
            subject.description ||
            "",

          subjectType:
            subject.subjectType,
        });

        setShowEditModal(
          true
        );

      } catch (err) {
        showToast(
          typeof err ===
            "string"
            ? err
            : "Failed to fetch subject"
        );
      }
    };


  const closeEditModal =
    () => {
      setShowEditModal(
        false
      );

      setFormData(
        initialFormState
      );

      dispatch(
        clearSelectedSubject()
      );
    };


  // ============================================
  // UPDATE SUBJECT
  // PUT /academic/subjects/:subjectId
  // ============================================

  const handleUpdateSubject =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      if (
        !selectedSubject?._id
      ) {
        showToast(
          "Subject not selected"
        );

        return;
      }

      if (
        !formData.name.trim()
      ) {
        showToast(
          "Subject name is required"
        );

        return;
      }

      if (
        !formData.code.trim()
      ) {
        showToast(
          "Subject code is required"
        );

        return;
      }

      const data:
        UpdateSubjectPayload =
        {
          name:
            formData.name.trim(),

          code:
            formData.code
              .trim()
              .toUpperCase(),

          description:
            formData.description.trim(),

          subjectType:
            formData.subjectType,
        };

      try {
        setSubmitting(
          true
        );

        await dispatch(
          updateSubject({
            subjectId:
              selectedSubject._id,
            data,
          })
        ).unwrap();

        showToast(
          "Subject updated successfully"
        );

        closeEditModal();

        await dispatch(
          getSubjects(
            undefined
          )
        ).unwrap();

      } catch (err) {
        showToast(
          typeof err ===
            "string"
            ? err
            : "Failed to update subject"
        );

      } finally {
        setSubmitting(
          false
        );
      }
    };


  // ============================================
  // STATUS
  // PATCH /academic/subjects/:subjectId/status
  // ============================================

  const handleToggleStatus =
    async (
      subject: SubjectData
    ) => {
      try {
        setActiveMenu(
          null
        );

        setStatusActionId(
          subject._id
        );

        await dispatch(
          updateSubjectStatus({
            subjectId:
              subject._id,

            isActive:
              !subject.isActive,
          })
        ).unwrap();

        showToast(
          subject.isActive
            ? "Subject marked inactive"
            : "Subject marked active"
        );

      } catch (err) {
        showToast(
          typeof err ===
            "string"
            ? err
            : "Failed to update subject status"
        );

      } finally {
        setStatusActionId(
          null
        );
      }
    };


  // ============================================
  // FILTER SUBJECTS
  // ============================================

  const filteredSubjects =
    useMemo(() => {
      const search =
        searchQuery
          .trim()
          .toLowerCase();

      return subjects.filter(
        (subject) => {
          const summary =
            getAssignmentSummary(
              subject._id
            );

          const assignmentSearchText =
            [
              ...summary.classes,
              ...summary.sections,
              ...summary.teachers,
            ]
              .join(" ")
              .toLowerCase();

          const matchesSearch =
            subject.name
              .toLowerCase()
              .includes(
                search
              ) ||
            subject.code
              .toLowerCase()
              .includes(
                search
              ) ||
            (
              subject.description ||
              ""
            )
              .toLowerCase()
              .includes(
                search
              ) ||
            assignmentSearchText.includes(
              search
            );

          const matchesSession =
            sessionFilter ===
              "ALL" ||
            subject.sessionId ===
              sessionFilter;

          const matchesType =
            typeFilter ===
              "ALL" ||
            subject.subjectType ===
              typeFilter;

          const matchesStatus =
            statusFilter ===
              "ALL" ||
            (
              statusFilter ===
                "ACTIVE" &&
              subject.isActive
            ) ||
            (
              statusFilter ===
                "INACTIVE" &&
              !subject.isActive
            );

          return (
            matchesSearch &&
            matchesSession &&
            matchesType &&
            matchesStatus
          );
        }
      );
    }, [
      subjects,
      assignments,
      searchQuery,
      sessionFilter,
      typeFilter,
      statusFilter,
    ]);


  // ============================================
  // PAGINATION
  // ============================================

  const totalPages =
    Math.ceil(
      filteredSubjects.length /
        itemsPerPage
    );


  const paginatedSubjects =
    filteredSubjects.slice(
      (currentPage - 1) *
        itemsPerPage,

      currentPage *
        itemsPerPage
    );


  useEffect(() => {
    setCurrentPage(
      1
    );
  }, [
    searchQuery,
    sessionFilter,
    typeFilter,
    statusFilter,
  ]);


  // ============================================
  // STATS
  // ============================================

  const totalSubjects =
    subjects.length;


  const activeSubjects =
    subjects.filter(
      (subject) =>
        subject.isActive
    ).length;


  const assignedSubjects =
    subjects.filter(
      (subject) =>
        getAssignmentsForSubject(
          subject._id
        ).length >
        0
    ).length;


  const totalWeeklyPeriods =
    assignments.reduce(
      (
        total,
        assignment
      ) =>
        total +
        (
          assignment.isActive
            ? assignment.weeklyPeriods
            : 0
        ),
      0
    );


  // ============================================
  // RESET FILTERS
  // ============================================

  const resetFilters =
    () => {
      setSearchQuery(
        ""
      );

      setSessionFilter(
        "ALL"
      );

      setTypeFilter(
        "ALL"
      );

      setStatusFilter(
        "ALL"
      );

      setCurrentPage(
        1
      );
    };


  // ============================================
  // EXPORT CSV
  // ============================================

  const handleExport =
    () => {
      if (
        filteredSubjects.length ===
        0
      ) {
        showToast(
          "No subjects to export"
        );

        return;
      }

      const headers = [
        "Subject Name",
        "Subject Code",
        "Subject Type",
        "Academic Session",
        "Classes",
        "Sections",
        "Assigned Teachers",
        "Weekly Periods",
        "Status",
      ];

      const rows =
        filteredSubjects.map(
          (subject) => {
            const summary =
              getAssignmentSummary(
                subject._id
              );

            return [
              subject.name,
              subject.code,
              getSubjectTypeLabel(
                subject.subjectType
              ),
              getSessionName(
                subject.sessionId
              ),
              summary.classes.join(
                ", "
              ),
              summary.sections.join(
                ", "
              ),
              summary.teachers.join(
                ", "
              ),
              summary.weeklyPeriods,
              subject.isActive
                ? "Active"
                : "Inactive",
            ];
          }
        );

      const csv =
        [
          headers,
          ...rows,
        ]
          .map(
            (row) =>
              row
                .map(
                  (item) =>
                    `"${String(
                      item
                    ).replace(
                      /"/g,
                      '""'
                    )}"`
                )
                .join(",")
          )
          .join("\n");

      const blob =
        new Blob(
          [
            csv,
          ],
          {
            type:
              "text/csv;charset=utf-8;",
          }
        );

      const url =
        URL.createObjectURL(
          blob
        );

      const link =
        document.createElement(
          "a"
        );

      link.href =
        url;

      link.download =
        "subjects.csv";

      link.click();

      URL.revokeObjectURL(
        url
      );
    };


  // ============================================
  // LOADING
  // ============================================

  if (
    loading &&
    subjects.length ===
      0
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">

        <div className="text-center">

          <Icon
            icon="lucide:loader-2"
            className="mx-auto animate-spin text-4xl text-blue-600"
          />

          <p className="mt-3 text-sm text-gray-500">
            Loading subjects...
          </p>

        </div>

      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 p-5 lg:p-8">

      {/* ========================================
          TOAST
      ======================================== */}

      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[100] flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-white shadow-xl">

          <Icon
            icon="lucide:info"
            className="text-lg text-green-400"
          />

          <span className="text-sm font-medium">
            {toastMessage}
          </span>

        </div>
      )}


      {/* ========================================
          HEADER
      ======================================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

        <div>

          <div className="flex items-center gap-2 text-sm text-gray-500">

            <span>
              Academics
            </span>

            <Icon
              icon="lucide:chevron-right"
            />

            <span className="font-semibold text-gray-900">
              Subjects
            </span>

          </div>


          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Subjects
          </h1>


          <p className="mt-1 text-sm text-gray-500">
            Manage subjects and view their class, section and teacher assignments.
          </p>

        </div>


        <button
          onClick={
            openCreateModal
          }
          disabled={
            sessions.length ===
            0
          }
          className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >

          <Icon
            icon="lucide:plus"
            className="text-lg"
          />

          Add Subject

        </button>

      </div>


      {/* NO SESSION */}

      {sessions.length ===
        0 && (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          Create an Academic Session before creating subjects.
        </div>
      )}


      {/* ERROR */}

      {error && (
        <div className="mt-5 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

          <span>
            {error}
          </span>

          <button
            onClick={() =>
              dispatch(
                clearSubjectError()
              )
            }
          >
            <Icon
              icon="lucide:x"
            />
          </button>

        </div>
      )}


      {/* ========================================
          STATS
      ======================================== */}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Subjects"
          value={
            totalSubjects
          }
          subtext="Subjects in catalogue"
          icon="lucide:book-open"
        />


        <StatCard
          title="Active Subjects"
          value={
            activeSubjects
          }
          subtext="Currently active"
          icon="lucide:circle-check"
        />


        <StatCard
          title="Assigned Subjects"
          value={
            assignedSubjects
          }
          subtext="Subjects with at least one assignment"
          icon="lucide:book-user"
        />


        <StatCard
          title="Weekly Periods"
          value={
            totalWeeklyPeriods
          }
          subtext="Total active assigned periods"
          icon="lucide:calendar-days"
        />

      </div>


      {/* ========================================
          TABLE CARD
      ======================================== */}

      <section className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        {/* FILTERS */}

        <div className="border-b border-gray-200 p-5">

          <div className="flex flex-col gap-3 xl:flex-row">

            <div className="relative flex-1">

              <Icon
                icon="lucide:search"
                className="absolute left-3 top-3.5 text-gray-400"
              />

              <input
                type="text"
                value={
                  searchQuery
                }
                onChange={(e) =>
                  setSearchQuery(
                    e.target.value
                  )
                }
                placeholder="Search subject, class, section or teacher..."
                className="min-h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-blue-600"
              />

            </div>


            <select
              value={
                sessionFilter
              }
              onChange={(e) =>
                setSessionFilter(
                  e.target.value
                )
              }
              className="min-h-11 rounded-lg border border-gray-300 bg-white px-4 text-sm outline-none focus:border-blue-600"
            >

              <option value="ALL">
                All Academic Sessions
              </option>

              {sessions.map(
                (session) => (
                  <option
                    key={
                      session._id
                    }
                    value={
                      session._id
                    }
                  >
                    {session.name}
                    {session.isCurrent
                      ? " (Current)"
                      : ""}
                  </option>
                )
              )}

            </select>


            <select
              value={
                typeFilter
              }
              onChange={(e) =>
                setTypeFilter(
                  e.target.value as
                    | SubjectType
                    | "ALL"
                )
              }
              className="min-h-11 rounded-lg border border-gray-300 bg-white px-4 text-sm"
            >

              <option value="ALL">
                All Subject Types
              </option>

              {SUBJECT_TYPES.map(
                (item) => (
                  <option
                    key={
                      item.value
                    }
                    value={
                      item.value
                    }
                  >
                    {item.label}
                  </option>
                )
              )}

            </select>


            <select
              value={
                statusFilter
              }
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as
                    | "ALL"
                    | "ACTIVE"
                    | "INACTIVE"
                )
              }
              className="min-h-11 rounded-lg border border-gray-300 bg-white px-4 text-sm"
            >

              <option value="ALL">
                All Status
              </option>

              <option value="ACTIVE">
                Active
              </option>

              <option value="INACTIVE">
                Inactive
              </option>

            </select>


            <button
              onClick={
                resetFilters
              }
              className="min-h-11 rounded-lg border border-gray-300 px-4 text-sm font-medium hover:bg-gray-50"
            >
              Reset
            </button>


            <button
              onClick={
                handleExport
              }
              className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 text-sm font-medium hover:bg-gray-50"
            >
              <Icon
                icon="lucide:download"
              />

              Export
            </button>

          </div>

        </div>


        {/* ========================================
            TABLE
        ======================================== */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1250px] text-left text-sm">

            <thead className="bg-gray-50 text-xs uppercase text-gray-500">

              <tr>

                <th className="px-5 py-4 font-semibold">
                  Subject Name
                </th>

                <th className="px-5 py-4 font-semibold">
                  Subject Code
                </th>

                <th className="px-5 py-4 font-semibold">
                  Subject Type
                </th>

                <th className="px-5 py-4 font-semibold">
                  Classes
                </th>

                <th className="px-5 py-4 font-semibold">
                  Sections
                </th>

                <th className="px-5 py-4 font-semibold">
                  Assigned Teacher
                </th>

                <th className="px-5 py-4 font-semibold">
                  Weekly Periods
                </th>

                <th className="px-5 py-4 font-semibold">
                  Status
                </th>

                <th className="px-5 py-4 text-right font-semibold">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-gray-200">

              {paginatedSubjects.map(
                (subject) => {
                  const summary =
                    getAssignmentSummary(
                      subject._id
                    );

                  return (
                    <tr
                      key={
                        subject._id
                      }
                      className="transition hover:bg-gray-50"
                    >

                      {/* SUBJECT */}

                      <td className="px-5 py-4">

                        <button
                          onClick={() =>
                            handleViewSubject(
                              subject._id
                            )
                          }
                          className="font-semibold text-blue-600 hover:underline"
                        >
                          {subject.name}
                        </button>

                        {subject.description && (
                          <p className="mt-1 max-w-xs truncate text-xs text-gray-500">
                            {subject.description}
                          </p>
                        )}

                        <p className="mt-1 text-xs text-gray-400">
                          {getSessionName(
                            subject.sessionId
                          )}
                        </p>

                      </td>


                      {/* CODE */}

                      <td className="px-5 py-4 font-mono text-xs text-gray-600">
                        {subject.code}
                      </td>


                      {/* TYPE */}

                      <td className="px-5 py-4">

                        <SubjectTypeBadge
                          type={
                            subject.subjectType
                          }
                        />

                      </td>


                      {/* CLASSES */}

                      <td className="px-5 py-4">

                        <TagList
                          values={
                            summary.classes
                          }
                          emptyText="Not assigned"
                        />

                      </td>


                      {/* SECTIONS */}

                      <td className="px-5 py-4">

                        <TagList
                          values={
                            summary.sections
                          }
                          emptyText="Not assigned"
                        />

                      </td>


                      {/* TEACHERS */}

                      <td className="px-5 py-4">

                        {summary.teachers.length >
                        0 ? (
                          <div className="space-y-1">

                            {summary.teachers.map(
                              (teacherName) => (
                                <div
                                  key={
                                    teacherName
                                  }
                                  className="flex items-center gap-2"
                                >
                                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                                    {teacherName
                                      .charAt(0)
                                      .toUpperCase()}
                                  </div>

                                  <span className="font-medium text-gray-700">
                                    {teacherName}
                                  </span>
                                </div>
                              )
                            )}

                          </div>
                        ) : (
                          <span className="text-sm italic text-gray-400">
                            Unassigned
                          </span>
                        )}

                      </td>


                      {/* PERIODS */}

                      <td className="px-5 py-4">

                        {summary.weeklyPeriods >
                        0 ? (
                          <div>

                            <span className="font-semibold text-gray-900">
                              {summary.weeklyPeriods}
                            </span>

                            <span className="ml-1 text-xs text-gray-500">
                              periods
                            </span>

                            <p className="mt-1 text-xs text-gray-400">
                              {summary.activeAssignments}/
                              {summary.totalAssignments}
                              {" active assignments"}
                            </p>

                          </div>
                        ) : (
                          <span className="text-gray-400">
                            -
                          </span>
                        )}

                      </td>


                      {/* STATUS */}

                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            subject.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {subject.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>

                      </td>


                      {/* ACTIONS */}

                      <td className="relative px-5 py-4 text-right">

                        <div className="flex justify-end gap-1">

                          <button
                            onClick={() =>
                              handleViewSubject(
                                subject._id
                              )
                            }
                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                            title="View"
                          >
                            <Icon
                              icon="lucide:eye"
                            />
                          </button>


                          <button
                            onClick={() =>
                              handleOpenEdit(
                                subject._id
                              )
                            }
                            className="rounded-lg p-2 text-amber-600 hover:bg-amber-50"
                            title="Edit"
                          >
                            <Icon
                              icon="lucide:pencil"
                            />
                          </button>


                          <div className="relative">

                            <button
                              onClick={() =>
                                setActiveMenu(
                                  activeMenu ===
                                    subject._id
                                    ? null
                                    : subject._id
                                )
                              }
                              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                            >
                              <Icon
                                icon="lucide:ellipsis-vertical"
                              />
                            </button>


                            {activeMenu ===
                              subject._id && (
                              <div className="absolute right-0 top-10 z-50 w-48 rounded-lg border border-gray-200 bg-white py-1 text-left shadow-xl">

                                <button
                                  onClick={() =>
                                    handleToggleStatus(
                                      subject
                                    )
                                  }
                                  disabled={
                                    statusActionId ===
                                    subject._id
                                  }
                                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                >

                                  <Icon
                                    icon={
                                      subject.isActive
                                        ? "lucide:circle-off"
                                        : "lucide:circle-check"
                                    }
                                  />

                                  {statusActionId ===
                                  subject._id
                                    ? "Updating..."
                                    : subject.isActive
                                      ? "Make Inactive"
                                      : "Make Active"}

                                </button>

                              </div>
                            )}

                          </div>

                        </div>

                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>


          {/* EMPTY */}

          {paginatedSubjects.length ===
            0 && (
            <div className="p-12 text-center">

              <Icon
                icon="lucide:book-x"
                className="mx-auto text-4xl text-gray-400"
              />

              <h3 className="mt-3 font-semibold text-gray-900">
                No subjects found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Change filters or create a new subject.
              </p>

            </div>
          )}

        </div>


        {/* ========================================
            PAGINATION
        ======================================== */}

        <div className="flex flex-col gap-3 border-t border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-gray-500">

            Showing{" "}

            {filteredSubjects.length ===
            0
              ? 0
              : (currentPage -
                  1) *
                  itemsPerPage +
                1}

            {" - "}

            {Math.min(
              currentPage *
                itemsPerPage,
              filteredSubjects.length
            )}

            {" of "}

            {filteredSubjects.length}

            {" subjects"}

          </p>


          <div className="flex gap-2">

            <button
              disabled={
                currentPage ===
                1
              }
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    page - 1
                )
              }
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-50"
            >
              Previous
            </button>


            {Array.from(
              {
                length:
                  totalPages,
              },
              (
                _,
                index
              ) =>
                index + 1
            ).map(
              (page) => (
                <button
                  key={
                    page
                  }
                  onClick={() =>
                    setCurrentPage(
                      page
                    )
                  }
                  className={`h-10 w-10 rounded-lg text-sm font-semibold ${
                    currentPage ===
                    page
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 bg-white text-gray-700"
                  }`}
                >
                  {page}
                </button>
              )
            )}


            <button
              disabled={
                totalPages ===
                  0 ||
                currentPage ===
                  totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    page + 1
                )
              }
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-50"
            >
              Next
            </button>

          </div>

        </div>

      </section>


      {/* ========================================
          CREATE MODAL
      ======================================== */}

      {showCreateModal && (
        <SubjectFormModal
          title="Add Subject"
          submitLabel="Create Subject"
          formData={
            formData
          }
          sessions={
            sessions
          }
          submitting={
            submitting
          }
          disableSession={
            false
          }
          onChange={
            handleInputChange
          }
          onClose={
            closeCreateModal
          }
          onSubmit={
            handleCreateSubject
          }
        />
      )}


      {/* ========================================
          EDIT MODAL
      ======================================== */}

      {showEditModal && (
        <SubjectFormModal
          title="Edit Subject"
          submitLabel="Save Changes"
          formData={
            formData
          }
          sessions={
            sessions
          }
          submitting={
            submitting
          }
          disableSession={
            true
          }
          onChange={
            handleInputChange
          }
          onClose={
            closeEditModal
          }
          onSubmit={
            handleUpdateSubject
          }
        />
      )}


      {/* ========================================
          DETAILS MODAL
      ======================================== */}

      {showDetailsModal &&
        selectedSubject && (
          <SubjectDetailsModal
            subject={
              selectedSubject
            }
            sessionName={
              getSessionName(
                selectedSubject.sessionId
              )
            }
            assignmentSummary={
              getAssignmentSummary(
                selectedSubject._id
              )
            }
            assignments={
              getAssignmentsForSubject(
                selectedSubject._id
              )
            }
            onClose={
              closeDetailsModal
            }
          />
        )}

    </div>
  );
};


// ============================================
// TAG LIST
// ============================================

const TagList = ({
  values,
  emptyText,
}: {
  values: string[];
  emptyText: string;
}) => {
  if (
    values.length ===
    0
  ) {
    return (
      <span className="text-sm italic text-gray-400">
        {emptyText}
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-1">

      {values.map(
        (value) => (
          <span
            key={
              value
            }
            className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700"
          >
            {value}
          </span>
        )
      )}

    </div>
  );
};


// ============================================
// SUBJECT FORM MODAL
// ============================================

interface SubjectFormModalProps {
  title: string;
  submitLabel: string;
  formData: SubjectFormState;

  sessions: {
    _id: string;
    name: string;
    isCurrent: boolean;
  }[];

  submitting: boolean;
  disableSession: boolean;

  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => void;

  onClose: () => void;

  onSubmit: (
    e: React.FormEvent
  ) => void;
}


const SubjectFormModal = ({
  title,
  submitLabel,
  formData,
  sessions,
  submitting,
  disableSession,
  onChange,
  onClose,
  onSubmit,
}: SubjectFormModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">

        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">

          <div>

            <h2 className="text-xl font-bold text-gray-900">
              {title}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage subject catalogue information.
            </p>

          </div>


          <button
            type="button"
            onClick={
              onClose
            }
          >
            <Icon
              icon="lucide:x"
              className="text-xl text-gray-500"
            />
          </button>

        </div>


        <form
          onSubmit={
            onSubmit
          }
        >

          <div className="space-y-5 p-6">

            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Academic Session *
              </label>

              <select
                name="sessionId"
                value={
                  formData.sessionId
                }
                onChange={
                  onChange
                }
                disabled={
                  disableSession
                }
                className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-blue-600 disabled:bg-gray-100"
              >

                <option value="">
                  Select Academic Session
                </option>

                {sessions.map(
                  (session) => (
                    <option
                      key={
                        session._id
                      }
                      value={
                        session._id
                      }
                    >
                      {session.name}
                      {session.isCurrent
                        ? " (Current)"
                        : ""}
                    </option>
                  )
                )}

              </select>

            </div>


            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Subject Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={
                    formData.name
                  }
                  onChange={
                    onChange
                  }
                  placeholder="Example: Mathematics"
                  className="min-h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-600"
                />

              </div>


              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Subject Code *
                </label>

                <input
                  type="text"
                  name="code"
                  value={
                    formData.code
                  }
                  onChange={
                    onChange
                  }
                  placeholder="Example: MTH-101"
                  className="min-h-11 w-full rounded-lg border border-gray-300 px-3 text-sm uppercase outline-none focus:border-blue-600"
                />

              </div>

            </div>


            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Subject Type *
              </label>

              <select
                name="subjectType"
                value={
                  formData.subjectType
                }
                onChange={
                  onChange
                }
                className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-blue-600"
              >

                {SUBJECT_TYPES.map(
                  (type) => (
                    <option
                      key={
                        type.value
                      }
                      value={
                        type.value
                      }
                    >
                      {type.label}
                    </option>
                  )
                )}

              </select>

            </div>


            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Description
              </label>

              <textarea
                name="description"
                value={
                  formData.description
                }
                onChange={
                  onChange
                }
                rows={
                  4
                }
                placeholder="Brief description of the subject..."
                className="w-full resize-none rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-blue-600"
              />

            </div>


            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">

              <div className="flex gap-3">

                <Icon
                  icon="lucide:info"
                  className="mt-0.5 shrink-0 text-xl text-blue-600"
                />

                <div>

                  <p className="text-sm font-semibold text-blue-900">
                    Assignment Information
                  </p>

                  <p className="mt-1 text-xs leading-5 text-blue-700">
                    Class, section, teacher and weekly periods are managed from Subject Assignments. This page automatically shows those assignments after they are created.
                  </p>

                </div>

              </div>

            </div>

          </div>


          <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">

            <button
              type="button"
              onClick={
                onClose
              }
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={
                submitting
              }
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >

              {submitting && (
                <Icon
                  icon="lucide:loader-2"
                  className="animate-spin"
                />
              )}

              {submitLabel}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};


// ============================================
// SUBJECT DETAILS MODAL
// ============================================

interface SubjectDetailsModalProps {
  subject: SubjectData;
  sessionName: string;
  assignmentSummary: SubjectAssignmentSummary;
  assignments: SubjectAssignmentData[];
  onClose: () => void;
}


const SubjectDetailsModal = ({
  subject,
  sessionName,
  assignmentSummary,
  assignments,
  onClose,
}: SubjectDetailsModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl">

        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">

          <div>

            <h2 className="text-xl font-bold text-gray-900">
              Subject Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Subject and assignment information
            </p>

          </div>


          <button
            onClick={
              onClose
            }
          >
            <Icon
              icon="lucide:x"
              className="text-xl text-gray-500"
            />
          </button>

        </div>


        <div className="p-6">

          <div className="mb-6 rounded-xl bg-gray-50 p-5">

            <div className="flex items-start justify-between">

              <div>

                <h3 className="text-2xl font-bold text-gray-900">
                  {subject.name}
                </h3>

                <p className="mt-1 font-mono text-sm text-gray-500">
                  {subject.code}
                </p>

              </div>


              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  subject.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {subject.isActive
                  ? "Active"
                  : "Inactive"}
              </span>

            </div>

          </div>


          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <DetailItem
              label="Subject Type"
              value={
                getTypeLabel(
                  subject.subjectType
                )
              }
            />


            <DetailItem
              label="Academic Session"
              value={
                sessionName
              }
            />


            <DetailItem
              label="Assignments"
              value={
                String(
                  assignmentSummary.totalAssignments
                )
              }
            />


            <DetailItem
              label="Weekly Periods"
              value={
                String(
                  assignmentSummary.weeklyPeriods
                )
              }
            />

          </div>


          {subject.description && (
            <div className="mt-6">

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Description
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-700">
                {subject.description}
              </p>

            </div>
          )}


          <div className="mt-6">

            <h4 className="text-sm font-bold text-gray-900">
              Assignment Summary
            </h4>

            <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">

              <SummaryBox
                label="Classes"
                values={
                  assignmentSummary.classes
                }
              />

              <SummaryBox
                label="Sections"
                values={
                  assignmentSummary.sections
                }
              />

              <SummaryBox
                label="Teachers"
                values={
                  assignmentSummary.teachers
                }
              />

            </div>

          </div>


          <div className="mt-6">

            <h4 className="text-sm font-bold text-gray-900">
              Individual Assignments
            </h4>

            {assignments.length ===
            0 ? (
              <div className="mt-3 rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
                No class/section/teacher assignment has been created for this subject yet.
              </div>
            ) : (
              <div className="mt-3 overflow-x-auto rounded-xl border border-gray-200">

                <table className="w-full min-w-[650px] text-sm">

                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">

                    <tr>
                      <th className="px-4 py-3 text-left">
                        Class
                      </th>

                      <th className="px-4 py-3 text-left">
                        Section
                      </th>

                      <th className="px-4 py-3 text-left">
                        Teacher
                      </th>

                      <th className="px-4 py-3 text-left">
                        Periods
                      </th>

                      <th className="px-4 py-3 text-left">
                        Status
                      </th>
                    </tr>

                  </thead>


                  <tbody className="divide-y divide-gray-200">

                    {assignments.map(
                      (assignment) => (
                        <tr
                          key={
                            assignment._id
                          }
                        >

                          <td className="px-4 py-3 font-medium text-gray-800">
                            {getRelationName(
                              assignment.classId
                            ) ||
                              "-"}
                          </td>

                          <td className="px-4 py-3 text-gray-700">
                            {getRelationName(
                              assignment.sectionId
                            ) ||
                              "-"}
                          </td>

                          <td className="px-4 py-3 text-gray-700">
                            {getRelationName(
                              assignment.teacherId
                            ) ||
                              "-"}
                          </td>

                          <td className="px-4 py-3 text-gray-700">
                            {assignment.weeklyPeriods}
                          </td>

                          <td className="px-4 py-3">

                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                assignment.isActive
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {assignment.isActive
                                ? "Active"
                                : "Inactive"}
                            </span>

                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>
            )}

          </div>

        </div>


        <div className="flex justify-end border-t border-gray-200 px-6 py-4">

          <button
            onClick={
              onClose
            }
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
};


// ============================================
// SUMMARY BOX
// ============================================

const SummaryBox = ({
  label,
  values,
}: {
  label: string;
  values: string[];
}) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      {values.length >
      0 ? (
        <div className="mt-2 flex flex-wrap gap-1">

          {values.map(
            (value) => (
              <span
                key={
                  value
                }
                className="rounded-md bg-white px-2 py-1 text-xs font-medium text-gray-700 shadow-sm"
              >
                {value}
              </span>
            )
          )}

        </div>
      ) : (
        <p className="mt-2 text-sm italic text-gray-400">
          Not assigned
        </p>
      )}

    </div>
  );
};


// ============================================
// SUBJECT TYPE BADGE
// ============================================

const SubjectTypeBadge = ({
  type,
}: {
  type: SubjectType;
}) => {
  const styles:
    Record<
      SubjectType,
      string
    > = {
      CORE:
        "bg-blue-100 text-blue-700",

      LANGUAGE:
        "bg-purple-100 text-purple-700",

      PRACTICAL:
        "bg-orange-100 text-orange-700",

      ELECTIVE:
        "bg-cyan-100 text-cyan-700",
    };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[type]}`}
    >
      {getTypeLabel(
        type
      )}
    </span>
  );
};


// ============================================
// GET TYPE LABEL
// ============================================

const getTypeLabel = (
  type: SubjectType
) => {
  switch (type) {
    case "CORE":
      return "Core";

    case "LANGUAGE":
      return "Language";

    case "PRACTICAL":
      return "Practical";

    case "ELECTIVE":
      return "Elective";

    default:
      return type;
  }
};


// ============================================
// DETAIL ITEM
// ============================================

interface DetailItemProps {
  label: string;
  value: string;
}


const DetailItem = ({
  label,
  value,
}: DetailItemProps) => {
  return (
    <div>

      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 font-semibold text-gray-900">
        {value}
      </p>

    </div>
  );
};


export default Subjects