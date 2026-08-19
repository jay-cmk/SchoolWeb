// import React, { useState, useEffect, useRef } from 'react';
// import { Icon } from '@iconify/react';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
// } from 'chart.js';
// import { Bar, Line } from 'react-chartjs-2';

// // Register ChartJS components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// );

// // --- TYPES & INTERFACES ---

// interface SidebarProps {
//   isOpen: boolean;
//   onClose: () => void;
//   currentTab: string;
//   setCurrentTab: (tab: string) => void;
// }

// interface HeaderProps {
//   onToggleSidebar: () => void;
//   searchQuery: string;
//   onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   isProfileDropdownOpen: boolean;
//   onToggleProfileDropdown: () => void;
//   onCloseProfileDropdown: () => void;
//   onQuickActionClick: () => void;
// }

// interface StatCardProps {
//   icon: string;
//   trend: string;
//   trendType: 'positive' | 'negative' | 'neutral' | 'accent';
//   label: string;
//   value: string;
//   subtext: string;
// }

// interface StudentStatsProps {
//   selectedYear: string;
//   onYearChange: (year: string) => void;
// }

// interface AttendanceOverviewProps {
//   present: number;
//   absent: number;
//   onLeave: number;
// }

// interface FeeOverviewProps {
//   total: string;
//   collected: string;
//   pending: string;
//   percentage: number;
// }

// interface EventItem {
//   id: string;
//   month: string;
//   day: string;
//   title: string;
//   details: string;
//   type: 'primary' | 'accent';
// }

// interface UpcomingEventsProps {
//   events: EventItem[];
//   onAddEvent: () => void;
// }

// interface ActivityItem {
//   id: string;
//   type: 'admission' | 'fee' | 'teacher' | 'homework';
//   title: string;
//   detail: string;
//   time: string;
// }

// interface RecentActivitiesProps {
//   activities: ActivityItem[];
//   onViewAll: () => void;
// }

// interface NoticeItem {
//   id: string;
//   title: string;
//   tag: string;
//   tagType: 'action' | 'academic' | 'tomorrow';
//   content: string;
// }

// interface ImportantNoticesProps {
//   notices: NoticeItem[];
// }

// interface QuickActionModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (data: { type: string; title: string; detail: string }) => void;
// }

// // --- HELPER SUB-COMPONENTS ---

// const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, currentTab, setCurrentTab }) => {
//   const menuItems = [
//     { id: 'dashboard', label: 'Dashboard', icon: 'lucide:layout-dashboard' },
//     { id: 'students', label: 'Students', icon: 'lucide:users' },
//     { id: 'teachers', label: 'Teachers', icon: 'lucide:graduation-cap' },
//     { id: 'classes', label: 'Classes', icon: 'lucide:building-2' },
//     { id: 'sections', label: 'Sections', icon: 'lucide:layers' },
//     { id: 'subjects', label: 'Subjects', icon: 'lucide:book-open' },
//     { id: 'timetable', label: 'Timetable', icon: 'lucide:calendar' },
//     { id: 'attendance', label: 'Attendance', icon: 'lucide:calendar-check' },
//     { id: 'homework', label: 'Homework', icon: 'lucide:clipboard-list' },
//     { id: 'exams', label: 'Exams', icon: 'lucide:file-text' },
//     { id: 'results', label: 'Results', icon: 'lucide:chart-bar' },
//     { id: 'fees', label: 'Fees', icon: 'lucide:credit-card' },
//     { id: 'notices', label: 'Notices', icon: 'lucide:megaphone' },
//     { id: 'parents', label: 'Parents', icon: 'lucide:heart' },
//     { id: 'staff', label: 'Staff', icon: 'lucide:briefcase-business' },
//     { id: 'reports', label: 'Reports', icon: 'lucide:chart-bar' },
//     { id: 'settings', label: 'Settings', icon: 'lucide:settings' },
//   ];

//   return (
//     <>
//       {/* Mobile Sidebar Overlay */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-black/40 lg:hidden animate-in fade-in duration-200"
//           onClick={onClose}
//         />
//       )}

//       <aside
//         className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#E5E7EB] bg-white transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${
//           isOpen ? 'translate-x-0' : '-translate-x-full'
//         }`}
//       >
//         <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-5">
//           <div className="flex items-center gap-3">
//             <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1F5FAE] text-white shadow-md">
//               <Icon icon="lucide:graduation-cap" className="text-2xl" />
//             </div>
//             <div>
//               <p className="text-base font-bold text-[#15243B]">Riverside Academy</p>
//               <p className="text-xs text-[#6B7280]">School ERP · 2025–26</p>
//             </div>
//           </div>
//           <button onClick={onClose} className="p-1 text-[#6B7280] hover:text-[#15243B] lg:hidden">
//             <Icon icon="lucide:x" className="text-xl" />
//           </button>
//         </div>

//         <nav className="flex-1 overflow-y-auto px-4 py-4">
//           <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Operations</p>
//           <div className="space-y-1 text-sm">
//             {menuItems.map((item) => {
//               const isActive = currentTab === item.id;
//               return (
//                 <button
//                   key={item.id}
//                   onClick={() => {
//                     setCurrentTab(item.id);
//                     onClose();
//                   }}
//                   className={`flex w-full min-h-11 items-center gap-3 rounded-lg px-3 font-semibold transition-all duration-200 ${
//                     isActive
//                       ? 'bg-[#E8F0FB] text-[#1F5FAE]'
//                       : 'text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#15243B]'
//                   }`}
//                 >
//                   <Icon icon={item.icon} className="text-lg" />
//                   {item.label}
//                 </button>
//               );
//             })}
//           </div>
//         </nav>

