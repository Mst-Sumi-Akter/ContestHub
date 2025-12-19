import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Loading from "../../components/Loading";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "https://contest-hub-server-gamma-drab.vercel.app";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const EditContest = () => {
  const { token, user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [deadline, setDeadline] = useState(new Date());

  const { data: contest, isLoading, isError } = useQuery({
    queryKey: ["contest", id],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/contests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.endDate) setDeadline(new Date(res.data.endDate));
      return res.data;
    },
    enabled: !!id && !!token,
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedData) => {
      await axios.put(
        `${API_URL}/contests/${id}`,
        { ...updatedData, endDate: deadline },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["my-created", user?.email]);
      queryClient.invalidateQueries(["contest", id]);
      toast.success("Contest updated successfully", { id: "contest-action" });
      navigate("/dashboard/my-created");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Update failed");
    },
  });

  const updating = updateMutation.isPending;

  // Local state for form (mirroring contest)
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (contest && !formData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(contest);
    }
  }, [contest, formData]);

  if (isLoading) return <Loading />;
  if (isError || !contest) return <p className="text-center mt-10 text-red-500">Contest not found</p>;
  if (!formData) return null;

  // ================= FETCH CONTEST =================


  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };



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
            value={formData.taskInstruction || ""}
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
