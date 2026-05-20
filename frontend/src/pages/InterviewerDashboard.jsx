import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { CalendarDays, Clock, UserCheck, ClipboardList, Star, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InterviewerDashboard() {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [feedbackInputs, setFeedbackInputs] = useState({});
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loadSchedule = async () => {
            try {
                const res = await api.get('/interviews/my-interviews');
                setInterviews(res.data);
            } catch (err) {
                console.error('Unable to load your schedule', err);
                setError('Could not load your interviews.');
            } finally {
                setLoading(false);
            }
        };

        loadSchedule();
    }, []);

    const upcoming = interviews.filter((item) => new Date(item.interview_date) >= new Date()).length;
    const completed = interviews.filter((item) => new Date(item.interview_date) < new Date()).length;

    const handleFeedbackChange = (interviewId, field, value) => {
        setFeedbackInputs((prev) => ({
            ...prev,
            [interviewId]: {
                ...prev[interviewId],
                [field]: value,
            },
        }));
    };

    const submitFeedback = async (interviewId) => {
        setFeedbackMessage('');
        const payload = feedbackInputs[interviewId] || {};

        if (!payload.comments || !payload.rating) {
            setFeedbackMessage('Please enter comments and select a rating before submitting.');
            return;
        }

        try {
            await api.post('/feedback/submit', {
                interview_id: interviewId,
                comments: payload.comments,
                rating: payload.rating,
            });
            setFeedbackMessage('Feedback submitted successfully.');
            const res = await api.get('/interviews/my-interviews');
            setInterviews(res.data);
        } catch (err) {
            console.error('Feedback submit failed', err);
            setFeedbackMessage(err.response?.data?.error || 'Unable to submit feedback.');
        }
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

                <header className="mb-8 rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 p-8 shadow-xl text-white">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-indigo-200">Interviewer portal</p>
                            <h1 className="mt-3 text-4xl font-extrabold">My Interview Schedule</h1>
                            <p className="mt-2 max-w-2xl text-slate-100/90">View all upcoming interviews, feedback deadlines, and candidate details in one place.</p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full md:w-auto">
                            <div className="rounded-3xl bg-white/10 border border-white/10 p-5 text-center">
                                <p className="text-sm uppercase tracking-[0.2em] text-indigo-200">Interviews</p>
                                <p className="mt-3 text-3xl font-bold">{interviews.length}</p>
                            </div>
                            <div className="rounded-3xl bg-white/10 border border-white/10 p-5 text-center">
                                <p className="text-sm uppercase tracking-[0.2em] text-indigo-200">Upcoming</p>
                                <p className="mt-3 text-3xl font-bold">{upcoming}</p>
                            </div>
                            <div className="rounded-3xl bg-white/10 border border-white/10 p-5 text-center">
                                <p className="text-sm uppercase tracking-[0.2em] text-indigo-200">Completed</p>
                                <p className="mt-3 text-3xl font-bold">{completed}</p>
                            </div>
                        </div>
                    </div>
                </header>

                <section className="grid gap-6 lg:grid-cols-3 mb-8">
                    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                        <div className="inline-flex items-center gap-3 text-slate-900 font-semibold text-lg mb-4">
                            <CalendarDays size={20} /> Today
                        </div>
                        <p className="text-slate-500">Check your next interview and candidate details.</p>
                        <div className="mt-6 rounded-3xl bg-slate-50 p-5">
                            <p className="text-sm uppercase tracking-[.2em] text-slate-400">Next interview</p>
                            <p className="mt-3 text-xl font-semibold text-slate-900">{interviews[0]?.interview_date || 'No upcoming interviews'}</p>
                            <p className="mt-2 text-slate-600">{interviews[0]?.candidate_name || ''}</p>
                        </div>
                    </div>
                    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                        <div className="inline-flex items-center gap-3 text-slate-900 font-semibold text-lg mb-4">
                            <Clock size={20} /> Speed
                        </div>
                        <p className="text-slate-500">Keep feedback ready and update candidate statuses after each interview.</p>
                    </div>
                    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                        <div className="inline-flex items-center gap-3 text-slate-900 font-semibold text-lg mb-4">
                            <ClipboardList size={20} /> Notes
                        </div>
                        <p className="text-slate-500">Your schedule syncs automatically from recruiter assignments.</p>
                    </div>
                </section>

                <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Interview Calendar</h2>
                            <p className="text-slate-500 mt-1">Review the candidates and provide structured feedback on completion.</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center text-slate-500">Loading schedule…</div>
                    ) : error ? (
                        <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center text-red-700">{error}</div>
                    ) : (
                        <>
                            {feedbackMessage && (
                                <div className="mb-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
                                    {feedbackMessage}
                                </div>
                            )}
                            {interviews.length === 0 ? (
                                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center text-slate-500">No interviews scheduled yet.</div>
                            ) : (
                                <div className="space-y-4">
                                    {interviews.map((interview) => (
                                        <article key={interview.id} className="grid gap-4 sm:grid-cols-[1fr_auto] items-center rounded-3xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
                                            <div>
                                                <div className="flex items-center gap-3 text-slate-900 font-semibold text-lg mb-2">
                                                    <span>{interview.job_title}</span>
                                                    <span className="rounded-full bg-indigo-50 text-indigo-700 px-3 py-1 text-xs uppercase tracking-[0.2em]">{interview.application_status}</span>
                                                </div>
                                                <p className="text-slate-500">Candidate: {interview.candidate_name}</p>
                                                <p className="text-slate-500">Email: {interview.candidate_email}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-slate-400 text-sm uppercase tracking-[0.2em]">Interview</p>
                                                <p className="mt-2 text-xl font-semibold text-slate-900">{interview.interview_date}</p>
                                                <p className="mt-1 text-slate-500">{interview.interview_time}</p>
                                            </div>
                                            <div className="sm:col-span-2">
                                                {interview.feedback_id ? (
                                                    <div className="rounded-3xl bg-slate-50 border border-slate-200 p-4">
                                                        <p className="font-semibold text-slate-900">Feedback submitted</p>
                                                        <p className="mt-2 text-slate-600">Rating: {interview.feedback_rating}/5</p>
                                                        <p className="mt-2 text-slate-600">{interview.feedback_comments}</p>
                                                    </div>
                                                ) : (
                                                    <div className="rounded-3xl bg-slate-50 border border-slate-200 p-4">
                                                        <p className="font-semibold text-slate-900 mb-3">Submit Feedback</p>
                                                        <textarea
                                                            value={feedbackInputs[interview.id]?.comments || ''}
                                                            onChange={(e) => handleFeedbackChange(interview.id, 'comments', e.target.value)}
                                                            className="w-full rounded-2xl border border-slate-300 p-3 mb-3"
                                                            placeholder="Enter your feedback notes"
                                                            rows={3}
                                                        />
                                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                            <select
                                                                value={feedbackInputs[interview.id]?.rating || ''}
                                                                onChange={(e) => handleFeedbackChange(interview.id, 'rating', e.target.value)}
                                                                className="w-full sm:w-40 rounded-2xl border border-slate-300 p-3"
                                                            >
                                                                <option value="">Rating</option>
                                                                <option value="1">1 - Poor</option>
                                                                <option value="2">2 - Fair</option>
                                                                <option value="3">3 - Good</option>
                                                                <option value="4">4 - Very good</option>
                                                                <option value="5">5 - Excellent</option>
                                                            </select>
                                                            <button
                                                                onClick={() => submitFeedback(interview.id)}
                                                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-white font-semibold hover:bg-indigo-700 transition w-full sm:w-auto"
                                                            >
                                                                <Star size={18} /> Submit Feedback
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </section>
            </div>
        </div>
    );
}
