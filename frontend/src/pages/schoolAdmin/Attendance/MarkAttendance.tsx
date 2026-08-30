// import React, { useState, useEffect, useMemo } from 'react';
// import { Icon } from '@iconify/react';

// // ==========================================
// // TYPES & INTERFACES
// // ==========================================

// interface Student {
//   id: string;
//   name: string;
//   avatar: string;
//   admissionNo: string;
//   rollNo: string;
//   class: string;
//   section: string;
//   status: 'present' | 'absent' | 'leave';
//   remark: string;
// }

// interface Stats {
//   total: number;
//   present: number;
//   absent: number;
//   leave: number;
//   percentage: string;
// }

// // ==========================================
// // MOCK DATA GENERATOR
// // ==========================================

// const INITIAL_STUDENTS: Student[] = [
//   { id: '1', name: 'Aarav Mehta', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', admissionNo: 'ADM-26041', rollNo: '01', class: 'Class 6', section: 'Section A', status: 'present', remark: '' },
//   { id: '2', name: 'Diya Sharma', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', admissionNo: 'ADM-26042', rollNo: '02', class: 'Class 6', section: 'Section A', status: 'absent', remark: 'Sick' },
//   { id: '3', name: 'Kabir Singh', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', admissionNo: 'ADM-26043', rollNo: '03', class: 'Class 6', section: 'Section A', status: 'leave', remark: 'Medical Leave' },
//   { id: '4', name: 'Ananya Iyer', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', admissionNo: 'ADM-26044', rollNo: '04', class: 'Class 6', section: 'Section A', status: 'present', remark: '' },
//   { id: '5', name: 'Ishaan Patel', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', admissionNo: 'ADM-26045', rollNo: '05', class: 'Class 6', section: 'Section A', status: 'present', remark: '' },
//   { id: '6', name: 'Meera Reddy', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', admissionNo: 'ADM-26046', rollNo: '06', class: 'Class 6', section: 'Section A', status: 'present', remark: '' },
//   { id: '7', name: 'Rohan Gupta', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', admissionNo: 'ADM-26047', rollNo: '07', class: 'Class 6', section: 'Section A', status: 'present', remark: '' },
//   { id: '8', name: 'Sanya Malhotra', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150', admissionNo: 'ADM-26048', rollNo: '08', class: 'Class 6', section: 'Section A', status: 'present', remark: '' },
//   { id: '9', name: 'Aditya Rao', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', admissionNo: 'ADM-26049', rollNo: '09', class: 'Class 6', section: 'Section B', status: 'present', remark: '' },
//   { id: '10', name: 'Riya Sen', avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150', admissionNo: 'ADM-26050', rollNo: '10', class: 'Class 6', section: 'Section B', status: 'absent', remark: 'Family Event' },
//   { id: '11', name: 'Dev Bajwa', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150', admissionNo: 'ADM-26051', rollNo: '11', class: 'Class 1', section: 'Section A', status: 'present', remark: '' },
//   { id: '12', name: 'Kiara Advani', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150', admissionNo: 'ADM-26052', rollNo: '12', class: 'Class 1', section: 'Section A', status: 'leave', remark: 'Out of station' },
// ];

// // Generate extra mock students to reach a realistic count of 48
// const generateExtraStudents = (): Student[] => {
//   const list = [...INITIAL_STUDENTS];
//   const names = [
//     'Arjun', 'Bhavna', 'Chirag', 'Deepika', 'Eshwar', 'Farhan', 'Gitanjali', 'Hari', 'Indu', 'Jay',
//     'Kavita', 'Laksh', 'Manish', 'Neha', 'Om', 'Pooja', 'Rahul', 'Shruti', 'Tarun', 'Urshila',
//     'Varun', 'Yash', 'Zoya', 'Amit', 'Sneha', 'Vikram', 'Preeti', 'Rajesh', 'Komal', 'Sanjay',
//     'Nisha', 'Alok', 'Divya', 'Manoj', 'Ritu', 'Sunil'
//   ];
  
//   for (let i = 0; i < 36; i++) {
//     const id = (list.length + 1).toString();
//     const name = `${names[i % names.length]} ${['Sharma', 'Verma', 'Joshi', 'Chawla', 'Saxena', 'Nair'][i % 6]}`;
//     const isClass6 = i % 3 !== 0;
//     const selectedClass = isClass6 ? 'Class 6' : (i % 2 === 0 ? 'Class 2' : 'Class 10');
//     const section = i % 2 === 0 ? 'Section A' : 'Section B';
//     const status: 'present' | 'absent' | 'leave' = i % 12 === 0 ? 'absent' : (i % 15 === 0 ? 'leave' : 'present');
    
//     list.push({
//       id,
//       name,
//       avatar: `https://images.unsplash.com/photo-${1500000000000 + i * 10000}?w=150`,
//       admissionNo: `ADM-260${52 + i}`,
//       rollNo: (i + 13).toString().padStart(2, '0'),
//       class: selectedClass,
//       section,
//       status,
//       remark: status === 'absent' ? 'Unexcused' : status === 'leave' ? 'Approved Leave' : ''
//     });
//   }
//   return list;
// };

// const ALL_MOCK_STUDENTS = generateExtraStudents();

// // ==========================================
// // SUB-COMPONENTS
// // ==========================================

// // --- HEADER ---
// interface HeaderProps {
//   onMarkAttendance: () => void;
// }

// const Header: React.FC<HeaderProps> = ({ onMarkAttendance }) => {
//   return (
//     <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
//       <div>
//         <p className="text-sm text-gray-500 flex items-center gap-1">
//           <span>Attendance</span>
//           <Icon icon="lucide:chevron-right" className="w-3 h-3" />
//           <span>Student Attendance</span>
//         </p>
//         <h1 className="mt-2 text-2xl font-bold text-gray-900 text-balance">Attendance</h1>
//         <p className="mt-1 text-sm text-gray-500 text-pretty">
//           Mark, review and manage student attendance by class and section.
//         </p>
//       </div>
//       <button 
//         onClick={onMarkAttendance}
//         className="min-h-11 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
//       >
//         <Icon icon="lucide:check-square" className="w-4 h-4" />
//         Mark Attendance
//       </button>
//     </div>
//   );
// };

// // --- STATS SUMMARY ---
// interface StatsSummaryProps {
//   stats: Stats;
// }

