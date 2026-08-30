// import React, { useState, useEffect } from 'react';
// import { Icon } from '@iconify/react';
// import { clsx } from 'clsx';
// import { twMerge } from 'tailwind-merge';

// // --- TYPES & INTERFACES ---

// interface StudentInfo {
//   name: string;
//   admissionNo: string;
//   class: string;
//   section: string;
//   avatar: string;
// }

// interface AttendanceStats {
//   present: number;
//   absent: number;
//   leave: number;
//   percentage: number;
// }

// type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LEAVE' | 'HOLIDAY';

// interface AttendanceRecord {
//   date: string; // YYYY-MM-DD
//   status: AttendanceStatus;
//   remark?: string;
// }

// interface MonthYear {
//   month: number; // 0-11
//   year: number;
//   name: string;
// }

// // --- HELPER FUNCTIONS ---

// const MONTH_NAMES = [
//   'January', 'February', 'March', 'April', 'May', 'June',
//   'July', 'August', 'September', 'October', 'November', 'December'
// ];

// const getDaysInMonth = (year: number, month: number): number => {
//   return new Date(year, month + 1, 0).getDate();
// };

// const getFirstDayOffset = (year: number, month: number): number => {
//   const day = new Date(year, month, 1).getDay();
//   return day === 0 ? 6 : day - 1;
// };

// const formatDateString = (year: number, month: number, day: number): string => {
//   const mm = String(month + 1).padStart(2, '0');
//   const dd = String(day).padStart(2, '0');
//   return `${year}-${mm}-${dd}`;
// };

// // --- SUB-COMPONENTS ---

// // 1. Header Component
// interface HeaderProps {
//   onClose: () => void;
// }

// const Header: React.FC<HeaderProps> = ({ onClose }) => {
//   return (
//     <div className="flex items-start justify-between border-b border-gray-200 p-5">
//       <div>
//         <p className="text-sm text-gray-500">
//           Attendance <span className="mx-1">/</span> Student Details
//         </p>
//         <h1 className="mt-2 text-2xl font-bold text-gray-900">
//           Student Attendance Details
//         </h1>
//       </div>
//       <button
//         onClick={onClose}
//         className="min-h-11 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer"
//       >
//         <Icon icon="lucide:x" className="text-base" /> Close
//       </button>
//     </div>
//   );
// };

// // 2. StudentProfileHeader Component
// interface StudentProfileHeaderProps {
//   student: StudentInfo;
//   attendancePercentage: number;
// }

// const StudentProfileHeader: React.FC<StudentProfileHeaderProps> = ({ student, attendancePercentage }) => {
//   const isBelowThreshold = attendancePercentage < 75;

//   return (
//     <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center">
//       <img
//         className="h-16 w-16 rounded-full object-cover border border-gray-200"
//         src={student.avatar}
//         alt={student.name}
//       />
//       <div className="flex-1">
//         <h2 className="text-lg font-bold text-gray-900">{student.name}</h2>
//         <p className="mt-1 text-sm text-gray-500">Admission No. {student.admissionNo}</p>
//         <div className="mt-2 flex flex-wrap gap-2">
//           <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
//             {student.class}
//           </span>
//           <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
//             {student.section}
//           </span>
//           {isBelowThreshold && (
//             <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-800 flex items-center gap-1 border border-yellow-800/10">
//               <Icon icon="lucide:alert-triangle" className="w-3.5 h-3.5" />
//               Attendance below 75%
//             </span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // 3. StatsGrid Component
// interface StatsGridProps {
//   stats: AttendanceStats;
// }

// const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
//   return (
//     <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
//       <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 transition-all hover:shadow-sm">
//         <p className="text-xs text-gray-500 font-medium">Present Days</p>
//         <p className="mt-2 text-2xl font-bold text-green-600">{stats.present}</p>
//       </div>
//       <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 transition-all hover:shadow-sm">
//         <p className="text-xs text-gray-500 font-medium">Absent Days</p>
//         <p className="mt-2 text-2xl font-bold text-red-600">{stats.absent}</p>
//       </div>
//       <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 transition-all hover:shadow-sm">
//         <p className="text-xs text-gray-500 font-medium">Leave Days</p>
//         <p className="mt-2 text-2xl font-bold text-gray-900">{stats.leave}</p>
//       </div>
//       <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 transition-all hover:shadow-sm">
//         <p className="text-xs text-gray-500 font-medium">Attendance Percentage</p>
//         <p className="mt-2 text-2xl font-bold text-gray-900">
//           {stats.percentage.toFixed(1)}%
//         </p>
//       </div>
//     </div>
//   );
// };

