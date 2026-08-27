import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- TYPES & INTERFACES ---

interface StudentInfo {
  name: string;
  admissionNo: string;
  class: string;
  section: string;
  avatar: string;
}

interface AttendanceStats {
  present: number;
  absent: number;
  leave: number;
  percentage: number;
}

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LEAVE' | 'HOLIDAY';

interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  remark?: string;
}

interface MonthYear {
  month: number; // 0-11
  year: number;
  name: string;
}

// --- HELPER FUNCTIONS ---

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOffset = (year: number, month: number): number => {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
};

const formatDateString = (year: number, month: number, day: number): string => {
  const mm = String(month + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
};

// --- SUB-COMPONENTS ---

// 1. Header Component
interface HeaderProps {
  onClose: () => void;
}

const Header: React.FC<HeaderProps> = ({ onClose }) => {
  return (
    <div className="flex items-start justify-between border-b border-gray-200 p-5">
      <div>
        <p className="text-sm text-gray-500">
          Attendance <span className="mx-1">/</span> Student Details
        </p>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">
          Student Attendance Details
        </h1>
      </div>
      <button
        onClick={onClose}
        className="min-h-11 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer"
      >
        <Icon icon="lucide:x" className="text-base" /> Close
      </button>
    </div>
  );
};

// 2. StudentProfileHeader Component
interface StudentProfileHeaderProps {
  student: StudentInfo;
  attendancePercentage: number;
}

const StudentProfileHeader: React.FC<StudentProfileHeaderProps> = ({ student, attendancePercentage }) => {
  const isBelowThreshold = attendancePercentage < 75;

  return (
    <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center">
      <img
        className="h-16 w-16 rounded-full object-cover border border-gray-200"
        src={student.avatar}
        alt={student.name}
      />
      <div className="flex-1">
        <h2 className="text-lg font-bold text-gray-900">{student.name}</h2>
        <p className="mt-1 text-sm text-gray-500">Admission No. {student.admissionNo}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
            {student.class}
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
            {student.section}
          </span>
          {isBelowThreshold && (
            <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-800 flex items-center gap-1 border border-yellow-800/10">
              <Icon icon="lucide:alert-triangle" className="w-3.5 h-3.5" />
              Attendance below 75%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// 3. StatsGrid Component
interface StatsGridProps {
  stats: AttendanceStats;
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 transition-all hover:shadow-sm">
        <p className="text-xs text-gray-500 font-medium">Present Days</p>
        <p className="mt-2 text-2xl font-bold text-green-600">{stats.present}</p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 transition-all hover:shadow-sm">
        <p className="text-xs text-gray-500 font-medium">Absent Days</p>
        <p className="mt-2 text-2xl font-bold text-red-600">{stats.absent}</p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 transition-all hover:shadow-sm">
        <p className="text-xs text-gray-500 font-medium">Leave Days</p>
        <p className="mt-2 text-2xl font-bold text-gray-900">{stats.leave}</p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 transition-all hover:shadow-sm">
        <p className="text-xs text-gray-500 font-medium">Attendance Percentage</p>
        <p className="mt-2 text-2xl font-bold text-gray-900">
          {stats.percentage.toFixed(1)}%
        </p>
      </div>
    </div>
  );
};

// 4. CalendarDay Component
interface CalendarDayProps {
  dayNumber: number | null;
  status?: AttendanceStatus;
  onClick?: () => void;
  isSelected?: boolean;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ dayNumber, status, onClick, isSelected }) => {
  if (dayNumber === null) {
    return <span className="py-3"></span>;
  }

  let statusClasses = 'bg-gray-100 text-gray-500';

  if (status === 'PRESENT') {
    statusClasses = 'bg-green-600 text-white font-semibold';
  } else if (status === 'ABSENT') {
    statusClasses = 'bg-red-600 text-white font-semibold';
  } else if (status === 'LEAVE') {
    statusClasses = 'bg-yellow-500 text-yellow-900 font-semibold';
  }

  return (
    <button
      onClick={onClick}
      className={twMerge(
        clsx(
          'rounded-lg py-3 text-center text-xs transition-all cursor-pointer hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500/50',
          statusClasses,
          isSelected && 'ring-4 ring-blue-600 ring-offset-2'
        )
      )}
    >
      {dayNumber}
    </button>
  );
};

// 5. AttendanceCalendar Component
interface AttendanceCalendarProps {
  currentMonth: MonthYear;
  records: AttendanceRecord[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDayClick: (day: number) => void;
  selectedDay: number | null;
}

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({
  currentMonth,
  records,
  onPrevMonth,
  onNextMonth,
  onDayClick,
  selectedDay,
}) => {
  const daysInMonth = getDaysInMonth(currentMonth.year, currentMonth.month);
  const offset = getFirstDayOffset(currentMonth.year, currentMonth.month);

  // Create grid cells
  const cells: (number | null)[] = [];
  for (let i = 0; i < offset; i++) {
    cells.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push(i);
  }

  // Helper to find status for a specific day
  const getDayStatus = (day: number): AttendanceStatus => {
    const dateStr = formatDateString(currentMonth.year, currentMonth.month, day);
    const record = records.find((r) => r.date === dateStr);
    if (record) return record.status;

    // Default weekends to HOLIDAY
    const dayOfWeek = new Date(currentMonth.year, currentMonth.month, day).getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return 'HOLIDAY';
    }
    return 'PRESENT'; // Default weekday to PRESENT if no record exists
  };

  return (
    <div className="mt-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-900">
              {currentMonth.name}
            </h2>
            <div className="flex gap-1">
              <button
                onClick={onPrevMonth}
                className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer"
                title="Previous Month"
              >
                <Icon icon="lucide:chevron-left" className="w-4 h-4" />
              </button>
              <button
                onClick={onNextMonth}
                className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer"
                title="Next Month"
              >
                <Icon icon="lucide:chevron-right" className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500">Daily attendance calendar</p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-gray-700 font-medium">
            <i className="h-3 w-3 rounded-full bg-green-600 inline-block"></i>Present
          </span>
          <span className="flex items-center gap-1.5 text-gray-700 font-medium">
            <i className="h-3 w-3 rounded-full bg-red-600 inline-block"></i>Absent
          </span>
          <span className="flex items-center gap-1.5 text-gray-700 font-medium">
            <i className="h-3 w-3 rounded-full bg-yellow-500 inline-block"></i>Leave
          </span>
          <span className="flex items-center gap-1.5 text-gray-700 font-medium">
            <i className="h-3 w-3 rounded-full bg-gray-300 inline-block"></i>Holiday
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs">
        <span className="py-2 font-semibold text-gray-500">Mon</span>
        <span className="py-2 font-semibold text-gray-500">Tue</span>
        <span className="py-2 font-semibold text-gray-500">Wed</span>
        <span className="py-2 font-semibold text-gray-500">Thu</span>
        <span className="py-2 font-semibold text-gray-500">Fri</span>
        <span className="py-2 font-semibold text-gray-500">Sat</span>
        <span className="py-2 font-semibold text-gray-500">Sun</span>

        {cells.map((day, index) => (
          <CalendarDay
            key={index}
            dayNumber={day}
            status={day ? getDayStatus(day) : undefined}
            isSelected={day !== null && selectedDay === day}
            onClick={day ? () => onDayClick(day) : undefined}
          />
        ))}
      </div>
    </div>
  );
};

// 6. RecordFieldsFooter Component
const RecordFieldsFooter: React.FC = () => {
  return (
    <div className="mt-7 rounded-xl border border-gray-200 bg-gray-50 p-4">
      <h3 className="font-bold text-gray-900">Attendance record fields</h3>
      <p className="mt-1 text-sm text-gray-500 font-mono text-xs overflow-x-auto whitespace-nowrap">
        academicSessionId · classId · sectionId · date · studentId · status (PRESENT, ABSENT, LEAVE) · remark
      </p>
    </div>
  );
};

// 7. DayDetailModal Component (Interactive addition to view/edit remarks & status)
interface DayDetailModalProps {
  day: number;
  currentMonth: MonthYear;
  record?: AttendanceRecord;
  onClose: () => void;
  onSave: (status: AttendanceStatus, remark: string) => void;
}

const DayDetailModal: React.FC<DayDetailModalProps> = ({
  day,
  currentMonth,
  record,
  onClose,
  onSave,
}) => {
  const [status, setStatus] = useState<AttendanceStatus>(record?.status || 'PRESENT');
  const [remark, setRemark] = useState<string>(record?.remark || '');

  const dateStr = formatDateString(currentMonth.year, currentMonth.month, day);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(status, remark);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <h3 className="text-lg font-bold text-gray-900">
            Edit Attendance: {day} {currentMonth.name.split(' ')[0]}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <Icon icon="lucide:x" className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">
              Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['PRESENT', 'ABSENT', 'LEAVE', 'HOLIDAY'] as AttendanceStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={twMerge(
                    clsx(
                      'py-2 px-3 rounded-lg border text-sm font-medium transition-all cursor-pointer text-center',
                      status === s
                        ? s === 'PRESENT'
                          ? 'bg-green-600 text-white border-green-600'
                          : s === 'ABSENT'
                          ? 'bg-red-600 text-white border-red-600'
                          : s === 'LEAVE'
                          ? 'bg-yellow-500 text-yellow-900 border-yellow-500'
                          : 'bg-gray-200 text-gray-500 border-gray-300'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    )
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="remark" className="block text-sm font-medium text-gray-500 mb-1">
              Remarks / Notes
            </label>
            <textarea
              id="remark"
              rows={3}
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Enter reason for absence, leave details, or general remarks..."
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

const StudentAttendanceDetails: React.FC = () => {
  // 1. Student Info State
  const [studentInfo] = useState<StudentInfo>({
    name: 'Diya Sharma',
    admissionNo: 'ADM-26042',
    class: 'Class 6',
    section: 'Section A',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120',
  });

  // 2. Current Month State (Initialized to August 2026)
  const [currentMonth, setCurrentMonth] = useState<MonthYear>({
    month: 7, // August (0-indexed)
    year: 2026,
    name: 'August 2026',
  });

  // 3. Attendance Records State (Pre-populated to match the HTML calendar)
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
    { date: '2026-08-01', status: 'PRESENT' },
    { date: '2026-08-02', status: 'HOLIDAY', remark: 'Sunday' },
    { date: '2026-08-03', status: 'HOLIDAY', remark: 'School Holiday' },
    { date: '2026-08-04', status: 'PRESENT' },
    { date: '2026-08-05', status: 'PRESENT' },
    { date: '2026-08-06', status: 'PRESENT' },
    { date: '2026-08-07', status: 'ABSENT', remark: 'Unexcused absence' },
    { date: '2026-08-08', status: 'PRESENT' },
    { date: '2026-08-09', status: 'HOLIDAY', remark: 'Sunday' },
    { date: '2026-08-10', status: 'HOLIDAY', remark: 'Raksha Bandhan' },
    { date: '2026-08-11', status: 'PRESENT' },
    { date: '2026-08-12', status: 'PRESENT' },
    { date: '2026-08-13', status: 'LEAVE', remark: 'Family function' },
    { date: '2026-08-14', status: 'PRESENT' },
    { date: '2026-08-15', status: 'PRESENT' },
    { date: '2026-08-16', status: 'HOLIDAY', remark: 'Sunday' },
    { date: '2026-08-17', status: 'HOLIDAY', remark: 'Janmashtami' },
    { date: '2026-08-18', status: 'PRESENT' },
    { date: '2026-08-19', status: 'ABSENT', remark: 'Sick leave without application' },
    { date: '2026-08-20', status: 'PRESENT' },
    { date: '2026-08-21', status: 'PRESENT' },
    { date: '2026-08-22', status: 'PRESENT' },
    { date: '2026-08-23', status: 'HOLIDAY', remark: 'Sunday' },
    { date: '2026-08-24', status: 'HOLIDAY', remark: 'Local Holiday' },
    { date: '2026-08-25', status: 'PRESENT' },
    { date: '2026-08-26', status: 'PRESENT' },
    { date: '2026-08-27', status: 'ABSENT', remark: 'Missed school bus' },
    { date: '2026-08-28', status: 'PRESENT' },
    { date: '2026-08-29', status: 'PRESENT' },
    { date: '2026-08-30', status: 'HOLIDAY', remark: 'Sunday' },
    { date: '2026-08-31', status: 'HOLIDAY', remark: 'Teacher Training Day' },
  ]);

  // 4. Selected Day State (for modal view/edit)
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // 5. Dynamic Attendance Stats Calculation
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats>({
    present: 15,
    absent: 5,
    leave: 2,
    percentage: 68.2,
  });

  // Recalculate stats whenever records or current month changes
  useEffect(() => {
    const currentMonthPrefix = `${currentMonth.year}-${String(currentMonth.month + 1).padStart(2, '0')}`;
    const monthlyRecords = attendanceRecords.filter((r) => r.date.startsWith(currentMonthPrefix));

    let present = 0;
    let absent = 0;
    let leave = 0;

    monthlyRecords.forEach((r) => {
      if (r.status === 'PRESENT') present++;
      else if (r.status === 'ABSENT') absent++;
      else if (r.status === 'LEAVE') leave++;
    });

    const totalActiveDays = present + absent + leave;
    const percentage = totalActiveDays > 0 ? (present / totalActiveDays) * 100 : 100;

    setAttendanceStats({
      present,
      absent,
      leave,
      percentage,
    });
  }, [attendanceRecords, currentMonth]);

  // --- EVENT HANDLERS ---

  const handleClose = () => {
    alert('Closing student details view. Navigating back to main attendance list...');
  };

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => {
      let newMonth = prev.month - 1;
      let newYear = prev.year;
      if (newMonth < 0) {
        newMonth = 11;
        newYear -= 1;
      }
      return {
        month: newMonth,
        year: newYear,
        name: `${MONTH_NAMES[newMonth]} ${newYear}`,
      };
    });
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      let newMonth = prev.month + 1;
      let newYear = prev.year;
      if (newMonth > 11) {
        newMonth = 0;
        newYear += 1;
      }
      return {
        month: newMonth,
        year: newYear,
        name: `${MONTH_NAMES[newMonth]} ${newYear}`,
      };
    });
    setSelectedDay(null);
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
  };

  const handleSaveRecord = (status: AttendanceStatus, remark: string) => {
    if (selectedDay === null) return;

    const dateStr = formatDateString(currentMonth.year, currentMonth.month, selectedDay);
    setAttendanceRecords((prev) => {
      const existingIndex = prev.findIndex((r) => r.date === dateStr);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = { date: dateStr, status, remark };
        return updated;
      } else {
        return [...prev, { date: dateStr, status, remark }];
      }
    });

    setSelectedDay(null);
  };

  // Find record for currently selected day
  const selectedRecord = selectedDay
    ? attendanceRecords.find(
        (r) => r.date === formatDateString(currentMonth.year, currentMonth.month, selectedDay)
      )
    : undefined;

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col relative">
      <main className="w-full p-5 md:p-8">
        <section className="mx-auto max-w-5xl rounded-xl border border-gray-200 bg-white shadow-md overflow-hidden">
          {/* Header */}
          <Header onClose={handleClose} />

          <div className="p-5 md:p-6">
            {/* Student Profile Header */}
            <StudentProfileHeader
              student={studentInfo}
              attendancePercentage={attendanceStats.percentage}
            />

            {/* Stats Grid */}
            <StatsGrid stats={attendanceStats} />

            {/* Attendance Calendar */}
            <AttendanceCalendar
              currentMonth={currentMonth}
              records={attendanceRecords}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onDayClick={handleDayClick}
              selectedDay={selectedDay}
            />

            {/* Record Fields Footer */}
            <RecordFieldsFooter />
          </div>
        </section>
      </main>

      {/* Interactive Day Detail Modal */}
      {selectedDay !== null && (
        <DayDetailModal
          day={selectedDay}
          currentMonth={currentMonth}
          record={selectedRecord}
          onClose={() => setSelectedDay(null)}
          onSave={handleSaveRecord}
        />
      )}
    </div>
  );
};

export default StudentAttendanceDetails;