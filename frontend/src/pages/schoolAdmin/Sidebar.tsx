// import React, { useEffect, useState } from "react";

// import { Icon } from "@iconify/react";

// import { useLocation, useNavigate } from "react-router-dom";

// interface SidebarProps {
//   isOpen: boolean;

//   onClose: () => void;

//   currentTab: string;

//   setCurrentTab: (tab: string) => void;
// }

// const Sidebar: React.FC<SidebarProps> = ({
//   isOpen,
//   onClose,
//   currentTab,
//   setCurrentTab,
// }) => {
//   const navigate = useNavigate();

//   const location = useLocation();

//   // ============================================
//   // COLLAPSIBLE STATES
//   // ============================================

//   const [isAcademicOpen, setIsAcademicOpen] = useState(false);

//   const [isStudentsOpen, setIsStudentsOpen] = useState(false);

//   const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);

//   const [isTimetableOpen, setIsTimetableOpen] = useState(false);

//   // ============================================
//   // DASHBOARD
//   // ============================================

//   const dashboardItems = [
//     {
//       id: "dashboard",

//       label: "Dashboard",

//       icon: "lucide:layout-dashboard",

//       path: "/school-admin/dashboard",
//     },
//   ];

//   // ============================================
//   // ACADEMIC ITEMS
//   // ============================================

//   const academicItems = [
//     {
//       id: "sessions",

//       label: "Sessions",

//       icon: "lucide:calendar-range",

//       path: "/school-admin/academic/sessions",
//     },

//     {
//       id: "classes",

//       label: "Classes",

//       icon: "lucide:building-2",

//       path: "/school-admin/academic/classes",
//     },

//     {
//       id: "sections",

//       label: "Sections",

//       icon: "lucide:layers",

//       path: "/school-admin/academic/sections",
//     },

//     {
//       id: "subjects",

//       label: "Subjects",

//       icon: "lucide:book-open",

//       path: "/school-admin/academic/subjects",
//     },

//     {
//       id: "assignment",

//       label: "Assignment",

//       icon: "lucide:graduation-cap",

//       path: "/school-admin/academic/subject-assignments",
//     },
//   ];

//   // ============================================
//   // STUDENT ITEMS
//   // ============================================

//   const studentItems = [
//     {
//       id: "all-students",

//       label: "All Students",

//       icon: "lucide:users",

//       path: "/school-admin/students",
//     },

//     {
//       id: "add-student",

//       label: "Add Student",

//       icon: "lucide:user-plus",

//       path: "/school-admin/students/add",
//     },

//     {
//       id: "class-wise-students",

//       label: "Class-wise Students",

//       icon: "lucide:school",

//       path: "/school-admin/students/class-wise",
//     },
//   ];

//   // ============================================
//   // ATTENDANCE ITEMS
//   // ============================================

//   const attendanceItems = [
//     {
//       id: "mark-attendance",

//       label: "Mark Attendance",

//       icon: "lucide:user-check",

//       path: "/school-admin/attendance/mark",
//     },

//     {
//       id: "daily-attendance",

//       label: "Daily Attendance",

//       icon: "lucide:calendar-days",

//       path: "/school-admin/attendance/daily",
//     },

//     {
//       id: "monthly-attendance",

//       label: "Monthly Attendance",

//       icon: "lucide:calendar-range",

//       path: "/school-admin/attendance/monthly",
//     },
//   ];

//   // ============================================
//   // TIMETABLE ITEMS
//   // ============================================

//   const timetableItems = [
//     {
//       id: "weekly-timetable",

//       label: "Weekly Timetable",

//       icon: "lucide:calendar-range",

//       path: "/school-admin/timetable/weekly",
//     },

//     {
//       id: "daily-timetable",

//       label: "Daily Timetable",

//       icon: "lucide:calendar-days",

//       path: "/school-admin/timetable/daily",
//     },

//     {
//       id: "teacher-timetable",

//       label: "Teacher Timetable",

//       icon: "lucide:user-round",

//       path: "/school-admin/timetable/teacher",
//     },
//   ];

//   // ============================================
//   // OTHER ITEMS
//   // ============================================

//   const otherItems = [
//     {
//       id: "teachers",

//       label: "Teachers",

//       icon: "lucide:graduation-cap",

//       path: "/school-admin/teachers",
//     },

//     {
//       id: "homework",

//       label: "Homework",

//       icon: "lucide:clipboard-list",

//       path: "/school-admin/homework",
//     },

//     {
//       id: "exams",

//       label: "Exams",

//       icon: "lucide:file-text",

//       path: "/school-admin/exams",
//     },

//     {
//       id: "results",

//       label: "Results",

//       icon: "lucide:chart-bar",

//       path: "/school-admin/results",
//     },

//     {
//       id: "fees",

//       label: "Fees",

//       icon: "lucide:credit-card",

//       path: "/school-admin/fees",
//     },

//     {
//       id: "notices",

//       label: "Notices",

//       icon: "lucide:megaphone",

//       path: "/school-admin/notices",
//     },

//     {
//       id: "parents",

//       label: "Parents",

//       icon: "lucide:heart",

//       path: "/school-admin/parents",
//     },

//     {
//       id: "staff",

//       label: "Staff",

//       icon: "lucide:briefcase-business",

//       path: "/school-admin/staff",
//     },

//     {
//       id: "reports",

//       label: "Reports",

//       icon: "lucide:chart-bar",

//       path: "/school-admin/reports",
//     },

//     {
//       id: "settings",

//       label: "Settings",

//       icon: "lucide:settings",

//       path: "/school-admin/settings",
//     },
//   ];

//   // ============================================
//   // NAVIGATION
//   // ============================================

//   const handleNavigation = (id: string, path: string) => {
//     setCurrentTab(id);

//     navigate(path);

//     onClose();
//   };

//   // ============================================
//   // ACTIVE GROUP CHECK
//   // ============================================

//   const isAcademicActive = location.pathname.startsWith(
//     "/school-admin/academic",
//   );

//   const isStudentsActive = location.pathname.startsWith(
//     "/school-admin/students",
//   );

//   const isAttendanceActive = location.pathname.startsWith(
//     "/school-admin/attendance",
//   );

