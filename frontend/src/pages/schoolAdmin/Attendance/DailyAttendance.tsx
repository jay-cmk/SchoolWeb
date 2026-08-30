// import React, { useState, useEffect, useCallback } from 'react';
// import { Icon } from '@iconify/react';

// // ==========================================
// // TYPES & INTERFACES
// // ==========================================
// interface Student {
//   id: string;
//   name: string;
//   avatar: string;
//   roll: string;
//   class: string;
//   section: string;
//   status: 'Present' | 'Absent' | 'Leave';
//   remarks: string;
// }

// interface Stats {
//   total: number;
//   present: number;
//   absent: number;
//   leave: number;
//   percentage: string;
// }

// // ==========================================
// // MOCK DATA
// // ==========================================
// const INITIAL_STUDENTS: Student[] = [
//   {
//     id: 'ADM-26041',
//     name: 'Aarav Mehta',
//     avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60',
//     roll: '01',
//     class: 'Class 6',
//     section: 'Section A',
//     status: 'Present',
//     remarks: '',
//   },
//   {
//     id: 'ADM-26042',
//     name: 'Diya Sharma',
//     avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
//     roll: '02',
//     class: 'Class 6',
//     section: 'Section A',
//     status: 'Absent',
//     remarks: 'Sick',
//   },
//   {
//     id: 'ADM-26043',
//     name: 'Kabir Singh',
//     avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
//     roll: '03',
//     class: 'Class 6',
//     section: 'Section A',
//     status: 'Leave',
//     remarks: 'Medical Leave',
//   },
//   {
//     id: 'ADM-26044',
//     name: 'Ananya Iyer',
//     avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=60',
//     roll: '04',
//     class: 'Class 6',
//     section: 'Section A',
//     status: 'Present',
//     remarks: '',
//   },
//   {
//     id: 'ADM-26045',
//     name: 'Rohan Gupta',
//     avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60',
//     roll: '05',
//     class: 'Class 6',
//     section: 'Section A',
//     status: 'Present',
//     remarks: '',
//   },
//   {
//     id: 'ADM-26046',
//     name: 'Meera Patel',
//     avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=60',
//     roll: '06',
//     class: 'Class 6',
//     section: 'Section B',
//     status: 'Present',
//     remarks: '',
//   },
//   {
//     id: 'ADM-26047',
//     name: 'Arjun Reddy',
//     avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=60',
//     roll: '01',
//     class: 'Class 10',
//     section: 'Section A',
//     status: 'Present',
//     remarks: '',
//   },
//   {
//     id: 'ADM-26048',
//     name: 'Sanya Malhotra',
//     avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=60',
//     roll: '02',
//     class: 'Class 10',
//     section: 'Section A',
//     status: 'Absent',
//     remarks: 'Family Event',
//   }
// ];

// // ==========================================
// // SUB-COMPONENTS
// // ==========================================

// // 1. Status Badge Component
// const StatusBadge: React.FC<{ status: 'Present' | 'Absent' | 'Leave' }> = ({ status }) => {
//   const styles = {
//     Present: 'bg-green-500 text-white',
//     Absent: 'bg-red-500 text-white',
//     Leave: 'bg-yellow-500 text-yellow-900',
//   };

//   return (
//     <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${styles[status]}`}>
//       <span className={`h-1.5 w-1.5 rounded-full ${
//         status === 'Present' ? 'bg-green-400' : status === 'Absent' ? 'bg-red-400' : 'bg-yellow-400'
//       }`} />
//       {status}
//     </span>
//   );
// };

// // 2. Header Component
// interface HeaderProps {
//   onMarkAttendance: () => void;
//   onToggleMonthlyView: () => void;
//   isMonthlyView: boolean;
// }

// const Header: React.FC<HeaderProps> = ({ onMarkAttendance, onToggleMonthlyView, isMonthlyView }) => {
//   return (
//     <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
//       <div>
//         <p className="text-sm text-gray-500 flex items-center gap-1">
//           <span>Attendance</span>
//           <Icon icon="lucide:chevron-right" className="w-3.5 h-3.5 text-gray-500" />
//           <span className="text-gray-900 font-medium">Student Attendance</span>
//         </p>
//         <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">Daily Attendance</h1>
//         <p className="mt-1 text-sm text-gray-500">
//           Review, edit, and finalize attendance records by class and section.
//         </p>
//       </div>
//       <div className="flex gap-2">
//         <button
//           onClick={onMarkAttendance}
//           className="min-h-11 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
//         >
//           <Icon icon="lucide:plus-circle" className="w-4 h-4" />
//           Mark Attendance
//         </button>
//         <button
//           onClick={onToggleMonthlyView}
//           className={`min-h-11 rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
//             isMonthlyView ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-50'
//           }`}
//         >
//           <Icon icon="lucide:calendar" className="w-4 h-4" />
//           {isMonthlyView ? 'Daily View' : 'Monthly View'}
//         </button>
//       </div>
//     </div>
//   );
// };

// // 3. Filters Section Component
// interface FiltersSectionProps {
//   selectedDate: string;
//   selectedClass: string;
//   selectedSection: string;
//   onDateChange: (date: string) => void;
//   onClassChange: (className: string) => void;
//   onSectionChange: (sectionName: string) => void;
// }

// const FiltersSection: React.FC<FiltersSectionProps> = ({
//   selectedDate,
//   selectedClass,
//   selectedSection,
//   onDateChange,
//   onClassChange,
//   onSectionChange,
// }) => {
//   return (
//     <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
//       <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//         <label className="text-sm font-medium text-gray-900 flex flex-col gap-2">
//           <span className="flex items-center gap-1.5">
//             <Icon icon="lucide:calendar-days" className="w-4 h-4 text-gray-500" />
//             Date
//           </span>
//           <input
//             type="date"
//             value={selectedDate}
//             onChange={(e) => onDateChange(e.target.value)}
//             className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//           />
//         </label>

//         <label className="text-sm font-medium text-gray-900 flex flex-col gap-2">
//           <span className="flex items-center gap-1.5">
//             <Icon icon="lucide:book-open" className="w-4 h-4 text-gray-500" />
//             Class
//           </span>
//           <select
//             value={selectedClass}
//             onChange={(e) => onClassChange(e.target.value)}
//             className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//           >
//             <option value="Class 6">Class 6</option>
//             <option value="Class 10">Class 10</option>
//           </select>
//         </label>

