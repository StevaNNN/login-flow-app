import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { forgotPassword } from "../../api";

import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await forgotPassword(email);
      setMessage(res.data.message);
    } catch (err) {
      if (err instanceof Error)
        setMessage(`Error sending reset link: ${err?.message}`);
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
        Forgot password
      </Typography>
      <Stack
        onSubmit={handleSubmit}
        component={"form"}
        spacing={2}
        direction="column"
      >
        <TextField
          type="email"
          value={email}
          label="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email"
        />
        <Button size="large" variant="contained" type="submit">
          Send Reset Link
        </Button>
        <Button
          size="large"
          variant="outlined"
          onClick={() => navigate("/login")}
        >
          Back to login
        </Button>
      </Stack>
      {message && <p className="text-center mt-4">{message}</p>}
    </Stack>
  );
};

export default ForgotPasswordPage;
