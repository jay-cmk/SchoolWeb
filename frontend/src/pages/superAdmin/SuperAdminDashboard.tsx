// import { useEffect, useMemo, useState } from "react";

// import { useAppDispatch, useAppSelector } from "../../app/hooks";

// import { getSchools } from "../../features/schools/school.slice";

// import Sidebar from "../../components/superAdmin/Sidebar";
// import Topbar from "../../components/superAdmin/Topbar";
// import StatCard from "../../components/superAdmin/StatCard";
// import RecentSchools from "../../components/superAdmin/RecentSchools";

// const SuperAdminDashboard = () => {
//   const dispatch = useAppDispatch();

//   const [sidebarOpen, setSidebarOpen] =
//     useState(false);

//   const {
//     schools,
//     loading,
//     error,
//   } = useAppSelector(
//     (state) => state.schools
//   );

//   useEffect(() => {
//     dispatch(getSchools());
//   }, [dispatch]);

//   const totalSchools = schools.length;

//   const activeSchools = schools.length;

//   const recentSchools = useMemo(() => {
//     return [...schools]
//       .sort((a, b) => {
//         return (
//           new Date(
//             b.createdAt || 0
//           ).getTime() -
//           new Date(
//             a.createdAt || 0
//           ).getTime()
//         );
//       })
//       .slice(0, 5);
//   }, [schools]);

//   return (
//     <div className="min-h-screen bg-gray-100 flex">

//       {/* Sidebar */}
//       <Sidebar
//         open={sidebarOpen}
//         onClose={() =>
//           setSidebarOpen(false)
//         }
//       />

//       {/* Main */}
//       <div className="flex-1 min-w-0">

//         {/* Topbar */}
//         <Topbar
//           onMenuClick={() =>
//             setSidebarOpen(true)
//           }
//         />

//         <main className="p-4 lg:p-6">

//           {/* Page Header */}
//           <div className="mb-6">

//             <h1 className="text-2xl font-bold text-gray-800">
//               Super Admin Dashboard
//             </h1>

//             <p className="text-gray-500 mt-1">
//               Manage and monitor your school
//               SaaS platform.
//             </p>

//           </div>

//           {/* Error */}
//           {error && (
//             <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
//               {error}
//             </div>
//           )}

//           {/* Stats */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">

//             <StatCard
//               title="Total Schools"
//               value={
//                 loading ? "..." : totalSchools
//               }
//               description="Schools registered"
//               icon="🏫"
//             />

//             <StatCard
//               title="Active Schools"
//               value={
//                 loading ? "..." : activeSchools
//               }
//               description="Currently active"
//               icon="✅"
//             />

//             <StatCard
//               title="School Admins"
//               value="-"
//               description="Coming with admin management"
//               icon="👤"
//             />

//             <StatCard
//               title="Platform Status"
//               value="Active"
//               description="System is running"
//               icon="⚡"
//             />

//           </div>

//           {/* Recent Schools */}
//           <RecentSchools
//             schools={recentSchools}
//             loading={loading}
//           />

//         </main>

//       </div>

//     </div>
//   );
// };

// export default SuperAdminDashboard;


import { useEffect, useMemo, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getSchools } from "../../features/schools/school.slice";

import StatCard from "../../components/superAdmin/StatCard";
import RevenueOverview from "../../components/superAdmin/RevenueOverview";
import SchoolStatus from "../../components/superAdmin/SchoolStatus";
import RecentSchools from "../../components/superAdmin/RecentSchools";
import RecentActivity from "../../components/superAdmin/RecentActivity";

const SuperAdminDashboard = () => {
  const dispatch = useAppDispatch();

  const [period, setPeriod] = useState("Last 6 months");

  const { schools, loading, error } = useAppSelector(
    (state) => state.schools
  );

  // ================= FETCH SCHOOLS =================

  useEffect(() => {
    dispatch(getSchools());
  }, [dispatch]);

  // ================= SCHOOL COUNTS =================

  const totalSchools = schools.length;

  // Abhi ke liye sabhi schools ko active maan rahe hain.
  // Baad me school.status ke according calculate kar sakte ho.
  const activeSchools = schools.length;

  const inactiveSchools = 0;

  const suspendedSchools = 0;

  // ================= RECENT SCHOOLS =================

  const recentSchools = useMemo(() => {
    return [...schools]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      )
      .slice(0, 3)
      .map((school, index) => ({
        id: school._id || index,

        name: school.name || "Unnamed School",

        location:
          school.address?.city ||
          school.address?.state ||
          "India",

        students: 0,

        plan: "Standard",

        status: "Active" as const,
      }));
  }, [schools]);

  // ================= UI =================

  return (
    <div className="w-full bg-[#F7F9FC]">

      <div className="w-full px-5 py-7">

        {/* ================= HEADER ================= */}

        <div className="mb-7">

          <h1 className="text-[28px] font-bold leading-none text-[#172033]">
            Super Admin Dashboard
          </h1>

          <p className="mt-2 text-[14px] text-[#60708A]">
            Manage and monitor your school SaaS platform.
          </p>

        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="mb-6 rounded-lg bg-[#FFF1F1] px-4 py-3 text-[12px] text-[#DC2626]">
            {error}
          </div>
        )}

        {/* ================= STAT CARDS ================= */}

        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Total Schools */}

          <StatCard
            title="Total Schools"
            value={loading ? "..." : totalSchools}
            description="Schools registered"
            trend="+12"
            trendLabel="this month"
            icon="school"
            accent="blue"
          />

          {/* Active Schools */}

          <StatCard
            title="Active Schools"
            value={loading ? "..." : activeSchools}
            description="Currently active"
            trend="+8"
            trendLabel="this month"
            icon="circle-check"
            accent="green"
          />

          {/* School Admins */}

          <StatCard
            title="School Admins"
            value="-"
            description="Admin management"
            trendLabel="admin management"
            icon="users"
            accent="purple"
          />

          {/* Platform Status */}

          <StatCard
            title="Platform Status"
            value="Active"
            description="System is running"
            trend="100%"
            trendLabel="system uptime"
            icon="activity"
            accent="green"
          />

        </div>

        {/* ================= ANALYTICS ================= */}

        <div className="grid w-full grid-cols-1 gap-4 xl:grid-cols-[minmax(0,2.1fr)_minmax(300px,0.9fr)]">

          {/* Revenue Overview */}

          <div className="min-w-0">

            <RevenueOverview
              period={period}
              onPeriodChange={setPeriod}
            />

          </div>

          {/* School Status */}

          <div className="min-w-0">

            <SchoolStatus
              totalCount={totalSchools}
              activeCount={activeSchools}
              inactiveCount={inactiveSchools}
              suspendedCount={suspendedSchools}
            />

          </div>

        </div>

        {/* ================= BOTTOM ================= */}

        <div className="mt-4 grid w-full grid-cols-1 gap-4 xl:grid-cols-[minmax(0,2.1fr)_minmax(300px,0.9fr)]">

          {/* Recent Schools */}

          <div className="min-w-0">

            <RecentSchools
              schools={recentSchools}
              loading={loading}
            />

          </div>

          {/* Recent Activity */}

          <div className="min-w-0">

            <RecentActivity
              activities={[]}
            />

          </div>

        </div>

      </div>

    </div>
  );
};

export default SuperAdminDashboard;