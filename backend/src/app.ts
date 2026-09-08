// import express from "express";
// import cors from "cors";
// import helmet from "helmet";
// import morgan from "morgan";
// import cookieParser from "cookie-parser";

// const app = express();

// app.use(
//   cors({
//     origin: true,
//     credentials: true,
//   })
// );

// app.use(helmet());

// app.use(morgan("dev"));

// app.use(express.json());

// app.use(express.urlencoded({ extended: true }));

// app.use(cookieParser());

// app.get("/api/v1/health", (_req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "School SaaS API is running",
//     timestamp: new Date().toISOString(),
//   });
// });

// export default app;




// import express from "express";
// import cors from "cors";
// import helmet from "helmet";
// import morgan from "morgan";
// import cookieParser from "cookie-parser";

// import authRoutes from "./modules/auth/auth.routes";
// import superAdminRoutes from "./modules/super-admin/superAdmin.routes";

// import schoolAdminRoutes from "./modules/schoolAdmin/schoolAdmin.routes";
// import studentRoutes from "./modules/students/student.routes";
// import academicSessionRoutes
//   from "./modules/academic/academicSession.routes";
// import teacherRoutes
//   from "./modules/teachers/teacher.routes";

// import attendanceRoutes
//   from "./modules/attendance/attendance.routes";  

// import homeworkRoutes
//   from "./modules/homework/homework.routes";  

// import homeworkSubmissionRoutes
//   from "./modules/homework/homeworkSubmission.routes";  

// const app = express();

// app.use(
//   cors({
//     origin: true,
//     credentials: true,
//   }),
// );

// app.use(helmet());

// app.use(morgan("dev"));

// app.use(express.json());

// app.use(express.urlencoded({ extended: true }));

// app.use(cookieParser());

// app.get("/api/v1/health", (_req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "School SaaS API is running",
//     timestamp: new Date().toISOString(),
//   });
// });

// app.use("/api/v1/auth", authRoutes);

// app.use("/api/v1/super-admin", superAdminRoutes);

// app.use("/api/v1/school-admin", schoolAdminRoutes);

// // Health check
// app.get("/api/v1/health", (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "School ERP API is running",
//   });
// });

// // Student API
// app.use("/api/v1/students", studentRoutes);

// // Academic API




// app.use(
//   "/api/v1/academic",
//   academicRoutes
// );





// app.use(
//   "/api/v1/teachers",
//   teacherRoutes
// );


// app.use(
//   "/api/v1/attendance",
//   attendanceRoutes
// );




// app.use(
//   "/api/v1/timetable",
//   timetableRoutes
// );


// app.use(
//   "/api/v1/homework",
//   homeworkRoutes
// );

// app.use(
//   "/api/v1/homework-submissions",
//   homeworkSubmissionRoutes
// );
// export default app;










// import express from "express";
// import cors from "cors";
// import helmet from "helmet";
// import morgan from "morgan";
// import cookieParser from "cookie-parser";

// // ============================================
// // ROUTES
// // ============================================

// import authRoutes from "./modules/auth/auth.routes";

// import superAdminRoutes from "./modules/super-admin/superAdmin.routes";

// import schoolAdminRoutes from "./modules/schoolAdmin/schoolAdmin.routes";

// import academicRoutes from "./modules/academic/academic.routes";

// import teacherRoutes from "./modules/teachers/teacher.routes";

// import attendanceRoutes from "./modules/attendance/attendance.routes";

// import studentRoutes from "./modules/students/student.routes";

// import timetableRoutes from "./modules/timetable/timetable.routes";

// import homeworkRoutes from "./modules/homework/homework.routes";

// import homeworkSubmissionRoutes from "./modules/homework/homeworkSubmission.routes";

// import feeRoutes from "./modules/fees/fee.routes";


// // ============================================
// // APP
// // ============================================

// const app = express();


// // ============================================
// // MIDDLEWARES
// // ============================================

// app.use(
//   cors({
//     origin: true,
//     credentials: true,
//   })
// );

// app.use(helmet());

// app.use(morgan("dev"));

// app.use(express.json());

// app.use(
//   express.urlencoded({
//     extended: true,
//   })
// );

// app.use(cookieParser());


// // ============================================
// // HEALTH CHECK
// // ============================================

// app.get(
//   "/api/v1/health",
//   (_req, res) => {
//     res.status(200).json({
//       success: true,
//       message: "School SaaS API is running",
//       timestamp: new Date().toISOString(),
//     });
//   }
// );


// // ============================================
// // AUTH
// // ============================================

// app.use(
//   "/api/v1/auth",
//   authRoutes
// );


// // ============================================
// // SUPER ADMIN
// // ============================================

