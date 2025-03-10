import { PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

type ProtectedRouteProps = PropsWithChildren & {
  role?: "admin" | "player";
};

export default function ProtectedRoute({
  children,
  role,
}: ProtectedRouteProps) {
  const navigate = useNavigate();
  const userLoggedIn = useAuth();

  useEffect(() => {
    if (!userLoggedIn) {
      navigate("/login", { replace: true });
    }
    if (role === "admin") {
      navigate("/admin", { replace: true });
    }
    if (role === "player") {
      navigate("/player", { replace: true });
    }
  }, [navigate, role, userLoggedIn]);

  return children;
}
