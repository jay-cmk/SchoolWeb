import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/auth.slice";
import schoolReducer from "../features/schools/school.slice";
import superAdminReducer from "../features/superAdmin/superAdmin.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    schools: schoolReducer,
    superAdmin: superAdminReducer,
  },
});

export type RootState =
  ReturnType<typeof store.getState>;

export type AppDispatch =
  typeof store.dispatch;