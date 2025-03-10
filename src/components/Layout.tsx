import React, { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import LayoutHeader from "./LayoutHeader";
import { AuthContext } from "../context/auth/AuthContext";

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const { role } = authCtx?.user || {};

  useEffect(() => {
    if (role === "admin") navigate("/admin");
    if (role === "player") navigate("/player");
  }, [navigate, role]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <LayoutHeader />
      <main className="flex-grow p-4 mt-16 mb-16">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