// const StatsSummary: React.FC<StatsSummaryProps> = ({ stats }) => {
//   return (
//     <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
//       <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
//         <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
//           <Icon icon="lucide:users" className="w-3.5 h-3.5 text-blue-600" />
//           Total Students
//         </p>
//         <p className="mt-2 text-2xl font-bold text-gray-900">{stats.total}</p>
//       </div>
//       <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
//         <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
//           <Icon icon="lucide:user-check" className="w-3.5 h-3.5 text-green-600" />
//           Present
//         </p>
//         <p className="mt-2 text-2xl font-bold text-green-600">{stats.present}</p>
//       </div>
//       <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
//         <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
//           <Icon icon="lucide:user-x" className="w-3.5 h-3.5 text-red-600" />
//           Absent
//         </p>
//         <p className="mt-2 text-2xl font-bold text-red-600">{stats.absent}</p>
//       </div>
//       <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
//         <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
//           <Icon icon="lucide:calendar-days" className="w-3.5 h-3.5 text-yellow-600" />
//           On Leave
//         </p>
//         <p className="mt-2 text-2xl font-bold text-gray-900">{stats.leave}</p>
//       </div>
//       <div className="col-span-2 rounded-xl border border-gray-200 bg-white p-4 lg:col-span-1 shadow-sm">
//         <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
//           <Icon icon="lucide:percent" className="w-3.5 h-3.5 text-indigo-600" />
//           Attendance Percentage
//         </p>
//         <div className="mt-2 flex items-center gap-3">
//           <p className="text-2xl font-bold text-gray-900">{stats.percentage}</p>
//           <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">Today</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- FILTER BAR ---
// interface FilterBarProps {
//   academicYear: string;
//   selectedClass: string;
//   selectedSection: string;
//   selectedDate: string;
//   searchQuery: string;
//   onAcademicYearChange: (val: string) => void;
//   onClassChange: (val: string) => void;
//   onSectionChange: (val: string) => void;
//   onDateChange: (val: string) => void;
//   onSearchChange: (val: string) => void;
//   onResetFilters: () => void;
// }

// const FilterBar: React.FC<FilterBarProps> = ({
//   academicYear,
//   selectedClass,
//   selectedSection,
//   selectedDate,
//   searchQuery,
//   onAcademicYearChange,
//   onClassChange,
//   onSectionChange,
//   onDateChange,
//   onSearchChange,
//   onResetFilters,
// }) => {
//   return (
//     <div className="border-b border-gray-200 p-5">
//       <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
//         <label className="flex-1 text-sm font-medium text-gray-700">
//           Academic Year *
//           <select 
//             value={academicYear}
//             onChange={(e) => onAcademicYearChange(e.target.value)}
//             className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
//           >
//             <option value="2026-2027">2026-2027</option>
//             <option value="2025-2026">2025-2026</option>
//           </select>
//         </label>

//         <label className="flex-1 text-sm font-medium text-gray-700">
//           Class *
//           <select 
//             value={selectedClass}
//             onChange={(e) => onClassChange(e.target.value)}
//             className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
//           >
//             <option value="Class 6">Class 6</option>
//             <option value="Class 1">Class 1</option>
//             <option value="Class 2">Class 2</option>
//             <option value="Class 10">Class 10</option>
//           </select>
//         </label>

//         <label className="flex-1 text-sm font-medium text-gray-700">
//           Section *
//           <select 
//             value={selectedSection}
//             onChange={(e) => onSectionChange(e.target.value)}
//             className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
//           >
//             <option value="Section A">Section A</option>
//             <option value="Section B">Section B</option>
//             <option value="Section C">Section C</option>
//           </select>
//           <span className="mt-1 block text-xs text-gray-500">Sections shown for {selectedClass}</span>
//         </label>

//         <label className="flex-1 text-sm font-medium text-gray-700">
//           Date *
//           <input 
//             type="date" 
//             value={selectedDate} 
//             onChange={(e) => onDateChange(e.target.value)}
//             className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900" 
//           />
//         </label>
//       </div>

//       <div className="mt-4 flex flex-col gap-3 md:flex-row">
//         <div className="flex-1 text-sm font-medium text-gray-700">
//           <label htmlFor="search-student">Search Student</label>
//           <div className="relative mt-2">
//             <Icon icon="lucide:search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input 
//               id="search-student"
//               type="text"
//               value={searchQuery}
//               onChange={(e) => onSearchChange(e.target.value)}
//               placeholder="Search by student name, admission number or roll number" 
//               className="min-h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400" 
//             />
//           </div>
//         </div>
//         <button 
//           onClick={onResetFilters}
//           className="min-h-11 self-end rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
//         >
//           <Icon icon="lucide:rotate-ccw" className="w-4 h-4" />
//           Reset Filters
//         </button>
//       </div>
//     </div>
//   );
// };

// // --- STUDENT ROW ---
// interface StudentRowProps {
//   student: Student;
//   onStatusChange: (id: string, status: 'present' | 'absent' | 'leave') => void;
//   onRemarkChange: (id: string, remark: string) => void;
// }

// const StudentRow: React.FC<StudentRowProps> = ({ student, onStatusChange, onRemarkChange }) => {
//   return (
//     <tr className="hover:bg-gray-50/30 transition-colors">
//       <td className="px-5 py-4">
//         <div className="flex items-center gap-3 text-left">
//           <img 
//             className="h-9 w-9 rounded-full object-cover border border-gray-200" 
//             src={student.avatar} 
//             alt={student.name} 
//             onError={(e) => {
//               (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`;
//             }}
//           />
//           <span className="font-semibold text-gray-900">{student.name}</span>
//         </div>
//       </td>
//       <td className="px-4 py-4 text-gray-500 font-mono text-xs">{student.admissionNo}</td>
//       <td className="px-4 py-4 font-medium text-gray-900">{student.rollNo}</td>
//       <td className="px-4 py-4 text-gray-500">{student.class}</td>
//       <td className="px-4 py-4 text-gray-500">{student.section.replace('Section ', '')}</td>
//       <td className="px-4 py-4">
//         <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
//           <button 
//             onClick={() => onStatusChange(student.id, 'present')}
//             className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
//               student.status === 'present' 
//                 ? 'bg-green-600 text-white shadow-sm' 
//                 : 'text-gray-600 hover:text-green-600'
//             }`}
//           >
//             Present
//           </button>
//           <button 
//             onClick={() => onStatusChange(student.id, 'absent')}
//             className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
//               student.status === 'absent' 
//                 ? 'bg-red-600 text-white shadow-sm' 
//                 : 'text-gray-600 hover:text-red-600'
//             }`}
//           >
//             Absent
//           </button>
//           <button 
//             onClick={() => onStatusChange(student.id, 'leave')}
//             className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
//               student.status === 'leave' 
//                 ? 'bg-yellow-500 text-yellow-900 shadow-sm' 
//                 : 'text-gray-600 hover:text-yellow-700'
//             }`}
//           >
//             Leave
//           </button>
//         </div>
//       </td>
//       <td className="px-4 py-4">
//         <input 
//           type="text"
//           value={student.remark}
//           onChange={(e) => onRemarkChange(student.id, e.target.value)}
//           placeholder="Optional remark" 
//           className="min-h-10 w-40 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400" 
//         />
//       </td>
//     </tr>
//   );
// };

