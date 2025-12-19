import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "../../components/Loading";

const PAGE_SIZE = 10;

const API_URL = import.meta.env.VITE_API_URL || "https://contest-hub-server-gamma-drab.vercel.app";

const MyParticipated = () => {
  const { user, token } = useContext(AuthContext);
  const [page, setPage] = useState(1);

  const { data: contests = [], isLoading } = useQuery({
    queryKey: ["my-participated", user?.email],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/contests`);
      const data = res.data || [];
      const participated = data.filter((c) => {
        if (Array.isArray(c.participants)) {
          return c.participants.some((p) =>
            typeof p === "string" ? p === user.email : p.email === user.email
          );
        }
        return false;
      });
      return participated.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
    },
    enabled: !!user?.email && !!token,
  });

  const totalPages = Math.ceil(contests.length / PAGE_SIZE);
  const paginatedContests = contests.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (isLoading) return <Loading />;

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
        {paginatedContests.map((contest) => {
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
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 text-indigo-600 font-bold">
                  Reward: {contest.reward}
                </p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${paymentStatus === "paid"
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 rounded-lg border transition ${page === i + 1 ? "bg-indigo-600 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyParticipated;
