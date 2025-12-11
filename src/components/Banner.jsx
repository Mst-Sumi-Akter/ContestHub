import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import bannerImg from "../assets/360_F_280016453_VkNxKbvtljZxNWa3Y4A41BB6gEp1DIjY.jpg";

const Banner = () => {
  const { theme } = useContext(ThemeContext);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (search.trim() !== "") {
      navigate(`/all-contests?type=${search}`);
    }
  };

  return (
    <section
      className="relative w-full h-[85vh] flex items-center justify-center"
      style={{
        backgroundImage: `url(${bannerImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40 dark:from-black/80"></div>

      <div className="relative z-10 text-center px-5 max-w-3xl">
        
        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-4">
          Discover Creative Contests
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed">
          Join exciting contests, showcase your skills, and win amazing rewards!
        </p>

        {/* Search Box Container */}
        <div className="backdrop-blur-md bg-white/20 dark:bg-black/30 p-4 rounded-xl shadow-xl flex flex-col sm:flex-row justify-center items-center gap-3">

          <input
            type="text"
            placeholder="Search contest type (e.g. Design, Writing)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-3 w-full sm:w-80 rounded-lg outline-none bg-white/90 dark:bg-gray-800 dark:text-white"
          />

          <button
            onClick={handleSearch}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-md"
          >
            Search
          </button>

        </div>

        {/* CTA Button */}
        <button
          onClick={() => navigate("/all-contests")}
          className="mt-8 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white text-lg font-semibold rounded-full shadow-lg hover:opacity-90 transition"
        >
          Explore All Contests
        </button>
      </div>
    </section>
  );
};

export default Banner;