// // 4. CalendarDay Component
// interface CalendarDayProps {
//   dayNumber: number | null;
//   status?: AttendanceStatus;
//   onClick?: () => void;
//   isSelected?: boolean;
// }

// const CalendarDay: React.FC<CalendarDayProps> = ({ dayNumber, status, onClick, isSelected }) => {
//   if (dayNumber === null) {
//     return <span className="py-3"></span>;
//   }

//   let statusClasses = 'bg-gray-100 text-gray-500';

//   if (status === 'PRESENT') {
//     statusClasses = 'bg-green-600 text-white font-semibold';
//   } else if (status === 'ABSENT') {
//     statusClasses = 'bg-red-600 text-white font-semibold';
//   } else if (status === 'LEAVE') {
//     statusClasses = 'bg-yellow-500 text-yellow-900 font-semibold';
//   }

//   return (
//     <button
//       onClick={onClick}
//       className={twMerge(
//         clsx(
//           'rounded-lg py-3 text-center text-xs transition-all cursor-pointer hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500/50',
//           statusClasses,
//           isSelected && 'ring-4 ring-blue-600 ring-offset-2'
//         )
//       )}
//     >
//       {dayNumber}
//     </button>
//   );
// };

// // 5. AttendanceCalendar Component
// interface AttendanceCalendarProps {
//   currentMonth: MonthYear;
//   records: AttendanceRecord[];
//   onPrevMonth: () => void;
//   onNextMonth: () => void;
//   onDayClick: (day: number) => void;
//   selectedDay: number | null;
// }

// const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({
//   currentMonth,
//   records,
//   onPrevMonth,
//   onNextMonth,
//   onDayClick,
//   selectedDay,
// }) => {
//   const daysInMonth = getDaysInMonth(currentMonth.year, currentMonth.month);
//   const offset = getFirstDayOffset(currentMonth.year, currentMonth.month);

//   // Create grid cells
//   const cells: (number | null)[] = [];
//   for (let i = 0; i < offset; i++) {
//     cells.push(null);
//   }
//   for (let i = 1; i <= daysInMonth; i++) {
//     cells.push(i);
//   }

//   // Helper to find status for a specific day
//   const getDayStatus = (day: number): AttendanceStatus => {
//     const dateStr = formatDateString(currentMonth.year, currentMonth.month, day);
//     const record = records.find((r) => r.date === dateStr);
//     if (record) return record.status;

//     // Default weekends to HOLIDAY
//     const dayOfWeek = new Date(currentMonth.year, currentMonth.month, day).getDay();
//     if (dayOfWeek === 0 || dayOfWeek === 6) {
//       return 'HOLIDAY';
//     }
//     return 'PRESENT'; // Default weekday to PRESENT if no record exists
//   };

//   return (
//     <div className="mt-7">
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <div className="flex items-center gap-3">
//             <h2 className="text-lg font-bold text-gray-900">
//               {currentMonth.name}
//             </h2>
//             <div className="flex gap-1">
//               <button
//                 onClick={onPrevMonth}
//                 className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer"
//                 title="Previous Month"
//               >
//                 <Icon icon="lucide:chevron-left" className="w-4 h-4" />
//               </button>
//               <button
//                 onClick={onNextMonth}
//                 className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer"
//                 title="Next Month"
//               >
//                 <Icon icon="lucide:chevron-right" className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//           <p className="mt-1 text-sm text-gray-500">Daily attendance calendar</p>
//         </div>
//         <div className="flex flex-wrap gap-3 text-xs">
//           <span className="flex items-center gap-1.5 text-gray-700 font-medium">
//             <i className="h-3 w-3 rounded-full bg-green-600 inline-block"></i>Present
//           </span>
//           <span className="flex items-center gap-1.5 text-gray-700 font-medium">
//             <i className="h-3 w-3 rounded-full bg-red-600 inline-block"></i>Absent
//           </span>
//           <span className="flex items-center gap-1.5 text-gray-700 font-medium">
//             <i className="h-3 w-3 rounded-full bg-yellow-500 inline-block"></i>Leave
//           </span>
//           <span className="flex items-center gap-1.5 text-gray-700 font-medium">
//             <i className="h-3 w-3 rounded-full bg-gray-300 inline-block"></i>Holiday
//           </span>
//         </div>
//       </div>

