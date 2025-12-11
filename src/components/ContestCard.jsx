import React from "react";

const ContestCard = ({ contest }) => {
  // contest object er example:
  // { title, description, date, imageUrl }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden max-w-sm w-full m-4 hover:scale-105 transform transition-all duration-300">
      {/* Contest Image */}
      {contest.imageUrl && (
        <img
          src={contest.imageUrl}
          alt={contest.title}
          className="w-full h-48 object-cover"
        />
      )}

      {/* Card Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
          {contest.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm">
          {contest.description.length > 100
            ? contest.description.slice(0, 100) + "..."
            : contest.description}
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
          Date: {contest.date}
        </p>

        {/* Action Button */}
        <button className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition">
          View Contest
        </button>
      </div>
    </div>
  );
};

export default ContestCard;
