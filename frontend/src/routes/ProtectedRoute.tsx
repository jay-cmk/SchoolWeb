import { Navigate } from "react-router-dom";

import { useAppSelector } from "../app/hooks";
import { UserRole } from "../types/auth.types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {
  const {
    accessToken,
    user,
    authInitialized,
  } = useAppSelector(
    (state) => state.auth
  );

  // Auth check abhi complete nahi hua
  if (!authInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Login nahi hai
  if (!accessToken || !user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // User ka role allowed nahi hai
  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;