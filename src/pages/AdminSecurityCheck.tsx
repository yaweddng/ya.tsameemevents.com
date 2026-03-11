import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, MapPin, Lock, Send, AlertCircle, CheckCircle2, User, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminSecurityCheck = () => {
  const [config, setConfig] = useState<any>(null);
  const [step, setStep] = useState<'qa' | 'login'>('qa');
  const [answers, setAnswers] = useState<string[]>([]);
  const [geo, setGeo] = useState<string>('');
  const [isFetchingGeo, setIsFetchingGeo] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/admin/security/config')
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setAnswers(new Array(data.questions.length).fill(''));
      })
      .catch(err => setError('Failed to load security configuration.'));
  }, []);

  const handleFetchGeo = () => {
    setIsFetchingGeo(true);
    setError('');
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported. Please enter location manually.');
      setIsFetchingGeo(false);
      setGeo('Manual Entry');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const data = await response.json();
          const locationString = `${data.city || data.locality || 'Unknown'}, ${data.countryName || 'Unknown'}`;
          setGeo(locationString);
        } catch (err) {
          setError('Failed to resolve location name. You can enter it manually if needed.');
          setGeo('Manual Entry');
        } finally {
          setIsFetchingGeo(false);
        }
      },
      (err) => {
        setError('Location access denied. Please enter location manually.');
        setIsFetchingGeo(false);
        setGeo('Manual Entry');
      },
      { timeout: 10000 }
    );
  };

  const handleVerifyQA = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/security/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, geo })
      });

      const data = await response.json();

      if (response.ok) {
        setStep('login');
      } else {
        setError(data.error || 'Verification failed.');
      }
    } catch (err) {
      setError('An error occurred during verification.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/security/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('ya-token', data.token);
        localStorage.setItem('ya-user', JSON.stringify(data.user));
        navigate('/admin');
      } else {
        setError(data.error || 'Invalid credentials.');
      }
    } catch (err) {
      setError('An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  if (!config) return <div className="min-h-screen bg-dark flex items-center justify-center text-white">Loading Security Protocol...</div>;

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand/5 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card p-8 rounded-[2.5rem] border-brand/20 border-2 shadow-2xl shadow-brand/10">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-brand/10 rounded-2xl flex items-center justify-center border border-brand/30 relative">
              <Shield className="text-brand" size={40} />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand rounded-full animate-ping" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Portal</h1>
            <p className="text-gray-400 text-sm">Level 3 Security Verification Required</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm"
            >
              <AlertCircle size={18} />
              <span>{error}</span>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {step === 'qa' ? (
              <motion.form 
                key="qa"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleVerifyQA}
                className="space-y-6"
              >
                <div className="space-y-4">
                  {config.questions.map((q: string, idx: number) => (
                    <div key={idx} className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500">{q}</label>
                      <input 
                        required
                        type="text"
                        value={answers[idx]}
                        onChange={(e) => {
                          const newAnswers = [...answers];
                          newAnswers[idx] = e.target.value;
                          setAnswers(newAnswers);
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand transition-colors text-white"
                        placeholder="Enter answer..."
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Geo-Location Verification</label>
                    <button 
                      type="button"
                      onClick={() => setGeo('Manual Entry')}
                      className="text-[10px] text-gray-500 hover:text-brand underline"
                    >
                      Manual Entry
                    </button>
                  </div>
                  {geo === 'Manual Entry' ? (
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-brand" size={18} />
                      <input 
                        required
                        type="text"
                        onChange={(e) => setGeo(e.target.value)}
                        className="w-full bg-white/5 border border-brand/50 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-brand transition-colors text-white"
                        placeholder="Enter your city/country..."
                      />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleFetchGeo}
                      disabled={isFetchingGeo}
                      className={`w-full flex items-center justify-center gap-3 p-4 rounded-xl border transition-all ${
                        geo ? 'border-brand/50 bg-brand/5 text-brand' : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {isFetchingGeo ? (
                        <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                      ) : geo ? (
                        <>
                          <CheckCircle2 size={20} />
                          <span className="text-sm font-medium">{geo}</span>
                        </>
                      ) : (
                        <>
                          <MapPin size={20} />
                          <span className="text-sm font-medium">Verify Location</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                <button
                  disabled={loading || !geo}
                  type="submit"
                  className="w-full bg-brand text-dark py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-brand/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : (
                    <>
                      Verify Identity <Send size={18} />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form 
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleLogin}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Username / Email</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input 
                        required
                        type="text"
                        value={loginData.username}
                        onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-brand transition-colors text-white"
                        placeholder="admin@ya.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Password</label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input 
                        required
                        type="password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-brand transition-colors text-white"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-brand text-dark py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-brand/20 transition-all"
                >
                  {loading ? 'Authenticating...' : (
                    <>
                      Access Dashboard <Lock size={18} />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center mt-8 text-gray-500 text-xs uppercase tracking-[0.2em]">
          Secure Access System v4.2.0
        </p>
      </motion.div>
    </div>
  );
};
