import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../../components/superAdmin/Sidebar";
import Topbar from "../../components/superAdmin/Topbar";

const SuperAdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7F9FC]">

      {/* Sidebar */}
      <Sidebar />

      {/* Right Side */}
      <div className="ml-[220px] min-h-screen">

        {/* Topbar */}
        <Topbar />

        {/* Page Content */}
        <main className="min-h-[calc(100vh-68px)]">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default SuperAdminLayout;