//         <label className="text-sm font-medium text-gray-900 flex flex-col gap-2">
//           <span className="flex items-center gap-1.5">
//             <Icon icon="lucide:users" className="w-4 h-4 text-gray-500" />
//             Section
//           </span>
//           <select
//             value={selectedSection}
//             onChange={(e) => onSectionChange(e.target.value)}
//             className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//           >
//             <option value="Section A">Section A</option>
//             <option value="Section B">Section B</option>
//           </select>
//         </label>
//       </div>
//     </section>
//   );
// };

// // 4. Stats Grid Component
// interface StatsGridProps {
//   stats: Stats;
// }

// const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
//   return (
//     <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
//       <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex flex-col justify-between">
//         <div className="flex items-center justify-between">
//           <p className="text-xs font-medium text-gray-500">Total Students</p>
//           <Icon icon="lucide:users-2" className="w-4 h-4 text-gray-500" />
//         </div>
//         <p className="mt-2 text-2xl font-bold text-gray-900">{stats.total}</p>
//       </div>

//       <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex flex-col justify-between">
//         <div className="flex items-center justify-between">
//           <p className="text-xs font-medium text-gray-500">Present</p>
//           <Icon icon="lucide:check-circle-2" className="w-4 h-4 text-green-500" />
//         </div>
//         <p className="mt-2 text-2xl font-bold text-green-600">{stats.present}</p>
//       </div>

//       <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex flex-col justify-between">
//         <div className="flex items-center justify-between">
//           <p className="text-xs font-medium text-gray-500">Absent</p>
//           <Icon icon="lucide:x-circle" className="w-4 h-4 text-red-500" />
//         </div>
//         <p className="mt-2 text-2xl font-bold text-red-600">{stats.absent}</p>
//       </div>

//       <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex flex-col justify-between">
//         <div className="flex items-center justify-between">
//           <p className="text-xs font-medium text-gray-500">Leave</p>
//           <Icon icon="lucide:clock" className="w-4 h-4 text-yellow-600" />
//         </div>
//         <p className="mt-2 text-2xl font-bold text-yellow-600">{stats.leave}</p>
//       </div>

//       <div className="col-span-2 rounded-xl border border-gray-200 bg-white p-4 lg:col-span-1 shadow-sm flex flex-col justify-between">
//         <div className="flex items-center justify-between">
//           <p className="text-xs font-medium text-gray-500">Attendance Rate</p>
//           <Icon icon="lucide:trending-up" className="w-4 h-4 text-blue-600" />
//         </div>
//         <p className="mt-2 text-2xl font-bold text-blue-600">{stats.percentage}</p>
//       </div>
//     </div>
//   );
// };

// // 5. Attendance Table Component
// interface AttendanceTableProps {
//   records: Student[];
//   isEditing: boolean;
//   selectedClass: string;
//   selectedSection: string;
//   selectedDate: string;
//   onToggleEdit: () => void;
//   onStatusChange: (id: string, status: 'Present' | 'Absent' | 'Leave') => void;
//   onRemarksChange: (id: string, remarks: string) => void;
//   onStudentClick: (student: Student) => void;
//   onSave: () => void;
// }

// const AttendanceTable: React.FC<AttendanceTableProps> = ({
//   records,
//   isEditing,
//   selectedClass,
//   selectedSection,
//   selectedDate,
//   onToggleEdit,
//   onStatusChange,
//   onRemarksChange,
//   onStudentClick,
//   onSave,
// }) => {
//   const formatDate = (dateStr: string) => {
//     try {
//       const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
//       return new Date(dateStr).toLocaleDateString('en-US', options);
//     } catch {
//       return dateStr;
//     }
//   };

//   return (
//     <section className="rounded-xl border border-gray-200 bg-white shadow-md overflow-hidden">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 p-5">
//         <div>
//           <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
//             <span>{selectedClass} · {selectedSection}</span>
//             <span className="text-xs font-normal bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
//               Active
//             </span>
//           </h2>
//           <p className="text-sm text-gray-500 mt-0.5">
//             Recorded for {formatDate(selectedDate)} at 09:42 AM
//           </p>
//         </div>
//         <div className="flex gap-2">
//           {isEditing ? (
//             <>
//               <button
//                 onClick={onToggleEdit}
//                 className="min-h-10 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-50 transition-all cursor-pointer"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={onSave}
//                 className="min-h-10 rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition-all flex items-center gap-1.5 cursor-pointer"
//               >
//                 <Icon icon="lucide:save" className="w-4 h-4" />
//                 Save Changes
//               </button>
//             </>
//           ) : (
//             <button
//               onClick={onToggleEdit}
//               className="min-h-10 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-50 transition-all flex items-center gap-1.5 cursor-pointer"
//             >
//               <Icon icon="lucide:edit-3" className="w-4 h-4" />
//               Edit Record
//             </button>
//           )}
//         </div>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full min-w-[750px] text-left text-sm">
//           <thead className="bg-gray-50 text-xs uppercase text-gray-500">
//             <tr>
//               <th className="px-5 py-3.5 font-semibold">Student</th>
//               <th className="px-4 py-3.5 font-semibold">Admission Number</th>
//               <th className="px-4 py-3.5 font-semibold">Roll Number</th>
//               <th className="px-4 py-3.5 font-semibold">Class</th>
//               <th className="px-4 py-3.5 font-semibold">Section</th>
//               <th className="px-4 py-3.5 font-semibold">Attendance Status</th>
//               <th className="px-4 py-3.5 font-semibold">Remarks</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {records.map((student) => (
//               <tr key={student.id} className="hover:bg-gray-50/30 transition-colors">
//                 <td className="px-5 py-4">
//                   <button
//                     onClick={() => onStudentClick(student)}
//                     className="flex items-center gap-3 font-semibold text-left hover:text-blue-600 transition-colors group cursor-pointer"
//                   >
//                     <img
//                       className="h-9 w-9 rounded-full object-cover border border-gray-200 group-hover:border-blue-500 transition-all"
//                       src={student.avatar}
//                       alt={student.name}
//                     />
//                     <div>
//                       <span className="block text-gray-900">{student.name}</span>
//                       <span className="text-xs text-gray-500 font-normal">View History</span>
//                     </div>
//                   </button>
//                 </td>
//                 <td className="px-4 py-4 text-gray-500 font-mono">{student.id}</td>
//                 <td className="px-4 py-4 font-medium text-gray-900">{student.roll}</td>
//                 <td className="px-4 py-4 text-gray-500">{student.class}</td>
//                 <td className="px-4 py-4 text-gray-500">{student.section.replace('Section ', '')}</td>
//                 <td className="px-4 py-4">
//                   {isEditing ? (
//                     <div className="flex gap-1.5">
//                       {(['Present', 'Absent', 'Leave'] as const).map((status) => (
//                         <button
//                           key={status}
//                           onClick={() => onStatusChange(student.id, status)}
//                           className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
//                             student.status === status
//                               ? status === 'Present'
//                                 ? 'bg-green-500 text-white ring-2 ring-green-500/20'
//                                 : status === 'Absent'
//                                 ? 'bg-red-500 text-white ring-2 ring-red-500/20'
//                                 : 'bg-yellow-500 text-yellow-900 ring-2 ring-yellow-500/20'
//                               : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                           }`}
//                         >
//                           {status}
//                         </button>
//                       ))}
//                     </div>
//                   ) : (
//                     <StatusBadge status={student.status} />
//                   )}
//                 </td>
//                 <td className="px-4 py-4">
//                   {isEditing ? (
//                     <input
//                       type="text"
//                       value={student.remarks}
//                       onChange={(e) => onRemarksChange(student.id, e.target.value)}
//                       placeholder="Add remark..."
//                       className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
//                     />
//                   ) : (
//                     <span className="text-gray-500">{student.remarks || '—'}</span>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </section>
//   );
// };

