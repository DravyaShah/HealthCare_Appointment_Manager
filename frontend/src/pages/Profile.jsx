import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Save, ShieldCheck, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import ErrorBanner from '../components/ErrorBanner';
const Profile = () => {
  const { user, updateUser } = useAuth();

  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [saving, setSaving] = useState(false);
  const [calendarConnected, setCalendarConnected] = useState(null);

  useEffect(() => {
    const fetchCalendarStatus = async () => {
      try {
        const res = await api.get('/api/calendar/status/');
        setCalendarConnected(res.data.connected);
      } catch (err) {
        console.error("Failed to fetch calendar status", err);
      }
    };
    fetchCalendarStatus();
    
    // Check url for success param
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('calendar') === 'success') {
      setSuccess('Google Calendar connected successfully!');
      // Remove query param
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleConnectCalendar = async () => {
    try {
      const res = await api.get('/api/calendar/google/auth/');
      if (res.data.auth_url) {
        window.location.href = res.data.auth_url;
      }
    } catch (err) {
      setError('Failed to initiate Google Calendar connection.');
    }
  };

  const handleDisconnectCalendar = async () => {
    try {
      await api.post('/api/calendar/disconnect/');
      setCalendarConnected(false);
      setSuccess('Google Calendar disconnected successfully.');
    } catch (err) {
      setError('Failed to disconnect Google Calendar.');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const res = await api.patch(`/accounts/update/${user.id}/`, {
        first_name: firstName,
        last_name: lastName,
        phone,
      });
      updateUser(res.data);
      setSuccess('Account profile updated successfully.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await api.post(`/accounts/change_password/${user.id}/`, {
        old_password: oldPassword,
        new_password: newPassword,
      });
      setSuccess('Password updated successfully.');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update password.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-extrabold font-display text-white tracking-tight">
          Account Settings & Security
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage clinical identity details, communication phone numbers, and authentication credentials
        </p>
      </motion.div>

      <ErrorBanner message={error} onDismiss={() => setError(null)} />

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" /> {success}
        </div>
      )}

      {/* Profile Form */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6"
      >
        <h3 className="text-base font-bold text-white font-display">Personal Details</h3>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full py-2.5 px-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full py-2.5 px-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full py-2.5 px-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-90 disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> Save Profile Changes
          </button>
        </form>
      </motion.div>

      {/* Password Change Form */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6"
      >
        <h3 className="text-base font-bold text-white font-display">Security Credentials</h3>
        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Current Password</label>
            <input
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full py-2.5 px-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full py-2.5 px-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs"
          >
            <Lock className="h-4 w-4" /> Update Security Password
          </button>
        </form>
      </motion.div>

      {/* Google Calendar Integration */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-400" />
              Google Calendar Integration
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Sync your appointments automatically with your Google Calendar.
            </p>
          </div>
          
          {calendarConnected !== null && (
            <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${calendarConnected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
              {calendarConnected ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
              {calendarConnected ? 'Connected' : 'Not Connected'}
            </div>
          )}
        </div>

        <div className="pt-2">
          {calendarConnected ? (
            <button
              onClick={handleDisconnectCalendar}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 font-bold text-xs transition-colors"
            >
              Disconnect Google Calendar
            </button>
          ) : (
            <button
              onClick={handleConnectCalendar}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all"
            >
              Connect Google Calendar
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
