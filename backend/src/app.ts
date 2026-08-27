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

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./modules/auth/auth.routes";
import superAdminRoutes from "./modules/super-admin/superAdmin.routes";

import schoolAdminRoutes from "./modules/schoolAdmin/schoolAdmin.routes";

import studentRoutes from "./modules/students/student.routes";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "School SaaS API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/super-admin", superAdminRoutes);

app.use("/api/v1/school-admin", schoolAdminRoutes);

// Health check
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "School ERP API is running",
  });
});

// Student API
app.use("/api/v1/students", studentRoutes);

export default app;