// app.use(
//   "/api/v1/super-admin",
//   superAdminRoutes
// );


// // ============================================
// // SCHOOL ADMIN
// // ============================================

// app.use(
//   "/api/v1/school-admin",
//   schoolAdminRoutes
// );


// // ============================================
// // ACADEMIC
// // ============================================

// app.use(
//   "/api/v1/academic",
//   academicRoutes
// );


// // ============================================
// // TEACHERS
// // ============================================

// app.use(
//   "/api/v1/teachers",
//   teacherRoutes
// );


// // ============================================
// // STUDENTS
// // ============================================

// app.use(
//   "/api/v1/students",
//   studentRoutes
// );


// // ============================================
// // ATTENDANCE
// // ============================================

// app.use(
//   "/api/v1/attendance",
//   attendanceRoutes
// );


// // ============================================
// // TIMETABLE
// // ============================================

// app.use(
//   "/api/v1/timetable",
//   timetableRoutes
// );


// // ============================================
// // HOMEWORK
// // ============================================

// app.use(
//   "/api/v1/homework",
//   homeworkRoutes
// );


// // ============================================
// // HOMEWORK SUBMISSIONS
// // ============================================

// app.use(
//   "/api/v1/homework-submissions",
//   homeworkSubmissionRoutes
// );


// // ============================================
// // FEES
// // ============================================

// app.use(
//   "/api/v1/fees",
//   feeRoutes
// );


// export default app;







import express from "express";
import path from "path";

import cors from "cors";

import helmet from "helmet";

import morgan from "morgan";

import cookieParser from "cookie-parser";


// ============================================
// ROUTES
// ============================================

import authRoutes from "./modules/auth/auth.routes";

import superAdminRoutes from "./modules/super-admin/superAdmin.routes";

import schoolAdminRoutes from "./modules/schoolAdmin/schoolAdmin.routes";

import academicRoutes from "./modules/academic/academic.routes";

import teacherRoutes from "./modules/teachers/teacher.routes";

import attendanceRoutes from "./modules/attendance/attendance.routes";

import studentRoutes from "./modules/students/student.routes";

import timetableRoutes from "./modules/timetable/timetable.routes";

import homeworkRoutes from "./modules/homework/homework.routes";

import homeworkSubmissionRoutes from "./modules/homework/homeworkSubmission.routes";

import feeRoutes from "./modules/fees/fee.routes";

import studentPromotionRoutes
  from "./modules/students/studentPromotion.routes";

import locationRoutes from "./modules/master/location/location.routes";  


// ============================================
// APP
// ============================================

const app = express();


// ============================================
// MIDDLEWARES
// ============================================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());


// ============================================
// STATIC UPLOADS
// Student photos:
// /uploads/students/filename.jpg
// ============================================

app.use(
  "/uploads",
  express.static(
    path.join(
      process.cwd(),
      "uploads"
    )
  )
);


// ============================================
// HEALTH CHECK
// ============================================

app.get(
  "/api/v1/health",

  (_req, res) => {
    res.status(200).json({
      success: true,
      message: "School SaaS API is running",
      timestamp: new Date().toISOString(),
    });
  }
);


// ============================================
// AUTH
// ============================================

app.use(
  "/api/v1/auth",
  authRoutes
);


// ============================================
// SUPER ADMIN
// ============================================

app.use(
  "/api/v1/super-admin",
  superAdminRoutes
);


// ============================================
// SCHOOL ADMIN
// ============================================

app.use(
  "/api/v1/school-admin",
  schoolAdminRoutes
);


// ============================================
// ACADEMIC
// ============================================

app.use(
  "/api/v1/academic",
  academicRoutes
);


// ============================================
// TEACHERS
// ============================================

app.use(
  "/api/v1/teachers",
  teacherRoutes
);


// ============================================
// STUDENTS
// ============================================
app.use(
  "/api/v1/students",
  studentPromotionRoutes
);


app.use(
  "/api/v1/students",
  studentRoutes
);


// ============================================
// ATTENDANCE
// ============================================

app.use(
  "/api/v1/attendance",
  attendanceRoutes
);


// ============================================
// TIMETABLE
// ============================================

app.use(
  "/api/v1/timetable",
  timetableRoutes
);


// ============================================
// HOMEWORK
// ============================================

app.use(
  "/api/v1/homework",
  homeworkRoutes
);


// ============================================
// HOMEWORK SUBMISSIONS
// ============================================

app.use(
  "/api/v1/homework-submissions",
  homeworkSubmissionRoutes
);


app.use(
  "/api/v1/master/locations",
  locationRoutes
);
// ============================================
// FEES
// ============================================

app.use(
  "/api/v1/fees",
  feeRoutes
);




export default app;