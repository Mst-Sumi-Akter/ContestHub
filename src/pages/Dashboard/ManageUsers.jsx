import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";

const API_URL = import.meta.env.VITE_API_URL || "https://contest-hub-server-gamma-drab.vercel.app";

const PAGE_SIZE = 10;

const ManageUsers = () => {
  const { token } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  // Fetch users
  const { data: usersData = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data || [];
    },
    enabled: !!token,
  });

  // Mutate Role
  const roleMutation = useMutation({
    mutationFn: async ({ userId, role }) => {
      await axios.put(
        `${API_URL}/users/${userId}/role`,
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success("Role updated successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Role update failed");
    },
  });

  const handleRoleChange = (userId, newRole) => {
    roleMutation.mutate({ userId, role: newRole });
  };

  // Pagination
  const totalPages = Math.ceil(usersData.length / PAGE_SIZE);
  const paginatedUsers = usersData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        Manage Users
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 uppercase text-sm font-semibold">
              <th className="px-6 py-3 border-b">Name</th>
              <th className="px-6 py-3 border-b">Email</th>
              <th className="px-6 py-3 border-b">Role</th>
              <th className="px-6 py-3 border-b">Change Role</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <td className="px-6 py-4 border-b flex items-center gap-3">
                  <img src={user.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"} className="w-8 h-8 rounded-full" />
                  {user.name}
                </td>
                <td className="px-6 py-4 border-b">{user.email}</td>
                <td className="px-6 py-4 border-b font-medium capitalize">{user.role}</td>
                <td className="px-6 py-4 border-b">
                  <select
                    value={user.role}
                    disabled={roleMutation.isPending}
                    onChange={(e) =>
                      handleRoleChange(user._id, e.target.value)
                    }
                    className="border rounded px-3 py-1 focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-gray-200"
                  >
                    <option value="user">User</option>
                    <option value="creator">Creator</option>
                    <option value="admin">Admin</option>
                  </select>
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

export default ManageUsers;
