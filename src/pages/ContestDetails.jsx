import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import PaymentModal from "../components/PaymentModal";
import toast from "react-hot-toast";
import Loading from "../components/Loading";

// Helper: calculate countdown
const calculateTimeLeft = (endDate) => {
    if (!endDate) return null;
    const diff = new Date(endDate) - new Date();
    if (diff <= 0) return null;

    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
    };
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL || "https://contest-hub-server-gamma-drab.vercel.app";

const ContestDetails = () => {
    const { user, loading: authLoading, token } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [timeLeft, setTimeLeft] = useState(null);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [submission, setSubmission] = useState("");
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    // Fetch contest data
    const { data: contest, isLoading, error: queryError } = useQuery({
        queryKey: ["contest", id],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/contests/${id}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            const data = res.data;
            data.participants = data.participants || [];
            data.submissions = data.submissions || [];
            return data;
        },
        enabled: !!id,
    });

    const registered = user && (user.role === "admin" || user.role === "creator" || contest?.participants?.includes(user.email));
    const hasSubmitted = user && (user.role === "admin" || user.role === "creator" || contest?.submissions?.some((s) => s.userEmail === user.email));

    // Registration Mutation
    const registerMutation = useMutation({
        mutationFn: async () => {
            await axios.post(`${API_URL}/contests/${id}/register`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["contest", id]);
            toast.success("Successfully Registered!");
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Registration failed");
        },
    });

    // Submission Mutation
    const submitTaskMutation = useMutation({
        mutationFn: async (text) => {
            await axios.post(`${API_URL}/contests/${id}/submit-task`,
                { submission: text },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["contest", id]);
            setShowSubmitModal(false);
            setSubmission("");
            toast.success("Task submitted successfully!");
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Submission failed");
        },
    });

    // Countdown timer
    useEffect(() => {
        if (!contest) return;

        // Update immediately
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTimeLeft(calculateTimeLeft(contest.endDate));

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(contest.endDate));
        }, 1000);
        return () => clearInterval(timer);
    }, [contest]);

    // Handle Register Click
    const handleRegisterClick = () => {
        if (!user) {
            navigate("/login", { state: { from: `/contest/${id}` } });
            return;
        }
        if (user.role === "admin" || user.role === "creator") return;

        if (contest.price && contest.price > 0) {
            setIsPaymentModalOpen(true);
        } else {
            registerMutation.mutate();
        }
    };

    const handlePaymentSuccess = () => {
        setIsPaymentModalOpen(false);
        registerMutation.mutate();
    };

    // Submit task (normal user only, once)
    const handleSubmitTask = async () => {
        if (user.role === "admin" || user.role === "creator") return;
        if (!submission.trim()) return toast.error("Submission cannot be empty");
        submitTaskMutation.mutate(submission);
    };

    if (authLoading || isLoading) return <Loading />;

    if (queryError) return <p className="text-center text-red-600">{queryError.message}</p>;
    if (!contest) return <p className="text-center">Contest not found</p>;

    const ended = !timeLeft;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors pt-10 pb-20">

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                price={contest.price || 0}
                onSuccess={handlePaymentSuccess}
            />

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto p-6"
            >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="relative h-64 md:h-96 w-full">
                        <img
                            src={contest.image || "https://via.placeholder.com/800x400"}
                            alt={contest.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                            <div className="p-8 w-full">
                                <h1 className="text-4xl text-white font-bold mb-2 shadow-sm">{contest.title}</h1>
                                <div className="flex gap-4 text-gray-200 text-sm font-medium">
                                    <span className="bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">Participants: {contest.participants.length}</span>
                                    <span className="bg-indigo-600/80 px-3 py-1 rounded-full backdrop-blur-sm">Prize: ${contest.prizeMoney}</span>
                                    <span className="bg-green-600/80 px-3 py-1 rounded-full backdrop-blur-sm">Fee: {contest.price > 0 ? `$${contest.price}` : "Free"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="md:w-2/3">
                                <h2 className="text-2xl font-bold mb-4 border-b pb-2 dark:border-gray-700">Description</h2>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {contest.description}
                                </p>

                                <div className="mt-8">
                                    <h3 className="font-bold mb-2">Instructions</h3>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        {contest.instructions || "Follow the general contest guidelines. Submit your work before the deadline."}
                                    </p>
                                </div>
                            </div>

                            <div className="md:w-1/3 space-y-6">
                                <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-xl text-center">
                                    <h3 className="text-lg font-bold mb-2">Time Remaining</h3>
                                    <div className="text-2xl font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                                        {ended ? "Ended" : `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m`}
                                    </div>
                                </div>

                                {!ended && user?.role !== "admin" && user?.role !== "creator" && (
                                    <div className="space-y-4">
                                        <button
                                            onClick={handleRegisterClick}
                                            disabled={registered}
                                            className={`w-full py-3 rounded-xl font-bold text-lg shadow-lg transition-transform transform active:scale-95 ${registered
                                                ? "bg-gray-400 cursor-not-allowed opacity-70"
                                                : "bg-indigo-600 hover:bg-indigo-700 text-white"
                                                }`}
                                        >
                                            {registered ? "Registered" : contest.price > 0 ? "Pay & Join" : "Register Now"}
                                        </button>

                                        {registered && (
                                            <button
                                                disabled={hasSubmitted}
                                                onClick={() => setShowSubmitModal(true)}
                                                className={`w-full py-3 rounded-xl font-bold text-lg shadow-lg transition-transform transform active:scale-95 ${hasSubmitted
                                                    ? "bg-green-800/50 cursor-not-allowed text-white"
                                                    : "bg-green-600 hover:bg-green-700 text-white"
                                                    }`}
                                            >
                                                {hasSubmitted ? "Task Submitted" : "Submit Task"}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Submit Modal */}
            <AnimatePresence>
                {showSubmitModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="bg-white dark:bg-gray-800 p-8 rounded-2xl w-full max-w-lg shadow-2xl relative"
                        >
                            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Submit Your Entry</h3>
                            <textarea
                                value={submission}
                                onChange={(e) => setSubmission(e.target.value)}
                                className="w-full border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-4 rounded-xl mb-6 h-40 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                placeholder="Paste your project link or description here..."
                            />
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowSubmitModal(false)}
                                    className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitTask}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-500/30"
                                    disabled={submitTaskMutation.isPending}
                                >
                                    {submitTaskMutation.isPending ? "Submitting..." : "Submit"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ContestDetails;
