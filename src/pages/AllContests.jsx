import React, { useState, useMemo, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Loading from "../components/Loading";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

// Pagination size
const PAGE_SIZE = 6;

// Helper to truncate text
const truncate = (text, n = 120) =>
    text && text.length > n ? text.slice(0, n) + "..." : text;

const API_URL = import.meta.env.VITE_API_URL || "https://contest-hub-server-gamma-drab.vercel.app";

const AllContests = () => {
    const { token } = useContext(AuthContext); // removed unused user
    const [searchParams] = useSearchParams(); // removed unused setSearchParams
    const initialSearch = searchParams.get("search") || "";

    const [search, setSearch] = useState(initialSearch);
    const [activeTab, setActiveTab] = useState("All");
    const [page, setPage] = useState(1);

    // Payment State


    const navigate = useNavigate();

    const { data: contests = [], isLoading, error: queryError } = useQuery({
        queryKey: ["contests", activeTab, search],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/contests`, {
                params: { category: activeTab, search },
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            });
            return res.data;
        },
    });

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

    if (isLoading) return <Loading />;

    if (queryError)
        return (
            <div className="min-h-[60vh] flex justify-center items-center text-red-600">
                {queryError.message || "Something went wrong"}
            </div>
        );


    return (
        <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-6">
                <div>
                    <h1 className="heading-primary text-4xl md:text-6xl text-center mb-12">
                        Explore All Contests
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">
                        Discover opportunities, compete, and win big.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-center w-full sm:w-auto">
                    <div className="relative w-full sm:w-80">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-5 h-5"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </span>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            placeholder="Search..."
                            className="pl-10 px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-black rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow shadow-sm dark:text-white"
                        />
                    </div>
                    <button
                        onClick={() => {
                            setSearch("");
                            setActiveTab("All");
                            setPage(1);
                        }}
                        className="px-5 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-gray-700 dark:text-gray-200 font-medium transition-colors"
                    >
                        Reset
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-8 overflow-x-auto pb-2 scrollbar-hide">
                <div className="flex gap-3">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => {
                                setActiveTab(cat);
                                setPage(1);
                            }}
                            className={`px-6 py-2.5 rounded-full whitespace-nowrap text-sm font-semibold transition-all duration-300 ${activeTab === cat
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 transform scale-105"
                                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
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
                        const ended = !c.isActive || new Date(c.endDate) < new Date();
                        const winnerSelected =
                            Array.isArray(c.submissions) &&
                            c.submissions.some((s) => s.status === "winner");

                        return (
                            <div
                                key={c.id || c._id}
                                className="bg-white dark:bg-black border dark:border-gray-800 shadow rounded-lg overflow-hidden flex flex-col"
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
                                        {truncate(c.description, 100)}
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
                                            className={`px-2 py-1 rounded text-xs font-semibold ${winnerSelected
                                                ? "bg-yellow-100 text-yellow-800"
                                                : !ended
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {winnerSelected ? "Winner Selected" : !ended ? "Active" : "Ended"}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <button
                                            onClick={() => navigate(`/contest/${c.id || c._id}`)}
                                            className="w-full py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
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
            {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 rounded-lg border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>

                    {Array.from({ length: totalPages }).map((_, i) => {
                        const pNum = i + 1;
                        return (
                            <button
                                key={pNum}
                                onClick={() => setPage(pNum)}
                                className={`w-10 h-10 rounded-lg font-medium transition-colors ${page === pNum
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900"}`}
                            >
                                {pNum}
                            </button>
                        );
                    })}

                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="p-2 rounded-lg border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export default AllContests;
