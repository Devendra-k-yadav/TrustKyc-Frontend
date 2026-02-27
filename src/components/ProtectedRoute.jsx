import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth } from "../features/auth/authSlice";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, loadingUser } = useSelector(selectAuth);
  const location = useLocation();

  if (loadingUser) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h3>Loading...</h3>
      </div>
    );
  }

  // ❌ Login नहीं है
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const role = user.role?.toLowerCase();

  // ❌ Role allowed नहीं है
  if (!allowedRoles.includes(role)) {
    if (role === "admin") return <Navigate to="/" replace />;
    if (role === "client") return <Navigate to="/dashboard" replace />;
    if (role === "manager") return <Navigate to="/manager/dashboard" replace />;

    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
