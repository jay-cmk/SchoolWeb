import React, { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import type { Homework } from "../../features/homework/homework.types";

interface HomeworkCalendarProps { homeworks: Homework[]; onView: (id: string) => void; }
const labelOf = (v: any) => typeof v === "string" ? v : v?.name ?? "";
const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;

const HomeworkCalendar: React.FC<HomeworkCalendarProps> = ({ homeworks, onView }) => {
  const [month, setMonth] = useState(() => new Date());
  const cells = useMemo(() => {
    const y = month.getFullYear(), m = month.getMonth();
    const first = new Date(y, m, 1).getDay();
    const count = new Date(y, m + 1, 0).getDate();
    return Array.from({ length: 42 }, (_, i) => new Date(y, m, i - first + 1));
  }, [month]);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 p-5">
        <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth()-1, 1))} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><Icon icon="lucide:chevron-left" className="h-5 w-5" /></button>
        <div className="text-center"><h2 className="text-lg font-semibold text-slate-900">{month.toLocaleDateString(undefined,{month:"long",year:"numeric"})}</h2><p className="text-xs text-slate-500">Assigned and due dates</p></div>
        <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth()+1, 1))} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><Icon icon="lucide:chevron-right" className="h-5 w-5" /></button>
      </div>
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-xs font-semibold uppercase text-slate-500">{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <div key={d} className="p-3">{d}</div>)}</div>
      <div className="grid grid-cols-7">
        {cells.map((d, i) => {
          const current = d.getMonth() === month.getMonth();
          const key = dateKey(d);
          const items = homeworks.filter(h => h.assignedDate.slice(0,10) === key || h.dueDate.slice(0,10) === key);
          return <div key={i} className={`min-h-28 border-b border-r border-slate-100 p-2 ${current ? "bg-white" : "bg-slate-50 text-slate-400"}`}>
            <span className="text-xs font-semibold">{d.getDate()}</span>
            <div className="mt-2 space-y-1">
              {items.slice(0,3).map(h => {
                const isDue = h.dueDate.slice(0,10) === key;
                const overdue = isDue && h.status === "PUBLISHED" && new Date(h.dueDate).getTime() < Date.now();
                return <button key={`${h._id}-${isDue}`} onClick={() => onView(h._id)} title={`${h.title} · ${labelOf(h.subjectId)}`} className={`block w-full truncate rounded-md px-2 py-1 text-left text-[11px] font-semibold ${overdue ? "bg-red-50 text-red-700" : isDue ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700"}`}>{isDue ? "Due" : "Assigned"} · {h.title}</button>
              })}
            </div>
          </div>;
        })}
      </div>
    </section>
  );
};

export default HomeworkCalendar;
