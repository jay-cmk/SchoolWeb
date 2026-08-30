import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/auth.slice";
import schoolReducer from "../features/schools/school.slice";
import superAdminReducer from "../features/superAdmin/superAdmin.slice";
import schoolAdminReducer
  from "../features/schoolAdmins/schoolAdmin.slice";
  import sessionReducer
  from "../features/academic/sessions/session.slice";
  import classReducer from '../features/academic/classes/class.slice';
import sectionReducer
  from "../features/academic/sections/section.slice";

import subjectReducer
  from "../features/academic/subjects/subject.slice";  
import teacherReducer
  from "../features/teachers/teacher.slice";  

import subjectAssignmentReducer
  from "../features/academic/subjectAssignments/subjectAssignment.slice";  

 import attendanceReducer
  from "../features/attendance/attendance.slice"; 

  import timetableReducer
  from "../features/timetable/timetable.slice";

import homeworkReducer from "../features/homework/homework.slice";  

import homeworkSubmissionReducer
  from "../features/homework/homeworkSubmission.slice";

import schoolAdminDashboardReducer
  from "../features/schoolAdminDashboard/schoolAdminDashboard.slice";  




export const store = configureStore({
  reducer: {
  auth: authReducer,
  schools: schoolReducer,
  superAdmin: superAdminReducer,
  schoolAdmins:
      schoolAdminReducer,
  sessions: sessionReducer,  
  classes: classReducer,  

  sections: sectionReducer,
  subjects: subjectReducer,
  teachers: teacherReducer,
  
  subjectAssignments:
        subjectAssignmentReducer,
  attendance:
    attendanceReducer,  
    
  timetable:
        timetableReducer,  
    
   homework: homeworkReducer, 
   
   homeworkSubmission: homeworkSubmissionReducer, 

   schoolAdminDashboard:
  schoolAdminDashboardReducer,
  },

});

export type RootState =
  ReturnType<typeof store.getState>;

export type AppDispatch =
  typeof store.dispatch;