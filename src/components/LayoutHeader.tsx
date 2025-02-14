import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/auth/AuthContext";
const LayoutHeader: React.FC = () => {
  const authContext = useContext(AuthContext);
  return (
    <header className="bg-gray-600 text-emerald-300 p-4 fixed top-0 left-0 w-full z-10">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">My App</div>
        <ul className="flex space-x-4">
          <li>
            <NavLink
              to="/"
              className="hover:text-emerald-300 transition-colors duration-200"
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/user"
              className="hover:text-emerald-300 transition-colors duration-200"
            >
              User
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/info"
              className="hover:text-emerald-300 transition-colors duration-200"
            >
              Info
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/login"
              onClick={() => authContext?.logout()}
              className="hover:text-emerald-300 transition-colors duration-200"
            >
              Logout
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default LayoutHeader;
