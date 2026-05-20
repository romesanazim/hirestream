import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Clock, LogOut, Users, Building, Shield, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
    const [recruiters, setRecruiters] = useState([]);
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();

    // 1. We keep the logic here for the 'Toggle' button to reuse
    const refreshData = async () => {
        try {
            const res = await api.get('/users/recruiters');
            setRecruiters(res.data);
        } catch (error) {
            console.error("Error refreshing data:", error);
        }
    };

    // 2. We use a self-contained async block to bypass 'set-state-in-effect'
    useEffect(() => {
        const initDashboard = async () => {
            try {
                const res = await api.get('/users/recruiters');
                setRecruiters(res.data);
            } catch (error) {
                console.error("Initial load failed:", error);
            }
        };

        initDashboard();
    }, []); 

    const handleToggleStatus = async (id) => {
        try {
            await api.put(`/users/recruiters/${id}/toggle-status`);
            await refreshData(); 
            alert("Recruiter status updated!");
        } catch (error) {
            console.error("Toggle failed:", error);
            alert("Toggle failed");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
            <nav className="bg-white shadow-lg p-4 flex justify-between items-center border-b border-slate-200 backdrop-blur-sm bg-white/80">
                <h1 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
                    <Shield size={24} /> Admin Control Panel
                </h1>
                <div className="flex items-center gap-4">
                    <span className="text-slate-600 font-medium">Welcome, {user?.name}</span>
                    <button 
                        onClick={logout} 
                        className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-all duration-200 font-semibold hover:scale-105"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </nav>

            <div className="p-8 max-w-5xl mx-auto">
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
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <div className="inline-flex items-center gap-3 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                                <Shield size={18} /> Admin Panel
                            </div>
                            <h2 className="text-4xl font-extrabold text-slate-900">Recruiter Management</h2>
                            <p className="text-slate-500 mt-2">View and manage all registered recruiters</p>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 flex items-center gap-2 hover:shadow-md transition-shadow">
                            <Users className="text-indigo-500" size={20} />
                            <span className="font-bold text-slate-700">{recruiters.length} Total</span>
                        </div>
                    </div>
                </motion.div>

                <div className="grid gap-4">
                    {recruiters.length === 0 ? (
                        <div className="bg-white p-16 rounded-2xl shadow-sm text-center border-2 border-dashed border-slate-300 hover:shadow-md transition-shadow">
                            <Users className="mx-auto text-slate-300 mb-4" size={48} />
                            <p className="text-slate-400 text-lg">No recruiters registered yet.</p>
                        </div>
                    ) : (
                        recruiters.map(recruiter => (
                            <div key={recruiter.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                                <div className="flex items-center gap-4">
                                    <div className="bg-indigo-100 p-3 rounded-full">
                                        <Building className="text-indigo-600" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">{recruiter.name}</h3>
                                        <p className="text-slate-500">{recruiter.email}</p>
                                        <p className="text-slate-500 text-sm">Company: {recruiter.company_name || 'N/A'}</p>
                                        <div className="mt-2 flex gap-2">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1 ${recruiter.status === 'active' ? 'bg-green-100 text-green-700' : recruiter.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                                {recruiter.status === 'active' ? <CheckCircle size={12} /> : recruiter.status === 'pending' ? <Clock size={12} /> : <XCircle size={12} />}
                                                {recruiter.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleToggleStatus(recruiter.id)}
                                    className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 shadow-lg ${recruiter.status === 'active' ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-200' : 'bg-green-600 text-white hover:bg-green-700 shadow-green-200'}`}
                                >
                                    {recruiter.status === 'active' ? 'Freeze Account' : 'Activate Account'}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

