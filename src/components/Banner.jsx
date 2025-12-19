import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Slider images
import banner1 from "../assets/360_F_280016453_VkNxKbvtljZxNWa3Y4A41BB6gEp1DIjY.jpg";
import banner2 from "../assets/istockphoto-916815136-612x612.webp";
import banner3 from "../assets/original-a310afe7a0ce39690ed2119136aee71d.webp";

const bannerImages = [banner1, banner2, banner3];

const Banner = () => {
  const [search, setSearch] = useState("");
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  // Auto slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    if (search.trim()) {
      navigate(`/all-contests?type=${search}`);
    }
  };

  return (
    <section className="relative w-full h-[85vh] min-h-[520px] flex items-center justify-center overflow-hidden">
      
      {/* Background Image Slider */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${bannerImages[current]})`,

            /* 🔥 IMAGE SIZE FIX */
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",          // desktop perfect fit
            backgroundPosition: "center",     // balanced crop
          }}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/40" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center px-5 max-w-4xl"
      >
        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-white">
          Discover{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
            Creative
          </span>{" "}
          Contests
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-2xl text-gray-200 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
          Join exciting contests, showcase your skills, and win amazing rewards!
          The world's most vibrant arena for creators.
        </p>

        {/* Search Box */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="backdrop-blur-xl bg-white/10 p-2 md:p-3 rounded-2xl
                     shadow-2xl border border-white/20
                     flex flex-col sm:flex-row items-center gap-3 max-w-2xl mx-auto"
        >
          <input
            type="text"
            placeholder="Search contest type (e.g. Design, Writing)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-6 py-4 w-full rounded-xl outline-none
                       bg-white text-gray-900
                       focus:ring-2 focus:ring-blue-500 transition-all font-medium"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSearch}
            className="px-8 py-4 w-full sm:w-auto rounded-xl
                       bg-blue-600 text-white font-bold
                       hover:bg-blue-700 transition shadow-lg shadow-blue-500/30"
          >
            Search
          </motion.button>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/all-contests")}
          className="mt-12 px-10 py-4 bg-white/10 hover:bg-white/20
                     backdrop-blur-md text-white text-lg font-bold
                     rounded-2xl border border-white/30 shadow-xl transition-all"
        >
          Explore All Contests
        </motion.button>
      </motion.div>
    </section>
  );
};

export default Banner;
