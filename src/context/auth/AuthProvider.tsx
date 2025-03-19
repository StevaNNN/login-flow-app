import { useState, ReactNode, useEffect } from "react";
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

  const logout = () => {
    setLoggedIn(false);
    localStorage.removeItem("loggedIn");
    logoutUser();
    dispatch(setUserData(initialState.userData));
  };

  return (
    <AuthContext.Provider value={{ login, logout, loggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
