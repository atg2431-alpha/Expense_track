import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // On mount, verify saved token
    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }
        api
            .getMe()
            .then((u) => setUser(u))
            .catch(() => {
                localStorage.removeItem('token');
                setToken(null);
            })
            .finally(() => setLoading(false));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const loginWithGoogle = useCallback(async (idToken, name) => {
        const { token: jwt, user: profile } = await api.googleLogin(idToken, name);
        localStorage.setItem('token', jwt);
        setToken(jwt);
        setUser(profile);
        return profile;
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    }, []);

    const updateProfile = useCallback(async (name) => {
        const updated = await api.updateMe(name);
        setUser(updated);
        return updated;
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, loading, loginWithGoogle, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
