import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const API = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5001`;

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('tesla_token'));
    const [loading, setLoading] = useState(true);

    const authAxios = useCallback(() => {
        const instance = axios.create({ baseURL: API });
        const t = token || localStorage.getItem('tesla_token');
        if (t) instance.defaults.headers.common['Authorization'] = `Bearer ${t}`;
        return instance;
    }, [token]);

    // Load user profile on mount / token change
    useEffect(() => {
        const stored = localStorage.getItem('tesla_token');
        if (!stored) { setLoading(false); return; }

        axios.get(`${API}/api/auth/me`, {
            headers: { Authorization: `Bearer ${stored}` }
        })
            .then(res => {
                setUser(res.data.user);
                setToken(stored);
            })
            .catch(() => {
                localStorage.removeItem('tesla_token');
                setToken(null);
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    // Register — returns { requiresVerification, email } instead of logging in
    const register = async (email, password, displayName) => {
        const res = await axios.post(`${API}/api/auth/register`, { email, password, displayName });
        return res.data; // { requiresVerification: true, email, message }
    };

    // Verify email with 6-digit code — this completes registration and logs in
    const verifyEmail = async (email, code) => {
        const res = await axios.post(`${API}/api/auth/verify-email`, { email, code });
        localStorage.setItem('tesla_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data;
    };

    // Resend verification code
    const resendCode = async (email) => {
        const res = await axios.post(`${API}/api/auth/resend-code`, { email });
        return res.data;
    };

    const login = async (email, password) => {
        const res = await axios.post(`${API}/api/auth/login`, { email, password });
        // If requires verification, pass it back without setting token
        if (res.data.requiresVerification) {
            return res.data;
        }
        localStorage.setItem('tesla_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('tesla_token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, authAxios, verifyEmail, resendCode }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
