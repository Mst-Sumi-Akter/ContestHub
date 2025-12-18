import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const EditContest = () => {
  const { token, user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deadline, setDeadline] = useState(new Date());

  // ================= FETCH CONTEST =================
  useEffect(() => {
    if (!id || !token) return;

    const fetchContest = async () => {
      try {
        const res = await axios.get(`${API_URL}/contests/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Only creator can edit
        if (res.data.creatorEmail !== user.email) {
          toast.error("You are not allowed to edit this contest");
          return navigate("/dashboard/my-created");
        }

        setContest(res.data);
        if (res.data.endDate) setDeadline(new Date(res.data.endDate));
      } catch {
        toast.error("Failed to load contest data");
      } finally {
        setLoading(false);
      }
    };

    fetchContest();
  }, [id, token, user, navigate]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setContest((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);
      await axios.put(
        `${API_URL}/contests/${id}`,
        { ...contest, endDate: deadline },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Contest updated successfully", { id: "contest-action" });
      navigate("/dashboard/my-created");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return <p className="text-center mt-10">Loading contest...</p>;

  if (!contest)
    return <p className="text-center mt-10 text-red-500">Contest not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Edit Contest</h1>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
        {/* Title */}
        <div>
          <label>Contest Title *</label>
          <input
            name="title"
            value={contest.title || ""}
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* Category */}
        <div>
          <label>Category *</label>
          <select
            name="category"
            value={contest.category || ""}
            onChange={handleChange}
            className="input"
          >
            <option value="">Select</option>
            <option value="Design">Design</option>
            <option value="Development">Development</option>
            <option value="Photography">Photography</option>
            <option value="Writing">Writing</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>

        {/* Image */}
        <div>
          <label>Image URL *</label>
          <input
            name="image"
            value={contest.image || ""}
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* Preview */}
        <div className="flex justify-center items-center border rounded">
          {contest.image && (
            <img src={contest.image} alt="preview" className="h-32 rounded" />
          )}
        </div>

        {/* Price */}
        <div>
          <label>Price *</label>
          <input
            type="number"
            name="price"
            value={contest.price || 0}
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* Prize */}
        <div>
          <label>Prize Money *</label>
          <input
            type="number"
            name="prizeMoney"
            value={contest.prizeMoney || 0}
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* End Date */}
        <div>
          <label>End Date *</label>
          <DatePicker
            selected={deadline}
            onChange={setDeadline}
            minDate={new Date()}
            className="input w-full"
          />
        </div>

        {/* Active */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            checked={contest.isActive || false}
            onChange={handleChange}
          />
          <label>Is Active</label>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label>Description *</label>
          <textarea
            name="description"
            value={contest.description || ""}
            onChange={handleChange}
            rows={3}
            className="input"
          />
        </div>

        {/* Task */}
        <div className="md:col-span-2">
          <label>Task Instruction *</label>
          <textarea
            name="taskInstruction"
            value={contest.taskInstruction || ""}
            onChange={handleChange}
            rows={4}
            className="input"
          />
        </div>

        <div className="md:col-span-2 text-right">
          <button
            disabled={updating}
            className="px-8 py-3 bg-indigo-600 text-white rounded"
          >
            {updating ? "Updating..." : "Update Contest"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditContest;
