import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const NotFoundPage: React.FC = () => {
  const userLoggedIn = useAuth();
  return (
    <Stack
      spacing={4}
      direction="column"
      alignContent={"center"}
      maxWidth={600}
      margin="auto"
      height={"100vh"}
      justifyContent="center"
      p={2}
    >
      <Typography
        align="center"
        variant="h2"
        color="primary"
        style={{ fontWeight: 700 }}
      >
        404 - Page Not Found
      </Typography>
      <Typography align="center">
        Sorry, the page you are looking for does not exist.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to={`${userLoggedIn ? "/" : "/login"}`}
      >
        Go back to Home
      </Button>
    </Stack>
  );
};

export default NotFoundPage;
