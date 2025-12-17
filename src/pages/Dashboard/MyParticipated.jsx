import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const MyParticipated = () => {
  const { user, token } = useContext(AuthContext);
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (!user?.email || !token) return;

    const fetchContests = async () => {
      try {
        const res = await axios.get(`${API_URL}/contests`);
        const data = res.data || [];

        // Filter contests where user participated
        const participated = data.filter((c) => {
          if (Array.isArray(c.participants)) {
            return c.participants.some((p) =>
              typeof p === "string" ? p === user.email : p.email === user.email
            );
          }
          return false;
        });

        // Sort by upcoming deadline
        participated.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

        setContests(participated);
      } catch (err) {
        console.error("Error fetching contests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, [user?.email, token]);

  if (loading)
    return (
      <p className="text-center mt-16 text-gray-500 dark:text-gray-400 text-lg">
        Loading your contests...
      </p>
    );

  if (contests.length === 0)
    return (
      <p className="text-center mt-16 text-gray-500 dark:text-gray-400 text-lg">
        You haven't participated in any contests yet.
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900 dark:text-white">
        My Participated Contests
      </h1>
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {contests.map((contest) => {
          const participant = Array.isArray(contest.participants)
            ? contest.participants.find((p) =>
                typeof p === "string" ? p === user.email : p.email === user.email
              )
            : null;
          const paymentStatus = participant?.status || "pending";

          return (
            <div
              key={contest._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden"
            >
              {contest.image && (
                <img
                  src={contest.image}
                  alt={contest.title}
                  className="w-full h-44 object-cover transition-transform duration-300 hover:scale-105"
                />
              )}
              <div className="p-5">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  {contest.title}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                  Deadline:{" "}
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    {new Date(contest.endDate).toLocaleDateString()}
                  </span>
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                  Category:{" "}
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    {contest.category}
                  </span>
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                  Reward:{" "}
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    {contest.reward}
                  </span>
                </p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    paymentStatus === "paid"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  Payment: {paymentStatus}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyParticipated;
