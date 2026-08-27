


// import {
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";

// import Login from "../pages/auth/Login";
// import ProtectedRoute from "./ProtectedRoute";

// import SuperAdminLayout
//   from "../components/layout/SuperAdminLayout";

// import SuperAdminDashboard
//   from "../pages/superAdmin/SuperAdminDashboard";

// import Schools
//   from "../pages/superAdmin/Schools";

// import SchoolDetails
//   from "../pages/superAdmin/SchoolDetails";

// import AddSchool
//   from "../pages/superAdmin/AddSchool";

// import SchoolAdminDashboard
//   from "../pages/schoolAdmin/Dashboard";

// // Academic Pages
// import Sessions from "../pages/schoolAdmin/academic/sessions/Sessions";
// import Classes from "../pages/schoolAdmin/academic/classes/Classes";
// import Section from "../pages/schoolAdmin/academic/sections/Sections";
// import Subjects from "../pages/schoolAdmin/academic/subjects/Subjects";  

// import { UserRole } from "../types/auth.types";
// import SchoolAdminLayout from "../components/layout/SchoolAdminLayout";
// import AcademicSessionDetails from "../pages/schoolAdmin/academic/sessions/Sessions";
// import Teachers from "../pages/schoolAdmin/teachers/Teachers";
// import SubjectAssignments from "../pages/schoolAdmin/academic/subjectAssignments/SubjectAssignments";


// const AppRoutes = () => {
//   return (
//     <Routes>

//       {/* =====================================================
//           LOGIN
//       ===================================================== */}

//       <Route
//         path="/login"
//         element={<Login />}
//       />


//       {/* =====================================================
//           SUPER ADMIN
//       ===================================================== */}

//       <Route
//         element={
//           <ProtectedRoute
//             allowedRoles={[
//               UserRole.SUPER_ADMIN,
//             ]}
//           >
//             <SuperAdminLayout />
//           </ProtectedRoute>
//         }
//       >

//         {/* Dashboard */}

//         <Route
//           path="/super-admin/dashboard"
//           element={
//             <SuperAdminDashboard />
//           }
//         />


//         {/* Schools */}

//         <Route
//           path="/super-admin/schools"
//           element={
//             <Schools />
//           }
//         />


//         {/* Add School */}

//         <Route
//           path="/super-admin/schools/add"
//           element={
//             <AddSchool />
//           }
//         />


//         {/* School Details */}

//         <Route
//           path="/super-admin/schools/details"
//           element={
//             <SchoolDetails />
//           }
//         />

//       </Route>


//      {/* ============================================
//           SCHOOL ADMIN - With Layout (Dashboard + Academic)
//       ============================================ */}
//       <Route
//         element={
//           <ProtectedRoute allowedRoles={[UserRole.SCHOOL_ADMIN]}>
//             <SchoolAdminLayout
//              />  {/* ← यह Layout बनाना होगा */}
//           </ProtectedRoute>
//         }
//       >
//         {/* Dashboard */}
//         <Route path="/school-admin/dashboard" element={<SchoolAdminDashboard />} />

//         {/* Academic Pages */}
//         <Route path="/school-admin/academic/sessions" element={<Sessions />} />
//         <Route path="/school-admin/academic/classes" element={<Classes />} />
//         <Route path="/school-admin/academic/sections" element={<Section />} />
//         <Route path="/school-admin/academic/subjects" element={<Subjects />} />
//         <Route path="/school-admin/academic/subject-assignments" element={<SubjectAssignments />} />

//          {/* Academic Session Details */}
//         <Route 
//           path="/school-admin/academic/sessions/:sessionId" 
//           element={<AcademicSessionDetails />} 
//         />

//          <Route 
//           path="/school-admin/teachers" 
//           element={<Teachers />} 
//         />

  
//       </Route>

      




//       {/* =====================================================
//           UNKNOWN URL
//       ===================================================== */}

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


import Login
  from "../pages/auth/Login";


import ProtectedRoute
  from "./ProtectedRoute";


import {
  UserRole,
} from "../types/auth.types";


// ============================================
// SUPER ADMIN
// ============================================

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


// ============================================
// SCHOOL ADMIN LAYOUT
// ============================================

import SchoolAdminLayout
  from "../components/layout/SchoolAdminLayout";


import SchoolAdminDashboard
  from "../pages/schoolAdmin/Dashboard";


// ============================================
// ACADEMIC
// ============================================

import Sessions
  from "../pages/schoolAdmin/academic/sessions/Sessions";


import Classes
  from "../pages/schoolAdmin/academic/classes/Classes";


import Sections
  from "../pages/schoolAdmin/academic/sections/Sections";


import Subjects
  from "../pages/schoolAdmin/academic/subjects/Subjects";


