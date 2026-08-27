import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

// ==========================================
// TypeScript Interfaces
// ==========================================

export interface Student {
  id: string;
  name: string;
  avatar: string;
  rollNumber: string;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  workingDays: number;
  percentage: number;
}

interface BreadcrumbsProps {
  paths: string[];
}

interface HeaderProps {
  title: string;
  description: string;
  onDailyViewClick: () => void;
  onMarkAttendanceClick: () => void;
}

interface FiltersSectionProps {
  academicYear: string;
  selectedClass: string;
  selectedSection: string;
  selectedMonth: string;
  onAcademicYearChange: (year: string) => void;
  onClassChange: (className: string) => void;
  onSectionChange: (section: string) => void;
  onMonthChange: (month: string) => void;
  isLoading: boolean;
}

interface StudentRowProps {
  student: Student;
  onStudentClick: (student: Student) => void;
}

interface AttendanceTableProps {
  students: Student[];
  selectedClass: string;
  selectedSection: string;
  selectedMonth: string;
  onStudentClick: (student: Student) => void;
  isLoading: boolean;
}

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

// ==========================================
// Helper Sub-components
// ==========================================

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ paths }) => {
  return (
    <nav className="text-sm text-gray-500 flex items-center gap-1">
      {paths.map((path, index) => (
        <React.Fragment key={path}>
          {index > 0 && <span className="mx-1 text-gray-400/50">/</span>}
          <span className={index === paths.length - 1 ? "text-gray-900 font-medium" : ""}>
            {path}
          </span>
        </React.Fragment>
      ))}
    </nav>
  );
};

const Header: React.FC<HeaderProps> = ({
  title,
  description,
  onDailyViewClick,
  onMarkAttendanceClick,
}) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <Breadcrumbs paths={["Attendance", "Student Attendance"]} />
        <h1 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
          {title}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {description}
        </p>
      </div>
      <div className="flex gap-2.5">
        <button
          onClick={onDailyViewClick}
          className="inline-flex items-center justify-center gap-2 min-h-11 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <Icon icon="lucide:calendar" className="w-4 h-4" />
          Daily View
        </button>
        <button
          onClick={onMarkAttendanceClick}
          className="inline-flex items-center justify-center gap-2 min-h-11 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer shadow-sm"
        >
          <Icon icon="lucide:check-square" className="w-4 h-4" />
          Mark Attendance
        </button>
      </div>
    </div>
  );
};

const FiltersSection: React.FC<FiltersSectionProps> = ({
  academicYear,
  selectedClass,
  selectedSection,
  selectedMonth,
  onAcademicYearChange,
  onClassChange,
  onSectionChange,
  onMonthChange,
  isLoading,
}) => {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm relative overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
          <Icon icon="lucide:loader-2" className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-sm font-medium text-gray-700 flex flex-col gap-2">
          Academic Year
          <div className="relative">
            <select
              value={academicYear}
              onChange={(e) => onAcademicYearChange(e.target.value)}
              className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              <option value="2026-2027">2026-2027</option>
              <option value="2025-2026">2025-2026</option>
            </select>
            <Icon icon="lucide:chevron-down" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </label>

        <label className="text-sm font-medium text-gray-700 flex flex-col gap-2">
          Class
          <div className="relative">
            <select
              value={selectedClass}
              onChange={(e) => onClassChange(e.target.value)}
              className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              <option value="Class 6">Class 6</option>
              <option value="Class 10">Class 10</option>
            </select>
            <Icon icon="lucide:chevron-down" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </label>

        <label className="text-sm font-medium text-gray-700 flex flex-col gap-2">
          Section
          <div className="relative">
            <select
              value={selectedSection}
              onChange={(e) => onSectionChange(e.target.value)}
              className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              <option value="Section A">Section A</option>
              <option value="Section B">Section B</option>
            </select>
            <Icon icon="lucide:chevron-down" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </label>

        <label className="text-sm font-medium text-gray-700 flex flex-col gap-2">
          Month
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => onMonthChange(e.target.value)}
              className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              <option value="August 2026">August 2026</option>
              <option value="July 2026">July 2026</option>
            </select>
            <Icon icon="lucide:chevron-down" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </label>
      </div>
    </section>
  );
};

