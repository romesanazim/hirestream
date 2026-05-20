import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Users, Plus, UserPlus, ArrowLeft, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RecruiterInterviewers() {
    const [interviewers, setInterviewers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const fetchInterviewers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/users/interviewers');
            setInterviewers(res.data);
        } catch (err) {
            console.error('Error loading interviewers', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInterviewers();
    }, []);

    const handleCreateInterviewer = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            await api.post('/users/create-interviewer', formData);
            setMessage('Interviewer account created successfully.');
            setFormData({ name: '', email: '', password: '' });
            fetchInterviewers();
        } catch (err) {
            console.error('Failed to create interviewer', err);
            setMessage(err.response?.data?.error || 'Unable to create interviewer.');
        }
    };

    const handleDeleteInterviewer = async (interviewerId) => {
        if (!window.confirm('Are you sure you want to delete this interviewer account?')) return;
        try {
            await api.delete(`/users/interviewers/${interviewerId}`);
            setMessage('Interviewer deleted successfully.');
            fetchInterviewers();
        } catch (err) {
            console.error('Delete failed', err);
            setMessage(err.response?.data?.error || 'Failed to delete interviewer.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-5xl mx-auto p-8">
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
                    <div className="inline-flex items-center gap-3 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        <Users size={18} /> Interviewers
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900">Manage Interviewers</h1>
                    <p className="text-slate-500 mt-2">Register interviewers and monitor the team assigned to your hiring pipeline.</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Add Interviewer</h2>
                        <form onSubmit={handleCreateInterviewer} className="space-y-4">
                            <input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Full name"
                                className="w-full p-3 border rounded-xl"
                                required
                            />
                            <input
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                type="email"
                                placeholder="Email address"
                                className="w-full p-3 border rounded-xl"
                                required
                            />
                            <input
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                type="password"
                                placeholder="Temporary password"
                                className="w-full p-3 border rounded-xl"
                                required
                            />
                            <button type="submit" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-2xl font-semibold hover:bg-indigo-700 transition">
                                <Plus size={18} /> Add Interviewer
                            </button>
                        </form>
                        {message && <p className="mt-4 text-sm text-emerald-700">{message}</p>}
                    </section>

                    <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-slate-900">Your Interviewers</h2>
                            <div className="inline-flex items-center gap-2 text-slate-500 text-sm">
                                <UserPlus size={16} /> {interviewers.length}
                            </div>
                        </div>
                        {loading ? (
                            <p className="text-slate-500">Loading interviewers…</p>
                        ) : interviewers.length === 0 ? (
                            <p className="text-slate-500">No interviewers registered yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {interviewers.map((user) => (
                                    <div key={user.id} className="rounded-3xl border border-slate-200 p-4 hover:shadow-sm transition-shadow">
                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <p className="font-semibold text-slate-900">{user.name}</p>
                                                <p className="text-slate-500 text-sm">{user.email}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs uppercase tracking-wider bg-slate-100 text-slate-600 px-3 py-1 rounded-full">{user.status}</span>
                                                <button
                                                    onClick={() => handleDeleteInterviewer(user.id)}
                                                    className="p-2 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
