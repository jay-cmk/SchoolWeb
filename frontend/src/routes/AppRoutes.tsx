

// import { Routes, Route, Navigate } from "react-router-dom";

// import Login from "../pages/auth/Login";

// import ProtectedRoute from "./ProtectedRoute";

// import { UserRole } from "../types/auth.types";

// // ============================================
// // SUPER ADMIN
// // ============================================

// import SuperAdminLayout from "../components/layout/SuperAdminLayout";

// import SuperAdminDashboard from "../pages/superAdmin/SuperAdminDashboard";

// import Schools from "../pages/superAdmin/Schools";

// import SchoolDetails from "../pages/superAdmin/SchoolDetails";

// import AddSchool from "../pages/superAdmin/AddSchool";

// // ============================================
// // SCHOOL ADMIN LAYOUT
// // ============================================

// import SchoolAdminLayout from "../components/layout/SchoolAdminLayout";

// import SchoolAdminDashboard from "../pages/schoolAdmin/Dashboard";

// // ============================================
// // ACADEMIC
// // ============================================

// import Sessions from "../pages/schoolAdmin/academic/sessions/Sessions";

// import Classes from "../pages/schoolAdmin/academic/classes/Classes";

// import Sections from "../pages/schoolAdmin/academic/sections/Sections";

// import Subjects from "../pages/schoolAdmin/academic/subjects/Subjects";

// import SubjectAssignments from "../pages/schoolAdmin/academic/subjectAssignments/SubjectAssignments";

// import AcademicSessionDetails from "../pages/schoolAdmin/academic/sessions/Sessions";

// // ============================================
// // STUDENTS
// // ============================================

// import StudentList from "../pages/schoolAdmin/students/StudentList";

// import AddStudent from "../pages/schoolAdmin/students/AddStudent";

// import ClassWiseStudents from "../pages/schoolAdmin/students/ClassWiseStudents";

// import StudentDetails from "../pages/schoolAdmin/students/StudentDetails";

// // ============================================
// // TEACHERS
// // ============================================

// import Teachers from "../pages/schoolAdmin/teachers/Teachers";

// // ============================================
// // ATTENDANCE
// // ============================================

// import MarkAttendance from "../pages/schoolAdmin/Attendance/MarkAttendance";

// import DailyAttendance from "../pages/schoolAdmin/Attendance/DailyAttendance";

// import MonthlyAttendance from "../pages/schoolAdmin/Attendance/MonthlyAttendance";

// import UpdateAttendance from "../pages/schoolAdmin/Attendance/UpdateAttendance";

// import StudentAttendanceDetails from "../pages/schoolAdmin/Attendance/StudentAttendanceDetails";

// // ============================================
// // TIMETABLE
// // ============================================

// import WeeklyClassTimetable from "../pages/schoolAdmin/timetable/WeeklyClassTimetable";

// import DailyTimetable from "../pages/schoolAdmin/timetable/DailyTimetable";

// import TeacherTimetable from "../pages/schoolAdmin/timetable/TeacherTimetable";

// // ============================================
// // HOMEWORK
// // ============================================

// import HomeworkList from "../pages/schoolAdmin/homework/HomeworkList";

// import AddHomework from "../pages/schoolAdmin/homework/AddHomework";

// import HomeworkDetails from "../pages/schoolAdmin/homework/HomeworkDetails";

// import StudentSubmissions from "../pages/schoolAdmin/homework/StudentSubmissions";

// import EditHomework from "../pages/schoolAdmin/homework/EditHomework";
// import BulkPromotion from "../pages/schoolAdmin/students/BulkPromotion";
// import EditStudent from "../pages/schoolAdmin/students/EditStudent";
// import StudentElectiveAssignments from
//   "../pages/schoolAdmin/students/StudentElectiveAssignments";

// // ============================================
// // APP ROUTES
// // ============================================

// const AppRoutes = () => {
//   return (
//     <Routes>
//       {/* ========================================
//           LOGIN
//       ======================================== */}

//       <Route path="/login" element={<Login />} />

//       {/* ========================================
//           SUPER ADMIN
//       ======================================== */}

//       <Route
//         element={
//           <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
//             <SuperAdminLayout />
//           </ProtectedRoute>
//         }
//       >
//         {/* DASHBOARD */}

//         <Route
//           path="/super-admin/dashboard"
//           element={<SuperAdminDashboard />}
//         />