const StudentRow: React.FC<StudentRowProps> = ({ student, onStudentClick }) => {
  const isLowAttendance = student.percentage < 75;

  return (
    <tr className="hover:bg-gray-50/40 transition-colors">
      <td className="px-5 py-4">
        <button
          onClick={() => onStudentClick(student)}
          className="flex items-center gap-3 font-semibold text-gray-900 hover:text-blue-600 transition-colors text-left focus:outline-none group"
        >
          <img
            className="h-9 w-9 rounded-full object-cover border border-gray-200 group-hover:border-blue-500 transition-colors"
            src={student.avatar}
            alt={student.name}
          />
          <span>{student.name}</span>
        </button>
      </td>
      <td className="px-4 py-4 text-gray-500 font-mono">{student.rollNumber}</td>
      <td className="px-4 py-4 text-green-600 font-semibold">{student.presentDays}</td>
      <td className="px-4 py-4 text-red-600 font-medium">{student.absentDays}</td>
      <td className="px-4 py-4 text-gray-500">{student.leaveDays}</td>
      <td className="px-4 py-4 text-gray-500">{student.workingDays}</td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`font-semibold ${isLowAttendance ? 'text-red-600' : 'text-gray-900'}`}>
            {student.percentage}%
          </span>
          {isLowAttendance && (
            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2.5 py-0.5 text-xs font-semibold text-yellow-800 border border-yellow-800/10">
              <Icon icon="lucide:alert-triangle" className="w-3 h-3" />
              Attendance below 75%
            </span>
          )}
        </div>
      </td>
    </tr>
  );
};

