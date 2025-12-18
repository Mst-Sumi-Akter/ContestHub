import { useState } from "react";
import { useNavigate } from "react-router-dom";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import bannerImg from "../assets/360_F_280016453_VkNxKbvtljZxNWa3Y4A41BB6gEp1DIjY.jpg";

const Banner = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (search.trim() !== "") {
      navigate(`/all-contests?type=${search}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <section
      className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${bannerImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40 dark:from-black/80"></div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-5 max-w-4xl"
      >
        {/* Heading */}
        <motion.h1
          variants={itemVariants}
          className="heading-primary text-5xl md:text-7xl mb-6"
        >
          Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Creative</span> Contests
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-2xl text-gray-200 mb-10 leading-relaxed max-w-2xl mx-auto font-medium"
        >
          Join exciting contests, showcase your skills, and win amazing rewards! The world's most vibrant arena for creators.
        </motion.p>

        {/* Search Box Container */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="backdrop-blur-xl bg-white/10 dark:bg-black/20 p-2 md:p-3 rounded-2xl shadow-2xl border border-white/20 flex flex-col sm:flex-row justify-center items-center gap-3 max-w-2xl mx-auto"
        >
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search contest type (e.g. Design, Writing)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-6 py-4 w-full rounded-xl outline-none bg-white dark:bg-black dark:text-white border dark:border-gray-800 focus:ring-2 focus:ring-blue-500 transition-all font-medium"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSearch}
            className="px-8 py-4 w-full sm:w-auto rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 whitespace-nowrap"
          >
            Search
          </motion.button>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/all-contests")}
          className="mt-12 px-10 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-lg font-bold rounded-2xl border border-white/30 shadow-xl transition-all"
        >
          Explore All Contests
        </motion.button>
      </motion.div>
    </section>
  );
};

export default Banner;
