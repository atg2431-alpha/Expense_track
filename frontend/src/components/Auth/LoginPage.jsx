import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, User } from 'lucide-react';

export default function LoginPage() {
    const { loginWithGoogle } = useAuth();
    const [name, setName] = useState('');
    const [step, setStep] = useState('welcome'); // 'welcome' | 'name' | 'loading'
    const [error, setError] = useState('');
    const [credential, setCredential] = useState(null);

    const handleGoogleSuccess = (response) => {
        setCredential(response.credential);
        setStep('name');
        setError('');
    };

    const handleContinue = async () => {
        if (!name.trim()) {
            setError('Please enter your name');
            return;
        }
        setError('');
        setStep('loading');
        try {
            await loginWithGoogle(credential, name.trim());
        } catch (err) {
            setError(err?.response?.data?.error || 'Login failed. Please try again.');
            setStep('name');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            {/* Ambient Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Card */}
                <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl shadow-indigo-500/5">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                            <span className="text-3xl">💰</span>
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-white text-center mb-1">Welcome to ExpenseAI</h1>
                    <p className="text-slate-400 text-center text-sm mb-8">Smart expense tracking powered by AI</p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6 text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {step === 'welcome' && (
                        <div className="space-y-4">
                            <div className="flex justify-center">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => setError('Google login failed. Please try again.')}
                                    theme="filled_black"
                                    shape="pill"
                                    size="large"
                                    width="360"
                                    text="continue_with"
                                />
                            </div>

                            <div className="flex items-center gap-3 my-2">
                                <div className="h-px flex-1 bg-slate-700" />
                                <span className="text-xs text-slate-500">SECURE LOGIN</span>
                                <div className="h-px flex-1 bg-slate-700" />
                            </div>

                            <div className="flex items-center gap-2 justify-center text-xs text-slate-500">
                                <Sparkles size={14} className="text-indigo-400" />
                                <span>AI-powered expense tracking • Secure & Private</span>
                            </div>
                        </div>
                    )}

                    {step === 'name' && (
                        <div className="space-y-5 animate-fade-in">
                            <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
                                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                </div>
                                <span className="text-sm text-emerald-300">Google connected! Now set your display name.</span>
                            </div>

                            <div>
                                <label className="label">
                                    <User size={14} className="inline mr-1" />
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
                                    placeholder="Enter your name"
                                    className="input-field"
                                    autoFocus
                                    maxLength={50}
                                />
                                <p className="text-xs text-slate-500 mt-1.5">You can change this later in your profile settings.</p>
                            </div>

                            <button
                                onClick={handleContinue}
                                className="btn-primary w-full justify-center text-base py-3.5"
                            >
                                Get Started
                            </button>
                        </div>
                    )}

                    {step === 'loading' && (
                        <div className="flex flex-col items-center gap-4 py-8 animate-fade-in">
                            <div className="w-10 h-10 border-[3px] border-indigo-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-slate-400 text-sm">Setting up your account...</p>
                        </div>
                    )}
                </div>

                {/* Footer tagline */}
                <p className="text-center text-xs text-slate-600 mt-6">
                    Track expenses smarter with AI-powered insights
                </p>
            </div>
        </div>
    );
}
