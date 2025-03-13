import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFoundPage from "./pages/NotFoundPage";
import ForgotPasswordPage from "./feature/login/ForgotPassPage";
import LoginPage from "./feature/login/LoginPage";
import RegisterPage from "./feature/login/RegisterPage";
import ResetPasswordPage from "./feature/login/ResetPassPage";
import Layout from "./components/Layout";
import AdminPage from "./feature/admin/AdminPage";
import PlayerPage from "./feature/player/PlayerPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/forgotPassword",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/resetPassword/:token",
    element: <ResetPasswordPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/admin",
        element: (
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/player",
        element: (
          <ProtectedRoute role="player">
            <PlayerPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