// // --- STUDENT TABLE ---
// interface StudentTableProps {
//   students: Student[];
//   onStatusChange: (id: string, status: 'present' | 'absent' | 'leave') => void;
//   onRemarkChange: (id: string, remark: string) => void;
// }

// const StudentTable: React.FC<StudentTableProps> = ({ students, onStatusChange, onRemarkChange }) => {
//   return (
//     <div className="overflow-x-auto">
//       <table className="w-full min-w-[980px] text-left text-sm">
//         <thead className="bg-gray-50 text-xs uppercase text-gray-500">
//           <tr>
//             <th className="px-5 py-3 font-semibold">Student</th>
//             <th className="px-4 py-3 font-semibold">Admission Number</th>
//             <th className="px-4 py-3 font-semibold">Roll Number</th>
//             <th className="px-4 py-3 font-semibold">Class</th>
//             <th className="px-4 py-3 font-semibold">Section</th>
//             <th className="px-4 py-3 font-semibold">Attendance Status</th>
//             <th className="px-4 py-3 font-semibold">Remarks</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-gray-200">
//           {students.map((student) => (
//             <StudentRow 
//               key={student.id} 
//               student={student} 
//               onStatusChange={onStatusChange} 
//               onRemarkChange={onRemarkChange} 
//             />
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// // --- PAGINATION ---
// interface PaginationProps {
//   totalItems: number;
//   itemsPerPage: number;
//   currentPage: number;
//   onPrevPage: () => void;
//   onNextPage: () => void;
//   onCancelChanges: () => void;
//   onSaveAttendance: () => void;
//   isSaving: boolean;
// }

// const Pagination: React.FC<PaginationProps> = ({
//   totalItems,
//   itemsPerPage,
//   currentPage,
//   onPrevPage,
//   onNextPage,
//   onCancelChanges,
//   onSaveAttendance,
//   isSaving,
// }) => {
//   const startIdx = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
//   const endIdx = Math.min(currentPage * itemsPerPage, totalItems);

//   return (
//     <div className="flex flex-col gap-4 border-t border-gray-200 p-5 md:flex-row md:items-center md:justify-between">
//       <div className="flex items-center gap-3 text-sm text-gray-500">
//         <span>Showing {startIdx}-{endIdx} of {totalItems} students</span>
//         <div className="flex gap-1">
//           <button 
//             onClick={onPrevPage}
//             disabled={currentPage === 1}
//             className="min-h-11 rounded-lg border border-gray-300 px-3 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors flex items-center gap-1 text-gray-700"
//           >
//             <Icon icon="lucide:chevron-left" className="w-4 h-4" />
//             Previous
//           </button>
//           <button 
//             onClick={onNextPage}
//             disabled={endIdx >= totalItems}
//             className="min-h-11 rounded-lg border border-gray-300 px-3 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors flex items-center gap-1 text-gray-700"
//           >
//             Next
//             <Icon icon="lucide:chevron-right" className="w-4 h-4" />
//           </button>
//         </div>
//       </div>
//       <div className="flex gap-3">
//         <button 
//           onClick={onCancelChanges}
//           className="min-h-11 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
//         >
//           Cancel Changes
//         </button>
//         <button 
//           onClick={onSaveAttendance}
//           disabled={isSaving}
//           className="min-h-11 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-75"
//         >
//           {isSaving ? (
//             <>
//               <Icon icon="lucide:loader-2" className="w-4 h-4 animate-spin" />
//               Saving...
//             </>
//           ) : (
//             <>
//               <Icon icon="lucide:save" className="w-4 h-4" />
//               Save Attendance
//             </>
//           )}
//         </button>
//       </div>
//     </div>
//   );
// };

// // --- SYSTEM STATUS ALERT ---
// interface SystemStatusAlertProps {
//   systemState: 'idle' | 'loading' | 'error' | 'saving' | 'success' | 'empty';
//   onRetry: () => void;
//   onSetState: (state: 'idle' | 'loading' | 'error' | 'saving' | 'success' | 'empty') => void;
// }

// const SystemStatusAlert: React.FC<SystemStatusAlertProps> = ({ systemState, onRetry, onSetState }) => {
//   return (
//     <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500 flex flex-wrap items-center gap-2">
//       <span className="font-semibold text-gray-700 flex items-center gap-1">
//         <Icon icon="lucide:terminal" className="w-4 h-4 text-blue-600" />
//         System states:
//       </span>
      
//       <button 
//         onClick={() => onSetState('loading')}
//         className={`px-2 py-1 rounded transition-colors ${systemState === 'loading' ? 'bg-blue-600/10 text-blue-600 font-medium' : 'hover:text-gray-700'}`}
//       >
//         Loading students…
//       </button>
//       · 
//       <button 
//         onClick={() => onSetState('error')}
//         className={`px-2 py-1 rounded transition-colors ${systemState === 'error' ? 'bg-red-600/10 text-red-600 font-medium' : 'hover:text-gray-700'}`}
//       >
//         Unable to load students.
//       </button>
//       <button onClick={onRetry} className="font-semibold text-blue-600 hover:underline">Retry</button>
//       · 
//       <button 
//         onClick={() => onSetState('empty')}
//         className={`px-2 py-1 rounded transition-colors ${systemState === 'empty' ? 'bg-yellow-500/10 text-yellow-600 font-medium' : 'hover:text-gray-700'}`}
//       >
//         No students found
//       </button>
//       · 
//       <button 
//         onClick={() => onSetState('saving')}
//         className={`px-2 py-1 rounded transition-colors ${systemState === 'saving' ? 'bg-indigo-500/10 text-indigo-600 font-medium' : 'hover:text-gray-700'}`}
//       >
//         Saving attendance…
//       </button>
//       · 
//       <button 
//         onClick={() => onSetState('success')}
//         className={`px-2 py-1 rounded transition-colors ${systemState === 'success' ? 'bg-green-600/10 text-green-600 font-medium' : 'hover:text-gray-700'}`}
//       >
//         Attendance saved successfully.
//       </button>
//       ·
//       <button 
//         onClick={() => onSetState('idle')}
//         className={`px-2 py-1 rounded transition-colors ${systemState === 'idle' ? 'bg-gray-500/10 text-gray-700 font-medium' : 'hover:text-gray-700'}`}
//       >
//         Reset to Idle
//       </button>
//     </div>
//   );
// };

// // ==========================================
// // MAIN COMPONENT
// // ==========================================

// const MarkAttendance: React.FC = () => {
//   // State variables
//   const [academicYear, setAcademicYear] = useState<string>('2026-2027');
//   const [selectedClass, setSelectedClass] = useState<string>('Class 6');
//   const [selectedSection, setSelectedSection] = useState<string>('Section A');
//   const [selectedDate, setSelectedDate] = useState<string>('2026-08-25');
//   const [searchQuery, setSearchQuery] = useState<string>('');
//   const [students, setStudents] = useState<Student[]>(ALL_MOCK_STUDENTS);
//   const [savedStudents, setSavedStudents] = useState<Student[]>(ALL_MOCK_STUDENTS);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [systemState, setSystemState] = useState<'idle' | 'loading' | 'error' | 'saving' | 'success' | 'empty'>('idle');