// // 6. State Indicator Component
// interface StateIndicatorProps {
//   isLoading: boolean;
//   isEmpty: boolean;
//   onMarkAttendance: () => void;
// }

// const StateIndicator: React.FC<StateIndicatorProps> = ({ isLoading, isEmpty, onMarkAttendance }) => {
//   return (
//     <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-500 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//       <div className="flex items-center gap-2">
//         {isLoading ? (
//           <div className="flex items-center gap-2">
//             <Icon icon="lucide:loader-2" className="w-4 h-4 animate-spin text-blue-600" />
//             <span>Loading attendance records...</span>
//           </div>
//         ) : isEmpty ? (
//           <div className="flex items-center gap-2">
//             <Icon icon="lucide:alert-circle" className="w-4 h-4 text-yellow-500" />
//             <span>Attendance has not been marked for this date.</span>
//           </div>
//         ) : (
//           <div className="flex items-center gap-2">
//             <Icon icon="lucide:check-circle" className="w-4 h-4 text-green-500" />
//             <span>All records are up to date.</span>
//           </div>
//         )}
//       </div>

//       {isEmpty && !isLoading && (
//         <button
//           onClick={onMarkAttendance}
//           className="font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
//         >
//           <Icon icon="lucide:plus" className="w-4 h-4" />
//           Mark attendance now
//         </button>
//       )}
//     </div>
//   );
// };

// // 7. Mark Attendance Modal Component
// interface MarkAttendanceModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSave: (records: Student[]) => void;
//   selectedClass: string;
//   selectedSection: string;
// }

// const MarkAttendanceModal: React.FC<MarkAttendanceModalProps> = ({
//   isOpen,
//   onClose,
//   onSave,
//   selectedClass,
//   selectedSection,
// }) => {
//   const [tempRecords, setTempRecords] = useState<Student[]>([]);

//   useEffect(() => {
//     if (isOpen) {
//       const filtered = INITIAL_STUDENTS.filter(
//         (s) => s.class === selectedClass && s.section === selectedSection
//       ).map((s) => ({ ...s, status: 'Present' as const, remarks: '' }));
//       setTempRecords(filtered);
//     }
//   }, [isOpen, selectedClass, selectedSection]);

//   if (!isOpen) return null;

//   const handleStatusChange = (id: string, status: 'Present' | 'Absent' | 'Leave') => {
//     setTempRecords((prev) =>
//       prev.map((s) => (s.id === id ? { ...s, status } : s))
//     );
//   };

//   const handleRemarksChange = (id: string, remarks: string) => {
//     setTempRecords((prev) =>
//       prev.map((s) => (s.id === id ? { ...s, remarks } : s))
//     );
//   };

//   const handleMarkAll = (status: 'Present' | 'Absent' | 'Leave') => {
//     setTempRecords((prev) => prev.map((s) => ({ ...s, status })));
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
//       <div className="w-full max-w-3xl rounded-xl border border-gray-200 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
//         <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
//           <div>
//             <h3 className="text-lg font-bold text-gray-900">Mark Attendance</h3>
//             <p className="text-xs text-gray-500 mt-0.5">
//               {selectedClass} · {selectedSection}
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
//           >
//             <Icon icon="lucide:x" className="w-5 h-5" />
//           </button>
//         </div>

//         <div className="p-5 border-b border-gray-200 bg-white flex flex-wrap items-center justify-between gap-3">
//           <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
//             Quick Actions:
//           </span>
//           <div className="flex gap-2">
//             <button
//               onClick={() => handleMarkAll('Present')}
//               className="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 text-xs font-semibold flex items-center gap-1 cursor-pointer"
//             >
//               <Icon icon="lucide:check" className="w-3.5 h-3.5" />
//               Mark All Present
//             </button>
//             <button
//               onClick={() => handleMarkAll('Absent')}
//               className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold flex items-center gap-1 cursor-pointer"
//             >
//               <Icon icon="lucide:x" className="w-3.5 h-3.5" />
//               Mark All Absent
//             </button>
//           </div>
//         </div>