//         <div className="border-t border-[#E5E7EB] p-4 text-sm">
//           <a href="#help" className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#15243B] transition-colors">
//             <Icon icon="lucide:circle-help" className="text-lg" />
//             Help &amp; Support
//           </a>
//           <a href="#profile" className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#15243B] transition-colors">
//             <Icon icon="lucide:user" className="text-lg" />
//             Admin Profile
//           </a>
//           <button
//             onClick={() => alert('Logging out...')}
//             className="flex w-full min-h-11 items-center gap-3 rounded-lg px-3 text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
//           >
//             <Icon icon="lucide:log-out" className="text-lg" />
//             Logout
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// };

// const Header: React.FC<HeaderProps> = ({
//   onToggleSidebar,
//   searchQuery,
//   onSearchChange,
//   isProfileDropdownOpen,
//   onToggleProfileDropdown,
//   onCloseProfileDropdown,
//   onQuickActionClick,
// }) => {
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         onCloseProfileDropdown();
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [onCloseProfileDropdown]);

//   return (
//     <header className="flex min-h-20 items-center gap-4 border-b border-[#E5E7EB] bg-white px-5 lg:px-8">
//       <button
//         onClick={onToggleSidebar}
//         className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#15243B] lg:hidden hover:bg-[#F9FAFB] transition-colors"
//       >
//         <Icon icon="lucide:menu" className="text-xl" />
//       </button>

//       <div className="hidden max-w-xl flex-1 lg:block">
//         <label className="relative block">
//           <span className="sr-only">Search school records</span>
//           <Icon icon="lucide:search" className="absolute left-3 top-3 text-lg text-[#6B7280]" />
//           <input
//             value={searchQuery}
//             onChange={onSearchChange}
//             className="min-h-11 w-full rounded-lg border border-[#D1D5DB] bg-white pl-10 pr-4 text-sm text-[#15243B] focus:border-[#1F5FAE] focus:outline-none focus:ring-1 focus:ring-[#1F5FAE] transition-all"
//             placeholder="Search students, staff, classes or records"
//           />
//         </label>
//       </div>

//       <div className="ml-auto flex items-center gap-3">
//         <div className="hidden text-right md:block">
//           <p className="text-xs text-[#6B7280]">Campus context</p>
//           <p className="text-sm font-semibold text-[#15243B]">Riverside Academy</p>
//         </div>

//         <button
//           onClick={onQuickActionClick}
//           className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#15243B] hover:bg-[#F9FAFB] transition-colors"
//           title="Quick Action"
//         >
//           <Icon icon="lucide:plus" className="text-xl" />
//         </button>

//         <button className="relative flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#15243B] hover:bg-[#F9FAFB] transition-colors">
//           <Icon icon="lucide:bell" className="text-xl" />
//           <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#EF4444] animate-pulse"></span>
//         </button>

//         <div className="relative" ref={dropdownRef}>
//           <button
//             onClick={onToggleProfileDropdown}
//             className="flex min-h-11 items-center gap-2 rounded-lg px-1 hover:bg-[#F9FAFB] transition-colors"
//           >
//             <img
//               src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100"
//               alt="Dr. Ananya Mehta"
//               className="h-10 w-10 rounded-full object-cover ring-2 ring-[#1F5FAE]/20"
//             />
//             <span className="hidden text-left lg:block">
//               <span className="block text-sm font-semibold text-[#15243B]">Dr. Mehta</span>
//               <span className="block text-xs text-[#6B7280]">Principal</span>
//             </span>
//             <Icon icon="lucide:chevron-down" className="hidden text-[#6B7280] lg:block" />
//           </button>

//           {isProfileDropdownOpen && (
//             <div className="absolute right-0 mt-2 w-48 rounded-lg border border-[#E5E7EB] bg-white p-2 shadow-lg z-50 animate-in slide-in-from-top-2 duration-200">
//               <a href="#profile" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[#15243B] hover:bg-[#F9FAFB] transition-colors">
//                 <Icon icon="lucide:user" /> My Profile
//               </a>
//               <a href="#settings" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[#15243B] hover:bg-[#F9FAFB] transition-colors">
//                 <Icon icon="lucide:settings" /> Settings
//               </a>
//               <hr className="my-1 border-[#E5E7EB]" />
//               <button
//                 onClick={() => alert('Logging out...')}
//                 className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
//               >
//                 <Icon icon="lucide:log-out" /> Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// const StatCard: React.FC<StatCardProps> = ({ icon, trend, trendType, label, value, subtext }) => {
//   const getTrendClass = () => {
//     switch (trendType) {
//       case 'positive':
//         return 'bg-[#E8F0FB] text-[#1F5FAE]';
//       case 'negative':
//         return 'bg-[#FEF2F2] text-[#EF4444]';
//       case 'accent':
//         return 'bg-[#FFF4D6] text-[#6B4B00]';
//       default:
//         return 'bg-[#F3F4F6] text-[#6B7280]';
//     }
//   };

//   return (
//     <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
//       <div className="flex items-start justify-between">
//         <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E8F0FB] text-[#1F5FAE]">
//           <Icon icon={icon} className="text-xl" />
//         </span>
//         <span className={`rounded-full px-2 py-1 text-xs font-semibold ${getTrendClass()}`}>
//           {trend}
//         </span>
//       </div>
//       <p className="mt-5 text-sm text-[#6B7280]">{label}</p>
//       <p className="mt-1 text-2xl font-bold text-[#15243B]">{value}</p>
//       <p className="mt-2 text-xs text-[#6B7280]">{subtext}</p>
//     </div>
//   );
// };

// const StudentStats: React.FC<StudentStatsProps> = ({ selectedYear, onYearChange }) => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setIsDropdownOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const data = {
//     labels: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
//     datasets: [
//       {
//         label: 'Students',
//         data: [88, 94, 96, 102, 100, 108, 110, 106, 112, 107, 109, 116],
//         backgroundColor: '#1F5FAE',
//         borderRadius: 6,
//         borderSkipped: false,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: false,
//       },
//     },
//     scales: {
//       x: {
//         grid: {
//           display: false,
//         },
//         ticks: {
//           color: '#6B7280',
//           font: {
//             size: 10,
//           },
//         },
//       },
//       y: {
//         beginAtZero: true,
//         grid: {
//           color: '#F3F4F6',
//         },
//         ticks: {
//           color: '#6B7280',
//           font: {
//             size: 11,
//           },
//         },
//       },
//     },
//   };