//   const itemsPerPage = 8;

//   // Simulate loading when filters change
//   useEffect(() => {
//     setSystemState('loading');
//     const timer = setTimeout(() => {
//       setSystemState('idle');
//     }, 800);
//     return () => clearTimeout(timer);
//   }, [selectedClass, selectedSection, academicYear, selectedDate]);

//   // Filtered students logic
//   const filteredStudents = useMemo(() => {
//     if (systemState === 'loading' || systemState === 'error') return [];
    
//     const result = students.filter((student) => {
//       const matchesClass = student.class === selectedClass;
//       const matchesSection = student.section === selectedSection;
      
//       const query = searchQuery.toLowerCase().trim();
//       const matchesSearch = query === '' || 
//         student.name.toLowerCase().includes(query) ||
//         student.admissionNo.toLowerCase().includes(query) ||
//         student.rollNo.includes(query);

//       return matchesClass && matchesSection && matchesSearch;
//     });

//     return result;
//   }, [students, selectedClass, selectedSection, searchQuery, systemState]);

//   // Reset page when filters or search changes
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [selectedClass, selectedSection, searchQuery]);

//   // Calculate stats based on filtered students
//   const stats = useMemo((): Stats => {
//     const total = filteredStudents.length;
//     if (total === 0) return { total: 0, present: 0, absent: 0, leave: 0, percentage: '0%' };

//     const present = filteredStudents.filter(s => s.status === 'present').length;
//     const absent = filteredStudents.filter(s => s.status === 'absent').length;
//     const leave = filteredStudents.filter(s => s.status === 'leave').length;
//     const percentage = ((present / total) * 100).toFixed(1) + '%';

//     return { total, present, absent, leave, percentage };
//   }, [filteredStudents]);

//   // Event Handlers
//   const handleAcademicYearChange = (val: string) => setAcademicYear(val);
//   const handleClassChange = (val: string) => setSelectedClass(val);
//   const handleSectionChange = (val: string) => setSelectedSection(val);
//   const handleDateChange = (val: string) => setSelectedDate(val);
//   const handleSearchChange = (val: string) => setSearchQuery(val);

//   const handleResetFilters = () => {
//     setAcademicYear('2026-2027');
//     setSelectedClass('Class 6');
//     setSelectedSection('Section A');
//     setSelectedDate('2026-08-25');
//     setSearchQuery('');
//   };

//   const handleMarkAllPresent = () => {
//     const updated = students.map(student => {
//       const isFiltered = student.class === selectedClass && student.section === selectedSection;
//       if (isFiltered) {
//         return { ...student, status: 'present' as const };
//       }
//       return student;
//     });
//     setStudents(updated);
//   };

//   const handleStatusChange = (id: string, status: 'present' | 'absent' | 'leave') => {
//     setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));
//   };

//   const handleRemarkChange = (id: string, remark: string) => {
//     setStudents(prev => prev.map(s => s.id === id ? { ...s, remark } : s));
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 1) setCurrentPage(prev => prev - 1);
//   };

//   const handleNextPage = () => {
//     const maxPage = Math.ceil(filteredStudents.length / itemsPerPage);
//     if (currentPage < maxPage) setCurrentPage(prev => prev + 1);
//   };

//   const handleCancelChanges = () => {
//     setStudents(savedStudents);
//   };

//   const handleSaveAttendance = () => {
//     setSystemState('saving');
//     setTimeout(() => {
//       setSavedStudents(students);
//       setSystemState('success');
//       setTimeout(() => setSystemState('idle'), 3000);
//     }, 1200);
//   };

//   const handleRetry = () => {
//     setSystemState('loading');
//     setTimeout(() => {
//       setSystemState('idle');
//     }, 1000);
//   };

//   // Paginated slice
//   const paginatedStudents = useMemo(() => {
//     const start = (currentPage - 1) * itemsPerPage;
//     return filteredStudents.slice(start, start + itemsPerPage);
//   }, [filteredStudents, currentPage, itemsPerPage]);

//   return (
//     <div className="min-h-screen w-full bg-gray-50 flex flex-col relative">
//       <main className="w-full p-5 md:p-8 space-y-6 max-w-7xl mx-auto">
        
//         {/* Header */}
//         <Header onMarkAttendance={handleMarkAllPresent} />

//         {/* Stats Summary */}
//         <StatsSummary stats={stats} />

//         {/* Main Section */}
//         <section className="rounded-xl border border-gray-200 bg-white shadow-md overflow-hidden">
          
//           {/* Filter Bar */}
//           <FilterBar 
//             academicYear={academicYear}
//             selectedClass={selectedClass}
//             selectedSection={selectedSection}
//             selectedDate={selectedDate}
//             searchQuery={searchQuery}
//             onAcademicYearChange={handleAcademicYearChange}
//             onClassChange={handleClassChange}
//             onSectionChange={handleSectionChange}
//             onDateChange={handleDateChange}
//             onSearchChange={handleSearchChange}
//             onResetFilters={handleResetFilters}
//           />

//           {/* Table Header Info */}
//           <div className="flex flex-col gap-3 border-b border-gray-200 p-5 md:flex-row md:items-center md:justify-between bg-gray-50/20">
//             <div>
//               <h2 className="text-lg font-bold text-gray-900">
//                 {selectedClass} · {selectedSection}
//               </h2>
//               <p className="mt-1 text-sm text-gray-500">
//                 {filteredStudents.length} students loaded for {new Date(selectedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
//               </p>
//             </div>
//             <button 
//               onClick={handleMarkAllPresent}
//               className="min-h-11 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
//             >
//               <Icon icon="lucide:check-all" className="w-4 h-4" />
//               Mark All Present
//             </button>
//           </div>

//           {/* Conditional Rendering based on System State */}
//           {systemState === 'loading' ? (
//             <div className="p-12 flex flex-col items-center justify-center text-gray-500 gap-3">
//               <Icon icon="lucide:loader-2" className="w-8 h-8 animate-spin text-blue-600" />
//               <p className="text-sm font-medium">Loading student records...</p>
//             </div>
//           ) : systemState === 'error' ? (
//             <div className="p-12 flex flex-col items-center justify-center text-gray-500 gap-3">
//               <Icon icon="lucide:alert-circle" className="w-8 h-8 text-red-600" />
//               <p className="text-sm font-medium text-red-600">Unable to load students. Please try again.</p>
//               <button onClick={handleRetry} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
//                 Retry Connection
//               </button>
//             </div>
//           ) : systemState === 'empty' || filteredStudents.length === 0 ? (
//             <div className="p-12 flex flex-col items-center justify-center text-gray-500 gap-3">
//               <Icon icon="lucide:users" className="w-8 h-8 text-gray-400" />
//               <p className="text-sm font-medium">No students found matching the criteria.</p>
//               <button onClick={handleResetFilters} className="text-sm text-blue-600 font-semibold hover:underline">
//                 Clear Filters
//               </button>
//             </div>
//           ) : (
//             <>
//               {/* Student Table */}
//               <StudentTable 
//                 students={paginatedStudents} 
//                 onStatusChange={handleStatusChange} 
//                 onRemarkChange={handleRemarkChange} 
//               />