//       <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs">
//         <span className="py-2 font-semibold text-gray-500">Mon</span>
//         <span className="py-2 font-semibold text-gray-500">Tue</span>
//         <span className="py-2 font-semibold text-gray-500">Wed</span>
//         <span className="py-2 font-semibold text-gray-500">Thu</span>
//         <span className="py-2 font-semibold text-gray-500">Fri</span>
//         <span className="py-2 font-semibold text-gray-500">Sat</span>
//         <span className="py-2 font-semibold text-gray-500">Sun</span>

//         {cells.map((day, index) => (
//           <CalendarDay
//             key={index}
//             dayNumber={day}
//             status={day ? getDayStatus(day) : undefined}
//             isSelected={day !== null && selectedDay === day}
//             onClick={day ? () => onDayClick(day) : undefined}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// // 6. RecordFieldsFooter Component
// const RecordFieldsFooter: React.FC = () => {
//   return (
//     <div className="mt-7 rounded-xl border border-gray-200 bg-gray-50 p-4">
//       <h3 className="font-bold text-gray-900">Attendance record fields</h3>
//       <p className="mt-1 text-sm text-gray-500 font-mono text-xs overflow-x-auto whitespace-nowrap">
//         academicSessionId · classId · sectionId · date · studentId · status (PRESENT, ABSENT, LEAVE) · remark
//       </p>
//     </div>
//   );
// };

// // 7. DayDetailModal Component (Interactive addition to view/edit remarks & status)
// interface DayDetailModalProps {
//   day: number;
//   currentMonth: MonthYear;
//   record?: AttendanceRecord;
//   onClose: () => void;
//   onSave: (status: AttendanceStatus, remark: string) => void;
// }

// const DayDetailModal: React.FC<DayDetailModalProps> = ({
//   day,
//   currentMonth,
//   record,
//   onClose,
//   onSave,
// }) => {
//   const [status, setStatus] = useState<AttendanceStatus>(record?.status || 'PRESENT');
//   const [remark, setRemark] = useState<string>(record?.remark || '');

//   const dateStr = formatDateString(currentMonth.year, currentMonth.month, day);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSave(status, remark);
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
//       <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
//         <div className="flex items-center justify-between border-b border-gray-200 pb-3">
//           <h3 className="text-lg font-bold text-gray-900">
//             Edit Attendance: {day} {currentMonth.name.split(' ')[0]}
//           </h3>
//           <button
//             onClick={onClose}
//             className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
//           >
//             <Icon icon="lucide:x" className="w-5 h-5" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="mt-4 space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-500 mb-2">
//               Status
//             </label>
//             <div className="grid grid-cols-2 gap-2">
//               {(['PRESENT', 'ABSENT', 'LEAVE', 'HOLIDAY'] as AttendanceStatus[]).map((s) => (
//                 <button
//                   key={s}
//                   type="button"
//                   onClick={() => setStatus(s)}
//                   className={twMerge(
//                     clsx(
//                       'py-2 px-3 rounded-lg border text-sm font-medium transition-all cursor-pointer text-center',
//                       status === s
//                         ? s === 'PRESENT'
//                           ? 'bg-green-600 text-white border-green-600'
//                           : s === 'ABSENT'
//                           ? 'bg-red-600 text-white border-red-600'
//                           : s === 'LEAVE'
//                           ? 'bg-yellow-500 text-yellow-900 border-yellow-500'
//                           : 'bg-gray-200 text-gray-500 border-gray-300'
//                         : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
//                     )
//                   )}
//                 >
//                   {s}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div>
//             <label htmlFor="remark" className="block text-sm font-medium text-gray-500 mb-1">
//               Remarks / Notes
//             </label>
//             <textarea
//               id="remark"
//               rows={3}
//               value={remark}
//               onChange={(e) => setRemark(e.target.value)}
//               placeholder="Enter reason for absence, leave details, or general remarks..."
//               className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400"
//             />
//           </div>

