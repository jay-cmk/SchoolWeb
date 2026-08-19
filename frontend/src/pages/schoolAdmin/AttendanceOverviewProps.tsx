// ============================================
// 6. ATTENDANCE OVERVIEW COMPONENT (AttendanceOverview.tsx)
// ============================================

import React from 'react';

interface AttendanceOverviewProps {
  present: number;
  absent: number;
  onLeave: number;
}

const AttendanceOverview: React.FC<AttendanceOverviewProps> = ({ present, absent, onLeave }) => {
  const total = present + absent + onLeave;
  const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : '0';

  return (
    <article className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#15243B]">Attendance overview</h2>
            <p className="mt-1 text-sm text-[#6B7280]">Today’s verified registers</p>
          </div>
          <span className="rounded-full bg-[#E8F0FB] px-2 py-1 text-xs font-semibold text-[#1F5FAE]">
            {percentage}%
          </span>
        </div>
        <div className="mt-5 rounded-xl bg-[#E8F0FB] p-5 text-center">
          <p className="text-4xl font-bold text-[#15243B]">{percentage}%</p>
          <p className="mt-1 text-sm text-[#6B7280]">Attendance percentage</p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
            <div className="h-full rounded-full bg-[#10B981]" style={{ width: `${percentage}%` }}></div>
          </div>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3 text-center">
        <div className="p-2 rounded-lg bg-[#ECFDF5]">
          <p className="text-lg font-bold text-[#10B981]">{present}</p>
          <p className="text-xs text-[#6B7280]">Present</p>
        </div>
        <div className="p-2 rounded-lg bg-[#FEF2F2]">
          <p className="text-lg font-bold text-[#EF4444]">{absent}</p>
          <p className="text-xs text-[#6B7280]">Absent</p>
        </div>
        <div className="p-2 rounded-lg bg-[#E8F0FB]">
          <p className="text-lg font-bold text-[#1F5FAE]">{onLeave}</p>
          <p className="text-xs text-[#6B7280]">On Leave</p>
        </div>
      </div>
    </article>
  );
};

export default AttendanceOverview;
