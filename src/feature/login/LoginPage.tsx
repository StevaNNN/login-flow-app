import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { USER } from "../../Types";
import { AuthContext } from "../../context/auth/AuthContext";
import { loginUser } from "../../api";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const LoginPage = () => {
  const [email, setEmail] = useState<USER["email"]>("");
  const [password, setPassword] = useState("");
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser({ email, password });
      authContext?.login({ email });
      navigate("/");
    } catch (err) {
      console.error(err);
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
        variant={"h1"}
      >
        Login
      </Typography>
      <Stack
        onSubmit={handleSubmit}
        component={"form"}
        spacing={2}
        direction="column"
      >
        <TextField
          type="email"
          id="email"
          required
          label="Email"
          placeholder="Email"
          value={email}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          type="password"
          id="password"
          placeholder="Password"
          label="Password"
          autoComplete="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button size="large" variant="contained" type="submit">
          Login
        </Button>
      </Stack>
      <Stack direction="column" justifyContent="center" spacing={2}>
        <Button
          variant="outlined"
          type="button"
          size="large"
          onClick={() => navigate("/register")}
        >
          Register
        </Button>
        <Button
          variant="outlined"
          type="button"
          size="large"
          onClick={() => navigate("/forgotPassword")}
        >
          Forgot Password
        </Button>
      </Stack>
    </Stack>
  );
};

export default LoginPage;
