import React from "react";
import { Icon } from "@iconify/react";
import type { Homework } from "../../features/homework/homework.types";

const labelOf = (value: any) => typeof value === "string" ? value : value?.name ?? value?.sessionName ?? value?.title ?? "—";

const uiStatus = (homework: Homework) => {
  if (homework.status === "DRAFT") return "Draft";
  if (homework.status === "CLOSED") return "Completed";
  return new Date(homework.dueDate).getTime() < Date.now() ? "Overdue" : "Active";
};

interface HomeworkTableProps {
  homeworks: Homework[];
  onView: (id: string) => void;
  onSubmissions: (id: string) => void;
  onDelete: (id: string) => void;
}

const HomeworkTable: React.FC<HomeworkTableProps> = ({ homeworks, onView, onSubmissions, onDelete }) => {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[1180px] w-full text-left">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-4">Homework Title</th><th className="px-4 py-4">Subject</th><th className="px-4 py-4">Class</th><th className="px-4 py-4">Section</th><th className="px-4 py-4">Teacher</th><th className="px-4 py-4">Assigned Date</th><th className="px-4 py-4">Due Date</th><th className="px-4 py-4">Status</th><th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {homeworks.map((h) => {
              const status = uiStatus(h);
              const badge = status === "Overdue" ? "bg-red-50 text-red-700" : status === "Draft" ? "bg-slate-100 text-slate-600" : status === "Completed" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700";
              return (
                <tr key={h._id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-4"><button onClick={() => onView(h._id)} className="font-semibold text-slate-900 hover:text-blue-600">{h.title}</button></td>
                  <td className="px-4 py-4 text-slate-600">{labelOf(h.subjectId)}</td>
                  <td className="px-4 py-4 text-slate-600">{labelOf(h.classId)}</td>
                  <td className="px-4 py-4 text-slate-600">{labelOf(h.sectionId)}</td>
                  <td className="px-4 py-4 text-slate-600">{labelOf(h.teacherId)}</td>
                  <td className="px-4 py-4 text-slate-600">{new Date(h.assignedDate).toLocaleDateString()}</td>
                  <td className="px-4 py-4 text-slate-600">{new Date(h.dueDate).toLocaleDateString()}</td>
                  <td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badge}`}>{status}</span></td>
                  <td className="px-5 py-4"><div className="flex justify-end gap-2">
                    <button onClick={() => onView(h._id)} title="View" className="rounded-lg border border-slate-200 p-2 text-blue-600 hover:bg-blue-50"><Icon icon="lucide:eye" className="h-4 w-4" /></button>
                    <button onClick={() => onSubmissions(h._id)} title="Submissions" className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"><Icon icon="lucide:users" className="h-4 w-4" /></button>
                    <button onClick={() => onDelete(h._id)} title="Delete" className="rounded-lg border border-slate-200 p-2 text-red-600 hover:bg-red-50"><Icon icon="lucide:trash-2" className="h-4 w-4" /></button>
                  </div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default HomeworkTable;