//               {/* Pagination & Actions */}
//               <Pagination 
//                 totalItems={filteredStudents.length}
//                 itemsPerPage={itemsPerPage}
//                 currentPage={currentPage}
//                 onPrevPage={handlePrevPage}
//                 onNextPage={handleNextPage}
//                 onCancelChanges={handleCancelChanges}
//                 onSaveAttendance={handleSaveAttendance}
//                 isSaving={systemState === 'saving'}
//               />
//             </>
//           )}
//         </section>

//         {/* System Status Alert Bar */}
//         <SystemStatusAlert 
//           systemState={systemState} 
//           onRetry={handleRetry} 
//           onSetState={setSystemState} 
//         />
//       </main>
//     </div>
//   );
// };

// export default MarkAttendance;







import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Icon } from "@iconify/react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import api
  from "../../../api/axios";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks";

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
  getAttendance,
  markBulkAttendance,
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

  firstName: string;

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

  rollNumber:
    string | number;

  profileImage: string;

  className: string;

  sectionName: string;

  status:
    AttendanceStatus;

  remarks: string;
}


// ============================================
// HELPER
// ============================================

const getRelationId = (
  value: unknown
): string => {
  if (
    typeof value ===
    "string"
  ) {
    return value;
  }


  if (
    value &&
    typeof value ===
      "object" &&
    "_id" in value
  ) {
    const id =
      (
        value as {
          _id?: unknown;
        }
      )._id;


    return typeof id ===
      "string"
      ? id
      : String(
          id ?? ""
        );
  }


  return "";
};


// ============================================
// RELATION NAME
// ============================================

const getRelationName = (
  value: unknown
): string => {
  if (
    !value ||
    typeof value !==
      "object" ||
    !("name" in value)
  ) {
    return "";
  }


  const name =
    (
      value as {
        name?: unknown;
      }
    ).name;


  return typeof name ===
    "string"
    ? name
    : "";
};


// ============================================
// DATE
// ============================================

const getToday =
  (): string => {
    return new Date()
      .toISOString()
      .slice(
        0,
        10
      );
};


// ============================================
// DISPLAY DATE
// ============================================

const formatDate = (
  value: string
): string => {
  if (!value) {
    return "-";
  }


  const date =
    new Date(
      `${value}T00:00:00`
    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }


  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};


// ============================================
// INITIALS
// ============================================

const getInitials = (
  firstName: string,
  lastName: string
) => {
  return `${firstName.charAt(
    0
  )}${lastName.charAt(
    0
  )}`
    .trim()
    .toUpperCase();
};


// ============================================
// MAIN COMPONENT
// ============================================