//           <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
//             <button
//               type="button"
//               onClick={onClose}
//               className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
//             >
//               Save Changes
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // --- MAIN COMPONENT ---

// const StudentAttendanceDetails: React.FC = () => {
//   // 1. Student Info State
//   const [studentInfo] = useState<StudentInfo>({
//     name: 'Diya Sharma',
//     admissionNo: 'ADM-26042',
//     class: 'Class 6',
//     section: 'Section A',
//     avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120',
//   });

//   // 2. Current Month State (Initialized to August 2026)
//   const [currentMonth, setCurrentMonth] = useState<MonthYear>({
//     month: 7, // August (0-indexed)
//     year: 2026,
//     name: 'August 2026',
//   });

//   // 3. Attendance Records State (Pre-populated to match the HTML calendar)
//   const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
//     { date: '2026-08-01', status: 'PRESENT' },
//     { date: '2026-08-02', status: 'HOLIDAY', remark: 'Sunday' },
//     { date: '2026-08-03', status: 'HOLIDAY', remark: 'School Holiday' },
//     { date: '2026-08-04', status: 'PRESENT' },
//     { date: '2026-08-05', status: 'PRESENT' },
//     { date: '2026-08-06', status: 'PRESENT' },
//     { date: '2026-08-07', status: 'ABSENT', remark: 'Unexcused absence' },
//     { date: '2026-08-08', status: 'PRESENT' },
//     { date: '2026-08-09', status: 'HOLIDAY', remark: 'Sunday' },
//     { date: '2026-08-10', status: 'HOLIDAY', remark: 'Raksha Bandhan' },
//     { date: '2026-08-11', status: 'PRESENT' },
//     { date: '2026-08-12', status: 'PRESENT' },
//     { date: '2026-08-13', status: 'LEAVE', remark: 'Family function' },
//     { date: '2026-08-14', status: 'PRESENT' },
//     { date: '2026-08-15', status: 'PRESENT' },
//     { date: '2026-08-16', status: 'HOLIDAY', remark: 'Sunday' },
//     { date: '2026-08-17', status: 'HOLIDAY', remark: 'Janmashtami' },
//     { date: '2026-08-18', status: 'PRESENT' },
//     { date: '2026-08-19', status: 'ABSENT', remark: 'Sick leave without application' },
//     { date: '2026-08-20', status: 'PRESENT' },
//     { date: '2026-08-21', status: 'PRESENT' },
//     { date: '2026-08-22', status: 'PRESENT' },
//     { date: '2026-08-23', status: 'HOLIDAY', remark: 'Sunday' },
//     { date: '2026-08-24', status: 'HOLIDAY', remark: 'Local Holiday' },
//     { date: '2026-08-25', status: 'PRESENT' },
//     { date: '2026-08-26', status: 'PRESENT' },
//     { date: '2026-08-27', status: 'ABSENT', remark: 'Missed school bus' },
//     { date: '2026-08-28', status: 'PRESENT' },
//     { date: '2026-08-29', status: 'PRESENT' },
//     { date: '2026-08-30', status: 'HOLIDAY', remark: 'Sunday' },
//     { date: '2026-08-31', status: 'HOLIDAY', remark: 'Teacher Training Day' },
//   ]);

//   // 4. Selected Day State (for modal view/edit)
//   const [selectedDay, setSelectedDay] = useState<number | null>(null);

//   // 5. Dynamic Attendance Stats Calculation
//   const [attendanceStats, setAttendanceStats] = useState<AttendanceStats>({
//     present: 15,
//     absent: 5,
//     leave: 2,
//     percentage: 68.2,
//   });