//   const isTimetableActive = location.pathname.startsWith(
//     "/school-admin/timetable",
//   );

//   // ============================================
//   // HOMEWORK ACTIVE
//   // ============================================

//   const isHomeworkActive = location.pathname.startsWith(
//     "/school-admin/homework",
//   );

//   // ============================================
//   // AUTO OPEN ACADEMIC
//   // ============================================

//   useEffect(() => {
//     if (isAcademicActive) {
//       setIsAcademicOpen(true);
//     }
//   }, [isAcademicActive]);

//   // ============================================
//   // AUTO OPEN STUDENTS
//   // ============================================

//   useEffect(() => {
//     if (isStudentsActive) {
//       setIsStudentsOpen(true);
//     }
//   }, [isStudentsActive]);

//   // ============================================
//   // AUTO OPEN ATTENDANCE
//   // ============================================

//   useEffect(() => {
//     if (isAttendanceActive) {
//       setIsAttendanceOpen(true);
//     }
//   }, [isAttendanceActive]);

//   // ============================================
//   // AUTO OPEN TIMETABLE
//   // ============================================

//   useEffect(() => {
//     if (isTimetableActive) {
//       setIsTimetableOpen(true);
//     }
//   }, [isTimetableActive]);

//   // ============================================
//   // SYNC CURRENT TAB WITH STUDENT ROUTES
//   // ============================================

//   useEffect(() => {
//     if (location.pathname === "/school-admin/students") {
//       setCurrentTab("all-students");

//       return;
//     }

//     if (location.pathname.startsWith("/school-admin/students/add")) {
//       setCurrentTab("add-student");

//       return;
//     }

//     if (location.pathname.startsWith("/school-admin/students/class-wise")) {
//       setCurrentTab("class-wise-students");
//     }
//   }, [location.pathname, setCurrentTab]);

//   // ============================================
//   // KEEP HOMEWORK ACTIVE ON CHILD ROUTES
//   // ============================================

//   useEffect(() => {
//     if (isHomeworkActive) {
//       setCurrentTab("homework");
//     }
//   }, [isHomeworkActive, setCurrentTab]);

//   return (
//     <>
//       {/* ========================================
//           MOBILE OVERLAY
//       ======================================== */}

//       {isOpen && (
//         <div
//           className="
//             fixed
//             inset-0
//             z-40
//             bg-black/40

//             lg:hidden
//           "
//           onClick={onClose}
//         />
//       )}

//       {/* ========================================
//           SIDEBAR
//       ======================================== */}

//       <aside
//         className={`
//           fixed
//           inset-y-0
//           left-0
//           z-50

//           flex
//           w-72
//           flex-col

//           border-r
//           border-[#E5E7EB]

//           bg-white

//           transition-all
//           duration-300
//           ease-in-out

//           lg:relative
//           lg:h-full
//           lg:translate-x-0

//           ${isOpen ? "translate-x-0" : "-translate-x-full"}
//         `}
//       >
//         {/* ======================================
//             HEADER
//         ====================================== */}

//         <div
//           className="
//             flex
//             shrink-0
//             items-center
//             justify-between

//             border-b
//             border-[#E5E7EB]

//             px-5
//             py-5
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
//                 h-11
//                 w-11
//                 items-center
//                 justify-center

//                 rounded-xl

//                 bg-[#1F5FAE]

//                 text-white

//                 shadow-md
//               "
//             >
//               <Icon
//                 icon="lucide:graduation-cap"
//                 className="
//                   text-2xl
//                 "
//               />
//             </div>

//             <div>
//               <p
//                 className="
//                   text-base
//                   font-bold
//                   text-[#15243B]
//                 "
//               >
//                 Riverside Academy
//               </p>

//               <p
//                 className="
//                   text-xs
//                   text-[#6B7280]
//                 "
//               >
//                 School ERP · 2025–26
//               </p>
//             </div>
//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             className="
//               p-1

//               text-[#6B7280]

//               hover:text-[#15243B]

//               lg:hidden
//             "
//           >
//             <Icon
//               icon="lucide:x"
//               className="
//                 text-xl
//               "
//             />
//           </button>
//         </div>

//         {/* ======================================
//             NAVIGATION
//         ====================================== */}

//         <nav
//           className="
//             min-h-0
//             flex-1

//             overflow-y-auto
//             overflow-x-hidden

//             px-4
//             py-4

//             [scrollbar-width:thin]
//             [scrollbar-color:#D1D5DB_transparent]

//             [&::-webkit-scrollbar]:w-1.5
//             [&::-webkit-scrollbar-track]:bg-transparent
//             [&::-webkit-scrollbar-thumb]:rounded-full
//             [&::-webkit-scrollbar-thumb]:bg-[#D1D5DB]
//           "
//         >
//           <p
//             className="
//               px-3
//               pb-2

//               text-xs
//               font-semibold
//               uppercase
//               tracking-wider

//               text-[#6B7280]
//             "
//           >
//             Operations
//           </p>

//           <div
//             className="
//               space-y-1
//               text-sm
//             "
//           >
//             {/* ==================================
//                 DASHBOARD
//             ================================== */}

//             {dashboardItems.map((item) => {
//               const isActive = currentTab === item.id;

//               return (
//                 <button
//                   key={item.id}
//                   type="button"
//                   onClick={() => handleNavigation(item.id, item.path)}
//                   className={`
//                       flex
//                       min-h-11
//                       w-full
//                       items-center
//                       gap-3

//                       rounded-lg

//                       px-3

//                       font-semibold

//                       transition-all
//                       duration-200

//                       ${
//                         isActive
//                           ? `
//                               bg-[#E8F0FB]
//                               text-[#1F5FAE]
//                             `
//                           : `
//                               text-[#6B7280]

//                               hover:bg-[#F9FAFB]
//                               hover:text-[#15243B]
//                             `
//                       }
//                     `}
//                 >
//                   <Icon
//                     icon={item.icon}
//                     className="
//                         text-lg
//                       "
//                   />

//                   {item.label}
//                 </button>
//               );
//             })}

//             {/* ==================================
//                 ACADEMIC
//             ================================== */}

//             <div>
//               <button
//                 type="button"
//                 onClick={() => setIsAcademicOpen((previous) => !previous)}
//                 className={`
//                   flex
//                   min-h-11
//                   w-full
//                   items-center
//                   gap-3

