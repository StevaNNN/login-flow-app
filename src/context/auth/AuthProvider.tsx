import { useState, ReactNode, useEffect, useCallback } from "react";
import { getUser, logoutUser } from "../../api";
import { AuthContext } from "./AuthContext";
import { useDispatch } from "react-redux";
import { initialState, setUserData } from "../../redux/slices/playerSlice";
import { useQuery } from "@tanstack/react-query";
import { USER } from "../../Types";

const fetchUser = async (): Promise<USER> => {
  const { data, status } = await getUser();
  if (status !== 200) {
    throw new Error("Failed to init data");
  }
  return data;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(() => {
    const storedLoggedIn = localStorage.getItem("loggedIn");
    return storedLoggedIn ? JSON.parse(storedLoggedIn) : false;
  });
  const dispatch = useDispatch();
  const {
    data: userData,
    isError,
    isSuccess,
  } = useQuery<USER>({
    queryKey: ["userData"],
    queryFn: fetchUser,
  });

  useEffect(() => {
    setLoggedIn(true);
    if (isSuccess) dispatch(setUserData(userData));
    if (isError) {
      localStorage.removeItem("loggedIn");
      setLoggedIn(false);
    }
  }, [dispatch, isError, isSuccess, loggedIn, userData]);

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

  const login = () => {
    if (isSuccess) {
      setLoggedIn(true);
      dispatch(setUserData(userData));
      localStorage.setItem("loggedIn", JSON.stringify(true));
    }
    if (isError) {
      setLoggedIn(false);
      localStorage.removeItem("loggedIn");
    }
  };

  return (
    <AuthContext.Provider value={{ login, logout, loggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
