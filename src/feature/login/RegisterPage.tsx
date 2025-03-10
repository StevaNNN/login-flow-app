import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { USER } from "../../Types";
import { registerUser } from "../../api";

const userRoles = ["player", "admin"];

const Register = () => {
  const [userName, setUserName] = useState<USER["userName"]>("");
  const [fullName, setFullName] = useState<USER["fullName"]>("");
  const [email, setEmail] = useState<USER["email"]>("");
  const [password, setPassword] = useState<USER["password"]>("");
  const [role, setRole] = useState<string>(userRoles[0]);
  const [notification, setNotification] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    fullName?: string | null;
    email?: string | null;
    password?: string | null;
  }>({});
  const navigate = useNavigate();

  const validateFullName = (fullName?: string) => {
    if (fullName && fullName.length < 3) {
      return "Full name is mandatory and must be at least 3 characters long.";
    }
    return null;
  };

  const validateEmail = (email?: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      return "Invalid email address.";
    }
    return null;
  };

  const validatePassword = (password?: string) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (password && !passwordRegex.test(password)) {
      return "Password must be at least 6 characters long, include at least one uppercase letter, one number, and one special character.";
    }
    return null;
  };

  const handleBlur = (field: string) => {
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
      });
      setNotification(data.message);
      setTimeout(() => {
        setNotification(null);
        navigate("/login");
      }, 3000); // Hide notification after 3 seconds and navigate to login
    } catch (err: any) {
      const { status } = err.response;
      const { message } = err.response.data;
      if (status === 400) {
        setNotification(message);
        setTimeout(() => setNotification(null), 1500); // Hide notification after 3 seconds
        return;
      }
      setNotification(message);
      setTimeout(() => setNotification(null), 1500); // Hide notification after 3 seconds
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      {notification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white py-2 px-4 rounded-lg shadow-md">
          {notification}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="fullName"
          >
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            onBlur={() => handleBlur("fullName")}
            required
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.fullName ? "border-red-500" : ""
            }`}
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-2">{errors.fullName}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="userName"
          >
            Username
          </label>
          <input
            type="text"
            id="userName"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleBlur("email")}
            required
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? "border-red-500" : ""
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-2">{errors.email}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="role"
          >
            User Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setRole(e.target.value)
            }
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {userRoles.map((role) => (
              <option value={role} key={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => handleBlur("password")}
            required
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.password ? "border-red-500" : ""
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-2">{errors.password}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Register
        </button>
        <button
          type="button"
          className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 mt-4"
          onClick={() => navigate("/login")}
        >
          Back to Login
        </button>
      </form>
    </div>
  );
};

export default Register;
