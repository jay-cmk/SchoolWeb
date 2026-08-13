import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "../auth/Login";

import ProtectedRoute from "../../routes/ProtectedRoute";

import SuperAdminDashboard from "../../pages/superAdmin/Dashboard";

import { UserRole } from "../../types/auth.types";

const SchoolAdminDashboard = () => {
  return (
    <h1>
      School Admin Dashboard
    </h1>
  );
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Super Admin Dashboard */}
        <Route
          path="/super-admin/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={[
                UserRole.SUPER_ADMIN,
              ]}
            >
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* School Admin Dashboard */}
        <Route
          path="/school-admin/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={[
                UserRole.SCHOOL_ADMIN,
              ]}
            >
              <SchoolAdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Unknown */}
        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;