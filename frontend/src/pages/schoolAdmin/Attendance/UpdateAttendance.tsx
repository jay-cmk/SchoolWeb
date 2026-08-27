import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

// ==========================================
// TYPES & INTERFACES
// ==========================================

export interface Student {
  id: string;
  name: string;
  avatar: string;
  admissionNo: string;
  rollNo: string;
  status: 'Present' | 'Absent' | 'Leave';
  remark: string;
}

interface BreadcrumbsProps {
  onBack: () => void;
}

interface WarningBannerProps {
  className?: string;
}

interface ClassMetadataCardProps {
  className?: string;
}

interface StudentAttendanceTableProps {
  students: Student[];
  onStatusChange: (id: string, status: 'Present' | 'Absent' | 'Leave') => void;
  onRemarkChange: (id: string, remark: string) => void;
  onMarkAllPresent: () => void;
  onCancel: () => void;
  onUpdate: () => void;
  changedCount: number;
}

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

interface NotificationToastProps {
  status: 'idle' | 'saving' | 'error' | 'success';
  onRetry: () => void;
  onClose: () => void;
}

// ==========================================
// INITIAL DATA
// ==========================================

const INITIAL_STUDENTS: Student[] = [
  {
    id: '1',
    name: 'Aarav Mehta',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    admissionNo: 'ADM-26041',
    rollNo: '01',
    status: 'Present',
    remark: '',
  },
  {
    id: '2',
    name: 'Diya Sharma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    admissionNo: 'ADM-26042',
    rollNo: '02',
    status: 'Absent',
    remark: 'Sick',
  },
  {
    id: '3',
    name: 'Kabir Malhotra',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    admissionNo: 'ADM-26043',
    rollNo: '03',
    status: 'Present',
    remark: '',
  },
  {
    id: '4',
    name: 'Ananya Iyer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    admissionNo: 'ADM-26044',
    rollNo: '04',
    status: 'Leave',
    remark: 'Family function',
  },
  {
    id: '5',
    name: 'Rohan Gupta',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    admissionNo: 'ADM-26045',
    rollNo: '05',
    status: 'Present',
    remark: '',
  },
];

// ==========================================
// SUB-COMPONENTS
// ==========================================

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
      <div>
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <span>Attendance</span>
          <Icon icon="lucide:chevron-right" className="w-3 h-3 text-gray-400" />
          <span>Daily Attendance</span>
          <Icon icon="lucide:chevron-right" className="w-3 h-3 text-gray-400" />
          <span className="text-gray-900 font-medium">Update</span>
        </p>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Update Attendance</h1>
        <p className="mt-1 text-sm text-gray-500">
          Review changes carefully before updating the existing class record.
        </p>
      </div>
      <button
        onClick={onBack}
        className="min-h-11 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 self-start md:self-auto"
      >
        <Icon icon="lucide:arrow-left" className="w-4 h-4" />
        Back to Daily View
      </button>
    </div>
  );
};

const WarningBanner: React.FC<WarningBannerProps> = ({ className = '' }) => {
  return (
    <section className={`rounded-xl border border-yellow-200 bg-yellow-50 p-4 ${className}`}>
      <div className="flex gap-3">
        <Icon icon="lucide:alert-triangle" className="mt-0.5 text-xl text-yellow-600 shrink-0" />
        <div>
          <p className="font-semibold text-yellow-800">Attendance has already been recorded for this date.</p>
          <p className="mt-1 text-sm text-yellow-700">
            Editing this record will replace the saved statuses for Class 6, Section A on 25 Aug 2026.
          </p>
        </div>
      </div>
    </section>
  );
};

