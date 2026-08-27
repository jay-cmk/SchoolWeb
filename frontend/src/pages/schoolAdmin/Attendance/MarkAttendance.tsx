import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react';

// ==========================================
// TYPES & INTERFACES
// ==========================================

interface Student {
  id: string;
  name: string;
  avatar: string;
  admissionNo: string;
  rollNo: string;
  class: string;
  section: string;
  status: 'present' | 'absent' | 'leave';
  remark: string;
}

interface Stats {
  total: number;
  present: number;
  absent: number;
  leave: number;
  percentage: string;
}

// ==========================================
// MOCK DATA GENERATOR
// ==========================================

const INITIAL_STUDENTS: Student[] = [
  { id: '1', name: 'Aarav Mehta', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', admissionNo: 'ADM-26041', rollNo: '01', class: 'Class 6', section: 'Section A', status: 'present', remark: '' },
  { id: '2', name: 'Diya Sharma', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', admissionNo: 'ADM-26042', rollNo: '02', class: 'Class 6', section: 'Section A', status: 'absent', remark: 'Sick' },
  { id: '3', name: 'Kabir Singh', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', admissionNo: 'ADM-26043', rollNo: '03', class: 'Class 6', section: 'Section A', status: 'leave', remark: 'Medical Leave' },
  { id: '4', name: 'Ananya Iyer', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', admissionNo: 'ADM-26044', rollNo: '04', class: 'Class 6', section: 'Section A', status: 'present', remark: '' },
  { id: '5', name: 'Ishaan Patel', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', admissionNo: 'ADM-26045', rollNo: '05', class: 'Class 6', section: 'Section A', status: 'present', remark: '' },
  { id: '6', name: 'Meera Reddy', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', admissionNo: 'ADM-26046', rollNo: '06', class: 'Class 6', section: 'Section A', status: 'present', remark: '' },
  { id: '7', name: 'Rohan Gupta', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', admissionNo: 'ADM-26047', rollNo: '07', class: 'Class 6', section: 'Section A', status: 'present', remark: '' },
  { id: '8', name: 'Sanya Malhotra', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150', admissionNo: 'ADM-26048', rollNo: '08', class: 'Class 6', section: 'Section A', status: 'present', remark: '' },
  { id: '9', name: 'Aditya Rao', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', admissionNo: 'ADM-26049', rollNo: '09', class: 'Class 6', section: 'Section B', status: 'present', remark: '' },
  { id: '10', name: 'Riya Sen', avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150', admissionNo: 'ADM-26050', rollNo: '10', class: 'Class 6', section: 'Section B', status: 'absent', remark: 'Family Event' },
  { id: '11', name: 'Dev Bajwa', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150', admissionNo: 'ADM-26051', rollNo: '11', class: 'Class 1', section: 'Section A', status: 'present', remark: '' },
  { id: '12', name: 'Kiara Advani', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150', admissionNo: 'ADM-26052', rollNo: '12', class: 'Class 1', section: 'Section A', status: 'leave', remark: 'Out of station' },
];

// Generate extra mock students to reach a realistic count of 48
const generateExtraStudents = (): Student[] => {
  const list = [...INITIAL_STUDENTS];
  const names = [
    'Arjun', 'Bhavna', 'Chirag', 'Deepika', 'Eshwar', 'Farhan', 'Gitanjali', 'Hari', 'Indu', 'Jay',
    'Kavita', 'Laksh', 'Manish', 'Neha', 'Om', 'Pooja', 'Rahul', 'Shruti', 'Tarun', 'Urshila',
    'Varun', 'Yash', 'Zoya', 'Amit', 'Sneha', 'Vikram', 'Preeti', 'Rajesh', 'Komal', 'Sanjay',
    'Nisha', 'Alok', 'Divya', 'Manoj', 'Ritu', 'Sunil'
  ];
  
  for (let i = 0; i < 36; i++) {
    const id = (list.length + 1).toString();
    const name = `${names[i % names.length]} ${['Sharma', 'Verma', 'Joshi', 'Chawla', 'Saxena', 'Nair'][i % 6]}`;
    const isClass6 = i % 3 !== 0;
    const selectedClass = isClass6 ? 'Class 6' : (i % 2 === 0 ? 'Class 2' : 'Class 10');
    const section = i % 2 === 0 ? 'Section A' : 'Section B';
    const status: 'present' | 'absent' | 'leave' = i % 12 === 0 ? 'absent' : (i % 15 === 0 ? 'leave' : 'present');
    
    list.push({
      id,
      name,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + i * 10000}?w=150`,
      admissionNo: `ADM-260${52 + i}`,
      rollNo: (i + 13).toString().padStart(2, '0'),
      class: selectedClass,
      section,
      status,
      remark: status === 'absent' ? 'Unexcused' : status === 'leave' ? 'Approved Leave' : ''
    });
  }
  return list;
};

const ALL_MOCK_STUDENTS = generateExtraStudents();

// ==========================================
// SUB-COMPONENTS
// ==========================================

// --- HEADER ---
interface HeaderProps {
  onMarkAttendance: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMarkAttendance }) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <span>Attendance</span>
          <Icon icon="lucide:chevron-right" className="w-3 h-3" />
          <span>Student Attendance</span>
        </p>
        <h1 className="mt-2 text-2xl font-bold text-gray-900 text-balance">Attendance</h1>
        <p className="mt-1 text-sm text-gray-500 text-pretty">
          Mark, review and manage student attendance by class and section.
        </p>
      </div>
      <button 
        onClick={onMarkAttendance}
        className="min-h-11 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
      >
        <Icon icon="lucide:check-square" className="w-4 h-4" />
        Mark Attendance
      </button>
    </div>
  );
};

// --- STATS SUMMARY ---
interface StatsSummaryProps {
  stats: Stats;
}

const StatsSummary: React.FC<StatsSummaryProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
          <Icon icon="lucide:users" className="w-3.5 h-3.5 text-blue-600" />
          Total Students
        </p>
        <p className="mt-2 text-2xl font-bold text-gray-900">{stats.total}</p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
          <Icon icon="lucide:user-check" className="w-3.5 h-3.5 text-green-600" />
          Present
        </p>
        <p className="mt-2 text-2xl font-bold text-green-600">{stats.present}</p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
          <Icon icon="lucide:user-x" className="w-3.5 h-3.5 text-red-600" />
          Absent
        </p>
        <p className="mt-2 text-2xl font-bold text-red-600">{stats.absent}</p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
          <Icon icon="lucide:calendar-days" className="w-3.5 h-3.5 text-yellow-600" />
          On Leave
        </p>
        <p className="mt-2 text-2xl font-bold text-gray-900">{stats.leave}</p>
      </div>
      <div className="col-span-2 rounded-xl border border-gray-200 bg-white p-4 lg:col-span-1 shadow-sm">
        <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
          <Icon icon="lucide:percent" className="w-3.5 h-3.5 text-indigo-600" />
          Attendance Percentage
        </p>
        <div className="mt-2 flex items-center gap-3">
          <p className="text-2xl font-bold text-gray-900">{stats.percentage}</p>
          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">Today</span>
        </div>
      </div>
    </div>
  );
};

// --- FILTER BAR ---
interface FilterBarProps {
  academicYear: string;
  selectedClass: string;
  selectedSection: string;
  selectedDate: string;
  searchQuery: string;
  onAcademicYearChange: (val: string) => void;
  onClassChange: (val: string) => void;
  onSectionChange: (val: string) => void;
  onDateChange: (val: string) => void;
  onSearchChange: (val: string) => void;
  onResetFilters: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  academicYear,
  selectedClass,
  selectedSection,
  selectedDate,
  searchQuery,
  onAcademicYearChange,
  onClassChange,
  onSectionChange,
  onDateChange,
  onSearchChange,
  onResetFilters,
}) => {
  return (
    <div className="border-b border-gray-200 p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
        <label className="flex-1 text-sm font-medium text-gray-700">
          Academic Year *
          <select 
            value={academicYear}
            onChange={(e) => onAcademicYearChange(e.target.value)}
            className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          >
            <option value="2026-2027">2026-2027</option>
            <option value="2025-2026">2025-2026</option>
          </select>
        </label>

        <label className="flex-1 text-sm font-medium text-gray-700">
          Class *
          <select 
            value={selectedClass}
            onChange={(e) => onClassChange(e.target.value)}
            className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          >
            <option value="Class 6">Class 6</option>
            <option value="Class 1">Class 1</option>
            <option value="Class 2">Class 2</option>
            <option value="Class 10">Class 10</option>
          </select>
        </label>

        <label className="flex-1 text-sm font-medium text-gray-700">
          Section *
          <select 
            value={selectedSection}
            onChange={(e) => onSectionChange(e.target.value)}
            className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          >
            <option value="Section A">Section A</option>
            <option value="Section B">Section B</option>
            <option value="Section C">Section C</option>
          </select>
          <span className="mt-1 block text-xs text-gray-500">Sections shown for {selectedClass}</span>
        </label>

        <label className="flex-1 text-sm font-medium text-gray-700">
          Date *
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => onDateChange(e.target.value)}
            className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900" 
          />
        </label>
      </div>

      <div className="mt-4 flex flex-col gap-3 md:flex-row">
        <div className="flex-1 text-sm font-medium text-gray-700">
          <label htmlFor="search-student">Search Student</label>
          <div className="relative mt-2">
            <Icon icon="lucide:search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              id="search-student"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by student name, admission number or roll number" 
              className="min-h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400" 
            />
          </div>
        </div>
        <button 
          onClick={onResetFilters}
          className="min-h-11 self-end rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <Icon icon="lucide:rotate-ccw" className="w-4 h-4" />
          Reset Filters
        </button>
      </div>
    </div>
  );
};

// --- STUDENT ROW ---
interface StudentRowProps {
  student: Student;
  onStatusChange: (id: string, status: 'present' | 'absent' | 'leave') => void;
  onRemarkChange: (id: string, remark: string) => void;
}

const StudentRow: React.FC<StudentRowProps> = ({ student, onStatusChange, onRemarkChange }) => {
  return (
    <tr className="hover:bg-gray-50/30 transition-colors">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3 text-left">
          <img 
            className="h-9 w-9 rounded-full object-cover border border-gray-200" 
            src={student.avatar} 
            alt={student.name} 
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`;
            }}
          />
          <span className="font-semibold text-gray-900">{student.name}</span>
        </div>
      </td>
      <td className="px-4 py-4 text-gray-500 font-mono text-xs">{student.admissionNo}</td>
      <td className="px-4 py-4 font-medium text-gray-900">{student.rollNo}</td>
      <td className="px-4 py-4 text-gray-500">{student.class}</td>
      <td className="px-4 py-4 text-gray-500">{student.section.replace('Section ', '')}</td>
      <td className="px-4 py-4">
        <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
          <button 
            onClick={() => onStatusChange(student.id, 'present')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
              student.status === 'present' 
                ? 'bg-green-600 text-white shadow-sm' 
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            Present
          </button>
          <button 
            onClick={() => onStatusChange(student.id, 'absent')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
              student.status === 'absent' 
                ? 'bg-red-600 text-white shadow-sm' 
                : 'text-gray-600 hover:text-red-600'
            }`}
          >
            Absent
          </button>
          <button 
            onClick={() => onStatusChange(student.id, 'leave')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
              student.status === 'leave' 
                ? 'bg-yellow-500 text-yellow-900 shadow-sm' 
                : 'text-gray-600 hover:text-yellow-700'
            }`}
          >
            Leave
          </button>
        </div>
      </td>
      <td className="px-4 py-4">
        <input 
          type="text"
          value={student.remark}
          onChange={(e) => onRemarkChange(student.id, e.target.value)}
          placeholder="Optional remark" 
          className="min-h-10 w-40 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400" 
        />
      </td>
    </tr>
  );
};

// --- STUDENT TABLE ---
interface StudentTableProps {
  students: Student[];
  onStatusChange: (id: string, status: 'present' | 'absent' | 'leave') => void;
  onRemarkChange: (id: string, remark: string) => void;
}

const StudentTable: React.FC<StudentTableProps> = ({ students, onStatusChange, onRemarkChange }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[980px] text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-5 py-3 font-semibold">Student</th>
            <th className="px-4 py-3 font-semibold">Admission Number</th>
            <th className="px-4 py-3 font-semibold">Roll Number</th>
            <th className="px-4 py-3 font-semibold">Class</th>
            <th className="px-4 py-3 font-semibold">Section</th>
            <th className="px-4 py-3 font-semibold">Attendance Status</th>
            <th className="px-4 py-3 font-semibold">Remarks</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {students.map((student) => (
            <StudentRow 
              key={student.id} 
              student={student} 
              onStatusChange={onStatusChange} 
              onRemarkChange={onRemarkChange} 
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- PAGINATION ---
interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onCancelChanges: () => void;
  onSaveAttendance: () => void;
  isSaving: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPrevPage,
  onNextPage,
  onCancelChanges,
  onSaveAttendance,
  isSaving,
}) => {
  const startIdx = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIdx = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col gap-4 border-t border-gray-200 p-5 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <span>Showing {startIdx}-{endIdx} of {totalItems} students</span>
        <div className="flex gap-1">
          <button 
            onClick={onPrevPage}
            disabled={currentPage === 1}
            className="min-h-11 rounded-lg border border-gray-300 px-3 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors flex items-center gap-1 text-gray-700"
          >
            <Icon icon="lucide:chevron-left" className="w-4 h-4" />
            Previous
          </button>
          <button 
            onClick={onNextPage}
            disabled={endIdx >= totalItems}
            className="min-h-11 rounded-lg border border-gray-300 px-3 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors flex items-center gap-1 text-gray-700"
          >
            Next
            <Icon icon="lucide:chevron-right" className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex gap-3">
        <button 
          onClick={onCancelChanges}
          className="min-h-11 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel Changes
        </button>
        <button 
          onClick={onSaveAttendance}
          disabled={isSaving}
          className="min-h-11 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-75"
        >
          {isSaving ? (
            <>
              <Icon icon="lucide:loader-2" className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Icon icon="lucide:save" className="w-4 h-4" />
              Save Attendance
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// --- SYSTEM STATUS ALERT ---
interface SystemStatusAlertProps {
  systemState: 'idle' | 'loading' | 'error' | 'saving' | 'success' | 'empty';
  onRetry: () => void;
  onSetState: (state: 'idle' | 'loading' | 'error' | 'saving' | 'success' | 'empty') => void;
}

const SystemStatusAlert: React.FC<SystemStatusAlertProps> = ({ systemState, onRetry, onSetState }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500 flex flex-wrap items-center gap-2">
      <span className="font-semibold text-gray-700 flex items-center gap-1">
        <Icon icon="lucide:terminal" className="w-4 h-4 text-blue-600" />
        System states:
      </span>
      
      <button 
        onClick={() => onSetState('loading')}
        className={`px-2 py-1 rounded transition-colors ${systemState === 'loading' ? 'bg-blue-600/10 text-blue-600 font-medium' : 'hover:text-gray-700'}`}
      >
        Loading students…
      </button>
      · 
      <button 
        onClick={() => onSetState('error')}
        className={`px-2 py-1 rounded transition-colors ${systemState === 'error' ? 'bg-red-600/10 text-red-600 font-medium' : 'hover:text-gray-700'}`}
      >
        Unable to load students.
      </button>
      <button onClick={onRetry} className="font-semibold text-blue-600 hover:underline">Retry</button>
      · 
      <button 
        onClick={() => onSetState('empty')}
        className={`px-2 py-1 rounded transition-colors ${systemState === 'empty' ? 'bg-yellow-500/10 text-yellow-600 font-medium' : 'hover:text-gray-700'}`}
      >
        No students found
      </button>
      · 
      <button 
        onClick={() => onSetState('saving')}
        className={`px-2 py-1 rounded transition-colors ${systemState === 'saving' ? 'bg-indigo-500/10 text-indigo-600 font-medium' : 'hover:text-gray-700'}`}
      >
        Saving attendance…
      </button>
      · 
      <button 
        onClick={() => onSetState('success')}
        className={`px-2 py-1 rounded transition-colors ${systemState === 'success' ? 'bg-green-600/10 text-green-600 font-medium' : 'hover:text-gray-700'}`}
      >
        Attendance saved successfully.
      </button>
      ·
      <button 
        onClick={() => onSetState('idle')}
        className={`px-2 py-1 rounded transition-colors ${systemState === 'idle' ? 'bg-gray-500/10 text-gray-700 font-medium' : 'hover:text-gray-700'}`}
      >
        Reset to Idle
      </button>
    </div>
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================

const MarkAttendance: React.FC = () => {
  // State variables
  const [academicYear, setAcademicYear] = useState<string>('2026-2027');
  const [selectedClass, setSelectedClass] = useState<string>('Class 6');
  const [selectedSection, setSelectedSection] = useState<string>('Section A');
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-25');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [students, setStudents] = useState<Student[]>(ALL_MOCK_STUDENTS);
  const [savedStudents, setSavedStudents] = useState<Student[]>(ALL_MOCK_STUDENTS);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [systemState, setSystemState] = useState<'idle' | 'loading' | 'error' | 'saving' | 'success' | 'empty'>('idle');

  const itemsPerPage = 8;

  // Simulate loading when filters change
  useEffect(() => {
    setSystemState('loading');
    const timer = setTimeout(() => {
      setSystemState('idle');
    }, 800);
    return () => clearTimeout(timer);
  }, [selectedClass, selectedSection, academicYear, selectedDate]);

  // Filtered students logic
  const filteredStudents = useMemo(() => {
    if (systemState === 'loading' || systemState === 'error') return [];
    
    const result = students.filter((student) => {
      const matchesClass = student.class === selectedClass;
      const matchesSection = student.section === selectedSection;
      
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = query === '' || 
        student.name.toLowerCase().includes(query) ||
        student.admissionNo.toLowerCase().includes(query) ||
        student.rollNo.includes(query);

      return matchesClass && matchesSection && matchesSearch;
    });

    return result;
  }, [students, selectedClass, selectedSection, searchQuery, systemState]);

  // Reset page when filters or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedClass, selectedSection, searchQuery]);

  // Calculate stats based on filtered students
  const stats = useMemo((): Stats => {
    const total = filteredStudents.length;
    if (total === 0) return { total: 0, present: 0, absent: 0, leave: 0, percentage: '0%' };

    const present = filteredStudents.filter(s => s.status === 'present').length;
    const absent = filteredStudents.filter(s => s.status === 'absent').length;
    const leave = filteredStudents.filter(s => s.status === 'leave').length;
    const percentage = ((present / total) * 100).toFixed(1) + '%';

    return { total, present, absent, leave, percentage };
  }, [filteredStudents]);

  // Event Handlers
  const handleAcademicYearChange = (val: string) => setAcademicYear(val);
  const handleClassChange = (val: string) => setSelectedClass(val);
  const handleSectionChange = (val: string) => setSelectedSection(val);
  const handleDateChange = (val: string) => setSelectedDate(val);
  const handleSearchChange = (val: string) => setSearchQuery(val);

  const handleResetFilters = () => {
    setAcademicYear('2026-2027');
    setSelectedClass('Class 6');
    setSelectedSection('Section A');
    setSelectedDate('2026-08-25');
    setSearchQuery('');
  };

  const handleMarkAllPresent = () => {
    const updated = students.map(student => {
      const isFiltered = student.class === selectedClass && student.section === selectedSection;
      if (isFiltered) {
        return { ...student, status: 'present' as const };
      }
      return student;
    });
    setStudents(updated);
  };

  const handleStatusChange = (id: string, status: 'present' | 'absent' | 'leave') => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const handleRemarkChange = (id: string, remark: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, remark } : s));
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    const maxPage = Math.ceil(filteredStudents.length / itemsPerPage);
    if (currentPage < maxPage) setCurrentPage(prev => prev + 1);
  };

  const handleCancelChanges = () => {
    setStudents(savedStudents);
  };

  const handleSaveAttendance = () => {
    setSystemState('saving');
    setTimeout(() => {
      setSavedStudents(students);
      setSystemState('success');
      setTimeout(() => setSystemState('idle'), 3000);
    }, 1200);
  };

  const handleRetry = () => {
    setSystemState('loading');
    setTimeout(() => {
      setSystemState('idle');
    }, 1000);
  };

  // Paginated slice
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, currentPage, itemsPerPage]);

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col relative">
      <main className="w-full p-5 md:p-8 space-y-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <Header onMarkAttendance={handleMarkAllPresent} />

        {/* Stats Summary */}
        <StatsSummary stats={stats} />

        {/* Main Section */}
        <section className="rounded-xl border border-gray-200 bg-white shadow-md overflow-hidden">
          
          {/* Filter Bar */}
          <FilterBar 
            academicYear={academicYear}
            selectedClass={selectedClass}
            selectedSection={selectedSection}
            selectedDate={selectedDate}
            searchQuery={searchQuery}
            onAcademicYearChange={handleAcademicYearChange}
            onClassChange={handleClassChange}
            onSectionChange={handleSectionChange}
            onDateChange={handleDateChange}
            onSearchChange={handleSearchChange}
            onResetFilters={handleResetFilters}
          />

          {/* Table Header Info */}
          <div className="flex flex-col gap-3 border-b border-gray-200 p-5 md:flex-row md:items-center md:justify-between bg-gray-50/20">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {selectedClass} · {selectedSection}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {filteredStudents.length} students loaded for {new Date(selectedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <button 
              onClick={handleMarkAllPresent}
              className="min-h-11 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Icon icon="lucide:check-all" className="w-4 h-4" />
              Mark All Present
            </button>
          </div>

          {/* Conditional Rendering based on System State */}
          {systemState === 'loading' ? (
            <div className="p-12 flex flex-col items-center justify-center text-gray-500 gap-3">
              <Icon icon="lucide:loader-2" className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-sm font-medium">Loading student records...</p>
            </div>
          ) : systemState === 'error' ? (
            <div className="p-12 flex flex-col items-center justify-center text-gray-500 gap-3">
              <Icon icon="lucide:alert-circle" className="w-8 h-8 text-red-600" />
              <p className="text-sm font-medium text-red-600">Unable to load students. Please try again.</p>
              <button onClick={handleRetry} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                Retry Connection
              </button>
            </div>
          ) : systemState === 'empty' || filteredStudents.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-gray-500 gap-3">
              <Icon icon="lucide:users" className="w-8 h-8 text-gray-400" />
              <p className="text-sm font-medium">No students found matching the criteria.</p>
              <button onClick={handleResetFilters} className="text-sm text-blue-600 font-semibold hover:underline">
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              {/* Student Table */}
              <StudentTable 
                students={paginatedStudents} 
                onStatusChange={handleStatusChange} 
                onRemarkChange={handleRemarkChange} 
              />

              {/* Pagination & Actions */}
              <Pagination 
                totalItems={filteredStudents.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPrevPage={handlePrevPage}
                onNextPage={handleNextPage}
                onCancelChanges={handleCancelChanges}
                onSaveAttendance={handleSaveAttendance}
                isSaving={systemState === 'saving'}
              />
            </>
          )}
        </section>

        {/* System Status Alert Bar */}
        <SystemStatusAlert 
          systemState={systemState} 
          onRetry={handleRetry} 
          onSetState={setSystemState} 
        />
      </main>
    </div>
  );
};

export default MarkAttendance;