//         <div className="flex-1 overflow-y-auto p-5 space-y-4">
//           {tempRecords.length === 0 ? (
//             <div className="text-center py-8 text-gray-500">
//               No students found in this class/section.
//             </div>
//           ) : (
//             tempRecords.map((student) => (
//               <div
//                 key={student.id}
//                 className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 rounded-lg border border-gray-200 bg-white hover:border-blue-500/30 transition-all"
//               >
//                 <div className="flex items-center gap-3">
//                   <img
//                     className="h-10 w-10 rounded-full object-cover border border-gray-200"
//                     src={student.avatar}
//                     alt={student.name}
//                   />
//                   <div>
//                     <h4 className="font-semibold text-sm text-gray-900">{student.name}</h4>
//                     <p className="text-xs text-gray-500">
//                       Roll: {student.roll} · {student.id}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex flex-wrap items-center gap-3">
//                   <div className="flex rounded-lg border border-gray-300 overflow-hidden bg-white">
//                     {(['Present', 'Absent', 'Leave'] as const).map((status) => (
//                       <button
//                         key={status}
//                         onClick={() => handleStatusChange(student.id, status)}
//                         className={`px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
//                           student.status === status
//                             ? status === 'Present'
//                               ? 'bg-green-500 text-white'
//                               : status === 'Absent'
//                               ? 'bg-red-500 text-white'
//                               : 'bg-yellow-500 text-yellow-900'
//                             : 'hover:bg-gray-50 text-gray-600'
//                         }`}
//                       >
//                         {status}
//                       </button>
//                     ))}
//                   </div>

//                   <input
//                     type="text"
//                     placeholder="Add remark..."
//                     value={student.remarks}
//                     onChange={(e) => handleRemarksChange(student.id, e.target.value)}
//                     className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 w-full sm:w-40"
//                   />
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         <div className="p-5 border-t border-gray-200 bg-gray-50/50 flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={() => onSave(tempRecords)}
//             className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1.5 cursor-pointer"
//           >
//             <Icon icon="lucide:check-square" className="w-4 h-4" />
//             Submit Attendance
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // 8. Student Detail Modal Component
// interface StudentDetailModalProps {
//   student: Student | null;
//   onClose: () => void;
// }

// const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ student, onClose }) => {
//   if (!student) return null;

//   const history = [
//     { date: '2026-08-24', status: 'Present' as const, remarks: '' },
//     { date: '2026-08-23', status: 'Present' as const, remarks: '' },
//     { date: '2026-08-22', status: 'Leave' as const, remarks: 'Dentist Appointment' },
//     { date: '2026-08-21', status: 'Present' as const, remarks: '' },
//     { date: '2026-08-20', status: 'Absent' as const, remarks: 'Fever' },
//   ];

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
//       <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
//         <div className="p-6 border-b border-gray-200 flex flex-col items-center text-center relative bg-gray-50/30">
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
//           >
//             <Icon icon="lucide:x" className="w-5 h-5" />
//           </button>

//           <img
//             className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-md"
//             src={student.avatar}
//             alt={student.name}
//           />
//           <h3 className="mt-3 text-lg font-bold text-gray-900">{student.name}</h3>
//           <p className="text-xs text-gray-500 font-mono mt-0.5">{student.id}</p>

//           <div className="mt-4 flex gap-4 text-xs">
//             <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-200">
//               <span className="block text-gray-500">Roll No</span>
//               <span className="font-bold text-sm text-gray-900">{student.roll}</span>
//             </div>
//             <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-200">
//               <span className="block text-gray-500">Class</span>
//               <span className="font-bold text-sm text-gray-900">{student.class}</span>
//             </div>
//             <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-200">
//               <span className="block text-gray-500">Section</span>
//               <span className="font-bold text-sm text-gray-900">{student.section.replace('Section ', '')}</span>
//             </div>
//           </div>
//         </div>

//         <div className="p-6 space-y-4">
//           <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
//             <Icon icon="lucide:history" className="w-4 h-4 text-blue-600" />
//             Recent Attendance History
//           </h4>

//           <div className="space-y-2.5">
//             {history.map((item, idx) => (
//               <div
//                 key={idx}
//                 className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white text-sm"
//               >
//                 <div className="flex flex-col">
//                   <span className="font-medium text-gray-900">
//                     {new Date(item.date).toLocaleDateString('en-US', {
//                       day: 'numeric',
//                       month: 'short',
//                       year: 'numeric',
//                     })}
//                   </span>
//                   {item.remarks && (
//                     <span className="text-xs text-gray-500 mt-0.5">
//                       Note: {item.remarks}
//                     </span>
//                   )}
//                 </div>
//                 <StatusBadge status={item.status} />
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="p-4 border-t border-gray-200 bg-gray-50/50 flex justify-end">
//           <button
//             onClick={onClose}
//             className="w-full py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
//           >
//             Close Profile
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // 9. Monthly View Modal Component
// interface MonthlyViewModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   selectedClass: string;
//   selectedSection: string;
// }

// const MonthlyViewModal: React.FC<MonthlyViewModalProps> = ({
//   isOpen,
//   onClose,
//   selectedClass,
//   selectedSection,
// }) => {
//   if (!isOpen) return null;

//   const daysInMonth = 31;
//   const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
//     const day = i + 1;
//     const rate = day % 7 === 0 ? 0 : Math.floor(Math.random() * (100 - 80 + 1)) + 80;
//     return { day, rate };
//   });

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
//       <div className="w-full max-w-2xl rounded-xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
//         <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
//           <div>
//             <h3 className="text-lg font-bold text-gray-900">Monthly Attendance Heatmap</h3>
//             <p className="text-xs text-gray-500 mt-0.5">
//               {selectedClass} · {selectedSection} · August 2026
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
//           >
//             <Icon icon="lucide:x" className="w-5 h-5" />
//           </button>
//         </div>

//         <div className="p-6">
//           <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-gray-500 mb-3">
//             <div>Sun</div>
//             <div>Mon</div>
//             <div>Tue</div>
//             <div>Wed</div>
//             <div>Thu</div>
//             <div>Fri</div>
//             <div>Sat</div>
//           </div>

//           <div className="grid grid-cols-7 gap-2">
//             {Array.from({ length: 6 }).map((_, idx) => (
//               <div key={`empty-${idx}`} className="aspect-square bg-gray-100/20 rounded-lg" />
//             ))}

//             {calendarDays.map(({ day, rate }) => {
//               let bgClass = 'bg-gray-100 text-gray-500';
//               if (rate > 0) {
//                 if (rate >= 95) bgClass = 'bg-green-500 text-white';
//                 else if (rate >= 90) bgClass = 'bg-green-400 text-white';
//                 else if (rate >= 85) bgClass = 'bg-green-300 text-green-950';
//                 else bgClass = 'bg-yellow-200 text-yellow-950';
//               }

