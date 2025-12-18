import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import toast from "react-hot-toast";
import logo from "../../assets/logo.jpg";

ChartJS.register(ArcElement, Tooltip, Legend);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const MyProfile = () => {
  const { user, token, setUser, contestStatsUpdated } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState("");
  const [participated, setParticipated] = useState(0);
  const [won, setWon] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data || {};
        setName(data.name || "");
        setPhotoURL(data.photoURL || "");
        setBio(data.bio || "");
        setRole(data.role || "User");

        if (setUser) setUser(prev => ({ ...prev, ...data }));
      } catch (err) {
        console.error("Profile fetch error:", err?.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, setUser]);

  // Fetch contest stats
  useEffect(() => {
    const fetchContests = async () => {
      if (!token || !user?.email) return;

      try {
        const res = await axios.get(`${API_URL}/contests`);
        const contests = res.data || [];

        const participatedList = contests.filter(
          c => Array.isArray(c.participants) && c.participants.includes(user.email)
        );
        const wonList = contests.filter(
          c => Array.isArray(c.submissions) && c.submissions.some(s => s.userEmail === user.email && s.status === "winner")
        );

        setParticipated(participatedList.length);
        setWon(wonList.length);
      } catch (err) {
        console.error("Contest fetch error:", err?.response?.data || err.message);
      }
    };

    fetchContests();
  }, [token, user?.email, contestStatsUpdated]);

  // Update profile
  const handleUpdate = async () => {
    if (!token) return setError("Login required");
    if (!user?.email) return setError("User info missing");

    if (name === user?.name && photoURL === user?.photoURL && bio === user?.bio) return;

    try {
      setUpdating(true);
      setError("");

      const res = await axios.put(
        `${API_URL}/auth/me`,
        { name, photoURL, bio },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data && setUser) setUser(prev => ({ ...prev, ...res.data }));
      toast.success("Profile updated successfully", { id: "profile-update" });
    } catch (err) {
      console.error("Profile update failed:", err?.response?.data || err.message);
      setError(err?.response?.data?.message || "Update failed");
      toast.error("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;

  const winPercentage = participated ? Math.round((won / participated) * 100) : 0;
  const chartData = {
    labels: ["Won", "Lost"],
    datasets: [
      {
        data: [won, participated - won],
        backgroundColor: ["#4ade80", "#f87171"],
        borderWidth: 1,
      },
    ],
  };

  const isChanged = name !== user?.name || photoURL !== user?.photoURL || bio !== user?.bio;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-black border dark:border-gray-800 rounded-xl shadow-lg">
      <h1 className="heading-primary text-3xl md:text-5xl mb-12 text-center uppercase">My Profile</h1>

      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        <img
          src={photoURL || logo}
          alt="profile"
          className="w-32 h-32 rounded-full border-2 border-indigo-500 object-cover"
        />
        <div>
          <h2 className="text-xl font-semibold">{name || "User"}</h2>
          <p className="text-gray-500">{user?.email}</p>
          {role && <p className="text-gray-600 mt-2">{role}</p>}
        </div>
      </div>

      {/* Profile Form */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="font-medium">Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="font-medium">Photo URL</label>
          <input
            value={photoURL}
            onChange={e => setPhotoURL(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="font-medium">Bio</label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {error && <p className="md:col-span-2 text-red-500">{error}</p>}

        <div className="md:col-span-2 text-right">
          <button
            onClick={handleUpdate}
            disabled={updating || !isChanged}
            className={`px-6 py-2 rounded text-white ${updating || !isChanged ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
          >
            {updating ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gray-100 dark:bg-gray-950 p-6 rounded border dark:border-gray-800">
        <h2 className="mb-4 font-semibold text-center text-lg">
          Win Percentage: {winPercentage}%
        </h2>
        <Pie data={chartData} />
      </div>
    </div>
  );
};

export default MyProfile;
