import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";
import Loading from "../components/Loading";

const Contact = () => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const contactInfo = [
        {
            icon: <FaEnvelope />,
            title: "Email Us",
            desc: "support@contesthub.com",
            color: "text-blue-500",
            bg: "bg-blue-50 dark:bg-blue-900/20"
        },
        {
            icon: <FaPhone />,
            title: "Call Us",
            desc: "+1 (555) 000-0000",
            color: "text-purple-500",
            bg: "bg-purple-50 dark:bg-purple-900/20"
        },
        {
            icon: <FaMapMarkerAlt />,
            title: "Visit Us",
            desc: "123 Innovation Drive, Silicon Valley, CA",
            color: "text-green-500",
            bg: "bg-green-50 dark:bg-green-900/20"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-800 dark:text-gray-100 py-20 px-6 overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-400/10 dark:bg-indigo-600/10 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.3, 1], x: [0, 50, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-[120px]"
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <span className="px-4 py-1.5 rounded-full border border-blue-200 dark:border-indigo-500/30 bg-blue-50/50 dark:bg-indigo-500/10 backdrop-blur-md text-blue-600 dark:text-indigo-300 text-xs md:text-sm tracking-widest uppercase font-bold">
                        Get In Touch
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black mt-6 mb-4">
                        Let's Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Conversation</span>
                    </h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Have a question about a contest or want to partner with us? Our team is here to help you unleash your inner champion.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Contact Info Cards */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="lg:col-span-1 space-y-6"
                    >
                        {contactInfo.map((info, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none flex items-start gap-4"
                            >
                                <div className={`p-4 rounded-2xl ${info.bg} ${info.color} text-2xl shadow-inner`}>
                                    {info.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-1">{info.title}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 font-medium">{info.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-2 bg-white dark:bg-gray-900 p-8 md:p-12 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl"
                    >
                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1 text-gray-600 dark:text-gray-400 uppercase tracking-tighter">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 focus:border-blue-500 dark:focus:border-indigo-500 outline-none transition-all duration-300 shadow-inner"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1 text-gray-600 dark:text-gray-400 uppercase tracking-tighter">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 focus:border-blue-500 dark:focus:border-indigo-500 outline-none transition-all duration-300 shadow-inner"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold ml-1 text-gray-600 dark:text-gray-400 uppercase tracking-tighter">Subject</label>
                                <input
                                    type="text"
                                    placeholder="How can we help?"
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 focus:border-blue-500 dark:focus:border-indigo-500 outline-none transition-all duration-300 shadow-inner"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold ml-1 text-gray-600 dark:text-gray-400 uppercase tracking-tighter">Message</label>
                                <textarea
                                    rows="5"
                                    placeholder="Tell us more about your inquiry..."
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 focus:border-blue-500 dark:focus:border-indigo-500 outline-none transition-all duration-300 shadow-inner resize-none"
                                ></textarea>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02, translateY: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-3"
                                type="button"
                            >
                                <FaPaperPlane className="text-sm" />
                                Send Message
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
