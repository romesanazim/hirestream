import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../assets/logo.svg';
import { ArrowRight, Users, Briefcase, TrendingUp } from 'lucide-react';

export default function Welcome() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-6">
            <div className="max-w-6xl mx-auto text-center">
                {/* Logo and Title */}
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-12"
                >
                    <img src={logo} alt="HireStream Logo" className="mx-auto mb-6 w-64 h-16" />
                    <h1 className="text-5xl font-extrabold text-slate-900 mb-4">
                        Welcome to <span className="text-indigo-600">HireStream</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Streamline your hiring process with our comprehensive platform for recruiters, candidates, and interviewers.
                    </p>
                </motion.div>

                {/* Features */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="grid md:grid-cols-3 gap-8 mb-12"
                >
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
                        <Users className="mx-auto text-indigo-600 mb-4" size={48} />
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">For Candidates</h3>
                        <p className="text-slate-600">Apply to jobs, track your applications, and connect with top companies.</p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
                        <Briefcase className="mx-auto text-indigo-600 mb-4" size={48} />
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">For Recruiters</h3>
                        <p className="text-slate-600">Post jobs, manage applications, and schedule interviews effortlessly.</p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
                        <TrendingUp className="mx-auto text-indigo-600 mb-4" size={48} />
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">For Admins</h3>
                        <p className="text-slate-600">Oversee the platform, manage users, and ensure smooth operations.</p>
                    </div>
                </motion.div>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-6 justify-center"
                >
                    <Link
                        to="/register"
                        className="inline-flex items-center justify-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        Get Started <ArrowRight size={20} />
                    </Link>
                    <Link
                        to="/login"
                        className="inline-flex items-center justify-center gap-3 bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold text-lg border-2 border-indigo-600 hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        Sign In
                    </Link>
                </motion.div>

                {/* Background Animation */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute top-10 left-10 w-32 h-32 bg-indigo-200 rounded-full opacity-20"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-10 right-10 w-24 h-24 bg-cyan-200 rounded-full opacity-20"
                    />
                </div>
            </div>
        </div>
    );
}