import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingScreen from "./LoadingScreen";

const RoleRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleRoute;