//                   rounded-lg

//                   px-3

//                   font-semibold

//                   transition-all
//                   duration-200

//                   ${
//                     isAcademicActive || isAcademicOpen
//                       ? `
//                           bg-[#E8F0FB]
//                           text-[#1F5FAE]
//                         `
//                       : `
//                           text-[#6B7280]

//                           hover:bg-[#F9FAFB]
//                           hover:text-[#15243B]
//                         `
//                   }
//                 `}
//               >
//                 <Icon
//                   icon="lucide:book-open"
//                   className="
//                     text-lg
//                   "
//                 />

//                 <span
//                   className="
//                     flex-1
//                     text-left
//                   "
//                 >
//                   Academic
//                 </span>

//                 <Icon
//                   icon={
//                     isAcademicOpen
//                       ? "lucide:chevron-down"
//                       : "lucide:chevron-right"
//                   }
//                   className="
//                     text-sm
//                   "
//                 />
//               </button>

//               {isAcademicOpen && (
//                 <div
//                   className="
//                     ml-4
//                     mt-1

//                     space-y-1

//                     border-l-2
//                     border-[#E5E7EB]

//                     pl-2
//                   "
//                 >
//                   {academicItems.map((item) => {
//                     const isActive = currentTab === item.id;

//                     return (
//                       <button
//                         key={item.id}
//                         type="button"
//                         onClick={() => handleNavigation(item.id, item.path)}
//                         className={`
//                             flex
//                             min-h-10
//                             w-full
//                             items-center
//                             gap-3

//                             rounded-lg

//                             px-3

//                             text-sm
//                             font-medium

//                             transition-all
//                             duration-200

//                             ${
//                               isActive
//                                 ? `
//                                     bg-[#E8F0FB]
//                                     text-[#1F5FAE]
//                                   `
//                                 : `
//                                     text-[#6B7280]

//                                     hover:bg-[#F9FAFB]
//                                     hover:text-[#15243B]
//                                   `
//                             }
//                           `}
//                       >
//                         <Icon
//                           icon={item.icon}
//                           className="
//                               text-base
//                             "
//                         />

//                         {item.label}
//                       </button>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>

//             {/* ==================================
//                 STUDENTS
//             ================================== */}

//             <div>
//               <button
//                 type="button"
//                 onClick={() => setIsStudentsOpen((previous) => !previous)}
//                 className={`
//                   flex
//                   min-h-11
//                   w-full
//                   items-center
//                   gap-3

//                   rounded-lg

//                   px-3

//                   font-semibold

//                   transition-all
//                   duration-200

//                   ${
//                     isStudentsActive || isStudentsOpen
//                       ? `
//                           bg-[#E8F0FB]
//                           text-[#1F5FAE]
//                         `
//                       : `
//                           text-[#6B7280]

//                           hover:bg-[#F9FAFB]
//                           hover:text-[#15243B]
//                         `
//                   }
//                 `}
//               >
//                 <Icon
//                   icon="lucide:users"
//                   className="
//                     text-lg
//                   "
//                 />

//                 <span
//                   className="
//                     flex-1
//                     text-left
//                   "
//                 >
//                   Students
//                 </span>

//                 <Icon
//                   icon={
//                     isStudentsOpen
//                       ? "lucide:chevron-down"
//                       : "lucide:chevron-right"
//                   }
//                   className="
//                     text-sm
//                   "
//                 />
//               </button>

//               {isStudentsOpen && (
//                 <div
//                   className="
//                     ml-4
//                     mt-1

//                     space-y-1

//                     border-l-2
//                     border-[#E5E7EB]

//                     pl-2
//                   "
//                 >
//                   {studentItems.map((item) => {
//                     const isActive = currentTab === item.id;

//                     return (
//                       <button
//                         key={item.id}
//                         type="button"
//                         onClick={() => handleNavigation(item.id, item.path)}
//                         className={`
//                             flex
//                             min-h-10
//                             w-full
//                             items-center
//                             gap-3

//                             rounded-lg

//                             px-3

//                             text-sm
//                             font-medium

//                             transition-all
//                             duration-200

//                             ${
//                               isActive
//                                 ? `
//                                     bg-[#E8F0FB]
//                                     text-[#1F5FAE]
//                                   `
//                                 : `
//                                     text-[#6B7280]

//                                     hover:bg-[#F9FAFB]
//                                     hover:text-[#15243B]
//                                   `
//                             }
//                           `}
//                       >
//                         <Icon
//                           icon={item.icon}
//                           className="
//                               text-base
//                             "
//                         />

//                         {item.label}
//                       </button>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>

//             {/* ==================================
//                 TEACHERS
//             ================================== */}

//             {otherItems
//               .filter((item) => item.id === "teachers")
//               .map((item) => {
//                 const isActive = currentTab === item.id;

//                 return (
//                   <button
//                     key={item.id}
//                     type="button"
//                     onClick={() => handleNavigation(item.id, item.path)}
//                     className={`
//                         flex
//                         min-h-11
//                         w-full
//                         items-center
//                         gap-3

//                         rounded-lg

//                         px-3

//                         font-semibold

//                         transition-all
//                         duration-200

//                         ${
//                           isActive
//                             ? `
//                                 bg-[#E8F0FB]
//                                 text-[#1F5FAE]
//                               `
//                             : `
//                                 text-[#6B7280]

//                                 hover:bg-[#F9FAFB]
//                                 hover:text-[#15243B]
//                               `
//                         }
//                       `}
//                   >
//                     <Icon
//                       icon={item.icon}
//                       className="
//                           text-lg
//                         "
//                     />

//                     {item.label}
//                   </button>
//                 );
//               })}

//             {/* ==================================
//                 ATTENDANCE
//             ================================== */}

//             <div>
//               <button
//                 type="button"
//                 onClick={() => setIsAttendanceOpen((previous) => !previous)}
//                 className={`
//                   flex
//                   min-h-11
//                   w-full
//                   items-center
//                   gap-3

//                   rounded-lg

//                   px-3

//                   font-semibold

//                   transition-all
//                   duration-200

