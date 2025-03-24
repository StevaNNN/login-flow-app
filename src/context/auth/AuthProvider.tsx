import { useState, ReactNode, useEffect, useCallback } from "react";
import { getUser, logoutUser } from "../../api";
import { AuthContext } from "./AuthContext";
import { useDispatch } from "react-redux";
import { initialState, setUserData } from "../../redux/slices/playerSlice";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(() => {
    const storedLoggedIn = localStorage.getItem("loggedIn");
    return storedLoggedIn ? JSON.parse(storedLoggedIn) : false;
  });
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      const fetchUser = async () => {
        const { data } = await getUser();
        setLoggedIn(true);
        dispatch(setUserData(data));
      };
      if (loggedIn) fetchUser();
    } catch (err) {
      if (err instanceof Error) console.log(err.message);
      localStorage.removeItem("loggedIn");
      setLoggedIn(false);
    }
  }, [dispatch, loggedIn]);

  const logout = useCallback(() => {
    setLoggedIn(false);
    localStorage.removeItem("loggedIn");
    logoutUser();
    dispatch(setUserData(initialState.userData));
  }, [dispatch]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        logout();
      }, 720000); // 20m seconds
    };

    const handleActivity = () => {
      resetTimeout();
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);

    resetTimeout();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
    };
  }, [logout]);

  const login = async () => {
    setLoggedIn(true);
    try {
      const { data } = await getUser();
      dispatch(setUserData(data));
      localStorage.setItem("loggedIn", JSON.stringify(true));
    } catch (err) {
      if (err instanceof Error) console.log(err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ login, logout, loggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