//         {/* SCHOOLS */}

//         <Route path="/super-admin/schools" element={<Schools />} />

//         {/* ADD SCHOOL */}

//         <Route path="/super-admin/schools/add" element={<AddSchool />} />

//         {/* SCHOOL DETAILS */}

//         <Route
//           path="/super-admin/schools/details"
//           element={<SchoolDetails />}
//         />
//       </Route>

//       {/* ========================================
//           SCHOOL ADMIN
//       ======================================== */}

//       <Route
//         element={
//           <ProtectedRoute allowedRoles={[UserRole.SCHOOL_ADMIN]}>
//             <SchoolAdminLayout />
//           </ProtectedRoute>
//         }
//       >
//         {/* ======================================
//             DASHBOARD
//         ====================================== */}
//         <Route
//           path="/school-admin/dashboard"
//           element={<SchoolAdminDashboard />}
//         />
//         {/* ======================================
//             ACADEMIC SESSION
//         ====================================== */}
//         <Route path="/school-admin/academic/sessions" element={<Sessions />} />
//         <Route
//           path="/school-admin/academic/sessions/:sessionId"
//           element={<AcademicSessionDetails />}
//         />
//         {/* ======================================
//             CLASSES
//         ====================================== */}
//         <Route path="/school-admin/academic/classes" element={<Classes />} />
//         {/* ======================================
//             SECTIONS
//         ====================================== */}
//         <Route path="/school-admin/academic/sections" element={<Sections />} />
//         {/* ======================================
//             SUBJECTS
//         ====================================== */}
//         <Route path="/school-admin/academic/subjects" element={<Subjects />} />
//         {/* ======================================
//             SUBJECT ASSIGNMENTS
//         ====================================== */}
//         <Route
//           path="/school-admin/academic/subject-assignments"
//           element={<SubjectAssignments />}
//         />
//         {/* ======================================
//             STUDENTS
//         ====================================== */}
//         {/* ALL STUDENTS */}
//         <Route path="/school-admin/students" element={<StudentList />} />
//         {/* ADD STUDENT */}
//         <Route path="/school-admin/students/add" element={<AddStudent />} />
//         {/* CLASS-WISE STUDENTS */}
//         <Route
//           path="/school-admin/students/class-wise"
//           element={<ClassWiseStudents />}
//         />
//         <Route
//           path="/school-admin/students/:studentId/edit"
//           element={<EditStudent />}
//         />
//         {/* STUDENT DETAILS */}
//         <Route
//           path="/school-admin/students/:studentId"
//           element={<StudentDetails />}
//         />
//         {/* ======================================
//             TEACHERS
//         ====================================== */}
//         <Route path="/school-admin/teachers" element={<Teachers />} />
//         {/* ======================================
//             ATTENDANCE
//         ====================================== */}
//         {/* MARK ATTENDANCE */}
//         <Route
//           path="/school-admin/attendance/mark"
//           element={<MarkAttendance />}
//         />
//         {/* DAILY ATTENDANCE */}
//         <Route
//           path="/school-admin/attendance/daily"
//           element={<DailyAttendance />}
//         />
//         {/* MONTHLY ATTENDANCE */}
//         <Route
//           path="/school-admin/attendance/monthly"
//           element={<MonthlyAttendance />}
//         />
//         {/* UPDATE ATTENDANCE */}
//         <Route
//           path="/school-admin/attendance/update"
//           element={<UpdateAttendance />}
//         />
//         {/* STUDENT ATTENDANCE DETAILS */}
//         <Route
//           path="/school-admin/attendance/student/:studentId"
//           element={<StudentAttendanceDetails />}
//         />
//         {/* ======================================
//             TIMETABLE
//         ====================================== */}
//         {/* DEFAULT TIMETABLE ROUTE */}
//         <Route
//           path="/school-admin/timetable"
//           element={<Navigate to="/school-admin/timetable/weekly" replace />}
//         />
//         {/* WEEKLY TIMETABLE */}
//         <Route
//           path="/school-admin/timetable/weekly"
//           element={<WeeklyClassTimetable />}
//         />
//         {/* DAILY TIMETABLE */}
//         <Route
//           path="/school-admin/timetable/daily"
//           element={<DailyTimetable />}
//         />
//         {/* TEACHER TIMETABLE */}
//         <Route
//           path="/school-admin/timetable/teacher"
//           element={<TeacherTimetable />}
//         />
//         {/* ======================================
//             HOMEWORK
//         ====================================== */}
//         {/* HOMEWORK LIST */}
//         <Route path="/school-admin/homework" element={<HomeworkList />} />
//         attendance/daily
//         {/* ADD HOMEWORK */}
//         <Route path="/school-admin/homework/add" element={<AddHomework />} />
//         {/* HOMEWORK DETAILS */}
//         <Route
//           path="/school-admin/homework/:homeworkId"
//           element={<HomeworkDetails />}
//         />
//         {/* STUDENT SUBMISSIONS */}
//         <Route
//           path="/school-admin/homework/:homeworkId/submissions"
//           element={<StudentSubmissions />}
//         />
//         {/* EDIT HOMEWORK */}
//         <Route
//           path="/school-admin/homework/:homeworkId/edit"
//           element={<EditHomework />}
//         />
//         <Route
//           path="/school-admin/students/bulk-promotion"
//           element={<BulkPromotion />}
//         />