//   // Recalculate stats whenever records or current month changes
//   useEffect(() => {
//     const currentMonthPrefix = `${currentMonth.year}-${String(currentMonth.month + 1).padStart(2, '0')}`;
//     const monthlyRecords = attendanceRecords.filter((r) => r.date.startsWith(currentMonthPrefix));

//     let present = 0;
//     let absent = 0;
//     let leave = 0;

//     monthlyRecords.forEach((r) => {
//       if (r.status === 'PRESENT') present++;
//       else if (r.status === 'ABSENT') absent++;
//       else if (r.status === 'LEAVE') leave++;
//     });

//     const totalActiveDays = present + absent + leave;
//     const percentage = totalActiveDays > 0 ? (present / totalActiveDays) * 100 : 100;

//     setAttendanceStats({
//       present,
//       absent,
//       leave,
//       percentage,
//     });
//   }, [attendanceRecords, currentMonth]);

//   // --- EVENT HANDLERS ---

//   const handleClose = () => {
//     alert('Closing student details view. Navigating back to main attendance list...');
//   };

//   const handlePrevMonth = () => {
//     setCurrentMonth((prev) => {
//       let newMonth = prev.month - 1;
//       let newYear = prev.year;
//       if (newMonth < 0) {
//         newMonth = 11;
//         newYear -= 1;
//       }
//       return {
//         month: newMonth,
//         year: newYear,
//         name: `${MONTH_NAMES[newMonth]} ${newYear}`,
//       };
//     });
//     setSelectedDay(null);
//   };

//   const handleNextMonth = () => {
//     setCurrentMonth((prev) => {
//       let newMonth = prev.month + 1;
//       let newYear = prev.year;
//       if (newMonth > 11) {
//         newMonth = 0;
//         newYear += 1;
//       }
//       return {
//         month: newMonth,
//         year: newYear,
//         name: `${MONTH_NAMES[newMonth]} ${newYear}`,
//       };
//     });
//     setSelectedDay(null);
//   };

//   const handleDayClick = (day: number) => {
//     setSelectedDay(day);
//   };

//   const handleSaveRecord = (status: AttendanceStatus, remark: string) => {
//     if (selectedDay === null) return;

//     const dateStr = formatDateString(currentMonth.year, currentMonth.month, selectedDay);
//     setAttendanceRecords((prev) => {
//       const existingIndex = prev.findIndex((r) => r.date === dateStr);
//       if (existingIndex > -1) {
//         const updated = [...prev];
//         updated[existingIndex] = { date: dateStr, status, remark };
//         return updated;
//       } else {
//         return [...prev, { date: dateStr, status, remark }];
//       }
//     });

//     setSelectedDay(null);
//   };

//   // Find record for currently selected day
//   const selectedRecord = selectedDay
//     ? attendanceRecords.find(
//         (r) => r.date === formatDateString(currentMonth.year, currentMonth.month, selectedDay)
//       )
//     : undefined;

//   return (
//     <div className="min-h-screen w-full bg-gray-50 flex flex-col relative">
//       <main className="w-full p-5 md:p-8">
//         <section className="mx-auto max-w-5xl rounded-xl border border-gray-200 bg-white shadow-md overflow-hidden">
//           {/* Header */}
//           <Header onClose={handleClose} />

//           <div className="p-5 md:p-6">
//             {/* Student Profile Header */}
//             <StudentProfileHeader
//               student={studentInfo}
//               attendancePercentage={attendanceStats.percentage}
//             />

//             {/* Stats Grid */}
//             <StatsGrid stats={attendanceStats} />

//             {/* Attendance Calendar */}
//             <AttendanceCalendar
//               currentMonth={currentMonth}
//               records={attendanceRecords}
//               onPrevMonth={handlePrevMonth}
//               onNextMonth={handleNextMonth}
//               onDayClick={handleDayClick}
//               selectedDay={selectedDay}
//             />

//             {/* Record Fields Footer */}
//             <RecordFieldsFooter />
//           </div>
//         </section>
//       </main>

