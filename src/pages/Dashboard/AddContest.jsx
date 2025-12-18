import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";

const AddContest = () => {
  const { token, user } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const [deadline, setDeadline] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const imageURL = watch("image");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Role Guard
  if (user?.role !== "creator") {
    return (
      <div className="text-center mt-24 text-red-500 font-bold text-lg">
        🚫 Access Denied: Creators only
      </div>
    );
  }

  const onSubmit = async (data) => {
    if (!token) {
      toast.error("Login required");
      return;
    }

    const contestData = {
      title: data.title,
      category: data.category, // changed from contestType → category
      image: data.image,
      description: data.description,
      price: Number(data.price),
      prizeMoney: Number(data.prizeMoney),
      reward: data.reward,
      participants: Number(data.participants) || 0,
      taskInstruction: data.taskInstruction,
      endDate: deadline,
      isActive: data.isActive || false,
    };

    try {
      setLoading(true);
      await axios.post(`${API_URL}/contests`, contestData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Contest created successfully!", { id: "contest-action" });
      reset();
      setDeadline(new Date());
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to create contest");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800 dark:text-gray-100">
        Add New Contest
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-6">

        {/* Contest Title */}
        <div className="flex flex-col">
          <label className="font-medium mb-1">Contest Title *</label>
          <input
            {...register("title", { required: "Contest title is required" })}
            className="input p-3 rounded-lg border"
            placeholder="UI Design Challenge"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        {/* Category */}
        <div className="flex flex-col">
          <label className="font-medium mb-1">Category *</label>
          <select
            {...register("category", { required: "Category is required" })}
            className="input p-2 rounded-lg border"
          >
            <option value="">Select Category</option>
            <option value="Design">Design</option>
            <option value="Development">Development</option>
            <option value="Photography">Photography</option>
            <option value="Writing">Writing</option>
            <option value="Marketing">Marketing</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category.message}</p>
          )}
        </div>

        {/* Image URL */}
        <div className="flex flex-col">
          <label className="font-medium mb-1">Image URL *</label>
          <input
            {...register("image", { required: true })}
            className="input p-3 rounded-lg border"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Image Preview */}
        <div className="flex items-center justify-center border-2 border-dashed rounded-lg">
          {imageURL ? (
            <img src={imageURL} alt="preview" className="h-36 rounded-md object-cover" />
          ) : (
            <p className="text-gray-400">Image Preview</p>
          )}
        </div>

        {/* Participation Price */}
        <div className="flex flex-col">
          <label className="font-medium mb-1">Participation Price *</label>
          <input
            type="number"
            {...register("price", { required: true, min: 0 })}
            className="input p-3 rounded-lg border"
          />
        </div>

        {/* Prize Money */}
        <div className="flex flex-col">
          <label className="font-medium mb-1">Prize Money *</label>
          <input
            type="number"
            {...register("prizeMoney", { required: true, min: 0 })}
            className="input p-3 rounded-lg border"
          />
        </div>

        {/* Participants */}
        <div className="flex flex-col">
          <label className="font-medium mb-1">Participants</label>
          <input
            type="number"
            {...register("participants")}
            className="input p-3 rounded-lg border"
            placeholder="0"
          />
        </div>

        {/* Deadline */}
        <div className="flex flex-col">
          <label className="font-medium mb-1">Deadline *</label>
          <DatePicker
            selected={deadline}
            onChange={(date) => setDeadline(date)}
            minDate={new Date()}
            className="input w-full p-3 rounded-lg border"
          />
        </div>

        {/* Reward */}
        <div className="md:col-span-2 flex flex-col">
          <label className="font-medium mb-1">Extra Reward</label>
          <input
            {...register("reward")}
            className="input p-3 rounded-lg border"
            placeholder="Certificate / Gift / Internship Opportunity"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2 flex flex-col">
          <label className="font-medium mb-1">Description *</label>
          <textarea
            {...register("description", { required: true })}
            rows="3"
            className="input p-3 rounded-lg border"
          />
        </div>

        {/* Task Instruction */}
        <div className="md:col-span-2 flex flex-col">
          <label className="font-medium mb-1">Task Instruction *</label>
          <textarea
            {...register("taskInstruction", { required: true })}
            rows="4"
            className="input p-3 rounded-lg border"
          />
        </div>

        {/* Is Active */}
        <div className="md:col-span-2 flex items-center gap-3">
          <input
            type="checkbox"
            {...register("isActive")}
            className="w-5 h-5"
          />
          <span className="font-medium">Contest is Active</span>
        </div>

        {/* Submit */}
        <div className="md:col-span-2 text-right">
          <button
            disabled={loading}
            type="submit"
            className="px-10 py-3 bg-indigo-600 text-white rounded-xl font-semibold disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Contest"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddContest;
