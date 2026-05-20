import { useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/auth/login', formData);
            login(res.data.user, res.data.token);
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Check your credentials.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
                    <p className="text-slate-500 mt-2">Log in to manage your HireStream account</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input type="email" placeholder="you@example.com" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                            onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input type="password" placeholder="••••••••" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                            onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                    </div>

                    <button className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 mt-6">
                        <LogIn size={20} /> Sign In
                    </button>
                </form>

                <p className="text-center mt-6 text-slate-600">
                    Don't have an account? <Link to="/register" className="text-indigo-600 font-bold hover:underline">Register here</Link>
                </p>
            </div>
        </div>
    );
}