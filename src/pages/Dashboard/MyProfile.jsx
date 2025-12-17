import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import logo from "../../assets/logo.jpg";

ChartJS.register(ArcElement, Tooltip, Legend);

const MyProfile = () => {
  const auth = useContext(AuthContext);

  const user = auth?.user;
  const token = auth?.token;
  const setUser = auth?.setUser;

  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [bio, setBio] = useState("");
  const [participated, setParticipated] = useState(0);
  const [won, setWon] = useState(0);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data || {};
        setName(data.name || "");
        setPhotoURL(data.photoURL || "");
        setBio(data.bio || "");

        if (typeof setUser === "function") {
          setUser((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error("Profile fetch error:", err?.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  /* ================= FETCH CONTEST DATA ================= */
  useEffect(() => {
    if (!token || !user?.email) return;

    const fetchContests = async () => {
      try {
        const res = await axios.get(`${API_URL}/contests`);
        const contests = res.data || [];

        const participatedList = contests.filter(
          (c) =>
            Array.isArray(c.participants) &&
            c.participants.includes(user.email)
        );

        const wonList = contests.filter(
          (c) => c?.winner?.email === user.email
        );

        setParticipated(participatedList.length);
        setWon(wonList.length);
      } catch (err) {
        console.error("Contest fetch error:", err?.response?.data || err.message);
      }
    };

    fetchContests();
  }, [token, user?.email]);

  /* ================= UPDATE PROFILE ================= */
  const handleUpdate = async () => {
    if (!token) return alert("Login required");

    try {
      const res = await axios.put(
        `${API_URL}/auth/me`,
        { name, photoURL, bio },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data && typeof setUser === "function") {
        setUser((prev) => ({ ...prev, ...res.data }));
      }

      alert("Profile updated successfully");
    } catch (err) {
      console.error("Profile update failed:", err?.response?.data || err.message);
      alert(err?.response?.data?.message || "Update failed");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  const winPercentage = participated
    ? Math.round((won / participated) * 100)
    : 0;

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

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">My Profile</h1>

      {/* PROFILE HEADER */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        <img
          src={photoURL || logo}
          alt="profile"
          className="w-32 h-32 rounded-full border-2 border-indigo-500 object-cover"
        />
        <div>
          <h2 className="text-xl font-semibold">{name || "User"}</h2>
          <p className="text-gray-500">{user?.email}</p>
        </div>
      </div>

      {/* FORM */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <label>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label>Photo URL</label>
          <input
            value={photoURL}
            onChange={(e) => setPhotoURL(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="md:col-span-2">
          <label>Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="md:col-span-2 text-right">
          <button
            onClick={handleUpdate}
            className="bg-indigo-600 text-white px-6 py-2 rounded"
          >
            Update Profile
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded">
        <h2 className="mb-4 font-semibold">
          Win Percentage: {winPercentage}%
        </h2>
        <Pie data={chartData} />
      </div>
    </div>
  );
};

export default MyProfile;
