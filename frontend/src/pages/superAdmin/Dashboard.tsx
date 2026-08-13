import { useEffect, useMemo, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";

import { getSchools } from "../../features/schools/school.slice";

import Sidebar from "../../components/superAdmin/Sidebar";
import Topbar from "../../components/superAdmin/Topbar";
import StatCard from "../../components/superAdmin/StatCard";
import RecentSchools from "../../components/superAdmin/RecentSchools";

const SuperAdminDashboard = () => {
  const dispatch = useAppDispatch();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const {
    schools,
    loading,
    error,
  } = useAppSelector(
    (state) => state.schools
  );

  useEffect(() => {
    dispatch(getSchools());
  }, [dispatch]);

  const totalSchools = schools.length;

  const activeSchools = schools.length;

  const recentSchools = useMemo(() => {
    return [...schools]
      .sort((a, b) => {
        return (
          new Date(
            b.createdAt || 0
          ).getTime() -
          new Date(
            a.createdAt || 0
          ).getTime()
        );
      })
      .slice(0, 5);
  }, [schools]);

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      {/* Main */}
      <div className="flex-1 min-w-0">

        {/* Topbar */}
        <Topbar
          onMenuClick={() =>
            setSidebarOpen(true)
          }
        />

        <main className="p-4 lg:p-6">

          {/* Page Header */}
          <div className="mb-6">

            <h1 className="text-2xl font-bold text-gray-800">
              Super Admin Dashboard
            </h1>

            <p className="text-gray-500 mt-1">
              Manage and monitor your school
              SaaS platform.
            </p>

          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
              {error}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">

            <StatCard
              title="Total Schools"
              value={
                loading ? "..." : totalSchools
              }
              description="Schools registered"
              icon="🏫"
            />

            <StatCard
              title="Active Schools"
              value={
                loading ? "..." : activeSchools
              }
              description="Currently active"
              icon="✅"
            />

            <StatCard
              title="School Admins"
              value="-"
              description="Coming with admin management"
              icon="👤"
            />

            <StatCard
              title="Platform Status"
              value="Active"
              description="System is running"
              icon="⚡"
            />

          </div>

          {/* Recent Schools */}
          <RecentSchools
            schools={recentSchools}
            loading={loading}
          />

        </main>

      </div>

    </div>
  );
};

export default SuperAdminDashboard;