//               return (
//                 <div
//                   key={day}
//                   className={`aspect-square rounded-lg flex flex-col items-center justify-center p-1 relative group cursor-pointer transition-all hover:scale-105 ${bgClass}`}
//                 >
//                   <span className="text-xs font-bold">{day}</span>
//                   {rate > 0 && (
//                     <span className="text-[9px] opacity-90 font-medium">{rate}%</span>
//                   )}

//                   <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center pointer-events-none z-10">
//                     <div className="bg-gray-900 text-white text-[10px] rounded py-1 px-2 whitespace-nowrap shadow-md">
//                       {rate > 0 ? `Avg Attendance: ${rate}%` : 'Holiday / No Record'}
//                     </div>
//                     <div className="w-2 h-2 bg-gray-900 rotate-45 -mt-1" />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs border-t border-gray-200 pt-4">
//             <div className="flex items-center gap-4">
//               <span className="font-semibold text-gray-500">Legend:</span>
//               <div className="flex items-center gap-1.5">
//                 <span className="w-3.5 h-3.5 rounded bg-green-500" />
//                 <span>&gt;= 95%</span>
//               </div>
//               <div className="flex items-center gap-1.5">
//                 <span className="w-3.5 h-3.5 rounded bg-green-300" />
//                 <span>85% - 94%</span>
//               </div>
//               <div className="flex items-center gap-1.5">
//                 <span className="w-3.5 h-3.5 rounded bg-yellow-200" />
//                 <span>&lt; 85%</span>
//               </div>
//             </div>

//             <button
//               onClick={onClose}
//               className="px-4 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-xs font-semibold transition-colors cursor-pointer"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ==========================================
// // MAIN COMPONENT
// // ==========================================
// const DailyAttendance: React.FC = () => {
//   const [selectedDate, setSelectedDate] = useState<string>('2026-08-25');
//   const [selectedClass, setSelectedClass] = useState<string>('Class 6');
//   const [selectedSection, setSelectedSection] = useState<string>('Section A');
//   const [attendanceRecords, setAttendanceRecords] = useState<Student[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [isEditing, setIsEditing] = useState<boolean>(false);
//   const [showMarkAttendanceModal, setShowMarkAttendanceModal] = useState<boolean>(false);
//   const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<Student | null>(null);
//   const [showMonthlyView, setShowMonthlyView] = useState<boolean>(false);

//   const fetchRecords = useCallback(() => {
//     setIsLoading(true);
//     setTimeout(() => {
//       const filtered = INITIAL_STUDENTS.filter(
//         (student) =>
//           student.class === selectedClass &&
//           student.section === selectedSection
//       );
//       setAttendanceRecords(filtered);
//       setIsLoading(false);
//     }, 1000);
//   }, [selectedClass, selectedSection]);

//   useEffect(() => {
//     fetchRecords();
//   }, [fetchRecords]);

//   const handleDateChange = (date: string) => {
//     setSelectedDate(date);
//     fetchRecords();
//   };

//   const handleClassChange = (className: string) => {
//     setSelectedClass(className);
//   };

//   const handleSectionChange = (sectionName: string) => {
//     setSelectedSection(sectionName);
//   };

//   const handleMarkAttendance = () => {
//     setShowMarkAttendanceModal(true);
//   };

//   const handleToggleEdit = () => {
//     setIsEditing((prev) => !prev);
//   };

//   const handleStatusChange = (id: string, status: 'Present' | 'Absent' | 'Leave') => {
//     setAttendanceRecords((prev) =>
//       prev.map((record) => (record.id === id ? { ...record, status } : record))
//     );
//   };

//   const handleRemarksChange = (id: string, remarks: string) => {
//     setAttendanceRecords((prev) =>
//       prev.map((record) => (record.id === id ? { ...record, remarks } : record))
//     );
//   };

//   const handleStudentClick = (student: Student) => {
//     setSelectedStudentForDetail(student);
//   };

//   const handleSaveInlineChanges = () => {
//     setIsLoading(true);
//     setTimeout(() => {
//       setIsEditing(false);
//       setIsLoading(false);
//     }, 1200);
//   };

//   const handleSaveNewAttendance = (newRecords: Student[]) => {
//     setIsLoading(true);
//     setShowMarkAttendanceModal(false);
//     setTimeout(() => {
//       setAttendanceRecords(newRecords);
//       setIsLoading(false);
//     }, 1200);
//   };

//   const calculateStats = (): Stats => {
//     const total = attendanceRecords.length;
//     if (total === 0) return { total: 0, present: 0, absent: 0, leave: 0, percentage: '0%' };

//     const present = attendanceRecords.filter((r) => r.status === 'Present').length;
//     const absent = attendanceRecords.filter((r) => r.status === 'Absent').length;
//     const leave = attendanceRecords.filter((r) => r.status === 'Leave').length;
//     const percentage = ((present / total) * 100).toFixed(1) + '%';

//     return { total, present, absent, leave, percentage };
//   };

//   const stats = calculateStats();

//   return (
//     <div className="min-h-screen w-full bg-gray-50 flex flex-col relative text-gray-900">
//       <main className="w-full p-5 md:p-8 space-y-6 max-w-7xl mx-auto flex-1">
//         <Header
//           onMarkAttendance={handleMarkAttendance}
//           onToggleMonthlyView={() => setShowMonthlyView(true)}
//           isMonthlyView={showMonthlyView}
//         />

//         <FiltersSection
//           selectedDate={selectedDate}
//           selectedClass={selectedClass}
//           selectedSection={selectedSection}
//           onDateChange={handleDateChange}
//           onClassChange={handleClassChange}
//           onSectionChange={handleSectionChange}
//         />

//         <StatsGrid stats={stats} />

