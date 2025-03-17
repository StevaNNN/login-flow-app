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
      sx={{ display: "flex", flexDirection: "column" }}
      maxWidth={false}
      disableGutters
    >
      <LayoutHeader />
      <Container
        component={"main"}
        sx={{ flexGrow: 1, py: 3, marginTop: "72px" }}
      >
        <Outlet />
      </Container>
    </Container>
  );
};

export default Layout;
