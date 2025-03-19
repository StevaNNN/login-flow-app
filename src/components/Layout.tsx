import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import LayoutHeader from "./LayoutHeader";
import { RootState } from "../redux/store";

import { Container } from "@mui/material";

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const userData = useSelector((state: RootState) => state.player.userData);

  useEffect(() => {
    if (userData) {
      if (userData.role === "admin") navigate("/admin");
      if (userData.role === "player") navigate("/player");
    }
  }, [navigate, userData]);

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
