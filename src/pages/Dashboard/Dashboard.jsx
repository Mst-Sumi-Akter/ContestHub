import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import DashboardSidebar from "./DashboardSidebar";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-black">
      {/* Sidebar */}
      <DashboardSidebar role={user?.role} />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
