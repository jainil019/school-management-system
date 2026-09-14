import { Navigate, Outlet, useLocation } from "react-router-dom";

type Role = "admin" | "student" | "teacher" | "parent";

interface ProtectedRouteProps {
  allowedRoles: Role[];
}

export default function ProtectedRoute({
  allowedRoles,
}: ProtectedRouteProps) {
  const location = useLocation();

  const role = localStorage.getItem("school_role") as Role | null;

  // Not logged in
  if (!role) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // Invalid role
  if (!allowedRoles.includes(role)) {
    const dashboardByRole: Record<Role, string> = {
      admin: "/admin",
      student: "/student",
      teacher: "/teacher",
      parent: "/parent",
    };

    return (
      <Navigate
        to={dashboardByRole[role] || "/login"}
        replace
      />
    );
  }

  return <Outlet />;
}