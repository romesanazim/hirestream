import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Layers, Briefcase, MapPin, User, FileText, CheckCircle, Clock, XCircle, ArrowLeft, ArrowRight, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CandidateDashboard() {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await api.get('/applications/my-applications');
                setApplications(res.data);
            } catch (error) {
                console.error('Unable to load your applications', error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const getStatusStep = (status) => {
        switch (status) {
            case 'applied': return 1;
            case 'shortlisted': return 2;
            case 'interviewed': return 3;
            case 'selected': return 4;
            case 'rejected': return -1;
            default: return 1;
        }
    };

    const renderTimeline = (status) => {
        const currentStep = getStatusStep(status);
        const steps = ['Applied', 'Shortlisted', 'Interviewed', 'Selected'];
        
        if (currentStep === -1) {
            return (
                <div className="flex items-center gap-2 text-red-600">
                    <XCircle size={16} />
                    <span className="text-sm font-semibold">Application Rejected</span>
                </div>
            );
        }

        return (
            <div className="flex items-center gap-2">
                {steps.map((step, index) => (
                    <div key={step} className="flex items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index + 1 <= currentStep 
                                ? 'bg-indigo-600 text-white' 
                                : 'bg-slate-200 text-slate-500'
                        }`}>
                            {index + 1 < currentStep ? <CheckCircle size={14} /> : index + 1}
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`w-8 h-0.5 ${index + 1 < currentStep ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50">
            <nav className="bg-white shadow-lg p-4 flex justify-between items-center border-b border-slate-200 backdrop-blur-sm bg-white/80">
                <div className="flex items-center gap-3 text-slate-900 font-bold text-xl">
                    <Layers size={24} className="text-indigo-600" /> Candidate Dashboard
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-slate-600 font-medium">Welcome, {user?.name}</span>
                    <button onClick={logout} className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-all duration-200 font-semibold hover:scale-105">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </nav>

            <main className="p-8 max-w-6xl mx-auto">
                <motion.button
                    onClick={() => navigate(-1)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} /> Back
                </motion.button>

                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="inline-flex items-center gap-3 bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        <Layers size={18} /> Candidate Dashboard
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900">Your Applications</h1>
                    <p className="text-slate-500 mt-2">Track your application status and interview schedule in one place.</p>
                </motion.div>

                {loading ? (
                    <div className="bg-white p-8 rounded-3xl shadow-sm text-center text-slate-600 animate-pulse">
                        <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Loading applications…
                    </div>
                ) : applications.length === 0 ? (
                    <div className="bg-white p-16 rounded-3xl shadow-sm text-center text-slate-500 border-2 border-dashed border-slate-300">
                        <Briefcase className="mx-auto text-slate-300 mb-4" size={48} />
                        No applications found yet. Apply to jobs to start tracking your progress.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {applications.map((application) => (
                            <div key={application.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-indigo-100 p-3 rounded-full">
                                            <Briefcase className="text-indigo-600" size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900">{application.job_title}</h2>
                                            <p className="text-slate-500 flex items-center gap-2">
                                                <MapPin size={16} /> {application.department} · {application.location}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white flex items-center gap-2 ${application.status === 'applied' ? 'bg-blue-600' : application.status === 'shortlisted' ? 'bg-green-600' : application.status === 'rejected' ? 'bg-red-600' : application.status === 'interviewed' ? 'bg-violet-600' : application.status === 'selected' ? 'bg-teal-600' : 'bg-amber-600'}`}>
                                            {application.status === 'applied' ? <Clock size={14} /> : application.status === 'shortlisted' ? <CheckCircle size={14} /> : application.status === 'rejected' ? <XCircle size={14} /> : application.status === 'interviewed' ? <CheckCircle size={14} /> : application.status === 'selected' ? <CheckCircle size={14} /> : <Clock size={14} />}
                                            {application.status}
                                        </div>
                                        {renderTimeline(application.status)}
                                    </div>
                                </div>
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-slate-600">
                                    <div className="flex items-center gap-3">
                                        <User className="text-slate-400" size={16} />
                                        <div>
                                            <p className="text-sm uppercase tracking-wide text-slate-400">Candidate</p>
                                            <p className="mt-1 font-semibold">{user?.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FileText className="text-slate-400" size={16} />
                                        <div>
                                            <p className="text-sm uppercase tracking-wide text-slate-400">Resume / CV</p>
                                            <p className="mt-1 break-all text-sm text-slate-700">{application.resume_url ? (application.resume_url.startsWith('data:') ? 'Uploaded resume' : application.resume_url) : 'Not provided'}</p>
                                            {application.resume_url?.startsWith('data:') && (
                                                <a
                                                    href={application.resume_url}
                                                    download={`resume-${application.id}`}
                                                    className="text-indigo-600 hover:underline text-sm"
                                                >
                                                    Download resume
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="text-slate-400" size={16} />
                                        <div>
                                            <p className="text-sm uppercase tracking-wide text-slate-400">Interview</p>
                                            {application.interview_date ? (
                                                <p className="mt-1 font-semibold">{application.interview_date} {application.interview_time ? `at ${application.interview_time}` : ''}</p>
                                            ) : (
                                                <p className="mt-1 text-slate-700">Not scheduled yet</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="text-slate-400" size={16} />
                                        <div>
                                            <p className="text-sm uppercase tracking-wide text-slate-400">Status</p>
                                            <p className="mt-1 font-semibold">{application.status}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <div className="max-w-6xl mx-auto p-8">
                <Link to="/jobs" className="inline-flex items-center justify-center gap-3 rounded-2xl bg-indigo-600 px-8 py-4 text-white font-bold hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    <Briefcase size={20} /> View Available Jobs
                </Link>
            </div>
        </div>
    );
}