//   return (
//     <article className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm xl:col-span-2">
//       <div className="flex items-start justify-between">
//         <div>
//           <h2 className="text-lg font-semibold text-[#15243B]">Student statistics</h2>
//           <p className="mt-1 text-sm text-[#6B7280]">Class-wise distribution across Classes 1–12</p>
//         </div>
//         <div className="relative" ref={dropdownRef}>
//           <button
//             onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//             className="flex min-h-11 items-center rounded-lg border border-[#E5E7EB] px-3 text-xs font-semibold text-[#15243B] hover:bg-[#F9FAFB] transition-colors"
//           >
//             {selectedYear} <Icon icon="lucide:chevron-down" className="ml-1" />
//           </button>
//           {isDropdownOpen && (
//             <div className="absolute right-0 mt-1 w-36 rounded-lg border border-[#E5E7EB] bg-white p-1 shadow-lg z-10 animate-in slide-in-from-top-2 duration-200">
//               {['2025–26', '2024–25', '2023–24'].map((year) => (
//                 <button
//                   key={year}
//                   onClick={() => {
//                     onYearChange(year);
//                     setIsDropdownOpen(false);
//                   }}
//                   className="w-full text-left px-3 py-2 text-xs rounded-md hover:bg-[#F9FAFB] text-[#15243B] transition-colors"
//                 >
//                   {year}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//       <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
//         <div className="rounded-lg bg-[#F9FAFB] p-4 flex flex-col justify-between">
//           <div>
//             <p className="text-xs font-medium text-[#6B7280]">Total students</p>
//             <p className="mt-1 text-2xl font-bold text-[#15243B]">1,248</p>
//           </div>
//           <div>
//             <div className="mt-4 flex items-center justify-between text-xs">
//               <span className="flex items-center gap-1 text-[#6B7280]">
//                 <i className="h-2 w-2 rounded-full bg-[#1F5FAE] inline-block"></i>Male 648
//               </span>
//               <span className="flex items-center gap-1 text-[#6B7280]">
//                 <i className="h-2 w-2 rounded-full bg-[#10B981] inline-block"></i>Female 600
//               </span>
//             </div>
//             <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-white">
//               <span className="w-[52%] bg-[#1F5FAE]"></span>
//               <span className="w-[48%] bg-[#10B981]"></span>
//             </div>
//           </div>
//         </div>
//         <div className="lg:col-span-2">
//           <div className="h-64">
//             <Bar data={data} options={options} />
//           </div>
//         </div>
//       </div>
//     </article>
//   );
// };

// const AttendanceOverview: React.FC<AttendanceOverviewProps> = ({ present, absent, onLeave }) => {
//   const total = present + absent + onLeave;
//   const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : '0';

//   return (
//     <article className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm flex flex-col justify-between">
//       <div>
//         <div className="flex items-start justify-between">
//           <div>
//             <h2 className="text-lg font-semibold text-[#15243B]">Attendance overview</h2>
//             <p className="mt-1 text-sm text-[#6B7280]">Today’s verified registers</p>
//           </div>
//           <span className="rounded-full bg-[#E8F0FB] px-2 py-1 text-xs font-semibold text-[#1F5FAE]">
//             {percentage}%
//           </span>
//         </div>
//         <div className="mt-5 rounded-xl bg-[#E8F0FB] p-5 text-center">
//           <p className="text-4xl font-bold text-[#15243B]">{percentage}%</p>
//           <p className="mt-1 text-sm text-[#6B7280]">Attendance percentage</p>
//           <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
//             <div className="h-full rounded-full bg-[#10B981]" style={{ width: `${percentage}%` }}></div>
//           </div>
//         </div>
//       </div>
//       <div className="mt-5 grid grid-cols-3 gap-3 text-center">
//         <div className="p-2 rounded-lg bg-[#ECFDF5]">
//           <p className="text-lg font-bold text-[#10B981]">{present}</p>
//           <p className="text-xs text-[#6B7280]">Present</p>
//         </div>
//         <div className="p-2 rounded-lg bg-[#FEF2F2]">
//           <p className="text-lg font-bold text-[#EF4444]">{absent}</p>
//           <p className="text-xs text-[#6B7280]">Absent</p>
//         </div>
//         <div className="p-2 rounded-lg bg-[#E8F0FB]">
//           <p className="text-lg font-bold text-[#1F5FAE]">{onLeave}</p>
//           <p className="text-xs text-[#6B7280]">On Leave</p>
//         </div>
//       </div>
//     </article>
//   );
// };

// const FeeOverview: React.FC<FeeOverviewProps> = ({ total, collected, pending, percentage }) => {
//   const data = {
//     labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
//     datasets: [
//       {
//         label: 'Collected fees (₹L)',
//         data: [4.8, 5.6, 6.2, 5.1, 6.9, 5.7],
//         borderColor: '#10B981',
//         backgroundColor: 'rgba(16, 185, 129, 0.12)',
//         fill: true,
//         tension: 0.4,
//         pointBackgroundColor: '#10B981',
//         pointRadius: 4,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: false,
//       },
//     },
//     scales: {
//       x: {
//         grid: {
//           display: false,
//         },
//         ticks: {
//           color: '#6B7280',
//           font: {
//             size: 11,
//           },
//         },
//       },
//       y: {
//         beginAtZero: true,
//         grid: {
//           color: '#F3F4F6',
//         },
//         ticks: {
//           color: '#6B7280',
//           font: {
//             size: 11,
//           },
//           callback: function (value: any) {
//             return '₹' + value + 'L';
//           },
//         },
//       },
//     },
//   };

