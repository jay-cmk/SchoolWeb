// import React from "react";
// import { Icon } from "@iconify/react";
// import type { HomeworkFilters as ApiFilters, HomeworkStatus } from "../../features/homework/homework.types";

// export interface FilterOption { value: string; label: string; }

// interface HomeworkFiltersProps {
//   filters: ApiFilters;
//   sessions?: FilterOption[];
//   classes?: FilterOption[];
//   sections?: FilterOption[];
//   subjects?: FilterOption[];
//   teachers?: FilterOption[];
//   onChange: (filters: ApiFilters) => void;
//   onReset: () => void;
// }

// const HomeworkFilters: React.FC<HomeworkFiltersProps> = ({
//   filters, sessions = [], classes = [], sections = [], subjects = [], teachers = [], onChange, onReset,
// }) => {
//   const set = (key: keyof ApiFilters, value: string | number | undefined) => onChange({ ...filters, [key]: value || undefined, page: 1 });

//   const selectClass = "min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

//   return (
//     <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//       <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//         <div>
//           <h2 className="text-base font-semibold text-slate-900">Filters</h2>
//           <p className="mt-1 text-sm text-slate-500">Narrow homework by academic and assignment details.</p>
//         </div>
//         <button onClick={onReset} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
//           <Icon icon="lucide:rotate-ccw" className="h-4 w-4" /> Reset Filters
//         </button>
//       </div>

//       <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//         <Select label="Academic Year" value={filters.sessionId ?? ""} options={sessions} onChange={(v) => set("sessionId", v)} className={selectClass} />
//         <Select label="Class" value={filters.classId ?? ""} options={classes} onChange={(v) => set("classId", v)} className={selectClass} />
//         <Select label="Section" value={filters.sectionId ?? ""} options={sections} onChange={(v) => set("sectionId", v)} className={selectClass} />
//         <Select label="Subject" value={filters.subjectId ?? ""} options={subjects} onChange={(v) => set("subjectId", v)} className={selectClass} />
//         <Select label="Teacher" value={filters.teacherId ?? ""} options={teachers} onChange={(v) => set("teacherId", v)} className={selectClass} />
//         <Select label="Status" value={filters.status ?? ""} options={[{value:"DRAFT",label:"Draft"},{value:"PUBLISHED",label:"Published"},{value:"CLOSED",label:"Closed"}]} onChange={(v) => set("status", (v || undefined) as HomeworkStatus | undefined)} className={selectClass} />
//         <label className="space-y-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">From Date<input type="date" value={filters.fromDate ?? ""} onChange={(e) => set("fromDate", e.target.value)} className={selectClass} /></label>
//         <label className="space-y-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">To Date<input type="date" value={filters.toDate ?? ""} onChange={(e) => set("toDate", e.target.value)} className={selectClass} /></label>
//       </div>

//       <div className="relative mt-4">
//         <Icon icon="lucide:search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//         <input value={filters.search ?? ""} onChange={(e) => set("search", e.target.value)} placeholder="Search homework title..." className="min-h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
//       </div>
//     </section>
//   );
// };

// const Select = ({ label, value, options, onChange, className }: { label: string; value: string; options: FilterOption[]; onChange: (v: string) => void; className: string }) => (
//   <label className="space-y-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
//     {label}
//     <select value={value} onChange={(e) => onChange(e.target.value)} className={className}>
//       <option value="">All</option>
//       {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
//     </select>
//   </label>
// );

// export default HomeworkFilters;

import { Icon } from "@iconify/react";

import {
  HomeworkStatus,
  type HomeworkFilters as HomeworkFiltersType,
} from "../../features/homework/homework.types";

interface Option {
  _id: string;
  name?: string;
  sessionName?: string;
}

interface HomeworkFiltersProps {
  filters: HomeworkFiltersType;

  sessions: Option[];
  classes: Option[];
  sections: Option[];
  subjects: Option[];
  teachers: Option[];

  onChange: (
    filters: HomeworkFiltersType
  ) => void;

  onReset: () => void;
}

