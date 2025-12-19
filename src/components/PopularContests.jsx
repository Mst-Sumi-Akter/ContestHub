import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "./Loading";

const API_URL = import.meta.env.VITE_API_URL || "https://contest-hub-server-gamma-drab.vercel.app";

const PopularContests = () => {
  const navigate = useNavigate();

  const { data: contests = [], isLoading } = useQuery({
    queryKey: ["popular-contests"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/contests`);
      return res.data;
    },
  });

  const sortedContests = [...contests]
    .sort((a, b) => (b.participants?.length || 0) - (a.participants?.length || 0))
    .slice(0, 5);

  const handleShowAll = () => navigate("/all-contests");

  if (isLoading) return <Loading />;

  return (
    <div className="popular-contests py-20 px-4 max-w-7xl mx-auto">

      <div className="text-center mb-16">
        <h2 className="heading-primary text-3xl md:text-5xl mb-4">
          🔥 Popular Contests
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Join the most trending challenges happening right now.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedContests.length > 0 ? (
          sortedContests.map((c) => {
            const isActive = new Date(c.endDate) > new Date();

            // ✅ Check if winner is already declared
            const isWinnerDeclared = c.submissions?.some(sub => sub.status === "winner");

            return (
              <div
                key={c._id}
                className="bg-white dark:bg-black rounded-lg border dark:border-gray-800 shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                <img
                  src={c.image || "https://via.placeholder.com/600x400?text=Contest"}
                  alt={c.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{c.title}</h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        isWinnerDeclared
                          ? "bg-yellow-100 text-yellow-800"
                          : isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {isWinnerDeclared ? "Winner Selected" : isActive ? "Active" : "Ended"}
                    </span>
                  </div>

                  <p className="text-gray-500 dark:text-gray-400 mb-2 flex-1">
                    {c.description ? (c.description.length > 100 ? c.description.slice(0, 100) + "..." : c.description) : ""}
                  </p>

                  <div className="mb-4 text-sm text-gray-500">
                    <p>Reward: <span className="font-medium text-gray-700 dark:text-gray-200">{c.reward ?? "—"}</span></p>
                    <p>Participants: {c.participants?.length || 0}</p>
                  </div>

                  <button
                    onClick={() => navigate(`/contest/${c._id}`)}
                    className="bg-indigo-600 text-white w-full py-2 rounded hover:bg-indigo-700 transition font-semibold"
                  >
                    Details
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No contests found.
          </p>
        )}
      </div>

      <div className="text-center mt-12">
        <button
          onClick={handleShowAll}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform"
        >
          Explore All Contests
        </button>
      </div>
    </div>
  );
};

export default PopularContests;
