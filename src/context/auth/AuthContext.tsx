import { createContext } from "react";

import { USER } from "../../Types";

interface AuthContextType {
  user: USER | null;
  login: (user: USER) => void;
  logout: () => void;
  loggedIn: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);