import SubjectAssignments
  from "../pages/schoolAdmin/academic/subjectAssignments/SubjectAssignments";


import AcademicSessionDetails
  from "../pages/schoolAdmin/academic/sessions/Sessions";


// ============================================
// TEACHERS
// ============================================

import Teachers
  from "../pages/schoolAdmin/teachers/Teachers";


// ============================================
// ATTENDANCE
// ============================================

import MarkAttendance
  from "../pages/schoolAdmin/Attendance/MarkAttendance";


import DailyAttendance
  from "../pages/schoolAdmin/Attendance/DailyAttendance";


import MonthlyAttendance
  from "../pages/schoolAdmin/Attendance/MonthlyAttendance";


import UpdateAttendance
  from "../pages/schoolAdmin/Attendance/UpdateAttendance";


import StudentAttendanceDetails
  from "../pages/schoolAdmin/Attendance/StudentAttendanceDetails";


// ============================================
// APP ROUTES
// ============================================

const AppRoutes = () => {
  return (
    <Routes>

      {/* ========================================
          LOGIN
      ======================================== */}

      <Route
        path="/login"
        element={
          <Login />
        }
      />


      {/* ========================================
          SUPER ADMIN
      ======================================== */}

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

        {/* DASHBOARD */}

        <Route
          path="/super-admin/dashboard"
          element={
            <SuperAdminDashboard />
          }
        />


        {/* SCHOOLS */}

        <Route
          path="/super-admin/schools"
          element={
            <Schools />
          }
        />


        {/* ADD SCHOOL */}

        <Route
          path="/super-admin/schools/add"
          element={
            <AddSchool />
          }
        />


        {/* SCHOOL DETAILS */}

        <Route
          path="/super-admin/schools/details"
          element={
            <SchoolDetails />
          }
        />

      </Route>


      {/* ========================================
          SCHOOL ADMIN
      ======================================== */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={[
              UserRole.SCHOOL_ADMIN,
            ]}
          >
            <SchoolAdminLayout />
          </ProtectedRoute>
        }
      >

        {/* ======================================
            DASHBOARD
        ====================================== */}

        <Route
          path="/school-admin/dashboard"
          element={
            <SchoolAdminDashboard />
          }
        />


        {/* ======================================
            ACADEMIC SESSION
        ====================================== */}

        <Route
          path="/school-admin/academic/sessions"
          element={
            <Sessions />
          }
        />


        <Route
          path="/school-admin/academic/sessions/:sessionId"
          element={
            <AcademicSessionDetails />
          }
        />


        {/* ======================================
            CLASSES
        ====================================== */}

        <Route
          path="/school-admin/academic/classes"
          element={
            <Classes />
          }
        />


        {/* ======================================
            SECTIONS
        ====================================== */}

        <Route
          path="/school-admin/academic/sections"
          element={
            <Sections />
          }
        />


        {/* ======================================
            SUBJECTS
        ====================================== */}

        <Route
          path="/school-admin/academic/subjects"
          element={
            <Subjects />
          }
        />


        {/* ======================================
            SUBJECT ASSIGNMENTS
        ====================================== */}

        <Route
          path="/school-admin/academic/subject-assignments"
          element={
            <SubjectAssignments />
          }
        />


        {/* ======================================
            TEACHERS
        ====================================== */}

        <Route
          path="/school-admin/teachers"
          element={
            <Teachers />
          }
        />


        {/* ======================================
            ATTENDANCE
        ====================================== */}


        {/* MARK ATTENDANCE */}

        <Route
          path="/school-admin/attendance/mark"
          element={
            <MarkAttendance />
          }
        />


        {/* DAILY ATTENDANCE */}

        <Route
          path="/school-admin/attendance/daily"
          element={
            <DailyAttendance />
          }
        />


        {/* MONTHLY ATTENDANCE */}

        <Route
          path="/school-admin/attendance/monthly"
          element={
            <MonthlyAttendance />
          }
        />


        {/* ======================================
            UPDATE ATTENDANCE

            Example:
            /school-admin/attendance/update
            ?sessionId=xxx
            &classId=xxx
            &sectionId=xxx
            &date=2026-08-25
        ====================================== */}

        <Route
          path="/school-admin/attendance/update"
          element={
            <UpdateAttendance />
          }
        />


        {/* ======================================
            STUDENT ATTENDANCE DETAILS

            Example:
            /school-admin/attendance/student/STUDENT_ID
            ?sessionId=xxx
            &month=8
            &year=2026
        ====================================== */}

        <Route
          path="/school-admin/attendance/student/:studentId"
          element={
            <StudentAttendanceDetails />
          }
        />

      </Route>


      {/* ========================================
          UNKNOWN URL
      ======================================== */}

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