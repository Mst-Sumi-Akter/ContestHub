import { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { BiSun, BiMoon, BiMenu, BiX } from "react-icons/bi";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.jpg";
import toast from "react-hot-toast";

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  // Name & Photo fallback (user / creator / admin)
  const userName =
    user?.displayName || user?.name || user?.fullName || "User";

  const userPhoto =
    user?.photoURL ||
    user?.photo ||
    user?.avatar ||
    "https://i.ibb.co/4pDNDk1/avatar.png";

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout successful!");
    } catch {
      toast.error("Logout failed!");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <img src={logo} className="w-11 h-11 rounded-full object-cover" />
          <span>
            Contest<span className="text-blue-500">Hub</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 font-medium">
          <NavLink to="/" className={({ isActive }) =>
            isActive ? "text-blue-600" : "hover:text-blue-500"
          }>Home</NavLink>

          <NavLink to="/all-contests" className={({ isActive }) =>
            isActive ? "text-blue-600" : "hover:text-blue-500"
          }>All Contests</NavLink>

          <NavLink to="/leaderboard" className={({ isActive }) =>
            isActive ? "text-blue-600" : "hover:text-blue-500"
          }>Leaderboard</NavLink>

          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="text-2xl">
            {theme === "light" ? <BiMoon /> : <BiSun />}
          </button>

          {/* User Section */}
          {user ? (
            <div className="relative group cursor-pointer">
              <img
                src={userPhoto}
                alt="profile"
                className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
              />

              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-3 w-56 bg-white dark:bg-gray-800 shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
                
                {/* User Info */}
                <div className="px-4 py-3 border-b dark:border-gray-700">
                  <p className="font-semibold">{userName}</p>
                  {user?.email && (
                    <p className="text-sm text-gray-500 truncate">
                      {user.email}
                    </p>
                  )}
                  {user?.role && (
                    <span className="inline-block mt-1 text-xs px-2 py-1 rounded bg-blue-100 text-blue-600">
                      {user.role}
                    </span>
                  )}
                </div>

                <Link
                  to="/dashboard"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-700/40"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded">
                Login
              </Link>
              <Link to="/register" className="border border-blue-500 text-blue-500 px-4 py-2 rounded">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-3xl" onClick={() => setOpen(!open)}>
          {open ? <BiX /> : <BiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-3 bg-white dark:bg-gray-900">
          <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/all-contests" onClick={() => setOpen(false)}>All Contests</NavLink>
          <NavLink to="/leaderboard" onClick={() => setOpen(false)}>Leaderboard</NavLink>

          <button onClick={toggleTheme} className="text-2xl">
            {theme === "light" ? <BiMoon /> : <BiSun />}
          </button>

          {user ? (
            <div className="pt-3 border-t dark:border-gray-700">
              <p className="font-semibold">{userName}</p>
              <Link to="/dashboard" onClick={() => setOpen(false)}>
                Dashboard
              </Link>
              <button onClick={handleLogout} className="text-red-500 mt-2">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
