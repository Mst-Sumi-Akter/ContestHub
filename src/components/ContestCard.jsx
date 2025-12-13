import React from "react";
import { Link } from "react-router-dom";

const ContestCard = ({ contest }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden max-w-sm w-full m-4 hover:scale-105 transform transition-all duration-300">
      
      {/* Contest Image */}
      <img
        src={contest.image || "https://via.placeholder.com/600x400?text=Contest"}
        alt={contest.title}
        className="w-full h-48 object-cover"
      />

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
          {contest.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm">
          {contest.description?.length > 100
            ? contest.description.slice(0, 100) + "..."
            : contest.description}
        </p>

        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
          Starts: {contest.startDate ? contest.startDate.slice(0, 10) : "N/A"}
        </p>

        {/* Link to Contest Details */}
        <Link
          to={`/contest/${contest._id}`} 
          className="w-full block text-center bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          View Contest
        </Link>
      </div>
    </div>
  );
};

export default ContestCard;
