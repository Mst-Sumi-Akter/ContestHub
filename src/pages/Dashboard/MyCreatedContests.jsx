import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";

const PAGE_SIZE = 10;

const API_URL = import.meta.env.VITE_API_URL || "https://contest-hub-server-gamma-drab.vercel.app";

const MyCreatedContests = () => {
    const { user, token } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);

    const { data: contests = [], isLoading } = useQuery({
        queryKey: ["my-created", user?.email],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/contests`);
            const data = res.data || [];
            return data.filter((c) => c.creatorEmail === user.email);
        },
        enabled: !!user?.email && !!token,
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            await axios.delete(`${API_URL}/contests/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["my-created", user?.email]);
            toast.success("Contest deleted successfully");
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Deletion failed");
        },
    });

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this contest?")) {
            deleteMutation.mutate(id);
        }
    };

    const totalPages = Math.ceil(contests.length / PAGE_SIZE);
    const paginatedContests = contests.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    if (isLoading) return <Loading />;





    if (contests.length === 0)
        return (
            <div className="text-center mt-16">
                <p className="text-gray-500 text-lg mb-4">You haven't created any contests yet.</p>
                <Link to="/dashboard/add-contest" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium">
                    Create Your First Contest
                </Link>
            </div>
        );

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">My Created Contests</h1>
                <Link to="/dashboard/add-contest" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
                    + New Contest
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {paginatedContests.map((contest) => (
                    <div key={contest._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border dark:border-gray-700">
                        <img src={contest.image} alt={contest.title} className="w-full h-40 object-cover" />
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{contest.title}</h2>
                                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${contest.status === "confirmed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                                    {contest.status || "pending"}
                                </span>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">{contest.description}</p>

                            <div className="flex justify-between items-center mt-4">
                                <div className="space-x-2">
                                    <Link to={`/dashboard/edit-contest/${contest._id}`} className="text-blue-600 hover:underline text-sm font-medium">Edit</Link>
                                    <button
                                        onClick={() => handleDelete(contest._id)}
                                        disabled={deleteMutation.isPending}
                                        className="text-red-600 hover:underline text-sm font-medium disabled:opacity-50"
                                    >
                                        Delete
                                    </button>
                                </div>
                                <Link to={`/dashboard/submitted-tasks?contestId=${contest._id}`} className="text-indigo-600 hover:underline text-sm font-medium">
                                    Submissions
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-12 gap-2">
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

export default MyCreatedContests;
