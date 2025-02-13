import { useState, ReactNode, useEffect } from "react";
import { USER } from "../../Types";
import { getUser, logoutUser } from "../../api";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<USER | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const fetchUser = async () => {
        setLoading(true);
        const { data } = await getUser();
        setUser(data);
        setLoggedIn(true);
      };
      fetchUser();
    } catch (err) {
      if (err instanceof Error) console.log(err.message);
      setLoggedIn(false);
    } finally {
      setLoading(true);
    }
  }, [loggedIn]);

  const login = () => {
    setLoggedIn(true);
    localStorage.setItem("loggedIn", JSON.stringify(true));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("loggedIn");
    logoutUser();
    setUser(null);
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loggedIn, loading, setLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
