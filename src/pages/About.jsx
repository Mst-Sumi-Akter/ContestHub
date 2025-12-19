import React, { useRef, useState, useEffect } from "react";
/* eslint-disable no-unused-vars */
import { motion, useScroll, useTransform } from "framer-motion";
import { FaRocket, FaGlobeAmericas, FaAward, FaBolt } from "react-icons/fa";
import Loading from "../components/Loading";

const About = () => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

    return (
        <div ref={containerRef} className="min-h-screen bg-gray-50 dark:bg-black text-gray-800 dark:text-gray-100 transition-colors duration-300 overflow-hidden font-sans">
            {loading ? (
                <Loading />
            ) : (
                <>
                    {/* 1. HERO SECTION */}
                    <div className="relative h-screen flex items-center justify-center overflow-hidden">
                        {/* Dynamic Background */}
                        <div className="absolute inset-0 z-0 bg-white dark:bg-black">
                            {/* Animated Blobs - Visible in both themes with adjusted opacities */}
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-400/20 dark:bg-indigo-600/20 rounded-full blur-[100px]"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.3, 1], x: [0, 100, 0] }}
                                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-[120px]"
                            />
                        </div>

                        <motion.div style={{ y: heroY }} className="relative z-10 text-center px-6 max-w-5xl">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="mb-8 inline-block"
                            >
                                <span className="px-5 py-2 rounded-full border border-blue-200 dark:border-indigo-500/30 bg-blue-50/50 dark:bg-indigo-500/10 backdrop-blur-md text-blue-600 dark:text-indigo-300 text-xs md:text-sm tracking-[0.2em] uppercase font-bold shadow-sm">
                                    Next Gen Platform
                                </span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="heading-primary text-6xl md:text-8xl mb-8"
                            >
                                Unleash Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                                    Inner Champion
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium"
                            >
                                Join <span className="text-slate-900 dark:text-white font-bold">ContestHub</span>, the world's most vibrant arena for creators. Submit your best work, compete globally, and win big.
                            </motion.p>
                        </motion.div>

                        {/* Scroll Indicator */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, y: [0, 10, 0] }}
                            transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
                            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-400 dark:text-slate-500"
                        >
                            <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center p-1">
                                <div className="w-1 h-2 bg-current rounded-full" />
                            </div>
                        </motion.div>
                    </div>

                    {/* 2. STATS WITH GLASS & SHADOW */}
                    <section className="relative z-20 -mt-24 container mx-auto px-6 mb-32">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { label: "Contests Hosted", value: "500+", color: "text-blue-600 dark:text-indigo-400" },
                                { label: "Active Creators", value: "2.5K", color: "text-purple-600 dark:text-purple-400" },
                                { label: "Prize Money", value: "$1M+", color: "text-green-600 dark:text-green-400" },
                                { label: "Countries", value: "60+", color: "text-orange-600 dark:text-orange-400" },
                            ].map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    whileHover={{ y: -10, transition: { type: "spring", stiffness: 300 } }}
                                    className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-white/10 p-8 rounded-3xl text-center shadow-2xl shadow-slate-200/50 dark:shadow-black/50 hover:shadow-xl dark:hover:shadow-indigo-500/10 transition-all"
                                >
                                    <h3 className={`text-4xl md:text-5xl font-black ${stat.color} mb-2`}>
                                        {stat.value}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-xs md:text-sm tracking-widest">
                                        {stat.label}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* 3. MISSION SECTION WITH CLEAN TYPOGRAPHY */}
                    <section className="container mx-auto px-6 py-20 mb-32">
                        <div className="flex flex-col md:flex-row gap-20 items-center">
                            <motion.div
                                className="md:w-1/2"
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="h-px w-12 bg-indigo-600 dark:bg-indigo-400"></span>
                                    <span className="text-indigo-600 dark:text-indigo-400 font-bold tracking-widest uppercase text-sm">Our Mission</span>
                                </div>

                                <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight text-slate-900 dark:text-white">
                                    Democratizing <br />
                                    <span className="italic font-serif text-slate-500 dark:text-slate-400">Success.</span>
                                </h2>
                                <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                                    ContestHub was built on a radical idea: <strong className="text-slate-900 dark:text-white">Talent is everywhere, but opportunity is not.</strong> We are changing that by creating a borderless ecosystem where skills determine your success, not your location or background.
                                </p>
                                <button className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline underline-offset-4 decoration-2">
                                    Read our full manifesto &rarr;
                                </button>
                            </motion.div>

                            <motion.div
                                className="md:w-1/2 relative group"
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2rem] opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500"></div>
                                <img
                                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1742&q=80"
                                    alt="Team collaboration"
                                    className="relative rounded-[2rem] shadow-2xl w-full object-cover transform transition-transform duration-700 group-hover:scale-[1.02]"
                                />
                            </motion.div>
                        </div>
                    </section>

                    {/* 4. VALUES CARDS WITH GRADIENT BORDERS */}
                    <section className="container mx-auto px-6 py-20 mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-20"
                        >
                            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Why We Lead</h2>
                            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
                                We're not just another platform. We're an accelerator for your career.
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: <FaRocket />,
                                    title: "Lightning Fast",
                                    desc: "Launch or join contests in seconds. Our optimized workflow gets you to the fun part instantly.",
                                    gradient: "from-blue-500 to-cyan-500"
                                },
                                {
                                    icon: <FaGlobeAmericas />,
                                    title: "Truly Global",
                                    desc: "Access a worldwide pool of talent and opportunities. No borders, just pure competition.",
                                    gradient: "from-purple-500 to-pink-500"
                                },
                                {
                                    icon: <FaBolt />,
                                    title: "Instant Rewards",
                                    desc: "Secure, automated payouts ensure winners get credited the moment results are declared.",
                                    gradient: "from-amber-500 to-orange-500"
                                }
                            ].map((card, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.2 }}
                                    className="group relative bg-white dark:bg-slate-900 p-1 rounded-3xl hover:-translate-y-2 transition-transform duration-300 shadow-xl dark:shadow-none"
                                >
                                    {/* Gradient Border via Pseudo-element */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} rounded-3xl opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500`} />

                                    <div className="relative h-full bg-white dark:bg-black rounded-[1.3rem] p-8 flex flex-col items-start z-10 overflow-hidden">
                                        {/* Soft background glow */}
                                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.gradient} opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2`} />

                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white text-2xl mb-8 shadow-lg`}>
                                            {card.icon}
                                        </div>
                                        <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">{card.title}</h3>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                            {card.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* 5. CTA SECTION */}
                    <section className="py-32 px-6">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            className="container mx-auto max-w-6xl bg-slate-900 dark:bg-indigo-950 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl"
                        >
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/50 z-0"></div>

                            <div className="relative z-10">
                                <h2 className="text-5xl md:text-7xl font-bold mb-8 text-white tracking-tight">
                                    Ready to <span className="text-indigo-400">Level Up?</span>
                                </h2>
                                <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
                                    Join thousands of creators who are turning their passion into profit on ContestHub.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-10 py-4 bg-indigo-500 hover:bg-indigo-400 text-white text-lg font-bold rounded-full shadow-lg shadow-indigo-500/30 transition-all"
                                    >
                                        Get Started Now
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </section>
                </>
            )}
        </div>
    );
};

export default About;
