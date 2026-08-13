import "./App.css";
import { useEffect } from "react";

import AppRoutes from "./routes/AppRoutes";

import { useAppDispatch } from "./app/hooks";
import { loadUser } from "./features/auth/auth.slice";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;


