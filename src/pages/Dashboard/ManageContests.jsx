import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";
import { AuthContext } from "../../context/AuthContext";
import React, { useContext, useState } from "react";

const PAGE_SIZE = 10;

const ManageContests = () => {
  const { user, token } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const API_URL = import.meta.env.VITE_API_URL || "https://contest-hub-server-gamma-drab.vercel.app";

  // Fetch all contests
  const { data: contestsData = [], isLoading } = useQuery({
    queryKey: ["all-contests-admin"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/contests`);
      return res.data || [];
    },
  });

  // Actions Mutation
  const actionMutation = useMutation({
    mutationFn: async ({ id, action }) => {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (action === "delete") {
        await axios.delete(`${API_URL}/contests/${id}`, config);
      } else {
        await axios.put(`${API_URL}/contests/status/${id}`, { status: action }, config);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["all-contests-admin"]);
      toast.success(`Contest ${variables.action}${variables.action === "delete" ? "d" : "ed"} successfully`);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Action failed");
    },
  });

  const handleAction = (id, action) => {
    if (!user || user.role !== "admin") {
      return toast.error("Only admin can perform this action");
    }
    actionMutation.mutate({ id, action });
  };

  const totalPages = Math.ceil(contestsData.length / PAGE_SIZE);
  const paginatedContests = contestsData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (isLoading) return <Loading />;



  if (!contestsData.length) {
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
            {paginatedContests.map((contest) => (
              <tr
                key={contest._id}
                className="hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <td className="px-4 py-2 font-medium">{contest.title}</td>
                <td className="px-4 py-2 capitalize">{contest.category || "-"}</td>
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
                <td className="px-4 py-2 text-center flex gap-2">
                  {user?.role === "admin" ? (
                    <>
                      <button
                        onClick={() => handleAction(contest._id, "confirmed")}
                        disabled={contest.status === "confirmed" || actionMutation.isPending}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50 text-sm"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleAction(contest._id, "rejected")}
                        disabled={contest.status === "rejected" || actionMutation.isPending}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition disabled:opacity-50 text-sm"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleAction(contest._id, "delete")}
                        disabled={actionMutation.isPending}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-400 text-xs">Admin only</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
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

export default ManageContests;
