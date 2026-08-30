// ============================================
// 3. DATA TABLE COMPONENT (DataTable.tsx)
// ============================================

import React from 'react';

interface ClassData {
  name: string;
  sections: string;
  students: string;
}

interface SectionData {
  name: string;
  className: string;
  teacher: string;
}

interface StudentData {
  name: string;
  rollNo: string;
  className: string;
  status: 'Active' | 'Graduated' | 'Registered' | 'Suspended';
}

interface SessionData {
  classes: ClassData[];
  sections: SectionData[];
  students: StudentData[];
}

interface DataTableProps {
  activeTab: string;
  session: SessionData;
}

const DataTable: React.FC<DataTableProps> = ({ activeTab, session }) => {
  if (activeTab === 'Classes') {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F9FAFB] text-xs uppercase text-[#6B7280]">
            <tr>
              <th className="px-5 py-3 font-semibold">Class Name</th>
              <th className="px-5 py-3 font-semibold">Sections</th>
              <th className="px-5 py-3 font-semibold">Students</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {session.classes.map((cls, idx) => (
              <tr key={idx} className="hover:bg-[#F9FAFB] transition-colors">
                <td className="px-5 py-4 font-semibold text-[#15243B]">{cls.name}</td>
                <td className="px-5 py-4 text-[#6B7280]">{cls.sections}</td>
                <td className="px-5 py-4 text-[#6B7280]">{cls.students}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (activeTab === 'Sections') {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F9FAFB] text-xs uppercase text-[#6B7280]">
            <tr>
              <th className="px-5 py-3 font-semibold">Section Name</th>
              <th className="px-5 py-3 font-semibold">Class</th>
              <th className="px-5 py-3 font-semibold">Class Teacher</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {session.sections.map((sec, idx) => (
              <tr key={idx} className="hover:bg-[#F9FAFB] transition-colors">
                <td className="px-5 py-4 font-semibold text-[#15243B]">{sec.name}</td>
                <td className="px-5 py-4 text-[#6B7280]">{sec.className}</td>
                <td className="px-5 py-4 text-[#6B7280]">{sec.teacher}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (activeTab === 'Students') {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F9FAFB] text-xs uppercase text-[#6B7280]">
            <tr>
              <th className="px-5 py-3 font-semibold">Student Name</th>
              <th className="px-5 py-3 font-semibold">Roll No</th>
              <th className="px-5 py-3 font-semibold">Class</th>
              <th className="px-5 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {session.students.map((student, idx) => (
              <tr key={idx} className="hover:bg-[#F9FAFB] transition-colors">
                <td className="px-5 py-4 font-semibold text-[#15243B]">{student.name}</td>
                <td className="px-5 py-4 text-[#6B7280]">{student.rollNo}</td>
                <td className="px-5 py-4 text-[#6B7280]">{student.className}</td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                      student.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : student.status === 'Graduated'
                        ? 'bg-blue-500/10 text-blue-600'
                        : student.status === 'Registered'
                        ? 'bg-amber-500/10 text-amber-600'
                        : 'bg-rose-500/10 text-rose-600'
                    }`}
                  >
                    {student.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
};

export default DataTable;
