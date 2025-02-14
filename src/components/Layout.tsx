import React from "react";
import { Outlet } from "react-router-dom";
import LayoutHeader from "./LayoutHeader";
import LayoutFooter from "./LayoutFooter";

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <LayoutHeader />
      <main className="flex-grow p-4 mt-16 mb-16">
        <Outlet />
      </main>
      <LayoutFooter />
    </div>
  );
};

export default Layout;
