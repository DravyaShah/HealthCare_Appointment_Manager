import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Mail, Lock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ErrorBanner from '../components/ErrorBanner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userData = await login(email, password);
      if (userData.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/patient-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoDoctor = async () => {
    setEmail('doctor@healthai.com');
    setPassword('password123');
    setError(null);
    setLoading(true);
    try {
      const userData = await login('doctor@healthai.com', 'password123');
      navigate('/doctor-dashboard');
    } catch (err) {
      setError('Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoPatient = async () => {
    setEmail('patient@healthai.com');
    setPassword('password123');
    setError(null);
    setLoading(true);
    try {
      const userData = await login('patient@healthai.com', 'password123');
      navigate('/patient-dashboard');
    } catch (err) {
      setError('Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white shadow-lg shadow-cyan-500/20">
            <Activity className="h-6 w-6" />
          </div>
          <span className="text-2xl font-extrabold font-display text-white tracking-tight">
            Health<span className="text-cyan-400">AI</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold font-display text-slate-100">Portal Authentication</h2>
        <p className="mt-2 text-xs text-slate-400">Sign in to access your clinical workspace & diagnostic reports</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/60 backdrop-blur-xl py-8 px-6 shadow-2xl border border-slate-800 rounded-3xl sm:px-10"
        >
          <ErrorBanner message={error} onDismiss={() => setError(null)} />

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Email or Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@healthai.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800/80">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
              One-Click Demo Access
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleDemoDoctor}
                className="py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-cyan-400 text-xs font-bold transition-all text-center"
              >
                Doctor Demo
              </button>
              <button
                onClick={handleDemoPatient}
                className="py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-emerald-400 text-xs font-bold transition-all text-center"
              >
                Patient Demo
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-cyan-400 hover:text-cyan-300">
              Register here
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
