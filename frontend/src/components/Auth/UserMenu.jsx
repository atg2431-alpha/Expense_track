import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Settings, ChevronDown } from 'lucide-react';
import ProfileModal from './ProfileModal';

export default function UserMenu() {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    const initials = user.name
        ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
        : '?';

    return (
        <>
            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-2 hover:bg-slate-800 rounded-xl px-2 py-1.5 transition-colors duration-150"
                >
                    {user.picture ? (
                        <img
                            src={user.picture}
                            alt={user.name}
                            className="w-8 h-8 rounded-full ring-2 ring-slate-700"
                            referrerPolicy="no-referrer"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-400">
                            {initials}
                        </div>
                    )}
                    <span className="hidden sm:block text-sm font-medium text-slate-300 max-w-[120px] truncate">
                        {user.name}
                    </span>
                    <ChevronDown size={14} className={`text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>

                {open && (
                    <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700/50 rounded-2xl shadow-xl shadow-black/30 overflow-hidden z-50 animate-fade-in">
                        {/* User info */}
                        <div className="px-4 py-3 border-b border-slate-700/50">
                            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>

                        {/* Menu items */}
                        <div className="py-1">
                            <button
                                onClick={() => {
                                    setOpen(false);
                                    setShowProfile(true);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/50 transition-colors"
                            >
                                <Settings size={16} className="text-slate-400" />
                                Edit Profile
                            </button>
                            <button
                                onClick={() => {
                                    setOpen(false);
                                    logout();
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                                <LogOut size={16} />
                                Sign Out
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
        </>
    );
}
