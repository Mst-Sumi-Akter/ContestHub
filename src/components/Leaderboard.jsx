import React, { useEffect, useState } from "react";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const res = await fetch("http://localhost:5000/leaderboard");
        if (!res.ok) throw new Error("Failed to fetch leaderboard");
        const data = await res.json();
        setLeaders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading leaderboard...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Leaderboard</h1>
      {leaders.length === 0 ? (
        <p className="text-center text-gray-500">No data yet.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-600">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Rank</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Name</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Points</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((l, idx) => (
              <tr key={l.id || idx} className="text-center">
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{idx + 1}</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{l.name}</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{l.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leaderboard;
