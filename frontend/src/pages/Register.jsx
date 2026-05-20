import { useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { Briefcase, UserCheck } from 'lucide-react'; // Removed UserPlus

export default function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'candidate', company_name: '' });
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/register', formData);
            setMessage(res.data.message);
        } catch (err) {
            setMessage(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-900">Join HireStream</h2>
                    <p className="text-slate-500 mt-2">Create your account to get started</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Full Name" className="w-full p-3 border rounded-lg" 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                    
                    <input type="email" placeholder="Email Address" className="w-full p-3 border rounded-lg" 
                        onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                    
                    <input type="password" placeholder="Password" className="w-full p-3 border rounded-lg" 
                        onChange={(e) => setFormData({...formData, password: e.target.value})} required />

                    {formData.role === 'recruiter' && (
                        <input type="text" placeholder="Company Name" className="w-full p-3 border rounded-lg" 
                            onChange={(e) => setFormData({...formData, company_name: e.target.value})} required />
                    )}

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <button type="button" 
                            onClick={() => setFormData({...formData, role: 'candidate'})}
                            className={`p-3 rounded-lg border flex items-center justify-center gap-2 ${formData.role === 'candidate' ? 'bg-indigo-600 text-white' : 'bg-white'}`}>
                            <UserCheck size={18} /> Candidate
                        </button>
                        <button type="button" 
                            onClick={() => setFormData({...formData, role: 'recruiter'})}
                            className={`p-3 rounded-lg border flex items-center justify-center gap-2 ${formData.role === 'recruiter' ? 'bg-indigo-600 text-white' : 'bg-white'}`}>
                            <Briefcase size={18} /> Recruiter
                        </button>
                    </div>

                    <button className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition mt-6">
                        Register Account
                    </button>
                </form>

                {message && (
                    <div className={`mt-4 p-3 rounded-lg text-sm text-center ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {message}
                    </div>
                )}

                <p className="text-center mt-6 text-slate-600">
                    Already have an account? <Link to="/login" className="text-indigo-600 font-bold">Login</Link>
                </p>
            </div>
        </div>
    );
}