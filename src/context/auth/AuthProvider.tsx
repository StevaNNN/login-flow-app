import { useState, ReactNode, useEffect } from "react";
import { USER } from "../../Types";
import { getUser, logoutUser } from "../../api";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<USER | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean>(() => {
    const storedLoggedIn = localStorage.getItem("loggedIn");
    return storedLoggedIn ? JSON.parse(storedLoggedIn) : false;
  });

  useEffect(() => {
    try {
      const fetchUser = async () => {
        const { data } = await getUser();
        setLoggedIn(true);
        setUser(data);
      };
      if (loggedIn) fetchUser();
    } catch (err) {
      if (err instanceof Error) console.log(err.message);
      setLoggedIn(false);
    }
  }, [loggedIn]);

  const login = async () => {
    try {
      const { data } = await getUser();
      setUser(data);
      setLoggedIn(true);
      localStorage.setItem("loggedIn", JSON.stringify(true));
    } catch (err) {
      if (err instanceof Error) console.log(err.message);
    }
  };
  console.log(user, "USER STATE");
  console.log(loggedIn, "LOGGED IN STATE");
  const logout = () => {
    setLoggedIn(false);
    localStorage.removeItem("loggedIn");
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
