import React, { useEffect, useState } from "react";
import Loading from "./Loading";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const res = await fetch("http://localhost:5000/leaderboard");
        if (!res.ok) throw new Error("Failed to fetch leaderboard");

        const data = await res.json();

        // শুধুমাত্র normal users দেখাবে, creators/admins বাদ
        const filteredLeaders = data.filter(
          leader => leader.role !== "creator" && leader.role !== "admin"
        );

        // points অনুযায়ী descending sort
        filteredLeaders.sort((a, b) => b.points - a.points);

        setLeaders(filteredLeaders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaders();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-indigo-700">
        🏆 Leaderboard
      </h1>

      {leaders.length === 0 ? (
        <p className="text-center text-gray-500">No data available yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-600 rounded-lg shadow-md">
            <thead className="bg-indigo-100 dark:bg-indigo-700">
              <tr>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-3">Rank</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-3">Name</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-3">Role</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-3">Points</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((leader, idx) => (
                <tr
                  key={leader.id || idx}
                  className={`text-center transition-colors duration-300 ${idx % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-700"
                    }`}
                >
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium">
                    {idx + 1}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">
                    {leader.name}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">
                    <span
                      className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                    >
                      {leader.role}
                    </span>
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-semibold text-indigo-600">
                    {leader.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
