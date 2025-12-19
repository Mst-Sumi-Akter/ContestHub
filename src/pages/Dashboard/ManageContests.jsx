import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../components/Loading";
import toast from "react-hot-toast";

const ManageContests = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("authToken");

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err.response?.data || err.message);
      }
    };
    fetchUser();
  }, [token, API_URL]);

  // Fetch all contests
  useEffect(() => {
    const fetchContests = async () => {
      try {
        const res = await axios.get(`${API_URL}/contests`);
        setContests(res.data || []);
      } catch (err) {
        console.error("Error fetching contests:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, [API_URL]);

  // Admin actions: confirm, reject, delete
  const handleAction = async (id, action) => {
    if (!user || user.role !== "admin") {
      toast.error("Only admin can perform this action", { id: "admin-action" });
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (action === "delete") {
        await axios.delete(`${API_URL}/contests/${id}`, config);
        setContests(contests.filter((c) => c._id !== id));
        toast.success("Contest deleted successfully", { id: "admin-action" });
      } else {
        // Confirm or Reject
        await axios.put(`${API_URL}/contests/status/${id}`, { status: action }, config);
        setContests(
          contests.map((c) => (c._id === id ? { ...c, status: action } : c))
        );
        toast.success(`Contest ${action}ed successfully`, { id: "admin-action" });
      }
    } catch (err) {
      console.error(`${action} error:`, err.response?.data || err.message);
      toast.error(err.response?.data?.message || `Failed to ${action} contest`);
    }
  };

  if (loading) return <Loading />;

  if (!contests.length) {
    return <p className="text-center mt-10 text-gray-500">No contests available.</p>;
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Manage Contests
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {["Title", "Category", "Status", "Participants", "Actions"].map(
                (title) => (
                  <th
                    key={title}
                    className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    {title}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {contests.map((contest) => (
              <tr
                key={contest._id}
                className="hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <td className="px-4 py-2">{contest.title}</td>
                <td className="px-4 py-2">{contest.category || "-"}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${contest.status === "confirmed"
                      ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                      : contest.status === "rejected"
                        ? "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                      }`}
                  >
                    {contest.status || "pending"}
                  </span>
                </td>
                <td className="px-4 py-2">{contest.participants?.length || 0}</td>
                <td className="px-4 py-2 text-center space-x-2">
                  {user?.role === "admin" ? (
                    <>
                      <button
                        onClick={() => handleAction(contest._id, "confirmed")}
                        disabled={contest.status === "confirmed"}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleAction(contest._id, "rejected")}
                        disabled={contest.status === "rejected"}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition disabled:opacity-50"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleAction(contest._id, "delete")}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-400 text-sm">Admin only</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageContests;
