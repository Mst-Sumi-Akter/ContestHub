import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";

const Register = () => {
  const { googleLogin, user, loading, registerUser } = useContext(AuthContext);
  const [formLoading, setFormLoading] = useState(false);
  const [role, setRole] = useState("user"); // default role

  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate("/"); // redirect to home if logged in
    }
  }, [user, loading, navigate]);

  // ---------------- Backend Registration ----------------
  const handleRegister = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const photoURL = e.target.photoURL.value;
    const bio = e.target.bio.value; // new bio field

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters!", { id: "auth" });
      setFormLoading(false);
      return;
    }

    try {
      await registerUser({ name, email, password, role, photoURL, bio });
      toast.success("Registration successful!", { id: "auth" });
      navigate("/");
    } catch (err) {
      toast.error(err.message, { id: "auth" });
    } finally {
      setFormLoading(false);
    }
  };

  // ---------------- Google Login/Signup ----------------
  const handleGoogleLogin = async () => {
    setFormLoading(true);
    try {
      await googleLogin(); // sets user & token in context
      toast.success("Google login successful!", { id: "auth" });
      navigate("/"); // redirect after login
    } catch (err) {
      toast.error(err.message || "Google login failed", { id: "auth" });
    } finally {
      setFormLoading(false);
    }
  };

  // Show loading spinner if AuthContext is still loading
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 p-4 relative">
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-10 w-full max-w-md relative">
        {formLoading && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-2xl">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <h2 className="text-4xl font-extrabold text-center mb-6 text-indigo-600">
          Create Your Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="John Doe"
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="example@gmail.com"
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              placeholder="********"
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">Photo URL</label>
            <input
              type="text"
              name="photoURL"
              placeholder="https://example.com/photo.jpg"
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* ------------------ New Bio Field ------------------ */}
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">Bio</label>
            <textarea
              name="bio"
              placeholder="Tell something about yourself..."
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
            ></textarea>
          </div>
          {/* -------------------------------------------------- */}

          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="user">User</option>
              <option value="creator">Creator</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={formLoading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {formLoading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="h-px flex-1 bg-gray-300 dark:bg-gray-600"></div>
          <p className="px-3 text-gray-500 dark:text-gray-300 text-sm">OR</p>
          <div className="h-px flex-1 bg-gray-300 dark:bg-gray-600"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={formLoading}
          className="w-full mt-4 border border-indigo-600 text-indigo-600 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <FcGoogle size={22} />
          Continue with Google
        </button>

        <p className="text-center text-sm mt-4 text-gray-700 dark:text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
