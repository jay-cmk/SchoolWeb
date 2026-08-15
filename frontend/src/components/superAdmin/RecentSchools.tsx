import React from "react";
import {
  ArrowUpRight,
  MoreHorizontal,
} from "lucide-react";

interface RecentSchool {
  id: number | string;
  name: string;
  location: string;
  students: number;
  status: "Active" | "Inactive" | "Suspended";
  plan: string;
}

interface RecentSchoolsProps {
  schools: RecentSchool[];
  loading?: boolean;
}

const RecentSchools: React.FC<RecentSchoolsProps> = ({
  schools,
  loading = false,
}) => {
  return (
    <section className="rounded-lg bg-white">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">

        <div>
          <h2 className="text-[12px] font-semibold text-[#172033]">
            Recent schools
          </h2>

          <p className="mt-0.5 text-[9px] text-[#60708A]">
            Recently registered schools
          </p>
        </div>

        <button
          type="button"
          className="
            flex
            items-center
            gap-1
            text-[9px]
            font-medium
            text-[#2563EB]
            hover:text-[#1D4ED8]
          "
        >
          View all
          <ArrowUpRight
            size={11}
            strokeWidth={1.8}
          />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">

        <table className="w-full border-collapse">

          <thead>
            <tr className="bg-[#F8FAFC]">

              <th
                className="
                  px-4
                  py-2.5
                  text-left
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-wide
                  text-[#60708A]
                "
              >
                School
              </th>

              <th
                className="
                  px-4
                  py-2.5
                  text-left
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-wide
                  text-[#60708A]
                "
              >
                Location
              </th>

              <th
                className="
                  px-4
                  py-2.5
                  text-left
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-wide
                  text-[#60708A]
                "
              >
                Students
              </th>

              <th
                className="
                  px-4
                  py-2.5
                  text-left
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-wide
                  text-[#60708A]
                "
              >
                Plan
              </th>

              <th
                className="
                  px-4
                  py-2.5
                  text-left
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-wide
                  text-[#60708A]
                "
              >
                Status
              </th>

              <th className="w-10" />

            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="
                    px-4
                    py-8
                    text-center
                    text-[10px]
                    text-[#60708A]
                  "
                >
                  Loading schools...
                </td>
              </tr>
            ) : schools.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="
                    px-4
                    py-8
                    text-center
                    text-[10px]
                    text-[#60708A]
                  "
                >
                  No schools found
                </td>
              </tr>
            ) : (
              schools.map((school) => (
                <tr
                  key={school.id}
                  className="hover:bg-[#FAFBFD]"
                >

                  {/* School */}
                  <td className="px-4 py-3">

                    <div className="flex items-center gap-2.5">

                      <div
                        className="
                          flex
                          h-7
                          w-7
                          shrink-0
                          items-center
                          justify-center
                          rounded-md
                          bg-[#EAF1FF]
                          text-[9px]
                          font-semibold
                          text-[#2563EB]
                        "
                      >
                        {school.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p
                          className="
                            truncate
                            text-[9px]
                            font-semibold
                            text-[#172033]
                          "
                        >
                          {school.name}
                        </p>
                      </div>

                    </div>
                  </td>

                  {/* Location */}
                  <td className="px-4 py-3">
                    <span className="text-[9px] text-[#60708A]">
                      {school.location}
                    </span>
                  </td>

                  {/* Students */}
                  <td className="px-4 py-3">
                    <span className="text-[9px] font-medium text-[#172033]">
                      {school.students.toLocaleString()}
                    </span>
                  </td>

                  {/* Plan */}
                  <td className="px-4 py-3">
                    <span className="text-[9px] text-[#60708A]">
                      {school.plan}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">

                    <span
                      className={`
                        inline-flex
                        items-center
                        gap-1
                        rounded-full
                        px-2
                        py-1
                        text-[8px]
                        font-medium

                        ${
                          school.status === "Active"
                            ? "bg-[#EAF8EE] text-[#00852D]"
                            : school.status === "Inactive"
                            ? "bg-[#EAF1FF] text-[#2563EB]"
                            : "bg-[#FDECEC] text-[#DC2626]"
                        }
                      `}
                    >
                      <span
                        className={`
                          h-1
                          w-1
                          rounded-full

                          ${
                            school.status === "Active"
                              ? "bg-[#16A34A]"
                              : school.status === "Inactive"
                              ? "bg-[#2563EB]"
                              : "bg-[#DC2626]"
                          }
                        `}
                      />

                      {school.status}
                    </span>

                  </td>

                  {/* More */}
                  <td className="px-3 py-3 text-right">

                    <button
                      type="button"
                      className="
                        flex
                        h-6
                        w-6
                        items-center
                        justify-center
                        rounded-md
                        text-[#60708A]
                        hover:bg-[#F3F5F8]
                      "
                    >
                      <MoreHorizontal
                        size={13}
                        strokeWidth={1.8}
                      />
                    </button>

                  </td>

                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

    </section>
  );
};

export default RecentSchools;