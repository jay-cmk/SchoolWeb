// import {
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";

// import Login from "../pages/auth/Login";
// import ProtectedRoute from "./ProtectedRoute";

// import SuperAdminDashboard
//   from "../pages/superAdmin/SuperAdminDashboard";

// import SchoolAdminDashboard
//   from "../pages/schoolAdmin/Dashboard";

//   import Schools
//   from "../pages/superAdmin/Schools";

//   import SchoolDetails
//   from "../pages/superAdmin/SchoolDetails";

//   import AddSchool
//   from "../pages/superAdmin/AddSchool";

  

// import { UserRole } from "../types/auth.types";


// const AppRoutes = () => {
//   return (
//     <Routes>

//       {/* Login */}
//       <Route
//         path="/login"
//         element={<Login />}
//       />

//       {/* Super Admin */}
//       <Route
//         path="/super-admin/dashboard"
//         element={
//           <ProtectedRoute
//             allowedRoles={[
//               UserRole.SUPER_ADMIN,
//             ]}
//           >
//             <SuperAdminDashboard />
//           </ProtectedRoute>
//         }
//       />

//       {/* School Admin */}
//       <Route
//         path="/school-admin/dashboard"
//         element={
//           <ProtectedRoute
//             allowedRoles={[
//               UserRole.SCHOOL_ADMIN,
//             ]}
//           >
//             <SchoolAdminDashboard />
//           </ProtectedRoute>
//         }
//       />


//       <Route
//   path="/super-admin/schools"
//   element={
//     <ProtectedRoute
//       allowedRoles={[UserRole.SUPER_ADMIN]}
//     >
//       <Schools />
//     </ProtectedRoute>
//   }
// />

// <Route
//   path="/super-admin/schools/add"
//   element={
//     <ProtectedRoute
//       allowedRoles={[UserRole.SUPER_ADMIN]}
//     >
//       <AddSchool />
//     </ProtectedRoute>
//   }
// />

// <Route
//   path="/super-admin/schools/details"
//   element={
//     <ProtectedRoute
//       allowedRoles={[UserRole.SUPER_ADMIN]}
//     >
//       <SchoolDetails />
//     </ProtectedRoute>
//   }
// />


//       {/* Unknown URL */}
//       <Route
//         path="*"
//         element={
//           <Navigate
//             to="/login"
//             replace
//           />
//         }
//       />

//     </Routes>
//   );
// };

// export default AppRoutes;


import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "../pages/auth/Login";
import ProtectedRoute from "./ProtectedRoute";

import SuperAdminLayout
  from "../components/layout/SuperAdminLayout";

import SuperAdminDashboard
  from "../pages/superAdmin/SuperAdminDashboard";

import Schools
  from "../pages/superAdmin/Schools";

import SchoolDetails
  from "../pages/superAdmin/SchoolDetails";

import AddSchool
  from "../pages/superAdmin/AddSchool";

import SchoolAdminDashboard
  from "../pages/schoolAdmin/Dashboard";

import { UserRole } from "../types/auth.types";


const AppRoutes = () => {
  return (
    <Routes>

      {/* =====================================================
          LOGIN
      ===================================================== */}

      <Route
        path="/login"
        element={<Login />}
      />


      {/* =====================================================
          SUPER ADMIN
      ===================================================== */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={[
              UserRole.SUPER_ADMIN,
            ]}
          >
            <SuperAdminLayout />
          </ProtectedRoute>
        }
      >

        {/* Dashboard */}

        <Route
          path="/super-admin/dashboard"
          element={
            <SuperAdminDashboard />
          }
        />


        {/* Schools */}

        <Route
          path="/super-admin/schools"
          element={
            <Schools />
          }
        />


        {/* Add School */}

        <Route
          path="/super-admin/schools/add"
          element={
            <AddSchool />
          }
        />


        {/* School Details */}

        <Route
          path="/super-admin/schools/details"
          element={
            <SchoolDetails />
          }
        />

      </Route>


      {/* =====================================================
          SCHOOL ADMIN
      ===================================================== */}

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


      {/* =====================================================
          UNKNOWN URL
      ===================================================== */}

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
  );
};

export default AppRoutes;