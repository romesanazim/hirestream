import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { CalendarDays, CheckCircle2, Clock, UserPlus, XCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RecruiterApplications() {
    const [applications, setApplications] = useState([]);
    const [interviewers, setInterviewers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [scheduleFields, setScheduleFields] = useState({ application_id: '', interviewer_id: '', interview_date: '', interview_time: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const isPdfDataUrl = (url) => typeof url === 'string' && url.startsWith('data:application/pdf');

    const renderResumePreview = (resume_url, appId) => {
        if (!resume_url) {
            return <p className="mt-2 text-slate-700 text-sm">Not provided</p>;
        }

        const viewButtons = (
            <div className="flex gap-2">
                <a
                    href={resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 hover:underline text-sm font-semibold px-3 py-1.5 bg-indigo-50 rounded-lg"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View
                </a>
                {isPdfDataUrl(resume_url) && (
                    <a
                        href={resume_url}
                        download={`resume-${appId}.pdf`}
                        className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 hover:underline text-sm font-semibold px-3 py-1.5 bg-green-50 rounded-lg"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                    </a>
                )}
            </div>
        );

        if (isPdfDataUrl(resume_url)) {
            return (
                <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-slate-700 text-sm font-medium">Resume / CV</p>
                        {viewButtons}
                    </div>
                    <div className="overflow-hidden rounded-3xl border border-slate-200">
                        <iframe
                            title={`resume-preview-${appId}`}
                            src={resume_url}
                            className="h-72 w-full"
                        />
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-2">
                <p className="text-slate-700 text-sm font-medium">Resume / CV</p>
                {viewButtons}
            </div>
        );
    };

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const [appsRes, interviewersRes] = await Promise.all([
                api.get('/applications/recruiter'),
                api.get('/users/interviewers'),
            ]);
            setApplications(appsRes.data);
            setInterviewers(interviewersRes.data);
        } catch (err) {
            console.error('Unable to load recruiter applications', err);
            setError(err.response?.data?.message || err.message || 'Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const updateStatus = async (applicationId, status) => {
        setMessage('');
        try {
            await api.put(`/applications/${applicationId}/status`, { status });
            setMessage(`Application ${status} successfully.`);
            fetchData();
        } catch (err) {
            console.error('Unable to update status', err);
            setMessage(err.response?.data?.message || 'Status update failed.');
        }
    };

    const scheduleInterview = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            await api.post('/interviews/schedule', scheduleFields);
            setMessage('Interview scheduled successfully.');
            setScheduleFields({ application_id: '', interviewer_id: '', interview_date: '', interview_time: '' });
            fetchData();
        } catch (err) {
            console.error('Interview scheduling failed', err);
            setMessage(err.response?.data?.error || 'Failed to schedule interview.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto p-8">
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
                        <CalendarDays size={18} /> Application Pipeline
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900">Application Pipeline</h1>
                    <p className="text-slate-500 mt-2">Review candidate applications, change statuses, and assign interviews to your interviewers.</p>
                </motion.div>

                {message && (
                    <div className="mb-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-red-700">
                        {error}
                    </div>
                )}

                <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
                    <section className="space-y-4">
                        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Open Applications</h2>
                            {loading ? (
                                <div className="text-slate-500">Loading applications…</div>
                            ) : applications.length === 0 ? (
                                <div className="text-slate-500 p-4">No applications found.</div>
                            ) : (
                                <div className="space-y-6">
                                    {Object.values(applications.reduce((acc, app) => {
                                        if (!acc[app.candidate_id]) {
                                            acc[app.candidate_id] = {
                                                candidate_id: app.candidate_id,
                                                candidate_name: app.candidate_name,
                                                candidate_email: app.candidate_email,
                                                applications: []
                                            };
                                        }
                                        acc[app.candidate_id].applications.push(app);
                                        return acc;
                                    }, {})).map((candidate) => (
                                        <div key={candidate.candidate_id} className="rounded-3xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
                                            <div className="mb-4">
                                                <h3 className="text-xl font-semibold text-slate-900">{candidate.candidate_name}</h3>
                                                <p className="text-slate-500">{candidate.candidate_email}</p>
                                            </div>
                                            <div className="space-y-4">
                                                {candidate.applications.map((app) => (
                                                    <article key={app.id} className="rounded-3xl border border-slate-100 p-4 bg-slate-50">
                                                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
                                                            <div>
                                                                <h4 className="text-lg font-semibold text-slate-900">{app.job_title}</h4>
                                                                <p className="text-slate-500 text-sm mt-2">Status: <span className="font-semibold text-slate-800">{app.status}</span></p>
                                                            </div>
                                                            <div className="space-y-2 text-right">
                                                                <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${app.status === 'rejected' ? 'bg-red-100 text-red-700' : app.status === 'shortlisted' ? 'bg-amber-100 text-amber-700' : app.status === 'selected' ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-700'}`}>
                                                                    {app.status}
                                                                </span>
                                                                <div className="flex flex-wrap justify-end gap-2">
                                                                    <button onClick={() => updateStatus(app.id, 'shortlisted')} className="rounded-2xl bg-indigo-600 px-4 py-2 text-white text-sm hover:bg-indigo-700 transition">Shortlist</button>
                                                                    <button onClick={() => updateStatus(app.id, 'selected')} className="rounded-2xl bg-emerald-600 px-4 py-2 text-white text-sm hover:bg-emerald-700 transition">Select</button>
                                                                    <button onClick={() => updateStatus(app.id, 'rejected')} className="rounded-2xl bg-red-600 px-4 py-2 text-white text-sm hover:bg-red-700 transition">Reject</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                                            <div className="rounded-3xl bg-white p-4">
                                                                <p className="text-slate-500 text-sm">Resume</p>
                                                                <div className="mt-2">
                                                                    {renderResumePreview(app.resume_url, app.id)}
                                                                </div>
                                                            </div>
                                                            <div className="rounded-3xl bg-white p-4">
                                                                <p className="text-slate-500 text-sm">Applied On</p>
                                                                <p className="mt-2 text-slate-700 text-sm">{new Date(app.created_at || app.createdAt || Date.now()).toLocaleDateString()}</p>
                                                            </div>
                                                        </div>
                                                    </article>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    <aside className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                        <div className="flex items-center gap-3 mb-5 text-slate-900">
                            <UserPlus size={20} />
                            <div>
                                <h2 className="text-xl font-bold">Schedule Interview</h2>
                                <p className="text-slate-500 text-sm">Assign an interviewer and confirm the date/time.</p>
                            </div>
                        </div>
                        <form onSubmit={scheduleInterview} className="space-y-4">
                            <label className="block">
                                <span className="text-slate-600 text-sm font-semibold">Application</span>
                                <select
                                    value={scheduleFields.application_id}
                                    onChange={(e) => setScheduleFields({ ...scheduleFields, application_id: e.target.value })}
                                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                                    required
                                >
                                    <option value="">Select application</option>
                                    {applications.filter((app) => app.status === 'shortlisted').map((app) => (
                                        <option key={app.id} value={app.id}>{app.job_title} — {app.candidate_name}</option>
                                    ))}
                                </select>
                            </label>
                            <label className="block">
                                <span className="text-slate-600 text-sm font-semibold">Interviewer</span>
                                <select
                                    value={scheduleFields.interviewer_id}
                                    onChange={(e) => setScheduleFields({ ...scheduleFields, interviewer_id: e.target.value })}
                                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                                    required
                                >
                                    <option value="">Select interviewer</option>
                                    {interviewers.map((interviewer) => (
                                        <option key={interviewer.id} value={interviewer.id}>{interviewer.name}</option>
                                    ))}
                                </select>
                            </label>
                            <label className="block">
                                <span className="text-slate-600 text-sm font-semibold">Date</span>
                                <input
                                    value={scheduleFields.interview_date}
                                    onChange={(e) => setScheduleFields({ ...scheduleFields, interview_date: e.target.value })}
                                    type="date"
                                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                                    required
                                />
                            </label>
                            <label className="block">
                                <span className="text-slate-600 text-sm font-semibold">Time</span>
                                <input
                                    value={scheduleFields.interview_time}
                                    onChange={(e) => setScheduleFields({ ...scheduleFields, interview_time: e.target.value })}
                                    type="time"
                                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                                    required
                                />
                            </label>
                            <button type="submit" className="inline-flex items-center justify-center gap-2 w-full rounded-2xl bg-indigo-600 px-5 py-3 text-white font-semibold hover:bg-indigo-700 transition">
                                <Clock size={18} /> Schedule Interview
                            </button>
                        </form>
                        <div className="mt-8 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600 border border-slate-200">
                            <p className="font-semibold text-slate-900 mb-2">Quick actions</p>
                            <p>Use shortlist first, then schedule interviews for shortlisted candidates.</p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
