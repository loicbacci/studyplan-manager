import { useAuth } from "../lib/auth";
import { Navigate, useLocation } from "react-router-dom";
import {useSelector} from "react-redux";
import {authSlice, selectStatus} from "../redux/authSlice";
import {store} from "../redux/store";

interface RequireAuthProps {
  children: React.ReactNode
}

const RequireAuth = (props: RequireAuthProps) => {
  const { children } = props;
  const status = useSelector(selectStatus);
  const location = useLocation();

  if (status !== "loggedIn") {
    if (location.pathname !== "/login") {
      return <Navigate to="/login" state={{ from: location }} replace/>;
    }
  }

  return <>{children}</>;
};

export default RequireAuth;