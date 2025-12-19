import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const PaymentModal = ({ isOpen, onClose, price, onSuccess }) => {
  const { user } = useContext(AuthContext);
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePayment = () => {
    setProcessing(true);

    // Simulate network delay for payment
    setTimeout(() => {
      setProcessing(false);
      toast.success("Payment Successful 🎉");
      onSuccess("simulated_" + Date.now());
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">Secure Payment</h2>
        <p className="mb-6 text-gray-600 text-sm">
          Complete your payment of <strong>${price}</strong> now.
        </p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            defaultValue={user?.name || ""}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <input
            type="email"
            placeholder="Your Email"
            defaultValue={user?.email || ""}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
            disabled={processing}
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            disabled={processing}
          >
            {processing ? "Processing..." : "Payment Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
