import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const NotFoundPage: React.FC = () => {
  const userLoggedIn = useAuth();
  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 min-h-screen">
      <h1 className="text-4xl font-bold mb-4 text-emerald-300">
        404 - Page Not Found
      </h1>
      <p className="text-lg mb-6 text-emerald-300">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        to={`${userLoggedIn ? "/" : "/login"}`}
      >
        Go back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
