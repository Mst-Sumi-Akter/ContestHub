import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Loading from "../../components/Loading";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const MyWinning = () => {
    const { user, token } = useContext(AuthContext);
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.email || !token) return;

        const fetchWinningContests = async () => {
            try {
                const res = await axios.get(`${API_URL}/contests`);
                const data = res.data || [];

                // Filter contests where user is a winner
                const winners = data.filter((c) => {
                    if (Array.isArray(c.submissions)) {
                        return c.submissions.some(
                            (s) => s.userEmail === user.email && s.status === "winner"
                        );
                    }
                    return false;
                });

                setContests(winners);
            } catch (err) {
                console.error("Error fetching winning contests:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchWinningContests();
    }, [user?.email, token]);

    if (loading) return <Loading />;

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
                {contests.map((contest) => (
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
        </div>
    );
};

export default MyWinning;
