import React, { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";

const API_URL = import.meta.env.VITE_API_URL || "https://contest-hub-server-gamma-drab.vercel.app";

const Packages = () => {
    const { token, user } = useContext(AuthContext);
    const queryClient = useQueryClient();

    // Fetch available packages
    const { data: packages = [], isLoading } = useQuery({
        queryKey: ["packages"],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/packages`);
            return res.data;
        },
    });

    // Purchase package mutation
    const purchaseMutation = useMutation({
        mutationFn: async (packageId) => {
            const res = await axios.post(
                `${API_URL}/users/buy-package`,
                { packageId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["auth-me"]);
            toast.success("Package purchased successfully!");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Purchase failed");
        },
    });

    if (isLoading) return <Loading />;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-4xl font-extrabold text-center mb-12 dark:text-white">Upgrade Your Contest Plan</h1>

            <div className="grid md:grid-cols-3 gap-8">
                {packages.map((pkg) => (
                    <div
                        key={pkg.id}
                        className={`bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl flex flex-col items-center text-center border-t-8 ${pkg.id === "pro" ? "border-blue-500 scale-105" : "border-indigo-400"
                            }`}
                    >
                        <h2 className="text-2xl font-bold mb-4 dark:text-white">{pkg.name}</h2>
                        <div className="text-4xl font-extrabold text-indigo-600 mb-4">${pkg.price}</div>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">{pkg.description}</p>
                        <ul className="text-left w-full space-y-3 mb-8 text-gray-600 dark:text-gray-300">
                            <li className="flex items-center gap-2">✅ Limit: {pkg.limit} Contests</li>
                            <li className="flex items-center gap-2">✅ Priority Approval</li>
                            <li className="flex items-center gap-2">✅ Dashboard Access</li>
                        </ul>
                        <button
                            onClick={() => purchaseMutation.mutate(pkg.id)}
                            disabled={purchaseMutation.isPending || (user?.currentPackage === pkg.id)}
                            className={`mt-auto w-full py-3 rounded-xl font-bold transition ${user?.currentPackage === pkg.id
                                    ? "bg-green-100 text-green-700 cursor-default"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                                }`}
                        >
                            {user?.currentPackage === pkg.id ? "Current Plan" : purchaseMutation.isPending ? "Purchasing..." : "Choose Plan"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Packages;
