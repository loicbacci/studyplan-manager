import { useAuth } from "../lib/auth";
import { Navigate, useLocation } from "react-router-dom";

interface RequireAuthProps {
  children: React.ReactNode
}

const RequireAuth = (props: RequireAuthProps) => {
  const { children } = props;
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    if (location.pathname !== "/login") {
      return <Navigate to="/login" state={{ from: location }} replace/>;
    }
  }

  return <>{children}</>;
};

export default RequireAuth;