import React, { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import LayoutHeader from "./LayoutHeader";
import { AuthContext } from "../context/auth/AuthContext";
import { Container } from "@mui/material";

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const { role } = authCtx?.user || {};

  useEffect(() => {
    if (role === "admin") navigate("/admin");
    if (role === "player") navigate("/player");
  }, [navigate, role]);

  return (
    <Container
      className="min-h-screen"
      sx={{ display: "flex", flexDirection: "column" }}
    >
      <LayoutHeader />
      <Container component={"main"} sx={{ flexGrow: 1 }}>
        <Outlet />
      </Container>
    </Container>
  );
};

export default Layout;
