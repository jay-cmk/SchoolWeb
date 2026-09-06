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














import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import { Icon } from "@iconify/react";

import {
  clearStudents,
  getStudentsByEnrollment,
} from "../../../features/student/student.slice";

import type {
  Student,
} from "../../../features/student/student.types";

import {
  getSessions,
} from "../../../features/academic/sessions/session.slice";

import {
  getClasses,
} from "../../../features/academic/classes/class.slice";

import {
  getSections,
} from "../../../features/academic/sections/section.slice";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks";


const StudentList: React.FC = () => {

  const dispatch =
    useAppDispatch();

  const navigate =
    useNavigate();


  /* =====================================================
     REDUX
  ===================================================== */

  const {
    students,
    loading,
    error,
  } = useAppSelector(
    (state) => state.students
  );


  const {
    sessions,
  } = useAppSelector(
    (state) => state.sessions
  );


  const {
    classes,
  } = useAppSelector(
    (state) => state.classes
  );


  const {
    sections,
  } = useAppSelector(
    (state) => state.sections
  );


  const {
    selectedSessionId,
  } = useAppSelector(
    (state) =>
      state.sessionSelection
  );


  /* =====================================================
     SAFE STUDENT LIST
  ===================================================== */

  const studentList: Student[] =
    Array.isArray(students)
      ? students
      : [];


  /* =====================================================
     LOCAL STATE
  ===================================================== */

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");


  const [
    classFilter,
    setClassFilter,
  ] = useState("ALL");


  const [
    sectionFilter,
    setSectionFilter,
  ] = useState("ALL");


  /* =====================================================
     INITIAL ACADEMIC DATA
  ===================================================== */

  useEffect(() => {

    if (sessions.length === 0) {
      dispatch(
        getSessions()
      );
    }

  }, [
    dispatch,
    sessions.length,
  ]);


  /* =====================================================
     LOAD CLASSES BY GLOBAL SESSION
  ===================================================== */

  useEffect(() => {

    dispatch(
      clearStudents()
    );

    setClassFilter("ALL");

    setSectionFilter("ALL");


    if (!selectedSessionId) {
      return;
    }


    dispatch(
      getClasses({
        sessionId:
          selectedSessionId,
      })
    );

  }, [
    dispatch,
    selectedSessionId,
  ]);


  /* =====================================================
     LOAD SECTIONS
  ===================================================== */

  useEffect(() => {

    setSectionFilter("ALL");


    if (
      !selectedSessionId ||
      classFilter === "ALL"
    ) {
      return;
    }


    dispatch(
      getSections({
        sessionId:
          selectedSessionId,

        classId:
          classFilter,
      })
    );

  }, [
    dispatch,
    selectedSessionId,
    classFilter,
  ]);


  /* =====================================================
     LOAD STUDENTS BY ENROLLMENT

     IMPORTANT:

     sessionId always global selected session.

     This reads StudentEnrollment instead of
     Student current academic snapshot.

     So previous session students remain visible
     even after promotion.
  ===================================================== */

  useEffect(() => {

    if (!selectedSessionId) {
      return;
    }


    const filters = {
      sessionId:
        selectedSessionId,
    } as {
      sessionId: string;
      classId?: string;
      sectionId?: string;
    };


    if (classFilter !== "ALL") {
      filters.classId =
        classFilter;
    }


    if (sectionFilter !== "ALL") {
      filters.sectionId =
        sectionFilter;
    }


    dispatch(
      getStudentsByEnrollment(
        filters
      )
    );

  }, [
    dispatch,
    selectedSessionId,
    classFilter,
    sectionFilter,
  ]);


  /* =====================================================
     SELECTED SESSION
  ===================================================== */

  const selectedSession =
    useMemo(
      () =>
        sessions.find(
          (session) =>
            session._id ===
            selectedSessionId
        ) ?? null,
      [
        sessions,
        selectedSessionId,
      ]
    );


  /* =====================================================
     SESSION CLASSES

     Defensive frontend filtering too.
  ===================================================== */

  const sessionClasses =
    useMemo(() => {

      if (!selectedSessionId) {
        return [];
      }


      return classes.filter(
        (classItem) =>
          classItem.sessionId ===
          selectedSessionId
      );

    }, [
      classes,
      selectedSessionId,
    ]);


  /* =====================================================
     CLASS SECTIONS
  ===================================================== */

  const classSections =
    useMemo(() => {

      if (
        !selectedSessionId ||
        classFilter === "ALL"
      ) {
        return [];
      }


      return sections.filter(
        (section) =>
          section.sessionId ===
            selectedSessionId &&
          section.classId ===
            classFilter
      );

    }, [
      sections,
      selectedSessionId,
      classFilter,
    ]);


  /* =====================================================
     HELPERS
  ===================================================== */

  const getRelationName = (
    relation:
      | string
      | {
          _id: string;
          name?: string;
        }
  ) => {

    if (
      typeof relation ===
      "string"
    ) {
      return "-";
    }


    return (
      relation?.name ||
      "-"
    );
  };


  /* =====================================================
     SEARCH

     Backend already supports search.

     But current UI search is kept client-side
     so typing does not hit API on every keypress.
  ===================================================== */

  const filteredStudents =
    useMemo(() => {

      const query =
        searchQuery
          .trim()
          .toLowerCase();


      if (!query) {
        return studentList;
      }


      return studentList.filter(
        (student) => {

          const name =
            student.name
              ?.toLowerCase() ||
            "";


          const admissionNumber =
            student
              .admissionNumber
              ?.toLowerCase() ||
            "";


          const email =
            student.email
              ?.toLowerCase() ||
            "";


          const mobile =
            student.mobile ||
            "";


          const rollNumber =
            student.rollNumber
              ?.toString() ||
            "";


          return (
            name.includes(query) ||
            admissionNumber.includes(
              query
            ) ||
            email.includes(query) ||
            mobile.includes(query) ||
            rollNumber.includes(query)
          );
        }
      );

    }, [
      studentList,
      searchQuery,
    ]);


  /* =====================================================
     VIEW STUDENT
  ===================================================== */

  const handleViewStudent = (
    student: Student
  ) => {

    navigate(
      `/school-admin/students/${student._id}`
    );
  };


  /* =====================================================
     EDIT STUDENT
  ===================================================== */

  const handleEditStudent = (
    student: Student
  ) => {

    navigate(
      `/school-admin/students/${student._id}/edit`
    );
  };


  /* =====================================================
     RETRY
  ===================================================== */

  const handleRetry = () => {

    if (!selectedSessionId) {
      return;
    }


    const filters = {
      sessionId:
        selectedSessionId,
    } as {
      sessionId: string;
      classId?: string;
      sectionId?: string;
    };


    if (classFilter !== "ALL") {
      filters.classId =
        classFilter;
    }


    if (sectionFilter !== "ALL") {
      filters.sectionId =
        sectionFilter;
    }


    dispatch(
      getStudentsByEnrollment(
        filters
      )
    );
  };


  /* =====================================================
     NO SELECTED SESSION
  ===================================================== */

  if (!selectedSessionId) {

    return (

      <div className="min-h-full bg-[#F7F9FC] p-4 md:p-6 lg:p-8">

        <div className="flex min-h-[500px] items-center justify-center">

          <div className="max-w-md text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F0FB] text-[#1F5FAE]">

              <Icon
                icon="lucide:calendar-days"
                className="text-2xl"
              />

            </div>


            <h2 className="mt-4 text-lg font-bold text-[#15243B]">

              Select Academic Session

            </h2>


            <p className="mt-2 text-sm leading-6 text-[#6B7280]">

              Please select an academic
              session from the topbar to
              view students.

            </p>

          </div>

        </div>

      </div>

    );
  }


  /* =====================================================
     LOADING
  ===================================================== */

  if (
    loading &&
    studentList.length === 0
  ) {

    return (

      <div className="flex min-h-[500px] items-center justify-center">

        <div className="text-center">

          <Icon
            icon="lucide:loader-circle"
            className="mx-auto animate-spin text-4xl text-[#1F5FAE]"
          />


          <p className="mt-3 text-sm font-medium text-[#6B7280]">

            Loading students...

          </p>

        </div>

      </div>

    );
  }


  /* =====================================================
     UI
  ===================================================== */

  return (

    <div className="min-h-full bg-[#F7F9FC] p-4 md:p-6 lg:p-8">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <div className="mb-1 flex items-center gap-2 text-sm text-[#6B7280]">

            <span>
              Students
            </span>

            <Icon
              icon="lucide:chevron-right"
              className="text-sm"
            />

            <span className="text-[#15243B]">
              All Students
            </span>

          </div>


          <h1 className="text-2xl font-bold text-[#15243B] md:text-3xl">

            Students

          </h1>


          <p className="mt-1 text-sm text-[#6B7280]">

            View students for the
            selected academic session.

          </p>


          {selectedSession && (

            <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-[#D7E3F4] bg-[#EEF4FC] px-3 py-1.5 text-xs font-semibold text-[#1F5FAE]">

              <Icon
                icon="lucide:calendar-days"
              />

              {selectedSession.name}

              {selectedSession.isCurrent && (

                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">

                  CURRENT

                </span>

              )}

            </div>

          )}

        </div>


        <button
          type="button"
          onClick={() =>
            navigate(
              "/school-admin/students/add"
            )
          }
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#1F5FAE] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#174F91]"
        >

          <Icon
            icon="lucide:user-plus"
            className="text-lg"
          />

          Add Student

        </button>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">

          <Icon
            icon="lucide:circle-alert"
            className="mt-0.5 shrink-0 text-xl text-red-500"
          />


          <div className="flex-1">

            <p className="text-sm font-semibold text-red-700">

              Failed to load students

            </p>

            <p className="mt-1 text-sm text-red-600">

              {error}

            </p>

          </div>


          <button
            type="button"
            onClick={handleRetry}
            className="text-sm font-semibold text-red-700 hover:underline"
          >

            Retry

          </button>

        </div>

      )}


      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">

          <div className="flex items-center gap-4">

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#E8F0FB] text-[#1F5FAE]">

              <Icon
                icon="lucide:users"
                className="text-xl"
              />

            </div>


            <div>

              <p className="text-sm text-[#6B7280]">

                Total Students

              </p>

              <p className="text-2xl font-bold text-[#15243B]">

                {studentList.length}

              </p>

            </div>

          </div>

        </div>


        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">

          <div className="flex items-center gap-4">

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#F3F4F6] text-[#15243B]">

              <Icon
                icon="lucide:search"
                className="text-xl"
              />

            </div>


            <div>

              <p className="text-sm text-[#6B7280]">

                Showing

              </p>

              <p className="text-2xl font-bold text-[#15243B]">

                {filteredStudents.length}

              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          FILTERS
      ================================================= */}

      <div className="mb-5 rounded-xl border border-[#E5E7EB] bg-white p-4">

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">


          {/* CLASS FILTER */}

          <div>

            <label className="mb-1.5 block text-xs font-semibold text-[#6B7280]">

              Class

            </label>

            <select
              value={classFilter}
              onChange={(event) =>
                setClassFilter(
                  event.target.value
                )
              }
              className="min-h-11 w-full rounded-lg border border-[#D1D5DB] bg-white px-3 text-sm text-[#15243B] outline-none focus:border-[#1F5FAE] focus:ring-1 focus:ring-[#1F5FAE]"
            >

              <option value="ALL">
                All Classes
              </option>

              {sessionClasses.map(
                (classItem) => (

                  <option
                    key={classItem._id}
                    value={classItem._id}
                  >
                    {classItem.name}
                  </option>

                )
              )}

            </select>

          </div>


          {/* SECTION FILTER */}

          <div>

            <label className="mb-1.5 block text-xs font-semibold text-[#6B7280]">

              Section

            </label>

            <select
              value={sectionFilter}
              disabled={
                classFilter === "ALL"
              }
              onChange={(event) =>
                setSectionFilter(
                  event.target.value
                )
              }
              className="min-h-11 w-full rounded-lg border border-[#D1D5DB] bg-white px-3 text-sm text-[#15243B] outline-none disabled:cursor-not-allowed disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF] focus:border-[#1F5FAE] focus:ring-1 focus:ring-[#1F5FAE]"
            >

              <option value="ALL">
                All Sections
              </option>

              {classSections.map(
                (section) => (

                  <option
                    key={section._id}
                    value={section._id}
                  >
                    {section.name}
                  </option>

                )
              )}

            </select>

          </div>


          {/* SEARCH */}

          <div>

            <label className="mb-1.5 block text-xs font-semibold text-[#6B7280]">

              Search

            </label>


            <div className="relative">

              <Icon
                icon="lucide:search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-[#6B7280]"
              />


              <input
                type="text"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value
                  )
                }
                placeholder="Name, admission, roll..."
                className="min-h-11 w-full rounded-lg border border-[#D1D5DB] bg-white pl-10 pr-10 text-sm text-[#15243B] outline-none placeholder:text-[#9CA3AF] focus:border-[#1F5FAE] focus:ring-1 focus:ring-[#1F5FAE]"
              />


              {searchQuery && (

                <button
                  type="button"
                  onClick={() =>
                    setSearchQuery("")
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#15243B]"
                >

                  <Icon
                    icon="lucide:x"
                    className="text-lg"
                  />

                </button>

              )}

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          TABLE CARD
      ================================================= */}

      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">


        {/* TABLE HEADER */}

        <div className="flex items-center justify-between border-b border-[#E5E7EB] p-4">

          <div>

            <h2 className="font-semibold text-[#15243B]">

              Students

            </h2>

            <p className="mt-0.5 text-xs text-[#6B7280]">

              {filteredStudents.length}
              {" "}
              student
              {
                filteredStudents.length !==
                1
                  ? "s"
                  : ""
              }

            </p>

          </div>


          {loading && (

            <Icon
              icon="lucide:loader-circle"
              className="animate-spin text-xl text-[#1F5FAE]"
            />

          )}

        </div>


        {/* =================================================
            TABLE
        ================================================= */}

        {filteredStudents.length > 0 ? (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px] text-left">

              <thead className="bg-[#F9FAFB]">

                <tr className="border-b border-[#E5E7EB]">

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
                    Class
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                    Section
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                    Enrollment
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                    Contact
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-[#E5E7EB]">

                {filteredStudents.map(
                  (student) => (

                    <tr
                      key={student._id}
                      className="transition-colors hover:bg-[#F9FAFB]"
                    >


                      {/* STUDENT */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E8F0FB] text-sm font-bold uppercase text-[#1F5FAE]">

                            {student.photo ? (

                              <img
                                src={student.photo}
                                alt={student.name}
                                className="h-full w-full object-cover"
                              />

                            ) : (

                              student.name
                                ?.charAt(0) ||
                              "S"

                            )}

                          </div>


                          <div className="min-w-0">

                            <p className="truncate text-sm font-semibold text-[#15243B]">

                              {student.name}

                            </p>

                            <p className="mt-0.5 truncate text-xs text-[#6B7280]">

                              {
                                student.email ||
                                "No email"
                              }

                            </p>

                          </div>

                        </div>

                      </td>


                      {/* ADMISSION NUMBER */}

                      <td className="px-5 py-4 text-sm font-medium text-[#15243B]">

                        {
                          student
                            .admissionNumber
                        }

                      </td>


                      {/* ROLL */}

                      <td className="px-5 py-4 text-sm text-[#6B7280]">

                        {
                          student.rollNumber ??
                          "-"
                        }

                      </td>


                      {/* CLASS */}

                      <td className="px-5 py-4 text-sm text-[#15243B]">

                        {
                          getRelationName(
                            student.classId
                          )
                        }

                      </td>


                      {/* SECTION */}

                      <td className="px-5 py-4 text-sm text-[#15243B]">

                        {
                          getRelationName(
                            student.sectionId
                          )
                        }

                      </td>


                      {/* ENROLLMENT */}

                      <td className="px-5 py-4">

                        {student.enrollment ? (

                          <div className="flex flex-col gap-1">

                            <span
                              className={`
                                inline-flex
                                w-fit
                                rounded-full
                                px-2.5
                                py-1
                                text-xs
                                font-semibold
                                ${
                                  student.enrollment
                                    .enrollmentStatus ===
                                  "ACTIVE"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : student.enrollment
                                          .enrollmentStatus ===
                                        "COMPLETED"
                                      ? "bg-blue-50 text-blue-700"
                                      : "bg-gray-100 text-gray-600"
                                }
                              `}
                            >

                              {
                                student.enrollment
                                  .enrollmentStatus
                              }

                            </span>


                            {student.enrollment
                              .promotionStatus !==
                              "NOT_DECIDED" && (

                              <span className="text-[11px] font-medium text-[#6B7280]">

                                {
                                  student.enrollment
                                    .promotionStatus
                                }

                              </span>

                            )}

                          </div>

                        ) : (

                          <span className="text-sm text-[#9CA3AF]">
                            -
                          </span>

                        )}

                      </td>


                      {/* CONTACT */}

                      <td className="px-5 py-4">

                        <p className="text-sm text-[#15243B]">

                          {
                            student.mobile ||
                            "-"
                          }

                        </p>

                      </td>


                      {/* ACTIONS */}

                      <td className="px-5 py-4">

                        <div className="flex items-center justify-end gap-1">


                          {/* VIEW */}

                          <button
                            type="button"
                            onClick={() =>
                              handleViewStudent(
                                student
                              )
                            }
                            title="View Student"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6B7280] transition-colors hover:bg-[#E8F0FB] hover:text-[#1F5FAE]"
                          >

                            <Icon
                              icon="lucide:eye"
                              className="text-lg"
                            />

                          </button>


                          {/* EDIT */}

                          <button
                            type="button"
                            onClick={() =>
                              handleEditStudent(
                                student
                              )
                            }
                            title="Edit Student"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6B7280] transition-colors hover:bg-[#F3F4F6] hover:text-[#15243B]"
                          >

                            <Icon
                              icon="lucide:pencil"
                              className="text-lg"
                            />

                          </button>


                          {/*
                           * DELETE intentionally nahi hai.
                           *
                           * Backend me currently:
                           *
                           * DELETE /students/:studentId
                           *
                           * route implemented nahi hai.
                           */}

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        ) : (

          /* =================================================
             EMPTY STATE
          ================================================= */

          <div className="flex min-h-[350px] items-center justify-center px-5 py-10">

            <div className="max-w-sm text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F3F4F6] text-[#6B7280]">

                <Icon
                  icon={
                    searchQuery
                      ? "lucide:search-x"
                      : "lucide:users"
                  }
                  className="text-2xl"
                />

              </div>


              <h3 className="mt-4 font-semibold text-[#15243B]">

                {
                  searchQuery
                    ? "No students found"
                    : "No students found"
                }

              </h3>


              <p className="mt-1 text-sm text-[#6B7280]">

                {searchQuery
                  ? "Try another name, admission number, roll number, email or mobile."
                  : classFilter !== "ALL" ||
                      sectionFilter !== "ALL"
                    ? "No students are enrolled in the selected class or section."
                    : `No students are enrolled in ${
                        selectedSession?.name ??
                        "this academic session"
                      }.`}

              </p>


              {!searchQuery &&
                classFilter === "ALL" &&
                sectionFilter === "ALL" && (

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        "/school-admin/students/add"
                      )
                    }
                    className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#1F5FAE] px-4 text-sm font-semibold text-white hover:bg-[#174F91]"
                  >

                    <Icon
                      icon="lucide:user-plus"
                    />

                    Add Student

                  </button>

                )}

            </div>

          </div>

        )}

      </div>

    </div>

  );
};


export default StudentList;
