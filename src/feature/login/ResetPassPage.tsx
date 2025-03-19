import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { setSnackBar } from "../../redux/slices/appSlice";
import { resetPassword } from "../../api";

import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const ResetPasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token } = useParams<string>();
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await resetPassword(token, newPassword);
      dispatch(setSnackBar({ message: res.data.message }));
      setTimeout(() => {
        navigate("/login");
      }, 300);
    } catch (err) {
      if (err instanceof Error)
        dispatch(setSnackBar({ message: "Error resetting password" }));
    }
  };

  return (
    <Stack
      spacing={4}
      direction="column"
      maxWidth={600}
      margin="auto"
      height={"100vh"}
      justifyContent="center"
      p={2}
    >
      <Typography
        color="primary"
        fontWeight="bold"
        align="center"
        variant={"h3"}
      >
        Reset Password
      </Typography>
      <Stack
        onSubmit={handleSubmit}
        component={"form"}
        spacing={2}
        direction="column"
      >
        <TextField
          type="password"
          label="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          placeholder="Enter new password"
        />
        <Button size="large" variant="contained" type="submit">
          Reset Password
        </Button>
      </Stack>
    </Stack>
  );
};

export default ResetPasswordPage;
