import { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext"; // ✅ works now
import { AuthContext } from "../context/AuthContext";
import { BiSun, BiMoon, BiMenu, BiX } from "react-icons/bi";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.jpg";
import toast from "react-hot-toast";

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout successful!");
    } catch (err) {
      toast.error("Logout failed!");
    }
  };

  return (
    <nav className="shadow-md bg-white dark:bg-gray-900 dark:text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <img src={logo} alt="Logo" className="w-12 h-12 rounded-full object-cover" />
          <span>Contest<span className="text-blue-500">Hub</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-lg font-medium">
          <NavLink to="/" className={({ isActive }) => isActive ? "text-blue-600 font-semibold" : "hover:text-blue-500"}>Home</NavLink>
          <NavLink to="/all-contests" className={({ isActive }) => isActive ? "text-blue-600 font-semibold" : "hover:text-blue-500"}>All Contests</NavLink>
          <NavLink to="/leaderboard" className={({ isActive }) => isActive ? "text-blue-600 font-semibold" : "hover:text-blue-500"}>Leaderboard</NavLink>

          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="text-2xl hover:text-blue-500 transition">
            {theme === "light" ? <BiMoon /> : <BiSun />}
          </button>

          {/* Auth */}
          {user ? (
            <div className="relative group cursor-pointer">
              <img src={user.photoURL} alt="profile" className="w-10 h-10 rounded-full border" />
              <div className="absolute right-0 top-full mt-2 w-44 bg-white dark:bg-gray-800 shadow-lg rounded-md opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200 z-50">
                <p className="px-4 py-2 border-b dark:border-gray-700 font-semibold">{user.displayName}</p>
                <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Dashboard</Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-red-100 dark:hover:bg-red-700 text-red-500">Logout</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Login</Link>
              <Link to="/register" className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition">Register</Link>
            </div>
          )}
        </div>

        <button className="md:hidden text-3xl" onClick={() => setOpen(!open)}>{open ? <BiX /> : <BiMenu />}</button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-4 text-lg">
          <div className="flex flex-col gap-3">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/all-contests">All Contests</NavLink>
            <NavLink to="/leaderboard">Leaderboard</NavLink>
          </div>
          <button onClick={toggleTheme} className="text-2xl">{theme === "light" ? <BiMoon /> : <BiSun />}</button>
          {user ? (
            <div className="mt-3">
              <p className="font-semibold">{user.displayName}</p>
              <Link to="/dashboard" className="block mt-2 hover:text-blue-500">Dashboard</Link>
              <button onClick={handleLogout} className="mt-2 text-red-500">Logout</button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 mt-4">
              <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Login</Link>
              <Link to="/register" className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
