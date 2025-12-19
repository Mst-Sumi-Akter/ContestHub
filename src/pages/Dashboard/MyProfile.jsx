import React, { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../../components/Loading";
import logo from "../../assets/logo.jpg";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const API_URL = import.meta.env.VITE_API_URL || "https://contest-hub-server-gamma-drab.vercel.app";

const MyProfile = () => {
  const { user, token, setUser } = useContext(AuthContext);

  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [bio, setBio] = useState("");

  // Fetch Profile
  const { isLoading: profileLoading } = useQuery({
    queryKey: ["auth-me"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data || {};
      setName(data.name || "");
      setPhotoURL(data.photoURL || "");
      setBio(data.bio || "");
      if (setUser) setUser(prev => ({ ...prev, ...data }));
      return data;
    },
    enabled: !!token,
  });

  // Fetch Stats
  const { data: stats = { participated: 0, won: 0 }, isLoading: statsLoading } = useQuery({
    queryKey: ["user-stats", user?.email],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/contests`);
      const contests = res.data || [];
      const participatedList = contests.filter(
        c => Array.isArray(c.participants) && c.participants.includes(user.email)
      );
      const wonList = contests.filter(
        c => Array.isArray(c.submissions) && c.submissions.some(s => s.userEmail === user.email && s.status === "winner")
      );
      return { participated: participatedList.length, won: wonList.length };
    },
    enabled: !!user?.email && !!token,
  });

  const participated = stats.participated;
  const won = stats.won;

  // Update Profile Mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await axios.put(`${API_URL}/auth/me`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (setUser) setUser(prev => ({ ...prev, ...data }));
      queryClient.invalidateQueries(["auth-me"]);
      toast.success("Profile updated successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Update failed");
    },
  });

  const handleUpdate = () => {
    updateMutation.mutate({ name, photoURL, bio });
  };

  if (profileLoading || statsLoading) return <Loading />;

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
          {user?.role && <p className="text-gray-600 mt-2 capitalize">{user.role}</p>}
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



        <div className="md:col-span-2 text-right">
          <button
            onClick={handleUpdate}
            disabled={updateMutation.isPending || !isChanged}
            className={`px-6 py-2 rounded text-white ${updateMutation.isPending || !isChanged ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
          >
            {updateMutation.isPending ? "Updating..." : "Update Profile"}
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
