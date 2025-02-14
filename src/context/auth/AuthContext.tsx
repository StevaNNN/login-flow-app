import { createContext } from "react";

import { USER } from "../../Types";

interface AuthContextType {
  user: USER | null;
  login: (data: { email: USER["email"] }) => void;
  logout: () => void;
  loggedIn: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);
