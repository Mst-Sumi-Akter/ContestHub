import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";

const EditContest = () => {
  const { token, user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deadline, setDeadline] = useState(new Date());

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch contest data
  useEffect(() => {
    if (!id || !token) return;

    const fetchContest = async () => {
      try {
        const res = await axios.get(`${API_URL}/contests/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContest(res.data);
        if (res.data.endDate) setDeadline(new Date(res.data.endDate));
      } catch (err) {
        console.error(err);
        toast.error("Failed to load contest data");
      } finally {
        setLoading(false);
      }
    };

    fetchContest();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setContest((prev) => ({ ...prev, [name]: checked }));
    } else {
      setContest((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    try {
      setUpdating(true);
      await axios.put(
        `${API_URL}/contests/${id}`,
        { ...contest, endDate: deadline },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Contest updated successfully!");
      navigate("/dashboard/my-contests");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading contest...</p>;

  if (!contest)
    return <p className="text-center mt-10 text-red-500">Contest not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800 dark:text-gray-100">
        Edit Contest
      </h1>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
        {/* Contest Name */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700 dark:text-gray-200 mb-1">
            Contest Name *
          </label>
          <input
            name="name"
            value={contest.name || ""}
            onChange={handleChange}
            placeholder="UI Design Challenge"
            className="input shadow-sm border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        {/* Contest Type */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700 dark:text-gray-200 mb-1">
            Contest Type *
          </label>
          <select
            name="contestType"
            value={contest.contestType || ""}
            onChange={handleChange}
            className="input shadow-sm border border-gray-300 dark:border-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="">Select Type</option>
            <option value="Design">Design</option>
            <option value="Development">Development</option>
            <option value="Photography">Photography</option>
            <option value="Writing">Writing</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>

        {/* Image URL */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700 dark:text-gray-200 mb-1">
            Image URL *
          </label>
          <input
            name="image"
            value={contest.image || ""}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="input shadow-sm border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        {/* Image Preview */}
        <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-2 bg-gray-50 dark:bg-gray-800">
          {contest.image ? (
            <img src={contest.image} alt="Preview" className="h-36 object-cover rounded-md" />
          ) : (
            <p className="text-gray-400 dark:text-gray-500">Image Preview</p>
          )}
        </div>

        {/* Price */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700 dark:text-gray-200 mb-1">
            Participation Price *
          </label>
          <input
            name="price"
            type="number"
            value={contest.price || 0}
            onChange={handleChange}
            className="input shadow-sm border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        {/* Prize Money */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700 dark:text-gray-200 mb-1">
            Prize Money *
          </label>
          <input
            name="prizeMoney"
            type="number"
            value={contest.prizeMoney || 0}
            onChange={handleChange}
            className="input shadow-sm border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        {/* End Date */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700 dark:text-gray-200 mb-1">
            End Date *
          </label>
          <DatePicker
            selected={deadline}
            onChange={(date) => setDeadline(date)}
            minDate={new Date()}
            className="input w-full shadow-sm border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        {/* Is Active */}
        <div className="flex flex-col justify-center">
          <label className="font-medium text-gray-700 dark:text-gray-200 mb-1">
            Is Active
          </label>
          <input
            type="checkbox"
            name="isActive"
            checked={contest.isActive || false}
            onChange={handleChange}
            className="h-5 w-5 accent-indigo-500"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2 flex flex-col">
          <label className="font-medium text-gray-700 dark:text-gray-200 mb-1">
            Description *
          </label>
          <textarea
            name="description"
            value={contest.description || ""}
            onChange={handleChange}
            rows="3"
            placeholder="Short contest overview"
            className="input shadow-sm border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        {/* Task Instruction */}
        <div className="md:col-span-2 flex flex-col">
          <label className="font-medium text-gray-700 dark:text-gray-200 mb-1">
            Task Instruction *
          </label>
          <textarea
            name="taskInstruction"
            value={contest.taskInstruction || ""}
            onChange={handleChange}
            rows="4"
            placeholder="What participants need to submit"
            className="input shadow-sm border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 text-right">
          <button
            type="submit"
            disabled={updating}
            className="px-10 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md transition duration-300 disabled:opacity-50"
          >
            {updating ? "Updating..." : "Update Contest"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditContest;