const AttendanceTable: React.FC<AttendanceTableProps> = ({
  students,
  selectedClass,
  selectedSection,
  selectedMonth,
  onStudentClick,
  isLoading,
}) => {
  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
          <Icon icon="lucide:loader-2" className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      )}
      <div className="flex flex-col gap-1 border-b border-gray-200 p-5">
        <h2 className="text-lg font-bold text-gray-900">
          {selectedClass} · {selectedSection}
        </h2>
        <p className="text-sm text-gray-500">
          {selectedMonth} · 22 working days
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500 tracking-wider border-b border-gray-200">
            <tr>
              <th className="px-5 py-3.5 font-semibold">Student</th>
              <th className="px-4 py-3.5 font-semibold">Roll Number</th>
              <th className="px-4 py-3.5 font-semibold">Present Days</th>
              <th className="px-4 py-3.5 font-semibold">Absent Days</th>
              <th className="px-4 py-3.5 font-semibold">Leave Days</th>
              <th className="px-4 py-3.5 font-semibold">Working Days</th>
              <th className="px-4 py-3.5 font-semibold">Attendance Percentage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.length > 0 ? (
              students.map((student) => (
                <StudentRow
                  key={student.id}
                  student={student}
                  onStudentClick={onStudentClick}
                />
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-gray-500">
                  No student records found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPrevPage,
  onNextPage,
}) => {
  const startRange = (currentPage - 1) * itemsPerPage + 1;
  const endRange = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 p-5 text-sm text-gray-500">
      <span>
        Showing <span className="font-medium text-gray-900">{startRange}-{endRange}</span> of{" "}
        <span className="font-medium text-gray-900">{totalItems}</span> students
      </span>
      <div className="flex gap-2 w-full sm:w-auto justify-end">
        <button
          onClick={onPrevPage}
          disabled={currentPage === 1}
          className="inline-flex items-center justify-center gap-1 min-h-10 rounded-lg border border-gray-200 px-3.5 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          <Icon icon="lucide:chevron-left" className="w-4 h-4" />
          Previous
        </button>
        <button
          onClick={onNextPage}
          disabled={endRange >= totalItems}
          className="inline-flex items-center justify-center gap-1 min-h-10 rounded-lg border border-gray-200 px-3.5 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          Next
          <Icon icon="lucide:chevron-right" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ==========================================
// Main Page Component
// ==========================================

const MonthlyAttendance: React.FC = () => {
  // State variables
  const [academicYear, setAcademicYear] = useState<string>("2026-2027");
  const [selectedClass, setSelectedClass] = useState<string>("Class 6");
  const [selectedSection, setSelectedSection] = useState<string>("Section A");
  const [selectedMonth, setSelectedMonth] = useState<string>("August 2026");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Mock database of students
  const allStudents: Student[] = [
    { id: "1", name: "Aarav Mehta", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", rollNumber: "01", presentDays: 21, absentDays: 1, leaveDays: 0, workingDays: 22, percentage: 95.5 },
    { id: "2", name: "Diya Sharma", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80", rollNumber: "02", presentDays: 15, absentDays: 5, leaveDays: 2, workingDays: 22, percentage: 68.2 },
    { id: "3", name: "Kabir Singh", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", rollNumber: "03", presentDays: 19, absentDays: 1, leaveDays: 2, workingDays: 22, percentage: 86.4 },
    { id: "4", name: "Ananya Patel", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80", rollNumber: "04", presentDays: 22, absentDays: 0, leaveDays: 0, workingDays: 22, percentage: 100.0 },
    { id: "5", name: "Rohan Gupta", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80", rollNumber: "05", presentDays: 14, absentDays: 6, leaveDays: 2, workingDays: 22, percentage: 63.6 },
    { id: "6", name: "Ishaan Verma", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80", rollNumber: "06", presentDays: 20, absentDays: 2, leaveDays: 0, workingDays: 22, percentage: 90.9 },
    { id: "7", name: "Meera Reddy", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80", rollNumber: "07", presentDays: 18, absentDays: 3, leaveDays: 1, workingDays: 22, percentage: 81.8 },
    { id: "8", name: "Arjun Rao", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80", rollNumber: "08", presentDays: 16, absentDays: 4, leaveDays: 2, workingDays: 22, percentage: 72.7 },
    { id: "9", name: "Sneha Nair", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80", rollNumber: "09", presentDays: 21, absentDays: 0, leaveDays: 1, workingDays: 22, percentage: 95.5 },
    { id: "10", name: "Aditya Joshi", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80", rollNumber: "10", presentDays: 12, absentDays: 8, leaveDays: 2, workingDays: 22, percentage: 54.5 },
    { id: "11", name: "Tanvi Bhat", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80", rollNumber: "11", presentDays: 20, absentDays: 1, leaveDays: 1, workingDays: 22, percentage: 90.9 },
    { id: "12", name: "Yash Choudhary", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80", rollNumber: "12", presentDays: 17, absentDays: 3, leaveDays: 2, workingDays: 22, percentage: 77.3 },
  ];

  const itemsPerPage = 5;

  // Filtered students based on selections (simulated)
  const [students, setStudents] = useState<Student[]>(allStudents.slice(0, itemsPerPage));

  // Simulate API fetch when filters change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      let filtered = [...allStudents];
      if (selectedClass === "Class 10") {
        filtered = filtered.map(s => ({
          ...s,
          rollNumber: `10-${s.rollNumber}`,
          presentDays: Math.max(10, s.presentDays - 2),
          absentDays: s.absentDays + 2,
          percentage: Math.round(((Math.max(10, s.presentDays - 2)) / 22) * 1000) / 10
        }));
      }
      if (selectedSection === "Section B") {
        filtered = filtered.reverse();
      }
      if (selectedMonth === "July 2026") {
        filtered = filtered.map(s => ({
          ...s,
          workingDays: 20,
          presentDays: Math.min(20, s.presentDays),
          percentage: Math.round((Math.min(20, s.presentDays) / 20) * 1000) / 10
        }));
      }

      setStudents(filtered);
      setCurrentPage(1);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [academicYear, selectedClass, selectedSection, selectedMonth]);

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Event Handlers
  const handleAcademicYearChange = (year: string) => {
    setAcademicYear(year);
    showToast(`Academic Year updated to ${year}`, 'info');
  };

  const handleClassChange = (className: string) => {
    setSelectedClass(className);
    showToast(`Class updated to ${className}`, 'info');
  };

  const handleSectionChange = (section: string) => {
    setSelectedSection(section);
    showToast(`Section updated to ${section}`, 'info');
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    showToast(`Month updated to ${month}`, 'info');
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    const maxPage = Math.ceil(students.length / itemsPerPage);
    if (currentPage < maxPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleNavigateToDailyView = () => {
    showToast("Navigating to Daily Attendance view...", "success");
  };

  const handleNavigateToMarkAttendance = () => {
    showToast("Opening Mark Attendance screen...", "success");
  };

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
  };

  const showToast = (message: string, type: 'success' | 'info') => {
    setToast({ message, type });
  };

  // Pagination slice
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = students.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900 flex flex-col relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-white border border-gray-200 px-4 py-3 rounded-xl shadow-lg animate-in fade-in slide-in-from-bottom-5 duration-300">
          <Icon
            icon={toast.type === 'success' ? "lucide:check-circle" : "lucide:info"}
            className={`w-5 h-5 ${toast.type === 'success' ? 'text-green-600' : 'text-blue-600'}`}
          />
          <span className="text-sm font-medium text-gray-900">{toast.message}</span>
          <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-700 ml-2">
            <Icon icon="lucide:x" className="w-4 h-4" />
          </button>
        </div>
      )}

      <main className="w-full p-5 md:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <Header
          title="Monthly Attendance"
          description="Monitor monthly attendance trends and identify students needing support."
          onDailyViewClick={handleNavigateToDailyView}
          onMarkAttendanceClick={handleNavigateToMarkAttendance}
        />

        {/* Filters Section */}
        <FiltersSection
          academicYear={academicYear}
          selectedClass={selectedClass}
          selectedSection={selectedSection}
          selectedMonth={selectedMonth}
          onAcademicYearChange={handleAcademicYearChange}
          onClassChange={handleClassChange}
          onSectionChange={handleSectionChange}
          onMonthChange={handleMonthChange}
          isLoading={isLoading}
        />

        {/* Main Attendance Table Section */}
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <AttendanceTable
            students={paginatedStudents}
            selectedClass={selectedClass}
            selectedSection={selectedSection}
            selectedMonth={selectedMonth}
            onStudentClick={handleStudentClick}
            isLoading={isLoading}
          />
          <Pagination
            totalItems={students.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
          />
        </section>
      </main>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-xl border border-gray-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-200 p-5">
              <h3 className="text-lg font-bold text-gray-900">Student Attendance Details</h3>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-gray-400 hover:text-gray-700 rounded-lg p-1 hover:bg-gray-100 transition-colors"
              >
                <Icon icon="lucide:x" className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <img
                  className="h-16 w-16 rounded-full object-cover border-2 border-blue-600"
                  src={selectedStudent.avatar}
                  alt={selectedStudent.name}
                />
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{selectedStudent.name}</h4>
                  <p className="text-sm text-gray-500">Roll Number: {selectedStudent.rollNumber}</p>
                  <p className="text-sm text-gray-500">{selectedClass} · {selectedSection}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-gray-50/50 p-3 rounded-lg">
                  <span className="block text-2xl font-bold text-green-600">{selectedStudent.presentDays}</span>
                  <span className="text-xs text-gray-500 font-medium">Present</span>
                </div>
                <div className="bg-gray-50/50 p-3 rounded-lg">
                  <span className="block text-2xl font-bold text-red-600">{selectedStudent.absentDays}</span>
                  <span className="text-xs text-gray-500 font-medium">Absent</span>
                </div>
                <div className="bg-gray-50/50 p-3 rounded-lg">
                  <span className="block text-2xl font-bold text-gray-900">{selectedStudent.leaveDays}</span>
                  <span className="text-xs text-gray-500 font-medium">Leave</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-500">Monthly Attendance Rate</span>
                  <span className={selectedStudent.percentage < 75 ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
                    {selectedStudent.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      selectedStudent.percentage < 75 ? 'bg-red-600' : 'bg-green-600'
                    }`}
                    style={{ width: `${selectedStudent.percentage}%` }}
                  ></div>
                </div>
                {selectedStudent.percentage < 75 && (
                  <div className="flex items-start gap-2 rounded-lg bg-yellow-50 p-3 text-xs text-yellow-800 border border-yellow-800/10 mt-2">
                    <Icon icon="lucide:alert-triangle" className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Critical Warning</span>
                      Attendance is below the required 75% threshold. Consider sending an automated notification to parents.
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-gray-50/30 border-t border-gray-200 p-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  showToast(`Notification sent to ${selectedStudent.name}'s parents.`, 'success');
                  setSelectedStudent(null);
                }}
                className="px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Notify Parents
              </button>
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyAttendance;