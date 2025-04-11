import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { AuthContext } from "../context/auth/AuthContext";
import { RootState } from "../redux/store";
import { setDarkMode } from "../redux/slices/appSlice";

import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LogoutIcon from "@mui/icons-material/Logout";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";

import Logo from "./logo.png";
import { NavLink } from "react-router-dom";

const LayoutHeader: React.FC = () => {
  const { darkMode } = useSelector((state: RootState) => state.appState);
  const userData = useSelector((state: RootState) => state.player.userData);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    authContext?.logout();
    navigate("/login");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        py: 2,
        px: 4,
        display: "",
      }}
    >
      <img
        src={Logo}
        alt="appLogo"
        width={100}
        height={40}
        style={{ objectFit: "cover" }}
      />

      <Box display={"flex"} gap={2}>
        <NavLink to={"/matchesTable"}>
          <Typography color="info">Results</Typography>
        </NavLink>
        {userData.role === "admin" && (
          <NavLink to={"/admin"}>
            <Typography color="info">Dashboard</Typography>
          </NavLink>
        )}
        {userData.role === "player" && (
          <NavLink to={"/player"}>
            <Typography color="info">Player Info</Typography>
          </NavLink>
        )}
      </Box>

      <Box display={"flex"} alignItems={"center"} gap={2}>
        <Typography>{userData?.fullName}</Typography>
        <Tooltip
          title={darkMode ? "Get back to the light" : "Go to the dark side"}
        >
          <IconButton
            onClick={() => dispatch(setDarkMode(darkMode ? false : true))}
          >
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Logout">
          <IconButton onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </AppBar>
  );
};

export default LayoutHeader;
