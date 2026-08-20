import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, LogOut, User as UserIcon, Settings, ChevronDown, Search, HeartPulse, ShieldAlert, FileText, Pill, Calendar, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowDropdown(false);
    logout();
    navigate('/');
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (q.includes('report')) navigate('/reports');
      else if (q.includes('appoint')) navigate('/appointments');
      else if (q.includes('presc')) navigate('/prescriptions');
      else if (q.includes('ai') || q.includes('insight')) navigate('/ai-insights');
      else navigate('/patient-dashboard'); // fallback
      setSearchQuery('');
    }
  };

  const avatarLetter = user?.username ? user.username.charAt(0).toUpperCase() : 'U';
  const displayName = user?.username || 'User';
  const displayRole = user?.role || 'User';

  const mockNotifications = [
    { id: 1, title: 'AI Insight Ready', desc: 'Your recent medical report analysis is complete.', time: '10 min ago', icon: HeartPulse, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
    { id: 2, title: 'Appointment Reminder', desc: 'Consultation with Dr. Sarah Jenkins scheduled.', time: '2 hrs ago', icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { id: 3, title: 'New Prescription', desc: 'Active prescription available for clinical review.', time: '1 day ago', icon: Pill, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  ];

  return (
    <header className="h-16 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 flex items-center justify-between px-4 lg:px-8 z-40 sticky top-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 text-slate-400 hover:text-white lg:hidden focus:outline-none focus:ring-2 focus:ring-cyan-500/50 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Global Search (Desktop) */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex relative ml-2 max-w-md w-64 lg:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search patients, reports, AI insights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-800/80 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
          />
        </form>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-colors focus:outline-none border border-transparent hover:border-slate-800"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-cyan-400 ring-2 ring-slate-950 animate-pulse" />
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2.5 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-semibold text-sm text-slate-200 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Notifications
                </h3>
                <span className="text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-2 py-0.5 rounded-full">3 New</span>
              </div>
              <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-800/60">
                {mockNotifications.map(notif => (
                  <div key={notif.id} className="px-4 py-3 hover:bg-slate-800/40 cursor-pointer flex gap-3 transition-colors">
                    <div className={`mt-0.5 flex-shrink-0 h-8 w-8 rounded-xl ${notif.bg} border ${notif.color} flex items-center justify-center`}>
                      <notif.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">{notif.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">{notif.desc}</p>
                      <p className="text-[10px] text-slate-500 mt-1 font-medium">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-slate-800 text-center">
                <button className="text-xs font-medium text-cyan-400 hover:text-cyan-300">Mark all read</button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors focus:outline-none"
          >
            <div className="hidden md:block text-right">
              <p className="text-xs font-semibold text-slate-200 leading-tight">
                {displayName}
              </p>
              <p className="text-[10px] text-cyan-400 uppercase tracking-wider font-semibold mt-0.5">{displayRole}</p>
            </div>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 via-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-cyan-500/20">
              {avatarLetter}
            </div>
            <ChevronDown className={`h-4 w-4 text-slate-400 hidden md:block transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-800 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-3 border-b border-slate-800">
                <p className="text-sm font-semibold text-slate-200">{displayName}</p>
                <p className="text-xs text-slate-400 truncate mt-0.5">{user?.email || ''}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] uppercase font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {displayRole} Account
                </span>
              </div>

              <div className="py-1">
                <button
                  onClick={() => setShowDropdown(false)}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-3 transition-colors"
                >
                  <UserIcon className="h-4 w-4 text-slate-400" />
                  Account Settings
                </button>
                <button
                  onClick={() => setShowDropdown(false)}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-3 transition-colors"
                >
                  <Settings className="h-4 w-4 text-slate-400" />
                  Security & Access
                </button>
              </div>

              <div className="border-t border-slate-800 py-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center gap-3 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
