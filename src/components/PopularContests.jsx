import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PopularContests = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const [contests, setContests] = useState([]);

  // Fetch contests
  useEffect(() => {
    const fetchContests = async () => {
      try {
        const res = await fetch("http://localhost:5000/contests");
        const data = await res.json();
        setContests(data);
      } catch (err) {
        console.error("Error fetching contests:", err);
      }
    };
    fetchContests();
  }, []);

  const sortedContests = [...contests]
    .sort((a, b) => (b.participants?.length || 0) - (a.participants?.length || 0))
    .slice(0, 5);

  // Handle Details click
  const handleDetailsClick = (id) => {
    if (isLoggedIn) {
      navigate(`/contest/${id}`);
    } else {
      // Pass the intended page in state
      navigate("/login", { state: { from: `/contest/${id}` } });
    }
  };

  const handleShowAll = () => navigate("/all-contests");

  const truncate = (text, n = 100) =>
    text && text.length > n ? text.slice(0, n) + "..." : text;

  return (
    <div className="popular-contests p-20 max-w-7xl mx-auto">
      <h2 className=" mb-20 text-3xl font-bold text-indigo-700  text-center">
        🔥 Popular Contests
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedContests.length > 0 ? (
          sortedContests.map((contest) => {
            const isActive = new Date(contest.endDate) > new Date();
            return (
              <div
                key={contest._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                <img
                  src={contest.image || "https://via.placeholder.com/400x300?text=Contest"}
                  alt={contest.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{contest.title}</h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {isActive ? "Active" : "Ended"}
                    </span>
                  </div>

                  <p className="text-gray-500 mb-2 flex-1">{truncate(contest.description, 100)}</p>

                  <p className="text-sm text-gray-400 mb-4">
                    Participants: {contest.participants?.length || 0}
                  </p>

                  <button
                    onClick={() => handleDetailsClick(contest._id)}
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

      <div className="text-center mt-8">
        <button
          onClick={handleShowAll}
          className="  rounded-xl bg-gradient-to-r from-blue-500 to-blue-700  text-white px-6 py-3  font-semibold transition"
        >
          Show All
        </button>
      </div>
    </div>
  );
};

export default PopularContests;
