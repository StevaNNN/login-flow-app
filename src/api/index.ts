import axios from "axios";
import { SEASON, USER } from "../Types";
// import { useContext } from "react";
// import { AuthContext } from "../context/auth/AuthContext";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
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

/////////////////////////////////////AUTH///////////////////////////////////////////////
export const registerUser = (data: Omit<USER, "_id">) =>
  API.post("/auth/register", data);
export const loginUser = (data: {
  email: USER["email"];
  password: USER["password"];
}) => API.post("/auth/login", data);
export const logoutUser = () => API.post("/auth/logout");
export const forgotPassword = (email: string) =>
  API.post("/auth/forgot-password", { email });
export const resetPassword = (token: string | undefined, newPassword: string) =>
  API.post(`/auth/resetPassword/${token}`, { newPassword });
export const getUser = () => API.get(`/auth/me`, { withCredentials: true });
////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////ADMIN///////////////////////////////////////////////
export const getUsers = () =>
  API.get(`/admin/users`, { withCredentials: true });
export const deleteUser = (email: string) =>
  API.post("/admin/deleteUser", { email });

export const addSeason = (data: SEASON) => API.post("/admin/addSeason", data);
export const getSeasons = () => API.get("/admin/seasons");
export const editSeason = (data: SEASON) => API.put("/admin/editSeason", data);
export const deleteSeason = (seasonId: string) =>
  API.delete(`/admin/deleteSeason?seasonId=${seasonId}`);
/////////////////////////////////////////////////////////////////////////////////////////

export const uploadPicture = (data: FormData) =>
  API.post("/player/uploadPicture", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateUserData = (data: USER) =>
  API.post("/player/updateUserInfo", data);
export default API;
