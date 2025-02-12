import axios from "axios";
import { USER } from "../Types";

export const BASE_URL = "http://localhost:9000/api/auth";

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Allow sending cookies
});

export const registerUser = (data: USER) => API.post("/register", data);
export const loginUser = (data: { email: string; password: string }) =>
  API.post("/login", data);
export const logoutUser = () => API.post("/logout");
export const forgotPassword = (email: string) =>
  API.post("forgot-password", { email });
export const resetPassword = (token: string | undefined, newPassword: string) =>
  API.post(`/resetPassword/${token}`, { newPassword });
////////////////////////////////////////////////////////////////////////////////////////
export const getUser = () => API.get(`/me`, { withCredentials: true });
export const getUsers = () => API.get(`/users`);
export const getInfo = () => API.get(`/info`);

export default API;
