import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Countdown helper
const calculateTimeLeft = (endDate) => {
  if (!endDate) return null;
  const difference = new Date(endDate) - new Date();
  if (difference <= 0) return null;

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

const ContestDetails = () => {
  const { user, loading: authLoading, token } = useContext(AuthContext);
  const { id } = useParams(); // MongoDB _id
  const navigate = useNavigate();

  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submission, setSubmission] = useState("");
  const [registered, setRegistered] = useState(false);

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
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/contests/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, 
          },
        });
        if (!res.ok) throw new Error("Failed to fetch contest");

        const data = await res.json();

        //  Ensure participants is always an array
        if (!Array.isArray(data.participants)) data.participants = [];

        setContest(data);
        setTimeLeft(calculateTimeLeft(data.endDate));

        // Check if user already registered
        const isRegistered = data.participants.includes(user.email);
        setRegistered(isRegistered);

        setError(null);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchContest();
  }, [id, user, authLoading, API_URL, token]);

  // Countdown timer
  useEffect(() => {
    if (!contest) return;
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(contest.endDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [contest]);

  // Register for contest
  const handleRegister = async () => {
    try {
      const res = await fetch(`${API_URL}/contests/${id}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Registration failed");
      }

      setRegistered(true);
      setContest({
        ...contest,
        participants: [...contest.participants, user.email],
      });
    } catch (err) {
      alert(err.message);
    }
  };

  // Submit task
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

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Submission failed");
      }

      alert("Task submitted successfully!");
      setShowSubmitModal(false);
      setSubmission("");
    } catch (err) {
      alert(err.message);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
        Contest not found
      </div>
    );
  }

  const ended = !timeLeft;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <img
        src={contest.image || "https://via.placeholder.com/800x400?text=Contest"}
        alt={contest.title}
        className="w-full h-64 object-cover rounded-lg mb-6"
      />

      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
        {contest.title}
      </h1>

      <div className="flex justify-between mb-4">
        <p>
          <strong>Participants:</strong> {contest.participants.length}
        </p>
        <p>
          <strong>Prize:</strong> {contest.reward || "—"}
        </p>
      </div>

      <p className="mb-4 text-red-600 font-semibold">
        {ended
          ? "Contest Ended"
          : `Time Left: ${timeLeft.days || 0}d ${timeLeft.hours || 0}h ${
              timeLeft.minutes || 0
            }m ${timeLeft.seconds || 0}s`}
      </p>

      <p className="text-gray-700 dark:text-gray-300 mb-6">{contest.description}</p>

      {contest.winner && (
        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-2">Winner</h2>
          <div className="flex items-center gap-4">
            <img
              src={contest.winner.photo || "https://via.placeholder.com/64"}
              alt={contest.winner.name}
              className="w-16 h-16 rounded-full"
            />
            <span className="text-gray-800 dark:text-white">{contest.winner.name}</span>
          </div>
        </div>
      )}

      {!ended && (
        <div className="flex gap-4 mb-6">
          <button
            onClick={handleRegister}
            disabled={registered}
            className={`px-4 py-2 rounded-lg text-white ${
              registered ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {registered ? "Registered" : "Register / Pay"}
          </button>

          {registered && (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
            >
              Submit Task
            </button>
          )}
        </div>
      )}

      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Submit Your Task</h3>
            <textarea
              value={submission}
              onChange={(e) => setSubmission(e.target.value)}
              className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Provide your submission link or details..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitTask}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContestDetails;
