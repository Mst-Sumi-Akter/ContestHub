import React, { useEffect, useState, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Pagination size
const PAGE_SIZE = 6;

// Helper to truncate text
const truncate = (text, n = 120) =>
  text && text.length > n ? text.slice(0, n) + "..." : text;

const AllContests = () => {
  const { user, token } = useContext(AuthContext); // user context
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [page, setPage] = useState(1);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch contests
  useEffect(() => {
    const fetchContests = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/contests`, {
          headers: user ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) throw new Error("Failed to fetch contests");
        const data = await res.json();
        setContests(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, [user, token]);

  // Categories for tabs
  const categories = useMemo(() => {
    const cats = new Set(contests.map((c) => c.category));
    return ["All", ...Array.from(cats)];
  }, [contests]);

  // Filter contests by tab + search
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return contests.filter((c) => {
      const matchTab = activeTab === "All" || c.category === activeTab;
      const matchSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        (c.tags && c.tags.join(" ").toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q));
      return matchTab && matchSearch;
    });
  }, [contests, activeTab, search]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading)
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-[60vh] flex justify-center items-center text-red-600">
        {error}
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            All Contests
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
            Browse contests by category, search, and participate.
          </p>
        </div>

        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by title, tag or description..."
            className="px-4 py-2 border rounded-lg w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => {
              setSearch("");
              setActiveTab("All");
              setPage(1);
            }}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveTab(cat);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                activeTab === cat
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pageItems.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            No contests found.
          </div>
        ) : (
          pageItems.map((c) => {
            const userRegistered =
              user &&
              Array.isArray(c.participants) &&
              c.participants.includes(user.email);
            const userSubmitted =
              user &&
              Array.isArray(c.submissions) &&
              c.submissions.some((s) => s.userEmail === user.email);

            const ended = !c.isActive || new Date(c.endDate) < new Date();

            // ✅ Winner check
            const winnerSelected =
              Array.isArray(c.submissions) &&
              c.submissions.some((s) => s.status === "winner");

            return (
              <div
                key={c.id || c._id}
                className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden flex flex-col"
              >
                <img
                  src={
                    c.image || "https://via.placeholder.com/600x400?text=Contest"
                  }
                  alt={c.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-indigo-600">
                    {c.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 flex-1">
                    {truncate(c.description, 140)}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                    <div>
                      <p>
                        Participants:{" "}
                        <span className="font-medium text-gray-700 dark:text-gray-200">
                          {Array.isArray(c.participants)
                            ? c.participants.length
                            : 0}
                        </span>
                      </p>
                      <p>
                        Reward:{" "}
                        <span className="font-medium text-gray-700 dark:text-gray-200">
                          {c.reward ?? "—"}
                        </span>
                      </p>
                    </div>

                    <div
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        winnerSelected
                          ? "bg-yellow-100 text-yellow-800"
                          : !ended
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {winnerSelected ? "Winner Selected" : !ended ? "Active" : "Ended"}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex gap-2 flex-wrap">
                      {(c.tags || []).slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 rounded"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        if (!user) navigate("/login");
                        else navigate(`/contest/${c.id || c._id}`);
                      }}
                      className="px-3 py-1 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-medium">
            {(page - 1) * PAGE_SIZE + (pageItems.length ? 1 : 0)}
          </span>{" "}
          - <span className="font-medium">{(page - 1) * PAGE_SIZE + pageItems.length}</span>{" "}
          of <span className="font-medium">{filtered.length}</span>
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded-md border disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const pNum = i + 1;
            return (
              <button
                key={pNum}
                onClick={() => setPage(pNum)}
                className={`px-3 py-1 rounded-md ${
                  page === pNum ? "bg-indigo-600 text-white" : "border"
                }`}
              >
                {pNum}
              </button>
            );
          })}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded-md border disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllContests;
