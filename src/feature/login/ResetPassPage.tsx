import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../../api";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";

const ResetPasswordPage = () => {
  const { token } = useParams<string>();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await resetPassword(token, newPassword);
      setMessage(res.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 300);
    } catch (err) {
      if (err instanceof Error) setMessage("Error resetting password");
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
        variant={"h2"}
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
      <Snackbar autoHideDuration={6000} open={!!message} message={message} />
    </Stack>
  );
};

export default ResetPasswordPage;
