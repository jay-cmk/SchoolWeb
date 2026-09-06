

// import { Icon } from "@iconify/react";

// import {
//   HomeworkStatus,
//   type HomeworkFilters as HomeworkFiltersType,
// } from "../../features/homework/homework.types";

// interface Option {
//   _id: string;
//   name?: string;
//   sessionName?: string;
// }

// interface HomeworkFiltersProps {
//   filters: HomeworkFiltersType;

//   sessions: Option[];
//   classes: Option[];
//   sections: Option[];
//   subjects: Option[];
//   teachers: Option[];

//   onChange: (
//     filters: HomeworkFiltersType
//   ) => void;

//   onReset: () => void;
// }

// const label = (
//   item: Option
// ) =>
//   item.name ??
//   item.sessionName ??
//   "Unnamed";

// const HomeworkFilters = ({
//   filters,
//   sessions,
//   classes,
//   sections,
//   subjects,
//   teachers,
//   onChange,
//   onReset,
// }: HomeworkFiltersProps) => {
//   const updateFilter = (
//     key: keyof HomeworkFiltersType,
//     value: string
//   ) => {
//     const next = {
//       ...filters,
//     };

//     if (!value) {
//       delete next[key];
//     } else {
//       Object.assign(next, {
//         [key]: value,
//       });
//     }

//     onChange(next);
//   };

//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-5">
//       <div className="mb-4 flex items-center justify-between">
//         <div>
//           <h3 className="font-semibold text-slate-900">
//             Filters
//           </h3>

//           <p className="mt-0.5 text-xs text-slate-500">
//             Filter homework records
//           </p>
//         </div>

//         <button
//           type="button"
//           onClick={onReset}
//           className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
//         >
//           <Icon icon="lucide:rotate-ccw" />
//           Reset
//         </button>
//       </div>

//       <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
//         <select
//           value={
//             filters.sessionId ?? ""
//           }
//           onChange={(e) =>
//             updateFilter(
//               "sessionId",
//               e.target.value
//             )
//           }
//           className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500"
//         >
//           <option value="">
//             All Sessions
//           </option>

//           {sessions.map((item) => (
//             <option
//               key={item._id}
//               value={item._id}
//             >
//               {label(item)}
//             </option>
//           ))}
//         </select>

//         <select
//           value={filters.classId ?? ""}
//           onChange={(e) =>
//             updateFilter(
//               "classId",
//               e.target.value
//             )
//           }
//           className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500"
//         >
//           <option value="">
//             All Classes
//           </option>

//           {classes.map((item) => (
//             <option
//               key={item._id}
//               value={item._id}
//             >
//               {label(item)}
//             </option>
//           ))}
//         </select>

//         <select
//           value={
//             filters.sectionId ?? ""
//           }
//           onChange={(e) =>
//             updateFilter(
//               "sectionId",
//               e.target.value
//             )
//           }
//           className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500"
//         >
//           <option value="">
//             All Sections
//           </option>

//           {sections.map((item) => (
//             <option
//               key={item._id}
//               value={item._id}
//             >
//               {label(item)}
//             </option>
//           ))}
//         </select>

//         <select
//           value={
//             filters.subjectId ?? ""
//           }
//           onChange={(e) =>
//             updateFilter(
//               "subjectId",
//               e.target.value
//             )
//           }
//           className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500"
//         >
//           <option value="">
//             All Subjects
//           </option>

//           {subjects.map((item) => (
//             <option
//               key={item._id}
//               value={item._id}
//             >
//               {label(item)}
//             </option>
//           ))}
//         </select>

//         <select
//           value={
//             filters.teacherId ?? ""
//           }
//           onChange={(e) =>
//             updateFilter(
//               "teacherId",
//               e.target.value
//             )
//           }
//           className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500"
//         >
//           <option value="">
//             All Teachers
//           </option>

//           {teachers.map((item) => (
//             <option
//               key={item._id}
//               value={item._id}
//             >
//               {label(item)}
//             </option>
//           ))}
//         </select>

