import React, { useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../../components/Loading";

const PAGE_SIZE = 10;

const API_URL = import.meta.env.VITE_API_URL || "https://contest-hub-server-gamma-drab.vercel.app";

const MyWinning = () => {
    const { user, token } = useContext(AuthContext);
    const [page, setPage] = useState(1);

    const { data: contests = [], isLoading } = useQuery({
        queryKey: ["my-winning", user?.email],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/contests`);
            const data = res.data || [];
            return data.filter((c) => {
                if (Array.isArray(c.submissions)) {
                    return c.submissions.some(
                        (s) => s.userEmail === user.email && s.status === "winner"
                    );
                }
                return false;
            });
        },
        enabled: !!user?.email && !!token,
    });

    const totalPages = Math.ceil(contests.length / PAGE_SIZE);
    const paginatedContests = contests.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    if (isLoading) return <Loading />;

    if (contests.length === 0)
        return (
            <div className="text-center mt-16">
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                    You haven't won any contests yet.
                </p>
                <p className="text-indigo-500 font-medium whitespace-pre">
                    {"Keep participating and show your best work!\nYour victory is just around the corner."}
                </p>
            </div>
        );

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900 dark:text-white">
                My Winning Contests 🏆
            </h1>
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {paginatedContests.map((contest) => (
                    <div
                        key={contest._id}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden border-2 border-yellow-400 dark:border-yellow-600"
                    >
                        {contest.image && (
                            <img
                                src={contest.image}
                                alt={contest.title}
                                className="w-full h-44 object-cover"
                            />
                        )}
                        <div className="p-5">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                                {contest.title}
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                                Category: <span className="font-medium">{contest.category}</span>
                            </p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                                Prize Won: <span className="font-bold text-green-600 dark:text-green-400">{contest.reward}</span>
                            </p>
                            <div className="mt-4 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
                                <span className="text-yellow-700 dark:text-yellow-400 font-bold uppercase text-xs tracking-wider">
                                    Official Winner
                                </span>
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

export default MyWinning;