//                   ${
//                     isAttendanceActive || isAttendanceOpen
//                       ? `
//                           bg-[#E8F0FB]
//                           text-[#1F5FAE]
//                         `
//                       : `
//                           text-[#6B7280]

//                           hover:bg-[#F9FAFB]
//                           hover:text-[#15243B]
//                         `
//                   }
//                 `}
//               >
//                 <Icon
//                   icon="lucide:calendar-check"
//                   className="
//                     text-lg
//                   "
//                 />

//                 <span
//                   className="
//                     flex-1
//                     text-left
//                   "
//                 >
//                   Attendance
//                 </span>

//                 <Icon
//                   icon={
//                     isAttendanceOpen
//                       ? "lucide:chevron-down"
//                       : "lucide:chevron-right"
//                   }
//                   className="
//                     text-sm
//                   "
//                 />
//               </button>

//               {isAttendanceOpen && (
//                 <div
//                   className="
//                     ml-4
//                     mt-1

//                     space-y-1

//                     border-l-2
//                     border-[#E5E7EB]

//                     pl-2
//                   "
//                 >
//                   {attendanceItems.map((item) => {
//                     const isActive = currentTab === item.id;

//                     return (
//                       <button
//                         key={item.id}
//                         type="button"
//                         onClick={() => handleNavigation(item.id, item.path)}
//                         className={`
//                             flex
//                             min-h-10
//                             w-full
//                             items-center
//                             gap-3

//                             rounded-lg

//                             px-3

//                             text-sm
//                             font-medium

//                             transition-all
//                             duration-200

//                             ${
//                               isActive
//                                 ? `
//                                     bg-[#E8F0FB]
//                                     text-[#1F5FAE]
//                                   `
//                                 : `
//                                     text-[#6B7280]

//                                     hover:bg-[#F9FAFB]
//                                     hover:text-[#15243B]
//                                   `
//                             }
//                           `}
//                       >
//                         <Icon
//                           icon={item.icon}
//                           className="
//                               text-base
//                             "
//                         />

//                         {item.label}
//                       </button>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>

//             {/* ==================================
//                 TIMETABLE
//             ================================== */}

//             <div>
//               <button
//                 type="button"
//                 onClick={() => setIsTimetableOpen((previous) => !previous)}
//                 className={`
//                   flex
//                   min-h-11
//                   w-full
//                   items-center
//                   gap-3

//                   rounded-lg

//                   px-3

//                   font-semibold

//                   transition-all
//                   duration-200

//                   ${
//                     isTimetableActive || isTimetableOpen
//                       ? `
//                           bg-[#E8F0FB]
//                           text-[#1F5FAE]
//                         `
//                       : `
//                           text-[#6B7280]

//                           hover:bg-[#F9FAFB]
//                           hover:text-[#15243B]
//                         `
//                   }
//                 `}
//               >
//                 <Icon
//                   icon="lucide:calendar-clock"
//                   className="
//                     text-lg
//                   "
//                 />

//                 <span
//                   className="
//                     flex-1
//                     text-left
//                   "
//                 >
//                   Timetable
//                 </span>

//                 <Icon
//                   icon={
//                     isTimetableOpen
//                       ? "lucide:chevron-down"
//                       : "lucide:chevron-right"
//                   }
//                   className="
//                     text-sm
//                   "
//                 />
//               </button>

//               {isTimetableOpen && (
//                 <div
//                   className="
//                     ml-4
//                     mt-1

//                     space-y-1

//                     border-l-2
//                     border-[#E5E7EB]

//                     pl-2
//                   "
//                 >
//                   {timetableItems.map((item) => {
//                     const isActive = currentTab === item.id;

//                     return (
//                       <button
//                         key={item.id}
//                         type="button"
//                         onClick={() => handleNavigation(item.id, item.path)}
//                         className={`
//                             flex
//                             min-h-10
//                             w-full
//                             items-center
//                             gap-3

//                             rounded-lg

//                             px-3

//                             text-sm
//                             font-medium

//                             transition-all
//                             duration-200

//                             ${
//                               isActive
//                                 ? `
//                                     bg-[#E8F0FB]
//                                     text-[#1F5FAE]
//                                   `
//                                 : `
//                                     text-[#6B7280]

//                                     hover:bg-[#F9FAFB]
//                                     hover:text-[#15243B]
//                                   `
//                             }
//                           `}
//                       >
//                         <Icon
//                           icon={item.icon}
//                           className="
//                               text-base
//                             "
//                         />

//                         {item.label}
//                       </button>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>

//             {/* ==================================
//                 HOMEWORK
//             ================================== */}

//             {otherItems
//               .filter((item) => item.id === "homework")
//               .map((item) => {
//                 const isActive = isHomeworkActive || currentTab === item.id;

//                 return (
//                   <button
//                     key={item.id}
//                     type="button"
//                     onClick={() => handleNavigation(item.id, item.path)}
//                     className={`
//                         flex
//                         min-h-11
//                         w-full
//                         items-center
//                         gap-3

//                         rounded-lg

//                         px-3

//                         font-semibold

//                         transition-all
//                         duration-200

//                         ${
//                           isActive
//                             ? `
//                                 bg-[#E8F0FB]
//                                 text-[#1F5FAE]
//                               `
//                             : `
//                                 text-[#6B7280]

//                                 hover:bg-[#F9FAFB]
//                                 hover:text-[#15243B]
//                               `
//                         }
//                       `}
//                   >
//                     <Icon
//                       icon={item.icon}
//                       className="
//                           text-lg
//                         "
//                     />

//                     {item.label}
//                   </button>
//                 );
//               })}

//             {/* ==================================
//                 REMAINING ITEMS
//             ================================== */}

//             {otherItems
//               .filter(
//                 (item) => item.id !== "teachers" && item.id !== "homework",
//               )
//               .map((item) => {
//                 const isActive = currentTab === item.id;

//                 return (
//                   <button
//                     key={item.id}
//                     type="button"
//                     onClick={() => handleNavigation(item.id, item.path)}
//                     className={`
//                         flex
//                         min-h-11
//                         w-full
//                         items-center
//                         gap-3

//                         rounded-lg

//                         px-3

//                         font-semibold

//                         transition-all
//                         duration-200

