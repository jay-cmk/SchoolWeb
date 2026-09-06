import { Router } from "express";

import academicSessionRoutes
  from "./academicSession.routes";

import classRoutes
  from "./classes/class.routes";

import sectionRoutes
  from "./sections/section.routes";

  import subjectRoutes
  from "./subjects/subject.routes";

import subjectAssignmentRoutes
  from "./subjectAssignments/subjectAssignment.routes";  

const router = Router();

router.use(
  "/sessions",
  academicSessionRoutes
);

router.use(
  "/classes",
  classRoutes
);

router.use(
  "/sections",
  sectionRoutes
);

router.use(
  "/subjects",
  subjectRoutes
);

router.use(
  "/subject-assignments",
  subjectAssignmentRoutes
);

export default router;