//   return (
//     <article className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm xl:col-span-2">
//       <div className="flex items-start justify-between">
//         <div>
//           <h2 className="text-lg font-semibold text-[#15243B]">Fee overview</h2>
//           <p className="mt-1 text-sm text-[#6B7280]">Term 2 collection performance</p>
//         </div>
//         <button
//           onClick={() => alert('Navigating to fee ledger...')}
//           className="text-sm font-semibold text-[#1F5FAE] flex items-center gap-1 hover:underline transition-colors"
//         >
//           View fee ledger <Icon icon="lucide:arrow-right" className="text-sm" />
//         </button>
//       </div>
//       <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
//         <div className="rounded-lg bg-[#F9FAFB] p-4">
//           <p className="text-xs text-[#6B7280]">Total fees</p>
//           <p className="mt-1 text-xl font-bold text-[#15243B]">{total}</p>
//         </div>
//         <div className="rounded-lg bg-[#E8F0FB] p-4">
//           <p className="text-xs text-[#6B7280]">Collected fees</p>
//           <p className="mt-1 text-xl font-bold text-[#1F5FAE]">{collected}</p>
//         </div>
//         <div className="rounded-lg bg-[#FFF4D6] p-4">
//           <p className="text-xs text-[#6B7280]">Pending fees</p>
//           <p className="mt-1 text-xl font-bold text-[#15243B]">{pending}</p>
//         </div>
//       </div>
//       <div className="mt-5 flex justify-between text-xs text-[#6B7280]">
//         <span>Collection percentage</span>
//         <span className="font-semibold text-[#10B981]">{percentage}%</span>
//       </div>
//       <div className="mt-2 h-3 overflow-hidden rounded-full bg-[#F3F4F6]">
//         <div className="h-full rounded-full bg-[#10B981]" style={{ width: `${percentage}%` }}></div>
//       </div>
//       <div className="mt-5 h-48">
//         <Line data={data} options={options} />
//       </div>
//     </article>
//   );
// };

