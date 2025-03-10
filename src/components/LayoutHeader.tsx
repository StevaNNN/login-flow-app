import React, { useContext } from "react";
import { AuthContext } from "../context/auth/AuthContext";
import { NavLink } from "react-router-dom";

const LayoutHeader: React.FC = () => {
  const authContext = useContext(AuthContext);

  const handleAddNewScore = () => {
    console.log("Add logic for adding new score");
  };
  return (
    <header className="bg-gray-600 text-emerald-300 p-4 fixed top-0 left-0 w-full z-10">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">Tennis Kragujevac</div>
        <button
          onClick={handleAddNewScore}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add new score
        </button>
        <p>{authContext?.user?.fullName}</p>
        <NavLink
          onClick={() => authContext?.logout()}
          to="/login"
          className="text-emerald-300 hover:text-emerald-200"
        >
          Logout
        </NavLink>
      </nav>
    </header>
  );
};

export default LayoutHeader;
