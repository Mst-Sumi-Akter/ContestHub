import React, { useState, useContext } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../../components/Loading";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const PAGE_SIZE = 10;

const API_URL = import.meta.env.VITE_API_URL || "https://contest-hub-server-gamma-drab.vercel.app";

const SubmittedTasks = () => {
    const { user, token } = useContext(AuthContext);
    const [searchParams] = useSearchParams();
    const contestId = searchParams.get("contestId");
    const [page, setPage] = useState(1);
    const [selectedSub, setSelectedSub] = useState(null);
    const queryClient = useQueryClient();

    const isCreator = user?.role === "creator";

    const { data: submissions = [], isLoading } = useQuery({
        queryKey: ["submitted-tasks", user?.email, contestId],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/contests`);
            const contests = res.data || [];
            let allSubmissions = [];

            contests.forEach(contest => {
                if (contestId && contest._id !== contestId) return;

                if (Array.isArray(contest.submissions)) {
                    const mapped = contest.submissions
                        .filter(s => isCreator ? true : s.userEmail === user.email)
                        .map(s => ({
                            ...s,
                            contestTitle: contest.title,
                            contestId: contest._id,
                            isCreatorView: isCreator,
                            contestWinnerDeclared: contest.submissions.some(sub => sub.status === "winner")
                        }));
                    allSubmissions = [...allSubmissions, ...mapped];
                }
            });
            return allSubmissions;
        },
        enabled: !!user?.email && !!token,
    });

    const winnerMutation = useMutation({
        mutationFn: async ({ contestId, participantEmail }) => {
            await axios.put(`${API_URL}/contests/${contestId}/declare-winner`,
                { userEmail: participantEmail },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["submitted-tasks"]);
            toast.success("Winner declared successfully!");
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Action failed");
        }
    });

    const handleDeclareWinner = (cid, email) => {
        if (window.confirm(`Are you sure you want to declare ${email} as the winner?`)) {
            winnerMutation.mutate({ contestId: cid, participantEmail: email });
        }
    };

    const isUrl = (str) => {
        const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return !!pattern.test(str);
    };

    const getSafeLink = (url) => {
        if (!url) return "#";
        if (url.startsWith("http://") || url.startsWith("https://")) return url;
        return `https://${url}`;
    };

    const totalPages = Math.ceil(submissions.length / PAGE_SIZE);
    const paginatedSubmissions = submissions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    if (isLoading) return <Loading />;

    if (submissions.length === 0)
        return (
            <div className="text-center mt-16 p-10 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                <p className="text-gray-500 text-lg mb-4 font-medium">No tasks found for this view.</p>
                <Link to="/dashboard" className="text-indigo-600 hover:underline">Back to Dashboard</Link>
            </div>
        );

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900 dark:text-white">
                {isCreator ? "Manage Submissions" : "My Submitted Tasks"}
            </h1>

            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl border dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contest</th>
                            {isCreator && (
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Participant</th>
                            )}
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Submission</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            {isCreator && (
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {paginatedSubmissions.map((sub, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-medium">{sub.contestTitle}</td>
                                {isCreator && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{sub.userEmail}</td>
                                )}
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button
                                        onClick={() => setSelectedSub(sub)}
                                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 font-bold flex items-center gap-1 transition-all"
                                    >
                                        Inspect Entry
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-widest ${sub.status === "winner" ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300" :
                                        sub.status === "pending" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300" :
                                            "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                                        }`}>
                                        {sub.status || "pending"}
                                    </span>
                                </td>
                                {isCreator && (
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <button
                                            onClick={() => handleDeclareWinner(sub.contestId, sub.userEmail)}
                                            disabled={sub.contestWinnerDeclared || winnerMutation.isPending}
                                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all transform active:scale-95 ${sub.contestWinnerDeclared
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700"
                                                : "bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-600/20"
                                                }`}
                                        >
                                            {sub.status === "winner" ? "WON" : sub.contestWinnerDeclared ? "NOT WIN" : "Approve as Winner"}
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-12 gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`px-4 py-2 rounded-xl border-2 transition font-bold ${page === i + 1
                                ? "bg-indigo-600 text-white border-indigo-600"
                                : "border-gray-200 dark:border-gray-700 hover:border-indigo-500 text-gray-600 dark:text-gray-400"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}

            {/* Submission Preview Modal */}
            <AnimatePresence>
                {selectedSub && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden"
                        >
                            <button
                                onClick={() => setSelectedSub(null)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-3xl font-light"
                            >
                                &times;
                            </button>

                            <h2 className="text-2xl font-black mb-2 text-gray-900 dark:text-white uppercase tracking-tighter">
                                Entry Details
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 pb-4 border-b dark:border-gray-800">
                                Contest: <span className="font-bold text-indigo-600 dark:text-indigo-400">{selectedSub.contestTitle}</span>
                            </p>

                            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border dark:border-gray-700 min-h-[200px] max-h-[400px] overflow-y-auto mb-8">
                                <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap italic">
                                    "{selectedSub.submissionLink || selectedSub.submission}"
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 items-center justify-end">
                                {isUrl(selectedSub.submissionLink || selectedSub.submission) && (
                                    <a
                                        href={getSafeLink(selectedSub.submissionLink || selectedSub.submission)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold text-center hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30"
                                    >
                                        Visit External Project
                                    </a>
                                )}
                                <button
                                    onClick={() => setSelectedSub(null)}
                                    className="w-full sm:w-auto px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                                >
                                    Close Preview
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SubmittedTasks;