// const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events, onAddEvent }) => {
//   return (
//     <article className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm flex flex-col justify-between">
//       <div>
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-lg font-semibold text-[#15243B]">Upcoming events</h2>
//             <p className="mt-1 text-sm text-[#6B7280]">Exams &amp; school calendar</p>
//           </div>
//           <button
//             onClick={onAddEvent}
//             className="min-h-11 text-sm font-semibold text-[#1F5FAE] hover:underline transition-colors"
//           >
//             Add Event
//           </button>
//         </div>
//         <div className="mt-4 space-y-4">
//           {events.map((event) => (
//             <div key={event.id} className="flex gap-3 group hover:bg-[#F9FAFB] p-2 rounded-lg transition-colors">
//               <div
//                 className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg ${
//                   event.type === 'primary' ? 'bg-[#E8F0FB] text-[#1F5FAE]' : 'bg-[#FFF4D6] text-[#6B4B00]'
//                 }`}
//               >
//                 <span className="text-xs font-semibold">{event.month}</span>
//                 <span className="text-base font-bold">{event.day}</span>
//               </div>
//               <div>
//                 <p className="text-sm font-semibold text-[#15243B]">{event.title}</p>
//                 <p className="mt-1 text-xs text-[#6B7280]">{event.details}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </article>
//   );
// };

// const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities, onViewAll }) => {
//   const getIcon = (type: string) => {
//     switch (type) {
//       case 'admission':
//         return 'lucide:user-plus';
//       case 'fee':
//         return 'lucide:credit-card';
//       case 'teacher':
//         return 'lucide:user-round-plus';
//       case 'homework':
//         return 'lucide:book-open-check';
//       default:
//         return 'lucide:info';
//     }
//   };

//   const getBgClass = (type: string) => {
//     switch (type) {
//       case 'admission':
//         return 'bg-[#E8F0FB] text-[#1F5FAE]';
//       case 'fee':
//         return 'bg-[#ECFDF5] text-[#10B981]';
//       case 'teacher':
//         return 'bg-[#E8F0FB] text-[#1F5FAE]';
//       case 'homework':
//         return 'bg-[#FFF4D6] text-[#6B4B00]';
//       default:
//         return 'bg-[#F3F4F6] text-[#6B7280]';
//     }
//   };

//   return (
//     <article className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm xl:col-span-3">
//       <div className="flex items-center justify-between border-b border-[#E5E7EB] p-5">
//         <div>
//           <h2 className="text-lg font-semibold text-[#15243B]">Recent activities</h2>
//           <p className="mt-1 text-sm text-[#6B7280]">Latest school operations recorded today</p>
//         </div>
//         <button onClick={onViewAll} className="text-sm font-semibold text-[#1F5FAE] hover:underline transition-colors">
//           View all
//         </button>
//       </div>
//       <div className="overflow-x-auto">
//         <table className="w-full text-left text-sm">
//           <thead className="bg-[#F9FAFB] text-xs text-[#6B7280]">
//             <tr>
//               <th className="px-5 py-3 font-semibold">Activity</th>
//               <th className="px-5 py-3 font-semibold">Operational detail</th>
//               <th className="px-5 py-3 font-semibold">Time</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-[#E5E7EB]">
//             {activities.map((activity) => (
//               <tr key={activity.id} className="hover:bg-[#F9FAFB] transition-colors">
//                 <td className="px-5 py-4">
//                   <div className="flex items-center gap-3">
//                     <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${getBgClass(activity.type)}`}>
//                       <Icon icon={getIcon(activity.type)} className="text-lg" />
//                     </span>
//                     <span className="font-semibold text-[#15243B]">{activity.title}</span>
//                   </div>
//                 </td>
//                 <td className="px-5 py-4 text-[#6B7280]">{activity.detail}</td>
//                 <td className="px-5 py-4 text-[#6B7280]">{activity.time}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </article>
//   );
// };

// const ImportantNotices: React.FC<ImportantNoticesProps> = ({ notices }) => {
//   const getTagClass = (type: string) => {
//     switch (type) {
//       case 'action':
//         return 'bg-[#FFF4D6] text-[#6B4B00]';
//       case 'academic':
//         return 'bg-[#E8F0FB] text-[#1F5FAE]';
//       default:
//         return 'bg-[#F3F4F6] text-[#6B7280]';
//     }
//   };

//   return (
//     <article className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm xl:col-span-2">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-lg font-semibold text-[#15243B]">Important notices</h2>
//           <p className="mt-1 text-sm text-[#6B7280]">For staff, parents &amp; students</p>
//         </div>
//         <Icon icon="lucide:megaphone" className="text-xl text-[#1F5FAE]" />
//       </div>
//       <div className="mt-5 space-y-4">
//         {notices.map((notice) => (
//           <div key={notice.id} className="rounded-lg border border-[#E5E7EB] p-4 hover:border-[#1F5FAE]/50 transition-all duration-200 hover:shadow-sm">
//             <div className="flex items-center justify-between gap-3">
//               <p className="text-sm font-semibold text-[#15243B]">{notice.title}</p>
//               <span className={`rounded-full px-2 py-1 text-xs font-semibold ${getTagClass(notice.tagType)}`}>
//                 {notice.tag}
//               </span>
//             </div>
//             <p className="mt-2 text-xs leading-5 text-[#6B7280]">{notice.content}</p>
//           </div>
//         ))}
//       </div>
//     </article>
//   );
// };

// const QuickActionModal: React.FC<QuickActionModalProps> = ({ isOpen, onClose, onSubmit }) => {
//   const [type, setType] = useState('admission');
//   const [title, setTitle] = useState('');
//   const [detail, setDetail] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   if (!isOpen) return null;

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!title || !detail) {
//       alert('Please fill in all fields');
//       return;
//     }
//     setIsSubmitting(true);
//     setTimeout(() => {
//       onSubmit({ type, title, detail });
//       setIsSubmitting(false);
//       setTitle('');
//       setDetail('');
//       onClose();
//     }, 1000);
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
//       <div className="w-full max-w-md rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-xl animate-in zoom-in-95 duration-200">
//         <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
//           <h3 className="text-lg font-bold text-[#15243B]">Quick Action</h3>
//           <button onClick={onClose} className="text-[#6B7280] hover:text-[#15243B] transition-colors">
//             <Icon icon="lucide:x" className="text-xl" />
//           </button>
//         </div>
//         <form onSubmit={handleSubmit} className="mt-4 space-y-4">
//           <div>
//             <label className="block text-xs font-semibold text-[#6B7280] uppercase">Action Type</label>
//             <select
//               value={type}
//               onChange={(e) => setType(e.target.value)}
//               className="mt-1 w-full rounded-lg border border-[#D1D5DB] bg-white p-2.5 text-sm text-[#15243B] focus:border-[#1F5FAE] focus:outline-none focus:ring-1 focus:ring-[#1F5FAE] transition-all"
//             >
//               <option value="admission">Student Admission</option>
//               <option value="fee">Fee Payment</option>
//               <option value="teacher">Teacher Addition</option>
//               <option value="homework">Homework Posted</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-xs font-semibold text-[#6B7280] uppercase">Title / Subject</label>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="e.g., Aarav Sharma admitted"
//               className="mt-1 w-full rounded-lg border border-[#D1D5DB] bg-white p-2.5 text-sm text-[#15243B] focus:border-[#1F5FAE] focus:outline-none focus:ring-1 focus:ring-[#1F5FAE] transition-all"
//             />
//           </div>
//           <div>
//             <label className="block text-xs font-semibold text-[#6B7280] uppercase">Operational Detail</label>
//             <textarea
//               value={detail}
//               onChange={(e) => setDetail(e.target.value)}
//               placeholder="e.g., Admitted to Class 4B under General Category"
//               rows={3}
//               className="mt-1 w-full rounded-lg border border-[#D1D5DB] bg-white p-2.5 text-sm text-[#15243B] focus:border-[#1F5FAE] focus:outline-none focus:ring-1 focus:ring-[#1F5FAE] transition-all"
//             />
//           </div>
//           <div className="flex justify-end gap-3 pt-2">
//             <button
//               type="button"
//               onClick={onClose}
//               className="rounded-lg border border-[#E5E7EB] px-4 py-2 text-sm font-semibold text-[#15243B] hover:bg-[#F9FAFB] transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="flex items-center justify-center rounded-lg bg-[#1F5FAE] px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-[#1F5FAE]/90 disabled:opacity-50 transition-all"
//             >
//               {isSubmitting ? (
//                 <>
//                   <Icon icon="lucide:loader-2" className="mr-2 animate-spin" />
//                   Processing...
//                 </>
//               ) : (
//                 'Submit Action'
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // --- MAIN COMPONENT ---

// const SchoolAdminDashboard: React.FC = () => {
//   // State variables
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
//   const [selectedAcademicYear, setSelectedAcademicYear] = useState('2025–26');
//   const [isQuickActionModalOpen, setIsQuickActionModalOpen] = useState(false);
//   const [currentTab, setCurrentTab] = useState('dashboard');
//   const [isExporting, setIsExporting] = useState(false);

//   // Dynamic Data States
//   const [activities, setActivities] = useState<ActivityItem[]>([
//     {
//       id: '1',
//       type: 'admission',
//       title: 'Student admission',
//       detail: 'Aarav Sharma admitted to Class 4B',
//       time: '15 min ago',
//     },
//     {
//       id: '2',
//       type: 'fee',
//       title: 'Fee payment',
//       detail: '₹32,500 received from N. Iyer, Class 8A',
//       time: '42 min ago',
//     },
//     {
//       id: '3',
//       type: 'teacher',
//       title: 'Teacher addition',
//       detail: 'Kavita Rao joined Mathematics Department',
//       time: '1 hr ago',
//     },
//     {
//       id: '4',
//       type: 'homework',
//       title: 'Homework posted',
//       detail: 'Science worksheet assigned to Class 7C',
//       time: '2 hrs ago',
//     },
//   ]);

//   const [events, setEvents] = useState<EventItem[]>([
//     {
//       id: '1',
//       month: 'FEB',
//       day: '18',
//       title: 'Inter-house Debate Finals',
//       details: 'Auditorium · 10:30 AM',
//       type: 'primary',
//     },
//     {
//       id: '2',
//       month: 'FEB',
//       day: '21',
//       title: 'Parent–Teacher Conference',
//       details: 'Senior Block · 9:00 AM',
//       type: 'accent',
//     },
//     {
//       id: '3',
//       month: 'FEB',
//       day: '24',
//       title: 'Term 2 Examination Begins',
//       details: 'Classes 6–12 · 8:30 AM',
//       type: 'primary',
//     },
//   ]);

//   const [notices, setNotices] = useState<NoticeItem[]>([
//     {
//       id: '1',
//       title: 'Transport route update',
//       tag: 'Action needed',
//       tagType: 'action',
//       content: 'Route 3 pickup timing changes take effect Wednesday, 18 February.',
//     },
//     {
//       id: '2',
//       title: 'Exam timetable published',
//       tag: 'Academic',
//       tagType: 'academic',
//       content: 'Term 2 schedule for Classes 6–12 has been shared with families.',
//     },
//     {
//       id: '3',
//       title: 'Staff briefing',
//       tag: 'Tomorrow',
//       tagType: 'tomorrow',
//       content: 'Department heads meet in the conference room at 3:30 PM.',
//     },
//   ]);

//   // Event Handlers
//   const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);
//   const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);
//   const closeProfileDropdown = () => setIsProfileDropdownOpen(false);

//   const handleExportReport = () => {
//     setIsExporting(true);
//     setTimeout(() => {
//       setIsExporting(false);
//       alert('Operational snapshot report exported successfully as PDF!');
//     }, 1500);
//   };

//   const handleQuickActionClick = () => {
//     setIsQuickActionModalOpen(true);
//   };

//   const handleAcademicYearSelect = (year: string) => {
//     setSelectedAcademicYear(year);
//   };

//   const handleQuickActionSubmit = (data: { type: string; title: string; detail: string }) => {
//     const newActivity: ActivityItem = {
//       id: Date.now().toString(),
//       type: data.type as any,
//       title: data.title,
//       detail: data.detail,
//       time: 'Just now',
//     };
//     setActivities([newActivity, ...activities]);
//   };

//   const handleAddEvent = () => {
//     const title = prompt('Enter event title:');
//     if (!title) return;
//     const details = prompt('Enter event details (e.g., Auditorium · 10:00 AM):') || 'TBD';
//     const day = prompt('Enter day (DD):') || '25';
//     const month = prompt('Enter month (MMM):') || 'FEB';

//     const newEvent: EventItem = {
//       id: Date.now().toString(),
//       month: month.toUpperCase(),
//       day,
//       title,
//       details,
//       type: Math.random() > 0.5 ? 'primary' : 'accent',
//     };
//     setEvents([...events, newEvent]);
//   };

//   // Filter activities based on search query
//   const filteredActivities = activities.filter(
//     (act) =>
//       act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       act.detail.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen w-full bg-[#F7F9FC] flex flex-col">
//       <div className="flex flex-1">
//         <Sidebar
//           isOpen={isSidebarOpen}
//           onClose={() => setIsSidebarOpen(false)}
//           currentTab={currentTab}
//           setCurrentTab={setCurrentTab}
//         />

//         <main className="min-w-0 flex-1">
//           <Header
//             onToggleSidebar={toggleSidebar}
//             searchQuery={searchQuery}
//             onSearchChange={handleSearchChange}
//             isProfileDropdownOpen={isProfileDropdownOpen}
//             onToggleProfileDropdown={toggleProfileDropdown}
//             onCloseProfileDropdown={closeProfileDropdown}
//             onQuickActionClick={handleQuickActionClick}
//           />

//           <div className="p-5 lg:p-8">
//             {/* Welcome & Action Section */}
//             <section className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
//               <div>
//                 <p className="text-sm font-semibold text-[#1F5FAE]">Monday, 16 February 2026</p>
//                 <h1 className="mt-1 text-2xl font-bold text-[#15243B]">Good morning, Dr. Mehta</h1>
//                 <p className="mt-1 text-sm text-[#6B7280]">Here is the operational snapshot for Riverside Academy.</p>
//               </div>
//               <div className="flex gap-3">
//                 <button
//                   onClick={handleExportReport}
//                   disabled={isExporting}
//                   className="flex min-h-11 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white px-4 text-sm font-semibold text-[#15243B] hover:bg-[#F9FAFB] disabled:opacity-50 transition-all"
//                 >
//                   {isExporting ? (
//                     <>
//                       <Icon icon="lucide:loader-2" className="mr-2 text-lg animate-spin" />
//                       Exporting...
//                     </>
//                   ) : (
//                     <>
//                       <Icon icon="lucide:download" className="mr-2 text-lg" />
//                       Export report
//                     </>
//                   )}
//                 </button>
//                 <button
//                   onClick={handleQuickActionClick}
//                   className="flex min-h-11 items-center justify-center rounded-lg bg-[#1F5FAE] px-4 text-sm font-semibold text-white shadow-md hover:bg-[#1F5FAE]/90 transition-all hover:shadow-lg"
//                 >
//                   <Icon icon="lucide:plus" className="mr-2 text-lg" />
//                   Quick action
//                 </button>
//               </div>
//             </section>

//             {/* Stats Grid */}
//             <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//               <StatCard
//                 icon="lucide:graduation-cap"
//                 trend="+4.8%"
//                 trendType="positive"
//                 label="Total Students"
//                 value="1,248"
//                 subtext="57 new admissions this term"
//               />
//               <StatCard
//                 icon="lucide:school"
//                 trend="Active"
//                 trendType="positive"
//                 label="Total Teachers"
//                 value="86"
//                 subtext="4 joining this month"
//               />
//               <StatCard
//                 icon="lucide:briefcase-business"
//                 trend="+2"
//                 trendType="neutral"
//                 label="Total Staff"
//                 value="42"
//                 subtext="Administration & support"
//               />
//               <StatCard
//                 icon="lucide:building-2"
//                 trend="1–12"
//                 trendType="neutral"
//                 label="Total Classes"
//                 value="48"
//                 subtext="Across 12 grade levels"
//               />
//               <StatCard
//                 icon="lucide:calendar-check"
//                 trend="94.2%"
//                 trendType="positive"
//                 label="Today’s Attendance"
//                 value="1,176"
//                 subtext="Of 1,248 enrolled students"
//               />
//               <StatCard
//                 icon="lucide:receipt-text"
//                 trend="Review"
//                 trendType="accent"
//                 label="Pending Fees"
//                 value="₹8.46L"
//                 subtext="118 family accounts pending"
//               />
//               <StatCard
//                 icon="lucide:clipboard-pen-line"
//                 trend="4 scheduled"
//                 trendType="positive"
//                 label="Upcoming Exams"
//                 value="12"
//                 subtext="Beginning 24 February"
//               />
//               <StatCard
//                 icon="lucide:book-marked"
//                 trend="7 classes"
//                 trendType="neutral"
//                 label="Pending Homework"
//                 value="31"
//                 subtext="Submissions due today"
//               />
//             </section>

//             {/* Charts & Attendance Section */}
//             <section className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-3">
//               <StudentStats
//                 selectedYear={selectedAcademicYear}
//                 onYearChange={handleAcademicYearSelect}
//               />
//               <AttendanceOverview
//                 present={1176}
//                 absent={52}
//                 onLeave={20}
//               />
//             </section>

//             {/* Fees & Events Section */}
//             <section className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-3">
//               <FeeOverview
//                 total="₹42.80L"
//                 collected="₹34.34L"
//                 pending="₹8.46L"
//                 percentage={80.2}
//               />
//               <UpcomingEvents
//                 events={events}
//                 onAddEvent={handleAddEvent}
//               />
//             </section>

//             {/* Activities & Notices Section */}
//             <section className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-5">
//               <RecentActivities
//                 activities={filteredActivities}
//                 onViewAll={() => alert('Navigating to all activities...')}
//               />
//               <ImportantNotices
//                 notices={notices}
//               />
//             </section>
//           </div>
//         </main>
//       </div>

//       {/* Quick Action Modal */}
//       <QuickActionModal
//         isOpen={isQuickActionModalOpen}
//         onClose={() => setIsQuickActionModalOpen(false)}
//         onSubmit={handleQuickActionSubmit}
//       />
//     </div>
//   );
// };

// export default SchoolAdminDashboard;












// Dashboard.tsx - Fixed Layout
import React, { useState } from 'react';
import { Icon } from '@iconify/react';

import StatCard from './StatCard';
import StudentStats from './StudentStatus';              // ✅ सही
import AttendanceOverview from './AttendanceOverviewProps';  // ✅ सही
import FeeOverview from './FeeOverview';
import UpcomingEvents from './UpcomingOverview';          // ✅ सही
import RecentActivities from './RecentActivities';
import ImportantNotices from './ImportantNotices';
import QuickActionModal from './QuickActionModel';      // ✅ सही



// Types
interface EventItem {
  id: string;
  month: string;
  day: string;
  title: string;
  details: string;
  type: 'primary' | 'accent';
}

interface ActivityItem {
  id: string;
  type: 'admission' | 'fee' | 'teacher' | 'homework';
  title: string;
  detail: string;
  time: string;
}

interface NoticeItem {
  id: string;
  title: string;
  tag: string;
  tagType: 'action' | 'academic' | 'tomorrow';
  content: string;
}

const SchoolAdminDashboard: React.FC = () => {
  // State variables
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('2025–26');
  const [isQuickActionModalOpen, setIsQuickActionModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Dynamic Data States
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'admission',
      title: 'Student admission',
      detail: 'Aarav Sharma admitted to Class 4B',
      time: '15 min ago',
    },
    {
      id: '2',
      type: 'fee',
      title: 'Fee payment',
      detail: '₹32,500 received from N. Iyer, Class 8A',
      time: '42 min ago',
    },
    {
      id: '3',
      type: 'teacher',
      title: 'Teacher addition',
      detail: 'Kavita Rao joined Mathematics Department',
      time: '1 hr ago',
    },
    {
      id: '4',
      type: 'homework',
      title: 'Homework posted',
      detail: 'Science worksheet assigned to Class 7C',
      time: '2 hrs ago',
    },
  ]);

  const [events, setEvents] = useState<EventItem[]>([
    {
      id: '1',
      month: 'FEB',
      day: '18',
      title: 'Inter-house Debate Finals',
      details: 'Auditorium · 10:30 AM',
      type: 'primary',
    },
    {
      id: '2',
      month: 'FEB',
      day: '21',
      title: 'Parent–Teacher Conference',
      details: 'Senior Block · 9:00 AM',
      type: 'accent',
    },
    {
      id: '3',
      month: 'FEB',
      day: '24',
      title: 'Term 2 Examination Begins',
      details: 'Classes 6–12 · 8:30 AM',
      type: 'primary',
    },
  ]);

  const [notices, setNotices] = useState<NoticeItem[]>([
    {
      id: '1',
      title: 'Transport route update',
      tag: 'Action needed',
      tagType: 'action',
      content: 'Route 3 pickup timing changes take effect Wednesday, 18 February.',
    },
    {
      id: '2',
      title: 'Exam timetable published',
      tag: 'Academic',
      tagType: 'academic',
      content: 'Term 2 schedule for Classes 6–12 has been shared with families.',
    },
    {
      id: '3',
      title: 'Staff briefing',
      tag: 'Tomorrow',
      tagType: 'tomorrow',
      content: 'Department heads meet in the conference room at 3:30 PM.',
    },
  ]);

  // Event Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);

  const handleExportReport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('Operational snapshot report exported successfully as PDF!');
    }, 1500);
  };

  const handleQuickActionClick = () => {
    setIsQuickActionModalOpen(true);
  };

  const handleAcademicYearSelect = (year: string) => {
    setSelectedAcademicYear(year);
  };

  const handleQuickActionSubmit = (data: { type: string; title: string; detail: string }) => {
    const newActivity: ActivityItem = {
      id: Date.now().toString(),
      type: data.type as any,
      title: data.title,
      detail: data.detail,
      time: 'Just now',
    };
    setActivities([newActivity, ...activities]);
  };

  const handleAddEvent = () => {
    const title = prompt('Enter event title:');
    if (!title) return;
    const details = prompt('Enter event details (e.g., Auditorium · 10:00 AM):') || 'TBD';
    const day = prompt('Enter day (DD):') || '25';
    const month = prompt('Enter month (MMM):') || 'FEB';

    const newEvent: EventItem = {
      id: Date.now().toString(),
      month: month.toUpperCase(),
      day,
      title,
      details,
      type: Math.random() > 0.5 ? 'primary' : 'accent',
    };
    setEvents([...events, newEvent]);
  };

  // Filter activities based on search query
  const filteredActivities = activities.filter(
    (act) =>
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.detail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full bg-[#F7F9FC]">
      <div className="p-5 lg:p-8">
        {/* Welcome & Action Section */}
        <section className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold text-[#1F5FAE]">Monday, 16 February 2026</p>
            <h1 className="mt-1 text-2xl font-bold text-[#15243B]">Good morning, Dr. Mehta</h1>
            <p className="mt-1 text-sm text-[#6B7280]">Here is the operational snapshot for Riverside Academy.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExportReport}
              disabled={isExporting}
              className="flex min-h-11 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white px-4 text-sm font-semibold text-[#15243B] hover:bg-[#F9FAFB] disabled:opacity-50 transition-all"
            >
              {isExporting ? (
                <>
                  <Icon icon="lucide:loader-2" className="mr-2 text-lg animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Icon icon="lucide:download" className="mr-2 text-lg" />
                  Export report
                </>
              )}
            </button>
            <button
              onClick={handleQuickActionClick}
              className="flex min-h-11 items-center justify-center rounded-lg bg-[#1F5FAE] px-4 text-sm font-semibold text-white shadow-md hover:bg-[#1F5FAE]/90 transition-all hover:shadow-lg"
            >
              <Icon icon="lucide:plus" className="mr-2 text-lg" />
              Quick action
            </button>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon="lucide:graduation-cap"
            trend="+4.8%"
            trendType="positive"
            label="Total Students"
            value="1,248"
            subtext="57 new admissions this term"
          />
          <StatCard
            icon="lucide:school"
            trend="Active"
            trendType="positive"
            label="Total Teachers"
            value="86"
            subtext="4 joining this month"
          />
          <StatCard
            icon="lucide:briefcase-business"
            trend="+2"
            trendType="neutral"
            label="Total Staff"
            value="42"
            subtext="Administration & support"
          />
          <StatCard
            icon="lucide:building-2"
            trend="1–12"
            trendType="neutral"
            label="Total Classes"
            value="48"
            subtext="Across 12 grade levels"
          />
          <StatCard
            icon="lucide:calendar-check"
            trend="94.2%"
            trendType="positive"
            label="Today’s Attendance"
            value="1,176"
            subtext="Of 1,248 enrolled students"
          />
          <StatCard
            icon="lucide:receipt-text"
            trend="Review"
            trendType="accent"
            label="Pending Fees"
            value="₹8.46L"
            subtext="118 family accounts pending"
          />
          <StatCard
            icon="lucide:clipboard-pen-line"
            trend="4 scheduled"
            trendType="positive"
            label="Upcoming Exams"
            value="12"
            subtext="Beginning 24 February"
          />
          <StatCard
            icon="lucide:book-marked"
            trend="7 classes"
            trendType="neutral"
            label="Pending Homework"
            value="31"
            subtext="Submissions due today"
          />
        </section>

        {/* Charts & Attendance Section */}
        <section className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-3">
          <StudentStats
            selectedYear={selectedAcademicYear}
            onYearChange={handleAcademicYearSelect}
          />
          <AttendanceOverview
            present={1176}
            absent={52}
            onLeave={20}
          />
        </section>

        {/* Fees & Events Section */}
        <section className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-3">
          <FeeOverview
            total="₹42.80L"
            collected="₹34.34L"
            pending="₹8.46L"
            percentage={80.2}
          />
          <UpcomingEvents
            events={events}
            onAddEvent={handleAddEvent}
          />
        </section>

        {/* Activities & Notices Section */}
        <section className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-5">
          <RecentActivities
            activities={filteredActivities}
            onViewAll={() => alert('Navigating to all activities...')}
          />
          <ImportantNotices
            notices={notices}
          />
        </section>
      </div>

      {/* Quick Action Modal */}
      <QuickActionModal
        isOpen={isQuickActionModalOpen}
        onClose={() => setIsQuickActionModalOpen(false)}
        onSubmit={handleQuickActionSubmit}
      />
    </div>
  );
};

export default SchoolAdminDashboard;