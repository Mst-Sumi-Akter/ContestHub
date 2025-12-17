import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

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

const ContestDetails = () => {
  const { user, loading: authLoading, token } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [timeLeft, setTimeLeft] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submission, setSubmission] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { state: { from: `/contest/${id}` } });
    }
  }, [authLoading, user, navigate, id]);

  // Fetch contest data
  useEffect(() => {
    if (!user || authLoading || !token) return;

    const fetchContest = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/contests/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch contest");
        const data = await res.json();

        data.participants = data.participants || [];
        data.submissions = data.submissions || [];

        setContest(data);

        // Only allow normal users to participate
        if (user.role === "admin" || user.role === "creator") {
          setRegistered(true);
          setHasSubmitted(true);
        } else {
          setRegistered(data.participants.includes(user.email));
          setHasSubmitted(
            data.submissions.some((s) => s.userEmail === user.email)
          );
        }

        setTimeLeft(calculateTimeLeft(data.endDate));
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContest();
  }, [id, user, authLoading, token]);

  // Countdown timer
  useEffect(() => {
    if (!contest) return;
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(contest.endDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [contest]);

  // Register for contest (normal user only)
  const handleRegister = async () => {
    if (user.role === "admin" || user.role === "creator") return;
    try {
      const res = await fetch(`${API_URL}/contests/${id}/register`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Registration failed");

      setRegistered(true);
      setContest((prev) => ({
        ...prev,
        participants: [...prev.participants, user.email],
      }));
    } catch (err) {
      alert(err.message);
    }
  };

  // Submit task (normal user only, once)
  const handleSubmitTask = async () => {
    if (user.role === "admin" || user.role === "creator") return;
    if (!submission.trim()) return alert("Submission cannot be empty");

    try {
      const res = await fetch(`${API_URL}/contests/${id}/submit-task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ submission }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Submission failed");
      }

      setHasSubmitted(true);
      setShowSubmitModal(false);
      setSubmission("");
      alert("Task submitted successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!contest) return <p className="text-center">Contest not found</p>;

  const ended = !timeLeft;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-20 pb-20"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg"
      >
        <img
          src={contest.image || "https://via.placeholder.com/800x400"}
          alt={contest.title}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
        <h1 className="text-3xl font-bold mb-4">{contest.title}</h1>
        <div className="flex justify-between mb-4 text-sm">
          <p>
            <strong>Participants:</strong> {contest.participants.length}
          </p>
          <p>
            <strong>Prize:</strong> ${contest.prizeMoney}
          </p>
        </div>
        <p className="text-red-600 font-semibold mb-4">
          {ended
            ? "Contest Ended"
            : `Time Left: ${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`}
        </p>
        <p className="text-gray-700 mb-6">{contest.description}</p>

        {!ended && user.role === "user" && (
          <div className="flex gap-4">
            <button
              onClick={handleRegister}
              disabled={registered}
              className={`px-4 py-2 rounded-lg text-white ${
                registered
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {registered ? "Registered" : "Register / Pay"}
            </button>

            {registered && (
              <button
                disabled={hasSubmitted}
                onClick={() => setShowSubmitModal(true)}
                className={`px-4 py-2 rounded-lg text-white ${
                  hasSubmitted
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {hasSubmitted ? "Task Submitted" : "Submit Task"}
              </button>
            )}
          </div>
        )}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white p-6 rounded-lg w-96"
            >
              <h3 className="text-xl font-semibold mb-4">Submit Your Task</h3>
              <textarea
                value={submission}
                onChange={(e) => setSubmission(e.target.value)}
                className="w-full border p-2 rounded mb-4"
                placeholder="Enter your task submission..."
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitTask}
                  className="px-4 py-2 bg-indigo-600 text-white rounded"
                  disabled={hasSubmitted}
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ContestDetails;
