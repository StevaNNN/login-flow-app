import React, { useContext } from "react";
import { AuthContext } from "../context/auth/AuthContext";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";

const LayoutHeader: React.FC = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAddNewScore = () => {
    console.log("Add logic for adding new score");
  };
  const handleLogout = () => {
    authContext?.logout();
    navigate("/login");
  };

  return (
    <Container
      component="header"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 2,
        maxWidth: "100%",
      }}
    >
      <Typography variant="h3" color="primary" sx={{ fontWeight: "bold" }}>
        Tennis Kragujevac
      </Typography>
      <Button variant="contained" onClick={handleAddNewScore}>
        Add new score
      </Button>
      <Box display={"flex"} alignItems={"center"} gap={2}>
        <Typography>{authContext?.user?.fullName}</Typography>
        <Button variant="contained" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default LayoutHeader;
