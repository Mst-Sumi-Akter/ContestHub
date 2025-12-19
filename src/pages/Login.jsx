import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";

const Login = () => {
  const { loginUser, googleLogin, user, loading } = useContext(AuthContext);
  const [formLoading, setFormLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Support redirect to original page
  const from = location.state?.from || "/";

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, from, navigate]);

  // ---------------- Handle Backend Email/Password Login ----------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await loginUser(email, password); // sets user & token in context
      toast.success("Login successful!", { id: "auth" });
      navigate("/", { replace: true }); // Redirect after login
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Login failed", { id: "auth" });
    } finally {
      setFormLoading(false);
    }
  };

  // ---------------- Handle Google Login ----------------
  const handleGoogleLogin = async () => {
    setFormLoading(true);
    try {
      await googleLogin(); // sets user & token in context
      toast.success("Google login successful!", { id: "auth" });
      navigate("/", { replace: true }); // Redirect after login
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
          Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
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

          <button
            type="submit"
            disabled={formLoading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {formLoading ? "Logging in..." : "Login"}
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
          className="w-full border border-indigo-600 text-indigo-600 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <FcGoogle size={22} />
          Continue with Google
        </button>

        <p className="text-center text-sm mt-4 text-gray-700 dark:text-gray-300">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
