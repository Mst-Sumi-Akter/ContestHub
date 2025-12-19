import React from "react";
import { useRouteError, Link } from "react-router-dom";
import { BiSolidErrorCircle } from "react-icons/bi";

const ErrorBoundary = () => {
    const error = useRouteError();
    console.error(error);

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl max-w-lg w-full border border-red-100 dark:border-red-900/30">
                <BiSolidErrorCircle className="text-red-500 text-7xl mx-auto mb-6 animate-bounce" />
                <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
                    Something went wrong
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg font-medium leading-relaxed">
                    We encountered an unexpected error. Please try refreshing the page or head back to safety.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-red-500/20"
                    >
                        Reload Page
                    </button>
                    <Link
                        to="/"
                        className="px-8 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold rounded-2xl transition-all"
                    >
                        Back Home
                    </Link>
                </div>
                {process.env.NODE_ENV === "development" && (
                    <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl text-left overflow-auto max-h-40 border border-gray-200 dark:border-gray-700">
                        <p className="text-xs font-mono text-red-600 dark:text-red-400">
                            {error?.statusText || error?.message}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ErrorBoundary;
