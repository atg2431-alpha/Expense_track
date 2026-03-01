import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, User, Save } from 'lucide-react';

export default function ProfileModal({ onClose }) {
    const { user, updateProfile } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) {
            setError('Name cannot be empty');
            return;
        }
        if (name.trim() === user.name) {
            onClose();
            return;
        }
        setError('');
        setSaving(true);
        try {
            await updateProfile(name.trim());
            setSuccess(true);
            setTimeout(onClose, 600);
        } catch (err) {
            setError(err?.response?.data?.error || 'Failed to update name');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div
                className="bg-slate-800 border border-slate-700/50 rounded-2xl w-full max-w-sm shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50">
                    <h2 className="text-lg font-bold text-white">Edit Profile</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4">
                    {/* Avatar + Email (read only) */}
                    <div className="flex items-center gap-3 bg-slate-900/50 rounded-xl p-3">
                        {user?.picture ? (
                            <img
                                src={user.picture}
                                alt=""
                                className="w-10 h-10 rounded-full ring-2 ring-slate-700"
                                referrerPolicy="no-referrer"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-sm font-bold text-indigo-400">
                                {user?.name?.[0]?.toUpperCase() || '?'}
                            </div>
                        )}
                        <div className="min-w-0">
                            <p className="text-sm text-white font-medium truncate">{user?.email}</p>
                            <p className="text-xs text-slate-500">Google Account</p>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2 text-emerald-400 text-sm">
                            Name updated successfully!
                        </div>
                    )}

                    <div>
                        <label className="label">
                            <User size={14} className="inline mr-1" />
                            Display Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                            className="input-field"
                            placeholder="Your display name"
                            maxLength={50}
                            autoFocus
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-700/50">
                    <button onClick={onClose} className="btn-secondary text-sm px-4 py-2">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn-primary text-sm px-4 py-2"
                    >
                        <Save size={14} />
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
}
