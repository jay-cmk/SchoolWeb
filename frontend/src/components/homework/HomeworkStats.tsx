import React from "react";
import { Icon } from "@iconify/react";
import type { HomeworkStats as HomeworkStatsType } from "../../features/homework/homework.types";

interface HomeworkStatsProps {
  stats: HomeworkStatsType | null;
  pendingSubmissions?: number;
}

const HomeworkStats: React.FC<HomeworkStatsProps> = ({ stats, pendingSubmissions = 0 }) => {
  const cards = [
    { label: "Total Homework", value: stats?.total ?? 0, icon: "lucide:book-open", hint: "All homework records" },
    { label: "Active Homework", value: stats?.active ?? 0, icon: "lucide:activity", hint: "Currently published" },
    { label: "Pending Submissions", value: pendingSubmissions, icon: "lucide:clock-3", hint: "Awaiting student work" },
    { label: "Overdue Homework", value: stats?.overdue ?? 0, icon: "lucide:circle-alert", hint: "Needs follow-up" },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{card.value}</p>
              <p className="mt-2 text-xs text-slate-500">{card.hint}</p>
            </div>
            <span className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Icon icon={card.icon} className="h-5 w-5" />
            </span>
          </div>
        </div>
      ))}
    </section>
  );
};

export default HomeworkStats;