//       {/* Interactive Day Detail Modal */}
//       {selectedDay !== null && (
//         <DayDetailModal
//           day={selectedDay}
//           currentMonth={currentMonth}
//           record={selectedRecord}
//           onClose={() => setSelectedDay(null)}
//           onSave={handleSaveRecord}
//         />
//       )}
//     </div>
//   );
// };

// export default StudentAttendanceDetails;









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
  getMonthlyAttendanceSummary,
  clearMonthlyAttendanceSummary,
  clearAttendanceError,
} from "../../../features/attendance/attendance.slice";

import type {
  MonthlyStudentSummary,
} from "../../../features/attendance/attendance.types";


// ============================================
// HELPERS
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


const getInitials = (
  firstName: string,
  lastName?: string
) => {
  return `${firstName.charAt(
    0
  )}${lastName?.charAt(
    0
  ) || ""}`
    .trim()
    .toUpperCase();
};


const getMonthLabel = (
  month: number,
  year: number
) => {
  const date =
    new Date(
      year,
      month - 1,
      1
    );

  return date.toLocaleDateString(
    "en-IN",
    {
      month: "long",
      year: "numeric",
    }
  );
};


// ============================================
// MONTH OPTIONS
// ============================================

const monthOptions = [
  {
    value: 1,
    label: "January",
  },
  {
    value: 2,
    label: "February",
  },
  {
    value: 3,
    label: "March",
  },
  {
    value: 4,
    label: "April",
  },
  {
    value: 5,
    label: "May",
  },
  {
    value: 6,
    label: "June",
  },
  {
    value: 7,
    label: "July",
  },
  {
    value: 8,
    label: "August",
  },
  {
    value: 9,
    label: "September",
  },
  {
    value: 10,
    label: "October",
  },
  {
    value: 11,
    label: "November",
  },
  {
    value: 12,
    label: "December",
  },
];


// ============================================
// MAIN COMPONENT
// ============================================

