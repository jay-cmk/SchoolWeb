// import React, {
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import {
//   useNavigate,
// } from "react-router-dom";

// import { Icon } from "@iconify/react";

// import {
//   deleteStudent,
//   getStudents,
// } from "../../../features/student/student.slice";

// import type {
//   Student,
// } from "../../../features/student/student.types";

// import {
//   useAppDispatch,
//   useAppSelector,
// } from "../../../app/hooks";

// const StudentList: React.FC = () => {

//   const dispatch =
//     useAppDispatch();

//   const navigate =
//     useNavigate();

//   // ============================================
//   // REDUX
//   // ============================================

//   const {
//     students,
//     loading,
//     error,
//   } = useAppSelector(
//     (state) => state.students
//   );

//   /*
//    * IMPORTANT:
//    *
//    * Redux/API se kisi reason se students
//    * undefined aaye to UI crash nahi karega.
//    *
//    * students.length
//    * students.filter()
//    * students.map()
//    *
//    * sab safe rahenge.
//    */

//   const studentList: Student[] =
//     Array.isArray(students)
//       ? students
//       : [];

//   // ============================================
//   // LOCAL STATES
//   // ============================================

//   const [
//     searchQuery,
//     setSearchQuery,
//   ] = useState("");

//   const [
//     deleteStudentId,
//     setDeleteStudentId,
//   ] = useState<string | null>(
//     null
//   );

//   const [
//     deleting,
//     setDeleting,
//   ] = useState(false);

//   // ============================================
//   // LOAD STUDENTS
//   // ============================================

//   useEffect(() => {

//     dispatch(
//       getStudents()
//     );

//   }, [dispatch]);

//   // ============================================
//   // HELPERS
//   // ============================================

//   const getRelationName = (
//     relation:
//       | string
//       | {
//           _id: string;
//           name?: string;
//         }
//   ) => {

//     if (
//       typeof relation ===
//       "string"
//     ) {
//       return "-";
//     }

//     return (
//       relation?.name ||
//       "-"
//     );
//   };

//   // ============================================
//   // SEARCH
//   // ============================================

//   const filteredStudents =
//     useMemo(() => {

//       const query =
//         searchQuery
//           .trim()
//           .toLowerCase();

//       if (!query) {

//         return studentList;

//       }

//       return studentList.filter(
//         (student) => {

//           const name =
//             student.name
//               ?.toLowerCase() ||
//             "";

//           const admissionNumber =
//             student
//               .admissionNumber
//               ?.toLowerCase() ||
//             "";

//           const email =
//             student.email
//               ?.toLowerCase() ||
//             "";

//           const mobile =
//             student.mobile ||
//             "";

//           const rollNumber =
//             student.rollNumber
//               ?.toString() ||
//             "";

//           return (
//             name.includes(query) ||
//             admissionNumber.includes(
//               query
//             ) ||
//             email.includes(query) ||
//             mobile.includes(query) ||
//             rollNumber.includes(query)
//           );

//         }
//       );

//     }, [
//       studentList,
//       searchQuery,
//     ]);

//   // ============================================
//   // DELETE STUDENT
//   // ============================================

//   const handleDeleteStudent =
//     async () => {

//       if (!deleteStudentId) {

//         return;

//       }

//       try {

//         setDeleting(true);

//         await dispatch(
//           deleteStudent(
//             deleteStudentId
//           )
//         ).unwrap();

//         setDeleteStudentId(
//           null
//         );

//       } catch (deleteError) {

//         console.error(
//           "Failed to delete student:",
//           deleteError
//         );

//       } finally {

//         setDeleting(false);

//       }

//     };

//   // ============================================
//   // VIEW STUDENT
//   // ============================================

//   const handleViewStudent = (
//     student: Student
//   ) => {

//     navigate(
//       `/school-admin/students/${student._id}`
//     );

//   };

//   // ============================================
//   // EDIT STUDENT
//   // ============================================

//   const handleEditStudent = (
//     student: Student
//   ) => {

//     navigate(
//       `/school-admin/students/${student._id}/edit`
//     );

//   };

//   // ============================================
//   // LOADING
//   // ============================================

//   if (
//     loading &&
//     studentList.length === 0
//   ) {

//     return (

//       <div
//         className="
//           flex
//           min-h-[500px]
//           items-center
//           justify-center
//         "
//       >

//         <div
//           className="
//             text-center
//           "
//         >

//           <Icon
//             icon="lucide:loader-circle"
//             className="
//               mx-auto
//               animate-spin
//               text-4xl
//               text-[#1F5FAE]
//             "
//           />

//           <p
//             className="
//               mt-3
//               text-sm
//               font-medium
//               text-[#6B7280]
//             "
//           >
//             Loading students...
//           </p>

//         </div>

//       </div>

//     );

//   }

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
//           PAGE HEADER
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
//               mb-1
//               flex
//               items-center
//               gap-2

//               text-sm
//               text-[#6B7280]
//             "
//           >

//             <span>
//               Students
//             </span>

//             <Icon
//               icon="lucide:chevron-right"
//               className="
//                 text-sm
//               "
//             />

//             <span
//               className="
//                 text-[#15243B]
//               "
//             >
//               All Students
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
//             Students
//           </h1>

//           <p
//             className="
//               mt-1
//               text-sm
//               text-[#6B7280]
//             "
//           >
//             View and manage students
//             registered in your school.
//           </p>

//         </div>

//         <button
//           type="button"
//           onClick={() =>
//             navigate(
//               "/school-admin/students/add"
//             )
//           }
//           className="
//             inline-flex
//             min-h-11
//             items-center
//             justify-center
//             gap-2

//             rounded-lg

//             bg-[#1F5FAE]

//             px-5
//             py-2.5

//             text-sm
//             font-semibold
//             text-white

//             shadow-sm

//             transition-colors

//             hover:bg-[#174F91]
//           "
//         >

//           <Icon
//             icon="lucide:user-plus"
//             className="
//               text-lg
//             "
//           />

//           Add Student

//         </button>

//       </div>

//       {/* ========================================
//           ERROR
//       ======================================== */}

//       {error && (

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

//           <div
//             className="
//               flex-1
//             "
//           >

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
//               {error}
//             </p>

//           </div>

//           <button
//             type="button"
//             onClick={() =>
//               dispatch(
//                 getStudents()
//               )
//             }
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
//           SUMMARY
//       ======================================== */}

//       <div
//         className="
//           mb-5
//           grid
//           grid-cols-1
//           gap-4

//           sm:grid-cols-2
//         "
//       >

//         <div
//           className="
//             rounded-xl

//             border
//             border-[#E5E7EB]

//             bg-white

//             p-5
//           "
//         >

//           <div
//             className="
//               flex
//               items-center
//               gap-4
//             "
//           >

//             <div
//               className="
//                 flex
//                 h-11
//                 w-11
//                 items-center
//                 justify-center

//                 rounded-lg

//                 bg-[#E8F0FB]

//                 text-[#1F5FAE]
//               "
//             >

//               <Icon
//                 icon="lucide:users"
//                 className="
//                   text-xl
//                 "
//               />

//             </div>

//             <div>

//               <p
//                 className="
//                   text-sm
//                   text-[#6B7280]
//                 "
//               >
//                 Total Students
//               </p>

//               <p
//                 className="
//                   text-2xl
//                   font-bold
//                   text-[#15243B]
//                 "
//               >
//                 {studentList.length}
//               </p>

//             </div>

//           </div>

//         </div>

//         <div
//           className="
//             rounded-xl

//             border
//             border-[#E5E7EB]

//             bg-white

//             p-5
//           "
//         >

//           <div
//             className="
//               flex
//               items-center
//               gap-4
//             "
//           >

//             <div
//               className="
//                 flex
//                 h-11
//                 w-11
//                 items-center
//                 justify-center

//                 rounded-lg

//                 bg-[#F3F4F6]

//                 text-[#15243B]
//               "
//             >

//               <Icon
//                 icon="lucide:search"
//                 className="
//                   text-xl
//                 "
//               />

//             </div>

//             <div>

//               <p
//                 className="
//                   text-sm
//                   text-[#6B7280]
//                 "
//               >
//                 Showing
//               </p>

//               <p
//                 className="
//                   text-2xl
//                   font-bold
//                   text-[#15243B]
//                 "
//               >
//                 {
//                   filteredStudents.length
//                 }
//               </p>

//             </div>

//           </div>

//         </div>

//       </div>

//       {/* ========================================
//           STUDENT TABLE CARD
//       ======================================== */}

//       <div
//         className="
//           overflow-hidden

//           rounded-xl

//           border
//           border-[#E5E7EB]

//           bg-white
//         "
//       >

//         {/* ======================================
//             TABLE HEADER / SEARCH
//         ====================================== */}

//         <div
//           className="
//             flex
//             flex-col
//             gap-4

//             border-b
//             border-[#E5E7EB]

//             p-4

//             md:flex-row
//             md:items-center
//             md:justify-between
//           "
//         >

//           <div>

//             <h2
//               className="
//                 font-semibold
//                 text-[#15243B]
//               "
//             >
//               All Students
//             </h2>

//             <p
//               className="
//                 mt-0.5
//                 text-xs
//                 text-[#6B7280]
//               "
//             >
//               {
//                 filteredStudents.length
//               } student
//               {
//                 filteredStudents.length !==
//                 1
//                   ? "s"
//                   : ""
//               }
//             </p>

//           </div>

//           <div
//             className="
//               relative
//               w-full

//               md:max-w-sm
//             "
//           >

//             <Icon
//               icon="lucide:search"
//               className="
//                 absolute
//                 left-3
//                 top-1/2

//                 -translate-y-1/2

//                 text-lg
//                 text-[#6B7280]
//               "
//             />

//             <input
//               type="text"
//               value={
//                 searchQuery
//               }
//               onChange={(event) =>
//                 setSearchQuery(
//                   event.target.value
//                 )
//               }
//               placeholder="Search student..."
//               className="
//                 min-h-11
//                 w-full

//                 rounded-lg

//                 border
//                 border-[#D1D5DB]

//                 bg-white

//                 pl-10
//                 pr-10

//                 text-sm
//                 text-[#15243B]

//                 outline-none

//                 transition-all

//                 placeholder:text-[#9CA3AF]

//                 focus:border-[#1F5FAE]
//                 focus:ring-1
//                 focus:ring-[#1F5FAE]
//               "
//             />

//             {searchQuery && (

//               <button
//                 type="button"
//                 onClick={() =>
//                   setSearchQuery("")
//                 }
//                 className="
//                   absolute
//                   right-3
//                   top-1/2

//                   -translate-y-1/2

//                   text-[#9CA3AF]

//                   hover:text-[#15243B]
//                 "
//               >

//                 <Icon
//                   icon="lucide:x"
//                   className="
//                     text-lg
//                   "
//                 />

//               </button>

//             )}

//           </div>

//         </div>

//         {/* ======================================
//             TABLE
//         ====================================== */}

//         {filteredStudents.length >
//         0 ? (

//           <div
//             className="
//               overflow-x-auto
//             "
//           >

//             <table
//               className="
//                 w-full
//                 min-w-[1000px]

//                 text-left
//               "
//             >

//               <thead
//                 className="
//                   bg-[#F9FAFB]
//                 "
//               >

//                 <tr
//                   className="
//                     border-b
//                     border-[#E5E7EB]
//                   "
//                 >

//                   <th
//                     className="
//                       px-5
//                       py-3

//                       text-xs
//                       font-semibold
//                       uppercase
//                       tracking-wide
//                       text-[#6B7280]
//                     "
//                   >
//                     Student
//                   </th>

//                   <th
//                     className="
//                       px-5
//                       py-3

//                       text-xs
//                       font-semibold
//                       uppercase
//                       tracking-wide
//                       text-[#6B7280]
//                     "
//                   >
//                     Admission No.
//                   </th>

//                   <th
//                     className="
//                       px-5
//                       py-3

//                       text-xs
//                       font-semibold
//                       uppercase
//                       tracking-wide
//                       text-[#6B7280]
//                     "
//                   >
//                     Roll No.
//                   </th>

//                   <th
//                     className="
//                       px-5
//                       py-3

//                       text-xs
//                       font-semibold
//                       uppercase
//                       tracking-wide
//                       text-[#6B7280]
//                     "
//                   >
//                     Class
//                   </th>

//                   <th
//                     className="
//                       px-5
//                       py-3

//                       text-xs
//                       font-semibold
//                       uppercase
//                       tracking-wide
//                       text-[#6B7280]
//                     "
//                   >
//                     Section
//                   </th>

//                   <th
//                     className="
//                       px-5
//                       py-3

//                       text-xs
//                       font-semibold
//                       uppercase
//                       tracking-wide
//                       text-[#6B7280]
//                     "
//                   >
//                     Contact
//                   </th>

//                   <th
//                     className="
//                       px-5
//                       py-3

//                       text-right
//                       text-xs
//                       font-semibold
//                       uppercase
//                       tracking-wide
//                       text-[#6B7280]
//                     "
//                   >
//                     Actions
//                   </th>

//                 </tr>

//               </thead>

//               <tbody
//                 className="
//                   divide-y
//                   divide-[#E5E7EB]
//                 "
//               >

//                 {filteredStudents.map(
//                   (student) => (

//                     <tr
//                       key={
//                         student._id
//                       }
//                       className="
//                         transition-colors

//                         hover:bg-[#F9FAFB]
//                       "
//                     >

//                       {/* STUDENT */}

//                       <td
//                         className="
//                           px-5
//                           py-4
//                         "
//                       >

//                         <div
//                           className="
//                             flex
//                             items-center
//                             gap-3
//                           "
//                         >

//                           <div
//                             className="
//                               flex
//                               h-10
//                               w-10
//                               shrink-0
//                               items-center
//                               justify-center

//                               rounded-full

//                               bg-[#E8F0FB]

//                               text-sm
//                               font-bold
//                               uppercase
//                               text-[#1F5FAE]
//                             "
//                           >
//                             {
//                               student.name
//                                 ?.charAt(0) ||
//                               "S"
//                             }
//                           </div>

//                           <div
//                             className="
//                               min-w-0
//                             "
//                           >

//                             <p
//                               className="
//                                 truncate
//                                 text-sm
//                                 font-semibold
//                                 text-[#15243B]
//                               "
//                             >
//                               {
//                                 student.name
//                               }
//                             </p>

//                             <p
//                               className="
//                                 mt-0.5
//                                 truncate
//                                 text-xs
//                                 text-[#6B7280]
//                               "
//                             >
//                               {
//                                 student.email ||
//                                 "No email"
//                               }
//                             </p>

//                           </div>

//                         </div>

//                       </td>

//                       {/* ADMISSION NUMBER */}

//                       <td
//                         className="
//                           px-5
//                           py-4

//                           text-sm
//                           font-medium
//                           text-[#15243B]
//                         "
//                       >
//                         {
//                           student
//                             .admissionNumber
//                         }
//                       </td>

//                       {/* ROLL */}

//                       <td
//                         className="
//                           px-5
//                           py-4

//                           text-sm
//                           text-[#6B7280]
//                         "
//                       >
//                         {
//                           student.rollNumber ??
//                           "-"
//                         }
//                       </td>

//                       {/* CLASS */}

//                       <td
//                         className="
//                           px-5
//                           py-4

//                           text-sm
//                           text-[#15243B]
//                         "
//                       >
//                         {
//                           getRelationName(
//                             student.classId
//                           )
//                         }
//                       </td>

//                       {/* SECTION */}

//                       <td
//                         className="
//                           px-5
//                           py-4

//                           text-sm
//                           text-[#15243B]
//                         "
//                       >
//                         {
//                           getRelationName(
//                             student.sectionId
//                           )
//                         }
//                       </td>

//                       {/* CONTACT */}

//                       <td
//                         className="
//                           px-5
//                           py-4
//                         "
//                       >

//                         <p
//                           className="
//                             text-sm
//                             text-[#15243B]
//                           "
//                         >
//                           {
//                             student.mobile ||
//                             "-"
//                           }
//                         </p>

//                       </td>

//                       {/* ACTIONS */}

//                       <td
//                         className="
//                           px-5
//                           py-4
//                         "
//                       >

//                         <div
//                           className="
//                             flex
//                             items-center
//                             justify-end
//                             gap-1
//                           "
//                         >

//                           <button
//                             type="button"
//                             onClick={() =>
//                               handleViewStudent(
//                                 student
//                               )
//                             }
//                             title="View Student"
//                             className="
//                               flex
//                               h-9
//                               w-9
//                               items-center
//                               justify-center

//                               rounded-lg

//                               text-[#6B7280]

//                               transition-colors

//                               hover:bg-[#E8F0FB]
//                               hover:text-[#1F5FAE]
//                             "
//                           >

//                             <Icon
//                               icon="lucide:eye"
//                               className="
//                                 text-lg
//                               "
//                             />

//                           </button>

//                           <button
//                             type="button"
//                             onClick={() =>
//                               handleEditStudent(
//                                 student
//                               )
//                             }
//                             title="Edit Student"
//                             className="
//                               flex
//                               h-9
//                               w-9
//                               items-center
//                               justify-center

//                               rounded-lg

//                               text-[#6B7280]

//                               transition-colors

//                               hover:bg-[#F3F4F6]
//                               hover:text-[#15243B]
//                             "
//                           >

//                             <Icon
//                               icon="lucide:pencil"
//                               className="
//                                 text-lg
//                               "
//                             />

//                           </button>

//                           <button
//                             type="button"
//                             onClick={() =>
//                               setDeleteStudentId(
//                                 student._id
//                               )
//                             }
//                             title="Delete Student"
//                             className="
//                               flex
//                               h-9
//                               w-9
//                               items-center
//                               justify-center

//                               rounded-lg

//                               text-[#6B7280]

//                               transition-colors

//                               hover:bg-red-50
//                               hover:text-red-600
//                             "
//                           >

//                             <Icon
//                               icon="lucide:trash-2"
//                               className="
//                                 text-lg
//                               "
//                             />

//                           </button>

//                         </div>

//                       </td>

//                     </tr>

//                   )
//                 )}

//               </tbody>

//             </table>

//           </div>

//         ) : (

//           /* ====================================
//              EMPTY STATE
//           ==================================== */

//           <div
//             className="
//               flex
//               min-h-[350px]
//               items-center
//               justify-center

//               px-5
//               py-10
//             "
//           >

//             <div
//               className="
//                 max-w-sm
//                 text-center
//               "
//             >

//               <div
//                 className="
//                   mx-auto
//                   flex
//                   h-14
//                   w-14
//                   items-center
//                   justify-center

//                   rounded-full

//                   bg-[#F3F4F6]

//                   text-[#6B7280]
//                 "
//               >

//                 <Icon
//                   icon={
//                     searchQuery
//                       ? "lucide:search-x"
//                       : "lucide:users"
//                   }
//                   className="
//                     text-2xl
//                   "
//                 />

//               </div>

//               <h3
//                 className="
//                   mt-4
//                   font-semibold
//                   text-[#15243B]
//                 "
//               >
//                 {
//                   searchQuery
//                     ? "No students found"
//                     : "No students yet"
//                 }
//               </h3>

//               <p
//                 className="
//                   mt-1
//                   text-sm
//                   text-[#6B7280]
//                 "
//               >
//                 {
//                   searchQuery
//                     ? "Try searching with another name, admission number, roll number, email or mobile."
//                     : "Students added to your school will appear here."
//                 }
//               </p>

//               {!searchQuery && (

//                 <button
//                   type="button"
//                   onClick={() =>
//                     navigate(
//                       "/school-admin/students/add"
//                     )
//                   }
//                   className="
//                     mt-5
//                     inline-flex
//                     min-h-10
//                     items-center
//                     gap-2

//                     rounded-lg

//                     bg-[#1F5FAE]

//                     px-4

//                     text-sm
//                     font-semibold
//                     text-white

//                     hover:bg-[#174F91]
//                   "
//                 >

//                   <Icon
//                     icon="lucide:user-plus"
//                   />

//                   Add Student

//                 </button>

//               )}

//             </div>

//           </div>

//         )}

//       </div>

//       {/* ========================================
//           DELETE CONFIRMATION MODAL
//       ======================================== */}

//       {deleteStudentId && (

//         <div
//           className="
//             fixed
//             inset-0
//             z-[100]

//             flex
//             items-center
//             justify-center

//             bg-black/40

//             p-4
//           "
//         >

//           <div
//             className="
//               w-full
//               max-w-md

//               rounded-xl

//               bg-white

//               p-6

//               shadow-xl
//             "
//           >

//             <div
//               className="
//                 flex
//                 h-12
//                 w-12
//                 items-center
//                 justify-center

//                 rounded-full

//                 bg-red-50

//                 text-red-600
//               "
//             >

//               <Icon
//                 icon="lucide:trash-2"
//                 className="
//                   text-xl
//                 "
//               />

//             </div>

//             <h3
//               className="
//                 mt-4
//                 text-lg
//                 font-bold
//                 text-[#15243B]
//               "
//             >
//               Delete Student?
//             </h3>

//             <p
//               className="
//                 mt-2
//                 text-sm
//                 leading-6
//                 text-[#6B7280]
//               "
//             >
//               Are you sure you want to
//               delete this student? This
//               action cannot be undone.
//             </p>

//             <div
//               className="
//                 mt-6
//                 flex
//                 justify-end
//                 gap-3
//               "
//             >

//               <button
//                 type="button"
//                 disabled={
//                   deleting
//                 }
//                 onClick={() =>
//                   setDeleteStudentId(
//                     null
//                   )
//                 }
//                 className="
//                   min-h-10

//                   rounded-lg

//                   border
//                   border-[#D1D5DB]

//                   px-4

//                   text-sm
//                   font-semibold
//                   text-[#15243B]

//                   hover:bg-[#F9FAFB]

//                   disabled:cursor-not-allowed
//                   disabled:opacity-50
//                 "
//               >
//                 Cancel
//               </button>

//               <button
//                 type="button"
//                 disabled={
//                   deleting
//                 }
//                 onClick={
//                   handleDeleteStudent
//                 }
//                 className="
//                   inline-flex
//                   min-h-10
//                   items-center
//                   justify-center
//                   gap-2

//                   rounded-lg

//                   bg-red-600

//                   px-4

//                   text-sm
//                   font-semibold
//                   text-white

//                   hover:bg-red-700

//                   disabled:cursor-not-allowed
//                   disabled:opacity-60
//                 "
//               >

//                 {deleting && (

//                   <Icon
//                     icon="lucide:loader-circle"
//                     className="
//                       animate-spin
//                     "
//                   />

//                 )}

//                 {
//                   deleting
//                     ? "Deleting..."
//                     : "Delete"
//                 }

//               </button>

//             </div>

//           </div>

//         </div>

//       )}

//     </div>

//   );
// };

// export default StudentList;

// import React, {
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import {
//   useNavigate,
// } from "react-router-dom";

// import { Icon } from "@iconify/react";

// import {
//   getStudentsByEnrollment,
// } from "../../../features/student/student.slice";

// import type {
//   Student,
// } from "../../../features/student/student.types";

// import {
//   getSessions,
// } from "../../../features/academic/sessions/session.slice";

// import {
//   getClasses,
// } from "../../../features/academic/classes/class.slice";

// import {
//   getSections,
// } from "../../../features/academic/sections/section.slice";

// import {
//   useAppDispatch,
//   useAppSelector,
// } from "../../../app/hooks";

// const StudentList: React.FC = () => {

//   const dispatch =
//     useAppDispatch();

//   const navigate =
//     useNavigate();

//   /* =====================================================
//      REDUX
//   ===================================================== */

//   const {
//     students,
//     loading,
//     error,
//   } = useAppSelector(
//     (state) => state.students
//   );

//   const {
//     sessions,
//   } = useAppSelector(
//     (state) => state.sessions
//   );

//   const {
//     classes,
//   } = useAppSelector(
//     (state) => state.classes
//   );

//   const {
//     sections,
//   } = useAppSelector(
//     (state) => state.sections
//   );

//   const {
//     selectedSessionId,
//   } = useAppSelector(
//     (state) =>
//       state.sessionSelection
//   );

//   /* =====================================================
//      SAFE STUDENT LIST
//   ===================================================== */

//   const studentList: Student[] =
//     Array.isArray(students)
//       ? students
//       : [];

//   /* =====================================================
//      LOCAL STATE
//   ===================================================== */

//   const [
//     searchQuery,
//     setSearchQuery,
//   ] = useState("");

//   const [
//     classFilter,
//     setClassFilter,
//   ] = useState("ALL");

//   const [
//     sectionFilter,
//     setSectionFilter,
//   ] = useState("ALL");

//   /* =====================================================
//      INITIAL ACADEMIC DATA
//   ===================================================== */

//   useEffect(() => {

//     if (sessions.length === 0) {
//       dispatch(
//         getSessions()
//       );
//     }

//   }, [
//     dispatch,
//     sessions.length,
//   ]);

//   /* =====================================================
//      LOAD CLASSES BY GLOBAL SESSION
//   ===================================================== */

//   useEffect(() => {

//     setClassFilter("ALL");

//     setSectionFilter("ALL");

//     if (!selectedSessionId) {
//       return;
//     }

//     dispatch(
//       getClasses({
//         sessionId:
//           selectedSessionId,
//       })
//     );

//   }, [
//     dispatch,
//     selectedSessionId,
//   ]);

//   /* =====================================================
//      LOAD SECTIONS
//   ===================================================== */

//   useEffect(() => {

//     setSectionFilter("ALL");

//     if (
//       !selectedSessionId ||
//       classFilter === "ALL"
//     ) {
//       return;
//     }

//     dispatch(
//       getSections({
//         sessionId:
//           selectedSessionId,

//         classId:
//           classFilter,
//       })
//     );

//   }, [
//     dispatch,
//     selectedSessionId,
//     classFilter,
//   ]);

//   /* =====================================================
//      LOAD STUDENTS BY ENROLLMENT

//      IMPORTANT:

//      sessionId always global selected session.

//      This reads StudentEnrollment instead of
//      Student current academic snapshot.

//      So previous session students remain visible
//      even after promotion.
//   ===================================================== */

//   useEffect(() => {

//     if (!selectedSessionId) {
//       return;
//     }

//     const filters = {
//       sessionId:
//         selectedSessionId,
//     } as {
//       sessionId: string;
//       classId?: string;
//       sectionId?: string;
//     };

//     if (classFilter !== "ALL") {
//       filters.classId =
//         classFilter;
//     }

//     if (sectionFilter !== "ALL") {
//       filters.sectionId =
//         sectionFilter;
//     }

//     dispatch(
//       getStudentsByEnrollment(
//         filters
//       )
//     );

//   }, [
//     dispatch,
//     selectedSessionId,
//     classFilter,
//     sectionFilter,
//   ]);

//   /* =====================================================
//      SELECTED SESSION
//   ===================================================== */

//   const selectedSession =
//     useMemo(
//       () =>
//         sessions.find(
//           (session) =>
//             session._id ===
//             selectedSessionId
//         ) ?? null,
//       [
//         sessions,
//         selectedSessionId,
//       ]
//     );

//   /* =====================================================
//      SESSION CLASSES

//      Defensive frontend filtering too.
//   ===================================================== */

//   const sessionClasses =
//     useMemo(() => {

//       if (!selectedSessionId) {
//         return [];
//       }

//       return classes.filter(
//         (classItem) =>
//           classItem.sessionId ===
//           selectedSessionId
//       );

//     }, [
//       classes,
//       selectedSessionId,
//     ]);

//   /* =====================================================
//      CLASS SECTIONS
//   ===================================================== */

//   const classSections =
//     useMemo(() => {

//       if (
//         !selectedSessionId ||
//         classFilter === "ALL"
//       ) {
//         return [];
//       }

//       return sections.filter(
//         (section) =>
//           section.sessionId ===
//             selectedSessionId &&
//           section.classId ===
//             classFilter
//       );

//     }, [
//       sections,
//       selectedSessionId,
//       classFilter,
//     ]);

//   /* =====================================================
//      HELPERS
//   ===================================================== */

//   const getRelationName = (
//     relation:
//       | string
//       | {
//           _id: string;
//           name?: string;
//         }
//   ) => {

//     if (
//       typeof relation ===
//       "string"
//     ) {
//       return "-";
//     }

//     return (
//       relation?.name ||
//       "-"
//     );
//   };

//   /* =====================================================
//      SEARCH

//      Backend already supports search.

//      But current UI search is kept client-side
//      so typing does not hit API on every keypress.
//   ===================================================== */

//   const filteredStudents =
//     useMemo(() => {

//       const query =
//         searchQuery
//           .trim()
//           .toLowerCase();

//       if (!query) {
//         return studentList;
//       }

//       return studentList.filter(
//         (student) => {

//           const name =
//             student.name
//               ?.toLowerCase() ||
//             "";

//           const admissionNumber =
//             student
//               .admissionNumber
//               ?.toLowerCase() ||
//             "";

//           const email =
//             student.email
//               ?.toLowerCase() ||
//             "";

//           const mobile =
//             student.mobile ||
//             "";

//           const rollNumber =
//             student.rollNumber
//               ?.toString() ||
//             "";

//           return (
//             name.includes(query) ||
//             admissionNumber.includes(
//               query
//             ) ||
//             email.includes(query) ||
//             mobile.includes(query) ||
//             rollNumber.includes(query)
//           );
//         }
//       );

//     }, [
//       studentList,
//       searchQuery,
//     ]);

//   /* =====================================================
//      VIEW STUDENT
//   ===================================================== */

//   const handleViewStudent = (
//     student: Student
//   ) => {

//     navigate(
//       `/school-admin/students/${student._id}`
//     );
//   };

//   /* =====================================================
//      EDIT STUDENT
//   ===================================================== */

//   const handleEditStudent = (
//     student: Student
//   ) => {

//     navigate(
//       `/school-admin/students/${student._id}/edit`
//     );
//   };

//   /* =====================================================
//      RETRY
//   ===================================================== */

//   const handleRetry = () => {

//     if (!selectedSessionId) {
//       return;
//     }

//     const filters = {
//       sessionId:
//         selectedSessionId,
//     } as {
//       sessionId: string;
//       classId?: string;
//       sectionId?: string;
//     };

//     if (classFilter !== "ALL") {
//       filters.classId =
//         classFilter;
//     }

//     if (sectionFilter !== "ALL") {
//       filters.sectionId =
//         sectionFilter;
//     }

//     dispatch(
//       getStudentsByEnrollment(
//         filters
//       )
//     );
//   };

//   /* =====================================================
//      NO SELECTED SESSION
//   ===================================================== */

//   if (!selectedSessionId) {

//     return (

//       <div className="min-h-full bg-[#F7F9FC] p-4 md:p-6 lg:p-8">

//         <div className="flex min-h-[500px] items-center justify-center">

//           <div className="max-w-md text-center">

//             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F0FB] text-[#1F5FAE]">

//               <Icon
//                 icon="lucide:calendar-days"
//                 className="text-2xl"
//               />

//             </div>

//             <h2 className="mt-4 text-lg font-bold text-[#15243B]">

//               Select Academic Session

//             </h2>

//             <p className="mt-2 text-sm leading-6 text-[#6B7280]">

//               Please select an academic
//               session from the topbar to
//               view students.

//             </p>

//           </div>

//         </div>

//       </div>

//     );
//   }

//   /* =====================================================
//      LOADING
//   ===================================================== */

//   if (
//     loading &&
//     studentList.length === 0
//   ) {

//     return (

//       <div className="flex min-h-[500px] items-center justify-center">

//         <div className="text-center">

//           <Icon
//             icon="lucide:loader-circle"
//             className="mx-auto animate-spin text-4xl text-[#1F5FAE]"
//           />

//           <p className="mt-3 text-sm font-medium text-[#6B7280]">

//             Loading students...

//           </p>

//         </div>

//       </div>

//     );
//   }

//   /* =====================================================
//      UI
//   ===================================================== */

//   return (

//     <div className="min-h-full bg-[#F7F9FC] p-4 md:p-6 lg:p-8">

//       {/* =================================================
//           HEADER
//       ================================================= */}

//       <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

//         <div>

//           <div className="mb-1 flex items-center gap-2 text-sm text-[#6B7280]">

//             <span>
//               Students
//             </span>

//             <Icon
//               icon="lucide:chevron-right"
//               className="text-sm"
//             />

//             <span className="text-[#15243B]">
//               All Students
//             </span>

//           </div>

//           <h1 className="text-2xl font-bold text-[#15243B] md:text-3xl">

//             Students

//           </h1>

//           <p className="mt-1 text-sm text-[#6B7280]">

//             View students for the
//             selected academic session.

//           </p>

//           {selectedSession && (

//             <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-[#D7E3F4] bg-[#EEF4FC] px-3 py-1.5 text-xs font-semibold text-[#1F5FAE]">

//               <Icon
//                 icon="lucide:calendar-days"
//               />

//               {selectedSession.name}

//               {selectedSession.isCurrent && (

//                 <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">

//                   CURRENT

//                 </span>

//               )}

//             </div>

//           )}

//         </div>

//         <button
//           type="button"
//           onClick={() =>
//             navigate(
//               "/school-admin/students/add"
//             )
//           }
//           className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#1F5FAE] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#174F91]"
//         >

//           <Icon
//             icon="lucide:user-plus"
//             className="text-lg"
//           />

//           Add Student

//         </button>

//       </div>

//       {/* =================================================
//           ERROR
//       ================================================= */}

//       {error && (

//         <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">

//           <Icon
//             icon="lucide:circle-alert"
//             className="mt-0.5 shrink-0 text-xl text-red-500"
//           />

//           <div className="flex-1">

//             <p className="text-sm font-semibold text-red-700">

//               Failed to load students

//             </p>

//             <p className="mt-1 text-sm text-red-600">

//               {error}

//             </p>

//           </div>

//           <button
//             type="button"
//             onClick={handleRetry}
//             className="text-sm font-semibold text-red-700 hover:underline"
//           >

//             Retry

//           </button>

//         </div>

//       )}

//       {/* =================================================
//           SUMMARY
//       ================================================= */}

//       <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">

//         <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">

//           <div className="flex items-center gap-4">

//             <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#E8F0FB] text-[#1F5FAE]">

//               <Icon
//                 icon="lucide:users"
//                 className="text-xl"
//               />

//             </div>

//             <div>

//               <p className="text-sm text-[#6B7280]">

//                 Total Students

//               </p>

//               <p className="text-2xl font-bold text-[#15243B]">

//                 {studentList.length}

//               </p>

//             </div>

//           </div>

//         </div>

//         <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">

//           <div className="flex items-center gap-4">

//             <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#F3F4F6] text-[#15243B]">

//               <Icon
//                 icon="lucide:search"
//                 className="text-xl"
//               />

//             </div>

//             <div>

//               <p className="text-sm text-[#6B7280]">

//                 Showing

//               </p>

//               <p className="text-2xl font-bold text-[#15243B]">

//                 {filteredStudents.length}

//               </p>

//             </div>

//           </div>

//         </div>

//       </div>

//       {/* =================================================
//           FILTERS
//       ================================================= */}

//       <div className="mb-5 rounded-xl border border-[#E5E7EB] bg-white p-4">

//         <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

//           {/* CLASS FILTER */}

//           <div>

//             <label className="mb-1.5 block text-xs font-semibold text-[#6B7280]">

//               Class

//             </label>

//             <select
//               value={classFilter}
//               onChange={(event) =>
//                 setClassFilter(
//                   event.target.value
//                 )
//               }
//               className="min-h-11 w-full rounded-lg border border-[#D1D5DB] bg-white px-3 text-sm text-[#15243B] outline-none focus:border-[#1F5FAE] focus:ring-1 focus:ring-[#1F5FAE]"
//             >

//               <option value="ALL">
//                 All Classes
//               </option>

//               {sessionClasses.map(
//                 (classItem) => (

//                   <option
//                     key={classItem._id}
//                     value={classItem._id}
//                   >
//                     {classItem.name}
//                   </option>

//                 )
//               )}

//             </select>

//           </div>

//           {/* SECTION FILTER */}

//           <div>

//             <label className="mb-1.5 block text-xs font-semibold text-[#6B7280]">

//               Section

//             </label>

//             <select
//               value={sectionFilter}
//               disabled={
//                 classFilter === "ALL"
//               }
//               onChange={(event) =>
//                 setSectionFilter(
//                   event.target.value
//                 )
//               }
//               className="min-h-11 w-full rounded-lg border border-[#D1D5DB] bg-white px-3 text-sm text-[#15243B] outline-none disabled:cursor-not-allowed disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF] focus:border-[#1F5FAE] focus:ring-1 focus:ring-[#1F5FAE]"
//             >

//               <option value="ALL">
//                 All Sections
//               </option>

//               {classSections.map(
//                 (section) => (

//                   <option
//                     key={section._id}
//                     value={section._id}
//                   >
//                     {section.name}
//                   </option>

//                 )
//               )}

//             </select>

//           </div>

//           {/* SEARCH */}

//           <div>

//             <label className="mb-1.5 block text-xs font-semibold text-[#6B7280]">

//               Search

//             </label>

//             <div className="relative">

//               <Icon
//                 icon="lucide:search"
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-[#6B7280]"
//               />

//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(event) =>
//                   setSearchQuery(
//                     event.target.value
//                   )
//                 }
//                 placeholder="Name, admission, roll..."
//                 className="min-h-11 w-full rounded-lg border border-[#D1D5DB] bg-white pl-10 pr-10 text-sm text-[#15243B] outline-none placeholder:text-[#9CA3AF] focus:border-[#1F5FAE] focus:ring-1 focus:ring-[#1F5FAE]"
//               />

//               {searchQuery && (

//                 <button
//                   type="button"
//                   onClick={() =>
//                     setSearchQuery("")
//                   }
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#15243B]"
//                 >

//                   <Icon
//                     icon="lucide:x"
//                     className="text-lg"
//                   />

//                 </button>

//               )}

//             </div>

//           </div>

//         </div>

//       </div>

//       {/* =================================================
//           TABLE CARD
//       ================================================= */}

//       <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">

//         {/* TABLE HEADER */}

//         <div className="flex items-center justify-between border-b border-[#E5E7EB] p-4">

//           <div>

//             <h2 className="font-semibold text-[#15243B]">

//               Students

//             </h2>

//             <p className="mt-0.5 text-xs text-[#6B7280]">

//               {filteredStudents.length}
//               {" "}
//               student
//               {
//                 filteredStudents.length !==
//                 1
//                   ? "s"
//                   : ""
//               }

//             </p>

//           </div>

//           {loading && (

//             <Icon
//               icon="lucide:loader-circle"
//               className="animate-spin text-xl text-[#1F5FAE]"
//             />

//           )}

//         </div>

//         {/* =================================================
//             TABLE
//         ================================================= */}

//         {filteredStudents.length > 0 ? (

//           <div className="overflow-x-auto">

//             <table className="w-full min-w-[1000px] text-left">

//               <thead className="bg-[#F9FAFB]">

//                 <tr className="border-b border-[#E5E7EB]">

//                   <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
//                     Student
//                   </th>

//                   <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
//                     Admission No.
//                   </th>

//                   <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
//                     Roll No.
//                   </th>

//                   <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
//                     Class
//                   </th>

//                   <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
//                     Section
//                   </th>

//                   <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
//                     Enrollment
//                   </th>

//                   <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
//                     Contact
//                   </th>

//                   <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
//                     Actions
//                   </th>

//                 </tr>

//               </thead>

//               <tbody className="divide-y divide-[#E5E7EB]">

//                 {filteredStudents.map(
//                   (student) => (

//                     <tr
//                       key={student._id}
//                       className="transition-colors hover:bg-[#F9FAFB]"
//                     >

//                       {/* STUDENT */}

//                       <td className="px-5 py-4">

//                         <div className="flex items-center gap-3">

//                           <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E8F0FB] text-sm font-bold uppercase text-[#1F5FAE]">

//                             {student.photo ? (

//                               <img
//                                 src={student.photo}
//                                 alt={student.name}
//                                 className="h-full w-full object-cover"
//                               />

//                             ) : (

//                               student.name
//                                 ?.charAt(0) ||
//                               "S"

//                             )}

//                           </div>

//                           <div className="min-w-0">

//                             <p className="truncate text-sm font-semibold text-[#15243B]">

//                               {student.name}

//                             </p>

//                             <p className="mt-0.5 truncate text-xs text-[#6B7280]">

//                               {
//                                 student.email ||
//                                 "No email"
//                               }

//                             </p>

//                           </div>

//                         </div>

//                       </td>

//                       {/* ADMISSION NUMBER */}

//                       <td className="px-5 py-4 text-sm font-medium text-[#15243B]">

//                         {
//                           student
//                             .admissionNumber
//                         }

//                       </td>

//                       {/* ROLL */}

//                       <td className="px-5 py-4 text-sm text-[#6B7280]">

//                         {
//                           student.rollNumber ??
//                           "-"
//                         }

//                       </td>

//                       {/* CLASS */}

//                       <td className="px-5 py-4 text-sm text-[#15243B]">

//                         {
//                           getRelationName(
//                             student.classId
//                           )
//                         }

//                       </td>

//                       {/* SECTION */}

//                       <td className="px-5 py-4 text-sm text-[#15243B]">

//                         {
//                           getRelationName(
//                             student.sectionId
//                           )
//                         }

//                       </td>

//                       {/* ENROLLMENT */}

//                       <td className="px-5 py-4">

//                         {student.enrollment ? (

//                           <div className="flex flex-col gap-1">

//                             <span
//                               className={`
//                                 inline-flex
//                                 w-fit
//                                 rounded-full
//                                 px-2.5
//                                 py-1
//                                 text-xs
//                                 font-semibold
//                                 ${
//                                   student.enrollment
//                                     .enrollmentStatus ===
//                                   "ACTIVE"
//                                     ? "bg-emerald-50 text-emerald-700"
//                                     : student.enrollment
//                                           .enrollmentStatus ===
//                                         "COMPLETED"
//                                       ? "bg-blue-50 text-blue-700"
//                                       : "bg-gray-100 text-gray-600"
//                                 }
//                               `}
//                             >

//                               {
//                                 student.enrollment
//                                   .enrollmentStatus
//                               }

//                             </span>

//                             {student.enrollment
//                               .promotionStatus !==
//                               "NOT_DECIDED" && (

//                               <span className="text-[11px] font-medium text-[#6B7280]">

//                                 {
//                                   student.enrollment
//                                     .promotionStatus
//                                 }

//                               </span>

//                             )}

//                           </div>

//                         ) : (

//                           <span className="text-sm text-[#9CA3AF]">
//                             -
//                           </span>

//                         )}

//                       </td>

//                       {/* CONTACT */}

//                       <td className="px-5 py-4">

//                         <p className="text-sm text-[#15243B]">

//                           {
//                             student.mobile ||
//                             "-"
//                           }

//                         </p>

//                       </td>

//                       {/* ACTIONS */}

//                       <td className="px-5 py-4">

//                         <div className="flex items-center justify-end gap-1">

//                           {/* VIEW */}

//                           <button
//                             type="button"
//                             onClick={() =>
//                               handleViewStudent(
//                                 student
//                               )
//                             }
//                             title="View Student"
//                             className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6B7280] transition-colors hover:bg-[#E8F0FB] hover:text-[#1F5FAE]"
//                           >

//                             <Icon
//                               icon="lucide:eye"
//                               className="text-lg"
//                             />

//                           </button>

//                           {/* EDIT */}

//                           <button
//                             type="button"
//                             onClick={() =>
//                               handleEditStudent(
//                                 student
//                               )
//                             }
//                             title="Edit Student"
//                             className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6B7280] transition-colors hover:bg-[#F3F4F6] hover:text-[#15243B]"
//                           >

//                             <Icon
//                               icon="lucide:pencil"
//                               className="text-lg"
//                             />

//                           </button>

//                           {/*
//                            * DELETE intentionally nahi hai.
//                            *
//                            * Backend me currently:
//                            *
//                            * DELETE /students/:studentId
//                            *
//                            * route implemented nahi hai.
//                            */}

//                         </div>

//                       </td>

//                     </tr>

//                   )
//                 )}

//               </tbody>

//             </table>

//           </div>

//         ) : (

//           /* =================================================
//              EMPTY STATE
//           ================================================= */

//           <div className="flex min-h-[350px] items-center justify-center px-5 py-10">

//             <div className="max-w-sm text-center">

//               <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F3F4F6] text-[#6B7280]">

//                 <Icon
//                   icon={
//                     searchQuery
//                       ? "lucide:search-x"
//                       : "lucide:users"
//                   }
//                   className="text-2xl"
//                 />

//               </div>

//               <h3 className="mt-4 font-semibold text-[#15243B]">

//                 {
//                   searchQuery
//                     ? "No students found"
//                     : "No students found"
//                 }

//               </h3>

//               <p className="mt-1 text-sm text-[#6B7280]">

//                 {searchQuery
//                   ? "Try another name, admission number, roll number, email or mobile."
//                   : classFilter !== "ALL" ||
//                       sectionFilter !== "ALL"
//                     ? "No students are enrolled in the selected class or section."
//                     : `No students are enrolled in ${
//                         selectedSession?.name ??
//                         "this academic session"
//                       }.`}

//               </p>

//               {!searchQuery &&
//                 classFilter === "ALL" &&
//                 sectionFilter === "ALL" && (

//                   <button
//                     type="button"
//                     onClick={() =>
//                       navigate(
//                         "/school-admin/students/add"
//                       )
//                     }
//                     className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#1F5FAE] px-4 text-sm font-semibold text-white hover:bg-[#174F91]"
//                   >

//                     <Icon
//                       icon="lucide:user-plus"
//                     />

//                     Add Student

//                   </button>

//                 )}

//             </div>

//           </div>

//         )}

//       </div>

//     </div>

//   );
// };

// export default StudentList;





// import React, { useEffect, useMemo, useState } from "react";

// import { useNavigate } from "react-router-dom";

// import { Icon } from "@iconify/react";

// import {
//   clearStudents,
//   getStudentsByEnrollment,
// } from "../../../features/student/student.slice";

// import type { Student } from "../../../features/student/student.types";

// import { getSessions } from "../../../features/academic/sessions/session.slice";

// import { getClasses } from "../../../features/academic/classes/class.slice";

// import { getSections } from "../../../features/academic/sections/section.slice";

// import { useAppDispatch, useAppSelector } from "../../../app/hooks";

// const StudentList: React.FC = () => {
//   const dispatch = useAppDispatch();

//   const navigate = useNavigate();

//   /* =====================================================
//      REDUX
//   ===================================================== */

//   const { students, loading, error } = useAppSelector(
//     (state) => state.students,
//   );

//   const { sessions } = useAppSelector((state) => state.sessions);

//   const { classes } = useAppSelector((state) => state.classes);

//   const { sections } = useAppSelector((state) => state.sections);

//   const { selectedSessionId } = useAppSelector(
//     (state) => state.sessionSelection,
//   );

//   /* =====================================================
//      SAFE STUDENT LIST
//   ===================================================== */

//   const studentList: Student[] = Array.isArray(students) ? students : [];

//   /* =====================================================
//      LOCAL STATE
//   ===================================================== */

//   const [searchQuery, setSearchQuery] = useState("");

//   const [classFilter, setClassFilter] = useState("ALL");

//   const [sectionFilter, setSectionFilter] = useState("ALL");

//   /* =====================================================
//      INITIAL ACADEMIC DATA
//   ===================================================== */

//   useEffect(() => {
//     if (sessions.length === 0) {
//       dispatch(getSessions());
//     }
//   }, [dispatch, sessions.length]);

//   /* =====================================================
//      LOAD CLASSES BY GLOBAL SESSION
//   ===================================================== */

//   useEffect(() => {
//     dispatch(clearStudents());

//     setClassFilter("ALL");

//     setSectionFilter("ALL");

//     if (!selectedSessionId) {
//       return;
//     }

//     dispatch(
//       getClasses({
//         sessionId: selectedSessionId,
//       }),
//     );
//   }, [dispatch, selectedSessionId]);

//   /* =====================================================
//      LOAD SECTIONS
//   ===================================================== */

//   useEffect(() => {
//     setSectionFilter("ALL");

//     if (!selectedSessionId || classFilter === "ALL") {
//       return;
//     }

//     dispatch(
//       getSections({
//         sessionId: selectedSessionId,

//         classId: classFilter,
//       }),
//     );
//   }, [dispatch, selectedSessionId, classFilter]);

//   /* =====================================================
//      LOAD STUDENTS BY ENROLLMENT

//      IMPORTANT:

//      sessionId always global selected session.

//      This reads StudentEnrollment instead of
//      Student current academic snapshot.

//      So previous session students remain visible
//      even after promotion.
//   ===================================================== */

//   useEffect(() => {
//     if (!selectedSessionId) {
//       return;
//     }

//     const filters = {
//       sessionId: selectedSessionId,
//     } as {
//       sessionId: string;
//       classId?: string;
//       sectionId?: string;
//     };

//     if (classFilter !== "ALL") {
//       filters.classId = classFilter;
//     }

//     if (sectionFilter !== "ALL") {
//       filters.sectionId = sectionFilter;
//     }

//     dispatch(getStudentsByEnrollment(filters));
//   }, [dispatch, selectedSessionId, classFilter, sectionFilter]);

//   /* =====================================================
//      SELECTED SESSION
//   ===================================================== */

//   const selectedSession = useMemo(
//     () => sessions.find((session) => session._id === selectedSessionId) ?? null,
//     [sessions, selectedSessionId],
//   );

//   /* =====================================================
//      SESSION CLASSES

//      Defensive frontend filtering too.
//   ===================================================== */

//   const sessionClasses = useMemo(() => {
//     if (!selectedSessionId) {
//       return [];
//     }

//     return classes.filter(
//       (classItem) => classItem.sessionId === selectedSessionId,
//     );
//   }, [classes, selectedSessionId]);

//   /* =====================================================
//      CLASS SECTIONS
//   ===================================================== */

//   const classSections = useMemo(() => {
//     if (!selectedSessionId || classFilter === "ALL") {
//       return [];
//     }

//     return sections.filter(
//       (section) =>
//         section.sessionId === selectedSessionId &&
//         section.classId === classFilter,
//     );
//   }, [sections, selectedSessionId, classFilter]);

//   /* =====================================================
//      HELPERS
//   ===================================================== */

//   const getRelationName = (
//     relation:
//       | string
//       | {
//           _id: string;
//           name?: string;
//         },
//   ) => {
//     if (typeof relation === "string") {
//       return "-";
//     }

//     return relation?.name || "-";
//   };

//   /* =====================================================
//      SEARCH

//      Backend already supports search.

//      But current UI search is kept client-side
//      so typing does not hit API on every keypress.
//   ===================================================== */

//   const filteredStudents = useMemo(() => {
//     const query = searchQuery.trim().toLowerCase();

//     if (!query) {
//       return studentList;
//     }

//     return studentList.filter((student) => {
//       const name = student.name?.toLowerCase() || "";

//       const admissionNumber = student.admissionNumber?.toLowerCase() || "";

//       const email = student.email?.toLowerCase() || "";

//       const mobile = student.mobile || "";

//       const rollNumber = student.rollNumber?.toString() || "";

//       return (
//         name.includes(query) ||
//         admissionNumber.includes(query) ||
//         email.includes(query) ||
//         mobile.includes(query) ||
//         rollNumber.includes(query)
//       );
//     });
//   }, [studentList, searchQuery]);

//   /* =====================================================
//      VIEW STUDENT
//   ===================================================== */

//   const handleViewStudent = (student: Student) => {
//     navigate(`/school-admin/students/${student._id}`);
//   };

//   /* =====================================================
//      EDIT STUDENT
//   ===================================================== */

//   const handleEditStudent = (student: Student) => {
//     navigate(`/school-admin/students/${student._id}/edit`);
//   };

//   /* =====================================================
//      RETRY
//   ===================================================== */

//   const handleRetry = () => {
//     if (!selectedSessionId) {
//       return;
//     }

//     const filters = {
//       sessionId: selectedSessionId,
//     } as {
//       sessionId: string;
//       classId?: string;
//       sectionId?: string;
//     };

//     if (classFilter !== "ALL") {
//       filters.classId = classFilter;
//     }

//     if (sectionFilter !== "ALL") {
//       filters.sectionId = sectionFilter;
//     }

//     dispatch(getStudentsByEnrollment(filters));
//   };

//   /* =====================================================
//      NO SELECTED SESSION
//   ===================================================== */

//   if (!selectedSessionId) {
//     return (
//       <div className="min-h-full bg-[#F7F9FC] p-4 md:p-6 lg:p-8">
//         <div className="flex min-h-[500px] items-center justify-center">
//           <div className="max-w-md text-center">
//             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F0FB] text-[#1F5FAE]">
//               <Icon icon="lucide:calendar-days" className="text-2xl" />
//             </div>

//             <h2 className="mt-4 text-lg font-bold text-[#15243B]">
//               Select Academic Session
//             </h2>

//             <p className="mt-2 text-sm leading-6 text-[#6B7280]">
//               Please select an academic session from the topbar to view
//               students.
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   /* =====================================================
//      LOADING
//   ===================================================== */

//   if (loading && studentList.length === 0) {
//     return (
//       <div className="flex min-h-[500px] items-center justify-center">
//         <div className="text-center">
//           <Icon
//             icon="lucide:loader-circle"
//             className="mx-auto animate-spin text-4xl text-[#1F5FAE]"
//           />

//           <p className="mt-3 text-sm font-medium text-[#6B7280]">
//             Loading students...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   /* =====================================================
//      UI
//   ===================================================== */

//   return (
//     <div className="min-h-full bg-[#F7F9FC] p-4 md:p-6 lg:p-8">
//       {/* =================================================
//           HEADER
//       ================================================= */}

//       <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//         <div>
//           <div>
//             <h1 className="text-2xl font-bold text-[#15243B] md:text-3xl">
//               All Students
//             </h1>
//           </div>

//           {selectedSession && (
//             <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-[#D7E3F4] bg-[#EEF4FC] px-3 py-1.5 text-xs font-semibold text-[#1F5FAE]">
//               <Icon icon="lucide:calendar-days" />

//               {selectedSession.name}

//               {selectedSession.isCurrent && (
//                 <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
//                   CURRENT
//                 </span>
//               )}
//             </div>
//           )}
//         </div>

//         <button
//           type="button"
//           onClick={() => navigate("/school-admin/students/add")}
//           className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#1F5FAE] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#174F91]"
//         >
//           <Icon icon="lucide:user-plus" className="text-lg" />
//           Add Student
//         </button>
//       </div>

//       {/* =================================================
//           ERROR
//       ================================================= */}

//       {error && (
//         <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
//           <Icon
//             icon="lucide:circle-alert"
//             className="mt-0.5 shrink-0 text-xl text-red-500"
//           />

//           <div className="flex-1">
//             <p className="text-sm font-semibold text-red-700">
//               Failed to load students
//             </p>

//             <p className="mt-1 text-sm text-red-600">{error}</p>
//           </div>

//           <button
//             type="button"
//             onClick={handleRetry}
//             className="text-sm font-semibold text-red-700 hover:underline"
//           >
//             Retry
//           </button>
//         </div>
//       )}

//       {/* =================================================
//           SUMMARY
//       ================================================= */}

//       <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
//         <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
//           <div className="flex items-center gap-4">
//             <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#E8F0FB] text-[#1F5FAE]">
//               <Icon icon="lucide:users" className="text-xl" />
//             </div>

//             <div>
//               <p className="text-sm text-[#6B7280]">Total Students</p>

//               <p className="text-2xl font-bold text-[#15243B]">
//                 {studentList.length}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
//           <div className="flex items-center gap-4">
//             <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#F3F4F6] text-[#15243B]">
//               <Icon icon="lucide:search" className="text-xl" />
//             </div>

//             <div>
//               <p className="text-sm text-[#6B7280]">Showing</p>

//               <p className="text-2xl font-bold text-[#15243B]">
//                 {filteredStudents.length}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* =================================================
//           FILTERS
//       ================================================= */}

//       <div className="mb-5 rounded-xl border border-[#E5E7EB] bg-white p-4">
//         <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//           {/* CLASS FILTER */}

//           <div>
//             <label className="mb-1.5 block text-xs font-semibold text-[#6B7280]">
//               Class
//             </label>

//             <select
//               value={classFilter}
//               onChange={(event) => setClassFilter(event.target.value)}
//               className="min-h-11 w-full rounded-lg border border-[#D1D5DB] bg-white px-3 text-sm text-[#15243B] outline-none focus:border-[#1F5FAE] focus:ring-1 focus:ring-[#1F5FAE]"
//             >
//               <option value="ALL">All Classes</option>

//               {sessionClasses.map((classItem) => (
//                 <option key={classItem._id} value={classItem._id}>
//                   {classItem.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* SECTION FILTER */}

//           <div>
//             <label className="mb-1.5 block text-xs font-semibold text-[#6B7280]">
//               Section
//             </label>

//             <select
//               value={sectionFilter}
//               disabled={classFilter === "ALL"}
//               onChange={(event) => setSectionFilter(event.target.value)}
//               className="min-h-11 w-full rounded-lg border border-[#D1D5DB] bg-white px-3 text-sm text-[#15243B] outline-none disabled:cursor-not-allowed disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF] focus:border-[#1F5FAE] focus:ring-1 focus:ring-[#1F5FAE]"
//             >
//               <option value="ALL">All Sections</option>

//               {classSections.map((section) => (
//                 <option key={section._id} value={section._id}>
//                   {section.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* SEARCH */}

//           <div>
//             <label className="mb-1.5 block text-xs font-semibold text-[#6B7280]">
//               Search
//             </label>

//             <div className="relative">
//               <Icon
//                 icon="lucide:search"
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-[#6B7280]"
//               />

//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(event) => setSearchQuery(event.target.value)}
//                 placeholder="Name, admission, roll..."
//                 className="min-h-11 w-full rounded-lg border border-[#D1D5DB] bg-white pl-10 pr-10 text-sm text-[#15243B] outline-none placeholder:text-[#9CA3AF] focus:border-[#1F5FAE] focus:ring-1 focus:ring-[#1F5FAE]"
//               />

//               {searchQuery && (
//                 <button
//                   type="button"
//                   onClick={() => setSearchQuery("")}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#15243B]"
//                 >
//                   <Icon icon="lucide:x" className="text-lg" />
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* =================================================
//           TABLE CARD
//       ================================================= */}

//       <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
//         {/* TABLE HEADER */}

//         <div className="flex items-center justify-between border-b border-[#E5E7EB] p-4">
//           <div>
//             <h2 className="font-semibold text-[#15243B]">Students</h2>

//             <p className="mt-0.5 text-xs text-[#6B7280]">
//               {filteredStudents.length} student
//               {filteredStudents.length !== 1 ? "s" : ""}
//             </p>
//           </div>

//           {loading && (
//             <Icon
//               icon="lucide:loader-circle"
//               className="animate-spin text-xl text-[#1F5FAE]"
//             />
//           )}
//         </div>

//         {/* =================================================
//             TABLE
//         ================================================= */}

//         {filteredStudents.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[1000px] text-left">
//               <thead className="bg-[#F9FAFB]">
//                 <tr className="border-b border-[#E5E7EB]">
//                   <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
//                     Student
//                   </th>

//                   <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
//                     Admission No.
//                   </th>

//                   <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
//                     Roll No.
//                   </th>

//                   <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
//                     Class
//                   </th>

//                   <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
//                     Section
//                   </th>

//                   <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
//                     Enrollment
//                   </th>

//                   <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
//                     Contact
//                   </th>

//                   <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-[#E5E7EB]">
//                 {filteredStudents.map((student) => (
//                   <tr
//                     key={student._id}
//                     className="transition-colors hover:bg-[#F9FAFB]"
//                   >
//                     {/* STUDENT */}

//                     <td className="px-5 py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E8F0FB] text-sm font-bold uppercase text-[#1F5FAE]">
//                           {student.photo ? (
//                             <img
//                               src={student.photo}
//                               alt={student.name}
//                               className="h-full w-full object-cover"
//                             />
//                           ) : (
//                             student.name?.charAt(0) || "S"
//                           )}
//                         </div>

//                         <div className="min-w-0">
//                           <p className="truncate text-sm font-semibold text-[#15243B]">
//                             {student.name}
//                           </p>

//                           <p className="mt-0.5 truncate text-xs text-[#6B7280]">
//                             {student.email || "No email"}
//                           </p>
//                         </div>
//                       </div>
//                     </td>

//                     {/* ADMISSION NUMBER */}

//                     <td className="px-5 py-4 text-sm font-medium text-[#15243B]">
//                       {student.admissionNumber}
//                     </td>

//                     {/* ROLL */}

//                     <td className="px-5 py-4 text-sm text-[#6B7280]">
//                       {student.rollNumber ?? "-"}
//                     </td>

//                     {/* CLASS */}

//                     <td className="px-5 py-4 text-sm text-[#15243B]">
//                       {getRelationName(student.classId)}
//                     </td>

//                     {/* SECTION */}

//                     <td className="px-5 py-4 text-sm text-[#15243B]">
//                       {getRelationName(student.sectionId)}
//                     </td>

//                     {/* ENROLLMENT */}

//                     <td className="px-5 py-4">
//                       {student.enrollment ? (
//                         <div className="flex flex-col gap-1">
//                           <span
//                             className={`
//                                 inline-flex
//                                 w-fit
//                                 rounded-full
//                                 px-2.5
//                                 py-1
//                                 text-xs
//                                 font-semibold
//                                 ${
//                                   student.enrollment.enrollmentStatus ===
//                                   "ACTIVE"
//                                     ? "bg-emerald-50 text-emerald-700"
//                                     : student.enrollment.enrollmentStatus ===
//                                         "COMPLETED"
//                                       ? "bg-blue-50 text-blue-700"
//                                       : "bg-gray-100 text-gray-600"
//                                 }
//                               `}
//                           >
//                             {student.enrollment.enrollmentStatus}
//                           </span>

//                           {student.enrollment.promotionStatus !==
//                             "NOT_DECIDED" && (
//                             <span className="text-[11px] font-medium text-[#6B7280]">
//                               {student.enrollment.promotionStatus}
//                             </span>
//                           )}
//                         </div>
//                       ) : (
//                         <span className="text-sm text-[#9CA3AF]">-</span>
//                       )}
//                     </td>

//                     {/* CONTACT */}

//                     <td className="px-5 py-4">
//                       <p className="text-sm text-[#15243B]">
//                         {student.mobile || "-"}
//                       </p>
//                     </td>

//                     {/* ACTIONS */}

//                     <td className="px-5 py-4">
//                       <div className="flex items-center justify-end gap-1">
//                         {/* VIEW */}

//                         <button
//                           type="button"
//                           onClick={() => handleViewStudent(student)}
//                           title="View Student"
//                           className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6B7280] transition-colors hover:bg-[#E8F0FB] hover:text-[#1F5FAE]"
//                         >
//                           <Icon icon="lucide:eye" className="text-lg" />
//                         </button>

//                         {/* EDIT */}

//                         <button
//                           type="button"
//                           onClick={() => handleEditStudent(student)}
//                           title="Edit Student"
//                           className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6B7280] transition-colors hover:bg-[#F3F4F6] hover:text-[#15243B]"
//                         >
//                           <Icon icon="lucide:pencil" className="text-lg" />
//                         </button>

//                         {/*
//                          * DELETE intentionally nahi hai.
//                          *
//                          * Backend me currently:
//                          *
//                          * DELETE /students/:studentId
//                          *
//                          * route implemented nahi hai.
//                          */}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           /* =================================================
//              EMPTY STATE
//           ================================================= */

//           <div className="flex min-h-[350px] items-center justify-center px-5 py-10">
//             <div className="max-w-sm text-center">
//               <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F3F4F6] text-[#6B7280]">
//                 <Icon
//                   icon={searchQuery ? "lucide:search-x" : "lucide:users"}
//                   className="text-2xl"
//                 />
//               </div>

//               <h3 className="mt-4 font-semibold text-[#15243B]">
//                 {searchQuery ? "No students found" : "No students found"}
//               </h3>

//               <p className="mt-1 text-sm text-[#6B7280]">
//                 {searchQuery
//                   ? "Try another name, admission number, roll number, email or mobile."
//                   : classFilter !== "ALL" || sectionFilter !== "ALL"
//                     ? "No students are enrolled in the selected class or section."
//                     : `No students are enrolled in ${
//                         selectedSession?.name ?? "this academic session"
//                       }.`}
//               </p>

//               {!searchQuery &&
//                 classFilter === "ALL" &&
//                 sectionFilter === "ALL" && (
//                   <button
//                     type="button"
//                     onClick={() => navigate("/school-admin/students/add")}
//                     className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#1F5FAE] px-4 text-sm font-semibold text-white hover:bg-[#174F91]"
//                   >
//                     <Icon icon="lucide:user-plus" />
//                     Add Student
//                   </button>
//                 )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StudentList;












import React, { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getClasses } from "../../../features/academic/classes/class.slice";
import { getSections } from "../../../features/academic/sections/section.slice";
import { getSessions } from "../../../features/academic/sessions/session.slice";
import {
  clearStudents,
  getStudentsByEnrollment,
} from "../../../features/student/student.slice";
import type { Student } from "../../../features/student/student.types";

type Relation = string | { _id: string; name?: string };
type StudentWithStream = Student & {
  stream?: string;
  enrollment?: Student["enrollment"] & {
    rollNumber?: number;
    stream?: string;
  };
};

const relationId = (value?: Relation): string => {
  if (!value) return "";
  return typeof value === "string" ? value : value._id;
};

const relationName = (value?: Relation): string => {
  if (!value) return "—";
  return typeof value === "string" ? "—" : value.name || "—";
};

const prettyText = (value?: string): string => {
  if (!value) return "—";
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const StudentList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { students, loading, error } = useAppSelector(
    (state) => state.students,
  );
  const { sessions } = useAppSelector((state) => state.sessions);
  const { classes } = useAppSelector((state) => state.classes);
  const { sections } = useAppSelector((state) => state.sections);
  const { selectedSessionId } = useAppSelector(
    (state) => state.sessionSelection,
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("ALL");
  const [sectionFilter, setSectionFilter] = useState("ALL");

  const studentList: Student[] = Array.isArray(students) ? students : [];

  useEffect(() => {
    if (sessions.length === 0) {
      dispatch(getSessions());
    }
  }, [dispatch, sessions.length]);

  useEffect(() => {
    dispatch(clearStudents());
    setClassFilter("ALL");
    setSectionFilter("ALL");

    if (selectedSessionId) {
      dispatch(getClasses({ sessionId: selectedSessionId }));
    }
  }, [dispatch, selectedSessionId]);

  useEffect(() => {
    setSectionFilter("ALL");

    if (selectedSessionId && classFilter !== "ALL") {
      dispatch(
        getSections({
          sessionId: selectedSessionId,
          classId: classFilter,
        }),
      );
    }
  }, [dispatch, selectedSessionId, classFilter]);

  useEffect(() => {
    if (!selectedSessionId) return;

    dispatch(
      getStudentsByEnrollment({
        sessionId: selectedSessionId,
        ...(classFilter !== "ALL" ? { classId: classFilter } : {}),
        ...(sectionFilter !== "ALL" ? { sectionId: sectionFilter } : {}),
      }),
    );
  }, [dispatch, selectedSessionId, classFilter, sectionFilter]);

  const selectedSession = useMemo(
    () => sessions.find((session) => session._id === selectedSessionId) ?? null,
    [sessions, selectedSessionId],
  );

  const sessionClasses = useMemo(
    () =>
      !selectedSessionId
        ? []
        : classes.filter(
            (classItem) =>
              relationId(classItem.sessionId as Relation) === selectedSessionId,
          ),
    [classes, selectedSessionId],
  );

  const classSections = useMemo(
    () =>
      !selectedSessionId || classFilter === "ALL"
        ? []
        : sections.filter(
            (section) =>
              relationId(section.sessionId as Relation) === selectedSessionId &&
              relationId(section.classId as Relation) === classFilter,
          ),
    [sections, selectedSessionId, classFilter],
  );

  // Explicitly inactive student master records should not appear in active lists.
  const activeStudents = useMemo(
    () => studentList.filter((student) => student.status !== "INACTIVE"),
    [studentList],
  );

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return activeStudents;

    return activeStudents.filter((student) => {
      const record = student as StudentWithStream;
      const values = [
        student.name,
        student.admissionNumber,
        student.email,
        student.mobile,
        student.rollNumber,
        student.penNumber,
        student.apaarId,
        relationName(student.classId),
        relationName(student.sectionId),
        record.enrollment?.stream,
        record.stream,
      ];

      return values.some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(query),
      );
    });
  }, [activeStudents, searchQuery]);

  const classCount = useMemo(
    () =>
      new Set(
        activeStudents
          .map((student) => relationId(student.classId))
          .filter(Boolean),
      ).size,
    [activeStudents],
  );

  const sectionCount = useMemo(
    () =>
      new Set(
        activeStudents
          .map((student) => relationId(student.sectionId))
          .filter(Boolean),
      ).size,
    [activeStudents],
  );

  const hasFilters =
    classFilter !== "ALL" ||
    sectionFilter !== "ALL" ||
    searchQuery.trim() !== "";

  const resetFilters = () => {
    setSearchQuery("");
    setClassFilter("ALL");
    setSectionFilter("ALL");
  };

  const handleRetry = () => {
    if (!selectedSessionId) return;

    dispatch(
      getStudentsByEnrollment({
        sessionId: selectedSessionId,
        ...(classFilter !== "ALL" ? { classId: classFilter } : {}),
        ...(sectionFilter !== "ALL" ? { sectionId: sectionFilter } : {}),
      }),
    );
  };

  if (!selectedSessionId) {
    return (
      <PageState
        icon="lucide:calendar-search"
        title="Select an academic session"
        message="Select the required academic session from the topbar to view its students."
      />
    );
  }

  if (loading && studentList.length === 0) {
    return (
      <PageState
        icon="lucide:loader-circle"
        title="Loading students"
        message="Please wait while student records are being prepared."
        spin
      />
    );
  }

  return (
    <div className="min-h-full bg-slate-50 px-4 py-5 md:px-6 md:py-7 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <section className="relative overflow-hidden rounded-2xl border border-blue-900/10 bg-gradient-to-br from-[#102A56] via-[#174F91] to-[#2874C6] p-5 text-white shadow-[0_18px_45px_rgba(15,42,86,0.16)] md:p-7">
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-28 right-52 h-52 w-52 rounded-full bg-cyan-300/10" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-blue-100">
                <Icon icon="lucide:users-round" className="h-4 w-4" />
                Student Management
              </div>
              <h1 className="mt-2 text-2xl font-bold md:text-3xl">
                All Students
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
                View and manage active students for the selected academic
                session.
              </p>
              {selectedSession && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold backdrop-blur">
                  <Icon icon="lucide:calendar-days" className="h-4 w-4" />
                  {selectedSession.name}
                  {selectedSession.isCurrent && (
                    <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-emerald-100">
                      Current
                    </span>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => navigate("/school-admin/students/add")}
              className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-blue-700 shadow-sm transition hover:bg-blue-50"
            >
              <Icon icon="lucide:user-plus" className="h-5 w-5" />
              Add Student
            </button>
          </div>
        </section>

        {error && (
          <div className="mt-5 flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 sm:flex-row sm:items-center">
            <Icon
              icon="lucide:circle-alert"
              className="h-5 w-5 shrink-0 text-rose-600"
            />
            <div className="flex-1">
              <p className="text-sm font-bold text-rose-800">
                Failed to load students
              </p>
              <p className="mt-1 text-sm text-rose-700">{error}</p>
            </div>
            <button
              type="button"
              onClick={handleRetry}
              className="text-sm font-bold text-rose-700 hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <SummaryCard
            icon="lucide:users"
            label="Active Students"
            value={activeStudents.length}
            tone="blue"
          />
          <SummaryCard
            icon="lucide:school"
            label="Classes"
            value={classCount}
            tone="violet"
          />
          <SummaryCard
            icon="lucide:layers-3"
            label="Sections"
            value={sectionCount}
            tone="amber"
          />
          <SummaryCard
            icon="lucide:list-filter"
            label="Showing"
            value={filteredStudents.length}
            tone="emerald"
          />
        </div>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-slate-900">Find Students</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Filter by class and section, or search a student record.
              </p>
            </div>
            {hasFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:text-blue-800"
              >
                <Icon icon="lucide:rotate-ccw" className="h-4 w-4" />
                Reset
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FilterSelect
              label="Class"
              icon="lucide:school"
              value={classFilter}
              onChange={(value) => setClassFilter(value)}
            >
              <option value="ALL">All Classes</option>
              {sessionClasses.map((classItem) => (
                <option key={classItem._id} value={classItem._id}>
                  {classItem.name}
                </option>
              ))}
            </FilterSelect>

            <FilterSelect
              label="Section"
              icon="lucide:layers-3"
              value={sectionFilter}
              disabled={classFilter === "ALL"}
              onChange={(value) => setSectionFilter(value)}
            >
              <option value="ALL">
                {classFilter === "ALL"
                  ? "Select class first"
                  : "All Sections"}
              </option>
              {classSections.map((section) => (
                <option key={section._id} value={section._id}>
                  {section.name}
                </option>
              ))}
            </FilterSelect>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-600">
                Search
              </label>
              <div className="relative">
                <Icon
                  icon="lucide:search"
                  className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Name, admission, PEN, APAAR..."
                  className="min-h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    <Icon icon="lucide:x" className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 md:px-6">
            <div>
              <h2 className="font-bold text-slate-900">Student Records</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {filteredStudents.length} active{" "}
                {filteredStudents.length === 1 ? "student" : "students"}
              </p>
            </div>
            {loading && (
              <Icon
                icon="lucide:loader-circle"
                className="h-5 w-5 animate-spin text-blue-700"
              />
            )}
          </div>

          {filteredStudents.length > 0 ? (
            <>
              <div className="divide-y divide-slate-200 md:hidden">
                {filteredStudents.map((student) => (
                  <StudentMobileCard
                    key={student._id}
                    student={student}
                    onView={() =>
                      navigate(`/school-admin/students/${student._id}`)
                    }
                    onEdit={() =>
                      navigate(`/school-admin/students/${student._id}/edit`)
                    }
                  />
                ))}
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[1120px] text-left">
                  <thead className="bg-slate-50">
                    <tr className="border-b border-slate-200">
                      {[
                        "Student",
                        "Admission / PEN",
                        "Roll No.",
                        "Class & Section",
                        "Stream",
                        "Enrollment",
                        "Contact",
                        "Actions",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className={`px-5 py-3.5 text-[11px] font-extrabold uppercase tracking-wide text-slate-500 ${
                            heading === "Actions" ? "text-right" : ""
                          }`}
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredStudents.map((student) => (
                      <StudentTableRow
                        key={student._id}
                        student={student}
                        onView={() =>
                          navigate(`/school-admin/students/${student._id}`)
                        }
                        onEdit={() =>
                          navigate(
                            `/school-admin/students/${student._id}/edit`,
                          )
                        }
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <EmptyState
              filtered={hasFilters}
              sessionName={selectedSession?.name}
              onReset={resetFilters}
              onAdd={() => navigate("/school-admin/students/add")}
            />
          )}
        </section>
      </div>
    </div>
  );
};

const PageState = ({
  icon,
  title,
  message,
  spin = false,
}: {
  icon: string;
  title: string;
  message: string;
  spin?: boolean;
}) => (
  <div className="flex min-h-[520px] items-center justify-center bg-slate-50 p-5">
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
        <Icon icon={icon} className={`h-7 w-7 ${spin ? "animate-spin" : ""}`} />
      </div>
      <h2 className="mt-5 text-xl font-bold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">{message}</p>
    </div>
  </div>
);

const SummaryCard = ({
  icon,
  label,
  value,
  tone,
}: {
  icon: string;
  label: string;
  value: number;
  tone: "blue" | "violet" | "amber" | "emerald";
}) => {
  const tones = {
    blue: "bg-blue-50 text-blue-700",
    violet: "bg-violet-50 text-violet-700",
    amber: "bg-amber-50 text-amber-700",
    emerald: "bg-emerald-50 text-emerald-700",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon icon={icon} className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500">{label}</p>
          <p className="mt-0.5 text-2xl font-extrabold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

const FilterSelect = ({
  label,
  icon,
  value,
  disabled = false,
  onChange,
  children,
}: {
  label: string;
  icon: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) => (
  <div>
    <label className="mb-1.5 block text-xs font-bold text-slate-600">{label}</label>
    <div className="relative">
      <Icon
        icon={icon}
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
      />
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 w-full appearance-none rounded-xl border border-slate-300 bg-white pl-10 pr-9 text-sm font-medium text-slate-900 outline-none transition disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      >
        {children}
      </select>
      <Icon
        icon="lucide:chevron-down"
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
      />
    </div>
  </div>
);

const StudentAvatar = ({ student }: { student: Student }) => {
  const initial = student.name?.trim().charAt(0).toUpperCase() || "S";

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-blue-100 bg-blue-50 text-sm font-extrabold text-blue-700">
      {student.photo ? (
        <img
          src={student.photo}
          alt={student.name || "Student"}
          className="h-full w-full object-cover"
        />
      ) : (
        initial
      )}
    </div>
  );
};

const enrollmentStatus = (student: Student): string =>
  student.enrollment?.enrollmentStatus ?? "ACTIVE";

const EnrollmentBadge = ({ student }: { student: Student }) => {
  const status = enrollmentStatus(student);
  const tone =
    status === "ACTIVE"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "COMPLETED"
        ? "border-blue-200 bg-blue-50 text-blue-700"
        : "border-slate-200 bg-slate-100 text-slate-600";

  return (
    <div>
      <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-extrabold ${tone}`}>
        {prettyText(status)}
      </span>
      {student.enrollment?.promotionStatus &&
        student.enrollment.promotionStatus !== "NOT_DECIDED" && (
          <p className="mt-1 text-[11px] font-semibold text-slate-500">
            {prettyText(student.enrollment.promotionStatus)}
          </p>
        )}
    </div>
  );
};

const getStudentRoll = (student: Student): number | undefined => {
  const record = student as StudentWithStream;
  return record.enrollment?.rollNumber ?? student.rollNumber;
};

const getStudentStream = (student: Student): string | undefined => {
  const record = student as StudentWithStream;
  return record.enrollment?.stream ?? record.stream;
};

const StudentTableRow = ({
  student,
  onView,
  onEdit,
}: {
  student: Student;
  onView: () => void;
  onEdit: () => void;
}) => (
  <tr className="transition hover:bg-blue-50/30">
    <td className="px-5 py-4">
      <div className="flex items-center gap-3">
        <StudentAvatar student={student} />
        <div className="min-w-0">
          <p className="max-w-[210px] truncate text-sm font-bold text-slate-900">
            {student.name || "Unnamed Student"}
          </p>
          <p className="mt-0.5 max-w-[210px] truncate text-xs text-slate-500">
            {student.email || "No email"}
          </p>
        </div>
      </div>
    </td>
    <td className="px-5 py-4">
      <p className="text-sm font-bold text-slate-800">
        {student.admissionNumber || "—"}
      </p>
      <p className="mt-1 text-xs text-slate-500">
        PEN: {student.penNumber || "—"}
      </p>
    </td>
    <td className="px-5 py-4 text-sm font-semibold text-slate-700">
      {getStudentRoll(student) ?? "—"}
    </td>
    <td className="px-5 py-4">
      <p className="text-sm font-bold text-slate-800">
        {relationName(student.classId)}
      </p>
      <p className="mt-1 text-xs text-slate-500">
        Section {relationName(student.sectionId)}
      </p>
    </td>
    <td className="px-5 py-4 text-sm font-semibold text-slate-700">
      {prettyText(getStudentStream(student))}
    </td>
    <td className="px-5 py-4">
      <EnrollmentBadge student={student} />
    </td>
    <td className="px-5 py-4">
      <p className="text-sm font-semibold text-slate-700">
        {student.mobile || "—"}
      </p>
      <p className="mt-1 max-w-[180px] truncate text-xs text-slate-500">
        APAAR: {student.apaarId || "—"}
      </p>
    </td>
    <td className="px-5 py-4">
      <div className="flex items-center justify-end gap-2">
        <ActionButton icon="lucide:eye" label="View student" onClick={onView} />
        <ActionButton icon="lucide:pencil" label="Edit student" onClick={onEdit} />
      </div>
    </td>
  </tr>
);

const StudentMobileCard = ({
  student,
  onView,
  onEdit,
}: {
  student: Student;
  onView: () => void;
  onEdit: () => void;
}) => (
  <article className="p-4">
    <div className="flex items-start gap-3">
      <StudentAvatar student={student} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-slate-900">
              {student.name || "Unnamed Student"}
            </h3>
            <p className="mt-0.5 truncate text-xs text-slate-500">
              {student.admissionNumber || "No admission number"}
            </p>
          </div>
          <EnrollmentBadge student={student} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 text-xs">
          <MobileValue
            label="Class"
            value={`${relationName(student.classId)} - ${relationName(
              student.sectionId,
            )}`}
          />
          <MobileValue label="Roll No." value={getStudentRoll(student) ?? "—"} />
          <MobileValue label="Stream" value={prettyText(getStudentStream(student))} />
          <MobileValue label="Mobile" value={student.mobile || "—"} />
        </div>

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={onView}
            className="inline-flex min-h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 text-xs font-bold text-blue-700"
          >
            <Icon icon="lucide:eye" className="h-4 w-4" />
            View
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex min-h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700"
          >
            <Icon icon="lucide:pencil" className="h-4 w-4" />
            Edit
          </button>
        </div>
      </div>
    </div>
  </article>
);

const MobileValue = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="min-w-0">
    <p className="text-slate-500">{label}</p>
    <p className="mt-1 truncate font-bold text-slate-800">{value}</p>
  </div>
);

const ActionButton = ({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={label}
    aria-label={label}
    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
  >
    <Icon icon={icon} className="h-4 w-4" />
  </button>
);

const EmptyState = ({
  filtered,
  sessionName,
  onReset,
  onAdd,
}: {
  filtered: boolean;
  sessionName?: string;
  onReset: () => void;
  onAdd: () => void;
}) => (
  <div className="flex min-h-[340px] items-center justify-center p-6">
    <div className="max-w-sm text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
        <Icon icon={filtered ? "lucide:search-x" : "lucide:users"} className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-slate-900">
        {filtered ? "No matching students" : "No active students found"}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        {filtered
          ? "Try changing the search text, class or section filter."
          : `No active student is enrolled in ${sessionName || "this session"}.`}
      </p>
      <button
        type="button"
        onClick={filtered ? onReset : onAdd}
        className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-bold text-white transition hover:bg-blue-800"
      >
        <Icon icon={filtered ? "lucide:rotate-ccw" : "lucide:user-plus"} className="h-4 w-4" />
        {filtered ? "Reset Filters" : "Add Student"}
      </button>
    </div>
  </div>
);

export default StudentList;