//         <select
//           value={filters.status ?? ""}
//           onChange={(e) =>
//             updateFilter(
//               "status",
//               e.target.value
//             )
//           }
//           className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500"
//         >
//           <option value="">
//             All Status
//           </option>

//           <option
//             value={
//               HomeworkStatus.DRAFT
//             }
//           >
//             Draft
//           </option>

//           <option
//             value={
//               HomeworkStatus.PUBLISHED
//             }
//           >
//             Published
//           </option>

//           <option
//             value={
//               HomeworkStatus.CLOSED
//             }
//           >
//             Closed
//           </option>
//         </select>

//         <input
//           type="date"
//           value={
//             filters.fromDate ?? ""
//           }
//           onChange={(e) =>
//             updateFilter(
//               "fromDate",
//               e.target.value
//             )
//           }
//           className="h-10 rounded-lg border border-slate-300 px-3 text-sm text-slate-700 outline-none focus:border-blue-500"
//         />

//         <input
//           type="date"
//           value={filters.toDate ?? ""}
//           onChange={(e) =>
//             updateFilter(
//               "toDate",
//               e.target.value
//             )
//           }
//           className="h-10 rounded-lg border border-slate-300 px-3 text-sm text-slate-700 outline-none focus:border-blue-500"
//         />

//         <div className="relative md:col-span-2">
//           <Icon
//             icon="lucide:search"
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//           />

//           <input
//             type="text"
//             value={
//               filters.search ?? ""
//             }
//             onChange={(e) =>
//               updateFilter(
//                 "search",
//                 e.target.value
//               )
//             }
//             placeholder="Search homework..."
//             className="h-10 w-full rounded-lg border border-slate-300 pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

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
    const next: HomeworkFiltersType = {
      ...filters,
    };

    if (!value) {
      delete next[key];
    } else {
      Object.assign(next, {
        [key]: value,
      });
    }

    /*
     * Academic session इस component से
     * control नहीं होगी।
     *
     * HomeworkList selectedSessionId को
     * वापस filters में लगाएगा।
     */
    delete next.sessionId;

    /*
     * Class बदलने पर पुराने class का
     * section clear करना जरूरी है।
     */
    if (key === "classId") {
      delete next.sectionId;
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
        {/* CLASS */}
        <select
          value={
            filters.classId ?? ""
          }
          onChange={(event) =>
            updateFilter(
              "classId",
              event.target.value
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

        {/* SECTION */}
        <select
          value={
            filters.sectionId ?? ""
          }
          onChange={(event) =>
            updateFilter(
              "sectionId",
              event.target.value
            )
          }
          disabled={
            !filters.classId
          }
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
        >
          <option value="">
            {filters.classId
              ? "All Sections"
              : "Select Class First"}
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

        {/* SUBJECT */}
        <select
          value={
            filters.subjectId ?? ""
          }
          onChange={(event) =>
            updateFilter(
              "subjectId",
              event.target.value
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

        {/* TEACHER */}
        <select
          value={
            filters.teacherId ?? ""
          }
          onChange={(event) =>
            updateFilter(
              "teacherId",
              event.target.value
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

        {/* STATUS */}
        <select
          value={
            filters.status ?? ""
          }
          onChange={(event) =>
            updateFilter(
              "status",
              event.target.value
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

        {/* FROM DATE */}
        <input
          type="date"
          value={
            filters.fromDate ?? ""
          }
          onChange={(event) =>
            updateFilter(
              "fromDate",
              event.target.value
            )
          }
          className="h-10 rounded-lg border border-slate-300 px-3 text-sm text-slate-700 outline-none focus:border-blue-500"
        />

        {/* TO DATE */}
        <input
          type="date"
          value={
            filters.toDate ?? ""
          }
          onChange={(event) =>
            updateFilter(
              "toDate",
              event.target.value
            )
          }
          className="h-10 rounded-lg border border-slate-300 px-3 text-sm text-slate-700 outline-none focus:border-blue-500"
        />

        {/* SEARCH */}
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
            onChange={(event) =>
              updateFilter(
                "search",
                event.target.value
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