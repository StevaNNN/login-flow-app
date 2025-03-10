import axios from "axios";
import { USER } from "../Types";
// import { useContext } from "react";
// import { AuthContext } from "../context/auth/AuthContext";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/auth`,
  withCredentials: true, // Allow sending cookies
});

API.interceptors.request.use(
  (config) => {
    // const { setLoading } = useContext(AuthContext);
    // setLoading(true);
    return config;
  },
  (error) => {
    // const { setLoading } = useContext(AuthContext);
    // setLoading(false);
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    // const { setLoading } = useContext(AuthContext);
    // setLoading(false);
    return response;
  },
  (error) => {
    // const { setLoading } = useContext(AuthContext);
    // setLoading(false);
    return Promise.reject(error);
  }
);

export const registerUser = (data: USER) => API.post("/register", data);
export const loginUser = (data: {
  email: USER["email"];
  password: USER["password"];
}) => API.post("/login", data);
export const logoutUser = () => API.post("/logout");
export const forgotPassword = (email: string) =>
  API.post("/forgot-password", { email });
export const resetPassword = (token: string | undefined, newPassword: string) =>
  API.post(`/resetPassword/${token}`, { newPassword });
////////////////////////////////////////////////////////////////////////////////////////
export const getUser = () => API.get(`/me`, { withCredentials: true });
export const getUsers = () => API.get(`/users`);
export const deleteUser = (email: string) => API.post("/deleteUser", { email });

export default API;