//                         ${
//                           isActive
//                             ? `
//                                 bg-[#E8F0FB]
//                                 text-[#1F5FAE]
//                               `
//                             : `
//                                 text-[#6B7280]

//                                 hover:bg-[#F9FAFB]
//                                 hover:text-[#15243B]
//                               `
//                         }
//                       `}
//                   >
//                     <Icon
//                       icon={item.icon}
//                       className="
//                           text-lg
//                         "
//                     />

//                     {item.label}
//                   </button>
//                 );
//               })}
//           </div>
//         </nav>

//         {/* ======================================
//             FOOTER
//         ====================================== */}

//         <div
//           className="
//             shrink-0

//             border-t
//             border-[#E5E7EB]

//             bg-white

//             p-4

//             text-sm
//           "
//         >
//           <button
//             type="button"
//             onClick={() => handleNavigation("help", "/help")}
//             className="
//               flex
//               min-h-11
//               w-full
//               items-center
//               gap-3

//               rounded-lg

//               px-3

//               text-[#6B7280]

//               transition-colors

//               hover:bg-[#F9FAFB]
//               hover:text-[#15243B]
//             "
//           >
//             <Icon
//               icon="lucide:circle-help"
//               className="
//                 text-lg
//               "
//             />
//             Help & Support
//           </button>

//           <button
//             type="button"
//             onClick={() => handleNavigation("profile", "/profile")}
//             className="
//               flex
//               min-h-11
//               w-full
//               items-center
//               gap-3

//               rounded-lg

//               px-3

//               text-[#6B7280]

//               transition-colors

//               hover:bg-[#F9FAFB]
//               hover:text-[#15243B]
//             "
//           >
//             <Icon
//               icon="lucide:user"
//               className="
//                 text-lg
//               "
//             />
//             Admin Profile
//           </button>

//           <button
//             type="button"
//             onClick={() => {
//               localStorage.removeItem("accessToken");

//               localStorage.removeItem("user");

//               navigate("/login");
//             }}
//             className="
//               flex
//               min-h-11
//               w-full
//               items-center
//               gap-3

//               rounded-lg

//               px-3

//               text-[#EF4444]

//               transition-colors

//               hover:bg-[#FEF2F2]
//             "
//           >
//             <Icon
//               icon="lucide:log-out"
//               className="
//                 text-lg
//               "
//             />
//             Logout
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// };

// export default Sidebar;

import React, { useEffect, useState } from "react";

import { Icon } from "@iconify/react";

