import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  getSchools,
  updateSchoolStatus,
} from "../../features/schools/school.slice";
import type {
  School,
  SchoolStatus,
} from "../../features/schools/school.types";

type StatusFilter = "ALL" | SchoolStatus;

interface StatCardProps {
  icon: string;
  title: string;
  value: number | string;
  subtext: string;
  type: "primary" | "success" | "warning" | "danger";
}

const statusOptions: SchoolStatus[] = [
  "ACTIVE" as SchoolStatus,
  "INACTIVE" as SchoolStatus,
  "SUSPENDED" as SchoolStatus,
];

const StatCard = ({ icon, title, value, subtext, type }: StatCardProps) => {
  const styles = {
    primary: "bg-[#EFF6FF] text-[#3B82F6]",
    success: "bg-[#ECFDF5] text-[#10B981]",
    warning: "bg-[#FEF3C7] text-[#F59E0B]",
    danger: "bg-[#FEF2F2] text-[#EF4444]",
  };

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${styles[type]}`}>
        <Icon icon={icon} className="text-xl" />
      </div>
      <p className="mt-5 text-sm text-[#6B7280]">{title}</p>
      <p className="mt-1 text-2xl font-bold text-[#111827]">{value}</p>
      <p className="mt-1 text-xs text-[#6B7280]">{subtext}</p>
    </div>
  );
};

const getStatusBadge = (status: SchoolStatus) => {
  switch (status) {
    case "ACTIVE":
      return "bg-[#ECFDF5] text-[#059669]";
    case "INACTIVE":
      return "bg-[#FEF3C7] text-[#D97706]";
    case "SUSPENDED":
      return "bg-[#FEF2F2] text-[#DC2626]";
    default:
      return "bg-[#F3F4F6] text-[#6B7280]";
  }
};

const getStatusDot = (status: SchoolStatus) => {
  switch (status) {
    case "ACTIVE":
      return "bg-[#10B981]";
    case "INACTIVE":
      return "bg-[#F59E0B]";
    case "SUSPENDED":
      return "bg-[#EF4444]";
    default:
      return "bg-[#6B7280]";
  }
};

const formatStatus = (status: SchoolStatus) =>
  status.charAt(0) + status.slice(1).toLowerCase();

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const Schools = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { schools, loading, error } = useAppSelector(
    (state) => state.schools,
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [cityFilter, setCityFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getSchools());
  }, [dispatch]);

  const cities = useMemo(
    () =>
      Array.from(
        new Set(
          schools
            .map((school) => school.address?.city)
            .filter((city): city is string => Boolean(city)),
        ),
      ).sort(),
    [schools],
  );

  const filteredSchools = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return schools.filter((school) => {
      const matchesSearch =
        !query ||
        school.name.toLowerCase().includes(query) ||
        school.code.toLowerCase().includes(query) ||
        school.email?.toLowerCase().includes(query) ||
        school.phone?.includes(query);

      const matchesStatus =
        statusFilter === "ALL" || school.status === statusFilter;

      const matchesCity =
        cityFilter === "ALL" || school.address?.city === cityFilter;

      return matchesSearch && matchesStatus && matchesCity;
    });
  }, [schools, searchQuery, statusFilter, cityFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSchools.length / pageSize),
  );

  const paginatedSchools = useMemo(
    () =>
      filteredSchools.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize,
      ),
    [filteredSchools, currentPage, pageSize],
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const totalSchools = schools.length;
  const activeSchools = schools.filter(
    (school) => school.status === "ACTIVE",
  ).length;
  const inactiveSchools = schools.filter(
    (school) => school.status === "INACTIVE",
  ).length;
  const suspendedSchools = schools.filter(
    (school) => school.status === "SUSPENDED",
  ).length;

  const activePercentage = totalSchools
    ? ((activeSchools / totalSchools) * 100).toFixed(1)
    : "0.0";

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setCityFilter("ALL");
    setCurrentPage(1);
  };

  const handleStatusChange = async (
    schoolId: string,
    status: SchoolStatus,
  ) => {
    setStatusUpdatingId(schoolId);

    try {
      await dispatch(
        updateSchoolStatus({ schoolId, status }),
      ).unwrap();
      setOpenMenuId(null);
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const startRow = filteredSchools.length
    ? (currentPage - 1) * pageSize + 1
    : 0;
  const endRow = Math.min(
    currentPage * pageSize,
    filteredSchools.length,
  );

  return (
    <div className="min-h-screen w-full bg-[#F7F9FC] p-4">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[#3B82F6]">
            Super Admin / Schools
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[#111827]">Schools</h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            Manage all schools registered on the School ERP SaaS platform.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/super-admin/add-school")}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#2563EB]"
        >
          <Icon icon="lucide:plus" className="text-lg" />
          Add School
        </button>
      </div>

      <section className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon="lucide:school"
          title="Total Schools"
          value={loading ? "..." : totalSchools}
          subtext="Fetched from registered schools API"
          type="primary"
        />
        <StatCard
          icon="lucide:circle-check"
          title="Active Schools"
          value={loading ? "..." : activeSchools}
          subtext={`${activePercentage}% of all schools`}
          type="success"
        />
        <StatCard
          icon="lucide:clock"
          title="Inactive Schools"
          value={loading ? "..." : inactiveSchools}
          subtext="Currently inactive"
          type="warning"
        />
        <StatCard
          icon="lucide:circle-alert"
          title="Suspended Schools"
          value={loading ? "..." : suspendedSchools}
          subtext="Require follow-up"
          type="danger"
        />
      </section>

      <section className="mt-7 overflow-visible rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-[#E5E7EB] p-5 xl:flex-row xl:items-center">
          <div className="relative flex-1">
            <Icon
              icon="lucide:search"
              className="absolute left-3 top-3.5 text-lg text-[#6B7280]"
            />
            <input
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setCurrentPage(1);
              }}
              className="min-h-11 w-full rounded-lg border border-[#D1D5DB] bg-white pl-10 pr-3 text-sm text-[#111827] outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20"
              placeholder="Search by school name, code, email or phone..."
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as StatusFilter);
              setCurrentPage(1);
            }}
            className="min-h-11 rounded-lg border border-[#D1D5DB] bg-white px-3 text-sm text-[#111827]"
          >
            <option value="ALL">All Status</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {formatStatus(status)}
              </option>
            ))}
          </select>

          <select
            value={cityFilter}
            onChange={(event) => {
              setCityFilter(event.target.value);
              setCurrentPage(1);
            }}
            className="min-h-11 rounded-lg border border-[#D1D5DB] bg-white px-3 text-sm text-[#111827]"
          >
            <option value="ALL">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={resetFilters}
            className="min-h-11 px-2 text-sm font-semibold text-[#3B82F6]"
          >
            Reset Filters
          </button>
        </div>

        {error && (
          <div className="m-5 flex items-center justify-between rounded-lg border border-[#FECACA] bg-[#FEF2F2] p-4 text-sm text-[#B91C1C]">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => dispatch(getSchools())}
              className="font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-left">
            <thead className="bg-[#F9FAFB] text-xs uppercase tracking-wide text-[#6B7280]">
              <tr>
                <th className="px-5 py-4">School</th>
                <th className="px-5 py-4">School Code</th>
                <th className="px-5 py-4">Contact</th>
                <th className="px-5 py-4">Students</th>
                <th className="px-5 py-4">Teachers</th>
                <th className="px-5 py-4">Subscription Plan</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Created Date</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E5E7EB] text-sm">
              {loading && schools.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-[#6B7280]">
                    <Icon icon="lucide:loader-2" className="mx-auto mb-2 animate-spin text-2xl" />
                    Loading schools...
                  </td>
                </tr>
              ) : paginatedSchools.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-[#6B7280]">
                    No schools found.
                  </td>
                </tr>
              ) : (
                paginatedSchools.map((school: School) => (
                  <tr key={school._id} className="hover:bg-[#F9FAFB]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-sm font-bold text-[#3B82F6]">
                          {getInitials(school.name)}
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={() => navigate(`/super-admin/schools/${school._id}`)}
                            className="font-semibold text-[#111827] hover:text-[#3B82F6]"
                          >
                            {school.name}
                          </button>
                          <p className="text-xs text-[#6B7280]">
                            {[school.address?.city, school.address?.state]
                              .filter(Boolean)
                              .join(", ") || "Location not added"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-[#111827]">
                      {school.code}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-[#111827]">{school.email || "—"}</p>
                      <p className="text-xs text-[#6B7280]">{school.phone || "—"}</p>
                    </td>
                    <td className="px-5 py-4 text-[#6B7280]">—</td>
                    <td className="px-5 py-4 text-[#6B7280]">—</td>
                    <td className="px-5 py-4 text-[#6B7280]">—</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusBadge(school.status)}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${getStatusDot(school.status)}`} />
                        {formatStatus(school.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#6B7280]">
                      {school.createdAt
                        ? new Date(school.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="relative px-5 py-4">
                      <button
                        type="button"
                        onClick={() => setOpenMenuId(openMenuId === school._id ? null : school._id)}
                        className="min-h-11 rounded-lg px-2 text-[#6B7280] hover:bg-[#F3F4F6]"
                      >
                        <Icon icon="lucide:ellipsis" className="text-xl" />
                      </button>

                      {openMenuId === school._id && (
                        <div className="absolute right-5 top-12 z-20 w-48 rounded-lg border border-[#E5E7EB] bg-white py-1 shadow-lg">
                          <button
                            type="button"
                            onClick={() => navigate(`/super-admin/schools/${school._id}`)}
                            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-[#F9FAFB]"
                          >
                            <Icon icon="lucide:eye" /> View details
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate(`/super-admin/schools/${school._id}/edit`)}
                            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-[#F9FAFB]"
                          >
                            <Icon icon="lucide:pencil" /> Edit school
                          </button>
                          <div className="my-1 border-t border-[#E5E7EB]" />
                          {statusOptions.map((status) => (
                            <button
                              key={status}
                              type="button"
                              disabled={statusUpdatingId === school._id || school.status === status}
                              onClick={() => handleStatusChange(school._id, status)}
                              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-[#F9FAFB] disabled:opacity-50"
                            >
                              <span className={`h-2 w-2 rounded-full ${getStatusDot(status)}`} />
                              Mark {formatStatus(status)}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#E5E7EB] px-5 py-4 text-sm text-[#6B7280] md:flex-row md:items-center md:justify-between">
          <p>
            Showing <span className="font-semibold text-[#111827]">{startRow}–{endRow}</span> of{" "}
            <span className="font-semibold text-[#111827]">{filteredSchools.length}</span> schools
          </p>

          <div className="flex items-center gap-2">
            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setCurrentPage(1);
              }}
              className="min-h-11 rounded-lg border border-[#D1D5DB] bg-white px-3 text-[#111827]"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size} / page
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => page - 1)}
              className="min-h-11 rounded-lg border border-[#D1D5DB] px-3 text-[#111827] disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-2 font-semibold text-[#111827]">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((page) => page + 1)}
              className="min-h-11 rounded-lg border border-[#D1D5DB] px-3 text-[#111827] disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Schools;