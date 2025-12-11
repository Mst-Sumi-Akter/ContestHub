import React from "react";
import { Link } from "react-router-dom";
import { BiError } from "react-icons/bi";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-10 max-w-md w-full text-center">
        <BiError className="text-red-600 text-8xl mx-auto mb-4 animate-pulse" />
        <h1 className="text-6xl font-extrabold text-red-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2 text-gray-700 dark:text-gray-200">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
