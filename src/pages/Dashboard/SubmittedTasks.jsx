import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import Loading from "../../components/Loading";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const SubmittedTasks = () => {
    const { user, token } = useContext(AuthContext);
    const [searchParams] = useSearchParams();
    const contestId = searchParams.get("contestId");

    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.email || !token) return;

        const fetchSubmissions = async () => {
            try {
                const res = await axios.get(`${API_URL}/contests`);
                const contests = res.data || [];

                let allSubmissions = [];

                contests.forEach(contest => {
                    if (contestId && contest._id !== contestId) return;

                    if (Array.isArray(contest.submissions)) {
                        const userSubmissions = contest.submissions
                            .filter(s => s.userEmail === user.email)
                            .map(s => ({
                                ...s,
                                contestTitle: contest.title,
                                contestId: contest._id
                            }));
                        allSubmissions = [...allSubmissions, ...userSubmissions];
                    }
                });

                setSubmissions(allSubmissions);
            } catch (err) {
                console.error("Error fetching submissions:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, [user?.email, token, contestId]);

    if (loading) return <Loading />;

    if (submissions.length === 0)
        return (
            <div className="text-center mt-16">
                <p className="text-gray-500 text-lg">You haven't submitted any tasks yet.</p>
            </div>
        );

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900 dark:text-white">
                My Submitted Tasks
            </h1>

            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contest</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Submission Link</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {submissions.map((sub, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{sub.contestTitle}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 hover:underline">
                                    <a href={sub.submissionLink} target="_blank" rel="noopener noreferrer">View Submission</a>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${sub.status === "winner" ? "bg-green-100 text-green-800" :
                                        sub.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                            "bg-gray-100 text-gray-800"
                                        }`}>
                                        {sub.status || "pending"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SubmittedTasks;
