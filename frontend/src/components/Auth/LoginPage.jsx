export default function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-3xl mb-4">
            💰
          </div>
          <h1 className="text-3xl font-bold text-white">ExpenseAI</h1>
          <p className="text-slate-400 mt-2 text-sm text-center">
            Smart AI-powered expense tracking.<br />Sign in to get started.
          </p>
        </div>

        {/* Card */}
        <div className="card p-8 flex flex-col items-center gap-6">
          <div className="text-center">
            <h2 className="text-white font-semibold text-lg">Welcome back</h2>
            <p className="text-slate-400 text-sm mt-1">Sign in with your Google account</p>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 active:bg-gray-200 text-gray-800 font-semibold px-6 py-3 rounded-xl transition-all duration-150"
          >
            {/* Google "G" SVG logo */}
            <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="#EA4335" d="M24 9.5c3.1 0 5.8 1.1 8 2.9l5.9-5.9C34.5 3.3 29.6 1 24 1 14.8 1 7 6.7 3.7 14.6l6.9 5.4C12.2 13.6 17.6 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.9 7.2l7.6 5.9c4.4-4.1 7.1-10.1 7.1-17.1z"/>
              <path fill="#FBBC05" d="M10.6 28.6c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6l-6.9-5.4C1.8 17.3 1 20.6 1 24s.8 6.7 2.7 9.4l6.9-5.4 0 .6z"/>
              <path fill="#34A853" d="M24 47c5.6 0 10.4-1.9 13.9-5.1l-7.6-5.9c-2 1.3-4.5 2.1-6.3 2.1-6.4 0-11.8-4.1-13.4-9.5l-6.9 5.4C7 41.3 14.8 47 24 47z"/>
            </svg>
            Sign in with Google
          </button>

          <p className="text-slate-500 text-xs text-center">
            Your data is private and scoped to your account.
          </p>
        </div>
      </div>
    </div>
  );
}
