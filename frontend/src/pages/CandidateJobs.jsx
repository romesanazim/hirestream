import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Search, MapPin, Briefcase, Send, ArrowLeft, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CandidateJobs() {
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [location, setLocation] = useState('');
    const [resumeFiles, setResumeFiles] = useState({});
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const getPostedTime = (createdAt) => {
        if (!createdAt) return 'Recently';
        const created = new Date(createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - created);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return '1 day ago';
        return `${diffDays} days ago`;
    };

    const fetchJobs = async () => {
        try {
            const [jobsRes, appsRes] = await Promise.all([
                api.get('/jobs', {
                    params: {
                        search: search || undefined,
                        location: location || undefined,
                    },
                }),
                api.get('/applications/my-applications'),
            ]);
            setJobs(jobsRes.data);
            setApplications(appsRes.data);
        } catch (error) {
            console.error('Unable to load jobs or applications', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchJobs();
        }, 300);

        return () => clearTimeout(debounce);
    }, [search, location]);

    const isApplied = (jobId) => applications.some((app) => app.job_id === jobId);

    const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Unable to read resume file.'));
        reader.readAsDataURL(file);
    });

    const handleApply = async (jobId) => {
        setMessage('');
        const fileEntry = resumeFiles[jobId];
        
        if (!fileEntry?.file) {
            setMessage('Please upload your resume before applying.');
            return;
        }

        try {
            let resumeDataUrl = fileEntry.dataUrl;
            if (!resumeDataUrl) {
                resumeDataUrl = await readFileAsDataUrl(fileEntry.file);
                setResumeFiles((prev) => ({
                    ...prev,
                    [jobId]: { ...prev[jobId], dataUrl: resumeDataUrl },
                }));
            }

            await api.post('/applications/apply', {
                job_id: jobId,
                resume_url: resumeDataUrl,
            });
            
            setMessage('Application submitted successfully!');
            fetchJobs();
        } catch (error) {
            setMessage(error.response?.data?.error || 'Failed to submit application.');
        }
    };

    const handleResumeFile = (jobId, file) => {
        if (!file) {
            setResumeFiles((prev) => ({ ...prev, [jobId]: null }));
            return;
        }

        setResumeFiles((prev) => ({
            ...prev,
            [jobId]: { file, name: file.name },
        }));
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
                    className="mb-8"
                >
                    <div className="inline-flex items-center gap-3 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        <Briefcase size={18} /> Explore Jobs
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900">Find Your Dream Job</h1>
                    <p className="text-slate-500 mt-2">Search jobs by title, skill, or location and apply directly with your profile.</p>
                </motion.div>

<div className="grid gap-4 lg:grid-cols-2 mb-8">
                    <label className="block">
                        <span className="text-slate-600 text-sm font-semibold">Search jobs</span>
                        <div className="relative mt-2">
                            <Search size={18} className="absolute left-3 top-3 text-slate-400" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border rounded-2xl"
                                placeholder="Title, skill, or keyword"
                            />
                        </div>
                    </label>
                    <label className="block">
                        <span className="text-slate-600 text-sm font-semibold">Location</span>
                        <div className="relative mt-2">
                            <MapPin size={18} className="absolute left-3 top-3 text-slate-400" />
                            <input
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border rounded-2xl"
                                placeholder="City or remote"
                            />
                        </div>
                    </label>
                </div>

                {message && <div className="mb-6 p-4 rounded-2xl bg-emerald-50 text-emerald-700 font-medium">{message}</div>}

                {loading ? (
                    <div className="rounded-3xl border border-slate-200 bg-white p-10 text-slate-500">Loading jobs…</div>
                ) : jobs.length === 0 ? (
                    <div className="rounded-3xl border border-slate-200 bg-white p-10 text-slate-500">No jobs match your filters yet.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map((job) => (
                            <article key={job.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                <div className="flex flex-col gap-3">
                                    <div className="flex justify-between items-start gap-2">
                                        <h2 className="text-lg font-bold text-slate-900 line-clamp-2">{job.title}</h2>
                                        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${isApplied(job.id) ? 'bg-green-100 text-green-700' : 'bg-indigo-50 text-indigo-700'}`}>
                                            {isApplied(job.id) ? 'Applied' : 'Open'}
                                        </span>
                                    </div>
                                    <p className="text-slate-500 text-sm">{job.department} · {job.location}</p>
                                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                                        <Calendar size={12} />
                                        <span>Posted {getPostedTime(job.created_at)}</span>
                                        {job.deadline && (
                                            <span className="text-amber-600">· Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                                        )}
                                    </div>
                                    <p className="text-slate-600 text-sm line-clamp-2">{job.description}</p>
                                    <div className="flex flex-wrap gap-1">
                                        {job.required_skills?.split(',').slice(0, 3).map((skill) => (
                                            <span key={skill} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{skill.trim()}</span>
                                        ))}
                                    </div>
                                    {!isApplied(job.id) && (
                                        <div className="mt-2">
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={(e) => handleResumeFile(job.id, e.target.files[0])}
                                                className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                            />
                                            {resumeFiles[job.id]?.name && (
                                                <p className="text-xs text-slate-600 mt-1">Selected: {resumeFiles[job.id].name}</p>
                                            )}
                                        </div>
                                    )}
                                    <button
                                        disabled={isApplied(job.id)}
                                        onClick={() => handleApply(job.id)}
                                        className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm text-white font-semibold hover:bg-indigo-700 transition disabled:cursor-not-allowed disabled:bg-slate-300"
                                    >
                                        <Send size={14} /> {isApplied(job.id) ? 'Applied' : 'Apply'}
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
