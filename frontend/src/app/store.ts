import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/auth.slice";
import schoolReducer from "../features/schools/school.slice";
import superAdminReducer from "../features/superAdmin/superAdmin.slice";
import schoolAdminReducer
  from "../features/schoolAdmins/schoolAdmin.slice";
  import sessionReducer
  from "../features/academic/sessions/session.slice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    schools: schoolReducer,
    superAdmin: superAdminReducer,
    schoolAdmins:
      schoolAdminReducer,
  sessions: sessionReducer,    
  },
});

export type RootState =
  ReturnType<typeof store.getState>;

export type AppDispatch =
  typeof store.dispatch;