//         {/* STUDENT ELECTIVE SUBJECTS */}

// <Route
//   path="/school-admin/students/:studentId/electives"
//   element={<StudentElectiveAssignments />}
// />
//       </Route>

//       {/* ========================================
//           UNKNOWN URL
//       ======================================== */}

//       <Route path="*" element={<Navigate to="/login" replace />} />
//     </Routes>
//   );
// };

// export default AppRoutes;



import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/auth/Login";
import ProtectedRoute from "./ProtectedRoute";
import { UserRole } from "../types/auth.types";

import SuperAdminLayout from "../components/layout/SuperAdminLayout";
import SuperAdminDashboard from "../pages/superAdmin/SuperAdminDashboard";
import Schools from "../pages/superAdmin/Schools";
import SchoolDetails from "../pages/superAdmin/SchoolDetails";
import AddSchool from "../pages/superAdmin/AddSchool";

import SchoolAdminLayout from "../components/layout/SchoolAdminLayout";
import SchoolAdminDashboard from "../pages/schoolAdmin/Dashboard";

import Sessions from "../pages/schoolAdmin/academic/sessions/Sessions";
import Classes from "../pages/schoolAdmin/academic/classes/Classes";
import Sections from "../pages/schoolAdmin/academic/sections/Sections";
import Subjects from "../pages/schoolAdmin/academic/subjects/Subjects";
import SubjectAssignments from "../pages/schoolAdmin/academic/subjectAssignments/SubjectAssignments";
import AcademicSessionDetails from "../pages/schoolAdmin/academic/sessions/Sessions";

import StudentList from "../pages/schoolAdmin/students/StudentList";
import AddStudent from "../pages/schoolAdmin/students/AddStudent";
import ClassWiseStudents from "../pages/schoolAdmin/students/ClassWiseStudents";
import StudentDetails from "../pages/schoolAdmin/students/StudentDetails";
import EditStudent from "../pages/schoolAdmin/students/EditStudent";
import BulkPromotion from "../pages/schoolAdmin/students/BulkPromotion";
import StudentElectiveAssignments from "../pages/schoolAdmin/students/StudentElectiveAssignments";

import Teachers from "../pages/schoolAdmin/teachers/Teachers";

import MarkAttendance from "../pages/schoolAdmin/Attendance/MarkAttendance";
import DailyAttendance from "../pages/schoolAdmin/Attendance/DailyAttendance";
import MonthlyAttendance from "../pages/schoolAdmin/Attendance/MonthlyAttendance";
import UpdateAttendance from "../pages/schoolAdmin/Attendance/UpdateAttendance";
import StudentAttendanceDetails from "../pages/schoolAdmin/Attendance/StudentAttendanceDetails";

import MarkTeacherAttendance from "../pages/schoolAdmin/teacherAttendance/MarkTeacherAttendance";
import DailyTeacherAttendance from "../pages/schoolAdmin/teacherAttendance/DailyTeacherAttendance";
import MonthlyTeacherAttendance from "../pages/schoolAdmin/teacherAttendance/MonthlyTeacherAttendance";
import TeacherAttendanceDetails from "../pages/schoolAdmin/teacherAttendance/TeacherAttendanceDetails";

import WeeklyClassTimetable from "../pages/schoolAdmin/timetable/WeeklyClassTimetable";
import DailyTimetable from "../pages/schoolAdmin/timetable/DailyTimetable";
import TeacherTimetable from "../pages/schoolAdmin/timetable/TeacherTimetable";

