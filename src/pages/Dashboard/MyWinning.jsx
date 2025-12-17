import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const MyWinning = () => {
  const { user, token } = useContext(AuthContext);
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (!user?.email || !token) return;

    const fetchWinningContests = async () => {
      try {
        const res = await axios.get(`${API_URL}/contests`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data || [];

        // Filter contests where current user is declared winner
        const winningContests = data.filter((contest) => {
          if (!Array.isArray(contest.submissions)) return false;
          return contest.submissions.some(
            (s) => s.userEmail === user.email && s.status === "winner"
          );
        });

        // Sort by most recent contest
        winningContests.sort(
          (a, b) => new Date(b.endDate) - new Date(a.endDate)
        );

        setContests(winningContests);
      } catch (err) {
        console.error("Error fetching winning contests:", err);
        toast.error("Failed to load winning contests");
      } finally {
        setLoading(false);
      }
    };

    fetchWinningContests();
  }, [user?.email, token]);

  if (loading)
    return (
      <p className="text-center mt-16 text-gray-500 dark:text-gray-400 text-lg">
        Loading your winning contests...
      </p>
    );

  if (contests.length === 0)
    return (
      <p className="text-center mt-16 text-gray-500 dark:text-gray-400 text-lg">
        You haven't won any contests yet. Keep trying! 🎯
      </p>
    );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-900 dark:text-white">
        My Winning Contests 🏆
      </h1>

      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {contests.map((contest) => {
          const submission = contest.submissions.find(
            (s) => s.userEmail === user.email && s.status === "winner"
          );

          return (
            <div
              key={contest._id}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
            >
              {contest.image ? (
                <img
                  src={contest.image}
                  alt={contest.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300">
                  No Image
                </div>
              )}

              <div className="p-5">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {contest.name}
                </h2>

                <p className="text-gray-700 dark:text-gray-200 mb-1">
                  Category:{" "}
                  <span className="font-medium">{contest.contestType}</span>
                </p>

                <p className="text-gray-700 dark:text-gray-200 mb-3">
                  Prize:{" "}
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    ${contest.prizeMoney}
                  </span>
                </p>

                <p className="inline-block px-3 py-1 rounded-full bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200 font-semibold text-sm">
                  Winner 🏆
                </p>

                {submission?.submission && (
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="text-gray-800 dark:text-gray-100 font-medium mb-1">
                      Your Submission:
                    </p>
                    <pre className="text-sm text-gray-700 dark:text-gray-200 overflow-x-auto">
                      {submission.submission}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyWinning;
