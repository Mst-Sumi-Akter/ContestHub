import React from "react";
import { useNavigate } from "react-router-dom";

const recentWinners = [
  {
    name: "Alice Johnson",
    prize: "$500",
    image: "https://images.unsplash.com/photo-1617718860170-dd5d9f2ed43d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1hbiUyMGltYWdlfGVufDB8fDB8fHww",
  },
  {
    name: "Mark Wilson",
    prize: "$300",
    image: "https://media.istockphoto.com/id/2215351889/photo/smiling-adult-businessman-working-on-his-laptop-at-an-outdoor-cafe-in-the-city.webp?a=1&b=1&s=612x612&w=0&k=20&c=lRSNdvPV-Psl7zMzeKk2Sss8zi5qL4W1JMA7gGQGLJo=",
  },
  {
    name: "Sophia Lee",
    prize: "$200",
    image: "https://images.unsplash.com/photo-1664575602554-2087b04935a5?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d29tYW58ZW58MHx8MHx8fDA%3D",
  },
];

const WinnerAdvertisement = () => {
  const navigate = useNavigate();

  const handleExploreContests = () => {
    navigate("/all-contests"); // Redirect to All Contests page
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-10">
      {/* Header */}
      <div className="text-center mb-20">
        <h2 className="text-3xl font-bold text-indigo-700 mb-2">
          🌟 Our Recent Champions
        </h2>
        <p className="text-gray-600 text-lg">
          Join the excitement! See how our winners achieve great rewards.
        </p>
      </div>

      {/* Winner Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentWinners.map((winner, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl transition"
          >
            <img
              src={winner.image}
              alt={winner.name}
              className="w-24 h-24 rounded-full mb-4 object-cover"
            />
            <h3 className="text-xl font-semibold text-indigo-600">{winner.name}</h3>
            <p className="text-gray-500 mb-2">
              Prize: <span className="font-bold">{winner.prize}</span>
            </p>
            <p className="text-gray-400 text-sm">We celebrate every achievement!</p>
          </div>
        ))}
      </div>

      {/* Statistics / Motivational Section */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div className="bg-indigo-600 text-white rounded-xl p-6 shadow hover:shadow-lg transition">
          <p className="text-3xl font-bold">50+</p>
          <p className="mt-2">Total Winners</p>
        </div>
        <div className="bg-purple-600 text-white rounded-xl p-6 shadow hover:shadow-lg transition">
          <p className="text-3xl font-bold">$25,000</p>
          <p className="mt-2">Prize Money Awarded</p>
        </div>
        <div className="bg-indigo-500 text-white rounded-xl p-6 shadow hover:shadow-lg transition">
          <p className="text-3xl font-bold">100+</p>
          <p className="mt-2">Contests Hosted</p>
        </div>
      </div>

      {/* Motivational Text */}
      <div className="mt-12 text-center">
        <p className="text-gray-700 text-lg">
          💡 Your success story could be next! Participate now and become our next champion!
        </p>
        <button
          onClick={handleExploreContests}
          className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl  font-semibold transition"
        >
          Explore Contests
        </button>
      </div>
    </div>
  );
};

export default WinnerAdvertisement;
