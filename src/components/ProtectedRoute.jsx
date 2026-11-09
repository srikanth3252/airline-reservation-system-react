
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const userid = localStorage.getItem("userid");

  if (!userid) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
