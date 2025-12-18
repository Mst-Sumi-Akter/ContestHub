import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const MyCreatedContests = () => {
  const { user, token } = useContext(AuthContext);
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openContestId, setOpenContestId] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [subLoading, setSubLoading] = useState(false);

  // ================= FETCH MY CONTESTS =================
  useEffect(() => {
    if (!user?.email || !token) return;

    const fetchMyContests = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/contests?creatorEmail=${user.email}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const contestsWithStatus = (res.data || []).map((contest) => ({
          ...contest,
          status: contest.status || "pending",
        }));

        setContests(contestsWithStatus);
      } catch {
        toast.error("Failed to load contests");
      } finally {
        setLoading(false);
      }
    };

    fetchMyContests();
  }, [user, token]);

  // ================= DELETE CONTEST =================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contest?")) return;

    try {
      await axios.delete(`${API_URL}/contests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setContests(contests.filter((c) => c._id !== id));
      toast.success("Contest deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  // ================= FETCH SUBMISSIONS =================
  const handleSeeSubmissions = async (contestId) => {
    if (openContestId === contestId) {
      setOpenContestId(null);
      return;
    }

    setSubLoading(true);
    try {
      const res = await axios.get(`${API_URL}/contests/${contestId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSubmissions(res.data.submissions || []);
      setOpenContestId(contestId);
    } catch {
      toast.error("Failed to load submissions");
    } finally {
      setSubLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        My Created Contests
      </h2>

      {contests.length === 0 ? (
        <p className="text-gray-500">No contests created yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Contest Name</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Prize</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {contests.map((contest) => (
                <React.Fragment key={contest._id}>
                  <tr className="border-t dark:border-gray-700">
                    <td className="px-4 py-3 font-medium">{contest.title}</td>
                    <td className="px-4 py-3">${contest.price}</td>
                    <td className="px-4 py-3">${contest.prizeMoney}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold capitalize
                          ${contest.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : contest.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                      >
                        {contest.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center space-x-2">
                      {/* SEE SUBMISSIONS */}
                      <button
                        onClick={() => handleSeeSubmissions(contest._id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        {openContestId === contest._id
                          ? "Hide Submissions"
                          : "See Submissions"}
                      </button>

                      {/* EDIT & DELETE (ONLY PENDING) */}
                      {contest.status === "pending" && (
                        <>
                          <Link
                            to={`/dashboard/edit-contest/${contest._id}`}
                            className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() => handleDelete(contest._id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>

                  {/* SUBMISSIONS TABLE */}
                  {openContestId === contest._id && (
                    <tr>
                      <td colSpan={5} className="bg-gray-50 dark:bg-gray-900 p-4">
                        {subLoading ? (
                          <p className="text-center">Loading submissions...</p>
                        ) : submissions.length === 0 ? (
                          <p className="text-center text-gray-500">
                            No submissions yet.
                          </p>
                        ) : (
                          <table className="min-w-full border">
                            <thead className="bg-gray-200 dark:bg-gray-700">
                              <tr>
                                <th className="px-3 py-2 text-left">Name</th>
                                <th className="px-3 py-2 text-left">Email</th>
                                <th className="px-3 py-2 text-left">
                                  Submitted Task
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {submissions.map((sub, idx) => (
                                <tr key={idx} className="border-t">
                                  <td className="px-3 py-2">
                                    {sub.userName || "N/A"}
                                  </td>
                                  <td className="px-3 py-2">
                                    {sub.userEmail}
                                  </td>
                                  <td className="px-3 py-2">
                                    <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
                                      {sub.submission}
                                    </pre>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyCreatedContests;
