import React from 'react';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [mode, setMode] = React.useState<'login' | 'register' | 'forgot-password'>('login');
  const [step, setStep] = React.useState<'details' | 'otp'>('details');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = mode === 'forgot-password' ? '/api/auth/forgot-password' : '/api/auth/send-otp';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (res.ok) {
        setStep('otp');
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let endpoint = '';
    let body = {};

    if (mode === 'login') {
      endpoint = '/api/auth/login';
      body = { email: email.trim(), password };
    } else if (mode === 'register') {
      endpoint = '/api/auth/register';
      body = { email: email.trim(), password, name, username, otp: otp.trim() };
    } else if (mode === 'forgot-password') {
      endpoint = '/api/auth/reset-password';
      body = { email: email.trim(), otp: otp.trim(), newPassword };
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (res.ok) {
        if (mode === 'register') {
          setMode('login');
          setStep('details');
          setError('');
          setEmail('');
          setPassword('');
          setOtp('');
          alert('Account created successfully! Please log in.');
          return;
        }

        if (mode === 'forgot-password') {
          setMode('login');
          setStep('details');
          setError('');
          setEmail('');
          setNewPassword('');
          setOtp('');
          alert('Password reset successfully! Please log in with your new password.');
          return;
        }

        localStorage.setItem('ya_token', data.token || `user-token-${data.user.id}`);
        localStorage.setItem('ya_user', JSON.stringify(data.user));
        
        navigate('/inbox');
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-dark flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand/5 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand/10 rounded-2xl text-brand mb-6">
            {mode === 'login' ? <LogIn size={32} /> : mode === 'register' ? <UserPlus size={32} /> : <Lock size={32} />}
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {mode === 'login' ? 'Welcome Back' : mode === 'register' ? (step === 'details' ? 'Join the Partnership' : 'Verify Email') : (step === 'details' ? 'Reset Password' : 'Enter Reset Code')}
          </h1>
          <p className="text-gray-400">
            {mode === 'login' 
              ? 'Enter your credentials to access your dashboard' 
              : mode === 'register'
                ? (step === 'details' 
                  ? 'Create your partner account to start building'
                  : `We've sent a code to ${email}`)
                : (step === 'details'
                  ? 'Enter your email to receive a password reset code'
                  : `We've sent a reset code to ${email}`)}
          </p>
        </div>

        <form onSubmit={(mode === 'register' || mode === 'forgot-password') && step === 'details' ? handleSendOTP : handleSubmit} className="glass-card p-8 rounded-[32px] border border-white/5 space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {mode === 'register' && step === 'details' && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-dark border border-white/10 rounded-xl pl-12 pr-4 py-3.5 focus:border-brand outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Username / Subdomain</label>
                <div className="relative">
                  <ArrowRight className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    required
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                    className="w-full bg-dark border border-white/10 rounded-xl pl-12 pr-4 py-3.5 focus:border-brand outline-none transition-all"
                    placeholder="my-wedding-site"
                  />
                </div>
                <p className="text-[10px] text-gray-500 italic ml-1">Your site will be at: {username || '...'}.platform.com</p>
              </div>
            </>
          )}

          {(mode === 'register' || mode === 'forgot-password') && step === 'otp' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Verification Code (OTP)</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    required
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-dark border border-white/10 rounded-xl pl-12 pr-4 py-3.5 focus:border-brand outline-none transition-all text-center tracking-[1em] font-mono text-xl"
                    placeholder="000000"
                  />
                </div>
              </div>

              {mode === 'forgot-password' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      required
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-dark border border-white/10 rounded-xl pl-12 pr-4 py-3.5 focus:border-brand outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <p className="text-center">
                  <button 
                    type="button"
                    disabled={loading}
                    onClick={handleSendOTP}
                    className="text-xs text-brand hover:underline disabled:opacity-50"
                  >
                    Resend Code
                  </button>
                </p>
                <p className="text-center">
                  <button 
                    type="button"
                    disabled={loading}
                    onClick={() => setStep('details')}
                    className="text-xs text-gray-500 hover:text-white transition-colors disabled:opacity-50"
                  >
                    Change Email / Details
                  </button>
                </p>
              </div>
            </div>
          )}

          {step === 'details' && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-dark border border-white/10 rounded-xl pl-12 pr-4 py-3.5 focus:border-brand outline-none transition-all"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              {mode === 'login' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Password</label>
                    <button 
                      type="button"
                      onClick={() => {
                        setMode('forgot-password');
                        setStep('details');
                        setError('');
                      }}
                      className="text-[10px] text-brand hover:underline font-bold uppercase tracking-wider"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      required
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-dark border border-white/10 rounded-xl pl-12 pr-4 py-3.5 focus:border-brand outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              )}

              {mode === 'register' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      required
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-dark border border-white/10 rounded-xl pl-12 pr-4 py-3.5 focus:border-brand outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          <button
            disabled={loading}
            className="w-full bg-brand text-dark py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-brand/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-dark border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {mode === 'login' ? 'Sign In' : mode === 'register' ? (step === 'details' ? 'Get Verification Code' : 'Verify & Register') : (step === 'details' ? 'Send Reset Code' : 'Reset Password')}
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setStep('details');
                setError('');
              }}
              className="text-sm text-gray-400 hover:text-brand transition-colors"
            >
              {mode === 'login' 
                ? "Don't have an account? Register here" 
                : mode === 'register' 
                  ? "Already have an account? Sign in"
                  : "Back to Sign In"}
            </button>
          </div>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 text-gray-500 text-xs">
          <ShieldCheck size={14} />
          <span>Secure multi-tenant platform architecture</span>
        </div>
      </motion.div>
    </div>
  );
};