const ClassMetadataCard: React.FC<ClassMetadataCardProps> = ({ className = '' }) => {
  return (
    <section className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm ${className}`}>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div>
          <p className="text-xs text-gray-500">Academic Year</p>
          <p className="mt-1 font-semibold text-gray-900">2026-2027</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Class & Section</p>
          <p className="mt-1 font-semibold text-gray-900">Class 6 · A</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Attendance Date</p>
          <p className="mt-1 font-semibold text-gray-900">25 Aug 2026</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Last Updated</p>
          <p className="mt-1 font-semibold text-gray-900">09:42 AM today</p>
        </div>
      </div>
    </section>
  );
};

const StudentAttendanceTable: React.FC<StudentAttendanceTableProps> = ({
  students,
  onStatusChange,
  onRemarkChange,
  onMarkAllPresent,
  onCancel,
  onUpdate,
  changedCount,
}) => {
  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 p-5">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Student Statuses</h2>
          <p className="text-sm text-gray-500">
            {changedCount} {changedCount === 1 ? 'student' : 'students'} changed of {students.length} total
          </p>
        </div>
        <button
          onClick={onMarkAllPresent}
          className="min-h-11 rounded-lg bg-green-600 hover:bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2"
        >
          <Icon icon="lucide:check-check" className="w-4 h-4" />
          Mark All Present
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-gray-50/50 text-xs uppercase text-gray-500 border-b border-gray-200">
            <tr>
              <th className="px-5 py-3.5 font-semibold">Student</th>
              <th className="px-4 py-3.5 font-semibold">Admission No.</th>
              <th className="px-4 py-3.5 font-semibold">Roll No.</th>
              <th className="px-4 py-3.5 font-semibold">Status</th>
              <th className="px-4 py-3.5 font-semibold">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50/20 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3 font-semibold text-gray-900">
                    <img
                      className="h-9 w-9 rounded-full object-cover border border-gray-200"
                      src={student.avatar}
                      alt={student.name}
                    />
                    <span>{student.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-gray-500 font-mono text-xs">
                  {student.admissionNo}
                </td>
                <td className="px-4 py-4 text-gray-900 font-medium">
                  {student.rollNo}
                </td>
                <td className="px-4 py-4">
                  <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-100/30">
                    <button
                      onClick={() => onStatusChange(student.id, 'Present')}
                      className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                        student.status === 'Present'
                          ? 'bg-green-600 text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      Present
                    </button>
                    <button
                      onClick={() => onStatusChange(student.id, 'Absent')}
                      className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                        student.status === 'Absent'
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      Absent
                    </button>
                    <button
                      onClick={() => onStatusChange(student.id, 'Leave')}
                      className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                        student.status === 'Leave'
                          ? 'bg-yellow-500 text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      Leave
                    </button>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="relative flex items-center max-w-xs">
                    <input
                      type="text"
                      placeholder="Optional remark"
                      value={student.remark}
                      onChange={(e) => onRemarkChange(student.id, e.target.value)}
                      className="w-full min-h-10 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    {student.remark && (
                      <button
                        onClick={() => onRemarkChange(student.id, '')}
                        className="absolute right-2.5 text-gray-400 hover:text-gray-700"
                      >
                        <Icon icon="lucide:x" className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-gray-200 p-5 sm:flex-row sm:justify-end">
        <button
          onClick={onCancel}
          className="min-h-11 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel Changes
        </button>
        <button
          onClick={onUpdate}
          className="min-h-11 rounded-lg bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors shadow-sm"
        >
          Update Attendance
        </button>
      </div>
    </section>
  );
};

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl animate-scale-up">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <Icon icon="lucide:x" className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-yellow-50 text-yellow-600 shrink-0">
            <Icon icon="lucide:alert-triangle" className="text-2xl" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Update Attendance?</h2>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
              Attendance has already been recorded for this class and date. Overwriting this will update the records permanently. Do you want to proceed?
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="min-h-11 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="min-h-11 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors shadow-sm"
          >
            Confirm Update
          </button>
        </div>
      </div>
    </div>
  );
};

const NotificationToast: React.FC<NotificationToastProps> = ({
  status,
  onRetry,
  onClose,
}) => {
  if (status === 'idle') return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-full sm:w-auto animate-slide-up">
      {status === 'saving' && (
        <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 shadow-lg">
          <Icon icon="lucide:loader-2" className="w-5 h-5 animate-spin text-blue-600" />
          <span className="font-medium">Saving attendance updates...</span>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 shadow-lg">
          <div className="flex items-center gap-3">
            <Icon icon="lucide:x-circle" className="w-5 h-5 text-red-600 shrink-0" />
            <span className="font-medium">Unable to save attendance.</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onRetry}
              className="font-semibold text-red-600 hover:text-red-700 underline underline-offset-2"
            >
              Retry
            </button>
            <button onClick={onClose} className="text-red-600 hover:text-red-700">
              <Icon icon="lucide:x" className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {status === 'success' && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800 shadow-lg">
          <div className="flex items-center gap-3">
            <Icon icon="lucide:check-circle" className="w-5 h-5 text-green-600 shrink-0" />
            <span className="font-medium">Attendance updated successfully!</span>
          </div>
          <button onClick={onClose} className="text-green-600 hover:text-green-700">
            <Icon icon="lucide:x" className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================

const UpdateAttendance: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'error' | 'success'>('idle');

  // Calculate how many students have changed from initial values
  const getChangedCount = () => {
    return students.filter((student) => {
      const initial = INITIAL_STUDENTS.find((s) => s.id === student.id);
      if (!initial) return false;
      return student.status !== initial.status || student.remark !== initial.remark;
    }).length;
  };

  const handleStatusChange = (id: string, status: 'Present' | 'Absent' | 'Leave') => {
    setStudents((prev) =>
      prev.map((student) => (student.id === id ? { ...student, status } : student))
    );
  };

  const handleRemarkChange = (id: string, remark: string) => {
    setStudents((prev) =>
      prev.map((student) => (student.id === id ? { ...student, remark } : student))
    );
  };

  const handleMarkAllPresent = () => {
    setStudents((prev) => prev.map((student) => ({ ...student, status: 'Present' })));
  };

  const handleCancelChanges = () => {
    setStudents(INITIAL_STUDENTS);
  };

  const handleUpdateClick = () => {
    setIsConfirmationOpen(true);
  };

  const executeSave = () => {
    setSaveStatus('saving');
    // Simulate API call
    setTimeout(() => {
      // 85% success rate simulation
      const isSuccess = Math.random() > 0.15;
      if (isSuccess) {
        setSaveStatus('success');
        // Auto-hide success toast after 3 seconds
        setTimeout(() => {
          setSaveStatus('idle');
        }, 3000);
      } else {
        setSaveStatus('error');
      }
    }, 1500);
  };

  const handleConfirmUpdate = () => {
    setIsConfirmationOpen(false);
    executeSave();
  };

  const handleRetrySave = () => {
    executeSave();
  };

  const handleBackToDailyView = () => {
    alert('Navigating back to Daily View...');
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900 flex flex-col relative">
      <main className="w-full max-w-7xl mx-auto p-5 md:p-8 space-y-6">
        {/* Breadcrumbs & Header */}
        <Breadcrumbs onBack={handleBackToDailyView} />

        {/* Warning Banner */}
        <WarningBanner />

        {/* Class Metadata Card */}
        <ClassMetadataCard />

        {/* Student Attendance Table */}
        <StudentAttendanceTable
          students={students}
          onStatusChange={handleStatusChange}
          onRemarkChange={handleRemarkChange}
          onMarkAllPresent={handleMarkAllPresent}
          onCancel={handleCancelChanges}
          onUpdate={handleUpdateClick}
          changedCount={getChangedCount()}
        />
      </main>

      {/* Confirmation Dialog Modal */}
      <ConfirmationDialog
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={handleConfirmUpdate}
      />

      {/* Notification Toast */}
      <NotificationToast
        status={saveStatus}
        onRetry={handleRetrySave}
        onClose={() => setSaveStatus('idle')}
      />
    </div>
  );
};

export default UpdateAttendance;