//         {isLoading ? (
//           <div className="rounded-xl border border-gray-200 bg-white p-12 flex flex-col items-center justify-center gap-3 shadow-sm">
//             <Icon icon="lucide:loader-2" className="w-8 h-8 animate-spin text-blue-600" />
//             <p className="text-sm text-gray-500 font-medium">Fetching attendance records...</p>
//           </div>
//         ) : attendanceRecords.length === 0 ? (
//           <div className="rounded-xl border border-gray-200 bg-white p-12 flex flex-col items-center justify-center gap-4 shadow-sm text-center">
//             <div className="p-3 rounded-full bg-yellow-50 text-yellow-600">
//               <Icon icon="lucide:alert-circle" className="w-8 h-8" />
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900">No Records Found</h3>
//               <p className="text-sm text-gray-500 mt-1 max-w-sm">
//                 No attendance has been marked for {selectedClass} ({selectedSection}) on this date.
//               </p>
//             </div>
//             <button
//               onClick={handleMarkAttendance}
//               className="min-h-10 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-all flex items-center gap-2 cursor-pointer"
//             >
//               <Icon icon="lucide:plus" className="w-4 h-4" />
//               Mark Attendance Now
//             </button>
//           </div>
//         ) : (
//           <AttendanceTable
//             records={attendanceRecords}
//             isEditing={isEditing}
//             selectedClass={selectedClass}
//             selectedSection={selectedSection}
//             selectedDate={selectedDate}
//             onToggleEdit={handleToggleEdit}
//             onStatusChange={handleStatusChange}
//             onRemarksChange={handleRemarksChange}
//             onStudentClick={handleStudentClick}
//             onSave={handleSaveInlineChanges}
//           />
//         )}

//         <StateIndicator
//           isLoading={isLoading}
//           isEmpty={attendanceRecords.length === 0}
//           onMarkAttendance={handleMarkAttendance}
//         />
//       </main>

//       <MarkAttendanceModal
//         isOpen={showMarkAttendanceModal}
//         onClose={() => setShowMarkAttendanceModal(false)}
//         onSave={handleSaveNewAttendance}
//         selectedClass={selectedClass}
//         selectedSection={selectedSection}
//       />

//       <StudentDetailModal
//         student={selectedStudentForDetail}
//         onClose={() => setSelectedStudentForDetail(null)}
//       />

//       <MonthlyViewModal
//         isOpen={showMonthlyView}
//         onClose={() => setShowMonthlyView(false)}
//         selectedClass={selectedClass}
//         selectedSection={selectedSection}
//       />
//     </div>
//   );
// };

// export default DailyAttendance;






















import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Icon } from "@iconify/react";

import {
  useNavigate,
} from "react-router-dom";

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
  clearAttendance,
  clearAttendanceError,
} from "../../../features/attendance/attendance.slice";

import type {
  AttendanceData,
  AttendanceStatus,
} from "../../../features/attendance/attendance.types";


// ============================================
// TYPES
// ============================================

interface AttendanceStats {
  total: number;

  present: number;

  absent: number;

  leave: number;

  halfDay: number;

  percentage: number;
}


// ============================================
// RELATION ID HELPER
// string / populated object dono handle karega
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
// RELATION NAME HELPER
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
// FORMAT DATE
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
// STUDENT DATA HELPER
// ============================================

