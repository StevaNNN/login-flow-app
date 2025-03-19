import { SyntheticEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { USER } from "../../Types";
import { registerUser, uploadPicture } from "../../api";
import { setSnackBar } from "../../redux/slices/appSlice";
import { userRoles } from "../../util";
import ProfilePhotoUpload from "../../components/ProfilePhotoUpload";

import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";

const ANIMATION_DURATION = 3000;

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userName, setUserName] = useState<USER["userName"]>("");
  const [fullName, setFullName] = useState<USER["fullName"]>("");
  const [email, setEmail] = useState<USER["email"]>("");
  const [password, setPassword] = useState<USER["password"]>("");
  const [role, setRole] = useState<string>(userRoles[0]);
  const [photo, setPhoto] = useState<USER["photo"]>();

  const [errors, setErrors] = useState<{
    fullName?: string | boolean;
    email?: string | boolean;
    password?: string | boolean;
  }>({});

  const validateFullName = (fullName?: string) => {
    if (fullName && fullName.length < 3) {
      return "Full name is mandatory and must be at least 3 characters long.";
    }
    return false;
  };

  const validateEmail = (email?: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      return "Invalid email address.";
    }
    return false;
  };

  const validatePassword = (password?: string) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (password && !passwordRegex.test(password)) {
      return "Password must be at least 6 characters long, include at least one uppercase letter, one number, and one special character.";
    }
    return false;
  };

  const handleBlur = (_e: SyntheticEvent, field: string) => {
    let error = null;
    switch (field) {
      case "fullName":
        error = validateFullName(fullName);
        break;
      case "email":
        error = validateEmail(email);
        break;
      case "password":
        error = validatePassword(password);
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullNameError = validateFullName(fullName);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (fullNameError || emailError || passwordError) {
      setErrors({
        fullName: fullNameError,
        email: emailError,
        password: passwordError,
      });
      return;
    }

    try {
      const { data } = await registerUser({
        fullName,
        userName,
        email,
        password,
        role,
        photo,
      });
      dispatch(setSnackBar({ message: data.message }));
      setTimeout(() => {
        navigate("/login");
      }, ANIMATION_DURATION);
    } catch (err) {
      const { status } = err.response;
      const { message } = err.response.data;
      if (status === 400) {
        dispatch(setSnackBar({ message }));
        return;
      }
      dispatch(setSnackBar({ message }));
    }
  };

  const updateProfilePicture = async (uploadedImage: File | null) => {
    if (!uploadedImage) return;

    const formData = new FormData();
    formData.append("image", uploadedImage);

    try {
      const response = await uploadPicture(formData);
      setPhoto(response.data.imageUrl);
      dispatch(setSnackBar({ message: response.data.message }));
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setSnackBar({ message: error.message }));
      }
    }
  };

  console.log(photo);

  return (
    <>
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
          Register user
        </Typography>

        <Stack
          onSubmit={handleSubmit}
          component={"form"}
          spacing={2}
          direction="column"
        >
          <ProfilePhotoUpload
            propHandleUpload={updateProfilePicture}
            tempImg={photo}
          />
          <FormControl>
            <TextField
              type="text"
              id="fullName"
              label="Full name"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onBlur={(e) => handleBlur(e, "fullName")}
              required
              error={!!errors.fullName}
            />
            {errors.fullName && (
              <Typography color={"error"}>{errors.fullName}</Typography>
            )}
          </FormControl>
          <FormControl>
            <TextField
              type="text"
              label="Username"
              id="userName"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <TextField
              type="email"
              label="Email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={(e) => handleBlur(e, "email")}
              required
              error={!!errors.email}
            />
            {errors.email && (
              <Typography color={"error"}>{errors.email}</Typography>
            )}
          </FormControl>
          <FormControl>
            <InputLabel shrink={true} id="role">
              User role
            </InputLabel>
            <Select
              id="role"
              label=""
              value={role}
              onChange={(e: SelectChangeEvent) => setRole(e.target.value)}
            >
              {userRoles.map((role) => (
                <MenuItem value={role} key={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <TextField
              type="password"
              id="password"
              label="Password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={(e) => handleBlur(e, "password")}
              required
              error={!!errors.password}
            />
            {errors.password && (
              <Typography color="error">{errors.password}</Typography>
            )}
          </FormControl>
          <Button size="large" variant="contained" type="submit">
            Register
          </Button>
        </Stack>
        <Stack direction="column" justifyContent="center" spacing={2}>
          <Button
            size="large"
            type="button"
            variant="outlined"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </Button>
        </Stack>
      </Stack>
    </>
  );
};

export default Register;
