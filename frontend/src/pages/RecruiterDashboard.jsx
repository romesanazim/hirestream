import { useContext, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Briefcase, Users, Clock, UserCheck, CheckCircle, Calendar, Trophy, ArrowLeft, MessageSquare, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RecruiterDashboard() {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState({ applied_count: 0, shortlisted_count: 0, scheduled_count: 0, hired_count: 0, upcoming_interviews: 0 });
    const [interviewedCandidates, setInterviewedCandidates] = useState([]);
    const [feedbackMap, setFeedbackMap] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, appsRes] = await Promise.all([
                    api.get('/jobs/stats'),
                    api.get('/applications/recruiter')
                ]);
                setStats(statsRes.data);
                
                const interviewed = appsRes.data.filter(app => app.status === 'interviewed');
                setInterviewedCandidates(interviewed);

                // Fetch interviews with feedback
                const feedbackObj = {};
                for (const app of interviewed) {
                    try {
                        const feedbackRes = await api.get(`/feedback/${app.id}`);
                        if (feedbackRes.data && feedbackRes.data.length > 0) {
                            feedbackObj[app.id] = feedbackRes.data[0];
                        }
                    } catch (e) {
                        // No feedback for this application
                    }
                }
                setFeedbackMap(feedbackObj);
            } catch (error) {
                console.error('Failed to load dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const updateStatus = async (applicationId, status) => {
        try {
            await api.put(`/applications/${applicationId}/status`, { status });
            const appsRes = await api.get('/applications/recruiter');
            const interviewed = appsRes.data.filter(app => app.status === 'interviewed');
            setInterviewedCandidates(interviewed);
            const statsRes = await api.get('/jobs/stats');
            setStats(statsRes.data);
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <div className="w-64 bg-indigo-900 text-white p-6 flex flex-col">
                <h2 className="text-2xl font-bold mb-10">HireStream</h2>
                <nav className="space-y-4 flex-1">
                    <NavLink to="/recruiter-dashboard" className={({ isActive }) => `flex items-center gap-3 p-2 rounded-lg ${isActive ? 'bg-indigo-800 text-white' : 'text-slate-100 hover:bg-indigo-800'}`}>
                        <LayoutDashboard size={20} /> Dashboard
                    </NavLink>
                    <NavLink to="/recruiter/applications" className={({ isActive }) => `flex items-center gap-3 p-2 rounded-lg ${isActive ? 'bg-indigo-800 text-white' : 'text-slate-100 hover:bg-indigo-800'}`}>
                        <Clock size={20} /> Applications
                    </NavLink>
                    <NavLink to="/recruiter/jobs" className={({ isActive }) => `flex items-center gap-3 p-2 rounded-lg ${isActive ? 'bg-indigo-800 text-white' : 'text-slate-100 hover:bg-indigo-800'}`}>
                        <Briefcase size={20} /> Manage Jobs
                    </NavLink>
                    <NavLink to="/recruiter/interviewers" className={({ isActive }) => `flex items-center gap-3 p-2 rounded-lg ${isActive ? 'bg-indigo-800 text-white' : 'text-slate-100 hover:bg-indigo-800'}`}>
                        <Users size={20} /> Interviewers
                    </NavLink>
                </nav>
                <button onClick={logout} className="flex items-center gap-3 p-2 text-indigo-300 hover:text-white mt-auto">
                    <LogOut size={20} /> Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-10 bg-gradient-to-br from-slate-50 to-indigo-50">
                <motion.button
                    onClick={() => navigate(-1)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} /> Back
                </motion.button>
                
                <motion.header 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-10"
                >
                    <div className="inline-flex items-center gap-3 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        <LayoutDashboard size={18} /> Recruiter Dashboard
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900">Welcome, {user?.name}!</h1>
                    <p className="text-slate-500 font-medium mt-2">Manage your recruitment pipeline and track candidate progress.</p>
                </motion.header>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-indigo-100 p-2 rounded-lg">
                                <UserCheck className="text-indigo-600" size={24} />
                            </div>
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Applied</p>
                        </div>
                        <p className="text-4xl font-black text-indigo-600">{stats.applied_count}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-green-100 p-2 rounded-lg">
                                <CheckCircle className="text-green-600" size={24} />
                            </div>
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Shortlisted</p>
                        </div>
                        <p className="text-4xl font-black text-green-600">{stats.shortlisted_count}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-amber-100 p-2 rounded-lg">
                                <Calendar className="text-amber-600" size={24} />
                            </div>
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Scheduled</p>
                        </div>
                        <p className="text-4xl font-black text-amber-600">{stats.scheduled_count}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-teal-100 p-2 rounded-lg">
                                <Trophy className="text-teal-600" size={24} />
                            </div>
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Selected</p>
                        </div>
                        <p className="text-4xl font-black text-teal-600">{stats.hired_count}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-violet-100 p-2 rounded-lg">
                                <Clock className="text-violet-600" size={24} />
                            </div>
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Upcoming Interviews</p>
                        </div>
                        <p className="text-4xl font-black text-violet-600">{stats.upcoming_interviews}</p>
                    </div>
                </div>

                {/* Interviewed Candidates Section */}
                <div className="mt-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-violet-100 p-2 rounded-lg">
                            <MessageSquare className="text-violet-600" size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Interviewed Candidates</h2>
                        <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {interviewedCandidates.length}
                        </span>
                    </div>

                    {loading ? (
                        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
                            Loading interviewed candidates...
                        </div>
                    ) : interviewedCandidates.length === 0 ? (
                        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
                            No candidates have been interviewed yet.
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {interviewedCandidates.map((app) => {
                                const feedback = feedbackMap[app.id];
                                return (
                                    <div key={app.id} className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-all">
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-slate-900">{app.candidate_name}</h3>
                                                <p className="text-slate-500 text-sm">{app.job_title}</p>
                                                <p className="text-slate-400 text-xs mt-1">Applied on: {new Date(app.created_at).toLocaleDateString()}</p>
                                                
                                                {feedback && (
                                                    <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Star className="text-amber-500" size={16} />
                                                            <span className="font-semibold text-amber-700">
                                                                Rating: {feedback.rating}/5
                                                            </span>
                                                            {feedback.interviewer_name && (
                                                                <span className="text-amber-600 text-sm">
                                                                    by {feedback.interviewer_name}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-slate-700 text-sm">{feedback.comments}</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => updateStatus(app.id, 'selected')}
                                                    className="px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition"
                                                >
                                                    Select
                                                </button>
                                                <button 
                                                    onClick={() => updateStatus(app.id, 'rejected')}
                                                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}