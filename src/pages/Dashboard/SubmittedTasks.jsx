import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const SubmittedTasks = () => {
  const { user, token } = useContext(AuthContext);
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch contests created by creator
  useEffect(() => {
    if (!user?.email || !token) return;

    const fetchContests = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/contests?creatorEmail=${user.email}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setContests(res.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load contests");
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, [user, token]);

  // Handle declare winner
  const handleDeclareWinner = async (contestId, submission) => {
    try {
      // Send request to server to update submission status
      await axios.put(
        `${API_URL}/contests/${contestId}/declare-winner`,
        { userEmail: submission.userEmail },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update local state to reflect winner immediately
      setContests((prev) =>
        prev.map((contest) =>
          contest._id === contestId
            ? {
              ...contest,
              submissions: contest.submissions.map((sub) =>
                sub.userEmail === submission.userEmail
                  ? { ...sub, status: "winner" }
                  : sub
              ),
            }
            : contest
        )
      );

      toast.success(`Winner declared: ${submission.userEmail}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to declare winner");
    }
  };

  if (loading)
    return <p className="text-center mt-10">Loading...</p>;

  if (contests.length === 0)
    return <p className="text-gray-500 mt-6 text-center">No contests found.</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white text-center">
        Submitted Tasks
      </h2>

      {contests.map((contest) => (
        <div
          key={contest._id}
          className="mb-8 bg-white dark:bg-gray-900 shadow-lg rounded-xl overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {contest.title}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold capitalize
                ${contest.status === "pending" ? "bg-yellow-100 text-yellow-700" : ""}
                ${contest.status === "confirmed" ? "bg-green-100 text-green-700" : ""}
                ${contest.status === "rejected" ? "bg-red-100 text-red-700" : ""}
              `}
            >
              {contest.status}
            </span>
          </div>

          {contest.submissions && contest.submissions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left">Participant Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Submitted Task</th>
                    <th className="px-4 py-3 text-center">Winner</th>
                  </tr>
                </thead>
                <tbody>
                  {contest.submissions.map((sub, idx) => (
                    <tr
                      key={idx}
                      className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      <td className="px-4 py-3 font-medium">{sub.userName || sub.userEmail}</td>
                      <td className="px-4 py-3">{sub.userEmail}</td>
                      <td className="px-4 py-3">
                        <pre className="bg-gray-50 dark:bg-gray-800 p-2 rounded text-sm">
                          {sub.submission}
                        </pre>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {sub.status === "winner" ? (
                          <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-semibold">
                            Winner
                          </span>
                        ) : (
                          <button
                            onClick={() => handleDeclareWinner(contest._id, sub)}
                            className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-sm font-semibold"
                          >
                            Declare Winner
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="px-6 py-4 text-gray-500">No submissions yet.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default SubmittedTasks;
