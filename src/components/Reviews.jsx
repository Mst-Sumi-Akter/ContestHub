import React from "react";

// Sample reviews data
const reviews = [
  {
    name: "Alice Johnson",
    role: "Winner",
    text: "ContestHub is amazing! I participated and won my first prize. Highly recommended for everyone!",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Mark Wilson",
    role: "Participant",
    text: "The contests are fun and well-organized. The prizes are motivating and the experience is smooth.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Sophia Lee",
    role: "Winner",
    text: "I never thought I could win something online. ContestHub made it possible! Excited for more contests.",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    name: "David Smith",
    role: "Participant",
    text: "I love how easy it is to join contests here. Great platform for showcasing skills and winning prizes!",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
  },
];

const Reviews = () => {
  return (
    <div className="max-w-7xl mx-auto pt-12  overflow-hidden">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-indigo-700 mb-2">🌟 What Our Users Say</h2>
        <p className="text-gray-600 text-lg">
          Real experiences from participants and winners of ContestHub.
        </p>
      </div>

      {/* Animated Reviews Slider */}
      <div className="relative overflow-hidden">
        <div className="flex animate-scroll gap-6">
          {reviews.concat(reviews).map((review, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center text-center min-w-[300px] max-w-[320px] hover:shadow-xl transition"
            >
              <img
                src={review.image}
                alt={review.name}
                className="w-20 h-20 rounded-full mb-3 object-cover border-4 border-indigo-200"
              />
              <h3 className="text-xl font-semibold text-indigo-600">{review.name}</h3>
              <p className="text-sm text-gray-400 mb-1">{review.role}</p>
              <p className="text-gray-600 text-sm">{review.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CSS Animation */}
      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll {
            display: flex;
            gap: 1.5rem;
            animation: scroll 20s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Reviews;
