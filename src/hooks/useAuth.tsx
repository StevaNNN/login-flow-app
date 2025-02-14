import { useContext } from "react";
import { AuthContext } from "../context/auth/AuthContext";

const useAuth = (): boolean => {
  const authCtx = useContext(AuthContext);
  return authCtx?.loggedIn ? true : false;
};

export default useAuth;