import { useLocation, useNavigate } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;

  onClose: () => void;

  currentTab: string;

  setCurrentTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentTab,
  setCurrentTab,
}) => {
  const navigate = useNavigate();

  const location = useLocation();

  // ============================================
  // COLLAPSIBLE STATES
  // ============================================

  const [isAcademicOpen, setIsAcademicOpen] = useState(false);

  const [isStudentsOpen, setIsStudentsOpen] = useState(false);

  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);

  const [isTimetableOpen, setIsTimetableOpen] = useState(false);

  // ============================================
  // DASHBOARD
  // ============================================

  const dashboardItems = [
    {
      id: "dashboard",

      label: "Dashboard",

      icon: "lucide:layout-dashboard",

      path: "/school-admin/dashboard",
    },
  ];

  // ============================================
  // ACADEMIC ITEMS
  // ============================================

  const academicItems = [
    {
      id: "sessions",

      label: "Sessions",

      icon: "lucide:calendar-range",

      path: "/school-admin/academic/sessions",
    },

    {
      id: "classes",

      label: "Classes",

      icon: "lucide:building-2",

      path: "/school-admin/academic/classes",
    },

    {
      id: "sections",

      label: "Sections",

      icon: "lucide:layers",

      path: "/school-admin/academic/sections",
    },

    {
      id: "subjects",

      label: "Subjects",

      icon: "lucide:book-open",

      path: "/school-admin/academic/subjects",
    },

    {
      id: "assignment",

      label: "Assignment",

      icon: "lucide:graduation-cap",

      path: "/school-admin/academic/subject-assignments",
    },
  ];

  // ============================================
  // STUDENT ITEMS
  // ============================================

  const studentItems = [
    {
      id: "all-students",

      label: "All Students",

      icon: "lucide:users",

      path: "/school-admin/students",
    },

    {
      id: "add-student",

      label: "Add Student",

      icon: "lucide:user-plus",

      path: "/school-admin/students/add",
    },

    {
      id: "class-wise-students",

      label: "Class-wise Students",

      icon: "lucide:school",

      path: "/school-admin/students/class-wise",
    },

    {
      id: "bulk-promotion",

      label: "Bulk Promotion",

      icon: "lucide:arrow-up-right",

      path: "/school-admin/students/bulk-promotion",
    },
  ];

  // ============================================
  // ATTENDANCE ITEMS
  // ============================================

  const attendanceItems = [
    {
      id: "mark-attendance",

      label: "Mark Attendance",

      icon: "lucide:user-check",

      path: "/school-admin/attendance/mark",
    },

    {
      id: "daily-attendance",

      label: "Daily Attendance",

      icon: "lucide:calendar-days",

      path: "/school-admin/attendance/daily",
    },

    {
      id: "monthly-attendance",

      label: "Monthly Attendance",

      icon: "lucide:calendar-range",

      path: "/school-admin/attendance/monthly",
    },
  ];

  // ============================================
  // TIMETABLE ITEMS
  // ============================================

  const timetableItems = [
    {
      id: "weekly-timetable",

      label: "Weekly Timetable",

      icon: "lucide:calendar-range",

      path: "/school-admin/timetable/weekly",
    },

    {
      id: "daily-timetable",

      label: "Daily Timetable",

      icon: "lucide:calendar-days",

      path: "/school-admin/timetable/daily",
    },

    {
      id: "teacher-timetable",

      label: "Teacher Timetable",

      icon: "lucide:user-round",

      path: "/school-admin/timetable/teacher",
    },
  ];

  // ============================================
  // OTHER ITEMS
  // ============================================

  const otherItems = [
    {
      id: "teachers",

      label: "Teachers",

      icon: "lucide:graduation-cap",

      path: "/school-admin/teachers",
    },

    {
      id: "homework",

      label: "Homework",

      icon: "lucide:clipboard-list",

      path: "/school-admin/homework",
    },

    {
      id: "exams",

      label: "Exams",

      icon: "lucide:file-text",

      path: "/school-admin/exams",
    },

    {
      id: "results",

      label: "Results",

      icon: "lucide:chart-bar",

      path: "/school-admin/results",
    },

    {
      id: "fees",

      label: "Fees",

      icon: "lucide:credit-card",

      path: "/school-admin/fees",
    },

    {
      id: "notices",

      label: "Notices",

      icon: "lucide:megaphone",

      path: "/school-admin/notices",
    },

    {
      id: "parents",

      label: "Parents",

      icon: "lucide:heart",

      path: "/school-admin/parents",
    },

    {
      id: "staff",

      label: "Staff",

      icon: "lucide:briefcase-business",

      path: "/school-admin/staff",
    },

    {
      id: "reports",

      label: "Reports",

      icon: "lucide:chart-bar",

      path: "/school-admin/reports",
    },

    {
      id: "settings",

      label: "Settings",

      icon: "lucide:settings",

      path: "/school-admin/settings",
    },
  ];

  // ============================================
  // NAVIGATION
  // ============================================

  const handleNavigation = (id: string, path: string) => {
    setCurrentTab(id);

    navigate(path);

    onClose();
  };

  // ============================================
  // ACTIVE GROUP CHECK
  // ============================================

  const isAcademicActive = location.pathname.startsWith(
    "/school-admin/academic",
  );

  const isStudentsActive = location.pathname.startsWith(
    "/school-admin/students",
  );

  const isAttendanceActive = location.pathname.startsWith(
    "/school-admin/attendance",
  );

  const isTimetableActive = location.pathname.startsWith(
    "/school-admin/timetable",
  );

  // ============================================
  // HOMEWORK ACTIVE
  // ============================================

  const isHomeworkActive = location.pathname.startsWith(
    "/school-admin/homework",
  );

  // ============================================
  // AUTO OPEN ACADEMIC
  // ============================================

  useEffect(() => {
    if (isAcademicActive) {
      setIsAcademicOpen(true);
    }
  }, [isAcademicActive]);

  // ============================================
  // AUTO OPEN STUDENTS
  // ============================================

  useEffect(() => {
    if (isStudentsActive) {
      setIsStudentsOpen(true);
    }
  }, [isStudentsActive]);

  // ============================================
  // AUTO OPEN ATTENDANCE
  // ============================================

  useEffect(() => {
    if (isAttendanceActive) {
      setIsAttendanceOpen(true);
    }
  }, [isAttendanceActive]);

  // ============================================
  // AUTO OPEN TIMETABLE
  // ============================================

  useEffect(() => {
    if (isTimetableActive) {
      setIsTimetableOpen(true);
    }
  }, [isTimetableActive]);

  // ============================================
  // SYNC CURRENT TAB WITH STUDENT ROUTES
  // ============================================

  useEffect(() => {
    if (location.pathname === "/school-admin/students") {
      setCurrentTab("all-students");

      return;
    }

    if (location.pathname.startsWith("/school-admin/students/add")) {
      setCurrentTab("add-student");

      return;
    }

    if (location.pathname.startsWith("/school-admin/students/class-wise")) {
      setCurrentTab("class-wise-students");

      return;
    }

    if (location.pathname.startsWith("/school-admin/students/bulk-promotion")) {
      setCurrentTab("bulk-promotion");

      return;
    }
  }, [location.pathname, setCurrentTab]);

  // ============================================
  // KEEP HOMEWORK ACTIVE ON CHILD ROUTES
  // ============================================

  useEffect(() => {
    if (isHomeworkActive) {
      setCurrentTab("homework");
    }
  }, [isHomeworkActive, setCurrentTab]);

  return (
    <>
      {/* ========================================
          MOBILE OVERLAY
      ======================================== */}

      {isOpen && (
        <div
          className="
            fixed
            inset-0
            z-40
            bg-black/40

            lg:hidden
          "
          onClick={onClose}
        />
      )}

      {/* ========================================
          SIDEBAR
      ======================================== */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50

          flex
          w-72
          flex-col

          border-r
          border-[#E5E7EB]

          bg-white

          transition-all
          duration-300
          ease-in-out

          lg:relative
          lg:h-full
          lg:translate-x-0

          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* ======================================
            HEADER
        ====================================== */}

        <div
          className="
            flex
            shrink-0
            items-center
            justify-between

            border-b
            border-[#E5E7EB]

            px-5
            py-5
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
                h-11
                w-11
                items-center
                justify-center

                rounded-xl

                bg-[#1F5FAE]

                text-white

                shadow-md
              "
            >
              <Icon
                icon="lucide:graduation-cap"
                className="
                  text-2xl
                "
              />
            </div>

            <div>
              <p
                className="
                  text-base
                  font-bold
                  text-[#15243B]
                "
              >
                Riverside Academy
              </p>

              <p
                className="
                  text-xs
                  text-[#6B7280]
                "
              >
                School ERP · 2025–26
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              p-1

              text-[#6B7280]

              hover:text-[#15243B]

              lg:hidden
            "
          >
            <Icon
              icon="lucide:x"
              className="
                text-xl
              "
            />
          </button>
        </div>

        {/* ======================================
            NAVIGATION
        ====================================== */}

        <nav
          className="
            min-h-0
            flex-1

            overflow-y-auto
            overflow-x-hidden

            px-4
            py-4

            [scrollbar-width:thin]
            [scrollbar-color:#D1D5DB_transparent]

            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-[#D1D5DB]
          "
        >
          <p
            className="
              px-3
              pb-2

              text-xs
              font-semibold
              uppercase
              tracking-wider

              text-[#6B7280]
            "
          >
            Operations
          </p>

          <div
            className="
              space-y-1
              text-sm
            "
          >
            {/* ==================================
                DASHBOARD
            ================================== */}

            {dashboardItems.map((item) => {
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigation(item.id, item.path)}
                  className={`
                      flex
                      min-h-11
                      w-full
                      items-center
                      gap-3

                      rounded-lg

                      px-3

                      font-semibold

                      transition-all
                      duration-200

                      ${
                        isActive
                          ? `
                              bg-[#E8F0FB]
                              text-[#1F5FAE]
                            `
                          : `
                              text-[#6B7280]

                              hover:bg-[#F9FAFB]
                              hover:text-[#15243B]
                            `
                      }
                    `}
                >
                  <Icon
                    icon={item.icon}
                    className="
                        text-lg
                      "
                  />

                  {item.label}
                </button>
              );
            })}

            {/* ==================================
                ACADEMIC
            ================================== */}

            <div>
              <button
                type="button"
                onClick={() => setIsAcademicOpen((previous) => !previous)}
                className={`
                  flex
                  min-h-11
                  w-full
                  items-center
                  gap-3

                  rounded-lg

                  px-3

                  font-semibold

                  transition-all
                  duration-200

                  ${
                    isAcademicActive || isAcademicOpen
                      ? `
                          bg-[#E8F0FB]
                          text-[#1F5FAE]
                        `
                      : `
                          text-[#6B7280]

                          hover:bg-[#F9FAFB]
                          hover:text-[#15243B]
                        `
                  }
                `}
              >
                <Icon
                  icon="lucide:book-open"
                  className="
                    text-lg
                  "
                />

                <span
                  className="
                    flex-1
                    text-left
                  "
                >
                  Academic
                </span>

                <Icon
                  icon={
                    isAcademicOpen
                      ? "lucide:chevron-down"
                      : "lucide:chevron-right"
                  }
                  className="
                    text-sm
                  "
                />
              </button>

              {isAcademicOpen && (
                <div
                  className="
                    ml-4
                    mt-1

                    space-y-1

                    border-l-2
                    border-[#E5E7EB]

                    pl-2
                  "
                >
                  {academicItems.map((item) => {
                    const isActive = currentTab === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNavigation(item.id, item.path)}
                        className={`
                            flex
                            min-h-10
                            w-full
                            items-center
                            gap-3

                            rounded-lg

                            px-3

                            text-sm
                            font-medium

                            transition-all
                            duration-200

                            ${
                              isActive
                                ? `
                                    bg-[#E8F0FB]
                                    text-[#1F5FAE]
                                  `
                                : `
                                    text-[#6B7280]

                                    hover:bg-[#F9FAFB]
                                    hover:text-[#15243B]
                                  `
                            }
                          `}
                      >
                        <Icon
                          icon={item.icon}
                          className="
                              text-base
                            "
                        />

                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ==================================
                STUDENTS
            ================================== */}

            <div>
              <button
                type="button"
                onClick={() => setIsStudentsOpen((previous) => !previous)}
                className={`
                  flex
                  min-h-11
                  w-full
                  items-center
                  gap-3

                  rounded-lg

                  px-3

                  font-semibold

                  transition-all
                  duration-200

                  ${
                    isStudentsActive || isStudentsOpen
                      ? `
                          bg-[#E8F0FB]
                          text-[#1F5FAE]
                        `
                      : `
                          text-[#6B7280]

                          hover:bg-[#F9FAFB]
                          hover:text-[#15243B]
                        `
                  }
                `}
              >
                <Icon
                  icon="lucide:users"
                  className="
                    text-lg
                  "
                />

                <span
                  className="
                    flex-1
                    text-left
                  "
                >
                  Students
                </span>

                <Icon
                  icon={
                    isStudentsOpen
                      ? "lucide:chevron-down"
                      : "lucide:chevron-right"
                  }
                  className="
                    text-sm
                  "
                />
              </button>

              {isStudentsOpen && (
                <div
                  className="
                    ml-4
                    mt-1

                    space-y-1

                    border-l-2
                    border-[#E5E7EB]

                    pl-2
                  "
                >
                  {studentItems.map((item) => {
                    const isActive = currentTab === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNavigation(item.id, item.path)}
                        className={`
                            flex
                            min-h-10
                            w-full
                            items-center
                            gap-3

                            rounded-lg

                            px-3

                            text-sm
                            font-medium

                            transition-all
                            duration-200

                            ${
                              isActive
                                ? `
                                    bg-[#E8F0FB]
                                    text-[#1F5FAE]
                                  `
                                : `
                                    text-[#6B7280]

                                    hover:bg-[#F9FAFB]
                                    hover:text-[#15243B]
                                  `
                            }
                          `}
                      >
                        <Icon
                          icon={item.icon}
                          className="
                              text-base
                            "
                        />

                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ==================================
                TEACHERS
            ================================== */}

            {otherItems
              .filter((item) => item.id === "teachers")
              .map((item) => {
                const isActive = currentTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavigation(item.id, item.path)}
                    className={`
                        flex
                        min-h-11
                        w-full
                        items-center
                        gap-3

                        rounded-lg

                        px-3

                        font-semibold

                        transition-all
                        duration-200

                        ${
                          isActive
                            ? `
                                bg-[#E8F0FB]
                                text-[#1F5FAE]
                              `
                            : `
                                text-[#6B7280]

                                hover:bg-[#F9FAFB]
                                hover:text-[#15243B]
                              `
                        }
                      `}
                  >
                    <Icon
                      icon={item.icon}
                      className="
                          text-lg
                        "
                    />

                    {item.label}
                  </button>
                );
              })}

            {/* ==================================
                ATTENDANCE
            ================================== */}

            <div>
              <button
                type="button"
                onClick={() => setIsAttendanceOpen((previous) => !previous)}
                className={`
                  flex
                  min-h-11
                  w-full
                  items-center
                  gap-3

                  rounded-lg

                  px-3

                  font-semibold

                  transition-all
                  duration-200

                  ${
                    isAttendanceActive || isAttendanceOpen
                      ? `
                          bg-[#E8F0FB]
                          text-[#1F5FAE]
                        `
                      : `
                          text-[#6B7280]

                          hover:bg-[#F9FAFB]
                          hover:text-[#15243B]
                        `
                  }
                `}
              >
                <Icon
                  icon="lucide:calendar-check"
                  className="
                    text-lg
                  "
                />

                <span
                  className="
                    flex-1
                    text-left
                  "
                >
                  Attendance
                </span>

                <Icon
                  icon={
                    isAttendanceOpen
                      ? "lucide:chevron-down"
                      : "lucide:chevron-right"
                  }
                  className="
                    text-sm
                  "
                />
              </button>

              {isAttendanceOpen && (
                <div
                  className="
                    ml-4
                    mt-1

                    space-y-1

                    border-l-2
                    border-[#E5E7EB]

                    pl-2
                  "
                >
                  {attendanceItems.map((item) => {
                    const isActive = currentTab === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNavigation(item.id, item.path)}
                        className={`
                            flex
                            min-h-10
                            w-full
                            items-center
                            gap-3

                            rounded-lg

                            px-3

                            text-sm
                            font-medium

                            transition-all
                            duration-200

                            ${
                              isActive
                                ? `
                                    bg-[#E8F0FB]
                                    text-[#1F5FAE]
                                  `
                                : `
                                    text-[#6B7280]

                                    hover:bg-[#F9FAFB]
                                    hover:text-[#15243B]
                                  `
                            }
                          `}
                      >
                        <Icon
                          icon={item.icon}
                          className="
                              text-base
                            "
                        />

                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ==================================
                TIMETABLE
            ================================== */}

            <div>
              <button
                type="button"
                onClick={() => setIsTimetableOpen((previous) => !previous)}
                className={`
                  flex
                  min-h-11
                  w-full
                  items-center
                  gap-3

                  rounded-lg

                  px-3

                  font-semibold

                  transition-all
                  duration-200

                  ${
                    isTimetableActive || isTimetableOpen
                      ? `
                          bg-[#E8F0FB]
                          text-[#1F5FAE]
                        `
                      : `
                          text-[#6B7280]

                          hover:bg-[#F9FAFB]
                          hover:text-[#15243B]
                        `
                  }
                `}
              >
                <Icon
                  icon="lucide:calendar-clock"
                  className="
                    text-lg
                  "
                />

                <span
                  className="
                    flex-1
                    text-left
                  "
                >
                  Timetable
                </span>

                <Icon
                  icon={
                    isTimetableOpen
                      ? "lucide:chevron-down"
                      : "lucide:chevron-right"
                  }
                  className="
                    text-sm
                  "
                />
              </button>

              {isTimetableOpen && (
                <div
                  className="
                    ml-4
                    mt-1

                    space-y-1

                    border-l-2
                    border-[#E5E7EB]

                    pl-2
                  "
                >
                  {timetableItems.map((item) => {
                    const isActive = currentTab === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNavigation(item.id, item.path)}
                        className={`
                            flex
                            min-h-10
                            w-full
                            items-center
                            gap-3

                            rounded-lg

                            px-3

                            text-sm
                            font-medium

                            transition-all
                            duration-200

                            ${
                              isActive
                                ? `
                                    bg-[#E8F0FB]
                                    text-[#1F5FAE]
                                  `
                                : `
                                    text-[#6B7280]

                                    hover:bg-[#F9FAFB]
                                    hover:text-[#15243B]
                                  `
                            }
                          `}
                      >
                        <Icon
                          icon={item.icon}
                          className="
                              text-base
                            "
                        />

                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ==================================
                HOMEWORK
            ================================== */}

            {otherItems
              .filter((item) => item.id === "homework")
              .map((item) => {
                const isActive = isHomeworkActive || currentTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavigation(item.id, item.path)}
                    className={`
                        flex
                        min-h-11
                        w-full
                        items-center
                        gap-3

                        rounded-lg

                        px-3

                        font-semibold

                        transition-all
                        duration-200

                        ${
                          isActive
                            ? `
                                bg-[#E8F0FB]
                                text-[#1F5FAE]
                              `
                            : `
                                text-[#6B7280]

                                hover:bg-[#F9FAFB]
                                hover:text-[#15243B]
                              `
                        }
                      `}
                  >
                    <Icon
                      icon={item.icon}
                      className="
                          text-lg
                        "
                    />

                    {item.label}
                  </button>
                );
              })}

            {/* ==================================
                REMAINING ITEMS
            ================================== */}

            {otherItems
              .filter(
                (item) => item.id !== "teachers" && item.id !== "homework",
              )
              .map((item) => {
                const isActive = currentTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavigation(item.id, item.path)}
                    className={`
                        flex
                        min-h-11
                        w-full
                        items-center
                        gap-3

                        rounded-lg

                        px-3

                        font-semibold

                        transition-all
                        duration-200

                        ${
                          isActive
                            ? `
                                bg-[#E8F0FB]
                                text-[#1F5FAE]
                              `
                            : `
                                text-[#6B7280]

                                hover:bg-[#F9FAFB]
                                hover:text-[#15243B]
                              `
                        }
                      `}
                  >
                    <Icon
                      icon={item.icon}
                      className="
                          text-lg
                        "
                    />

                    {item.label}
                  </button>
                );
              })}
          </div>
        </nav>

        {/* ======================================
            FOOTER
        ====================================== */}

        <div
          className="
            shrink-0

            border-t
            border-[#E5E7EB]

            bg-white

            p-4

            text-sm
          "
        >
          {/* HELP */}

          <button
            type="button"
            onClick={() => handleNavigation("help", "/help")}
            className="
              flex
              min-h-11
              w-full
              items-center
              gap-3

              rounded-lg

              px-3

              text-[#6B7280]

              transition-colors

              hover:bg-[#F9FAFB]
              hover:text-[#15243B]
            "
          >
            <Icon
              icon="lucide:circle-help"
              className="
                text-lg
              "
            />
            Help & Support
          </button>

          {/* PROFILE */}

          <button
            type="button"
            onClick={() => handleNavigation("profile", "/profile")}
            className="
              flex
              min-h-11
              w-full
              items-center
              gap-3

              rounded-lg

              px-3

              text-[#6B7280]

              transition-colors

              hover:bg-[#F9FAFB]
              hover:text-[#15243B]
            "
          >
            <Icon
              icon="lucide:user"
              className="
                text-lg
              "
            />
            Admin Profile
          </button>

          {/* LOGOUT */}

          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("accessToken");

              localStorage.removeItem("user");

              navigate("/login");
            }}
            className="
              flex
              min-h-11
              w-full
              items-center
              gap-3

              rounded-lg

              px-3

              text-[#EF4444]

              transition-colors

              hover:bg-[#FEF2F2]
            "
          >
            <Icon
              icon="lucide:log-out"
              className="
                text-lg
              "
            />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