const MonthlyAttendance:
  React.FC = () => {

  const dispatch =
    useAppDispatch();

  const navigate =
    useNavigate();

  const [
    searchParams,
  ] = useSearchParams();


  // ============================================
  // REDUX
  // ============================================

  const {
    monthlySummary,
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
  // FILTER STATE
  // ============================================

  const today =
    new Date();


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
    selectedMonth,
    setSelectedMonth,
  ] = useState<number>(
    Number(
      searchParams.get(
        "month"
      )
    ) ||
      today.getMonth() +
        1
  );


  const [
    selectedYear,
    setSelectedYear,
  ] = useState<number>(
    Number(
      searchParams.get(
        "year"
      )
    ) ||
      today.getFullYear()
  );


  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);


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

    return () => {
      dispatch(
        clearMonthlyAttendanceSummary()
      );

      dispatch(
        clearAttendanceError()
      );
    };
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
  // AVAILABLE CLASSES
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
  // VALIDATE CLASS
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
  // AVAILABLE SECTIONS
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
  // VALIDATE SECTION
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
  // FETCH MONTHLY SUMMARY
  // ============================================

  useEffect(() => {
    if (
      !selectedSessionId ||
      !selectedClassId ||
      !selectedSectionId ||
      !selectedMonth ||
      !selectedYear
    ) {
      dispatch(
        clearMonthlyAttendanceSummary()
      );

      return;
    }

    dispatch(
      getMonthlyAttendanceSummary({
        sessionId:
          selectedSessionId,

        classId:
          selectedClassId,

        sectionId:
          selectedSectionId,

        month:
          selectedMonth,

        year:
          selectedYear,
      })
    );

  }, [
    dispatch,
    selectedSessionId,
    selectedClassId,
    selectedSectionId,
    selectedMonth,
    selectedYear,
  ]);


  // ============================================
  // RESET PAGE
  // ============================================

  useEffect(() => {
    setCurrentPage(
      1
    );
  }, [
    selectedSessionId,
    selectedClassId,
    selectedSectionId,
    selectedMonth,
    selectedYear,
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
  // SUMMARY
  // ============================================

  const students =
    monthlySummary?.summary ||
    [];


  const totalPages =
    Math.max(
      1,
      Math.ceil(
        students.length /
          itemsPerPage
      )
    );


  const paginatedStudents =
    useMemo(() => {
      const start =
        (
          currentPage -
          1
        ) *
        itemsPerPage;

      return students.slice(
        start,
        start +
          itemsPerPage
      );
    }, [
      students,
      currentPage,
    ]);


  // ============================================
  // DAILY VIEW
  // ============================================

  const handleDailyView =
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


      const date =
        `${selectedYear}-${String(
          selectedMonth
        ).padStart(
          2,
          "0"
        )}-01`;


      params.set(
        "date",
        date
      );


      navigate(
        `/school-admin/attendance/daily?${params.toString()}`
      );
    };


  // ============================================
  // MARK ATTENDANCE
  // ============================================

  const handleMarkAttendance =
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


      params.set(
        "date",
        new Date()
          .toISOString()
          .slice(
            0,
            10
          )
      );


      navigate(
        `/school-admin/attendance/mark?${params.toString()}`
      );
    };


  // ============================================
  // STUDENT DETAILS
  // ============================================

  const handleStudentClick =
    (
      item:
        MonthlyStudentSummary
    ) => {

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


      params.set(
        "month",
        String(
          selectedMonth
        )
      );


      params.set(
        "year",
        String(
          selectedYear
        )
      );


      navigate(
        `/school-admin/attendance/student/${item.student._id}?${params.toString()}`
      );
    };


  // ============================================
  // YEAR OPTIONS
  // ============================================

  const yearOptions =
    useMemo(() => {
      const currentYear =
        new Date()
          .getFullYear();

      return [
        currentYear - 2,
        currentYear - 1,
        currentYear,
        currentYear + 1,
      ];
    }, []);


  return (
    <div className="min-h-screen bg-gray-50 p-5 md:p-8">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

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
            Monthly Attendance
          </h1>


          <p className="mt-1 text-sm text-gray-500">
            Monitor monthly attendance trends and identify students needing support.
          </p>

        </div>


        <div className="flex gap-2">

          <button
            onClick={
              handleDailyView
            }
            className="flex min-h-11 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <Icon
              icon="lucide:calendar"
            />

            Daily View
          </button>


          <button
            onClick={
              handleMarkAttendance
            }
            className="flex min-h-11 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Icon
              icon="lucide:check-square"
            />

            Mark Attendance
          </button>

        </div>

      </div>


      {/* ========================================
          FILTERS
      ======================================== */}

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

          {/* SESSION */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Academic Year
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
              Class
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
              Section
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

          </div>


          {/* MONTH */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Month
            </label>


            <select
              value={
                selectedMonth
              }
              onChange={(e) =>
                setSelectedMonth(
                  Number(
                    e.target.value
                  )
                )
              }
              className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm"
            >

              {monthOptions.map(
                (month) => (
                  <option
                    key={
                      month.value
                    }
                    value={
                      month.value
                    }
                  >
                    {month.label}
                  </option>
                )
              )}

            </select>

          </div>


          {/* YEAR */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Year
            </label>


            <select
              value={
                selectedYear
              }
              onChange={(e) =>
                setSelectedYear(
                  Number(
                    e.target.value
                  )
                )
              }
              className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm"
            >

              {yearOptions.map(
                (year) => (
                  <option
                    key={
                      year
                    }
                    value={
                      year
                    }
                  >
                    {year}
                  </option>
                )
              )}

            </select>

          </div>

        </div>

      </section>


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
          TABLE
      ======================================== */}

      <section className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-200 p-5">

          <h2 className="text-lg font-bold text-gray-900">

            {selectedClass?.name ||
              "Class"}

            {" · Section "}

            {selectedSection?.name ||
              "-"}

          </h2>


          <p className="mt-1 text-sm text-gray-500">

            {getMonthLabel(
              selectedMonth,
              selectedYear
            )}

            {" · "}

            {monthlySummary?.workingDays ||
              0}{" "}
            working days

            {selectedSession?.name
              ? ` · ${selectedSession.name}`
              : ""}

          </p>

        </div>


        {loading ? (
          <div className="flex min-h-72 flex-col items-center justify-center gap-3">

            <Icon
              icon="lucide:loader-2"
              className="animate-spin text-4xl text-blue-600"
            />

            <p className="text-sm text-gray-500">
              Loading monthly attendance...
            </p>

          </div>
        ) : !selectedSessionId ||
          !selectedClassId ||
          !selectedSectionId ? (
          <EmptyState
            title="Select filters"
            description="Academic year, class and section select karo."
          />
        ) : students.length ===
          0 ? (
          <EmptyState
            title="No attendance data"
            description="Selected month ke liye attendance records nahi mile."
          />
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px] text-left text-sm">

              <thead className="bg-gray-50 text-xs uppercase text-gray-500">

                <tr>

                  <th className="px-5 py-4">
                    Student
                  </th>

                  <th className="px-4 py-4">
                    Roll Number
                  </th>

                  <th className="px-4 py-4">
                    Present Days
                  </th>

                  <th className="px-4 py-4">
                    Absent Days
                  </th>

                  <th className="px-4 py-4">
                    Leave Days
                  </th>

                  <th className="px-4 py-4">
                    Half Days
                  </th>

                  <th className="px-4 py-4">
                    Working Days
                  </th>

                  <th className="px-4 py-4">
                    Attendance Percentage
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-gray-200">

                {paginatedStudents.map(
                  (item) => {

                    const student =
                      item.student;


                    const isLowAttendance =
                      item.below75;


                    return (
                      <tr
                        key={
                          student._id
                        }
                        className="hover:bg-gray-50"
                      >

                        {/* STUDENT */}

                        <td className="px-5 py-4">

                          <button
                            onClick={() =>
                              handleStudentClick(
                                item
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


                              {student.admissionNumber && (
                                <p className="mt-0.5 text-xs text-gray-500">
                                  {
                                    student.admissionNumber
                                  }
                                </p>
                              )}

                            </div>

                          </button>

                        </td>


                        {/* ROLL */}

                        <td className="px-4 py-4 font-medium">
                          {student.rollNumber ||
                            "-"}
                        </td>


                        {/* PRESENT */}

                        <td className="px-4 py-4 font-semibold text-green-600">
                          {item.presentDays}
                        </td>


                        {/* ABSENT */}

                        <td className="px-4 py-4 font-semibold text-red-600">
                          {item.absentDays}
                        </td>


                        {/* LEAVE */}

                        <td className="px-4 py-4 text-amber-600">
                          {item.leaveDays}
                        </td>


                        {/* HALF DAY */}

                        <td className="px-4 py-4 text-blue-600">
                          {item.halfDays}
                        </td>


                        {/* WORKING DAYS */}

                        <td className="px-4 py-4 text-gray-600">
                          {item.workingDays}
                        </td>


                        {/* PERCENTAGE */}

                        <td className="px-4 py-4">

                          <div className="flex flex-wrap items-center gap-2">

                            <span
                              className={`font-bold ${
                                isLowAttendance
                                  ? "text-red-600"
                                  : "text-gray-900"
                              }`}
                            >
                              {
                                item.attendancePercentage
                              }
                              %
                            </span>


                            {isLowAttendance && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">

                                <Icon
                                  icon="lucide:triangle-alert"
                                />

                                Attendance below 75%

                              </span>
                            )}

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>
        )}


        {/* ======================================
            PAGINATION
        ====================================== */}

        {students.length >
          0 && (
          <div className="flex flex-col gap-4 border-t border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-sm text-gray-500">

              Showing{" "}

              {(
                currentPage -
                1
              ) *
                itemsPerPage +
                1}

              -

              {Math.min(
                currentPage *
                  itemsPerPage,
                students.length
              )}

              {" "}of{" "}

              {students.length} students

            </p>


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
                className="min-h-10 rounded-lg border border-gray-300 px-4 text-sm font-semibold disabled:opacity-40"
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
                className="min-h-10 rounded-lg border border-gray-300 px-4 text-sm font-semibold disabled:opacity-40"
              >
                Next
              </button>

            </div>

          </div>
        )}

      </section>

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
          icon="lucide:calendar-x"
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


export default MonthlyAttendance;