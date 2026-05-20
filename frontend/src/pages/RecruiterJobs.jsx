import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Briefcase, PlusCircle, Search, MapPin, ArrowLeft, Calendar, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RecruiterJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [location, setLocation] = useState('');
    const [formData, setFormData] = useState({ title: '', description: '', location: '', department: '', required_skills: '', deadline: '' });
    const [editingJob, setEditingJob] = useState(null);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const fetchJobs = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/jobs/recruiter', {
                params: {
                    search: search || undefined,
                    location: location || undefined,
                },
            });
            setJobs(res.data);
        } catch (error) {
            console.error('Unable to load jobs', error);
        } finally {
            setLoading(false);
        }
    }, [search, location]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchJobs();
        }, 300);

        return () => clearTimeout(debounce);
    }, [fetchJobs]);

    const handleCreateJob = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            if (editingJob) {
                await api.put(`/jobs/${editingJob.id}`, formData);
                setMessage('Job opening updated successfully.');
                setEditingJob(null);
            } else {
                await api.post('/jobs', formData);
                setMessage('Job opening created successfully.');
            }
            setFormData({ title: '', description: '', location: '', department: '', required_skills: '', deadline: '' });
            fetchJobs();
        } catch (error) {
            console.error('Job request failed', error);
            setMessage(error.response?.data?.error || 'Failed to save job.');
        }
    };

    const handleEditJob = (job) => {
        setEditingJob(job);
        setFormData({
            title: job.title,
            department: job.department,
            location: job.location,
            description: job.description,
            required_skills: job.required_skills,
            deadline: job.deadline || '',
        });
    };

    const handleDeleteJob = async (jobId) => {
        if (!window.confirm('Are you sure you want to delete this job posting?')) return;
        try {
            await api.delete(`/jobs/${jobId}`);
            setMessage('Job deleted successfully.');
            fetchJobs();
        } catch (error) {
            console.error('Delete failed', error);
            setMessage(error.response?.data?.error || 'Failed to delete job.');
        }
    };

    const handleCancelEdit = () => {
        setEditingJob(null);
        setFormData({ title: '', description: '', location: '', department: '', required_skills: '', deadline: '' });
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-6xl mx-auto p-8">
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
                    className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8"
                >
                    <div>
                        <div className="inline-flex items-center gap-3 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                            <Briefcase size={18} /> Job Openings
                        </div>
                        <h1 className="text-4xl font-extrabold text-slate-900">Manage Job Openings</h1>
                        <p className="text-slate-500 mt-2">Create and manage recruiter job postings with title, department, location, and skills.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:w-auto">
                        <label className="block">
                            <span className="text-slate-600 text-sm font-semibold">Search by title or skill</span>
                            <div className="mt-2 relative">
                                <Search size={18} className="absolute left-3 top-3 text-slate-400" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border rounded-xl"
                                    placeholder="Search jobs"
                                />
                            </div>
                        </label>
                        <label className="block">
                            <span className="text-slate-600 text-sm font-semibold">Filter by location</span>
                            <div className="mt-2 relative">
                                <MapPin size={18} className="absolute left-3 top-3 text-slate-400" />
                                <input
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border rounded-xl"
                                    placeholder="Location"
                                />
                            </div>
                        </label>
                    </div>
                </motion.div>

                <div className="flex flex-col xl:flex-row gap-6">
                    <section className="flex-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">{editingJob ? 'Edit Job Opening' : 'Create Job Opening'}</h2>
                        <form onSubmit={handleCreateJob} className="space-y-4">
                            <input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Job title"
                                className="w-full p-3 border rounded-xl"
                                required
                            />
                            <input
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                placeholder="Department"
                                className="w-full p-3 border rounded-xl"
                            />
                            <input
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="Location"
                                className="w-full p-3 border rounded-xl"
                                required
                            />
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Job description"
                                className="w-full p-3 border rounded-xl h-28"
                                required
                            />
                            <input
                                value={formData.required_skills}
                                onChange={(e) => setFormData({ ...formData, required_skills: e.target.value })}
                                placeholder="Required skills (comma separated)"
                                className="w-full p-3 border rounded-xl"
                                required
                            />
                            <div>
                                <label className="block text-slate-600 text-sm font-semibold mb-2">Application Deadline</label>
                                <input
                                    value={formData.deadline}
                                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                    type="date"
                                    className="w-full p-3 border rounded-xl"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                                <button type="submit" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-2xl font-semibold hover:bg-indigo-700 transition">
                                    <PlusCircle size={18} /> {editingJob ? 'Update Job' : 'Publish Job'}
                                </button>
                                {editingJob && (
                                    <button type="button" onClick={handleCancelEdit} className="inline-flex items-center justify-center rounded-2xl border border-slate-300 px-5 py-3 text-slate-700 hover:bg-slate-100 transition">
                                        Cancel Edit
                                    </button>
                                )}
                            </div>
                        </form>
                        {message && <p className="mt-4 text-sm text-emerald-700">{message}</p>}
                    </section>

                    <section className="flex-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Openings</h2>
                        {loading ? (
                            <div className="text-slate-500">Loading positions…</div>
                        ) : jobs.length === 0 ? (
                            <div className="text-slate-500">No job postings found. Create one to get started.</div>
                        ) : (
                            <div className="space-y-4">
                                {jobs.map((job) => (
                                    <article key={job.id} className="rounded-3xl border border-slate-200 p-5 hover:shadow-lg transition-shadow">
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                                                <p className="text-slate-500 mt-1">{job.department} · {job.location}</p>
                                                {job.deadline && (
                                                    <div className="flex items-center gap-2 mt-2 text-amber-600 text-sm">
                                                        <Calendar size={14} />
                                                        <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-right text-slate-500 text-sm">ID: {job.id}</div>
                                        </div>
                                        <p className="mt-4 text-slate-600">{job.description}</p>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {job.required_skills?.split(',').map((skill) => (
                                                <span key={skill} className="bg-indigo-50 text-indigo-700 rounded-full px-3 py-1 text-sm">{skill.trim()}</span>
                                            ))}
                                        </div>
                                        <div className="mt-4 flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEditJob(job)}
                                                className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200 transition"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteJob(job.id)}
                                                className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 hover:bg-red-100 transition"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
