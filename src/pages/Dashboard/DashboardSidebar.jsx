import { NavLink } from "react-router-dom";
import {
  FiUser,
  FiPlusSquare,
  FiAward,
  FiUsers,
  FiClipboard,
  FiEdit,
} from "react-icons/fi";

const DashboardSidebar = ({ role }) => {
  const menus = {
    user: [
      {
        to: "my-participated",
        label: "My Participated Contests",
        icon: FiClipboard,
      },
      {
        to: "my-winning",
        label: "My Winning Contests",
        icon: FiAward,
      },
      {
        to: "profile",
        label: "My Profile",
        icon: FiUser,
      },
    ],
    creator: [
      {
        to: "add-contest",
        label: "Add Contest",
        icon: FiPlusSquare,
      },
      {
        to: "my-created",
        label: "My Created Contests",
        icon: FiClipboard,
      },
      {
        to: "submitted-tasks",
        label: "Submitted Tasks",
        icon: FiAward,
      },
     
    ],
    admin: [
      {
        to: "manage-users",
        label: "Manage Users",
        icon: FiUsers,
      },
      {
        to: "manage-contests",
        label: "Manage Contests",
        icon: FiClipboard,
      },
    ],
  };

  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-black border-r dark:border-gray-800 shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-8 text-center text-indigo-600">
        Dashboard
      </h2>

      <nav className="space-y-2">
        {(menus[role] || []).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200
              ${isActive
                ? "bg-indigo-600 text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900"
              }`
            }
          >
            <item.icon className="text-lg" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
