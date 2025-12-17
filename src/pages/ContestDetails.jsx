import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { div } from "framer-motion/client";

// Countdown helper
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

  // Fetch contest
  useEffect(() => {
    if (!user || authLoading || !token) return;

    const fetchContest = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/contests/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch contest");
        const data = await res.json();

        if (!Array.isArray(data.participants)) data.participants = [];
        if (!Array.isArray(data.submissions)) data.submissions = [];

        setContest(data);
        setTimeLeft(calculateTimeLeft(data.endDate));

        // registration check
        setRegistered(data.participants.includes(user.email));

        // submission check
        const submitted = data.submissions.some(
          (s) => s.email === user.email
        );
        setHasSubmitted(submitted);

        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContest();
  }, [id, user, authLoading, token]);

  // Countdown
  useEffect(() => {
    if (!contest) return;
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(contest.endDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [contest]);

  // Register contest
  const handleRegister = async () => {
    try {
      const res = await fetch(`${API_URL}/contests/${id}/register`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  // Submit task (ONLY ONCE)
  const handleSubmitTask = async () => {
    if (!submission.trim()) {
      alert("Submission cannot be empty");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/contests/${id}/submit-task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ submission }),
      });

      if (!res.ok) throw new Error("Submission failed");

      alert("Task submitted successfully!");
      setHasSubmitted(true);
      setShowSubmitModal(false);
      setSubmission("");
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

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  if (!contest) {
    return <p className="text-center text-gray-500">Contest not found</p>;
  }

  const ended = !timeLeft;

  return (
    <div className="pt-20 pb-20">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <img
        src={contest.image || "https://via.placeholder.com/800x400"}
        alt={contest.title}
        className="w-full h-64 object-cover rounded-lg mb-6"
      />

      <h1 className="text-3xl font-bold mb-4">{contest.title}</h1>

      <div className="flex justify-between mb-4 text-sm">
        <p><strong>Participants:</strong> {contest.participants.length}</p>
        <p><strong>Prize:</strong> { contest.prizeMoney || "—"}</p>
      </div>

      <p className="text-red-600 font-semibold mb-4">
        {ended
          ? "Contest Ended"
          : `Time Left: ${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`}
      </p>

      <p className="text-gray-700 mb-6">{contest.description}</p>

      {!ended && (
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
              onClick={() => {
                if (!hasSubmitted) setShowSubmitModal(true);
              }}
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

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Submit Your Task</h3>
            <textarea
              value={submission}
              onChange={(e) => setSubmission(e.target.value)}
              className="w-full border p-2 rounded mb-4"
              placeholder="Submission link or details"
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
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default ContestDetails;
