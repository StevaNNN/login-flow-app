import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import InfoPage from "./pages/InfoPage";
import NotFoundPage from "./pages/NotFoundPage";
import ForgotPasswordPage from "./feature/login/ForgotPassPage";
import LoginPage from "./feature/login/LoginPage";
import RegisterPage from "./feature/login/RegisterPage";
import ResetPasswordPage from "./feature/login/ResetPassPage";
import UserPage from "./pages/UserPage";

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
    path: "/user",
    element: (
      <ProtectedRoute>
        <UserPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/info",
    element: (
      <ProtectedRoute>
        <InfoPage />{" "}
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
