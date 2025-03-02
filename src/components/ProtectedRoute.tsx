import { PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

type ProtectedRouteProps = PropsWithChildren;

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const userLoggedIn = useAuth();

  useEffect(() => {
    if (!userLoggedIn) {
      navigate("/login", { replace: true });
    }
  }, [navigate, userLoggedIn]);

  return children;
}
