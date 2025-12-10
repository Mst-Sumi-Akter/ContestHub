import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { motion } from "framer-motion";

const Banner = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-r from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-20 sm:py-28 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Showcase Your <span className="text-blue-600">Creativity</span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-lg">
            Join contests, submit your best works, and win amazing prizes. Connect with creators worldwide.
          </p>

          {/* CTA Buttons */}
          <div className="mt-6 flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/all-contests")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              Browse Contests
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition"
            >
              Create Contest
            </button>
          </div>
        </motion.div>

        {/* Right Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="flex justify-center lg:justify-end"
        >
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="h-48 bg-gradient-to-tr from-blue-200 to-blue-400 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-white font-bold text-xl">Logo Design Contest</span>
            </div>
            <h3 className="text-lg font-semibold dark:text-white">Win $500 for Best Logo</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Submit your creative logo and compete with talented designers. Deadline: <strong>Dec 31, 2025</strong>
            </p>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-300">
                Participants: <strong>58</strong>
              </div>
              <button className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition">
                View Details
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Banner;