import HomeworkList from "../pages/schoolAdmin/homework/HomeworkList";
import AddHomework from "../pages/schoolAdmin/homework/AddHomework";
import HomeworkDetails from "../pages/schoolAdmin/homework/HomeworkDetails";
import StudentSubmissions from "../pages/schoolAdmin/homework/StudentSubmissions";
import EditHomework from "../pages/schoolAdmin/homework/EditHomework";
import MyTeacherAttendance from "../pages/schoolAdmin/teacherAttendance/MyTeacherAttendance";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
            <SuperAdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
        <Route path="/super-admin/schools" element={<Schools />} />
        <Route path="/super-admin/schools/add" element={<AddSchool />} />
        <Route path="/super-admin/schools/details" element={<SchoolDetails />} />
      </Route>

      <Route
        element={
          <ProtectedRoute allowedRoles={[UserRole.SCHOOL_ADMIN]}>
            <SchoolAdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/school-admin/dashboard" element={<SchoolAdminDashboard />} />

        <Route path="/school-admin/academic/sessions" element={<Sessions />} />
        <Route path="/school-admin/academic/sessions/:sessionId" element={<AcademicSessionDetails />} />
        <Route path="/school-admin/academic/classes" element={<Classes />} />
        <Route path="/school-admin/academic/sections" element={<Sections />} />
        <Route path="/school-admin/academic/subjects" element={<Subjects />} />
        <Route path="/school-admin/academic/subject-assignments" element={<SubjectAssignments />} />

        <Route path="/school-admin/students" element={<StudentList />} />
        <Route path="/school-admin/students/add" element={<AddStudent />} />
        <Route path="/school-admin/students/class-wise" element={<ClassWiseStudents />} />
        <Route path="/school-admin/students/bulk-promotion" element={<BulkPromotion />} />
        <Route path="/school-admin/students/:studentId/electives" element={<StudentElectiveAssignments />} />
        <Route path="/school-admin/students/:studentId/edit" element={<EditStudent />} />
        <Route path="/school-admin/students/:studentId" element={<StudentDetails />} />

        <Route path="/school-admin/teachers" element={<Teachers />} />

        <Route
          path="/school-admin/teacher-attendance"
          element={<Navigate to="/school-admin/teacher-attendance/daily" replace />}
        />
        <Route path="/school-admin/teacher-attendance/mark" element={<MarkTeacherAttendance />} />
        <Route path="/school-admin/teacher-attendance/daily" element={<DailyTeacherAttendance />} />
        <Route path="/school-admin/teacher-attendance/monthly" element={<MonthlyTeacherAttendance />} />
        <Route path="/school-admin/teacher-attendance/teacher/:teacherId" element={<TeacherAttendanceDetails />} />
          <Route
    path="/teacher/attendance"
    element={
      <MyTeacherAttendance/>
    }
  />

        <Route
          path="/school-admin/attendance"
          element={<Navigate to="/school-admin/attendance/daily" replace />}
        />
        <Route path="/school-admin/attendance/mark" element={<MarkAttendance />} />
        <Route path="/school-admin/attendance/daily" element={<DailyAttendance />} />
        <Route path="/school-admin/attendance/monthly" element={<MonthlyAttendance />} />
        <Route path="/school-admin/attendance/update" element={<UpdateAttendance />} />
        <Route path="/school-admin/attendance/student/:studentId" element={<StudentAttendanceDetails />} />

        <Route
          path="/school-admin/timetable"
          element={<Navigate to="/school-admin/timetable/weekly" replace />}
        />
        <Route path="/school-admin/timetable/weekly" element={<WeeklyClassTimetable />} />
        <Route path="/school-admin/timetable/daily" element={<DailyTimetable />} />
        <Route path="/school-admin/timetable/teacher" element={<TeacherTimetable />} />

        <Route path="/school-admin/homework" element={<HomeworkList />} />
        <Route path="/school-admin/homework/add" element={<AddHomework />} />
        <Route path="/school-admin/homework/:homeworkId" element={<HomeworkDetails />} />
        <Route path="/school-admin/homework/:homeworkId/submissions" element={<StudentSubmissions />} />
        <Route path="/school-admin/homework/:homeworkId/edit" element={<EditHomework />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
