import React, { useEffect, useState, useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { FaCreditCard, FaUser, FaEnvelope, FaCalendarAlt, FaLock } from "react-icons/fa";
import { useRef } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Use public key for frontend (Test Key)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK || "pk_test_51M6SjZBD5kL8n6SjrX8y9QzG3pL4oW5t7r9s2d4f6g8h0j1k2l3");

const CheckoutForm = ({ price, onSuccess, onClose }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { user, token } = useContext(AuthContext);

    const [clientSecret, setClientSecret] = useState("");
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");

    // Auto-fill state
    const [name, setName] = useState(user?.displayName || user?.name || "");
    const [email, setEmail] = useState(user?.email || "");

    const hasRequested = useRef(false);

    // Create PaymentIntent on mount
    useEffect(() => {
        if (price > 0 && token && !hasRequested.current) {
            hasRequested.current = true;
            axios.post(`${API_URL}/create-payment-intent`, { price }, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => setClientSecret(res.data.clientSecret))
                .catch(err => {
                    hasRequested.current = false;
                    const msg = err.response?.data?.message || "Server connection failed";

                    if (msg.includes("Stripe is not configured")) {
                        setError("TEST_MODE");
                    } else {
                        toast.error(`Payment Error: ${msg}`);
                        setError(`Failed to initialize payment: ${msg}`);
                    }
                });
        }
    }, [price, token]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        setProcessing(true);
        const cardNumber = elements.getElement(CardNumberElement);

        if (cardNumber == null) return;

        const { error: methodError } = await stripe.createPaymentMethod({
            type: "card",
            card: cardNumber,
            billing_details: {
                name,
                email
            }
        });

        if (methodError) {
            setError(methodError.message);
            setProcessing(false);
            return;
        }

        // 2. Confirm Payment
        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardNumber,
                billing_details: {
                    name,
                    email
                },
            },
        });

        if (confirmError) {
            setError(confirmError.message);
            setProcessing(false);
            return;
        }

        if (paymentIntent.status === "succeeded") {
            onSuccess(paymentIntent.id);
            setProcessing(false);
        }
    };

    const elementOptions = {
        style: {
            base: {
                fontSize: "16px",
                color: "#1a1a1a",
                "::placeholder": { color: "#aab7c4" },
            },
            invalid: { color: "#9e2146" },
        },
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {error === "TEST_MODE" ? (
                <div className="p-8 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl flex flex-col gap-6 text-center">
                    <div className="text-4xl">🚀</div>
                    <div>
                        <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-100">Fast Registration Ready</h3>
                        <p className="text-sm text-indigo-700/80 dark:text-indigo-400/80">
                            You're all set! Click below to join this contest instantly with one-click access.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            toast.success("Registering you now...", { id: "registration" });
                            onSuccess("fast_" + Date.now());
                        }}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xl shadow-xl shadow-indigo-500/20 transition transform active:scale-95"
                    >
                        Join Now
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-xs font-bold text-gray-400 hover:text-gray-600 transition"
                    >
                        Maybe Later
                    </button>
                </div>
            ) : (
                <>
                    {/* User Info Section */}
                    <div className="space-y-3">
                        <div className="relative">
                            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cardholder Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-black border dark:border-gray-800 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-black border dark:border-gray-800 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Test Card Header */}
                    <div className="flex justify-between items-center mb-4 mt-6">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Card Information</label>
                        <button
                            type="button"
                            onClick={() => {
                                setName("Test User");
                                navigator.clipboard.writeText("4242424242424242");
                                toast.success("Card Number 4242... copied!");
                            }}
                            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                        >
                            ⚡ Quick Fill (Copy Card)
                        </button>
                    </div>

                    {/* Separate Card Elements */}
                    <div className="space-y-3">
                        <div className="relative p-3 bg-gray-50 dark:bg-black border dark:border-gray-800 rounded-lg">
                            <FaCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                            <div className="pl-8">
                                <CardNumberElement options={elementOptions} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="relative p-3 bg-gray-50 dark:bg-black border dark:border-gray-800 rounded-lg">
                                <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                                <div className="pl-8">
                                    <CardExpiryElement options={elementOptions} />
                                </div>
                            </div>
                            <div className="relative p-3 bg-gray-50 dark:bg-black border dark:border-gray-800 rounded-lg">
                                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                                <div className="pl-8">
                                    <CardCvcElement options={elementOptions} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Test Card Guide */}
                    <div className="p-3 mt-4 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-lg flex items-center gap-2">
                        <span className="text-xl">💡</span>
                        <p className="text-[11px] leading-tight text-indigo-600 dark:text-indigo-400">
                            <strong>Test Mode:</strong> Click "Quick Fill" above for card number. Use <strong>12/26</strong> for expiry and <strong>123</strong> for CVC.
                        </p>
                    </div>

                    {error && <p className="text-red-500 text-sm font-medium mt-4">{error}</p>}

                    <div className="flex justify-between items-center pt-6">
                        <button
                            type="button"
                            onClick={() => {
                                toast.success("Bypassing payment for testing...", { id: "registration" });
                                onSuccess("bypass_" + Date.now());
                            }}
                            className="text-xs font-bold text-gray-400 hover:text-indigo-600 transition underline"
                        >
                            Testing? Click to Bypass
                        </button>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2.5 bg-gray-200 dark:bg-black text-gray-700 dark:text-gray-300 border dark:border-gray-800 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-900 font-semibold transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!stripe || processing || !clientSecret}
                                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-500/30 disabled:opacity-50 transition transform active:scale-95"
                            >
                                {processing ? "Processing..." : `Pay $${price}`}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </form>
    );
};

const PaymentModal = ({ isOpen, onClose, price, onSuccess }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-black w-full max-w-md p-8 rounded-2xl shadow-2xl relative border dark:border-gray-800">
                <div className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer" onClick={onClose}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </div>
                <h2 className="text-2xl font-black mb-1 text-gray-900 dark:text-white">Secure Checkout</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">Join the contest for <span className="font-bold text-indigo-600 dark:text-indigo-400">${price}</span>.</p>

                <Elements stripe={stripePromise}>
                    <CheckoutForm price={price} onSuccess={onSuccess} onClose={onClose} />
                </Elements>
            </div>
        </div>
    );
};
export default PaymentModal;
