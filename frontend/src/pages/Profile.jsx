import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Save, ShieldCheck } from 'lucide-react';
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
    </div>
  );
};

export default Profile;
