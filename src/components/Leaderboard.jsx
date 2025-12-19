import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "./Loading";

const API_URL = import.meta.env.VITE_API_URL || "https://contest-hub-server-gamma-drab.vercel.app";

const Leaderboard = () => {
  const { data: leaders = [], isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/leaderboard`);
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

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
                    <div className="flex items-center justify-center gap-3">
                      {leader.photoURL ? (
                        <img
                          src={leader.photoURL}
                          alt={leader.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-indigo-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold">
                          {leader.name?.charAt(0)}
                        </div>
                      )}
                      <span className="font-medium text-gray-700 dark:text-gray-200">
                        {leader.name}
                      </span>
                    </div>
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">
                    <span
                      className="px-3 py-1 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
                    >
                      {leader.role}
                    </span>
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-bold text-lg text-indigo-600 dark:text-indigo-400">
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