const MarkAttendance:
  React.FC = () => {

  const dispatch =
    useAppDispatch();


  const navigate =
    useNavigate();


  const [
    searchParams,
  ] = useSearchParams();


  // ============================================
  // REDUX DATA
  // ============================================

  const {
    sessions,
  } = useAppSelector(
    (state) =>
      state.sessions
  );


  const {
    classes,
  } = useAppSelector(
    (state) =>
      state.classes
  );


  const {
    sections,
  } = useAppSelector(
    (state) =>
      state.sections
  );


  const {
    attendance,
    saving,
    error,
  } = useAppSelector(
    (state) =>
      state.attendance
  );


  // ============================================
  // FILTER STATE
  // Query params DailyAttendance se aa sakte hain
  // ============================================

  const [
    selectedSessionId,
    setSelectedSessionId,
  ] = useState(
    searchParams.get(
      "sessionId"
    ) || ""
  );


  const [
    selectedClassId,
    setSelectedClassId,
  ] = useState(
    searchParams.get(
      "classId"
    ) || ""
  );


  const [
    selectedSectionId,
    setSelectedSectionId,
  ] = useState(
    searchParams.get(
      "sectionId"
    ) || ""
  );


  const [
    selectedDate,
    setSelectedDate,
  ] = useState(
    searchParams.get(
      "date"
    ) ||
      getToday()
  );


  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");


  // ============================================
  // STUDENT STATE
  // ============================================

  const [
    students,
    setStudents,
  ] =
    useState<StudentData[]>(
      []
    );


  const [
    attendanceRows,
    setAttendanceRows,
  ] =
    useState<
      AttendanceRow[]
    >([]);


  const [
    originalRows,
    setOriginalRows,
  ] =
    useState<
      AttendanceRow[]
    >([]);


  const [
    studentsLoading,
    setStudentsLoading,
  ] =
    useState(false);


  const [
    studentsError,
    setStudentsError,
  ] =
    useState<
      string | null
    >(null);


  const [
    successMessage,
    setSuccessMessage,
  ] =
    useState<
      string | null
    >(null);


  // ============================================
  // PAGINATION
  // ============================================

  const [
    currentPage,
    setCurrentPage,
  ] =
    useState(1);


  const itemsPerPage =
    25;


  // ============================================
  // LOAD MASTER DATA
  // ============================================

  useEffect(() => {
    dispatch(
      getSessions()
    );


    dispatch(
      getClasses(
        undefined
      )
    );


    dispatch(
      getSections(
        undefined
      )
    );
  }, [
    dispatch,
  ]);


  // ============================================
  // DEFAULT SESSION
  // ============================================

  useEffect(() => {
    if (
      selectedSessionId ||
      sessions.length ===
        0
    ) {
      return;
    }


    const currentSession =
      sessions.find(
        (session) =>
          session.isCurrent
      );


    setSelectedSessionId(
      currentSession?._id ||
        sessions[0]?._id ||
        ""
    );
  }, [
    sessions,
    selectedSessionId,
  ]);


  // ============================================
  // CLASSES FOR SESSION
  // ============================================

  const availableClasses =
    useMemo(() => {
      if (
        !selectedSessionId
      ) {
        return [];
      }


      return classes.filter(
        (item) =>
          getRelationId(
            item.sessionId
          ) ===
          selectedSessionId
      );
    }, [
      classes,
      selectedSessionId,
    ]);


  // ============================================
  // CHECK SELECTED CLASS
  // ============================================

  useEffect(() => {
    if (
      !selectedClassId
    ) {
      return;
    }


    const exists =
      availableClasses.some(
        (item) =>
          item._id ===
          selectedClassId
      );


    if (!exists) {
      setSelectedClassId(
        ""
      );

      setSelectedSectionId(
        ""
      );
    }
  }, [
    availableClasses,
    selectedClassId,
  ]);


  // ============================================
  // SECTIONS FOR CLASS
  // ============================================

  const availableSections =
    useMemo(() => {
      if (
        !selectedSessionId ||
        !selectedClassId
      ) {
        return [];
      }


      return sections.filter(
        (section) =>
          getRelationId(
            section.sessionId
          ) ===
            selectedSessionId &&
          getRelationId(
            section.classId
          ) ===
            selectedClassId &&
          section.isActive !==
            false
      );
    }, [
      sections,
      selectedSessionId,
      selectedClassId,
    ]);


  // ============================================
  // CHECK SELECTED SECTION
  // ============================================

  useEffect(() => {
    if (
      !selectedSectionId
    ) {
      return;
    }


    const exists =
      availableSections.some(
        (item) =>
          item._id ===
          selectedSectionId
      );


    if (!exists) {
      setSelectedSectionId(
        ""
      );
    }
  }, [
    availableSections,
    selectedSectionId,
  ]);


  // ============================================
  // SELECTED LABELS
  // ============================================

  const selectedSession =
    sessions.find(
      (item) =>
        item._id ===
        selectedSessionId
    );


  const selectedClass =
    availableClasses.find(
      (item) =>
        item._id ===
        selectedClassId
    );


  const selectedSection =
    availableSections.find(
      (item) =>
        item._id ===
        selectedSectionId
    );


  // ============================================
  // GET STUDENTS
  //
  // Student backend ready hote hi:
  // GET /students
  // ?sessionId=
  // &classId=
  // &sectionId=
  // &isActive=true
  // ============================================

  useEffect(() => {
    const fetchStudents =
      async () => {

        if (
          !selectedSessionId ||
          !selectedClassId ||
          !selectedSectionId
        ) {
          setStudents(
            []
          );

          setAttendanceRows(
            []
          );

          return;
        }


        try {
          setStudentsLoading(
            true
          );

          setStudentsError(
            null
          );


          const response =
            await api.get(
              "/students",
              {
                params: {
                  sessionId:
                    selectedSessionId,

                  classId:
                    selectedClassId,

                  sectionId:
                    selectedSectionId,

                  isActive:
                    true,
                },
              }
            );


          // Different common response shapes tolerate karega
          const result =
            response.data?.data
              ?.students ??
            response.data
              ?.students ??
            [];


          setStudents(
            Array.isArray(
              result
            )
              ? result
              : []
          );

        } catch (error: any) {
          setStudents(
            []
          );


          setStudentsError(
            error.response?.data
              ?.message ||
              "Failed to load students"
          );

        } finally {
          setStudentsLoading(
            false
          );
        }
      };


    fetchStudents();

  }, [
    selectedSessionId,
    selectedClassId,
    selectedSectionId,
  ]);


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
      return;
    }


    dispatch(
      getAttendance({
        sessionId:
          selectedSessionId,

        classId:
          selectedClassId,

        sectionId:
          selectedSectionId,

        date:
          selectedDate,
      })
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
    if (
      students.length ===
      0
    ) {
      setAttendanceRows(
        []
      );

      setOriginalRows(
        []
      );

      return;
    }


    const rows =
      students.map(
        (student) => {

          const existing =
            attendance.find(
              (record) => {
                const recordStudentId =
                  getRelationId(
                    record.studentId
                  );


                return (
                  recordStudentId ===
                  student._id
                );
              }
            );


          const row:
            AttendanceRow = {

            studentId:
              student._id,

            firstName:
              student.firstName,

            lastName:
              student.lastName ||
              "",

            admissionNumber:
              student.admissionNumber ||
              "-",

            rollNumber:
              student.rollNumber ??
              "-",

            profileImage:
              student.profileImage ||
              "",

            className:
              getRelationName(
                student.classId
              ) ||
              selectedClass?.name ||
              "-",

            sectionName:
              getRelationName(
                student.sectionId
              ) ||
              selectedSection?.name ||
              "-",

            status:
              existing?.status ||
              "PRESENT",

            remarks:
              existing?.remarks ||
              "",
          };


          return row;
        }
      );


    setAttendanceRows(
      rows
    );


    setOriginalRows(
      rows.map(
        (row) => ({
          ...row,
        })
      )
    );

  }, [
    students,
    attendance,
    selectedClass?.name,
    selectedSection?.name,
  ]);


  // ============================================
  // SEARCH
  // ============================================

  const filteredRows =
    useMemo(() => {
      const search =
        searchQuery
          .trim()
          .toLowerCase();


      if (!search) {
        return attendanceRows;
      }


      return attendanceRows.filter(
        (row) => {

          const text =
            [
              row.firstName,
              row.lastName,
              row.admissionNumber,
              String(
                row.rollNumber
              ),
            ]
              .join(" ")
              .toLowerCase();


          return text.includes(
            search
          );
        }
      );
    }, [
      attendanceRows,
      searchQuery,
    ]);


  // ============================================
  // STATS
  // ============================================

  const stats =
    useMemo(() => {

      const total =
        attendanceRows.length;


      const present =
        attendanceRows.filter(
          (row) =>
            row.status ===
            "PRESENT"
        ).length;


      const absent =
        attendanceRows.filter(
          (row) =>
            row.status ===
            "ABSENT"
        ).length;


      const leave =
        attendanceRows.filter(
          (row) =>
            row.status ===
            "LEAVE"
        ).length;


      const halfDay =
        attendanceRows.filter(
          (row) =>
            row.status ===
            "HALF_DAY"
        ).length;


      const attendanceUnits =
        present +
        halfDay * 0.5;


      const percentage =
        total > 0
          ? Number(
              (
                (
                  attendanceUnits /
                  total
                ) *
                100
              ).toFixed(
                1
              )
            )
          : 0;


      return {
        total,
        present,
        absent,
        leave,
        halfDay,
        percentage,
      };

    }, [
      attendanceRows,
    ]);


  // ============================================
  // PAGINATION
  // ============================================

  useEffect(() => {
    setCurrentPage(
      1
    );
  }, [
    selectedSessionId,
    selectedClassId,
    selectedSectionId,
    searchQuery,
  ]);


  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredRows.length /
          itemsPerPage
      )
    );


  const paginatedRows =
    useMemo(() => {

      const start =
        (
          currentPage -
          1
        ) *
        itemsPerPage;


      return filteredRows.slice(
        start,
        start +
          itemsPerPage
      );

    }, [
      filteredRows,
      currentPage,
    ]);


  // ============================================
  // STATUS CHANGE
  // ============================================

  const handleStatusChange =
    (
      studentId: string,
      status:
        AttendanceStatus
    ) => {

      setAttendanceRows(
        (previous) =>
          previous.map(
            (row) =>
              row.studentId ===
              studentId
                ? {
                    ...row,
                    status,
                  }
                : row
          )
      );
    };


  // ============================================
  // REMARK
  // ============================================

  const handleRemarksChange =
    (
      studentId: string,
      remarks: string
    ) => {

      setAttendanceRows(
        (previous) =>
          previous.map(
            (row) =>
              row.studentId ===
              studentId
                ? {
                    ...row,
                    remarks,
                  }
                : row
          )
      );
    };


  // ============================================
  // MARK ALL PRESENT
  // ============================================

  const handleMarkAllPresent =
    () => {

      setAttendanceRows(
        (previous) =>
          previous.map(
            (row) => ({
              ...row,

              status:
                "PRESENT",
            })
          )
      );
    };


  // ============================================
  // CANCEL
  // ============================================

  const handleCancelChanges =
    () => {

      setAttendanceRows(
        originalRows.map(
          (row) => ({
            ...row,
          })
        )
      );
    };


  // ============================================
  // SAVE BULK ATTENDANCE
  // ============================================

  const handleSaveAttendance =
    async () => {

      if (
        !selectedSessionId ||
        !selectedClassId ||
        !selectedSectionId ||
        !selectedDate
      ) {
        return;
      }


      if (
        attendanceRows.length ===
        0
      ) {
        return;
      }


      setSuccessMessage(
        null
      );


      dispatch(
        clearAttendanceError()
      );


      // exactOptionalPropertyTypes safe
      const attendancePayload:
        StudentAttendanceInput[] =
        attendanceRows.map(
          (row) => {

            const item:
              StudentAttendanceInput = {

              studentId:
                row.studentId,

              status:
                row.status,
            };


            if (
              row.remarks
                .trim()
            ) {
              item.remarks =
                row.remarks.trim();
            }


            return item;
          }
        );


      const result =
        await dispatch(
          markBulkAttendance({
            sessionId:
              selectedSessionId,

            classId:
              selectedClassId,

            sectionId:
              selectedSectionId,

            date:
              selectedDate,

            attendance:
              attendancePayload,
          })
        );


      if (
        markBulkAttendance
          .fulfilled
          .match(
            result
          )
      ) {
        setSuccessMessage(
          "Attendance saved successfully."
        );


        setOriginalRows(
          attendanceRows.map(
            (row) => ({
              ...row,
            })
          )
        );


        window.setTimeout(
          () => {
            navigate(
              `/school-admin/attendance/daily?sessionId=${selectedSessionId}&classId=${selectedClassId}&sectionId=${selectedSectionId}&date=${selectedDate}`
            );
          },
          700
        );
      }
    };


  // ============================================
  // RESET FILTERS
  // ============================================

  const handleReset =
    () => {

      const currentSession =
        sessions.find(
          (session) =>
            session.isCurrent
        );


      setSelectedSessionId(
        currentSession?._id ||
          sessions[0]?._id ||
          ""
      );


      setSelectedClassId(
        ""
      );


      setSelectedSectionId(
        ""
      );


      setSelectedDate(
        getToday()
      );


      setSearchQuery(
        ""
      );
    };


  return (
    <div className="min-h-screen bg-gray-50 p-5 md:p-8">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

        <div>

          <div className="flex items-center gap-2 text-sm text-gray-500">

            <span>
              Attendance
            </span>

            <Icon
              icon="lucide:chevron-right"
            />

            <span className="font-medium text-gray-900">
              Student Attendance
            </span>

          </div>


          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Mark Attendance
          </h1>


          <p className="mt-1 text-sm text-gray-500">
            Mark student attendance by academic year, class and section.
          </p>

        </div>


        <button
          onClick={() =>
            navigate(
              "/school-admin/attendance/daily"
            )
          }
          className="flex min-h-11 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          <Icon
            icon="lucide:list-checks"
          />

          Daily Attendance
        </button>

      </div>


      {/* ========================================
          STATS
      ======================================== */}

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">

        <StatCard
          label="Total Students"
          value={
            stats.total
          }
          icon="lucide:users"
        />


        <StatCard
          label="Present"
          value={
            stats.present
          }
          icon="lucide:user-check"
          valueClass="text-green-600"
        />


        <StatCard
          label="Absent"
          value={
            stats.absent
          }
          icon="lucide:user-x"
          valueClass="text-red-600"
        />


        <StatCard
          label="On Leave"
          value={
            stats.leave
          }
          icon="lucide:calendar-days"
          valueClass="text-amber-600"
        />


        <StatCard
          label="Half Day"
          value={
            stats.halfDay
          }
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

            {/* SESSION */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Academic Year *
              </label>


              <select
                value={
                  selectedSessionId
                }
                onChange={(e) => {

                  setSelectedSessionId(
                    e.target.value
                  );

                  setSelectedClassId(
                    ""
                  );

                  setSelectedSectionId(
                    ""
                  );
                }}
                className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm"
              >

                <option value="">
                  Select Academic Year
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


            {/* CLASS */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Class *
              </label>


              <select
                value={
                  selectedClassId
                }
                disabled={
                  !selectedSessionId
                }
                onChange={(e) => {

                  setSelectedClassId(
                    e.target.value
                  );

                  setSelectedSectionId(
                    ""
                  );
                }}
                className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm disabled:bg-gray-100"
              >

                <option value="">
                  Select Class
                </option>


                {availableClasses.map(
                  (item) => (
                    <option
                      key={
                        item._id
                      }
                      value={
                        item._id
                      }
                    >
                      {item.name}
                    </option>
                  )
                )}

              </select>

            </div>


            {/* SECTION */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Section *
              </label>


              <select
                value={
                  selectedSectionId
                }
                disabled={
                  !selectedClassId
                }
                onChange={(e) =>
                  setSelectedSectionId(
                    e.target.value
                  )
                }
                className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm disabled:bg-gray-100"
              >

                <option value="">
                  Select Section
                </option>


                {availableSections.map(
                  (section) => (
                    <option
                      key={
                        section._id
                      }
                      value={
                        section._id
                      }
                    >
                      Section{" "}
                      {section.name}
                    </option>
                  )
                )}

              </select>


              {selectedClassId && (
                <p className="mt-1 text-xs text-gray-500">
                  Sections shown for{" "}
                  {selectedClass?.name ||
                    "selected class"}
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
                value={
                  selectedDate
                }
                onChange={(e) =>
                  setSelectedDate(
                    e.target.value
                  )
                }
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
                  value={
                    searchQuery
                  }
                  onChange={(e) =>
                    setSearchQuery(
                      e.target.value
                    )
                  }
                  placeholder="Search by student name, admission number or roll number"
                  className="min-h-11 w-full rounded-lg border border-gray-300 pl-10 pr-3 text-sm"
                />

              </div>

            </div>


            <button
              onClick={
                handleReset
              }
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

              {selectedClass?.name ||
                "Select Class"}

              {selectedSection?.name
                ? ` · Section ${selectedSection.name}`
                : ""}

            </h2>


            <p className="mt-1 text-sm text-gray-500">

              {attendanceRows.length} students loaded

              {selectedDate
                ? ` for ${formatDate(
                    selectedDate
                  )}`
                : ""}

              {selectedSession?.name
                ? ` · ${selectedSession.name}`
                : ""}

            </p>

          </div>


          <button
            onClick={
              handleMarkAllPresent
            }
            disabled={
              attendanceRows.length ===
              0
            }
            className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >

            <Icon
              icon="lucide:check-check"
            />

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

              <Icon
                icon="lucide:circle-check"
              />

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

            <p className="text-sm text-gray-500">
              Loading students...
            </p>

          </div>
        ) : !selectedSessionId ||
          !selectedClassId ||
          !selectedSectionId ? (
          <EmptyState
            title="Select class and section"
            description="Academic year, class and section select karo. Uske baad students load honge."
          />
        ) : paginatedRows.length ===
          0 ? (
          <EmptyState
            title="No students found"
            description="Selected class and section me active students nahi mile."
          />
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[1100px] text-left text-sm">

              <thead className="bg-gray-50 text-xs uppercase text-gray-500">

                <tr>

                  <th className="px-5 py-4">
                    Student
                  </th>

                  <th className="px-4 py-4">
                    Admission Number
                  </th>

                  <th className="px-4 py-4">
                    Roll Number
                  </th>

                  <th className="px-4 py-4">
                    Class
                  </th>

                  <th className="px-4 py-4">
                    Section
                  </th>

                  <th className="px-4 py-4">
                    Attendance Status
                  </th>

                  <th className="px-4 py-4">
                    Remarks
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-gray-200">

                {paginatedRows.map(
                  (student) => (
                    <tr
                      key={
                        student.studentId
                      }
                      className="hover:bg-gray-50"
                    >

                      {/* STUDENT */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          {student.profileImage ? (
                            <img
                              src={
                                student.profileImage
                              }
                              alt={
                                student.firstName
                              }
                              className="h-10 w-10 rounded-full border border-gray-200 object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">

                              {getInitials(
                                student.firstName,
                                student.lastName
                              )}

                            </div>
                          )}


                          <div>

                            <p className="font-semibold text-gray-900">
                              {student.firstName}{" "}
                              {student.lastName}
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
                            active={
                              student.status ===
                              "PRESENT"
                            }
                            activeClass="bg-green-600 text-white"
                            onClick={() =>
                              handleStatusChange(
                                student.studentId,
                                "PRESENT"
                              )
                            }
                          />


                          <StatusButton
                            label="Absent"
                            active={
                              student.status ===
                              "ABSENT"
                            }
                            activeClass="bg-red-600 text-white"
                            onClick={() =>
                              handleStatusChange(
                                student.studentId,
                                "ABSENT"
                              )
                            }
                          />


                          <StatusButton
                            label="Leave"
                            active={
                              student.status ===
                              "LEAVE"
                            }
                            activeClass="bg-amber-400 text-amber-950"
                            onClick={() =>
                              handleStatusChange(
                                student.studentId,
                                "LEAVE"
                              )
                            }
                          />


                          <StatusButton
                            label="Half Day"
                            active={
                              student.status ===
                              "HALF_DAY"
                            }
                            activeClass="bg-blue-600 text-white"
                            onClick={() =>
                              handleStatusChange(
                                student.studentId,
                                "HALF_DAY"
                              )
                            }
                          />

                        </div>

                      </td>


                      {/* REMARK */}

                      <td className="px-4 py-4">

                        <input
                          type="text"
                          value={
                            student.remarks
                          }
                          onChange={(e) =>
                            handleRemarksChange(
                              student.studentId,
                              e.target.value
                            )
                          }
                          placeholder="Optional remark"
                          className="min-h-10 w-44 rounded-lg border border-gray-300 px-3 text-sm"
                        />

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}


        {/* ======================================
            FOOTER
        ====================================== */}

        {attendanceRows.length >
          0 && (
          <div className="flex flex-col gap-4 border-t border-gray-200 p-5 md:flex-row md:items-center md:justify-between">

            {/* PAGINATION */}

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">

              <span>

                Showing{" "}

                {filteredRows.length ===
                0
                  ? 0
                  : (
                      currentPage -
                      1
                    ) *
                      itemsPerPage +
                    1}

                -

                {Math.min(
                  currentPage *
                    itemsPerPage,
                  filteredRows.length
                )}

                {" "}of{" "}

                {filteredRows.length} students

              </span>


              <div className="flex gap-2">

                <button
                  onClick={() =>
                    setCurrentPage(
                      (previous) =>
                        Math.max(
                          1,
                          previous -
                            1
                        )
                    )
                  }
                  disabled={
                    currentPage <=
                    1
                  }
                  className="min-h-10 rounded-lg border border-gray-300 px-3 font-medium disabled:opacity-40"
                >
                  Previous
                </button>


                <button
                  onClick={() =>
                    setCurrentPage(
                      (previous) =>
                        Math.min(
                          totalPages,
                          previous +
                            1
                        )
                    )
                  }
                  disabled={
                    currentPage >=
                    totalPages
                  }
                  className="min-h-10 rounded-lg border border-gray-300 px-3 font-medium disabled:opacity-40"
                >
                  Next
                </button>

              </div>

            </div>


            {/* ACTIONS */}

            <div className="flex gap-3">

              <button
                onClick={
                  handleCancelChanges
                }
                disabled={
                  saving
                }
                className="min-h-11 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel Changes
              </button>


              <button
                onClick={
                  handleSaveAttendance
                }
                disabled={
                  saving ||
                  attendanceRows.length ===
                    0
                }
                className="flex min-h-11 items-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >

                {saving ? (
                  <>
                    <Icon
                      icon="lucide:loader-2"
                      className="animate-spin"
                    />

                    Saving...
                  </>
                ) : (
                  <>
                    <Icon
                      icon="lucide:save"
                    />

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
      onClick={
        onClick
      }
      className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
        active
          ? activeClass
          : "text-gray-600 hover:bg-white"
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

  value:
    number | string;

  icon: string;

  valueClass?: string;
}) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

      <div className="flex items-center justify-between">

        <p className="text-xs font-medium text-gray-500">
          {label}
        </p>


        <Icon
          icon={icon}
          className="text-gray-400"
        />

      </div>


      <p
        className={`mt-2 text-2xl font-bold ${valueClass}`}
      >
        {value}
      </p>

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

        <Icon
          icon="lucide:users"
          className="text-2xl text-gray-400"
        />

      </div>


      <h3 className="mt-4 text-lg font-bold text-gray-900">
        {title}
      </h3>


      <p className="mt-1 max-w-md text-sm text-gray-500">
        {description}
      </p>

    </div>
  );
};


export default MarkAttendance;