const getStudentInfo = (
  attendance:
    AttendanceData
) => {
  if (
    typeof attendance.studentId ===
    "string"
  ) {
    return {
      _id:
        attendance.studentId,

      firstName:
        "Student",

      lastName:
        "",

      admissionNumber:
        "-",

      rollNumber:
        "-",

      profileImage:
        "",
    };
  }


  return {
    _id:
      attendance.studentId._id,

    firstName:
      attendance.studentId.firstName,

    lastName:
      attendance.studentId.lastName ||
      "",

    admissionNumber:
      attendance.studentId
        .admissionNumber ||
      "-",

    rollNumber:
      attendance.studentId
        .rollNumber ??
      "-",

    profileImage:
      attendance.studentId
        .profileImage ||
      "",
  };
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
// STATUS LABEL
// ============================================

const getStatusLabel = (
  status:
    AttendanceStatus
) => {
  switch (status) {
    case "PRESENT":
      return "Present";

    case "ABSENT":
      return "Absent";

    case "LEAVE":
      return "Leave";

    case "HALF_DAY":
      return "Half Day";

    default:
      return status;
  }
};


// ============================================
// STATUS STYLE
// ============================================

const getStatusStyle = (
  status:
    AttendanceStatus
) => {
  switch (status) {
    case "PRESENT":
      return "bg-green-100 text-green-700";

    case "ABSENT":
      return "bg-red-100 text-red-700";

    case "LEAVE":
      return "bg-amber-100 text-amber-700";

    case "HALF_DAY":
      return "bg-blue-100 text-blue-700";

    default:
      return "bg-gray-100 text-gray-600";
  }
};


// ============================================
// MAIN COMPONENT
// ============================================

const DailyAttendance:
  React.FC = () => {

  const dispatch =
    useAppDispatch();


  const navigate =
    useNavigate();


  // ============================================
  // REDUX
  // ============================================

  const {
    attendance,
    loading,
    error,
  } = useAppSelector(
    (state) =>
      state.attendance
  );


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


  // ============================================
  // FILTERS
  // ============================================

  const [
    selectedSessionId,
    setSelectedSessionId,
  ] = useState("");


  const [
    selectedClassId,
    setSelectedClassId,
  ] = useState("");


  const [
    selectedSectionId,
    setSelectedSectionId,
  ] = useState("");


  const [
    selectedDate,
    setSelectedDate,
  ] = useState(
    new Date()
      .toISOString()
      .slice(
        0,
        10
      )
  );


  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");


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


    return () => {
      dispatch(
        clearAttendance()
      );


      dispatch(
        clearAttendanceError()
      );
    };
  }, [
    dispatch,
  ]);


  // ============================================
  // DEFAULT CURRENT SESSION
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
  // FILTER CLASSES BY SESSION
  // ============================================

  const availableClasses =
    useMemo(() => {
      if (
        !selectedSessionId
      ) {
        return [];
      }


      return classes.filter(
        (classData) =>
          getRelationId(
            classData.sessionId
          ) ===
          selectedSessionId
      );
    }, [
      classes,
      selectedSessionId,
    ]);


  // ============================================
  // DEFAULT CLASS
  // ============================================

  useEffect(() => {
    if (
      availableClasses.length ===
      0
    ) {
      setSelectedClassId(
        ""
      );

      return;
    }


    const selectedExists =
      availableClasses.some(
        (item) =>
          item._id ===
          selectedClassId
      );


    if (!selectedExists) {
      setSelectedClassId(
        availableClasses[0]?._id ||
          ""
      );
    }
  }, [
    availableClasses,
    selectedClassId,
  ]);


  // ============================================
  // FILTER SECTIONS
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
        (section) => {
          const sessionId =
            getRelationId(
              section.sessionId
            );


          const classId =
            getRelationId(
              section.classId
            );


          return (
            sessionId ===
              selectedSessionId &&
            classId ===
              selectedClassId &&
            section.isActive !==
              false
          );
        }
      );
    }, [
      sections,
      selectedSessionId,
      selectedClassId,
    ]);


  // ============================================
  // DEFAULT SECTION
  // ============================================

  useEffect(() => {
    if (
      availableSections.length ===
      0
    ) {
      setSelectedSectionId(
        ""
      );

      return;
    }


    const selectedExists =
      availableSections.some(
        (item) =>
          item._id ===
          selectedSectionId
      );


    if (!selectedExists) {
      setSelectedSectionId(
        availableSections[0]?._id ||
          ""
      );
    }
  }, [
    availableSections,
    selectedSectionId,
  ]);


  // ============================================
  // GET DAILY ATTENDANCE API
  // ============================================

  useEffect(() => {
    if (
      !selectedSessionId ||
      !selectedClassId ||
      !selectedSectionId ||
      !selectedDate
    ) {
      dispatch(
        clearAttendance()
      );

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
  // CURRENT VALUES
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
  // SEARCH
  // ============================================

  const filteredAttendance =
    useMemo(() => {
      const search =
        searchQuery
          .trim()
          .toLowerCase();


      if (!search) {
        return attendance;
      }


      return attendance.filter(
        (record) => {
          const student =
            getStudentInfo(
              record
            );


          const searchText =
            [
              student.firstName,
              student.lastName,
              student.admissionNumber,
              String(
                student.rollNumber
              ),
            ]
              .join(" ")
              .toLowerCase();


          return searchText.includes(
            search
          );
        }
      );
    }, [
      attendance,
      searchQuery,
    ]);


  // ============================================
  // STATS
  // ============================================

  const stats:
    AttendanceStats =
    useMemo(() => {

      const total =
        attendance.length;


      const present =
        attendance.filter(
          (record) =>
            record.status ===
            "PRESENT"
        ).length;


      const absent =
        attendance.filter(
          (record) =>
            record.status ===
            "ABSENT"
        ).length;


      const leave =
        attendance.filter(
          (record) =>
            record.status ===
            "LEAVE"
        ).length;


      const halfDay =
        attendance.filter(
          (record) =>
            record.status ===
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
      attendance,
    ]);


  // ============================================
  // COMMON QUERY
  // ============================================

  const getCurrentQuery =
    () => {

      const params =
        new URLSearchParams();


      if (
        selectedSessionId
      ) {
        params.set(
          "sessionId",
          selectedSessionId
        );
      }


      if (
        selectedClassId
      ) {
        params.set(
          "classId",
          selectedClassId
        );
      }


      if (
        selectedSectionId
      ) {
        params.set(
          "sectionId",
          selectedSectionId
        );
      }


      if (
        selectedDate
      ) {
        params.set(
          "date",
          selectedDate
        );
      }


      return params.toString();
    };


  // ============================================
  // MARK ATTENDANCE PAGE
  // ============================================

  const handleMarkAttendance =
    () => {
      navigate(
        `/school-admin/attendance/mark?${getCurrentQuery()}`
      );
    };


  // ============================================
  // UPDATE PAGE
  // ============================================

  const handleEditRecord =
    () => {
      navigate(
        `/school-admin/attendance/update?${getCurrentQuery()}`
      );
    };


  // ============================================
  // MONTHLY VIEW PAGE
  // ============================================

  const handleMonthlyView =
    () => {

      const date =
        new Date(
          `${selectedDate}T00:00:00`
        );


      const params =
        new URLSearchParams();


      if (
        selectedSessionId
      ) {
        params.set(
          "sessionId",
          selectedSessionId
        );
      }


      if (
        selectedClassId
      ) {
        params.set(
          "classId",
          selectedClassId
        );
      }


      if (
        selectedSectionId
      ) {
        params.set(
          "sectionId",
          selectedSectionId
        );
      }


      if (
        !Number.isNaN(
          date.getTime()
        )
      ) {
        params.set(
          "month",
          String(
            date.getMonth() +
              1
          )
        );


        params.set(
          "year",
          String(
            date.getFullYear()
          )
        );
      }


      navigate(
        `/school-admin/attendance/monthly?${params.toString()}`
      );
    };


  // ============================================
  // STUDENT DETAILS
  // ============================================

  const handleStudentClick =
    (
      record:
        AttendanceData
    ) => {

      const student =
        getStudentInfo(
          record
        );


      const date =
        new Date(
          `${selectedDate}T00:00:00`
        );


      const params =
        new URLSearchParams();


      if (
        selectedSessionId
      ) {
        params.set(
          "sessionId",
          selectedSessionId
        );
      }


      if (
        !Number.isNaN(
          date.getTime()
        )
      ) {
        params.set(
          "month",
          String(
            date.getMonth() +
              1
          )
        );


        params.set(
          "year",
          String(
            date.getFullYear()
          )
        );
      }


      navigate(
        `/school-admin/attendance/student/${student._id}?${params.toString()}`
      );
    };


  // ============================================
  // RESET
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
        new Date()
          .toISOString()
          .slice(
            0,
            10
          )
      );


      setSearchQuery(
        ""
      );
    };


  return (
    <div className="min-h-screen bg-gray-50 p-5 lg:p-8">

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
            Daily Attendance
          </h1>


          <p className="mt-1 text-sm text-gray-500">
            Review finalized attendance records by class and section.
          </p>

        </div>


        <div className="flex flex-wrap gap-2">

          <button
            onClick={
              handleMarkAttendance
            }
            className="flex min-h-11 items-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >

            <Icon
              icon="lucide:plus-circle"
            />

            Mark Attendance

          </button>


          <button
            onClick={
              handleMonthlyView
            }
            className="flex min-h-11 items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >

            <Icon
              icon="lucide:calendar-range"
            />

            Monthly View

          </button>

        </div>

      </div>


      {/* ========================================
          FILTER CARD
      ======================================== */}

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

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
                (item) => (
                  <option
                    key={
                      item._id
                    }
                    value={
                      item._id
                    }
                  >
                    Section {item.name}
                  </option>
                )
              )}

            </select>

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

          <div className="relative flex-1">

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
              className="min-h-11 w-full rounded-lg border border-gray-300 pl-10 pr-4 text-sm"
            />

          </div>


          <button
            onClick={
              handleReset
            }
            className="min-h-11 rounded-lg border border-gray-300 px-5 text-sm font-semibold hover:bg-gray-50"
          >
            Reset Filters
          </button>

        </div>

      </section>


      {/* ========================================
          STATS
      ======================================== */}

      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">

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
          icon="lucide:circle-check"
          valueClass="text-green-600"
        />


        <StatCard
          label="Absent"
          value={
            stats.absent
          }
          icon="lucide:circle-x"
          valueClass="text-red-600"
        />


        <StatCard
          label="Leave"
          value={
            stats.leave
          }
          icon="lucide:clock"
          valueClass="text-amber-600"
        />


        <StatCard
          label="Half Day"
          value={
            stats.halfDay
          }
          icon="lucide:circle-dot-dashed"
          valueClass="text-blue-600"
        />


        <StatCard
          label="Attendance"
          value={`${stats.percentage}%`}
          icon="lucide:percent"
        />

      </div>


      {/* ========================================
          ERROR
      ======================================== */}

      {error && (
        <div className="mt-5 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

          <span>
            {error}
          </span>


          <button
            onClick={() =>
              dispatch(
                clearAttendanceError()
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
          ATTENDANCE TABLE CARD
      ======================================== */}

      <section className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="flex flex-col gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-lg font-bold text-gray-900">
              {selectedClass?.name ||
                "Class"}{" "}
              · Section{" "}
              {selectedSection?.name ||
                "-"}
            </h2>


            <p className="mt-1 text-sm text-gray-500">

              {formatDate(
                selectedDate
              )}

              {selectedSession?.name
                ? ` · ${selectedSession.name}`
                : ""}

            </p>

          </div>


          {attendance.length >
            0 && (
            <button
              onClick={
                handleEditRecord
              }
              className="flex min-h-10 items-center gap-2 rounded-lg border border-gray-300 px-4 text-sm font-semibold hover:bg-gray-50"
            >

              <Icon
                icon="lucide:pencil"
              />

              Edit Record

            </button>
          )}

        </div>


        {/* LOADING */}

        {loading ? (
          <div className="flex min-h-72 flex-col items-center justify-center gap-3">

            <Icon
              icon="lucide:loader-2"
              className="animate-spin text-4xl text-blue-600"
            />

            <p className="text-sm text-gray-500">
              Loading attendance...
            </p>

          </div>
        ) : !selectedSessionId ||
          !selectedClassId ||
          !selectedSectionId ? (
          <EmptyState
            icon="lucide:list-filter"
            title="Select attendance filters"
            description="Select academic year, class and section."
          />
        ) : filteredAttendance.length ===
          0 ? (
          <EmptyState
            icon="lucide:calendar-x"
            title="No attendance found"
            description={`Attendance has not been marked for ${
              selectedClass?.name ||
              "this class"
            } - Section ${
              selectedSection?.name ||
              ""
            } on ${formatDate(
              selectedDate
            )}.`}
            actionLabel="Mark Attendance"
            onAction={
              handleMarkAttendance
            }
          />
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[1050px] text-left text-sm">

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

                {filteredAttendance.map(
                  (record) => {

                    const student =
                      getStudentInfo(
                        record
                      );


                    const className =
                      getRelationName(
                        record.classId
                      ) ||
                      selectedClass?.name ||
                      "-";


                    const sectionName =
                      getRelationName(
                        record.sectionId
                      ) ||
                      selectedSection?.name ||
                      "-";


                    return (
                      <tr
                        key={
                          record._id
                        }
                        className="hover:bg-gray-50"
                      >

                        {/* STUDENT */}

                        <td className="px-5 py-4">

                          <button
                            onClick={() =>
                              handleStudentClick(
                                record
                              )
                            }
                            className="flex items-center gap-3 text-left"
                          >

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

                              <p className="font-semibold text-gray-900 hover:text-blue-600">

                                {student.firstName}{" "}
                                {student.lastName}

                              </p>


                              <p className="mt-0.5 text-xs text-blue-600">
                                View attendance
                              </p>

                            </div>

                          </button>

                        </td>


                        {/* ADMISSION */}

                        <td className="px-4 py-4 font-mono text-xs text-gray-600">
                          {student.admissionNumber}
                        </td>


                        {/* ROLL */}

                        <td className="px-4 py-4 font-medium">
                          {student.rollNumber}
                        </td>


                        {/* CLASS */}

                        <td className="px-4 py-4 text-gray-600">
                          {className}
                        </td>


                        {/* SECTION */}

                        <td className="px-4 py-4 text-gray-600">
                          {sectionName}
                        </td>


                        {/* STATUS */}

                        <td className="px-4 py-4">

                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                              record.status
                            )}`}
                          >
                            {getStatusLabel(
                              record.status
                            )}
                          </span>

                        </td>


                        {/* REMARKS */}

                        <td className="px-4 py-4 text-gray-600">
                          {record.remarks ||
                            "—"}
                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>
        )}

      </section>

    </div>
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
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: string;

  title: string;

  description: string;

  actionLabel?: string;

  onAction?: () => void;
}) => {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center p-8 text-center">

      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">

        <Icon
          icon={icon}
          className="text-2xl text-gray-400"
        />

      </div>


      <h3 className="mt-4 text-lg font-bold text-gray-900">
        {title}
      </h3>


      <p className="mt-1 max-w-md text-sm text-gray-500">
        {description}
      </p>


      {actionLabel &&
        onAction && (
          <button
            onClick={
              onAction
            }
            className="mt-5 flex min-h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Icon
              icon="lucide:plus"
            />

            {actionLabel}
          </button>
        )}

    </div>
  );
};


export default DailyAttendance;