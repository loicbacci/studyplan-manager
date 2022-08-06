import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuthStatus } from "../redux/authSlice";

interface RequireAuthProps {
  children: React.ReactNode
}

const RequireAuth = (props: RequireAuthProps) => {
  const { children } = props;
  const status = useSelector(selectAuthStatus);
  const location = useLocation();

  if (status !== "loggedIn") {
    if (location.pathname !== "/login") {
      return <Navigate to="/login" state={{ from: location }} replace/>;
    }
  }

  return <>{children}</>;
};

export default RequireAuth;