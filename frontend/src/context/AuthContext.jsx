/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    // Initialize user immediately from localStorage
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // We can initialize loading to false if we're doing synchronous checks, 
    // or keep it for future async token validation. For now, let's simplify:
    const [loading] = useState(false); 

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
        if (userData.role === 'admin') navigate('/admin-dashboard');
        else if (userData.role === 'recruiter') navigate('/recruiter-dashboard');
        else if (userData.role === 'interviewer') navigate('/interviewer-dashboard');
        else navigate('/dashboard');
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};