const label = (
  item: Option
) =>
  item.name ??
  item.sessionName ??
  "Unnamed";

const HomeworkFilters = ({
  filters,
  sessions,
  classes,
  sections,
  subjects,
  teachers,
  onChange,
  onReset,
}: HomeworkFiltersProps) => {
  const updateFilter = (
    key: keyof HomeworkFiltersType,
    value: string
  ) => {
    const next = {
      ...filters,
    };

    if (!value) {
      delete next[key];
    } else {
      Object.assign(next, {
        [key]: value,
      });
    }

    onChange(next);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">
            Filters
          </h3>

          <p className="mt-0.5 text-xs text-slate-500">
            Filter homework records
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <Icon icon="lucide:rotate-ccw" />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        <select
          value={
            filters.sessionId ?? ""
          }
          onChange={(e) =>
            updateFilter(
              "sessionId",
              e.target.value
            )
          }
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500"
        >
          <option value="">
            All Sessions
          </option>

          {sessions.map((item) => (
            <option
              key={item._id}
              value={item._id}
            >
              {label(item)}
            </option>
          ))}
        </select>

        <select
          value={filters.classId ?? ""}
          onChange={(e) =>
            updateFilter(
              "classId",
              e.target.value
            )
          }
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500"
        >
          <option value="">
            All Classes
          </option>

          {classes.map((item) => (
            <option
              key={item._id}
              value={item._id}
            >
              {label(item)}
            </option>
          ))}
        </select>

        <select
          value={
            filters.sectionId ?? ""
          }
          onChange={(e) =>
            updateFilter(
              "sectionId",
              e.target.value
            )
          }
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500"
        >
          <option value="">
            All Sections
          </option>

          {sections.map((item) => (
            <option
              key={item._id}
              value={item._id}
            >
              {label(item)}
            </option>
          ))}
        </select>

        <select
          value={
            filters.subjectId ?? ""
          }
          onChange={(e) =>
            updateFilter(
              "subjectId",
              e.target.value
            )
          }
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500"
        >
          <option value="">
            All Subjects
          </option>

          {subjects.map((item) => (
            <option
              key={item._id}
              value={item._id}
            >
              {label(item)}
            </option>
          ))}
        </select>

        <select
          value={
            filters.teacherId ?? ""
          }
          onChange={(e) =>
            updateFilter(
              "teacherId",
              e.target.value
            )
          }
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500"
        >
          <option value="">
            All Teachers
          </option>

          {teachers.map((item) => (
            <option
              key={item._id}
              value={item._id}
            >
              {label(item)}
            </option>
          ))}
        </select>

        <select
          value={filters.status ?? ""}
          onChange={(e) =>
            updateFilter(
              "status",
              e.target.value
            )
          }
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500"
        >
          <option value="">
            All Status
          </option>

          <option
            value={
              HomeworkStatus.DRAFT
            }
          >
            Draft
          </option>

          <option
            value={
              HomeworkStatus.PUBLISHED
            }
          >
            Published
          </option>

          <option
            value={
              HomeworkStatus.CLOSED
            }
          >
            Closed
          </option>
        </select>

        <input
          type="date"
          value={
            filters.fromDate ?? ""
          }
          onChange={(e) =>
            updateFilter(
              "fromDate",
              e.target.value
            )
          }
          className="h-10 rounded-lg border border-slate-300 px-3 text-sm text-slate-700 outline-none focus:border-blue-500"
        />

        <input
          type="date"
          value={filters.toDate ?? ""}
          onChange={(e) =>
            updateFilter(
              "toDate",
              e.target.value
            )
          }
          className="h-10 rounded-lg border border-slate-300 px-3 text-sm text-slate-700 outline-none focus:border-blue-500"
        />

        <div className="relative md:col-span-2">
          <Icon
            icon="lucide:search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={
              filters.search ?? ""
            }
            onChange={(e) =>
              updateFilter(
                "search",
                e.target.value
              )
            }
            placeholder="Search homework..."
            className="h-10 w-full rounded-lg border border-slate-300 pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default HomeworkFilters;